"use client";

import { FormEvent, useState } from "react";
import "./globals.css";

export default function Home() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setStatus("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Unable to send");
      }

      setStatus("Thank you. Your inquiry has been received.");
      form.reset();
    } catch {
      setStatus(
        "Your message could not be sent. Please try again or contact us directly."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <a className="logo" href="#home">
            TITAN X
          </a>

          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#solutions">Solutions</a>
            <a href="#technology">Technology</a>
            <a href="#global">Global</a>
            <a href="#americas">Americas</a>
            <a href="#contact">Contact</a>
          </nav>

          <span className="menu">MODULAR ENERGY</span>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-grid" />

          <div className="container hero-content">
            <div className="kicker">Titan X Energy</div>

            <h1>
              Modular Energy
              <br />
              Solutions
            </h1>

            <h2>for a Changing World</h2>

            <p className="lead">
              Advanced modular refining, natural gas and LNG equipment,
              supported by digital twin and remote operational technologies.
            </p>

            <div className="buttons">
              <a className="btn primary" href="#solutions">
                Explore Our Solutions
              </a>

              <a className="btn secondary" href="#contact">
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div className="container">
            <div className="section-label">01 / Who We Are</div>

            <h2 className="section-title">
              Engineering Modular
              <br />
              Energy Solutions
            </h2>

            <p className="section-copy">
              Titan X is an international modular energy solutions project
              built on decades of petroleum equipment engineering and
              manufacturing experience.
            </p>

            <p className="section-copy">
              The project originated from Longxin Petroleum Equipment Company
              in Shaanxi, China, whose capabilities expanded through
              cooperation with NOV and the development of offshore drilling
              platforms, land drilling rigs, modular refining systems and
              LNG-related equipment.
            </p>
          </div>
        </section>

        {/* SOLUTIONS */}
        <section id="solutions">
          <div className="container">
            <div className="section-label">02 / Core Solutions</div>

            <h2 className="section-title">
              Modular Systems.
              <br />
              Built for Specific Needs.
            </h2>

            <div className="business-grid">
              <article className="card">
                <div className="num">01 — MODULAR REFINING</div>

                <h3>Modular Refining</h3>

                <p>
                  Skid-mounted refining systems designed for different
                  feedstocks and end-product requirements.
                </p>

                <div className="metric">50 / 100 / 200 TPD</div>
              </article>

              <article className="card">
                <div className="num">02 — NATURAL GAS & LNG</div>

                <h3>Natural Gas & LNG</h3>

                <p>
                  Modular equipment covering natural gas gathering and
                  liquefaction applications.
                </p>
              </article>

              <article className="card">
                <div className="num">03 — DIGITAL TWIN / VIOT</div>

                <h3>Digital Twin / VIOT</h3>

                <p>
                  A digital platform supporting customized equipment
                  development, remote operation, monitoring, safety and
                  operational efficiency.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section id="technology">
          <div className="container">
            <div className="section-label">03 / Technology</div>

            <h2 className="section-title">
              Engineering Experience
              <br />
              with a Digital Layer.
            </h2>

            <p className="section-copy">
              Titan X combines modular equipment engineering with digitalized
              development, monitoring and remote operational support.
            </p>

            <div className="stats">
              <div className="stat">
                <strong>100+</strong>
                <span>Project-related patents</span>
              </div>

              <div className="stat">
                <strong>International</strong>
                <span>International patent portfolio</span>
              </div>

              <div className="stat">
                <strong>Global</strong>
                <span>International operating development</span>
              </div>

              <div className="stat">
                <strong>Remote</strong>
                <span>Digitalized remote operational support</span>
              </div>
            </div>
          </div>
        </section>

        {/* ADVANTAGES */}
        <section id="advantages">
          <div className="container">
            <div className="section-label">04 / Why Titan X</div>

            <h2 className="section-title">
              Differentiated by
              <br />
              Modularity.
            </h2>

            <div className="adv-grid">
              <div className="adv">
                <h3>Lower CAPEX</h3>
                <p>Lower equipment investment requirements.</p>
              </div>

              <div className="adv">
                <h3>Faster Deployment</h3>
                <p>
                  Projects can generally be completed within approximately
                  one year after technical solutions and commercial terms are
                  finalized.
                </p>
              </div>

              <div className="adv">
                <h3>Reduced Infrastructure</h3>
                <p>
                  Modular systems reduce infrastructure and construction
                  requirements.
                </p>
              </div>

              <div className="adv">
                <h3>Digital Operations</h3>
                <p>
                  Remote digital support can improve operational efficiency
                  and reduce operating costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GLOBAL */}
        <section className="global" id="global">
          <div className="container">
            <div className="section-label">05 / Global Strategy</div>

            <h2 className="section-title">
              China → Portugal →
              <br />
              Malaysia → Americas
            </h2>

            <p className="section-copy">
              A developing international platform connecting engineering,
              digital operations and equipment fabrication.
            </p>

            <div className="route">
              <div className="node">
                <div className="dot">CN</div>
                <h4>Xi&apos;an, China</h4>
                <p>Digital Twin / VIOT operational center</p>
              </div>

              <div className="node">
                <div className="dot">PT</div>
                <h4>Portugal</h4>
                <p>International operating system development</p>
              </div>

              <div className="node">
                <div className="dot">MY</div>
                <h4>Malaysia</h4>
                <p>Equipment fabrication development</p>
              </div>

              <div className="node">
                <div className="dot">US</div>
                <h4>Americas</h4>
                <p>Proposed U.S.-based operating company</p>
              </div>
            </div>
          </div>
        </section>

        {/* AMERICAS */}
        <section className="americas" id="americas">
          <div className="container americas-box">
            <div>
              <div className="section-label">06 / Americas</div>

              <h2 className="section-title">
                Building a Platform
                <br />
                for the Americas
              </h2>

              <p className="section-copy">
                Titan X proposes establishing a U.S.-based operating company
                focused on skid-mounted natural gas services, supported by
                technology licensing, selected patents, engineering and
                technical support, equipment manufacturing and digital
                services.
              </p>
            </div>

            <div>
              <div className="list">
                <div>Technology licensing</div>
                <div>Selected patent participation</div>
                <div>Engineering & technical support</div>
                <div>Equipment manufacturing</div>
                <div>Digital services</div>
                <div>Capital raising & market development</div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="container contact-grid">
            <div>
              <div className="section-label">07 / Contact</div>

              <h2 className="section-title">
                Let&apos;s Build the Next Generation of Modular Energy
                Infrastructure.
              </h2>

              <p className="section-copy">
                Contact Titan X for business inquiries, technology
                partnerships, investment discussions and strategic
                cooperation.
              </p>
            </div>

            <form className="form" onSubmit={submit}>
              <div className="row">
                <div className="field">
                  <label>Name *</label>
                  <input name="name" required />
                </div>

                <div className="field">
                  <label>Company</label>
                  <input name="company" />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label>Email *</label>
                  <input name="email" type="email" required />
                </div>

                <div className="field">
                  <label>Phone</label>
                  <input name="phone" />
                </div>
              </div>

              <div className="field">
                <label>Country / Region</label>
                <input name="region" />
              </div>

              <div className="field">
                <label>Inquiry Type *</label>

                <select
                  name="inquiryType"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an inquiry type
                  </option>

                  <option>Business Inquiry</option>
                  <option>Technology Partnership</option>
                  <option>
                    Investment & Strategic Cooperation
                  </option>
                </select>
              </div>

              <div className="field">
                <label>Message *</label>
                <textarea name="message" required />
              </div>

              <button
                className="btn primary"
                type="submit"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Inquiry"}
              </button>

              {status && (
                <div className="form-status">
                  {status}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} TITAN X ENERGY</span>
          <span>MODULAR ENERGY SOLUTIONS</span>
        </div>
      </footer>
    </>
  );
}
