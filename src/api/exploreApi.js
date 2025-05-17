export async function fetchTrendingBooks(genre) {
  const url = `https://bookbrust-server.onrender.com/api/explore/trending${genre && genre !== 'All' ? `?genre=${encodeURIComponent(genre)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch trending books');
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map(item => ({
    ...item,
    authors: typeof item.authors === 'string' ? JSON.parse(item.authors) : item.authors,
    genres: typeof item.genres === 'string' ? JSON.parse(item.genres) : item.genres,
  }));
}

export async function fetchRecentReviews(genre) {
  const url = `https://bookbrust-server.onrender.com/api/explore/recent-reviews${genre && genre !== 'All' ? `?genre=${encodeURIComponent(genre)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch recent reviews');
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return [];
  return data;
}

export async function fetchTopRatedBooks(genre) {
  const url = `https://bookbrust-server.onrender.com/api/explore/top-rated${genre && genre !== 'All' ? `?genre=${encodeURIComponent(genre)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch top-rated books');
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return [];
  return data.map(item => ({
    ...item,
    authors: typeof item.authors === 'string' ? JSON.parse(item.authors) : item.authors,
    genres: typeof item.genres === 'string' ? JSON.parse(item.genres) : item.genres,
  }));
}

export async function updateExploreTabPreference(tab) {
  const res = await fetch('https://bookbrust-server.onrender.com/api/explore/tab', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tab }),
  });
  if (!res.ok) throw new Error('Failed to update tab preference');
  return res.json();
}
