import { describe, it, expect } from "vitest";
import {
  calculateNights,
  calculateTotal,
  isRoomAvailable,
  validateDates,
  filterRoomsByGuests,
} from "./bookingUtils";
import { rooms } from "../data/rooms";

const bookings = [{ roomCode: "R101", checkIn: "2026-09-20", checkOut: "2026-09-23" }];

describe("calculateNights", () => {
  it("counts 3 nights from 20 Sep to 23 Sep", () => {
    expect(calculateNights("2026-09-20", "2026-09-23")).toBe(3);
  });

  it("counts 1 night from 20 Sep to 21 Sep", () => {
    expect(calculateNights("2026-09-20", "2026-09-21")).toBe(1);
  });

  it("counts 5 nights from 20 Sep to 25 Sep", () => {
    expect(calculateNights("2026-09-20", "2026-09-25")).toBe(5);
  });

  it("treats the same day as zero nights", () => {
    expect(calculateNights("2026-09-20", "2026-09-20")).toBe(0);
  });

  it("treats a reversed range as zero nights", () => {
    expect(calculateNights("2026-09-23", "2026-09-20")).toBe(0);
  });

  it("returns 0 for missing dates", () => {
    expect(calculateNights("", "")).toBe(0);
  });

  it("crosses a month boundary correctly", () => {
    expect(calculateNights("2026-09-29", "2026-10-02")).toBe(3);
  });
});

describe("calculateTotal", () => {
  it("multiplies 3 nights by 3500", () => {
    expect(calculateTotal(3, 3500)).toBe(10500);
  });

  it("returns 0 when nights are 0", () => {
    expect(calculateTotal(0, 3500)).toBe(0);
  });
});

describe("validateDates", () => {
  it("rejects a same-day stay", () => {
    expect(validateDates("2099-09-20", "2099-09-20")).toBe(
      "Check-out date must be after check-in date."
    );
  });

  it("rejects a check-in in the past", () => {
    expect(validateDates("2020-01-01", "2020-01-05")).toBe(
      "Check-in date cannot be in the past."
    );
  });

  it("asks for a check-in date when it is empty", () => {
    expect(validateDates("", "2099-09-23")).toBe("Please select a check-in date.");
  });

  it("passes a valid future stay", () => {
    expect(validateDates("2099-09-20", "2099-09-23")).toBe("");
  });
});

describe("isRoomAvailable", () => {
  it("allows a stay starting on the day the old one ends", () => {
    expect(isRoomAvailable("R101", "2026-09-23", "2026-09-25", bookings)).toBe(true);
  });

  it("blocks a stay that starts inside the booking", () => {
    expect(isRoomAvailable("R101", "2026-09-22", "2026-09-25", bookings)).toBe(false);
  });

  it("blocks a stay that ends inside the booking", () => {
    expect(isRoomAvailable("R101", "2026-09-19", "2026-09-21", bookings)).toBe(false);
  });

  it("blocks a stay fully inside the booking", () => {
    expect(isRoomAvailable("R101", "2026-09-21", "2026-09-22", bookings)).toBe(false);
  });

  it("leaves other rooms alone", () => {
    expect(isRoomAvailable("R102", "2026-09-21", "2026-09-22", bookings)).toBe(true);
  });
});

describe("filterRoomsByGuests", () => {
  it("returns only the family room for 4 guests", () => {
    const result = filterRoomsByGuests(rooms, 4);
    expect(result.map((room) => room.code)).toEqual(["R301"]);
  });

  it("returns every room for 2 guests", () => {
    expect(filterRoomsByGuests(rooms, 2)).toHaveLength(5);
  });
});
