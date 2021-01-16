import { IAddress } from "./types/address";

export const search = (searchParam: string, trieSearch: any): IAddress[] => {
  const results = trieSearch.get(searchParam) as IAddress[];

  if (results.length > 20) {
    return results.slice(0, 20);
  }

  return results;
};
