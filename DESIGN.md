---
name: TerraClicker
description: El bioma es la pantalla; todo lo demas son placas de piedra que se ponen delante y se quitan.
colors:
  accent: "#78bd52"
  gold: "#ffd35c"
  bg: "#101219"
  bg-deep: "#080a10"
  panel: "#232838"
  panel-2: "#1a1e2b"
  panel-3: "#2e3550"
  plate-fill: "rgba(10, 13, 20, 0.82)"
  border: "#414a6b"
  border-light: "#59648c"
  text: "#e6e9f5"
  text-dim: "#97a0be"
  text-faint: "#6b7395"
  green: "#7ec850"
  red: "#e2574c"
  purple: "#a06cd5"
  blue: "#56a0e0"
  orange: "#e08a3c"
  copper: "#d98b52"
  silver: "#cdd4e0"
  platinum: "#dfe8f5"
typography:
  display:
    fontFamily: "'Baloo 2', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "normal"
  headline:
    fontFamily: "'Baloo 2', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "0.06em"
  title:
    fontFamily: "'Baloo 2', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "0.04em"
  body:
    fontFamily: "'Baloo 2', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
  label:
    fontFamily: "'Baloo 2', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "normal"
  numeric:
    fontFamily: "'Baloo 2', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.35
    fontFeature: "tabular-nums"
rounded:
  xs: "3px"
  sm: "4px"
  md: "5px"
spacing:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
components:
  plate:
    backgroundColor: "{colors.plate-fill}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  panel-title:
    backgroundColor: "{colors.panel-3}"
    textColor: "{colors.gold}"
    typography: "{typography.title}"
    padding: "8px 12px"
  button:
    backgroundColor: "{colors.panel-3}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-hover:
    backgroundColor: "{colors.panel-3}"
    textColor: "{colors.text}"
  button-primary:
    backgroundColor: "#6b5520"
    textColor: "{colors.gold}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-danger:
    backgroundColor: "#7a2f28"
    textColor: "#ffc2bb"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
  button-small:
    backgroundColor: "{colors.panel-3}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "3px 8px"
  chapa:
    backgroundColor: "{colors.plate-fill}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "4px 9px"
  chip:
    backgroundColor: "rgba(20, 24, 34, 0.9)"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "5px 10px"
  chip-active:
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "5px 10px"
  slot:
    backgroundColor: "{colors.panel-2}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs}"
    size: "42px"
  rail-button:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  rail-button-open:
    backgroundColor: "{colors.panel-3}"
    textColor: "{colors.gold}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  modal:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
  modal-title:
    backgroundColor: "{colors.panel-3}"
    textColor: "{colors.gold}"
    typography: "{typography.title}"
    padding: "9px 12px"
  toast:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "8px 11px"
---

# Design System: TerraClicker

## Overview

**Creative North Star: "El Cartel de Bioma"**

El bioma no es una ilustracion dentro de una caja: es la pantalla. El fondo del
bioma activo ocupa la ventana entera a sangre, el objetivo esta en el centro con
su barra de vida, y todo lo demas son placas de piedra translucidas que flotan
encima de el, apoyadas en los bordes. No hay cabecera, no hay barra lateral, no
hay scroll de pagina: la interfaz es un cartel montado sobre el mundo, y las
pantallas (fabricar, pueblo, eventos, mochila) se ponen delante y se quitan.

El sistema tiene un solo mecanismo de tematizacion y es una custom property.
`--accent` se escribe una vez sobre `.shell` desde la zona activa y de ahi
repinta el borde superior de cada placa, el nombre de la zona, el rail abierto y
el hover de cada chapa. En el Infierno la interfaz es roja, en las Cavernas es
piedra, en la Luna es violeta. No hay hojas de estilo por bioma, ni clases
`.theme--jungla`, ni un mapa de 20 paletas: hay veinte valores en los datos de
zona y una variable.

La densidad es alta y deliberada: 15px de cuerpo, cifras de 11 a 13px con
`tabular-nums`, bordes de 2px, radios de 3 a 5px, ritmo de 4/6/8/10/12. Es
chrome de juego de 2011, no de aplicacion: nada de cristal esmerilado, nada de
degradados de marca, nada de espacio en blanco generoso. La unica cosa nitida en
la pantalla es lo que estas golpeando; el resto del mundo esta desenfocado a
proposito.

**Key Characteristics:**

- Un fondo a sangre desenfocado, un objetivo nitido en el centro, placas en los bordes.
- `--accent` como unico mecanismo de tematizacion: veinte biomas, una variable.
- Cero scroll de pagina en cualquier pantalla; el scroll vive dentro del cuerpo de un modal.
- Superficies de piedra opaca y translucida, sin `backdrop-filter` en ningun sitio.
- Sprites de Terraria sin suavizar (`image-rendering: pixelated`) como unico lenguaje de icono.
- Oro (#ffd35c) como unico acento de marca; el color de bioma es del bioma, no de la marca.
- En estrecho (<=820px) el HUD se reorganiza, nunca se encoge.

## Colors

Una base de piedra azulada muy oscura, un unico acento de marca dorado, y un
acento variable que no pertenece a la marca sino al bioma que se esta jugando.

### Primary

- **Oro de Terraria** (`{colors.gold}`): el unico acento de marca. Pinta cabeceras
  de panel y de modal, cifras fuertes (dano por click, potencia de pico), la `b`
  de cada chapa y cada tag, el anillo de foco y la seleccion de texto. Es el
  color con el que se lee "esto es un dato que importa".
- **Acento de bioma** (`{colors.accent}`; el valor del frontmatter es el de
  arranque, el Bosque): se escribe una vez en `.shell` desde
  `zones.current.accent` y baja por herencia. Recorre veinte valores, del verde
  del Bosque (#78bd52) al violeta de la Luna (#8f6ee8) y el naranja del Pilar
  Solar (#f07a37). Nunca es un color de estado: es una firma de sitio.

### Secondary

- **Piedra de placa** (`{colors.panel-3}` sobre `{colors.panel}` a `{colors.panel-2}`):
  las superficies de chrome. `panel-3` es la cabecera y el estado hover/abierto;
  el degradado `panel` -> `panel-2` es el cuerpo de panel, modal y boton.
- **Relleno de placa flotante** (`{colors.plate-fill}`): el unico relleno de las
  placas del HUD. Es color solido a 0.82 de alfa, no cristal.

### Tertiary

Los colores de estado y de material. No se mezclan con los dos acentos de
arriba: viven en bordes de aviso, rellenos de barra y monedas.

- **Verde de exito** (`{colors.green}`): toast de exito, marca `E` de equipado.
- **Rojo de peligro** (`{colors.red}`): toast de aviso, insignia del rail, zona
  bloqueada, evento inminente (con su latido de 1.6s).
- **Violeta de raro** (`{colors.purple}`): linea de botin raro, cuenta atras lunar.
- **Azul de progreso** (`{colors.blue}`): toast informativo, aviso de pilares,
  barra de progreso y relleno de mana.
- **Naranja de invasion** (`{colors.orange}`): aviso de invasion.
- **Monedas** (`{colors.copper}`, `{colors.silver}`, `{colors.gold}`,
  `{colors.platinum}`): las cuatro denominaciones se tinen por su metal, y solo
  ahi.

### Neutral

- **Noche de piedra** (`{colors.bg}` con un halo radial mas claro arriba, y
  `{colors.bg-deep}` para los canales vacios de barra): el fondo del documento,
  visible solo antes de que cargue un bioma.
- **Borde** (`{colors.border}`) y **borde vivo** (`{colors.border-light}`): la
  reja de 2px de todo el chrome; `border-light` es el hover, el marco del modal
  y el pulgar de scroll.
- **Texto** (`{colors.text}`), **atenuado** (`{colors.text-dim}`) y **desvaido**
  (`{colors.text-faint}`): cifra, etiqueta y metadato. Tres pesos de gris y no mas.

### Named Rules

**The One-Variable Theming Rule.** El color de bioma entra al sistema por
`--accent` en `.shell` y por ningun otro sitio. Una superficie nueva no declara
su color de bioma: hereda. Si hace falta una mezcla, se hace con
`color-mix(in srgb, var(--accent) N%, ...)`, nunca con un hex nuevo.

**The Gold Is Brand, Accent Is Place Rule.** El oro dice "dato importante" y no
cambia nunca. El acento dice "estas aqui" y cambia siempre. Ninguno de los dos
se usa para exito, error ni progreso: eso es trabajo del terciario.

## Typography

**Display Font:** Baloo 2 (autoalojada desde `public/fonts`, variable 400-800,
dos subsets latin/latin-ext, `font-display: swap`)
**Body Font:** Baloo 2
**Label/Mono Font:** Baloo 2 con `font-variant-numeric: tabular-nums`

**Character:** Un solo palo seco redondeado y contundente para todo. Baloo 2 es
el sustituto libre de *Andy Bold*, la fuente de la interfaz de Terraria
(propietaria, no redistribuible): misma familia visual, mismo peso en la pagina.
La x-height alta y las descendentes cortas son la razon de que el interlineado
global sea 1.35 y no 1.45, y de que 15px de cuerpo rinda como 14 en Trebuchet.

### Hierarchy

- **Display** (800, 20px, blanco puro, doble sombra `0 2px 0` + `0 0 14px`
  negras): el nombre del objetivo en el centro del mundo. Es el unico texto que
  vive sobre el fondo del bioma sin una placa debajo, y por eso lleva la sombra.
- **Headline** (800, 17px, 0.06em, versalitas altas, en `--accent`): el nombre de
  la zona en la parte de arriba del mundo. Es tambien el boton de su ficha.
- **Title** (800, 12-14px, 0.03-0.06em, versalitas altas, en `--gold`): cabecera
  de panel, de modal y ladillo de panel sin marco. Los tres comparten el mismo
  tratamiento a tres tamanos; su `small` acompanante vuelve a 400 y sin tracking.
- **Body** (400, 15px, 1.35): prosa, descripciones, texto de vecino.
- **Label** (400-600, 13px): filas de readout, etiqueta de chapa, etiqueta de
  rail, texto de boton (600).
- **Numeric** (700, 11-13px, `tabular-nums`): toda cifra que cambia sola. Barras
  de vida y mana, celdas de la chapa compacta, contadores de slot, splats de
  dano. Con sombra `0 1px 2px` cuando cae encima de un relleno de barra.
- **Micro** (700, 9-10px, 0.04-0.08em, versalitas altas, en `--text-faint`):
  etiqueta de columna de equipo y etiqueta de slot vacio. Solo dentro de una
  placa, solo para nombrar un hueco.

### Named Rules

**The Tabular Rule.** Toda cifra que se actualiza en vivo lleva
`font-variant-numeric: tabular-nums`. Un numero que baila al cambiar de digito
delata que la pantalla se esta redibujando.

**The One Family Rule.** Baloo 2 en un solo fichero por subset cubre 400 a 800.
No entra una segunda familia, ni una mono para las cifras: el peso y el
`tabular-nums` ya hacen esa distincion.

**The Shadowed Text Rule.** Un texto sobre el fondo del bioma o sobre un relleno
de barra lleva sombra negra dura (`0 2px 0` / `0 1px 2px`). Un texto dentro de
una placa no lleva ninguna.

## Layout

**El armazon.** `html`, `body`, `#root` y `.shell` van a `100dvh` con
`overflow: hidden`. `dvh` y no `vh` porque en el movil la barra del navegador se
recoge y `vh` dejaba un hueco muerto abajo. El mundo (`.world`) esta siempre
montado en `position: absolute; inset: 0`, con el objetivo centrado por
`place-items: center`. Encima va el HUD, y encima de todo los modales.

**El HUD.** Una rejilla de tres columnas (`auto 1fr auto`) por dos filas
(`1fr auto`) con areas nombradas `left / . / right` y `bottom` a todo lo ancho,
12px de padding y 10px de gap. El HUD entero es `pointer-events: none` y solo
sus hijos directos recuperan los clicks: el click primario es la pantalla, y las
placas son agujeros en esa superficie de click.

- **left** (arriba a la izquierda): placa de personaje de 244px y, colgando de
  ella, el feed de botin.
- **right** (arriba a la derecha): franja de chapas, placa de equipo de nueve
  slots, rail de nueve pantallas.
- **bottom**: aviso de evento y dique de 16 zonas.

**Las pantallas.** Ninguna pantalla es una ruta: cada una es un modal elegido de
un mapa `SCREENS` que lleva tambien su ancho maximo. Los anchos son por
contenido, no por una escala de contenedores: 720 (ajustes, ficha de zona), 760
(estadisticas), 900 (mochila), 980 (jefes), 1000 (pueblo, eventos, catalogo),
1040 (logros), 1080 (fabricar). El modal es `width: 100%` con
`max-width` y `max-height: calc(100vh - 32px)`.

**Rejillas internas.** Tres pasos y no mas:
`auto-fill minmax(74px, 1fr)` para rejillas de objeto,
`minmax(230px, 1fr)` para tarjetas y
`minmax(280px, 1fr)` para tarjetas anchas. Gap de 8px.

**Ritmo.** 4 / 6 / 8 / 10 / 12px, con 8 y 6 haciendo la mayor parte del trabajo.
Padding de placa 10px, de panel y modal 12px, de dique 7px, de rail 6px.

**Los dos cortes.** A **1100px** el rail pierde sus etiquetas (se queda en
iconos) y la placa de personaje baja de 244 a 208px: eso es lo unico que se
encoge en todo el sistema. A **820px** (`useNarrow`, mismo `matchMedia` en JS que
en CSS) el HUD se **reorganiza**: la rejilla pasa a una columna en orden
`right / left / bottom`, el rail se acuesta en horizontal con la insignia
reposicionada a la esquina del icono, el contador de clicks desaparece de la
franja (empujaba el reloj a una segunda linea a 380px), el nombre de la zona baja
del top a `bottom: 132px`, el feed de botin se oculta y la barra de vida del
objetivo pasa a `min(320px, 78vw)`. La placa de personaje se convierte en una
"chapa" pulsable con las barras y cuatro cifras; los nueve slots de equipo se
convierten en sprites de 20px en linea dentro de una chapa; y la ficha completa,
la hoja de estadisticas y el dique de 16 zonas se abren en modal.

### Named Rules

**The No Page Scroll Rule.** Ninguna pantalla del juego hace scroll de pagina.
Si un contenido no cabe, va dentro de `.modal__body`, que es el unico elemento
con `overflow-y: auto` del sistema. Prueba: en cualquier pantalla y a cualquier
ancho, la rueda del raton sobre el fondo no mueve nada.

**The Restructure, Don't Shrink Rule.** Por debajo de 820px un componente que no
cabe no se hace pequeno: cambia de forma (placa -> chapa, rejilla -> sprites en
linea) o se muda a un modal. La unica excepcion aceptada es el corte de 1100px,
que si es un encogimiento.

**The Click-Through Rule.** Cualquier capa que se pone sobre el mundo y no es
interactiva lleva `pointer-events: none` (fondo, tinte, vineta, columna del
objetivo, feed de botin, HUD). Lo que si es interactivo lo recupera
explicitamente. Nada puede quedarse entre el raton y el golpe.

## Elevation & Depth

El sistema no usa una escala de elevacion: usa **bisel** y **desenfoque de
fondo**. Cada superficie de chrome se levanta con la misma pareja de una sombra
interior de 1px blanca al 6-7% arriba y un canto negro duro abajo
(`--shadow: 0 2px 0 rgba(0,0,0,0.45)`): es el bisel de sprite del chrome de un
juego de 2011, no una tarjeta desplazada, y siempre va con su reflejo interior.
El boton lo demuestra: al pulsarlo baja 2px y pierde el canto, asi que el canto
es el grosor del boton y no una sombra decorativa. Las sombras difusas que hay
son de separacion contra el mundo, no de jerarquia: `0 6px 18px -8px` bajo las
placas y el rail, `0 -4px 18px -8px` (hacia arriba) bajo el dique, y
`0 18px 40px -12px` bajo el modal.

La profundidad de verdad la da el mundo: el fondo va desenfocado y el sprite del
objetivo, nitido, recorta contra el como en un juego con profundidad de campo.

**No hay `backdrop-filter` en ningun sitio, y la ausencia es una decision.** La
translucidez de las placas es un relleno plano `rgba(10, 13, 20, 0.82)`. El
cristal esmerilado es decoracion de aplicacion moderna; el desenfoque del mundo
(ese si tiene un motivo tecnico) ya separa la placa de lo que hay detras.

### Shadow Vocabulary

- **Bisel** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.06..0.07), 0 2px 0 rgba(0,0,0,0.45)`):
  el canto de toda superficie de chrome. Panel, boton, aviso de evento.
- **Separacion de placa** (`0 6px 18px -8px rgba(0,0,0,0.85)`): bajo las placas
  flotantes y el rail, para que se despeguen del bioma.
- **Separacion de dique** (`0 -4px 18px -8px rgba(0,0,0,0.85)`): la misma sombra
  hacia arriba, porque el dique se apoya en el borde de abajo.
- **Modal** (`0 18px 40px -12px rgba(0,0,0,0.9)` sobre un fondo
  `rgba(4,6,12,0.72)`): lo unico que se lee como "encima de todo".
- **Sprite** (`drop-shadow(0 2px 1px rgba(0,0,0,0.55))`, y
  `drop-shadow(0 10px 14px rgba(0,0,0,0.7))` para el objetivo): los sprites no
  llevan caja, llevan su propia sombra recortada a su silueta.

### Named Rules

**The No Frosted Glass Rule.** `backdrop-filter` no entra en este sistema. La
translucidez se hace con alfa sobre un color solido. Prueba: quitar el fondo del
bioma no debe cambiar el aspecto de ninguna placa mas que su contraste.

**The Blur Belongs to the World Rule.** El desenfoque solo se aplica al fondo del
bioma: 3px sobre los pintados de 1024x838, 7px con `background-size: 640px` sobre
las texturas de mapa de 115x65 (a `cover` salian como bloques de 14px, y
repetidas se les veian las costuras). Va con `scale(1.04)` / `scale(1.06)` porque
el blur se come los bordes, y con `saturate(1.08)` / `saturate(1.14)` para
recuperar el color. Lo unico nitido en la pantalla es lo que estas golpeando.

**The Bevel, Not the Offset Rule.** El canto duro de 2px nunca va solo: lleva su
reflejo interior de 1px y, si es pulsable, colapsa en `:active`. Es el grosor del
objeto. Una caja con canto duro y sin reflejo ni respuesta al pulsar esta mal
puesta.

## Shapes

Radios cortos y bordes gruesos: 2px de borde en todo el chrome, 3px de radio en
lo pequeno e interior (canal de barra, celda, chapa de slot), 4px en lo pulsable
(boton, chip, slot, chapa, toast) y 5px (`--radius`) en los contenedores (panel,
modal, placa, rail, dique). Nada por encima de 5px salvo dos redondeos de
insignia (9px en la insignia del rail, `999px` en las pildoras de recuento). No
hay circulos, no hay `border-radius` grande, no hay formas recortadas.

La firma de forma del sistema es la **placa**: rectangulo de esquinas casi rectas,
borde de 2px gris, y el borde de arriba —y solo el de arriba— en el color del
bioma (`border-top-color: var(--accent)`). Es el gesto que dice "esto pertenece a
este sitio".

El dique de zonas usa la variante del mismo gesto para no romper la esquina: el
color del bioma va como `box-shadow: inset 0 -3px 0` en el borde inferior del
chip y no como borde, porque un borde de 3px corta el radio y una sombra interior
lo sigue.

Los sprites nunca se enmarcan en un contenedor con forma propia: van a pelo con
`image-rendering: pixelated`, `object-fit: contain` y su drop-shadow. Un slot
vacio se dibuja como un hueco con borde discontinuo de 1px
(`.gear__hole`, `.sprite--missing`): se ve que existe y que esta vacio.

### Named Rules

**The Accent Rim Rule.** El color del bioma toca una placa por un solo canto: el
de arriba. Los otros tres quedan en `--border`. Una placa con los cuatro bordes
en color de bioma grita, y con veinte biomas grita de veinte maneras.

**The Pixel Rule.** Todo `<img>` del proyecto lleva `image-rendering: pixelated`
globalmente. Ningun sprite se suaviza, se escala a un no-multiplo con
interpolacion ni se recorta con mascara.

## Components

### Buttons

- **Shape:** esquinas casi rectas (4px), borde de 2px.
- **Default:** degradado `panel-3` -> `panel-2` con borde `--border` y bisel;
  padding `6px 12px`, 13px/600.
- **Hover / Focus:** el borde sube a `--border-light` y todo el boton gana
  `filter: brightness(1.15)`; el foco es el anillo global de 2px en oro con 2px
  de `outline-offset`.
- **Active:** `translateY(2px)` y `box-shadow: none`. El boton se hunde su propio
  grosor. Transicion de 0.06s: el click no espera a una animacion.
- **Primary:** degradado oliva-oro (#6b5520 -> #4a3a15) con borde #8a6f2c y texto
  en oro. Es la accion que confirma (fabricar, invocar, comprar).
- **Danger:** degradado granate (#7a2f28 -> #4d1e1a) con borde #8c3a33 y texto
  #ffc2bb. Quitar, borrar, cerrar sesion de guardado.
- **Small / Block:** `3px 8px` a 12px, y `width: 100%`.
- **Disabled:** `opacity: 0.45` y `cursor: not-allowed`; ni el borde ni el brillo
  responden.

### Chips (dique de zonas)

- **Style:** relleno `rgba(20,24,34,0.9)`, borde de 2px transparente, radio 4px,
  padding `5px 10px`, sprite de 22px mas nombre a 13px. El color del bioma llega
  por `--chip` y se pinta como `inset 0 -3px 0` a un 30% de mezcla.
- **Hover:** el `inset` pasa a color pleno, el fondo a `panel-3` y el chip sube
  2px.
- **Active:** fondo `color-mix(var(--chip) 22%, #12151f)`, borde en el color
  pleno, `inset` pleno, sube 3px y el texto a blanco. Es la zona en la que estas.
- **Locked:** `opacity: 0.5` + `saturate(0.4)` y el nombre tachado con
  `text-decoration-color: var(--text-faint)`. Se ve que existe y por que no
  puedes entrar.
- **Event:** en vez de `inset`, un halo `0 0 12px -2px var(--chip)`: los cuatro
  pilares no son un sitio al que se va, son algo que esta pasando.
- **En modal** (`.dock--modal`): el dique pierde su marco (`background: transparent`,
  sin borde ni sombra) y los chips pasan a `flex: 1 1 150px`.

### Cards / Containers

Dos familias, y la eleccion no es estetica: es de sitio.

- **Placa** (`.plate`, sobre el mundo): relleno plano `rgba(10,13,20,0.82)`,
  borde de 2px `--border` con el de arriba en `--accent`, radio 5px, padding
  10px, bisel mas sombra de separacion. Sin `backdrop-filter`.
- **Panel** (`.panel`, dentro de una pantalla): degradado `panel` -> `panel-2`,
  borde de 2px, radio `--radius`, padding 12px, cabecera en `panel-3` sangrada a
  los bordes con margen negativo y titulo en oro versalitas. `.panel + .panel`
  se separan 12px.
- **Panel sin marco** (`.bare`): un `Panel` dentro de un modal detecta el
  `FramedContext` y renderiza sin marco, porque el modal ya trae el suyo; una
  pantalla que apila tres paneles quedaria como tres cajas dentro de otra caja.
  El titulo pasa a ladillo de 12px en oro con una regla de 2px debajo, y
  `.bare + .bare` se separan 16px.

### Navigation (rail)

- **Style:** columna de nueve botones de 6px de padding dentro de una placa de
  radio 5px. Cada boton es un sprite real de Terraria de 22px (el ojo de Cthulhu
  para Jefes, la mesa de trabajo para Fabricar) mas su etiqueta de 13px.
- **Default:** transparente, borde transparente de 2px reservado para no bailar.
- **Hover:** fondo `panel-3`.
- **Open:** fondo `panel-3`, borde en `--accent`, texto en oro, `aria-pressed`.
- **Badge:** pildora roja de radio 9px, minimo 20px de ancho, 11px/800 en blanco,
  con corte en `99+`. Es lo que hay que atender ahi dentro.
- **Narrow:** el rail se acuesta en horizontal a lo ancho del HUD, pierde las
  etiquetas y la insignia salta a `top: -3px; right: -3px` sobre el icono.

### Modal (la unica navegacion del juego)

Es el componente que sostiene el thesis: no hay rutas, hay cosas que se ponen
delante y se quitan. Marco de `border-light` (mas claro que un panel: esta
encima), degradado `panel` -> `panel-2`, radio 5px, cabecera fija en `panel-3`
con sprite opcional, titulo en oro versalitas y un `aside` en `small` desvaido.
El cuerpo es el unico elemento con scroll del sistema (`flex: 1; min-height: 0;
overflow-y: auto`). Fondo `rgba(4,6,12,0.72)` con `place-items: center` y 16px de
padding (8px en estrecho, donde el modal sube a `calc(100dvh - 16px)`).

- **Entrada:** `modal-slide` 0.18s `cubic-bezier(0.2,0.9,0.3,1)` desde
  `translateY(14px) scale(0.98)`; el fondo con `modal-fade` 0.14s. Las dos se
  anulan con `prefers-reduced-motion: reduce` y con el ajuste de animaciones.
- **Apilado:** `z-index: 100 + level * 10`. El submenu de un vecino se lee por
  delante de su ficha.
- **No cerrable:** con `canClose: false` no hay boton, ni Escape, ni click fuera.
  Lo usa la bossfight, que se come la pantalla entera y de la que no se sale por
  accidente.

### Bars (vida, mana, progreso)

Canal oscuro con borde de 2px, radio 3-4px, `overflow: hidden`, y un relleno que
se anima **por `transform: scaleX`** y no por `width`: 0.09s lineal en el objetivo
y las barras de juego, 0.14s `ease-out` en las vitales. Encima, la cifra centrada
en `tabular-nums` blanco con sombra. Los rellenos son degradados verticales de
dos paradas, uno por rol: vida `#f4705f -> #b8352a`, mana `#7fa8f5 -> #3a52b8`,
objetivo `#9ee06a -> #55923a`, jefe `#ff8f6b -> #b02f2f`, progreso
`#7bb6ef -> #3f6ea8`. La barra del objetivo en el mundo es de 20px y
`min(420px, 42vw)`; las vitales de la placa, 18px; `--slim`, 10px.

### Item slot

Cuadrado `aspect-ratio: 1` con relleno `panel-2`, borde de 2px, radio 4px, y el
sprite centrado (30px en la placa de equipo, donde el slot mide 42px). Hover:
borde a `border-light` y `translateY(-2px)`. Seleccionado: borde en oro y fondo
`panel-3`. Vacio: `opacity: 0.5`, sin hover, con su etiqueta micro de 9px. El
contador de cantidad va abajo a la derecha en 11px/700 con sombra dura.

### Chapa (la unidad de dato del HUD)

Pildora de 4px 9px, relleno de placa, borde de 2px, radio 4px, 13px con
`tabular-nums`: sprite mas cifra, con la cifra en oro (`b`). Es lo que lleva
monedas, logros, clicks y tiempo jugado en la franja de arriba a la derecha, y en
estrecho baja a 12px con 3px 7px. Dos variantes con trabajo propio:
`--gear` (borde `border-light`, pulsable, hover en `--accent`) es el equipo
completo en linea; los slots vacios dentro de ella se dibujan como
`.gear__hole`, un cuadrado de 20px con borde discontinuo de 1px.

### Signature: el mundo (`.world`)

Cuatro capas absolutas en el mismo `inset: 0`, todas sin clicks salvo la que los
pide: fondo del bioma (`cover`, `center 42%`, desenfocado y escalado; o
`repeat` a 640px si la zona es `tiled`), tinte del bioma, vineta, y la columna del
objetivo. La vineta es el elemento que hace legible todo lo demas: un radial
`115% 85% at 50% 46%` que va de transparente al 26% a `rgba(4,6,12,0.8)` en el
borde, mas un lineal que oscurece arriba y abajo. Sin ella, sobre el Sagrado o la
Nieve las cifras de las placas se perdian.

El golpe: el sprite del objetivo hace `scale(0.9) translateY(3px)` en 0.07s
`ease-out` y vuelve, y salen splats de dano (`#fff3c4` a 16px, criticos `#ffb13d`
a 24px) que suben 46px y se apagan en 0.75s. Nada mas. El click responde antes de
que empiece cualquier animacion.

### Toasts

Esquina inferior derecha, ancho maximo 320px, apilados con 6px. Fondo `panel`,
borde de 2px que **es** el estado (verde exito, rojo aviso, azul info, oro logro),
radio 4px, entrada `translateX(28px)` en 0.22s. El de logro es el unico con
tratamiento extra: degradado dorado al 18% y un halo
`0 0 14px rgba(255,211,92,0.25)`.

## Do's and Don'ts

### Do:

- **Do** poner el color de bioma en una superficie nueva heredando `var(--accent)`,
  y mezclarlo con `color-mix(in srgb, var(--accent) N%, ...)` si hace falta un tono.
- **Do** tocar la placa con el acento por un solo canto, el de arriba
  (`border-top-color: var(--accent)`), o por una `inset 0 -3px 0` si el radio
  importa.
- **Do** dar a toda cifra viva `font-variant-numeric: tabular-nums`.
- **Do** meter cualquier contenido que no quepa dentro de `.modal__body`, el
  unico elemento con scroll del sistema.
- **Do** animar el relleno de una barra con `transform: scaleX` y no con `width`.
- **Do** marcar como `pointer-events: none` cualquier capa nueva sobre el mundo
  que no sea interactiva, y devolverle los clicks solo a lo que se pulsa.
- **Do** usar sprites reales de `public/assets/` como iconos, a pelo, con
  `image-rendering: pixelated` y su drop-shadow.
- **Do** dibujar un hueco vacio como hueco: borde discontinuo de 1px y opacidad
  reducida, nunca ausencia.
- **Do** reorganizar por debajo de 820px (placa -> chapa, rejilla -> sprites en
  linea, contenido -> modal) en vez de encoger.
- **Do** dejar cualquier animacion de entrada bajo `prefers-reduced-motion` y el
  ajuste de animaciones del juego.

### Don't:

- **Don't** usar `backdrop-filter` en ninguna superficie. La translucidez es alfa
  sobre color solido (`rgba(10,13,20,0.82)`).
- **Don't** escribir un hex de bioma en el CSS ni crear una hoja, clase o mapa de
  tema por zona. El mecanismo entero es `--accent` en `.shell`.
- **Don't** dejar que ninguna pantalla haga scroll de pagina. `100dvh` +
  `overflow: hidden` es un invariante, no un default.
- **Don't** usar `vh` para altura de pantalla: en el movil deja un hueco muerto
  abajo. `dvh`.
- **Don't** usar el oro para exito, error ni progreso, ni el acento de bioma para
  estado: eso es trabajo del terciario (verde, rojo, azul, violeta, naranja).
- **Don't** poner un canto duro `0 2px 0` en una caja que no lleve su reflejo
  interior de 1px ni colapse al pulsarse. Es un bisel de grosor, no una sombra
  desplazada decorativa.
- **Don't** desenfocar nada que no sea el fondo del bioma. Lo unico nitido de la
  pantalla debe seguir siendo lo que se golpea.
- **Don't** meter una segunda familia tipografica, ni una mono para las cifras.
- **Don't** superar 5px de radio en un contenedor ni 2px de grosor de borde.
- **Don't** poner una animacion, brillo o transicion entre el raton y el golpe:
  el maximo aceptado en la ruta del click es 0.07s.
- **Don't** enmarcar un `Panel` dentro de un modal: el `FramedContext` ya lo pone
  en modo `.bare`, y un marco dentro de otro marco se lee como una caja dentro de
  una caja.
