DECLARE
  cust_id INT;
  fin_id INT;
  trade_id INT;
  prev_gross_profit numeric;
  prev_fin_and_insurance numeric;
  prev_holdback numeric;
  prev_total numeric;
BEGIN
  -- Insert into customers table if not exists, save ID
  -- LEAKING OLD VALUES ** FIX
  INSERT INTO "Customers" ("Name", "City")
  VALUES (sale->>'CustomerName', sale->>'CustomerCity')
  RETURNING id INTO cust_id;

  -- Insert into trade if it was a trade-in
  IF sale->>'TradeIn' IS NOT NULL THEN
      INSERT INTO "TradeIns" ("Trade", "ActualCashValue")
      VALUES (sale->>'TradeIn', (sale->>'TradeInValue')::numeric)
      RETURNING id INTO trade_id;
  END IF;

  -- Check if "FinancingMethod" exists in the sale data
  IF sale->>'FinancingMethod' IS NOT NULL THEN
      -- Try to insert into "Financing" table if not exists
      INSERT INTO "Financing" ("Method")
      VALUES (sale->>'FinancingMethod')
      ON CONFLICT("Method") DO NOTHING
      RETURNING id INTO fin_id;
  END IF;

  -- Fetch the previous values
  SELECT
    "GrossProfit",
    "FinAndInsurance",
    "Holdback",
    "Total"
  INTO
    prev_gross_profit,
    prev_fin_and_insurance,
    prev_holdback,
    prev_total
  FROM
    "Sales"
  WHERE
    id = (sale->>'id')::numeric;

  -- Update the existing row in the "Sales" table
  UPDATE "Sales"
  SET
    "StockNumber" = sale->>'StockNumber',
    "VehicleMake" = sale->>'VehicleMake',
    "ActualCashValue" = (sale->>'ActualCashValue')::numeric,
    "GrossProfit" = (sale->>'GrossProfit')::numeric,
    "FinAndInsurance" = (sale->>'FinAndInsurance')::numeric,
    "NewSale" = NOT (sale->>'UsedSale')::boolean,
    "Holdback" = (sale->>'Holdback')::numeric,
    "LotPack" = (sale->>'LotPack')::numeric,
    "DaysInStock" = (sale->>'DaysInStock')::numeric,
    "DealerCost" = (sale->>'DealerCost')::numeric,
    "ROI" = (sale->>'ROI')::numeric,
    "Total" = (sale->>'Total')::numeric,
    "EmployeeID" = (sale->>'EmployeeID')::uuid,
    "CustomerID" = cust_id,
    "FinancingID" = fin_id,
    "TradeInID" = trade_id
  WHERE
    id = (sale->>'id')::numeric;

  -- Update or insert into "MonthlySales"
  INSERT INTO "MonthlySales" ("TimePeriod", "GrossProfit", "FinAndInsurance", "Holdback", "Total")
  VALUES (
    TO_DATE(sale->>'SaleTime', 'YYYY-MM'),
    COALESCE(prev_gross_profit, 0) + COALESCE((sale->>'GrossProfit')::numeric - prev_gross_profit, 0),
    COALESCE(prev_fin_and_insurance, 0) + COALESCE((sale->>'FinAndInsurance')::numeric - prev_fin_and_insurance, 0),
    COALESCE(prev_holdback, 0) + COALESCE((sale->>'Holdback')::numeric - prev_holdback, 0),
    COALESCE(prev_total, 0) + COALESCE((sale->>'Total')::numeric - prev_total, 0)
  )
  ON CONFLICT ("TimePeriod") DO UPDATE
  SET
    "GrossProfit" = "MonthlySales"."GrossProfit" + EXCLUDED."GrossProfit" - prev_gross_profit,
    "FinAndInsurance" = "MonthlySales"."FinAndInsurance" + EXCLUDED."FinAndInsurance" - prev_fin_and_insurance,
    "Holdback" = "MonthlySales"."Holdback" + EXCLUDED."Holdback" - prev_holdback,
    "Total" = "MonthlySales"."Total" + EXCLUDED."Total" - prev_total;
END;