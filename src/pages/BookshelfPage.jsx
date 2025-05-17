import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";

const statusLabels = {
    reading: 'Reading',
    finished: 'Finished',
    want_to_read: 'Want to Read',
};

const API_BASE_URL = 'https://bookbrust-server.onrender.com';

const BookshelfPage = () => {
    const { token, isAuthenticated } = useAuth();

    const [bookshelf, setBookshelf] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tab, setTab] = useState('reading');
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newBook, setNewBook] = useState({ status: 'want_to_read' });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || !token) return;
        fetchBookshelf();
    }, [isAuthenticated, token, tab]);

    const fetchBookshelf = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/books/shelf`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: tab },
            });
            setBookshelf(response.data || []);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load bookshelf.');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = async (_, newValue) => {
        setTab(newValue);
        try {
            await axios.post(
                `${API_BASE_URL}/api/books/tab`,
                { tab: newValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error('Failed to update tab preference:', err);
        }
    };

    const handleUpdateBook = async (updatedBook) => {
        try {
            await axios.patch(
                `${API_BASE_URL}/api/books/tab/${updatedBook.status}`,
                {
                    status: updatedBook.status,
                    rating: updatedBook.rating,
                    notes: updatedBook.notes,
                    finishedAt: updatedBook.status === 'finished' ? new Date().toISOString() : null,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBookshelf((prev) =>
                prev.map((b) => (b.googleBooksId === updatedBook.googleBooksId ? updatedBook : b))
            );
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to update book');
        }
    };

    const handleSearchBooks = async () => {
        if (!searchQuery.trim()) return;
        setSearchLoading(true);
        setSearchError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/books/search`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { query: searchQuery.trim() },
            });
            setSearchResults(response.data);
        } catch (err) {
            setSearchError(err.response?.data?.error || 'Failed to search books');
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleAddBook = async (book) => {
        if (!book.googleBooksId) {
            alert('googleBooksId is required to add a book.');
            return;
        }
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/books/books`,
                {
                    googleBooksId: book.googleBooksId,
                    status: book.status,
                    rating: book.rating,
                    notes: book.notes,
                    title: book.title,
                    authors: book.authors,
                    cover: book.cover,
                    description: book.description,
                    genres: book.genres || [],
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBookshelf((prev) => [...prev, response.data]);
            setAddModalOpen(false);
            setSearchResults([]);
            setSearchQuery('');
            setNewBook({ status: 'want_to_read' });
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add book');
        }
    };

    const validateGoogleBooksId = async (id) => {
        try {
            const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
            return res.status === 200;
        } catch {
            return false;
        }
    };

    const handleManualAdd = async () => {
        if (!newBook.googleBooksId || !newBook.title) {
            alert('Please provide Google Books ID and title');
            return;
        }
        const validId = await validateGoogleBooksId(newBook.googleBooksId);
        if (!validId) {
            alert('Invalid Google Books ID');
            return;
        }
        handleAddBook(newBook);
    };

    if (!isAuthenticated) {
        return (
            <Container sx={{ py: 8 }}>
                <Typography variant="h5" align="center" color="text.secondary">
                    Please login to view your Bookshelf.
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="xl">
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    Your Bookshelf
                </Typography>

                <Box display="flex" justifyContent="space-between" mb={3}>
                    <Tabs value={tab} onChange={handleTabChange}>
                        {Object.entries(statusLabels).map(([key, label]) => (
                            <Tab key={key} label={label} value={key} />
                        ))}
                    </Tabs>

                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddModalOpen(true)}>
                        Add Book
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : bookshelf.length === 0 ? (
                    <Typography color="text.secondary" ml={2}>
                        No books in this category.
                    </Typography>
                ) : (
                    <Grid container spacing={3}>
                        {bookshelf.map((book) => (
                            <Grid item xs={12} sm={6} md={4} key={book.googleBooksId}>
                                <BookCard
                                    {...book}
                                    isBookshelfView={true}
                                    onUpdate={(updatedBook) => handleUpdateBook(updatedBook)}
                                    showReviewButton={tab === 'finished'}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Dialog
                    open={addModalOpen}
                    onClose={() => {
                        setAddModalOpen(false);
                        setSearchResults([]);
                        setSearchQuery('');
                        setNewBook({ status: 'want_to_read' });
                    }}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Add a Book to Your Bookshelf</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1" gutterBottom>
                            Search by title or author:
                        </Typography>
                        <Box display="flex" gap={1} mb={2}>
                            <TextField
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search books..."
                            />
                            <Button onClick={handleSearchBooks} disabled={searchLoading}>
                                Search
                            </Button>
                        </Box>

                        {searchLoading && <Typography>Loading results...</Typography>}
                        {searchError && <Typography color="error">{searchError}</Typography>}

                        {searchResults.length > 0 && (
                            <Grid container spacing={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                {searchResults.map((result) => (
                                    <Grid item xs={12} sm={6} md={4} key={result.googleBooksId}>
                                        <Box
                                            border="1px solid #ccc"
                                            borderRadius={1}
                                            p={1}
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => handleAddBook(result)}
                                        >
                                            <Typography fontWeight={600}>{result.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {result.authors?.join(', ')}
                                            </Typography>
                                            {result.cover && (
                                                <img src={result.cover} alt={result.title} width="100%" />
                                            )}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        <Box mt={3}>
                            <Typography variant="subtitle1" gutterBottom>
                                Or add manually by Google Books ID:
                            </Typography>
                            <TextField
                                label="Google Books ID"
                                fullWidth
                                value={newBook.googleBooksId || ''}
                                onChange={(e) => setNewBook({ ...newBook, googleBooksId: e.target.value })}
                                margin="dense"
                            />
                            <TextField
                                label="Title"
                                fullWidth
                                value={newBook.title || ''}
                                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                margin="dense"
                            />
                            <TextField
                                label="Authors (comma separated)"
                                fullWidth
                                value={newBook.authors?.join(', ') || ''}
                                onChange={(e) =>
                                    setNewBook({ ...newBook, authors: e.target.value.split(',').map((a) => a.trim()) })
                                }
                                margin="dense"
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                minRows={3}
                                value={newBook.description || ''}
                                onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                                margin="dense"
                            />
                            <TextField
                                label="Cover Image URL"
                                fullWidth
                                value={newBook.cover || ''}
                                onChange={(e) => setNewBook({ ...newBook, cover: e.target.value })}
                                margin="dense"
                            />
                            <TextField
                                label="Status"
                                fullWidth
                                select
                                SelectProps={{ native: true }}
                                value={newBook.status}
                                onChange={(e) => setNewBook({ ...newBook, status: e.target.value })}
                                margin="dense"
                            >
                                {Object.entries(statusLabels).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </TextField>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleManualAdd}>
                            Add Book
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default BookshelfPage;
