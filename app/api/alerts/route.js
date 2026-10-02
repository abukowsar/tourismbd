import { NextResponse } from "next/server";
import { getDb } from "../../../lib/admin-crud";
import { ALERT_LEVELS } from "../../../lib/admin-constants";

export const dynamic = "force-dynamic";

// Public feed of active travel alerts for the home page.
export async function GET() {
  try {
    const db = await getDb();
    const now = new Date();
    const alerts = await db
      .collection("travel_alerts")
      .find({ active: true, $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Most severe first; the stable sort keeps newest-first within each level.
    return NextResponse.json({
      alerts: alerts
        .sort((a, b) => ALERT_LEVELS.indexOf(b.level) - ALERT_LEVELS.indexOf(a.level))
        .slice(0, 3)
        .map((alert) => ({
          id: alert._id.toString(),
          title: alert.title,
          message: alert.message,
          level: alert.level,
          region: alert.region || "",
        })),
    });
  } catch {
    return NextResponse.json({ alerts: [] });
  }
}
