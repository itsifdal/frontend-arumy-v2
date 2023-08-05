export function cleanQuery(query) {
  return Object.keys(query).reduce(
    (cleanedQuery, queryKey) =>
      query[queryKey] ? { ...cleanedQuery, [queryKey]: query[queryKey] } : { ...cleanedQuery },
    {}
  );
}
