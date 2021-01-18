import { cleanup, screen, waitFor, act } from "@testing-library/react";

import {
  getFieldReference,
  setInputFieldValue,
  setupAutocomplete,
} from "../testUtils";

beforeEach(() => {
  jest.spyOn(window, "fetch").mockImplementation(
    (): Promise<any> =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve([
            { street: "Hermannsens Gate", postNumber: 2841, city: "Oslo" },
            { street: "Andebu veien", postNumber: 3121, city: "Tønsberg" },
            {
              street: "Hønsehaukstedet",
              postNumber: 1232,
              city: "Kongsberg",
            },
          ]),
      })
  );
});

afterEach(() => {
  cleanup();
});

test("It renders the autoComplete textfield", () => {
  setupAutocomplete();

  const inputField = getFieldReference();
  expect(inputField?.textContent).toBe("");
});

test("It does not fire API calls before three characters are entered", () => {
  setupAutocomplete();

  const inputField = getFieldReference();
  act(() => {
    setInputFieldValue(inputField, "te");
  });

  expect(global.fetch).toBeCalledTimes(0);
});

test("It can display a list of items from the API", async () => {
  setupAutocomplete();

  const inputField = getFieldReference();

  act(() => {
    setInputFieldValue(inputField, "Herr");
  });

  await waitFor(() => expect(global.fetch).toBeCalledTimes(1));
  expect(inputField?.value).toBe("Herr");

  const comboBox = screen.getByRole("combobox");

  expect(comboBox).toBeInTheDocument();
});

test("It clears input when escape is pressed and the combobox is closed", () => {
  setupAutocomplete();

  const inputField = getFieldReference();
  act(() => {
    setInputFieldValue(inputField, "te");
  });

  expect(inputField?.value).toBe("te");

  act(() => {
    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });
    inputField?.dispatchEvent(keyboardEvent);
  });

  expect(inputField?.value).toBe("");
});

test("It closes the combobox when excape is pressed and the combobox is open", async () => {
  setupAutocomplete();

  const inputField = getFieldReference();

  act(() => {
    setInputFieldValue(inputField, "Herr");
  });

  await waitFor(() => expect(global.fetch).toBeCalledTimes(1));

  let comboBox = screen.getByRole("combobox");
  expect(comboBox).toHaveAttribute("aria-expanded", "true");

  act(() => {
    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });
    inputField?.dispatchEvent(keyboardEvent);
  });

  expect(comboBox).toHaveAttribute("aria-expanded", "false");
});

test("It navigates the elements when pressing keydown and the combobox is open", async () => {
  setupAutocomplete();

  const inputField = getFieldReference();

  act(() => {
    setInputFieldValue(inputField, "Herr");
  });

  await waitFor(() => expect(global.fetch).toBeCalledTimes(1));

  const comboBox = screen.getByRole("combobox");
  expect(comboBox).toHaveAttribute("aria-expanded", "true");

  act(() => {
    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
    });
    global.dispatchEvent(keyboardEvent);
  });

  await waitFor(() =>
    expect(inputField).toHaveAttribute(
      "aria-activedescendant",
      "address-autocomplete-li-1"
    )
  );

  //await waitFor(() => expect(screen.getByText(/her/i)).toHaveFocus());

  // Test focus here
});

test("It stops changing the activedescendant based on the length of the dataset", async () => {
  setupAutocomplete();

  const inputField = getFieldReference();

  act(() => {
    setInputFieldValue(inputField, "Herr");
  });

  await waitFor(() => expect(global.fetch).toBeCalledTimes(1));

  const comboBox = screen.getByRole("combobox");
  expect(comboBox).toHaveAttribute("aria-expanded", "true");

  act(() => {
    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
    });

    for (let i = 0; i <= 4; i++) {
      global.dispatchEvent(keyboardEvent);
    }
  });

  await waitFor(() =>
    expect(inputField).toHaveAttribute(
      "aria-activedescendant",
      "address-autocomplete-li-3"
    )
  );
});

test("It unsets the activedescendant when pressing arrowUp on when the first element is focused", async () => {
  setupAutocomplete();

  const inputField = getFieldReference();

  act(() => {
    setInputFieldValue(inputField, "Herr");
  });

  await waitFor(() => expect(global.fetch).toBeCalledTimes(1));

  const comboBox = screen.getByRole("combobox");
  expect(comboBox).toHaveAttribute("aria-expanded", "true");

  act(() => {
    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
    });

    global.dispatchEvent(keyboardEvent);
  });

  await waitFor(() =>
    expect(inputField).toHaveAttribute(
      "aria-activedescendant",
      "address-autocomplete-li-1"
    )
  );

  act(() => {
    const keyboardEvent = new KeyboardEvent("keydown", {
      key: "ArrowUp",
      bubbles: true,
    });

    global.dispatchEvent(keyboardEvent);
  });

  await waitFor(() =>
    expect(inputField).toHaveAttribute("aria-activedescendant", "")
  );
});

// test("It gives focus back to the input field when pressing the up button at first list item", async () => {
//   setupAutocomplete();

//   const inputField = getFieldReference();

//   act(() => {
//     setInputFieldValue(inputField, "Herr");
//   });

//   await waitFor(() => expect(global.fetch).toBeCalledTimes(1));

//   const comboBox = screen.getByRole("combobox");
//   expect(comboBox).toHaveAttribute("aria-expanded", "true");

//   act(() => {
//     const keyboardEvent = new KeyboardEvent("keydown", {
//       key: "ArrowDown",
//       bubbles: true,
//     });

//     global.dispatchEvent(keyboardEvent);
//   });

//   setTimeout(() => {
//     expect(inputField).toHaveAttribute(
//       "aria-activedescendant",
//       "address-autocomplete-li-3"
//     );

//     expect(screen.getByText(/høns/i)).toHaveFocus();
//   }, 100);
// });

// Test that we can render a list of items returned from an API
// Test that we can use keyboard shortcuts
// Test that the correct aria relationships exists
// Test that you do not exceed the amount of items in the dataset with the activeItemIndex
// Test that focus changes when you press the up key to the text input
