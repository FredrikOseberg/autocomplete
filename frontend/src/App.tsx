import React, { useEffect, useState } from "react";

import AutoComplete from "./components/AutoComplete/AutoComplete";
import styles from "./App.module.css";

const getAddresses = (searchParam: string) => {
  return fetch(`http://localhost:8000/search/${searchParam}`);
};

export interface IAddress {
  postNumber: string;
  city: string;
  street: string;
  typeCode: number;
  type: string;
  district: string;
  municipalityNumber: string;
  municipality: string;
  county: string;
}

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
          tabIndex={index + 1}
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
          id="address-autocomplete"
          label="Addresse søk"
        />
      </div>
    </div>
  );
}

export default App;
