# CMPT 370 - Group 22
# Written by Ryan Schaffer
# Test data generator
import os

from load_datafile import *
from sql_defs import *
from tables import *


def generate_data_file():
    """Unused. Could be used to rebuild data file if we need new options"""
    lines = [
        ";".join(first_names),
        ";".join(last_names),
        ";".join(car_makes),
        ";".join(financers),
        ";".join(cities),
    ]
    with open(DATAFILE, "w", encoding="utf-8") as out:
        out.writelines([line + "\n" for line in lines])


def main():
    # Create all the objects
    trade_ins = [TradeIn(random.choice(car_makes)) if i % 100 < TRADE_IN_WEIGHT * 100 else None
                 for i in range(sales_count)]
    random.shuffle(trade_ins)
    Table.TRADE_IN.value[1] = [x for x in trade_ins if x is not None]

    # Create roles, assign employees a role based on role weights.
    Table.ROLES.value[1] = [Roles(name, *perms) for name, perms in zip(role_choices, role_perms)]

    # Generate the list of roles to assign to employees
    roles = list(chain.from_iterable([random.choices(Table.ROLES.value[1], weights=role_weights)
                                      for _ in range(employee_count)]))

    # Create all financers
    Table.FINANCING.value[1] = [Financing(name) for name in financers]

    # Create all employees
    Table.EMPLOYEE.value[1] = [Employee(roles[index].id) for index in range(employee_count)]

    # Create all customers
    Table.CUSTOMER.value[1] = [Customer() for _ in range(int(float(sales_count) * (1.0 - RETURNING_CUSTOMER_RATE)))]

    # Create monthly sales
    Table.MONTHLY_SALES.value[1] = generate_monthly_sales()

    # Create tasks
    Table.TASKS.value[1] = [Task(*random.choices(Table.EMPLOYEE.value[1], k=2)) for _ in range(NUM_TASKS)]

    # Generate sales_objs using a generator
    sales_employees = list(filter(lambda employee:
                                  employee.Role not in [x.id for x in Table.ROLES.value[1]
                                                        if x.RoleName in excluded_roles], Table.EMPLOYEE.value[1]))

    sales_objs_generator = (Sales(
        stock_number=STOCK_NUM_OFFSET + i,
        employee=random.choice(sales_employees),
        customer=random.choice(Table.CUSTOMER.value[1]),
        financing=random.choice(Table.FINANCING.value[1]) if random.random() > (1.0 - FINANCE_WEIGHT) else None,
        trade_in=trade_ins.pop()
    ) for i in range(sales_count))

    try:
        monthly_sale_dict = {monthly_sale.TimePeriod[:7]: monthly_sale for monthly_sale in Table.MONTHLY_SALES.value[1]}
        for i, sale in enumerate(sales_objs_generator):
            Table.SALES.value[1].append(sale)
            monthly_sale_dict[sale.SaleTime[:7]].add_sale(sale)

            if i != 0 and i % progress_interval == 0:
                print(f"Sales {100 * (float(i) / float(sales_count))}% completed.")
        print("Generated data in memory.")
    except MemoryError:
        print("Ran out of memory. Try a smaller output size")
        exit(1)

    # Sort sales data by date, update IDs based on sale time
    Table.SALES.value[1] = sorted(Table.SALES.value[1], key=lambda x: x.SaleTime)
    for i, val in enumerate(Table.SALES.value[1]):
        val.id = DATABASE_START_ID + i

    # Generate notifications
    Table.NOTIFICATIONS.value[1] = generate_notifications(Table.EMPLOYEE.value[1], Table.SALES.value[1])

    # Create monthly sales goals, based off actual monthly sales. Some months pass the goal, some do not.
    Table.SALES_GOALS.value[1] = generate_sales_goals(Table.EMPLOYEE.value[1], Table.MONTHLY_SALES.value[1])

    # Write to our output files
    try:
        if not os.path.exists(OUTPUT_DIR):
            os.mkdir(OUTPUT_DIR)

        if GENERATE_SQL:
            with open(os.path.join(OUTPUT_DIR, OUTFILE_SQL), 'w', encoding="utf-8") as f:
                f.writelines([line + "\n" for line in (build_postgresql_schema() if GENERATE_SCHEMA else []) +
                              build_postgresql_output([table.value[1] for table in Table])])
                print("Wrote file:", f.name)
        if GENERATE_CSV:
            for table in Table:
                with open(os.path.join(OUTPUT_DIR, table.value[0] + ".csv"), 'w', encoding="utf-8") as f:
                    f.write(f"{CSV_DELIMITER}".join(table.value[1][0].keys()) + "\n")
                    csv_lines = [obj.csv() for obj in table.value[1]]
                    f.write("\n".join(csv_lines))
                    print("Wrote file:", f.name)
        if GENERATE_JSON:
            with open(os.path.join(OUTPUT_DIR, OUTFILE_JSON), "w", encoding="utf-8") as f:
                tables = {table[0]: table[1] for table in [table_enum.value for table_enum in Table]}
                json_dict = {table: [obj.to_dict() for obj in table_data] for table, table_data in tables.items()}
                json.dump(json_dict, f, indent=JSON_INDENT)
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
                print(f"    -s:\n        Generate a {OUTFILE_SQL} file. (default)\n")
                print(f"    -j:\n        Generate a {OUTFILE_JSON} file.\n")
                print(f"    -c:\n        Generate .csv files for each table in the database.\n")
                print(f"    -h:\n        Bring up this menu.\n")
                exit(0)
    elif len(sys.argv) not in [3, 4]:
        print(f"Usage: {sys.argv[0]} sales employees")
        exit(1)
    FLAGGED = GENERATE_CSV or GENERATE_JSON or GENERATE_SQL
    if not FLAGGED:
        GENERATE_SQL = True

    try:
        sales_count = int(sys.argv[1 if not FLAGGED else 2])
        employee_count = int(sys.argv[2 if not FLAGGED else 3])
        progress_interval = sales_count / 4 if sales_count > 10000 else sales_count
    except ValueError as e:
        print("Invalid value for type int:", e, file=sys.stderr)
        exit(1)

    main()
