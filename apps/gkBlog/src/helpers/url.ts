export const getBaseUrl = () => "https://gkblog.xiaodoudou.vip";
export const getParams = (
  obj: Record<string, string | Array<string> | undefined>
) =>
  Object.entries(obj)
    .filter((entry) => entry[1])
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
