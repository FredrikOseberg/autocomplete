import React, { useState, useRef, useLayoutEffect } from "react";

import AutoCompleteMenu from "./AutoCompleteMenu/AutoCompleteMenu";
import AutoCompleteError from "./AutoCompleteError/AutoCompleteError";

import styles from "./AutoComplete.module.css";

interface IAutoCompleteProps {
  getData: (searchParam: string) => Promise<Response>;
  formatter: (data: any) => JSX.Element[];
  validator: (searchParam: string) => Boolean;
  filter: (data: any) => any;
  placeholder?: string;
  id: string;
  label: string;
}

interface IDebouncer {
  currentSearchParam: string;
  searching: boolean;
}

const AutoComplete: React.FC<IAutoCompleteProps> = ({
  getData,
  formatter,
  validator,
  placeholder = "Søk etter addresser",
  id,
  filter,
  label,
}) => {
  const [data, setData] = useState<any>([]);
  const [showListBox, setShowListBox] = useState(false);
  const [activeDescendantId, setActiveDescendantId] = useState("");
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [searchParam, setSearchParam] = useState("");
  const [error, setError] = useState("");
  const [debouncer, setDebouncer] = useState<IDebouncer>({
    currentSearchParam: "",
    searching: false,
  });

  useLayoutEffect(() => {
    const difference = debouncer.currentSearchParam !== searchParam;
    const notEmpty = searchParam !== "";

    if (difference && notEmpty) {
      makeRequest(searchParam);
    }
  }, [debouncer.searching, debouncer.currentSearchParam]);

  const ref = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchParam(value);

    const validInput = validator(value);
    if (validInput && !debouncer.searching) {
      setDebouncer({ currentSearchParam: value, searching: true });
      return makeRequest(value);
    }
    setShowListBox(false);
    setData([]);
  };

  const makeRequest = (value: string) => {
    setError("");
    getData(value)
      .then(handleResponse)
      .then(handleData)
      .catch(() => {
        setDebouncer((prevValues) => ({ ...prevValues, searching: false }));
      });
  };

  const handleResponse = (res: Response) => {
    setDebouncer((prevValues) => ({ ...prevValues, searching: false }));

    if (res.status === 200) {
      return res.json();
    }
    console.log("Setting error");
    setError("Beklager, forespørselen feilet.");
    return [];
  };

  const handleData = (data: any) => {
    if (data.length > 0) {
      setShowListBox(true);
      return setData(filter([...data]));
    }
    setShowListBox(false);
  };

  const setParentFocus = () => {
    ref?.current?.focus();
  };

  const listBoxId = `${id}-listbox`;
  const comboBoxId = `${id}-combobox`;
  const labelId = `${id}-label`;

  return (
    <div className={styles.autoCompleteContainer}>
      <label className={styles.label} id={labelId}>
        {label}
      </label>
      <input
        value={searchParam}
        onChange={onChange}
        type="text"
        name="searchfield"
        id={id}
        className={styles.autoCompleteField}
        placeholder={placeholder}
        aria-autocomplete="list"
        aria-controls={listBoxId}
        aria-labelledby={labelId}
        aria-activedescendant={activeDescendantId}
        ref={ref}
      />
      {error ? (
        <AutoCompleteError
          message={error}
          onClick={() => makeRequest(searchParam)}
        />
      ) : null}
      <AutoCompleteMenu
        data={data}
        formatter={formatter}
        listBoxId={listBoxId}
        comboBoxId={comboBoxId}
        labelId={labelId}
        activeItemIndex={activeItemIndex}
        showListBox={showListBox}
        setData={setData}
        setParentFocus={setParentFocus}
        setSearchParam={setSearchParam}
        setShowListBox={setShowListBox}
        setActiveItemIndex={setActiveItemIndex}
        setActiveDescendantId={setActiveDescendantId}
      />
    </div>
  );
};

export default AutoComplete;
