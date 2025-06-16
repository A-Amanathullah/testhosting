export const getToken = () => localStorage.getItem("token");
export const isAuthenticated = () => !!getToken();

// Utility to check if a user has a specific permission
export function hasPermission(user, permission) {
  if (!user) return false;
  // Combine role-based and custom permissions if needed
  const perms = Array.isArray(user.permissions) ? user.permissions : [];
  return perms.includes(permission);
}