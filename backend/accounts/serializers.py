from django.contrib.auth import authenticate
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
        normalized = User.objects.normalize_email((value or '').strip())
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
        email = User.objects.normalize_email((attrs.get('email') or '').strip())
        password = attrs.get('password')
        attrs['email'] = email
        user = authenticate(request=self.context.get('request'), username=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid email or password')
        data = super().validate(attrs)
        data['user'] = {
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'phone_number': user.phone_number,
            'role': user.role,
        }
        return data
