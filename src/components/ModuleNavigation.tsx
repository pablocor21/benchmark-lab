export function ModuleNavigation({ active, onNavigate }: { active: 'studio' | 'challenge'; onNavigate: (module: 'studio' | 'challenge') => void }) {
  return <nav className="module-navigation" aria-label="Módulos de Benchmark Lab">{(['studio', 'challenge'] as const).map(module => <a key={module} href={module === 'studio' ? '/' : '/challenge'} aria-current={active === module ? 'page' : undefined} onClick={event => { event.preventDefault(); onNavigate(module) }}>{module === 'studio' ? 'Studio' : 'Challenge'}</a>)}</nav>
}
