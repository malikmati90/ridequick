""" User models """
from sqlmodel import SQLModel, Field
from enum import Enum
from pydantic import EmailStr

class UserRole(str, Enum):
    passenger = "passenger"
    driver = "driver"
    admin = "admin"

# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    role: UserRole = Field(default=UserRole.passenger)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: str | None = None  # type: ignore
    full_name: str | None = None
    password: str | None = None


# TODO replace email str with EmailStr when sqlmodel supports it
class UserUpdateMe(SQLModel):
    full_name: str | None = None
    email: str | None = None

class UpdatePassword(SQLModel):
    current_password: str
    new_password: str

# Properties to return via API, id is always required
class UserOut(UserBase):
    id: int

class UsersOut(SQLModel):
    data: list[UserOut]
    count: int

# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: int | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str