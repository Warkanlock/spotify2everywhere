import styles from "../../styles/Home.module.css";

function ErrorPage({ message, onError }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2>There was an error using this page: {message}</h2>
        <div
          onClick={() => onError({ error: false, message: "", status: null })}
        >
          Go back
        </div>
      </main>
      <footer className={styles.footer}>
        Made with ❤️ by{" "}
        <a className={styles.linkFooter} href="https://github.com/Warkanlock">
          &nbsp;@Warkanlock
        </a>
      </footer>
    </div>
  );
}

export default ErrorPage;
