import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const { content } = useSiteData();
  const contact = content?.contact;
  const whatsappUrlNumber = contact?.whatsappNumber || '919258915144';
  const whatsappLink = `https://wa.me/${whatsappUrlNumber}?text=${encodeURIComponent(
    'Hello AVENIX DIGITAL, I would like to discuss a website or mobile app project.',
  )}`;

  return (
    <footer className="bg-[#071426] text-slate-300 border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogo variant="dark" />
            </Link>
            <p className="text-sm font-medium text-[#60A5FA]">
              {content?.tagline || 'Ideas Into Digital Reality'}
            </p>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Modern websites and mobile applications engineered for small businesses, restaurants,
              startups, and growing companies.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Business &amp; Custom Websites
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Restaurant &amp; E-commerce Sites
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Portfolio &amp; Landing Pages
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Android &amp; Business Apps
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Website Starting Packages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${contact?.email || 'contact@avenixdigital.com'}`}
                  className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#60A5FA] shrink-0" />
                  <span className="truncate">{contact?.email || 'contact@avenixdigital.com'}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${(contact?.phone || '+91 9258915144').replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#60A5FA] shrink-0" />
                  <span className="font-mono-tabular">{contact?.phone || '+91 9258915144'}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#60A5FA] hover:text-white transition-colors font-medium"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  <span>WhatsApp Inquiry</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>

            {contact?.socialLinks && (
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                {contact.socialLinks.linkedin && (
                  <a
                    href={contact.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {contact.socialLinks.instagram && (
                  <a
                    href={contact.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {contact.socialLinks.twitter && (
                  <a
                    href={contact.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    X / Twitter
                  </a>
                )}
                {contact.socialLinks.github && (
                  <a
                    href={contact.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {content?.companyName || 'AVENIX DIGITAL'}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-white transition-colors">
              Request a Quote
            </Link>
            <Link to="/admin" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
