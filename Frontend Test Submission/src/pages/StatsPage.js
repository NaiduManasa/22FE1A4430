import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { getStats } from '../api/api';
import UrlList from '../components/UrlList';

const StatsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          URL Shortener Statistics
        </Typography>
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && stats.length > 0 && <UrlList urls={stats} />}
        {!loading && !error && stats.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>No shortened URLs found. Go to the home page to create one.</Alert>
        )}
      </Box>
    </Container>
  );
};

export default StatsPage;