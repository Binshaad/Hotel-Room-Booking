/**
 * bookingUtils.js
 *
 * All booking maths and rules live here.
 * These are "pure functions": same input always gives the same output,
 * they never touch React state and never touch the screen.
 * That makes them easy to reuse and easy to unit test.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Turn a "YYYY-MM-DD" string into a Date fixed at UTC midnight.
 *
 * Why UTC: `new Date("2026-09-20")` is parsed as UTC, but
 * `new Date(2026, 8, 20)` is local time. Mixing the two makes
 * subtraction drift by a few hours and a night can be lost or gained.
 * We build every date the same way so the difference is always exact days.
 *
 * Returns null if the string is missing or not a real date.
 */
export function toCalendarDate(dateString) {
  if (!dateString || typeof dateString !== "string") return null;

  const parts = dateString.split("-");
  if (parts.length !== 3) return null;

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!year || !month || !day) return null;

  const date = new Date(Date.UTC(year, month - 1, day));

  // Guards against nonsense like "2026-02-31" rolling over to March.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

/** Today's calendar date at UTC midnight, so it compares cleanly. */
export function getToday() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );
}

/** Today as "YYYY-MM-DD". Used for the `min` attribute on the date input. */
export function getTodayString() {
  const today = getToday();
  const month = String(today.getUTCMonth() + 1).padStart(2, "0");
  const day = String(today.getUTCDate()).padStart(2, "0");
  return `${today.getUTCFullYear()}-${month}-${day}`;
}

/**
 * Number of hotel nights between two calendar dates.
 * 20 Sep -> 23 Sep = 3 nights.
 * Returns 0 for missing, invalid, same-day or reversed dates.
 */
export function calculateNights(checkIn, checkOut) {
  const start = toCalendarDate(checkIn);
  const end = toCalendarDate(checkOut);
  if (!start || !end) return 0;

  const nights = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
  return nights > 0 ? nights : 0;
}

/** Total price = nights x price per night. Returns 0 if either is missing. */
export function calculateTotal(nights, pricePerNight) {
  if (!nights || !pricePerNight) return 0;
  if (nights < 0 || pricePerNight < 0) return 0;
  return nights * pricePerNight;
}

/** Format a number as Indian rupees: 3500 -> "₹3,500". */
export function formatCurrency(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format "2026-09-20" as "20 Sep 2026" for display. */
export function formatDate(dateString) {
  const date = toCalendarDate(dateString);
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Check the dates the user typed and return the first problem found.
 * Returns an empty string when everything is fine.
 */
export function validateDates(checkIn, checkOut) {
  if (!checkIn) return "Please select a check-in date.";
  if (!checkOut) return "Please select a check-out date.";

  const start = toCalendarDate(checkIn);
  const end = toCalendarDate(checkOut);

  if (!start) return "Please select a valid check-in date.";
  if (!end) return "Please select a valid check-out date.";

  if (start.getTime() < getToday().getTime()) {
    return "Check-in date cannot be in the past.";
  }

  if (end.getTime() <= start.getTime()) {
    return "Check-out date must be after check-in date.";
  }

  return "";
}

/**
 * Do two stays overlap?
 *
 * Hotel rule: a stay ends the morning of its check-out date, so the
 * check-out day is free for the next guest.
 * Two stays clash only when: newStart < existingEnd AND newEnd > existingStart.
 *
 * Existing 20 -> 23:
 *   23 -> 25  no clash (23 < 23 is false)
 *   22 -> 25  clash
 *   19 -> 21  clash
 *   21 -> 22  clash
 */
export function datesOverlap(startA, endA, startB, endB) {
  const aStart = toCalendarDate(startA);
  const aEnd = toCalendarDate(endA);
  const bStart = toCalendarDate(startB);
  const bEnd = toCalendarDate(endB);

  if (!aStart || !aEnd || !bStart || !bEnd) return false;

  return aStart.getTime() < bEnd.getTime() && aEnd.getTime() > bStart.getTime();
}

/**
 * Is this room free for the requested stay?
 * If the dates are incomplete we treat the room as available,
 * because we cannot judge it yet.
 */
export function isRoomAvailable(roomCode, checkIn, checkOut, bookings = []) {
  if (!checkIn || !checkOut) return true;
  if (calculateNights(checkIn, checkOut) === 0) return true;

  const clash = bookings.some(
    (booking) =>
      booking.roomCode === roomCode &&
      datesOverlap(checkIn, checkOut, booking.checkIn, booking.checkOut)
  );

  return !clash;
}

/** Only rooms that can hold this many guests. */
export function filterRoomsByGuests(rooms, guests) {
  const count = Number(guests);
  if (!count) return rooms;
  return rooms.filter((room) => room.maxGuests >= count);
}
