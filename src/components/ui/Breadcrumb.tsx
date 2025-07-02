import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="breadcrumb" className={`mb-2 ${className}`}>
      <ol className="flex items-center text-sm">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <li className="mx-2 text-gray-400">
                <ChevronRight className="w-3 h-3" />
              </li>
            )}
            <li className={index === items.length - 1 ? "text-gray-700 font-medium" : "text-gray-500 hover:text-blue-600"}>
              {item.href && index !== items.length - 1 ? (
                <Link to={item.href} className="hover:text-blue-600 transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={index === items.length - 1 ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;