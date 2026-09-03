# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Un solo jugador, el autor y quien le pase el enlace: alguien que ya conoce
Terraria de haberlo jugado y reconoce sus sprites, sus nombres y su orden de
progresion sin que nadie se lo explique. Juega en el navegador, en un portatil o
un monitor, en sesiones seguidas de media hora o mas, con la pestaña delante (el
juego no tiene progreso offline). Quiere poder jugarlo tambien desde el movil,
aunque el escritorio es donde lo juega de verdad.

El trabajo que hace mientras juega: pica bloques y mata bichos a clicks, decide
que fabricar con lo que cae, elige cuando esta listo para el siguiente jefe, y
gestiona un pueblo y unos eventos que le dan objetivos a medio plazo.

## Product Purpose

Un clicker/idle que recorre la progresion completa de Terraria de principio a
fin: del pico de cobre en el Bosque al Cenit despues del Senor de la Luna.
Funciona cuando una partida entera se puede terminar en una sesion larga y en
ningun momento el jugador se queda sin saber que hacer a continuacion.

La primera partida del autor duro 37 minutos; el contenido se ha ido ampliando
desde entonces (pueblo, cinco invasiones, evento lunar, tier de luminita) para
que dure mas sin volverse repetitivo.

## Positioning

La progresion es la de Terraria de verdad, no una inspirada en ella: las zonas
se abren por hitos de equipo (la herramienta, la estacion o el jefe que
demuestran que ya puedes aprovechar lo que hay dentro), no por cantidad
farmeada; las potencias de pico son las del juego original; los jefes se invocan
con su objeto fabricado en un altar demoniaco; y los eventos siguen sus reglas
(el Cultista al 1% por bicho de la Mazmorra, mil bichos por pilar, el ectoplasma
solo de la Mazmorra de Hardmode).

## Operating Context

- Se abre en una pestaña del navegador y se juega con el raton, a clicks sobre
  el objetivo de la zona. Hay autoclicker opcional a 20 cps y autocombate en
  bossfights, apagados por defecto.
- El bucle corre a 20 ticks por segundo con `requestAnimationFrame`, asi que
  **solo avanza con la pestaña visible**. No hay progreso offline.
- Partida en `localStorage`, autoguardado cada 30 s y al cerrar. Exportar e
  importar en base64 desde Ajustes.
- Los 769 sprites se precargan al arrancar antes de dejar jugar.

## Capabilities and Constraints

Contenido: 20 zonas (16 fijas y los 4 pilares del evento lunar), 474 objetos, 74
nodos, 132 enemigos, 20 jefes, 279 recetas, 25 vecinos, 5 invasiones y 62 logros.

- **Estatico, sin servidor.** Vite + React + TypeScript, se despliega como
  ficheros. No hay cuentas, ni nube, ni multijugador.
- **La logica no usa React.** Vive en clases planas en `src/modules/` (la
  estructura de pokeclicker) y avisa a la UI por canales; los componentes se
  suscriben solo a los que les afectan.
- **Los sprites son de terraria.wiki.gg**, descargados por
  `scripts/scrape-assets.mjs`. El id de cada objeto es el nombre de su fichero.
- **El formato de guardado va versionado** (`SAVE_VERSION`, ahora 4) con cadena
  de migraciones: una partida vieja no se descarta.
- Los textos del juego van sin tildes ni eñes a proposito, salvo en la UI.

## Brand Commitments

- **Tiene que seguir pareciendo Terraria.** Los sprites, la paleta de tierra,
  piedra, cobre y oro y el aire de juego de 2011 son intocables. Nada de
  aspecto de aplicacion SaaS moderna, degradados de marca ni minimalismo
  limpio. Es la restriccion mas firme que hay.
- La interfaz va en **Baloo 2**, sustituto libre de *Andy Bold* (la fuente de
  Terraria, propietaria y no redistribuible).
- El nombre es **TerraClicker**.
- Proyecto de fan sin animo de lucro. Terraria es de Re-Logic; los sprites, de
  Re-Logic y de los autores de la wiki. El codigo va con licencia MIT y los
  assets no estan cubiertos por ella.

## Evidence on Hand

- 769 sprites, iconos de logro y fondos de bioma reales en `public/assets/`,
  descargados de la wiki.
- Los iconos de la pantalla de logros son las ilustraciones reales de los logros
  de Terraria, en `public/assets/achievements/`.
- Todos los datos de juego (objetos, enemigos, jefes, recetas, zonas) son
  contenido real y jugable, no material de relleno: no hay que inventar nada
  para llenar una pantalla.
- No hay: usuarios reales, metricas, testimonios, ni nada que se pueda afirmar
  sobre cuanta gente lo juega.

## Product Principles

1. **La progresion manda sobre la comodidad.** Si una zona no se abre es porque
   falta el hito, y el juego lo dice; no se regala el acceso.
2. **Nada oculto.** El dano por click, la potencia de pico, la defensa y lo que
   llevas puesto se ven sin abrir nada. Si algo bloquea, la pantalla explica que
   falta y donde conseguirlo.
3. **El click responde al instante.** Ninguna animacion, brillo ni transicion
   puede meterse entre el raton y el golpe.
4. **Ampliar sin quitar.** Cada iteracion añade contenido; ninguna quita zonas,
   recetas, estadisticas ni pasos que ya funcionaban.
5. **Coherencia con el original.** Un objeto sale de donde saldria en Terraria.
   Si un evento de Navidad suelta ectoplasma, esta mal.

## Accessibility & Inclusion

- Las animaciones se pueden apagar en Ajustes y se desactivan solas con
  `prefers-reduced-motion`.
- El objetivo de la zona y los jefes se pueden golpear con teclado (espacio o
  enter), no solo con el raton.
