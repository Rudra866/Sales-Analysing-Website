# Car dealership mock data generator

This tool will create compatible data for our database schema for testing the dynamic portions of our project.

## Description

This script lays out tables that are used in our database, and builds *mostly* accurate testing data so we can build our
website layouts. It is meant to be fairly easily maintainable, adding a new table of data should only involve 3 steps.

The data output from the script will by default be output in a newly created folder `output`. This of course can be
modified in the config.

Note that this data should only be used on a new/clean database. The schema and table should exist
(unless `GENERATE_SCHEMA` set in the config), but should be completely empty.

## Getting Started

### Dependencies

There is a requirements.txt file included in this project. To install required dependencies, first create a virtual
environment for this project locally and activate it:
```
python -m venv venv
```
Windows:
```
.\venv\Scripts\activate.ps1
```
OR (CMD)
```
.\venv\Scripts\activate.bat
```

Bash:
```
source venv/bin/activate
```

Fish:
```
source venv/bin/activate.fish
```

Other Shell? Look it up.

---

Then, install dependencies using pip:
```
pip install -r requirements.txt
```
The project should be all setup and ready to go!

### Configuration

The file `config.py` includes various modifiable options. This allows for easy modifications of the resulting database.

### Executing program

* By default, the script only outputs sql language files. To create 100 sales between 10 employees you can enter:
```
python main.py 100 10
```

* The script is capable of outputting a lot of data, provided it has the memory for it (2 GiB+ text file generated):
```
python main.py 5000000 50
...
ls -l output/output.sql
-rw-r--r-- 1 user group 2187144008 Oct 14 19:33 output/output.sql
```

* You can also output different types of data:

CSV:
```
python main.py -c 100 10
```

JSON:
```
python main.py -j 100 10
```

* Or, you can just output all of them at once, and all files will share the same data, but in their own seperate formatting:
```
python main.py -jcs 100 10
```

## Help

```
python main.py -h
```

## Authors

CMPT 370 Fall - Group 22
Ryan Schaffer

## Version History
* 0.3A
    * Added database module to communicate with supabase directly and add users/employees. Needs more revision to be complete and working.

* 0.2.1
    * Fixed missing columns in script and schema, tested with current schema on supabase.

* 0.2
    * Updated for database changes on 2023-10-21. SQL schema definitions are now loaded in from a file instead.

* 0.1
    * Pushed to group repo. Supports adding data to all tables in our initial schema.
