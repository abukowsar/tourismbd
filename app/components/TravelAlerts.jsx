"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

const DISMISSED_KEY = "tourism_bd_dismissed_alerts";

export function AlertBanner({ alert, onDismiss }) {
  return (
    <div className={`travel-alert level-${alert.level}`} role="note">
      <Icon name={alert.level === "info" ? "info" : "shield"} size={20} />
      <div>
        <strong>
          <span className="travel-alert-level">{alert.level}</span>
          {alert.title || "Alert title"}
          {alert.region ? <small> · {alert.region}</small> : null}
        </strong>
        <p>{alert.message || "Your message to travelers appears here."}</p>
      </div>
      {onDismiss ? (
        <button type="button" className="travel-alert-close" aria-label="Dismiss alert" onClick={onDismiss}>
          <Icon name="close" size={16} />
        </button>
      ) : null}
    </div>
  );
}

/** Live travel alerts published from the admin console. Renders nothing when there are none. */
export default function TravelAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    try {
      setDismissed(JSON.parse(window.sessionStorage.getItem(DISMISSED_KEY) || "[]"));
    } catch {
      // Dismissals are a convenience only.
    }

    const controller = new AbortController();
    fetch("/api/alerts", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : { alerts: [] }))
      .then((json) => setAlerts(json.alerts || []))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  function dismiss(id) {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures.
    }
  }

  const visible = alerts.filter((alert) => !dismissed.includes(alert.id));
  if (!visible.length) {
    return null;
  }

  return (
    <section className="travel-alerts section" aria-label="Travel alerts">
      {visible.map((alert) => (
        <AlertBanner key={alert.id} alert={alert} onDismiss={() => dismiss(alert.id)} />
      ))}
    </section>
  );
}
