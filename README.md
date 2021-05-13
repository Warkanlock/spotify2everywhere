# spotify2everywhere

Send your playlists to your favorite places, as a JSON file (for now)

## Setup
1. Grab credentials (CLIENTID and CLIENTSECRET) from the Spotify App Dashboard (https://developer.spotify.com/dashboard/applications/)
2. Create an ``.env`` file within that information

```
CLIENTID=
CLIENTSECRET=
```

## Usage 
1. Run the program using `` npm start ``
2. Enter your playlist into `` localhost:3000/migrate/{playlist_id} ``
3. Enjoy your playlist as a JSON file (for now)

## Plans
- [ ] Send as an email
- [ ] Setup a crono job to do it every Monday
- [ ] Setup a telegram bot to fetch this information
