'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Compass,
  Layers,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Sparkles,
  Gift,
  Calendar,
  Tag,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';

export default function HomeOverviewClient({ projects = [], profile, updates = [], offers = [] }) {
  const [homeQuery, setHomeQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);
  const displayProjects = projects.length > 0 ? projects : [];

  const handlePrevSlide = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.offsetWidth * 0.85;
    sliderRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  };

  const handleNextSlide = () => {
    if (!sliderRef.current) return;
    const cardWidth = sliderRef.current.offsetWidth * 0.85;
    sliderRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
  };

  const scrollToSlide = (index) => {
    if (!sliderRef.current) return;
    const cards = sliderRef.current.querySelectorAll('.showcase-large-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      setActiveSlide(index);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollPos = el.scrollLeft;
      const totalWidth = el.scrollWidth - el.clientWidth;
      if (totalWidth <= 0) return;
      const index = Math.round((scrollPos / totalWidth) * (displayProjects.length - 1));
      setActiveSlide(Math.max(0, Math.min(index, displayProjects.length - 1)));
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [displayProjects.length]);

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
          <form className="home-discovery-search" role="search" action="/products" method="get">
            <Compass size={18} aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder="Search products, tools, and ideas…"
              aria-label="Search products"
              value={homeQuery}
              onChange={(event) => setHomeQuery(event.target.value)}
            />
            <button type="submit">Search <ArrowRight size={15} /></button>
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
            <div className="home-discovery-eyebrow">Interactive Showcase</div>
            <h2 id="featured-products-heading" className="home-discovery-heading">Featured Products</h2>
            <p className="home-discovery-blurb">Swipe or slide through flagship independent software crafted under the TomeSphere umbrella.</p>
          </div>
          <div className="showcase-nav-controls">
            <button
              type="button"
              className="btn-slider-arrow"
              onClick={handlePrevSlide}
              aria-label="Previous product slide"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="slider-pills-row">
              {displayProjects.map((p, idx) => (
                <button
                  key={p.id || p.slug || idx}
                  type="button"
                  className={`slider-pill-dot ${idx === activeSlide ? 'active' : ''}`}
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Jump to product ${p.name}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="btn-slider-arrow"
              onClick={handleNextSlide}
              aria-label="Next product slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {displayProjects.length > 0 ? (
          <div
            ref={sliderRef}
            className="home-showcase-slider"
            role="region"
            aria-label="Featured products slider"
          >
            {displayProjects.map((project, index) => {
              const isMobileApp = project.category?.toUpperCase() === 'MOBILE' ||
                (Array.isArray(project.tags) && project.tags.some(t => /android|ios|mobile/i.test(t)));
              const status = statusLabel(project.status);
              const detailHref = productHref(project);
              const safeLaunchUrl = project.url ? (project.url.startsWith('http') ? project.url : `https://${project.url}`) : null;
              const isGitHubUrl = safeLaunchUrl && /github\.com/i.test(safeLaunchUrl);
              const launchText = isMobileApp && isGitHubUrl ? 'View Repo' : (isGitHubUrl ? 'GitHub Repo' : 'Launch Platform');

              return (
                <article
                  key={project.id || project.slug || project.name}
                  className="showcase-large-card"
                >
                  <div className="showcase-card-hero-pane">
                    <div className="showcase-card-ambient-orb" />
                    <div className="showcase-card-glyph-box">
                      {isMobileApp ? <Smartphone size={32} /> : index === 0 ? <Layers size={32} /> : index === 1 ? <Compass size={32} /> : <Globe size={32} />}
                    </div>
                    <div className="showcase-card-badge-cluster">
                      <span className={`showcase-status-badge ${status.toLowerCase() === 'live' ? 'status-live' : 'status-progress'}`}>
                        <span className="status-indicator-dot" />
                        {status}
                      </span>
                      <span className="showcase-category-pill">{categoryLabel(project.category)}</span>
                      {project.year && <span className="showcase-year-label">{project.year}</span>}
                    </div>
                  </div>

                  <div className="showcase-card-content-pane">
                    <div className="showcase-card-meta-head">
                      <h3 className="showcase-product-title">
                        <Link href={detailHref}>{project.name}</Link>
                      </h3>
                      {project.tagline && (
                        <p className="showcase-product-tagline">{project.tagline}</p>
                      )}
                    </div>

                    <p className="showcase-product-description">
                      {project.description || 'Explore this purpose-built independent software application and discover its complete capability set.'}
                    </p>

                    {project.tags && project.tags.length > 0 && (
                      <div className="showcase-tags-wrap">
                        {project.tags.slice(0, 5).map((t) => (
                          <span key={t} className="showcase-tech-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="showcase-card-actions">
                      <Link href={detailHref} className="btn-primary-glow showcase-detail-btn">
                        Explore Product <ArrowRight size={15} />
                      </Link>
                      {safeLaunchUrl && (
                        <a
                          href={safeLaunchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary-glass showcase-launch-btn"
                        >
                          {launchText} <ArrowUpRight size={15} />
                        </a>
                      )}
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

      {/* Architecture & Engineering Standards Section */}
      <section className="home-discovery-section" aria-labelledby="standards-heading">
        <div className="home-discovery-section-head">
          <div>
            <div className="home-discovery-eyebrow">Studio Tenets</div>
            <h2 id="standards-heading" className="home-discovery-heading">Engineered Without Noise</h2>
            <p className="home-discovery-blurb">Every product across TomeSphere adheres to four uncompromising product quality benchmarks.</p>
          </div>
          <Link href="/about" className="home-discovery-textlink">Learn more about our craft <ArrowRight size={15} /></Link>
        </div>

        <div className="home-standards-grid">
          <div className="home-standard-card">
            <div className="home-standard-icon-box standard-icon-cyan">
              <Zap size={22} />
            </div>
            <h3 className="home-standard-title">Edge Latency</h3>
            <p className="home-standard-desc">
              Sub-second cold starts and global edge distribution ensure every tool opens instantly without friction or loading fatigue.
            </p>
            <div className="home-standard-metric">Instantaneous &middot; Edge cached</div>
          </div>

          <div className="home-standard-card">
            <div className="home-standard-icon-box standard-icon-violet">
              <Shield size={22} />
            </div>
            <h3 className="home-standard-title">Defensive Isolation</h3>
            <p className="home-standard-desc">
              Independent databases, least-privilege security policies, and strict API sanitization prevent cross-system data leakages.
            </p>
            <div className="home-standard-metric">Row-level security &middot; Encrypted</div>
          </div>

          <div className="home-standard-card">
            <div className="home-standard-icon-box standard-icon-emerald">
              <Terminal size={22} />
            </div>
            <h3 className="home-standard-title">Clean Runtime Delivery</h3>
            <p className="home-standard-desc">
              Zero tracking telemetry bloat, minimal bundle weights, and native performance across Android, desktop, and mobile browsers.
            </p>
            <div className="home-standard-metric">Lightweight &middot; Zero telemetry bloat</div>
          </div>

          <div className="home-standard-card">
            <div className="home-standard-icon-box standard-icon-rose">
              <Sparkles size={22} />
            </div>
            <h3 className="home-standard-title">Human-First Ergonomics</h3>
            <p className="home-standard-desc">
              Distraction-free typographic layouts, cohesive dark and light palettes, and tactile micro-interactions that respect user focus.
            </p>
            <div className="home-standard-metric">Crafted UX &middot; Dual-mode contrast</div>
          </div>
        </div>
      </section>

      {/* Connected Changelog Stream (Live from Backend) */}
      {updates.length > 0 && (
        <section className="home-discovery-section" aria-labelledby="changelog-heading">
          <div className="home-discovery-section-head">
            <div>
              <div className="home-discovery-eyebrow">Real-Time Progression</div>
              <h2 id="changelog-heading" className="home-discovery-heading">Recent Releases &amp; Shipments</h2>
              <p className="home-discovery-blurb">Verified deployment changelogs and platform upgrades from active product pipelines.</p>
            </div>
            <Link href="/updates" className="home-discovery-textlink">Browse all updates <ArrowRight size={15} /></Link>
          </div>

          <div className="home-changelog-grid">
            {updates.map((item) => (
              <article key={item.id || item.slug} className="home-changelog-card">
                <div className="home-changelog-meta-row">
                  <span className={`badge update-type-badge update-type-${item.update_type?.toLowerCase()}`}>
                    {item.update_type}
                  </span>
                  {item.version && <span className="badge badge-mono">{item.version}</span>}
                  {item.projects?.name && (
                    <span className="home-changelog-product-tag">
                      <Tag size={11} /> {item.projects.name}
                    </span>
                  )}
                </div>
                <h3 className="home-changelog-title">
                  <Link href={`/updates/${item.slug}`}>{item.title}</Link>
                </h3>
                <p className="home-changelog-summary">{item.summary}</p>
                <div className="home-changelog-action">
                  <Link href={`/updates/${item.slug}`}>
                    View release notes <ArrowUpRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Active Promotion Banner / Community Gateway */}
      <section className="home-discovery-section">
        <div className="home-community-banner">
          <div className="home-community-content">
            <div className="home-discovery-eyebrow" style={{ color: '#c4b5fd' }}>Community &amp; Inquiries</div>
            <h2 className="home-community-title">Building purposeful digital software.</h2>
            <p className="home-community-desc">
              Have thoughts, collaboration ideas, or feedback on any TomeSphere platform? Leave a note on our community guestbook or reach out directly.
            </p>
            <div className="home-community-actions">
              <Link href="/guestbook" className="btn-primary-glow">
                Sign Community Wall <ArrowRight size={15} />
              </Link>
              <Link href="/contact" className="btn-secondary-glass" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                Contact Studio
              </Link>
            </div>
          </div>
          <div className="home-community-decor" aria-hidden="true">
            <div className="home-community-orb" />
            <Activity size={120} className="home-community-icon-bg" />
          </div>
        </div>
      </section>
    </div>
  );
}
