import express from "express";
import { IAddress } from "../common/types";

export const search = (searchParam: string, trieSearch: any): IAddress[] => {
  const results = trieSearch.get(searchParam) as IAddress[];

  if (results.length > 20) {
    return results.slice(0, 20);
  }

  return results;
};

export const simpleLogger = (req: express.Request) => {
  const { origin, useragent, host } = req.headers;
  const { method, statusCode } = req;

  const date = new Date();

  console.log(
    `[REQ RECEIVED: ${date.getHours()}:${date.getMinutes()}]  method=${method} origin=${origin} user-agent=${useragent} host=${host}`
  );
};
