const DB_KEY = 'urlShortenerDb';

const generateShortcode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const loadDb = () => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

const saveDb = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const shortenUrl = async (data) => {
  await simulateNetworkDelay();

  const { longUrl, validity, customShortcode } = data;
  const db = loadDb();

  let shortcode = customShortcode;
  if (shortcode) {
    if (db.some(item => item.shortcode === shortcode)) {
      throw new Error('This custom shortcode is already in use.');
    }
  } else {
    do {
      shortcode = generateShortcode();
    } while (db.some(item => item.shortcode === shortcode));
  }

  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + (validity || 30));

  const newUrl = {
    shortUrl: `http://localhost:3000/${shortcode}`,
    originalUrl: longUrl,
    shortcode: shortcode,
    createdAt: new Date(),
    expiry: expiry,
    clicks: 0,
    detailedClicks: []
  };

  db.push(newUrl);
  saveDb(db);

  return {
    shortUrl: newUrl.shortUrl,
    originalUrl: newUrl.originalUrl,
    expiry: newUrl.expiry.toISOString()
  };
};

export const getStats = async () => {
  await simulateNetworkDelay();
  return loadDb();
};

export const getOriginalUrl = async (shortcode) => {
  await simulateNetworkDelay();
  const db = loadDb();
  const item = db.find(url => url.shortcode === shortcode);

  if (!item) {
    throw new Error('Shortcode not found.');
  }

  item.clicks += 1;
  item.detailedClicks.push({
    timestamp: new Date().toISOString(),
    source: 'Direct',
    location: 'Coarse-grained location'
  });
  saveDb(db);

  return { originalUrl: item.originalUrl };
};
