import os

import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model  # noqa: E402


User = get_user_model()

EMAIL = "vailethdickson5@gmail.com"
PASSWORD = "12345678"
FULL_NAME = "vaileth"


def main():
    user, _ = User.objects.get_or_create(
        email=EMAIL,
        defaults={
            "full_name": FULL_NAME,
        },
    )
    user.full_name = FULL_NAME
    user.is_staff = True
    user.is_superuser = True
    if hasattr(user, "role"):
        user.role = "admin"
    user.set_password(PASSWORD)
    user.save()
    print(f"Superuser ready: {EMAIL}")


if __name__ == "__main__":
    main()
