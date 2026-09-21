import { Info } from 'lucide-react'
import type { AnalysisRow, CriterionId, Scenario } from './data'

type MatrixProps = {
  rows: AnalysisRow[]
  scenario: Scenario
  editable?: boolean
  onEdit: (row: number, column: number, value: number) => void
  onExplain: (id: CriterionId) => void
}

export function Matrix({ rows, scenario, editable = true, onEdit, onExplain }: MatrixProps) {
  return <div className="table-scroll" tabIndex={0} role="region" aria-label="Matriz comparativa; desplaza horizontalmente en pantallas pequeñas">
    <table className="matrix">
      <caption>Escala 1–10 · Mayor puntuación = mejor desempeño. Brecha = proyecto − mejor competidor.</caption>
      <thead><tr><th>Criterio</th>{scenario.competitors.map((name, i) => <th key={name}><span className="col-meta">REFERENTE 0{i + 1}</span>{name}</th>)}<th className="ours"><span className="col-meta">NUESTRO PROYECTO</span>{scenario.project}</th><th>Brecha</th></tr></thead>
      <tbody>{rows.map(row => <tr key={row.id}>
        <th scope="row">{editable ? <button className="criterion-label" title={row.description} onClick={() => onExplain(row.id)}>{row.name}<Info size={14} /></button> : row.name}</th>
        {row.values.map((value, column) => <td key={column} className={column === 3 ? 'ours' : ''}>
          <div className="score">{editable ? <input type="number" min={1} max={10} value={value} aria-label={`${row.name}, ${column === 3 ? scenario.project : scenario.competitors[column]}`} onChange={event => onEdit(row.index, column, Number(event.target.value))} /> : <b>{value}</b>}{column < 3 && value === row.best && <span className="best" title="Mejor referencia">REF.</span>}</div>
          <div className="meter" aria-hidden="true"><i style={{ width: `${value * 10}%` }} /></div>
        </td>)}
        <td><b className={row.gap < 0 ? 'negative' : 'positive'}>{row.gap > 0 ? '+' : ''}{row.gap}</b><span className="gap-status">{row.gap < 0 ? 'Por debajo' : row.gap > 0 ? 'Por encima' : 'Al nivel'}</span></td>
      </tr>)}</tbody>
    </table>
  </div>
}
