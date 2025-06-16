import React from 'react';
import { Printer } from 'lucide-react';

const PrintReportButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-lg ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
      }`}
    >
      <Printer size={18} className="mr-2" />
      Print Report
    </button>
  );
};

export default PrintReportButton;
