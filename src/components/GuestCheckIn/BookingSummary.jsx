import { formatCurrency, formatDate } from "../../utils/bookingUtils";

/**
 * Shows the money and the stay details.
 * It receives numbers that are already calculated — it never does maths itself.
 * When something is missing it shows an instruction instead of blank or NaN.
 */
export default function BookingSummary({
  room,
  checkIn,
  checkOut,
  nights,
  total,
  isReady,
  onConfirm,
  confirmed,
}) {
  if (!isReady) {
    return (
      <p className="summary__empty">
        Select dates and a room to see your booking summary.
      </p>
    );
  }

  return (
    <div className="summary">
      <dl className="summary__list">
        <div>
          <dt>Room</dt>
          <dd>{room.code}</dd>
        </div>
        <div>
          <dt>Room type</dt>
          <dd>{room.type}</dd>
        </div>
        <div>
          <dt>Check-in</dt>
          <dd>{formatDate(checkIn)}</dd>
        </div>
        <div>
          <dt>Check-out</dt>
          <dd>{formatDate(checkOut)}</dd>
        </div>
        <div>
          <dt>Nights</dt>
          <dd>{nights}</dd>
        </div>
        <div>
          <dt>Price per night</dt>
          <dd>{formatCurrency(room.price)}</dd>
        </div>
      </dl>

      <div className="summary__total">
        <span>Total Amount:</span>
        <strong>{formatCurrency(total)}</strong>
      </div>

      {confirmed && (
        <p className="message message--success">
          Check-in confirmed for room {room.code}.
        </p>
      )}

      <button type="button" className="btn btn--primary summary__cta" onClick={onConfirm}>
        Complete Check-in
      </button>

      <div className="summary__row">
        <button type="button" className="btn btn--soft">Get Data</button>
        <button type="button" className="btn btn--soft">M-Pay</button>
        <button type="button" className="btn btn--soft">Print</button>
      </div>

      <button type="button" className="btn btn--soft summary__wide">
        Print Registration Card
      </button>
      <button type="button" className="btn btn--soft summary__wide">
        Download Folio
      </button>
    </div>
  );
}
