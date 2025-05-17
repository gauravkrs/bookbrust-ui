import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const BookCard = ({
  googleBooksId,
  title,
  authors,
  description,
  cover,
  status,
  rating,
  notes,
  onUpdate,
  isBookshelfView = false,
  showReviewButton = false,
}) => {
  const { isAuthenticated } = useAuth();
  const [newStatus, setNewStatus] = useState(status);
  // Note: setIsReviewModalOpen is missing in original code - assumed removed or to be added elsewhere

  const handleStatusChange = (e) => {
    const val = e.target.value; // no casting needed
    setNewStatus(val);
  };

  const handleUpdateStatus = () => {
    if (!isAuthenticated) {
      alert("You must be logged in to change the book status.");
      return;
    }

    if (onUpdate && newStatus !== status) {
      onUpdate({ status: newStatus });
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        gap: 1.5,
      }}
    >
      {cover && (
        <Box
          component="img"
          src={cover}
          alt={title}
          sx={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            borderRadius: 1,
            mb: 2,
            flexShrink: 0,
          }}
        />
      )}

      <Typography variant="h6" fontWeight={700} gutterBottom>
        {title}
      </Typography>

      {authors && (
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          {authors}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </Typography>
      )}

      {rating !== undefined && (
        <Typography variant="body2" color="primary" mb={1}>
          Rating: {rating} / 5
        </Typography>
      )}

      {notes && (
        <Typography variant="body2" color="text.secondary" mb={2}>
          Notes: {notes}
        </Typography>
      )}

      <>
        {showReviewButton && status === "finished" && isAuthenticated && (
          <Button variant="outlined" color="primary" sx={{ mb: 1 }}>
            Write a Review
          </Button>
        )}

        {status !== "finished" && isAuthenticated && isBookshelfView && (
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ mb: 1 }}>
              <InputLabel id={`status-select-label-${googleBooksId}`}>
                Change Status
              </InputLabel>
              <Select
                labelId={`status-select-label-${googleBooksId}`}
                value={newStatus}
                label="Change Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="reading">Reading</MenuItem>
                <MenuItem value="finished">Finished</MenuItem>
                <MenuItem value="want_to_read">Want to Read</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleUpdateStatus}
              disabled={newStatus === status}
              fullWidth
            >
              Update Status
            </Button>
          </Box>
        )}
      </>
    </Box>
  );
};

export default BookCard;
