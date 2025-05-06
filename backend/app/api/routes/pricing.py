from fastapi import APIRouter, HTTPException

from app.api.deps import SessionDep
from app.crud import pricing as crud_pricing
from app.models.pricing import PricingRule, PricingRuleUpdate, VehicleCategory

router = APIRouter()


# Get all pricing rules
@router.get("/", response_model=list[PricingRule])
def list_pricing_rules(session: SessionDep):
    return crud_pricing.get_all_pricing_rules(session=session)


# Get pricing rule by category
@router.get("/{category}", response_model=PricingRule)
def get_rule(category: VehicleCategory, session: SessionDep):
    rule = crud_pricing.get_pricing_rule(session=session, category=category)
    if not rule:
        raise HTTPException(status_code=404, detail="Pricing rule not found")
    return rule


# Create new pricing rule
@router.post("/", response_model=PricingRule)
def create_rule(rule: PricingRule, session: SessionDep):
    return crud_pricing.create_pricing_rule(session=session, rule_in=rule)


# Update a pricing rule by category
@router.patch("/{category}", response_model=PricingRule)
def update_rule(category: VehicleCategory, data: PricingRuleUpdate, session: SessionDep):
    try:
        return crud_pricing.update_pricing_rule(session=session, category=category, data=data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# Delete a pricing rule by category
@router.delete("/{category}")
def delete_rule(category: VehicleCategory, session: SessionDep):
    crud_pricing.delete_pricing_rule(session=session, category=category)
    return {"message": "Pricing rule deleted"}
