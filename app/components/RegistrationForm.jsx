"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { countries } from "../data/countries";
import { ROUTE_EVENT } from "./TripPlanner";

const initialStatus = {
  type: "idle",
  message: "",
};

export default function RegistrationForm() {
  const [status, setStatus] = useState(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [routeFilled, setRouteFilled] = useState(false);
  const [today, setToday] = useState("");
  const routeRef = useRef(null);

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));

    function onRoute(event) {
      if (routeRef.current && event.detail) {
        routeRef.current.value = event.detail;
        setRouteFilled(true);
        window.setTimeout(() => routeRef.current?.focus({ preventScroll: true }), 600);
      }
    }

    window.addEventListener(ROUTE_EVENT, onRoute);
    return () => window.removeEventListener(ROUTE_EVENT, onRoute);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setStatus(initialStatus);

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        throw new Error(result.message || "Registration could not be saved.");
      }

      form.reset();
      setRouteFilled(false);
      setStatus({
        type: "success",
        message: "Visitor safety profile saved successfully. Welcome to Bangladesh!",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="registration-form"
      aria-label="International tourist safety registration"
      onSubmit={handleSubmit}
    >
      <div className="form-head wide-field">
        <span className="tool-icon"><Icon name="shield" /></span>
        <div>
          <strong>Visitor safety profile</strong>
          <small>Takes about 2 minutes · All fields required</small>
        </div>
      </div>

      <label>
        Full name
        <span className="input-wrap">
          <Icon name="passport" size={18} />
          <input type="text" name="fullName" placeholder="Your passport name" autoComplete="name" required />
        </span>
      </label>
      <label>
        Passport country
        <span className="input-wrap">
          <Icon name="pin" size={18} />
          <select name="passportCountry" defaultValue="" autoComplete="country-name" required>
            <option value="" disabled>Select country of passport</option>
            {countries.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </span>
      </label>
      <label>
        Arrival city
        <span className="input-wrap">
          <Icon name="plane" size={18} />
          <select name="arrivalCity" defaultValue="Dhaka" required>
            <option>Dhaka</option>
            <option>Chattogram</option>
            <option>Sylhet</option>
            <option>Cox's Bazar</option>
          </select>
        </span>
      </label>
      <label>
        Arrival date
        <span className="input-wrap">
          <Icon name="calendar" size={18} />
          <input type="date" name="arrivalDate" min={today || undefined} required />
        </span>
      </label>
      <label>
        Hotel or first stay
        <span className="input-wrap">
          <Icon name="city" size={18} />
          <input type="text" name="hotel" placeholder="Hotel name and area" required />
        </span>
      </label>
      <label>
        Emergency contact
        <span className="input-wrap">
          <Icon name="phone" size={18} />
          <input type="tel" name="emergencyContact" placeholder="+ country code and number" autoComplete="tel" required />
        </span>
      </label>
      <label className="wide-field">
        Planned route
        <textarea
          ref={routeRef}
          name="plannedRoute"
          placeholder="Example: Dhaka 2 nights, Sylhet 3 nights, Cox's Bazar 2 nights"
          required
        />
        {routeFilled ? (
          <small className="field-hint">
            <Icon name="sparkle" size={14} /> Filled from your trip planner — edit it freely.
          </small>
        ) : (
          <small className="field-hint">
            Not sure yet? <a href="#planner">Build a route with the trip planner</a>.
          </small>
        )}
      </label>
      <button type="submit" className="submit-button" disabled={isSubmitting}>
        {isSubmitting ? "Saving profile..." : "Save visitor safety profile"}
        {!isSubmitting ? <Icon name="arrow" size={18} /> : null}
      </button>
      {status.message ? (
        <p className={`form-status ${status.type}`} role="status">
          <Icon name={status.type === "success" ? "check" : "info"} size={18} />
          {status.message}
        </p>
      ) : null}
      <p className="form-privacy wide-field">
        <Icon name="shield" size={14} /> Your details are only used to coordinate
        support during your trip.
      </p>
    </form>
  );
}
