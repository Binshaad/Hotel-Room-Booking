import { formatCurrency } from "../../utils/bookingUtils";

/**
 * One row of the room table.
 *
 * props:
 *   room       the room object from data/rooms.js
 *   available  false when the room clashes with an existing booking
 *   selected   true when this is the room the user picked
 *   onSelect   called with the room when the Select button is pressed
 */
export default function RoomCard({ room, available, selected, onSelect }) {
  const rowClass = [
    "room-row",
    selected ? "room-row--selected" : "",
    available ? "" : "room-row--booked",
  ]
    .join(" ")
    .trim();

  return (
    <tr className={rowClass}>
      <td className="room-row__code">{room.code}</td>
      <td>{room.type}</td>
      <td>{formatCurrency(room.price)} / night</td>
      <td>{room.maxGuests}</td>
      <td>
        {available ? (
          <span className="status status--free">Available</span>
        ) : (
          <span className="status status--booked">Booked for selected dates</span>
        )}
      </td>
      <td>
        <button
          type="button"
          className={`btn ${selected ? "btn--primary" : "btn--soft"} room-row__btn`}
          disabled={!available}
          aria-pressed={selected}
          onClick={() => onSelect(room)}
        >
          {selected ? "Selected" : "Select"}
        </button>
      </td>
    </tr>
  );
}
