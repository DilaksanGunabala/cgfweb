import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const COLORS = {
  bg: "#050709",
  bgCard: "rgba(255,255,255,0.04)",
  bgGlass: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.15)",
  primary: "#06B6D4",
  primaryGlow: "rgba(6,182,212,0.3)",
  accent: "#8B5CF6",
  accentGlow: "rgba(139,92,246,0.3)",
  text: "#F8FAFC",
  textMuted: "#94A3B8",
  textDim: "#64748B",
  success: "#22C55E",
  warning: "#F59E0B",
};

const SERVICES = [
  { id: "web-dev", icon: "🌐", title: "Web Application Development", short: "Custom SaaS platforms, dashboards & web portals built with modern frameworks.", tech: ["React", "Next.js", "Node.js", "PostgreSQL", "AWS"], benefits: ["Scalable architecture", "Real-time features", "API-first design", "99.9% uptime SLA"] },
  { id: "mobile-dev", icon: "📱", title: "Mobile App Development", short: "Native & cross-platform mobile apps for iOS and Android.", tech: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"], benefits: ["Cross-platform efficiency", "Native performance", "Offline-first", "Push notifications"] },
  { id: "ui-ux", icon: "🎨", title: "UI/UX Design", short: "Research-driven design systems, prototypes & user experiences.", tech: ["Figma", "Adobe XD", "Framer", "Principle", "Maze"], benefits: ["User research backed", "Accessible design", "Design systems", "Rapid prototyping"] },
  { id: "web-redesign", icon: "🔄", title: "Website Redesign", short: "Modernize your digital presence with performance-first redesigns.", tech: ["Next.js", "Tailwind", "Vercel", "Lighthouse", "Core Web Vitals"], benefits: ["Speed optimization", "SEO improvement", "Modern stack", "A/B tested"] },
  { id: "app-redesign", icon: "✨", title: "Mobile App Redesign", short: "Revamp your mobile experience with modern UX patterns.", tech: ["Flutter", "React Native", "Material 3", "iOS HIG"], benefits: ["UX overhaul", "Accessibility", "Platform updates", "Retention boost"] },
  { id: "ai-agents", icon: "🤖", title: "AI Agent Development", short: "Custom AI agents, automation workflows & intelligent chatbots.", tech: ["OpenAI", "LangChain", "Python", "n8n", "TensorFlow"], benefits: ["Task automation", "24/7 availability", "Cost reduction", "Smart routing"] },
];

const PORTFOLIO = [
  { id: 1, title: "StyleVault E-Commerce", category: "Web", client: "StyleVault Inc.", desc: "Full-stack e-commerce platform with AI-powered recommendations, real-time inventory, and seamless checkout.", tech: ["Next.js", "Stripe", "PostgreSQL", "Redis"], result: "340% increase in online sales" },
  { id: 2, title: "MediBook Health App", category: "Mobile", client: "MediBook Health", desc: "Healthcare appointment booking app with telemedicine integration, prescription management, and health records.", tech: ["React Native", "Firebase", "WebRTC", "HL7"], result: "50K+ downloads in 3 months" },
  { id: 3, title: "FinTrack Dashboard", category: "Web", client: "FinTrack Capital", desc: "Real-time fintech analytics dashboard with portfolio tracking, risk assessment, and automated reporting.", tech: ["React", "D3.js", "Node.js", "MongoDB"], result: "60% faster decision making" },
  { id: 4, title: "CustomerAI Chatbot", category: "AI", client: "RetailMax Corp", desc: "AI-powered customer service chatbot handling 80% of support queries with natural language understanding.", tech: ["GPT-4", "LangChain", "Python", "Redis"], result: "80% query resolution rate" },
  { id: 5, title: "PropFinder Platform", category: "Web", client: "PropFinder Realty", desc: "Real estate listing platform with virtual tours, mortgage calculator, and neighborhood analytics.", tech: ["Next.js", "Mapbox", "Three.js", "Prisma"], result: "2x lead conversion rate" },
  { id: 6, title: "MetricFlow Analytics", category: "AI", client: "MetricFlow SaaS", desc: "AI-driven SaaS analytics platform with predictive insights, anomaly detection, and automated reports.", tech: ["Python", "TensorFlow", "FastAPI", "React"], result: "45% churn reduction" },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "CTO, StyleVault", text: "CodeGloFix transformed our entire e-commerce infrastructure. The team's technical depth and attention to detail exceeded our expectations.", avatar: "SC" },
  { name: "Marcus Rivera", role: "Founder, MediBook", text: "They didn't just build an app — they understood our healthcare domain deeply. The result was a product our patients actually love using.", avatar: "MR" },
  { name: "James Worthington", role: "VP Engineering, FinTrack", text: "The dashboard they built processes millions of data points in real-time. Our analysts can now make decisions 60% faster.", avatar: "JW" },
  { name: "Priya Sharma", role: "CEO, RetailMax", text: "The AI chatbot handles 80% of our customer queries automatically. ROI was visible within the first month of deployment.", avatar: "PS" },
];

const BLOG_POSTS = [
  { id: 1, title: "Why AI Agents Are the Future of Business Automation", excerpt: "Discover how autonomous AI agents are reshaping workflows across industries, from customer support to data analysis.", date: "Mar 15, 2026", readTime: "8 min", category: "AI" },
  { id: 2, title: "Next.js 15: What's New for Enterprise Applications", excerpt: "A deep dive into the latest Next.js features and how they impact large-scale application architecture.", date: "Mar 10, 2026", readTime: "6 min", category: "Web Dev" },
  { id: 3, title: "Designing Mobile-First: Lessons from 50+ App Projects", excerpt: "Key principles and patterns we've learned from building mobile applications across healthcare, fintech, and e-commerce.", date: "Mar 5, 2026", readTime: "10 min", category: "Design" },
  { id: 4, title: "The ROI of Website Redesign: A Data-Driven Guide", excerpt: "How to measure and maximize the return on investment from modernizing your web presence.", date: "Feb 28, 2026", readTime: "7 min", category: "Strategy" },
];

const NAV_ITEMS = ["Home", "About", "Services", "Portfolio", "AI Solutions", "Blog", "Contact"];

// Animated particles canvas background
function ParticleBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      o: Math.random() * 0.5 + 0.2,
    }));

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const ps = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dm = Math.hypot(p.x - mx, p.y - my);
        if (dm < 150) {
          const angle = Math.atan2(p.y - my, p.x - mx);
          p.x += Math.cos(angle) * 0.5;
          p.y += Math.sin(angle) * 0.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6,182,212,${p.o})`;
        ctx.fill();

        for (let j = i + 1; j < ps.length; j++) {
          const q = ps[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(6,182,212,${0.15 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

// Animated counter
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.round(ease * end));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// FadeIn wrapper
function FadeIn({ children, delay = 0, style = {} }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// Glass Card
function GlassCard({ children, style = {}, hover = true, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: COLORS.bgGlass,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${hovered && hover ? COLORS.borderHover : COLORS.border}`,
        borderRadius: 16,
        padding: "24px",
        transition: "all 0.3s ease",
        transform: hovered && hover ? "translateY(-4px)" : "translateY(0)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Section heading
function SectionHeading({ tag, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      {tag && <span style={{ color: COLORS.primary, fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 12 }}>{tag}</span>}
      <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: COLORS.text, margin: "0 0 16px", lineHeight: 1.2 }}>{title}</h2>
      {subtitle && <p style={{ color: COLORS.textMuted, fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}

// Button
function Btn({ children, primary, onClick, style = {} }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "14px 32px",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: primary ? "none" : `1px solid ${COLORS.border}`,
        background: primary ? (h ? "#0891B2" : COLORS.primary) : (h ? "rgba(255,255,255,0.08)" : "transparent"),
        color: primary ? "#050709" : COLORS.text,
        transform: h ? "translateY(-2px)" : "none",
        boxShadow: primary && h ? `0 8px 30px ${COLORS.primaryGlow}` : "none",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// Badge
function Badge({ children }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 20,
      background: "rgba(6,182,212,0.1)", color: COLORS.primary, fontSize: 12, fontWeight: 500,
    }}>
      {children}
    </span>
  );
}

/* ==================== NAVBAR ==================== */
function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "0 24px",
        background: scrolled ? "rgba(5,7,9,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${COLORS.border}` : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <div onClick={() => { setPage("Home"); window.scrollTo(0, 0); }} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>C</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>CodeGlo<span style={{ color: COLORS.primary }}>Fix</span></span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="nav-desktop">
            {NAV_ITEMS.map((item) => (
              <button key={item} onClick={() => { setPage(item); setMenuOpen(false); window.scrollTo(0, 0); }}
                style={{
                  background: "none", border: "none", color: page === item ? COLORS.primary : COLORS.textMuted,
                  fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "8px 14px", borderRadius: 8,
                  transition: "color 0.2s",
                }}>{item}</button>
            ))}
            <Btn primary onClick={() => { setPage("Contact"); window.scrollTo(0, 0); }} style={{ padding: "10px 24px", fontSize: 14, marginLeft: 8 }}>Get Started</Btn>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile-btn" style={{
            background: "none", border: "none", color: COLORS.text, fontSize: 24, cursor: "pointer", display: "none",
          }}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      </nav>

      {menuOpen && (
        <div style={{
          position: "fixed", top: 72, left: 0, right: 0, bottom: 0, zIndex: 999,
          background: "rgba(5,7,9,0.97)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", padding: "32px 24px", gap: 8,
        }}>
          {NAV_ITEMS.map((item) => (
            <button key={item} onClick={() => { setPage(item); setMenuOpen(false); window.scrollTo(0, 0); }}
              style={{
                background: page === item ? "rgba(6,182,212,0.1)" : "none",
                border: "none", color: page === item ? COLORS.primary : COLORS.text,
                fontSize: 18, fontWeight: 500, padding: "16px 20px", borderRadius: 12,
                textAlign: "left", cursor: "pointer",
              }}>{item}</button>
          ))}
        </div>
      )}
    </>
  );
}

/* ==================== HOME ==================== */
function HomePage({ setPage }) {
  return (
    <>
      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 24px 80px", position: "relative" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.primaryGlow} 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "60%", right: "20%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${COLORS.accentGlow} 0%, transparent 70%)`, filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <FadeIn>
            <Badge>Software Development Company</Badge>
            <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 800, color: COLORS.text, margin: "24px 0", lineHeight: 1.1, letterSpacing: -1 }}>
              Building Smart Digital Solutions with <span style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Code & AI</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
              We craft high-performance web apps, mobile experiences, and AI-powered solutions that help businesses scale globally.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn primary onClick={() => { setPage("Contact"); window.scrollTo(0, 0); }}>Get Started →</Btn>
              <Btn onClick={() => { setPage("Services"); window.scrollTo(0, 0); }}>Our Services</Btn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Trusted By */}
      <section style={{ padding: "40px 24px 60px", overflow: "hidden" }}>
        <p style={{ textAlign: "center", color: COLORS.textDim, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Trusted by innovative companies</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", opacity: 0.4 }}>
          {["StyleVault", "MediBook", "FinTrack", "RetailMax", "PropFinder"].map((c) => (
            <span key={c} style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, letterSpacing: 1 }}>{c}</span>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <SectionHeading tag="What We Do" title="Our Core Services" subtitle="End-to-end software development and AI solutions tailored to your business goals." />
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {SERVICES.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.1}>
              <GlassCard onClick={() => { setPage("Services"); window.scrollTo(0, 0); }} style={{ height: "100%" }}>
                <span style={{ fontSize: 32, display: "block", marginBottom: 16 }}>{s.icon}</span>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.short}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, textAlign: "center" }}>
          {[
            { n: 50, s: "+", l: "Projects Delivered" },
            { n: 15, s: "+", l: "AI Agents Built" },
            { n: 98, s: "%", l: "Client Satisfaction" },
            { n: 5, s: "+", l: "Countries Served" },
          ].map((st, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <GlassCard hover={false}>
                <div style={{ fontSize: 42, fontWeight: 800, color: COLORS.primary, marginBottom: 8 }}>
                  <Counter end={st.n} suffix={st.s} />
                </div>
                <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0 }}>{st.l}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Featured Work */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <SectionHeading tag="Our Work" title="Featured Projects" subtitle="A selection of recent projects that showcase our technical expertise." />
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
          {PORTFOLIO.slice(0, 3).map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.15}>
              <GlassCard onClick={() => { setPage("Portfolio"); window.scrollTo(0, 0); }}>
                <div style={{ height: 180, borderRadius: 12, background: `linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 48, opacity: 0.6 }}>{ p.category === "AI" ? "🤖" : p.category === "Mobile" ? "📱" : "💻" }</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  <Badge>{p.category}</Badge>
                  {p.tech.slice(0, 2).map((t) => <Badge key={t}>{t}</Badge>)}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>{p.title}</h3>
                <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>{p.desc}</p>
                <p style={{ color: COLORS.success, fontSize: 13, fontWeight: 600, margin: 0 }}>↗ {p.result}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <SectionHeading tag="Testimonials" title="What Our Clients Say" subtitle="Real feedback from the teams we've worked with." />
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <GlassCard hover={false} style={{ display: "flex", flexDirection: "column" }}>
                <p style={{ color: COLORS.textMuted, fontSize: 15, lineHeight: 1.7, flex: 1, margin: "0 0 20px", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>{t.avatar}</div>
                  <div>
                    <p style={{ color: COLORS.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{t.name}</p>
                    <p style={{ color: COLORS.textDim, fontSize: 12, margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <FadeIn>
          <GlassCard hover={false} style={{ maxWidth: 700, margin: "0 auto", padding: 48, background: `linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))` }}>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: COLORS.text, margin: "0 0 16px" }}>Ready to Build Something Amazing?</h2>
            <p style={{ color: COLORS.textMuted, fontSize: 16, marginBottom: 32 }}>Let's discuss your project and turn your vision into reality.</p>
            <Btn primary onClick={() => { setPage("Contact"); window.scrollTo(0, 0); }}>Start Your Project →</Btn>
          </GlassCard>
        </FadeIn>
      </section>
    </>
  );
}

/* ==================== ABOUT ==================== */
function AboutPage() {
  const values = [
    { icon: "⚡", title: "Innovation First", desc: "We stay ahead of technology trends to deliver cutting-edge solutions." },
    { icon: "🎯", title: "Client-Centric", desc: "Every decision is driven by what creates the most value for our clients." },
    { icon: "🔒", title: "Quality & Security", desc: "Production-grade code with security best practices built in from day one." },
    { icon: "🤝", title: "Transparency", desc: "Open communication, honest timelines, and no hidden surprises." },
    { icon: "🚀", title: "Scalability", desc: "Architecture designed to grow seamlessly with your business." },
    { icon: "🧠", title: "AI-Native Thinking", desc: "We integrate AI capabilities wherever they can amplify human productivity." },
  ];

  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
      <FadeIn>
        <Badge>About Us</Badge>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: COLORS.text, margin: "16px 0 24px" }}>The Team Behind CodeGloFix</h1>
        <p style={{ color: COLORS.textMuted, fontSize: 17, lineHeight: 1.8, marginBottom: 48 }}>
          Founded with a singular mission — to bridge the gap between complex technology and real business impact. CodeGloFix Pvt Ltd is a software development company that partners with startups, SMBs, and international businesses to build digital products that actually move the needle. From web platforms to AI agents, we handle the full spectrum of modern software development.
        </p>
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 60 }}>
        <FadeIn delay={0.1}>
          <GlassCard hover={false} style={{ borderLeft: `3px solid ${COLORS.primary}` }}>
            <h3 style={{ color: COLORS.primary, fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>Our Mission</h3>
            <p style={{ color: COLORS.textMuted, fontSize: 15, lineHeight: 1.7, margin: 0 }}>To empower businesses worldwide with intelligent, scalable software solutions that drive measurable growth and operational efficiency.</p>
          </GlassCard>
        </FadeIn>
        <FadeIn delay={0.2}>
          <GlassCard hover={false} style={{ borderLeft: `3px solid ${COLORS.accent}` }}>
            <h3 style={{ color: COLORS.accent, fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>Our Vision</h3>
            <p style={{ color: COLORS.textMuted, fontSize: 15, lineHeight: 1.7, margin: 0 }}>To become the go-to technology partner for businesses seeking to harness the power of modern software and artificial intelligence.</p>
          </GlassCard>
        </FadeIn>
      </div>

      <FadeIn>
        <SectionHeading tag="Core Values" title="What Drives Us" />
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {values.map((v, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <GlassCard>
              <span style={{ fontSize: 28, display: "block", marginBottom: 12 }}>{v.icon}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>{v.title}</h3>
              <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
            </GlassCard>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <div style={{ marginTop: 60 }}>
          <SectionHeading tag="Why Us" title="Why Choose CodeGloFix?" />
          <div style={{ display: "grid", gap: 16 }}>
            {[
              "Full-stack expertise across web, mobile, and AI — one team, complete solutions",
              "Proven track record with 50+ projects across 5+ countries",
              "Agile development with transparent sprint-based delivery",
              "Post-launch support and maintenance included in every engagement",
              "AI-native approach — we integrate smart automation wherever it adds value",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: COLORS.primary, fontSize: 18, lineHeight: 1 }}>✓</span>
                <p style={{ color: COLORS.textMuted, fontSize: 15, lineHeight: 1.6, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ==================== SERVICES ==================== */
function ServicesPage() {
  const [active, setActive] = useState(null);

  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeIn>
        <SectionHeading tag="Services" title="What We Build" subtitle="Comprehensive software development and AI services tailored to your business needs." />
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {SERVICES.map((s, i) => (
          <FadeIn key={s.id} delay={i * 0.1}>
            <GlassCard onClick={() => setActive(active === s.id ? null : s.id)} style={{ cursor: "pointer" }}>
              <span style={{ fontSize: 36, display: "block", marginBottom: 16 }}>{s.icon}</span>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: COLORS.text, margin: "0 0 10px" }}>{s.title}</h3>
              <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>{s.short}</p>

              {active === s.id && (
                <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 16, marginTop: 8 }}>
                  <h4 style={{ color: COLORS.primary, fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>Key Benefits</h4>
                  {s.benefits.map((b, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <span style={{ color: COLORS.primary, fontSize: 12 }}>●</span>
                      <span style={{ color: COLORS.textMuted, fontSize: 14 }}>{b}</span>
                    </div>
                  ))}
                  <h4 style={{ color: COLORS.accent, fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 12px" }}>Technologies</h4>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {s.tech.map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>
                </div>
              )}

              <span style={{ color: COLORS.primary, fontSize: 13, fontWeight: 500, display: "block", marginTop: 12 }}>
                {active === s.id ? "Show less ↑" : "Learn more →"}
              </span>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ==================== PORTFOLIO ==================== */
function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Web", "Mobile", "AI"];
  const filtered = filter === "All" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === filter);

  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
      <FadeIn>
        <SectionHeading tag="Portfolio" title="Our Work Speaks" subtitle="Case studies from real projects we've delivered across web, mobile, and AI." />
      </FadeIn>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "8px 20px", borderRadius: 20, border: `1px solid ${filter === c ? COLORS.primary : COLORS.border}`,
            background: filter === c ? "rgba(6,182,212,0.1)" : "transparent",
            color: filter === c ? COLORS.primary : COLORS.textMuted, fontSize: 14, fontWeight: 500, cursor: "pointer",
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
        {filtered.map((p, i) => (
          <FadeIn key={p.id} delay={i * 0.1}>
            <GlassCard>
              <div style={{ height: 160, borderRadius: 12, background: `linear-gradient(135deg, rgba(6,182,212,${0.1 + i * 0.03}), rgba(139,92,246,${0.1 + i * 0.02}))`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 42, opacity: 0.5 }}>{ p.category === "AI" ? "🤖" : p.category === "Mobile" ? "📱" : "💻" }</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                <Badge>{p.category}</Badge>
                {p.tech.map((t) => <Badge key={t}>{t}</Badge>)}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, margin: "0 0 4px" }}>{p.title}</h3>
              <p style={{ color: COLORS.textDim, fontSize: 13, margin: "0 0 8px" }}>Client: {p.client}</p>
              <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 12px" }}>{p.desc}</p>
              <p style={{ color: COLORS.success, fontSize: 14, fontWeight: 600, margin: 0 }}>↗ {p.result}</p>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ==================== AI SOLUTIONS ==================== */
function AISolutionsPage({ setPage }) {
  const solutions = [
    { icon: "🤖", title: "Custom AI Agents", desc: "Autonomous agents that handle complex multi-step tasks, from data analysis to customer interactions.", useCase: "Automated lead qualification reducing manual work by 75%." },
    { icon: "⚡", title: "Workflow Automation", desc: "End-to-end automation pipelines connecting your tools and eliminating repetitive processes.", useCase: "Invoice processing time reduced from 4 hours to 15 minutes." },
    { icon: "💬", title: "Intelligent Chatbots", desc: "Natural language chatbots that understand context, handle edge cases, and escalate when needed.", useCase: "Customer support resolution rate improved by 80%." },
    { icon: "📊", title: "AI-Powered Analytics", desc: "Predictive models and anomaly detection that surface insights from your data automatically.", useCase: "Early churn prediction accuracy of 92%." },
    { icon: "📄", title: "Document Processing", desc: "Extract, classify, and process documents at scale with intelligent OCR and NLP.", useCase: "Contract review time reduced from 2 days to 30 minutes." },
    { icon: "🔗", title: "AI Integration Services", desc: "Seamlessly embed AI capabilities into your existing software stack and workflows.", useCase: "Legacy CRM enhanced with AI-driven lead scoring." },
  ];

  const steps = [
    { n: "01", title: "Discovery", desc: "Understand your processes, pain points, and automation opportunities." },
    { n: "02", title: "Design", desc: "Architect the AI solution — models, data flows, and integration points." },
    { n: "03", title: "Build & Train", desc: "Develop the solution, train models on your data, and iterate." },
    { n: "04", title: "Deploy & Monitor", desc: "Launch to production with monitoring, feedback loops, and continuous improvement." },
  ];

  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeIn>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Badge>AI Solutions</Badge>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: COLORS.text, margin: "16px 0", lineHeight: 1.1 }}>
            AI-Powered Solutions for <span style={{ color: COLORS.primary }}>Modern Business</span>
          </h1>
          <p style={{ color: COLORS.textMuted, fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
            From intelligent chatbots to autonomous agents, we build AI solutions that automate workflows, reduce costs, and unlock new capabilities.
          </p>
        </div>
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 80 }}>
        {solutions.map((s, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <GlassCard style={{ height: "100%" }}>
              <span style={{ fontSize: 32, display: "block", marginBottom: 14 }}>{s.icon}</span>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>{s.title}</h3>
              <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>{s.desc}</p>
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(34,197,94,0.08)", borderLeft: `3px solid ${COLORS.success}` }}>
                <p style={{ color: COLORS.success, fontSize: 13, fontWeight: 500, margin: 0 }}>{s.useCase}</p>
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <SectionHeading tag="Process" title="How We Build AI Solutions" />
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 80 }}>
        {steps.map((s, i) => (
          <FadeIn key={i} delay={i * 0.15}>
            <GlassCard hover={false}>
              <span style={{ fontSize: 32, fontWeight: 800, color: COLORS.primary, display: "block", marginBottom: 12, opacity: 0.6 }}>{s.n}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>{s.title}</h3>
              <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </GlassCard>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 60 }}>
          {["OpenAI", "LangChain", "Python", "TensorFlow", "n8n", "Hugging Face", "FastAPI", "Pinecone", "Redis", "Docker"].map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </FadeIn>

      <FadeIn>
        <GlassCard hover={false} style={{ textAlign: "center", padding: 48, background: `linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))` }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, margin: "0 0 16px" }}>Let's Build Your AI Solution</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 16, marginBottom: 28 }}>Tell us about your automation challenges and we'll design a solution.</p>
          <Btn primary onClick={() => { setPage("Contact"); window.scrollTo(0, 0); }}>Start a Conversation →</Btn>
        </GlassCard>
      </FadeIn>
    </section>
  );
}

/* ==================== BLOG ==================== */
function BlogPage() {
  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
      <FadeIn>
        <SectionHeading tag="Blog" title="Insights & Perspectives" subtitle="Technical articles, industry analysis, and practical guides from our team." />
      </FadeIn>
      <div style={{ display: "grid", gap: 20 }}>
        {BLOG_POSTS.map((p, i) => (
          <FadeIn key={p.id} delay={i * 0.1}>
            <GlassCard style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: 120, height: 90, borderRadius: 10, background: `linear-gradient(135deg, rgba(6,182,212,${0.12 + i * 0.04}), rgba(139,92,246,${0.12 + i * 0.03}))`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28, opacity: 0.5 }}>📝</span>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <Badge>{p.category}</Badge>
                  <span style={{ color: COLORS.textDim, fontSize: 12 }}>{p.date}</span>
                  <span style={{ color: COLORS.textDim, fontSize: 12 }}>{p.readTime} read</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, margin: "0 0 8px", lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{p.excerpt}</p>
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ==================== CONTACT ==================== */
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setTimeout(() => setStatus("success"), 1500);
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 12, fontSize: 15,
    border: `1px solid ${COLORS.border}`, background: "rgba(255,255,255,0.04)",
    color: COLORS.text, outline: "none", transition: "border 0.2s", boxSizing: "border-box",
  };

  if (status === "success") {
    return (
      <section style={{ padding: "120px 24px 80px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <FadeIn>
          <div style={{ fontSize: 64, marginBottom: 24 }}>✓</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>Message Sent!</h2>
          <p style={{ color: COLORS.textMuted, fontSize: 17, lineHeight: 1.7 }}>Thank you for reaching out. We'll review your message and get back to you within 24 hours.</p>
        </FadeIn>
      </section>
    );
  }

  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <FadeIn>
        <SectionHeading tag="Contact" title="Let's Build Together" subtitle="Tell us about your project and we'll get back to you within 24 hours." />
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
        <FadeIn delay={0.1}>
          <GlassCard hover={false}>
            <form onSubmit={submit}>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ display: "block", color: COLORS.textMuted, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Name *</label>
                  <input style={{ ...inputStyle, borderColor: errors.name ? "#ef4444" : COLORS.border }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  {errors.name && <span style={{ color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>{errors.name}</span>}
                </div>
                <div>
                  <label style={{ display: "block", color: COLORS.textMuted, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email *</label>
                  <input type="email" style={{ ...inputStyle, borderColor: errors.email ? "#ef4444" : COLORS.border }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
                  {errors.email && <span style={{ color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>{errors.email}</span>}
                </div>
                <div>
                  <label style={{ display: "block", color: COLORS.textMuted, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Phone</label>
                  <input style={inputStyle} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label style={{ display: "block", color: COLORS.textMuted, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Service Interest</label>
                  <select style={{ ...inputStyle, appearance: "none" }} value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
                    <option value="">Select a service</option>
                    {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: COLORS.textMuted, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Project Budget</label>
                  <select style={{ ...inputStyle, appearance: "none" }} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                    <option value="">Select budget range</option>
                    <option>$5K - $15K</option>
                    <option>$15K - $50K</option>
                    <option>$50K - $100K</option>
                    <option>$100K+</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: COLORS.textMuted, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Message *</label>
                  <textarea rows={5} style={{ ...inputStyle, resize: "vertical", borderColor: errors.message ? "#ef4444" : COLORS.border }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your project..." />
                  {errors.message && <span style={{ color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>{errors.message}</span>}
                </div>
                <Btn primary style={{ width: "100%", opacity: status === "sending" ? 0.7 : 1 }}>
                  {status === "sending" ? "Sending..." : "Send Message →"}
                </Btn>
              </div>
            </form>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div style={{ display: "grid", gap: 20 }}>
            <GlassCard hover={false}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 16px" }}>Get in Touch</h3>
              {[
                { label: "Email", value: "hello@codeglofix.com" },
                { label: "Phone", value: "+94 11 234 5678" },
                { label: "Location", value: "Colombo, Sri Lanka" },
                { label: "Hours", value: "Mon–Fri, 9 AM – 6 PM IST" },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: 14 }}>
                  <p style={{ color: COLORS.textDim, fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>{item.label}</p>
                  <p style={{ color: COLORS.text, fontSize: 15, margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </GlassCard>

            <GlassCard hover={false}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 16px" }}>Follow Us</h3>
              <div style={{ display: "flex", gap: 12 }}>
                {["LinkedIn", "Twitter", "GitHub", "Dribbble"].map((s) => (
                  <span key={s} style={{
                    padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, fontSize: 13, fontWeight: 500,
                  }}>{s}</span>
                ))}
              </div>
            </GlassCard>

            <GlassCard hover={false} style={{ background: `linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))` }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>Prefer a quick call?</h3>
              <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Book a free 30-minute consultation to discuss your project requirements and get a rough estimate.</p>
            </GlassCard>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ==================== FOOTER ==================== */
function Footer({ setPage }) {
  return (
    <footer style={{ borderTop: `1px solid ${COLORS.border}`, padding: "60px 24px 32px", marginTop: 40 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>C</div>
              <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.text }}>CodeGlo<span style={{ color: COLORS.primary }}>Fix</span></span>
            </div>
            <p style={{ color: COLORS.textMuted, fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>Building smart digital solutions with code and AI. Your trusted software development partner.</p>
          </div>

          <div>
            <h4 style={{ color: COLORS.text, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Company</h4>
            {["About", "Services", "Portfolio", "Blog", "Contact"].map((l) => (
              <p key={l} onClick={() => { setPage(l); window.scrollTo(0, 0); }} style={{ color: COLORS.textMuted, fontSize: 14, margin: "0 0 10px", cursor: "pointer" }}>{l}</p>
            ))}
          </div>

          <div>
            <h4 style={{ color: COLORS.text, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Services</h4>
            {SERVICES.slice(0, 4).map((s) => (
              <p key={s.id} style={{ color: COLORS.textMuted, fontSize: 14, margin: "0 0 10px" }}>{s.title}</p>
            ))}
          </div>

          <div>
            <h4 style={{ color: COLORS.text, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Connect</h4>
            <p style={{ color: COLORS.textMuted, fontSize: 14, margin: "0 0 10px" }}>hello@codeglofix.com</p>
            <p style={{ color: COLORS.textMuted, fontSize: 14, margin: "0 0 10px" }}>+94 11 234 5678</p>
            <p style={{ color: COLORS.textMuted, fontSize: 14, margin: "0 0 10px" }}>Colombo, Sri Lanka</p>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: COLORS.textDim, fontSize: 13, margin: 0 }}>© 2026 CodeGloFix Pvt Ltd. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <span style={{ color: COLORS.textDim, fontSize: 13 }}>Privacy Policy</span>
            <span style={{ color: COLORS.textDim, fontSize: 13 }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ==================== APP ==================== */
export default function App() {
  const [page, setPage] = useState("Home");

  const renderPage = () => {
    switch (page) {
      case "Home": return <HomePage setPage={setPage} />;
      case "About": return <AboutPage />;
      case "Services": return <ServicesPage />;
      case "Portfolio": return <PortfolioPage />;
      case "AI Solutions": return <AISolutionsPage setPage={setPage} />;
      case "Blog": return <BlogPage />;
      case "Contact": return <ContactPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bg}; overflow-x: hidden; }
        ::selection { background: rgba(6,182,212,0.3); }
        input, select, textarea, button { font-family: inherit; }
        select option { background: #1a1a2e; color: #fff; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        input:focus, select:focus, textarea:focus { border-color: ${COLORS.primary} !important; box-shadow: 0 0 0 3px rgba(6,182,212,0.15); }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
      <ParticleBackground />
      <Navbar page={page} setPage={setPage} />
      <main style={{ position: "relative", zIndex: 1 }}>
        {renderPage()}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
