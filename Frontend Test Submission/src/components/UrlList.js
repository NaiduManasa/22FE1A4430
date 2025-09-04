import React from 'react';
import { List, ListItem, ListItemText, Typography, Card, CardContent, Box} from '@mui/material';

const UrlList = ({ urls }) => {
  return (
    <List>
      {urls.map((url, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <ListItem disablePadding>
              <ListItemText
                primary={
                  <Typography variant="h6">
                    <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                      {url.shortUrl}
                    </a>
                  </Typography>
                }
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      Original URL: {url.originalUrl}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.secondary">
                      Clicks: {url.clicks || 0}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="text.secondary">
                      Created: {new Date(url.createdAt).toLocaleString()} | Expires: {new Date(url.expiry).toLocaleString()}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            { }
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Detailed Clicks:</Typography>
              {url.detailedClicks && url.detailedClicks.length > 0 ? (
                <List dense>
                  {url.detailedClicks.map((click, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={`Timestamp: ${new Date(click.timestamp).toLocaleString()}`}
                        secondary={`Source: ${click.source} | Location: ${click.location}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No detailed click data available.</Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </List>
  );
};

export default UrlList;