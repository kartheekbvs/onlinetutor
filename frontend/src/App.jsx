import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Box, Layout, Shield, Zap, Globe, MessageSquare, Camera, Video, Plus, LogOut, ChevronRight, Code, Database, Server, Eye, EyeOff, Link, Bell, X, Mic, MicOff, VideoOff, Settings } from 'lucide-react';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:8080';
const socket = io(API_BASE);

const CODE_MAPPING = {
  login: { url: 'POST /api/auth/login', code: '// Node.js Express\napp.post("/api/auth/login", (req, res) => {\n  const user = validate(req.body);\n  res.json(user);\n});' },
  tutors: { url: 'GET /api/tutors', code: '// Node.js Express\napp.get("/api/tutors", (req, res) => {\n  const data = readData();\n  res.json(data.tutors);\n});' },
  booking: { url: 'POST /api/bookings', code: '// Node.js Express\napp.post("/api/bookings", (req, res) => {\n  const newBooking = { ...req.body, status: "PENDING" };\n  io.emit("new_booking", newBooking);\n  res.status(201).json(newBooking);\n});' },
  system: { url: 'GET /api/system/architecture', code: '// Node.js Express\napp.get("/api/system/architecture", (req, res) => {\n  res.json({ engine: "Node.js Express", realtime: "Socket.io" });\n});' }
};

const INITIAL_TUTORS = [
  { id: 1, name: 'Siva Charan', subject: 'Java Architecture', rate: 55, bio: 'Expert Java Developer. Specializing in Low-Level Threading & Spring Boot Internals.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 2, name: 'Varsith', subject: 'Python Data Science', rate: 45, bio: 'Machine Learning engineer. Expert in NumPy, Pandas, and Tensor Flow architectures.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
];

const VideoSession = ({ onEnd, tutorName }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [logs, setLogs] = useState(['[SYSTEM] Initializing RTC Handshake...', '[SYSTEM] Connection: P2P Tunnel Established']);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
        setLogs(prev => [...prev, '[MEDIA] Camera Stream: ACTIVE', '[MEDIA] Microphone: SYNCED']);
      } catch (err) {
        setLogs(prev => [...prev, '[ERROR] Camera Access Denied', '[WARN] Running in Simulation Mode']);
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(t => t.enabled = !t.enabled);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(t => t.enabled = !t.enabled);
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="session-container" style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 5000, display: 'flex', flexDirection: 'column' }}>
      <div className="bg-grid"></div>
      
      {/* Session Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 4rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,255,0.1)' }}>
        <div>
          <div style={{ color: '#0ff', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>LIVE SESSION ACTIVE</div>
          <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase' }}>Mentoring with {tutorName}</h2>
        </div>
        <button className="btn-mag" onClick={onEnd} style={{ borderColor: '#f00', color: '#f00' }}>END SESSION</button>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', padding: '2rem' }}>
        {/* Video Area */}
        <div className="card-3d" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 0 }}>
          {isVideoOff ? (
            <div style={{ fontSize: '5rem', color: '#333' }}><VideoOff size={100} /></div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div className="video-overlay" style={{ position: 'absolute', inset: 0 }}></div>
          
          {/* Controls Overlay */}
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1.5rem' }}>
             <button onClick={toggleMute} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '1px solid #333', background: isMuted ? '#f00' : 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
               {isMuted ? <MicOff /> : <Mic />}
             </button>
             <button onClick={toggleVideo} style={{ width: '60px', height: '60px', borderRadius: '50%', border: '1px solid #333', background: isVideoOff ? '#f00' : 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
               {isVideoOff ? <VideoOff /> : <Video />}
             </button>
             <button style={{ width: '60px', height: '60px', borderRadius: '50%', border: '1px solid #333', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
               <Settings />
             </button>
          </div>
        </div>

        {/* Audit/Trace Sidebar */}
        <div className="card-3d" style={{ background: 'rgba(0,0,0,0.5)', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#0ff', marginBottom: '2rem' }}>
            <Terminal size={18} />
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Session Trace</h3>
          </div>
          <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.75rem', color: '#666', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {logs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={log.includes('ERROR') ? 'trace-error' : ''}>
                 {log}
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.1)', borderRadius: '4px' }}>
             <div style={{ color: '#0ff', fontSize: '0.6rem', marginBottom: '0.5rem' }}>PEER STATUS</div>
             <div style={{ fontSize: '0.8rem' }}>Waiting for tutor to sync...</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const App = () => {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);
  const [tutors, setTutors] = useState(INITIAL_TUTORS);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('POST /api/auth/login');
  const [currentCode, setCurrentCode] = useState(CODE_MAPPING.login.code);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTutor, setActiveTutor] = useState(null);
  
  // Connect to Backend
  useEffect(() => {
    if (view === 'tutors' || view === 'home') {
      fetchTutors();
    }
    
    socket.on('new_booking', (booking) => {
      setNotifications(prev => [{ id: Date.now(), text: `New booking: ${booking.tutor || booking.name} for ${booking.subject || booking.subjects}` }, ...prev]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => Date.now() - n.id < 5000));
      }, 5000);
    });

    return () => socket.off('new_booking');
  }, [view]);

  const fetchTutors = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tutors`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      // Normalize data from Java/Node backends
      const normalized = Array.isArray(data) ? data.map(t => ({
        id: t.id,
        name: t.name || t.username,
        subject: t.subject || t.subjects || 'General Mentoring',
        rate: t.rate || t.hourlyRate || 0,
        bio: t.bio || 'Professional Mentor',
        image: t.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'
      })) : [];

      // Combine with initial tutors, avoiding duplicates by ID
      setTutors(prev => {
        const combined = [...prev];
        normalized.forEach(nTutor => {
          if (!combined.some(c => c.id === nTutor.id)) {
            combined.push(nTutor);
          }
        });
        return combined;
      });
    } catch (err) {
      console.error('Failed to fetch tutors:', err);
      // Keep initial tutors if fetch fails
    }
  };

  const updateSource = (key) => {
    if (CODE_MAPPING[key]) {
      setCurrentUrl(CODE_MAPPING[key].url);
      setCurrentCode(CODE_MAPPING[key].code);
    }
  };

  // Scroll Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [view]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (e.target.email.value === 'sample123@gmail.com' && e.target.password.value === '123456') {
      setUser({ name: 'Sample User' });
      setView('home');
      updateSource('system');
    } else {
      alert('Use sample123@gmail.com / 123456');
    }
  };

  const handleApplyTutor = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tutorData = {
      name: formData.get('name'),
      subject: formData.get('subj'),
      rate: Number(formData.get('rate')),
      bio: formData.get('bio')
    };

    try {
      const res = await fetch(`${API_BASE}/api/tutors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutorData)
      });
      if (res.ok) {
        fetchTutors();
        setView('tutors');
      }
    } catch (err) {
      alert('Failed to apply.');
    }
  };

  const handleBookSession = async (t) => {
    updateSource('booking');
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutor: t.name, subject: t.subject, student: user?.name })
      });
      if (res.ok) {
        const booking = await res.json();
        setBookings([...bookings, booking]);
      } else {
        // Fallback for demo when backend exists but returns error
        throw new Error('Backend error');
      }
    } catch (err) {
      console.warn('Booking fetch failed, proceeding in simulation mode:', err);
      // Simulate booking for immediate progression
      const mockBooking = { id: Date.now(), tutor: t.name, subject: t.subject, student: user?.name, status: 'SIMULATED' };
      setBookings([...bookings, mockBooking]);
    } finally {
      setActiveTutor(t.name);
      setView('session'); // Navigate to Room and Camera
    }
  };

  return (
    <div className="app-container">
      <div className="bg-grid"></div>

      {view === 'session' && (
        <VideoSession tutorName={activeTutor} onEnd={() => setView('tutors')} />
      )}

      {/* Notifications Portal */}
      <div style={{ position: 'fixed', top: '5rem', right: '4rem', zIndex: 3000, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} style={{ background: 'rgba(0, 255, 255, 0.9)', color: '#000', padding: '0.8rem 1.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 30px rgba(0,255,255,0.4)' }}>
              <Bell size={14} /> {n.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* source Mode Toggle */}
      <div style={{ position: 'fixed', top: '1.5rem', right: '4rem', zIndex: 2001, display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: isSourceMode ? '#0ff' : '#666' }}>SOURCE MODE</span>
        <div onClick={() => setIsSourceMode(!isSourceMode)} style={{ width: '50px', height: '24px', background: isSourceMode ? '#0ff' : '#222', borderRadius: '12px', position: 'relative', cursor: 'pointer', border: '1px solid #333' }}>
          <div style={{ width: '18px', height: '18px', background: isSourceMode ? '#000' : '#444', borderRadius: '50%', position: 'absolute', top: '2px', left: isSourceMode ? '28px' : '3px', transition: '0.3s' }}></div>
        </div>
      </div>

      {/* Source Code & URL Overlay */}
      <AnimatePresence>
        {isSourceMode && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} style={{ position: 'fixed', left: '2rem', top: '1.5rem', bottom: '2rem', width: '400px', background: 'rgba(0,0,0,0.95)', border: '1px solid #0ff', padding: '2rem', zIndex: 1999, overflowY: 'auto', boxShadow: '0 0 50px rgba(0,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#0ff', marginBottom: '2rem' }}>
              <Code size={18} />
              <h3 style={{ fontSize: '0.9rem' }}>ARCHITECTURAL LOGIC</h3>
            </div>
            
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.7rem', marginBottom: '0.5rem' }}><Link size={12} /> ENDPOINT URL</div>
                <div style={{ padding: '0.8rem', background: '#111', border: '1px solid #222', borderRadius: '4px', fontSize: '0.8rem', color: '#0ff', fontFamily: 'monospace' }}>{currentUrl}</div>
            </div>

            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.7rem', marginBottom: '0.5rem' }}><Server size={12} /> NODE EXERT SNIPPET</div>
                <pre style={{ padding: '1rem', background: '#080808', borderLeft: '3px solid #0ff', fontSize: '0.75rem', color: '#bbb', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                  {currentCode}
                </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container" style={{ maxWidth: '500px', padding: '15vh 0' }}>
            <div className="card-3d reveal active" style={{ padding: '4rem' }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Portal</h1>
              <form onSubmit={handleLogin}>
                <input name="email" type="email" placeholder="sample123@gmail.com" required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '1rem 0', width: '100%', marginBottom: '2rem', outline: 'none' }} />
                <input name="password" type="password" placeholder="123456" required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '1rem 0', width: '100%', marginBottom: '3rem', outline: 'none' }} />
                <button className="btn-mag" style={{ width: '100%' }}>Initialize Session</button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingLeft: isSourceMode ? '450px' : '0', transition: '0.5s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <nav style={{ paddingRight: '12rem' }}>
              <div className="logo" onClick={() => setView('home')}>TutorLink</div>
              <div className="nav-links">
                <a href="#" onClick={() => { setView('home'); updateSource('system'); }}>Home</a>
                <a href="#" onClick={() => { setView('tutors'); updateSource('tutors'); }}>Tutors</a>
                <a href="#" onClick={() => { setView('about'); updateSource('system'); }}>Architecture</a>
                <a href="https://twss.netlify.app/contact" target="_blank">Support</a>
                <button onClick={() => setUser(null) || setView('login')} style={{ background: 'transparent', border: 'none', color: '#0ff', cursor: 'pointer', fontWeight: '800' }}>EXIT</button>
              </div>
            </nav>

            <div className="container" style={{ visibility: view === 'session' ? 'hidden' : 'visible' }}>
              {view === 'home' && (
                <div style={{ marginTop: '5vh' }}>
                  <motion.h1 initial={{ x: -100 }} animate={{ x: 0 }} transition={{ type: 'spring' }}>Architectural <br/> Learning.</motion.h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.5rem', marginTop: '2rem', maxWidth: '600px' }}>
                    Connect with world-class engineers. Experience backend visibility and high-fidelity video mentoring.
                  </p>
                  <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}>
                    <button className="btn-mag" onClick={() => { setView('tutors'); updateSource('tutors'); }}>Find Tutors</button>
                    <button className="btn-mag" style={{ borderColor: '#fff', color: '#fff' }} onClick={() => setView('about')}>Our Story</button>
                  </div>
                </div>
              )}

              {view === 'about' && (
                <div>
                  <h1>Our <br/> Backbone.</h1>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginTop: '6rem' }}>
                    <div className="card-3d">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <Database color="#0ff" />
                        <h3 style={{ color: '#0ff' }}>Persistence</h3>
                      </div>
                      <p>High-level file-based JSON storage integration for enterprise-grade data management.</p>
                      <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5, fontFamily: 'monospace' }}>
                        $ node server.js --file-db
                      </div>
                    </div>
                    <div className="card-3d">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <Zap color="#0ff" />
                        <h3 style={{ color: '#0ff' }}>Socket.io</h3>
                      </div>
                      <p>Full-duplex real-time signaling for instant booking confirmations and system triggers.</p>
                      <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5, fontFamily: 'monospace' }}>
                        Status: WebSockets Handshaking...
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {view === 'tutors' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem' }}>The Faculty</h2>
                    <button className="btn-mag" onClick={() => { setView('add-tutor'); updateSource('tutors'); }}>JOIN AS TUTOR</button>
                  </div>
                  <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                    {tutors.map(t => (
                      <div key={t.id} className="card-3d" onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                      }}>
                        <img src={t.image} alt={t.name} style={{ width: '100%', height: '240px', objectFit: 'cover', filter: 'brightness(0.7)' }} />
                        <h3 style={{ marginTop: '2rem', color: '#0ff' }}>{t.name}</h3>
                        <p style={{ fontWeight: '800', margin: '0.5rem 0' }}>{t.subject}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{t.bio}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>${t.rate}/HR</span>
                          <button className="btn-mag" style={{ padding: '0.8rem 1.5rem' }} onClick={() => handleBookSession(t)}>Book Now</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {view === 'add-tutor' && (
                <div style={{ maxWidth: '600px' }}>
                    <h1>Sign Up <br/> as Tutor</h1>
                    <div className="card-3d" style={{ marginTop: '4rem' }}>
                        <form onSubmit={handleApplyTutor}>
                            <input name="name" placeholder="Full Professional Name" required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '1rem 0', width: '100%', marginBottom: '1.5rem', outline: 'none' }} />
                            <input name="subj" placeholder="Domain Expertise (e.g. Java Engine)" required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '1rem 0', width: '100%', marginBottom: '1.5rem', outline: 'none' }} />
                            <input name="rate" type="number" placeholder="Hourly Rate ($)" required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '1rem 0', width: '100%', marginBottom: '1.5rem', outline: 'none' }} />
                            <textarea name="bio" placeholder="Architectural Experience / Bio" required style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #333', color: '#fff', padding: '1rem 0', width: '100%', marginBottom: '3rem', outline: 'none', minHeight: '100px' }} />
                            <button className="btn-mag" style={{ width: '100%' }}>SUBMIT APPLICATION</button>
                        </form>
                    </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{ background: '#080808', padding: '6rem 4rem', marginTop: '10rem', borderTop: '1px solid #111' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem' }}>
          <div><div className="logo">TutorLink</div><p style={{ color: '#555', marginTop: '1rem' }}>Architectural scale education platform.</p></div>
          <div><h4>System</h4><p style={{ color: '#555', marginTop: '1rem' }}>Node.js Express<br/>React 18<br/>Socket.io</p></div>
          <div><h4>Support</h4><p style={{ color: '#555', marginTop: '1rem' }}><a href="https://twss.netlify.app/contact" style={{ color: '#0ff' }}>Support Portal</a></p></div>
          <div><h4>Project</h4><p style={{ color: '#555', marginTop: '1rem' }}><a href="#">Github Source</a></p></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
