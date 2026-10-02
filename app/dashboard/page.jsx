import DocumentChecklist from "../components/DocumentChecklist";
import Icon from "../components/Icon";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

const itinerary = [
  {
    day: "Day 1",
    city: "Dhaka",
    plan: "Airport pickup, hotel check-in, SIM support, and Old Dhaka orientation.",
    status: "Confirmed",
  },
  {
    day: "Day 2",
    city: "Sonargaon",
    plan: "Museum visit, craft village walk, local lunch, and evening return to Dhaka.",
    status: "Guide assigned",
  },
  {
    day: "Day 3",
    city: "Sylhet",
    plan: "Morning flight, tea garden transfer, hotel check-in, and route briefing.",
    status: "Pending ticket",
  },
  {
    day: "Day 4",
    city: "Ratargul",
    plan: "Wetland boat route with guide, weather check, and early evening return.",
    status: "Safety review",
  },
];

const supportTickets = [
  {
    title: "Airport pickup confirmation",
    owner: "Support desk",
    state: "Open",
  },
  {
    title: "Dietary preference sent to guide",
    owner: "Tour guide",
    state: "Done",
  },
  {
    title: "Sylhet hotel contact verification",
    owner: "Operations",
    state: "In review",
  },
];

const documents = [
  "Passport copy",
  "Visa or arrival permission",
  "Hotel confirmation",
  "Travel insurance",
  "Emergency contact card",
  "Transport tickets",
];

const travelerResources = [
  {
    title: "Tourism Data Inventory",
    description:
      "Reference PDF for tourism inventory details, destination records, and planning support.",
    href: "/assets/TOURISM%20DATA%20INVENTORY.pdf",
  },
];

const contacts = [
  {
    role: "Tour Guide",
    name: "Mahmud Rahman",
    detail: "English-speaking cultural guide",
    action: "Message guide",
    href: "#requests",
  },
  {
    role: "24/7 Support",
    name: "Tourist Safety Desk",
    detail: "Trip changes, route help, and urgent coordination",
    action: "Create support request",
    href: "#requests",
  },
  {
    role: "Emergency",
    name: "Bangladesh 999",
    detail: "Police, fire service, and ambulance — free from any phone",
    action: "Call 999",
    href: "tel:999",
    emergency: true,
  },
];

const statusTone = {
  Confirmed: "",
  Done: "",
  "Guide assigned": "info",
  "In review": "info",
  "Pending ticket": "warn",
  "Safety review": "warn",
  Open: "warn",
};

export const metadata = {
  title: "Tourist Dashboard | Tourism BD",
  description:
    "Registered tourist dashboard for managing Bangladesh tours, guide support, transport, documents, and safety tasks.",
};

export default function Dashboard() {
  return (
    <>
      <SiteHeader solid />
      <div className="app-page">
        <main className="dashboard-shell" id="main-content">
          <section className="dashboard-hero" aria-labelledby="dashboard-title">
            <div>
              <p className="eyebrow">Registered tourist dashboard</p>
              <h1 id="dashboard-title">Manage your full Bangladesh tour from one safe place.</h1>
              <p>
                Track your guide, daily route, hotel, transport, support requests,
                Tourist Police readiness, documents, and safety check-ins before
                each movement.
              </p>
            </div>
            <div className="traveler-card" aria-label="Traveler safety profile">
              <p>Visitor Safety Profile</p>
              <strong>Maria Thompson</strong>
              <span>Passport country: United Kingdom</span>
              <span>Current city: Dhaka</span>
              <span className="status-dot">Trip status: Active support</span>
            </div>
          </section>

          <section className="dashboard-metrics" aria-label="Trip overview">
            <article>
              <span>04</span>
              <p>Planned tour days</p>
            </article>
            <article>
              <span>01</span>
              <p>Assigned guide</p>
            </article>
            <article>
              <span>03</span>
              <p>Support requests</p>
            </article>
            <article>
              <span>06</span>
              <p>Documents tracked</p>
            </article>
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-panel itinerary-panel">
              <div className="panel-heading">
                <p className="eyebrow">Tour plan</p>
                <h2>Daily itinerary</h2>
              </div>
              <div className="itinerary-list">
                {itinerary.map((item) => (
                  <article key={`${item.day}-${item.city}`}>
                    <div>
                      <p>{item.day}</p>
                      <h3>{item.city}</h3>
                    </div>
                    <p>{item.plan}</p>
                    <span className={`pill ${statusTone[item.status] || ""}`}>{item.status}</span>
                  </article>
                ))}
              </div>
            </div>

            <aside className="dashboard-panel guide-panel" aria-label="Guide and support">
              <div className="panel-heading">
                <p className="eyebrow">Guide and support</p>
                <h2>Contacts</h2>
              </div>
              <div className="contact-list">
                {contacts.map((contact) => (
                  <article key={contact.role} className={contact.emergency ? "is-emergency" : ""}>
                    <p>{contact.role}</p>
                    <h3>{contact.name}</h3>
                    <span>{contact.detail}</span>
                    <a
                      className={`button ${contact.emergency ? "primary" : "outline"}`}
                      href={contact.href}
                    >
                      <Icon name={contact.emergency ? "phone" : "chat"} size={16} />
                      {contact.action}
                    </a>
                  </article>
                ))}
              </div>
            </aside>
          </section>

          <section className="dashboard-grid lower-dashboard">
            <div className="dashboard-panel" id="requests">
              <div className="panel-heading">
                <p className="eyebrow">Support center</p>
                <h2>Requests</h2>
              </div>
              <div className="support-table" role="table" aria-label="Support requests">
                <div role="row">
                  <strong role="columnheader">Request</strong>
                  <strong role="columnheader">Owner</strong>
                  <strong role="columnheader">Status</strong>
                </div>
                {supportTickets.map((ticket) => (
                  <div role="row" key={ticket.title}>
                    <span role="cell">{ticket.title}</span>
                    <span role="cell">{ticket.owner}</span>
                    <span role="cell">
                      <span className={`pill ${statusTone[ticket.state] || ""}`}>{ticket.state}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-panel">
              <div className="panel-heading">
                <p className="eyebrow">Safety checklist</p>
                <h2>Before leaving hotel</h2>
              </div>
              <DocumentChecklist
                items={documents}
                initiallyDone={documents.filter((document) => document !== "Transport tickets")}
              />
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="panel-heading">
              <p className="eyebrow">Registered user resources</p>
              <h2>Tourism documents</h2>
            </div>
            <div className="resource-list">
              {travelerResources.map((resource) => (
                <article key={resource.title}>
                  <span className="tool-icon"><Icon name="passport" /></span>
                  <div>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                  </div>
                  <a
                    className="button primary"
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open PDF
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-support-band">
            <div>
              <p className="eyebrow">Tourist Police readiness</p>
              <h2>Save your nearest Tourist Police contact before every route.</h2>
            </div>
            <div className="band-actions">
              <a className="button primary" href="tel:999">
                <Icon name="phone" size={18} />
                Call 999
              </a>
              <a className="button ghost" href="/#planner">
                Plan more days
              </a>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
