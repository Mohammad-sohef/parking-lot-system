# ParkEase - Smart Parking Management System

A premium parking lot management system built with the MERN stack (Node.js, Express, React) and SQLite.

## 🚀 Features

- **Real-time Dashboard**: Monitor available slots for Bikes, Cars, and Trucks.
- **Entry Gate**: Generate tickets and register vehicles with license plate numbers.
- **Exit Gate**: Process checkouts using Ticket ID or Vehicle Number.
- **Dynamic Pricing**:
  - Up to 3 hours: ₹30
  - 3 to 6 hours: ₹85
  - More than 6 hours: ₹120
- **Slot Enforcement**: Automatically handles full parking states for each vehicle type.
- **Premium UI**: Glassmorphic design with smooth Framer Motion animations.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Lucide Icons, Framer Motion, Axios.
- **Backend**: Node.js, Express, better-sqlite3 (SQL).
- **Styling**: Vanilla CSS with modern aesthetics.

## 🌍 Deployment (Render.com)

This project is configured as a monolith for easy deployment:

1. **Create Account**: Sign up at [Render.com](https://render.com).
2. **New Web Service**: Connect your GitHub repository.
3. **Settings**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Persistence (Crucial)**:
   - Go to **Advanced**.
   - Add a **Disk**.
   - Name: `parking-db` | Mount Path: `/var/data` | Size: `1 GB`.
   - Add **Environment Variable**: `DB_PATH` = `/var/data/parking.db`.

## 📦 Local Setup

1. **Install Dependencies**: `npm install`
2. **Build**: `npm run build`
3. **Start**: `npm start`

## ⚙️ Assumptions
- **Fixed slots**: Bike: 5, Car: 5, Truck: 2.
- **Database**: Uses a local SQLite file (`backend/parking.db`).

## 📄 License
MIT
