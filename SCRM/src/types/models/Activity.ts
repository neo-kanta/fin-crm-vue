export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description: string;
  contactId?: string;
  companyId?: string;
  scheduledDate: Date;
  completedDate?: Date;
  outcome?: string;
  nextSteps?: string;
  createdBy: string;
  createdAt: Date;
}

export interface Opportunity {
  id: string;
  name: string;
  companyId: string;
  value: number;
  stage: OpportunityStage;
  probability: number;
  closeDate: Date;
  products: string[];
  competitor?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export enum ActivityType {
  Call = "Call",
  Email = "Email",
  Meeting = "Meeting",
  Demo = "Demo",
  Proposal = "Proposal",
  FollowUp = "Follow Up",
}

export enum OpportunityStage {
  Prospecting = "Prospecting",
  Qualification = "Qualification",
  Proposal = "Proposal",
  Negotiation = "Negotiation",
  ClosedWon = "Closed Won",
  ClosedLost = "Closed Lost",
}
