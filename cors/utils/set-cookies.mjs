export function SetCookie(res, cookies) {
  console.log(cookies);
  const current = res.getHeader("Set-Cookie");
  if (!current) {
    res.setHeader("Set-Cookie", [cookies]);
    return;
  }

  if (Array.isArray(current)) {
    current.push(cookies);
    res.setHeader("Set-Cookie", current);
    return;
  }
  res.setHeader("Set-Cookie", [String(current), cookies]);
}
