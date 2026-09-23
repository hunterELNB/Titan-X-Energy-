"use client";

import { FormEvent, useState } from "react";
import "./globals.css";

export default function Home() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setStatus("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: data.get("name"),
      company: data.get("company"),
      email: data.get("email"),
      phone: data.get("phone"),
      region: data.get("region"),
      inquiryType: data.get("inquiryType"),
      message: data.get("message")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      form.reset();
      setStatus("Thank you. Your inquiry has been sent successfully.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to send your inquiry."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      {/* NAVIGATION */}
      <header className="nav">
        <div className="container nav-inner">
<a href="#home" className="brand">
  <img src="/logo.png" alt="Titan X Energy" className="brand-logo" />
</a>

          <nav className="nav-links">
            <a href="#refining">REFINING</a>
            <a href="#wellhead-gas">WELLHEAD GAS</a>
            <a href="#solutions">SOLUTIONS</a>
            <a href="#services">SERVICES</a>
            <a href="#digital-twin">DIGITAL TWIN</a>
            <a href="#projects">PROJECTS</a>
           
            <a href="#contact">CONTACT</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="home">
        <div
          className="hero-image"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        />

        <div className="container hero-content">
          <div className="kicker">TITAN X ENERGY</div>

          <h1>TURN STRANDED ENERGY INTO VALUE</h1>

          <p className="hero-subtitle">
            Modular Refining · Wellhead Gas Monetization · Digital Energy
          </p>

          <p className="hero-description">
            From wellhead to market, modular, mobile, and digitally enabled
            energy systems convert crude oil and natural gas at or near the
            source into diesel, CNG, LPG/NGL, and electricity.
          </p>

          <div className="hero-actions">
            <a href="#solutions" className="button button-primary">
              Explore Solutions
            </a>
            <a href="#contact" className="button button-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* BUSINESS ENTRANCES */}
      <section className="section business-entrances">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">OUR CORE PATHWAYS</span>
            <h2>From Resource to Marketable Energy</h2>
            <p>
              Titan X Energy connects upstream resources with downstream
              markets through modular processing, monetization, and digital
              operations.
            </p>
          </div>

          <div className="business-grid">
            <a href="#refining" className="business-card">
              <span className="card-number"></span>
              <h3>MODULAR REFINING</h3>
              <strong>Heavy Oil → Marketable Fuels</strong>
              <p>
                Modular refining systems designed to process challenging and
                remote crude resources at or near the source.
              </p>
              <span className="card-link">EXPLORE REFINING →</span>
            </a>

            <a href="#wellhead-gas" className="business-card">
              <span className="card-number"></span>
              <h3>WELLHEAD GAS</h3>
              <strong>Natural Gas → CNG · LPG/NGL · Power</strong>
              <p>
                Multiple monetization pathways for natural gas without
                economic pipeline access.
              </p>
              <span className="card-link">EXPLORE WELLHEAD GAS →</span>
            </a>
          </div>
        </div>
      </section>

      {/* CORE LOGIC */}
      <section className="section dark-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">CORE BUSINESS LOGIC</span>
            <h2>Oil & Gas Resource → Processing → Monetization</h2>
          </div>

          <div className="flow-grid">
            <div className="flow-item">
              <span></span>
              <h3>CRUDE OIL</h3>
              <p>Modular Refining</p>
              <strong>Diesel / Naphtha / Fuels</strong>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-item">
              <span></span>
              <h3>NATURAL GAS</h3>
              <p>Gas Processing</p>
              <strong>CNG / LPG-NGL / Distributed Power</strong>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-item">
              <span></span>
              <h3>DIGITAL ENERGY</h3>
              <p>Digital Twin + AIoT</p>
              <strong>Monitoring / Control / Optimization / O&M</strong>
            </div>
          </div>
        </div>
      </section>

      {/* MODULAR REFINING */}
      <section className="section" id="refining">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">MODULAR REFINING</span>
            <h2>Refinery Economics at the Source</h2>
            <p>
              Titan X Energy focuses on the modularization, standardization,
              and factory prefabrication of key refining processes, enabling
              refining capacity to be deployed at or near oilfields and
              resource locations.
            </p>
          </div>

          <div className="two-column">
            <div>
              <h3>Feedstock Adaptability</h3>
              <ul className="feature-list">
                <li>Heavy crude oil</li>
                <li>High-ash crude oil</li>
                <li>High-metal-content crude oil</li>
                <li>Crude oil from remote oilfields</li>
                <li>
                  Crude oil that may be uneconomic for conventional
                  large-scale refineries
                </li>
              </ul>
            </div>

            <div>
              <h3>Flexible Product Slate</h3>
              <p>
                The modular refining system can adjust the product slate
                through process configuration, operating conditions, and
                catalyst systems according to local market demand.
              </p>
              <p>
                Where diesel demand and pricing are more attractive, the system
                can be configured to emphasize higher diesel fractions and
                final diesel yield.
              </p>
            </div>
          </div>

          <div className="process-box">
            <span>PROCESS ROUTE</span>
            <p>
              CRUDE OIL → DE-ASHING / DEMETALLIZATION → CRUDE UPGRADING →
              ATMOSPHERIC &amp; VACUUM DISTILLATION → THERMAL CRACKING /
              RESIDUE UPGRADING → DESULFURIZATION → PRODUCT BLENDING
            </p>
            <strong>Diesel · Naphtha · Fuel Products</strong>
          </div>
        </div>
      </section>

      {/* WELLHEAD GAS */}
      <section className="section dark-section" id="wellhead-gas">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">WELLHEAD GAS</span>
            <h2>Wellhead Gas Monetization</h2>
            <p>
              From wellhead gas to revenue. Titan X Energy develops modular
              processing and downstream pathways for remote, dispersed, or
              infrastructure-constrained natural gas resources.
            </p>
          </div>

          <div className="gas-flow">
            <div>WELLHEAD GAS</div>
            <span>→</span>
            <div>PRETREATMENT</div>
            <span>→</span>
            <div>GAS PROCESSING</div>
            <span>→</span>
            <div>MONETIZATION</div>
          </div>

          <div className="three-card-grid">
            <article className="solution-card">
              <span className="card-number"></span>
              <h3>CNG</h3>
              <h4>Compressed Natural Gas</h4>
              <p>
                Gas is purified and compressed into a transportable commodity
                for nearby industrial customers, vehicle fuel, and
                short-to-medium-distance transportation.
              </p>
            </article>

            <article className="solution-card">
              <span className="card-number"></span>
              <h3>LPG / NGL</h3>
              <h4>Natural Gas Liquids Recovery</h4>
              <p>
                Separation and NGL recovery can produce LPG, condensate, and
                other NGL products, creating multiple potential revenue
                streams.
              </p>
            </article>

            <article className="solution-card">
              <span className="card-number"></span>
              <h3>DISTRIBUTED POWER</h3>
              <h4>Power at the Source</h4>
              <p>
                Condition wellhead gas and convert the resource directly into
                electricity for oilfields, microgrids, grid-connected
                generation, or distributed computing.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* DISTRIBUTED POWER */}
      <section className="section" id="distributed-power">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">WELLHEAD GAS · POWER</span>
            <h2>Gas at the Wellhead. Power at the Source.</h2>
            <p>
              Localized power generation converts wellhead gas into
              distributed electricity, reducing dependence on diesel
              generation or purchased grid power where project conditions
              support the model.
            </p>
          </div>

          <div className="application-grid">
            <article>
              <h3>Oilfield Power</h3>
              <p>
                Electricity for pumpjacks, compressors, water pumps, processing
                equipment, and other oilfield facilities.
              </p>
            </article>

            <article>
              <h3>Local Microgrid</h3>
              <p>
                One wellsite or multiple nearby wellsites can serve as energy
                nodes within a modular distributed-energy system.
              </p>
            </article>

            <article>
              <h3>Grid Connection</h3>
              <p>
                Where regulations, grid conditions, and project economics
                permit, generation can be connected to the regional grid.
              </p>
            </article>

            <article>
              <h3>Distributed Computing</h3>
              <p>
                Wellhead gas, distributed generation, and modular data centers
                can provide on-site energy for AI computing and other
                high-load facilities.
              </p>
            </article>
          </div>

          <div className="highlight-strip">
            <strong>THREE PRINCIPAL MONETIZATION PATHWAYS</strong>
            <span>
              Wellhead Gas → CNG&nbsp;&nbsp; | &nbsp;&nbsp;Wellhead Gas → LPG /
              NGL&nbsp;&nbsp; | &nbsp;&nbsp;Wellhead Gas → Distributed Power
            </span>
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="section dark-section" id="solutions">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">SOLUTIONS</span>
            <h2>Solutions Built Around Customer Scenarios</h2>
            <p>
              Customers provide the resource conditions, logistics
              constraints, and end-market requirements. Titan X Energy
              develops the appropriate resource-monetization pathway.
            </p>
          </div>

          <div className="scenario-table">
            <div className="table-head">
              <span>Customer Scenario</span>
              <span>Typical Challenge</span>
              <span>Recommended Solution</span>
            </div>

            <div className="table-row">
              <strong>Stranded Oil</strong>
              <p>
                Crude production exists, but refineries are distant and
                transportation costs are high.
              </p>
              <b>Modular Refinery</b>
            </div>

            <div className="table-row">
              <strong>Stranded Gas</strong>
              <p>
                Natural gas lacks pipeline access or is being vented or
                flared.
              </p>
              <b>CNG / LPG-NGL / Distributed Power</b>
            </div>

            <div className="table-row">
              <strong>Remote Oilfield</strong>
              <p>
                Infrastructure is limited and energy supply is dispersed.
              </p>
              <b>
                Modular Refining + Gas Processing + Distributed Power
              </b>
            </div>

            <div className="table-row">
              <strong>Digital Energy</strong>
              <p>Sites are dispersed and O&amp;M costs are high.</p>
              <b>Digital Twin + Remote Operation + AI Optimization</b>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">SERVICES</span>
            <h2>Core Capabilities &amp; Services</h2>
            <p>
              Titan X Energy is positioned as a technology-integration and
              full-lifecycle service platform for modular refining, wellhead
              gas processing and utilization, and distributed-energy projects.
            </p>
          </div>

          <div className="service-grid">
            <article className="service-card">
              <span></span>
              <h3>Engineering &amp; Technical Consulting</h3>
              <p>
                Technology-route selection, process optimization, equipment
                configuration, and system integration based on feedstock,
                site conditions, product requirements, and investment
                objectives.
              </p>
            </article>

            <article className="service-card">
              <span></span>
              <h3>Supply Chain Integration</h3>
              <p>
                Integration of equipment manufacturers, critical-component
                suppliers, and specialized engineering resources through
                modularization, standardization, and prefabrication.
              </p>
            </article>

            <article className="service-card">
              <span></span>
              <h3>Project Management &amp; Delivery</h3>
              <p>
                Engineering, procurement, manufacturing, transportation, site
                installation, system integration, commissioning, and
                start-up.
              </p>
            </article>

            <article className="service-card">
              <span></span>
              <h3>Digital Operations &amp; Maintenance</h3>
              <p>
                Real-time monitoring, data analytics, performance
                optimization, fault warning, and remote technical support
                through the digital-twin platform.
              </p>
            </article>
          </div>

          <div className="core-value">
            <span>CORE VALUE</span>
            <strong>
              ENGINEERING → SUPPLY CHAIN → PROJECT DELIVERY → DIGITAL O&amp;M
            </strong>
          </div>
        </div>
      </section>

      {/* DIGITAL TWIN */}
      <section className="section digital-section" id="digital-twin">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">DIGITAL TWIN / AIoT</span>
            <h2>One Digital Platform Across the Project Lifecycle</h2>
            <p>
              The digital platform connects equipment, projects, and remote
              operations through a unified operating architecture.
            </p>
          </div>

          <div className="digital-flow">
            <div>FIELD EQUIPMENT</div>
            <span>→</span>
            <div>SENSORS / PLC / SCADA</div>
            <span>→</span>
            <div>CLOUD / EDGE</div>
            <span>→</span>
            <div>DIGITAL TWIN</div>
            <span>→</span>
            <div>AI OPTIMIZATION</div>
            <span>→</span>
            <div>REMOTE CONTROL CENTER</div>
          </div>

          <div className="digital-features">
            <article>
              <h3>Real-Time Monitoring</h3>
              <p>
                Real-time operating data and equipment-condition monitoring.
              </p>
            </article>

            <article>
              <h3>Remote Operation</h3>
              <p>
                Remote control and centralized management of multiple projects.
              </p>
            </article>

            <article>
              <h3>Predictive Maintenance</h3>
              <p>
                Predictive maintenance and early fault warning based on
                operating data.
              </p>
            </article>

            <article>
              <h3>Performance Optimization</h3>
              <p>
                Optimization of production, energy consumption, product slate,
                and equipment performance.
              </p>
            </article>
          </div>

          <div className="digital-note">
            Modular refining · CNG · LPG/NGL · Wellhead-gas distributed power
            → One Digital Operating Platform
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section" id="projects">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">PROJECTS</span>
            <h2>Global Project Development</h2>
            <p>
              Project opportunities and development activities across key
              energy markets. Project stage and client disclosure will vary
              according to commercial status and confidentiality.
            </p>
          </div>

          <div className="project-grid">
            <article className="project-card">
              <span>NORTH AMERICA</span>
              <h3>Wellhead Gas &amp; Distributed Energy</h3>
              <p>
                Wellhead Gas / CNG / LPG / Distributed Power / Distributed
                Computing
              </p>
              <small>PROJECT DEVELOPMENT</small>
            </article>

            <article className="project-card">
              <span>LATIN AMERICA</span>
              <h3>Heavy Oil &amp; Modular Refining</h3>
              <p>Heavy Oil / Modular Refining</p>
              <small>PROJECT DEVELOPMENT</small>
            </article>

            <article className="project-card">
              <span>INDONESIA</span>
              <h3>Wellhead Oil</h3>
              <p>Modular Refining Demonstration</p>
              <small>PROJECT DEVELOPMENT</small>
            </article>

            <article className="project-card">
              <span>AUSTRALIA</span>
              <h3>Modular Energy</h3>
              <p>Modular Energy / Gas-to-Power</p>
              <small>PROJECT DEVELOPMENT</small>
            </article>

            <article className="project-card">
              <span>CANADA</span>
              <h3>Upstream Oil &amp; Gas</h3>
              <p>
                Wellhead Gas Monetization / Modular Refining
              </p>
              <small>PROJECT DEVELOPMENT</small>
            </article>
          </div>
        </div>
      </section>


      {/* BRAND MESSAGE */}
      <section className="brand-statement">
        <div className="container">
          <span className="eyebrow">TITAN X ENERGY</span>
          <h2>FROM WELLHEAD TO MARKET</h2>
          <p>
            Turning oil and gas resources into value—from the wellhead to the
            market.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact-section" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy">
            <span className="eyebrow">CONTACT TITAN X ENERGY</span>
            <h2>Let&apos;s Build the Next Generation of Energy Infrastructure.</h2>
            <p>
              Tell us about your resource, location, infrastructure
              constraints, product requirements, or project objectives.
            </p>

            <div className="contact-points">
              <div>
                <strong>RESOURCE</strong>
                <span>Crude Oil · Natural Gas · Wellhead Resources</span>
              </div>

              <div>
                <strong>PROJECT</strong>
                <span>Development · Investment · Strategic Partnership</span>
              </div>

              <div>
                <strong>SOLUTIONS</strong>
                <span>Refining · Gas · Power · Digital Energy</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>
                Name *
                <input name="name" required />
              </label>

              <label>
                Company
                <input name="company" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Email *
                <input name="email" type="email" required />
              </label>

              <label>
                Phone
                <input name="phone" />
              </label>
            </div>

            <div className="form-row">
              <label>
                Country / Region
                <input name="region" />
              </label>

              <label>
                Inquiry Type *
                <select name="inquiryType" required defaultValue="">
                  <option value="" disabled>
                    Select an inquiry type
                  </option>
                  <option value="Business Inquiry">
                    Business Inquiry
                  </option>
                  <option value="Technology Partnership">
                    Technology Partnership
                  </option>
                  <option value="Investment & Strategic Cooperation">
                    Investment &amp; Strategic Cooperation
                  </option>
                </select>
              </label>
            </div>

            <label>
              Message *
              <textarea name="message" rows={7} required />
            </label>

            <button
              type="submit"
              className="button button-primary form-submit"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Inquiry"}
            </button>

            {status && <p className="form-status">{status}</p>}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div>
<div className="brand">
  <img src="/logo.png" alt="Titan X Energy" className="brand-logo" />
</div>
            <p>
              Modular Refining · Wellhead Gas Monetization · Distributed Power
              · Digital Energy
            </p>
          </div>

          <div className="footer-bottom">
            <span>FROM WELLHEAD TO MARKET</span>
            <span>© {new Date().getFullYear()} Titan X Energy</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
