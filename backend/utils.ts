import { IAddress } from "../common/types";

export const search = (searchParam: string, trieSearch: any): IAddress[] => {
  const results = trieSearch.get(searchParam) as IAddress[];

  if (results.length > 20) {
    return results.slice(0, 20);
  }

  return results;
};
