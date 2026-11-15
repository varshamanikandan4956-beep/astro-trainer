import React, { useState } from 'react';
import { Rocket, ShieldCheck, Droplets, Wind, Utensils, Zap, Satellite, RotateCcw, Trophy, BookOpen, AlertTriangle, CheckCircle2, Moon, Orbit } from 'lucide-react';

const missions = {
  Moon: {
    title: 'Lunar Outpost Mission',
    subtitle: 'Prepare a crew for a short mission near the lunar south pole.',
    days: 3,
    intro: 'Your crew has arrived at a simulated lunar research outpost. Keep the crew supplied while completing each mission decision.',
    events: [
      { title: 'Dusty solar panels', detail: 'Lunar dust has reduced the power available from the solar array.', choices: [{ label: 'Schedule a careful panel-cleaning task', effect: { energy: 12 }, feedback: 'Good planning! Cleaning restores some power.' }, { label: 'Ignore the warning', effect: { energy: -18 }, feedback: 'Power generation drops further.' }] },
      { title: 'Water recovery check', detail: 'The water recovery system needs attention. Choose how to respond.', choices: [{ label: 'Run a water-quality check', effect: { water: 10, energy: -5 }, feedback: 'The check helps protect the crew water supply.' }, { label: 'Use extra stored water', effect: { water: -15 }, feedback: 'The crew has water now, but reserves are lower.' }] },
      { title: 'EVA preparation', detail: 'A crew member needs to prepare for a short surface activity.', choices: [{ label: 'Check suit oxygen and power first', effect: { oxygen: 8, energy: -4 }, feedback: 'A careful suit check improves mission readiness.' }, { label: 'Rush outside', effect: { oxygen: -18, energy: -10 }, feedback: 'Skipping checks creates avoidable risk.' }] }
    ]
  },
  Mars: {
    title: 'Mars Habitat Mission',
    subtitle: 'Support a simulated crew during a remote Mars habitat exercise.',
    days: 3,
    intro: 'Your crew is inside a simulated Mars habitat. Resupply is limited, so every resource decision matters.',
    events: [
      { title: 'Habitat power dip', detail: 'A dust storm reduces sunlight reaching the habitat solar panels.', choices: [{ label: 'Switch to essential-power mode', effect: { energy: 12, food: -3 }, feedback: 'Essential systems stay powered while nonessential use is reduced.' }, { label: 'Keep all systems running', effect: { energy: -20 }, feedback: 'The energy reserve falls quickly.' }] },
      { title: 'Greenhouse water demand', detail: 'The plant-growth experiment needs water, but the crew also needs drinking water.', choices: [{ label: 'Allocate water carefully', effect: { water: -5, food: 8 }, feedback: 'Careful allocation supports the crop experiment.' }, { label: 'Use a large water reserve', effect: { water: -18, food: 12 }, feedback: 'The plants benefit, but water reserves are strained.' }] },
      { title: 'Air filter alert', detail: 'The habitat air system reports that a filter inspection is due.', choices: [{ label: 'Inspect the air system', effect: { oxygen: 10, energy: -6 }, feedback: 'Inspection helps maintain a safe simulated cabin environment.' }, { label: 'Delay maintenance', effect: { oxygen: -16 }, feedback: 'The simulated air reserve becomes less secure.' }] }
    ]
  }
};

const initial = { oxygen: 78, water: 72, food: 80, energy: 76 };

function ResourceCard({ icon: Icon, label, value, unit = '%' }) {
  const level = value < 30 ? 'low' : value < 55 ? 'mid' : 'good';
  return <div className="resource-card">
    <div className="resource-top"><span className="resource-icon"><Icon size={18}/></span><span>{label}</span><strong>{value}{unit}</strong></div>
    <div className="meter"><span className={level} style={{width: `${value}%`}} /></div>
    <small>{level === 'low' ? 'Needs attention' : level === 'mid' ? 'Monitor closely' : 'Stable'}</small>
  </div>;
}

export default function App() {
  const [planet, setPlanet] = useState('Moon');
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [resources, setResources] = useState(initial);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [finished, setFinished] = useState(false);

  const mission = missions[planet];
  const current = mission.events[step];
  const danger = Object.values(resources).some(v => v <= 0);

  function startMission(selected) {
    setPlanet(selected); setResources(initial); setStep(0); setScore(0);
    setMessage('Mission started. Read each situation and choose carefully.'); setFinished(false); setStarted(true);
  }

  function choose(choice) {
    const next = { ...resources };
    Object.entries(choice.effect).forEach(([key, change]) => { next[key] = Math.max(0, Math.min(100, next[key] + change)); });
    setResources(next);
    const safe = Object.values(next).every(v => v >= 30);
    setScore(s => s + (safe ? 100 : 40));
    setMessage(choice.feedback);
    if (Object.values(next).some(v => v <= 0)) { setFinished(true); return; }
    if (step === mission.events.length - 1) { setFinished(true); return; }
    setStep(s => s + 1);
  }

  function reset() {
    setStarted(false); setFinished(false); setStep(0); setResources(initial); setScore(0); setMessage('');
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><Orbit size={21}/></span><span>ASTRO<span className="brand-light">TRAINER</span></span></a>
      <div className="top-tag"><span className="live-dot"/> LEARNING SIMULATOR <span className="tag-divider">|</span> JUNIOR ASTRONAUT PROGRAM</div>
      <a className="source-link" href="https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/" target="_blank" rel="noreferrer">NASA learning source ↗</a>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span/> YOUR TRAINING STARTS HERE</div>
          <h1>Think like an astronaut.<br/><em>Explore beyond.</em></h1>
          <p>Make mission decisions, manage essential supplies, and discover why life-support systems matter during human space exploration.</p>
          <div className="hero-pills"><span><ShieldCheck size={15}/> Safety-first learning</span><span><Satellite size={15}/> Interactive missions</span></div>
        </div>
        <div className="planet-art" aria-label="Illustration of a planet and orbit">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="planet"><div className="planet-crater c1"/><div className="planet-crater c2"/><div className="planet-crater c3"/></div>
          <div className="mini-moon"/>
          <div className="star s1"/><div className="star s2"/><div className="star s3"/><div className="star s4"/>
          <div className="art-caption">MISSION CONTROL <b>01 / 03</b></div>
        </div>
      </section>

      {!started ? <section className="selection-section">
        <div className="section-heading"><div><div className="eyebrow">CHOOSE YOUR DESTINATION</div><h2>Select a training mission</h2></div><span className="step-label">01 — DESTINATION</span></div>
        <div className="mission-grid">
          <button className="mission-card moon-card" onClick={() => startMission('Moon')}>
            <div className="mission-visual moon-visual"><div className="moon-ball"/><span className="visual-label">LUNAR SURFACE</span></div>
            <div className="mission-info"><div><span className="planet-label">DESTINATION 01</span><h3>Moon mission</h3><p>Practice resource planning at a lunar outpost.</p></div><span className="arrow">↗</span></div>
            <div className="mission-meta"><span><Moon size={14}/> 3 decision stages</span><span>BEGIN TRAINING →</span></div>
          </button>
          <button className="mission-card mars-card" onClick={() => startMission('Mars')}>
            <div className="mission-visual mars-visual"><div className="mars-ball"/><span className="visual-label">MARTIAN HABITAT</span></div>
            <div className="mission-info"><div><span className="planet-label">DESTINATION 02</span><h3>Mars mission</h3><p>Balance supplies in a remote habitat.</p></div><span className="arrow">↗</span></div>
            <div className="mission-meta"><span><Orbit size={14}/> 3 decision stages</span><span>BEGIN TRAINING →</span></div>
          </button>
        </div>
        <div className="learning-note"><BookOpen size={18}/><p><b>Learning objective</b> Understand how astronauts depend on carefully managed air, water, food, and power during missions.</p></div>
      </section> : <section className="mission-console">
        <div className="section-heading"><div><div className="eyebrow">MISSION CONTROL / {planet.toUpperCase()}</div><h2>{mission.title}</h2><p className="mission-subtitle">{mission.subtitle}</p></div><button className="reset-btn" onClick={reset}><RotateCcw size={15}/> Change mission</button></div>
        <div className="console-grid">
          <div className="console-main">
            <div className="panel mission-panel">
              <div className="panel-header"><span className="panel-kicker">MISSION BRIEFING</span><span className="stage-count">STAGE {Math.min(step+1,3)} / 03</span></div>
              {!finished ? <>
                <h3>{current.title}</h3><p>{current.detail}</p>
                <div className="choice-list">{current.choices.map((c,i)=><button key={i} className="choice-btn" onClick={()=>choose(c)}><span className="choice-number">0{i+1}</span><span>{c.label}</span><span className="choice-arrow">→</span></button>)}</div>
              </> : <div className="result-view">
                <div className="result-icon">{danger ? <AlertTriangle size={28}/> : <Trophy size={28}/>}</div>
                <h3>{danger ? 'Mission needs review' : 'Mission exercise complete!'}</h3>
                <p>{danger ? 'A critical resource reached zero. Review your choices and try again.' : 'You completed all three training decisions. Great work, astronaut!'}</p>
                <div className="score-display"><span>TRAINING SCORE</span><strong>{score}</strong><small>POINTS</small></div>
                <button className="primary-btn" onClick={reset}>TRY ANOTHER MISSION <span>→</span></button>
              </div>}
              {message && <div className="feedback"><CheckCircle2 size={16}/><span>{message}</span></div>}
            </div>
            <div className="panel briefing-panel"><div className="brief-icon"><BookOpen size={19}/></div><div><b>Why resource management matters</b><p>NASA's life-support systems help control cabin air, oxygen, and water. In real missions, these systems are engineered and monitored carefully. This activity is a simplified learning simulation.</p></div></div>
          </div>
          <aside className="panel resources-panel">
            <div className="panel-header"><span className="panel-kicker">CREW RESOURCE STATUS</span><span className="status-chip"><span/> LIVE</span></div>
            <div className="resource-list">
              <ResourceCard icon={Wind} label="Oxygen" value={resources.oxygen}/>
              <ResourceCard icon={Droplets} label="Water" value={resources.water}/>
              <ResourceCard icon={Utensils} label="Food" value={resources.food}/>
              <ResourceCard icon={Zap} label="Energy" value={resources.energy}/>
            </div>
            <div className="score-box"><span><Trophy size={16}/> TRAINING SCORE</span><b>{score}</b><small>Points earned from decisions</small></div>
          </aside>
        </div>
      </section>}

      <section className="fact-strip"><div className="fact-icon"><Droplets size={20}/></div><div><b>Space science fact</b><p>NASA's Environmental Control and Life Support System (ECLSS) helps provide clean air and water aboard spacecraft and recovers water for reuse.</p></div><a href="https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/" target="_blank" rel="noreferrer">Explore NASA source ↗</a></section>
    </main>
    <footer><span>ASTRO TRAINER · EDUCATIONAL SIMULATION</span><span>Independent student project · Not affiliated with NASA</span></footer>
  </div>;
}