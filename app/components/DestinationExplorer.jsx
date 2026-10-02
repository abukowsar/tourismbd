"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { categories, destinations } from "../data/tourism";
import Icon from "./Icon";

export const SAVED_KEY = "tourism_bd_saved_places";
export const SAVED_EVENT = "tourismbd:saved-change";

export function readSaved() {
  try {
    const value = JSON.parse(window.localStorage.getItem(SAVED_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeSaved(ids) {
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable in private windows; saving is a convenience.
  }
  window.dispatchEvent(new CustomEvent(SAVED_EVENT, { detail: ids }));
}

export default function DestinationExplorer() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState([]);
  const [active, setActive] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    setSaved(readSaved());
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (active && !dialog.open) {
      dialog.showModal();
    } else if (!active && dialog.open) {
      dialog.close();
    }
  }, [active]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return destinations.filter((place) => {
      const inCategory = category === "all" || place.categories.includes(category);
      const matches =
        !term ||
        [place.name, place.region, place.tagline, place.summary, ...place.highlights]
          .join(" ")
          .toLowerCase()
          .includes(term);
      return inCategory && matches;
    });
  }, [category, query]);

  function toggleSaved(id) {
    const next = saved.includes(id)
      ? saved.filter((item) => item !== id)
      : [...saved, id];
    setSaved(next);
    writeSaved(next);
  }

  return (
    <div className="explorer">
      <div className="explorer-controls">
        <div className="chip-row" role="group" aria-label="Filter destinations">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip${category === item.id ? " is-active" : ""}`}
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" size={18} />
          <span className="sr-only">Search destinations</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tea, tigers, beaches..."
          />
        </label>
      </div>

      <p className="explorer-count" aria-live="polite">
        Showing {visible.length} of {destinations.length} places
        {saved.length ? ` · ${saved.length} saved to your wishlist` : ""}
      </p>

      <div className="destination-grid">
        {visible.map((place) => {
          const isSaved = saved.includes(place.id);
          return (
            <article key={place.id} className={`destination-card tone-${place.tone}`}>
              <div className="destination-art" aria-hidden="true">
                <Icon name={place.icon} size={64} strokeWidth={1.3} />
                <span className="destination-region">{place.region}</span>
              </div>
              <div className="destination-badges">
                {place.unesco ? <span className="badge unesco">UNESCO</span> : null}
                <span className="badge">
                  <Icon name="calendar" size={14} />
                  {place.bestTime.split(" · ")[0]}
                </span>
              </div>
              <button
                type="button"
                className={`save-toggle${isSaved ? " is-saved" : ""}`}
                aria-pressed={isSaved}
                aria-label={isSaved ? `Remove ${place.name} from wishlist` : `Save ${place.name} to wishlist`}
                onClick={() => toggleSaved(place.id)}
              >
                <Icon name="heart" size={18} />
              </button>
              <div className="destination-body">
                <h3>{place.name}</h3>
                <p className="destination-tagline">{place.tagline}</p>
                <p>{place.summary}</p>
                <div className="destination-meta">
                  <span>
                    <Icon name="clock" size={15} />
                    {place.days} {place.days === 1 ? "day" : "days"}
                  </span>
                  <button type="button" className="link-button" onClick={() => setActive(place)}>
                    View details
                    <Icon name="arrow" size={16} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="empty-state">
          <p>No places match “{query}”.</p>
          <button type="button" className="link-button" onClick={() => { setQuery(""); setCategory("all"); }}>
            Clear filters
          </button>
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        className="place-dialog"
        aria-labelledby="place-dialog-title"
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setActive(null);
          }
        }}
      >
        {active ? (
          <div className={`place-dialog-inner tone-${active.tone}`}>
            <div className="place-dialog-hero">
              <Icon name={active.icon} size={72} strokeWidth={1.2} />
              <div>
                <p className="eyebrow">{active.region}{active.unesco ? " · UNESCO World Heritage" : ""}</p>
                <h3 id="place-dialog-title">{active.name}</h3>
                <p>{active.tagline}</p>
              </div>
              <button type="button" className="dialog-close" aria-label="Close" onClick={() => setActive(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="place-dialog-body">
              <p>{active.summary}</p>
              <dl className="place-facts">
                <div>
                  <dt><Icon name="calendar" size={16} /> Best time</dt>
                  <dd>{active.bestTime}</dd>
                </div>
                <div>
                  <dt><Icon name="clock" size={16} /> Suggested stay</dt>
                  <dd>{active.days} {active.days === 1 ? "day" : "days"}</dd>
                </div>
                <div>
                  <dt><Icon name="plane" size={16} /> Getting there</dt>
                  <dd>{active.gateway}</dd>
                </div>
              </dl>
              <h4>Don't miss</h4>
              <ul className="highlight-list">
                {active.highlights.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="local-tip">
                <Icon name="info" size={18} />
                <span><strong>Local tip:</strong> {active.tip}</span>
              </p>
              <div className="dialog-actions">
                <button
                  type="button"
                  className={`button ${saved.includes(active.id) ? "outline" : "primary"}`}
                  onClick={() => toggleSaved(active.id)}
                >
                  <Icon name="heart" size={18} />
                  {saved.includes(active.id) ? "Saved to wishlist" : "Save to wishlist"}
                </button>
                <a className="button outline" href="#planner" onClick={() => setActive(null)}>
                  Plan my trip
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
