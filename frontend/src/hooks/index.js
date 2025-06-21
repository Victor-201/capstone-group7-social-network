// Export all hooks organized by category

// Auth hooks
export * from './auth';

// User hooks  
export * from './user';

// Post hooks
export * from './posts';

// Friend hooks
export * from './friends';

// Search hooks
export * from './search';

// Chat hooks
export * from './chat';

// Notification hooks
export * from './notifications';

// Legacy hooks (keep for backward compatibility)
export { default as useClickOutside } from './useClickOutside';
export { default as useCloudinaryFile } from './useCloudinaryFile';
export { default as useLogout } from './useLogout'; // Simple logout without API call
export { default as useTimeAgo } from './useTimeAgo';
