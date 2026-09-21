import { ArrowRight, Check, Search } from 'lucide-react'
import { competitors } from './data'
import type { GameAction, GameState } from './engine'
export function Intelligence({ state, dispatch }: { state: GameState; dispatch: (action: GameAction) => void }) {
  return <section><div className="challenge-section-title"><div><span className="eyebrow">RONDA 01 / OBSERVAR</span><h2>No busques al mejor.<br/>Busca qué hace mejor.</h2></div><span className="index">{state.researched.length} / 3 INVESTIGADOS</span></div>
    <p>Investiga al menos un referente. Cada dossier cuesta 5 puntos y revela el proceso detrás de su fortaleza.</p>
    <div className="intelligence-files">{competitors.map((c, i) => {
      const investigated = state.researched.includes(c.id)
      return <article className={`intelligence-file intelligence-${c.id} ${investigated ? 'investigated' : ''}`} key={c.id}>
        <div className="file-index"><span>EXP. 0{i + 1}</span><span>{investigated ? 'INVESTIGADO' : 'POR INVESTIGAR'}</span></div><div className="file-head"><h3>{c.name}</h3><strong>{c.number}<small>/10</small></strong></div>
        <p className="file-specialty">{c.specialty}</p><p><b>Límite:</b> {c.weakness.toLowerCase()}.</p>
        {investigated ? <div className="evidence" role="status"><Check size={18} /><p>{c.evidence}</p></div> : <button onClick={() => dispatch({ type: 'investigate', id: c.id })}><Search size={16} /> Investigar {c.name} <span>−5 pts</span></button>}
      </article>
    })}</div>
    <div className="action-bar"><span>Conocer sus límites es tan importante como conocer sus fortalezas.</span><button className="primary" disabled={!state.researched.length} onClick={() => dispatch({ type: 'continue' })}>Comparar referentes <ArrowRight size={18} /></button></div>
  </section>
}
