"use strict";

import express from "express";
import Triesearch from "trie-search";
import cors from "cors";

import addresses from "./adresses.json";
import { search, simpleLogger } from "./utils";
import { BAD_REQUEST, OK, PORT } from "./constants";

const app = express();

const searchKeys = ["city", "street", "municipality", "county", "district"];
const trieSearch = new Triesearch(searchKeys);
trieSearch.addAll(addresses);

// Enables CORS for all orgins. Needs to be refined in order
// to provide required security.
app.use(cors());

app.get("/search/:searchParam", (req, res) => {
  simpleLogger(req);
  const { searchParam } = req.params;

  const invalidRequest = searchParam && searchParam.length < 3;
  if (invalidRequest) {
    return res.status(BAD_REQUEST).send({
      message:
        "You need to provide at least three characters to get a search result.",
    });
  }

  const results = search(searchParam, trieSearch);
  res.status(OK).send(results);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
