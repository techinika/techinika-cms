export async function checkLogin() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_AUTH_URL + "/api/auth/status",
    {
      credentials: "include",
      cache: "no-store",
    }
  );

  const data = await res.json();

  if (!data.authenticated) {
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}`;
    return null;
  }

  return data;
}
