const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const SLOT_LIMITS = {
  Bike: 5,
  Car: 5,
  Truck: 2
};

const PRICING = [
  { maxHours: 3, charge: 30 },
  { maxHours: 6, charge: 85 },
  { maxHours: Infinity, charge: 120 }
];

// Helper: Calculate amount based on duration (hours)
function calculateCharge(hours) {
  const roundedHours = Math.ceil(hours);
  if (roundedHours <= 3) return 30;
  if (roundedHours <= 6) return 85;
  return 120;
}

// GET /api/slots - Current availability
app.get('/api/slots', (req, res) => {
  const currentParked = db.prepare("SELECT vehicle_type, count(*) as count FROM parkings WHERE status = 'parked' GROUP BY vehicle_type").all();
  
  const availability = { ...SLOT_LIMITS };
  currentParked.forEach(row => {
    availability[row.vehicle_type] -= row.count;
  });

  res.json({
    limits: SLOT_LIMITS,
    available: availability,
    parkedCount: currentParked.reduce((acc, row) => acc + row.count, 0)
  });
});

// POST /api/park - Register vehicle
app.post('/api/park', (req, res) => {
  const { vehicleNumber, vehicleType } = req.body;

  if (!vehicleNumber || !vehicleType || !SLOT_LIMITS[vehicleType]) {
    return res.status(400).json({ error: 'Invalid vehicle details' });
  }

  // Check availability
  const countStmt = db.prepare("SELECT count(*) as count FROM parkings WHERE vehicle_type = ? AND status = 'parked'");
  const currentCount = countStmt.get(vehicleType).count;

  if (currentCount >= SLOT_LIMITS[vehicleType]) {
    return res.status(400).json({ error: 'Parking Full' });
  }

  // Insert entry
  const insertStmt = db.prepare("INSERT INTO parkings (vehicle_number, vehicle_type) VALUES (?, ?)");
  const result = insertStmt.run(vehicleNumber, vehicleType);

  res.json({
    ticketId: result.lastInsertRowid,
    vehicleNumber,
    vehicleType,
    entryTime: new Date().toISOString()
  });
});

// POST /api/exit - Calculate fee and checkout
app.post('/api/exit', (req, res) => {
  const { ticketId, vehicleNumber } = req.body;

  let query = "SELECT * FROM parkings WHERE status = 'parked' AND ";
  let params = [];
  if (ticketId) {
    query += "id = ?";
    params.push(ticketId);
  } else if (vehicleNumber) {
    query += "vehicle_number = ?";
    params.push(vehicleNumber);
  } else {
    return res.status(400).json({ error: 'Missing Ticket ID or Vehicle Number' });
  }

  const record = db.prepare(query).get(...params);

  if (!record) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const entryTime = new Date(record.entry_time);
  const exitTime = new Date();
  const durationMs = exitTime - entryTime;
  const durationHours = durationMs / (1000 * 60 * 60);

  const charge = calculateCharge(durationHours);

  // Update record
  db.prepare("UPDATE parkings SET exit_time = ?, amount_charged = ?, status = 'exited' WHERE id = ?")
    .run(exitTime.toISOString(), charge, record.id);

  res.json({
    ticketId: record.id,
    vehicleNumber: record.vehicle_number,
    entryTime: record.entry_time,
    exitTime: exitTime.toISOString(),
    durationHours: durationHours.toFixed(2),
    amountCharged: charge
  });
});

app.listen(PORT, () => console.log(`Parking Server running on port ${PORT}`));
