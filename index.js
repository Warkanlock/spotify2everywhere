const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
require("dotenv").config();

const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env['CLIENTID'],
  clientSecret: process.env['CLIENTSECRET'],
});

spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('Gained Access | Now you can go to http://localhost:3000/migrate/{playlist}');
    global.token = data.body['access_token']
    spotifyApi.setAccessToken(global.token);
})

app.use(express.json());

app.get("/migrate/:playlist", async (req, res, next) => {
  const { playlist } = req.params;
  const {body} = await spotifyApi.getPlaylist(playlist);

  const tracks = body.tracks.items.map( ({ track : item }) => ({
    isrc : item.external_ids.isrc || 'No ISRC',
    spotify_link : item.external_urls.spotify,
    name : item.name,
    id : item.id
  }))

  res.status(200).json({
    playlist : {
      description : body.description,
      tracks
    }
  })
})

app.listen(3000)
