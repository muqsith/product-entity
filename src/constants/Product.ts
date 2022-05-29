// available states
export const STATUSES = {
  DRAFT: "DRAFT",
  AVAILABLE: "AVAILABLE",
  EXPIRED: "EXPIRED",
  DELETED: "DELETED",
  DRAFT_DELETED: "DRAFT_DELETED",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
  RETURNED: "RETURNED",
};

// default state
export const DEFAULT_STATUS = STATUSES.DRAFT;

// available state transitions
export const TRANSITIONS = [
  {
    from: STATUSES.DRAFT,
    to: STATUSES.AVAILABLE,
  },
  {
    from: STATUSES.DRAFT,
    to: STATUSES.DRAFT_DELETED,
  },
  {
    from: STATUSES.AVAILABLE,
    to: STATUSES.EXPIRED,
  },
  {
    from: STATUSES.AVAILABLE,
    to: STATUSES.DELETED,
  },
  {
    from: STATUSES.AVAILABLE,
    to: STATUSES.RESERVED,
  },
  {
    from: STATUSES.RESERVED,
    to: STATUSES.SOLD,
  },
  {
    from: STATUSES.SOLD,
    to: STATUSES.RETURNED,
  },
  {
    from: STATUSES.RETURNED,
    to: STATUSES.DRAFT,
  },
  {
    from: STATUSES.RETURNED,
    to: STATUSES.DELETED,
  },
  {
    from: STATUSES.RESERVED,
    to: STATUSES.AVAILABLE,
  },
  {
    from: STATUSES.EXPIRED,
    to: STATUSES.AVAILABLE,
  },
];
