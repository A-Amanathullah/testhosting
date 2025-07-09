

// List of all possible permissions for staff roles
export const PERMISSIONS = [
  { key: 'manage_users', label: 'Manage Users' },
  { key: 'view_reports', label: 'View Reports' },
  { key: 'edit_schedules', label: 'Edit Schedules' },
  { key: 'view_schedules', label: 'View Schedules' },
  { key: 'manage_routes', label: 'Manage Bus Routes' },
  { key: 'view_routes', label: 'View Bus Routes' },
  { key: 'book_seats', label: 'Book Seats' },
  { key: 'freeze_seats', label: 'Freeze Seats' },
  { key: 'manage_buses', label: 'Manage Buses' },
  { key: 'manage_loyalty', label: 'Manage Loyalty Program' },
  // Add more as needed
];

// Default permissions for each role
export const ROLE_DEFAULT_PERMISSIONS = {
  admin: [
    'manage_users',
    'view_reports',
    'edit_schedules',
    'view_schedules',
    'manage_routes',
    'view_routes',
    'book_seats',
    'freeze_seats',
    'manage_buses',
    'manage_loyalty',
  ],
  data_entry_operator: [
    'view_schedules',
    'view_routes',
  ],
  conductor: [
    'view_schedules',
    'view_routes',
    'book_seats',
  ],
};
