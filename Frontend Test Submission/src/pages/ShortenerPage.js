import React, { useState } from 'react';
import { Container, Typography, Box, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import ShortenerForm from '../components/ShortenerForm';

const ShortenerPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Develop a React URL Shortener Web App
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Shorten up to 5 URLs concurrently and view their analytics.
        </Typography>
        <MuiLink component={Link} to="/stats" variant="button" sx={{ mt: 2 }}>
        View Statistics
        </MuiLink>
        <ShortenerForm />
      </Box>
    </Container>
  );
};

export default ShortenerPage;