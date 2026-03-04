from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone_number', 'password', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_email(self, value):
        normalized = User.objects.normalize_email((value or '').strip()).lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return normalized

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, role=User.Role.CUSTOMER, **validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['full_name'] = user.full_name
        return token

    def validate(self, attrs):
        email = User.objects.normalize_email((attrs.get('email') or '').strip()).lower()
        password = attrs.get('password')
        user = User.objects.filter(email__iexact=email).first()
        if not user or not user.check_password(password) or not user.is_active:
            raise serializers.ValidationError('Invalid email or password')
        attrs['email'] = user.email
        data = super().validate(attrs)
        data['user'] = {
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'phone_number': user.phone_number,
            'role': user.role,
        }
        return data
