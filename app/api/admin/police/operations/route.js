import { createCrudHandlers } from "../../../../../lib/admin-crud";
import { OPERATION_STATUSES, OPERATION_TYPES } from "../../../../../lib/admin-constants";

export const { GET, POST, PATCH, DELETE } = createCrudHandlers({
  collection: "police_operations",
  key: "operations",
  sort: { startAt: -1 },
  roles: ["super", "police"],
  audit: true,
  schema: {
    title: { type: "string", required: true, max: 160 },
    type: { type: "enum", values: OPERATION_TYPES, default: "Patrol" },
    status: { type: "enum", values: OPERATION_STATUSES, default: "planned" },
    zone: { type: "string", max: 120 },
    location: { type: "string", max: 200 },
    startAt: { type: "date", required: true },
    endAt: { type: "date" },
    officerInCharge: { type: "string", max: 120 },
    teamSize: { type: "string", max: 40 },
    details: { type: "string", max: 2000 },
    outcome: { type: "string", max: 2000 },
  },
});
