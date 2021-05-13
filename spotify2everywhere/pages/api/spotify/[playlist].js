const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    try{
      spotifyApi.clientCredentialsGrant().then(async function (data) {
        global.token = data.body["access_token"];
        spotifyApi.setAccessToken(global.token);
        
        const { playlist } = req.query;
  
        try {
          const { body } = await spotifyApi.getPlaylist(playlist);
          const tracks = body.tracks.items.map(({ track: item }) => ({
            isrc: item.external_ids.isrc || "No ISRC",
            spotify_link: item.external_urls.spotify,
            name: item.name,
            id: item.id,
          }));
  
          res.status(200).json({
            error: false,
            status: 200,
            playlist: {
              description: body.description,
              tracks,
            },
          });
        } catch (er) {
          res.status(er.body.error.status).json({
            error: true,
            status: er.body.error.status,
            message: er.body.error.message,
          });
        }
      });
    }catch{
      res.status(500).json({
        error: true,
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
}
