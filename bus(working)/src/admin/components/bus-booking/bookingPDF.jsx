import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#880000', // Dark red for RS Express branding
  },
  infoSection: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#880000', // Dark red for header
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  serialCol: { width: '10%' },
  nameCol: { width: '20%' },
  ticketsCol: { width: '8%' },
  seatsCol: { width: '20%' },
  paymentCol: { width: '10%' },
  routeCol: { width: '20%' },
  statusCol: { width: '12%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#888',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
});

// BookingPDF Component
const BookingPDF = ({ bookings, busNumber, departureDate, fromLocation, toLocation }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>RS Express - Booking Report</Text>
        
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Bus Number:</Text>
            <Text style={styles.value}>{busNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{new Date(departureDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Route:</Text>
            <Text style={styles.value}>{fromLocation} to {toLocation}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Bookings:</Text>
            <Text style={styles.value}>{bookings.length}</Text>
          </View>
        </View>
        
        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCell, styles.serialCol]}><Text>Serial No</Text></View>
            <View style={[styles.tableCell, styles.nameCol]}><Text>Name/Agent</Text></View>
            <View style={[styles.tableCell, styles.ticketsCol]}><Text>Tickets</Text></View>
            <View style={[styles.tableCell, styles.seatsCol]}><Text>Seat Numbers</Text></View>
            <View style={[styles.tableCell, styles.paymentCol]}><Text>Payment</Text></View>
            <View style={[styles.tableCell, styles.routeCol]}><Text>Route</Text></View>
            <View style={[styles.tableCell, styles.statusCol]}><Text>Status</Text></View>
          </View>
          
          {/* Table Body */}
          {bookings.map((booking) => (
            <View style={styles.tableRow} key={booking.id}>
              <View style={[styles.tableCell, styles.serialCol]}><Text>{booking.serialNo}</Text></View>
              <View style={[styles.tableCell, styles.nameCol]}><Text>{booking.name}</Text></View>
              <View style={[styles.tableCell, styles.ticketsCol]}><Text>{booking.ticketsReserved}</Text></View>
              <View style={[styles.tableCell, styles.seatsCol]}><Text>{booking.seatNumbers}</Text></View>
              <View style={[styles.tableCell, styles.paymentCol]}><Text>{booking.paymentStatus}</Text></View>
              <View style={[styles.tableCell, styles.routeCol]}><Text>{booking.route}</Text></View>
              <View style={[styles.tableCell, styles.statusCol]}><Text>{booking.status}</Text></View>
            </View>
          ))}
        </View>
        
        {/* Footer */}
        <Text style={styles.footer}>
          RS Express © {new Date().getFullYear()} | Generated on: {new Date().toLocaleString()}
        </Text>
      </Page>
    </Document>
  );
};

export default BookingPDF;