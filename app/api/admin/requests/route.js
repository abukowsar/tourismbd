import { createCrudHandlers } from "../../../../lib/admin-crud";
import {
  REQUEST_CATEGORIES,
  REQUEST_PRIORITIES,
  REQUEST_STATES,
} from "../../../../lib/admin-constants";

export const { GET, POST, PATCH, DELETE } = createCrudHandlers({
  collection: "support_requests",
  key: "requests",
  schema: {
    title: { type: "string", required: true, max: 160 },
    visitorId: { type: "string", max: 40 },
    visitorName: { type: "string", max: 120 },
    category: { type: "enum", values: REQUEST_CATEGORIES, default: "Other" },
    priority: { type: "enum", values: REQUEST_PRIORITIES, default: "normal" },
    state: { type: "enum", values: REQUEST_STATES, default: "new" },
    owner: { type: "string", max: 120 },
    details: { type: "string", max: 2000 },
  },
});
