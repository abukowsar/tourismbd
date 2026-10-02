"use client";

import { useEffect, useMemo, useState } from "react";
import { destinations, interests, transfers } from "../data/tourism";
import { readSaved, SAVED_EVENT } from "./DestinationExplorer";
import Icon from "./Icon";

export const ROUTE_EVENT = "tourismbd:use-route";

const clusters = {
  dhaka: 0,
  sonargaon: 1,
  paharpur: 2,
  sylhet: 3,
  "tanguar-haor": 4,
  sreemangal: 5,
  sundarbans: 6,
  bagerhat: 7,
  kuakata: 8,
  rangamati: 9,
  bandarban: 10,
  "coxs-bazar": 11,
  "saint-martin": 12,
};

// Broad travel regions; Dhaka-area stops never count as a detour.
const regions = {
  dhaka: "central",
  sonargaon: "central",
  paharpur: "north",
  sylhet: "northeast",
  sreemangal: "northeast",
  "tanguar-haor": "northeast",
  sundarbans: "southwest",
  bagerhat: "southwest",
  kuakata: "southwest",
  "coxs-bazar": "southeast",
  "saint-martin": "southeast",
  bandarban: "southeast",
  rangamati: "southeast",
};

const styles = [
  { id: "budget", label: "Backpacker", perDay: [35, 55] },
  { id: "comfort", label: "Comfort", perDay: [90, 150] },
  { id: "luxury", label: "Luxury", perDay: [220, 350] },
];

const byId = Object.fromEntries(destinations.map((place) => [place.id, place]));

function transferText(rawFrom, rawTo) {
  if ([rawFrom, rawTo].includes("sonargaon") && [rawFrom, rawTo].includes("dhaka")) {
    return "About 1.5 hours by road";
  }
  // Sonargaon is a Dhaka day trip, so onward transfers start from Dhaka.
  const from = rawFrom === "sonargaon" ? "dhaka" : rawFrom;
  const to = rawTo === "sonargaon" ? "dhaka" : rawTo;
  return (
    transfers[`${from}>${to}`] ||
    transfers[`${to}>${from}`] ||
    "By road or domestic flight — your guide can suggest the best option"
  );
}

function buildPlan(totalDays, chosenInterests, savedIds, useSaved) {
  const dhaka = byId.dhaka;
  const reserveDeparture = totalDays >= 5 ? 1 : 0;
  let remaining = totalDays - 1 - reserveDeparture;

  const candidates = destinations.filter((place) => place.id !== "dhaka");
  const covered = new Set();
  const picked = [];

  // Greedy pick: interests not yet covered are worth more, so the route stays varied,
  // and each extra region costs a little so the route doesn't zigzag across the country.
  function score(place) {
    const region = regions[place.id];
    const visited = picked.map((item) => regions[item.place.id]).filter((item) => item !== "central");
    const detour = region !== "central" && visited.length && !visited.includes(region) ? 2.5 : 0;
    const matches = place.categories.filter((item) => chosenInterests.includes(item));
    const interestScore = matches.reduce((sum, item) => sum + (covered.has(item) ? 1 : 3), 0);
    const savedBoost = useSaved && savedIds.includes(place.id) ? 10 : 0;
    if (!interestScore && !savedBoost && chosenInterests.length) {
      return 0;
    }
    return interestScore + savedBoost + (place.unesco ? 0.5 : 0) + 0.1 - detour;
  }

  while (remaining > 0) {
    const hasCox = picked.some((item) => item.place.id === "coxs-bazar");
    const best = candidates
      .filter((place) => !picked.some((item) => item.place.id === place.id))
      .filter((place) => place.days <= remaining)
      // Saint Martin's is only reachable through Cox's Bazar.
      .filter((place) => place.id !== "saint-martin" || hasCox)
      .map((place) => ({ place, value: score(place) }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)[0];

    if (!best) {
      break;
    }

    picked.push({ place: best.place, days: best.place.days });
    best.place.categories.forEach((item) => covered.add(item));
    remaining -= best.place.days;
  }

  let dhakaDays = 1;
  let cursor = 0;
  while (remaining > 0 && picked.length) {
    picked[cursor % picked.length].days += 1;
    remaining -= 1;
    cursor += 1;
  }
  if (remaining > 0) {
    dhakaDays += remaining;
  }

  picked.sort((a, b) => clusters[a.place.id] - clusters[b.place.id]);

  const stops = [{ place: dhaka, days: dhakaDays }, ...picked];
  const days = [];
  let previous = null;

  stops.forEach(({ place, days: stayDays }) => {
    for (let index = 0; index < stayDays; index += 1) {
      const { highlights } = place;
      const first = highlights[2 * index - 1];
      const second = highlights[2 * index];
      let note;

      if (index === 0 && previous) {
        note = `Travel from ${previous.name}: ${transferText(previous.id, place.id)}. Evening: ${highlights[0]}.`;
      } else if (index === 0) {
        note = `Arrive at ${place.gateway}. Pick up a local SIM, check in, and ease in with ${highlights[0]}.`;
      } else if (first && second) {
        note = `${first}, then ${second}.`;
      } else if (first) {
        note = `${first}, with the afternoon free to explore at your own pace.`;
      } else {
        note = "Slow day: revisit a favorite spot, browse local markets, or try a home-cooking class.";
      }

      days.push({ place, note });
    }
    previous = place;
  });

  if (reserveDeparture) {
    const last = previous;
    days.push({
      place: dhaka,
      note:
        last && last.id !== "dhaka"
          ? `Return to Dhaka: ${transferText("dhaka", last.id)}. Last-minute shopping at Aarong, then departure.`
          : "Souvenir shopping at Aarong or New Market, then departure.",
    });
  }

  const routeSummary = stops
    .map(({ place, days: stayDays }) => `${place.name} ${stayDays} ${stayDays === 1 ? "day" : "days"}`)
    .concat(reserveDeparture ? ["Dhaka 1 day (departure)"] : [])
    .join(", ");

  return { days, stops, routeSummary };
}

export default function TripPlanner() {
  const [length, setLength] = useState(7);
  const [chosen, setChosen] = useState(["heritage", "nature", "tea"]);
  const [style, setStyle] = useState("comfort");
  const [savedIds, setSavedIds] = useState([]);
  const [useSaved, setUseSaved] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSavedIds(readSaved());
    function onChange(event) {
      setSavedIds(event.detail || readSaved());
    }
    window.addEventListener(SAVED_EVENT, onChange);
    return () => window.removeEventListener(SAVED_EVENT, onChange);
  }, []);

  const plan = useMemo(
    () => buildPlan(length, chosen, savedIds, useSaved),
    [length, chosen, savedIds, useSaved],
  );

  const budget = styles.find((item) => item.id === style);

  function toggleInterest(id) {
    setChosen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function sendToRegistration() {
    window.dispatchEvent(new CustomEvent(ROUTE_EVENT, { detail: plan.routeSummary }));
    document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" });
  }

  async function copyPlan() {
    const text = [
      `My ${length}-day Bangladesh trip`,
      ...plan.days.map((day, index) => `Day ${index + 1} – ${day.place.name}: ${day.note}`),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="planner">
      <div className="planner-controls">
        <div className="control-block">
          <div className="control-label">
            <span>Trip length</span>
            <strong>{length} days</strong>
          </div>
          <input
            type="range"
            min="3"
            max="14"
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            aria-label="Trip length in days"
          />
          <div className="range-scale" aria-hidden="true">
            <span>3</span>
            <span>7</span>
            <span>10</span>
            <span>14</span>
          </div>
        </div>

        <div className="control-block">
          <span className="control-label">
            <span>I'm interested in</span>
          </span>
          <div className="chip-row">
            {interests.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`chip${chosen.includes(item.id) ? " is-active" : ""}`}
                aria-pressed={chosen.includes(item.id)}
                onClick={() => toggleInterest(item.id)}
              >
                {chosen.includes(item.id) ? <Icon name="check" size={14} /> : null}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="control-block">
          <span className="control-label">
            <span>Travel style</span>
          </span>
          <div className="segmented" role="radiogroup" aria-label="Travel style">
            {styles.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={style === item.id}
                className={style === item.id ? "is-active" : ""}
                onClick={() => setStyle(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {savedIds.length ? (
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={useSaved}
              onChange={(event) => setUseSaved(event.target.checked)}
            />
            Prioritize my {savedIds.length} saved {savedIds.length === 1 ? "place" : "places"}
          </label>
        ) : (
          <p className="planner-hint">
            <Icon name="heart" size={16} />
            Tip: tap the heart on any destination to prioritize it here.
          </p>
        )}

        <div className="budget-card">
          <span>Estimated budget per person</span>
          <strong>
            US${(budget.perDay[0] * length).toLocaleString()} – {(budget.perDay[1] * length).toLocaleString()}
          </strong>
          <small>
            Around US${budget.perDay[0]}–{budget.perDay[1]} a day for stays, food, and local transport.
            Excludes international flights.
          </small>
        </div>
      </div>

      <div className="planner-result" aria-live="polite">
        <div className="planner-result-head">
          <div>
            <p className="eyebrow">Your suggested route</p>
            <h3>{length} days in Bangladesh</h3>
          </div>
          <div className="route-pills">
            {plan.stops.map(({ place, days }) => (
              <span key={place.id}>
                {place.name} <b>{days}d</b>
              </span>
            ))}
          </div>
        </div>

        <ol className="timeline">
          {plan.days.map((day, index) => (
            <li key={`${day.place.id}-${index}`}>
              <span className="timeline-day">Day {index + 1}</span>
              <div>
                <strong>{day.place.name}</strong>
                <p>{day.note}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="planner-actions">
          <button type="button" className="button primary" onClick={sendToRegistration}>
            Use this route to register
            <Icon name="arrow" size={18} />
          </button>
          <button type="button" className="button outline" onClick={copyPlan}>
            {copied ? "Copied!" : "Copy itinerary"}
          </button>
        </div>
      </div>
    </div>
  );
}
