import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, BookOpen, Clock, CheckCircle, Bell, Search, Camera, Video, Mic, Plus, LogOut, Copy, UserPlus, X } from 'lucide-react';

// Enhanced Mock Data including user requirements
const INITIAL_TUTORS = [
  { id: 1, name: 'Siva Charan', subject: 'Java', rate: 55, bio: 'Expert Java Developer. Specializing in Spring Boot and High-Level Architectures.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 2, name: 'Varsith', subject: 'Python', rate: 45, bio: 'Data Science enthusiast and Python expert. Passionate about AI/ML.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  { id: 3, name: 'Dr. Sarah Chen', subject: 'Advanced Mathematics', rate: 60, bio: 'PhD in Applied Math. 10+ years teaching experience.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
];

const App = () => {
  const [user, setUser] = useState(null); // { email: '...', role: '...' }
  const [view, setView] = useState('login'); // login, home, tutors, dashboard, session, add-tutor
  const [tutors, setTutors] = useState(INITIAL_TUTORS);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sessionCode, setSessionCode] = useState('');
  
  // WebRTC Local Stream Ref
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === 'sample123@gmail.com' && password === '123456') {
      setUser({ email, name: 'Sample User', role: 'STUDENT' });
      setView('home');
      setNotifications([{ id: Date.now(), message: 'Welcome back, Sample User!', time: 'Just now' }]);
    } else {
      alert('Invalid credentials. Use sample123@gmail.com / 123456');
    }
  };

  const handleAddTutor = (e) => {
    e.preventDefault();
    const newTutor = {
      id: Date.now(),
      name: e.target.name.value,
      subject: e.target.subject.value,
      rate: e.target.rate.value,
      bio: e.target.bio.value,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
    };
    setTutors([newTutor, ...tutors]);
    setView('tutors');
    setNotifications([{ id: Date.now(), message: `Successfully added tutor: ${newTutor.name}`, time: 'Just now' }, ...notifications]);
  };

  const startSession = (bookingId) => {
    const code = Math.floor(100000 + Math.random() * 900000);
    setSessionCode(code);
    setView('session');
    
    // Access Camera
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(s => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(err => console.error("Camera access denied:", err));
  };

  const stopSession = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setView('dashboard');
  };

  return (
    <div className="fade-in">
      {view !== 'login' && view !== 'session' && (
        <nav>
          <div className="logo" onClick={() => setView('home')} style={{cursor: 'pointer'}}>TutorLink</div>
          <div className="nav-links">
            <a href="#" onClick={() => setView('tutors')}>Tutors</a>
            <a href="#" onClick={() => setView('add-tutor')}>Add Tutor</a>
            <a href="#" onClick={() => setView('dashboard')}>Dashboard</a>
            <button className="btn btn-outline" style={{ marginLeft: '1rem' }} onClick={() => setUser(null) || setView('login')}>
              <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Sign Out
            </button>
          </div>
        </nav>
      )}

      <main>
        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Login</h1>
                <p style={{ color: '#888' }}>Access your TutorLink account</p>
              </div>
              <form onSubmit={handleLogin}>
                <label>Email Address</label>
                <input name="email" type="email" placeholder="sample123@gmail.com" required />
                <label>Password</label>
                <input name="password" type="password" placeholder="123456" required />
                <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>Sign In</button>
              </form>
            </motion.div>
          )}

          {view === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container">
              <h1>Welcome, {user?.name}</h1>
              <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2.5rem', maxWidth: '600px' }}>
                Manage your sessions, discover new tutors, and elevate your learning experience.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn" onClick={() => setView('tutors')}>Find Tutors</button>
                <button className="btn btn-outline" onClick={() => setView('dashboard')}>View Dashboard</button>
              </div>
            </motion.div>
          )}

          {view === 'tutors' && (
            <motion.div key="tutors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Expert Tutors</h2>
                <button className="btn btn-outline" onClick={() => setView('add-tutor')}>
                  <Plus size={16} /> Add Tutor
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {tutors.map((t) => (
                  <div key={t.id} className="card fade-in">
                    <img src={t.image} alt={t.name} style={{ width: '100%', height: '220px', objectFit: 'cover', marginBottom: '1.5rem', filter: 'grayscale(1)' }} />
                    <h3>{t.name}</h3>
                    <p style={{ color: '#888', fontWeight: '600' }}>{t.subject}</p>
                    <p style={{ fontSize: '0.9rem', color: '#555', margin: '1rem 0' }}>{t.bio}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700' }}>${t.rate}/hr</span>
                      <button className="btn" onClick={() => { setBookings([{ id: Date.now(), tutorName: t.name, subject: t.subject, time: 'Today, 2:00 PM', status: 'Upcoming' }, ...bookings]); setView('dashboard'); }}>Book Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'add-tutor' && (
            <motion.div key="add-tutor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ maxWidth: '600px' }}>
              <h2>Add New Tutor</h2>
              <form onSubmit={handleAddTutor} style={{ marginTop: '2rem' }}>
                <label>Full Name</label>
                <input name="name" placeholder="e.g. Siva Charan" required />
                <label>Subject Expertise</label>
                <input name="subject" placeholder="e.g. Java, Python" required />
                <label>Hourly Rate ($)</label>
                <input name="rate" type="number" placeholder="45" required />
                <label>Professional Bio</label>
                <textarea name="bio" rows="4" placeholder="Briefly describe your experience..." required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setView('tutors')}>Cancel</button>
                  <button type="submit" className="btn">Add Tutor Profile</button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container">
              <h2>Your Learning Dashboard</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', marginTop: '2rem' }}>
                <div>
                  <h3 style={{ marginBottom: '1.5rem' }}>Upcoming Sessions</h3>
                  {bookings.map(b => (
                    <div key={b.id} className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{b.tutorName}</strong>
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>{b.subject} • {b.time}</div>
                      </div>
                      <button className="btn" onClick={() => startSession(b.id)}>Join Room</button>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <h3>Recent Notifications</h3>
                  <div style={{ marginTop: '1.5rem' }}>
                    {notifications.length === 0 ? <p style={{ color: '#888' }}>No new notifications.</p> : notifications.map(n => (
                      <div key={n.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.9rem' }}>{n.message}</div>
                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'session' && (
            <motion.div key="session" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: '100vh', background: 'black', color: 'white', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'white' }}>Live Session: {sessionCode}</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }} onClick={() => { navigator.clipboard.writeText(`http://tutorlink.app/session/${sessionCode}`); alert('Invite link copied!'); }}>
                    <UserPlus size={16} style={{ marginRight: '0.5rem' }} /> Invite Others
                  </button>
                  <button className="btn" style={{ background: '#ff4444', border: 'none' }} onClick={stopSession}>End Session</button>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem', height: 'calc(100% - 150px)' }}>
                <div style={{ background: '#111', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
                  <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
                    You (Sample User)
                  </div>
                </div>
                <div style={{ background: '#111', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ marginBottom: '1rem' }}>Participants</h4>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ width: '32px', height: '32px', background: '#333', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>S</div>
                      <span>Sample User (Host)</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                    <Mic size={24} style={{ cursor: 'pointer', color: '#888' }} />
                    <Video size={24} style={{ cursor: 'pointer', color: '#888' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
