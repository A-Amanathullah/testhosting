/**
 * Utility functions for printing reports in the RS Express admin dashboard
 */

/**
 * Prepare and execute printing of report content
 * @param {React.RefObject} printRef - Reference to the printable element
 * @param {Function} beforePrint - Optional callback to execute before printing
 * @param {Function} afterPrint - Optional callback to execute after printing
 */
export const printReport = (printRef, beforePrint, afterPrint) => {
  if (!printRef?.current) return;
  
  // Focus the print area for better printing
  printRef.current.focus();
  
  // Execute before print callback if provided
  if (typeof beforePrint === 'function') {
    beforePrint();
  }
  
  // Execute print
  window.print();
  
  // Execute after print callback if provided
  if (typeof afterPrint === 'function') {
    afterPrint();
  }
};

/**
 * Format a date for display in reports
 * @param {string} dateString - The date string to format
 * @param {Object} options - Formatting options (same as toLocaleDateString options)
 * @returns {string} Formatted date string
 */
export const formatReportDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  const dateOptions = { ...defaultOptions, ...options };
  
  return new Date(dateString).toLocaleDateString('en-US', dateOptions);
};

/**
 * Format a number as currency with RS prefix
 * @param {number} amount - The amount to format
 * @param {string} prefix - The currency prefix, defaults to 'Rs '
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, prefix = 'Rs ') => {
  if (isNaN(amount)) return `${prefix}0`;
  return `${prefix}${amount.toLocaleString()}`;
};
