import csv
import enum
import json
import random
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from io import StringIO

from config import *
from load_datafile import first_names, last_names, cities, car_makes
from tables_util import generate_password_hash, random_date


# Database Tables
# Little misuse of ENUMs makes this really easy. To create a new table, create an entry and fill the list with objects
# that inherit SharedMixin, with each item representing a row in the database.
class Table(enum.Enum):
    TRADE_IN = ["TradeIns", []]
    FINANCING = ["Financing", []]
    ROLES = ["Roles", []]
    EMPLOYEE = ["Employees", []]
    CUSTOMER = ["Customers", []]
    TASKS = ["Tasks", []]
    SALES = ["Sales", []]
    NOTIFICATIONS = ["Notifications", []]
    MONTHLY_SALES = ["MonthlySales", []]
    SALES_GOALS = ["SalesGoals", []]


# Table Classes functionality
class SharedMixin(ABC):
    # Abstract member
    table: enum = None

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

    def postgresql(self):
        """Represent table entry as PostgreSQL (or compatible) insert string"""
        quoted_keys = [f'"{key}"' for key in self.keys()]
        return (f"INSERT INTO \"{str(self.table.value[0])}\"" +
                f" ({', '.join(quoted_keys)}) VALUES ({', '.join(self.values_sql())});")

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

    def __init__(self, role_id):
        self.id: int = Employee.index
        self.Name: str = f"{random.choice(first_names)} {random.choice(last_names)}"
        self.EmployeeNumber: str = str(EMPLOYEE_ID_START + self.id)
        self.Password = generate_password_hash(self.id)

        self.Role = role_id
        self.CreatedOn = random_date().strftime("%Y-%m-%d %H:%M:%S")
        one_week_ago = datetime.now() - timedelta(days=7)

        # Generate a random date between one week ago and the current date
        self.LastAccessed = (one_week_ago + timedelta(days=random.randint(0, 6))).strftime("%Y-%m-%d %H:%M:%S")

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


class Tasks(SharedMixin):
    index = DATABASE_START_ID
    table = Table.TASKS

    def __init__(self, name, desc, pcomplete, date_issued, assignee_id, creator_id):
        self.id: int = Financing.index
        self.Name: str = name
        self.Description: str = desc
        self.PercentageComplete: float = pcomplete
        self.DateIssued: str = date_issued
        self.Assignee: int = assignee_id
        self.Creator: int = creator_id

        Tasks.index += 1


class TradeIn(SharedMixin):
    index = DATABASE_START_ID
    table = Table.TRADE_IN

    def __init__(self, name):
        self.id: int = TradeIn.index
        self.Trade: str = name
        self.ActualCashValue: float = round(random.uniform(TRADE_IN_RANGE[0], TRADE_IN_RANGE[1]), 2)

        # Auto increment key
        TradeIn.index += 1


class Roles(SharedMixin):
    index = DATABASE_START_ID
    table = Table.ROLES

    def __init__(self, name, read_perm=False, write_perm=False,
                 modify_perm=False, employee_perm=False, database_perm=False):
        self.   id:                 int = Roles.index
        self.   RoleName:           str = name
        self.   ReadPermission:     bool = read_perm
        self.   WritePermission:    bool = write_perm
        self.   ModifyPermission:   bool = modify_perm
        self.   EmployeePermission: bool = employee_perm
        self.   DatabasePermission: bool = database_perm

        Roles.index += 1


class Sales(SharedMixin):
    index = DATABASE_START_ID
    table = Table.SALES

    def __init__(self, stock_number, employee, customer, financing, trade_in):
        # Note -- sales are not added in order by ID, but rather by SaleTime, as in prod
        self.   id:                int = Sales.index  # Hidden (managed by database)
        self.   StockNumber:       str = str(stock_number)
        self.   VehicleMake:       str = random.choice(car_makes)
        self.   ActualCashValue:   float = round(random.uniform(*NEW_SALE_RANGE), 2)
        self.   GrossProfit:       float = round(self.ActualCashValue * random.uniform(*GROSS_PROFIT_RANGE), 2)
        self.   FinAndInsurance:   float = round(self.ActualCashValue * (INSURANCE_FEES if financing is None else
                                                                         FINANCE_FEES + INSURANCE_FEES), 2)
        self.   Holdback:          float = round(self.ActualCashValue * random.uniform(*HOLDBACK_RANGE), 2)

        self.   Total:             float = round(self.GrossProfit + self.FinAndInsurance + self.Holdback, 2)
        self.   SaleTime:          str = random_date().strftime("%Y-%m-%d %H:%M:%S")

        # Foreign Keys
        self.   EmployeeID:        int = employee.id
        self.   CustomerID:        int = customer.id
        self.   FinancingID:       int = None if financing is None else financing.id
        self.   TradeInID:         int = None if trade_in is None else trade_in.id

        Sales.index += 1


class MonthlySales(SharedMixin):
    index = DATABASE_START_ID
    table = Table.MONTHLY_SALES

    def __init__(self, month_year, gross_profit=0, fin_and_insurance=0, holdback=0, total=0):
        self.   id:                 int = MonthlySales.index
        self.   TimePeriod:         str = month_year
        self.   GrossProfit:        float = gross_profit
        self.   FinAndInsurance:    float = fin_and_insurance
        self.   Holdback:           float = holdback
        self.   Total:              float = total

        MonthlySales.index += 1

    # NOT GUARANTEED FULLY ACCURATE FIXME ADD DECIMAL TYPE SUPPORT?
    def add_sale(self, sale: Sales):
        self.GrossProfit = round(self.GrossProfit + sale.GrossProfit, 2)
        self.FinAndInsurance = round(self.FinAndInsurance + sale.FinAndInsurance, 2)
        self.Holdback = round(self.Holdback + sale.Holdback, 2)
        self.Total = round(self.Total + sale.Total, 2)


class SalesGoal(SharedMixin):
    index = DATABASE_START_ID
    table = Table.SALES_GOALS

    def __init__(self, assignee, creator, deadline, goal):
        self.   id:                 int = SalesGoal.index
        self.   Name:               str = "goal " + str(self.id)
        self.   Description:        str = lorem_string
        self.   Assignee:           int = assignee.id  # Employee.id
        self.   Creator:            int = creator.id   # Employee.id
        self.   GoalTime:           str = deadline
        self.   TotalGoal:          str = goal

        SalesGoal.index += 1


class Task(SharedMixin):
    index = DATABASE_START_ID
    table = Table.TASKS

    def __init__(self, assignee, creator, date_issued=random_date().strftime("%Y-%m-%d %H:%M:%S"),
                 percentage_complete=round(random.random(), 2)):
        self.   id:                 int = Task.index
        self.   Name:               str = "task " + str(self.id)
        self.   Description:        str = lorem_string
        self.   PercentageComplete: float = percentage_complete
        self.   DateIssued:         str = date_issued
        self.   Assignee:           int = assignee.id
        self.   Creator:            int = creator.id

        Task.index += 1


class Notification(SharedMixin):
    index = DATABASE_START_ID
    table = Table.NOTIFICATIONS

    def __init__(self, employee, sale):
        self.   id:                 int = Notification.index
        self.   Employee:           int = employee.id
        self.   Sale:               int = sale.id

        Notification.index += 1


def generate_monthly_sales():
    current_date = datetime.now()
    output = []
    for _ in range(13):
        # Add the current month-year pair to the list
        current_date = current_date.replace(day=1, hour=0, minute=0, second=0)
        output.append(MonthlySales(current_date.strftime("%Y-%m-%d %H:%M:%S")))
        # Move to the previous month
        current_date -= timedelta(days=current_date.day)
    return list(reversed(output))


def generate_sales_goals(employees, monthly_sales):
    output = []
    for _, val in enumerate(monthly_sales):
        offset = random.uniform(*OFF_BY_SALES_GOAL)
        if random.random() < CHANCE_TO_REACH_SALES_GOAL:
            goal = round(val.Total * (1.0 + offset), 2)
        else:
            goal = round(val.Total * (1.0 - offset), 2)
        output.append(SalesGoal(*random.choices(employees, k=2), val.TimePeriod, goal))
    return output


def generate_notifications(employees, sales):
    """Give each employee X notifications (modified by config)
       The sales that are notified are the last X in the list.
    """
    output = []
    for i in range(1, NOTIFICATION_COUNT + 1):
        sub_list = []
        for _, employee in enumerate(employees):
            sub_list.append(Notification(employee, sales[-i]))
        output.extend(reversed(sub_list))
    return list(reversed(output))