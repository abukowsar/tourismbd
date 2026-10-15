"use client";

import { useState } from "react";
import Icon from "../../components/Icon";
import { EmptyState, Field, formatDate, Modal, Pill, timeAgo } from "./ui";

const emptyUser = {
  name: "",
  username: "",
  password: "",
  badgeNo: "",
  station: "",
  phone: "",
  active: true,
};

export default function AdminUsers({ store, notify }) {
  const { items: users } = store;
  const [editing, setEditing] = useState(null);

  async function save(data) {
    if (editing.id) {
      const { username, ...patch } = data;
      if (!patch.password) delete patch.password;
      if (!(await store.update(editing.id, patch))) return;
      notify(`${data.name} updated`);
    } else {
      if (!(await store.create(data))) return;
      notify(`${data.name} can now sign in as a police admin`);
    }
    setEditing(null);
  }

  async function toggle(user) {
    if (await store.update(user.id, { active: !user.active })) {
      notify(user.active ? `${user.name} disabled` : `${user.name} enabled`);
    }
  }

  async function remove(user) {
    if (window.confirm(`Delete the police admin account for ${user.name}? They will be signed out.`) && (await store.remove(user.id))) {
      notify(`${user.name} removed`);
    }
  }

  return (
    <div className="a-stack">
      <div className="a-card">
        <header className="a-card-head">
          <div>
            <h2>Police admins</h2>
            <p>Police admins sign in at /admin/login and can only open the Tourist Police tab.</p>
          </div>
          <button type="button" className="a-button" onClick={() => setEditing(emptyUser)}>
            + Add police admin
          </button>
        </header>

        {users.length ? (
          <div className="a-table-wrap">
            <table className="a-table">
              <thead>
                <tr>
                  <th scope="col">Officer</th>
                  <th scope="col">Username</th>
                  <th scope="col">Station</th>
                  <th scope="col">Last sign-in</th>
                  <th scope="col">Access</th>
                  <th scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <button type="button" className="a-name" onClick={() => setEditing(user)}>
                        <span className="a-avatar" aria-hidden="true">{user.name.charAt(0)}</span>
                        <span>
                          <strong>{user.name}</strong>
                          <small>{user.badgeNo ? `Badge ${user.badgeNo}` : user.phone}</small>
                        </span>
                      </button>
                    </td>
                    <td><code>{user.username}</code></td>
                    <td className="a-clip">{user.station || "—"}</td>
                    <td>
                      {user.lastLoginAt ? (
                        <>
                          <strong>{timeAgo(user.lastLoginAt)}</strong>
                          <small>{formatDate(user.lastLoginAt)}</small>
                        </>
                      ) : (
                        <span className="a-muted">Never</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="a-button ghost"
                        onClick={() => toggle(user)}
                        aria-label={`${user.active ? "Disable" : "Enable"} ${user.name}`}
                      >
                        <Pill value={user.active ? "active" : "cancelled"}>{user.active ? "Active" : "Disabled"}</Pill>
                      </button>
                    </td>
                    <td>
                      <button type="button" className="a-icon-button danger" aria-label={`Delete ${user.name}`} onClick={() => remove(user)}>
                        <Icon name="close" size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon="shield" title="No police admins yet">
            Add an officer so they can update operations and criminal records.
          </EmptyState>
        )}
      </div>

      {editing ? <UserForm user={editing} onClose={() => setEditing(null)} onSave={save} /> : null}
    </div>
  );
}

function UserForm({ user, onClose, onSave }) {
  const isNew = !user.id;
  const [data, setData] = useState(() => ({ ...emptyUser, ...user, password: "" }));
  const [saving, setSaving] = useState(false);
  const set = (field) => (event) => setData((current) => ({ ...current, [field]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    await onSave(Object.fromEntries(Object.keys(emptyUser).map((key) => [key, data[key] ?? ""])));
    setSaving(false);
  }

  return (
    <Modal title={isNew ? "Add police admin" : `Edit ${user.name}`} onClose={onClose} wide>
      <form className="a-form-grid" onSubmit={submit}>
        <Field label="Full name and rank">
          <input value={data.name} onChange={set("name")} required placeholder="SI Rafiqul Islam" />
        </Field>
        <Field label="Username" hint={isNew ? "Lowercase letters, numbers, dot, dash or underscore." : "Usernames can't be changed."}>
          <input
            value={data.username}
            onChange={(event) => setData((current) => ({ ...current, username: event.target.value.toLowerCase() }))}
            required
            disabled={!isNew}
            pattern="[a-z0-9._\-]{3,40}"
            autoComplete="off"
          />
        </Field>
        <Field label={isNew ? "Password" : "New password"} hint={isNew ? "At least 8 characters." : "Leave blank to keep the current password."}>
          <input
            type="password"
            value={data.password}
            onChange={set("password")}
            required={isNew}
            minLength={8}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Badge no.">
          <input value={data.badgeNo} onChange={set("badgeNo")} />
        </Field>
        <Field label="Station / unit">
          <input value={data.station} onChange={set("station")} placeholder="Tourist Police, Cox's Bazar Region" />
        </Field>
        <Field label="Phone">
          <input type="tel" value={data.phone} onChange={set("phone")} placeholder="+880..." />
        </Field>
        <div className="a-form-actions is-wide">
          <button type="button" className="a-button ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="a-button" disabled={saving}>
            {saving ? "Saving..." : isNew ? "Create account" : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
