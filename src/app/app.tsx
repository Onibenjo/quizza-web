import SocketProvider from "context/socket";
import styles from "./app.module.css";

const App = (): JSX.Element => {
  return (
    <SocketProvider>
      <main className={styles.main}>
        <section className=""></section>
      </main>
    </SocketProvider>
  );
};

export default App;
