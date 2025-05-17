import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FeatureCards from '../components/FeatureCard';
import BookCard from '../components/BookCard';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrendingBooks = async () => {
    setLoading(true);
    try {
      const result = await api.getTrendingBooks(token);
      setBooks(result || []);
    } catch (err) {
      console.error('Failed to fetch trending books:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrendingBooks();
    }
  }, [isAuthenticated]);

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Typography variant="h2" align="center" gutterBottom fontWeight={700}>
          Welcome to BookBurst 📚
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" mb={6}>
          Discover, track, and share your reading journey with a vibrant community of book lovers.
        </Typography>

        {!isAuthenticated && (
          <>
            <Box display="flex" justifyContent="center" gap={3} mb={7}>
              <Button variant="contained" color="primary" size="large" onClick={() => navigate('/explore')}>
                Explore Books
              </Button>
              <Button variant="outlined" color="primary" size="large" onClick={() => navigate('/signup')}>
                Join Now
              </Button>
            </Box>
            <FeatureCards />
          </>
        )}

        {isAuthenticated && (
          <>
            <Typography variant="h4" fontWeight={600} mb={3}>
              Trending Books
            </Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" py={5}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {books.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" ml={2}>
                    No trending books found.
                  </Typography>
                ) : (
                  books.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.id}>
                      <BookCard
                        id={book.id}
                        title={book.title}
                        authors={book.authors}
                        description={book.description}
                        thumbnail={book.thumbnail}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
