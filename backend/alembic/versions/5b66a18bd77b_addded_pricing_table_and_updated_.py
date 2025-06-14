"""Addded pricing table and updated booking table

Revision ID: 5b66a18bd77b
Revises: 696c5c2c157c
Create Date: 2025-05-04 15:35:19.721169

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5b66a18bd77b'
down_revision: Union[str, None] = '696c5c2c157c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('booking', sa.Column('vehicle_category', sa.Enum('economy', 'standard', 'premium', name='vehiclecategory'), nullable=False))
    op.add_column('booking', sa.Column('passenger_count', sa.Integer(), nullable=False))
    op.add_column('booking', sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False))
    op.alter_column('booking', 'created_at',
               existing_type=postgresql.TIMESTAMP(),
               type_=sa.DateTime(timezone=True),
               existing_nullable=False)
    op.drop_column('booking', 'vehicle_type')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('booking', sa.Column('vehicle_type', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.alter_column('booking', 'created_at',
               existing_type=sa.DateTime(timezone=True),
               type_=postgresql.TIMESTAMP(),
               existing_nullable=False)
    op.drop_column('booking', 'updated_at')
    op.drop_column('booking', 'passenger_count')
    op.drop_column('booking', 'vehicle_category')
    # ### end Alembic commands ###
