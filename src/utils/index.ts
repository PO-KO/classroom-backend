export const parsePositiveInt = (value: unknown, fallback: number) => {
  if (typeof value !== "string" && typeof value !== "number") return fallback;

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 ? parsed : fallback;
};
