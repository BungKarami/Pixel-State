import Estimator from "@/components/Estimator";
import Portfolio from "@/components/Portfolio";
import QuoteForm from "@/components/QuoteForm";
import { CONTACT_EMAIL } from "@/lib/auth";

const SERVICES = [
  { name: "Company websites", text: "A clear company site that explains what you do, who you help, and how to start." },
  { name: "Hospitality", text: "Menus, bookings and opening hours that work on a phone, in the moment a customer decides." },
  { name: "Professional services", text: "Trust first. Plain language, clear services, and a simple next step for a new client." },
  { name: "Tradies", text: "Services, service area and a quote form that works from a job site, not just a desk." },
  { name: "Medical GP profiles", text: "Patient info that is easy to find: services, doctors, hours and new patient steps." },
  { name: "Portfolio websites", text: "Your work first, with a simple way for a new client to ask about a project." }
];

const FAQS = [
  { q: "How long does a build take?", a: "Most Starter and Growth builds take two to four weeks from the day we have your content and photos. We confirm the date in writing before work starts." },
  { q: "What do you need from me to start?", a: "Your logo if you have one, photos, your services and prices, and a short note on who your customers are. We help you gather the rest." },
  { q: "Do I really own the website?", a: "Yes. The domain is in your name, the code is handed over to you, and you can self host or move hosting at any time. There is no lock in, and that is in writing before work starts." },
  { q: "What happens if I want to move hosting?", a: "You can. We hand over the code and the domain details, and we show you how hosting works, or we can help you move it." },
  { q: "Who owns the domain?", a: "You do. We help you register it in your name and keep the login details with you." },
  { q: "What does the Care plan cover?", a: "Care covers updates, small changes, backups and help when something breaks. It does not cover a full redesign or a new build, and we will tell you that clearly before you join." }
];

export default function Home() {
  return (
    <main id="main">
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a className="brand" href="#top">Pixel <span>State</span></a>
          <nav className="nav" aria-label="Main">
            <a href="#ownership">Ownership</a>
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="#quote">Contact</a>
          </nav>
          <a className="btn btn-cyan btn-small" href="#quote">Get a fixed quote</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="wrap">
          <p className="kicker">Bendigo website agency</p>
          <h1>Level the <span>playing field.</span></h1>
          <p className="lede">Your competitors with a good website win the customers you should win. Pixel State builds websites Bendigo businesses actually own, with a fixed quote in writing and no lock in.</p>
          <div className="hero-actions">
            <a className="btn btn-cyan" href="#quote">Get a fixed quote</a>
            <a className="btn btn-light" href="#quote">Free website review</a>
          </div>
          <div className="pixels" aria-hidden="true">
            {Array.from({ length: 36 }).map((_, i) => (
              <i key={i} className={i % 5 === 0 ? "c" : undefined} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="kicker">The problem</p>
          <h2>Does your website help you, or hold you back?</h2>
          <div className="grid2">
            <div className="card"><h3>It looks old, or it was never finished</h3><p>Customers judge you in seconds. A tired website tells them to try the next business.</p></div>
            <div className="card"><h3>It is not really yours</h3><p>Many businesses pay every month and still do not own the site, the code, or even the domain. That is the part we fix first.</p></div>
          </div>
        </div>
      </section>

      <section className="section section-dark" id="ownership">
        <div className="wrap">
          <p className="kicker">100 percent yours</p>
          <h2>Your website, your code, your domain.</h2>
          <p className="muted">We build it, hand it over, and show you how it works. You can self host, move hosting, or stay with us on Care. The choice is yours, in writing before work starts.</p>
          <div className="grid3">
            <div className="card" style={{ background: "#1c1c1c", borderColor: "#333", color: "#fff" }}><h3>Domain in your name</h3><p>We help you register and keep the domain in your name, with the login details held by you.</p></div>
            <div className="card" style={{ background: "#1c1c1c", borderColor: "#333", color: "#fff" }}><h3>Full code handed over</h3><p>You get the full code for your site. No hidden lock in, no ransom to move.</p></div>
            <div className="card" style={{ background: "#1c1c1c", borderColor: "#333", color: "#fff" }}><h3>Handover training</h3><p>We show you how to update text and photos, and what to do if something breaks.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="wrap">
          <p className="kicker">Services</p>
          <h2>Websites for Bendigo businesses</h2>
          <div className="grid3">
            {SERVICES.map((s) => (
              <div className="card" key={s.name}><h3>{s.name}</h3><p>{s.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="wrap">
          <p className="kicker">Work</p>
          <h2>Concept builds, made for Bendigo</h2>
          <p className="muted">These are concept builds to show the standard we build to. Real client work will replace them as it is finished.</p>
          <Portfolio />
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="wrap">
          <p className="kicker">Pricing</p>
          <h2>Fixed quotes, in writing</h2>
          <div className="grid3">
            <div className="price-card">
              <h3>Starter</h3>
              <p className="price">$1,490 to $1,990</p>
              <p className="muted">Best for a simple, professional site that gets you found and contacted.</p>
              <ul className="tick"><li>Up to 5 pages</li><li>Mobile first design</li><li>Contact and quote form</li><li>Full code handover</li></ul>
            </div>
            <div className="price-card featured">
              <h3>Growth</h3>
              <p className="price">$2,990 to $3,490</p>
              <p className="muted">Best for businesses that want bookings, more pages and local search set up properly.</p>
              <ul className="tick"><li>Everything in Starter</li><li>Bookings or enquiry system</li><li>Local search setup</li><li>Copywriting help</li></ul>
            </div>
            <div className="price-card">
              <h3>Care</h3>
              <p className="price">$49 to $99 per month</p>
              <p className="muted">Best for businesses that want updates and help without worrying about the site.</p>
              <ul className="tick"><li>Updates and small changes</li><li>Backups</li><li>Help when something breaks</li><li>Cancel any time</li></ul>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <Estimator />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="kicker">How it works</p>
          <h2>Four steps, no surprises</h2>
          <div className="grid2">
            <div className="card"><h3>1. Free review or quote</h3><p>Tell us about your business. We review your current site for free, or send a fixed quote.</p></div>
            <div className="card"><h3>2. Plan in writing</h3><p>We agree the pages, the price and the date, in writing, before work starts.</p></div>
            <div className="card"><h3>3. Build and check</h3><p>We build your site, you check it on your phone and desktop, and we fix what needs fixing.</p></div>
            <div className="card"><h3>4. Handover, you own it</h3><p>We hand over the code and domain, show you how it works, and stay on Care only if you want us to.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <p className="kicker">Free website review</p>
          <h2>Find out what your website is costing you</h2>
          <p className="muted">Send your current website address in the form below and choose Free website review. We will send clear findings within one business day, with next steps and a fixed quote if you would like one.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2>What Bendigo businesses will say</h2>
          <p className="muted">These are sample cards. They will be replaced with real client reviews as founding clients finish their builds.</p>
          <div className="grid3">
            <div className="card"><span className="tag">Sample</span><p style={{ marginTop: 10 }}>Sample testimonial. Replace this card with a real client review.</p></div>
            <div className="card"><span className="tag">Sample</span><p style={{ marginTop: 10 }}>Sample testimonial. Replace this card with a real client review.</p></div>
            <div className="card"><span className="tag">Sample</span><p style={{ marginTop: 10 }}>Sample testimonial. Replace this card with a real client review.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap">
          <p className="kicker">FAQ</p>
          <h2>Questions Bendigo businesses ask</h2>
          {FAQS.map((f) => (
            <details className="faq-item" key={f.q}>
              <summary>{f.q}</summary>
              <p style={{ marginTop: 10 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section section-dark" id="quote">
        <div className="wrap">
          <p className="kicker">Ready to level the playing field?</p>
          <h2>Get a fixed quote or a free website review</h2>
          <p className="muted">Fill in the form. Your enquiry is saved to our inbox and we reply within one business day.</p>
          <div className="grid2">
            <div className="card" style={{ color: "#0b0b0b" }}>
              <QuoteForm contactEmail={CONTACT_EMAIL} />
            </div>
            <div>
              <h3 style={{ color: "#fff" }}>What happens next</h3>
              <ul className="tick" style={{ color: "#d8eef2" }}>
                <li>We read your enquiry and check your current website if you shared one.</li>
                <li>We reply within one business day with a fixed quote or review findings.</li>
                <li>If you go ahead, we confirm the plan, price and date in writing.</li>
              </ul>
              <p style={{ color: "#d8eef2" }}>Pixel State, 33 Creek St S, Bendigo VIC 3550<br />Serving Bendigo, Eaglehawk, Kangaroo Flat, Castlemaine, Heathcote and Kyneton.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <p><strong>Pixel State</strong>, Bendigo. Level the playing field.</p>
          <p>33 Creek St S, Bendigo VIC 3550. Contact: {CONTACT_EMAIL}</p>
          <p className="muted" style={{ color: "#999" }}>100 percent ownership. You get the code, the domain in your name, and no lock in.</p>
          <p><a href="/privacy">Privacy</a> | <a href="/terms">Terms</a></p>
        </div>
      </footer>
    </main>
  );
}
