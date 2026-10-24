'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Compass,
  Layers,
  Smartphone
} from 'lucide-react';

function AbstractTomeSphereVisual({ mouseX = 50, mouseY = 50 }) {
  const tiltX = ((mouseY - 50) * 0.12).toFixed(2);
  const tiltY = ((mouseX - 50) * -0.12).toFixed(2);

  return (
    <div
      className="tomesphere-visual-wrapper"
      style={{
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }}
      aria-hidden="true"
    >
      <div className="tomesphere-ambient-blur blur-violet" />
      <div className="tomesphere-ambient-blur blur-teal" />

      <svg
        viewBox="0 0 520 520"
        className="tomesphere-sphere-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="tsSphereCore" cx="42%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#0f172a" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#090d16" stopOpacity="1" />
            <stop offset="100%" stopColor="#030712" stopOpacity="1" />
          </radialGradient>

          <radialGradient id="tsSpecular" cx="35%" cy="30%" r="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#a78bfa" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="tsRingGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="tsRingGradB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
          </linearGradient>

          <filter id="tsGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle
          cx="260"
          cy="260"
          r="230"
          stroke="url(#tsRingGradA)"
          strokeWidth="1.2"
          strokeDasharray="4 8"
          strokeOpacity="0.35"
          className="ts-anim-rotate-slow"
        />

        <ellipse
          cx="260"
          cy="260"
          rx="210"
          ry="84"
          transform="rotate(-28 260 260)"
          stroke="url(#tsRingGradA)"
          strokeWidth="2"
          strokeDasharray="6 4 18 4"
          strokeOpacity="0.75"
          className="ts-anim-spin-reverse"
        />

        <g transform="rotate(-28 260 260)">
          <circle cx="470" cy="260" r="5" fill="#38bdf8" filter="url(#tsGlow)" />
          <circle cx="470" cy="260" r="2.5" fill="#ffffff" />
        </g>

        <ellipse
          cx="260"
          cy="260"
          rx="185"
          ry="72"
          transform="rotate(38 260 260)"
          stroke="url(#tsRingGradB)"
          strokeWidth="1.8"
          strokeOpacity="0.7"
          className="ts-anim-spin"
        />

        <g transform="rotate(38 260 260)">
          <circle cx="75" cy="260" r="5" fill="#c084fc" filter="url(#tsGlow)" />
          <circle cx="75" cy="260" r="2.5" fill="#ffffff" />
        </g>

        <circle
          cx="260"
          cy="260"
          r="128"
          fill="url(#tsSphereCore)"
          stroke="rgba(167, 139, 250, 0.45)"
          strokeWidth="1.5"
        />

        <ellipse
          cx="260"
          cy="260"
          rx="52"
          ry="128"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        <ellipse
          cx="260"
          cy="260"
          rx="128"
          ry="44"
          stroke="rgba(56, 189, 248, 0.25)"
          strokeWidth="1.2"
        />

        <circle
          cx="260"
          cy="260"
          r="127"
          fill="url(#tsSpecular)"
          pointerEvents="none"
        />

        <circle
          cx="260"
          cy="260"
          r="24"
          fill="url(#tsRingGradA)"
          filter="url(#tsGlow)"
          opacity="0.8"
          className="ts-anim-pulse"
        />
        <circle cx="260" cy="260" r="9" fill="#ffffff" opacity="0.9" />

        <ellipse
          cx="260"
          cy="260"
          rx="152"
          ry="32"
          transform="rotate(-8 260 260)"
          stroke="rgba(168, 85, 247, 0.55)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />
      </svg>

      <div className="tomesphere-floating-badge badge-top-right">
        <span className="badge-pulse-dot" />
        <span>TomeSphere Core · Platform</span>
      </div>

      <div className="tomesphere-floating-badge badge-bottom-left">
        <span className="badge-mono-pill">Independent Studio</span>
      </div>
    </div>
  );
}

export default function HomeOverviewClient({
  profile,
  projects = []
}) {
  const [heroMouse, setHeroMouse] = useState({ x: 50, y: 25 });

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHeroMouse({ x: Math.round(x), y: Math.round(y) });
  };

  const previewProjects = projects.slice(0, 4);
  const founderName = profile?.name || 'Katam Ganesh Reddy';

  return (
    <div className="homepage-cinematic-wrapper">
      {/* Cinematic Dark Hero Section */}
      <section
        className="hero-cinematic-section"
        onMouseMove={handleHeroMouseMove}
        style={{
          '--mouse-x': `${heroMouse.x}%`,
          '--mouse-y': `${heroMouse.y}%`
        }}
      >
        <div className="hero-cosmic-glow" aria-hidden="true">
          <div className="hero-cursor-spotlight" />
          <div className="cosmic-orb orb-1" />
          <div className="cosmic-orb orb-2" />
          <div className="hero-grid-mesh" />
        </div>

        <div className="hero-cinematic-container">
          <div className="hero-cinematic-grid">
            {/* Left Column: Left-aligned Headline, Copy, and CTAs */}
            <div className="hero-left-column">
              <div className="hero-eyebrow-badge hero-fade-in-1">
                <span className="hero-eyebrow-dot" />
                <span>TomeSphere · Digital Product Studio</span>
              </div>

              <h1 className="hero-headline-left hero-fade-in-2">
                Software products engineered for{' '}
                <span className="hero-gradient-text hero-shimmer-text">
                  utility, performance &amp; craft.
                </span>
              </h1>

              <p className="hero-paragraph-left hero-fade-in-3">
                Welcome to <strong>TomeSphere</strong> — an independent digital product studio building practical web applications, developer utilities, and collaborative tools.
              </p>

              <div className="hero-cta-group-left hero-fade-in-4">
                <Link href="/products" className="btn-primary-glow hero-btn-magnetic">
                  Explore Products <ArrowRight size={16} />
                </Link>
                <Link href="/about" className="btn-secondary-glass">
                  Meet the Studio <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Column: Abstract TomeSphere Visual */}
            <div className="hero-right-column hero-fade-in-3">
              <AbstractTomeSphereVisual
                mouseX={heroMouse.x}
                mouseY={heroMouse.y}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product-First Featured Showcase Section */}
      <section className="section-wrapper products-showcase-section">
        <div className="section-head">
          <div>
            <div className="page-eyebrow">Featured Products</div>
            <h2 className="section-title">Products built to be useful</h2>
            <p className="section-subtitle">
              Explore practical software built and maintained by the TomeSphere studio.
            </p>
          </div>
          <Link href="/products" className="btn-secondary-glass" style={{ alignSelf: 'flex-start' }}>
            View All ({projects.length}) <ArrowRight size={14} />
          </Link>
        </div>

        <div className="projects-masonry">
          {previewProjects.map(project => {
            const detailHref = `/products/${project.slug || project.id}`;
            const launchHref = project.url ? (project.url.startsWith('http') ? project.url : `https://${project.url}`) : null;
            const isMobileApp = project.category?.toUpperCase() === 'MOBILE' || (Array.isArray(project.tags) && project.tags.some(t => /android|ios|mobile/i.test(t)));
            const isGitHubUrl = launchHref && /github\.com/i.test(launchHref);
            const launchLabel = isMobileApp && isGitHubUrl ? 'Repo' : (isGitHubUrl ? 'Repo' : 'Launch');

            return (
              <article key={project.id} className="project-card-modern">
                <div className="project-card-header">
                  <div className="project-badge-row">
                    <span className={`card-status-badge ${project.status === 'Live' ? 'badge-live' : 'badge-draft'}`}>
                      <span className="status-indicator-dot" />
                      {project.status}
                    </span>
                    <span className="card-category-badge">{project.category}</span>
                  </div>
                  <span className="card-year-label">{project.year}</span>
                </div>

                <div className="card-content-area">
                  <h3 className="card-title">
                    <Link href={detailHref} className="card-title-link">
                      {project.name}
                    </Link>
                  </h3>
                  <div className="card-url-row">
                    {isMobileApp ? <Smartphone size={12} /> : <Globe size={12} />}
                    <span>{project.url || (isMobileApp ? 'Native Android' : 'Independent runtime')}</span>
                  </div>
                  <p className="card-description">{project.description}</p>

                  {project.tags && project.tags.length > 0 && (
                    <div className="card-tags-list">
                      {project.tags.map(t => (
                        <span key={t} className="card-tag-item">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="card-dual-actions">
                    <Link href={detailHref} className="btn-detail-link">
                      View Details <ArrowRight size={13} />
                    </Link>
                    {launchHref && (
                      <a
                        href={launchHref}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-launch-link"
                      >
                        {launchLabel} <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Discovery Banner for Full Catalog */}
        <div className="catalog-discovery-strip">
          <div className="catalog-discovery-info">
            <h3 className="catalog-discovery-title">Looking for more tools and applications?</h3>
            <p className="catalog-discovery-subtitle">
              Browse the complete catalog of active platforms, release notes, and documentation.
            </p>
          </div>
          <Link href="/products" className="btn-primary-glow">
            Explore All {projects.length} Products <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Founder & Studio Leadership Section */}
      <section className="section-wrapper" style={{ paddingBottom: '80px' }}>
        <div className="studio-founder-card">
          <div className="founder-info">
            <div className="founder-avatar">
              TS
            </div>
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Studio Leadership &amp; Engineering
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
                {founderName}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '580px' }}>
                Founder and product lead designing and developing modern web platforms, creator utilities, and digital software under the TomeSphere brand.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary-glow">
              Connect With Studio <ArrowRight size={14} />
            </Link>
            <Link href="/about" className="btn-secondary-glass">
              About Studio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
