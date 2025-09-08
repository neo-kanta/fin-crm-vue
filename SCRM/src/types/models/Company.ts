export type ID = string;
export type ISODateTime = string;

import type { Address, Opportunity } from "./Activity";
import { IndustryType } from "../enums/IndustryType";
import { type Contact } from './Contact';

/**
 * Company lifecycle for segmentation & reporting.
 */
export enum CompanyLifecycle {
  Prospect = "Prospect",
  Customer = "Customer",
  Churned = "Churned",
}

/**
 * Company (Account) — an organization you sell to or work with.
 *
 * Linking to Activity/Opportunity:
 * - `companyId` on Activity/Opportunity should reference this `id`.
 * - `primaryContactId` helps default attendees/recipients.
 *
 * Derived (not persisted by default):
 * - `lastActivityAt`, `nextActivityAt`, `openOpportunityCount`, `openActivityCount`.
 */
export interface Company {
  /**
   * Unique company ID.
   * TODO: change to UUIDv4 if necessary.
   */
  id: ID;
  /**
   * Public/trading name (≤ 200 chars).
   */
  name: string;
  /**
   * Registered legal name.
   */
  legalName?: string;
  /**
   * Website URL.
   */
  website?: string;
  /**
   * Primary industry label.
   */
  industry?: IndustryType;
  /**
   * Their financial status etc., balance, AUM .
   */
  financialStatus: FinancialStatus;
  /**
   * Number of employees.
   */
  employeeCount?: number;
  /**
   * Main phone.
   */
  phone?: string;
  /**
   * General inboxes (e.g., sales@, info@).
   */
  emails?: string[];
  /**
   * Headquarters or canonical mailing address.
   */
  address?: Address;
  /**
   * Optional multiple addresses with a type.
   */
  addresses?: Array<{
    type: "hq" | "billing" | "shipping" | "office" | "other";
    address: Address;
  }>;
  /**
   *
   *
   * @type {Contact[]}
   * @memberof Company
   */
  contacts: Contact[];
  /**
   * Opportunity that we currently have
   * @type {Opportunity[]}
   * @memberof Company
   */
  opportunities: Opportunity[];

  /**
   * Lifecycle status.
   */
  lifecycle: CompanyLifecycle;
  /**
   * Account tier for routing/reporting.
   */
  tier: "Enterprise" | "Mid-Market" | "SMB";
  /**
   * Lead source channel.
   */
  leadSource?: string;

  /**
   * Ownership/assignment (optional but recommended).
   */
  ownerId?: ID;
  assigneeId?: ID;

  /**
   * Free‑form tags for faceting.
   */
  tags?: string[];
  /**
   * Notes about the account (Markdown/plain).
   */
  notes?: string;

  // ========================
  // Audit
  // ========================
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt?: ISODateTime;

  // ========================
  // Schedule to contact to company
  // ========================
  lastActivityAt?: ISODateTime;
  nextActivityAt?: ISODateTime;
  openOpportunityCount?: number;
  openActivityCount?: number;
}

export interface FinancialStatus {
  year: string; // format YYYY
  revenue?: number;
  AUM?: number;
}
