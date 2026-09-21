import assert from 'node:assert/strict'
import { freshGame, gameReducer, availableDecisions, restoreGame, evaluateGame, applyImpact } from './src/challenge/engine.ts'
import { initialMetrics, metricIds, competitors, comparison, strategies, events } from './src/challenge/data.ts'
const send = (state, type, extra = {}) => gameReducer(state, { type, ...extra })
function prepare(ids, priority) {
  let state = send(freshGame(), 'start')
  for (const id of ids) state = send(state, 'investigate', { id })
  state = send(state, 'continue')
  state = send(state, 'prioritize', { id: priority })
  return send(state, 'continue')
}
let paths = 0
for (let mask = 1; mask < 8; mask++) {
  const ids = competitors.filter((_, index) => mask & (1 << index)).map(c => c.id)
  for (const criterion of comparison) for (const strategy of strategies) for (const eventA of events[0].options) for (const eventB of events[1].options) {
    let state = prepare(ids, criterion.id)
    state = send(state, 'choose', { id: strategy.id })
    assert.equal(state.stage, 'feedback')
    assert.equal(send(state, 'choose', { id: strategy.id }), state, 'Feedback must reject duplicate decisions')
    state = send(state, 'continue')
    state = send(state, 'choose', { id: eventA.id })
    state = send(state, 'continue')
    if (eventB.cost > state.budget) {
      assert.equal(send(state, 'choose', { id: eventB.id }), state, 'Unaffordable action must not change game')
      assert.ok(availableDecisions(state).some(d => d.cost <= state.budget), 'Every route must have a viable finish')
      continue
    }
    state = send(state, 'choose', { id: eventB.id })
    state = send(state, 'continue')
    assert.equal(state.stage, 'results')
    assert.equal(state.budget, 100 - ids.length * 5 - strategy.cost - eventA.cost - eventB.cost)
    const expected = [strategy, eventA, eventB].reduce((metrics, d) => applyImpact(metrics, d.impact), initialMetrics)
    assert.deepEqual(state.metrics, expected)
    assert.ok(state.budget >= 0)
    for (const key of metricIds) assert.ok(state.metrics[key] >= 0 && state.metrics[key] <= 100)
    assert.deepEqual(restoreGame(JSON.stringify(state.journal)), state, 'Saved action replay must reconstruct results')
    if (strategy.id === 'copy') assert.equal(evaluateGame(state).title, 'Copiador Competitivo')
    if (strategy.id === 'isolate') assert.equal(evaluateGame(state).title, 'Innovador Aislado')
    state = send(state, 'continue')
    assert.equal(state.stage, 'conclusion')
    paths++
  }
}
let state = freshGame()
assert.equal(send(state, 'continue'), state)
state = send(state, 'start')
assert.equal(send(state, 'continue'), state, 'A reference is required')
state = send(state, 'investigate', { id: 'vertex' })
assert.equal(send(state, 'investigate', { id: 'vertex' }), state, 'Research charged once')
state = send(state, 'continue')
assert.equal(send(state, 'continue'), state, 'A priority is required')
state = prepare(['vertex'], 'speed')
for (const id of ['adapt', 'process', 'measure']) {
  state = send(state, 'choose', { id })
  state = send(state, 'continue')
}
assert.equal(evaluateGame(state).title, 'Analista Estratégico')
assert.deepEqual(state.metrics, { satisfaction: 59, efficiency: 77, innovation: 49, costs: 62 })
assert.equal(state.budget, 55)
assert.deepEqual(restoreGame('broken'), freshGame())
assert.deepEqual(restoreGame('[{"type":"audience","value":"wrong"}]'), freshGame())
assert.deepEqual(restoreGame('[{"type":"choose","id":"adapt"}]'), freshGame())
state = send(state, 'audience', { value: true })
state = send(state, 'restart')
assert.equal(state.audience, true)
assert.equal(state.budget, 100)
assert.deepEqual(restoreGame(JSON.stringify(state.journal)), state)
assert.deepEqual(applyImpact({ satisfaction: 99, efficiency: 0, innovation: 100, costs: 1 }, { satisfaction: 10, efficiency: -10, innovation: 10, costs: -10 }), { satisfaction: 100, efficiency: 0, innovation: 100, costs: 0 })
console.log(`OK: ${paths} partidas completas; cálculos, presupuesto, bloqueos, persistencia y evaluaciones educativas.`)
