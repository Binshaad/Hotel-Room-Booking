import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

/**
 * The 12 tiles in the top grid.
 * Only the first two have a `route`. A tile with a route navigates,
 * every other tile only shows a selected state.
 */
const tiles = [
  { id: "check-in", label: "Guest Check-in", glyph: "⤓", tint: "green", route: "/check-in" },
  { id: "check-out", label: "Guest Check-Out", glyph: "⤒", tint: "pink", route: "/check-out" },
  { id: "reservations", label: "Reservations", glyph: "▤", tint: "blue" },
  { id: "housekeeping", label: "Housekeeping", glyph: "❖", tint: "teal" },
  { id: "restaurant", label: "Restaurant", glyph: "✦", tint: "orange" },
  { id: "whatsapp", label: "WhatsApp", glyph: "✆", tint: "green" },
  { id: "rooms", label: "Rooms", glyph: "▥", tint: "purple" },
  { id: "staff", label: "Staff", glyph: "☰", tint: "indigo", badge: "2 tasks" },
  { id: "floors", label: "Floors", glyph: "≣", tint: "teal" },
  { id: "reports", label: "Reports", glyph: "▮", tint: "yellow" },
  { id: "settings", label: "Settings", glyph: "⚙", tint: "grey" },
  { id: "group", label: "New: Group Booking", glyph: "☺", tint: "grey" },
];

/** Room tiles for the floor view. Status decides the colour. */
const floorOne = [
  ["101", "available"], ["102", "available"], ["103", "available"], ["104", "available"],
  ["105", "available"], ["106", "available"], ["107", "available"], ["108", "available"],
  ["109", "available"], ["110", "available"], ["111", "available"], ["112", "available"],
  ["113", "available"], ["114", "available"], ["115", "available"], ["116", "available"],
  ["101", "available"], ["102", "occupied"], ["103", "occupied"], ["104", "dirty"],
  ["105", "dirty"], ["106", "maintenance"], ["107", "maintenance"], ["102", "available"],
  ["103", "available"], ["104", "available"], ["104", "occupied"], ["105", "occupied"],
  ["106", "available"], ["107", "available"], ["108", "available"], ["109", "occupied"],
  ["190", "maintenance"],
];

const floorTwo = [
  ["201", "available"], ["202", "available"], ["203", "available"], ["204", "available"],
  ["205", "maintenance"], ["210", "available"], ["207", "available"], ["202", "available"],
  ["203", "available"], ["205", "maintenance"], ["210", "available"], ["211", "available"],
  ["212", "available"], ["213", "available"], ["214", "available"], ["215", "available"],
  ["216", "available"], ["201", "available"], ["102", "available"], ["103", "available"],
  ["204", "available"], ["105", "available"], ["106", "available"], ["207", "available"],
  ["202", "occupied"], ["203", "available"], ["204", "available"], ["205", "maintenance"],
  ["206", "available"], ["206", "available"], ["207", "available"], ["208", "available"],
  ["209", "available"], ["210", "available"], ["201", "available"], ["202", "available"],
  ["203", "available"], ["204", "available"], ["205", "available"], ["206", "blocked"],
  ["207", "available"], ["208", "available"], ["209", "available"], ["230", "available"],
  ["201", "available"], ["202", "available"], ["203", "occupied"], ["204", "available"],
  ["205", "available"], ["206", "dirty"],
];

const sideFloorOne = [
  ["101", "available"], ["102", "available"], ["103", "available"], ["104", "available"],
  ["105", "available"], ["106", "available"], ["101", "available"], ["102", "occupied"],
  ["103", "occupied"], ["104", "dirty"], ["105", "dirty"], ["106", "available"],
];

const sideFloorTwo = [
  ["201", "available"], ["202", "available"], ["203", "available"], ["204", "available"],
  ["205", "maintenance"], ["210", "blocked"], ["101", "available"], ["102", "available"],
  ["103", "available"], ["104", "available"], ["105", "available"], ["106", "available"],
];

const legend = [
  ["available", "Available"],
  ["occupied", "Occupied"],
  ["dirty", "Dirty"],
  ["maintenance", "Maintenance"],
  ["blocked", "Blocked"],
];

function RoomGrid({ label, cells, columns }) {
  return (
    <div className="floor-row">
      <span className="floor-row__label">{label}</span>
      <div className="floor-row__grid" style={{ "--cols": columns }}>
        {cells.map(([number, status], index) => (
          <button
            key={`${number}-${index}`}
            type="button"
            className={`room-tile room-tile--${status}`}
            title={`Room ${number} — ${status}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  // useNavigate gives us a function that changes the URL in code,
  // which is what we need inside a button's onClick.
  const navigate = useNavigate();

  // Which non-navigating tile is currently selected. null = none.
  const [selectedTile, setSelectedTile] = useState(null);

  function handleTileClick(tile) {
    if (tile.route) {
      navigate(tile.route);
      return;
    }
    // Clicking the same tile again clears it, so selection is always visible and reversible.
    setSelectedTile((current) => (current === tile.id ? null : tile.id));
  }

  return (
    <div className="page dashboard">
      <header className="topbar">
        <div className="topbar__logo">▦</div>

        <div className="topbar__property">
          <span className="topbar__avatar" />
          <span>
            <strong>Raintech</strong>
            <small>HOTEL</small>
          </span>
          <span className="topbar__switch">⇅</span>
        </div>

        <div className="topbar__search">
          <span className="icon">⌕</span>
          <input
            type="search"
            aria-label="Search guests, rooms, reservations, staff"
            placeholder="Search guests, rooms, reservations, staff..."
          />
          <span className="topbar__shortcut">Ctrl+ K</span>
        </div>

        <div className="topbar__date">🗓 Thu, Jul 23, 2026 | 9:30 AM</div>
        <button type="button" className="btn btn--primary topbar__actions">
          $ Quick Actions
        </button>
        <button type="button" className="topbar__icon" aria-label="Notifications">
          ♪
        </button>
        <span className="topbar__user" />
      </header>

      <main className="page__body">
        <h1 className="dashboard__title">Main Dashboard</h1>

        <section className="dashboard__top">
          <div className="tile-grid">
            {tiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                className={`tile ${selectedTile === tile.id ? "tile--selected" : ""}`}
                aria-pressed={tile.route ? undefined : selectedTile === tile.id}
                onClick={() => handleTileClick(tile)}
              >
                {tile.badge && <span className="tile__badge">{tile.badge}</span>}
                <span className={`tile__icon tile__icon--${tile.tint}`}>{tile.glyph}</span>
                <span className="tile__label">{tile.label}</span>
              </button>
            ))}
          </div>

          <div className="card overview">
            <h2 className="overview__title">Operational Overview</h2>
            <div className="overview__grid">
              <div className="stat stat--blue">
                <span className="stat__label">Occupancy</span>
                <strong className="stat__value">4%</strong>
              </div>
              <div className="stat">
                <span className="stat__label">Pending Check-ins</span>
                <strong className="stat__value">0</strong>
              </div>
              <div className="stat">
                <span className="stat__label">Pending Departures</span>
                <strong className="stat__value">0</strong>
              </div>
              <div className="stat stat--green">
                <span className="stat__label">Revenue Today</span>
                <strong className="stat__value">₹0</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="card floorview">
          <h2 className="floorview__title">Room Status - Interactive Floor View</h2>
          <p className="floorview__sub">50 rooms across your property</p>

          <div className="floorview__body">
            <div className="floorview__main">
              <RoomGrid label="Floor 1" cells={floorOne} columns={16} />
              <RoomGrid label="Floor 2" cells={floorTwo} columns={16} />
            </div>

            <div className="floorview__side">
              <RoomGrid label="Floor 1" cells={sideFloorOne} columns={6} />
              <RoomGrid label="Floor 2" cells={sideFloorTwo} columns={6} />
            </div>

            <div className="floorview__donut">
              <div className="donut">
                <strong>200</strong>
                <small>Rooms Total</small>
              </div>
              <p className="donut__caption">4% Occupied</p>
            </div>
          </div>

          <div className="legend">
            {legend.map(([status, label]) => (
              <span key={status} className="legend__item">
                <i className={`legend__dot legend__dot--${status}`} />
                {label}
              </span>
            ))}
          </div>
          <p className="floorview__hint">Clicking a room tile opens its quick-edit menu</p>
        </section>

        <section className="dashboard__bottom">
          <div className="card vacate">
            <h2 className="vacate__title">🛏 Going to Vacate Rooms</h2>
            <div className="vacate__grid">
              <article className="vacate__item">
                <div className="vacate__photo" />
                <div>
                  <strong>Room 101</strong>
                  <p>Departing · Guest</p>
                  <p>Check-Out Scheduled</p>
                </div>
              </article>

              <article className="vacate__item">
                <div className="vacate__photo vacate__photo--alt" />
                <div>
                  <strong>Room 102</strong>
                  <p>Departing · Guest</p>
                  <p>Checkout: 11:00 AM</p>
                </div>
              </article>

              <article className="vacate__status">
                <div className="vacate__status-head">
                  <span className="vacate__pill">⇥</span>
                  <span className="vacate__percent">0%</span>
                </div>
                <p>Departing</p>
                <strong className="vacate__count">0</strong>
                <p className="vacate__note">
                  🟠 Room 101 cleaning overdue (0:00...)
                </p>
                <small>Cleanerators</small>
              </article>
            </div>
          </div>

          <div className="card quick">
            <h2 className="quick__title">Quick Room Status Changer &amp; Actions</h2>
            <div className="quick__body">
              <div className="field">
                <label htmlFor="quick-room">Room #</label>
                <select id="quick-room" defaultValue="">
                  <option value="">—</option>
                  <option>101</option>
                  <option>102</option>
                  <option>103</option>
                </select>
                <small className="quick__hint">Enter number</small>
              </div>
              <button type="button" className="btn quick__ready">
                🧹 Cleaning done, ready to serve
              </button>
              <button type="button" className="btn quick__dirty">
                Set all Dirty to Cleaning
              </button>
              <button type="button" className="btn btn--ghost">
                View All Maintenance
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
