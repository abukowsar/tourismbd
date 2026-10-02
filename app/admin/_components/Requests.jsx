"use client";

import { useState } from "react";
import Icon from "../../components/Icon";
import {
  REQUEST_CATEGORIES,
  REQUEST_PRIORITIES,
  REQUEST_STATES,
} from "../../../lib/admin-constants";
import { Field, Modal, Pill, timeAgo } from "./ui";

const emptyRequest = {
  title: "",
  visitorId: "",
  visitorName: "",
  category: "Other",
  priority: "normal",
  state: "new",
  owner: "",
  details: "",
};

const columnLabels = { new: "New", open: "Open", "in review": "In review", done: "Done" };

export default function Requests({ store, visitors, draft, clearDraft, notify }) {
  const { items: requests } = store;
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [editing, setEditing] = useState(null);
  const form = editing || draft;

  const filtered = requests
    .filter((item) => priority === "all" || item.priority === priority)
    .filter((item) => {
      const term = query.trim().toLowerCase();
      return (
        !term ||
        [item.title, item.visitorName, item.owner, item.category, item.details].join(" ").toLowerCase().includes(term)
      );
    })
    .sort(
      (a, b) =>
        REQUEST_PRIORITIES.indexOf(a.priority) - REQUEST_PRIORITIES.indexOf(b.priority) ||
        new Date(b.createdAt) - new Date(a.createdAt),
    );

  function close() {
    setEditing(null);
    clearDraft();
  }

  async function save(data) {
    if (form.id) {
      if (await store.update(form.id, data)) {
        notify("Request updated");
        close();
      }
    } else if (await store.create(data)) {
      notify("Request created");
      close();
    }
  }

  async function remove(item) {
    if (window.confirm(`Delete “${item.title}”?`) && (await store.remove(item.id))) {
      notify("Request deleted");
      close();
    }
  }

  function move(item, direction) {
    const next = REQUEST_STATES[REQUEST_STATES.indexOf(item.state) + direction];
    if (next) {
      store.update(item.id, { state: next });
    }
  }

  return (
    <div className="a-stack">
      <div className="a-card">
        <div className="a-toolbar">
          <label className="a-search">
            <Icon name="search" size={18} />
            <span className="sr-only">Search requests</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search requests, visitors, owners..."
            />
          </label>
          <select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Priority">
            <option value="all">All priorities</option>
            {REQUEST_PRIORITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <div className="a-toolbar-actions">
            <button type="button" className="a-button" onClick={() => setEditing(emptyRequest)}>
              + New request
            </button>
          </div>
        </div>
      </div>

      <div className="a-board">
        {REQUEST_STATES.map((state, stateIndex) => {
          const cards = filtered.filter((item) => item.state === state);
          return (
            <section key={state} className={`a-column-lane lane-${state.replace(" ", "-")}`} aria-label={columnLabels[state]}>
              <header>
                <h2>{columnLabels[state]}</h2>
                <b>{cards.length}</b>
              </header>
              {cards.map((item) => (
                <article key={item.id} className="a-ticket">
                  <div className="a-ticket-top">
                    <Pill value={item.priority} />
                    <small>{item.category}</small>
                  </div>
                  <button type="button" className="a-ticket-title" onClick={() => setEditing(item)}>
                    {item.title}
                  </button>
                  {item.visitorName ? (
                    <p className="a-ticket-meta"><Icon name="passport" size={14} /> {item.visitorName}</p>
                  ) : null}
                  <p className="a-ticket-meta">
                    <Icon name="shield" size={14} /> {item.owner || "Unassigned"} · {timeAgo(item.createdAt)}
                  </p>
                  <div className="a-ticket-actions">
                    <button
                      type="button"
                      className="a-icon-button"
                      aria-label={`Move “${item.title}” back`}
                      disabled={stateIndex === 0}
                      onClick={() => move(item, -1)}
                    >
                      <Icon name="arrow" size={16} className="flip" />
                    </button>
                    <button
                      type="button"
                      className="a-icon-button"
                      aria-label={`Move “${item.title}” forward`}
                      disabled={stateIndex === REQUEST_STATES.length - 1}
                      onClick={() => move(item, 1)}
                    >
                      <Icon name="arrow" size={16} />
                    </button>
                  </div>
                </article>
              ))}
              {!cards.length ? <p className="a-lane-empty">Nothing here</p> : null}
            </section>
          );
        })}
      </div>

      {form ? (
        <RequestForm request={form} visitors={visitors} onClose={close} onSave={save} onDelete={remove} />
      ) : null}
    </div>
  );
}

function RequestForm({ request, visitors, onClose, onSave, onDelete }) {
  const [data, setData] = useState(() => ({ ...emptyRequest, ...request }));
  const [saving, setSaving] = useState(false);
  const set = (field) => (event) => setData((current) => ({ ...current, [field]: event.target.value }));

  function pickVisitor(event) {
    const visitor = visitors.find((item) => item.id === event.target.value);
    setData((current) => ({
      ...current,
      visitorId: visitor?.id || "",
      visitorName: visitor?.fullName || "",
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await onSave(Object.fromEntries(Object.keys(emptyRequest).map((key) => [key, data[key] ?? ""])));
    setSaving(false);
  }

  return (
    <Modal title={request.id ? "Edit request" : "New support request"} onClose={onClose} wide>
      <form className="a-form-grid" onSubmit={submit}>
        <Field label="Title" wide>
          <input value={data.title} onChange={set("title")} required placeholder="e.g. Airport pickup at DAC" />
        </Field>
        <Field label="Visitor">
          <select value={data.visitorId} onChange={pickVisitor}>
            <option value="">No specific visitor</option>
            {visitors.map((visitor) => (
              <option key={visitor.id} value={visitor.id}>
                {visitor.fullName} — {visitor.arrivalCity}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select value={data.category} onChange={set("category")}>
            {REQUEST_CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Priority">
          <select value={data.priority} onChange={set("priority")}>
            {REQUEST_PRIORITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select value={data.state} onChange={set("state")}>
            {REQUEST_STATES.map((item) => (
              <option key={item} value={item}>{columnLabels[item]}</option>
            ))}
          </select>
        </Field>
        <Field label="Owner" wide>
          <input value={data.owner} onChange={set("owner")} placeholder="Support desk, Operations, guide name..." />
        </Field>
        <Field label="Details" wide>
          <textarea value={data.details} onChange={set("details")} rows={4} />
        </Field>
        <div className="a-form-actions is-wide">
          {request.id ? (
            <button type="button" className="a-button danger" onClick={() => onDelete(request)}>
              Delete
            </button>
          ) : null}
          <span className="a-spacer" />
          <button type="button" className="a-button ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="a-button" disabled={saving}>
            {saving ? "Saving..." : request.id ? "Save changes" : "Create request"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
