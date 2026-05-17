const docs = [
  {
    id: "driver_status_nc",
    title: "Driver Status – North Carolina",
    states: ["NC"],
    business: "Auto",
    content: `
Driver Status Requirements (North Carolina)

- All household members of driving age (licensed or permit) must be listed on the policy.
- North Carolina does NOT allow household member exclusions on personal auto policies.
- Any person who regularly operates the vehicle must be rated or listed.
- Permit drivers must be disclosed even if they only occasionally drive.
- Failure to list all household members may result in claim denial or policy cancellation.
- Out-of-state licenses do not exempt a household member from disclosure requirements.
    `
  },

  {
    id: "driver_status_tx",
    title: "Driver Status – Texas",
    states: ["TX"],
    business: "Auto",
    content: `
Driver Status Requirements (Texas)

- All licensed household members must be disclosed on the application.
- Permit drivers must be listed if they have regular access to the insured vehicle.
- Unlike some states, Texas allows limited driver exclusions depending on carrier guidelines.
- Excluded drivers will not be covered under any circumstance while operating the vehicle.
- Any undisclosed household member involved in a loss may impact claim eligibility.
    `
  },

  {
    id: "coverage_presentation_auto",
    title: "Auto Coverage Presentation Guide",
    states: ["NC", "TX", "SC", "GA"],
    business: "Auto",
    content: `
Auto Coverage Presentation Overview

Liability Coverage:
- Required by law in most states.
- Covers bodily injury and property damage to others.

Collision Coverage:
- Pays for damage to your vehicle from an accident.
- Applies regardless of fault.

Comprehensive Coverage:
- Covers non-collision events such as theft, vandalism, weather damage, or animal impact.

Uninsured/Underinsured Motorist:
- Protects you if the other driver has insufficient or no insurance.

Medical Payments / PIP (varies by state):
- Helps cover medical expenses for you and passengers.

Key Agent Notes:
- Always verify state minimum requirements before quoting.
- Encourage higher liability limits for better protection.
    `
  },

  {
    id: "unacceptable_risks_auto",
    title: "Unacceptable Auto Risks",
    states: ["NC", "TX", "SC", "GA", "FL"],
    business: "Auto",
    content: `
Unacceptable Risk Guidelines (Auto)

The following risks are generally not eligible for standard personal auto policies:

- Vehicles used for commercial delivery or rideshare without endorsement.
- Vehicles owned by businesses, LLCs, corporations, or partnerships.
- Salvage titled or rebuilt vehicles (carrier dependent).
- Vehicles not designed for highway use (ATVs, dirt bikes, off-road only).
- High-performance vehicles used for racing or competitive events.
- Drivers with suspended or revoked licenses at time of application.

Agent Reminder:
Always verify underwriting guidelines before binding coverage.
    `
  },

  {
    id: "vehicle_usage_rules",
    title: "Vehicle Usage Guidelines",
    states: ["NC", "TX", "SC"],
    business: "Auto",
    content: `
Vehicle Usage Classification Rules

Personal Use:
- Daily commuting, errands, leisure driving.
- Standard eligibility for personal auto policies.

Commute Use:
- Driving to and from work or school.
- May increase premium depending on mileage.

Business Use:
- Driving for work-related tasks (not delivery).
- Must be disclosed even if occasional.

Commercial Use:
- Deliveries, transporting goods, rideshare, contracting work.
- Requires commercial policy or endorsement.

Important:
Misrepresentation of vehicle usage may result in denial of claims or cancellation of policy.
    `
  },

  {
    id: "vehicle_types_guide",
    title: "Vehicle Types & Eligibility Guide",
    states: ["NC", "TX", "SC", "GA", "FL"],
    business: "Auto",
    content: `
Vehicle Type Eligibility Guide

Eligible Vehicles:
- Standard passenger cars
- SUVs and crossovers
- Light-duty pickup trucks
- Minivans

Conditionally Eligible:
- Modified vehicles (non-performance modifications)
- Luxury vehicles within carrier limits
- Older vehicles depending on condition

Ineligible Vehicles:
- Heavy commercial trucks
- Vehicles with salvage or flood titles (varies)
- Vehicles used primarily for racing
- Imported grey-market vehicles (carrier dependent)

Underwriting Note:
Vehicle VIN verification is required before binding coverage.
    `
  },

  {
    id: "liability_limits_explained",
    title: "Liability Limits Explained",
    states: ["NC", "TX", "SC", "GA"],
    business: "Auto",
    content: `
Liability Coverage Limits Explained

Bodily Injury Liability:
- Covers injuries you cause to others in an accident.
- Split limits often appear as 50/100 or 100/300.

Property Damage Liability:
- Covers damage you cause to another person's property or vehicle.

Why Higher Limits Matter:
- Minimum limits may not fully cover serious accidents.
- Excess liability helps protect personal assets.

Agent Guidance:
- Recommend limits based on client risk exposure and asset level.
    `
  },

  {
    id: "claims_process_auto",
    title: "Auto Claims Process Overview",
    states: ["NC", "TX", "SC", "GA", "FL"],
    business: "Auto",
    content: `
Auto Claims Handling Process

Step 1: First Notice of Loss (FNOL)
- Customer reports accident via phone or online portal.

Step 2: Claim Assignment
- Adjuster is assigned to investigate the claim.

Step 3: Damage Evaluation
- Vehicle inspection is completed (photo or physical).

Step 4: Liability Determination
- Fault is assessed based on evidence and reports.

Step 5: Settlement
- Payment issued based on coverage limits and deductible.

Important Notes:
- Timely reporting improves claim processing speed.
- Fraudulent claims result in denial and possible cancellation.
    `
  },

  {
    id: "renters_pets_animals",
    title: "Renters Insurance – Animal Restrictions",
    states: ["NC", "TX", "SC", "GA", "FL"],
    business: "Renters",
    content: `
Renters Insurance Animal Guidelines

Covered Animals (generally acceptable):
- Cats
- Small caged animals (hamsters, guinea pigs, birds)
- Fish (aquariums within carrier limits)

Restricted or High-Risk Animals:
- Dogs with aggressive breed classification (carrier dependent)
- Exotic animals (snakes, large reptiles, primates)
- Farm or livestock animals

Liability Consideration:
- Animal-related injuries may be excluded depending on breed and policy.
- Some carriers require animal disclosure regardless of coverage.

Agent Note:
Always verify carrier-specific animal restrictions before binding renters policies.
    `
  },

  {
    id: "policy_fraud_indicators",
    title: "Policy Fraud Indicators & Red Flags",
    states: ["NC", "TX", "SC", "GA", "FL"],
    business: "Auto",
    content: `
Fraud Risk Indicators (Underwriting Awareness)

Common Red Flags:
- Inconsistent address history or frequent changes.
- Undisclosed household members.
- Mismatch between garaging and mailing address.
- Suspiciously low mileage for vehicle age.
- Prior cancellations for non-payment or fraud.

Agent Guidance:
- Verify all household members during application.
- Confirm VIN accuracy and vehicle usage.
- Flag discrepancies for underwriting review.

Important:
Failure to identify fraud indicators may result in policy rescission.
    `
  },
  {
  id: "policy_binding_requirements",
  title: "Policy Binding Requirements Checklist",
  states: ["NC", "TX", "SC", "GA", "FL"],
  business: "Auto",
  content: `
Before a policy can be bound, the following must be verified:

- Accurate driver listing (all household members disclosed)
- Valid VIN confirmation for all vehicles
- Correct garaging address
- Approved payment method on file
- Signed state-required disclosures (varies by state)

Additional notes:
- Missing or inconsistent data may delay binding.
- Underwriting review may be required for high-risk profiles.
`
},
{
  id: "garaging_address_rules",
  title: "Garaging Address Rules & Compliance",
  states: ["NC", "TX", "SC", "GA", "FL"],
  business: "Auto",
  content: `
Garaging address refers to where the vehicle is primarily parked overnight.

Key rules:
- Must reflect the actual physical location of the vehicle.
- PO Boxes are not acceptable as garaging addresses.
- Different garaging vs mailing address may require proof of residency.
- Urban vs rural garaging may impact rating.

Agent warning:
Misrepresentation of garaging location can result in policy cancellation or claim denial.
`
},
{
  id: "deductible_selection_guide",
  title: "Deductible Selection Guide",
  states: ["ALL"],
  business: "Auto",
  content: `
A deductible is the amount a policyholder pays before insurance coverage applies.

Common deductible ranges:
- Collision: $250 – $1,000
- Comprehensive: $100 – $1,000

Key guidance:
- Lower deductibles = higher premiums
- Higher deductibles = lower premiums but more out-of-pocket cost

Recommendation logic:
- New drivers → lower deductible preferred
- Experienced drivers → flexible based on risk tolerance
`
},
{
  id: "non_owner_policy_overview",
  title: "Non-Owner Auto Policy Overview",
  states: ["NC", "TX", "SC", "GA"],
  business: "Auto",
  content: `
A non-owner policy provides liability coverage for drivers who do not own a vehicle.

Covered:
- Liability coverage while driving borrowed or rented vehicles

Not covered:
- Physical damage to vehicles
- Household-owned vehicles

Typical use cases:
- Drivers with suspended licenses needing reinstatement proof
- Individuals who frequently rent or borrow cars

Important:
Must verify no regular access to a household vehicle.
`
},
{
  id: "teen_driver_guidelines",
  title: "Teen Driver Underwriting Guidelines",
  states: ["NC", "TX", "SC", "GA", "FL"],
  business: "Auto",
  content: `
Teen drivers represent a higher risk category in auto insurance.

Requirements:
- Must be listed as soon as licensed or permitted
- Good student discounts may apply (carrier dependent)
- Driver training completion may reduce premium

Risk factors:
- Inexperience
- Higher accident frequency
- Night driving exposure

Agent note:
Always confirm household composition when adding teen drivers.
`
},
{
  id: "policy_lapse_consequences",
  title: "Policy Lapse Consequences & Reinstatement",
  states: ["NC", "TX", "SC", "GA", "FL"],
  business: "Auto",
  content: `
A policy lapse occurs when coverage is not renewed or payment is missed.

Consequences:
- Loss of continuous coverage discounts
- Possible SR-22 requirement (state dependent)
- Higher future premiums
- Possible underwriting restrictions

Reinstatement:
- May require payment of past due balance
- Coverage gaps may not be retroactively covered

Agent recommendation:
Encourage autopay to prevent lapse risk.
`
},
{
  id: "multi_vehicle_discount_rules",
  title: "Multi-Vehicle Discount Rules",
  states: ["NC", "TX", "SC", "GA", "FL"],
  business: "Auto",
  content: `
Multi-vehicle discounts apply when more than one vehicle is insured on the same policy.

Eligibility:
- Vehicles must be owned or co-owned by the same household
- All vehicles must be actively insured

Benefits:
- Reduced premium per vehicle
- Simplified policy management

Important:
Adding non-household vehicles may invalidate discount eligibility.
`
},
{
  id: "renters_liability_basics",
  title: "Renters Liability Coverage Basics",
  states: ["ALL"],
  business: "Renters",
  content: `
Renters liability coverage protects against claims of injury or property damage.

Covers:
- Guest injuries in rental property
- Accidental damage to landlord property
- Legal defense costs

Does NOT cover:
- Tenant personal belongings
- Intentional damage

Key note:
Most landlords require minimum liability limits before lease approval.
`
},
{
  id: "rental_property_security_requirements",
  title: "Rental Property Security Requirements",
  states: ["NC", "TX", "SC", "GA", "FL"],
  business: "Renters",
  content: `
Some renters insurance policies may require minimum property security standards.

Common requirements:
- Working deadbolt locks
- Functional smoke detectors
- Secure window locks
- No visible structural damage

Higher-risk properties may require:
- Alarm systems
- Proof of maintenance

Agent note:
Security conditions can impact eligibility or premium rating.
`
},
{
  id: "policy_change_procedures",
  title: "Policy Change Request Procedures",
  states: ["NC", "TX", "SC", "GA", "FL"],
  business: "Auto",
  content: `
Policy changes may include updates to vehicles, drivers, or coverage limits.

Common changes:
- Adding or removing vehicles
- Updating garaging address
- Changing coverage limits
- Updating driver status

Requirements:
- Most changes require underwriting review if risk increases
- Effective dates may not be retroactive

Agent note:
Always confirm change requests in writing before processing.
`
}
];