import React from "react";

import AutoComplete from "./components/AutoComplete/AutoComplete";
import { getAddresses, validator, filter, formatter } from "./utils";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.appContainer}>
      <div className={styles.autoCompleteContainer}>
        <AutoComplete
          getData={getAddresses}
          formatter={formatter}
          validator={validator}
          filter={filter}
          id="address-autocomplete"
          label="Addresse søk"
        />
      </div>
    </div>
  );
}

export default App;
