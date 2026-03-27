import { useEffect, useState, useCallback } from "react";
import { Analytics } from "@vercel/analytics/react";

const START = new Date("2025-09-01T08:00:00");
const ENDS = {
  college: new Date("2026-07-04T00:00:00"),
  lycee:   new Date("2026-06-05T18:00:00"),
};

const ZONES = {
  A: [
    { label: "Toussaint", debut: new Date("2025-10-18"), fin: new Date("2025-11-03"), color: "#EF9F27" },
    { label: "Noël",      debut: new Date("2025-12-20"), fin: new Date("2026-01-05"), color: "#378ADD" },
    { label: "Hiver",     debut: new Date("2026-02-14"), fin: new Date("2026-03-02"), color: "#5DCAA5" },
    { label: "Printemps", debut: new Date("2026-04-04"), fin: new Date("2026-04-20"), color: "#D4537E" },
  ],
  B: [
    { label: "Toussaint", debut: new Date("2025-10-18"), fin: new Date("2025-11-03"), color: "#EF9F27" },
    { label: "Noël",      debut: new Date("2025-12-20"), fin: new Date("2026-01-05"), color: "#378ADD" },
    { label: "Hiver",     debut: new Date("2026-02-21"), fin: new Date("2026-03-09"), color: "#5DCAA5" },
    { label: "Printemps", debut: new Date("2026-04-11"), fin: new Date("2026-04-27"), color: "#D4537E" },
  ],
  C: [
    { label: "Toussaint", debut: new Date("2025-10-18"), fin: new Date("2025-11-03"), color: "#EF9F27" },
    { label: "Noël",      debut: new Date("2025-12-20"), fin: new Date("2026-01-05"), color: "#378ADD" },
    { label: "Hiver",     debut: new Date("2026-02-07"), fin: new Date("2026-02-23"), color: "#5DCAA5" },
    { label: "Printemps", debut: new Date("2026-04-18"), fin: new Date("2026-05-04"), color: "#D4537E" },
  ],
};

const messages = [
  [0,  10,  "L'aventure commence, bon courage ! 💪"],
  [10, 25,  "C'est parti, tu es lancé(e) ! 🚀"],
  [25, 40,  "Un quart de fait, continue comme ça ! 🔥"],
  [40, 50,  "Tu approches de la moitié, tiens bon ! ⚡"],
  [50, 60,  "La moitié est passée, la fin se profile ! 🎯"],
  [60, 75,  "Plus que le tiers restant, tu gères ! 😎"],
  [75, 90,  "Le bout du tunnel est proche ! 🌟"],
  [90, 99,  "Toute dernière ligne droite ! 🏁"],
  [99, 101, "C'est (presque) fini, bravo ! 🎉"],
];

function getColor(pct) {
  if (pct < 33) return "rgba(107,90,220,0.9)";
  if (pct < 66) return "rgba(29,158,117,0.9)";
  if (pct < 85) return "rgba(239,159,39,0.9)";
  return "rgba(216,90,48,0.9)";
}

function getMsg(pct) {
  for (const [a, b, m] of messages) if (pct >= a && pct < b) return m;
  return "";
}

function toPos(date, mode) {
  const END = ENDS[mode];
  return Math.min(Math.max(((date - START) / (END - START)) * 100, 0), 100);
}

function getPhrase(days) {
  if (days <= 1)  return "Encore un tout petit effort… 😮‍💨";
  if (days <= 5)  return "Presque là, accroche-toi ! 🔥";
  if (days <= 10) return "La ligne d'arrivée approche ! 🏁";
  if (days <= 20) return `Plus que ${days} jours avant de pouvoir te poser 😌`;
  if (days <= 40) return `Courage, ${days} jours et c'est la liberté 💪`;
  return `T'as encore le temps… profites-en bien 😅`;
}

function getNextVac(now, zone) {
  const vacs = ZONES[zone];
  const next = vacs.find((v) => v.debut > now);
  if (!next) return null;
  const daysLeft = Math.ceil((next.debut - now) / (1000 * 60 * 60 * 24));
  return { ...next, daysLeft };
}

export default function SchoolYearProgress() {
  const [mode, setMode] = useState("college");
  const [zone, setZone] = useState("A");
  const [pct, setPct]   = useState(0);
  const [time, setTime] = useState({ j: 0, h: "00", m: "00", s: "00" });
  const [next, setNext] = useState(null);

  const update = useCallback(() => {
    const now = new Date();
    const END = ENDS[mode];
    const percent = Math.min(Math.max(((now - START) / (END - START)) * 100, 0), 100);
    setPct(percent);
    const rem = Math.max(END - now, 0);
    setTime({
      j: Math.floor(rem / (1000 * 60 * 60 * 24)),
      h: String(Math.floor((rem / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
      m: String(Math.floor((rem / (1000 * 60)) % 60)).padStart(2, "0"),
      s: String(Math.floor((rem / 1000) % 60)).padStart(2, "0"),
    });
    setNext(getNextVac(now, zone));
  }, [mode, zone]);

  useEffect(() => {
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [update]);

  const nowPos = toPos(new Date(), mode);
  const vacances = ZONES[zone];

  return (
    <>
      <Analytics />
      <div style={styles.bg}>
      <div style={{ ...styles.blob, width:"70%", height:"70%", top:"-10%", left:"-10%", background:"radial-gradient(ellipse,rgba(83,74,183,0.75) 0%,transparent 70%)" }} />
      <div style={{ ...styles.blob, width:"60%", height:"60%", bottom:"-10%", right:"-5%", background:"radial-gradient(ellipse,rgba(29,158,117,0.65) 0%,transparent 70%)" }} />
      <div style={{ ...styles.blob, width:"50%", height:"50%", top:"10%", right:"10%", background:"radial-gradient(ellipse,rgba(55,138,221,0.5) 0%,transparent 70%)" }} />
      <div style={{ ...styles.blob, width:"40%", height:"40%", bottom:"10%", left:"15%", background:"radial-gradient(ellipse,rgba(212,83,126,0.5) 0%,transparent 70%)" }} />

      <div style={styles.card}>

        {/* Mode switcher collège / lycée */}
        <div style={styles.modeSwitcher}>
          {[
            { key: "college", label: "🎒 Collège" },
            { key: "lycee",   label: "🎓 Lycée" },
          ].map(({ key, label }) => (
            <div
              key={key}
              onClick={() => setMode(key)}
              style={{ ...styles.modeOpt, ...(mode === key ? styles.modeOptActive : {}) }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Header avec sélecteur de zone */}
        <div style={styles.cardHeader}>
          <h1 style={styles.h1}>Avancement de l'année scolaire</h1>
          <div style={styles.zoneBtn}>
            {["A", "B", "C"].map((z) => (
              <div
                key={z}
                onClick={() => setZone(z)}
                style={{ ...styles.zoneOpt, ...(zone === z ? styles.zoneOptActive : {}) }}
              >
                {z}
              </div>
            ))}
          </div>
        </div>

        <p style={styles.motivation}>{getMsg(pct)}</p>

        {/* Barre de progression */}
        <div style={styles.track}>
          <div style={{ ...styles.fill, width: pct.toFixed(2) + "%", background: getColor(pct) }} />
        </div>
        <p style={styles.pct}>{pct.toFixed(4)} %</p>
        <p style={styles.pctSub}>{mode === "lycee" ? "des cours écoulés" : "de l'année écoulée"}</p>

        {/* Countdown */}
        <div style={styles.countdown}>
          {[
            { val: time.j, label: "Jours" },
            { val: time.h, label: "Heures" },
            { val: time.m, label: "Minutes" },
            { val: time.s, label: "Secondes" },
          ].map(({ val, label }) => (
            <div key={label} style={styles.cdBox}>
              <span style={styles.cdVal}>{val}</span>
              <span style={styles.cdLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Timeline vacances */}
        <div style={styles.sectionSep}>
          <p style={styles.secTitle}>Timeline de l'année</p>
          <div style={styles.timeline}>
            <div style={{ ...styles.tlFill, width: nowPos + "%" }} />
            {vacances.map((v) => {
              const ps = toPos(v.debut, mode);
              const pe = toPos(v.fin, mode);
              return (
                <div key={v.label}>
                  <div style={{
                    position: "absolute", left: ps + "%",
                    width: Math.max(pe - ps, 0.5) + "%",
                    top: 0, height: "100%",
                    background: v.color, opacity: 0.75, borderRadius: 2,
                  }} />
                  <span style={{
                    position: "absolute", top: 14,
                    left: ((ps + pe) / 2) + "%",
                    fontSize: 9, color: "rgba(255,255,255,0.45)",
                    transform: "translateX(-50%)", whiteSpace: "nowrap",
                  }}>{v.label}</span>
                </div>
              );
            })}
            <div style={{
              position: "absolute", left: nowPos + "%", top: -7,
              width: 2, height: 20, background: "#fff", opacity: 0.5,
              transform: "translateX(-50%)", borderRadius: 2,
            }} />
          </div>
        </div>

        {/* Prochaines vacances */}
        <div style={styles.sectionSep}>
          <p style={styles.secTitle}>Prochaines vacances — Zone {zone}</p>
          {next ? (
            <div style={{ ...styles.nextVac, background: next.color + "18" }}>
              <div style={styles.nextLeft}>
                <span style={styles.nextName}>Vacances {next.label}</span>
                <span style={styles.nextPhrase}>{getPhrase(next.daysLeft)}</span>
              </div>
              <div style={styles.nextRight}>
                <div style={{ ...styles.nextDays, color: next.color }}>{next.daysLeft}</div>
                <div style={styles.nextDaysLabel}>jours</div>
              </div>
            </div>
          ) : (
            <div style={{ ...styles.nextVac, background: "rgba(83,74,183,0.18)" }}>
              <div style={styles.nextLeft}>
                <span style={styles.nextName}>{mode === "lycee" ? "Fin des cours 🎓" : "Vacances d'été 🎉"}</span>
                <span style={styles.nextPhrase}>C'est bientôt fini !</span>
              </div>
              <div style={styles.nextRight}>
                <div style={{ ...styles.nextDays, color: "#534AB7" }}>
                  {Math.ceil(Math.max(ENDS[mode] - new Date(), 0) / (1000 * 60 * 60 * 24))}
                </div>
                <div style={styles.nextDaysLabel}>jours</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
    </>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#0a0a18",
    padding: "2rem 1rem",
    position: "relative", overflow: "hidden",
  },
  blob: {
    position: "absolute", borderRadius: "50%", filter: "blur(40px)",
  },
  card: {
    position: "relative", zIndex: 1,
    background: "rgba(22, 22, 35, 0.82)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    border: "0.5px solid rgba(255,255,255,0.12)",
    borderTop: "0.5px solid rgba(255,255,255,0.22)",
    borderRadius: 22,
    padding: "1.5rem 1.5rem",
    width: "100%", maxWidth: 480, color: "#fff",
  },
  modeSwitcher: {
    display: "flex",
    background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 4,
    marginBottom: "1.25rem",
    gap: 4,
  },
  modeOpt: {
    flex: 1, textAlign: "center",
    fontSize: 13, fontWeight: 500,
    color: "rgba(255,255,255,0.4)",
    padding: "8px 0",
    borderRadius: 10,
    cursor: "pointer",
    userSelect: "none",
  },
  modeOptActive: {
    background: "rgba(255,255,255,0.14)",
    color: "#fff",
  },
  cardHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "0.2rem", gap: 8,
  },
  h1: { fontSize: 16, fontWeight: 500, color: "#fff", margin: 0, flex: 1 },
  zoneBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "0.5px solid rgba(255,255,255,0.18)",
    borderRadius: 20,
    padding: "4px 6px",
    display: "flex", gap: 2,
    flexShrink: 0,
  },
  zoneOpt: {
    fontSize: 11, fontWeight: 500,
    color: "rgba(255,255,255,0.45)",
    padding: "3px 8px",
    borderRadius: 14,
    cursor: "pointer",
    userSelect: "none",
  },
  zoneOptActive: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
  },
  motivation: { textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 1rem", minHeight: 18 },
  track: { background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 12, overflow: "hidden", margin: "0.5rem 0 0.25rem" },
  fill: { height: "100%", borderRadius: 999, transition: "width 0.6s ease, background 1s ease" },
  pct: { fontSize: 34, fontWeight: 500, color: "#fff", textAlign: "center", margin: "0.75rem 0 0" },
  pctSub: { fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", margin: "0 0 1rem" },
  countdown: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, margin: "1rem 0" },
  cdBox: {
    background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderTop: "0.5px solid rgba(255,255,255,0.18)",
    borderRadius: 12, padding: "0.6rem 0.4rem", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  cdVal: { fontSize: 20, fontWeight: 500, color: "#fff" },
  cdLabel: { fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" },
  sectionSep: { borderTop: "0.5px solid rgba(255,255,255,0.08)", marginTop: "1.25rem", paddingTop: "1rem" },
  secTitle: { fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "0 0 0.6rem", textTransform: "uppercase", letterSpacing: "0.05em" },
  timeline: { position: "relative", height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 999, margin: "0.4rem 0 1.8rem" },
  tlFill: { position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 999, background: "rgba(255,255,255,0.35)" },
  nextVac: {
    borderRadius: 14, padding: "1rem 1.25rem",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    marginTop: "0.25rem",
  },
  nextLeft: { display: "flex", flexDirection: "column", gap: 4 },
  nextName: { fontSize: 15, fontWeight: 500, color: "#fff" },
  nextPhrase: { fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 },
  nextRight: { textAlign: "right", flexShrink: 0 },
  nextDays: { fontSize: 28, fontWeight: 500, lineHeight: 1 },
  nextDaysLabel: { fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" },
};
