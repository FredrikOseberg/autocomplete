import React from "react";

const mockFormatter = (data: any) => {
  return data.map((point: any, index: number) => {
    const { street, postNumber, city } = point;

    return (
      <li
        key={`${street}-${postNumber}`}
        id={`address-autocomplete-li-${index + 1}`}
      >
        {street} - {postNumber} - {city}
      </li>
    );
  });
};

const mockValidator = (searchParam: string) => {
  if (searchParam.length < 3) return false;
  return true;
};

const mockData = (searchParam: string) => {
  return fetch(`http://localhost:8000/search/${searchParam}`);
};

const mockFilter = (data: any) => {
  return data;
};

export const getDefaultProps = () => {
  return {
    formatter: mockFormatter,
    validator: mockValidator,
    getData: mockData,
    filter: mockFilter,
    id: "address-autocomplete",
    label: "Addresse søk",
  };
};
