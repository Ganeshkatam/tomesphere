'use client';

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

export default function HomeOverviewClient({ projects = [] }) {
  const [homeQuery, setHomeQuery] = useState('');
  const previewProjects = projects.slice(0, 4);

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
          <div className="home-discovery-search" role="search">
            <Compass size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search products, tools, and ideas…"
              aria-label="Search products"
              value={homeQuery}
              onChange={(event) => setHomeQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  window.location.href = `/products?q=${encodeURIComponent(homeQuery)}`;
                }
              }}
            />
            <button type="button" onClick={() => { window.location.href = `/products?q=${encodeURIComponent(homeQuery)}`; }}>
              Search <ArrowRight size={15} />
            </button>
          </div>
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
