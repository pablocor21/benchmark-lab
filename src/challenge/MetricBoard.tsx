import { metricIds, metricLabels } from './data'
import type { Metrics } from './data'
export function MetricBoard({ metrics, previous, budget }: { metrics: Metrics; previous?: Metrics; budget: number }) {
  return <aside className="nova-status" aria-label="Estado de NOVA">
    <div className="nova-status-heading"><span className="index">NOVA / ESTADO ACTUAL</span><span>Escala 0–100</span></div>
    <div className="nova-meters">{metricIds.map(id => {
      const delta = previous ? metrics[id] - previous[id] : 0
      return <div className="nova-metric" key={id}><div className="metric-label"><span>{metricLabels[id]}</span><strong>{metrics[id]}{delta !== 0 && <small className={delta > 0 ? 'increase' : 'decrease'}>{delta > 0 ? '+' : ''}{delta}</small>}</strong></div><div role="meter" aria-label={metricLabels[id]} aria-valuemin={0} aria-valuemax={100} aria-valuenow={metrics[id]} className="nova-meter"><i style={{ width: `${metrics[id]}%` }} /></div></div>
    })}</div>
    <div className="nova-budget"><div><span>INVERSIÓN DISPONIBLE</span><strong>{budget}<small> / 100 pts</small></strong></div><p>{100 - budget} pts utilizados</p></div>
    <p className="status-key">Más alto es mejor en los cuatro indicadores. Control de costos mide eficiencia del gasto; no es el saldo de inversión.</p>
  </aside>
}
