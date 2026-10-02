import { createCrudHandlers } from "../../../../lib/admin-crud";
import { GUIDE_STATUSES } from "../../../../lib/admin-constants";

export const { GET, POST, PATCH, DELETE } = createCrudHandlers({
  collection: "tour_guides",
  key: "guides",
  sort: { name: 1 },
  schema: {
    name: { type: "string", required: true, max: 120 },
    languages: { type: "string", max: 200 },
    regions: { type: "string", max: 200 },
    phone: { type: "string", max: 40 },
    email: { type: "string", max: 120 },
    licenseNo: { type: "string", max: 60 },
    status: { type: "enum", values: GUIDE_STATUSES, default: "available" },
    notes: { type: "string", max: 1000 },
  },
});
