-- Need to remove Customer when a sale is deleted. Need to delete trade in when a sale is deleted.

CREATE OR REPLACE FUNCTION handle_sale_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- Update "MonthlySales" by subtracting the deleted values
    UPDATE "MonthlySales"
    SET
        "GrossProfit" = "MonthlySales"."GrossProfit" - COALESCE(OLD."GrossProfit", 0),
        "FinAndInsurance" = "MonthlySales"."FinAndInsurance" - COALESCE(OLD."FinAndInsurance", 0),
        "Holdback" = "MonthlySales"."Holdback" - COALESCE(OLD."Holdback", 0),
        "Total" = "MonthlySales"."Total" - COALESCE(OLD."Total", 0)
    WHERE
        "TimePeriod" = TO_DATE(OLD."SaleTime", 'YYYY-MM');

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to invoke the function after deletion
CREATE TRIGGER handle_sale_deletion_trigger
AFTER DELETE ON "Sales"
FOR EACH ROW
EXECUTE FUNCTION handle_sale_deletion();
