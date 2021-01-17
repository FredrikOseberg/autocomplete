import React from "react";
import { IAddress } from "../../common/types";

import AutoComplete from "./components/AutoComplete/AutoComplete";
import styles from "./App.module.css";

const getAddresses = (searchParam: string) => {
  return fetch(`http://localhost:8000/search/${searchParam}`);
};

const filter = (data: any) => {
  const addresses = data as IAddress[];
  return addresses.filter((address) => address.street);
};

function App() {
  const formatter = (data: any) => {
    const addresses = data as IAddress[];

    return addresses.map((address, index) => {
      return (
        <li
          className={styles.autoCompleteListItem}
          role="option"
          key={`${address.street}-${address.postNumber}`}
          id={`address-autocomplete-li-${index + 1}`}
          tabIndex={1}
          onFocus={() => console.log("FOCUSED", index)}
        >
          <span className={styles.autoCompleteListItemStreet}>
            {address.street}
          </span>
          <span className={styles.autoCompleteListItemPostNumber}>
            {address.postNumber}
          </span>
          <span className={styles.autoCompleteListItemCity}>
            {address.city}
          </span>
        </li>
      );
    });
  };

  const validator = (searchParam: string) => {
    if (searchParam.length < 3) return false;
    return true;
  };

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
