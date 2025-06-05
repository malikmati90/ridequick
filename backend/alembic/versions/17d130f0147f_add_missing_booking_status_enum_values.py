"""add_missing_booking_status_enum_values

Revision ID: 17d130f0147f
Revises: ea424ae2a879
Create Date: 2025-06-01 17:32:27.496103

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '17d130f0147f'
down_revision: Union[str, None] = 'ea424ae2a879'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
