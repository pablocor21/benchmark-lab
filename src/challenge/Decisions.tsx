import { ArrowRight, Users, Zap } from 'lucide-react'
import { availableDecisions } from './engine'
import type { GameAction, GameState } from './engine'
import { comparison, events, metricIds, metricLabels } from './data'
export function Decisions({ state, dispatch }: { state: GameState; dispatch: (action: GameAction) => void }) {
  const isEvent = state.stage === 'event'
  const event = events[state.event]
  return <section className={state.audience ? 'audience-decisions' : ''}>
    <div className="challenge-section-title"><div><span className="eyebrow">{isEvent ? `RONDA 04 / IMPREVISTO 0${state.event + 1}` : 'RONDA 03 / DECIDIR Y ADAPTAR'}</span><h2>{state.audience ? '¿Qué debería hacer NOVA?' : isEvent ? event.title : 'Cuatro caminos.\nUna decisión.'}</h2></div>{isEvent ? <Zap size={28} /> : state.audience ? <Users size={28} /> : null}</div>
    {isEvent ? <p className="event-brief"><b>{state.audience ? `${event.title}. ` : ''}</b>{event.description}</p> : <p>Tu prioridad es <b>{comparison.find(c => c.id === state.priority)?.name.toLowerCase()}</b>. Considera los recursos de NOVA y lo que aprendiste de los referentes.</p>}
    {state.audience && <p className="audience-note"><Users size={18} /> Debatan las alternativas. El presentador elige la opción del grupo; no hay selección automática.</p>}
    <div className="decision-options">{availableDecisions(state).map((decision, i) => {
      const affordable = decision.cost <= state.budget
      return <button className="decision-option" key={decision.id} disabled={!affordable} onClick={() => dispatch({ type: 'choose', id: decision.id })}>
        <span className="decision-letter">{String.fromCharCode(65 + i)}</span><span className="decision-copy"><strong>{decision.label}</strong><span>{decision.preview}</span></span><span className="decision-cost"><b>{decision.cost}</b><span>pts</span>{!affordable && <small>Faltan {decision.cost - state.budget} pts</small>}</span><ArrowRight className="decision-arrow" size={18} />
      </button>
    })}</div>
    <p className="decision-footnote">Seleccionar una opción la ejecuta y descuenta su costo una sola vez. Verás los efectos antes de continuar.</p>
  </section>
}
export function DecisionFeedback({ state, dispatch }: { state: GameState; dispatch: (action: GameAction) => void }) {
  const record = state.history[state.history.length - 1]
  return <section className="decision-feedback"><span className="eyebrow">DECISIÓN REGISTRADA / {record.round.toUpperCase()}</span><h2>{record.decision.label}</h2><p>{record.decision.explanation}</p>
    <div className="impact-results" role="status" aria-label="Cambios en indicadores">{metricIds.map(id => {
      const delta = record.after[id] - record.before[id]
      return <div key={id}><span>{metricLabels[id]}</span><p><span>{record.before[id]}</span><ArrowRight size={18} /><strong>{record.after[id]}</strong></p><b className={delta > 0 ? 'increase' : delta < 0 ? 'decrease' : ''}>{delta > 0 ? '+' : ''}{delta} pts{delta === 0 ? ' · sin cambio' : ''}</b></div>
    })}</div>
    <aside className="principle-note"><span className="index">PRINCIPIO DE BENCHMARKING APLICADO</span><h3>{record.decision.principle}</h3><p>Inversión de esta decisión: {record.decision.cost} pts · Disponible: {state.budget} pts.</p></aside>
    <div className="action-bar"><span>Resultados simulados para explicar relaciones de causa y efecto.</span><button className="primary" onClick={() => dispatch({ type: 'continue' })}>{state.history.length === 3 ? 'Medir resultados' : state.history.length === 1 ? 'Probar bajo presión' : 'Último imprevisto'}<ArrowRight size={18} /></button></div>
  </section>
}
