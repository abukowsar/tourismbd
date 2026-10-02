import Icon from "./Icon";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-about">
          <a className="footer-brand" href="/" aria-label="Tourism BD home">
            <img src="/assets/logo.png" alt="" aria-hidden="true" />
            <span>Tourism BD</span>
          </a>
          <p>
            Helping international travelers discover Bangladesh with confidence —
            from first arrival to the last sunset.
          </p>
          <a className="footer-sos" href="tel:999">
            <Icon name="phone" size={18} />
            Emergency: 999
          </a>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>
          <a href="/#destinations">Destinations</a>
          <a href="/#planner">Trip planner</a>
          <a href="/#seasons">Best time to visit</a>
          <a href="/#food">Food guide</a>
        </div>

        <div className="footer-links">
          <h3>Travel smart</h3>
          <a href="/#guide">Travel essentials</a>
          <a href="/#toolkit">Currency & weather</a>
          <a href="/#phrases">Bangla phrases</a>
          <a href="/#faq">FAQ</a>
        </div>

        <div className="footer-links">
          <h3>Your trip</h3>
          <a href="/#registration">Register your visit</a>
          <a href="/login">Traveler login</a>
          <a href="/dashboard">My dashboard</a>
          <a href="/#safety">Safety & helplines</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Tourism BD. All rights reserved.</p>
        <p>Made with care for guests arriving from around the world.</p>
      </div>
    </footer>
  );
}
