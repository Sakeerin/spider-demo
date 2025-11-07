# Jobs Module - Quotation and Milestone Management

This module implements the quotation and milestone management system for the SPIDER contractor marketplace platform.

## Features

### Quote Management
- Create quotes with milestone breakdowns
- Validate that milestone amounts sum to quote total
- Approve quotes to start projects
- Automatic job status updates on quote approval

### Milestone Management
- Generate milestones from approved quotes
- Track milestone status progression (PENDING → IN_PROGRESS → REVIEW → COMPLETED → PAID)
- Validate status transitions
- Automatic job completion when all milestones are paid
- Audit logging for all milestone updates

### Job Tracking
- Retrieve job details with milestones and documents
- Filter jobs by customer or contractor
- Track project progress and payments

## API Endpoints

### Quote Endpoints

#### POST /jobs/quotes
Create a new quote for a job.

**Roles:** SALES, CONTRACTOR, ADMIN

**Request Body:**
```json
{
  "jobId": "string",
  "amount": 50000,
  "document": "https://example.com/quote.pdf",
  "milestones": [
    {
      "title": "Initial Payment",
      "description": "Down payment for materials",
      "amount": 15000,
      "dueDate": "2024-01-15"
    },
    {
      "title": "Mid-project Payment",
      "description": "Payment after foundation work",
      "amount": 20000,
      "dueDate": "2024-02-15"
    },
    {
      "title": "Final Payment",
      "description": "Payment upon completion",
      "amount": 15000,
      "dueDate": "2024-03-15"
    }
  ]
}
```

**Response:** Job with details

#### POST /jobs/quotes/approve
Approve a quote to start the project.

**Roles:** CUSTOMER, ADMIN

**Request Body:**
```json
{
  "jobId": "string"
}
```

**Response:** Job with details

### Milestone Endpoints

#### POST /jobs/:jobId/milestones
Create milestones for a job (after quote approval).

**Roles:** SALES, CONTRACTOR, ADMIN

**Request Body:**
```json
{
  "milestones": [
    {
      "title": "Milestone 1",
      "description": "Description",
      "amount": 10000,
      "dueDate": "2024-01-15"
    }
  ]
}
```

**Response:** Array of created milestones

#### PATCH /jobs/milestones/:milestoneId/status
Update milestone status.

**Roles:** CONTRACTOR, SALES, ADMIN

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "notes": "Started work on this milestone"
}
```

**Valid Status Transitions:**
- PENDING → IN_PROGRESS
- IN_PROGRESS → REVIEW or PENDING
- REVIEW → COMPLETED or IN_PROGRESS
- COMPLETED → PAID

**Response:** Updated milestone

#### POST /jobs/milestones/:milestoneId/complete
Mark a milestone as completed.

**Roles:** CONTRACTOR, ADMIN

**Request Body:**
```json
{
  "notes": "Work completed successfully",
  "documents": ["url1", "url2"]
}
```

**Response:** Updated milestone

### Job Retrieval Endpoints

#### GET /jobs/:jobId
Get job details with milestones, documents, contractor, and customer info.

**Response:** Job with full details

#### GET /jobs/:jobId/milestones
Get all milestones for a job.

**Response:** Array of milestones

#### GET /jobs/customer/:customerId
Get all jobs for a customer.

**Roles:** CUSTOMER, ADMIN, SALES

**Response:** Array of jobs with details

#### GET /jobs/contractor/:contractorId
Get all jobs for a contractor.

**Roles:** CONTRACTOR, ADMIN, COORDINATOR

**Response:** Array of jobs with details

## Business Logic

### Quote Creation
1. Validates that the job exists
2. Verifies that milestone amounts sum to the quote amount
3. Updates job with quote information
4. Creates audit log entry

### Quote Approval
1. Validates that the job has a quote
2. Updates job status to IN_PROGRESS
3. Updates lead status to APPROVED
4. Creates audit log entry
5. Triggers notification system (future enhancement)

### Milestone Status Progression
The system enforces a strict status progression:
- **PENDING**: Initial state, waiting to start
- **IN_PROGRESS**: Work has begun
- **REVIEW**: Work submitted for customer review
- **COMPLETED**: Work approved by customer
- **PAID**: Payment processed

Invalid transitions are rejected with a 400 error.

### Automatic Job Completion
When all milestones reach COMPLETED or PAID status, the job is automatically marked as COMPLETED.

## Frontend Components

### QuoteCreationForm
Form for creating quotes with dynamic milestone fields.

**Features:**
- Add/remove milestones dynamically
- Real-time validation of milestone amounts
- Visual feedback for amount mismatches

**Usage:**
```tsx
<QuoteCreationForm
  jobId="job-id"
  onSuccess={() => console.log('Quote created')}
  onCancel={() => console.log('Cancelled')}
/>
```

### QuoteApproval
Component for customers to review and approve quotes.

**Features:**
- Display quote details and milestones
- Confirmation dialog before approval
- View quote documents

**Usage:**
```tsx
<QuoteApproval
  job={jobWithDetails}
  onSuccess={() => console.log('Quote approved')}
/>
```

### MilestoneTracker
Visual tracker for milestone progress.

**Features:**
- Progress bar showing completion percentage
- Status badges with color coding
- Update milestone status (for authorized users)
- Overdue milestone highlighting

**Usage:**
```tsx
<MilestoneTracker
  milestones={milestones}
  jobId="job-id"
  canUpdate={true}
  onUpdate={() => console.log('Milestone updated')}
/>
```

### JobDetailView
Comprehensive job detail page with all information.

**Features:**
- Job header with status
- Quote approval section (for customers)
- Milestone tracker
- Document list

**Usage:**
```tsx
<JobDetailView
  jobId="job-id"
  userRole="CUSTOMER"
/>
```

## Audit Logging

All quote and milestone operations are logged with:
- User ID who performed the action
- Action type (CREATE_QUOTE, APPROVE_QUOTE, UPDATE_MILESTONE_STATUS)
- Resource type and ID
- Old and new values
- Timestamp

## Error Handling

The module implements comprehensive error handling:
- **404 Not Found**: Job or milestone doesn't exist
- **400 Bad Request**: Invalid data or business rule violations
- **422 Unprocessable Entity**: Invalid status transitions

## Future Enhancements

1. **Notification Integration**: Trigger notifications on quote creation, approval, and milestone updates
2. **Payment Integration**: Connect milestone completion to payment processing
3. **Document Management**: Enhanced document upload and management
4. **Milestone Templates**: Pre-defined milestone templates for common project types
5. **Automated Reminders**: Send reminders for upcoming milestone due dates
6. **Dispute Resolution**: Handle milestone disputes and revisions
