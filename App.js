Import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── helpers ── */
const WA = "254100733790";
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const uid = () => "REQ-" + Math.floor(1000 + Math.random() * 9000);
const businessOpen = () => {
  const d = new Date(), day = d.getDay(), h = d.getHours();
  if (day === 0) return false;
  if (day === 6) return h >= 9 && h < 17;
  return h >= 8 && h < 20;
};
const waLink = (service, id) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(`Hello Online Agency,\nI need help with ${service}.\nRequest ID: ${id}`)}`;

/* ── data ── */
const SERVICES = [
  { id: "ecitizen", name: "eCitizen Phone Change", icon: "📱", cat: "eCitizen",    color: "#00ff88", desc: "Update your registered eCitizen phone number quickly." },
  { id: "sha",      name: "SHA Services",          icon: "🏥", cat: "Health",      color: "#00e5ff", desc: "Social Health Authority registration & management." },
  { id: "kra-pin",  name: "KRA PIN Retrieval",     icon: "🔑", cat: "KRA",        color: "#a855f7", desc: "Recover or retrieve your KRA PIN with ease." },
  { id: "kra-mail", name: "KRA Email Change",      icon: "✉️", cat: "KRA",        color: "#f59e0b", desc: "Update your KRA account email address securely." },
  { id: "ntsa",     name: "NTSA Services",         icon: "🚗", cat: "Transport",   color: "#00ff88", desc: "Vehicle & driving licence services via NTSA." },
  { id: "helb",     name: "HELB Services",         icon: "🎓", cat: "Education",   color: "#ec4899", desc: "Higher Education Loans Board application help." },
  { id: "conduct",  name: "Good Conduct",          icon: "📋", cat: "Police",      color: "#00e5ff", desc: "Certificate of Good Conduct application." },
  { id: "passport", name: "Passport Application",  icon: "🛂", cat: "Immigration", color: "#f59e0b", desc: "Passport application assistance & preparation." },
];
const STATUSES = ["Pending", "In Progress", "Completed"];
const STATUS_COLOR = { Pending: "#f59e0b", "In Progress": "#00e5ff", Completed: "#00ff88" };
const STATUS_IDX   = { Pending: 0, "In Progress": 1, Completed: 2 };

/* ══════════════════════════════════════════════════════
   INTRO
══════════════════════════════════════════════════════ */
function Intro({ done }) {
  useEffect(() => { const t = setTimeout(done, 3000); return () => clearTimeout(t); }, [done]);
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.7 }}
      style={{ position:"fixed",inset:0,zIndex:9999,background:"#000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
      {/* stars */}
      {[...Array(60)].map((_,i) => (
        <motion.div key={i} style={{ position:"absolute", width:2, height:2, borderRadius:"50%", background: i%2?"#00ff88":"#00e5ff",
          left:`${Math.random()*100}%`, top:`${Math.random()*100}%` }}
          animate={{ opacity:[0,1,0], scale:[0,2,0] }}
          transition={{ duration:2+Math.random()*2, repeat:Infinity, delay:Math.random()*2 }} />
      ))}
      <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", bounce:0.5 }}
        style={{ fontSize:64, marginBottom:16 }}>🇰🇪</motion.div>
      <motion.h1 initial={{ y:20,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ delay:0.4 }}
        style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:28, letterSpacing:"0.2em",
          background:"linear-gradient(90deg,#00ff88,#00e5ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
        ONLINE AGENCY
      </motion.h1>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
        style={{ color:"#00ff8860", fontSize:11, letterSpacing:"0.4em", marginTop:8 }}>
        DIGITAL GOVERNMENT SERVICES · KENYA
      </motion.p>
      {/* loader bar */}
      <div style={{ marginTop:32, width:240, height:2, background:"#111", borderRadius:2, overflow:"hidden" }}>
        <motion.div style={{ height:"100%", background:"linear-gradient(90deg,#00ff88,#00e5ff)", borderRadius:2 }}
          initial={{ width:0 }} animate={{ width:"100%" }} transition={{ duration:2.2, delay:0.8 }} />
      </div>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
        style={{ color:"#ffffff20", fontSize:10, letterSpacing:"0.3em", marginTop:12 }}>INITIALIZING…</motion.p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════ */
function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const open = businessOpen();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navStyle = {
    position:"fixed", top:0, left:0, right:0, zIndex:100,
    padding:"12px 16px", transition:"all 0.3s",
  };
  const innerStyle = {
    maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between",
    background: scrolled ? "rgba(0,0,0,0.75)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    border: scrolled ? "1px solid rgba(0,255,136,0.15)" : "1px solid transparent",
    borderRadius:16, padding:"10px 20px", transition:"all 0.3s",
    boxShadow: scrolled ? "0 0 40px rgba(0,255,136,0.07)" : "none",
  };

  return (
    <nav style={navStyle}>
      <div style={innerStyle}>
        {/* logo */}
        <button onClick={() => setPage("home")} style={{ display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer" }}>
          <span style={{ fontSize:22 }}>🇰🇪</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ color:"#fff",fontWeight:900,fontSize:12,letterSpacing:"0.2em",fontFamily:"'Outfit',sans-serif" }}>ONLINE AGENCY</div>
            <div style={{ color:"#00ff8870",fontSize:9,letterSpacing:"0.3em" }}>DIGITAL SERVICES</div>
          </div>
        </button>

        {/* links */}
        <div style={{ display:"flex",gap:24,alignItems:"center" }}>
          {["home","tracker","admin"].map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              background:"none", border:"none", cursor:"pointer", fontSize:11, fontWeight:700,
              letterSpacing:"0.15em", textTransform:"uppercase",
              color: page===p ? "#00ff88" : "#666", transition:"color 0.2s"
            }}>{p}</button>
          ))}
        </div>

        {/* right */}
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,fontSize:10,fontWeight:700,
            background: open ? "rgba(0,255,136,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${open?"rgba(0,255,136,0.3)":"rgba(239,68,68,0.3)"}`,
            color: open ? "#00ff88" : "#ef4444" }}>
            <motion.div animate={{ scale:[1,1.5,1] }} transition={{ repeat:Infinity,duration:1.5 }}
              style={{ width:6,height:6,borderRadius:"50%",background: open?"#00ff88":"#ef4444" }} />
            {open ? "OPEN" : "CLOSED"}
          </div>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={() => setPage("tracker")}
            style={{ padding:"8px 16px",borderRadius:10,background:"rgba(0,255,136,0.1)",
              border:"1px solid rgba(0,255,136,0.3)",color:"#00ff88",fontSize:10,fontWeight:700,
              letterSpacing:"0.1em",cursor:"pointer" }}>
            TRACK REQUEST
          </motion.button>
        </div>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */
function Hero({ onExplore }) {
  const words = ["eCitizen Services","KRA Solutions","NTSA Assistance","Passport Help","HELB Support"];
  const [idx,setIdx] = useState(0);
  const [typed,setTyped] = useState("");
  const [del,setDel] = useState(false);
  const [ci,setCi] = useState(0);

  useEffect(() => {
    const w = words[idx];
    const spd = del ? 55 : 95;
    const t = setTimeout(() => {
      if (!del && ci < w.length) { setTyped(w.slice(0,ci+1)); setCi(c=>c+1); }
      else if (!del && ci===w.length) { setTimeout(()=>setDel(true),1400); }
      else if (del && ci>0) { setTyped(w.slice(0,ci-1)); setCi(c=>c-1); }
      else { setDel(false); setIdx(i=>(i+1)%words.length); }
    }, spd);
    return ()=>clearTimeout(t);
  },[ci,del,idx]);

  const stats = [["8+","Services"],["2.4K+","Clients"],["99%","Success"],["<2hr","Response"]];

  return (
    <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"100px 20px 60px",position:"relative",overflow:"hidden" }}>
      {/* bg grid */}
      <div style={{ position:"absolute",inset:0,
        backgroundImage:"linear-gradient(rgba(0,255,136,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.03) 1px,transparent 1px)",
        backgroundSize:"60px 60px" }} />
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%,rgba(0,255,136,0.07) 0%,transparent 65%)" }} />

      {/* particles */}
      {[...Array(20)].map((_,i)=>(
        <motion.div key={i} style={{ position:"absolute",width:3,height:3,borderRadius:"50%",
          left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,
          background:i%2?"#00ff88":"#00e5ff",opacity:0.4 }}
          animate={{ y:[0,-25,0],opacity:[0.2,0.8,0.2] }}
          transition={{ duration:3+Math.random()*4,repeat:Infinity,delay:Math.random()*3 }} />
      ))}

      <div style={{ position:"relative",maxWidth:800,textAlign:"center" }}>
        {/* badge */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }}
          style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,marginBottom:28,
            background:"rgba(0,255,136,0.08)",border:"1px solid rgba(0,255,136,0.2)",
            color:"#00ff88",fontSize:10,fontWeight:700,letterSpacing:"0.2em" }}>
          <motion.div animate={{ scale:[1,1.5,1] }} transition={{ repeat:Infinity,duration:1.5 }}
            style={{ width:6,height:6,borderRadius:"50%",background:"#00ff88" }} />
          KENYA'S PREMIER DIGITAL GOVERNMENT SERVICES
        </motion.div>

        {/* headline */}
        <motion.h1 initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.2 }}
          style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:"clamp(32px,6vw,64px)",
            lineHeight:1.1,color:"#fff",marginBottom:12 }}>
          Fast, Secure<br />
          <span style={{ background:"linear-gradient(90deg,#00ff88,#00e5ff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
            {typed}<span style={{ opacity:1,animation:"blink 1s step-end infinite" }}>|</span>
          </span>
        </motion.h1>

        <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }}
          style={{ color:"#888",fontSize:16,lineHeight:1.7,maxWidth:560,margin:"0 auto 36px" }}>
          We handle your government service requests with precision and speed. From KRA to NTSA — connect via WhatsApp instantly.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.45 }}
          style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:56 }}>
          <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }} onClick={onExplore}
            style={{ padding:"14px 32px",borderRadius:14,fontWeight:900,fontSize:12,letterSpacing:"0.15em",
              background:"linear-gradient(135deg,#00ff88,#00e5ff)",color:"#000",border:"none",cursor:"pointer" }}>
            EXPLORE SERVICES →
          </motion.button>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={()=>window.open(`https://wa.me/${WA}`,"_blank")}
            style={{ padding:"14px 32px",borderRadius:14,fontWeight:700,fontSize:12,letterSpacing:"0.1em",
              background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
              color:"#fff",cursor:"pointer" }}>
            💬 Chat on WhatsApp
          </motion.button>
        </motion.div>

        {/* stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12 }}>
          {stats.map(([v,l],i)=>(
            <motion.div key={l} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.5+i*0.08 }}
              style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:14,padding:"16px 8px" }}>
              <div style={{ fontWeight:900,fontSize:22,background:"linear-gradient(90deg,#00ff88,#00e5ff)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Outfit',sans-serif" }}>{v}</div>
              <div style={{ color:"#555",fontSize:10,marginTop:4,letterSpacing:"0.1em" }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SERVICE CARD
══════════════════════════════════════════════════════ */
function Card({ s, onOrder, i }) {
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x:0,y:0 });
  const ref = useRef();

  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    setTilt({ x:((e.clientX-r.left)/r.width-0.5)*18, y:((e.clientY-r.top)/r.height-0.5)*-18 });
  };

  return (
    <motion.div ref={ref} initial={{ opacity:0,y:40 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.07 }}
      onMouseMove={onMove} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setTilt({x:0,y:0});}}
      style={{ transform:`perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`, transition:"transform 0.15s ease" }}>
      <div style={{ position:"relative",borderRadius:20,padding:24,cursor:"pointer",overflow:"hidden",
        background:"rgba(0,0,0,0.5)",backdropFilter:"blur(16px)",
        border:`1px solid ${hov ? s.color+"50" : "rgba(255,255,255,0.06)"}`,
        boxShadow: hov ? `0 20px 60px rgba(0,0,0,0.6),0 0 40px ${s.color}18` : "0 4px 20px rgba(0,0,0,0.3)",
        transition:"all 0.4s" }}>
        {/* glow bg */}
        <div style={{ position:"absolute",inset:0,opacity:hov?1:0,transition:"opacity 0.4s",
          background:`radial-gradient(circle at 50% 50%,${s.color}0d,transparent 70%)` }} />

        <div style={{ position:"relative" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
            <motion.span animate={hov?{scale:1.2,rotate:8}:{scale:1,rotate:0}} style={{ fontSize:32 }}>{s.icon}</motion.span>
            <span style={{ fontSize:9,fontWeight:700,letterSpacing:"0.15em",padding:"4px 10px",borderRadius:20,
              color:s.color,background:s.color+"18",border:`1px solid ${s.color}30` }}>{s.cat}</span>
          </div>
          <h3 style={{ color:"#fff",fontWeight:700,fontSize:16,marginBottom:8,lineHeight:1.3 }}>{s.name}</h3>
          <p style={{ color:"#666",fontSize:13,lineHeight:1.6,marginBottom:20 }}>{s.desc}</p>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <span style={{ fontSize:11,color:"#444" }}>⚡ <span style={{ color:s.color }}>Instant</span> WhatsApp</span>
            <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
              onClick={()=>onOrder(s)}
              style={{ padding:"8px 18px",borderRadius:10,fontWeight:700,fontSize:11,letterSpacing:"0.1em",
                background:`linear-gradient(135deg,${s.color},${s.color}bb)`,color:"#000",border:"none",cursor:"pointer" }}>
              ORDER →
            </motion.button>
          </div>
        </div>

        {/* bottom neon line */}
        <motion.div animate={hov?{width:"100%",opacity:1}:{width:"0%",opacity:0}} transition={{ duration:0.4 }}
          style={{ position:"absolute",bottom:0,left:0,height:1,
            background:`linear-gradient(90deg,transparent,${s.color},transparent)` }} />
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   CLOCK WIDGET
══════════════════════════════════════════════════════ */
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setNow(new Date()),1000); return ()=>clearInterval(t); },[]);
  const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const open = businessOpen();
  return (
    <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
      style={{ background:"rgba(0,0,0,0.5)",backdropFilter:"blur(20px)",border:"1px solid rgba(0,255,136,0.15)",
        borderRadius:20,padding:28,maxWidth:440,margin:"0 auto",
        boxShadow:"0 0 40px rgba(0,255,136,0.07)" }}>
      <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:40,color:"#fff",letterSpacing:"0.05em" }}>
        {now.toLocaleTimeString("en-KE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
      </div>
      <div style={{ color:"#00ff8890",fontSize:13,marginTop:6 }}>
        {DAYS[now.getDay()]} · {now.getDate()} {MONTHS[now.getMonth()]} {now.getFullYear()}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:12,color:"#555",fontSize:12 }}>
        🇰🇪 <span>Nairobi, Kenya · EAT +3</span>
      </div>
      <div style={{ marginTop:14,display:"flex",alignItems:"center",gap:8,
        color: open?"#00ff88":"#ef4444",fontSize:12,fontWeight:700 }}>
        <motion.div animate={{scale:[1,1.5,1]}} transition={{repeat:Infinity,duration:1.5}}
          style={{width:8,height:8,borderRadius:"50%",background:open?"#00ff88":"#ef4444"}} />
        {open ? "We are OPEN · Mon–Fri 8AM–8PM" : "CLOSED · Opens Monday 8AM"}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   PROFILE MODAL
══════════════════════════════════════════════════════ */
function ProfileModal({ onSave }) {
  const [name,setName] = useState("");
  const [idN,setIdN] = useState("");
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",
        background:"rgba(0,0,0,0.85)",backdropFilter:"blur(16px)",padding:16 }}>
      <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.85,opacity:0}}
        style={{ width:"100%",maxWidth:420,background:"rgba(0,0,0,0.9)",
          border:"1px solid rgba(0,255,136,0.25)",borderRadius:24,padding:36,
          boxShadow:"0 0 60px rgba(0,255,136,0.12)" }}>
        <div style={{ textAlign:"center",marginBottom:32 }}>
          <div style={{ fontSize:48,marginBottom:12 }}>🇰🇪</div>
          <h2 style={{ color:"#fff",fontWeight:900,fontSize:22,marginBottom:8,fontFamily:"'Outfit',sans-serif" }}>Welcome!</h2>
          <p style={{ color:"#666",fontSize:13 }}>Your profile is stored locally and never shared.</p>
        </div>
        {[["FULL NAME",name,setName,"Your full name"],["ID NUMBER",idN,setIdN,"National ID number"]].map(([label,val,set,ph])=>(
          <div key={label} style={{ marginBottom:16 }}>
            <div style={{ color:"#00ff88",fontSize:9,fontWeight:700,letterSpacing:"0.2em",marginBottom:8 }}>{label}</div>
            <input value={val} onChange={e=>set(e.target.value)} placeholder={ph}
              style={{ width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:14,outline:"none",
                fontFamily:"'Outfit',sans-serif",boxSizing:"border-box" }} />
          </div>
        ))}
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
          onClick={()=>name.trim()&&idN.trim()&&onSave({name:name.trim(),idNum:idN.trim()})}
          style={{ width:"100%",padding:"14px",borderRadius:14,fontWeight:900,fontSize:13,letterSpacing:"0.15em",
            background:"linear-gradient(135deg,#00ff88,#00e5ff)",color:"#000",border:"none",cursor:"pointer",marginTop:8 }}>
          CONTINUE →
        </motion.button>
        <p style={{ textAlign:"center",color:"#333",fontSize:11,marginTop:16 }}>🔒 Stored locally · Never shared</p>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   ORDER MODAL
══════════════════════════════════════════════════════ */
function OrderModal({ service, onConfirm, onClose }) {
  const id = useRef(uid()).current;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={onClose}
      style={{ position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center",
        background:"rgba(0,0,0,0.8)",backdropFilter:"blur(16px)",padding:16 }}>
      <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} exit={{y:80,opacity:0}}
        onClick={e=>e.stopPropagation()}
        style={{ width:"100%",maxWidth:440,background:"rgba(5,5,5,0.95)",
          border:"1px solid rgba(0,255,136,0.25)",borderRadius:24,padding:32,
          boxShadow:"0 0 60px rgba(0,255,136,0.12)",marginBottom:8 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
          <h2 style={{ color:"#fff",fontWeight:900,fontSize:20,fontFamily:"'Outfit',sans-serif" }}>Confirm Order</h2>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#555",fontSize:24,cursor:"pointer" }}>×</button>
        </div>
        <div style={{ background:"rgba(0,255,136,0.05)",border:"1px solid rgba(0,255,136,0.15)",borderRadius:14,padding:16,marginBottom:16 }}>
          <div style={{ color:"#555",fontSize:11,marginBottom:6 }}>Selected Service</div>
          <div style={{ color:"#fff",fontWeight:700,fontSize:17 }}>{service.name}</div>
          <div style={{ color:"#00ff88",fontSize:11,fontWeight:700,marginTop:8 }}>Request ID: {id}</div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.03)",borderRadius:14,padding:16,marginBottom:24,
          fontFamily:"monospace",fontSize:13,color:"#aaa",lineHeight:1.7 }}>
          Hello Online Agency,<br/>I need help with {service.name}.<br/>Request ID: {id}
        </div>
        <div style={{ display:"flex",gap:12 }}>
          <button onClick={onClose}
            style={{ flex:1,padding:"13px",borderRadius:12,background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.1)",color:"#888",fontWeight:700,fontSize:12,cursor:"pointer" }}>
            Cancel
          </button>
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.96}}
            onClick={()=>onConfirm(service,id)}
            style={{ flex:1,padding:"13px",borderRadius:12,fontWeight:900,fontSize:12,letterSpacing:"0.1em",
              background:"linear-gradient(135deg,#00ff88,#00e5ff)",color:"#000",border:"none",cursor:"pointer" }}>
            💬 OPEN WHATSAPP
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════ */
function Toasts({ list }) {
  return (
    <div style={{ position:"fixed",bottom:90,right:16,zIndex:400,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none" }}>
      <AnimatePresence>
        {list.map(t=>(
          <motion.div key={t.id} initial={{x:120,opacity:0}} animate={{x:0,opacity:1}} exit={{x:120,opacity:0}}
            style={{ background:"rgba(0,0,0,0.85)",backdropFilter:"blur(16px)",
              border:"1px solid rgba(0,255,136,0.25)",borderRadius:14,padding:"12px 16px",
              boxShadow:"0 0 20px rgba(0,255,136,0.15)",maxWidth:280,fontSize:13,color:"#fff" }}>
            {t.icon} {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   WA FLOAT
══════════════════════════════════════════════════════ */
function WAFloat() {
  return (
    <motion.button whileHover={{scale:1.12}} whileTap={{scale:0.93}}
      onClick={()=>window.open(`https://wa.me/${WA}`,"_blank")}
      style={{ position:"fixed",bottom:24,right:24,zIndex:300,width:60,height:60,borderRadius:"50%",
        background:"#25D366",border:"none",cursor:"pointer",fontSize:26,display:"flex",
        alignItems:"center",justifyContent:"center",
        boxShadow:"0 0 30px rgba(37,211,102,0.5)" }}>
      💬
      <motion.div animate={{scale:[1,1.7,1],opacity:[0.4,0,0.4]}} transition={{repeat:Infinity,duration:2}}
        style={{ position:"absolute",inset:0,borderRadius:"50%",background:"#25D366" }} />
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════
   LIVE ACTIVITY
══════════════════════════════════════════════════════ */
function LiveActivity() {
  const items = [
    "📱 eCitizen Phone Change requested","✅ KRA PIN Retrieval completed",
    "🚗 NTSA Services inquiry sent","🎓 HELB application submitted",
    "🏥 SHA Services request received","📋 Good Conduct processed",
  ];
  const [cur,setCur] = useState(0);
  const [show,setShow] = useState(true);
  useEffect(()=>{
    const t = setInterval(()=>{
      setShow(false);
      setTimeout(()=>{ setCur(c=>(c+1)%items.length); setShow(true); },400);
    },4000);
    return ()=>clearInterval(t);
  },[]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
          style={{ position:"fixed",top:80,left:16,zIndex:200,
            background:"rgba(0,0,0,0.7)",backdropFilter:"blur(12px)",
            border:"1px solid rgba(0,255,136,0.15)",borderRadius:12,
            padding:"8px 14px",display:"flex",alignItems:"center",gap:10,maxWidth:280 }}>
          <motion.div animate={{scale:[1,1.4,1]}} transition={{repeat:Infinity,duration:1.5}}
            style={{width:6,height:6,borderRadius:"50%",background:"#00ff88",flexShrink:0}} />
          <span style={{fontSize:11,color:"#ccc"}}>{items[cur]}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════
   HOME
══════════════════════════════════════════════════════ */
function Home({ onOrder }) {
  const svcRef = useRef();
  const steps = [
    {n:"01",icon:"📋",title:"Select Service",desc:"Choose from 8 government services"},
    {n:"02",icon:"🔑",title:"Request ID Generated",desc:"Unique tracking ID created instantly"},
    {n:"03",icon:"💬",title:"WhatsApp Opens",desc:"Pre-filled message sent to our team"},
    {n:"04",icon:"📡",title:"Track Progress",desc:"Monitor your request status anytime"},
  ];
  const trust = [
    {icon:"🔒",t:"Privacy First",d:"Data never shared publicly"},
    {icon:"⚡",t:"Fast Response",d:"Average under 2 hours"},
    {icon:"✅",t:"99% Success",d:"Proven track record"},
    {icon:"🇰🇪",t:"Kenya Certified",d:"Licensed digital agency"},
  ];
  return (
    <div>
      <Hero onExplore={()=>svcRef.current?.scrollIntoView({behavior:"smooth"})} />

      {/* services */}
      <section ref={svcRef} style={{ padding:"80px 20px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              style={{ display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,
                background:"rgba(0,229,255,0.08)",border:"1px solid rgba(0,229,255,0.2)",
                color:"#00e5ff",fontSize:10,fontWeight:700,letterSpacing:"0.2em",marginBottom:16 }}>
              OUR SERVICES
            </motion.div>
            <motion.h2 initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,44px)",
                color:"#fff",lineHeight:1.2,marginBottom:16 }}>
              Everything You Need,<br/>
              <span style={{background:"linear-gradient(90deg,#00ff88,#00e5ff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                One Message Away
              </span>
            </motion.h2>
            <p style={{color:"#666",fontSize:15,maxWidth:500,margin:"0 auto"}}>
              Select a service to instantly connect via WhatsApp. Fast, secure, no paperwork.
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16 }}>
            {SERVICES.map((s,i)=><Card key={s.id} s={s} onOrder={onOrder} i={i} />)}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section style={{ padding:"60px 20px" }}>
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:48 }}>
            <h2 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:32,color:"#fff" }}>
              How It <span style={{color:"#00ff88"}}>Works</span>
            </h2>
            <p style={{color:"#555",marginTop:8}}>Simple. Fast. Seamless.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16 }}>
            {steps.map((s,i)=>(
              <motion.div key={s.n} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",
                  borderRadius:18,padding:24 }}>
                <div style={{color:"rgba(0,255,136,0.3)",fontSize:11,fontWeight:900,letterSpacing:"0.2em",marginBottom:12}}>{s.n}</div>
                <div style={{fontSize:28,marginBottom:12}}>{s.icon}</div>
                <div style={{color:"#fff",fontWeight:700,marginBottom:8}}>{s.title}</div>
                <div style={{color:"#555",fontSize:13}}>{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* clock */}
      <section style={{ padding:"40px 20px 80px" }}><Clock /></section>

      {/* trust */}
      <section style={{ padding:"60px 20px",borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:24 }}>
          {trust.map((t,i)=>(
            <motion.div key={t.t} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
              style={{ textAlign:"center" }}>
              <div style={{fontSize:32,marginBottom:10}}>{t.icon}</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:13,marginBottom:6}}>{t.t}</div>
              <div style={{color:"#555",fontSize:12}}>{t.d}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TRACKER
══════════════════════════════════════════════════════ */
function Tracker({ requests }) {
  const [q,setQ] = useState("");
  const filtered = requests.filter(r=>
    r.id.toLowerCase().includes(q.toLowerCase()) ||
    r.service.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div style={{ minHeight:"100vh",padding:"120px 20px 80px" }}>
      <div style={{ maxWidth:800,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:48 }}>
          <h1 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,48px)",color:"#fff" }}>
            Request <span style={{background:"linear-gradient(90deg,#00ff88,#00e5ff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Tracker</span>
          </h1>
          <p style={{color:"#555",marginTop:8}}>Track all your submitted service requests</p>
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍  Search by Request ID or service…"
          style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:14,padding:"14px 20px",color:"#fff",fontSize:14,outline:"none",
            marginBottom:24,boxSizing:"border-box",fontFamily:"'Outfit',sans-serif" }} />
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center",padding:"80px 0",color:"#444" }}>
            <div style={{fontSize:48,marginBottom:16}}>📭</div>
            <p style={{fontSize:16,color:"#555"}}>No requests found</p>
            <p style={{fontSize:13,marginTop:8}}>Place your first order from the home page</p>
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {filtered.map((r,i)=>{
              const sc = STATUS_COLOR[r.status];
              const si = STATUS_IDX[r.status];
              return (
                <motion.div key={r.id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                  style={{ background:"rgba(0,0,0,0.5)",backdropFilter:"blur(16px)",
                    border:"1px solid rgba(255,255,255,0.07)",borderRadius:18,padding:24 }}>
                  <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:16 }}>
                    <div>
                      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:8 }}>
                        <span style={{ fontSize:11,fontWeight:900,color:"#00ff88",letterSpacing:"0.1em" }}>{r.id}</span>
                        <span style={{ fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20,
                          color:sc,background:sc+"18",border:`1px solid ${sc}35` }}>{r.status}</span>
                      </div>
                      <div style={{ color:"#fff",fontWeight:700,fontSize:16,marginBottom:4 }}>{r.service}</div>
                      <div style={{ color:"#444",fontSize:11 }}>{new Date(r.date).toLocaleString("en-KE")}</div>
                    </div>
                    {/* progress */}
                    <div style={{ minWidth:200 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",fontSize:9,color:"#444",marginBottom:8 }}>
                        {STATUSES.map(s=><span key={s}>{s}</span>)}
                      </div>
                      <div style={{ height:4,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden" }}>
                        <motion.div style={{ height:"100%",borderRadius:2,background:`linear-gradient(90deg,#00ff88,${sc})` }}
                          initial={{width:0}} animate={{width:`${((si+1)/3)*100}%`}} transition={{duration:0.8,delay:0.2}} />
                      </div>
                      <div style={{ display:"flex",justifyContent:"space-between",marginTop:8 }}>
                        {STATUSES.map((_,si2)=>(
                          <div key={si2} style={{ width:10,height:10,borderRadius:"50%",
                            background: si2<=si ? "#00ff88" : "transparent",
                            border: `2px solid ${si2<=si?"#00ff88":"#333"}`,transition:"all 0.3s" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ADMIN
══════════════════════════════════════════════════════ */
function Admin({ requests, setRequests, superAdmin }) {
  const [q,setQ] = useState("");
  const [filt,setFilt] = useState("All");

  const filtered = requests.filter(r=>
    (filt==="All"||r.status===filt)&&
    (r.id.toLowerCase().includes(q.toLowerCase())||r.service.toLowerCase().includes(q.toLowerCase()))
  );
  const counts = STATUSES.reduce((a,s)=>({...a,[s]:requests.filter(r=>r.status===s).length}),{});

  const setStatus = (id,status)=>{
    const u = requests.map(r=>r.id===id?{...r,status}:r);
    setRequests(u); LS.set("oa_requests",u);
  };

  const exportJSON = ()=>{
    const b = new Blob([JSON.stringify(requests,null,2)],{type:"application/json"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(b);
    a.download="online-agency-requests.json"; a.click();
  };

  return (
    <div style={{ minHeight:"100vh",padding:"120px 20px 80px" }}>
      <div style={{ maxWidth:1000,margin:"0 auto" }}>
        <div style={{ display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"flex-start",gap:16,marginBottom:40 }}>
          <div>
            <h1 style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:32,color:"#fff" }}>
              Command <span style={{color:"#00ff88"}}>Center</span>
            </h1>
            <p style={{ color:"#444",fontSize:13,marginTop:4 }}>
              Admin Dashboard {superAdmin&&<span style={{color:"#ef4444",fontWeight:700}}>· SUPER ADMIN 🔴</span>}
            </p>
          </div>
          <motion.button whileHover={{scale:1.05}} onClick={exportJSON}
            style={{ padding:"10px 20px",borderRadius:12,background:"rgba(0,255,136,0.1)",
              border:"1px solid rgba(0,255,136,0.25)",color:"#00ff88",fontSize:11,fontWeight:700,cursor:"pointer" }}>
            ⬇ EXPORT JSON
          </motion.button>
        </div>

        {/* stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:12,marginBottom:28 }}>
          {[{l:"Total",v:requests.length,c:"#fff"},...STATUSES.map(s=>({l:s,v:counts[s]||0,c:STATUS_COLOR[s]}))].map(s=>(
            <div key={s.l} style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:20 }}>
              <div style={{ fontSize:28,fontWeight:900,color:s.c,fontFamily:"'Outfit',sans-serif" }}>{s.v}</div>
              <div style={{ color:"#444",fontSize:10,marginTop:4,letterSpacing:"0.1em" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* filter + search */}
        <div style={{ display:"flex",flexWrap:"wrap",gap:10,marginBottom:20 }}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍  Search…"
            style={{ flex:1,minWidth:200,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:12,padding:"11px 16px",color:"#fff",fontSize:13,outline:"none",fontFamily:"'Outfit',sans-serif" }} />
          <div style={{ display:"flex",gap:8 }}>
            {["All",...STATUSES].map(s=>(
              <button key={s} onClick={()=>setFilt(s)}
                style={{ padding:"10px 14px",borderRadius:10,fontSize:10,fontWeight:700,cursor:"pointer",
                  background: filt===s?"rgba(0,255,136,0.15)":"rgba(255,255,255,0.04)",
                  border: filt===s?"1px solid rgba(0,255,136,0.4)":"1px solid rgba(255,255,255,0.08)",
                  color: filt===s?"#00ff88":"#666" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* list */}
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {filtered.map((r,i)=>(
            <motion.div key={r.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
              style={{ background:"rgba(0,0,0,0.5)",backdropFilter:"blur(16px)",
                border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:20,
                display:"flex",flexWrap:"wrap",alignItems:"center",gap:16,justifyContent:"space-between" }}>
              <div style={{ flex:1,minWidth:180 }}>
                <div style={{ color:"#00ff88",fontSize:11,fontWeight:900,marginBottom:4 }}>{r.id}</div>
                <div style={{ color:"#fff",fontWeight:600,marginBottom:4 }}>{r.service}</div>
                {superAdmin && <div style={{ color:"#ef4444",fontSize:11 }}>👤 {r.clientName} · ID: {r.clientId}</div>}
                <div style={{ color:"#333",fontSize:11 }}>{new Date(r.date).toLocaleString("en-KE")}</div>
              </div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                {STATUSES.map(s=>(
                  <button key={s} onClick={()=>setStatus(r.id,s)}
                    style={{ padding:"6px 12px",borderRadius:8,fontSize:10,fontWeight:700,cursor:"pointer",
                      background: r.status===s ? STATUS_COLOR[s] : "rgba(255,255,255,0.05)",
                      border: r.status===s ? "none" : "1px solid rgba(255,255,255,0.1)",
                      color: r.status===s ? "#000" : "#555",transition:"all 0.2s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
          {filtered.length===0&&(
            <div style={{ textAlign:"center",padding:"80px 0",color:"#444" }}>
              <div style={{fontSize:40,marginBottom:12}}>📊</div>
              <p>No requests match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ borderTop:"1px solid rgba(255,255,255,0.05)",padding:"48px 20px" }}>
      <div style={{ maxWidth:1000,margin:"0 auto",textAlign:"center" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:24 }}>
          <span style={{fontSize:22}}>🇰🇪</span>
          <div>
            <div style={{ color:"#fff",fontWeight:900,fontSize:12,letterSpacing:"0.2em",fontFamily:"'Outfit',sans-serif" }}>ONLINE AGENCY</div>
            <div style={{ color:"rgba(0,255,136,0.4)",fontSize:9,letterSpacing:"0.25em" }}>DIGITAL GOVERNMENT SERVICES</div>
          </div>
        </div>
        <p style={{ color:"#333",fontSize:11 }}>
          © {new Date().getFullYear()} Online Agency Kenya · WhatsApp: +{WA} · All rights reserved
        </p>
        <p style={{ color:"#222",fontSize:10,marginTop:8 }}>
          Privacy Policy · Terms & Conditions
        </p>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [page, setPage] = useState("home");
  const [profile, setProfile] = useState(()=>LS.get("oa_profile",null));
  const [showProfile, setShowProfile] = useState(false);
  const [pendingService, setPendingService] = useState(null);
  const [orderService, setOrderService] = useState(null);
  const [requests, setRequests] = useState(()=>LS.get("oa_requests",[]));
  const [toasts, setToasts] = useState([]);
  const [superAdmin, setSuperAdmin] = useState(false);
  const pressTimer = useRef(null);

  // super admin via URL
  useEffect(()=>{
    if (typeof window !== "undefined" && window.location.search.includes("mode=super")) setSuperAdmin(true);
  },[]);

  const toast = useCallback((msg,icon="✅")=>{
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,icon}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),4000);
  },[]);

  const handleOrder = (service)=>{
    if (!profile) { setPendingService(service); setShowProfile(true); return; }
    setOrderService(service);
  };

  const handleSaveProfile = (p)=>{
    setProfile(p); LS.set("oa_profile",p);
    setShowProfile(false);
    toast(`Welcome, ${p.name}! 👋`,"🇰🇪");
    if (pendingService) { setOrderService(pendingService); setPendingService(null); }
  };

  const handleConfirmOrder = (service, id)=>{
    const req = { id, service:service.name, status:"Pending", date:new Date().toISOString(),
      clientName:profile?.name||"Anonymous", clientId:profile?.idNum||"N/A" };
    const updated = [req,...requests];
    setRequests(updated); LS.set("oa_requests",updated);
    window.open(waLink(service.name,id),"_blank");
    setOrderService(null);
    toast(`${id} created! WhatsApp opened.`,"💬");
  };

  const startSuperPress = ()=>{ pressTimer.current = setTimeout(()=>{ setSuperAdmin(true); toast("Super Admin activated!","🔴"); },3000); };
  const endSuperPress = ()=>clearTimeout(pressTimer.current);

  return (
    <div style={{ minHeight:"100vh",background:"#000",color:"#fff",
      fontFamily:"'Outfit','Poppins',system-ui,sans-serif",overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input::placeholder{color:#444}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#000}
        ::-webkit-scrollbar-thumb{background:#00ff8830;border-radius:2px}
        button{font-family:'Outfit',sans-serif}
      `}</style>

      <AnimatePresence>
        {showIntro && <Intro key="intro" done={()=>setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <LiveActivity />

          <div onMouseDown={startSuperPress} onMouseUp={endSuperPress}
               onTouchStart={startSuperPress} onTouchEnd={endSuperPress}>
            <Navbar page={page} setPage={setPage} />
          </div>

          <AnimatePresence mode="wait">
            {page==="home"    && <motion.div key="home"    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}><Home onOrder={handleOrder} /></motion.div>}
            {page==="tracker" && <motion.div key="tracker" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}><Tracker requests={requests} /></motion.div>}
            {page==="admin"   && <motion.div key="admin"   initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}><Admin requests={requests} setRequests={setRequests} superAdmin={superAdmin} /></motion.div>}
          </AnimatePresence>

          <Footer />
          <WAFloat />
          <Toasts list={toasts} />

          <AnimatePresence>
            {showProfile && <ProfileModal key="pm" onSave={handleSaveProfile} />}
            {orderService && profile && <OrderModal key="om" service={orderService} onConfirm={handleConfirmOrder} onClose={()=>setOrderService(null)} />}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}


I want it to be live
I have GitHub
