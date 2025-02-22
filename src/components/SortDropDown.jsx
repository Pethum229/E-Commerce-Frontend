import React from "react";

const SortDropDown = ({ sortByPrice, onSortChange }) => {
  return (
    <div>
      <label>Sort by Price : </label>
      <select 
        value={sortByPrice}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortDropDown;
