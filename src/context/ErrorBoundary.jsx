import React from 'react';
import { Typography } from '@mui/material';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <Typography variant="h6" color="error">Something went wrong.</Typography>;
    }

    return this.props.children;
  }
}
