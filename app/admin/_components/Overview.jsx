"use client";

import { useMemo } from "react";
import Icon from "../../components/Icon";
import { BarList, ColumnChart, daysUntil, formatDate, isLiveAlert, Kpi, Pill, relativeDay } from "./ui";

const inCountryStatuses = ["active", "guide assigned"];
const closedStatuses = ["completed", "cancelled"];

export default function Overview({ visitors, guides, requests, alerts, onOpenVisitor, onNavigate }) {
  const stats = useMemo(() => {
    const upcoming = visitors
      .filter((visitor) => {
        const days = daysUntil(visitor.arrivalDate);
        return days !== null && days >= 0 && days <= 14 && !closedStatuses.includes(visitor.status);
      })
      .sort((a, b) => new Date(a.arrivalDate) - new Date(b.arrivalDate));

    const openRequests = requests.filter((item) => item.state !== "done");

    const columns = Array.from({ length: 14 }, (_, offset) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + offset);
      const value = upcoming.filter((visitor) => daysUntil(visitor.arrivalDate) === offset).length;
      return {
        key: offset,
        value,
        highlight: offset === 0,
        label: offset === 0 ? "Today" : offset % 2 === 0 ? formatDate(date, { day: "numeric", month: "short" }) : "",
        tooltip: formatDate(date, { weekday: "short", day: "numeric", month: "short" }),
      };
    });

    function countBy(field, limit) {
      const counts = new Map();
      visitors.forEach((visitor) => {
        const label = visitor[field] || "Unknown";
        counts.set(label, (counts.get(label) || 0) + 1);
      });
      const rows = [...counts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
      if (limit && rows.length > limit) {
        const other = rows.slice(limit - 1).reduce((sum, row) => sum + row.value, 0);
        return [...rows.slice(0, limit - 1), { label: "Other", value: other }];
      }
      return rows;
    }

    const attention = [
      ...upcoming
        .filter((visitor) => !visitor.guideName && daysUntil(visitor.arrivalDate) <= 7)
        .map((visitor) => ({
          key: `g-${visitor.id}`,
          icon: "pin",
          tone: "serious",
          text: `${visitor.fullName} arrives ${relativeDay(visitor.arrivalDate)} with no guide assigned`,
          action: () => onOpenVisitor(visitor.id),
        })),
      ...openRequests
        .filter((item) => ["urgent", "high"].includes(item.priority))
        .map((item) => ({
          key: `r-${item.id}`,
          icon: "info",
          tone: item.priority === "urgent" ? "critical" : "serious",
          text: `${item.priority === "urgent" ? "Urgent" : "High priority"}: ${item.title}${item.visitorName ? ` (${item.visitorName})` : ""}`,
          action: () => onNavigate("requests"),
        })),
      ...visitors
        .filter((visitor) => visitor.status === "new" && daysUntil(visitor.createdAt) <= -2)
        .map((visitor) => ({
          key: `n-${visitor.id}`,
          icon: "chat",
          tone: "info",
          text: `${visitor.fullName} registered ${relativeDay(visitor.createdAt)} and hasn't been contacted`,
          action: () => onOpenVisitor(visitor.id),
        })),
    ];

    return {
      upcoming,
      openRequests,
      columns,
      byCity: countBy("arrivalCity"),
      byCountry: countBy("passportCountry", 6),
      attention,
      inCountry: visitors.filter((visitor) => inCountryStatuses.includes(visitor.status)).length,
      arrivingWeek: upcoming.filter((visitor) => daysUntil(visitor.arrivalDate) <= 7).length,
      urgent: openRequests.filter((item) => item.priority === "urgent").length,
      availableGuides: guides.filter((guide) => guide.status === "available").length,
      activeAlerts: alerts.filter(isLiveAlert).length,
    };
  }, [visitors, guides, requests, alerts, onOpenVisitor, onNavigate]);

  return (
    <div className="a-stack">
      <section className="a-kpis" aria-label="Key numbers">
        <Kpi icon="passport" label="Registered visitors" value={visitors.length} detail={`${stats.inCountry} currently travelling`} />
        <Kpi icon="plane" label="Arriving in 7 days" value={stats.arrivingWeek} detail={`${stats.upcoming.length} in the next 14 days`} />
        <Kpi
          icon="chat"
          label="Open requests"
          value={stats.openRequests.length}
          detail={stats.urgent ? `${stats.urgent} urgent` : "None urgent"}
          tone={stats.urgent ? "is-critical" : ""}
        />
        <Kpi icon="shield" label="Available guides" value={`${stats.availableGuides}/${guides.length}`} detail={`${stats.activeAlerts} travel ${stats.activeAlerts === 1 ? "alert" : "alerts"} live`} />
      </section>

      <section className="a-grid-2">
        <div className="a-card a-span-2">
          <header className="a-card-head">
            <div>
              <h2>Arrivals — next 14 days</h2>
              <p>Registered visitors by arrival date</p>
            </div>
            <button type="button" className="a-link" onClick={() => onNavigate("visitors")}>
              All visitors <Icon name="arrow" size={16} />
            </button>
          </header>
          <ColumnChart columns={stats.columns} caption="Visitor arrivals per day for the next 14 days" />
        </div>

        <div className="a-card">
          <header className="a-card-head">
            <div>
              <h2>Needs attention</h2>
              <p>{stats.attention.length ? `${stats.attention.length} items to follow up` : "All caught up"}</p>
            </div>
          </header>
          {stats.attention.length ? (
            <ul className="a-attention">
              {stats.attention.slice(0, 7).map((item) => (
                <li key={item.key}>
                  <button type="button" onClick={item.action}>
                    <span className={`a-dot tone-${item.tone}`}><Icon name={item.icon} size={16} /></span>
                    <span>{item.text}</span>
                    <Icon name="arrow" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="a-muted">
              <Icon name="check" size={16} /> No unassigned arrivals or urgent requests.
            </p>
          )}
        </div>

        <div className="a-card">
          <header className="a-card-head">
            <div>
              <h2>Upcoming arrivals</h2>
              <p>Next 14 days</p>
            </div>
          </header>
          {stats.upcoming.length ? (
            <ul className="a-list">
              {stats.upcoming.slice(0, 6).map((visitor) => (
                <li key={visitor.id}>
                  <button type="button" onClick={() => onOpenVisitor(visitor.id)}>
                    <span className="a-avatar" aria-hidden="true">{visitor.fullName.charAt(0)}</span>
                    <span className="a-list-main">
                      <strong>{visitor.fullName}</strong>
                      <small>{visitor.arrivalCity} · {formatDate(visitor.arrivalDate, { day: "numeric", month: "short" })} ({relativeDay(visitor.arrivalDate)})</small>
                    </span>
                    {visitor.guideName ? <Pill value="available">Guide set</Pill> : <Pill value="high">No guide</Pill>}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="a-muted">No arrivals in the next two weeks.</p>
          )}
        </div>

        <div className="a-card">
          <header className="a-card-head">
            <div>
              <h2>Arrival cities</h2>
              <p>All registered visitors</p>
            </div>
          </header>
          <BarList rows={stats.byCity} />
        </div>

        <div className="a-card">
          <header className="a-card-head">
            <div>
              <h2>Passport countries</h2>
              <p>Top countries of registered visitors</p>
            </div>
          </header>
          <BarList rows={stats.byCountry} />
        </div>
      </section>
    </div>
  );
}
