/**
 * Utility functions for formatting and validating dates in the application
 */

/**
 * Format a date string to YYYY-MM-DD format for MySQL compatibility
 * 
 * @param {string} dateStr - The date string to format
 * @returns {string} - A MySQL compatible date string in YYYY-MM-DD format
 */
export const formatDateForMySQL = (dateStr) => {
  if (!dateStr) return "";
  
  try {
    // Case 1: Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Case 2: ISO format with time (2025-07-10T00:00:00.000Z)
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    
    // Case 3: Formatted display date like "10 Jul 2025"
    if (dateStr.includes(' ')) {
      const parts = dateStr.split(' ');
      // If it's in "DD MMM YYYY" format
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const monthMap = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
          'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        const month = monthMap[parts[1]];
        const year = parts[2];
        
        if (day && month && year) {
          return `${year}-${month}-${day}`;
        }
      }
    }
    
    // Case 4: Other formats - try to parse with Date object
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    // If all parsing attempts fail, return original string
    console.error('Could not format date:', dateStr);
    return dateStr;
  } catch (error) {
    console.error('Error formatting date for MySQL:', error);
    return dateStr;
  }
};

/**
 * Format a date for display to users (DD MMM YYYY)
 * 
 * @param {string} dateStr - The date string to format
 * @returns {string} - A human-friendly date string in DD MMM YYYY format
 */
export const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "";
  
  // Check if it's already in the desired display format
  if (typeof dateStr === 'string' && dateStr.match(/^\d{1,2} [A-Za-z]{3} \d{4}$/)) {
    return dateStr;
  }
  
  try {
    // Try to parse the date
    let date;
    if (dateStr.includes('T')) {
      // It's an ISO string
      const datePart = dateStr.split('T')[0];
      const [year, month, day] = datePart.split('-');
      date = new Date(year, month - 1, day);
    } else if (dateStr.includes('-')) {
      // It's already in YYYY-MM-DD format
      const [year, month, day] = dateStr.split('-');
      date = new Date(year, month - 1, day);
    } else {
      // Try to parse it as a regular date string
      date = new Date(dateStr);
    }
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return dateStr; // Return the original string if formatting fails
  }
};

/**
 * Converts various date formats to the YYYY-MM-DD format required by the date selector.
 * @param {string} dateStr - A date string in various possible formats
 * @returns {string} The date in YYYY-MM-DD format, or null if invalid
 */
export const normalizeToYYYYMMDD = (dateStr) => {
  if (!dateStr) return null;
  
  // Check if already in YYYY-MM-DD format
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (isoRegex.test(dateStr)) {
    return dateStr;
  }
  
  try {
    // Handle d M Y format (e.g., "10 Jul 2025")
    const dMyRegex = /^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/;
    const match = dateStr.match(dMyRegex);
    
    if (match) {
      // Parse date components
      const day = match[1].padStart(2, '0');
      const monthName = match[2];
      const year = match[3];
      
      // Convert month name to number
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
      
      if (monthIndex !== -1) {
        const month = (monthIndex + 1).toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    
    // As a fallback, use Date.parse() for other formats
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (error) {
    console.error(`Error normalizing date: ${dateStr}`, error);
  }
  
  return null;
};
