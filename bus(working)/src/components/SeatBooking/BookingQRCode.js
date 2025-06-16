import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '10px', // Add padding for small screens
};

const BookingQRCode = ({ bookingDetails, onCancel }) => {
  const qrRef = useRef();
  const navigate = useNavigate();

  const handleDownloadPDF = async () => {
    const input = qrRef.current;
    const canvas = await html2canvas(input, { scale: 3, backgroundColor: '#fff' });
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = 300;
    const pdfHeight = 400;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [pdfWidth, pdfHeight] });
    const imgWidth = 260;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save('booking_qr.pdf');
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    navigate('/passengerdash');
  };

  // Responsive styles
  const cardStyle = {
    background: '#fff',
    borderRadius: 12,
    padding: 16,
    minWidth: 0,
    width: '100%',
    maxWidth: 370,
    minHeight: 320,
    boxShadow: '0 2px 16px #333',
    position: 'relative',
    textAlign: 'center',
    margin: '0 auto',
  };
  const qrBlockStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 8px #ccc',
    margin: '0 auto',
    minWidth: 0,
    width: '100%',
    maxWidth: 260,
  };
  const detailsStyle = {
    marginTop: 20,
    textAlign: 'center',
    minWidth: 0,
    width: '100%',
    wordBreak: 'break-word',
  };
  const btnGroupStyle = {
    marginTop: 24,
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
    flexWrap: 'wrap',
  };
  const btnStyle = {
    padding: '10px 20px',
    fontSize: 16,
    borderRadius: 5,
    background: '#007bff',
    color: '#fff',
    border: 'none',
    marginBottom: 8,
    minWidth: 120,
    width: 'auto',
    flex: 1,
    maxWidth: 180,
  };
  const cancelBtnStyle = {
    ...btnStyle,
    background: '#ccc',
    color: '#333',
  };

  return (
    <div style={modalStyle}>
      <div style={cardStyle}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Booking QR Code</h2>
        <div ref={qrRef} style={qrBlockStyle}>
          <QRCodeCanvas value={JSON.stringify(bookingDetails)} size={180} />
          <div style={detailsStyle}>
            <p><strong>Bus:</strong> {bookingDetails.busName}</p>
            <p><strong>Seat:</strong> {bookingDetails.seatNumbers?.join(', ')}</p>
            <p><strong>Pickup:</strong> {bookingDetails.pickup}</p>
            <p><strong>Drop:</strong> {bookingDetails.drop}</p>
            <p><strong>Price:</strong> {bookingDetails.price}</p>
            <p><strong>Date:</strong> {bookingDetails.date}</p>
          </div>
        </div>
        <div style={btnGroupStyle}>
          <button onClick={handleDownloadPDF} style={btnStyle}>
            Download as PDF
          </button>
          <button onClick={handleCancel} style={cancelBtnStyle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingQRCode;
