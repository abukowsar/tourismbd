"use client";

import { useCallback, useEffect, useState } from "react";
import Icon from "../components/Icon";
import AdminUsers from "./_components/AdminUsers";
import Alerts from "./_components/Alerts";
import {
  demoAdminUsers,
  demoAlerts,
  demoCriminals,
  demoGuides,
  demoOperations,
  demoRequests,
  demoSpotReports,
  demoVisitors,
} from "./_components/demoData";
import Guides from "./_components/Guides";
import Overview from "./_components/Overview";
import Requests from "./_components/Requests";
import SpotReports from "./_components/SpotReports";
import TouristPolice from "./_components/TouristPolice";
import { isLiveAlert } from "./_components/ui";
import useCollection from "./_components/useCollection";
import Visitors from "./_components/Visitors";

const sections = [
  { id: "overview", label: "Overview", icon: "sparkle", title: "Operations overview" },
  { id: "visitors", label: "Visitors", icon: "passport", title: "Registered visitors" },
  { id: "guides", label: "Tour guides", icon: "shield", title: "Tour guide roster" },
  { id: "requests", label: "Support requests", icon: "chat", title: "Support requests" },
  { id: "alerts", label: "Travel alerts", icon: "info", title: "Travel alerts" },
  { id: "police", label: "Tourist Police", icon: "shield", title: "Tourist Police", police: true },
  { id: "spots", label: "Spot reports", icon: "landmark", title: "Tourist spot reports", police: true },
  { id: "users", label: "Admin users", icon: "passport", title: "Admin users" },
];

// Police admins only see sections marked `police`; the super admin sees everything.
function sectionsFor(role) {
  return role === "police" ? sections.filter((item) => item.police) : role ? sections : [];
}

export default function AdminConsole() {
  const [section, setSection] = useState("overview");
  const [toasts, setToasts] = useState([]);
  const [admin, setAdmin] = useState("");
  const [role, setRole] = useState(null);
  const [openVisitorId, setOpenVisitorId] = useState(null);
  const [requestDraft, setRequestDraft] = useState(null);
  const [today, setToday] = useState("");

  const notify = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000);
  }, []);

  const isSuper = role === "super";
  const canPolice = role === "super" || role === "police";
  const visitors = useCollection("/api/admin/visitors", "visitors", demoVisitors, notify, isSuper);
  const guides = useCollection("/api/admin/guides", "guides", demoGuides, notify, isSuper);
  const requests = useCollection("/api/admin/requests", "requests", demoRequests, notify, isSuper);
  const alerts = useCollection("/api/admin/alerts", "alerts", demoAlerts, notify, isSuper);
  const operations = useCollection("/api/admin/police/operations", "operations", demoOperations, notify, canPolice);
  const criminals = useCollection("/api/admin/police/criminals", "criminals", demoCriminals, notify, canPolice);
  const spotReports = useCollection(
    "/api/admin/police/spot-reports",
    "spotReports",
    demoSpotReports,
    notify,
    canPolice,
  );
  const users = useCollection("/api/admin/users", "users", demoAdminUsers, notify, isSuper);
  const allowed = sectionsFor(role);
  const stores = [visitors, guides, requests, alerts, operations, criminals, spotReports, users];
  const enabledStores = [isSuper, isSuper, isSuper, isSuper, canPolice, canPolice, canPolice, isSuper];
  const isDemo = stores.some((store) => store.mode === "demo");
  // An enabled store still reads "off" for one render after the role arrives.
  const isLoading =
    !role ||
    stores.some((store, index) => store.mode === "loading" || (store.mode === "off" && enabledStores[index]));

  useEffect(() => {
    function fromHash() {
      const hash = window.location.hash.slice(1);
      if (hash && sections.some((item) => item.id === hash)) {
        setSection(hash);
      }
    }
    fromHash();
    setToday(
      new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Asia/Dhaka",
      }).format(new Date()),
    );
    window.addEventListener("hashchange", fromHash);

    fetch("/api/admin/login")
      .then((response) => (response.ok ? response.json() : {}))
      .then((json) => {
        setAdmin(json.name || json.username || "");
        setRole(json.role || "super");
      })
      .catch(() => {});

    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Keep the open section inside what this role may see (e.g. a police admin landing on #visitors).
  useEffect(() => {
    if (allowed.length && !allowed.some((item) => item.id === section)) {
      setSection(allowed[0].id);
    }
  }, [allowed, section]);

  const navigate = useCallback((id) => {
    setSection(id);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0 });
  }, []);

  const openVisitor = useCallback(
    (id) => {
      navigate("visitors");
      setOpenVisitorId(id);
    },
    [navigate],
  );

  function createRequestFor(visitor) {
    setOpenVisitorId(null);
    setRequestDraft({
      title: "",
      visitorId: visitor.id,
      visitorName: visitor.fullName,
      category: "Other",
      priority: "normal",
      state: "new",
      owner: visitor.guideName || "",
      details: "",
    });
    navigate("requests");
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  const badges = {
    visitors: visitors.items.filter((item) => item.status === "new").length,
    requests: requests.items.filter((item) => item.state !== "done").length,
    alerts: alerts.items.filter(isLiveAlert).length,
    police: operations.items.filter((item) => item.status === "ongoing").length,
  };
  const current = allowed.find((item) => item.id === section) || allowed[0] || sections[0];

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          <img src="/assets/logo.png" alt="" aria-hidden="true" />
          <span>
            Tourism BD
            <small>{role === "police" ? "Tourist Police console" : "Management console"}</small>
          </span>
        </a>

        <nav aria-label="Admin sections">
          {allowed.map((item) => (
            <button
              key={item.id}
              type="button"
              className={section === item.id ? "is-active" : ""}
              aria-current={section === item.id ? "page" : undefined}
              onClick={() => navigate(item.id)}
            >
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {badges[item.id] ? <b>{badges[item.id]}</b> : null}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <a href="/" target="_blank" rel="noreferrer">
            <Icon name="pin" size={17} /> View website
          </a>
          <button type="button" onClick={logout}>
            <Icon name="arrow" size={17} /> Sign out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="a-eyebrow">{today || " "}</p>
            <h1>{current.title}</h1>
          </div>
          <div className="admin-topbar-actions">
            <span className={`a-mode ${isLoading ? "is-loading" : isDemo ? "is-demo" : "is-live"}`}>
              <i aria-hidden="true" />
              {isLoading ? "Connecting..." : isDemo ? "Demo data" : "Live database"}
            </span>
            <button
              type="button"
              className="a-icon-button"
              aria-label="Refresh data"
              title="Refresh data"
              onClick={() => stores.forEach((store) => store.reload())}
            >
              <Icon name="swap" size={18} />
            </button>
            {admin ? (
              <span className="a-user">
                <span className="a-avatar" aria-hidden="true">{admin.charAt(0).toUpperCase()}</span>
                {admin}
              </span>
            ) : null}
          </div>
        </header>

        <main className="admin-content" id="main-content">
          {isLoading ? (
            <div className="a-loading" aria-busy="true">
              <span />
              <span />
              <span />
            </div>
          ) : null}

          {!isLoading && current.id === "overview" ? (
            <Overview
              visitors={visitors.items}
              guides={guides.items}
              requests={requests.items}
              alerts={alerts.items}
              onOpenVisitor={openVisitor}
              onNavigate={navigate}
            />
          ) : null}
          {!isLoading && current.id === "visitors" ? (
            <Visitors
              store={visitors}
              guides={guides.items}
              openId={openVisitorId}
              setOpenId={setOpenVisitorId}
              onCreateRequest={createRequestFor}
              notify={notify}
            />
          ) : null}
          {!isLoading && current.id === "guides" ? (
            <Guides store={guides} visitorStore={visitors} notify={notify} />
          ) : null}
          {!isLoading && current.id === "requests" ? (
            <Requests
              store={requests}
              visitors={visitors.items}
              draft={requestDraft}
              clearDraft={() => setRequestDraft(null)}
              notify={notify}
            />
          ) : null}
          {!isLoading && current.id === "alerts" ? <Alerts store={alerts} notify={notify} /> : null}
          {!isLoading && current.id === "police" ? (
            <TouristPolice operations={operations} criminals={criminals} notify={notify} />
          ) : null}
          {!isLoading && current.id === "spots" ? <SpotReports store={spotReports} notify={notify} /> : null}
          {!isLoading && current.id === "users" ? <AdminUsers store={users} notify={notify} /> : null}
        </main>
      </div>

      <div className="a-toasts" aria-live="polite">
        {toasts.map((toast) => (
          <p key={toast.id} className={`a-toast ${toast.type}`}>
            <Icon name={toast.type === "error" ? "info" : "check"} size={18} />
            {toast.message}
          </p>
        ))}
      </div>
    </div>
  );
}
