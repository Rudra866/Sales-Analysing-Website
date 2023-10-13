-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing

create table
  Financing (
    FinancingID int primary key,
    method varchar(255) not null
  );

create table
  TradeIns (
    TradeInID int primary key,
    Trade varchar(255) not null,
    ActualCashValue decimal(10, 2) not null
  );

create table
  Sales (
    SaleID SERIAL primary key,
    StockNumber varchar(255) not null,
    VehicleMake varchar(255) not null,
    ActualCashValue decimal(10, 2) not null,
    TradeInAllowance decimal(10, 2) not null,
    GrossProfit decimal(10, 2) not null,
    Total decimal(10, 2) not null,
    EmployeeID int not null,
    CustomerID int not null,
    FinancingID int,
    TradeInID int,
    constraint Sales_Financing_fk foreign key (FinancingID) references Financing (FinancingID),
    constraint Sales_TradeIns_fk foreign key (TradeInID) references TradeIns (TradeInID)
  );

create table
  Employees (
    EmployeeID int primary key,
    name varchar(255) not null,
    role varchar(255) not null
  );

create table
  Customers (
    CustomerID int primary key,
    name varchar(255) not null,
    City varchar(255) not null
  );