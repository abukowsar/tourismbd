"use client";

import { useMemo, useState } from "react";
import Icon from "../../components/Icon";
import { ARRIVAL_CITIES, VISITOR_STATUSES } from "../../../lib/admin-constants";
import { daysUntil, EmptyState, Field, formatDate, Modal, Pill, relativeDay, timeAgo } from "./ui";

const arrivalWindows = [
  { id: "all", label: "Any arrival date" },
  { id: "week", label: "Arriving in 7 days" },
  { id: "month", label: "Arriving in 30 days" },
  { id: "past", label: "Already arrived" },
];

const emptyVisitor = {
  fullName: "",
  passportCountry: "",
  arrivalCity: "Dhaka",
  arrivalDate: "",
  hotel: "",
  emergencyContact: "",
  plannedRoute: "",
  status: "new",
  guideName: "",
};

function statusOptions(current) {
  return VISITOR_STATUSES.includes(current) ? VISITOR_STATUSES : [current, ...VISITOR_STATUSES];
}

function toCsv(rows) {
  const columns = [
    ["fullName", "Name"],
    ["passportCountry", "Passport country"],
    ["arrivalCity", "Arrival city"],
    ["arrivalDate", "Arrival date"],
    ["hotel", "Hotel"],
    ["emergencyContact", "Emergency contact"],
    ["plannedRoute", "Planned route"],
    ["status", "Status"],
    ["guideName", "Guide"],
  ];
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [
    columns.map(([, label]) => escape(label)).join(","),
    ...rows.map((row) =>
      columns
        .map(([key]) => escape(key === "arrivalDate" && row[key] ? row[key].slice(0, 10) : row[key]))
        .join(","),
    ),
  ].join("\r\n");
}

export default function Visitors({ store, guides, openId, setOpenId, onCreateRequest, notify }) {
  const { items: visitors } = store;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [city, setCity] = useState("all");
  const [arrivalWindow, setArrivalWindow] = useState("all");
  const [adding, setAdding] = useState(false);

  const counts = useMemo(() => {
    const result = { all: visitors.length };
    visitors.forEach((visitor) => {
      result[visitor.status] = (result[visitor.status] || 0) + 1;
    });
    return result;
  }, [visitors]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return visitors
      .filter((visitor) => status === "all" || visitor.status === status)
      .filter((visitor) => city === "all" || visitor.arrivalCity === city)
      .filter((visitor) => {
        const days = daysUntil(visitor.arrivalDate);
        if (arrivalWindow === "week") return days !== null && days >= 0 && days <= 7;
        if (arrivalWindow === "month") return days !== null && days >= 0 && days <= 30;
        if (arrivalWindow === "past") return days !== null && days < 0;
        return true;
      })
      .filter(
        (visitor) =>
          !term ||
          [visitor.fullName, visitor.passportCountry, visitor.arrivalCity, visitor.hotel, visitor.guideName, visitor.plannedRoute]
            .join(" ")
            .toLowerCase()
            .includes(term),
      )
      .sort((a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate));
  }, [visitors, query, status, city, arrivalWindow]);

  const openVisitor = visitors.find((visitor) => visitor.id === openId);

  function exportCsv() {
    const blob = new Blob([`﻿${toCsv(filtered)}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tourism-bd-visitors-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function assignGuide(visitor, guideName) {
    const patch = { guideName };
    if (guideName && ["new", "contacted"].includes(visitor.status)) {
      patch.status = "guide assigned";
    }
    if (await store.update(visitor.id, patch)) {
      notify(guideName ? `${guideName} assigned to ${visitor.fullName}` : "Guide removed");
    }
  }

  return (
    <div className="a-stack">
      <div className="a-chips" role="group" aria-label="Filter by status">
        {["all", ...VISITOR_STATUSES].map((item) => (
          <button
            key={item}
            type="button"
            className={`a-chip${status === item ? " is-active" : ""}`}
            aria-pressed={status === item}
            onClick={() => setStatus(item)}
          >
            {item === "all" ? "All" : item}
            <b>{counts[item] || 0}</b>
          </button>
        ))}
      </div>

      <div className="a-card">
        <div className="a-toolbar">
          <label className="a-search">
            <Icon name="search" size={18} />
            <span className="sr-only">Search visitors</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, country, hotel, route..."
            />
          </label>
          <select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Arrival city">
            <option value="all">All cities</option>
            {ARRIVAL_CITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={arrivalWindow} onChange={(event) => setArrivalWindow(event.target.value)} aria-label="Arrival date">
            {arrivalWindows.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          <div className="a-toolbar-actions">
            <button type="button" className="a-button ghost" onClick={exportCsv} disabled={!filtered.length}>
              Export CSV
            </button>
            <button type="button" className="a-button" onClick={() => setAdding(true)}>
              + Add visitor
            </button>
          </div>
        </div>

        {filtered.length ? (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th scope="col">Visitor</th>
                  <th scope="col">Arrival</th>
                  <th scope="col">First stay</th>
                  <th scope="col">Guide</th>
                  <th scope="col">Status</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((visitor) => (
                  <tr key={visitor.id}>
                    <td>
                      <button type="button" className="a-name" onClick={() => setOpenId(visitor.id)}>
                        <span className="a-avatar" aria-hidden="true">{visitor.fullName.charAt(0)}</span>
                        <span>
                          <strong>{visitor.fullName}</strong>
                          <small>{visitor.passportCountry}</small>
                        </span>
                      </button>
                    </td>
                    <td>
                      <strong>{visitor.arrivalCity}</strong>
                      <small>{formatDate(visitor.arrivalDate)} · {relativeDay(visitor.arrivalDate)}</small>
                    </td>
                    <td className="a-clip">{visitor.hotel}</td>
                    <td>
                      <select
                        value={visitor.guideName || ""}
                        onChange={(event) => assignGuide(visitor, event.target.value)}
                        aria-label={`Guide for ${visitor.fullName}`}
                      >
                        <option value="">Unassigned</option>
                        {guides.map((guide) => (
                          <option key={guide.id} value={guide.name}>{guide.name}</option>
                        ))}
                        {visitor.guideName && !guides.some((guide) => guide.name === visitor.guideName) ? (
                          <option value={visitor.guideName}>{visitor.guideName}</option>
                        ) : null}
                      </select>
                    </td>
                    <td>
                      <select
                        className="a-status-select"
                        data-status={visitor.status}
                        value={visitor.status}
                        onChange={(event) => store.update(visitor.id, { status: event.target.value })}
                        aria-label={`Status for ${visitor.fullName}`}
                      >
                        {statusOptions(visitor.status).map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button type="button" className="a-icon-button" aria-label={`Open ${visitor.fullName}`} onClick={() => setOpenId(visitor.id)}>
                        <Icon name="arrow" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No visitors match these filters">
            Try clearing the search or choosing a different status.
          </EmptyState>
        )}
        <p className="a-table-foot">
          Showing {filtered.length} of {visitors.length} visitors
        </p>
      </div>

      {openVisitor ? (
        <VisitorDrawer
          visitor={openVisitor}
          guides={guides}
          store={store}
          onAssign={assignGuide}
          onClose={() => setOpenId(null)}
          onCreateRequest={onCreateRequest}
          notify={notify}
        />
      ) : null}

      {adding ? (
        <VisitorForm
          onClose={() => setAdding(false)}
          onSave={async (data) => {
            const created = await store.create(data);
            if (created) {
              notify(`${created.fullName} added`);
              setAdding(false);
            }
          }}
        />
      ) : null}
    </div>
  );
}

function VisitorDrawer({ visitor, guides, store, onAssign, onClose, onCreateRequest, notify }) {
  const [note, setNote] = useState("");
  const notes = [...(visitor.notes || [])].reverse();

  async function addNote(event) {
    event.preventDefault();
    const text = note.trim();
    if (!text) return;

    const ok = await store.update(visitor.id, {
      note: text,
      notes: [...(visitor.notes || []), { text, at: new Date().toISOString() }],
    });
    if (ok) {
      setNote("");
      notify("Note added");
    }
  }

  async function remove() {
    if (window.confirm(`Delete ${visitor.fullName}'s registration? This can't be undone.`)) {
      if (await store.remove(visitor.id)) {
        notify("Visitor deleted");
        onClose();
      }
    }
  }

  return (
    <Modal title={visitor.fullName} onClose={onClose} side>
      <div className="a-drawer">
        <div className="a-drawer-summary">
          <Pill value={visitor.status} />
          <span>{visitor.passportCountry}</span>
          <span>Registered {formatDate(visitor.createdAt)}</span>
        </div>

        <div className="a-form-grid">
          <Field label="Status">
            <select value={visitor.status} onChange={(event) => store.update(visitor.id, { status: event.target.value })}>
              {statusOptions(visitor.status).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <Field label="Assigned guide">
            <select value={visitor.guideName || ""} onChange={(event) => onAssign(visitor, event.target.value)}>
              <option value="">Unassigned</option>
              {guides.map((guide) => (
                <option key={guide.id} value={guide.name}>
                  {guide.name} ({guide.status})
                </option>
              ))}
            </select>
          </Field>
        </div>

        <dl className="a-details">
          <div>
            <dt>Arrival</dt>
            <dd>{visitor.arrivalCity} · {formatDate(visitor.arrivalDate)} ({relativeDay(visitor.arrivalDate)})</dd>
          </div>
          <div>
            <dt>First stay</dt>
            <dd>{visitor.hotel}</dd>
          </div>
          <div>
            <dt>Emergency contact</dt>
            <dd>
              <a href={`tel:${visitor.emergencyContact.replace(/[^\d+]/g, "")}`}>{visitor.emergencyContact}</a>
            </dd>
          </div>
          <div>
            <dt>Planned route</dt>
            <dd>{visitor.plannedRoute}</dd>
          </div>
        </dl>

        <div className="a-drawer-actions">
          <button type="button" className="a-button" onClick={() => onCreateRequest(visitor)}>
            <Icon name="chat" size={16} /> New support request
          </button>
          <a className="a-button ghost" href={`tel:${visitor.emergencyContact.replace(/[^\d+]/g, "")}`}>
            <Icon name="phone" size={16} /> Call contact
          </a>
        </div>

        <section className="a-notes">
          <h3>Case notes</h3>
          <form onSubmit={addNote} className="a-note-form">
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a note — calls, pickups, changes to plans..."
              rows={3}
            />
            <button type="submit" className="a-button" disabled={!note.trim()}>
              Add note
            </button>
          </form>
          {notes.length ? (
            <ol className="a-timeline">
              {notes.map((item, index) => (
                <li key={`${item.at}-${index}`}>
                  <p>{item.text}</p>
                  <small>{formatDate(item.at)} · {timeAgo(item.at)}</small>
                </li>
              ))}
            </ol>
          ) : (
            <p className="a-muted">No notes yet.</p>
          )}
        </section>

        <button type="button" className="a-button danger" onClick={remove}>
          Delete registration
        </button>
      </div>
    </Modal>
  );
}

function VisitorForm({ onClose, onSave }) {
  const [data, setData] = useState(emptyVisitor);
  const [saving, setSaving] = useState(false);
  const set = (field) => (event) => setData((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await onSave(data);
    setSaving(false);
  }

  return (
    <Modal title="Add visitor" onClose={onClose} wide>
      <form className="a-form-grid" onSubmit={submit}>
        <Field label="Full name">
          <input value={data.fullName} onChange={set("fullName")} required />
        </Field>
        <Field label="Passport country">
          <input value={data.passportCountry} onChange={set("passportCountry")} required />
        </Field>
        <Field label="Arrival city">
          <select value={data.arrivalCity} onChange={set("arrivalCity")}>
            {ARRIVAL_CITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Arrival date">
          <input type="date" value={data.arrivalDate} onChange={set("arrivalDate")} required />
        </Field>
        <Field label="Hotel or first stay">
          <input value={data.hotel} onChange={set("hotel")} required />
        </Field>
        <Field label="Emergency contact">
          <input type="tel" value={data.emergencyContact} onChange={set("emergencyContact")} required />
        </Field>
        <Field label="Planned route" wide>
          <textarea value={data.plannedRoute} onChange={set("plannedRoute")} rows={3} required />
        </Field>
        <div className="a-form-actions is-wide">
          <button type="button" className="a-button ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="a-button" disabled={saving}>
            {saving ? "Saving..." : "Save visitor"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
