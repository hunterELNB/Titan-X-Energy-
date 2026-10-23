
"use client";

import { FormEvent, useState } from "react";
import "./globals.css";

export default function Home() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      message: data.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
    <a
      href="#home"
      className="brand"
      onClick={() => setMenuOpen(false)}
    >
      <img
        src="/logo.png"
        alt="TitanX Energy"
        className="brand-logo"
      />
    </a>

    <button
      type="button"
      className="mobile-menu-toggle"
      aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen((open) => !open)}
    >
      <span />
      <span />
      <span />
    </button>

    <nav className={`nav-links${menuOpen ? " nav-links-open" : ""}`}>
      <a href="#home" onClick={() => setMenuOpen(false)}>HOME</a>
      <a href="#refining" onClick={() => setMenuOpen(false)}>MODULAR REFINERIES</a>
      <a href="#wellhead-gas" onClick={() => setMenuOpen(false)}>WELLHEAD GAS</a>
      <a href="#solutions" onClick={() => setMenuOpen(false)}>INTEGRATED SOLUTIONS</a>
      <a href="#services" onClick={() => setMenuOpen(false)}>SERVICES</a>
      <a href="#digital-twin" onClick={() => setMenuOpen(false)}>DIGITAL TWIN</a>
      <a href="#projects" onClick={() => setMenuOpen(false)}>PROJECTS</a>
      <a href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</a>
    </nav>
  </div>
</header>



      {/* HOME */}
      <section className="hero" id="home">
        <div
          className="hero-image"
          style={{ backgroundImage: "url('/hero.jpg')" }}
        />

        <div className="container hero-content">
          <div className="kicker">TITANX ENERGY</div>

          <h1>Customized Modular Crude Oil Processing & Wellhead-Gas to Power Operations</h1>

          <p className="hero-subtitle">
            Modular Refineries · Wellhead Gas Processing · Integrated Project
            Services
          </p>

          <p className="hero-description">
            TitanX Energy | Integrated Modular Refining & Wellhead Gas-to-Power Solutions—from Engineering and Supply Chain Integration to Project Delivery and AI-Powered Digital Twin Operations & Maintenance.
          </p>

          

          <div className="hero-actions">
            <a href="#solutions" className="button button-primary">
              Explore Our Solutions
            </a>
            <a href="#contact" className="button button-secondary">
              Discuss Your Project
            </a>
          </div>
        </div>
      </section>

      {/* OUR CORE OFFERINGS */}
      <section className="section business-entrances">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">OUR CORE OFFERINGS</span>
            <h2>Customized Facilities. Integrated Services.</h2>
            <p>
              TitanX Energy connects customized processing facilities with
              coordinated technical, supply chain, project delivery, and
              digital operating services.
            </p>
          </div>

          <div className="business-grid">
            <a href="#refining" className="business-card">
              <span className="card-number"></span>
              <h3>MODULAR REFINERIES</h3>
              <strong>Customized Refining Configurations</strong>
              <p>
                Refinery configurations developed around crude characteristics,
                capacity requirements, target products, and local operating
                conditions.
              </p>
              <span className="card-link">
                EXPLORE MODULAR REFINERIES →
              </span>
            </a>

            <a href="#wellhead-gas" className="business-card">
              <span className="card-number"></span>
              <h3>WELLHEAD GAS PROCESSING</h3>
              <strong>Gas Treatment and Processing</strong>
              <p>
                Modular treatment and processing configurations aligned with
                gas composition, site conditions, and the intended downstream
                application.
              </p>
              <span className="card-link">
                EXPLORE WELLHEAD GAS →
              </span>
            </a>
          </div>

          <div className="three-card-grid">
            <article className="solution-card">
              <span className="card-number"></span>
              <h3>INTEGRATED PROJECT SERVICES</h3>
              <h4>From Technical Proposal to Delivery</h4>
              <p>
                Technical proposals, optimized supply chains, coordinated
                project delivery, and digital operating support across the
                project lifecycle.
              </p>
            </article>

            <article className="solution-card">
              <span className="card-number"></span>
              <h3>CUSTOMIZED CONFIGURATION</h3>
              <h4>Designed Around Project Requirements</h4>
              <p>
                Process selection and equipment configuration based on
                feedstock, capacity, product specifications, location, and
                commercial objectives.
              </p>
            </article>

            <article className="solution-card">
              <span className="card-number"></span>
              <h3>DIGITAL OPERATIONS</h3>
              <h4>Connected Facility Lifecycle</h4>
              <p>
                Digital architecture and operating information designed to
                support monitoring, maintenance planning, performance analysis,
                and technical assistance.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* OUR PROJECT APPROACH */}
      <section className="section dark-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">OUR PROJECT APPROACH</span>
            <h2>From Customer Requirements to Operations</h2>
            <p>
              Each project follows a coordinated development process, with
              technical configuration and delivery scope defined around the
              customer&apos;s requirements.
            </p>
          </div>

          <div className="digital-flow">
            <div>CUSTOMER REQUIREMENTS</div>
            <span>→</span>
            <div>TECHNICAL PROPOSAL</div>
            <span>→</span>
            <div>MODULAR CONFIGURATION</div>
            <span>→</span>
            <div>SUPPLY CHAIN &amp; PROJECT MANAGEMENT</div>
            <span>→</span>
            <div>DIGITAL OPERATIONS</div>
          </div>

          <div className="highlight-strip">
            <strong>FACILITY LOCATION &amp; PROJECT DESIGN</strong>
            <span>
              Feedstock Availability · Utilities · Product Markets · Transport
              Access · Customer Requirements
            </span>
          </div>
        </div>
      </section>

      {/* MODULAR REFINERIES */}
      <section className="section" id="refining">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">MODULAR REFINERIES</span>
            <h2>Modular Refining Designed Around Your Requirements</h2>
            <p>
              TitanX Energy develops customized modular refinery solutions
              for deployment at oilfields or other suitable locations with
              efficient logistics access. The process configuration is selected
              to match the crude oil characteristics, required throughput,
              target product slate, and local operating conditions.
            </p>
          </div>

          <div className="two-column">
            <div>
              <h3>A Customized Process Configuration</h3>
              <p>
                A modular refinery combines selected processing units into an
                integrated facility. Depending on the feedstock and product
                requirements, the configuration may include crude pretreatment,
                atmospheric and vacuum distillation, upgrading or conversion,
                desulfurization, and product blending.
              </p>
              <p>
                The technical proposal defines which units are required and
                how they work together. Equipment selection, operating
                conditions, utilities, and product quality requirements are
                evaluated as part of the project design.
              </p>
            </div>

            <div>
              <h3>Key Design Inputs</h3>
              <ul className="feature-list">
                <li>
                  <strong>Feedstock —</strong> Crude assay, viscosity, sulfur,
                  metals, solids, and other relevant properties.
                </li>
                <li>
                  <strong>Capacity —</strong> Available feedstock volume,
                  operating schedule, and future expansion requirements.
                </li>
                <li>
                  <strong>Products —</strong> Target fuels or intermediate
                  products and applicable specifications.
                </li>
                <li>
                  <strong>Location —</strong> Land, utilities, transport routes,
                  storage, and access to product markets.
                </li>
                <li>
                  <strong>Project Objectives —</strong> Investment parameters,
                  delivery requirements, and operating model.
                </li>
              </ul>
            </div>
          </div>

          <div className="process-box">
            <span>MODULAR DESIGN &amp; FACTORY PREFABRICATION</span>
            <p>
              PROCESS SELECTION → UNIT CONFIGURATION → FACTORY FABRICATION →
              TRANSPORTATION → SITE INTEGRATION
            </p>
            <strong>
              Transport Restrictions · Site Access · Installation ·
              Maintainability
            </strong>
          </div>

          <div className="two-column">
            <div>
              <h3>Modular Design and Factory Prefabrication</h3>
              <p>
                Modular design supports factory fabrication of selected
                equipment assemblies, coordinated shipment, and planned site
                integration. Module dimensions and interfaces are developed
                around transport restrictions, site access, installation
                requirements, and maintainability.
              </p>
            </div>

            <div>
              <h3>From Proposal to Operations</h3>
              <p>
                Our services connect process selection and equipment
                configuration with procurement coordination, project delivery,
                commissioning support, and digital operations. The scope is
                defined for each project and aligned with the customer&apos;s
                team and delivery partners.
              </p>
            </div>
          </div>

          <div className="hero-actions">
            <a href="#contact" className="button button-primary">
              Discuss Your Refinery Requirements
            </a>
          </div>
        </div>
      </section>

      {/* WELLHEAD GAS */}
      <section className="section dark-section" id="wellhead-gas">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">WELLHEAD GAS</span>
            <h2>Customized Modular Wellhead Gas Processing</h2>
            <p>
              TitanX Energy develops modular wellhead gas treatment and
              processing configurations based on gas composition, pressure,
              flow rate, site conditions, and the intended downstream
              application.
            </p>
            <p>
              The technical proposal defines the required treatment,
              separation, and pressure management stages, together with
              equipment and utility interfaces. Downstream options are
              evaluated against product requirements, logistics, and project
              economics.
            </p>
          </div>

          <div className="two-column">
            <div>
              <h3>Project-Specific Gas Processing</h3>
              <p>
                Gas composition, operating pressure, flow rate, and feed
                variability are evaluated to establish the project design
                basis. Treatment and processing requirements are selected
                according to the intended application and applicable product
                specifications.
              </p>
            </div>

            <div>
              <h3>Technical Configuration</h3>
              <ul className="feature-list">
                <li>Gas composition and feed conditions</li>
                <li>Required treatment and separation</li>
                <li>Pressure management and utility requirements</li>
                <li>Equipment interfaces and site conditions</li>
                <li>Downstream application and project economics</li>
              </ul>
            </div>
          </div>

          <div className="process-box">
            <span>PROJECT DEVELOPMENT APPROACH</span>
            <p>
              GAS CHARACTERIZATION → TECHNICAL PROPOSAL → PROCESS
              CONFIGURATION → EQUIPMENT INTEGRATION → PROJECT DELIVERY
            </p>
            <strong>
              Each processing route is defined by the project requirements.
            </strong>
          </div>

          <div className="hero-actions">
            <a href="#contact" className="button button-primary">
              Discuss Your Gas Processing Requirements
            </a>
          </div>
        </div>
      </section>

      {/* INTEGRATED SOLUTIONS */}
      <section className="section" id="solutions">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">INTEGRATED SOLUTIONS</span>
            <h2>Vertically Integrated Solutions</h2>
            <p>
              TitanX Energy coordinates the engineering, equipment supply,
              project delivery, and operating support required to develop
              customized modular oil and gas processing facilities. This
              vertically integrated service approach connects decisions across
              the project lifecycle.
            </p>
          </div>

          <div className="two-column">
            <div>
              <h3>Start with the Customer&apos;s Requirements</h3>
              <p>
                We assess feedstock data, product requirements, site
                conditions, logistics, and investment objectives to define the
                project basis. The resulting technical proposal establishes the
                process configuration, key equipment, utilities, interfaces,
                and delivery scope.
              </p>
            </div>

            <div>
              <h3>Connect Design with Supply and Delivery</h3>
              <p>
                Equipment and supplier selection are coordinated with the
                technical design and project schedule. Procurement, fabrication,
                inspection, transportation, installation, and commissioning
                interfaces are managed within an integrated delivery plan.
              </p>
            </div>

            <div>
              <h3>Build Operations into the Project</h3>
              <p>
                Monitoring requirements, operating data, maintenance access,
                and digital interfaces are considered during design. This helps
                connect the delivered facility with the operating support
                needed throughout its service life.
              </p>
            </div>

            <div>
              <h3>A Defined Scope for Each Project</h3>
              <p>
                The service scope can cover technical studies, equipment
                supply coordination, project management, digital operating
                support, or a coordinated package. Responsibilities and
                interfaces are established with the customer and project
                partners.
              </p>
            </div>
          </div>

          <div className="three-card-grid">
            <article className="solution-card">
              <span className="card-number"></span>
              <h3>OILFIELD REFINING</h3>
              <h4>Processing Close to Feedstock</h4>
              <p>
                Modular crude processing facilities located close to feedstock
                production where site conditions and project economics support
                deployment.
              </p>
            </article>

            <article className="solution-card">
              <span className="card-number"></span>
              <h3>LOGISTICS-ACCESSIBLE LOCATIONS</h3>
              <h4>Designed Around Market Access</h4>
              <p>
                Facilities positioned to balance crude supply, transport
                access, utilities, storage, and downstream markets.
              </p>
            </article>

            <article className="solution-card">
              <span className="card-number"></span>
              <h3>INTEGRATED OIL &amp; GAS FACILITIES</h3>
              <h4>Coordinated Project Systems</h4>
              <p>
                Refining, gas processing, utilities, and digital operations
                coordinated where the project requires an integrated approach.
              </p>
            </article>
          </div>

          <div className="highlight-strip">
            <strong>INTEGRATED PROJECT DELIVERY</strong>
            <span>
              Technical Studies · Equipment Coordination · Project Management ·
              Digital Operating Support
            </span>
          </div>

          <div className="hero-actions">
            <a href="#contact" className="button button-primary">
              Explore an Integrated Solution
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section dark-section" id="services">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">SERVICES</span>
            <h2>Integrated Services Across the Project Lifecycle</h2>
            <p>
              TitanX Energy provides customized technical proposals,
              optimized supply chain management, project management, and
              digital twin based operating services for modular refining and
              wellhead gas processing projects.
            </p>
          </div>

          <div className="service-grid">
            <article className="service-card">
              <span></span>
              <h3>Customized Technical Proposals</h3>
              <p>
                We translate customer requirements into a technical proposal
                covering feedstock assessment, process route selection,
                capacity, product targets, equipment configuration, utilities,
                and site interfaces. Options are evaluated against the
                project&apos;s technical and commercial requirements.
              </p>
            </article>

            <article className="service-card">
              <span></span>
              <h3>Optimized Supply Chain Management</h3>
              <p>
                We coordinate equipment manufacturers, component suppliers,
                and specialist engineering resources around the agreed project
                specification. Supply planning considers equipment
                compatibility, supplier capability, quality requirements, lead
                times, transportation, and lifecycle support.
              </p>
            </article>

            <article className="service-card">
              <span></span>
              <h3>Project Management</h3>
              <p>
                We coordinate the agreed project scope from design and
                procurement through fabrication, transportation, installation,
                and commissioning. Project controls address schedule, cost,
                quality, technical interfaces, and delivery risks, with defined
                responsibilities across the customer, suppliers, and site
                teams.
              </p>
            </article>

            <article className="service-card">
              <span></span>
              <h3>Digital Twin Based Operating Services</h3>
              <p>
                We support facility monitoring, operating analysis,
                maintenance planning, and technical assistance through a
                project-specific digital architecture. Digital models and
                operating data can help identify performance deviations and
                support better operating decisions.
              </p>
            </article>
          </div>

          <div className="core-value">
            <span>FLEXIBLE ENGAGEMENT</span>
            <strong>
              TECHNICAL PROPOSALS → SUPPLY CHAIN → PROJECT MANAGEMENT →
              DIGITAL OPERATING SUPPORT
            </strong>
            <p>
              Customers can engage TitanX Energy for an individual service or
              an integrated project package. Scope, deliverables,
              responsibilities, and service arrangements are defined for each
              engagement.
            </p>
          </div>

          <div className="hero-actions">
            <a href="#contact" className="button button-primary">
              Discuss Your Service Requirements
            </a>
          </div>
        </div>
      </section>

      {/* DIGITAL TWIN */}
      <section className="section digital-section" id="digital-twin">
        <div className="container">
          <div className="section-heading centered">
            <span className="eyebrow">DIGITAL TWIN</span>
            <h2>
              Digital Tools for Proposals, Project Management and Operations
            </h2>
            <p>
              TitanX Energy&apos;s digital twin approach supports three
              connected activities: developing customized technical proposals,
              managing project information and delivery, and establishing the
              facility&apos;s operating architecture.
            </p>
          </div>


<div
  style={{
    textAlign: "center",
    margin: "30px 0 45px",
  }}
>
  <p
    style={{
      fontSize: "15px",
      marginBottom: "20px",
    }}
  >
    Experience our interactive 3D visualization of modular refining
    and wellhead gas processing facilities.
  </p>

  <a
    href="/digital-twin"
    className="button button-primary"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      padding: "20px 38px",
      fontSize: "16px",
      fontWeight: 700,
      letterSpacing: "0.5px",
      boxShadow: "0 8px 28px rgba(0, 120, 220, 0.3)",
    }}
  >
    ▶ LAUNCH INTERACTIVE 3D DEMO
    <span aria-hidden="true">↗</span>
  </a>

  <p
    style={{
      fontSize: "12px",
      marginTop: "14px",
      opacity: 0.7,
    }}
  >
    Interactive Demo · Modular Refining &amp; Wellhead Gas Processing
  </p>
</div>


          <div className="digital-flow">
            <div>CUSTOMER &amp; FEEDSTOCK DATA</div>
            <span>→</span>
            <div>TECHNICAL CONFIGURATION</div>
            <span>→</span>
            <div>PROJECT &amp; EQUIPMENT RECORDS</div>
            <span>→</span>
            <div>OPERATING DATA</div>
            <span>→</span>
            <div>ANALYSIS &amp; OPERATING SUPPORT</div>
          </div>

          <div className="digital-features">
            <article>
              <h3>Customized Technical Proposal Development</h3>
              <p>
                Structured feedstock data, customer requirements, process
                models, and equipment information support the efficient
                development and comparison of technical configurations.
                Engineering review remains central to confirming the selected
                design and its project-specific requirements.
              </p>
            </article>

            <article>
              <h3>Project Management and Delivery Coordination</h3>
              <p>
                The digital architecture can link equipment information,
                engineering documents, procurement status, fabrication
                milestones, and commissioning records. A coordinated
                information structure helps project teams manage interfaces
                and track delivery against the agreed scope.
              </p>
            </article>

            <article>
              <h3>Operating Architecture</h3>
              <p>
                The operating platform is configured around the facility&apos;s
                equipment, instrumentation, control systems, connectivity, and
                reporting requirements. It connects available operating data
                with digital models and analytical tools to support monitoring
                and technical decisions.
              </p>
            </article>

            <article>
              <h3>Monitoring</h3>
              <p>
                Display operating conditions, equipment status, and relevant
                production indicators according to the facility&apos;s
                instrumentation and available data.
              </p>
            </article>

            <article>
              <h3>Performance Analysis</h3>
              <p>
                Compare operating data with design targets and expected
                behavior to support operating assessments and technical
                decisions.
              </p>
            </article>

            <article>
              <h3>Maintenance Support</h3>
              <p>
                Identify equipment-condition trends and support maintenance
                planning, fault investigation, and technical coordination.
              </p>
            </article>

            <article>
              <h3>Technical Support</h3>
              <p>
                Provide a shared information base for site teams and remote
                specialists to support troubleshooting and operating
                decisions.
              </p>
            </article>
          </div>

          <div className="digital-note">
            Digital functions are selected for each facility according to
            available data, system interfaces, and customer requirements.
          </div>

          <div className="hero-actions">
            <a href="#contact" className="button button-primary">
              Discuss Digital Integration
            </a>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section" id="projects">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">PROJECTS</span>
            <h2>Project Development and Collaboration</h2>
            <p>
              TitanX Energy works with customers and project partners to
              evaluate opportunities for customized modular refining and
              wellhead gas processing facilities.
            </p>
            <p>
              Project discussions begin with feedstock availability, site and
              logistics conditions, product demand, and the required service
              scope. We use these inputs to develop the technical configuration
              and delivery approach.
            </p>
          </div>

          <div className="two-column">
            <div>
              <h3>Project Evaluation</h3>
              <ul className="feature-list">
                <li>Feedstock availability and characteristics</li>
                <li>Proposed location and site conditions</li>
                <li>Utilities, logistics, and transport access</li>
                <li>Target products and market requirements</li>
                <li>Required technical and delivery scope</li>
              </ul>
            </div>

            <div>
              <h3>Technical Configuration and Delivery</h3>
              <p>
                Each opportunity is evaluated on its own requirements. The
                technical proposal establishes the appropriate process
                configuration, key equipment, project interfaces, and
                potential delivery arrangements.
              </p>
              <p>
                Responsibilities, project stages, and disclosure of project
                details are confirmed with the relevant customers and project
                partners.
              </p>
            </div>
          </div>

          <div className="process-box">
            <span>PROJECT DEVELOPMENT</span>
            <p>
              OPPORTUNITY ASSESSMENT → TECHNICAL PROPOSAL → PROJECT SCOPE →
              DELIVERY PLANNING → OPERATING SUPPORT
            </p>
            <strong>
              Customized Modular Refining · Wellhead Gas Processing ·
              Integrated Project Services
            </strong>
          </div>

          <div className="hero-actions">
            <a href="#contact" className="button button-primary">
              Discuss a Project Opportunity
            </a>
          </div>
        </div>
      </section>

      {/* BRAND MESSAGE */}
      <section className="brand-statement">
        <div className="container">
          <span className="eyebrow">TitanX ENERGY</span>
          <h2>FROM REQUIREMENTS TO OPERATIONS</h2>
          <p>
            Customized modular refining and wellhead gas processing facilities,
            supported by integrated project services and digital operations.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact-section" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy">
            <span className="eyebrow">CONTACT TitanX ENERGY</span>
            <h2>Tell Us About Your Project</h2>
            <p>
              Share your feedstock information, proposed location, required
              capacity, target products, and project objectives. We will discuss
              the appropriate technical approach and service scope with you.
            </p>

            <div className="contact-points">
              <div>
                <strong>FACILITIES</strong>
                <span>Modular Refineries · Wellhead Gas Processing</span>
              </div>

              <div>
                <strong>PROJECT SERVICES</strong>
                <span>
                  Technical Proposals · Supply Chain · Project Management
                </span>
              </div>

              <div>
                <strong>DIGITAL</strong>
                <span>Digital Twin · Operating Support · Technical Integration</span>
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
                Country or Region
                <input name="region" />
              </label>

              <label>
                Inquiry Type *
                <select name="inquiryType" required defaultValue="">
                  <option value="" disabled>
                    Select an inquiry type
                  </option>
                  <option value="Modular Refinery">
                    Modular Refinery
                  </option>
                  <option value="Wellhead Gas Processing">
                    Wellhead Gas Processing
                  </option>
                  <option value="Integrated Project Services">
                    Integrated Project Services
                  </option>
                  <option value="Digital Twin and Operating Services">
                    Digital Twin and Operating Services
                  </option>
                  <option value="Project Partnership">
                    Project Partnership
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
              <img
                src="/logo.png"
                alt="TitanX Energy"
                className="brand-logo"
              />
            </div>

            <p>
              Customized Modular Refineries · Wellhead Gas Processing ·
              Integrated Services · Digital Twin
            </p>
          </div>

          <div className="footer-bottom">
            <span>TitanX ENERGY</span>
            <span>© 2026 TitanX Energy. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
