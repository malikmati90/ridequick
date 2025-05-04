from datetime import datetime
from typing import Optional
from sqlmodel import Session, select

from app.models import (
    PricingRule,
    PricingRuleUpdate,
    PricingRuleOut,
    VehicleCategory
)


def get_pricing_rule(*, session: Session, category: VehicleCategory) -> Optional[PricingRuleOut]:
    statement = select(PricingRule).where(
        PricingRule.category == category,
        PricingRule.is_active == True
    )
    return session.exec(statement).first()


def get_all_pricing_rules(*, session: Session) -> list[PricingRule]:
    return session.exec(select(PricingRule).order_by(PricingRule.category)).all()


def create_pricing_rule(*, session: Session, rule_in: PricingRule) -> PricingRule:
    session.add(rule_in)
    session.commit()
    session.refresh(rule_in)
    return rule_in


def update_pricing_rule(*, session: Session, category: VehicleCategory, data: PricingRuleUpdate) -> PricingRule:
    rule = get_pricing_rule(session=session, category=category)
    if not rule:
        raise ValueError(f"Pricing rule not found for category: {category}")

    updates = data.model_dump(exclude_unset=True)
    for key, value in updates.items():
        setattr(rule, key, value)

    session.add(rule)
    session.commit()
    session.refresh(rule)
    return rule


def delete_pricing_rule(*, session: Session, category: VehicleCategory) -> None:
    rule = get_pricing_rule(session, category)
    if rule:
        session.delete(rule)
        session.commit()
