import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@id": `https://typinghub.in${item.path}`,
        "name": item.label
      }
    }))
  };

  return (
    <>
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="breadcrumb">
        <ol>
          {items.map((item, index) => (
            <li key={item.path} className={item.isLast ? 'active' : ''}>
              {item.isLast ? (
                <span>{item.label}</span>
              ) : (
                <>
                  <Link to={item.path}>{item.label}</Link>
                  <span className="separator">/</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb; 