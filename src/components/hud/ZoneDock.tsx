import { useState } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { useNarrow } from '../../hooks/useNarrow';
import type { ZoneDef } from '../../modules/zones/ZoneList';
import { Modal } from '../shared/Modal';
import { Requirements } from '../shared/Requirements';
import { Sprite } from '../shared/Sprite';

/**
 * El dique de zonas, pegado al borde inferior del mundo. Cada ficha lleva el
 * sprite y el color de su bioma, y la activa se levanta.
 *
 * Una zona bloqueada no se esconde: se pulsa y abre lo que le falta. Esconderla
 * dejaria al jugador sin saber que hay mas mundo detras.
 *
 * En movil diecisiete fichas no caben en 400 px sin scroll, asi que el dique se
 * convierte en la ficha de la zona actual y las demas se abren pulsandola.
 */
export function ZoneDock() {
  const g = useGameChannel(['zone', 'inventory', 'statistics', 'player', 'npcs', 'lunar', 'boss']);
  const narrow = useNarrow();
  const [locked, setLocked] = useState<ZoneDef | null>(null);
  const [picker, setPicker] = useState(false);

  const chips = g.zones.visible.map((zone) => {
    const unlocked = g.zones.isUnlocked(zone);
    const active = g.zones.current.id === zone.id;
    return (
      <button
        key={zone.id}
        className={`chip${active ? ' chip--active' : ''}${unlocked ? '' : ' chip--locked'}${
          zone.event ? ' chip--event' : ''
        }`}
        style={{ '--chip': zone.accent } as React.CSSProperties}
        title={unlocked ? zone.description : 'Bloqueada: pulsa para ver que falta'}
        onClick={() => {
          if (!unlocked) {
            setLocked(zone);
            return;
          }
          game().travel(zone.id);
          setPicker(false);
        }}
      >
        <Sprite name={zone.icon} size={22} />
        <span className="chip__name">{zone.name}</span>
      </button>
    );
  });

  const current = g.zones.current;

  return (
    <>
      {narrow ? (
        <div className="dock dock--compact">
          <button
            className="chip chip--active"
            style={{ '--chip': current.accent } as React.CSSProperties}
            onClick={() => setPicker(true)}
          >
            <Sprite name={current.icon} size={22} />
            <span className="chip__name">{current.name}</span>
          </button>
          <span className="faint">
            {g.zones.visible.filter((zone) => g.zones.isUnlocked(zone)).length} zonas abiertas
          </span>
        </div>
      ) : (
        <div className="dock">{chips}</div>
      )}

      {picker ? (
        <Modal title="Viajar" aside="las zonas del mundo" onClose={() => setPicker(false)} width={520}>
          <div className="dock dock--modal">{chips}</div>
        </Modal>
      ) : null}

      {locked ? (
        <Modal
          title={locked.name}
          aside="bloqueada"
          icon={<Sprite name={locked.icon} size={26} />}
          onClose={() => setLocked(null)}
          width={520}
          level={1}
        >
          <p className="detail__desc" style={{ marginTop: 0 }}>
            {locked.description}
          </p>
          <div className="faint" style={{ margin: '8px 0 4px' }}>
            Para abrirla
          </div>
          <Requirements items={g.zones.requirements(locked)} />
        </Modal>
      ) : null}
    </>
  );
}
