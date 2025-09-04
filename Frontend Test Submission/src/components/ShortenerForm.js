import React, { useState } from 'react';
import { TextField, Button, Box, Alert, Grid, Link, Typography } from '@mui/material';
import { shortenUrl } from '../api/api';

const ShortenerForm = () => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: 30, customShortcode: '' }]);
  const [shortenedLinks, setShortenedLinks] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newUrls = [...urls];
    newUrls[index][name] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: 30, customShortcode: '' }]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const validUrls = urls.filter(u => u.longUrl !== '');

    if (validUrls.length === 0) {
      setError('Please enter at least one URL.');
      return;
    }

    try {
      const results = await Promise.all(
        validUrls.map(async (url) => {
          if (!isValidUrl(url.longUrl)) {
            throw new Error(`Invalid URL: ${url.longUrl}`);
          }
          if (url.validity && isNaN(parseInt(url.validity))) {
            throw new Error('Validity must be a number.');
          }
          
          const payload = {
            longUrl: url.longUrl,
            validity: url.validity || 30, 
            customShortcode: url.customShortcode || undefined,
          };
          
          return shortenUrl(payload);
        })
      );
      setShortenedLinks(results);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please check your inputs.');
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        {urls.map((url, index) => (
          <Grid item xs={12} key={index}>
            <TextField
              fullWidth
              label="Original URL"
              name="longUrl"
              value={url.longUrl}
              onChange={(e) => handleInputChange(index, e)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Validity (in minutes)"
              name="validity"
              type="number"
              value={url.validity}
              onChange={(e) => handleInputChange(index, e)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              name="customShortcode"
              value={url.customShortcode}
              onChange={(e) => handleInputChange(index, e)}
              margin="normal"
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          {urls.length < 5 && (
            <Button variant="outlined" onClick={addUrlField} sx={{ mr: 2 }}>
              Add another URL
            </Button>
          )}
          <Button type="submit" variant="contained">
            Shorten URLs
          </Button>
        </Grid>
      </Grid>
      {shortenedLinks.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Shortened Links:</Typography>
          {shortenedLinks.map((link, index) => (
            <Alert severity="success" sx={{ mt: 1 }} key={index}>
              Original: **{link.originalUrl}** | Shortened: <Link href={link.shortUrl} target="_blank" rel="noopener noreferrer">{link.shortUrl}</Link> | Expires: **{new Date(link.expiry).toLocaleString()}**
            </Alert>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ShortenerForm;