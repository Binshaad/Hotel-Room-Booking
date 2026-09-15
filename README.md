# Hotel Room Booking

A small hotel front-desk app I built for a React coding test. It has three screens: a dashboard, a guest check-in screen where you actually book a room, and a guest check-out screen where you settle the bill.

Everything runs in the browser. There is no backend and no database, so the rooms and the existing bookings are kept in two small files inside the project.

## Technology

- React
- Vite  (a fast development server and build tool for React)
- JavaScript (JSX)
- Plain CSS
- React Router for moving between the three pages
- Vitest for the unit tests



## Features

Main requirements:

- Shows the list of hotel rooms with type, price and how many guests each one holds
- Check-in and check-out date pickers
- Only one room can be selected at a time, and the selected room is highlighted
- Counts the number of nights
- Works out the total price
- Stops check-in dates in the past
- Stops a check-out date that is the same as or before the check-in date
- Tells you clearly when a date or a room is missing
- Shows a booking summary once the dates and the room are chosen
- All the booking rules live in one file, away from the screens



## How to run

```
npm install
npm run dev
```

Vite prints a local address, usually http://localhost:5173.

## Project structure

```
src/
  components/
    Dashboard/       the main dashboard screen
    GuestCheckIn/    the booking screen, split into small pieces
    GuestCheckOut/   the billing and check-out screen
  data/
    rooms.js         the five rooms
    bookings.js      bookings that already exist in the hotel
  utils/
    bookingUtils.js  nights, totals, validation, availability
    bookingUtils.test.js
  App.jsx            the three routes
  main.jsx           starts the app
```

The important idea is that `bookingUtils.js` holds the rules and does no drawing, and the components draw things but do no maths of their own.

## A note on dates

JavaScript dates are easy to get wrong. A date typed into a date input arrives as a string like `2026-09-20`, and depending on how you turn that into a `Date` object you can end up a few hours off and lose or gain a night. So every date in this project goes through one function that builds it at UTC midnight, and all the comparisons happen on those. Nights are counted as whole calendar days, never from the current time.

The overlap rule follows normal hotel behaviour: a stay ends on the morning of its check-out day, so somebody else can check in that same day. A booking from 20 Sep to 23 Sep leaves 23 Sep free for the next guest.


