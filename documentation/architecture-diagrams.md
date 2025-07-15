# RS-Express Bus Booking System - Architecture Diagrams

## System Components Diagram
```
+---------------------+       +---------------------+
|                     |       |                     |
|    React Frontend   |<----->|   Laravel Backend   |
|                     |       |                     |
+----------+----------+       +----------+----------+
           ^                             ^
           |                             |
           v                             v
+---------------------+       +---------------------+
|                     |       |                     |
| Client-Side Storage |       |    MySQL Database   |
| (localStorage)      |       |                     |
|                     |       |                     |
+---------------------+       +---------------------+
```

## Frontend Component Hierarchy
```
App.js
├── AuthContext
├── PermissionsContext
├── Navbar
│   ├── UserProfileDropdown
│   └── ResponsiveMenu
├── Public Routes
│   ├── HomePage
│   │   └── SearchForm
│   ├── Login
│   ├── SignUp
│   ├── BusList
│   │   └── BusCard (multiple)
│   └── SeatBooking
│       ├── SeatMap
│       └── BookingForm
└── Protected Routes
    ├── PrivateRoute (wrapper)
    ├── PassengerDashboard
    │   ├── BookingHistory
    │   └── UserProfile
    └── AdminRoutes
        ├── DashboardPage
        │   ├── RevenueStats
        │   └── BookingSummary
        ├── BusManagement
        │   ├── BusRegisterPage
        │   └── BusRoutePage
        ├── BookingManagement
        │   ├── BookingListPage
        │   └── CancellationsPage
        └── UserManagement
            └── UserListPage
```

## Backend Structure
```
Laravel Application
├── Routes
│   ├── api.php
│   ├── web.php
│   └── auth.php
├── Controllers
│   ├── AuthController
│   ├── BookingController
│   ├── BusController
│   └── UserController
├── Models
│   ├── User
│   ├── Booking
│   ├── BusRegister
│   ├── BusRoute
│   └── BusTrip
├── Middleware
│   ├── Authenticate
│   └── CheckRole
└── Services
    ├── BookingService
    └── LoyaltyService
```

## Database Schema
```
+---------------+       +---------------+
| Users         |       | LoyaltyMembers|
|---------------|       |---------------|
| id            |       | id            |
| name          |       | user_id       |
| email         |------>| points        |
| password      |       | status        |
| role          |       | created_at    |
| created_at    |       | updated_at    |
+---------------+       +---------------+
       |
       |                +---------------+
       |                | BusRegister   |
       |                |---------------|
       |                | id            |
       |                | bus_no        |
       |                | bus_type      |
       |                | seat_capacity |
       |                | status        |
       |                +------+--------+
       |                       |
       |                       |
+------v--------+     +--------v-------+
| Bookings      |     | BusTrip        |
|---------------|     |----------------|
| id            |     | id             |
| user_id       |     | bus_id         |
| bus_id        |<----| route_id       |
| seat_no       |     | departure_date |
| price         |     | departure_time |
| status        |     | arrival_time   |
| created_at    |     | price          |
+---------------+     | available_seats|
                      +--------+-------+
                               |
                      +--------v-------+
                      | BusRoute       |
                      |----------------|
                      | id             |
                      | route_name     |
                      | start_point    |
                      | end_point      |
                      | distance       |
                      +----------------+
```

## Authentication Flow
```
+----------+    1. Login Request    +----------+
|          |--------------------->  |          |
|  React   |                        | Laravel  |
|  Client  |    2. Auth Token       |  API     |
|          |  <--------------------  |          |
+----+-----+                        +----------+
     |                                   |
     |  3. Store Token                   | 4. Validate Token
     v                                   v
+----------+                        +----------+
|          |                        |          |
| Browser  |                        | Database |
| Storage  |                        |          |
|          |                        |          |
+----------+                        +----------+
```

## Booking Process Flow
```
User                  Frontend                Backend                Database
 |                       |                       |                       |
 | Search for buses      |                       |                       |
 |---------------------> |                       |                       |
 |                       | API Request           |                       |
 |                       |---------------------->|                       |
 |                       |                       | Query available buses |
 |                       |                       |---------------------->|
 |                       |                       |                       |
 |                       |                       | Return results        |
 |                       |                       |<----------------------|
 |                       | Display results       |                       |
 |                       |<----------------------|                       |
 | Select bus            |                       |                       |
 |---------------------> |                       |                       |
 |                       | Navigate to seat map  |                       |
 |                       |---------------------->|                       |
 |                       |                       | Get available seats   |
 |                       |                       |---------------------->|
 |                       |                       |                       |
 |                       | Display seat map      |                       |
 |<---------------------|                        |                       |
 | Select seat(s)        |                       |                       |
 |---------------------> |                       |                       |
 | Enter passenger info  |                       |                       |
 |---------------------> |                       |                       |
 |                       | Create booking request|                       |
 |                       |---------------------->|                       |
 |                       |                       | Begin transaction     |
 |                       |                       |---------------------->|
 |                       |                       | Lock seats            |
 |                       |                       |---------------------->|
 |                       |                       | Create booking        |
 |                       |                       |---------------------->|
 |                       |                       | Update seat inventory |
 |                       |                       |---------------------->|
 |                       |                       | Commit transaction    |
 |                       |                       |---------------------->|
 |                       | Booking confirmation  |                       |
 |<---------------------|<----------------------|                        |
 | View ticket           |                       |                       |
 |---------------------> |                       |                       |
 |                       |                       |                       |
```

## Permission System
```
+-----------------+     +-----------------+     +-----------------+
|                 |     |                 |     |                 |
|  User Login     |---->|  Load User Role |---->| Fetch Role      |
|                 |     |                 |     | Permissions     |
+-----------------+     +-----------------+     +-----------------+
                                                       |
                                                       v
+-----------------+     +-----------------+     +-----------------+
|                 |     |                 |     |                 |
|  Store in       |<----| Apply Permission|<----| Process         |
|  Context        |     | Check Results   |     | Permission Data |
|                 |     |                 |     |                 |
+-----------------+     +-----------------+     +-----------------+
        |
        v
+-----------------------------------------------+
|                                               |
| Permission Usage Throughout Application       |
|                                               |
| +---------------+     +------------------+    |
| |               |     |                  |    |
| | Route Access  |     | UI Element       |    |
| | Control       |     | Visibility       |    |
| |               |     |                  |    |
| +---------------+     +------------------+    |
|                                               |
| +---------------+     +------------------+    |
| |               |     |                  |    |
| | API Call      |     | Feature          |    |
| | Authorization |     | Availability     |    |
| |               |     |                  |    |
| +---------------+     +------------------+    |
|                                               |
+-----------------------------------------------+
```
