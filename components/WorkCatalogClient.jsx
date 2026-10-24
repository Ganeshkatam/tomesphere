'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Globe,
  ArrowUpRight,
  ArrowRight,
  Smartphone,
  X,
  Layers,
  Compass,
  Code2,
  Tv,
  Building2,
  Calculator,
  SlidersHorizontal
} from 'lucide-react';

function getProductIcon(project) {
  const slug = (project.slug || project.id || project.name || '').toLowerCase();
  const category = (project.category || '').toUpperCase();
  const tags = Array.isArray(project.tags) ? project.tags.map(t => t.toLowerCase()) : [];

  if (category === 'MOBILE' || tags.some(t => /android|ios|mobile/.test(t)) || slug.includes('calclens')) {
    return <Smartphone size={20} />;
  }
  if (slug.includes('book') || slug.includes('garden')) {
    return <Layers size={20} />;
  }
  if (slug.includes('street') || slug.includes('craft')) {
    return <Code2 size={20} />;
  }
  if (slug.includes('watch') || slug.includes('stream')) {
    return <Tv size={20} />;
  }
  if (slug.includes('stay') || slug.includes('elites')) {
    return <Building2 size={20} />;
  }
  return <Compass size={20} />;
}

export default function WorkCatalogClient({ initialProjects = [] }) {
  const [products] = useState(initialProjects || []);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    if (initialQuery) setSearchQuery(initialQuery);
  }, []);

  const categories = ['ALL', ...new Set(products.map(p => p.category).filter(Boolean))];

  const visibleProjects = products.filter(p => {
    const matchesFilter = activeFilter === 'ALL' || p.category === activeFilter;
    const matchesSearch = `${p.name} ${p.category} ${p.tagline || ''} ${p.description} ${(p.tags || []).join(' ')}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="catalog-wrapper">
      <div className="projects-filter-bar">
        <div className="filter-pills" role="tablist" aria-label="Category filter">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeFilter === cat}
              className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              <span>{cat}</span>
              <span className="pill-count">
                {cat === 'ALL' ? products.length : products.filter(p => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        <label className="search-input-wrapper">
          <Search size={14} aria-hidden="true" />
          <input
            type="text"
            className="search-field"
            aria-label="Search products by name, category, description, or tag"
            placeholder="Search products or tags…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search input"
            >
              <X size={13} />
            </button>
          )}
        </label>
      </div>

      <div className="catalog-meta-row">
        <p className="catalog-results" aria-live="polite">
          <span className="catalog-results-strong">{visibleProjects.length}</span>{' '}
          {visibleProjects.length === 1 ? 'system' : 'systems'} indexed
          {searchQuery ? ` matching “${searchQuery}”` : ''}
          {activeFilter !== 'ALL' ? ` in ${activeFilter}` : ''}
        </p>

        {(searchQuery || activeFilter !== 'ALL') && (
          <button
            type="button"
            className="catalog-reset-link"
            onClick={() => {
              setActiveFilter('ALL');
              setSearchQuery('');
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="projects-masonry">
        {visibleProjects.map(project => {
          const detailHref = `/products/${project.slug || project.id}`;
          const launchHref = project.url ? (project.url.startsWith('http') ? project.url : `https://${project.url}`) : null;
          const isMobileApp = project.category?.toUpperCase() === 'MOBILE' || (Array.isArray(project.tags) && project.tags.some(t => /android|ios|mobile/i.test(t)));
          const isGitHubUrl = launchHref && /github\.com/i.test(launchHref);
          const launchLabel = isMobileApp && isGitHubUrl ? 'GitHub Repo' : (isGitHubUrl ? 'GitHub' : 'Launch Runtime');

          return (
            <article key={project.id} className="project-card-modern">
              <div className="project-card-hero-mini">
                <div className="project-card-glyph-mini" aria-hidden="true">
                  {getProductIcon(project)}
                </div>
                <div className="project-badge-row">
                  <span className={`card-status-badge ${project.status === 'Live' ? 'badge-live' : 'badge-draft'}`}>
                    <span className="status-indicator-dot" />
                    {project.status}
                  </span>
                  <span className="card-category-badge">{project.category}</span>
                </div>
                {project.year && <span className="card-year-label">{project.year}</span>}
              </div>

              <div className="card-content-area">
                <h3 className="card-title">
                  <Link href={detailHref} className="card-title-link">
                    {project.name}
                  </Link>
                </h3>

                {project.tagline && (
                  <p className="card-tagline-text">{project.tagline}</p>
                )}

                <div className="card-url-row">
                  {isMobileApp ? <Smartphone size={12} /> : <Globe size={12} />}
                  <span>{project.url || (isMobileApp ? 'Native Android (APK / GitHub)' : 'Independent runtime')}</span>
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
                    <span>Specifications</span>
                    <ArrowRight size={13} />
                  </Link>
                  {launchHref && (
                    <a
                      href={launchHref}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-launch-link"
                    >
                      <span>{launchLabel}</span>
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {visibleProjects.length === 0 && (
        <div className="catalog-empty-state">
          <div className="catalog-empty-icon" aria-hidden="true">
            <SlidersHorizontal size={28} />
          </div>
          <h3 className="catalog-empty-title">No matching systems found</h3>
          <p className="catalog-empty-desc">
            No active products match your filter criteria or search query. Try broadening your keywords.
          </p>
          <button
            type="button"
            className="btn-secondary-glass"
            onClick={() => {
              setActiveFilter('ALL');
              setSearchQuery('');
            }}
          >
            Clear search and filters
          </button>
        </div>
      )}
    </div>
  );
}
