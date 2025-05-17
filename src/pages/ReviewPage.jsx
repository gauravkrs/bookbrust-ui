import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Rating,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ReviewPage = ({ bookId, open, onClose, onSubmit, authorAlias }) => {
  const { token, isAuthenticated } = useAuth();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [recommend, setRecommend] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to submit a review.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      alert("Please provide a rating between 1 and 5 stars.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://bookbrust-server.onrender.com/api/reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          rating,
          content: reviewText,
          recommend,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert("Failed to submit review: " + (errorData.message || response.statusText));
      } else {
        alert("Review submitted successfully!");
        onSubmit({
          authorAlias,
          reviewText,
          rating,
          recommend,
          date: new Date(),
        });
        onClose();
        setRating(0);
        setRecommend(false);
        setReviewText("");
      }
    } catch (error) {
      alert("Error submitting review: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="write-review-title">
      <Box sx={style}>
        <Typography id="write-review-title" variant="h6" mb={2}>
          Write a Review
        </Typography>

        <Typography component="legend">Star Rating</Typography>
        <Rating
          name="star-rating"
          value={rating}
          onChange={(_, value) => setRating(value ?? 0)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Your Review"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          margin="normal"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={recommend}
              onChange={(e) => setRecommend(e.target.checked)}
            />
          }
          label="Would recommend?"
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReviewPage;
