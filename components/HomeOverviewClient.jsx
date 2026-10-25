'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Globe,
  Compass,
  Layers,
  Smartphone,
  Shield,
  Zap,
  Sparkles,
  Gift,
  Calendar,
  Tag,
  CheckCircle2,
  Terminal,
  Activity,
  BookOpen,
  Bookmark,
  Clock,
  Store,
  TrendingUp,
  QrCode,
  Share2,
  Tv,
  Users,
  Radio,
  Play,
  Building2,
  Key,
  MapPin,
  ShieldCheck,
  Box,
  ShoppingBag,
  Cpu,
  GitBranch,
  Command,
  Camera,
  Scan,
  Calculator
} from 'lucide-react';

function getProductDesign(project) {
  const slug = (project.slug || project.id || '').toLowerCase();

  if (slug.includes('bookgarden')) {
    return {
      themeClass: 'theme-bookgarden',
      accentColor: '#818cf8',
      eyebrowText: 'Knowledge Archive & Reader',
      CategoryIcon: BookOpen,
      featureHighlights: [
        'Distraction-free reading sanctuary with custom typography and reading flow',
        'Persistent chapter bookmarks with real-time cloud and offline synchronization',
        'Engineered with clean domain-driven architecture on Next.js & TypeScript'
      ],
      renderStage: () => (
        <div className="stage-bookgarden">
          <div className="bookgarden-preview-card">
            <div className="bookgarden-card-bar">
              <span className="bookgarden-reader-dot" />
              <span className="bookgarden-reader-title">BookGarden Engine</span>
              <span className="bookgarden-reader-meta">Dark Mode Reader</span>
            </div>
            <div className="bookgarden-page-content">
              <div className="bookgarden-chapter-kicker">Chapter 04 &middot; Reading Archive</div>
              <div className="bookgarden-page-quote">
                &ldquo;Purposeful reading is the foundation of clear architectural thought.&rdquo;
              </div>
              <div className="bookgarden-progress-bar-wrap">
                <div className="bookgarden-progress-bar-fill" style={{ width: '68%' }} />
              </div>
              <div className="bookgarden-stats-strip">
                <span><Clock size={11} /> 280 wpm flow</span>
                <span><Bookmark size={11} /> Page 184 of 270</span>
              </div>
            </div>
          </div>
        </div>
      )
    };
  }

  if (slug.includes('streetcraft')) {
    return {
      themeClass: 'theme-streetcraft',
      accentColor: '#f59e0b',
      eyebrowText: 'Omnichannel Commerce Engine',
      CategoryIcon: Store,
      featureHighlights: [
        'Turns commercial storefronts into unified digital customer discovery touchpoints',
        'Real-time synchronization across Google Maps, Instagram, and WhatsApp channels',
        'Instant print-ready QR counter stands and live catalog publishing'
      ],
      renderStage: () => (
        <div className="stage-streetcraft">
          <div className="streetcraft-hub-card">
            <div className="streetcraft-hub-header">
              <Store size={15} />
              <span>Omnichannel Growth Grid</span>
              <span className="streetcraft-live-pill"><span className="pulse-dot" /> Live Sync</span>
            </div>
            <div className="streetcraft-channel-grid">
              <div className="channel-box box-google">
                <div className="channel-name">Google Maps</div>
                <div className="channel-stat">4.9 Rating (340+)</div>
                <div className="channel-status">Verified Presence</div>
              </div>
              <div className="channel-box box-whatsapp">
                <div className="channel-name">WhatsApp Commerce</div>
                <div className="channel-stat">Direct Ordering</div>
                <div className="channel-status">Live Catalog</div>
              </div>
              <div className="channel-box box-instagram">
                <div className="channel-name">Instagram Shop</div>
                <div className="channel-stat">Auto Published</div>
                <div className="channel-status">Stories &amp; Posts</div>
              </div>
              <div className="channel-box box-qr">
                <div className="channel-name">Counter QR</div>
                <div className="channel-stat">Print Vector Ready</div>
                <div className="channel-status">Zero App Download</div>
              </div>
            </div>
            <div className="streetcraft-metric-footer">
              <TrendingUp size={12} />
              <span>+184% customer discovery across multi-channel touchpoints</span>
            </div>
          </div>
        </div>
      )
    };
  }

  if (slug.includes('cowatch')) {
    return {
      themeClass: 'theme-cowatch',
      accentColor: '#06b6d4',
      eyebrowText: 'Synchronized Cinema & Streaming',
      CategoryIcon: Tv,
      featureHighlights: [
        'Sub-15ms synchronized video playback runtime powered by WebSockets',
        'Virtual cinema rooms with low-latency interactive chat and attendee states',
        'Native support for direct video feeds, HLS live streams, and external sources'
      ],
      renderStage: () => (
        <div className="stage-cowatch">
          <div className="cowatch-theater-card">
            <div className="cowatch-screen-frame">
              <div className="cowatch-video-placeholder">
                <div className="cowatch-play-ring">
                  <Play size={20} fill="currentColor" />
                </div>
                <div className="cowatch-live-watermark">
                  <span className="cowatch-live-tag">LIVE STREAM</span>
                  <span className="cowatch-time-code">01:42:18 / 02:15:00</span>
                </div>
              </div>
              <div className="cowatch-scrubber">
                <div className="cowatch-scrubber-track">
                  <div className="cowatch-scrubber-progress" style={{ width: '74%' }} />
                </div>
              </div>
            </div>
            <div className="cowatch-cockpit-bar">
              <div className="cowatch-sync-metric">
                <Radio size={12} className="icon-pulse" />
                <span>Sync Latency: 12ms</span>
              </div>
              <div className="cowatch-party-avatars">
                <Users size={12} />
                <span>8 in Party Lounge</span>
              </div>
              <div className="cowatch-audio-waves" aria-hidden="true">
                <span className="wave-bar bar-1" />
                <span className="wave-bar bar-2" />
                <span className="wave-bar bar-3" />
                <span className="wave-bar bar-4" />
                <span className="wave-bar bar-5" />
              </div>
            </div>
          </div>
        </div>
      )
    };
  }

  if (slug.includes('elitestay')) {
    return {
      themeClass: 'theme-elitestay',
      accentColor: '#10b981',
      eyebrowText: 'Curated Living & Residences',
      CategoryIcon: Building2,
      featureHighlights: [
        '100% on-site verified student hostels, executive PGs, and premium suites',
        'Direct booking bridge connecting tenants and verified property operators',
        'Zero brokerage policy with transparent, all-inclusive pricing tiers'
      ],
      renderStage: () => (
        <div className="stage-elitestay">
          <div className="elitestay-residence-card">
            <div className="elitestay-badge-top">
              <span className="elitestay-verified-tag">
                <ShieldCheck size={12} /> Verified Residence
              </span>
              <span className="elitestay-zero-tag">Zero Brokerage</span>
            </div>
            <div className="elitestay-living-content">
              <div className="elitestay-room-type">Executive Living Suite &amp; PGs</div>
              <div className="elitestay-location">
                <MapPin size={12} /> Premier Tech Hub &amp; University Districts
              </div>
              <div className="elitestay-amenities-row">
                <span className="amenity-chip">Gigabit WiFi</span>
                <span className="amenity-chip">Chef Meals</span>
                <span className="amenity-chip">Biometric Entry</span>
                <span className="amenity-chip">Housekeeping</span>
              </div>
            </div>
            <div className="elitestay-footer-strip">
              <div className="elitestay-price-wrap">
                <span className="price-label">Transparent Rates</span>
                <span className="price-val">All inclusive pricing</span>
              </div>
              <div className="elitestay-virtual-tour">
                <Key size={12} /> Direct Key Handover
              </div>
            </div>
          </div>
        </div>
      )
    };
  }

  if (slug.includes('fitmirror')) {
    return {
      themeClass: 'theme-fitmirror',
      accentColor: '#ec4899',
      eyebrowText: 'Fashion Tech & 3D Spatial Try-On',
      CategoryIcon: Sparkles,
      featureHighlights: [
        'Immersive 3D virtual try-on engine simulating cloth physics on personalized avatars',
        'Proven to reduce fashion sizing uncertainty and return overhead by up to 42%',
        'Tightly coupled with the FitSeller merchant analytics and order fulfillment portal'
      ],
      renderStage: () => (
        <div className="stage-fitmirror">
          <div className="fitmirror-viewport-card">
            <div className="fitmirror-header-bar">
              <Sparkles size={14} />
              <span>3D Spatial Mannequin</span>
              <span className="fitmirror-match-pill">99.4% Fit Precision</span>
            </div>
            <div className="fitmirror-wireframe-stage">
              <div className="fitmirror-mesh-grid" />
              <div className="fitmirror-avatar-silhouette">
                <div className="silhouette-head" />
                <div className="silhouette-torso" />
                <div className="silhouette-scanline" />
              </div>
            </div>
            <div className="fitmirror-analytics-strip">
              <div className="fitmirror-sub-pill">
                <Box size={11} />
                <span>Volumetric Cloth Engine</span>
              </div>
              <div className="fitmirror-sub-pill">
                <ShoppingBag size={11} />
                <span>FitSeller Portal</span>
              </div>
            </div>
          </div>
        </div>
      )
    };
  }

  if (slug.includes('gk-dev') || slug.includes('cli')) {
    return {
      themeClass: 'theme-gk-dev-cli',
      accentColor: '#22c55e',
      eyebrowText: 'Developer Automation & CLI',
      CategoryIcon: Terminal,
      featureHighlights: [
        'Manifest-driven project discovery and multi-repository task execution',
        'Sub-millisecond pipeline orchestration with zero global environment side effects',
        'Extensible plugin architecture for custom build, lint, and deploy workflows'
      ],
      renderStage: () => (
        <div className="stage-cli">
          <div className="cli-terminal-card">
            <div className="cli-terminal-titlebar">
              <span className="cli-dot dot-red" />
              <span className="cli-dot dot-yellow" />
              <span className="cli-dot dot-green" />
              <span className="cli-term-label">gk-dev-cli v2.4</span>
            </div>
            <div className="cli-terminal-body">
              <div className="cli-line line-cmd">
                <span className="cli-prompt">$</span> gk workspace run --target prod
              </div>
              <div className="cli-line line-dim">[manifest] loaded 7 systems in 12ms</div>
              <div className="cli-line line-success">[verify] 37/37 security tests passed</div>
              <div className="cli-line line-success">[deploy] tomesphere.in &middot; ready</div>
              <div className="cli-cursor-line">
                <span className="cli-prompt">$</span> <span className="cli-cursor" />
              </div>
            </div>
            <div className="cli-terminal-meta">
              <span><Cpu size={11} /> Zero Config Drift</span>
              <span><GitBranch size={11} /> Local Determinism</span>
            </div>
          </div>
        </div>
      )
    };
  }

  if (slug.includes('calclens')) {
    return {
      themeClass: 'theme-calclens',
      accentColor: '#a855f7',
      eyebrowText: 'Camera-First Computer Vision AR',
      CategoryIcon: Camera,
      featureHighlights: [
        'Continuous real-time mathematical expression recognition in live video',
        'Projects step-by-step computed solutions directly over physical paper',
        'Built natively with Android CameraX, Google ML Kit, and Jetpack Compose'
      ],
      renderStage: () => (
        <div className="stage-calclens">
          <div className="calclens-hud-card">
            <div className="calclens-camera-viewfinder">
              <div className="calclens-reticle top-left" />
              <div className="calclens-reticle top-right" />
              <div className="calclens-reticle bottom-left" />
              <div className="calclens-reticle bottom-right" />
              <div className="calclens-laser-scan" />

              <div className="calclens-recognized-box">
                <span className="calclens-box-label">DETECTED EQUATION</span>
                <div className="calclens-formula">2x&sup2; + 5x - 12 = 0</div>
                <div className="calclens-solved">
                  <span className="solved-badge">SOLVED IN 18ms</span>
                  <span className="solved-value">x = 1.5, x = -4</span>
                </div>
              </div>
            </div>
            <div className="calclens-tech-strip">
              <span><Camera size={11} /> CameraX 60fps</span>
              <span><Scan size={11} /> Google ML Kit Vision</span>
              <span><Smartphone size={11} /> Jetpack Compose</span>
            </div>
          </div>
        </div>
      )
    };
  }

  // Generic fallback
  return {
    themeClass: 'theme-generic',
    accentColor: 'var(--accent-primary)',
    eyebrowText: project.category || 'Independent System',
    CategoryIcon: Layers,
    featureHighlights: [
      project.description || 'Purpose-built independent digital software application.',
      'Designed with clean architectural boundaries and dependable craft',
      'Optimized for rapid load times and intuitive user interaction'
    ],
    renderStage: () => (
      <div className="stage-generic">
        <div className="generic-showcase-box">
          <div className="generic-icon-ring">
            <Layers size={36} />
          </div>
          <div className="generic-title">{project.name}</div>
          <div className="generic-badge">{project.status || 'Live'}</div>
        </div>
      </div>
    )
  };
}

export default function HomeOverviewClient({ projects = [], profile, updates = [], offers = [] }) {
  const [homeQuery, setHomeQuery] = useState('');
  const displayProjects = projects.length > 0 ? projects : [];

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
        </div>
      </section>

      {/* Flagship Products: Fullscreen Horizontal Cards in a Vertical List */}
      <section className="home-discovery-section" aria-labelledby="featured-products-heading">
        <div className="home-discovery-section-head">
          <div>
            <div className="home-discovery-eyebrow">Product Ecosystem</div>
            <h2 id="featured-products-heading" className="home-discovery-heading">Flagship Software &amp; Platforms</h2>
            <p className="home-discovery-blurb">
              Every platform in the TomeSphere umbrella is engineered as an independent system with its own architectural identity, bespoke visual design, and dedicated runtime.
            </p>
          </div>
          <div className="showcase-catalog-counter">
            <span className="counter-number">{displayProjects.length}</span>
            <span className="counter-label">Independent Products</span>
          </div>
        </div>

        {displayProjects.length > 0 ? (
          <div className="products-fullscreen-vertical-list" role="region" aria-label="Flagship products showcase">
            {displayProjects.map((project) => {
              const isMobileApp = project.category?.toUpperCase() === 'MOBILE' ||
                (Array.isArray(project.tags) && project.tags.some(t => /android|ios|mobile/i.test(t)));
              const status = statusLabel(project.status);
              const detailHref = productHref(project);
              const safeLaunchUrl = project.url ? (project.url.startsWith('http') ? project.url : `https://${project.url}`) : null;
              const isGitHubUrl = safeLaunchUrl && /github\.com/i.test(safeLaunchUrl);
              const launchText = isMobileApp && isGitHubUrl ? 'View Repo' : (isGitHubUrl ? 'GitHub Repo' : 'Launch Platform');

              const design = getProductDesign(project);
              const CategoryIcon = design.CategoryIcon;

              return (
                <article
                  key={project.id || project.slug || project.name}
                  className={`product-fullscreen-card ${design.themeClass}`}
                >
                  {/* Left Column: Bespoke Interactive Visual Stage */}
                  <div className="product-fullscreen-stage">
                    <div className="product-stage-ambient-glow" aria-hidden="true" />
                    <div className="product-stage-ambient-lines" aria-hidden="true" />
                    {design.renderStage()}
                  </div>

                  {/* Right Column: Full Product Dossier */}
                  <div className="product-fullscreen-dossier">
                    <div className="product-dossier-header">
                      <span className="product-category-eyebrow">
                        <CategoryIcon size={12} />
                        <span>{design.eyebrowText || categoryLabel(project.category)}</span>
                      </span>
                      <div className="product-status-cluster">
                        <span className={`showcase-status-badge ${status.toLowerCase() === 'live' ? 'status-live' : 'status-progress'}`}>
                          <span className="status-indicator-dot" />
                          {status}
                        </span>
                        {project.year && <span className="showcase-year-label">{project.year}</span>}
                      </div>
                    </div>

                    <div className="product-dossier-main">
                      <h3 className="product-dossier-title">
                        <Link href={detailHref}>{project.name}</Link>
                      </h3>
                      {project.tagline && (
                        <p className="product-dossier-tagline">{project.tagline}</p>
                      )}
                      <p className="product-dossier-desc">
                        {project.description || 'Explore this purpose-built independent software application and discover its complete capability set.'}
                      </p>
                    </div>

                    {/* Key Architectural Highlights */}
                    <div className="product-dossier-highlights">
                      <div className="highlights-caption">Core Architectural Capabilities</div>
                      <ul className="highlights-list">
                        {design.featureHighlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="highlight-item">
                            <CheckCircle2 size={13} className="highlight-bullet-icon" style={{ color: design.accentColor }} />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="showcase-tags-wrap">
                        {project.tags.slice(0, 5).map((t) => (
                          <span key={t} className="showcase-tech-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action CTAs */}
                    <div className="product-dossier-actions">
                      <Link href={detailHref} className="btn-primary-glow product-cta-primary">
                        Explore System <ArrowRight size={15} />
                      </Link>
                      {safeLaunchUrl && (
                        <a
                          href={safeLaunchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary-glass product-cta-secondary"
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
            <div className="home-discovery-eyebrow">Community &amp; Inquiries</div>
            <h2 className="home-community-title">Building purposeful digital software.</h2>
            <p className="home-community-desc">
              Have thoughts, collaboration ideas, or feedback on any TomeSphere platform? Leave a note on our community guestbook or reach out directly.
            </p>
            <div className="home-community-actions">
              <Link href="/guestbook" className="btn-primary-glow">
                Sign Community Wall <ArrowRight size={15} />
              </Link>
              <Link href="/contact" className="btn-secondary-glass">
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
