import { Card, CardContent, Typography } from '@mui/material';

const ReviewCard = ({ review }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{review.bookTitle}</Typography>
      <Typography variant="body2">By {review.alias} - {review.rating}★</Typography>
      <Typography variant="body1">{review.content}</Typography>
    </CardContent>
  </Card>
);

export default ReviewCard;
