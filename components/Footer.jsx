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
      <div className="footer-brand">
        <Link href="/" className="brand-monogram" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
          TS
        </Link>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>TomeSphere</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Independent digital studio · tomesphere.in</div>
        </div>
      </div>

      <div className="footer-links-row">
        <Link href="/products" className="footer-nav-link">Products</Link>
        <Link href="/updates" className="footer-nav-link">Updates</Link>
        <Link href="/offers" className="footer-nav-link">Offers</Link>
        <Link href="/about" className="footer-nav-link">About Studio</Link>
        <Link href="/guestbook" className="footer-nav-link">Guestbook</Link>
        <Link href="/contact" className="footer-nav-link">Contact</Link>
      </div>

      <div className="footer-social-links">
        {linkedin && (
          <a href={`https://${linkedin}`} target="_blank" rel="noreferrer" title="LinkedIn">
            <Linkedin size={15} />
          </a>
        )}
        {github && (
          <a href={`https://${github}`} target="_blank" rel="noreferrer" title="GitHub">
            <Github size={15} />
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} title="Email">
            <Mail size={15} />
          </a>
        )}
      </div>

      <div style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
        <span>&copy; {new Date().getFullYear()} TomeSphere. All software products independently developed.</span>
        <span>Engineered by {founderName}</span>
      </div>
    </footer>
  );
}
