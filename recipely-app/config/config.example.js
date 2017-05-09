import base64 from 'base-64';

// clarifai api keys
const CLIENT_ID = 'CLIENT_ID';
const CLIENT_SECRET = 'CLIENT_SECRET';

const auth = base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`);

export default auth;
