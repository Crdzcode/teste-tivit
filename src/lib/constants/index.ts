export const API_BASE_URL = process.env.TIVIT_BASE_URL || 'https://api-onecloud.multicloud.tivit.com';

export const ENDPOINTS = {
  TOKEN: '/fake/token',
  HEALTH: '/fake/health',
  USER: '/fake/user',
  ADMIN: '/fake/admin',
};

export const SESSION_COOKIE_NAME = 'sid';
export const SESSION_ROLE_COOKIE_NAME = 'sid-role';
