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

## 📦 Installation & Setup

### 1. Backend
```bash
cd backend
npm install
node index.js
```
Runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`.

## ⚙️ Assumptions
- **Fixed slots**: Bike: 5, Car: 5, Truck: 2.
- **Database**: Uses a local SQLite file (`backend/parking.db`).

## 📄 License
MIT
