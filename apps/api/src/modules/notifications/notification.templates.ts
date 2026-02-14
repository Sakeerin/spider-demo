import { NotificationChannel } from '@prisma/client';

export interface NotificationTemplateDefinition {
  key: string;
  title: string;
  message: string;
  defaultChannels: NotificationChannel[];
}

export const NOTIFICATION_TEMPLATES: Record<
  string,
  NotificationTemplateDefinition
> = {
  lead_submitted_customer: {
    key: 'lead_submitted_customer',
    title: 'Lead submitted successfully',
    message:
      'Your request {{leadId}} for {{serviceType}} has been received. We will start matching contractors shortly.',
    defaultChannels: [
      NotificationChannel.EMAIL,
      NotificationChannel.LINE,
      NotificationChannel.IN_APP,
    ],
  },
  lead_assigned_contractor: {
    key: 'lead_assigned_contractor',
    title: 'New job opportunity',
    message:
      'You have a new lead {{leadId}} for {{serviceType}} in {{city}}. Please respond before {{deadline}}.',
    defaultChannels: [
      NotificationChannel.EMAIL,
      NotificationChannel.LINE,
      NotificationChannel.IN_APP,
    ],
  },
  contractor_response_customer: {
    key: 'contractor_response_customer',
    title: 'Contractor response received',
    message:
      'Contractor {{contractorName}} has {{response}} your lead {{leadId}}{{declineReasonText}}.',
    defaultChannels: [
      NotificationChannel.EMAIL,
      NotificationChannel.LINE,
      NotificationChannel.IN_APP,
    ],
  },
  milestone_status_updated: {
    key: 'milestone_status_updated',
    title: 'Milestone status updated',
    message:
      'Milestone "{{milestoneTitle}}" for job {{jobId}} is now {{status}}.',
    defaultChannels: [
      NotificationChannel.EMAIL,
      NotificationChannel.LINE,
      NotificationChannel.IN_APP,
    ],
  },
  reassignment_broadcast_contractor: {
    key: 'reassignment_broadcast_contractor',
    title: 'Broadcast job opportunity',
    message:
      'A new broadcast lead {{leadId}} for {{serviceType}} is available. Check details and respond if interested.',
    defaultChannels: [
      NotificationChannel.EMAIL,
      NotificationChannel.LINE,
      NotificationChannel.IN_APP,
    ],
  },
};
