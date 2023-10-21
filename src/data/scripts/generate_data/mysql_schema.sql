-- SQL dump generated using DBML (dbml-lang.org)
-- Database: MySQL
-- Generated at: 2023-10-21T06:25:35.313Z

CREATE TABLE `Sales` (
  `id` integer PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `StockNumber` varchar(255) NOT NULL,
  `VehicleMake` varchar(255) NOT NULL,
  `ActualCashValue` decimal(10,2) NOT NULL,
  `GrossProfit` decimal(10,2) NOT NULL,
  `FinAndInsurance` decimal(10,2) NOT NULL,
  `SaleTime` timestamp DEFAULT (now()),
  `NewSale` boolean COMMENT 'set based on New/Used sale',
  `Holdback` decimal(10,2) COMMENT 'new sale only',
  `LotPack` decimal(10,2) COMMENT 'used sale only',
  `DaysInStock` int COMMENT 'used sale only',
  `DealerCost` decimal(10,2) COMMENT 'used sale only',
  `ROI` decimal(3,2) COMMENT 'used sale, percentage as decimal.',
  `EmployeeID` int NOT NULL,
  `CustomerID` int NOT NULL,
  `FinancingID` int,
  `TradeInID` int
);

CREATE TABLE `MonthlySales` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `TimePeriod` timestamp NOT NULL COMMENT 'Timestamp in the form of YYYY-MM-01 00:00:00',
  `GrossProfit` decimal(10,2) NOT NULL,
  `FinAndInsurance` decimal(10,2) NOT NULL,
  `Holdback` decimal(10,2) NOT NULL,
  `Total` decimal(10,2) NOT NULL
);

CREATE TABLE `Roles` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(255),
  `ReadPermission` boolean NOT NULL DEFAULT false COMMENT 'Allow user to read created sales',
  `WritePermission` boolean NOT NULL DEFAULT false COMMENT 'Allow user to create new sales',
  `ModifySelfPermission` boolean NOT NULL DEFAULT false COMMENT 'Allow user to modify previously entered sales that were created by that user.',
  `ModifyAllPermission` boolean NOT NULL DEFAULT false COMMENT 'Allow user to modify previously entered sales that were created by anyone.',
  `EmployeePermission` boolean NOT NULL DEFAULT false COMMENT 'Allow user to manage employees (create, remove, etc..)',
  `DatabasePermission` boolean NOT NULL DEFAULT false COMMENT 'Allow user to modify database directly (drop tables etc...). Highest privilege.'
);

CREATE TABLE `Employees` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `EmployeeNumber` varchar(255) NOT NULL,
  `Email` TEXT NOT NULL COMMENT 'max len(320)',
  `Password` TEXT NOT NULL COMMENT 'salted hash of a password',
  `Role` int NOT NULL,
  `CreatedOn` timestamp NOT NULL DEFAULT (now()) COMMENT 'Extra optional metadata for `admin` type roles to access',
  `LastAccessed` timestamp NOT NULL DEFAULT (now()) COMMENT 'Extra optional metadata for `admin` type roles to access'
);

CREATE TABLE `Customers` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `City` varchar(255) NOT NULL
);

CREATE TABLE `Financing` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Method` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `TradeIns` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Trade` varchar(255) NOT NULL COMMENT 'Name of a car that was traded-in',
  `ActualCashValue` decimal(10,2) NOT NULL
);

CREATE TABLE `Tasks` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Description` TEXT,
  `PercentageComplete` decimal(3,2),
  `StartDate` timestamp NOT NULL DEFAULT (now()),
  `EndDate` timestamp NOT NULL DEFAULT (now()),
  `Assignee` int,
  `Creator` int
);

CREATE TABLE `SalesGoals` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Description` TEXT,
  `Creator` int NOT NULL,
  `StartDate` timestamp NOT NULL DEFAULT (now()),
  `EndDate` timestamp NOT NULL DEFAULT (now()),
  `TotalGoal` decimal(10,2) NOT NULL
);

CREATE TABLE `Notifications` (
  `id` bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `Employee` int NOT NULL,
  `Sale` int NOT NULL
);

ALTER TABLE `Sales` ADD FOREIGN KEY (`EmployeeID`) REFERENCES `Employees` (`id`);

ALTER TABLE `Sales` ADD FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`id`);

ALTER TABLE `Sales` ADD FOREIGN KEY (`FinancingID`) REFERENCES `Financing` (`id`);

ALTER TABLE `Sales` ADD FOREIGN KEY (`TradeInID`) REFERENCES `TradeIns` (`id`);

ALTER TABLE `Employees` ADD FOREIGN KEY (`Role`) REFERENCES `Roles` (`id`);

ALTER TABLE `Tasks` ADD FOREIGN KEY (`Assignee`) REFERENCES `Employees` (`id`);

ALTER TABLE `Tasks` ADD FOREIGN KEY (`Creator`) REFERENCES `Employees` (`id`);

ALTER TABLE `SalesGoals` ADD FOREIGN KEY (`Creator`) REFERENCES `Employees` (`id`);

ALTER TABLE `Notifications` ADD FOREIGN KEY (`Employee`) REFERENCES `Employees` (`id`);

ALTER TABLE `Notifications` ADD FOREIGN KEY (`Sale`) REFERENCES `Sales` (`id`);
