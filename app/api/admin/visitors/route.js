import { createCrudHandlers } from "../../../../lib/admin-crud";
import { ARRIVAL_CITIES, VISITOR_STATUSES } from "../../../../lib/admin-constants";

export const { GET, POST, PATCH, DELETE } = createCrudHandlers({
  collection: "tourist_registrations",
  key: "visitors",
  schema: {
    fullName: { type: "string", required: true, max: 120 },
    passportCountry: { type: "string", required: true, max: 80 },
    arrivalCity: { type: "enum", values: ARRIVAL_CITIES, default: "Dhaka" },
    arrivalDate: { type: "date", required: true },
    hotel: { type: "string", required: true, max: 160 },
    emergencyContact: { type: "string", required: true, max: 60 },
    plannedRoute: { type: "string", required: true, max: 1000 },
    status: { type: "enum", values: VISITOR_STATUSES, default: "new" },
    guideName: { type: "string", max: 120 },
  },
  patchExtras(body) {
    const text = typeof body.note === "string" ? body.note.trim().slice(0, 1000) : "";
    return text ? { $push: { notes: { text, at: new Date() } } } : null;
  },
});
