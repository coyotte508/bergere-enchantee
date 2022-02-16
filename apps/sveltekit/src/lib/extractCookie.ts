export function extractCookie(name: string, cookie: string): any {
  const cookies = cookie.split(";").map((x) => x.trim());

  const extracted = cookies.find((x) => x.startsWith(`${name}=`));

  const val = extracted?.slice(name.length + 1);

  try {
    return val && JSON.parse(val);
  } catch {
    return val;
  }
}
