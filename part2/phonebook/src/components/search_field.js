import React from "react";

const SearchField = ({ searchQuery, editSearchQuery }) => (
  <div>
    Search: <input type="text" value={searchQuery} onChange={editSearchQuery} />
  </div>
);

export default SearchField;
