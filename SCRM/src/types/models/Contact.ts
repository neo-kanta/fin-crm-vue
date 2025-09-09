export type ID = string;
export type ISODateTime = string;

import type { Address } from "./Activity";

/**
 * Lead/contact lifecycle for marketing & sales.
 *
 * @tutorial ContactLifecycle for someone who don't know MQL and SQL
 * Definitions (operational, not just labels):
 *
 * - MQL — Marketing-Qualified Lead
 *   Definition: A lead that FITS your ICP (industry/size/geo/role) **and**
 *   has shown enough recent ENGAGEMENT to justify a sales handoff.
 *   Entry criteria (recommended):
 *     • Fit score ≥ `mql.minFitScore` (e.g., target industry/size/geo and relevant title)
 *     • Engagement score within the last `mql.lookbackDays` ≥ `mql.minEngagementScore`
 *       (e.g., form submit, demo request, webinar attend, multiple email clicks/site visits)
 *     • Valid/verified contact info; consent recorded where required (PDPA/GDPR)
 *   Exit:
 *     • Promoted to SQL upon Sales Acceptance (SAL), or
 *     • Revert to Lead/Inactive after `mql.maxAgingDays` without SAL.
 *
 * - SQL — Sales-Qualified Lead
 *   Definition: A lead that has been **accepted by sales** and shows concrete
 *   buying intent with basic qualification satisfied.
 *   Entry criteria (recommended):
 *     • Sales Acceptance (owner assigned) and discovery call held or scheduled
 *     • BANT/MEDDIC-lite met (at least `sql.minCriteriaMet` of: Need/Pain, Authority/Influencer,
 *       Timing ≤ `sql.maxTimeframeDays`; Budget known or being scoped is a plus)
 *     • A **next step** agreed (demo/proposal/follow-up meeting)
 *   Exit:
 *     • Converted to Opportunity (deal opened), or
 *     • Disqualified (back to Lead/Inactive) after `sql.maxInactivityDays` with no progress
 */
export enum ContactLifecycle {
  Lead = "Lead",
  MQL = "MQL", // Read this the document
  SQL = "SQL", // Read this the document
  Customer = "Customer",
  Inactive = "Inactive",
}

/**
 * Phone number with classification.
 */
export interface PhoneNumber {
  /**
   * Contact number/value idk
   */
  value: string;
  /**
   * Type of Phone number
   */
  type?: "Mobile" | "Work" | "Home" | "Other";
  /**
   * 'true' mean primary, otherwise not primary phone number
   */
  primary?: boolean;
}

/**
 * Email address with basic metadata.
 */
export interface EmailAddress {
  /**
   * Contact Email idk
   */
  value: string;
  primary?: boolean;
  verified?: boolean;
}

/**
 * Social Media.
 */
export interface SocialLinks {
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  Thread?: string;
  instagram?: string;
  website?: string;
}

/**
 * Contact (Person) — an individual, optionally tied to a Company.
 *
 * Linking to Activity/Opportunity:
 * - `contactId` on Activity should reference this `id`.
 * - `companyId` allows rollups (Activities/Opportunities → Company).
 *
 * Derived (not persisted by default): `lastActivityAt`, `nextActivityAt`.
 */
export interface Contact {
  /**
   * Unique contact ID.
   */
  id: ID;

  /**
   * Given name(s).
   */
  name: string;
  /**
   * Display name; if omitted, derive from first/last.
   */
  displayName?: string;

  /**
   * Role/title and department within the company.
   */
  title?: string;
  department?: string;

  /** 
   * Contact methods. 
   */
  emails: EmailAddress[]; // at least one I recommended
  phones?: PhoneNumber[];

  /** 
   * Location. 
   */
  address?: Address;

  /** 
   * Preferences & compliance. 
   */
  timezone?: string; // e.g., "Asia/Bangkok"
  language?: string; // e.g., "th-TH", "en-US"

  // TODO: ADd PDPA
  // consent?: Consent;

  /**
   * Ownership/assignment (optional but recommended).
   */
  ownerId?: ID;
  assigneeId?: ID;

  /**
   * Lifecycle stage.
   */
  lifecycle: ContactLifecycle;
  /**
   * Lead source channel.
   */
  leadSource?: string;

  /**
   * Notes and tags.
   */
  notes?: string;
  tags?: string[];

  /**
   * Social links (optional).
   */
  social?: SocialLinks;

  // ========================
  // Audit
  // ========================
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  deletedAt?: ISODateTime;

  // ========================
  // Schedule to contact this person
  // ========================
  lastActivityAt?: ISODateTime;
  nextActivityAt?: ISODateTime;
}

// export interface Contact {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   title: string;
//   companyId: string;
//   linkedInUrl?: string;
//   tags: string[];
//   lastContactDate?: Date;
//   nextFollowUp?: Date;
//   notes: string;
//   createdAt: Date;
//   updatedAt: Date;
//   isActive: boolean;
// }
