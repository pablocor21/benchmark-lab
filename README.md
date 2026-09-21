# Benchmark Lab

Laboratorio educativo de benchmarking para Formulación de Proyectos. React + TypeScript + Vite, Lucide y Recharts. Sin backend, cuentas ni servicios externos en ejecución.

## Ejecutar para la exposición

1. Tener Node.js 22.12 o superior y npm.
2. La primera vez: `npm install`.
3. Ejecutar `npm run dev -- --host 127.0.0.1`.
4. Abrir la dirección local que aparece, normalmente http://127.0.0.1:5173.

La instalación necesita internet; después la aplicación funciona localmente sin depender de fuentes o APIs externas. Mantener abierta la terminal durante la exposición. Para una versión compilada: `npm run build` y `npm run preview -- --host 127.0.0.1`.

## Recorrido

Introducción → escenario → 4–6 criterios → matriz editable y gráficos → insights → adaptación con indicador/meta → informe descargable → presentación de siete diapositivas.

El modo `/presentacion` usa los datos guardados en este navegador. Flechas izquierda/derecha cambian de diapositiva; Escape vuelve al estudio. La guía lateral cierra con Escape y conserva el foco del teclado.

## Datos y metodología

Cuatro escenarios ficticios: QuickBite, Pulse Club, Pausa Café y Nativa Store. Escala homogénea 1–10, mayor es mejor; en precio, mide asequibilidad. Brecha = proyecto menos mejor competidor por criterio. Los empates muestran todas las referencias. Las prácticas son hipótesis educativas, no afirmaciones sobre empresas reales.

El avance se guarda en localStorage bajo `benchmark-lab-v1`. Cambiar de escenario restablece sus puntuaciones y adaptación. No se envían datos a ningún servidor. El informe puede descargarse como texto.

## Organización

- `src/data.ts`: escenarios, criterios, tipos, validación del guardado y análisis puro.
- `src/Matrix.tsx`: matriz accesible, reutilizada en la presentación.
- `src/Charts.tsx`: radar, barras, brechas y tabla textual equivalente.
- `src/App.tsx`: recorrido Studio, guía educativa, adaptación, informe y presentación.
- `src/App.css`: sistema visual, responsive y movimiento reducido.

Benchmark Studio y Benchmark Challenge conviven en el mismo proyecto y comparten navegación, paleta, tipografía, iconos y controles. El juego conserva su lógica y sus datos en componentes independientes dentro de `src/challenge/`.

## Validación

`npm run build` comprueba TypeScript y genera la versión de producción.

`node analysis.test.mjs` verifica cálculos en los cuatro escenarios, empates, brechas positivas/cero/negativas y recuperación ante datos guardados inválidos.


## Benchmark Challenge

Abrir `/challenge` o elegir **Challenge** en el selector global. La partida dura aproximadamente cinco minutos según el ritmo de lectura y discusión; no hay temporizador.

1. **Observar:** investigar al menos un dossier. Cada referente cuesta 5 puntos, una sola vez.
2. **Comparar:** inspeccionar criterios y elegir una brecha prioritaria.
3. **Elegir y adaptar:** ejecutar una estrategia y revisar sus efectos.
4. **Medir resultados:** responder a dos imprevistos, revisar antes/después y abrir el cierre académico.

Los cuatro indicadores van de 0 a 100 y se mantienen dentro de ese rango. Un mayor control de costos es mejor; este indicador es distinto del saldo de inversión. Los costos y las consecuencias son deterministas. Las decisiones fuera de secuencia, duplicadas o superiores al presupuesto se rechazan.

**Modo audiencia:** amplía las alternativas y compacta el tablero en escritorio para proyectar las cuatro opciones. No vota ni elige automáticamente: el presentador ejecuta la decisión acordada. Los resultados evalúan observación, adaptación y coherencia con la brecha, además de los números.

**Para la exposición:** recorrer `/presentacion`; al llegar a la conclusión, usar **Jugar Benchmark Challenge**. Esto abre `/challenge?presentacion=1` y activa el modo audiencia. La partida termina con el informe y la reconstrucción académica «¿Qué acabamos de hacer?». Desde allí se puede jugar otra estrategia o volver a Studio.

Los módulos guardan su progreso por separado. Challenge usa `benchmark-challenge-v1`; guarda acciones y reconstruye una partida válida al recargar, sin confiar en saldos o indicadores editados en el almacenamiento.

### Archivos del segundo módulo

- `src/challenge/data.ts`: referentes, criterios, decisiones, costos y efectos.
- `src/challenge/engine.ts`: transiciones válidas, cálculos, persistencia y evaluación cualitativa.
- `src/challenge/Challenge.tsx`: coordinación de rondas.
- `src/challenge/Intelligence.tsx`, `GapInspector.tsx`, `Decisions.tsx`, `MetricBoard.tsx`, `Results.tsx`: superficies de juego reutilizables.
- `src/challenge/challenge.css`: diseño del juego y modo audiencia, usando los tokens compartidos.
- `src/components/ModuleNavigation.tsx`, `ModuleBridge.tsx`: navegación y conexión entre módulos.
- `src/modules.css`: tokens de la identidad existente y estilos de navegación compartida.

`node challenge.test.mjs` recorre 2.235 combinaciones completas válidas y verifica cálculos, límites, presupuesto, bloqueo de duplicados, partidas recuperadas, reinicio y perfiles educativos. `node analysis.test.mjs` conserva la cobertura de Studio.
