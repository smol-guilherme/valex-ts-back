export function editDate(): string {
  const now: Date = new Date();
  const month: string = String(now.getUTCMonth())
  const year: string = String(now.getUTCFullYear() + 5).substring(2);
  if(month.length === 1) return `0${month}/${year}`;
  return `${month}/${year}`;
}

export function editNameToCard(fullName: string): string {
  const cardString = fullName
    .replaceAll(/\b(da?o?s?)\W/g, "")
    .trim()
    .toUpperCase()
    .split(" ");
  if (cardString.length >= 3)
    cardString.splice(1, cardString.length - 2, cardString[1].substring(0, 1));
  return cardString.join(" ");
}