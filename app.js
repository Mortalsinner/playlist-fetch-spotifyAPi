const express = require('express');
const request = require('request');
const crypto = require('crypto');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const httpServer = require('http-server');
const open = require('open');

const client_id = 'your_client_id'; // your clientId
const client_secret = 'your_client_secret'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString('hex').slice(0, length);
}

const stateKey = 'spotify_auth_state';
const app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = 'user-read-private user-read-email playlist-read-private user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true
    };

    console.log('Sending request to Spotify for token exchange...');

    request.post(authOptions, function(error, response, body) {
      if (error) {
        console.error('Error during token exchange:', error);
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      } else if (response.statusCode !== 200) {
        console.error('Non-200 response status during token exchange:', response.statusCode);
        console.error('Response body:', body);
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      } else {
        const access_token = body.access_token;
        const refresh_token = body.refresh_token;

        const options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(options, function(error, response, body) {
          if (error) {
            console.error('Error during profile fetch:', error);
          } else {
            console.log('Profile data:', body);
          }
        });

        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (error) {
      console.error('Error during token refresh:', error);
    } else if (response.statusCode !== 200) {
      console.error('Non-200 response status during token refresh:', response.statusCode);
      console.error('Response body:', body);
    } else {
      const access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

const port = 8888;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
  open(`http://localhost:${port}`);
});