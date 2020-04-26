"""Serialized schemas for User model."""

from flask_jwt_extended import create_access_token
from marshmallow import Schema, fields, post_load
from typing import Callable, Union
from werkzeug.security import generate_password_hash

from app.models import User
from app.schemas import RoleSchema
from app.utilities import generate_access_token


class UserSchema(Schema):
    """Serialized user schema."""

    id = fields.String(dump_only=True)
    email = fields.Email(required=True)
    password = fields.String(load_only=True, required=True)
    date_registered = fields.Date(dump_only=True)
    auth_token = fields.String(dump_only=True)
    role = fields.Nested(RoleSchema, required=True)

    _latitude: Callable[[User], Union[float, int]] = lambda user: user.location['coordinates'][1]
    latitude = fields.Function(_latitude, dump_only=True)

    _longitude: Callable[[User], Union[float, int]] = lambda user: user.location['coordinates'][0]
    longitude = fields.Function(_longitude, dump_only=True)

    @post_load
    def create_user(self, data, **kwargs):
        """Create user after load."""
        token = generate_access_token(identity=data['email'])
        user_data = {
            'email': data['email'],
            'role': data['role'],
            'hashed_password': generate_password_hash(data['password']),
            'auth_token': token,
            'location': {'type': 'Point', 'coordinates': [data['longitude'], data['latitude']]}
        }
        return User(**user_data)


class LoginSchema(Schema):
    """Serialized login schema."""

    email = fields.Email(load_only=True, required=True)
    password = fields.String(load_only=True, required=True)
