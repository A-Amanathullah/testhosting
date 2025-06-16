/**
 * Print PDF report directly
 * @param {Object[]} bookings - Array of booking objects
 * @param {string} busNumber - Bus number
 * @param {string} date - Departure date
 */
export const printBookingReport = (bookings, busNumber, date) => {
    const doc = generateBookingReport(bookings, busNumber, date);
    
    // Create a blob URL for the PDF
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    
    // Create an iframe to print the PDF
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    
    printFrame.onload = function() {
      setTimeout(() => {
        printFrame.contentWindow.print();
        // Clean up after printing
        setTimeout(() => {
          document.body.removeChild(printFrame);
          URL.revokeObjectURL(blobUrl);
        }, 100);
      }, 500);
    };
    
    document.body.appendChild(printFrame);
    printFrame.src = blobUrl;
  };