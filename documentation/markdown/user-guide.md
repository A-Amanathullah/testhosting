# RS-Express Bus Booking System - User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Public User Features](#public-user-features)
4. [Registered User Features](#registered-user-features)
5. [Admin Panel Guide](#admin-panel-guide)
6. [Agent Portal Guide](#agent-portal-guide)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

## Introduction

Welcome to the RS-Express Bus Booking System! This comprehensive guide will walk you through all the features and functionality available in the application. Whether you're a passenger looking to book tickets, an administrator managing the system, or an agent booking on behalf of customers, this guide has you covered.

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Device (desktop, laptop, tablet, or smartphone)

### Accessing the System
1. Open your web browser
2. Navigate to the RS-Express website
3. The home page displays the search form for finding available buses

### Account Types
- **Guest User**: Can search for buses and make bookings without registration
- **Registered User**: Can create an account to manage bookings and earn loyalty points
- **Agent**: Can book tickets on behalf of customers
- **Staff**: Can manage bookings and basic operations
- **Manager**: Can manage buses, routes, and view reports
- **Administrator**: Has full access to all system features

<div style="page-break-before: always;"></div>

## Public User Features

### Searching for Buses
1. On the homepage, locate the search form
2. Select your **departure location** from the dropdown menu
3. Select your **destination** from the dropdown menu
4. Choose your **travel date** using the date picker
5. Click the **Search** button
6. The system will display available buses matching your criteria

### Viewing Bus Details
1. From the search results, click on any bus to view details:
   - Departure and arrival times
   - Price
   - Bus type
   - Available seats
   - Amenities

### Booking as a Guest
1. After selecting a bus, click **Continue to Book**
2. On the seat selection page:
   - Choose your preferred seat(s) by clicking on the seat map
   - Selected seats will change color to indicate your selection
3. Click **Continue** to proceed
4. Fill in passenger details:
   - Full name
   - Email address
   - Phone number
   - Emergency contact (optional)
5. Review booking details
6. Click **Confirm Booking**
7. Complete payment process
8. Receive booking confirmation via email with e-ticket

### Registering a New Account
1. Click the **Sign Up** button in the navigation bar
2. Fill in the registration form:
   - Name
   - Email address
   - Password (min. 8 characters)
   - Confirm password
3. Click **Register**
4. Verify your email address by clicking the link sent to your email
5. Log in with your new credentials

<div style="page-break-before: always;"></div>

## Registered User Features

### Logging In
1. Click **Login** in the navigation bar
2. Enter your email and password
3. Click **Login**
4. You will be redirected to your passenger dashboard

### Passenger Dashboard
1. After login, access your dashboard by clicking **My Account** in the navigation bar
2. The dashboard displays:
   - Upcoming trips
   - Recent bookings
   - Loyalty points (if enrolled)
   - Account settings

### Managing Profile
1. From the dashboard, click **Profile Settings**
2. Update your personal information:
   - Name
   - Email
   - Phone number
   - Address (optional)
   - Profile picture (optional)
3. Click **Save Changes**

### Viewing Booking History
1. From the dashboard, click **Booking History**
2. View a list of all your past and upcoming bookings
3. Click on any booking to see detailed information
4. Download or print e-tickets as needed

### Managing Bookings
1. From the booking history page, find the booking you wish to manage
2. Options available:
   - **View Details**: See full booking information
   - **Cancel Booking**: Cancel the reservation (subject to cancellation policy)
   - **Change Seats**: Modify seat selection (if available)
   - **Print Ticket**: Download a PDF ticket for printing

<div style="page-break-before: always;"></div>

### Loyalty Program
1. Access the loyalty program by clicking **Loyalty Program** in the dashboard
2. View your current:
   - Points balance
   - Membership tier
   - Available rewards
   - Point history
3. Redeem points for:
   - Ticket discounts
   - Free tickets (with sufficient points)
   - Seat upgrades

## Admin Panel Guide

### Accessing Admin Panel
1. Log in with administrator credentials
2. You will automatically be directed to the admin dashboard
3. Alternatively, click **Admin** in the navigation menu after logging in

### Dashboard Overview
The admin dashboard provides at-a-glance information:
- Revenue statistics
- Recent bookings
- Upcoming trips
- System notifications
- Quick access links to main management sections

### Bus Management
1. From the admin panel, click **Buses**
2. View a list of all buses in the system
3. To add a new bus:
   - Click **Add New Bus**
   - Fill in the bus details:
     - Bus number
     - Bus type (e.g., Luxury, Standard)
     - Seat capacity
     - Amenities
   - Click **Save**
4. To edit an existing bus:
   - Click the **Edit** button next to the bus
   - Update the necessary information
   - Click **Save Changes**

<div style="page-break-before: always;"></div>

5. To delete a bus:
   - Click the **Delete** button
   - Confirm the deletion

### Route Management
1. From the admin panel, click **Routes**
2. View a list of all routes
3. To add a new route:
   - Click **Add New Route**
   - Enter route details:
     - Route name
     - Starting point
     - Destination
     - Distance
     - Estimated travel time
   - Click **Save**
4. To edit a route:
   - Click **Edit** next to the route
   - Update the information
   - Click **Save Changes**

### Trip Management
1. From the admin panel, click **Trips**
2. View a list of all scheduled trips
3. To add a new trip:
   - Click **Add New Trip**
   - Select the bus from the dropdown
   - Select the route from the dropdown
   - Set departure date and time
   - Set arrival time
   - Set ticket price
   - Click **Create Trip**
4. To edit a trip:
   - Click **Edit** next to the trip
   - Update the necessary information
   - Click **Save Changes**
5. To cancel a trip:
   - Click **Cancel Trip**
   - Provide reason for cancellation
   - The system will automatically notify all booked passengers

<div style="page-break-before: always;"></div>

### Booking Management
1. From the admin panel, click **Bookings**
2. View a list of all bookings
3. Filter bookings by:
   - Date range
   - Status (Confirmed, Cancelled, Completed)
   - Bus route
4. To view a booking:
   - Click on the booking ID
   - See detailed information including passenger details
5. To modify a booking:
   - Click **Edit** on the booking details page
   - Make necessary changes
   - Click **Save Changes**
6. To cancel a booking:
   - Click **Cancel Booking**
   - Select reason for cancellation
   - Process refund if applicable
   - Click **Confirm Cancellation**

### User Management
1. From the admin panel, click **Users**
2. View a list of all system users
3. To add a new user:
   - Click **Add User**
   - Fill in user details
   - Select user role (Admin, Staff, Manager, Agent, User)
   - Click **Create User**
4. To edit a user:
   - Click **Edit** next to the user
   - Update information or change role
   - Click **Save Changes**
5. To deactivate a user:
   - Click **Deactivate** next to the user
   - Confirm deactivation

### Reports
1. From the admin panel, click **Reports**
2. Select report type:
   - Revenue Report
   - Booking Statistics
   - Bus Utilization
   - Route Performance
   - Cancellation Analysis

<div style="page-break-before: always;"></div>

3. Set date range for the report
4. Click **Generate Report**
5. View the report or export it as CSV, PDF, or Excel

## Agent Portal Guide

### Accessing Agent Portal
1. Log in with agent credentials
2. You will be directed to the agent dashboard

### Creating Bookings for Customers
1. From the agent dashboard, click **New Booking**
2. Search for available buses using the search form
3. Select a bus from the results
4. Choose seats on the seat map
5. Enter passenger details:
   - Passenger name
   - Contact information
   - ID number (if required)
6. If the passenger is a loyalty member, enter their loyalty ID
7. Complete the booking and collect payment
8. The system will generate an e-ticket that can be printed or emailed to the customer

### Managing Customer Bookings
1. From the agent dashboard, click **Manage Bookings**
2. Search for a booking using:
   - Booking reference number
   - Passenger name
   - Travel date
3. Select the booking to view details
4. Options available:
   - Modify booking details
   - Change seats
   - Cancel booking
   - Print ticket

   <div style="page-break-before: always;"></div>

### Agent Reports
1. From the agent dashboard, click **My Reports**
2. View reports specific to your bookings:
   - Daily sales
   - Commission earned
   - Booking statistics
3. Filter reports by date range
4. Export reports as needed

## Troubleshooting

### Common Issues and Solutions

#### Login Problems
- **Issue**: Cannot log in despite correct credentials
  - **Solution**: Reset your password using the "Forgot Password" link
  
- **Issue**: Account locked
  - **Solution**: Contact system administrator or wait for the automatic unlock period

#### Booking Issues
- **Issue**: Cannot select seats
  - **Solution**: Refresh the page or try a different browser
  
- **Issue**: Payment not going through
  - **Solution**: Check internet connection, verify card details, or try an alternative payment method

#### E-ticket Problems
- **Issue**: Did not receive e-ticket email
  - **Solution**: Check spam folder or request a resend from the booking history page
  
- **Issue**: Cannot print e-ticket
  - **Solution**: Download the PDF first, then print from your device's PDF reader

<div style="page-break-before: always;"></div>

## FAQ

### General Questions

**Q: How early should I book my ticket?**
A: We recommend booking at least 24 hours in advance to ensure seat availability, especially during peak travel seasons.

**Q: Can I cancel my booking?**
A: Yes, bookings can be cancelled up to 4 hours before departure. Cancellation fees may apply depending on how close to departure you cancel.

**Q: How do I join the loyalty program?**
A: The loyalty program is automatically activated when you register an account. Points are earned with every booking.

### Technical Questions

**Q: Which browsers are supported?**
A: We support the latest versions of Chrome, Firefox, Safari, and Edge.

**Q: Is my payment information secure?**
A: Yes, we use industry-standard encryption and do not store your full card details on our servers.

**Q: Can I book multiple seats under one reservation?**
A: Yes, you can select multiple seats during the booking process and provide passenger details for each seat.
