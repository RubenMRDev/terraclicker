# TerraClicker

**Jugar: [terraclicker-eta.vercel.app](https://terraclicker-eta.vercel.app/)**


Un clicker/idle incremental con la progresión, los materiales y los jefes de **Terraria**,
construido con React + TypeScript. La estructura sigue la de
[pokeclicker](https://github.com/pokeclicker/pokeclicker): lógica de juego en clases planas
dentro de `src/modules/`, datos en listas separadas, y la UI encima leyendo de ahí.

Los 769 sprites, iconos de logro y fondos de bioma se descargan de
[terraria.wiki.gg](https://terraria.wiki.gg)
con un scraper incluido, y se precargan todos al arrancar para que ningún objetivo aparezca a
medio cargar.

## La pantalla

El bioma no es una ilustración dentro de una caja: **es la pantalla**. El fondo del bioma ocupa
la ventana entera y todo lo demás son placas translúcidas que flotan encima. **No hay scroll de
página en ninguna pantalla**: el juego cabe en el viewport y el resto se abre y se cierra por
delante.

- El **mundo** está siempre vivo detrás de todo: el objetivo al centro, su barra de vida debajo
  y el clic primario en toda la pantalla. El objetivo se apoya en una peana de alto fijo, así que
  el nombre, la barra y el botón de saltar no se mueven cuando cambia el sprite.
- Debajo del nombre de la zona va **lo que pide de herramienta frente a lo que llevas**
  («pico hasta 200 · el tuyo 200»), en rojo cuando te falta. Es la duda con la que se viaja.
- Fijos, sin abrir nada: la **ficha del personaje** arriba a la izquierda (daño, DPS, potencia
  de pico y de hacha, defensa, suerte...), las **monedas** y el **equipo** a la derecha, y el
  **dique de las zonas** abajo.
- El resto (jefes, fabricar, pueblo, eventos, mochila, catálogo, logros, estadísticas, ajustes)
  se abre en **modales apilables** desde el rail del borde derecho. Una bossfight abre un modal
  que no se puede cerrar: de un jefe no se sale por accidente.
- Cada zona trae su **color de bioma** (`ZoneDef.accent`), y ese color pinta el borde y los
  acentos de todas las placas: en el Infierno la interfaz es roja, en las Cavernas de piedra, en
  la Luna violeta.
- El fondo va **desenfocado** y lo único nítido es lo que estás golpeando. Es una decisión, no un
  apaño: los fondos de la wiki vienen en dos familias (pintados de 1024×838 y texturas de mapa de
  115×65), y las segundas estiradas a pantalla completa salían como bloques de 14 px. Desenfocadas
  se arreglan eso, las costuras del mosaico y la legibilidad de las cifras sobre el Sagrado o la
  Nieve, de una vez.
- En **móvil** el HUD no se encoge, se reorganiza: la ficha completa del personaje, el equipo y
  las 16 zonas se abren en modal, y arriba se queda lo que se mira mientras juegas. Sigue sin
  haber scroll de página a 400×880.

La interfaz va en **Baloo 2**, servida desde `public/fonts`. Es el sustituto libre de *Andy
Bold*, la fuente de Terraria: esa es propietaria y no se puede redistribuir, pero la familia
visual es la misma (palo seco redondeado y contundente) y viene en local, así que el juego
tampoco depende de la red para las letras.

## Arrancar

```bash
npm install
npm run assets     # descarga los sprites de la wiki a public/assets (ya vienen descargados)
npm run dev
```

`npm run build` genera `dist/` (estático, se puede servir desde cualquier sitio). El despliegue
de Vercel se hace solo con cada push a `main`.

## Cómo se juega

1. **Zona** — clicas el bloque o el enemigo que aparece. Al romperlo suelta materiales y
   monedas, y el siguiente aparece al instante. El cursor cambia solo según lo que tengas
   delante: el pico en las vetas, el hacha en los árboles y tu arma en los enemigos, siempre
   con el sprite de la pieza que llevas equipada.
2. **Herramientas** — el pico y el hacha tienen *potencia*, y un nodo solo aparece si tu
   herramienta lo alcanza: con pico de hierro (40) no verás vetas de oro (45). El panel
   "Recursos de la zona" te dice qué te falta.
3. **Fabricar** — mesa de trabajo → horno → yunque → forja infernal. Cada estación desbloquea
   su rama; casi todas hay que tenerlas en la mochila, salvo el altar demoniaco, que es fijo
   del bioma.
4. **DPS pasivo** — a partir del pico de hierro las herramientas y accesorios pican solos.
   Solo corre con la pestaña abierta: no hay progreso offline.
5. **Jefes** — se invocan desde su zona gastando un objeto fabricado en un altar demoniaco.
   Te devuelven daño, tienen fases, y puedes beber pociones durante la pelea (con una espera
   común entre ellas, como el mareo de poción de Terraria). Si mueres recuperas el objeto de
   invocación. El panel los lista **todos**, con su botín a la vista: los de otra zona traen un
   botón que te lleva allí en vez de quedarse como un nombre muerto.

6. **Pueblo** — construir una casa cuesta **madera** (y una puerta, una mesa y una silla, que
   también son madera), y cada casa libre deja mudarse a un vecino que ya cumpla su condición.
   Los 25 NPCs de Terraria están: el **Guía** te dice lo siguiente que toca, los mercaderes
   venden, la **Enfermera** cura por monedas, el **Inventor duende** reforja y el **Recaudador**
   te pasa una renta pasiva. Y cada vecino aporta una bonificación mientras vive ahí, que es el
   sustituto de la felicidad de los NPCs del juego original.
7. **Eventos** — cinco invasiones (ejército de duendes, legión de escarcha, eclipse solar,
   luna de escarcha y locura marciana). Mientras una está activa **sustituye la fauna de la zona
   en la que estés**, sea cuál sea, y se avanza por oleadas de bichos cada vez más duros; las
   tres últimas terminan con un jefe. La primera vez cada invasión llega gratis; para repetirla
   hace falta su objeto, que se fabrica con lo que ella misma suelta.
8. **Magia** — los báculos y las armas mágicas gastan maná por golpe y pegan más que una
   espada del mismo momento. Sin maná el golpe se queda en una cuarta parte: nunca te
   bloquea, solo te obliga a esperar la regeneración o a beber una poción. Los cristales de
   maná suben el máximo (20 de base, +20 cada uno, hasta 9).

El panel de fabricación agrupa por **conjunto de material** —casco, cota, grebas, espada,
pico y hacha de cobre juntos— salvo donde eso no aporte nada: en el horno todos los lingotes
van en un solo grupo "Lingotes". Tiene buscador global (busca en todo el recetario, no solo
en la pestaña abierta, e ignora acentos) y pone delante lo que puedes hacer ahora mismo. La
mochila también tiene buscador.

La navegación y el selector de zonas están arriba, en horizontal y fijos al hacer scroll, y
la página tiene una sola barra de scroll: ningún panel scrollea por dentro.

### Progresión

Las zonas se desbloquean por **hitos de equipo**, no por cantidad farmeada: cada una pide la
herramienta, la estación o el jefe que demuestra que ya puedes aprovechar lo que hay dentro.

| Zona | Se abre con |
| --- | --- |
| Bosque | — |
| Desierto | 25 de madera recogida |
| Océano | 30 de arena recogida |
| Subsuelo | tener un **Horno** |
| Cavernas | tener un **Yunque de hierro** + pico de potencia 40 |
| Nieve | derrotar al **Rey Slime** |
| Jungla | tener el **Mandoble de plata** |
| Corrupción | tener el **Mandoble de oro** + pico de potencia 55 |
| Meteorito | derrotar al **Ojo de Cthulhu** + pico de potencia 50 |
| Mazmorra | derrotar al **Ojo de Cthulhu** + pico de potencia 50 |
| Infierno | tener el **Pico pesadilla** + derrotar al **Devorador de Mundos** |
| **Sagrado** | derrotar al **Muro de Carne** *(empieza el Hardmode)* |
| **Corrupción profunda** | Muro de Carne + pico de potencia 110 (cobalto) |
| **Selva profunda** | Muro de Carne + pico de potencia 150 (mitrilo) |
| **Templo Lihzahrd** | derrotar a **Plantera** + su llave |
| **Pilares celestiales** ×4 | solo durante el evento lunar |
| **Luna** | derrotar al **Señor de la Luna** *(es la zona de farmeo del postgame)* |

Cada zona pide además el pico que hace falta dentro: entrar en las Cavernas con uno de cobre
solo te dejaría picar piedra.

Diecisiete jefes. **Pre-Hardmode**: Rey Slime y Ojo de Cthulhu (Bosque), Abeja Reina (Jungla),
Devorador de Mundos (Corrupción), Esqueletrón (Mazmorra) y Muro de Carne (Infierno).
**Hardmode**: los Gemelos (Sagrado), el Destructor (Corrupción profunda), Esqueletrón
Primigenio (Mazmorra), Plantera (Selva profunda) y Golem (Templo). **Evento lunar**: el
Cultista Lunático, los cuatro pilares celestiales y el Señor de la Luna, que no se invocan
sino que llegan solos (ver más abajo). **Los objetos de invocación de los demás se fabrican en
un Altar Demoniaco**, igual que en Terraria; los altares no se pican, están fijos en el
Subsuelo, las Cavernas y la Corrupción, y basta con haber visitado una de esas zonas. El Filo
Nocturno también sale de ahí, fundiendo las cuatro espadas de rama.

### Hardmode

Romper el Muro de Carne abre la segunda mitad del juego. No suelta piedra infernal: lo que
hace es sembrar el mundo de **cobalto y paladio**, y con ellos arranca la escalera de metales,
cada uno detrás del pico del anterior, igual que en Terraria:

```
fundido (100) → cobalto/paladio (110) → mitrilo/oricalco (150)
             → adamantita/titanio (180) → los tres mecánicos → pico-hacha (200)
             → clorofita (200) → Golem → sierra-pico (210) → luminita
```

El cobalto y el mitrilo aún se funden en la **forja infernal**, pero a partir del mitrilo hace
falta su **yunque**, y la adamantita solo cede en una **forja de adamantita** (que se construye
metiendo la infernal dentro). Los **tres jefes mecánicos** son los únicos que sueltan
**lingote sagrado**, con el que se hacen Excalibur, el pico-hacha y la armadura sagrada. La
**Fruta de vida** de la selva profunda sube la vida de 400 a 500, de 5 en 5 (20 frutas).

### El evento lunar

El final del juego ya no es viajar a la Luna: es que la Luna venga a por ti.

```
Golem derrotado
  └─ 1% por bicho de la Mazmorra ──> Cultista Lunático (jefe inminente, no se invoca)
        └─ al morir, se abren los 4 PILARES como zonas temporales
              └─ 1000 bichos en cada uno bajan su escudo
                    └─ el pilar se rompe a golpes y NO devuelve daño
                          └─ los 4 caídos ──> cuenta atrás de 60 s
                                └─ baja el SEÑOR DE LA LUNA, y de esa no se huye
                                      └─ al morir, se abre la Luna
```

- El **Cultista Lunático** aparece farmeando la Mazmorra después de Golem, al 1% por muerte.
  Sale un aviso pegado a la cabecera que no se va hasta que lo resuelves: eso es lo que
  significa "inminente".
- Los **cuatro pilares** son zonas de evento: no salen en el selector fuera del evento, no
  tienen nodos (todo lo que aparece cuenta para el escudo) y su contador se ve tanto en el
  aviso como dentro de la zona.
- Con los cuatro caídos arranca una **cuenta atrás** en la que se puede cambiar de equipo y
  beber, y al llegar a cero la pelea empieza sola. **No hay botón de huir**, y si te mata **el
  evento se cierra entero**: hay que volver a buscar al Cultista y volver a tirar los cuatro
  pilares.
- Eso es soportable porque **cada pilar suelta 20-30 de luminita**, o sea entre 20 y 30 lingotes
  antes de la pelea. Lo que se pierde al morir es el tiempo del evento, no el material: la
  siguiente intentona se hace con armadura del último tier.
- Los pilares sueltan además los **cuatro fragmentos celestiales**: con ellos y la luminita se
  abre el tier del postgame en el manipulador antiguo (los cuatro picos de potencia 225, los
  cuatro conjuntos de armadura, once armas y el **Cenit**, que pide diez espadas y es lo último
  que queda por hacer).
- La **Luna** se abre al matarlo y es la zona de farmeo final: luminita y los cuatro
  fragmentos, para rematar un conjunto sin repetir el evento entero.
- El **Sello celestial** (20 de cada fragmento) sirve para repetir la pelea, como en Terraria.

### Las invasiones

Cinco eventos que no dependen de ninguna zona: mientras uno está activo, la oleada sustituye la
fauna del bioma en el que estés, así que el mundo entero está invadido y no hace falta mudarse.

| Evento | Se abre con | Oleadas | Jefe | Para qué sirve |
| --- | --- | --- | --- | --- |
| Ejército de duendes | Ojo de Cthulhu | 3 · 180 bichos | — | tela andrajosa, armas de llama sombría, alas de arpía |
| Legión de escarcha | Muro de Carne | 3 · 210 bichos | — | báculo de ventisca y almas de luz |
| Eclipse solar | el Destructor | 3 · 240 bichos | Mothron | **la única fuente de espadas de héroe rotas**, que es lo que gatea la Terra Blade |
| Luna de escarcha | Plantera | 4 · 400 bichos | Reina de Hielo | el equipo navideño y ectoplasma a puñados |
| Locura marciana | Golem | 4 · 400 bichos | Platillo marciano | el mejor equipo antes de la luminita |

El botín de cada evento sale de donde saldría en Terraria: el eclipse da espadas de héroe rotas
y fragmentos de tableta solar, la Navidad da **regalos** (que se abren y son monedas), y el
**ectoplasma** sale de la Mazmorra de Hardmode y de ningún otro sitio, que es lo que obliga a
bajar allí para volver a fabricar el Regalo travieso. Las alas de arpía se las quitas a un
wyvern del Sagrado, no te las regala un ejército de duendes.

Cada oleada sube la vida de sus bichos (×1, ×1,4, ×1,8...), así que la cuarta no es la primera
repetida. La primera vez el evento **llega solo y sale gratis**; a partir de ahí hace falta su
objeto (estandarte, bola de nieve, tableta solar, regalo travieso, sonda marciana), y cada uno
se fabrica con lo que suelta su propio evento: farmearlos se retroalimenta.

### Rasgos

Lo que fabricas puede salir con un **rasgo** (los prefijos de Terraria): Legendario, Irreal,
Despiadado, Veloz, Protector, Amenazante... y también malos, como Roto o Pésimo. La
probabilidad es baja a propósito (**8%**), y solo lo llevan **armas, herramientas y
accesorios**: las armaduras no. Reforjar (volver a tirar el dado pagando un tercio del valor de
venta) es cosa del **Inventor duende**, como en Terraria: no basta con tener el taller, hay que
tenerlo a él viviendo en el pueblo.

Su taller se abre desde su ficha del pueblo y enseña **la probabilidad real de cada rasgo y lo
que hace cada uno** («4,5% Legendario — +15% daño por click, +8% suerte»), más las tiradas
medias y el coste esperado. Hay **auto-reforjar**: se elige el objetivo —un rasgo concreto o
«cualquiera que no sea malo»— y tira hasta que sale, se acaba el dinero o se agotan los 250
intentos de la pulsación.

Los rasgos son multiplicadores sobre las estadísticas que ya tiene la pieza, así que escalan
solos: un Legendario en una espada de luminita vale mucho más que en una de cobre.

### Biomas y materiales

La fauna va por bioma, sin mezclas: las hormigas león son del desierto, los devoraplantas de
la jungla y las medusas del océano. Los enemigos no piden herramienta (escalan por vida); los
nodos sí, y por eso un bloque que tu pico no alcanza directamente no aparece.

El Subsuelo tiene los materiales básicos — tierra, piedra y los cuatro metales de primer
nivel (cobre/estaño, hierro/plomo) — y las Cavernas casi nada de eso y en cambio plata,
tungsteno, oro, platino, las gemas grandes y los cristales de vida.

Los cuatro **metales alternativos** de Terraria (estaño, plomo, tungsteno, platino) conviven
con los normales en las mismas vetas, con su propia rama de barras, picos, hachas, espadas y
armaduras. El yunque de plomo vale exactamente igual que el de hierro.

## Comodidad

El **autoclicker está siempre encendido**: 20 clicks por segundo sobre el objetivo de la zona,
sin interruptor que lo apague. Veinte es lo que da un humano insistente con un ratón bueno, así
que no rompe el balance: lo que se ahorra es la mano. Tus clicks suman encima de los suyos, y los
dos cuentan en las estadísticas y en los logros de clicks. Se dice en la ficha del personaje
(fila **Auto**) para que nadie se pregunte de dónde sale el daño que cae sin tocar nada.

En **Ajustes → Automático** queda un interruptor, apagado por defecto:

- **Autocombate en bossfights**: pega solo al jefe y bebe la mejor poción curativa que lleves
  cuando la vida baja del 45%. Sigue siendo opcional a propósito, porque ahí lo automático no
  solo pega: también se gasta tus pociones, y perder contra el Señor de la Luna repite el evento
  entero.

Y en **Ajustes → Interfaz** se pueden apagar las animaciones de los modales, que también se
desactivan solas con `prefers-reduced-motion`.

## Diseño

`PRODUCT.md` recoge la verdad de producto (usuarios, propósito, restricciones, principios) y
`DESIGN.md` el sistema visual tal y como quedó construido. El contrato de la dirección visual
vive como comentario HTML al principio de `<body>` en `index.html` y sobrevive al build, así que
se puede auditar contra lo que se sirve.

## Estructura

```
scripts/
  asset-manifest.json      lista de sprites a descargar, por categoría
  scrape-assets.mjs        scraper de terraria.wiki.gg
public/assets/<categoria>/ sprites y fondos descargados (png/gif/jpg)
src/
  assets/generated/        assetIndex.ts, autogenerado por el scraper
  modules/                 toda la lógica de juego, sin React
    App.ts                 singleton global (App.game), como en pokeclicker
    Game.ts                orquestador: bucle, autoguardado, acciones del jugador
    GameConstants.ts       constantes, enums y curvas de balance
    GameHelper.ts          utilidades (formato, aleatorios, sprites, cursores)
    GameEvents.ts          bus reactivo por canales, puente con React
    achievements/          Achievements.ts + AchievementList.ts
    assets/Preloader.ts    precarga de todos los sprites al arrancar
    battle/                Battle.ts: objetivo actual de la zona, daño y botín
    bosses/                Bosses.ts + BossList.ts: bossfights con fases
    combat/                EnemyList.ts
    crafting/              Crafting.ts, RecipeList.ts, RecipeFamily.ts (agrupado)
    events/                LunarEvent.ts + LunarStage.ts (cultista, pilares, cuenta atras)
                           Invasions.ts + InvasionList.ts (las cinco invasiones)
    npcs/                   Npcs.ts, NpcList.ts, GuideAdvice.ts (los consejos del Guia)
    gathering/             GatherNode.ts: bloques, árboles y vetas
    items/                 ItemList.ts, ItemType.ts, Inventory.ts, Prefixes.ts (rasgos),
                           ItemSources.ts (de donde sale cada objeto, para el catalogo)
    notifications/         Notifier.ts
    player/                Player.ts: equipo, vida, pociones y stats derivadas
    requirements/          Requirement.ts: requisitos con progreso
    save/                  Save.ts, SaveMigrations.ts, SaveTypes.ts
    statistics/            Statistics.ts
    wallet/                Wallet.ts
    zones/                 Zones.ts + ZoneList.ts
  components/              UI de React, una carpeta por pantalla
    world/                 WorldStage.tsx: el mundo a pantalla completa, siempre vivo
    hud/                   las placas que flotan encima (personaje, equipo, rail, dique)
    shared/Modal.tsx       modales apilables: todas las pantallas y sus submenus
    shared/Panel.tsx       dentro de un modal se queda sin marco: lo pone el modal
  hooks/useNarrow.ts       en movil el HUD se reorganiza, no se encoge
  hooks/useGame.ts         useGameChannel(): suscribe un componente a canales
  hooks/useUi.tsx          que pantalla esta abierta y buscador de fabricacion
  Root.tsx                 pantalla de carga hasta que los sprites están listos
  styles/game.css
```

Contenido actual: 20 zonas (16 fijas + los 4 pilares del evento), 474 objetos, 74 nodos, 132
enemigos, 20 jefes, 279 recetas, 25 vecinos, 5 invasiones y 62 logros, con 769 sprites, iconos
de logro y fondos de bioma.

Los iconos de la pantalla de logros son **las ilustraciones reales de los logros de Terraria**
(`public/assets/achievements`), no sprites de objetos: con sprites la pantalla parecía un
inventario descolocado y dos logros distintos podían llevar el mismo pico.

### Cómo hablan los módulos con React

La lógica no usa React. Cada módulo llama a `GameEvents.notify('canal')` cuando cambia algo,
y los componentes se suscriben con `useGameChannel(['battle', 'player'])`. Los avisos de un
mismo frame se agrupan, así que un tick que solo mueve la vida del objetivo no repinta el
inventario. Los módulos se hablan entre sí a través de `App.game`, que evita las
dependencias circulares que darían los imports directos entre controladores.

### Balance

Dos curvas en `GameConstants.ts` gobiernan las peleas:

- `DEFENSE_SOFTENING` (30): el daño recibido se multiplica por `30 / (30 + defensa)`. Una
  resta plana volvía inofensivos a los jefes en cuanto juntabas armadura; así la defensa
  siempre ayuda pero nunca anula el golpe.
- `POTION_COOLDOWN_MS` (7 s): espera común entre pociones curativas.
- `NO_MANA_DAMAGE_FACTOR` (0,25): lo que pega un arma mágica cuando te has quedado seco.
- `PILLAR_KILLS_REQUIRED` (1000) y `MOON_LORD_COUNTDOWN_MS` (60 s), en `events/LunarStage.ts`:
  el escudo de cada pilar y el margen de preparación antes del último jefe.
- `AUTO_CLICKS_PER_SECOND` (20), `AUTO_POTION_THRESHOLD` (0,45) y `AUTO_REFORGE_MAX_ATTEMPTS`
  (250): el autoclicker, cuándo bebe el autocombate y el tope de tiradas por pulsación.

Los **cristales de vida** (15 para llegar a 400 PV) aparecen en las seis zonas subterráneas,
no solo en Cavernas: con la distribución anterior llegabas al Muro de Carne con 7 y perdías
con el jefe al 2% de vida — el problema eran los cristales, no el jefe.

Están ajustadas para que cada jefe se pierda con el equipo de la etapa anterior y se gane con
el suyo: el Ojo de Cthulhu cae con hierro, el Devorador con armadura de sombra, y el Muro de
Carne exige armadura fundida.

## Añadir contenido

- **Un objeto**: añade su nombre de la wiki a `scripts/asset-manifest.json`, ejecuta
  `npm run assets`, y añade su `ItemDef` a `src/modules/items/ItemList.ts`. El `id` debe
  coincidir con el nombre del sprite: así `spriteUrl(id)` lo resuelve solo.
- **Un nodo o un enemigo**: entrada en `GatherNode.ts` / `EnemyList.ts` y referencia su id
  desde la zona en `ZoneList.ts`.
- **Una zona**: entrada en `ZoneList.ts` con sus `unlock` (ver los tipos de
  `requirements/Requirement.ts`).
- **Un jefe**: entrada en `BossList.ts` con sus fases y su objeto de invocación, más la
  receta de ese objeto en `RecipeList.ts`.
- **Un vecino**: añade su sprite a la categoría `npcs` del manifest, ejecuta `npm run assets` y
  añade su `NpcDef` a `src/modules/npcs/NpcList.ts` con su `arrival` (requisitos de llegada),
  su `bonus` y su `shop`. Los oficios (`roles`) los resuelve el panel; para uno nuevo hay que
  darle su sitio en `components/npcs/NpcsPanel.tsx`.
- **Una invasión**: entrada en `events/InvasionList.ts` con sus oleadas, su objeto disparador y
  su botín, más los bichos en `EnemyList.ts` y (si lleva jefe) su `BossDef` con
  `invasionId`. `Battle` recoge el pool de la oleada solo, no hay que tocarlo.
- **Un cambio en el formato del guardado**: sube `SAVE_VERSION` en `GameConstants.ts` y añade
  la migración en `save/SaveMigrations.ts`.

- **Una estación fija de bioma** (como el altar): añádela al array `stations` de la zona en
  `ZoneList.ts`. `Crafting.hasStation()` la da por disponible con haber visitado esa zona, y
  `stationHint()` le dice al jugador dónde encontrarla.

Quedan descargados y sin usar los sprites del Carmesí (`Crimtane_Ore`, `Tissue_Sample`,
`Vertebrae`, `Crimera`, `Brain_of_Cthulhu`...), listos para la zona alternativa a la
Corrupción, y `Defender_Medal` y `Goblin_Battle_Standard`, para cuando haya eventos de oleadas.

### Comprobar que no hay soft-locks

Al añadir contenido conviene rehacer el análisis de alcanzabilidad: partiendo del kit inicial,
propagar en punto fijo qué zonas se abren, qué jefes se pueden invocar y qué objetos se pueden
conseguir, hasta que deje de crecer. Debe cubrir el 100% de los objetos no decorativos. Así se
detectó que la Abeja Reina era imposible: su invocación pedía miel y cera que solo soltaba
ella misma.

`items/ItemSources.ts` hace la mitad barata de ese trabajo y se puede correr desde la consola
del navegador: dice de dónde sale cada objeto mirando nodos, enemigos, jefes, recetas y
tiendas, así que basta con buscar los que no salen de ningún sitio.

```js
const src = await import('/src/modules/items/ItemSources.ts')
const list = await import('/src/modules/items/ItemList.ts')
list.allItems().filter(i => !i.iconOnly && src.sourcesOf(i.id).length === 0).map(i => i.id)
// -> solo el equipo inicial (Copper_Shortsword, Copper_Pickaxe, Copper_Axe)
```

## El scraper

```bash
node scripts/scrape-assets.mjs                       # todo el manifest
node scripts/scrape-assets.mjs --only=enemies,bosses # solo esas categorías
node scripts/scrape-assets.mjs --force               # re-descarga lo que ya existe
node scripts/scrape-assets.mjs --category="Category:Item images" --dest=items --limit=500
```

Resuelve cada nombre contra la API de MediaWiki (probando `.png`, luego `.gif` y luego
`.jpg`, que es como vienen los fondos de bioma),
descarga a `public/assets/<categoría>/` y regenera `src/assets/generated/assetIndex.ts`
leyendo el disco. Avisa por consola de los nombres que no existen en la wiki. El último modo
permite volcar categorías enteras si algún día quieres *todos* los sprites.

## Guardado

Partida en `localStorage` (`terraclicker-save`), autoguardado cada 30 s y al cerrar la
pestaña. Desde **Ajustes** se puede exportar/importar en base64 y borrar la partida.

## Desarrollo

En modo dev el juego queda expuesto como `window.game`, útil para probar:

```js
game.inventory.gain('Hellstone_Bar', 50)
game.wallet.gain(100000)
game.travel('underworld')
game.bosses.summon('wall_of_flesh')

// El pueblo y los eventos
game.npcs.buildHouse()
game.npcs.autoMoveIn()
game.lunar.onEnemyDefeated('dungeon')   // tira el 1% del Cultista
game.lunar.tick(60000)                  // se salta la cuenta atras
game.invasions.start('solar_eclipse')
game.autoReforge('Terra_Blade', 'legendary')
game.tick(1000)                         // un segundo de bucle a mano
```

`game.tick()` es util para probar lo que depende del bucle (autoclicker, cuenta atras,
impuestos) sin esperar: con la pestana en segundo plano Chrome congela el `requestAnimationFrame`
y el juego no avanza.

---

Proyecto de fan sin ánimo de lucro. Terraria es propiedad de Re-Logic; los sprites vienen de
terraria.wiki.gg y pertenecen a sus autores.
