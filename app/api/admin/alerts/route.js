import { createCrudHandlers } from "../../../../lib/admin-crud";
import { ALERT_LEVELS } from "../../../../lib/admin-constants";

export const { GET, POST, PATCH, DELETE } = createCrudHandlers({
  collection: "travel_alerts",
  key: "alerts",
  schema: {
    title: { type: "string", required: true, max: 120 },
    message: { type: "string", required: true, max: 500 },
    level: { type: "enum", values: ALERT_LEVELS, default: "info" },
    region: { type: "string", max: 120 },
    active: { type: "bool", default: true },
    expiresAt: { type: "date" },
  },
});
