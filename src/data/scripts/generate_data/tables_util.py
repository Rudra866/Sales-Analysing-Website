import random
from datetime import timedelta, datetime

import bcrypt

from config import BUSINESS_HOURS, DATE_RANGE


def generate_password_hash(idx: int):
    # This is really slow
    """Generate a realistic password hash. Password will be password{idx}, for all passwords."""
    return bcrypt.hashpw(("password" + str(idx)).encode('utf-8'), bcrypt.gensalt()).decode("utf-8")


def random_date():
    waking_hours_start, waking_hours_end = 8, 17
    # Get the current date
    end = datetime.now()

    # Get the date exactly a year ago
    start = end - timedelta(days=DATE_RANGE)
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    random_da = start + timedelta(seconds=random_second)

    # Generate a random time within waking hours
    random_hour = random.randint(*BUSINESS_HOURS)
    random_minute = random.randint(0, 59)
    random_second = random.randint(0, 59)
    random_time = timedelta(hours=random_hour, minutes=random_minute, seconds=random_second)

    # Combine the random date and time to create the final datetime
    return random_da.replace(hour=random_time.seconds // 3600, minute=(random_time.seconds // 60) % 60,
                             second=random_time.seconds % 60)



