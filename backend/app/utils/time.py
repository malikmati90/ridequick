from datetime import datetime
from zoneinfo import ZoneInfo


def now_madrid():
    return datetime.now(ZoneInfo("Europe/Madrid"))