import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ExploreIcon from '@mui/icons-material/Explore';
import TimelineIcon from '@mui/icons-material/Timeline';

const features = [
  {
    icon: <LibraryBooksIcon fontSize="large" color="primary" />,
    title: 'Manage Your Bookshelf',
    description: 'Track books you’ve read, want to read, or are currently reading with notes and ratings.',
  },
  {
    icon: <RateReviewIcon fontSize="large" color="primary" />,
    title: 'Write & Share Reviews',
    description: 'Leave thoughtful reviews with ratings and recommendations. Discover what others are reading.',
  },
  {
    icon: <ExploreIcon fontSize="large" color="primary" />,
    title: 'Explore What’s Trending',
    description: 'Check out trending books, popular reviews, and what the community is reading.',
  },
  {
    icon: <TimelineIcon fontSize="large" color="primary" />,
    title: 'Reading Timeline',
    description: 'Visualize your reading history and revisit past books and reviews.',
  },
];

const BookCard = ({ icon, title, description }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
      textAlign: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
      },
      height: '100%',
      width: '25%',
      minWidth: '250px',
      maxWidth: '350px',
      boxSizing: 'border-box',
    }}
  >
    {icon}
    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
      {description}
    </Typography>
  </Box>
);

const FeatureCards = () => {
  return (
    <Grid
      container
      spacing={4}
      direction="row"
      alignItems="stretch"
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'hidden',
        overflowY: 'hidden',
        '& > *': {
          flex: '0 0 25%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        },
        paddingBottom: '0px',
        marginBottom: '0px',
        width: '100%',
        paddingLeft: '8%',
        paddingRight: '8%',
      }}
    >
      {features.map((feature, idx) => (
        <Grid item key={idx}>
          <BookCard {...feature} />
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureCards;
