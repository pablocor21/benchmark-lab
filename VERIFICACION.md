# Verificación de Benchmark Studio

- Compilación TypeScript y producción: correcta.
- Pruebas de análisis: cuatro escenarios, selección, empates y brechas negativas/cero/positivas; recuperación de persistencia inválida.
- Navegador: recorrido completo desde introducción hasta informe y siete diapositivas.
- Edición: Rapidez de QuickBite de 5 a 10 cambió la brecha de −4 a +1.
- Criterios: límites de 4 y 6 comprobados.
- Visualizaciones: radar, barras y brechas visibles; tabla de datos alternativa disponible.
- Persistencia: adaptación y meta conservadas después de recargar.
- Presentación: anterior/siguiente, límites inicial/final y flechas del teclado comprobados.
- Guía: cierre con Escape, confinamiento y retorno del foco comprobados.
- Responsive: inspección a 1440, 1024, 768 y 390 px sin overflow de página; matriz con scroll propio.
- Capturas visuales: portada, radar, matriz móvil e informe móvil revisados durante el trabajo. Etiquetas del radar ajustadas tras detectar recorte.
- Consola: sin errores o advertencias de la aplicación en las comprobaciones realizadas.
- Descarga: botón implementado con archivo de texto local. El navegador integrado no emitió un evento de descarga verificable; no se confirmó el guardado del archivo en este entorno.

No constituye una auditoría WCAG formal. La interfaz usa controles nativos, etiquetas, contraste alto, foco visible, datos textuales y movimiento reducido.

## Segunda fase: Benchmark Challenge

- Compilación TypeScript y producción correctas, sin añadir dependencias.
- 2.235 recorridos completos válidos comprobados en el motor de juego, más casos de acciones duplicadas, fuera de secuencia, presupuesto insuficiente y persistencia inválida.
- Dos partidas de navegador: adaptación de Vertex → análisis del proceso → medición; y rediseño aislado → aumento de personal → medición.
- Primera partida: indicadores finales 59 / 77 / 49 / 62, saldo 55, perfil Analista Estratégico.
- Segunda partida: opción de 30 puntos bloqueada con saldo 25; perfil Innovador Aislado.
- Modo audiencia sin elección automática, decisiones ejecutables con teclado y efectos instantáneos.
- Guardado y recarga de partida conservan resultados. El selector permite volver a Studio sin borrar su análisis.
- Resultados revisados a 1440, 1024, 768 y 390 px, sin desbordamiento horizontal de página.
- Cierre académico y modo audiencia revisados visualmente. En la vista de 1440 × 1000, las cuatro opciones de audiencia caben en la pantalla.
- Studio recorrido nuevamente desde escenario hasta informe; radar verificado. Los textos previos del usuario se restauraron después de probar el informe.
- Presentación: las siete diapositivas siguen operativas; el acceso final abre `/challenge?presentacion=1` con audiencia activada.
- Consola sin errores ni advertencias de la aplicación en las comprobaciones realizadas.
- La duración de cinco minutos es orientativa y depende del ritmo de discusión. No se incorporaron backend, autenticación, sonidos ni efectos permanentes.
