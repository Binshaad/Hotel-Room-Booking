import { getTodayString } from "../../utils/bookingUtils";

/**
 * DateSelector only draws the inputs. It holds no state of its own.
 * The values come down as props and every change is sent back up
 * through the on... functions. This is the normal React pattern:
 * one parent owns the data, the children just display and report.
 */
export default function DateSelector({
  checkIn,
  checkOut,
  guests,
  guestName,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onGuestNameChange,
}) {
  const today = getTodayString();

  return (
    <div className="selector">
      <div className="field">
        <label htmlFor="check-in-date">Check-in date</label>
        <input
          id="check-in-date"
          type="date"
          value={checkIn}
          min={today}
          onChange={(event) => onCheckInChange(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="check-out-date">Check-out date</label>
        <input
          id="check-out-date"
          type="date"
          value={checkOut}
          /* The earliest valid check-out is the day after check-in.
             This is only a convenience; the real check runs in JavaScript. */
          min={checkIn || today}
          onChange={(event) => onCheckOutChange(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="guest-count">Guests</label>
        <select
          id="guest-count"
          value={guests}
          onChange={(event) => onGuestsChange(Number(event.target.value))}
        >
          <option value={1}>1 guest</option>
          <option value={2}>2 guests</option>
          <option value={3}>3 guests</option>
          <option value={4}>4 guests</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="guest-name">Guest name</label>
        <input
          id="guest-name"
          type="text"
          placeholder="Name / Phone number"
          value={guestName}
          onChange={(event) => onGuestNameChange(event.target.value)}
        />
      </div>
    </div>
  );
}
