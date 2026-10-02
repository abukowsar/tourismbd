import { NextResponse } from "next/server";
import { ARRIVAL_CITIES } from "../../../lib/admin-constants";
import clientPromise from "../../../lib/mongodb";

const allowedArrivalCities = new Set(ARRIVAL_CITIES);

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request) {
  try {
    const body = await request.json();

    const registration = {
      fullName: cleanText(body.fullName),
      passportCountry: cleanText(body.passportCountry),
      arrivalCity: cleanText(body.arrivalCity),
      arrivalDate: body.arrivalDate ? new Date(body.arrivalDate) : null,
      hotel: cleanText(body.hotel),
      emergencyContact: cleanText(body.emergencyContact),
      plannedRoute: cleanText(body.plannedRoute),
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const missingFields = Object.entries(registration)
      .filter(([key, value]) => {
        if (["status", "createdAt", "updatedAt"].includes(key)) {
          return false;
        }

        return !value;
      })
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: "Missing required registration fields", missingFields },
        { status: 400 },
      );
    }

    if (!allowedArrivalCities.has(registration.arrivalCity)) {
      return NextResponse.json(
        { message: "Invalid arrival city" },
        { status: 400 },
      );
    }

    if (Number.isNaN(registration.arrivalDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid arrival date" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "tourist");
    const result = await db
      .collection("tourist_registrations")
      .insertOne(registration);

    return NextResponse.json(
      {
        message: "Tourist registration saved",
        id: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error?.codeName === "AuthenticationFailed"
            ? "MongoDB authentication failed. Check MONGODB_URI username and password."
            : error?.message || "Registration could not be saved.",
      },
      { status: 500 },
    );
  }
}
