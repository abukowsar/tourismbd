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

export const ADMIN_COOKIE = "tourism_bd_admin";
