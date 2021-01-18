import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ARROW_DOWN, ARROW_UP, ENTER, ESC } from "../../../constants";

import styles from "./AutoCompleteMenu.module.css";

interface IAutoCompleteMenuProps {
  data: any[];
  formatter: (data: any) => JSX.Element[];
  listBoxId: string;
  comboBoxId: string;
  labelId: string;
  activeItemIndex: number | null;
  showListBox: boolean;
  setParentFocus: () => void;
  setActiveItemIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setActiveDescendantId: React.Dispatch<React.SetStateAction<string>>;
  setSearchParam: React.Dispatch<React.SetStateAction<string>>;
  setShowListBox: React.Dispatch<React.SetStateAction<boolean>>;
}

const AutoCompleteMenu: React.FC<IAutoCompleteMenuProps> = ({
  data,
  formatter,
  listBoxId,
  comboBoxId,
  labelId,
  activeItemIndex,
  showListBox,
  setActiveDescendantId,
  setParentFocus,
  setActiveItemIndex,
  setSearchParam,
  setShowListBox,
}) => {
  const ref = useRef<HTMLLIElement>(null);
  /* Refs used to keep update the state fresh. One of the drawbacks
  of using hooks is that the javscript concept of closure will
  close over the state value when accessed in a callback, for example
  events. Reference: https://github.com/reactjs/rfcs/blob/master/text/0068-react-hooks.md  */
  let dataRef = useRef<any[]>([]);
  let showListBoxRef = useRef<boolean>(false);
  let activeItemIndexRef = useRef<number | null>(null);
  const [listItems, setListItems] = useState<JSX.Element[]>();

  useEffect(() => {
    showListBoxRef.current = showListBox;
  }, [showListBox]);

  useEffect(() => {
    window.addEventListener("keydown", keyboardEvent);

    return () => {
      window.removeEventListener("keydown", keyboardEvent);
    };
  }, []);

  useEffect(() => {
    dataRef.current = data;
    processData();
  }, [data]);

  useEffect(() => {
    activeItemIndexRef.current = activeItemIndex;
    if (activeItemIndex === null) {
      setActiveDescendantId("");
      return setParentFocus();
    }

    Promise.resolve(processData()).then(() => {
      setActiveDescendantId(ref?.current?.id || "");
      ref?.current?.focus();
    });
  }, [activeItemIndex]);

  const processData = () => {
    return setListItems(addRef(formatter(data)));
  };

  const keyboardEvent = (e: KeyboardEvent) => {
    e.stopImmediatePropagation();

    if (e.key === ARROW_UP) {
      handleArrowUp();
    }

    if (e.key === ARROW_DOWN) {
      handleArrowDown();
    }

    if (e.key === ENTER) {
      handleEnter();
    }

    if (e.key === ESC) {
      handleEscape();
    }
  };

  const handleArrowUp = () => {
    setActiveItemIndex((prev) => {
      if (typeof prev === "number") {
        const notFirstElement = prev > 0;
        if (notFirstElement) {
          return prev - 1;
        }
      }
      return null;
    });
  };

  const handleArrowDown = () => {
    const currentData = dataRef.current;

    setActiveItemIndex((prev) => {
      if (typeof prev === "number") {
        const doesNotExceedDataSetLength = prev < currentData.length - 1;
        if (doesNotExceedDataSetLength) {
          return prev + 1;
        }
        return prev;
      }
      return 0;
    });
  };

  const handleEnter = () => {
    const show = showListBoxRef.current;
    const activeItemIndex = activeItemIndexRef.current;
    if (!show) return;
    if (activeItemIndex === null) return;
    const firstChild = ref?.current?.firstChild;
    setSearchParam(firstChild?.textContent || "");
    setShowListBox(false);
    setActiveItemIndex(null);
  };

  const handleEscape = () => {
    const show = showListBoxRef.current;

    setActiveItemIndex(null);
    setParentFocus();

    if (!show) {
      setSearchParam("");
      return show;
    }

    setShowListBox(false);
  };

  const onListItemClick = (index: number) => {
    setActiveItemIndex(index);
  };

  const addRef = (children: JSX.Element[]) => {
    return React.Children.map(children, (child, index) => {
      if (index === activeItemIndex) {
        return React.cloneElement(child, {
          ...child.props,
          ref,
          onClick: () => onListItemClick(index),
        });
      }
      return React.cloneElement(child, {
        ...child.props,
        onClick: () => onListItemClick(index),
      });
    });
  };

  return (
    <div
      className={styles.autoCompleteMenu}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={showListBox}
      aria-owns={listBoxId}
      id={comboBoxId}
    >
      {showListBox ? (
        <ul
          role="listbox"
          id={listBoxId}
          aria-labelledby={labelId}
          className={styles.autoCompleteList}
        >
          {listItems}
        </ul>
      ) : null}
    </div>
  );
};

export default AutoCompleteMenu;
