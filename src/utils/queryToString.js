export function queryToString(query) {
  return `?${Object.keys(query)
    .map((queryKey) => (query[queryKey] ? `${queryKey}=${query[queryKey]}` : null))
    .filter(Boolean)
    .join("&")}`;
}
