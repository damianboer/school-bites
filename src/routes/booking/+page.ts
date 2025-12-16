export const load = async ({ fetch }) => {
  const res = await fetch('/api/me');
  const me = res.ok ? await res.json() : null;
  return { me };
};
