import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Rating,
  CircularProgress,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../context/AuthContext';

// Helper: format year-month e.g. "2025-05"
const formatYearMonth = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
};

// Group books by year-month key
const groupBooksByMonth = (books) => {
  return books.reduce((acc, book) => {
    const key = book.finishedDate ? book.finishedDate.slice(0, 7) : 'unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(book);
    return acc;
  }, {});
};

// Get number of books finished per month
const getMonthlyCounts = (grouped) =>
  Object.entries(grouped).map(([month, books]) => ({ month, count: books.length }));

const TimelinePage = () => {
  const { token, isAuthenticated } = useAuth();
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setError('You must be logged in to view reading history.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://bookbrust-server.onrender.com/api/history', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFinishedBooks(data);
      } catch (error) {
        setError(error.message || 'Failed to load reading history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const groupedBooks = groupBooksByMonth(finishedBooks);
  const monthlyCounts = getMonthlyCounts(groupedBooks);

  if (!isAuthenticated) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5" align="center" color="text.secondary">
          Please login to view your Timeline.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Reading Timeline
      </Typography>

      {/* Monthly Reading Habit Bar */}
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Monthly Reading Habit
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {monthlyCounts.length === 0 && (
            <Typography color="text.secondary">No finished books yet.</Typography>
          )}
          {monthlyCounts.map(({ month, count }) => (
            <Box
              key={month}
              sx={{
                width: 40,
                height: count * 10 + 10,
                backgroundColor: '#1976d2',
                borderRadius: 1,
                color: 'white',
                textAlign: 'center',
                fontSize: '0.75rem',
                cursor: 'default',
              }}
              title={`${month}: ${count} book${count > 1 ? 's' : ''} finished`}
            >
              {count}
            </Box>
          ))}
        </Box>
      </Box>

      <Divider />

      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" mt={3}>
          {error}
        </Typography>
      ) : (
        Object.entries(groupedBooks)
          .sort((a, b) => (a[0] > b[0] ? -1 : 1))
          .map(([month, books]) => (
            <Box key={month} mt={4}>
              <Typography variant="h5" gutterBottom>
                {formatYearMonth(month + '-01')}
              </Typography>

              {books.map((book) => (
                <Accordion key={book.id} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        variant="rounded"
                        src={book.thumbnail}
                        alt={book.title}
                        sx={{ width: 56, height: 80 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {book.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {book.authors?.join(', ')}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <Rating value={book.rating || 0} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            Finished: {new Date(book.finishedDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {book.notes || 'No review or notes.'}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))
      )}
    </Container>
  );
};

export default TimelinePage;
