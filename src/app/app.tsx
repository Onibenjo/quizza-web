import SocketProvider from "context/socket";
import styles from "./app.module.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "components/Home";

const App = (): JSX.Element => {
  return (
    <SocketProvider>
      <div className={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </SocketProvider>
  );
};

export default App;
