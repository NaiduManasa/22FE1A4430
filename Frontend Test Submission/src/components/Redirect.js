import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOriginalUrl } from '../api/api';
import { CircularProgress, Box, Alert, Typography} from '@mui/material';

const Redirect = () => {
  const { shortcode } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOriginalUrl = async () => {
      try {
        const data = await getOriginalUrl(shortcode);
        window.location.href = data.originalUrl;
      } catch (err) {
        setError(err.message || 'Shortcode not found or invalid.');
      }
    };

    if (shortcode) {
      fetchOriginalUrl();
    }
  }, [shortcode]);

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>Redirecting you...</Typography>
    </Box>
  );
};

export default Redirect;