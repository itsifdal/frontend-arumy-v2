export function urlSearchParamsToQuery(urlSearchParams) {
  const query = {};
  if (urlSearchParams) {
    urlSearchParams.forEach((value, key) => {
      query[key] = value;
    });
  }
  return query;
}
