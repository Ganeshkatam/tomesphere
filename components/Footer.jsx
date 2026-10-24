import React from 'react';
import Link from 'next/link';
import { Linkedin, Github, Mail } from 'lucide-react';

export default function Footer({ profile }) {
  const email = profile?.email || 'katamganesh61@gmail.com';
  const linkedin = profile?.socials?.linkedin || 'linkedin.com/in/ganeshkatam';
  const github = profile?.socials?.github || 'github.com/Ganeshkatam';
  const founderName = profile?.name || 'Katam Ganesh Reddy';

  return (
    <footer className="site-footer">
      <div className="footer-main-grid">
        <div className="footer-brand-column">
          <div className="footer-brand-header">
            <Link href="/" className="brand-monogram" aria-label="TomeSphere">
              TS
            </Link>
            <div>
              <div className="footer-brand-title">TomeSphere</div>
              <div className="footer-brand-subtitle">Independent Digital Product Studio</div>
            </div>
          </div>
          <p className="footer-brand-tagline">
            Purposeful software, creator tools, and dependable web platforms built with clean architecture and distraction-free craft.
          </p>
          <div className="footer-status-pill">
            <span className="status-indicator-dot" />
            <span>All systems operational &middot; tomesphere.in</span>
          </div>
        </div>

        <div className="footer-nav-columns">
          <div className="footer-column">
            <div className="footer-column-heading">Ecosystem</div>
            <Link href="/products" className="footer-nav-link">Software Directory</Link>
            <Link href="/updates" className="footer-nav-link">Product Changelog</Link>
            <Link href="/offers" className="footer-nav-link">Access &amp; Offers</Link>
          </div>

          <div className="footer-column">
            <div className="footer-column-heading">Studio</div>
            <Link href="/about" className="footer-nav-link">Design Philosophy</Link>
            <Link href="/guestbook" className="footer-nav-link">Community Wall</Link>
            <Link href="/contact" className="footer-nav-link">Direct Inquiries</Link>
          </div>

          <div className="footer-column">
            <div className="footer-column-heading">Connect</div>
            {github && (
              <a href={`https://${github}`} target="_blank" rel="noreferrer" className="footer-nav-link">
                <Github size={14} /> GitHub
              </a>
            )}
            {linkedin && (
              <a href={`https://${linkedin}`} target="_blank" rel="noreferrer" className="footer-nav-link">
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className="footer-nav-link">
                <Mail size={14} /> Email Studio
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer-legal-bar">
        <span>&copy; {new Date().getFullYear()} TomeSphere. All software products independently developed and operated.</span>
        <span>Directed &amp; Engineered by {founderName}</span>
      </div>
    </footer>
  );
}
