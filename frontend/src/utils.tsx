import React from "react";
import { IAddress } from "../../common/types";

import styles from "./App.module.css";

export const getAddresses = (searchParam: string) => {
  return fetch(`http://localhost:8000/search/${searchParam}`);
};

export const filter = (data: any) => {
  const addresses = data as IAddress[];
  return addresses.filter((address) => address.street);
};

export const validator = (searchParam: string) => {
  if (searchParam.length < 3) return false;
  return true;
};

export const formatter = (data: any) => {
  const addresses = data as IAddress[];

  return addresses.map((address, index) => {
    return (
      <li
        className={styles.autoCompleteListItem}
        /* eslint-disable-next-line */
        role="option"
        key={`${address.street}-${address.postNumber}`}
        id={`address-autocomplete-li-${index + 1}`}
        tabIndex={1}
      >
        <span className={styles.autoCompleteListItemStreet}>
          {address.street}
        </span>
        <span className={styles.autoCompleteListItemPostNumber}>
          {address.postNumber}
        </span>
        <span className={styles.autoCompleteListItemCity}>{address.city}</span>
      </li>
    );
  });
};
