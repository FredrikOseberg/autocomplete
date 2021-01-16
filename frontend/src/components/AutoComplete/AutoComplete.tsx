import React, { useState, useRef, useEffect } from "react";

import AutoCompleteMenu from "./AutoCompleteMenu/AutoCompleteMenu";

import styles from "./AutoComplete.module.css";

interface IAutoCompleteProps {
  getData: (searchParam: string) => Promise<Response>;
  formatter: (data: any) => JSX.Element[];
  validator: (searchParam: string) => Boolean;
  placeholder?: string;
  id: string;
  label: string;
}

const AutoComplete: React.FC<IAutoCompleteProps> = ({
  getData,
  formatter,
  validator,
  placeholder = "Søk etter addresser",
  id,
  label,
}) => {
  const [data, setData] = useState<any>([]);
  const [showListBox, setShowListBox] = useState(false);
  const [activeDescendantId, setActiveDescendantId] = useState("");
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [searchParam, setSearchParam] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchParam(value);

    const validInput = validator(value);
    if (validInput) {
      return getData(value).then(handleResponse).then(handleData);
    }
    setShowListBox(false);
    setData([]);
  };

  const handleResponse = (res: Response) => {
    if (res.status === 200) {
      return res.json();
    }
    // Set an error
    console.log("SETTING AN ERROR HERE");
    return [];
  };

  const handleData = (data: any) => {
    if (data.length > 0) {
      setShowListBox(true);
      return setData(data);
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
      <label id={labelId}>{label}</label>
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
      <AutoCompleteMenu
        data={data}
        formatter={formatter}
        listBoxId={listBoxId}
        comboBoxId={comboBoxId}
        labelId={labelId}
        setActiveDescendantId={setActiveDescendantId}
        setParentFocus={setParentFocus}
        activeItemIndex={activeItemIndex}
        setActiveItemIndex={setActiveItemIndex}
        showListBox={showListBox}
        setData={setData}
        setSearchParam={setSearchParam}
        setShowListBox={setShowListBox}
      />
    </div>
  );
};

export default AutoComplete;
