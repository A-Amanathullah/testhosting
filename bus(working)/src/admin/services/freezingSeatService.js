// API service for frozen seats management

/**
 * Fetch all available buses
 * @returns {Promise<Array>} List of buses
 */
export const fetchBuses = async () => {
  // In a real application, this would be an API call
  return [
    { id: 1, busNumber: 'RS-1001' },
    { id: 2, busNumber: 'RS-1002' },
    { id: 3, busNumber: 'RS-1003' },
  ];
};

/**
 * Fetch bus schedules
 * @returns {Promise<Array>} List of schedules
 */
export const fetchSchedules = async () => {
  // In a real application, this would be an API call
  return [
    { 
      id: 1, 
      busId: 1,
      departureDate: '2025-05-10',
      departureTime: '08:30',
      fromLocation: 'Colombo',
      toLocation: 'Kandy',
    },
    { 
      id: 2, 
      busId: 2,
      departureDate: '2025-05-11',
      departureTime: '09:00',
      fromLocation: 'Colombo',
      toLocation: 'Kalmunai',
    },
    { 
      id: 3, 
      busId: 1,
      departureDate: '2025-05-12',
      departureTime: '10:30',
      fromLocation: 'Colombo',
      toLocation: 'Kandy',
    },
  ];
};

/**
 * Fetch seat status by bus and date
 * @param {number|string} busId - The bus ID
 * @param {string} date - The departure date
 * @returns {Promise<Object>} Seat status map
 */
export const fetchSeatStatus = async (busId, date) => {
  // In a real application, this would be an API call
  // For now, we're simulating with some static data
  
  // Default status map (all seats available)
  const statusMap = {};
  for (let i = 1; i <= 44; i++) {
    statusMap[i] = 'available';
  }
  
  // Add some predefined frozen/reserved seats
  if (busId === '1' && date === '2025-05-10') {
    statusMap[5] = 'freezed';
    statusMap[6] = 'freezed';
    statusMap[10] = 'reserved';
    statusMap[11] = 'reserved';
  } else if (busId === '2' && date === '2025-05-11') {
    statusMap[15] = 'freezed';
    statusMap[16] = 'freezed';
    statusMap[20] = 'reserved';
    statusMap[21] = 'reserved';
  }
  
  return statusMap;
};

/**
 * Fetch all frozen seats for a specific bus and date
 * @param {number|string} busId - The bus ID
 * @param {string} date - The departure date
 * @returns {Promise<Array>} List of frozen seats
 */
export const fetchFrozenSeats = async (busId, date) => {
  // In a real application, this would be an API call
  const allFrozenSeats = [
    {
      id: 1,
      busId: 1,
      date: '2025-05-10',
      seatNumbers: [5, 6],
      frozenBy: 'Admin User',
      reason: 'Reserved for VIP',
      frozenAt: '2025-05-01T10:00:00Z'
    },
    {
      id: 2,
      busId: 2,
      date: '2025-05-11',
      seatNumbers: [15, 16],
      frozenBy: 'Staff Manager',
      reason: 'Staff travel',
      frozenAt: '2025-05-02T09:30:00Z'
    }
  ];
  
  return allFrozenSeats.filter(seat => 
    seat.busId === parseInt(busId) && 
    seat.date === date
  );
};

/**
 * Freeze seats
 * @param {Object} data - The freezing data
 * @returns {Promise<Object>} Created frozen seat entry
 */
export const freezeSeats = async (data) => {
  // In a real application, this would be an API call
  // Here we're just returning the data with an ID as if it was saved
  return {
    ...data,
    id: Date.now(),
    frozenAt: new Date().toISOString()
  };
};

/**
 * Unfreeze seats by ID
 * @param {number|string} id - The frozen seat entry ID
 * @returns {Promise<boolean>} Success status
 */
export const unfreezeSeats = async (id) => {
  // In a real application, this would be an API call
  // Here we just return true to simulate success
  return true;
};