# CMPT 370 - Group 22
# Fake test data generator (RYAN MADE THIS)


import enum, json, csv
import sys, random

from io import StringIO
from itertools import chain
from abc import ABC, abstractmethod

# File targets
DATAFILE = "datasets.txt"
OUTFILE_SQL = "output.sql"
OUTFILE_JSON = "output.json"
JSON_INDENT = 2
CSV_DELIMITER = ","

# Generate Schema? Unused if not.
GENERATE_SCHEMA, SCHEMA_NAME = True, "test_schema3"

# Use Commits at the start and end of transaction
ENABLE_COMMITS = True

# Database Tables
# Little misuse of ENUMs
class Table(enum.Enum):
    TRADE_IN = ["TradeIns", []]
    FINANCING = ["Financing", []]
    EMPLOYEE = ["Employees", []]
    CUSTOMER = ["Customers", []]
    SALES = ["Sales", []]

# Lower and Upper bounds on new car sales
NEW_SALE_RANGE = (27_000.00, 89_000.00)
TRADE_IN_RANGE = (5400.0, 38_000.0)

# Range of gross profit from the new sale price.
GROSS_PROFIT_RANGE = (0.03, 0.05)

# Total Sales:TradeIn sales
TRADE_IN_WEIGHT = 0.33

# Total Sales: Financed sales
FINANCE_WEIGHT = 0.95

# Chance of a customer returning twice
RETURNING_CUSTOMER_RATE = 0.03

# Sales.StockNumber is offset from this, so it is more realistic with a running system.
STOCK_NUM_OFFSET = 13000

# Starting ID in the database
DATABASE_START_ID = 1

# Role types with weights associated
# *Replace these with Role table later for defaults and custom roles*?
role_types = \
    {"Administrator": 1,
     "Sales Manager": 1,
     "Financer": 2,
     "Human Resources": 2,
     "Sales Intern": 3,
     "Senior Sales Associate": 2,
     "Sales Associate": 6,
     }

role_choices, role_weights = list(role_types.keys()), list(role_types.values())

# These staff roles are created but are not assigned sales tasks...
excluded_roles = ["Human Resources", "Financer", "Administrator"]


# Table Classes functionality
class SharedMixin(ABC):
    # Abstract member
    table = ""

    @abstractmethod
    def __init__(self):
        pass

    def to_dict(self):
        return {k: v for k, v in vars(self).items() if not k == "id"}

    def values(self) -> list[str]:
        return list(self.to_dict().values())

    def values_sql(self) -> list[str]:
        """Get the values of all members in order, formatted for SQL. (except for id)"""
        instance_vars = {k: v if v is not None else "NULL" for k, v in vars(self).items()}
        values = [f"'{v}'" if isinstance(v, str) else str(v) for k, v in instance_vars.items() if not k == "id"]
        return ["NULL" if x == "'NULL'" else x for x in values]

    def keys(self) -> list[str]:
        """Get the names of all members (except for id)"""
        return [x for x in self.__dict__.keys() if not x == "id"]

    def mysql(self):
        """Represent table entry as MySQL (or compatible) insert string"""
        return f"INSERT INTO {self.table} ({', '.join(self.keys())}) VALUES ({', '.join(self.values_sql())});"

    def mongodb(self):
        """Represent table entry as MongoDB insert string. (unused)"""
        result = {k: v for k, v in zip(self.keys(), self.values_sql())}
        strings = [f"{k}: {v}" for k, v in result.items()]
        return f"db.{self.table}.insertOne({{{', '.join(strings)}}});"

    def json(self, indent=None):
        """Return a json string of this object."""
        return json.dumps(dict(zip(self.keys(), self.values())), indent=indent)

    def csv(self, delimiter=","):
        """Return a csv formatted string of this object."""
        csv_buffer = StringIO()
        column_names = self.keys()
        writer = csv.DictWriter(csv_buffer, fieldnames=column_names, delimiter=delimiter)
        data_dict = self.to_dict()
        writer.writerow(data_dict)
        csv_string = csv_buffer.getvalue()
        csv_buffer.close()
        return csv_string.rstrip("\r\n")


# Database tables represented as Python classes
class Employee(SharedMixin):
    index = DATABASE_START_ID
    table = Table.EMPLOYEE

    def __init__(self, role_idx):
        self.id: id = Employee.index
        self.Name: str = f"{random.choice(first_names)} {random.choice(last_names)}"

        # replace with Role table later?
        self.Role: str = role_objs[role_idx]

        Employee.index += 1


class Customer(SharedMixin):
    index = DATABASE_START_ID
    table = Table.CUSTOMER

    def __init__(self):
        self.id: int = Customer.index
        self.Name: str = f"{random.choice(first_names)} {random.choice(last_names)}"
        self.City: str = f"{random.choice(cities)}"

        Customer.index += 1


class Financing(SharedMixin):
    index = DATABASE_START_ID
    table = Table.FINANCING

    def __init__(self, method):
        self.id: int = Financing.index
        self.Method: str = method

        Financing.index += 1


class TradeIn(SharedMixin):
    index = DATABASE_START_ID
    table = Table.TRADE_IN

    def __init__(self, name):
        self.id: int = TradeIn.index
        self.Trade: str = name
        self.ActualCashValue: float = round(random.uniform(TRADE_IN_RANGE[0], TRADE_IN_RANGE[1]), 2)

        # Auto increment key
        TradeIn.index += 1


class Sales(SharedMixin):
    index = DATABASE_START_ID
    table = Table.SALES

    def __init__(self, stock_number, trade_in_allowance, employee, customer, financing, trade_in):
        self.id: int = Sales.index  # Hidden (managed by database)
        self.StockNumber: str = str(stock_number)
        self.VehicleMake: str = random.choice(car_makes)
        self.ActualCashValue: float = round(random.uniform(NEW_SALE_RANGE[0], NEW_SALE_RANGE[1]), 2)
        self.TradeInAllowance: float = trade_in_allowance
        self.GrossProfit: float = round(self.ActualCashValue * random.uniform(GROSS_PROFIT_RANGE[0],
                                                                              GROSS_PROFIT_RANGE[1]), 2)
        # Update this when we have columns for F&I and coverage
        self.Total: float = round(self.GrossProfit * 2.7, 2)

        # Foreign Keys
        self.EmployeeID: Employee = employee
        self.CustomerID: Customer = customer
        self.FinancingID: Financing = financing
        self.TradeInID: TradeIn = trade_in


def build_mysql_output(tables_list):
    """Chain output for faster results"""
    output = [*chain(*([obj.mysql() for obj in table] for table in tables_list))]
    return ["BEGIN;"] + output + ["COMMIT;"] if ENABLE_COMMITS else output


def build_mysql_schema():
    # generated from dbml2sql -mysql schema.dbml
    schema_str = f"""
CREATE SCHEMA {SCHEMA_NAME};
USE {SCHEMA_NAME};
CREATE TABLE `Sales` (
  `SaleID` integer PRIMARY KEY AUTO_INCREMENT,
  `StockNumber` varchar(255) NOT NULL,
  `VehicleMake` varchar(255) NOT NULL,
  `ActualCashValue` decimal(10,2) NOT NULL,
  `TradeInAllowance` decimal(10,2) NOT NULL,
  `GrossProfit` decimal(10,2) NOT NULL,
  `Total` decimal(10,2) NOT NULL,
  `EmployeeID` int NOT NULL,
  `CustomerID` int NOT NULL,
  `FinancingID` int,
  `TradeInID` int
);

CREATE TABLE `Employees` (
  `EmployeeID` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Role` varchar(255) NOT NULL
);

CREATE TABLE `Customers` (
  `CustomerID` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `City` varchar(255) NOT NULL
);

CREATE TABLE `Financing` (
  `FinancingID` int PRIMARY KEY AUTO_INCREMENT,
  `Method` varchar(255) UNIQUE NOT NULL
);

CREATE TABLE `TradeIns` (
  `TradeInID` int PRIMARY KEY AUTO_INCREMENT,
  `Trade` varchar(255) NOT NULL,
  `ActualCashValue` decimal(10,2) NOT NULL
);

ALTER TABLE `Sales` ADD FOREIGN KEY (`EmployeeID`) REFERENCES `Employees` (`EmployeeID`);

ALTER TABLE `Sales` ADD FOREIGN KEY (`CustomerID`) REFERENCES `Customers` (`CustomerID`);

ALTER TABLE `Sales` ADD FOREIGN KEY (`FinancingID`) REFERENCES `Financing` (`FinancingID`);

ALTER TABLE `Sales` ADD FOREIGN KEY (`TradeInID`) REFERENCES `TradeIns` (`TradeInID`);
"""

    return schema_str.split("\n")


def build_json_dict(*tables):
    """Dynamic. Create JSON dict with passed in tables. tables MUST match order of Table enum"""
    tables = {table: obj_list for table, obj_list in zip(Table, tables)}
    return {table.name: [[obj.to_dict() for obj in objs] for objs in table_data] for table, table_data in tables.items()}


def generate_data():
    lines = [
        ";".join(first_names),
        ";".join(last_names),
        ";".join(car_makes),
        ";".join(financers),
        ";".join(cities),
    ]
    with open(DATAFILE, "w") as out:
        out.writelines([line + "\n" for line in lines])


def main():
    for i in range(employee_count):
        choices = random.choices(role_choices, weights=role_weights)
        for choice in choices:
            role_objs.append(choice)

    # Create all the objects
    Table.TRADE_IN.value[1] = [TradeIn(random.choice(car_makes)) if i % 100 < TRADE_IN_WEIGHT * 100 else None
                     for i in range(sales_count)]
    trade_ins_copy = Table.TRADE_IN.value[1].copy()
    random.shuffle(trade_ins_copy)
    Table.TRADE_IN.value[1] = [x for x in Table.TRADE_IN.value[1] if x is not None]
    random.shuffle(trade_ins_copy)

    Table.FINANCING.value[1] = [Financing(name) for name in financers]
    Table.EMPLOYEE.value[1] = [Employee(index) for index in range(employee_count)]
    Table.CUSTOMER.value[1] = [Customer() for _ in range(int(float(sales_count) * (1.0 - RETURNING_CUSTOMER_RATE)))]

    # Generate sales_objs
    sales_employees = [x for x in Table.EMPLOYEE.value[1] if x.Role not in excluded_roles]
    sales_objs_gen = (Sales(
        stock_number=i + STOCK_NUM_OFFSET,
        trade_in_allowance=0,
        employee=random.choice(sales_employees).id,
        customer=(random.choice(Table.CUSTOMER.value[1]) if i < len(Table.CUSTOMER.value[1]) else random.choice(Table.CUSTOMER.value[1])).id,
        financing=random.choice(Table.FINANCING.value[1]).id if random.random() > (1.0 - FINANCE_WEIGHT) else None,
        trade_in=(trade_ins_copy.pop().id if trade_ins_copy[-1] is not None else trade_ins_copy.pop())
    ) for i in range(sales_count)
    )

    try:
        for i, obj in enumerate(sales_objs_gen):
            Table.SALES.value[1].append(obj)

            if i != 0 and i % progress_interval == 0:
                print(f"{100 * (float(i) / float(sales_count))}% completed.")
        print("Generated data in memory.")
    except MemoryError:
        print("Ran out of memory. Try a smaller output size")
        exit(1)

    if GENERATE_SQL:
        try:
            with open(OUTFILE_SQL, 'w') as f:
                f.writelines([line + "\n" for line in (build_mysql_schema() if GENERATE_SCHEMA else []) +
                              build_mysql_output([table.value[1] for table in Table.__members__.values()])])
                print("Wrote file:", f.name)
        except IOError:
            print("Failed to write to outfile:", e, file=sys.stderr)
            exit(1)

    if GENERATE_CSV:
        for table in Table.__members__.values():
            try:
                with open(table.value[0] + ".csv", 'w') as f:
                    f.write(f"{CSV_DELIMITER}".join(table.value[1][0].keys()) + "\n")
                    csv_lines = [obj.csv() + CSV_DELIMITER for obj in table.value[1]]
                    f.write("\n".join(csv_lines))
                    print("Wrote file:", f.name)
            except IOError:
                print("Failed to write to outfile:", e, file=sys.stderr)
                exit(1)

    if GENERATE_JSON:
        try:
            with open(OUTFILE_JSON, "w") as f:
                json_table = build_json_dict([table.value[1] for table in Table.__members__.values()])
                json.dump(json_table, f, indent=JSON_INDENT)
            print("Wrote file:", f.name)
        except IOError:
            print("Failed to write to outfile:", e, file=sys.stderr)
            exit(1)

if __name__ == "__main__":
    GENERATE_SQL = None
    GENERATE_JSON = None
    GENERATE_CSV = None
    FLAGGED = False
    valid_flags = ['s', 'c', 'h']
    if len(sys.argv) > 1 and sys.argv[1][0] == "-":
        for i in sys.argv[1][1:]:
            if i == 's':
                GENERATE_SQL = True
            elif i == 'j':
                GENERATE_JSON = True
            elif i == 'c':
                GENERATE_CSV = True
            elif i == 'h':
                print(f"Usage: {sys.argv[0]} [FLAGS] sales employees")
                print(f"Flags: (only 1 at a time for now, will add support for multiple later")
                print(f"    -s:\n        Generate a {OUTFILE_SQL} file. (default)\n")
                print(f"    -j:\n        Generate a {OUTFILE_JSON} file.\n")
                print(f"    -c:\n        Generate .csv files for each table in the database.\n")
                print(f"    -h:\n        Bring up this menu.\n")
                exit(0)
    elif len(sys.argv) not in [3, 4]:
        print(f"Usage: {sys.argv[0]} sales employees")
        exit(1)
    FLAGGED = GENERATE_CSV or GENERATE_JSON or GENERATE_SQL
    if FLAGGED:
        GENERATE_SQL = True

    try:
        sales_count = int(sys.argv[1 if not FLAGGED else 2])
        employee_count = int(sys.argv[2 if not FLAGGED else 3])
        progress_interval = sales_count / 4 if sales_count > 10000 else sales_count
    except ValueError as e:
        print("Invalid value for type int:", e, file=sys.stderr)
        exit(1)

    try:
        with open(DATAFILE) as finput:
            first_names = finput.readline().strip('\n').split(";")[:-1]
            last_names = finput.readline().strip('\n').split(";")[:-1]
            car_makes = finput.readline().strip('\n').split(";")[:-1]
            financers = finput.readline().strip('\n').split(";")[:-1]
            cities = finput.readline().strip('\n').split(";")[:-1]
    except IOError as e:
        print("Failed to open datafile:", e, file=sys.stderr)
        exit(1)

    # for now make roles like this.
    role_objs = [random.choices(role_choices, weights=role_weights) for _ in range(employee_count)]
    role_objs = [choice for choices in role_objs for choice in choices]

    main()
