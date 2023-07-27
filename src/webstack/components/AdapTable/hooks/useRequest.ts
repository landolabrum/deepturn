import { updateDictionary } from "@webstack/helpers/Dictionary";
import { debounce } from "lodash";
import { useEffect, useState, useCallback, useRef } from "react";
import { SearchMembersRequest } from "~/src/models/membership/SearchMembersRequest";

const DEBOUNCE_SECONDS = 1
type RequestHandler = (req: SearchMembersRequest) => void;
interface DebouncedRequestHandler extends RequestHandler {
  cancel: () => void;
}
export function useRequest(
  defaultRequest: any,
  dataLength: number,
  localRequestHandler: RequestHandler,
  serverRequestHandler?: RequestHandler
): [SearchMembersRequest, RequestHandler] {
  const serverRequest = serverRequestHandler || localRequestHandler;

  const [request, setRequest] = useState<any>(defaultRequest);



  const handleRequest = (req: SearchMembersRequest) => {
    const { modified, changed } = updateDictionary(request, req);
    setRequest(modified);
    // HANDLE LIMIT MODIFICATION
    if (changed.includes("limit"))serverRequest(modified);
    // HANDLE SKIP MODIFICATION
    if (changed.includes("skip"))serverRequest(modified);
    // HANDLE SEARCH MODIFICATION
    if (changed.includes("searchCriteria")) {
        setRequest({...defaultRequest, searchCriteria:modified.searchCriteria});
        debouncedFnRef.current?.cancel();
        debounceServerSearch({...defaultRequest, searchCriteria:modified.searchCriteria});
    }
  };
  const debouncedFnRef = useRef<DebouncedRequestHandler | null>(null);

  const debounceServerSearch = useCallback(
    (...args: Parameters<RequestHandler>) => {
      const debouncedFn = debounce(serverRequest, DEBOUNCE_SECONDS * 1000, {
        leading: false,
        trailing: true,
      }) as DebouncedRequestHandler; // Cast debounced function to DebouncedRequestHandler
      debouncedFnRef.current = debouncedFn;
      debouncedFn(...args);
    },
    [serverRequest]
  );

useEffect(() => {
  return () => {
    debouncedFnRef.current?.cancel();
  };
}, []);


  return [request, handleRequest];
};