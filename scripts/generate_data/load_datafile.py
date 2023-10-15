import sys

from config import DATAFILE

try:
    with open(DATAFILE, "r", encoding="utf-8") as finput:
        first_names = finput.readline().strip('\n').split(";")[:-1]
        last_names = finput.readline().strip('\n').split(";")[:-1]
        car_makes = finput.readline().strip('\n').split(";")[:-1]
        financers = finput.readline().strip('\n').split(";")[:-1]
        cities = finput.readline().strip('\n').split(";")[:-1]
except IOError as e:
    print("Failed to open datafile:", e, file=sys.stderr)
    exit(1)