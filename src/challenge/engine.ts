import { comparison, competitors, events, initialMetrics, metricIds, strategies } from './data.ts'
import type { CompetitorId, CriterionId, Decision, Metrics } from './data.ts'
export type Stage = 'mission' | 'observe' | 'compare' | 'decide' | 'feedback' | 'event' | 'results' | 'conclusion'
export type GameAction = { type: 'start' | 'continue' | 'restart' } | { type: 'audience'; value: boolean } | { type: 'investigate'; id: CompetitorId } | { type: 'prioritize'; id: CriterionId } | { type: 'choose'; id: string }
export type RecordEntry = { decision: Decision; before: Metrics; after: Metrics; round: string }
export type GameState = {
  stage: Stage; metrics: Metrics; budget: number; researched: CompetitorId[]; priority: CriterionId | null
  history: RecordEntry[]; event: number; audience: boolean; journal: GameAction[]
}
export const storageKey = 'benchmark-challenge-v1'
export function freshGame(): GameState {
  return { stage: 'mission', metrics: { ...initialMetrics }, budget: 100, researched: [], priority: null, history: [], event: 0, audience: false, journal: [] }
}
export function applyImpact(metrics: Metrics, impact: Metrics): Metrics {
  return Object.fromEntries(metricIds.map(id => [id, Math.min(100, Math.max(0, metrics[id] + impact[id]))])) as Metrics
}
export function availableDecisions(state: GameState): Decision[] {
  return state.stage === 'decide' ? strategies : state.stage === 'event' ? events[state.event].options : []
}
function transition(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'restart': return { ...freshGame(), audience: state.audience }
    case 'audience': return state.audience === action.value ? state : { ...state, audience: action.value }
    case 'start': return state.stage === 'mission' ? { ...state, stage: 'observe' } : state
    case 'investigate':
      if (state.stage !== 'observe' || state.researched.includes(action.id) || !competitors.some(c => c.id === action.id) || state.budget < 5) return state
      return { ...state, budget: state.budget - 5, researched: [...state.researched, action.id] }
    case 'prioritize':
      return state.stage === 'compare' && comparison.some(c => c.id === action.id) ? { ...state, priority: action.id } : state
    case 'choose': {
      const decision = availableDecisions(state).find(d => d.id === action.id)
      if (!decision || decision.cost > state.budget) return state
      const after = applyImpact(state.metrics, decision.impact)
      return { ...state, stage: 'feedback', metrics: after, budget: state.budget - decision.cost, history: [...state.history, { decision, before: { ...state.metrics }, after, round: state.stage === 'decide' ? 'Estrategia principal' : events[state.event].title }] }
    }
    case 'continue':
      if (state.stage === 'observe' && state.researched.length) return { ...state, stage: 'compare' }
      if (state.stage === 'compare' && state.priority) return { ...state, stage: 'decide' }
      if (state.stage === 'feedback') {
        if (state.history.length === 3) return { ...state, stage: 'results' }
        return { ...state, stage: 'event', event: state.history.length - 1 }
      }
      if (state.stage === 'results') return { ...state, stage: 'conclusion' }
      return state
  }
}
export function gameReducer(state: GameState, action: GameAction): GameState {
  const next = transition(state, action)
  if (next === state) return state
  if (action.type === 'restart') return { ...next, journal: next.audience ? [{ type: 'audience', value: true }] : [] }
  return { ...next, journal: [...state.journal, action] }
}
function isAction(value: unknown): value is GameAction {
  if (!value || typeof value !== 'object' || !('type' in value)) return false
  const a = value as Record<string, unknown>
  if (['start', 'continue', 'restart'].includes(String(a.type))) return true
  if (a.type === 'audience') return typeof a.value === 'boolean'
  if (a.type === 'investigate') return competitors.some(c => c.id === a.id)
  if (a.type === 'prioritize') return comparison.some(c => c.id === a.id)
  return a.type === 'choose' && typeof a.id === 'string'
}
export function restoreGame(raw: string | null): GameState {
  try {
    const parsed: unknown = JSON.parse(raw || 'null')
    if (!Array.isArray(parsed) || parsed.length > 500 || !parsed.every(isAction)) return freshGame()
    return parsed.reduce(gameReducer, freshGame())
  } catch { return freshGame() }
}
export function loadGame(): GameState {
  try { return restoreGame(localStorage.getItem(storageKey)) } catch { return freshGame() }
}
export function evaluateGame(state: GameState) {
  const main = state.history[0]?.decision
  const adapted = state.history.filter(h => ['adapt', 'combine'].includes(h.decision.kind))
  const errors = state.history.flatMap(h => h.decision.error ? [h.decision.error] : [])
  const unresearched = main?.references.filter(id => !state.researched.includes(id)) || []
  if (unresearched.length) errors.push(`La estrategia usó ${unresearched.map(id => competitors.find(c => c.id === id)!.name).join(' y ')} sin investigar antes su proceso.`)
  const aligned = !!main && !!state.priority && main.fits.includes(state.priority)
  if (main && !aligned) errors.push('La estrategia principal no atendía directamente la brecha priorizada.')
  if (main?.kind === 'copy') return { title: 'Copiador Competitivo', text: 'Mejoraste algunos indicadores al trasladar una solución, pero faltó adaptarla al contexto de NOVA. El resultado de un referente no es una garantía.', adapted, errors, aligned }
  if (main?.kind === 'isolate') return { title: 'Innovador Aislado', text: 'Generaste ideas propias, pero desaprovechaste información del mercado. Innovar también puede partir de comprender lo que otros ya aprendieron.', adapted, errors, aligned }
  if (adapted.length >= 2 && aligned && !unresearched.length) return { title: 'Analista Estratégico', text: 'Observaste referentes, detectaste una brecha y adaptaste prácticas relevantes. Tus decisiones conectaron evidencia, contexto y mejora.', adapted, errors, aligned }
  return { title: 'Estratega en Desarrollo', text: 'Empezaste a adaptar soluciones. Para fortalecer el método, conecta cada decisión con una brecha y con prácticas que hayas investigado.', adapted, errors, aligned }
}
export function roundNumber(state: GameState) {
  if (state.stage === 'mission' || state.stage === 'observe') return 1
  if (state.stage === 'compare') return 2
  if (state.stage === 'decide' || (state.stage === 'feedback' && state.history.length === 1)) return 3
  return 4
}
