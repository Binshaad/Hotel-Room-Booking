import { useState } from "react";
import { Link } from "react-router-dom";
import {
  calculateNights,
  calculateTotal,
  formatCurrency,
} from "../../utils/bookingUtils";
import "./GuestCheckOut.css";

/**
 * Mock stays for the departing guest.
 * `extras` are the mini-bar / restaurant lines shown in the middle panel.
 */
const initialStays = [
  {
    room: "101",
    guest: "Mathew Hyden",
    checkIn: "2026-04-02",
    checkOut: "2026-04-04",
    rate: 1200,
    extras: [
      { id: 1, label: "Mini-bar (Water x2)", date: "03/04/2026", amount: 100 },
      { id: 2, label: "Room Service", date: "03/04/2026", amount: 1200 },
      { id: 3, label: "Restaurant Bill (Room 101)", date: "03/04/2026", amount: 850 },
    ],
  },
  {
    room: "103",
    guest: "Mathew Hyden",
    checkIn: "2026-04-02",
    checkOut: "2026-04-04",
    rate: 1200,
    extras: [
      { id: 4, label: "Mini-bar (Chips)", date: "03/04/2026", amount: 50 },
      { id: 5, label: "Restaurant Bill (Room 103)", date: "03/04/2026", amount: 1200 },
    ],
  },
];

/** Room charge + every extra for one stay. */
function stayTotal(stay) {
  const nights = calculateNights(stay.checkIn, stay.checkOut);
  const roomCharge = calculateTotal(nights, stay.rate);
  const extras = stay.extras.reduce((sum, item) => sum + item.amount, 0);
  return roomCharge + extras;
}

export default function GuestCheckOut() {
  const [stays, setStays] = useState(initialStays);
  const [selectedRooms, setSelectedRooms] = useState(["101"]);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [note, setNote] = useState("");

  // A room is either in the selected list or not. Clicking toggles it.
  function toggleRoom(room) {
    setSelectedRooms((current) =>
      current.includes(room)
        ? current.filter((item) => item !== room)
        : [...current, room]
    );
    setNote("");
  }

  function addExtra(room, label, amount) {
    setStays((current) =>
      current.map((stay) =>
        stay.room === room
          ? {
              ...stay,
              extras: [
                ...stay.extras,
                { id: Date.now(), label, date: "03/04/2026", amount },
              ],
            }
          : stay
      )
    );
  }

  const amountDue = stays
    .filter((stay) => selectedRooms.includes(stay.room))
    .reduce((sum, stay) => sum + stayTotal(stay), 0);

  function handleCheckout() {
    if (selectedRooms.length === 0) {
      setNote("Select at least one room to check out.");
      return;
    }
    setNote(
      `Payment of ${formatCurrency(amountDue)} recorded by ${paymentMethod}. Rooms ${selectedRooms.join(", ")} checked out.`
    );
  }

  return (
    <div className="page checkout">
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
        <h1 className="page__title">Guest Check-out</h1>
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

      <main className="page__body checkout__grid">
        {/* ---------------- Panel 1 ---------------- */}
        <section className="panel">
          <h2 className="panel__head">1. Identify Departing Guest</h2>
          <div className="panel__body">
            <div className="identify">
              <div className="field">
                <label htmlFor="find-guest">Find Guest</label>
                <select id="find-guest" defaultValue="">
                  <option value="">Search Guest</option>
                  <option>Mathew Hyden</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="identify-room">Identify by Room</label>
                <input id="identify-room" type="number" defaultValue={1} min={1} />
              </div>

              <div className="field">
                <label htmlFor="guest-list">Select Guest from List</label>
                <select id="guest-list" defaultValue="">
                  <option value="">Select Guest from List</option>
                  <option>Mathew Hyden</option>
                </select>
              </div>

              <button type="button" className="btn btn--primary identify__find">
                Find Room/Guest
              </button>
            </div>

            <div className="guest-meta">
              <div>
                <span>Guest Name</span>
                <strong>Mathew Hyden</strong>
              </div>
              <div>
                <span>Room No.</span>
                <span className="room-chip">🛏 101</span>
              </div>
            </div>

            <table className="stay-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Stay Dates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stays.map((stay) => (
                  <tr key={stay.room}>
                    <td>{stay.room}</td>
                    <td>02/04/2026-04/04/2026</td>
                    <td>
                      <label className="stay-table__check">
                        <input
                          type="checkbox"
                          checked={selectedRooms.includes(stay.room)}
                          onChange={() => toggleRoom(stay.room)}
                        />
                        Select for Check-out
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button type="button" className="btn btn--soft identify__change">
              ⌕ Add/Change Selected Rooms
            </button>
          </div>
        </section>

        {/* ---------------- Panel 2 ---------------- */}
        <section className="panel">
          <h2 className="panel__head">2. Review &amp; Finalize Bill</h2>
          <div className="panel__body">
            {stays.map((stay) => {
              const nights = calculateNights(stay.checkIn, stay.checkOut);
              return (
                <div className="bill" key={stay.room}>
                  <div className="bill__head">
                    <h3>[Room {stay.room}]</h3>
                    <button type="button" className="btn btn--soft">
                      🖶 Print Draft Invoice
                    </button>
                    <button type="button" className="btn btn--soft">
                      ⇄ Adjust Charges
                    </button>
                  </div>

                  <p className="bill__sub">
                    (Nights: {nights}, Rate: {formatCurrency(stay.rate)}, Total:{" "}
                    {formatCurrency(calculateTotal(nights, stay.rate))})
                  </p>

                  <p className="bill__label">Additional Charges (Add Items)</p>
                  <div className="bill__add">
                    <div className="page__search bill__search">
                      <span className="icon">⌕</span>
                      <input
                        type="search"
                        aria-label={`Search or add charges for room ${stay.room}`}
                        placeholder="Search/Add Additional Charges"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => addExtra(stay.room, "Mini-bar", 100)}
                    >
                      Mini-bar
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => addExtra(stay.room, "Laundry", 250)}
                    >
                      Laundry
                    </button>
                    <button
                      type="button"
                      className="btn btn--soft bill__plus"
                      aria-label={`Add charge to room ${stay.room}`}
                      onClick={() => addExtra(stay.room, "Extra item", 150)}
                    >
                      +
                    </button>
                  </div>

                  <table className="charge-table">
                    <thead>
                      <tr>
                        <th>Room Charges &amp; External Bills</th>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stay.extras.map((item) => (
                        <tr key={item.id}>
                          <td>{item.label}</td>
                          <td>{item.date}</td>
                          <td>{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="bill__total">
                    <span>Room {stay.room} Total</span>
                    <strong>{formatCurrency(stayTotal(stay))}</strong>
                  </div>

                  <div className="bill__foot">
                    <button type="button" className="btn btn--soft">
                      🖶 Print Room {stay.room} Invoice
                    </button>
                    <button type="button" className="btn btn--soft">
                      ⇄ Adjust Charges (Room {stay.room})
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="bill__grand">
              Selected Rooms Combined Total: {formatCurrency(amountDue)}
            </div>
          </div>
        </section>

        {/* ---------------- Panel 3 ---------------- */}
        <section className="panel">
          <h2 className="panel__head">3. Payment &amp; Check-out</h2>
          <div className="panel__body">
            <div className="due">
              <div>
                <span>Total Amount Due</span>
                <small>(Selected Rooms)</small>
              </div>
              <div className="due__values">
                <strong>{formatCurrency(amountDue)}</strong>
                <span>{formatCurrency(0)}</span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="payment-method">Payment Method</label>
              <select
                id="payment-method"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                <option>Credit Card</option>
                <option>Cash</option>
                <option>M-Pay</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="payment-amount">Payment Amount</label>
              <input id="payment-amount" readOnly value={formatCurrency(amountDue)} />
            </div>

            {note && <p className="message message--info">{note}</p>}

            <button type="button" className="btn btn--primary pay__main" onClick={handleCheckout}>
              <span>Process Payment &amp; Check-out</span>
              <small>Proceed with Room {selectedRooms[0] || "—"} Check-out</small>
              <small>Complete Check-out</small>
            </button>

            <button type="button" className="btn btn--primary pay__main" onClick={handleCheckout}>
              <span>Payment &amp; Check-out</span>
              <small>Combine and Proceed with</small>
              <small>Selected Rooms Check-out</small>
            </button>

            <div className="pay__foot">
              <button type="button" className="btn btn--soft">Print Final Invoice</button>
              <button type="button" className="btn btn--soft">Email Final Invoice</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
