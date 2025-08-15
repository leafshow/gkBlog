export const getBaseUrl = () => "https://www.qladgk.com";
export const getParams = (
  obj: Record<string, string | Array<string> | undefined>,
) =>
  Object.entries(obj)
    .filter((entry) => entry[1])
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
