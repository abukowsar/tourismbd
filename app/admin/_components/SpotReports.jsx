"use client";

import { useState } from "react";
import Icon from "../../components/Icon";
import { EmptyState, Field, formatDate, Kpi, Modal, timeAgo } from "./ui";

// The questions of the "ট্যুরিস্ট স্পট সংক্রান্ত তথ্যাদি" form, in the order of the paper sheet.
const QUESTIONS = [
  { key: "spotName", no: "১", bn: "ট্যুরিস্ট স্পটের নাম", en: "Tourist spot name", rows: 0 },
  { key: "address", no: "১", bn: "ঠিকানা", en: "Address", rows: 0 },
  { key: "history", no: "২", bn: "ইতিহাস", en: "History", rows: 3 },
  { key: "importance", no: "৩", bn: "পর্যটন স্পট হিসেবে গুরুত্ব / কি কি সুবিধা রয়েছে", en: "Importance as a tourist spot / facilities available", rows: 3 },
  { key: "transport", no: "৪", bn: "যাতায়াত ব্যবস্থা", en: "Transport", rows: 3 },
  { key: "accommodation", no: "৫", bn: "একোমোডেশন", en: "Accommodation", rows: 3 },
  { key: "crimes", no: "৬", bn: "স্পটটিতে কি ধরণের অপরাধ সংগঠিত হয়", en: "Types of crime that occur at the spot", rows: 3 },
  { key: "otherProblems", no: "৭", bn: "অন্যান্য আর কি সমস্যা রয়েছে?", en: "Other problems", rows: 3 },
  { key: "solutions", no: "৮", bn: "অপরাধ ও সমস্যা সমাধানের উপায় কি হতে পারে?", en: "How the crimes and problems could be solved", rows: 3 },
  { key: "dailyVisitors", no: "৯", bn: "স্পটে দৈনন্দিন কি পরিমান পর্যটক সমাগম হয়?", en: "Daily number of tourists", rows: 0 },
  { key: "attractionMeasures", no: "১০", bn: "পর্যটকদের আকৃষ্ট করার জন্য কি কি ব্যবস্থা গ্রহণ করা যেতে পারে?", en: "Steps that could attract more tourists", rows: 3 },
];

const emptyReport = Object.fromEntries(QUESTIONS.map((question) => [question.key, ""]));

function matches(item, query) {
  const term = query.trim().toLowerCase();
  return (
    !term ||
    QUESTIONS.map((question) => item[question.key] || "")
      .concat(item.createdBy || "")
      .join(" ")
      .toLowerCase()
      .includes(term)
  );
}

export default function SpotReports({ store, notify }) {
  const { items } = store;
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);

  const filtered = items.filter((item) => matches(item, query));
  const thisMonth = items.filter((item) => {
    const created = new Date(item.createdAt);
    const now = new Date();
    return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
  }).length;
  const withCrime = items.filter((item) => item.crimes?.trim()).length;
  const officers = new Set(items.map((item) => item.createdBy).filter(Boolean)).size;

  async function save(data) {
    if (editing.id) {
      if (!(await store.update(editing.id, data))) return;
      notify("Report updated");
    } else {
      if (!(await store.create(data))) return;
      notify("Report submitted");
    }
    setEditing(null);
  }

  async function remove(item) {
    if (window.confirm(`Delete the report for “${item.spotName}”?`) && (await store.remove(item.id))) {
      notify("Report deleted");
      setEditing(null);
      setViewing(null);
    }
  }

  return (
    <div className="a-stack">
      <section className="a-kpis" aria-label="Spot report key numbers">
        <Kpi icon="landmark" label="Spot reports" value={items.length} detail="Tourist spots on record" />
        <Kpi icon="calendar" label="Filed this month" value={thisMonth} detail="New reports since the 1st" />
        <Kpi icon="info" label="Spots reporting crime" value={withCrime} tone={withCrime ? "is-critical" : ""} detail="Question ৬ answered" />
        <Kpi icon="shield" label="Reporting officers" value={officers} detail="Distinct submitters" />
      </section>

      <div className="a-card">
        <div className="a-toolbar">
          <label className="a-search">
            <Icon name="search" size={18} />
            <span className="sr-only">Search spot reports</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search spot, address, crime, officer..."
            />
          </label>
          <div className="a-toolbar-actions">
            <button type="button" className="a-button" onClick={() => setEditing(emptyReport)}>
              + New spot report
            </button>
          </div>
        </div>

        {filtered.length ? (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th scope="col">Tourist spot</th>
                  <th scope="col">Crimes reported</th>
                  <th scope="col">Daily tourists</th>
                  <th scope="col">Submitted</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <button type="button" className="a-name" onClick={() => setViewing(item)}>
                        <span className="a-avatar" aria-hidden="true">{item.spotName.charAt(0)}</span>
                        <span>
                          <strong>{item.spotName}</strong>
                          <small className="a-clip">{item.address}</small>
                        </span>
                      </button>
                    </td>
                    <td>
                      <small className="a-clip">{item.crimes || "—"}</small>
                    </td>
                    <td>
                      <strong>{item.dailyVisitors || "—"}</strong>
                    </td>
                    <td>
                      <strong>{item.createdBy || "—"}</strong>
                      <small>{formatDate(item.createdAt)}</small>
                    </td>
                    <td>
                      <button type="button" className="a-icon-button" aria-label={`Open ${item.spotName}`} onClick={() => setViewing(item)}>
                        <Icon name="arrow" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon="landmark" title={items.length ? "No reports match" : "No spot reports yet"}>
            {items.length ? "Try a different search." : "File the tourist spot information form for a spot in your area."}
          </EmptyState>
        )}
        <p className="a-table-foot">Showing {filtered.length} of {items.length} reports</p>
      </div>

      {viewing ? (
        <ReportView
          report={items.find((item) => item.id === viewing.id) || viewing}
          onClose={() => setViewing(null)}
          onEdit={(report) => {
            setViewing(null);
            setEditing(report);
          }}
        />
      ) : null}
      {editing ? (
        <ReportForm report={editing} onClose={() => setEditing(null)} onSave={save} onDelete={remove} />
      ) : null}
    </div>
  );
}

function ReportView({ report, onClose, onEdit }) {
  const submitted = [report.createdBy && `Submitted by ${report.createdBy}`, formatDate(report.createdAt)]
    .filter(Boolean)
    .join(" · ");
  const updated = report.updatedBy && report.updatedAt !== report.createdAt
    ? `Last updated by ${report.updatedBy} · ${timeAgo(report.updatedAt)}`
    : "";

  return (
    <Modal title={report.spotName} onClose={onClose} wide>
      <p className="a-muted">{[submitted, updated].filter(Boolean).join(" — ")}</p>
      <dl className="a-details a-spot-details">
        {QUESTIONS.slice(1).map((question) => (
          <div key={question.key}>
            <dt>
              {question.no}. {question.bn}
              <small>{question.en}</small>
            </dt>
            <dd>{report[question.key] || "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="a-form-actions">
        <button type="button" className="a-button ghost" onClick={onClose}>Close</button>
        <button type="button" className="a-button" onClick={() => onEdit(report)}>Edit report</button>
      </div>
    </Modal>
  );
}

function ReportForm({ report, onClose, onSave, onDelete }) {
  const [data, setData] = useState(() => ({ ...emptyReport, ...report }));
  const [saving, setSaving] = useState(false);
  const set = (field) => (event) => setData((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await onSave(Object.fromEntries(Object.keys(emptyReport).map((key) => [key, data[key] ?? ""])));
    setSaving(false);
  }

  return (
    <Modal title={report.id ? `Edit report — ${report.spotName}` : "ট্যুরিস্ট স্পট সংক্রান্ত তথ্যাদি"} onClose={onClose} wide>
      <form className="a-form-grid" onSubmit={submit}>
        {QUESTIONS.map((question) => (
          <Field
            key={question.key}
            label={`${question.no}. ${question.bn}`}
            hint={question.en}
            wide={question.rows > 0}
          >
            {question.rows ? (
              <textarea value={data[question.key]} onChange={set(question.key)} rows={question.rows} />
            ) : (
              <input
                value={data[question.key]}
                onChange={set(question.key)}
                required={question.key === "spotName"}
                placeholder={question.key === "dailyVisitors" ? "e.g. 2,000–3,000; 10,000+ on holidays" : undefined}
              />
            )}
          </Field>
        ))}
        <div className="a-form-actions is-wide">
          {report.id ? (
            <button type="button" className="a-button danger" onClick={() => onDelete(report)}>
              Delete
            </button>
          ) : null}
          <button type="button" className="a-button ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="a-button" disabled={saving}>
            {saving ? "Saving..." : report.id ? "Save changes" : "Submit report"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
