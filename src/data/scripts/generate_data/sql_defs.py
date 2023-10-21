from itertools import chain

from config import MYSQL_SCHEMA_FILE, POSTGRES_SCHEMA_FILE
from main import SCHEMA_NAME, ENABLE_COMMITS


def build_mysql_output(tables_list):
    """Chain output for faster results"""
    output = [*chain(*([obj.mysql() for obj in table] for table in tables_list))]
    return ["BEGIN;"] + output + ["COMMIT;"] if ENABLE_COMMITS else output


def build_mysql_schema():
    try:
        with open(MYSQL_SCHEMA_FILE) as f:
            pre = [
                f"CREATE SCHEMA {SCHEMA_NAME};",
                f"USE {SCHEMA_NAME};"
            ]
            return pre + list([f.read().strip("\n") for _ in f])
    except IOError:
        print("Failed to read database file.")


def build_postgresql_output(tables_list):
    """Chain output for faster results. Same as build_mysql_output for now."""
    output = [*chain(*([obj.postgresql() for obj in table] for table in tables_list))]
    return ["BEGIN;"] + output + ["COMMIT;"] if ENABLE_COMMITS else output


def build_postgresql_schema():
    # generated from dbml2sql --postgresql schema.dbml
    try:
        with open(POSTGRES_SCHEMA_FILE) as f:
            pre = [
                f"CREATE SCHEMA {SCHEMA_NAME};",
                f"SET search_path TO {SCHEMA_NAME};"
            ]
            return pre + list([f.read().strip("\n") for _ in f])
    except IOError:
        print("Failed to read database file.")
