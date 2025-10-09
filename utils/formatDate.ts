/**
 * Converts an ISO timestamp (e.g. "2025-10-03T11:29:16.946+00:00")
 * into a readable string format like "Oct, 03, 2025".
 *
 * @param isoString - The ISO date string to convert.
 * @returns A formatted date string (e.g. "Oct, 03, 2025").
 */
export function formatDate(isoString: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Intl options for formatting
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  };

  // Format the date to parts
  const formatted = date.toLocaleDateString("en-US", options);

  // Convert "Oct 3, 2025" → "Oct, 03, 2025"
  const [month, day, year] = formatted.replace(",", "").split(" ");
  const formattedDate = `${month} ${day.padStart(2, "0")}, ${year}`;

  return formattedDate;
}
