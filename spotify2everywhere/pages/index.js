import Head from "next/head";
import { useState } from "react";
import styles from "../styles/Home.module.css";

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeError, setError] = useState({ error: false, message: "" });
  const [tracks, setTracks] = useState(null);
  const [playlistDescription, setPlaylistDescription] = useState("");

  const playlistFetcher = (playlistId) => {
    let cleanId = playlistId;

    if (validURL(cleanId)) {
      const cleanUrl = new URL(cleanId);
      console.log(cleanUrl)
      if(cleanUrl.host === "open.spotify.com"){
        cleanId = cleanUrl.pathname.replace("/playlist/", "");
      }else{
        setError({error:true, message:"Use a real link, c'mon!"})
      }
    }
    return fetch(`/api/spotify/${cleanId}`).then((res) => res.json());
  };

  const searchSongs = async (event) => {
    event.preventDefault();

    if (searchQuery.length > 0) {
      const response = await playlistFetcher(`${searchQuery}`);
      if (response.error) {
        setError(response);
      } else {
        setError({ error: false, message: "", status: 200 });
        setTracks(response.playlist.tracks);
        setPlaylistDescription(response.playlist.description)
      }
    }
  };

  const downloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(tracks));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      playlistDescription + new Date().toISOString() + ".json"
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (activeError.error) {
    return (
      <div className={styles.container}>
        <Head>
          <title>spotify2everywhere</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h2>There was an error using this page: {activeError.message}</h2>
          <div
            onClick={() =>
              setError({ error: false, message: "", status: null })
            }
          >
            Go back
          </div>
        </main>

        <footer className={styles.footer}>Made by Ignacio Brasca</footer>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>spotify2everywhere</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {tracks ? (
        <main className={styles.main}>
          <input
            type="button"
            className={styles.centerItem}
            onClick={() => {
              downloadJson();
            }}
            value="Download as a JSON file"
          />
          <div
            className={styles.centerItemBack}
            onClick={() =>{
              setError({ error: false, message: "", status: null })
              setTracks(null)
            }
            }
          >
            Go back
          </div>
          <div className={styles.trackList}>
            {tracks.map((track) => {
              return (
                <div key={track.isrc}>
                  <div className={styles.trackItem}>
                    <h2>{track.name}</h2>
                    <h2>{track.isrc}</h2>
                    <a href={track.spotify_link}>Go to track on Spotify!</a>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      ) : (
        <main className={styles.main}>
          <h2>Insert a playlist id...</h2>
          <form onSubmit={searchSongs}>
            <input
              required
              type="text"
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <input
              type="submit"
              value="Search!"
              className={styles.buttonSearch}
            />
          </form>
        </main>
      )}

      <footer className={styles.footer}>Made with ❤️ by <a className={styles.linkFooter} href="https://github.com/Warkanlock">&nbsp;@Warkanlock</a></footer>
    </div>
  );
}
