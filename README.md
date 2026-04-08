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

## 🌍 Deployment (Render.com Free Tier)

This project is now optimized for Render's free tier using **PostgreSQL**:

1. **Database Setup**: 
   - Create a free account at **[Neon.tech](https://neon.tech)** or **[Supabase](https://supabase.com)**.
   - Create a new project and copy your **Connection String** (`postgres://...`).
2. **Deploy on Render**:
   - Sign up at [Render.com](https://render.com).
   - Click **"New"** > **"Web Service"** and connect your GitHub repo.
   - **Settings**:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
3. **Environment Variables**:
   - Go to **Environment** in Render.
   - Add a secret: `DATABASE_URL` = (Your Connection String from step 1).

## 📦 Local Setup

1. **Install Dependencies**: `npm install`
2. **env File**: Create a `.env` in the root with `DATABASE_URL=your_postgres_url`.
3. **Build & Start**: `npm run build && npm start`

## 📦 Local Setup

1. **Install Dependencies**: `npm install`
2. **Build**: `npm run build`
3. **Start**: `npm start`

## ⚙️ Assumptions
- **Fixed slots**: Bike: 5, Car: 5, Truck: 2.
- **Database**: Uses a local SQLite file (`backend/parking.db`).

## 📄 License
MIT
