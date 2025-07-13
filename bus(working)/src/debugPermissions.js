// Copy and paste this code into your browser console to debug permissions

function debugPermissions() {
  console.log('===== Permission Debugging Tool =====');
  
  // Check if user is logged in
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found. User is not logged in.');
    return;
  }
  
  console.log('Authentication token exists.');
  
  // Make a request to get the current user
  fetch('http://localhost:8000/api/user', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(userData => {
    console.log('Current user:', userData);
    console.log('User role:', userData.role);
    
    // Now get permissions for this role
    fetch(`http://localhost:8000/api/role-permissions/${userData.role}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(permData => {
      console.log('Permission response:', permData);
      
      if (permData.status === 'success' && permData.data) {
        const hasPermissions = Object.keys(permData.data).length > 0;
        console.log('User has permissions:', hasPermissions);
        console.log('Should redirect to admin:', hasPermissions ? 'YES' : 'NO');
      } else {
        console.log('No permissions data found or invalid format');
      }
    })
    .catch(err => {
      console.error('Error fetching permissions:', err);
    });
  })
  .catch(err => {
    console.error('Error fetching user data:', err);
  });
}

// Run the debug function
debugPermissions();
