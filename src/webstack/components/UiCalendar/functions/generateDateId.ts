export default function generateDateId(date: any) {
  let d = date;
  if (typeof d === "string") d = new Date(date);

  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  const dateId = parseInt(`${month}${day}${year}`, 10);
  return dateId;
}
 