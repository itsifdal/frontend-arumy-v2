export function urlSearchParamsToQuery(urlSearchParams) {
  const query = {};
  urlSearchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}
