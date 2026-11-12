import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '', onClick }) => {
  const variantStyles = {
    gray: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    brown: 'bg-[#f4eeee] text-[#785b5b] dark:bg-[#342828] dark:text-[#d3b6b6]',
    orange: 'bg-[#faebd7] text-[#9a5b2d] dark:bg-[#3d2719] dark:text-[#f4ba96]',
    yellow: 'bg-[#fdf3d8] text-[#89632a] dark:bg-[#3d3119] dark:text-[#f3d386]',
    green: 'bg-[#edf6ee] text-[#2e683b] dark:bg-[#1a3320] dark:text-[#8bd99b]',
    blue: 'bg-[#e8f3fa] text-[#205b82] dark:bg-[#192b3a] dark:text-[#8ac5ec]',
    purple: 'bg-[#f4eff9] text-[#5e3c88] dark:bg-[#2b1f3d] dark:text-[#cfaee9]',
    pink: 'bg-[#fbf0f4] text-[#863862] dark:bg-[#3d1d2e] dark:text-[#f2a9cc]',
    red: 'bg-[#fdebee] text-[#932f38] dark:bg-[#3e1b1f] dark:text-[#f49ba3]',
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-colors ${variantStyles[variant]} ${className} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
    >
      {children}
    </span>
  );
};

export const getStatusBadgeVariant = (status: string): 'gray' | 'orange' | 'green' | 'red' | 'blue' | 'yellow' => {
  const s = status.toLowerCase();
  if (s.includes('offer') || s.includes('terima') || s.includes('lolos')) return 'green';
  if (s.includes('interview') || s.includes('wawancara')) return 'yellow';
  if (s.includes('reject') || s.includes('tolak')) return 'red';
  if (s.includes('applied') || s.includes('kirim') || s.includes('tunggu')) return 'blue';
  return 'gray';
};
