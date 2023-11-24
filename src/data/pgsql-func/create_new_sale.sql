DECLARE
    cust_id INT;
    fin_id INT;
    trade_id INT;
-- Start a transaction
BEGIN
    -- Insert into customers table, save ID
    INSERT INTO "Customers" ("Name", "City") VALUES(sale->>'CustomerName', sale->>'CustomerCity')
    RETURNING id into cust_id;

    -- Insert into trade, if was a trade in.
    IF sale->>'TradeIn' IS NOT NULL THEN
      INSERT INTO "TradeIns" ("Trade", "ActualCashValue") VALUES (sale->>'TradeIn', (sale->>'TradeInValue')::numeric)
      RETURNING id into trade_id;
    END IF;

    -- Check if "FinancingMethod" exists in the sale data
    IF sale->>'FinancingMethod' IS NOT NULL THEN
        -- Try to insert into "Financing" table
        INSERT INTO "Financing" ("Method") VALUES (sale->>'FinancingMethod')
        ON CONFLICT("Method") DO UPDATE
        SET "Method" = EXCLUDED."Method"
        RETURNING id INTO fin_id;
    END IF;

    -- Insert into the first table
    INSERT INTO "Sales" (
      "StockNumber",
      "VehicleMake",
      "ActualCashValue",
      "GrossProfit",
      "FinAndInsurance",
      "NewSale",
      "Holdback",
      "LotPack",
      "DaysInStock",
      "DealerCost",
      "ROI",
      "Total",
      "SaleTime",
      "EmployeeID",
      "CustomerID",
      "FinancingID",
      "TradeInID"
    )
    VALUES (
      sale->>'StockNumber',
      sale->>'VehicleMake',
      (sale->>'ActualCashValue')::numeric,
      (sale->>'GrossProfit')::numeric,
      (sale->>'FinAndInsurance')::numeric,
      NOT (sale->>'UsedSale')::boolean,
      (sale->>'Holdback')::numeric,
      (sale->>'LotPack')::numeric,
      (sale->>'DaysInStock')::numeric,
      (sale->>'DealerCost')::numeric,
      (sale->>'ROI')::numeric,
      (sale->>'Total')::numeric,
      TO_DATE(sale->>'SaleTime', 'YYYY-MM'),
      (sale->>'EmployeeID')::uuid,
      cust_id,
      fin_id,
      trade_id
      );

-- Create monthly sale if it does not exist yet.
    INSERT INTO "MonthlySales" ("TimePeriod", "GrossProfit", "FinAndInsurance", "Holdback", "Total")
    VALUES (
        TO_DATE(sale->>'SaleTime', 'YYYY-MM'),
        (sale->>'GrossProfit')::numeric,
        (sale->>'FinAndInsurance')::numeric,
        (sale->>'Holdback')::numeric,
        (sale->>'Total')::numeric
    )
    ON CONFLICT ("TimePeriod") DO UPDATE
    SET
        "GrossProfit" = "MonthlySales"."GrossProfit" + EXCLUDED."GrossProfit",
        "FinAndInsurance" = "MonthlySales"."FinAndInsurance" + EXCLUDED."FinAndInsurance",
        "Holdback" = "MonthlySales"."Holdback" + EXCLUDED."Holdback",
        "Total" = "MonthlySales"."Total" + EXCLUDED."Total";
END;