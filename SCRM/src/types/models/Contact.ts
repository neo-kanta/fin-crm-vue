export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  companyId: string;
  linkedInUrl?: string;
  tags: string[];
  lastContactDate?: Date;
  nextFollowUp?: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
