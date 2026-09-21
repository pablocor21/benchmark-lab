import { useEffect, useReducer, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Flag, Target, Users } from 'lucide-react'
import { gameReducer, loadGame, roundNumber, storageKey } from './engine'
import { MetricBoard } from './MetricBoard'
import { Intelligence } from './Intelligence'
import { GapInspector } from './GapInspector'
import { Decisions, DecisionFeedback } from './Decisions'
import { Results, Conclusion } from './Results'
import './challenge.css'
export default function Challenge({ onStudio, presentation = false }: { onStudio: () => void; presentation?: boolean }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadGame)
  const [saveError, setSaveError] = useState(false)
  const surface = useRef<HTMLDivElement>(null)
  const round = roundNumber(state)
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(state.journal)); setSaveError(false) } catch { setSaveError(true) } }, [state.journal])
  useEffect(() => { surface.current?.focus(); window.scrollTo(0, 0) }, [state.stage, state.event])
  useEffect(() => { if (presentation) dispatch({ type: 'audience', value: true }) }, [presentation])
  const finished = ['results', 'conclusion'].includes(state.stage)
  return <main id="content" className={`challenge ${state.stage === 'conclusion' ? 'academic-mode' : ''} ${state.audience ? 'audience-mode' : ''} ${state.audience && ['decide', 'event'].includes(state.stage) ? 'audience-vote' : ''}`}>
    <div className="workspace-meta"><span>BENCHMARK CHALLENGE / MÓDULO 02</span><span>SIMULACIÓN EDUCATIVA · ~5 MIN <span className="saved">{saveError ? 'SIN GUARDADO' : 'GUARDADO LOCAL'}</span></span></div>
    {saveError && <p role="status">No se pudo guardar el avance. La partida funciona mientras mantengas abierta esta página.</p>}
    {presentation && <div className="class-sequence" aria-label="Secuencia de exposición"><span>01 Teoría</span><ArrowRight size={14} /><span>02 Simulación</span><ArrowRight size={14} /><b>{finished ? '04 Conclusión' : '03 Juego'}</b></div>}
    <div className="challenge-toolbar"><span><Flag size={16} /> TU ROL: STRATEGY LEAD DE NOVA</span><button className="audience-toggle" aria-pressed={state.audience} onClick={() => dispatch({ type: 'audience', value: !state.audience })}><Users size={17} /> Modo audiencia <b>{state.audience ? 'Activado' : 'Desactivado'}</b></button></div>
    <div ref={surface} className="challenge-surface" tabIndex={-1} role="group" aria-label={`Benchmark Challenge, ronda ${round}`}>
      {state.stage !== 'mission' && state.stage !== 'conclusion' && <h1 className="sr-only">Benchmark Challenge · Ronda {round}</h1>}
      {state.stage === 'mission' ? <div className="mission-layout"><section><span className="eyebrow">TU PRÓXIMA DECISIÓN CAMBIA EL RESULTADO</span><h1>BENCHMARK<br /><em>CHALLENGE</em></h1><p className="mission-question">¿Puedes mejorar una empresa sin limitarte a copiar a la competencia?</p><p>NOVA está perdiendo competitividad. Como Strategy Lead, tienes cuatro rondas y 100 puntos de inversión para cambiar su rumbo.</p><button className="primary" onClick={() => dispatch({ type: 'start' })}>Aceptar misión<ArrowRight size={20} /></button><span className="mission-timing">4 rondas · 2 imprevistos · Sin cuenta atrás</span></section><aside className="mission-dossier"><div className="sheet-top">ORDEN DE MISIÓN / NOVA <Target size={20} /></div><div className="mission-nova">NOVA<span>EN REVISIÓN ESTRATÉGICA</span></div><h2>Una empresa.<br />Cuatro frentes abiertos.</h2><ol><li>Tiempos de atención altos</li><li>Experiencia del cliente inconsistente</li><li>Innovación insuficiente</li><li>Presión sobre los costos</li></ol><p>Tu objetivo: mejorar su posición usando referencias externas, decisiones propias y resultados medibles.</p></aside></div> : <>
        {state.stage !== 'conclusion' && <><ol className="challenge-rounds" aria-label="Progreso de la misión">{['Observar', 'Comparar', 'Elegir y adaptar', 'Medir resultados'].map((name, i) => <li key={name} aria-current={round === i + 1 ? 'step' : undefined} className={round > i + 1 ? 'complete' : ''}><span>0{i + 1}</span>{name}</li>)}</ol><MetricBoard metrics={state.metrics} previous={state.stage === 'feedback' ? state.history.at(-1)?.before : undefined} budget={state.budget} /></>}
        <div className="round-content" key={`${state.stage}-${state.event}`}>
          {state.stage === 'observe' && <Intelligence state={state} dispatch={dispatch} />}
          {state.stage === 'compare' && <GapInspector state={state} dispatch={dispatch} />}
          {(state.stage === 'decide' || state.stage === 'event') && <Decisions state={state} dispatch={dispatch} />}
          {state.stage === 'feedback' && <DecisionFeedback state={state} dispatch={dispatch} />}
          {state.stage === 'results' && <Results state={state} dispatch={dispatch} />}
          {state.stage === 'conclusion' && <Conclusion state={state} dispatch={dispatch} onStudio={onStudio} />}
        </div>
      </>}
    </div>
    <footer className="challenge-footer">{state.stage !== 'conclusion' && <div><b>¿Quieres analizarlo paso a paso?</b><button className="text-button" onClick={onStudio}>Abrir Benchmark Studio<ArrowUpRight size={16} /></button></div>}<p>Empresas y efectos ficticios. Resultados deterministas para aprender el método, no predicciones empresariales.</p></footer>
  </main>
}

