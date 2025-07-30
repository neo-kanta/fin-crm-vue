

export interface Company {
  id: string;
  name: string;
  industry: IndustryType;
  website: string;
  revenue?: number;
  employeeCount?: number;
  headquarters: Address;
  contacts: Contact[];
  opportunities: Opportunity[];
  tags: string[];
  tier: "Enterprise" | "Mid-Market" | "SMB";
  createdAt: Date;
  updatedAt: Date;
}
