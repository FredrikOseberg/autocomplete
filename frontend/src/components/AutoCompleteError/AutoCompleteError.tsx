import * as React from "react";

import styles from "./AutoCompleteError.module.css";

interface IError {
  message: string;
  onClick: () => void;
}

const AutoCompleteError = ({ message, onClick }: IError) => (
  <div className={styles.autocompleteError}>
    {message}
    <button onClick={onClick} className={styles.autoCompleteErrorButton}>
      Prøv igjen
    </button>
  </div>
);

export default AutoCompleteError;
