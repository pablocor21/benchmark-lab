import { ArrowRight, RotateCcw } from 'lucide-react'
import { comparison, competitors, initialMetrics, metricIds, metricLabels } from './data'
import { evaluateGame } from './engine'
import type { GameAction, GameState } from './engine'
export function Results({ state, dispatch }: { state: GameState; dispatch: (action: GameAction) => void }) {
  const evaluation = evaluateGame(state)
  return <section className="challenge-results"><div className="challenge-section-title"><div><span className="eyebrow">RONDA 04 / MEDIR RESULTADOS</span><h2>Informe de resultados.</h2></div><span className="result-stamp">NOVA<br />ANTES / DESPUÉS</span></div>
    <div className="table-scroll"><table className="results-table"><caption>Variación desde el inicio · Escala 0–100, más alto es mejor.</caption><thead><tr><th>Indicador</th><th>Antes</th><th>Después</th><th>Cambio</th></tr></thead><tbody>{metricIds.map(id => <tr key={id}><th scope="row">{metricLabels[id]}</th><td>{initialMetrics[id]}</td><td>{state.metrics[id]}</td><td className={state.metrics[id] >= initialMetrics[id] ? 'increase' : 'decrease'}>{state.metrics[id] > initialMetrics[id] ? '+' : ''}{state.metrics[id] - initialMetrics[id]} pts</td></tr>)}</tbody></table></div>
    <div className="investment-audit"><p><b>{100 - state.budget}</b> / 100 puntos utilizados</p><p>{state.researched.length * 5} en investigación + {state.history.reduce((sum, h) => sum + h.decision.cost, 0)} en decisiones · {state.budget} disponibles</p></div>
    <div className="learning-verdict"><span className="index">TU FORMA DE HACER BENCHMARKING</span><h2>{evaluation.title}</h2><p>{evaluation.text}</p></div>
    <div className="result-columns"><section><h3>Buenas prácticas identificadas</h3>{state.researched.map(id => <p key={id}><b>{competitors.find(c => c.id === id)!.name}.</b> {competitors.find(c => c.id === id)!.practice}</p>)}<h3>Prácticas adaptadas</h3>{evaluation.adapted.length ? evaluation.adapted.map(h => <p key={h.decision.id}>{h.decision.practice}</p>) : <p>No hubo adaptación explícita. Una próxima partida puede explorar cómo ajustar una referencia al contexto de NOVA.</p>}</section><section><h3>Decisiones tomadas</h3><ol>{state.history.map(h => <li key={h.decision.id}><b>{h.round}</b><br />{h.decision.label} · {h.decision.cost} pts</li>)}</ol><h3>Errores y aspectos por mejorar</h3>{evaluation.errors.length ? evaluation.errors.map(error => <p key={error}>{error}</p>) : <p>Las decisiones mantuvieron coherencia entre investigación, diagnóstico y adaptación. En un proyecto real, quedaría validar el resultado con datos de campo.</p>}</section></div>
    <div className="action-bar"><span>No hay un único indicador de éxito. Revisa qué mejoró y qué costo tuvo.</span><button className="primary" onClick={() => dispatch({ type: 'continue' })}>¿Qué acabamos de hacer?<ArrowRight size={18} /></button></div>
  </section>
}
export function Conclusion({ state, dispatch, onStudio }: { state: GameState; dispatch: (action: GameAction) => void; onStudio: () => void }) {
  const evaluation = evaluateGame(state)
  const steps = [
    ['Seleccionamos referentes.', state.researched.map(id => competitors.find(c => c.id === id)!.name).join(' · ')],
    ['Definimos criterios.', 'Rapidez, experiencia, automatización, costo y personalización.'],
    ['Comparamos resultados.', 'NOVA y sus referentes en una escala común de 1 a 10.'],
    ['Identificamos brechas.', `Priorizaste ${comparison.find(c => c.id === state.priority)?.name.toLowerCase()}.`],
    ['Analizamos buenas prácticas.', `${state.researched.length} ${state.researched.length === 1 ? 'proceso investigado' : 'procesos investigados'} antes de elegir.`],
    ['Adaptamos soluciones.', evaluation.adapted.length ? `${evaluation.adapted.length} decisiones aplicaron adaptación. ${state.history[0]?.decision.kind === 'copy' ? 'La estrategia principal, en cambio, fue una copia.' : ''}` : 'En tu partida faltó este paso: copiar o crear desde cero no equivale a adaptar.'],
    ['Medimos el resultado.', 'Contrastamos cuatro indicadores antes y después de las decisiones.'],
  ]
  return <section className="academic-close"><span className="eyebrow">DE LA SIMULACIÓN AL MÉTODO / CIERRE PARA EXPOSICIÓN</span><h1 tabIndex={-1}>¿Qué acabamos<br />de hacer?</h1><div className="academic-layout"><ol>{steps.map(([title, detail], i) => <li key={title}><span>0{i + 1}</span><div><strong>{title}</strong><p>{detail}</p></div></li>)}</ol><div className="academic-statement"><span>OBSERVAR + COMPARAR<br />+ APRENDER + ADAPTAR<br />+ MEDIR</span><h2>Eso es<br /><em>benchmarking.</em></h2><p>El método convierte referencias externas en decisiones propias. Lo aprendido también incluye reconocer los pasos que omitimos.</p></div></div><div className="action-bar"><button onClick={() => dispatch({ type: 'restart' })}><RotateCcw size={18} /> Jugar otra estrategia</button><button className="primary" onClick={onStudio}>Abrir Benchmark Studio<ArrowRight size={18} /></button></div></section>
}
