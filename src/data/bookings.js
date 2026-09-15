// Bookings that already exist in the hotel.
// Used to decide if a room is free for the dates the user picked.
// Dates are plain calendar strings: "YYYY-MM-DD".
export const existingBookings = [
  { roomCode: "R101", checkIn: "2026-09-20", checkOut: "2026-09-23" },
  { roomCode: "R201", checkIn: "2026-09-25", checkOut: "2026-09-28" },
  { roomCode: "R301", checkIn: "2026-10-01", checkOut: "2026-10-04" },
];

export default existingBookings;
