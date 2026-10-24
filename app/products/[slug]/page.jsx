import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Globe,
  Github,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Gift,
  Clock,
  Smartphone
} from 'lucide-react';
import { apiClient } from '../../../lib/api-client.js';
import { projectService } from '../../../server/services/project.service.js';

export const revalidate = 1800;

function getSafeWebUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

async function getProduct(slug) {
  if (!slug || typeof slug !== 'string') return null;
  try {
    return await projectService.getProjectBySlug(slug);
  } catch (directErr) {
    if (directErr?.name === 'NotFoundError' || directErr?.code === 'NOT_FOUND') {
      return null;
    }
    try {
      return await apiClient.projects.getBySlug(slug);
    } catch (err) {
      if (err?.status === 404 || err?.code === 'RESOURCE_NOT_FOUND' || err?.code === 'PROJECT_NOT_FOUND') {
        return null;
      }
      console.error(`[ProductDetailPage]: Infrastructure error fetching slug '${slug}':`, err.message);
      throw err;
    }
  }
}

export async function generateStaticParams() {
  try {
    const projects = await projectService.listProjects().catch(() => apiClient.projects.list());
    return (projects || [])
      .filter((p) => p.slug)
      .map((p) => ({
        slug: p.slug,
      }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let project = null;

  try {
    project = await getProduct(slug);
  } catch {
    // In metadata generation, fall back gracefully if API is temporarily unavailable
    project = null;
  }

  if (!project) {
    return {
      title: 'Product Not Found — TomeSphere',
      description: 'The requested product could not be found in the TomeSphere directory.'
    };
  }

  const title = `${project.name} — TomeSphere Digital Product`;
  const description = project.tagline || project.description || `Explore ${project.name} on the TomeSphere platform.`;
  const canonicalUrl = `https://www.tomesphere.in/products/${project.slug || project.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website'
    }
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const project = await getProduct(slug);

  if (!project) {
    notFound();
  }

  // Format destination URL safely
  const launchHref = getSafeWebUrl(project.url);
  const githubHref = project.github_url ? getSafeWebUrl(project.github_url) : null;
  const displayUrl = launchHref ? launchHref.replace(/^https?:\/\//, '').replace(/\/$/, '') : (project.url || '');

  const isMobileApp = project.category?.toUpperCase() === 'MOBILE' || (Array.isArray(project.tags) && project.tags.some(t => /android|ios|mobile/i.test(t)));
  const isGitHubUrl = launchHref && /github\.com/i.test(launchHref);
  const primaryActionLabel = isMobileApp && isGitHubUrl 
    ? 'View Android Repository' 
    : isGitHubUrl 
      ? 'View Repository' 
      : (isMobileApp ? 'Open App' : 'Launch Application');

  // Fetch related products, verified updates, and active offers in parallel
  let relatedProducts = [];
  let productUpdates = [];
  let productOffers = [];

  try {
    const [allProjects, updatesRes, offersRes] = await Promise.all([
      apiClient.projects.list().catch(() => []),
      apiClient.updates.list({ project_id: project.id, status: 'Published', limit: 3 }).catch(() => []),
      apiClient.offers.list({ project_id: project.id, status: 'Published', onlyActive: true, limit: 2 }).catch(() => [])
    ]);

    relatedProducts = (allProjects || [])
      .filter(p => (p.slug || p.id) !== (project.slug || project.id))
      .slice(0, 3);
    productUpdates = updatesRes || [];
    productOffers = offersRes || [];
  } catch {
    relatedProducts = [];
    productUpdates = [];
    productOffers = [];
  }

  return (
    <div className="page-wrapper product-detail-page">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="detail-breadcrumb">
        <Link href="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator" aria-hidden="true">/</span>
        <Link href="/products" className="breadcrumb-link">Products</Link>
        <span className="breadcrumb-separator" aria-hidden="true">/</span>
        <span className="breadcrumb-current" aria-current="page">{project.name}</span>
      </nav>

      {/* Product Hero Header */}
      <header className="product-detail-header">
        <div className="product-header-badge-row">
          <span className={`card-status-badge ${project.status === 'Live' ? 'badge-live' : 'badge-draft'}`}>
            <span className="status-indicator-dot" />
            {project.status}
          </span>
          <span className="card-category-badge">{project.category}</span>
          {project.year && (
            <span className="detail-meta-pill">
              <Calendar size={12} /> {project.year}
            </span>
          )}
        </div>

        <h1 className="product-detail-title">{project.name}</h1>
        {project.tagline && (
          <p className="product-detail-tagline">{project.tagline}</p>
        )}

        <div className="product-header-actions">
          {launchHref ? (
            <a
              href={launchHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-glow btn-launch-highlight"
            >
              {primaryActionLabel} <ArrowUpRight size={16} />
            </a>
          ) : (
            <span className="btn-disabled-placeholder">Launch URL Not Available</span>
          )}
          <Link href="/products" className="btn-secondary-glass">
            <ArrowLeft size={15} /> All Products
          </Link>
        </div>
      </header>

      {/* Main Detail Two-Column Content Grid */}
      <div className="product-detail-grid">
        {/* Left Column: Product Information & Architecture */}
        <div className="detail-primary-content">
          <section className="detail-panel">
            <h2 className="detail-panel-title">Overview &amp; Purpose</h2>
            <p className="detail-panel-description">{project.description}</p>
          </section>

          {project.tags && project.tags.length > 0 && (
            <section className="detail-panel">
              <h2 className="detail-panel-title">Tags &amp; Technologies</h2>
              <div className="detail-tags-wrap">
                {project.tags.map((tag) => (
                  <span key={tag} className="detail-tech-badge">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Connected Changelog: Recent Product Updates */}
          {productUpdates.length > 0 && (
            <section className="detail-section" aria-label="Recent Product Updates">
              <div className="section-head-inline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 className="detail-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} className="text-accent" /> Recent Updates &amp; Changelogs
                </h2>
                <Link href="/updates" className="btn-text-link" style={{ fontSize: '13px' }}>
                  View All Updates <ArrowUpRight size={13} />
                </Link>
              </div>

              <div className="product-updates-compact-list">
                {productUpdates.map((u) => (
                  <article key={u.id || u.slug} className="product-update-compact-card">
                    <div className="compact-update-meta">
                      <span className={`badge update-type-badge update-type-${u.update_type?.toLowerCase()}`}>
                        {u.update_type}
                      </span>
                      {u.version && <span className="badge badge-mono">{u.version}</span>}
                      {u.published_at && (
                        <span className="text-secondary" style={{ fontSize: '12px' }}>
                          {new Date(u.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <h3 className="compact-update-title">
                      <Link href={`/updates/${u.slug}`} className="update-title-link">
                        {u.title}
                      </Link>
                    </h3>
                    <p className="compact-update-summary">{u.summary}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="detail-panel">
            <h2 className="detail-panel-title">Product Specification</h2>
            <dl className="detail-specs-list">
              <div className="spec-item">
                <dt className="spec-label">Category</dt>
                <dd className="spec-value">{project.category}</dd>
              </div>
              <div className="spec-item">
                <dt className="spec-label">Canonical Identifier</dt>
                <dd className="spec-value spec-mono">{project.slug || project.id}</dd>
              </div>
              {project.year && (
                <div className="spec-item">
                  <dt className="spec-label">Release Year</dt>
                  <dd className="spec-value">{project.year}</dd>
                </div>
              )}
              <div className="spec-item">
                <dt className="spec-label">{isMobileApp ? 'Platform / Repository' : 'Target Domain'}</dt>
                <dd className="spec-value">
                  {launchHref ? (
                    <a href={launchHref} target="_blank" rel="noopener noreferrer" className="spec-link">
                      {isMobileApp ? <Smartphone size={13} /> : <Globe size={13} />} {displayUrl}
                    </a>
                  ) : (
                    <span>{displayUrl || (isMobileApp ? 'Native Android' : 'Independent runtime')}</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Right Column: Launch Action & Application Boundary Card */}
        <aside className="detail-sidebar-content">
          <div className="detail-launch-card">
            <div className="launch-card-header">
              <div className="launch-icon-container">
                {isMobileApp ? <Smartphone size={22} /> : <Globe size={22} />}
              </div>
              <div>
                <h3 className="launch-card-title">
                  {project.status === 'Live' ? (isMobileApp ? 'Android App' : 'Live Application') : 'In Development'}
                </h3>
                <span className="launch-card-sub">
                  {isMobileApp ? 'Native Android' : 'Independent Platform'}
                </span>
              </div>
            </div>

            <p className="launch-card-explanation">
              {isMobileApp
                ? 'This is a native Android mobile application built with Kotlin, CameraX, and Jetpack Compose. Continuous recognition and math evaluation run on-device.'
                : 'This application is independently deployed and maintained within the TomeSphere product ecosystem. Launching will direct you to its production domain.'}
            </p>

            {launchHref && (
              <a
                href={launchHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-glow launch-block-btn"
              >
                {primaryActionLabel} <ArrowUpRight size={15} />
              </a>
            )}

            {githubHref && githubHref !== launchHref && (
              <a
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-glass launch-source-btn"
              >
                <Github size={15} /> View Source Code
              </a>
            )}

            <div className="launch-notice-row">
              <ShieldCheck size={13} />
              <span>Verified TomeSphere Product</span>
            </div>
          </div>

          {/* Connected Promotion: Active Product Offers */}
          {productOffers.length > 0 && (
            <div className="detail-offers-card" style={{ marginTop: '20px' }}>
              <div className="launch-card-header">
                <div className="launch-icon-container" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                  <Gift size={20} />
                </div>
                <div>
                  <h3 className="launch-card-title">Active Promotion</h3>
                  <span className="launch-card-sub" style={{ color: '#f59e0b' }}>{productOffers[0].benefit}</span>
                </div>
              </div>
              <p className="launch-card-explanation" style={{ marginBottom: '14px' }}>
                {productOffers[0].description}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  href={`/offers/${productOffers[0].slug}`}
                  className="btn btn-outline"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}
                >
                  Offer Terms
                </Link>
                {productOffers[0].url && (
                  <a
                    href={productOffers[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}
                  >
                    Redeem <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Ecosystem Navigation: Related Products */}
      {relatedProducts.length > 0 && (
        <section className="detail-related-section">
          <div className="section-head">
            <div>
              <div className="page-eyebrow">Ecosystem Discovery</div>
              <h2 className="section-title">Explore Related Products</h2>
              <p className="section-subtitle">
                Discover more purposeful software developed under the TomeSphere umbrella.
              </p>
            </div>
          </div>

          <div className="projects-masonry" style={{ marginTop: '24px' }}>
            {relatedProducts.map((p) => {
              const pSafeUrl = getSafeWebUrl(p.url);
              const pDetailHref = `/products/${p.slug || p.id}`;
              const pIsMobileApp = p.category?.toLowerCase().includes('mobile') || p.tags?.some(t => t.toLowerCase().includes('android') || t.toLowerCase().includes('mobile'));
              const pIsGitHub = pSafeUrl && pSafeUrl.includes('github.com');
              const pLaunchLabel = pIsMobileApp && pIsGitHub ? 'Repo' : (pIsGitHub ? 'Repo' : 'Launch');

              return (
                <article key={p.id} className="project-card-modern">
                  <div className="project-card-header">
                    <div className="project-badge-row">
                      <span className={`card-status-badge ${p.status === 'Live' ? 'badge-live' : 'badge-draft'}`}>
                        <span className="status-indicator-dot" />
                        {p.status}
                      </span>
                      <span className="card-category-badge">{p.category}</span>
                    </div>
                    {p.year && <span className="card-year-label">{p.year}</span>}
                  </div>

                  <div className="card-content-area">
                    <h3 className="card-title">
                      <Link href={pDetailHref} className="card-title-link">
                        {p.name}
                      </Link>
                    </h3>
                    <div className="card-url-row">
                      {pIsMobileApp ? <Smartphone size={12} /> : <Globe size={12} />}
                      <span>{p.url || (pIsMobileApp ? 'Native Android' : 'Independent runtime')}</span>
                    </div>
                    <p className="card-description">{p.description}</p>

                    {p.tags && p.tags.length > 0 && (
                      <div className="card-tags-list">
                        {p.tags.slice(0, 4).map((t) => (
                          <span key={t} className="card-tag-item">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="card-dual-actions">
                      <Link href={pDetailHref} className="btn-detail-link">
                        View Details <ArrowRight size={13} />
                      </Link>
                      {pSafeUrl && (
                        <a
                          href={pSafeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-launch-link"
                        >
                          {pLaunchLabel} <ArrowUpRight size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
