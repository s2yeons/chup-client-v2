export const formatAppliedAt = (isoString: string) => {
  const date = new Date(isoString);
  const pad = (value: number) => value.toString().padStart(2, '0');

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
