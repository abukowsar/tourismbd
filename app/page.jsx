import DestinationExplorer from "./components/DestinationExplorer";
import Icon from "./components/Icon";
import PhraseBook from "./components/PhraseBook";
import RegistrationForm from "./components/RegistrationForm";
import ScrollEffects from "./components/ScrollEffects";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import TravelAlerts from "./components/TravelAlerts";
import TravelToolkit from "./components/TravelToolkit";
import TripPlanner from "./components/TripPlanner";
import {
  destinations,
  emergencyNumbers,
  essentials,
  faqs,
  festivals,
  foods,
  seasons,
} from "./data/tourism";

const stats = [
  { value: "700+", label: "Rivers shaping unforgettable journeys" },
  { value: "120 km", label: "Unbroken sea beach at Cox's Bazar" },
  { value: "3", label: "UNESCO World Heritage Sites" },
  { value: "24/7", label: "Travel support for registered visitors" },
];

const services = [
  {
    icon: "plane",
    title: "Arrival made simple",
    copy: "Share your first hotel, arrival city, and route so local support can help your first day feel calm.",
  },
  {
    icon: "pin",
    title: "Journey with context",
    copy: "Plan the cities, rivers, beaches, tea valleys, markets, and heritage sites that make Bangladesh memorable.",
  },
  {
    icon: "shield",
    title: "Support within reach",
    copy: "Keep emergency contacts, guide details, documents, and Tourist Police readiness in one traveler dashboard.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="home" id="main-content">
        <div className="hero-wrap">
          <section className="hero" aria-labelledby="home-title">
            <div className="hero-content">
              <p className="eyebrow hero-eyebrow">
                <span className="flag-dot" aria-hidden="true" />
                Welcome to Bangladesh
              </p>
              <h1 id="home-title">A beautiful country is waiting for you.</h1>
              <p className="hero-lead">
                Come for the rivers, tea gardens, beaches, mangrove forests,
                ancient cities, and the generosity of people who make every trip
                feel personal.
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#planner">
                  Start your Bangladesh journey
                  <Icon name="arrow" size={18} />
                </a>
                <a className="button ghost" href="#destinations">
                  Discover highlights
                </a>
              </div>
              <ul className="hero-trust" aria-label="Why travelers choose Tourism BD">
                <li><Icon name="check" size={16} /> Free visitor registration</li>
                <li><Icon name="check" size={16} /> Verified local guides</li>
                <li><Icon name="check" size={16} /> 24/7 safety support</li>
              </ul>
            </div>

            <aside className="arrival-panel" aria-label="Bangladesh travel invitation">
              <p>For international travelers</p>
              <strong>Plan confidently before you arrive</strong>
              <span>
                Register your arrival, save your route, and access a dashboard
                built for safer, smoother travel across Bangladesh.
              </span>
              <a href="#registration" className="panel-link">
                Register in 2 minutes <Icon name="arrow" size={16} />
              </a>
            </aside>

            <a className="scroll-cue" href="#highlights" aria-label="Scroll to highlights">
              <span />
            </a>
          </section>

          <div className="ticker" aria-hidden="true">
            <div className="ticker-track">
              {[...destinations, ...destinations].map((place, index) => (
                <span key={`${place.id}-${index}`}>
                  <Icon name={place.icon} size={18} />
                  {place.name}
                </span>
              ))}
            </div>
          </div>
          <TravelAlerts />
        </div>

        <section className="intro-band reveal" id="highlights" aria-label="Tourism BD highlights">
          {stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="discover section" id="discover">
          <div className="section-heading reveal">
            <p className="eyebrow">Why visit Bangladesh</p>
            <h2>Small country, big-hearted journeys.</h2>
            <p>
              Bangladesh rewards curious travelers with vivid cities, slow
              rivers, green horizons, layered history, and hospitality that
              turns strangers into guests.
            </p>
          </div>
          <div className="mosaic reveal">
            <article className="mosaic-photo">
              <div>
                <span className="badge light">River life</span>
                <h3>Drift through a land shaped by water</h3>
                <p>Country boats, sunset ghats, and villages that live by the rhythm of the rivers.</p>
              </div>
            </article>
            <article className="mosaic-tile tone-forest">
              <Icon name="tree" size={40} strokeWidth={1.4} />
              <h3>Mangroves & tigers</h3>
              <p>The Sundarbans — the largest mangrove forest on Earth.</p>
            </article>
            <article className="mosaic-tile tone-clay">
              <Icon name="mosque" size={40} strokeWidth={1.4} />
              <h3>Ancient heritage</h3>
              <p>Mughal forts, terracotta temples, and Buddhist monasteries.</p>
            </article>
            <article className="mosaic-tile tone-ocean">
              <Icon name="wave" size={40} strokeWidth={1.4} />
              <h3>Endless beaches</h3>
              <p>Cox's Bazar, Kuakata, and the coral shores of Saint Martin's.</p>
            </article>
            <article className="mosaic-tile tone-sunset">
              <Icon name="heart" size={40} strokeWidth={1.4} />
              <h3>Famous hospitality</h3>
              <p>Guests are honored here — expect tea invitations everywhere.</p>
            </article>
          </div>
        </section>

        <section className="section" id="destinations">
          <div className="section-heading split reveal">
            <div>
              <p className="eyebrow">Signature routes</p>
              <h2>Choose your first Bangladesh story.</h2>
            </div>
            <p>
              Thirteen unforgettable places — filter by what you love, save your
              favorites, and open any card for tips, seasons, and how to get there.
            </p>
          </div>
          <DestinationExplorer />
        </section>

        <section className="section seasons" id="seasons">
          <div className="section-heading reveal">
            <p className="eyebrow">Best time to visit</p>
            <h2>Every season tells a different story.</h2>
          </div>
          <div className="season-grid reveal">
            {seasons.map((season) => (
              <article key={season.id} className={`season-card season-${season.id}`}>
                <div className="season-top">
                  <span className="season-verdict">{season.verdict}</span>
                  <span className="season-rating" aria-label={`${season.rating} out of 5`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <i key={index} className={index < season.rating ? "on" : ""} />
                    ))}
                  </span>
                </div>
                <h3>{season.name}</h3>
                <p className="season-months">{season.months} · {season.temp}</p>
                <p>{season.copy}</p>
              </article>
            ))}
          </div>
          <div className="festival-strip reveal">
            <h3>
              <Icon name="calendar" size={20} />
              Festivals & national days
            </h3>
            <ul>
              {festivals.map((festival) => (
                <li key={festival.name}>
                  <b>{festival.date}</b>
                  <span>{festival.name}</span>
                  <small>{festival.note}</small>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="planner-section" id="planner">
          <div className="section">
            <div className="section-heading reveal">
              <p className="eyebrow">Smart trip planner</p>
              <h2>Build your itinerary in seconds.</h2>
              <p>
                Pick your trip length and interests. We'll suggest a realistic,
                geographically sensible route with transfers between each stop.
              </p>
            </div>
            <div className="reveal">
              <TripPlanner />
            </div>
          </div>
        </section>

        <section className="section" id="guide">
          <div className="section-heading split reveal">
            <div>
              <p className="eyebrow">Travel services</p>
              <h2>Everything to know before you land.</h2>
            </div>
            <p>
              Practical, up-to-date essentials for international visitors — from
              visas and SIM cards to local etiquette.
            </p>
          </div>
          <div className="essentials-grid reveal">
            {essentials.map((item) => (
              <article key={item.title} className="essential-card">
                <span className="tool-icon"><Icon name={item.icon} /></span>
                <h3>{item.title}</h3>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="toolkit">
          <div className="section-heading reveal">
            <p className="eyebrow">Traveler toolkit</p>
            <h2>Handy tools for the road.</h2>
          </div>
          <div className="reveal">
            <TravelToolkit />
          </div>
        </section>

        <section className="section food" id="food">
          <div className="section-heading split reveal">
            <div>
              <p className="eyebrow">Taste of Bangladesh</p>
              <h2>Eat your way across the country.</h2>
            </div>
            <p>
              Bengali food is rich, fragrant, and deeply regional. Here's what
              locals will insist you try.
            </p>
          </div>
          <div className="food-grid reveal">
            {foods.map((food, index) => (
              <article key={food.name} className="food-card">
                <span className="food-number">{String(index + 1).padStart(2, "0")}</span>
                <h3>{food.name}</h3>
                <p className="food-where"><Icon name="pin" size={14} /> {food.where}</p>
                <p>{food.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section phrases" id="phrases">
          <div className="section-heading split reveal">
            <div>
              <p className="eyebrow">Speak a little Bangla</p>
              <h2>A few words go a long way.</h2>
            </div>
            <p>
              Bangla is spoken by more than 250 million people. Try these
              phrases — tap the speaker to hear them.
            </p>
          </div>
          <div className="reveal">
            <PhraseBook />
          </div>
        </section>

        <section className="safety-section" id="safety">
          <div className="section safety-inner">
            <div className="police-copy reveal">
              <p className="eyebrow">Confidence while exploring</p>
              <h2>Enjoy the invitation, keep practical support close.</h2>
              <p>
                From airport pickup to intercity travel, keep hotel details,
                guide contacts, vehicle information, documents, and emergency
                numbers easy to reach. Tourist Police can be reached through 999.
              </p>
              <div className="facility-grid">
                {services.map((service) => (
                  <article key={service.title}>
                    <span className="tool-icon light"><Icon name={service.icon} /></span>
                    <div>
                      <h3>{service.title}</h3>
                      <p>{service.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="hotline-list reveal" aria-label="Emergency helplines">
              <h3>Save these numbers</h3>
              {emergencyNumbers.map((item) => (
                <a key={item.number} href={`tel:${item.number}`} className="hotline">
                  <strong>{item.number}</strong>
                  <span>
                    <b>{item.label}</b>
                    <small>{item.detail}</small>
                  </span>
                  <Icon name="phone" size={20} />
                </a>
              ))}
              <p className="tool-note">
                Also save your embassy's emergency number and your hotel's front desk.
              </p>
            </div>
          </div>
        </section>

        <section className="section registration" id="registration">
          <div className="registration-copy reveal">
            <p className="eyebrow">International visitor registration</p>
            <h2>Tell us your first plan, then travel with more confidence.</h2>
            <p>
              Share the essentials before you arrive: passport country, arrival
              city, first hotel, emergency contact, and the places you hope to
              explore.
            </p>
            <ol className="steps">
              <li>
                <span>1</span>
                <div>
                  <strong>Before you arrive</strong>
                  <small>Register arrival details and first-stay information.</small>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>We prepare your support</strong>
                  <small>Guides, pickups, and route advice are coordinated for you.</small>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>While you travel</strong>
                  <small>Use your dashboard for route, support, and document checks.</small>
                </div>
              </li>
            </ol>
          </div>
          <div className="reveal">
            <RegistrationForm />
          </div>
        </section>

        <section className="section faq" id="faq">
          <div className="section-heading reveal">
            <p className="eyebrow">Good to know</p>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="faq-list reveal">
            {faqs.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <span className="faq-toggle" aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="planning reveal">
            <div className="planning-copy">
              <p className="eyebrow">Ready when you are</p>
              <h2>Register once, then carry your Bangladesh plan with you.</h2>
              <p>
                Your dashboard helps you review itinerary details, support
                requests, travel documents, guide contacts, and safety reminders
                as your journey unfolds.
              </p>
            </div>
            <div className="planning-actions">
              <a className="button primary" href="/login">
                Login to dashboard
              </a>
              <a className="button ghost" href="#registration">
                Register your visit
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ScrollEffects />
    </>
  );
}
