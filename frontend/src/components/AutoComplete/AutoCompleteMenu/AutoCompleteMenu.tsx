import * as React from "react";
import { useEffect, useRef } from "react";

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
  setData: React.Dispatch<React.SetStateAction<any>>;
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
  setData,
  setSearchParam,
  setShowListBox,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    window.addEventListener("keydown", keyboardEvent);

    return () => {
      window.removeEventListener("keydown", keyboardEvent);
    };
  }, []);

  useEffect(() => {
    if (activeItemIndex === null) {
      setActiveDescendantId("");
      return setParentFocus();
    }
    setActiveDescendantId(ref?.current?.id || "");
  }, [activeItemIndex]);

  const keyboardEvent = (e: KeyboardEvent) => {
    e.stopImmediatePropagation();

    const ARROW_UP = "ArrowUp";
    const ARROW_DOWN = "ArrowDown";
    const ENTER = "Enter";
    const ESC = "Escape";

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
        if (prev > 0) {
          return prev - 1;
        }
      }
      return null;
    });

    ref?.current?.focus();
  };

  const handleArrowDown = () => {
    let currentData;
    setData((data: any[]) => {
      currentData = data;
      return data;
    });
    setActiveItemIndex((prev) => {
      if (typeof prev === "number") {
        if (prev < currentData.length - 1) {
          return prev + 1;
        }
        return prev;
      }
      return 0;
    });

    ref?.current?.focus();
  };

  const handleEnter = () => {
    setShowListBox((show) => {
      if (!show) return show;

      const firstChild = ref?.current?.firstChild;
      setSearchParam(firstChild?.textContent || "");
      setShowListBox(false);
      setActiveItemIndex(null);

      return show;
    });
  };

  const handleEscape = () => {
    setShowListBox((show) => {
      if (!show) {
        setSearchParam("");
        return show;
      }

      setShowListBox(false);

      return show;
    });
  };

  const renderAutoCompleteList = () => {
    return addRef(formatter(data.filter((data) => data.street)));
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
          {renderAutoCompleteList()}
        </ul>
      ) : null}
    </div>
  );
};

export default AutoCompleteMenu;
