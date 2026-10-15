// Shared by the admin UI and the API routes. Keep scripts/setup-tourist-registration.js in sync.

export const ARRIVAL_CITIES = ["Dhaka", "Chattogram", "Sylhet", "Cox's Bazar"];

export const VISITOR_STATUSES = [
  "new",
  "contacted",
  "active",
  "guide assigned",
  "completed",
  "cancelled",
];

export const GUIDE_STATUSES = ["available", "assigned", "off duty"];

export const REQUEST_STATES = ["new", "open", "in review", "done"];

export const REQUEST_PRIORITIES = ["urgent", "high", "normal", "low"];

export const REQUEST_CATEGORIES = [
  "Airport pickup",
  "Accommodation",
  "Transport",
  "Guide",
  "Medical",
  "Lost item",
  "Safety",
  "Other",
];

export const ALERT_LEVELS = ["info", "advisory", "warning"];

// "super" is the account from ADMIN_USERNAME/ADMIN_PASSWORD; police admins live in the admin_users collection.
export const ADMIN_ROLES = ["super", "police"];

export const OPERATION_TYPES = [
  "Patrol",
  "Checkpoint",
  "Special drive",
  "Rescue",
  "Event security",
  "Awareness campaign",
  "Investigation",
  "Other",
];

export const OPERATION_STATUSES = ["planned", "ongoing", "completed", "cancelled"];

export const OFFENSE_TYPES = [
  "Theft",
  "Pickpocketing",
  "Fraud / scam",
  "Harassment",
  "Assault",
  "Robbery",
  "Drug-related",
  "Smuggling",
  "Human trafficking",
  "Cyber crime",
  "Other",
];

export const CRIMINAL_STATUSES = [
  "wanted",
  "under investigation",
  "arrested",
  "charged",
  "convicted",
  "released",
];

export const THREAT_LEVELS = ["high", "medium", "low"];

export const ADMIN_COOKIE = "tourism_bd_admin";
