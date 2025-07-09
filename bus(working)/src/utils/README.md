# Date Handling Utilities and Booking Services

## Date Utility Module

The `dateUtils.js` module contains utility functions for consistent date handling throughout the application. This addresses previous issues with MySQL compatibility and provides consistent date formatting for display.

### Functions:

- `formatDateForMySQL(dateStr)`: Formats any date string to YYYY-MM-DD format for MySQL compatibility.
- `formatDateForDisplay(dateStr)`: Formats any date string to DD MMM YYYY format for user-friendly display.

## Booking Services

### Regular User Bookings

The `bookingService.js` module handles all operations related to registered user bookings. It ensures proper date formatting for all API calls.

### Guest Bookings

The `guestBookingService.js` module encapsulates all guest booking operations with proper date handling:

- `createGuestBooking(bookingData)`: Creates a new guest booking with properly formatted dates.
- `updateGuestBooking(bookingId, bookingData)`: Updates an existing guest booking.
- `cancelGuestBooking(bookingId)`: Moves a guest booking to the cancellations table.
- `deleteGuestBooking(bookingId)`: Deletes a guest booking (typically used for abandoned temporary bookings).
- `getGuestBookings(busId, date)`: Retrieves guest bookings for a specific bus and date.
- `getAgentGuestBookings(agentId)`: Retrieves all bookings made by a specific agent.
- `getAvailableAgents()`: Lists all available agents for dropdown menus.

## Implementation Details

- All functions that accept a date parameter will automatically format the date for MySQL compatibility.
- All hooks and components have been updated to use these services instead of making direct API calls.
- The implementation provides consistent error handling and logging.
- Component code is now cleaner with the business logic extracted to service modules.

## Usage Guidelines

1. Always use `formatDateForMySQL()` before sending dates to the backend.
2. Always use `formatDateForDisplay()` when showing dates to users.
3. Use booking services instead of direct API calls to ensure consistent date handling.
4. All booking-related hooks now use these services internally.

This implementation ensures robust date handling and compatibility between frontend and backend components.
