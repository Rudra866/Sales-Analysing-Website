
# File targets
OUTPUT_DIR = "output"
DATAFILE = "datasets.txt"
OUTFILE_SQL = "output.sql"
OUTFILE_JSON = "output.json"
JSON_INDENT = 2
CSV_DELIMITER = ","

# Generate Schema? Unused if not.
GENERATE_SCHEMA, SCHEMA_NAME = True, "test_scr1"

# Use Commits at the start and end of transaction?
ENABLE_COMMITS = True

# Lower and Upper bounds on new car sales
NEW_SALE_RANGE = (27_000.00, 89_000.00)
TRADE_IN_RANGE = (5_400.0, 38_000.0)

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

# Starting number for Employee IDs (unneeded if we add usernames)
EMPLOYEE_ID_START = 44345

# Generate sales from 1 year ago to today.
DATE_RANGE = 365

# Sales Goal Range
CHANCE_TO_REACH_SALES_GOAL = 0.66
OFF_BY_SALES_GOAL = (0.01, 0.33)

# Number of tasks to create
NUM_TASKS = 50

"""
Acura 	2% of the Base MSRP
Audi 	No holdback
BMW 	No holdback
Buick 	3% of the Total MSRP
Cadillac 	3% of the Total MSRP
Chevrolet 	3% of the Total MSRP
Chrysler 	3% of the Total MSRP
Dodge 	3% of the Total MSRP
FIAT 	3% of the Total MSRP
Ford 	3% of the Total MSRP
GMC 	3% of the Total MSRP
Honda 	2% of the Base MSRP
Hyundai 	3% of the Total MSRP
Infiniti 	1.5% of the Base MSRP
Jaguar 	No Holdback
Jeep 	3% of the Total MSRP
Kia 	3% of the Base Invoice
Land Rover 	No Holdback
Lexus 	2% of the Base MSRP
Lincoln 	No Holdback
Mazda 	1% of the Base MSRP
Mercedes-Benz 	1% of the Total MSRP
Mercury 	3% of the Total MSRP
MINI 	No Holdback
Mitsubishi 	2% of the Base MSRP
Nissan 	2% of the Total Invoice
Porsche 	No Holdback
Ram 	3% of the Total MSRP
Scion 	No Holdback
smart 	3% of the Total MSRP
Subaru 	2% of the Total MSRP (Amount may differ in Northeastern U.S.)
Toyota 	2% of the Base MSRP
Volkswagen 	2% of the Base MSRP
Volvo 	1% of the Base MSRP
"""
HOLDBACK_RANGE = (0.01, 0.03)

# For now, 6% finance fee to the dealer, only applied when customer has financed.
FINANCE_FEES = 0.06

# Insurance Fees -- where does this come from even?
INSURANCE_FEES = 0.005

# The amount of notifications that each employee will have in our test data set
NOTIFICATION_COUNT = 10

# Sets the time to create the sales to and from.
BUSINESS_HOURS = (8, 17)

# Role types with weights associated
role_types = \
    {"Administrator": 1,
     "Sales Manager": 1,
     "Financer": 2,
     "Human Resources": 2,
     "Sales Intern": 3,
     "Senior Sales Associate": 2,
     "Sales Associate": 6,
     }

role_perms = {  # READ, WRITE, MODIFY, EMPLOYEEMGMT, DATABASEMGMT
    "Administrator": [True, True, True, True, True],
    "Sales Manager": [True, True, True, True, False],
    "Financer": [True, False, False, False, False],
    "Human Resources": [True, False, False, True, False],
    "Sales Intern": [True, True, True, False, False],  # Should sales intern really be able to modify?
    "Senior Sales Associate": [True, True, True, False, False],
    "Sales Associate": [True, True, True, False, False],
}

role_choices, role_weights, role_perms = list(role_types.keys()), list(role_types.values()), list(role_perms.values())

# These staff roles are created but are not assigned sales tasks...
excluded_roles = ["Human Resources", "Financer", "Administrator"]

lorem_string = ("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque, ipsum eu vehicula" +
                "ultricies, ligula dui, non faucibus ligula justo in massa. Fusce sollicitudin metus eget ligula " +
                "tristique commodo. Donec a tristique dolor. Curabitur id tellus sit amet metus mollis dictum. " +
                "Ut dictum cursus placerat. Cras sed interdum orci. Donec laoreet elit ac leo vulputate, non" +
                "porttitor erat placerat. Cras ut est vel sem sodales imperdiet sit amet nec est. Quisque at " +
                "risus ligula.")



