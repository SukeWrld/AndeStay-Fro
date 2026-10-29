import type { Configuration, PopupRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '06deb214-41c9-463e-b1c0-21fcdd1a5646', // Aquí irá (client) ID
    authority: 'https://login.microsoftonline.com/48a62c77-6f59-4f76-a89e-216fb269e623',
    redirectUri: 'http://localhost:5173/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

export const loginRequest: PopupRequest = {
  scopes: import.meta.env.VITE_API_SCOPE ? [import.meta.env.VITE_API_SCOPE] : [],
};