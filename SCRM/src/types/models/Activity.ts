/**
 * @file CRM core models — Activity, Opportunity, Address (v0.2)
 *
 * Conventions
 * - IDs are opaque strings (UUIDv4 recommended).
 * - All timestamps are ISO 8601 strings with timezone offsets (e.g., "2025-09-07T14:00:00+07:00").
 * - Currency: `value` is a number. Recommended to store **minor units** (e.g., satang) as integers to avoid float errors.
 *   If you store major units, be consistent across the system and round carefully at boundaries.
 *
 * Minimal breaking changes from your draft:
 * - Unified all timestamps to ISO strings.
 * - Added optional `ownerId`, `assigneeId`, `opportunityId`, `direction`, `status` to Activity.
 * - De-spaced `OpportunityStage` internal enum values; added `OpportunityStageLabel` for UI labels.
 */

export type ID = string;
export type ISODateTime = string | Date; // e.g., "2025-09-07T14:00:00+07:00" or Date object
export type CurrencyCode = string; // e.g., "THB", "USD"

/**
 * Priority for activities/tasks.
 */
export type Priority = "Low" | "Normal" | "High";

/**
 * Activity classification. Keep these stable for analytics.
 */
export enum ActivityType {
  Call = "Call",
  Email = "Email",
  Meeting = "Meeting",
  Demo = "Demo",
  Proposal = "Proposal",
  FollowUp = "FollowUp",
}

/**
 * Optional direction (e.g., calls/emails).
 */
export enum ActivityDirection {
  Outbound = "Outbound",
  Inbound = "Inbound",
}

/**
 * Lifecycle status for activities.
 */
export enum ActivityStatus {
  Scheduled = "Scheduled",
  Completed = "Completed",
  Canceled = "Canceled",
}

/**
 * Sales pipeline stages (internal values);
 * use labels map for UI text.
 */
export enum OpportunityStage {
  Prospecting = "Prospecting",
  Qualification = "Qualification",
  Proposal = "Proposal",
  Negotiation = "Negotiation",
  ClosedWon = "ClosedWon",
  ClosedLost = "ClosedLost",
}

/**
 * UI labels for stages
 */
export const OpportunityStageLabel: Record<OpportunityStage, string> = {
  [OpportunityStage.Prospecting]: "Prospecting",
  [OpportunityStage.Qualification]: "Qualification",
  [OpportunityStage.Proposal]: "Proposal",
  [OpportunityStage.Negotiation]: "Negotiation",
  [OpportunityStage.ClosedWon]: "Closed Won",
  [OpportunityStage.ClosedLost]: "Closed Lost",
};

/**
 * Postal address. Embed inside Company/Contact as needed.
 */
export interface Address {
  /** Street line incl. number; add line breaks if needed. */
  street: string;
  /** City / district. */
  city: string;
  /** Province / state (optional). */
  state?: string;
  /** Country name or ISO-3166 code. */
  country: string;
  /** Postal / ZIP code. */
  postalCode: string;
}

/**
 * Activity: calls, emails, meetings, demos, proposals, and follow-ups.
 *
 * Linking rule:
 * - At least one of `contactId` or `companyId` SHOULD be provided.
 * - Optionally link to an `opportunityId` if the activity rolls up to a deal.
 *
 * Time rules:
 * - `scheduledEnd` (if present) MUST be >= `scheduledStart`.
 * - `completedAt` (if present) MUST be >= `scheduledStart`.
 *
 * Status rules:
 * - `Completed` implies `completedAt` is set.
 * - Use `Canceled` to represent cancellations; do not set `completedAt` in that case.
 *
 * Outcome suggestions (free text for now):
 * - Call: Connected | NoAnswer | Voicemail | WrongNumber
 * - Email: Sent | Opened | Replied | Bounced
 * - Meeting/Demo: Held | NoShow | Rescheduled | Canceled
 * - Proposal/FollowUp: Sent | Discussed | Deferred
 *
 * @example
 * const a: Activity = {
 *   id: "a-1",
 *   subject: "Quarterly review with ACME",
 *   description: "Discuss Q4 targets and product roadmap.",
 *   companyId: "c-001",
 *   type: ActivityType.Meeting,
 *   status: ActivityStatus.Scheduled,
 *   scheduledStart: "2025-09-10T10:00:00+07:00",
 *   scheduledEnd: "2025-09-10T11:00:00+07:00",
 *   priority: "High",
 *   createdBy: "u-neo",
 *   createdAt: "2025-09-07T14:05:00+07:00",
 *   tags: ["QBR", "enterprise"]
 * };
 */
export interface Activity {
  /**
   * Unique activity ID
   * TODO: change to UUIDv4 recommended).
   */
  id: ID;

  // ========================
  // Classification & linking
  // ========================
  /**
   * Short title for list/calendar views (≤ 200 chars recommended).
   */
  subject: string;
  /**
   * Long-form details/notes (Markdown/plain text).
   */
  description: string;

  /**
   * Contact this activity belongs to. Provide at least one of contactId/companyId.
   */
  contactId?: ID;
  /**
   * Company (account) this activity belongs to. Provide at least one of contactId/companyId.
   */
  companyId?: ID;
  /**
   * Optional: link to a specific opportunity/deal.
   */
  opportunityId?: ID;

  // ========================
  // Lifecycle
  // ========================
  /**
   * Activity category.
   */
  type: ActivityType;
  /**
   * Direction for calls/emails (optional).
   */
  direction?: ActivityDirection;
  /**
   * Current status.
   */
  status: ActivityStatus;

  /**
   * Planned start (ISO).
   */
  scheduledStart: ISODateTime;
  /**
   * Planned end (ISO).
   * MUST be >= scheduledStart if provided.
   */
  scheduledEnd?: ISODateTime;
  /**
   * Actual completion time (ISO).
   * Set when status = Completed.
   */
  completedAt?: ISODateTime;

  // ========================
  // Results & Follow-through
  // ========================
  /**
   * Result summary (standardize per type later).
   */
  outcome?: string;
  /**
   * Follow-up actions/reminders.
   */
  nextSteps?: string;
  /**
   * Importance indicator (default behavior: treat missing as "Normal").
   */
  priority?: Priority;

  // ========================
  //  Meeting-specific (sometimes we have meeting with customers)
  // ========================
  /**
   * Physical address or virtual link.
   */
  location?: string;
  /**
   * Participants by Contact ID.
   */
  attendeeContactIds?: ID[];

  // ========================
  // Assignment (optional but recommended for routing/reporting)
  // ========================
  /**
   * Record owner (who is responsible for this record).
   */
  ownerId?: ID;
  /**
   * The user expected to execute this activity.
   */
  assigneeId?: ID;

  // ========================
  // Ousekeeping / audit
  // ========================
  /**
   * Creator user ID (immutable).
   */
  createdBy: ID;
  /**
   * Creation timestamp (set server-side).
   */
  createdAt: ISODateTime;
  /**
   * Last editor’s user ID.
   */
  updatedBy?: ID;
  /**
   * Last update timestamp.
   */
  updatedAt?: ISODateTime;
  /**
   * Soft-delete timestamp; hide from default queries when set.
   */
  deletedAt?: ISODateTime;

  /**
   * File references (IDs or URLs; prefer IDs managed by storage service).
   */
  attachments?: string[];
  /**
   * Free-form keywords for filtering.
   */
  tags?: string[];
}

/**
 * Opportunity (Deal) — sales pipeline entity.
 *
 * Currency guidance:
 * - Prefer storing deal `value` in **minor units** (e.g., satang) as an integer.
 * - Add a consistent `currency` across your dataset (default "THB" if all-Thai).
 *
 * Probability guidance:
 * - Keep within 0–100 (percent). Typical mappings by stage:
 *   Prospecting: 10–20, Qualification: 20–40, Proposal: 40–60,
 *   Negotiation: 60–90, ClosedWon: 100, ClosedLost: 0
 *
 * Locking guidance:
 * - After moving to ClosedWon/ClosedLost, restrict editing of `value`, `products` to admins.
 *
 * @example
 * const opp: Opportunity = {
 *   id: "opp-1001",
 *   name: "ACME – Annual subscription",
 *   companyId: "c-001",
 *   value: 1250000, // satang (minor units) recommended
 *   currency: "THB",
 *   stage: OpportunityStage.Proposal,
 *   probability: 55,
 *   closeDate: "2025-10-31T00:00:00+07:00",
 *   products: ["prod-analytics", "prod-api"],
 *   competitor: "Globex",
 *   notes: "Awaiting legal review.",
 *   createdAt: "2025-09-01T10:00:00+07:00",
 *   updatedAt: "2025-09-07T12:00:00+07:00",
 *   ownerId: "u-neo"
 * };
 */
export interface Opportunity {
  /**
   * Unique opportunity ID (UUIDv4 recommended).
   */
  id: ID;
  /**
   * Deal title (≤ 200 chars recommended).
   */
  name: string;
  /**
   * Account the deal belongs to.
   */
  companyId: ID;

  /**
   * Deal value. Prefer integer **minor units** (e.g., satang).
   */
  value: number;
  /**
   * ISO-4217 code; default your backend to "THB" if not provided.
   */
  currency?: CurrencyCode;

  /**
   * Current sales stage.
   */
  stage: OpportunityStage;
  /**
   * Win likelihood in percent (0–100).
   */
  probability: number;

  /**
   * Expected close date (ISO).
   */
  closeDate: ISODateTime;

  /**
   * Product IDs included in scope.
   */
  products: string[];
  /**
   * Main competitor (free text).
   */
  competitor?: string;

  /**
   * Long-form notes (Markdown/plain text).
   */
  notes: string;

  // ========================
  // Assignment
  // ========================
  /**
   * Record owner (who is responsible for the deal).
   */
  ownerId?: ID;
  /**
   * The user currently working the deal.
   */
  assigneeId?: ID;

  // ========================
  // Audit
  // ========================
  /**
   * Created timestamp (ISO).
   */
  createdAt: ISODateTime;
  /**
   * Last updated timestamp (ISO).
   */
  updatedAt: ISODateTime;
}

/* -------------------------
 * Validation checklist (non-executable docs)
 * - Activity: require id, subject, description, type, status, scheduledStart, createdBy, createdAt.
 * - Activity: at least one of contactId/companyId should be set.
 * - Activity: if status = Completed, set completedAt (>= scheduledStart).
 * - Activity: if scheduledEnd is set, ensure scheduledEnd >= scheduledStart.
 * - Opportunity: require id, name, companyId, value, stage, probability (0–100), closeDate, products, notes, createdAt, updatedAt.
 * - Stage transitions (suggested): Prospecting → Qualification → Proposal → Negotiation → (ClosedWon | ClosedLost).
 * ------------------------- */
