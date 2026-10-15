"use client";

import { useCallback, useEffect, useState } from "react";

async function request(url, options) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (response.status === 401) {
    window.location.href = `/admin/login?from=${encodeURIComponent(window.location.pathname)}`;
  }
  if (!response.ok) {
    throw new Error(json.message || "Request failed.");
  }
  return json;
}

/**
 * Loads one admin collection from the API. If the database can't be reached, shows demo records
 * read-only: changes are refused rather than kept in the browser, so nothing looks saved that isn't.
 * With `enabled` false (the signed-in role can't use this collection) nothing is fetched.
 */
export default function useCollection(endpoint, key, demoItems, notify, enabled = true) {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("loading");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!enabled) {
      setItems([]);
      setMode("off");
      return;
    }
    try {
      const json = await request(endpoint);
      setItems(json[key] || []);
      setMode("live");
      setError("");
    } catch (loadError) {
      setItems(demoItems());
      setMode("demo");
      setError(loadError.message);
    }
  }, [endpoint, key, demoItems, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  function refuseOffline() {
    notify?.(`Not saved — the database is not connected. ${error}`.trim(), "error");
  }

  async function create(data) {
    if (mode !== "live") {
      refuseOffline();
      return null;
    }

    try {
      const { item } = await request(endpoint, { method: "POST", body: JSON.stringify(data) });
      setItems((current) => [item, ...current]);
      return item;
    } catch (createError) {
      notify?.(createError.message, "error");
      return null;
    }
  }

  async function update(id, patch) {
    if (mode !== "live") {
      refuseOffline();
      return false;
    }

    const previous = items;
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );

    try {
      const { item } = await request(endpoint, {
        method: "PATCH",
        body: JSON.stringify({ id, ...patch }),
      });
      setItems((current) => current.map((entry) => (entry.id === id ? item : entry)));
      return true;
    } catch (updateError) {
      setItems(previous);
      notify?.(updateError.message, "error");
      return false;
    }
  }

  async function remove(id) {
    if (mode !== "live") {
      refuseOffline();
      return false;
    }

    const previous = items;
    setItems((current) => current.filter((item) => item.id !== id));

    try {
      await request(`${endpoint}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      return true;
    } catch (removeError) {
      setItems(previous);
      notify?.(removeError.message, "error");
      return false;
    }
  }

  return { items, setItems, mode, error, reload: load, create, update, remove };
}
