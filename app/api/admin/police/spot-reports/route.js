import { createCrudHandlers } from "../../../../../lib/admin-crud";

// Answers to the "ট্যুরিস্ট স্পট সংক্রান্ত তথ্যাদি" field form filed by tourist police.
export const { GET, POST, PATCH, DELETE } = createCrudHandlers({
  collection: "tourist_spot_reports",
  key: "spotReports",
  roles: ["super", "police"],
  audit: true,
  schema: {
    spotName: { type: "string", required: true, max: 160 },
    address: { type: "string", max: 300 },
    history: { type: "string", max: 4000 },
    importance: { type: "string", max: 4000 },
    transport: { type: "string", max: 4000 },
    accommodation: { type: "string", max: 4000 },
    crimes: { type: "string", max: 4000 },
    otherProblems: { type: "string", max: 4000 },
    solutions: { type: "string", max: 4000 },
    dailyVisitors: { type: "string", max: 200 },
    attractionMeasures: { type: "string", max: 4000 },
  },
});
