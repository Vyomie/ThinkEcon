"use client";

import { useState } from "react";

export function InteractiveGrowth() {
  const [investment, setInvestment] = useState(55);
  const [skills, setSkills] = useState(62);
  const score = Math.round((investment * .45 + skills * .55) * 10) / 10;
  const points = Array.from({ length: 10 }, (_, index) => `${index * 11},${94 - ((index / 9) * score)}`).join(" ");
  return <section className="interactive-model"><div><p>Interactive graph</p><h2>Build the conditions for research.</h2><span>Change the inputs to see a simple capacity index move.</span></div><div className="model-controls"><svg className="model-chart" viewBox="0 0 100 100" role="img" aria-label="Capacity index line graph"><path d="M0 94H100M0 50H100M0 6H100"/><polyline points={points}/></svg><label>Investment <input type="range" min="20" max="90" value={investment} onChange={(event) => setInvestment(Number(event.target.value))}/></label><label>Skills support <input type="range" min="20" max="90" value={skills} onChange={(event) => setSkills(Number(event.target.value))}/></label><div className="model-result up">Capacity index: {score}</div></div></section>;
}
