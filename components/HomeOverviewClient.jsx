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

  const productHref = (project) => `/products/${project.slug || project.id}`;
  const statusLabel = (status) => status || 'In progress';
  const categoryLabel = (category) => category || 'Independent tool';

  return (
    <div className="homepage-cinematic-wrapper home-discovery">
      <section className="home-discovery-hero" aria-labelledby="home-discovery-title">
        <div className="home-discovery-copy">
          <div className="home-discovery-kicker">Independent apps. Real utility.</div>
          <h1 id="home-discovery-title" className="home-discovery-title">
            Find your next
            <span>favorite tool.</span>
          </h1>
          <p className="home-discovery-lede">
            Explore thoughtfully built software for productivity, creativity, learning, and everyday life—all in one curated place.
          </p>
          <form action="/products" method="get" className="home-discovery-search" role="search">
            <Compass size={18} aria-hidden="true" />
            <input type="search" name="q" placeholder="Search products, tools, and ideas…" aria-label="Search products" />
            <button type="submit">Explore catalog <ArrowRight size={15} /></button>
          </form>
          <div className="home-discovery-actions" style={{ marginTop: '16px' }}>
            <Link href="/products" className="btn-primary-glow">Browse all products <ArrowRight size={16} /></Link>
            <Link href="/about" className="btn-secondary-glass">About TomeSphere <ArrowUpRight size={15} /></Link>
          </div>
          <div className="home-discovery-trust" aria-label="TomeSphere principles">
            <span><i /> Independent projects</span>
            <span><i /> Clear product status</span>
            <span><i /> Direct destinations</span>
          </div>
        </div>
        <div className="home-discovery-art" aria-hidden="true">
          <div className="home-discovery-orbit orbit-a" />
          <div className="home-discovery-orbit orbit-b" />
          <div className="home-discovery-orbit orbit-c" />
          <div className="home-discovery-core" />
          <div className="home-discovery-icon icon-book"><Layers /></div>
          <div className="home-discovery-icon icon-code"><Globe /></div>
          <div className="home-discovery-icon icon-palette"><Compass /></div>
          <div className="home-discovery-icon icon-leaf"><Smartphone /></div>
          <div className="home-discovery-note"><strong>Thoughtfully built.</strong> Independently maintained.</div>
        </div>
      </section>

      <section className="home-discovery-section" aria-labelledby="featured-products-heading">
        <div className="home-discovery-section-head">
          <div>
            <div className="home-discovery-eyebrow">A curated collection</div>
            <h2 id="featured-products-heading" className="home-discovery-heading">Worth exploring</h2>
            <p className="home-discovery-blurb">A closer look at products from the independent TomeSphere ecosystem.</p>
          </div>
          <Link href="/products" className="home-discovery-textlink">Browse all products <ArrowRight size={15} /></Link>
        </div>

        {previewProjects.length > 0 ? (
          <div className="home-discovery-products">
            {previewProjects.slice(0, 3).map((project, index) => {
              const isMobileApp = project.category?.toUpperCase() === 'MOBILE' ||
                (Array.isArray(project.tags) && project.tags.some(t => /android|ios|mobile/i.test(t)));
              const status = statusLabel(project.status);
              return (
                <article key={project.id || project.slug || project.name} className="home-discovery-card">
                  <div className="home-discovery-card-art">
                    <div className="card-glyph">
                      {isMobileApp ? <Smartphone /> : index === 0 ? <Layers /> : index === 1 ? <Compass /> : <Globe />}
                    </div>
                    <span className="card-art-label">{categoryLabel(project.category)}</span>
                  </div>
                  <div className="home-discovery-card-body">
                    <div className="home-discovery-card-top">
                      <h3><Link href={productHref(project)}>{project.name}</Link></h3>
                      <span className={`home-discovery-status ${status.toLowerCase() === 'live' ? '' : 'status-progress'}`}>{status}</span>
                    </div>
                    <p>{project.description || 'Explore this independent product and its capabilities.'}</p>
                    <div className="home-discovery-card-bottom">
                      <span className="home-discovery-category">{categoryLabel(project.category)}</span>
                      <Link href={productHref(project)}>Explore product <ArrowUpRight size={14} /></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h3 className="empty-state-title">The catalog is being prepared</h3>
            <p className="empty-state-description">Browse the product directory for current availability and updates.</p>
            <Link href="/products" className="btn-primary-glow">Browse products <ArrowRight size={15} /></Link>
          </div>
        )}
      </section>

      <section className="home-discovery-feature-band" aria-label="Updates and offers">
        <article className="home-discovery-feature">
          <div className="home-discovery-feature-icon"><Layers size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3>Latest from makers</h3>
            <p>Release notes, product improvements, and announcements in one feed.</p>
          </div>
          <Link href="/updates">View updates <ArrowRight size={14} /></Link>
        </article>
        <article className="home-discovery-feature">
          <div className="home-discovery-feature-icon"><ArrowUpRight size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3>Offers & opportunities</h3>
            <p>Find currently published promotions and access details.</p>
          </div>
          <Link href="/offers">View offers <ArrowRight size={14} /></Link>
        </article>
      </section>

      <section className="home-discovery-section">
        <div className="home-discovery-feature" style={{ padding: 'clamp(24px, 4vw, 44px)' }}>
          <div className="home-discovery-feature-icon"><Compass size={22} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="home-discovery-eyebrow">The idea behind TomeSphere</div>
            <h2 className="home-discovery-heading">One place to discover independent software.</h2>
            <p className="home-discovery-blurb">Explore each product, understand what it does, and continue to its intended destination. Products remain independent, with their own purpose and experience.</p>
          </div>
          <Link href="/about" className="home-discovery-textlink">Our approach <ArrowRight size={15} /></Link>
        </div>
      </section>
    </div>
  );
}
