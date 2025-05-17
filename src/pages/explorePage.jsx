import React, { useEffect, useState } from 'react';
import {
  Container, Tabs, Tab, Select, MenuItem, Typography, Box, Alert,
} from '@mui/material';
import Grid from "@mui/material/Grid";

import { getCookie, setCookie } from '../utlis/cookieUtils';
import BookCard from '../components/BookCard';
import ReviewCard from '../components/ReviewCard';

import {
  fetchTrendingBooks,
  fetchRecentReviews,
  fetchTopRatedBooks,
  updateExploreTabPreference,
} from '../api/exploreApi';

const ExplorePage = () => {
  const [tab, setTab] = useState(getCookie('exploreTab') || 'trending');
  const [genre, setGenre] = useState(getCookie('exploreGenre') || 'All');
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [tab, genre]);

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    setCookie('exploreTab', tab);
    setCookie('exploreGenre', genre);

    try {
      if (tab === 'trending') {
        const data = await fetchTrendingBooks(genre);
        setBooks(data);
        setReviews([]);
      } else if (tab === 'new-reviews') {
        const data = await fetchRecentReviews(genre);
        setReviews(data);
        setBooks([]);
      } else if (tab === 'top-rated') {
        const data = await fetchTopRatedBooks(genre);
        setBooks(data);
        setReviews([]);
      }

      await updateExploreTabPreference(tab);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      setBooks([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>Explore</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs value={tab} onChange={(_e, newVal) => setTab(newVal)}>
          <Tab label="Trending" value="trending" />
          <Tab label="New Reviews" value="new-reviews" />
          <Tab label="Top Rated" value="top-rated" />
        </Tabs>

        <Select value={genre} onChange={e => setGenre(e.target.value)}>
          <MenuItem value="All">All Genres</MenuItem>
          <MenuItem value="Fiction">Fiction</MenuItem>
          <MenuItem value="Fantasy">Fantasy</MenuItem>
          <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
          <MenuItem value="Mystery">Mystery</MenuItem>
          <MenuItem value="Romance">Romance</MenuItem>
        </Select>
      </Box>

      {loading && <Typography sx={{ mt: 2 }}>Loading...</Typography>}

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {tab === 'new-reviews' ? (
            reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <Grid item xs={12} md={6} key={idx}>
                  <ReviewCard review={review} />
                </Grid>
              ))
            ) : (
              <Typography sx={{ m: 2 }}>No recent reviews found.</Typography>
            )
          ) : (
            books.length > 0 ? (
              books.map((book, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <BookCard
                    id={book.googleBooksId}
                    title={book.title}
                    authors={book.authors}
                    description={book.description}
                    thumbnail={book.cover}
                    rating={book.rating ? Number(book.rating) : undefined}
                  />
                </Grid>
              ))
            ) : (
              <Typography sx={{ m: 2 }}>No books found.</Typography>
            )
          )}
        </Grid>
      )}
    </Container>
  );
};

export default ExplorePage;
