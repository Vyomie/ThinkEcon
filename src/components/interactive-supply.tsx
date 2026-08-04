"use client";

import { useState } from "react";

export function InteractiveSupply() {
  const [demand, setDemand] = useState(56);
  const [supply, setSupply] = useState(48);
  const gap = demand - supply;
  return <section className="interactive-model"><div><p>Interactive model</p><h2>When demand moves faster than supply.</h2><span>Move the sliders to see the pressure on price.</span></div><div className="model-controls"><label>Demand <input type="range" min="20" max="90" value={demand} onChange={(event) => setDemand(Number(event.target.value))}/></label><label>Supply <input type="range" min="20" max="90" value={supply} onChange={(event) => setSupply(Number(event.target.value))}/></label><div className={`model-result ${gap > 0 ? "up" : "down"}`}>{gap === 0 ? "Price pressure is balanced" : gap > 0 ? "Price pressure rises" : "Price pressure eases"}</div></div></section>;
}
