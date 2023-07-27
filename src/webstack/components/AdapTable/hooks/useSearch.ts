import { debounce } from "lodash";
import { useEffect, useState } from "react";

export function useSearch(
  localSearch: (e: any) => void,
  serverSearch_?: (searchCriteria: string) => void
) {
  const serverSearch = serverSearch_ ? serverSearch_ : localSearch;
  const debounceServerSearch = debounce(serverSearch, 3000, {
    leading: true,
    trailing: false,
  });
  const [search, setSearch] = useState<any>("");
  function handleSearch(searchCriteria: string) {
    setSearch(searchCriteria);
    if (searchCriteria === "") {
      serverSearch(" ");
    } // Search input deleted, fetch full data;
    if (searchCriteria.length > 0 && searchCriteria.length < 4) {
      // console.log("[ LOCAL ]", searchCriteria)
      localSearch(searchCriteria);
    }
    if (
      ![undefined, ""].includes(searchCriteria) &&
      searchCriteria.length >= 4
    ) {
      // console.log("[ SERVER ]", searchCriteria)
      debounceServerSearch.cancel(); // cancel the previous request
      debounceServerSearch(searchCriteria);
    }
  }
  useEffect(() => {}, [localSearch, serverSearch]);
  return [search, handleSearch];
}

