export function urlSearchParamsToQuery(urlSearchParams) {
  const query = {};
  if (urlSearchParams && urlSearchParams.size > 1) {
    urlSearchParams.forEach((value, key) => {
      query[key] = value;
    });
  }
  return query;
}
