export function getCurrentTimeFormatted(): string {
  const currentDate = new Date();

  const monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthAbbreviations[currentDate.getMonth()];

  const day = currentDate.getDate();

  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  const period = hours >= 12 ? "pm" : "am";

  const formattedHours = hours > 12 ? hours - 12 : hours;

  const formattedTime = `${month} ${day}, ${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")}${period}`;

  return formattedTime;
}
