import React from 'react';
import Breadcrumb from './Breadcrumb';
import { Button } from './Button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  breadcrumbItems: Array<{label: string; href?: string}>;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  filterButton?: boolean;
  onFilterToggle?: () => void;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbItems,
  actionLabel,
  actionIcon = <Plus className="w-4 h-4 mr-2" />,
  onAction,
  filterButton,
  onFilterToggle,
  children
}) => {
  return (
    <div className="w-full mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="w-full sm:flex-1">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-bold text-gray-800 font-lexend flex items-center">
            {title}
            {children}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {actionLabel && (
            <Button 
              onClick={onAction}
              className="flex items-center bg-blue-600 hover:bg-blue-700"
            >
              {actionIcon}
              <span>{actionLabel}</span>
            </Button>
          )}
          
          {filterButton && onFilterToggle && (
            <Button 
              variant="outline"
              onClick={onFilterToggle}
              className="p-2 border border-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;