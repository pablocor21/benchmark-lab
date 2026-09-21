import { ArrowRight } from 'lucide-react'
export function ModuleBridge({ onPlay, presentation = false }: { onPlay: () => void; presentation?: boolean }) {
  return <section className={`module-bridge ${presentation ? 'presentation-bridge' : ''}`}><div><span className="eyebrow">{presentation ? 'TEORÍA → SIMULACIÓN → JUEGO → CONCLUSIÓN' : 'DEL ANÁLISIS A LA DECISIÓN'}</span><h2>{presentation ? 'Ahora, tomemos una decisión.' : '¿Quieres ponerlo en práctica?'}</h2><p>{presentation ? 'Pon a la clase al frente de NOVA. Cuatro rondas para observar, adaptar y medir.' : 'Lidera NOVA en una misión de cuatro rondas y aprende de las consecuencias.'}</p></div><button className="primary" onClick={onPlay}>Jugar Benchmark Challenge<ArrowRight size={18} /></button></section>
}
