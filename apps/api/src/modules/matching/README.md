# Random Match Engine

The Random Match engine is a sophisticated contractor matching system that automatically pairs customer leads with the most suitable contractors based on multiple factors.

## Features

### 1. Intelligent Matching Algorithm

The matching algorithm scores contractors based on:

- **Rating (30%)**: Average rating with confidence factor based on review count
- **Success Rate (25%)**: Historical project completion rate
- **Experience (15%)**: Years of experience in the field
- **Workload (15%)**: Current job capacity and availability
- **Response Time (10%)**: Average time to respond to leads
- **Budget Alignment (5%)**: Future enhancement for budget matching

### 2. Contractor Availability Checking

- Real-time workload monitoring
- Maximum concurrent jobs enforcement
- Weekly schedule management
- Utilization rate tracking

### 3. Match Generation

Coordinators can generate matches with:
- Configurable number of matches (1-5)
- Exclusion list for previously declined contractors
- Confidence scoring for match quality
- Detailed reasoning for each match

### 4. Coordinator Override

Coordinators can manually override automatic matching:
- Select specific contractors
- Provide override reason for audit trail
- Bypass automatic scoring

### 5. Contractor Response System

Contractors can:
- Accept leads immediately
- Decline with structured reasons
- Provide custom decline explanations

### 6. Automated Reassignment

When contractors decline:
- System automatically finds new matches
- Excludes previously declined contractors
- Notifies coordinators if no matches available
- Updates lead status appropriately

## API Endpoints

### POST /matching/generate
Generate contractor matches for a lead.

**Roles**: COORDINATOR, ADMIN

**Request**:
```json
{
  "leadId": "string",
  "maxMatches": 3,
  "excludeContractorIds": ["id1", "id2"]
}
```

**Response**:
```json
{
  "leadId": "string",
  "matches": [
    {
      "contractorId": "string",
      "score": 0.85,
      "reasoning": ["Highly rated", "Fast response time"],
      "contractor": { ... }
    }
  ],
  "totalCandidates": 10,
  "confidence": 85,
  "generatedAt": "2024-01-01T00:00:00Z"
}
```

### POST /matching/override
Manually assign contractors to a lead.

**Roles**: COORDINATOR, ADMIN

**Request**:
```json
{
  "leadId": "string",
  "contractorIds": ["id1", "id2"],
  "reason": "Customer requested specific contractors"
}
```

### POST /matching/respond
Contractor responds to a lead assignment.

**Roles**: CONTRACTOR

**Request**:
```json
{
  "leadAssignmentId": "string",
  "response": "ACCEPTED" | "DECLINED",
  "declineReason": "Too busy with current projects"
}
```

### GET /matching/availability/:contractorId
Check contractor availability and schedule.

**Roles**: COORDINATOR, SALES, ADMIN

### GET /matching/workload/:contractorId
Get contractor workload statistics.

**Roles**: COORDINATOR, SALES, ADMIN, CONTRACTOR

## Scoring Details

### Rating Score
- New contractors (0 reviews): 0.5 (neutral)
- Confidence factor increases with review count (full confidence at 20+ reviews)
- Formula: `(rating / 5) * (0.7 + 0.3 * min(reviews / 20, 1))`

### Experience Score
- Linear scaling up to 10 years
- Diminishing returns after 10 years
- Formula: `min(years / 10, 1)`

### Success Rate Score
- Direct percentage conversion
- Formula: `rate / 100`

### Response Time Score
- Excellent (< 60 min): 1.0
- Good (< 180 min): 0.8
- Fair (< 360 min): 0.6
- Poor (≥ 360 min): 0.4
- No data: 0.5

### Workload Score
- Too idle (< 30% utilization): 0.8
- Optimal (30-70% utilization): 1.0
- Getting busy (≥ 70% utilization): 0.6

## Usage Examples

### Generate Matches
```typescript
const result = await matchingService.generateMatches({
  leadId: 'lead-123',
  maxMatches: 3,
});

console.log(`Found ${result.matches.length} matches with ${result.confidence}% confidence`);
```

### Override Match
```typescript
await matchingService.overrideMatch({
  leadId: 'lead-123',
  contractorIds: ['contractor-1', 'contractor-2'],
  reason: 'Customer preference',
});
```

### Handle Contractor Response
```typescript
await matchingService.handleContractorResponse(
  'assignment-123',
  'DECLINED',
  'Too busy with current projects'
);
// System automatically triggers reassignment
```

## Future Enhancements

1. **Budget Matching**: Score contractors based on typical project ranges
2. **Geographic Distance**: Calculate actual distance instead of province matching
3. **Customer Preferences**: Factor in customer's preferred contractor attributes
4. **Machine Learning**: Learn from successful matches to improve scoring
5. **Time-based Availability**: Consider contractor's schedule for specific dates
6. **Specialty Matching**: Match based on specific skills and certifications
