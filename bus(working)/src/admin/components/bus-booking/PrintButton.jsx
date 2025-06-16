import React from 'react';
import { Printer } from 'lucide-react';

/**
 * Enhanced print button component with customizable label and styling
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.label - Button label text (defaults to "Print Report")
 * @param {string} props.className - Additional CSS classes
 */
const PrintButton = ({ onClick, disabled, label = 'Print Report', className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center px-4 py-2 text-white bg-red-800 rounded-lg ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
      } ${className}`}
      title="Print this report"
    >
      <Printer className="w-5 h-5 mr-2" />
      {label}
    </button>
  );
};

export default PrintButton;