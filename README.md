# Introduction

This application implements an accessible autocomplete field following the WCAG standard outlined
in this [document](https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html). It consists of two parts: (1) a simple backend written in typescript returning a JSON response of addresses utilising trie-search for optimized lookups, and (2) a frontend written in react / typescript implementing the required functionality for an accessible autocomplete field.

## Keyboard navigation

You can use the following keys to navigate:

- Esc
  - Clears input when combobox is inactive
  - Closes the combobox when combobox is active
- Enter
  - If focus is on one of the alternatives in the list, enter will set the value of the input field and close the combobox
- DownArrow
  - If the comobobox is open, the DownArrow key will change the focus of the elements in the downward direction. If the combobox is closed it does nothing.
- UpArrow
  - If the combobox is open, the UpArrow key will change the focus of the elements in the upwards direction. If the first elemented is selected it will transfer focus back to the input field.

## Running it locally

### Docker

#### Docker-compose

The easiest way to run the project is to use docker-compose:

```
docker-compose up --build
```

#### Manually

```
docker build -t autocomplete-backend -f Dockerfile.backend .
docker build -t autocomplete-frontend -f Dockerfile.frontend .

docker run -p 8000:8000 autocomplete-backend:latest
docker run -p 3000:3000 autocomplete-frontend:latest
```

### Make

- Dependencies: Node

Alternatively you can install the dependencies and run it locally with make:

```
make install-backend
make install-backend
make start-backend
make start-frontend
```

### Manually

- Dependencies: Node

If you want to run the commands manually:

```
// from root
cd backend && npm install
npm start

// from root
cd frontend && npm install
npm start
```
