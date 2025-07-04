// react-to-print wrapper for BookingTable
import React, { forwardRef } from 'react';
import BookingTable from './BookingTable';

const PrintableBookingTable = forwardRef((props, ref) => (
  <div ref={ref}>
    <BookingTable {...props} />
  </div>
));

export default PrintableBookingTable;
