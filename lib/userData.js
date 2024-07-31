// lib/userData.js

import { getToken } from './authenticate'; 

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithAuth(url, options) {
  const token = await getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      'Authorization': `JWT ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 200) {
    return await res.json();
  } else {
    return [];
  }
}

export async function addToFavourites(id) {
  const url = `${apiUrl}/favourites/${id}`;
  return await fetchWithAuth(url, { method: 'PUT' });
}

export async function removeFromFavourites(id) {
  const url = `${apiUrl}/favourites/${id}`;
  return await fetchWithAuth(url, { method: 'DELETE' });
}

export async function getFavourites() {
  const url = `${apiUrl}/favourites`;
  return await fetchWithAuth(url, { method: 'GET' });
}

export async function addToHistory(id) {
  const url = `${apiUrl}/history/${id}`;
  return await fetchWithAuth(url, { method: 'PUT' });
}

export async function removeFromHistory(id) {
  const url = `${apiUrl}/history/${id}`;
  return await fetchWithAuth(url, { method: 'DELETE' });
}

export async function getHistory() {
  const url = `${apiUrl}/history`;
  return await fetchWithAuth(url, { method: 'GET' });
}
