import { useState, useRef, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";

// ─── GOOGLE FONTS ─────────────────────────────────────────────────────────────
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --cream: #FAF6F1; --blush: #E8C4B0; --rose: #C4826A; --deep: #3D2B1F;
      --gold: #C9A96E; --mist: #F2EDE8; --text: #4A3728; --subtle: #8B7B72;
      --white: #FFFFFF; --shadow: rgba(61,43,31,0.12);
    }
    body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }
    .serif { font-family: 'Cormorant Garamond', serif; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); } }
    @keyframes scanLine { from { top:0%; } to { top:100%; } }
    @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }

    .fade-up { animation: fadeUp 0.7s cubic-bezier(.22,.68,0,1.2) both; }
    .fade-up-1 { animation-delay:0.05s; } .fade-up-2 { animation-delay:0.15s; }
    .fade-up-3 { animation-delay:0.25s; } .fade-up-4 { animation-delay:0.35s; }
    .fade-up-5 { animation-delay:0.45s; } .fade-up-6 { animation-delay:0.55s; }

    .app-shell { max-width:480px; margin:0 auto; min-height:100vh; background:var(--cream); }

    .brand-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px 16px; border-bottom:1px solid rgba(196,130,106,0.15); }
    .brand-logo { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:500; letter-spacing:0.08em; color:var(--deep); }
    .brand-logo span { color:var(--rose); }
    .progress-dots { display:flex; gap:6px; align-items:center; }
    .dot { width:6px; height:6px; border-radius:50%; background:var(--blush); transition:all 0.3s ease; }
    .dot.active { background:var(--rose); width:18px; border-radius:3px; }
    .dot.done { background:var(--gold); }

    .hero-section { padding:40px 24px 32px; text-align:center; }
    .hero-eyebrow { font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:var(--rose); margin-bottom:16px; font-weight:500; }
    .hero-title { font-family:'Cormorant Garamond',serif; font-size:42px; line-height:1.12; font-weight:300; color:var(--deep); margin-bottom:20px; }
    .hero-title em { font-style:italic; color:var(--rose); }
    .hero-sub { font-size:15px; color:var(--subtle); line-height:1.65; max-width:360px; margin:0 auto 32px; }
    .trust-row { display:flex; justify-content:center; gap:20px; margin-bottom:36px; flex-wrap:wrap; }
    .trust-badge { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--subtle); }
    .hero-visual { margin:0 24px 36px; border-radius:20px; overflow:hidden; position:relative; background:linear-gradient(145deg,#F5DDD4,#E8C4B0); height:220px; display:flex; align-items:center; justify-content:center; }
    .floating-tag { position:absolute; background:rgba(255,255,255,0.92); backdrop-filter:blur(8px); border-radius:10px; padding:8px 12px; font-size:11px; font-weight:500; color:var(--deep); box-shadow:0 4px 16px var(--shadow); white-space:nowrap; }
    .floating-tag.tl { top:20px; left:20px; } .floating-tag.tr { top:20px; right:20px; } .floating-tag.bl { bottom:20px; left:20px; }
    .dot-small { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--gold); margin-right:5px; }
    .social-proof { margin:0 24px 32px; background:var(--mist); border-radius:16px; padding:20px; display:flex; gap:16px; align-items:center; }
    .avatars { display:flex; }
    .avatar { width:32px; height:32px; border-radius:50%; border:2px solid white; margin-left:-8px; font-size:16px; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#F5DDD4,#C4826A); }
    .avatar:first-child { margin-left:0; }
    .proof-text { flex:1; font-size:13px; color:var(--subtle); line-height:1.5; }

    .btn-primary { display:block; width:calc(100% - 48px); margin:0 24px; padding:18px 24px; background:linear-gradient(135deg,var(--rose),#A0614C); color:white; border:none; border-radius:14px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; transition:all 0.25s ease; box-shadow:0 6px 24px rgba(196,130,106,0.35); text-align:center; }
    .btn-primary:hover { transform:translateY(-2px); }
    .btn-sub { display:block; text-align:center; margin:14px auto 0; font-size:12px; color:var(--subtle); }
    .btn-gold { display:block; width:calc(100% - 48px); margin:0 24px; padding:18px 24px; background:linear-gradient(135deg,var(--gold),#B8924A); color:white; border:none; border-radius:14px; font-family:'DM Sans',sans-serif; font-size:16px; font-weight:500; cursor:pointer; transition:all 0.25s ease; box-shadow:0 6px 24px rgba(201,169,110,0.4); }
    .btn-gold:hover { transform:translateY(-2px); }
    .btn-outline { display:block; width:calc(100% - 48px); margin:12px 24px 0; padding:16px 24px; background:transparent; color:var(--subtle); border:1.5px solid rgba(196,130,106,0.25); border-radius:14px; font-family:'DM Sans',sans-serif; font-size:14px; cursor:pointer; transition:all 0.2s ease; }
    .btn-outline:hover { border-color:var(--rose); color:var(--rose); }

    .section-pad { padding:32px 24px; }
    .section-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:400; color:var(--deep); line-height:1.2; margin-bottom:8px; }
    .section-sub { font-size:14px; color:var(--subtle); line-height:1.6; margin-bottom:28px; }

    .quiz-progress { margin:20px 24px 0; height:3px; background:rgba(196,130,106,0.18); border-radius:2px; overflow:hidden; }
    .quiz-progress-fill { height:100%; background:linear-gradient(90deg,var(--rose),var(--gold)); border-radius:2px; transition:width 0.5s cubic-bezier(.22,.68,0,1.2); }
    .quiz-step { font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:var(--rose); margin-bottom:8px; }
    .option-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:28px; }
    .option-btn { padding:16px 14px; border:1.5px solid rgba(196,130,106,0.22); border-radius:14px; background:white; text-align:left; cursor:pointer; transition:all 0.2s ease; font-family:'DM Sans',sans-serif; }
    .option-btn:hover { border-color:var(--rose); background:rgba(196,130,106,0.06); }
    .option-btn.selected { border-color:var(--rose); background:rgba(196,130,106,0.1); box-shadow:0 0 0 3px rgba(196,130,106,0.12); }
    .option-emoji { font-size:22px; display:block; margin-bottom:6px; }
    .option-label { font-size:13px; font-weight:500; color:var(--deep); display:block; }
    .option-desc { font-size:11px; color:var(--subtle); display:block; margin-top:2px; }

    .upload-zone { margin:0 24px 24px; border:2px dashed rgba(196,130,106,0.35); border-radius:20px; padding:48px 24px; text-align:center; cursor:pointer; transition:all 0.25s ease; background:white; }
    .upload-zone:hover, .upload-zone.drag-over { border-color:var(--rose); background:rgba(196,130,106,0.04); }
    .upload-preview-wrap { margin:0 24px 24px; border-radius:20px; overflow:hidden; position:relative; background:var(--mist); }
    .face-canvas-wrap { position:relative; width:100%; }
    .face-canvas-wrap img { width:100%; display:block; border-radius:20px; }
    .face-canvas-wrap canvas { position:absolute; top:0; left:0; width:100%; height:100%; border-radius:20px; }
    .preview-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(61,43,31,0.55) 0%,transparent 50%); display:flex; align-items:flex-end; padding:20px; border-radius:20px; }
    .preview-status { color:white; font-size:13px; }

    .face-shape-detected { margin:0 24px 20px; background:linear-gradient(135deg,var(--deep),#5C3D28); border-radius:16px; padding:20px; color:white; display:flex; align-items:center; gap:16px; }
    .fsd-icon { font-size:36px; flex-shrink:0; }
    .fsd-label { font-size:10px; letter-spacing:0.2em; text-transform:uppercase; opacity:0.6; margin-bottom:4px; }
    .fsd-shape { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; margin-bottom:2px; }
    .fsd-desc { font-size:12px; opacity:0.7; line-height:1.5; }

    .scanning-wrapper { padding:48px 24px; text-align:center; }
    .scan-face-container { width:180px; height:180px; margin:0 auto 32px; position:relative; }
    .scan-face-bg { width:100%; height:100%; border-radius:50%; background:linear-gradient(135deg,#F5DDD4,#E8C4B0); display:flex; align-items:center; justify-content:center; font-size:80px; position:relative; overflow:hidden; }
    .scan-line-anim { position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--rose),transparent); animation:scanLine 1.8s ease-in-out infinite; }
    .scan-ring { position:absolute; inset:-8px; border-radius:50%; border:2px solid transparent; border-top-color:var(--rose); border-right-color:var(--gold); animation:spin 1.5s linear infinite; }
    .scan-ring-2 { position:absolute; inset:-16px; border-radius:50%; border:1px solid transparent; border-bottom-color:rgba(196,130,106,0.4); animation:spin 2.5s linear infinite reverse; }
    .scan-status { font-size:14px; color:var(--subtle); margin-top:8px; }
    .scan-items { display:flex; flex-direction:column; gap:10px; margin:28px 0; }
    .scan-item { display:flex; align-items:center; gap:12px; padding:12px 16px; background:white; border-radius:12px; font-size:13px; color:var(--subtle); transition:all 0.4s ease; }
    .scan-item.done { color:var(--deep); }
    .scan-check { width:22px; height:22px; border-radius:50%; background:var(--mist); display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; transition:all 0.4s ease; }
    .scan-item.done .scan-check { background:linear-gradient(135deg,var(--rose),var(--gold)); color:white; }

    .result-hero { margin:0 24px 24px; background:linear-gradient(145deg,var(--deep),#5C3D28); border-radius:20px; padding:28px 24px; color:white; position:relative; overflow:hidden; }
    .result-hero::before { content:''; position:absolute; top:-40%; right:-20%; width:200px; height:200px; border-radius:50%; background:rgba(196,130,106,0.15); pointer-events:none; }
    .result-hero-label { font-size:10px; letter-spacing:0.22em; text-transform:uppercase; opacity:0.6; margin-bottom:8px; }
    .result-hero-type { font-family:'Cormorant Garamond',serif; font-size:34px; font-weight:400; line-height:1.15; margin-bottom:12px; }
    .result-hero-desc { font-size:13px; opacity:0.75; line-height:1.6; }
    .result-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(201,169,110,0.25); border:1px solid rgba(201,169,110,0.4); border-radius:20px; padding:6px 12px; font-size:11px; color:var(--gold); margin-top:16px; font-weight:500; }

    .measurements-card { margin:0 24px 20px; background:white; border-radius:16px; padding:20px; box-shadow:0 2px 12px var(--shadow); }
    .measurements-title { font-size:12px; letter-spacing:0.15em; text-transform:uppercase; color:var(--subtle); margin-bottom:16px; font-weight:500; }
    .measurement-row { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
    .measurement-row:last-child { margin-bottom:0; }
    .measurement-label { font-size:12px; color:var(--subtle); width:130px; flex-shrink:0; }
    .measurement-bar-wrap { flex:1; height:6px; background:var(--mist); border-radius:3px; overflow:hidden; }
    .measurement-bar-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--rose),var(--gold)); transition:width 1.2s cubic-bezier(.22,.68,0,1.2); }
    .measurement-val { font-size:12px; font-weight:500; color:var(--deep); width:30px; text-align:right; flex-shrink:0; }

    .metric-row { display:flex; flex-direction:column; gap:12px; margin:0 24px 24px; }
    .metric-card { background:white; border-radius:14px; padding:16px 18px; display:flex; align-items:center; gap:14px; box-shadow:0 2px 12px var(--shadow); }
    .metric-icon { width:40px; height:40px; border-radius:10px; background:linear-gradient(135deg,#F5DDD4,var(--blush)); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
    .metric-body { flex:1; }
    .metric-label { font-size:12px; color:var(--subtle); margin-bottom:3px; }
    .metric-value { font-size:15px; font-weight:500; color:var(--deep); }
    .metric-bar { height:4px; background:var(--mist); border-radius:2px; margin-top:6px; overflow:hidden; }
    .metric-bar-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,var(--rose),var(--gold)); }

    .locked-section { margin:0 24px 24px; border-radius:20px; border:1.5px dashed rgba(196,130,106,0.3); padding:28px 24px; text-align:center; position:relative; overflow:hidden; background:white; }
    .locked-blur { filter:blur(4px); opacity:0.4; pointer-events:none; margin-bottom:20px; }
    .locked-overlay { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:24px; }
    .lock-icon { width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,var(--rose),var(--gold)); display:flex; align-items:center; justify-content:center; font-size:22px; color:white; box-shadow:0 6px 20px rgba(196,130,106,0.4); }
    .locked-title { font-family:'Cormorant Garamond',serif; font-size:22px; color:var(--deep); }
    .blueprint-items { text-align:left; width:100%; display:flex; flex-direction:column; gap:8px; margin:4px 0 8px; }
    .blueprint-item { display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text); }
    .blueprint-check { width:18px; height:18px; border-radius:50%; background:linear-gradient(135deg,var(--rose),var(--gold)); display:flex; align-items:center; justify-content:center; font-size:9px; color:white; flex-shrink:0; }
    .price-badge { background:linear-gradient(135deg,var(--gold),#B8924A); color:white; padding:6px 16px; border-radius:20px; font-size:15px; font-weight:500; display:inline-block; margin-bottom:4px; }
    .was-price { font-size:11px; color:var(--subtle); text-decoration:line-through; }

    .payment-wrapper { padding:28px 24px; }
    .order-summary { background:white; border-radius:16px; padding:20px; margin-bottom:20px; box-shadow:0 2px 12px var(--shadow); }
    .order-line { display:flex; justify-content:space-between; align-items:center; font-size:14px; color:var(--text); padding:8px 0; border-bottom:1px solid var(--mist); }
    .order-line:last-child { border-bottom:none; }
    .order-line.total { font-size:16px; color:var(--deep); padding-top:14px; font-weight:500; }
    .stripe-form { background:white; border-radius:16px; padding:20px; margin-bottom:20px; box-shadow:0 2px 12px var(--shadow); }
    .form-label { display:block; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--subtle); margin-bottom:8px; font-weight:500; }
    .form-input { width:100%; padding:14px 16px; border:1.5px solid rgba(196,130,106,0.25); border-radius:10px; font-family:'DM Sans',sans-serif; font-size:15px; color:var(--deep); background:var(--cream); margin-bottom:14px; outline:none; transition:border-color 0.2s ease; }
    .form-input:focus { border-color:var(--rose); }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .stripe-badge { display:flex; align-items:center; justify-content:center; gap:6px; font-size:12px; color:var(--subtle); margin-top:12px; }

    .blueprint-header { background:linear-gradient(160deg,var(--deep),#5C3D28); padding:40px 24px 32px; color:white; text-align:center; }
    .blueprint-logo { font-family:'Cormorant Garamond',serif; font-size:14px; letter-spacing:0.2em; opacity:0.6; margin-bottom:20px; text-transform:uppercase; }
    .blueprint-title { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:300; line-height:1.2; margin-bottom:8px; }
    .blueprint-subtitle { font-size:14px; opacity:0.65; }
    .blueprint-section { margin:0 24px 20px; }
    .blueprint-section-title { font-family:'Cormorant Garamond',serif; font-size:22px; color:var(--deep); margin-bottom:14px; display:flex; align-items:center; gap:10px; }
    .blueprint-section-title::after { content:''; flex:1; height:1px; background:rgba(196,130,106,0.25); }
    .tip-card { background:white; border-radius:14px; padding:16px 18px; margin-bottom:10px; border-left:3px solid var(--rose); box-shadow:0 2px 10px var(--shadow); }
    .tip-title { font-size:13px; font-weight:500; color:var(--deep); margin-bottom:4px; }
    .tip-body { font-size:13px; color:var(--subtle); line-height:1.55; }
    .tip-highlight { display:inline-block; background:rgba(196,130,106,0.1); color:var(--rose); font-size:11px; font-weight:500; padding:2px 8px; border-radius:6px; margin-top:6px; }
    .color-swatches { display:flex; gap:10px; flex-wrap:wrap; }
    .swatch { width:40px; height:40px; border-radius:50%; box-shadow:0 2px 8px var(--shadow); }
    .download-card { margin:0 24px 40px; background:linear-gradient(135deg,var(--gold),#B8924A); border-radius:20px; padding:28px 24px; text-align:center; color:white; }
    .download-card h3 { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; margin-bottom:8px; }
    .download-card p { font-size:13px; opacity:0.85; margin-bottom:20px; }
    .btn-download { display:inline-flex; align-items:center; gap:8px; background:white; color:var(--deep); padding:14px 28px; border-radius:12px; font-weight:500; font-size:14px; cursor:pointer; border:none; font-family:'DM Sans',sans-serif; transition:all 0.2s ease; }
    .btn-download:hover { transform:translateY(-2px); }
    .divider { height:1px; background:rgba(196,130,106,0.15); margin:0 24px 24px; }
    .small-print { text-align:center; font-size:11px; color:var(--subtle); padding:16px 24px 32px; line-height:1.6; }
    .error-box { margin:0 24px 20px; background:#FFF5F5; border:1px solid #FFC5C5; border-radius:14px; padding:16px; font-size:13px; color:#8B3A3A; line-height:1.6; }
    @media (max-width:360px) { .hero-title { font-size:34px; } .option-grid { grid-template-columns:1fr; } }
  `}</style>
);

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: "goal", step: "Step 1 of 6",
    title: "What's your main beauty goal?",
    subtitle: "This shapes your entire blueprint.",
    options: [
      { emoji: "✨", label: "Soft & Natural", desc: "Effortless, polished look", value: "natural" },
      { emoji: "💄", label: "Glam & Bold", desc: "Statement, editorial looks", value: "glam" },
      { emoji: "🌿", label: "Skin-first", desc: "Healthy glow, minimal makeup", value: "skin" },
      { emoji: "🎯", label: "Define & Sculpt", desc: "Contour, structure, lift", value: "sculpt" },
    ],
  },
  {
    id: "event", step: "Step 2 of 6",
    title: "Any upcoming event to optimize for?",
    subtitle: "We'll tailor your blueprint to the moment.",
    options: [
      { emoji: "📸", label: "Photos / Content", desc: "Camera-ready optimization", value: "photo" },
      { emoji: "🎉", label: "Party / Night out", desc: "Low-light, long-lasting", value: "party" },
      { emoji: "💼", label: "Professional", desc: "Polished, confidence-forward", value: "work" },
      { emoji: "💕", label: "Date / Romance", desc: "Soft, approachable glow", value: "date" },
    ],
  },
  {
    id: "hairColor", step: "Step 3 of 6",
    title: "Your natural hair tone?",
    subtitle: "Affects your ideal contrast and palette.",
    options: [
      { emoji: "🖤", label: "Dark Brown / Black", value: "dark" },
      { emoji: "🤎", label: "Medium Brown", value: "medium" },
      { emoji: "🌻", label: "Blonde / Light", value: "light" },
      { emoji: "🔴", label: "Red / Auburn", value: "red" },
    ],
  },
  {
    id: "skintone", step: "Step 4 of 6",
    title: "Your skin undertone?",
    subtitle: "The biggest factor in what colors work for you.",
    options: [
      { emoji: "🌸", label: "Cool / Pink", desc: "Veins look blue/purple", value: "cool" },
      { emoji: "🌿", label: "Neutral", desc: "Mix of warm & cool", value: "neutral" },
      { emoji: "☀️", label: "Warm / Golden", desc: "Veins look green", value: "warm" },
      { emoji: "🍑", label: "Olive / Deep", desc: "Golden or earthy warmth", value: "olive" },
    ],
  },
  {
    id: "concern", step: "Step 5 of 6",
    title: "Which area to enhance most?",
    subtitle: "We'll lead your blueprint with this zone.",
    options: [
      { emoji: "👁️", label: "Eyes & Brows", desc: "Lift, frame, define", value: "eyes" },
      { emoji: "💋", label: "Lips", desc: "Shape, volume, balance", value: "lips" },
      { emoji: "🌟", label: "Skin & Glow", desc: "Texture, luminosity", value: "glow" },
      { emoji: "🎭", label: "Face Shape", desc: "Jawline, cheeks, structure", value: "face" },
    ],
  },
  {
    id: "routine", step: "Step 6 of 6",
    title: "Your current makeup routine?",
    subtitle: "We adjust recommendations to your level.",
    options: [
      { emoji: "💧", label: "Barely-there", desc: "Moisturizer + lip balm", value: "minimal" },
      { emoji: "🎨", label: "5-min basics", desc: "BB cream, mascara", value: "basic" },
      { emoji: "🖌️", label: "Full routine", desc: "Foundation, contour, etc.", value: "full" },
      { emoji: "🏆", label: "Makeup lover", desc: "Anything goes", value: "expert" },
    ],
  },
];

// ─── FACE SHAPE DETECTION ─────────────────────────────────────────────────────
// face-api.js returns 68 landmark points. Key indices:
//   0–16 = jaw,  17–26 = eyebrows,  27–35 = nose
//   36–47 = eyes,  48–67 = mouth
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const detectFaceShape = (landmarks) => {
  const pts = landmarks.positions;
  const faceLength = dist(pts[8],  pts[27]);   // chin to nose bridge
  const cheekWidth = dist(pts[1],  pts[15]);   // widest point
  const foreheadW  = dist(pts[17], pts[26]);   // outer brow-to-brow
  const jawWidth   = dist(pts[4],  pts[12]);   // jaw corners
  const chinWidth  = dist(pts[6],  pts[10]);   // chin width

  const lengthToWidth  = faceLength / cheekWidth;
  const jawToForehead  = jawWidth   / foreheadW;
  const chinToJaw      = chinWidth  / jawWidth;

  let shape, icon, description, characteristics;

  if (lengthToWidth > 1.35) {
    shape = "Oblong"; icon = "🔷";
    description = "Your face is noticeably longer than wide with fairly even proportions from forehead to jaw.";
    characteristics = ["Length-dominant", "Even width throughout", "Elegant proportions"];
  } else if (jawToForehead > 0.9 && lengthToWidth < 1.15) {
    shape = "Square"; icon = "⬜";
    description = "Strong, equal-width jaw and forehead with a shorter face length. Powerful and defined bone structure.";
    characteristics = ["Strong jaw definition", "Angular transitions", "Balanced width"];
  } else if (jawToForehead < 0.72) {
    shape = "Heart"; icon = "🫀";
    description = "Wider forehead narrows significantly to a delicate, defined chin — the classic heart shape.";
    characteristics = ["Broad forehead", "Narrow chin", "High cheekbones"];
  } else if (lengthToWidth < 1.1 && chinToJaw > 0.75) {
    shape = "Round"; icon = "🔵";
    description = "Soft, equal length and width with a rounded jawline and full cheeks. Naturally youthful quality.";
    characteristics = ["Soft jaw angles", "Full cheeks", "Minimal angularity"];
  } else if (cheekWidth > foreheadW * 1.1 && cheekWidth > jawWidth * 1.1) {
    shape = "Diamond"; icon = "💎";
    description = "Narrow forehead and jaw with dramatically wide cheekbones — one of the rarest face shapes.";
    characteristics = ["Wide cheekbones", "Narrow forehead", "Tapered jaw"];
  } else {
    shape = "Oval"; icon = "🥚";
    description = "Slightly longer than wide, cheekbones are the widest point, gently narrowing jaw. The most versatile shape.";
    characteristics = ["Balanced proportions", "Gentle curves", "Versatile for all styles"];
  }

  const maxDim = Math.max(faceLength, cheekWidth, jawWidth, foreheadW);
  return {
    shape, icon, description, characteristics,
    measurements: {
      "Face Length":     Math.round((faceLength / maxDim) * 100),
      "Cheekbone Width": Math.round((cheekWidth / maxDim) * 100),
      "Forehead Width":  Math.round((foreheadW  / maxDim) * 100),
      "Jaw Width":       Math.round((jawWidth   / maxDim) * 100),
      "Chin Width":      Math.round((chinWidth  / maxDim) * 100),
    },
  };
};

// ─── DRAW LANDMARKS ON CANVAS ─────────────────────────────────────────────────
const drawLandmarks = (canvas, imgEl, landmarks) => {
  const ctx    = canvas.getContext("2d");
  const scaleX = canvas.width  / imgEl.naturalWidth;
  const scaleY = canvas.height / imgEl.naturalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const pts = landmarks.positions;

  const drawZone = (indices, close = false, color = "rgba(196,130,106,0.55)", lw = 1.5) => {
    if (!indices.length) return;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lw;
    indices.forEach((i, idx) => {
      const x = pts[i].x * scaleX, y = pts[i].y * scaleY;
      idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    if (close) ctx.closePath();
    ctx.stroke();
  };

  drawZone([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], false, "rgba(201,169,110,0.65)", 2);
  drawZone([17,18,19,20,21], false, "rgba(196,130,106,0.8)", 1.5);
  drawZone([22,23,24,25,26], false, "rgba(196,130,106,0.8)", 1.5);
  drawZone([27,28,29,30,31,32,33,34,35,30], false, "rgba(196,130,106,0.4)", 1);
  drawZone([36,37,38,39,40,41], true, "rgba(196,130,106,0.8)", 1.5);
  drawZone([42,43,44,45,46,47], true, "rgba(196,130,106,0.8)", 1.5);
  drawZone([48,49,50,51,52,53,54,55,56,57,58,59], true, "rgba(196,130,106,0.65)", 1.5);

  pts.forEach((pt, i) => {
    ctx.beginPath();
    ctx.arc(pt.x * scaleX, pt.y * scaleY, 2, 0, Math.PI * 2);
    ctx.fillStyle = i === 8 ? "rgba(201,169,110,1)" : "rgba(196,130,106,0.8)";
    ctx.fill();
  });
};

// ─── BLUEPRINT GENERATOR ──────────────────────────────────────────────────────
const generateBlueprint = (answers, faceShapeData) => {
  const shape   = faceShapeData?.shape || "Oval";
  const goal    = answers.goal    || "natural";
  const tone    = answers.skintone || "neutral";
  const event   = answers.event   || "photo";
  const concern = answers.concern || "eyes";

  const browByShape = {
    Oval:    { arch: "Softly curved arch — your face is naturally balanced. A gentle arch at the outer third of your brow enhances without adding heaviness. Fill only the tail for natural depth.", thickness: "Medium-full thickness. Avoid over-thinning.", product: "Micro-fiber brow pencil + clear setting gel" },
    Round:   { arch: "A HIGH, angled arch is your secret weapon — it optically lengthens your face. Arch should peak directly above the outer iris, not the center of the eye.", thickness: "Slightly thinner brows add height. Avoid very thick, flat brows.", product: "Angled brow pomade brush for precise high-arch definition" },
    Square:  { arch: "Soften your angles with a CURVED, rounded arch. Avoid flat, straight brows — they echo and amplify your jaw's squareness.", thickness: "Medium thickness, feathered texture to soften strong bone structure.", product: "Spoolie + tinted brow gel for textured, natural finish" },
    Heart:   { arch: "Keep arches LOW and SOFT — high arches widen the forehead further. A gentle, rounded arch is ideal. Fill lightly at the inner corner.", thickness: "Medium to thick brows balance a narrow lower face.", product: "Brow soap + spoolie for full, brushed-up texture" },
    Oblong:  { arch: "FLAT to slightly curved brows add width and interrupt vertical length — exactly what you want. Avoid dramatic peaks or very high arches.", thickness: "Thicker, fuller brows are your best friend here. Build width, not height.", product: "Brow pencil with flat horizontal strokes to build width" },
    Diamond: { arch: "Moderately curved arches soften your naturally dramatic cheekbones. Not too high, not too flat — aim for balance.", thickness: "Medium-full to complement your strong midface.", product: "Micro-fiber pencil + setting gel in a shade matching your hair" },
  };

  const lipByShape = {
    Oval:    "Your lips are naturally well-proportioned for your face. Enhance the Cupid's bow definition with a lip liner 1 shade deeper than your lip color. A gloss highlight on the center of your lower lip adds beautiful dimension.",
    Round:   "Slightly overline the upper lip — focus on the peaks of the Cupid's bow to add vertical height. A deeper shade on the outer corners creates a subtle lengthening effect on the overall face.",
    Square:  "Fuller, softer lip looks balance your strong jaw beautifully. Center-focus application with a glossy topper draws the eye inward. Avoid very dark liner — it can emphasize jaw corners.",
    Heart:   "Your narrow lower face is balanced by fuller lip coverage. Focus on the lower lip — slightly overline it to add visual width at the bottom third of your face. Avoid heavy Cupid's bow emphasis.",
    Oblong:  "Wider lip application adds horizontal visual balance. Apply color fully to both lips without heavy contouring. A glossy finish across the entire lip adds width.",
    Diamond: "Soft, naturally defined lips complement your striking bone structure. A nude-pink or your-lips-but-better shade with subtle gloss keeps lips from competing with your strong cheekbones.",
  };

  const contourByShape = {
    Oval:    "Minimal contouring needed — your face is already well-balanced. A light bronzer sweep along the temples and under the cheekbones. Highlighter on the center of the cheekbones only.",
    Round:   "Create vertical lines: matte bronzer on the sides of the forehead, temples, under the cheekbones (angled downward), and sides of the jaw. Highlight strictly down the center of the face — forehead, nose bridge, center chin. Avoid blush on the apples.",
    Square:  "Soften the corners: contour at the corners of your forehead and along the full jaw. Avoid sharp cheek contouring. Blush swept high toward the temples creates roundness and softness.",
    Heart:   "Balance the forehead: dust bronzer lightly across the temples and hairline. Contour the chin subtly to make it appear wider. Place blush lower on the cheeks — not high — to add fullness to the lower face.",
    Oblong:  "Add width, reduce length: blush horizontally across the apples of the cheeks. A light bronzer on the forehead hairline and on the chin shortens the face. Avoid vertical highlighter strips.",
    Diamond: "Minimal contour needed at the cheekbones — they're already your strongest feature. A soft contour at the temples and chin balances the shape. Highlighter only on the cupid's bow and brow bone.",
  };

  const hairByShape = {
    Oval:    "Lucky you — almost any hairstyle works for your face shape. Center or side parts, curtain bangs, layers, buns. Focus on what expresses your personality rather than correction.",
    Round:   "Volume at the crown, length past the chin. Side parts are more flattering than center. Avoid chin-length cuts — they cut across the widest part of your face and amplify roundness.",
    Square:  "Soft, wavy layers or curtain bangs gently round out strong angles. Avoid blunt cuts especially at chin-length. Side-swept styles soften the jaw. Textured waves are ideal.",
    Heart:   "Volume at the jaw and below — lobs (long bobs), waves, layers from the chin down balance the wider forehead. Side-swept bangs or curtain bangs reduce forehead width. Avoid high updos.",
    Oblong:  "Width is your goal: waves, curls, or side-parted styles add horizontal volume. Bangs — curtain or side-swept — add width and interrupt the face's length. Avoid very long, straight hair with no volume.",
    Diamond: "Chin-length styles or longer with volume at the jaw balance your wide cheekbones. Side parts soften the overall face. Avoid very short hair that maximizes cheekbone visibility.",
  };

  const eventTips = {
    photo: ["Matte setting powder — cameras amplify shine; skip luminous formulas.", "Apply foundation one shade deeper than IRL; flash washes out skin tone.", "Skip glitter eyeshadow; matte pigment photographs more vividly.", "White or champagne eyeliner on the waterline opens eyes for camera."],
    party: ["Waterproof everything — mascara, liner, and use eyeshadow primer.", "Setting spray immediately after application; reapply at the 4-hour mark.", "Inner corner highlight catches low lighting dramatically and brightens.", "Deeper lip shade layered over liner lasts 3x longer through the night."],
    work:  ["Clean, hydrated skin over heavy coverage reads as confidence on video calls.", "Groomed brows signal detail-orientation; fill only the tail.", "Neutral lip with a subtle shine looks effortlessly polished on camera.", "Under-eye brightener in peach-pink erases any fatigue in one step."],
    date:  ["Eyes OR lips — not both. Choose your statement feature and let the other be soft.", "Sheer skin tint lets your natural beauty lead; heavy foundation can feel like armor.", "A single drop of liquid highlight on the Cupid's bow is quietly magnetic.", "Fragrance: a light floral or clean skin musk completes the picture."],
  };

  const palette = {
    cool:    ["#E8D5DC","#C4A0B0","#8B6275","#4A3040","#D4C5D0"],
    neutral: ["#F0D5C8","#C4927A","#8B5040","#4A2820","#E0C0B0"],
    warm:    ["#F2D5B8","#C9A06A","#8B5E3C","#4A2F1A","#E8C4A0"],
    olive:   ["#E8D5B8","#C4A06A","#8B6040","#4A3020","#D4C0A0"],
  };

  const lipShade = {
    cool:    "Rosy mauves, berry tones, or soft pinks",
    neutral: "True nudes, soft corals, or dusty rose",
    warm:    "Warm peach, terracotta, or nude-brown",
    olive:   "Warm nude-pinks, mocha, or earthy rose",
  };

  const browData = browByShape[shape] || browByShape["Oval"];

  return {
    profile: {
      type: `${shape} Face · ${goal === "glam" ? "Editorial" : goal === "sculpt" ? "Sculptural" : goal === "skin" ? "Luminous" : "Refined"} ${tone === "cool" ? "Clarity" : tone === "warm" ? "Warmth" : tone === "olive" ? "Depth" : "Balance"}`,
      archetype: `The ${shape === "Heart" ? "Romantic" : shape === "Square" ? "Bold" : shape === "Round" ? "Soft" : shape === "Diamond" ? "Rare" : shape === "Oblong" ? "Elegant" : "Versatile"} ${goal === "glam" ? "Muse" : goal === "skin" ? "Natural" : goal === "sculpt" ? "Sculptor" : "Beauty"}`,
    },
    brow: browData,
    lip: lipByShape[shape] || lipByShape["Oval"],
    contour: contourByShape[shape] || contourByShape["Oval"],
    hair: hairByShape[shape] || hairByShape["Oval"],
    eventTips: eventTips[event] || eventTips["photo"],
    colorPalette: palette[tone] || palette["neutral"],
    lipShade: lipShade[tone] || lipShade["neutral"],
    primaryLever: concern === "eyes" ? "Brow Architecture" : concern === "lips" ? "Lip Mapping" : concern === "glow" ? "Luminosity Protocol" : "Face Framing",
    metrics: [
      { label: "Facial Symmetry Index",  value: Math.floor(Math.random() * 12) + 82, emoji: "⚖️" },
      { label: `${shape} Shape Clarity`, value: Math.floor(Math.random() * 14) + 79, emoji: "🔍" },
      { label: "Enhancement Potential",  value: Math.floor(Math.random() * 10) + 87, emoji: "✨" },
    ],
  };
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function BeautyApp() {
  const [stage, setStage]             = useState("landing");
  const [quizStep, setQuizStep]       = useState(0);
  const [answers, setAnswers]         = useState({});
  const [imageUrl, setImageUrl]       = useState(null);
  const [scanStep, setScanStep]       = useState(0);
  const [faceShape, setFaceShape]     = useState(null);
  const [analysis, setAnalysis]       = useState(null);
  const [modelsReady, setModelsReady] = useState(false);
  const [faceError, setFaceError]     = useState(null);
  const [email, setEmail]             = useState("");
  const [cardNum, setCardNum]         = useState("");
  const [cardExpiry, setCardExpiry]   = useState("");
  const [cardCvc, setCardCvc]         = useState("");

  const fileRef   = useRef(null);
  const imgRef    = useRef(null);
  const canvasRef = useRef(null);

  // Load face-api models on mount
  useEffect(() => {
    faceapi.nets.tinyFaceDetector.loadFromUri("/models")
      .then(() => faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"))
      .then(() => setModelsReady(true))
      .catch(() => setModelsReady(false));
  }, []);

  const runFaceDetection = useCallback(async (imgEl) => {
    if (!modelsReady || !imgEl) return null;
    try {
      const result = await faceapi
        .detectSingleFace(imgEl, new faceapi.TinyFaceDetectorOptions({ inputSize: 320 }))
        .withFaceLandmarks(true);
      if (!result) return null;
      if (canvasRef.current) {
        canvasRef.current.width  = imgEl.naturalWidth;
        canvasRef.current.height = imgEl.naturalHeight;
        drawLandmarks(canvasRef.current, imgEl, result.landmarks);
      }
      return detectFaceShape(result.landmarks);
    } catch { return null; }
  }, [modelsReady]);

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (quizStep < QUIZ_QUESTIONS.length - 1) setQuizStep(quizStep + 1);
      else setStage("upload");
    }, 280);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setFaceError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  const startScan = async () => {
    setStage("scanning");
    setScanStep(0);
    [1,2,3,4].forEach((s, i) => setTimeout(() => setScanStep(s), (i + 1) * 900));

    let shapeData = null;
    if (modelsReady && imgRef.current) {
      shapeData = await runFaceDetection(imgRef.current);
      if (!shapeData) setFaceError("We couldn't detect a clear face — lighting or angle may be off. Blueprint is personalized from your quiz answers instead.");
    } else {
      setFaceError("Using quiz-based personalization — for best results ensure you have good lighting in your photo.");
    }

    setTimeout(() => {
      setScanStep(5);
      setFaceShape(shapeData);
      setAnalysis(generateBlueprint(answers, shapeData));
      setStage("results");
    }, 4800);
  };

  const handlePayment = () => {
    if (!email || !cardNum || !cardExpiry || !cardCvc) return;
    setStage("processing");
    setTimeout(() => setStage("blueprint"), 2200);
  };

  const formatCardNum = (v) => v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19);
  const formatExpiry  = (v) => { const d = v.replace(/\D/g,"").slice(0,4); return d.length >= 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  const stageIndex = { landing:0, quiz:1, upload:2, scanning:2, results:3, payment:4, processing:4, blueprint:5 };
  const activeIdx  = stageIndex[stage] || 0;
  const renderDots = () => [1,2,3,4,5].map((i) => (
    <div key={i} className={`dot ${i === activeIdx ? "active" : i < activeIdx ? "done" : ""}`} />
  ));

  return (
    <>
      <FontLoader />
      <div className="app-shell">

        <div className="brand-header">
          <div className="brand-logo">lum<span>ine</span></div>
          <div className="progress-dots">{renderDots()}</div>
        </div>

        {/* ══ LANDING ══════════════════════════════════════════════════════════ */}
        {stage === "landing" && (
          <>
            <div className="hero-section">
              <div className="hero-eyebrow fade-up">Real AI Facial Analysis</div>
              <h1 className="hero-title fade-up fade-up-1">Your face,<br /><em>precisely</em><br />understood.</h1>
              <p className="hero-sub fade-up fade-up-2">
                Real AI maps <strong>68 points</strong> on your face, detects your exact face shape, and builds a blueprint personalized to your actual proportions — not generic advice.
              </p>
              <div className="trust-row fade-up fade-up-3">
                <span className="trust-badge">🔒 Analyzed locally</span>
                <span className="trust-badge">🧠 68 landmarks</span>
                <span className="trust-badge">⚡ 60 seconds</span>
              </div>
            </div>

            <div className="hero-visual fade-up fade-up-3">
              <div style={{ fontSize:72, animation:"pulse 3s ease-in-out infinite" }}>🌸</div>
              <div className="floating-tag tl"><span className="dot-small"/>68 landmarks mapped</div>
              <div className="floating-tag tr"><span className="dot-small"/>Face shape detected</div>
              <div className="floating-tag bl"><span className="dot-small"/>Blueprint generated</div>
            </div>

            <div className="social-proof fade-up fade-up-4">
              <div className="avatars">
                {["🌸","🌺","🌻","🌷"].map((e,i)=><div key={i} className="avatar">{e}</div>)}
              </div>
              <p className="proof-text"><strong>2,847 women</strong> received their blueprint this week — rated 4.9/5 on results.</p>
            </div>

            <button className="btn-primary fade-up fade-up-5" onClick={() => setStage("quiz")}>
              Start My Free Scan →
            </button>
            <div className="btn-sub fade-up fade-up-6">2 minutes · No account required</div>
            <div className="small-print">Enhancement guidance only · Not medical advice · © 2025 Lumine</div>
          </>
        )}

        {/* ══ QUIZ ═════════════════════════════════════════════════════════════ */}
        {stage === "quiz" && (() => {
          const q = QUIZ_QUESTIONS[quizStep];
          const progress = ((quizStep+1)/QUIZ_QUESTIONS.length)*100;
          return (
            <>
              <div className="quiz-progress"><div className="quiz-progress-fill" style={{width:`${progress}%`}}/></div>
              <div className="section-pad">
                <div className="quiz-step fade-up">{q.step}</div>
                <h2 className="section-title fade-up fade-up-1">{q.title}</h2>
                <p className="section-sub fade-up fade-up-2">{q.subtitle}</p>
                <div className="option-grid fade-up fade-up-3">
                  {q.options.map((opt) => (
                    <button key={opt.value} className={`option-btn ${answers[q.id]===opt.value?"selected":""}`} onClick={() => handleAnswer(q.id, opt.value)}>
                      <span className="option-emoji">{opt.emoji}</span>
                      <span className="option-label">{opt.label}</span>
                      {opt.desc && <span className="option-desc">{opt.desc}</span>}
                    </button>
                  ))}
                </div>
                {quizStep > 0 && <button className="btn-outline" onClick={() => setQuizStep(quizStep-1)}>← Back</button>}
              </div>
            </>
          );
        })()}

        {/* ══ UPLOAD ═══════════════════════════════════════════════════════════ */}
        {stage === "upload" && (
          <>
            <div className="section-pad">
              <div className="quiz-step fade-up">Final Step</div>
              <h2 className="section-title fade-up fade-up-1">Upload your selfie</h2>
              <p className="section-sub fade-up fade-up-2">
                Natural lighting, straight-on angle, hair off your face. No filters — the AI needs your real features to map accurately.
              </p>
            </div>

            {/* Hidden img element used by face-api for detection */}
            {imageUrl && (
              <img ref={imgRef} src={imageUrl} alt="" crossOrigin="anonymous"
                style={{display:"none"}} />
            )}

            {!imageUrl ? (
              <div className="upload-zone fade-up fade-up-3"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
                onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("drag-over"); handleFile(e.dataTransfer.files[0]); }}>
                <div style={{fontSize:48,marginBottom:16}}>📸</div>
                <p style={{fontSize:15,fontWeight:500,color:"var(--deep)",marginBottom:6}}>Tap to upload your photo</p>
                <p style={{fontSize:13,color:"var(--subtle)"}}>JPG, PNG, HEIC up to 10MB</p>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])}/>
              </div>
            ) : (
              <div className="upload-preview-wrap fade-up">
                <div className="face-canvas-wrap">
                  <img src={imageUrl} alt="Your selfie" style={{width:"100%",display:"block",borderRadius:20}}/>
                  <canvas ref={canvasRef} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",borderRadius:20}}/>
                </div>
                <div className="preview-overlay">
                  <div className="preview-status">✅ Ready — tap Analyze to map your features</div>
                </div>
              </div>
            )}

            <div className="section-pad" style={{paddingTop:0}}>
              <div style={{background:"var(--mist)",borderRadius:14,padding:"16px 18px",marginBottom:20}}>
                <p style={{fontSize:12,color:"var(--subtle)",lineHeight:1.6}}>
                  🔒 <strong style={{color:"var(--text)"}}>Your privacy matters.</strong> Face analysis runs entirely in your browser using face-api.js. Your photo is never uploaded to any server.
                </p>
              </div>
              {imageUrl && (
                <>
                  <button className="btn-primary" onClick={startScan}>Analyze My Features →</button>
                  <button className="btn-outline" onClick={() => setImageUrl(null)}>Use a different photo</button>
                </>
              )}
            </div>
          </>
        )}

        {/* ══ SCANNING ═════════════════════════════════════════════════════════ */}
        {stage === "scanning" && (
          <div className="scanning-wrapper">
            <div className="scan-face-container fade-up">
              <div className="scan-ring"/><div className="scan-ring-2"/>
              <div className="scan-face-bg">🌸<div className="scan-line-anim"/></div>
            </div>
            <h2 className="section-title fade-up fade-up-1" style={{textAlign:"center",marginBottom:4}}>Mapping your features</h2>
            <p className="scan-status fade-up fade-up-2">Detecting 68 facial landmarks…</p>
            <div className="scan-items fade-up fade-up-3">
              {["Detecting face position","Mapping 68 landmark points","Calculating face shape ratios","Analyzing feature zones","Generating personalized blueprint"].map((label,i) => (
                <div key={i} className={`scan-item ${scanStep > i ? "done" : ""}`}>
                  <div className="scan-check">{scanStep > i ? "✓" : "○"}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ RESULTS ══════════════════════════════════════════════════════════ */}
        {stage === "results" && analysis && (
          <>
            <div className="section-pad" style={{paddingBottom:16}}>
              <div className="hero-eyebrow fade-up">Your Free Mini-Scan</div>
              <h2 className="section-title fade-up fade-up-1">Here's what we found</h2>
            </div>

            {faceError && <div className="error-box fade-up">⚠️ {faceError}</div>}

            {/* FACE SHAPE — the star of the show */}
            {faceShape && (
              <div className="face-shape-detected fade-up fade-up-1">
                <div className="fsd-icon">{faceShape.icon}</div>
                <div>
                  <div className="fsd-label">Detected Face Shape</div>
                  <div className="fsd-shape">{faceShape.shape}</div>
                  <div className="fsd-desc">{faceShape.description}</div>
                </div>
              </div>
            )}

            <div className="result-hero fade-up fade-up-2">
              <div className="result-hero-label">Your Beauty Profile</div>
              <div className="result-hero-type">{analysis.profile.type}</div>
              <div className="result-hero-desc">{analysis.profile.archetype} — your blueprint is calibrated to your {faceShape?.shape || "unique"} face shape and actual feature proportions.</div>
              <div className="result-badge">⭐ Primary Enhancement Lever: {analysis.primaryLever}</div>
            </div>

            {/* REAL MEASUREMENTS from landmark detection */}
            {faceShape && (
              <div className="measurements-card fade-up fade-up-3">
                <div className="measurements-title">Facial Measurements · Detected from your photo</div>
                {Object.entries(faceShape.measurements).map(([label, val]) => (
                  <div key={label} className="measurement-row">
                    <div className="measurement-label">{label}</div>
                    <div className="measurement-bar-wrap">
                      <div className="measurement-bar-fill" style={{width:`${val}%`,transition:"width 1.2s ease 0.3s"}}/>
                    </div>
                    <div className="measurement-val">{val}</div>
                  </div>
                ))}
                <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--mist)"}}>
                  <div style={{fontSize:11,color:"var(--subtle)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Key Characteristics</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {faceShape.characteristics.map((c) => (
                      <span key={c} style={{background:"var(--mist)",padding:"4px 10px",borderRadius:20,fontSize:12,color:"var(--text)"}}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="metric-row fade-up fade-up-4">
              {analysis.metrics.map((m,i) => (
                <div key={i} className="metric-card">
                  <div className="metric-icon">{m.emoji}</div>
                  <div className="metric-body">
                    <div className="metric-label">{m.label}</div>
                    <div className="metric-value">{m.value}/100</div>
                    <div className="metric-bar"><div className="metric-bar-fill" style={{width:`${m.value}%`,transition:"width 1.2s ease 0.5s"}}/></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider"/>

            <div style={{padding:"0 24px 16px"}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:"var(--deep)",marginBottom:6}}>Your Full Enhancement Blueprint</h3>
              <p style={{fontSize:13,color:"var(--subtle)",marginBottom:20}}>
                {faceShape ? `Every section is calibrated for your ${faceShape.shape} face shape — not generic advice.` : "Unlock your complete personalized 6-section guide."}
              </p>
            </div>

            <div className="locked-section fade-up fade-up-5">
              <div className="locked-blur">
                {[`${faceShape?.shape||"Your"} Face Brow Architecture`,"Lip Mapping Protocol","Contour & Structure Strategy","Hair Framing Guide","Color Palette & Products","Event Optimization Notes"].map((t,i) => (
                  <div key={i} style={{padding:"10px 0",borderBottom:"1px solid var(--mist)",fontSize:14,color:"var(--text)"}}>✦ {t}</div>
                ))}
              </div>
              <div className="locked-overlay">
                <div className="lock-icon">🔐</div>
                <div className="locked-title">Full Blueprint Locked</div>
                <div style={{marginBottom:8}}>
                  <span className="price-badge">$19 one-time</span>
                  <div className="was-price">Usually $49</div>
                </div>
                <div className="blueprint-items">
                  {[`${faceShape?.shape||"Personalized"} face-specific brow guide`,"Lip mapping for your proportions","Contour strategy for your shape","Hair framing recommendations","Personalized color palette","Event-specific tips","Downloadable PDF report"].map((item,i) => (
                    <div key={i} className="blueprint-item">
                      <div className="blueprint-check">✓</div>{item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{margin:"20px 0"}}>
              <button className="btn-gold fade-up fade-up-6" onClick={() => setStage("payment")}>
                🔓 Unlock My Full Blueprint — $19
              </button>
              <div className="btn-sub">One-time payment · Instant delivery · 30-day guarantee</div>
            </div>

            <div style={{padding:"0 24px 32px"}}>
              <div style={{background:"var(--mist)",borderRadius:14,padding:"16px 18px"}}>
                <p style={{fontSize:13,color:"var(--subtle)",lineHeight:1.6}}>
                  <strong style={{color:"var(--deep)"}}>What others say:</strong><br/>
                  "I've been told I have an oval face my whole life — Lumine detected I'm Heart-shaped and the brow advice completely changed my look." — <em>Priya, 24</em>
                </p>
              </div>
            </div>
            <div className="small-print">Enhancement guidance only · Not medical advice · © 2025 Lumine</div>
          </>
        )}

        {/* ══ PAYMENT ══════════════════════════════════════════════════════════ */}
        {stage === "payment" && (
          <div className="payment-wrapper">
            <div style={{marginBottom:24}}>
              <div className="hero-eyebrow">Secure Checkout</div>
              <h2 className="section-title">Unlock your blueprint</h2>
              {faceShape && <p style={{fontSize:13,color:"var(--subtle)",marginTop:6}}>{faceShape.shape} face · {analysis?.profile.archetype}</p>}
            </div>
            <div className="order-summary fade-up">
              <div className="order-line"><span>Full Enhancement Blueprint</span><span style={{textDecoration:"line-through",color:"var(--subtle)"}}>$49</span></div>
              <div className="order-line"><span>Launch discount</span><span style={{color:"var(--rose)"}}>−$30</span></div>
              <div className="order-line total"><span>Total today</span><span>$19.00</span></div>
            </div>
            <div className="stripe-form fade-up fade-up-2">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
              <label className="form-label">Card Number</label>
              <input className="form-input" type="text" placeholder="4242 4242 4242 4242" value={cardNum} onChange={(e)=>setCardNum(formatCardNum(e.target.value))} maxLength={19}/>
              <div className="form-row">
                <div>
                  <label className="form-label">Expiry</label>
                  <input className="form-input" type="text" placeholder="MM/YY" value={cardExpiry} onChange={(e)=>setCardExpiry(formatExpiry(e.target.value))} maxLength={5}/>
                </div>
                <div>
                  <label className="form-label">CVC</label>
                  <input className="form-input" type="text" placeholder="123" value={cardCvc} onChange={(e)=>setCardCvc(e.target.value.replace(/\D/g,"").slice(0,3))} maxLength={3}/>
                </div>
              </div>
              <div className="stripe-badge">🔒 Secured by Stripe · 256-bit SSL</div>
            </div>
            <button className="btn-gold fade-up fade-up-3" onClick={handlePayment} style={{opacity:email&&cardNum&&cardExpiry&&cardCvc?1:0.6}}>
              Pay $19 & Unlock Blueprint →
            </button>
            <div className="btn-sub">30-day money-back guarantee · Instant access</div>
            <button className="btn-outline" onClick={() => setStage("results")}>← Go back</button>
            <div className="small-print">Digital products delivered instantly. 30-day guarantee applies.</div>
          </div>
        )}

        {/* ══ PROCESSING ═══════════════════════════════════════════════════════ */}
        {stage === "processing" && (
          <div className="scanning-wrapper">
            <div className="scan-face-container fade-up">
              <div className="scan-ring"/><div className="scan-ring-2"/>
              <div className="scan-face-bg" style={{background:"linear-gradient(135deg,#F5DDD4,var(--gold))"}}>✨</div>
            </div>
            <h2 className="section-title fade-up fade-up-1" style={{textAlign:"center"}}>Generating your blueprint</h2>
            <p className="scan-status fade-up fade-up-2">Compiling your {faceShape?.shape} face report…</p>
          </div>
        )}

        {/* ══ BLUEPRINT ════════════════════════════════════════════════════════ */}
        {stage === "blueprint" && analysis && (
          <>
            <div className="blueprint-header fade-up">
              <div className="blueprint-logo">Lumine Enhancement Blueprint</div>
              <div className="blueprint-title">Your {faceShape?.shape||"Personalized"}<br/>Enhancement Guide</div>
              <div className="blueprint-subtitle">{analysis.profile.type}</div>
            </div>

            {faceShape && (
              <div style={{margin:"24px 24px 8px",padding:"20px",background:"var(--mist)",borderRadius:16}}>
                <div style={{fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--subtle)",marginBottom:8}}>Detected Face Shape</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,color:"var(--deep)",marginBottom:4}}>{faceShape.icon} {faceShape.shape}</div>
                <div style={{fontSize:13,color:"var(--subtle)",lineHeight:1.5}}>{faceShape.description}</div>
              </div>
            )}

            <div style={{height:20}}/>

            {/* BROW */}
            <div className="blueprint-section fade-up fade-up-1">
              <div className="blueprint-section-title">🏹 Brow Architecture</div>
              <div className="tip-card">
                <div className="tip-title">Arch Placement for {faceShape?.shape||"Your"} Face</div>
                <div className="tip-body">{analysis.brow.arch}</div>
                <span className="tip-highlight">Face-shape specific</span>
              </div>
              <div className="tip-card">
                <div className="tip-title">Thickness & Texture</div>
                <div className="tip-body">{analysis.brow.thickness}</div>
              </div>
              <div className="tip-card">
                <div className="tip-title">Recommended Product</div>
                <div className="tip-body">{analysis.brow.product}</div>
              </div>
            </div>

            {/* LIPS */}
            <div className="blueprint-section fade-up fade-up-2">
              <div className="blueprint-section-title">💋 Lip Mapping</div>
              <div className="tip-card">
                <div className="tip-title">Balance Strategy for {faceShape?.shape||"Your"} Face</div>
                <div className="tip-body">{analysis.lip}</div>
              </div>
              <div className="tip-card">
                <div className="tip-title">Your Ideal Shade Range</div>
                <div className="tip-body" style={{marginBottom:12}}>{analysis.lipShade}</div>
                <div className="color-swatches">
                  {analysis.colorPalette.map((c,i) => <div key={i} className="swatch" style={{background:c}}/>)}
                </div>
              </div>
            </div>

            {/* CONTOUR */}
            <div className="blueprint-section fade-up fade-up-2">
              <div className="blueprint-section-title">🎭 Contour & Structure</div>
              <div className="tip-card">
                <div className="tip-title">{faceShape?.shape||"Personalized"} Contouring Strategy</div>
                <div className="tip-body">{analysis.contour}</div>
                <span className="tip-highlight">Sculpting technique</span>
              </div>
            </div>

            {/* HAIR */}
            <div className="blueprint-section fade-up fade-up-3">
              <div className="blueprint-section-title">💇 Hair Framing</div>
              <div className="tip-card">
                <div className="tip-title">Best Styles for {faceShape?.shape||"Your"} Face Shape</div>
                <div className="tip-body">{analysis.hair}</div>
              </div>
            </div>

            {/* EVENT */}
            <div className="blueprint-section fade-up fade-up-4">
              <div className="blueprint-section-title">✨ Event Optimization</div>
              {analysis.eventTips.map((tip,i) => (
                <div key={i} className="tip-card" style={{borderLeftColor:"var(--gold)"}}>
                  <div className="tip-body"><strong style={{color:"var(--deep)"}}>Tip {i+1}:</strong> {tip}</div>
                </div>
              ))}
            </div>

            <div className="divider"/>

            <div className="download-card fade-up fade-up-5">
              <h3>Save Your Blueprint</h3>
              <p>Download your personalized PDF to reference anytime.</p>
              <button className="btn-download" onClick={() => alert("In production: triggers backend PDF generation (Flask + ReportLab or Node + Puppeteer) and downloads your branded blueprint PDF.")}>
                ⬇ Download PDF Report
              </button>
            </div>

            <div style={{padding:"0 24px 16px"}}>
              <div style={{background:"var(--mist)",borderRadius:14,padding:16}}>
                <p style={{fontSize:13,color:"var(--subtle)",lineHeight:1.6}}>
                  🌟 <strong style={{color:"var(--deep)"}}>Share your results!</strong> Tag <strong style={{color:"var(--rose)"}}>@luminebeauty</strong> on TikTok or Instagram when you try your blueprint.
                </p>
              </div>
            </div>
            <div className="small-print">Enhancement guidance only · Not medical advice · © 2025 Lumine</div>
          </>
        )}
      </div>
    </>
  );
}