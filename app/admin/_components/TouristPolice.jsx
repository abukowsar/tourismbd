"use client";

import { useState } from "react";
import Icon from "../../components/Icon";
import {
  CRIMINAL_STATUSES,
  OFFENSE_TYPES,
  OPERATION_STATUSES,
  OPERATION_TYPES,
  THREAT_LEVELS,
} from "../../../lib/admin-constants";
import { daysUntil, EmptyState, Field, formatDate, Kpi, Modal, Pill, timeAgo } from "./ui";

const emptyOperation = {
  title: "",
  type: "Patrol",
  status: "planned",
  zone: "",
  location: "",
  startAt: "",
  endAt: "",
  officerInCharge: "",
  teamSize: "",
  details: "",
  outcome: "",
};

const emptyCriminal = {
  name: "",
  alias: "",
  age: "",
  nationality: "",
  idNumber: "",
  offenseType: "Other",
  caseNo: "",
  status: "under investigation",
  threatLevel: "medium",
  zone: "",
  lastKnownLocation: "",
  incidentDate: "",
  description: "",
};

const threatTones = { high: "critical", medium: "serious", low: "muted" };

function matches(item, fields, query) {
  const term = query.trim().toLowerCase();
  return !term || fields.map((field) => item[field] || "").join(" ").toLowerCase().includes(term);
}

/** Date inputs want yyyy-mm-dd; stored values are ISO strings. */
function toDateInput(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function auditLine(item) {
  return item.updatedBy ? `Updated by ${item.updatedBy}${item.updatedAt ? ` · ${timeAgo(item.updatedAt)}` : ""}` : "";
}

export default function TouristPolice({ operations, criminals, notify }) {
  const [view, setView] = useState("operations");

  const ongoing = operations.items.filter((item) => item.status === "ongoing").length;
  const plannedSoon = operations.items.filter((item) => {
    const days = daysUntil(item.startAt);
    return item.status === "planned" && days !== null && days >= 0 && days <= 7;
  }).length;
  const wanted = criminals.items.filter((item) => item.status === "wanted").length;
  const highThreat = criminals.items.filter(
    (item) => item.threatLevel === "high" && !["convicted", "released"].includes(item.status),
  ).length;

  return (
    <div className="a-stack">
      <section className="a-kpis" aria-label="Tourist police key numbers">
        <Kpi icon="shield" label="Ongoing operations" value={ongoing} detail={`${operations.items.length} operations on record`} />
        <Kpi icon="calendar" label="Planned in 7 days" value={plannedSoon} detail="Operations starting this week" />
        <Kpi icon="search" label="Wanted persons" value={wanted} tone={wanted ? "is-critical" : ""} detail={`${criminals.items.length} criminal records`} />
        <Kpi icon="info" label="High-threat open cases" value={highThreat} tone={highThreat ? "is-critical" : ""} detail="Not yet convicted or released" />
      </section>

      <div className="a-chips" role="group" aria-label="Tourist police records">
        <button
          type="button"
          className={`a-chip${view === "operations" ? " is-active" : ""}`}
          aria-pressed={view === "operations"}
          onClick={() => setView("operations")}
        >
          Operations <b>{operations.items.length}</b>
        </button>
        <button
          type="button"
          className={`a-chip${view === "criminals" ? " is-active" : ""}`}
          aria-pressed={view === "criminals"}
          onClick={() => setView("criminals")}
        >
          Criminal records <b>{criminals.items.length}</b>
        </button>
      </div>

      {view === "operations" ? (
        <Operations store={operations} notify={notify} />
      ) : (
        <Criminals store={criminals} notify={notify} />
      )}
    </div>
  );
}

function Operations({ store, notify }) {
  const { items } = store;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);

  const filtered = items
    .filter((item) => status === "all" || item.status === status)
    .filter((item) => matches(item, ["title", "type", "zone", "location", "officerInCharge", "details"], query));

  async function save(data) {
    if (editing.id) {
      if (!(await store.update(editing.id, data))) return;
      notify("Operation updated");
    } else {
      if (!(await store.create(data))) return;
      notify("Operation added");
    }
    setEditing(null);
  }

  async function remove(item) {
    if (window.confirm(`Delete operation “${item.title}”?`) && (await store.remove(item.id))) {
      notify("Operation deleted");
      setEditing(null);
    }
  }

  return (
    <div className="a-card">
      <div className="a-toolbar">
        <label className="a-search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search operations</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, zone, location, officer..."
          />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Operation status">
          <option value="all">All statuses</option>
          {OPERATION_STATUSES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <div className="a-toolbar-actions">
          <button type="button" className="a-button" onClick={() => setEditing(emptyOperation)}>
            + Add operation
          </button>
        </div>
      </div>

      {filtered.length ? (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th scope="col">Operation</th>
                <th scope="col">Zone</th>
                <th scope="col">Dates</th>
                <th scope="col">Officer in charge</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.title}</strong>
                    <small>{item.type}{auditLine(item) ? ` · ${auditLine(item)}` : ""}</small>
                  </td>
                  <td>
                    <strong>{item.zone || "—"}</strong>
                    <small className="a-clip">{item.location}</small>
                  </td>
                  <td>
                    <strong>{formatDate(item.startAt)}</strong>
                    <small>{item.endAt ? `to ${formatDate(item.endAt)}` : "No end date"}</small>
                  </td>
                  <td>
                    <strong>{item.officerInCharge || "—"}</strong>
                    <small>{item.teamSize ? `Team of ${item.teamSize}` : ""}</small>
                  </td>
                  <td>
                    <select
                      className="a-status-select"
                      data-status={item.status}
                      value={item.status}
                      onChange={(event) => store.update(item.id, { status: event.target.value })}
                      aria-label={`Status for ${item.title}`}
                    >
                      {OPERATION_STATUSES.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button type="button" className="a-icon-button" aria-label={`Edit ${item.title}`} onClick={() => setEditing(item)}>
                      <Icon name="arrow" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="shield" title={items.length ? "No operations match" : "No operations yet"}>
          {items.length ? "Try a different search or status." : "Add a patrol, checkpoint, drive or rescue operation."}
        </EmptyState>
      )}
      <p className="a-table-foot">Showing {filtered.length} of {items.length} operations</p>

      {editing ? (
        <OperationForm operation={editing} onClose={() => setEditing(null)} onSave={save} onDelete={remove} />
      ) : null}
    </div>
  );
}

function OperationForm({ operation, onClose, onSave, onDelete }) {
  const [data, setData] = useState(() => ({
    ...emptyOperation,
    ...operation,
    startAt: toDateInput(operation.startAt),
    endAt: toDateInput(operation.endAt),
  }));
  const [saving, setSaving] = useState(false);
  const set = (field) => (event) => setData((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await onSave(Object.fromEntries(Object.keys(emptyOperation).map((key) => [key, data[key] ?? ""])));
    setSaving(false);
  }

  return (
    <Modal title={operation.id ? "Edit operation" : "Add operation"} onClose={onClose} wide>
      <form className="a-form-grid" onSubmit={submit}>
        <Field label="Operation title" wide>
          <input value={data.title} onChange={set("title")} required placeholder="Beach patrol — Kolatoli to Sugandha" />
        </Field>
        <Field label="Type">
          <select value={data.type} onChange={set("type")}>
            {OPERATION_TYPES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select value={data.status} onChange={set("status")}>
            {OPERATION_STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Zone / district">
          <input value={data.zone} onChange={set("zone")} placeholder="Cox's Bazar" />
        </Field>
        <Field label="Location">
          <input value={data.location} onChange={set("location")} placeholder="Sugandha Point" />
        </Field>
        <Field label="Start date">
          <input type="date" value={data.startAt} onChange={set("startAt")} required />
        </Field>
        <Field label="End date">
          <input type="date" value={data.endAt} onChange={set("endAt")} min={data.startAt || undefined} />
        </Field>
        <Field label="Officer in charge">
          <input value={data.officerInCharge} onChange={set("officerInCharge")} placeholder="Rank and name" />
        </Field>
        <Field label="Team size">
          <input value={data.teamSize} onChange={set("teamSize")} inputMode="numeric" placeholder="8" />
        </Field>
        <Field label="Details" wide>
          <textarea value={data.details} onChange={set("details")} rows={3} placeholder="Objective, route, assigned units..." />
        </Field>
        <Field label="Outcome" wide>
          <textarea value={data.outcome} onChange={set("outcome")} rows={3} placeholder="Results, arrests, tourists assisted..." />
        </Field>
        {operation.id && auditLine(operation) ? <p className="a-muted is-wide">{auditLine(operation)}</p> : null}
        <div className="a-form-actions is-wide">
          {operation.id ? (
            <button type="button" className="a-button danger" onClick={() => onDelete(operation)}>
              Delete
            </button>
          ) : null}
          <button type="button" className="a-button ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="a-button" disabled={saving}>
            {saving ? "Saving..." : operation.id ? "Save changes" : "Add operation"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Criminals({ store, notify }) {
  const { items } = store;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [offense, setOffense] = useState("all");
  const [editing, setEditing] = useState(null);

  const filtered = items
    .filter((item) => status === "all" || item.status === status)
    .filter((item) => offense === "all" || item.offenseType === offense)
    .filter((item) =>
      matches(item, ["name", "alias", "caseNo", "idNumber", "nationality", "zone", "lastKnownLocation", "description"], query),
    )
    .sort((a, b) => THREAT_LEVELS.indexOf(a.threatLevel) - THREAT_LEVELS.indexOf(b.threatLevel));

  async function save(data) {
    if (editing.id) {
      if (!(await store.update(editing.id, data))) return;
      notify("Record updated");
    } else {
      if (!(await store.create(data))) return;
      notify("Record added");
    }
    setEditing(null);
  }

  async function remove(item) {
    if (window.confirm(`Delete the record for ${item.name}?`) && (await store.remove(item.id))) {
      notify("Record deleted");
      setEditing(null);
    }
  }

  return (
    <div className="a-card">
      <div className="a-toolbar">
        <label className="a-search">
          <Icon name="search" size={18} />
          <span className="sr-only">Search criminal records</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, alias, case no., ID, location..."
          />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Record status">
          <option value="all">All statuses</option>
          {CRIMINAL_STATUSES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select value={offense} onChange={(event) => setOffense(event.target.value)} aria-label="Offense type">
          <option value="all">All offenses</option>
          {OFFENSE_TYPES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <div className="a-toolbar-actions">
          <button type="button" className="a-button" onClick={() => setEditing(emptyCriminal)}>
            + Add record
          </button>
        </div>
      </div>

      {filtered.length ? (
        <div className="a-table-wrap">
          <table className="a-table">
            <thead>
              <tr>
                <th scope="col">Person</th>
                <th scope="col">Offense</th>
                <th scope="col">Last known location</th>
                <th scope="col">Threat</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <button type="button" className="a-name" onClick={() => setEditing(item)}>
                      <span className="a-avatar" aria-hidden="true">{item.name.charAt(0)}</span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>{[item.alias && `“${item.alias}”`, item.nationality].filter(Boolean).join(" · ")}</small>
                      </span>
                    </button>
                  </td>
                  <td>
                    <strong>{item.offenseType}</strong>
                    <small>{[item.caseNo, item.incidentDate && formatDate(item.incidentDate)].filter(Boolean).join(" · ")}</small>
                  </td>
                  <td>
                    <strong>{item.zone || "—"}</strong>
                    <small className="a-clip">{item.lastKnownLocation}</small>
                  </td>
                  <td>
                    <Pill value={item.threatLevel} tone={threatTones[item.threatLevel]} />
                  </td>
                  <td>
                    <select
                      className="a-status-select"
                      data-status={item.status}
                      value={item.status}
                      onChange={(event) => store.update(item.id, { status: event.target.value })}
                      aria-label={`Status for ${item.name}`}
                    >
                      {CRIMINAL_STATUSES.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button type="button" className="a-icon-button" aria-label={`Edit ${item.name}`} onClick={() => setEditing(item)}>
                      <Icon name="arrow" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="search" title={items.length ? "No records match" : "No criminal records yet"}>
          {items.length ? "Try a different search or filter." : "Add a suspect, wanted person or case record."}
        </EmptyState>
      )}
      <p className="a-table-foot">Showing {filtered.length} of {items.length} records</p>

      {editing ? (
        <CriminalForm record={editing} onClose={() => setEditing(null)} onSave={save} onDelete={remove} />
      ) : null}
    </div>
  );
}

function CriminalForm({ record, onClose, onSave, onDelete }) {
  const [data, setData] = useState(() => ({
    ...emptyCriminal,
    ...record,
    incidentDate: toDateInput(record.incidentDate),
  }));
  const [saving, setSaving] = useState(false);
  const set = (field) => (event) => setData((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await onSave(Object.fromEntries(Object.keys(emptyCriminal).map((key) => [key, data[key] ?? ""])));
    setSaving(false);
  }

  return (
    <Modal title={record.id ? `Edit record — ${record.name}` : "Add criminal record"} onClose={onClose} wide>
      <form className="a-form-grid" onSubmit={submit}>
        <Field label="Name">
          <input value={data.name} onChange={set("name")} required placeholder="Full name or “Unknown”" />
        </Field>
        <Field label="Alias">
          <input value={data.alias} onChange={set("alias")} />
        </Field>
        <Field label="Age">
          <input value={data.age} onChange={set("age")} placeholder="30 or 25-30" />
        </Field>
        <Field label="Nationality">
          <input value={data.nationality} onChange={set("nationality")} placeholder="Bangladesh" />
        </Field>
        <Field label="NID / passport no.">
          <input value={data.idNumber} onChange={set("idNumber")} />
        </Field>
        <Field label="Case no.">
          <input value={data.caseNo} onChange={set("caseNo")} placeholder="CXB-2026-000" />
        </Field>
        <Field label="Offense type">
          <select value={data.offenseType} onChange={set("offenseType")}>
            {OFFENSE_TYPES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Incident date">
          <input type="date" value={data.incidentDate} onChange={set("incidentDate")} />
        </Field>
        <Field label="Status">
          <select value={data.status} onChange={set("status")}>
            {CRIMINAL_STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Threat level">
          <select value={data.threatLevel} onChange={set("threatLevel")}>
            {THREAT_LEVELS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Zone / district">
          <input value={data.zone} onChange={set("zone")} placeholder="Cox's Bazar" />
        </Field>
        <Field label="Last known location">
          <input value={data.lastKnownLocation} onChange={set("lastKnownLocation")} />
        </Field>
        <Field label="Description" wide>
          <textarea value={data.description} onChange={set("description")} rows={4} placeholder="Modus operandi, appearance, vehicle, linked cases..." />
        </Field>
        {record.id && auditLine(record) ? <p className="a-muted is-wide">{auditLine(record)}</p> : null}
        <div className="a-form-actions is-wide">
          {record.id ? (
            <button type="button" className="a-button danger" onClick={() => onDelete(record)}>
              Delete
            </button>
          ) : null}
          <button type="button" className="a-button ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="a-button" disabled={saving}>
            {saving ? "Saving..." : record.id ? "Save changes" : "Add record"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
