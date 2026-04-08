import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Bike, Truck, Plus, LogOut, Info, CheckCircle2, AlertCircle, Clock, CreditCard } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [slots, setSlots] = useState({ limits: {}, available: {}, parkedCount: 0 });
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [exitKey, setExitKey] = useState(''); // ID or Vehicle Number
  const [message, setMessage] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/slots`);
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to fetch status", err);
    }
  };

  const handlePark = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/park`, { vehicleNumber, vehicleType });
      setMessage({ type: 'success', text: `Access Granted! Ticket ID: ${res.data.ticketId}` });
      setVehicleNumber('');
      fetchStatus();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || "Failed to park" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleExit = async (e) => {
    e.preventDefault();
    if (!exitKey) return;
    setLoading(true);
    try {
      const payload = isNaN(exitKey) ? { vehicleNumber: exitKey } : { ticketId: exitKey };
      const res = await axios.post(`${API_BASE}/exit`, payload);
      setReceipt(res.data);
      setExitKey('');
      fetchStatus();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || "Vehicle not found" });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const TypeIcon = ({ type, size = 24 }) => {
    if (type === 'Bike') return <Bike size={size} />;
    if (type === 'Truck') return <Truck size={size} />;
    return <Car size={size} />;
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
          ParkEase
        </motion.h1>
        <p style={{ color: 'var(--text-dim)' }}>Premium Parking Management System</p>
      </header>

      {/* Dashboard Section */}
      <section className="grid grid-3" style={{ marginBottom: '3rem' }}>
        {Object.keys(slots.limits).map(type => (
          <motion.div 
            key={type}
            whileHover={{ scale: 1.02 }}
            className="glass-card" 
            style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: `rgba(var(--${type.toLowerCase()}), 0.1)`, color: `var(--${type.toLowerCase()})` }}>
                <TypeIcon type={type} size={32} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{slots.available[type]} <span style={{ fontSize: '0.875rem', color: 'var(--text-dim)', fontWeight: 400 }}>/ {slots.limits[type]} Left</span></span>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{type} Slots</h3>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(1 - slots.available[type] / slots.limits[type]) * 100}%` }}
                style={{ height: '100%', borderRadius: '3px', background: `var(--${type.toLowerCase()})` }} 
              />
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid grid-2">
        {/* Park Entry Form */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <Plus className="text-primary" />
            <h2 style={{ fontSize: '1.5rem' }}>Entry Gate</h2>
          </div>
          <form onSubmit={handlePark}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Vehicle Number</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. MH 12 AB 1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                required
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label>Vehicle Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {['Bike', 'Car', 'Truck'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setVehicleType(t)}
                    className={`btn ${vehicleType === t ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '0.5rem' }}
                  >
                    <TypeIcon type={t} size={18} />
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Processing...' : 'Generate Ticket'}
            </button>
          </form>
        </div>

        {/* Exit Gate Form */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <LogOut style={{ color: 'var(--danger)' }} />
            <h2 style={{ fontSize: '1.5rem' }}>Exit Gate</h2>
          </div>
          <form onSubmit={handleExit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Ticket ID or Vehicle Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="ID or Plate #"
                  value={exitKey}
                  onChange={(e) => setExitKey(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                <Info size={14} />
                <span>Pricing starts from ₹30 for up to 3h</span>
              </div>
            </div>
            <button type="submit" className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--danger)', color: 'var(--danger)' }} disabled={loading}>
              Process Checkout
            </button>
          </form>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}
            className={`glass-card`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {message.type === 'success' ? <CheckCircle2 color="var(--success)" /> : <AlertCircle color="var(--danger)" />}
              <p>{message.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {receipt && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 1000 }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card" 
              style={{ maxWidth: '400px', width: '100%', border: '2px solid var(--primary)' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', marginBottom: '1rem' }}>
                  <CheckCircle2 size={48} />
                </div>
                <h2>Payment Successful</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div className="receipt-row"><span>Vehicle:</span> <strong>{receipt.vehicleNumber}</strong></div>
                <div className="receipt-row"><span>Ticket ID:</span> <strong>#{receipt.ticketId}</strong></div>
                <div className="receipt-row"><span>Stay Duration:</span> <strong>{receipt.durationHours} hrs</strong></div>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                <div className="receipt-row" style={{ fontSize: '1.25rem' }}>
                  <span>Total Amount:</span> 
                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>₹{receipt.amountCharged}</span>
                </div>
              </div>

              <button onClick={() => setReceipt(null)} className="btn btn-primary" style={{ width: '100%' }}>Done</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .receipt-row { display: flex; justify-content: space-between; }
        .receipt-row span { color: var(--text-dim); }
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}

export default App;
