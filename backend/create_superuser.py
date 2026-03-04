#!/usr/bin/env python
"""
Create or update Django superuser for this project.
Usage:
  cd backend
  python create_superuser.py
"""

import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model  # noqa: E402


User = get_user_model()

EMAIL = os.environ.get("DJANGO_SUPERUSER_EMAIL", "vailethdickson5@gmail.com")
PASSWORD = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "12345678")
FULL_NAME = os.environ.get("DJANGO_SUPERUSER_FULL_NAME", "vaileth")


def main():
    user, created = User.objects.get_or_create(
        email=EMAIL,
        defaults={"full_name": FULL_NAME},
    )
    user.full_name = FULL_NAME
    user.is_staff = True
    user.is_superuser = True
    if hasattr(user, "role"):
        user.role = "admin"
    user.set_password(PASSWORD)
    user.save()

    if created:
        print(f"Created superuser: {EMAIL}")
    else:
        print(f"Updated superuser: {EMAIL}")


if __name__ == "__main__":
    main()
