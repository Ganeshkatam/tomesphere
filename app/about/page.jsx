import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, Shield, Zap, ArrowRight, Layers, Eye } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

export const revalidate = 1800;

export const metadata = {
  title: 'About Studio — TomeSphere',
  description: 'The philosophy, design craft, and product standards behind the TomeSphere digital ecosystem.'
};

export default async function AboutPage() {
  const profile = await apiClient.profile.get().catch(() => null);
  const founderName = profile?.name || 'Katam Ganesh Reddy';

  return (
    <div className="page-wrapper">
      <div className="page-head">
        <div className="page-eyebrow">Studio &amp; Philosophy</div>
        <h1 className="page-title">About TomeSphere</h1>
        <p className="page-subtitle">
          An independent digital product studio focused on building purposeful software, creator tools, and dependable web platforms.
        </p>
      </div>

      {/* Core Studio Pillars */}
      <section className="section-wrapper" style={{ padding: '0 0 60px' }}>
        <div className="section-head">
          <div>
            <div className="page-eyebrow">Pillars</div>
            <h2 className="section-title">Our Product Philosophy</h2>
            <p className="section-subtitle">
              Every system we create is guided by four foundational principles.
            </p>
          </div>
        </div>

        <div className="capabilities-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="capability-card">
            <div className="capability-icon-box" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
              <Eye size={24} />
            </div>
            <h3 className="capability-title">Distraction-Free Craft</h3>
            <p className="capability-desc">
              We design software that gets out of the way. Clean typographic hierarchies, intuitive workflows, and thoughtful design systems create tools people love using every day.
            </p>
            <div className="capability-tags">
              <span className="cap-tag">Design Systems</span>
              <span className="cap-tag">Ergonomics</span>
              <span className="cap-tag">Human-Centered</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <Shield size={24} />
            </div>
            <h3 className="capability-title">Security &amp; Privacy First</h3>
            <p className="capability-desc">
              Privacy and data integrity are non-negotiable. Our products are engineered with robust boundaries, strict access controls, and zero compromise on user confidentiality.
            </p>
            <div className="capability-tags">
              <span className="cap-tag">Data Integrity</span>
              <span className="cap-tag">Least Privilege</span>
              <span className="cap-tag">Resilient</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon-box" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
              <Zap size={24} />
            </div>
            <h3 className="capability-title">High-Velocity Performance</h3>
            <p className="capability-desc">
              Speed is a core feature. From initial page load to real-time interactions, our applications execute with sub-second responsiveness and edge delivery worldwide.
            </p>
            <div className="capability-tags">
              <span className="cap-tag">Edge Global</span>
              <span className="cap-tag">Low Latency</span>
              <span className="cap-tag">Fluid UI</span>
            </div>
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="section-wrapper" style={{ padding: '0 0 60px' }}>
        <div className="section-head">
          <div>
            <div className="page-eyebrow">Offerings</div>
            <h2 className="section-title">What We Build</h2>
            <p className="section-subtitle">Diverse software solutions crafted for specific real-world needs.</p>
          </div>
        </div>

        <div className="capabilities-grid">
          <div className="capability-card">
            <div className="capability-icon-box">
              <Layers size={24} />
            </div>
            <h3 className="capability-title">Digital Platforms &amp; Web Apps</h3>
            <p className="capability-desc">
              Full-featured web software engineered for scalability, reliability, and smooth cross-device accessibility.
            </p>
            <div className="capability-tags">
              <span className="cap-tag">Web Platforms</span>
              <span className="cap-tag">Responsive</span>
              <span className="cap-tag">Accessible</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon-box">
              <Sparkles size={24} />
            </div>
            <h3 className="capability-title">Productivity &amp; Knowledge Tools</h3>
            <p className="capability-desc">
              Focused utilities, reading companions, and workflow engines that empower focused work and learning.
            </p>
            <div className="capability-tags">
              <span className="cap-tag">Productivity</span>
              <span className="cap-tag">Workflow</span>
              <span className="cap-tag">Knowledge</span>
            </div>
          </div>

          <div className="capability-card">
            <div className="capability-icon-box">
              <Compass size={24} />
            </div>
            <h3 className="capability-title">Interactive Experiences</h3>
            <p className="capability-desc">
              Modern digital spaces featuring real-time feedback, collaborative interfaces, and polished user journeys.
            </p>
            <div className="capability-tags">
              <span className="cap-tag">Interactive</span>
              <span className="cap-tag">Community</span>
              <span className="cap-tag">Real-Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Studio Background */}
      <section className="section-wrapper" style={{ paddingBottom: '40px' }}>
        <div className="studio-founder-card">
          <div className="founder-info">
            <div className="founder-avatar">
              TS
            </div>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Studio Leadership &amp; Direction
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
                {founderName}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '580px' }}>
                Founder and product lead overseeing the design, development, and long-term vision of all digital products in the TomeSphere ecosystem.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn-primary-glow">
              Explore Products <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="btn-secondary-glass">
              Contact Studio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
