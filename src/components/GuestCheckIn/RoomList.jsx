import RoomCard from "./RoomCard.jsx";
import { isRoomAvailable } from "../../utils/bookingUtils";

/**
 * Draws the table of rooms.
 * The list it receives is already filtered by guest count by the parent,
 * so this component only decides availability per row and renders.
 */
export default function RoomList({
  rooms,
  bookings,
  checkIn,
  checkOut,
  selectedRoom,
  onSelectRoom,
}) {
  if (rooms.length === 0) {
    return (
      <p className="room-table__empty">
        No room in this hotel can hold that many guests. Try a smaller party size.
      </p>
    );
  }

  return (
    <table className="room-table">
      <thead>
        <tr>
          <th>Room no.</th>
          <th>Room type</th>
          <th>Rent</th>
          <th>Max guests</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <RoomCard
            key={room.code}
            room={room}
            available={isRoomAvailable(room.code, checkIn, checkOut, bookings)}
            selected={selectedRoom?.code === room.code}
            onSelect={onSelectRoom}
          />
        ))}
      </tbody>
    </table>
  );
}
