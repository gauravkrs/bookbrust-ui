const API_BASE_URL = 'https://bookbrust-server.onrender.com/api';

const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export const api = {
  // ─── Auth ─────────────────────────────────
  signup: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  login: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json(); // Expected: { token }
  },

  // ─── Books ────────────────────────────────────────────
  searchBooks: async (query, token) => {
    const res = await fetch(`${API_BASE_URL}/books/search?query=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  getBookshelf: async (token) => {
    const res = await fetch(`${API_BASE_URL}/books/shelf`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  addBookToBookshelf: async (book, token) => {
    const res = await fetch(`${API_BASE_URL}/books/books`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(book),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  setBookshelfTabPreference: async (tab, token) => {
    const res = await fetch(`${API_BASE_URL}/books/tab`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ tab }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  getBookDetails: async (googleBooksId, page = 1, limit = 10) => {
    const res = await fetch(`${API_BASE_URL}/books/${googleBooksId}?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  // ─── Reviews ──────────────────────────────────────────
  createReview: async (payload, token) => {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  // ─── Explore ──────────────────────────────────────────
  getTrendingBooks: async (genre) => {
    const url = `${API_BASE_URL}/explore/trending${genre ? `?genre=${genre}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  getRecentReviews: async (genre) => {
    const url = `${API_BASE_URL}/explore/recent-reviews${genre ? `?genre=${genre}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  getTopRatedBooks: async (genre) => {
    const url = `${API_BASE_URL}/explore/top-rated${genre ? `?genre=${genre}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  setExploreTabPreference: async (tab) => {
    const res = await fetch(`${API_BASE_URL}/explore/tab`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  // ─── Public Profile ───────────────────────────────────
  getPublicProfile: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/profile/${userId}`);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },

  // ─── Reading History ──────────────────────────────────
  getReadingHistory: async (token) => {
    const res = await fetch(`${API_BASE_URL}/history`, {
      headers: getAuthHeaders(token),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },
};
