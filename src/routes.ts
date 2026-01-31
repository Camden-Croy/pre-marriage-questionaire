// Public routes that don't require authentication
export const publicRoutes = ["/login", "/unauthorized"];

// Auth routes (login, signup, etc.)
export const authRoutes = ["/login"];

// Default redirect for unauthenticated users
export const DEFAULT_LOGIN_REDIRECT = "/login";

// Default redirect after successful auth
export const DEFAULT_DASHBOARD_REDIRECT = "/";

// Redirect for unauthorized (not whitelisted) users
export const UNAUTHORIZED_REDIRECT = "/unauthorized";
