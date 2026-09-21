import type { Configuration, PopupRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'PENDIENTE_CLIENT_ID', // Aquí irá (client) ID
    authority: 'https://login.microsoftonline.com/common', // O tu Directory (tenant) ID
    redirectUri: 'http://localhost:5173/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

export const loginRequest: PopupRequest = {
  scopes: ['User.Read'],
};