"use client";

import { useMemo, useState } from "react";
import Icon from "../../components/Icon";
import { GUIDE_STATUSES } from "../../../lib/admin-constants";
import { EmptyState, Field, Modal, Pill } from "./ui";

const emptyGuide = {
  name: "",
  languages: "",
  regions: "",
  phone: "",
  email: "",
  licenseNo: "",
  status: "available",
  notes: "",
};

export default function Guides({ store, visitorStore, notify }) {
  const { items: guides } = store;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);

  const workload = useMemo(() => {
    const counts = {};
    visitorStore.items
      .filter((visitor) => !["completed", "cancelled"].includes(visitor.status))
      .forEach((visitor) => {
        if (visitor.guideName) {
          counts[visitor.guideName] = (counts[visitor.guideName] || 0) + 1;
        }
      });
    return counts;
  }, [visitorStore.items]);

  const filtered = guides.filter((guide) => {
    const term = query.trim().toLowerCase();
    return (
      (status === "all" || guide.status === status) &&
      (!term ||
        [guide.name, guide.languages, guide.regions, guide.licenseNo].join(" ").toLowerCase().includes(term))
    );
  });

  async function save(data) {
    if (editing.id) {
      const previousName = editing.name;
      if (!(await store.update(editing.id, data))) return;

      // Visitors reference guides by name, so carry a rename over to their records.
      if (previousName && data.name !== previousName) {
        await Promise.all(
          visitorStore.items
            .filter((visitor) => visitor.guideName === previousName)
            .map((visitor) => visitorStore.update(visitor.id, { guideName: data.name })),
        );
      }
      notify(`${data.name} updated`);
    } else {
      if (!(await store.create(data))) return;
      notify(`${data.name} added to the roster`);
    }
    setEditing(null);
  }

  async function remove(guide) {
    const assigned = workload[guide.name] || 0;
    const warning = assigned
      ? ` They are assigned to ${assigned} active ${assigned === 1 ? "visitor" : "visitors"}, who will become unassigned.`
      : "";
    if (!window.confirm(`Remove ${guide.name} from the roster?${warning}`)) return;

    if (await store.remove(guide.id)) {
      await Promise.all(
        visitorStore.items
          .filter((visitor) => visitor.guideName === guide.name)
          .map((visitor) => visitorStore.update(visitor.id, { guideName: "" })),
      );
      notify(`${guide.name} removed`);
    }
  }

  return (
    <div className="a-stack">
      <div className="a-card">
        <div className="a-toolbar">
          <label className="a-search">
            <Icon name="search" size={18} />
            <span className="sr-only">Search guides</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, language, region..."
            />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Guide status">
            <option value="all">All statuses</option>
            {GUIDE_STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <div className="a-toolbar-actions">
            <button type="button" className="a-button" onClick={() => setEditing(emptyGuide)}>
              + Add guide
            </button>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="a-guide-grid">
          {filtered.map((guide) => (
            <article key={guide.id} className="a-card a-guide">
              <header>
                <span className="a-avatar large" aria-hidden="true">
                  {guide.name.split(" ").map((part) => part.charAt(0)).slice(0, 2).join("")}
                </span>
                <div>
                  <h3>{guide.name}</h3>
                  <small>{guide.licenseNo ? `License ${guide.licenseNo}` : "No license number"}</small>
                </div>
                <Pill value={guide.status} />
              </header>

              <dl className="a-guide-facts">
                <div>
                  <dt><Icon name="chat" size={15} /> Languages</dt>
                  <dd>{guide.languages || "Not listed"}</dd>
                </div>
                <div>
                  <dt><Icon name="pin" size={15} /> Regions</dt>
                  <dd>{guide.regions || "Not listed"}</dd>
                </div>
                <div>
                  <dt><Icon name="passport" size={15} /> Active visitors</dt>
                  <dd>{workload[guide.name] || 0}</dd>
                </div>
              </dl>

              {guide.notes ? <p className="a-guide-notes">{guide.notes}</p> : null}

              <div className="a-guide-contact">
                {guide.phone ? (
                  <a href={`tel:${guide.phone.replace(/[^\d+]/g, "")}`}>
                    <Icon name="phone" size={15} /> {guide.phone}
                  </a>
                ) : null}
                {guide.email ? (
                  <a href={`mailto:${guide.email}`}>
                    <Icon name="chat" size={15} /> {guide.email}
                  </a>
                ) : null}
              </div>

              <footer>
                <select
                  value={guide.status}
                  onChange={(event) => store.update(guide.id, { status: event.target.value })}
                  aria-label={`Status for ${guide.name}`}
                >
                  {GUIDE_STATUSES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <button type="button" className="a-button ghost" onClick={() => setEditing(guide)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="a-icon-button danger"
                  aria-label={`Remove ${guide.name}`}
                  onClick={() => remove(guide)}
                >
                  <Icon name="close" size={18} />
                </button>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="a-card">
          <EmptyState icon="shield" title={guides.length ? "No guides match" : "No guides yet"}>
            {guides.length ? "Try a different search or status." : "Add your first licensed tour guide."}
          </EmptyState>
        </div>
      )}

      {editing ? <GuideForm guide={editing} onClose={() => setEditing(null)} onSave={save} /> : null}
    </div>
  );
}

function GuideForm({ guide, onClose, onSave }) {
  const [data, setData] = useState(() => ({ ...emptyGuide, ...guide }));
  const [saving, setSaving] = useState(false);
  const set = (field) => (event) => setData((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await onSave(Object.fromEntries(Object.keys(emptyGuide).map((key) => [key, data[key] ?? ""])));
    setSaving(false);
  }

  return (
    <Modal title={guide.id ? `Edit ${guide.name}` : "Add tour guide"} onClose={onClose} wide>
      <form className="a-form-grid" onSubmit={submit}>
        <Field label="Full name">
          <input value={data.name} onChange={set("name")} required />
        </Field>
        <Field label="Guide license no.">
          <input value={data.licenseNo} onChange={set("licenseNo")} placeholder="TG-0000" />
        </Field>
        <Field label="Languages">
          <input value={data.languages} onChange={set("languages")} placeholder="English, Bengali" />
        </Field>
        <Field label="Regions covered">
          <input value={data.regions} onChange={set("regions")} placeholder="Sylhet, Sreemangal" />
        </Field>
        <Field label="Phone">
          <input type="tel" value={data.phone} onChange={set("phone")} placeholder="+880..." />
        </Field>
        <Field label="Email">
          <input type="email" value={data.email} onChange={set("email")} />
        </Field>
        <Field label="Status">
          <select value={data.status} onChange={set("status")}>
            {GUIDE_STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="Notes" wide>
          <textarea value={data.notes} onChange={set("notes")} rows={3} placeholder="Specialties, permits, availability..." />
        </Field>
        <div className="a-form-actions is-wide">
          <button type="button" className="a-button ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="a-button" disabled={saving}>
            {saving ? "Saving..." : guide.id ? "Save changes" : "Add guide"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
