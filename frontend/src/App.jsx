import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Box, Layout, Shield, Zap, Globe, MessageSquare, Camera, Video, Plus, LogOut, ChevronRight, Code, Database, Server, Eye, EyeOff, Link } from 'lucide-react';

const INITIAL_TUTORS = [
  { id: 1, name: 'Siva Charan', subject: 'Java Architecture', rate: 55, bio: 'Expert Java Developer. Specializing in Low-Level Threading & Spring Boot Internals.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  { id: 2, name: 'Varsith', subject: 'Python Data Science', rate: 45, bio: 'Machine Learning engineer. Expert in NumPy, Pandas, and Tensor Flow architectures.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
];

const CODE_MAPPING = {
  login: { url: 'POST /api/auth/login', code: '@PostMapping("/login")\npublic ResponseEntity<?> authenticate(@RequestBody LoginRequest req) {\n  return ResponseEntity.ok(userService.validate(req));\n}' },
  tutors: { url: 'GET /api/tutors', code: '@GetMapping\npublic List<User> getTutors() {\n  return userRepository.findByRole(Role.TUTOR);\n}' },
  booking: { url: 'POST /api/bookings', code: '@PostMapping\npublic Booking create(@RequestBody Booking b) {\n  return bookingRepository.save(b);\n}' },
  system: { url: 'GET /api/system/architecture', code: '@GetMapping("/architecture")\npublic Map<String, Object> getArchitectureInfo() {\n  return systemService.getMetadata();\n}' }
};

const App = () => {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);
  const [tutors, setTutors] = useState(INITIAL_TUTORS);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('POST /api/auth/login');
  const [currentCode, setCurrentCode] = useState(CODE_MAPPING.login.code);
  const [bookings, setBookings] = useState([]);
  
  const videoRef = useRef(null);

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

  return (
    <div className="app-container">
      <div className="bg-grid"></div>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.7rem', marginBottom: '0.5rem' }}><Server size={12} /> JAVA CONTROLLER SNIPPET</div>
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

            <div className="container">
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
                      <p>High-level file-based H2 database integration for enterprise-grade data management.</p>
                      <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5, fontFamily: 'monospace' }}>
                        $ mvn spring-boot:run --file-db
                      </div>
                    </div>
                    <div className="card-3d">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <Video color="#0ff" />
                        <h3 style={{ color: '#0ff' }}>WebRTC</h3>
                      </div>
                      <p>Low-latency peer-to-peer video sessions with real-time signal mirroring.</p>
                      <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5, fontFamily: 'monospace' }}>
                        STUN/TURN: Initializing PeerJS...
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
                        <img src={t.image} alt={t.name} style={{ width: '100%', height: '250px', objectFit: 'cover', filter: 'brightness(0.7)' }} />
                        <h3 style={{ marginTop: '2rem', color: '#0ff' }}>{t.name}</h3>
                        <p style={{ fontWeight: '800', margin: '0.5rem 0' }}>{t.subject}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{t.bio}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>${t.rate}/HR</span>
                          <button className="btn-mag" style={{ padding: '0.8rem 1.5rem' }} onClick={() => {
                            updateSource('booking');
                            setBookings([...bookings, { id: Date.now(), tutor: t.name, subject: t.subject }]);
                            alert('Session Scheduled. Code trace updated.');
                          }}>Book Now</button>
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
                        <form onSubmit={(e) => { e.preventDefault(); setTutors([{id: Date.now(), name: e.target.name.value, subject: e.target.subj.value, rate: e.target.rate.value, bio: e.target.bio.value, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400'}, ...tutors]); setView('tutors'); }}>
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
          <div><h4>System</h4><p style={{ color: '#555', marginTop: '1rem' }}>Java 17<br/>React 18<br/>WebRTC</p></div>
          <div><h4>Support</h4><p style={{ color: '#555', marginTop: '1rem' }}><a href="https://twss.netlify.app/contact" style={{ color: '#0ff' }}>Support Portal</a></p></div>
          <div><h4>Project</h4><p style={{ color: '#555', marginTop: '1rem' }}><a href="#">Github Source</a></p></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
