from dataclasses import Field
from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, Column, DateTime, String, Integer, Float, ForeignKey, Date, func, Text
from sqlalchemy.orm import relationship

from database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    phone_number = Column(String(50), nullable=False)
    hashed_password = Column(String(100), nullable=False)
    location = Column(String(150), nullable=True)

    city_id = Column(Integer, ForeignKey('cities.id', ondelete='CASCADE'), nullable=False)

    created_at = Column(DateTime(timezone=True), default=func.now())

    city = relationship("City", back_populates='user')
    requests = relationship('Request', back_populates='user')
    taxi_driver = relationship('TaxiDriver', back_populates='user')


class TaxiDriver(Base):
    __tablename__ = "taxi_drivers"

    id = Column(Integer, primary_key=True, index=True)
    photo = Column(Text, nullable=False)

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    car_id = Column(Integer, ForeignKey('cars.id', ondelete='CASCADE'), nullable=False)

    created_at = Column(DateTime(timezone=True), default=func.now())

    user = relationship('User', back_populates='taxi_driver')
    car = relationship('Car', back_populates='taxi_driver')
    order = relationship('Order', back_populates='taxi_driver')


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    mark_name = Column(String(100), nullable=False)
    color = Column(String(100), nullable=False)
    number_car = Column(String(50), nullable=False)

    created_at = Column(DateTime(timezone=True), default=func.now())

    taxi_driver = relationship('TaxiDriver', back_populates='car')


class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    summ = Column(Integer, nullable=False)
    a_point = Column(Float, nullable=False)
    b_point = Column(Float, nullable=False)

    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

    created_at = Column(DateTime(timezone=True), default=func.now())

    user = relationship('User', back_populates='request')
    order = relationship('Order', back_populates='request')


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    request_id = Column(Integer, ForeignKey('requests.id', ondelete='CASCADE'), nullable=False)
    taxi_id = Column(Integer, ForeignKey('taxi_drivers.id', ondelete='CASCADE'), nullable=False)

    created_at = Column(DateTime(timezone=True), default=func.now())

    request = relationship('Request', back_populates='order')
    taxi_driver = relationship('TaxiDriver', back_populates='order')
 

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True, index=True)
    city_name = Column(String(100), nullable=False)

    created_at = Column(DateTime(timezone=True), default=func.now())

    user = relationship('User', back_populates='city')    