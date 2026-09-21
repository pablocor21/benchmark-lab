import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { comparison, competitors } from './data'
import type { CompetitorId, CriterionId } from './data'
import type { GameAction, GameState } from './engine'
export function GapInspector({ state, dispatch }: { state: GameState; dispatch: (action: GameAction) => void }) {
  const [reference, setReference] = useState<CompetitorId>(state.researched[0] || 'vertex')
  const [inspected, setInspected] = useState<CriterionId>(state.priority || 'speed')
  const criterion = comparison.find(c => c.id === inspected)!
  const competitor = competitors.find(c => c.id === reference)!
  const gap = Number((criterion.nova - criterion.values[reference]).toFixed(1))
  return <section><div className="challenge-section-title"><div><span className="eyebrow">RONDA 02 / COMPARAR</span><h2>La brecha señala<br/>dónde investigar.</h2></div></div><p>Selecciona un criterio para inspeccionarlo. Después decide qué brecha priorizar: la mayor distancia no siempre es la más relevante.</p>
    <div className="table-scroll"><table className="challenge-matrix"><caption>Datos simulados · escala 1–10 · más alto es mejor, también en costo.</caption><thead><tr><th>Criterio</th><th className="ours">NOVA</th>{competitors.map(c => <th key={c.id}>{c.name}</th>)}</tr></thead><tbody>{comparison.map(c => <tr key={c.id} className={inspected === c.id ? 'inspected' : ''}><th scope="row"><button aria-pressed={inspected === c.id} onClick={() => setInspected(c.id)}>{c.name}{state.priority === c.id && <Check size={14} />}</button></th><td className="ours">{c.nova.toFixed(1)}</td>{competitors.map(r => <td key={r.id}>{c.values[r.id].toFixed(1)}</td>)}</tr>)}</tbody></table></div>
    <div className="gap-inspector"><div><label htmlFor="challenge-reference">Comparar con</label><select id="challenge-reference" value={reference} onChange={e => setReference(e.target.value as CompetitorId)}>{competitors.map(c => <option key={c.id} value={c.id}>{c.name}{state.researched.includes(c.id) ? ' · investigado' : ' · solo puntuación'}</option>)}</select><h3>{criterion.name}</h3><p>{criterion.description}</p></div><div className="gap-evidence"><div><span>NOVA</span><i style={{ width: `${criterion.nova * 10}%` }} /><b>{criterion.nova.toFixed(1)}</b></div><div><span>{competitor.name}</span><i style={{ width: `${criterion.values[reference] * 10}%` }} /><b>{criterion.values[reference].toFixed(1)}</b></div><p><strong>{gap > 0 ? '+' : ''}{gap.toFixed(1)}</strong><span>{gap < 0 ? 'puntos por debajo' : gap > 0 ? 'puntos por encima' : 'al mismo nivel'}<small>NOVA − {competitor.name}</small></span></p></div></div>
    <button className="priority-choice" aria-pressed={state.priority === inspected} onClick={() => dispatch({ type: 'prioritize', id: inspected })}>{state.priority === inspected ? <Check size={18} /> : <ArrowRight size={18} />} Priorizar {criterion.name.toLowerCase()}</button>
    <div className="action-bar"><span role="status">{state.priority ? `Tu prioridad: ${comparison.find(c => c.id === state.priority)!.name}. Usarás este diagnóstico para decidir.` : 'Elige una prioridad antes de continuar.'}</span><button className="primary" disabled={!state.priority} onClick={() => dispatch({ type: 'continue' })}>Elegir estrategia <ArrowRight size={18} /></button></div>
  </section>
}
