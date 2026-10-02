"use client";

import { useState } from "react";
import Icon from "../../components/Icon";
import { AlertBanner } from "../../components/TravelAlerts";
import { ALERT_LEVELS } from "../../../lib/admin-constants";
import { EmptyState, Field, formatDate, Pill } from "./ui";

const emptyAlert = { title: "", message: "", level: "info", region: "", active: true, expiresAt: "" };

const levelHelp = {
  info: "General news — new routes, festivals, service updates.",
  advisory: "Plan around it — limited services, closures, permits.",
  warning: "Safety risk — storms, unrest, travel disruption.",
};

export default function Alerts({ store, notify }) {
  const { items: alerts } = store;
  const [data, setData] = useState(emptyAlert);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (field) => (event) => setData((current) => ({ ...current, [field]: event.target.value }));

  function edit(alert) {
    setEditingId(alert.id);
    setData({ ...emptyAlert, ...alert, expiresAt: alert.expiresAt ? alert.expiresAt.slice(0, 10) : "" });
  }

  function reset() {
    setEditingId(null);
    setData(emptyAlert);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    const payload = {
      title: data.title,
      message: data.message,
      level: data.level,
      region: data.region,
      active: data.active,
      expiresAt: data.expiresAt || null,
    };
    const ok = editingId ? await store.update(editingId, payload) : await store.create(payload);
    setSaving(false);
    if (ok) {
      notify(editingId ? "Alert updated" : data.active ? "Alert published" : "Alert saved as draft");
      reset();
    }
  }

  async function remove(alert) {
    if (window.confirm(`Delete the alert “${alert.title}”?`) && (await store.remove(alert.id))) {
      notify("Alert deleted");
      if (editingId === alert.id) reset();
    }
  }

  const expired = (alert) => alert.expiresAt && new Date(alert.expiresAt) < new Date();

  return (
    <div className="a-alerts-layout">
      <div className="a-card">
        <header className="a-card-head">
          <div>
            <h2>Published alerts</h2>
            <p>Up to 3 live alerts show on the public home page, most severe first.</p>
          </div>
        </header>

        {alerts.length ? (
          <ul className="a-alert-list">
            {alerts.map((alert) => (
              <li key={alert.id} className={editingId === alert.id ? "is-editing" : ""}>
                <div className="a-alert-main">
                  <div className="a-alert-title">
                    <Pill value={alert.level} />
                    <strong>{alert.title}</strong>
                  </div>
                  <p>{alert.message}</p>
                  <small>
                    {alert.region ? `${alert.region} · ` : ""}
                    Created {formatDate(alert.createdAt)}
                    {alert.expiresAt ? ` · ${expired(alert) ? "Expired" : "Expires"} ${formatDate(alert.expiresAt)}` : ""}
                  </small>
                </div>
                <div className="a-alert-actions">
                  <label className="a-switch">
                    <input
                      type="checkbox"
                      checked={Boolean(alert.active)}
                      onChange={(event) => store.update(alert.id, { active: event.target.checked })}
                    />
                    <span>{alert.active ? (expired(alert) ? "Live (expired)" : "Live") : "Hidden"}</span>
                  </label>
                  <button type="button" className="a-button ghost" onClick={() => edit(alert)}>Edit</button>
                  <button type="button" className="a-icon-button danger" aria-label={`Delete ${alert.title}`} onClick={() => remove(alert)}>
                    <Icon name="close" size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon="shield" title="No alerts yet">
            Publish weather warnings, closures, or festival news for travelers.
          </EmptyState>
        )}
      </div>

      <div className="a-card">
        <header className="a-card-head">
          <div>
            <h2>{editingId ? "Edit alert" : "New alert"}</h2>
            <p>{levelHelp[data.level]}</p>
          </div>
        </header>
        <form className="a-form-grid single" onSubmit={submit}>
          <Field label="Level">
            <div className="a-segmented" role="radiogroup" aria-label="Alert level">
              {ALERT_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  role="radio"
                  aria-checked={data.level === level}
                  className={data.level === level ? `is-active level-${level}` : ""}
                  onClick={() => setData((current) => ({ ...current, level }))}
                >
                  {level}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Title">
            <input value={data.title} onChange={set("title")} required maxLength={120} />
          </Field>
          <Field label="Message" hint={`${data.message.length}/500`}>
            <textarea value={data.message} onChange={set("message")} rows={3} required maxLength={500} />
          </Field>
          <div className="a-form-grid">
            <Field label="Region (optional)">
              <input value={data.region} onChange={set("region")} placeholder="Sylhet, Nationwide..." />
            </Field>
            <Field label="Expires (optional)">
              <input type="date" value={data.expiresAt} onChange={set("expiresAt")} />
            </Field>
          </div>
          <label className="a-switch">
            <input
              type="checkbox"
              checked={data.active}
              onChange={(event) => setData((current) => ({ ...current, active: event.target.checked }))}
            />
            <span>Show on the website</span>
          </label>

          <div className="a-preview">
            <small>Preview</small>
            <AlertBanner alert={data} />
          </div>

          <div className="a-form-actions">
            {editingId ? (
              <button type="button" className="a-button ghost" onClick={reset}>Cancel edit</button>
            ) : null}
            <span className="a-spacer" />
            <button type="submit" className="a-button" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save changes" : data.active ? "Publish alert" : "Save draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
