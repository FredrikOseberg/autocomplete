import React, { useEffect, useState } from "react";

import styles from "./App.module.css";

function App() {
  const [addresses, setAddresses] = useState([]);

  const onChange = () => {
    // Debounce this
    fetch("http://localhost:8000/search");
  };

  return <div className={styles.appContainer}></div>;
}

export default App;
