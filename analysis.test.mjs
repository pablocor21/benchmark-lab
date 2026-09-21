import assert from 'node:assert/strict'
import { analyze, scenarios, initialStudy, loadStudy } from './src/data.ts'

for (const scenario of scenarios) {
  const study = { ...initialStudy, scenarioId: scenario.id, scores: scenario.scores.map(row => [...row]) }
  const rows = analyze(study)
  assert.equal(rows.length, 6)
  for (const row of rows) {
    assert.equal(row.gap, row.values[3] - Math.max(...row.values.slice(0, 3)))
    assert.ok(row.leaders.length > 0)
  }
}
const changed = { ...initialStudy, scores: initialStudy.scores.map(row => [...row]) }
changed.scores[3] = [9, 9, 8, 10]
assert.deepEqual(analyze(changed).find(row => row.id === 'speed').leaders, [0, 1])
assert.equal(analyze(changed).find(row => row.id === 'speed').gap, 1)
changed.scores[3][3] = 9
assert.equal(analyze(changed).find(row => row.id === 'speed').gap, 0)
changed.scores[3][3] = 1
assert.equal(analyze(changed).find(row => row.id === 'speed').gap, -8)
assert.equal(analyze({ ...changed, selected: ['price', 'quality', 'ux', 'speed'] }).length, 4)
let stored = 'invalid json'
globalThis.localStorage = { getItem: () => stored }
assert.deepEqual(loadStudy(), initialStudy)
stored = JSON.stringify({ ...initialStudy, scores: [[99]] })
assert.deepEqual(loadStudy(), initialStudy)
stored = JSON.stringify(changed)
assert.deepEqual(loadStudy(), changed)
console.log('OK: cuatro escenarios, edición de brechas, empates, selección y recuperación de persistencia.')
