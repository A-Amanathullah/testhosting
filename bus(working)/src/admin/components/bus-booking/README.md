# Bus Booking Admin Components

This directory contains components for managing bus bookings in the admin interface.

## Component Overview

- `BusBookingPage.jsx` - Main page for viewing and managing bookings
- `BookingTable.jsx` - Displays all bookings for a selected bus and date
- `BusSeatLayout.jsx` - Visual representation of bus seats with color-coded status
- `SeatLegend.jsx` - Legend explaining the color coding of seat statuses

## Seat Status Types

The system supports the following seat statuses in the seat color plan:

- **Available** (gray) - Seat is available for booking
- **Reserved** (red) - Seat has been booked and confirmed
- **Guest Booking** (blue) - Seat has been booked by a guest passenger
- **Processing** (green) - Booking is in progress but not confirmed
- **Frozen** (purple) - Seat has been frozen by admin and cannot be booked

**Important Note**: Cancelled seats are shown in the booking table but are not displayed with a special color in the seat layout. This matches the behavior in SeatPlanning.js where cancelled seats are treated as available for new bookings.

## Implementation Notes

### Seat Number Parsing

The system uses a common `parseSeatNumbers` helper function to ensure consistent parsing of seat numbers across all components:

```javascript
const parseSeatNumbers = (seatData) => {
  if (!seatData) return [];
  
  if (Array.isArray(seatData)) {
    return seatData.map(seat => {
      const num = parseInt(String(seat).replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? null : num;
    }).filter(Boolean);
  } 
  
  if (typeof seatData === "string") {
    return seatData.split(",").map(seat => {
      const num = parseInt(seat.replace(/[^0-9]/g, ''), 10);
      return isNaN(num) ? null : num;
    }).filter(Boolean);
  }
  
  return [];
};
```

This function handles seat numbers in various formats (arrays, strings, comma-separated values) and returns a clean array of seat numbers.

### Date Handling

All dates are normalized using the `normalizeToYYYYMMDD` function from `dateUtils.js` to ensure consistent date comparison regardless of the original format.

### Guest Booking Display

Guest bookings are displayed with a distinct blue color in the seat layout and are shown with "Guest" type in the booking table. The system is very flexible with guest booking matching to ensure they always appear when relevant:

- Guest bookings match if the bus number OR bus ID matches
- Date matching uses normalized date formats for consistency
- The booking table row for guest bookings has a light blue background for easy identification

### Seat Status Priority (Highest to Lowest)

1. Guest Bookings (blue)
2. Regular Bookings - Confirmed (red) or Processing (green)
3. Frozen Seats (purple)
4. Available (gray default)

Note: Cancelled bookings are shown in the table but don't affect the seat colors in the layout.

### Testing the Implementation

To test the seat status display:

1. Select a bus from the dropdown
2. Select a date with bookings
3. Verify that:
   - Guest bookings appear with blue color in the seat layout
   - Regular confirmed bookings appear with red color
   - Processing bookings appear with green color
   - Frozen seats appear with purple color
   - The booking table shows all booking types (including cancellations)
   - Guest bookings have a light blue background in the table

If issues are found, check the browser console for detailed debugging information. The system logs extensive details about seat status processing and booking filtering.
