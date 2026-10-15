import { createCrudHandlers } from "../../../../../lib/admin-crud";
import { CRIMINAL_STATUSES, OFFENSE_TYPES, THREAT_LEVELS } from "../../../../../lib/admin-constants";

export const { GET, POST, PATCH, DELETE } = createCrudHandlers({
  collection: "criminal_records",
  key: "criminals",
  roles: ["super", "police"],
  audit: true,
  schema: {
    name: { type: "string", required: true, max: 120 },
    alias: { type: "string", max: 120 },
    age: { type: "string", max: 10 },
    nationality: { type: "string", max: 80 },
    idNumber: { type: "string", max: 60 },
    offenseType: { type: "enum", values: OFFENSE_TYPES, default: "Other" },
    caseNo: { type: "string", max: 60 },
    status: { type: "enum", values: CRIMINAL_STATUSES, default: "under investigation" },
    threatLevel: { type: "enum", values: THREAT_LEVELS, default: "medium" },
    zone: { type: "string", max: 120 },
    lastKnownLocation: { type: "string", max: 200 },
    incidentDate: { type: "date" },
    description: { type: "string", max: 2000 },
  },
});
