// utility functions related to dates

export function formatAppointmentDate(value) {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  if (isToday) return `Today ${date.toLocaleTimeString([], timeOptions)}`;
  if (isTomorrow) return `Tomorrow ${date.toLocaleTimeString([], timeOptions)}`;
  return date.toLocaleString();
}
