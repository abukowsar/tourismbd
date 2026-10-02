"use client";

import { useEffect, useRef } from "react";
import Icon from "../../components/Icon";

export function daysUntil(value) {
  if (!value) {
    return null;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return Math.round((date - today) / 86400000);
}

export function isLiveAlert(alert) {
  return Boolean(alert.active) && !(alert.expiresAt && new Date(alert.expiresAt) < new Date());
}

export function formatDate(value, options = { day: "numeric", month: "short", year: "numeric" }) {
  if (!value) {
    return "No date";
  }
  return new Intl.DateTimeFormat("en-GB", options).format(new Date(value));
}

export function relativeDay(value) {
  const days = daysUntil(value);
  if (days === null) return "";
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  return days > 0 ? `in ${days} days` : `${-days} days ago`;
}

export function timeAgo(value) {
  if (!value) return "";
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

const tones = {
  new: "info",
  contacted: "info",
  active: "good",
  "guide assigned": "good",
  completed: "muted",
  cancelled: "muted",
  available: "good",
  assigned: "info",
  "off duty": "muted",
  open: "warn",
  "in review": "info",
  done: "good",
  urgent: "critical",
  high: "serious",
  normal: "muted",
  low: "muted",
  warning: "critical",
  advisory: "serious",
  info: "info",
};

export function Pill({ value, children }) {
  return <span className={`a-pill tone-${tones[value] || "muted"}`}>{children || value}</span>;
}

export function Modal({ title, onClose, children, wide = false, side = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  return (
    <dialog
      ref={ref}
      className={`a-modal${wide ? " is-wide" : ""}${side ? " is-side" : ""}`}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="a-modal-inner">
        <header className="a-modal-head">
          <h2>{title}</h2>
          <button type="button" className="a-icon-button" aria-label="Close" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

export function Kpi({ label, value, detail, icon, tone = "" }) {
  return (
    <article className={`a-kpi ${tone}`}>
      <span className="a-kpi-icon"><Icon name={icon} size={20} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {detail ? <small>{detail}</small> : null}
      </div>
    </article>
  );
}

export function EmptyState({ icon = "search", title, children }) {
  return (
    <div className="a-empty">
      <Icon name={icon} size={28} />
      <strong>{title}</strong>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

/** Horizontal bars for one measure; the bar label and value are always visible text. */
export function BarList({ rows, unit = "visitors", emptyText = "No data yet." }) {
  const max = Math.max(1, ...rows.map((row) => row.value));

  if (!rows.length) {
    return <p className="a-muted">{emptyText}</p>;
  }

  return (
    <ul className="a-barlist">
      {rows.map((row) => (
        <li
          key={row.label}
          className={row.label === "Other" ? "is-other" : ""}
          title={`${row.label}: ${row.value} ${unit}`}
        >
          <span className="a-barlist-label">{row.label}</span>
          <span className="a-barlist-track" aria-hidden="true">
            <span style={{ width: `${(row.value / max) * 100}%` }} />
          </span>
          <b>{row.value}</b>
        </li>
      ))}
    </ul>
  );
}

/** Vertical columns over time; every column has a hover/focus tooltip and a screen-reader table. */
export function ColumnChart({ columns, unit = "arrivals", caption }) {
  const max = Math.max(1, ...columns.map((column) => column.value));

  return (
    <figure className="a-columns">
      <div className="a-columns-plot" role="img" aria-label={caption}>
        {columns.map((column) => (
          <div
            key={column.key}
            className={`a-column${column.highlight ? " is-today" : ""}`}
            tabIndex={0}
            aria-label={`${column.tooltip}: ${column.value} ${unit}`}
          >
            <span className="a-column-bar" style={{ height: `${(column.value / max) * 100}%` }} />
            <span className="a-tooltip">
              <b>{column.value}</b> {unit}
              <small>{column.tooltip}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="a-columns-axis" aria-hidden="true">
        {columns.map((column) => (
          <span key={column.key}>{column.label}</span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {columns.map((column) => (
            <tr key={column.key}>
              <th scope="row">{column.tooltip}</th>
              <td>{column.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function Field({ label, children, wide = false, hint }) {
  return (
    <label className={`a-field${wide ? " is-wide" : ""}`}>
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}
