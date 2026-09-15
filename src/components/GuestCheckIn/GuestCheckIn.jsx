import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DateSelector from "./DateSelector.jsx";
import RoomList from "./RoomList.jsx";
import BookingSummary from "./BookingSummary.jsx";
import { rooms } from "../../data/rooms";
import { existingBookings } from "../../data/bookings";
import {
  calculateNights,
  calculateTotal,
  filterRoomsByGuests,
  formatCurrency,
  formatDate,
  isRoomAvailable,
  validateDates,
} from "../../utils/bookingUtils";
import "./GuestCheckIn.css";

export default function GuestCheckIn() {
  /* ----------------------------------------------------------------
     State: the few pieces of information that can change while the
     user is on this page. Each useState gives a value and a setter.
       checkIn          -> the chosen arrival date, "YYYY-MM-DD"
       setCheckIn       -> changes it, and React redraws the page
       selectedRoom     -> the whole room object, or null if none picked
       message          -> what we show after the user presses a button
     ---------------------------------------------------------------- */
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // Date problems, recalculated on every render. Empty string = no problem.
  const dateError = validateDates(checkIn, checkOut);
  const datesAreValid = dateError === "";

  /* useMemo remembers the result and only recalculates when guests changes.
     Not strictly required here, but it keeps the filtered list stable. */
  const visibleRooms = useMemo(
    () => filterRoomsByGuests(rooms, guests),
    [guests]
  );

  const nights = datesAreValid ? calculateNights(checkIn, checkOut) : 0;
  const total = selectedRoom ? calculateTotal(nights, selectedRoom.price) : 0;

  /* ----------------------------------------------------------------
     useEffect runs *after* a render, when one of the values in the
     list at the bottom has changed. Here it protects the user:
     if they pick a room and then change the dates so that room is
     no longer free (or no longer big enough), we drop the selection
     instead of quietly booking an unavailable room.
     ---------------------------------------------------------------- */
  useEffect(() => {
    if (!selectedRoom) return;

    const tooSmall = selectedRoom.maxGuests < guests;
    const taken = !isRoomAvailable(
      selectedRoom.code,
      checkIn,
      checkOut,
      existingBookings
    );

    if (tooSmall) {
      setSelectedRoom(null);
      setConfirmed(false);
      setMessage("This room does not support the selected number of guests.");
    } else if (taken) {
      setSelectedRoom(null);
      setConfirmed(false);
      setMessage("This room is already booked for the selected dates. Pick another room.");
    }
  }, [checkIn, checkOut, guests, selectedRoom]);

  function handleSelectRoom(room) {
    setSelectedRoom(room);
    setConfirmed(false);
    setMessage("");
  }

  function handleConfirm() {
    // Order matters: report the first thing that is missing.
    if (!checkIn) return setMessage("Please select a check-in date.");
    if (!checkOut) return setMessage("Please select a check-out date.");
    if (!datesAreValid) return setMessage(dateError);
    if (!selectedRoom) return setMessage("Please select a room.");

    setMessage("");
    setConfirmed(true);
  }

  // The summary only appears when there is something real to show.
  const summaryReady = Boolean(selectedRoom) && datesAreValid && nights > 0;
  const gst = selectedRoom ? Math.round(total * 0.12) : 0;

  return (
    <div className="page checkin">
      <div className="browser-bar">
        <span className="browser-bar__caret">⌄</span>
        <span className="browser-bar__tab">
          <span className="browser-bar__favicon" />
          https://Management Pro
          <button type="button" className="browser-bar__close" aria-label="Close tab">
            ✕
          </button>
        </span>
        <span className="browser-bar__window">
          <span>—</span>
          <span>▢</span>
          <span>✕</span>
        </span>
      </div>

      <header className="page__header">
        <h1 className="page__title">Guest Check-in</h1>
        <div className="page__search">
          <span className="icon">⌕</span>
          <input
            type="search"
            aria-label="Search booking ID or guest name"
            placeholder="Search Booking ID / Guest Name"
          />
        </div>
        <Link to="/" className="back-link">
          ← Dashboard
        </Link>
      </header>

      <main className="page__body">
        <div className="checkin__top">
          {/* ---------------- Panel 1 ---------------- */}
          <section className="panel">
            <h2 className="panel__head">1. Select Booking &amp; Guest</h2>
            <div className="panel__body">
              <DateSelector
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                guestName={guestName}
                onCheckInChange={(value) => {
                  setCheckIn(value);
                  setConfirmed(false);
                  setMessage("");
                }}
                onCheckOutChange={(value) => {
                  setCheckOut(value);
                  setConfirmed(false);
                  setMessage("");
                }}
                onGuestsChange={setGuests}
                onGuestNameChange={setGuestName}
              />

              {dateError && checkIn && checkOut && (
                <p className="message message--error">{dateError}</p>
              )}

              <div className="booking-meta">
                <div>
                  <span>Booking Date</span>
                  <strong>{checkIn ? formatDate(checkIn) : "—"}</strong>
                </div>
                <div>
                  <span>Booking Time</span>
                  <strong>07:00 PM 🕐</strong>
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- Panel 2 ---------------- */}
          <section className="panel">
            <h2 className="panel__head">2. Review &amp; Update Details</h2>
            <div className="panel__body">
              {!selectedRoom && (
                <p className="message message--info">
                  Pick a room from the list below to review its details.
                </p>
              )}

              <div className="review-grid">
                <div className="field">
                  <label htmlFor="review-room">Room No.</label>
                  <span className="room-chip" id="review-room">
                    🛏 {selectedRoom ? selectedRoom.code : "—"}
                  </span>
                </div>

                <div className="field">
                  <label htmlFor="review-rent">Rent</label>
                  <input
                    id="review-rent"
                    readOnly
                    value={selectedRoom ? formatCurrency(selectedRoom.price) : ""}
                  />
                </div>

                <div className="field">
                  <label htmlFor="review-gst">GST</label>
                  <div className="input-suffix">
                    <input id="review-gst" readOnly value={gst ? formatCurrency(gst) : ""} />
                    <span>%</span>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="review-tenant">Tenand Name</label>
                  <input id="review-tenant" value={guestName} readOnly />
                </div>

                <div className="field">
                  <label htmlFor="review-adults">No-of Adults</label>
                  <input id="review-adults" readOnly value={String(guests).padStart(2, "0")} />
                </div>

                <div className="field">
                  <label htmlFor="review-kids">No-of Kids</label>
                  <input id="review-kids" readOnly value="00" />
                </div>

                <div className="field">
                  <label htmlFor="review-checkout">Checkout Date</label>
                  <input
                    id="review-checkout"
                    readOnly
                    value={checkOut ? formatDate(checkOut) : ""}
                  />
                </div>

                <div className="field">
                  <label htmlFor="review-id">Update ID Proof</label>
                  <div className="input-suffix">
                    <input id="review-id" placeholder="guest-id.pdf" />
                    <span>🗎</span>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="review-count">Update No. of Adults/Kids</label>
                  <input id="review-count" value={guestName} readOnly placeholder="Guest name" />
                </div>

                <div className="upload">
                  <span>⬆ Upload</span>
                  <span>🗎</span>
                </div>

                <div className="field">
                  <label htmlFor="review-guest-count">Guest Count</label>
                  <select id="review-guest-count" value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                    <option value={1}>01</option>
                    <option value={2}>02</option>
                    <option value={3}>03</option>
                    <option value={4}>04</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="review-name">Update Guest Name</label>
                  <input
                    id="review-name"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                  />
                </div>

                <div className="charges">
                  <h3>Additional Charges</h3>
                  <div>
                    <span>Room Charge</span>
                    <strong>{selectedRoom ? `${selectedRoom.maxGuests} beds` : "—"}</strong>
                  </div>
                  <div>
                    <span>Extra Charges</span>
                    <strong>{formatCurrency(200)}</strong>
                  </div>
                  <div>
                    <span>Tax</span>
                    <strong>{formatCurrency(gst)}</strong>
                  </div>
                </div>
              </div>

              <div className="review-actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setSelectedRoom(null);
                    setConfirmed(false);
                  }}
                >
                  🗑 Delete
                </button>
                <button type="button" className="btn btn--ghost">✎ Edit</button>
                <button type="button" className="btn btn--ghost">⟳ Update</button>
                <button type="button" className="btn btn--primary" onClick={handleConfirm}>
                  Confirm Guest Details
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="checkin__bottom">
          {/* ---------------- Room list ---------------- */}
          <section className="card room-table-card">
            {message && <p className="message message--error">{message}</p>}

            <RoomList
              rooms={visibleRooms}
              bookings={existingBookings}
              checkIn={checkIn}
              checkOut={checkOut}
              selectedRoom={selectedRoom}
              onSelectRoom={handleSelectRoom}
            />
          </section>

          {/* ---------------- Panel 3 ---------------- */}
          <section className="panel">
            <h2 className="panel__head">3. Finalize Check-in &amp; Payment</h2>
            <div className="panel__body">
              <BookingSummary
                room={selectedRoom}
                checkIn={checkIn}
                checkOut={checkOut}
                nights={nights}
                total={total}
                isReady={summaryReady}
                confirmed={confirmed}
                onConfirm={handleConfirm}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
