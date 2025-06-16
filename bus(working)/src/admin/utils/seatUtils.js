/**
 * Get status class for a seat based on its status
 * @param {string} status - The seat status (available, reserved, processing, freezed)
 * @returns {string} CSS class name
 */
export const getSeatStatusClass = (status) => {
    switch (status) {
      case 'reserved':
        return 'bg-red-500 text-white';
      case 'processing':
        return 'bg-green-500 text-white';
      case 'freezed':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };
  
  /**
   * Parse seat numbers from a comma-separated string
   * @param {string} seatString - Comma separated seat numbers (e.g. "1, 2, 3")
   * @returns {number[]} Array of seat numbers
   */
  export const parseSeatNumbers = (seatString) => {
    if (!seatString) return [];
    return seatString.split(',').map(seat => parseInt(seat.trim())).filter(Boolean);
  };
  
  /**
   * Format an array of seat numbers as a comma-separated string
   * @param {number[]} seatArray - Array of seat numbers
   * @returns {string} Formatted string
   */
  export const formatSeatNumbers = (seatArray) => {
    if (!seatArray || !seatArray.length) return '';
    return seatArray.join(', ');
  };