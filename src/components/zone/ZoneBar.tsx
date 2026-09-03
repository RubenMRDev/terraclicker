import { useState } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { Requirements } from '../shared/Requirements';
import { Sprite } from '../shared/Sprite';

/**
 * Selector de zonas en horizontal. Sustituye a la lista lateral: con once zonas
 * aquella obligaba a hacer scroll cada vez que querias cambiar de bioma.
 * Los requisitos de una zona bloqueada se despliegan al pulsarla.
 *
 * Se pintan las zonas *visibles*: las de evento (los cuatro pilares) solo
 * aparecen mientras el evento las tiene abiertas, con su propio color.
 */
export function ZoneBar() {
  const g = useGameChannel(['zone', 'inventory', 'statistics', 'player', 'npcs', 'lunar']);
  const [openLocked, setOpenLocked] = useState<string | null>(null);

  const locked = openLocked ? g.zones.visible.find((zone) => zone.id === openLocked) : null;

  return (
    <div className="zonebar">
      <div className="zonebar__list">
        {g.zones.visible.map((zone) => {
          const unlocked = g.zones.isUnlocked(zone);
          const active = g.zones.current.id === zone.id;
          return (
            <button
              key={zone.id}
              className={`zonechip${active ? ' zonechip--active' : ''}${
                unlocked ? '' : ' zonechip--locked'
              }${zone.event ? ' zonechip--event' : ''}`}
              title={unlocked ? zone.description : 'Bloqueada — pulsa para ver que falta'}
              onClick={() => {
                if (unlocked) {
                  setOpenLocked(null);
                  game().travel(zone.id);
                } else {
                  setOpenLocked(openLocked === zone.id ? null : zone.id);
                }
              }}
            >
              <Sprite name={zone.icon} size={20} />
              {zone.name}
              {unlocked ? null : ' 🔒'}
            </button>
          );
        })}
      </div>

      {locked ? (
        <div className="zonebar__reqs">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <b>{locked.name}</b>
            <button className="btn btn--small" onClick={() => setOpenLocked(null)}>
              Cerrar
            </button>
          </div>
          <p className="faint" style={{ margin: '4px 0' }}>
            {locked.description}
          </p>
          <Requirements items={g.zones.requirements(locked)} />
        </div>
      ) : null}
    </div>
  );
}
