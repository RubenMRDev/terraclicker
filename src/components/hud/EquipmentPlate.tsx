import { useState } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { useNarrow } from '../../hooks/useNarrow';
import { EquipmentSlot } from '../../modules/GameConstants';
import { getItem } from '../../modules/items/ItemList';
import { getPrefix } from '../../modules/items/Prefixes';
import { Modal } from '../shared/Modal';
import { statSummary } from '../shared/itemStatFormat';
import { Sprite } from '../shared/Sprite';

/** Nombre corto para el hueco vacio: tiene que caber en 42 px y distinguirse. */
const SHORT: Record<EquipmentSlot, string> = {
  [EquipmentSlot.Weapon]: 'Arma',
  [EquipmentSlot.Pickaxe]: 'Pico',
  [EquipmentSlot.Axe]: 'Hacha',
  [EquipmentSlot.Helmet]: 'Casco',
  [EquipmentSlot.Chest]: 'Peto',
  [EquipmentSlot.Legs]: 'Piernas',
  [EquipmentSlot.Accessory1]: 'Acc. 1',
  [EquipmentSlot.Accessory2]: 'Acc. 2',
  [EquipmentSlot.Accessory3]: 'Acc. 3',
};

const LABEL: Record<EquipmentSlot, string> = {
  [EquipmentSlot.Weapon]: 'Arma',
  [EquipmentSlot.Pickaxe]: 'Pico',
  [EquipmentSlot.Axe]: 'Hacha',
  [EquipmentSlot.Helmet]: 'Casco',
  [EquipmentSlot.Chest]: 'Peto',
  [EquipmentSlot.Legs]: 'Piernas',
  [EquipmentSlot.Accessory1]: 'Acces. 1',
  [EquipmentSlot.Accessory2]: 'Acces. 2',
  [EquipmentSlot.Accessory3]: 'Acces. 3',
};

/**
 * El equipo en tres columnas verticales, como el inventario de Terraria:
 * armadura, lo que llevas en la mano y accesorios. Pulsar un hueco abre el
 * selector en un modal, con lo que aporta cada pieza escrito al lado.
 */
/** Las nueve piezas en orden de lectura, para la fila compacta de movil. */
const ALL_SLOTS: EquipmentSlot[] = [
  EquipmentSlot.Helmet,
  EquipmentSlot.Chest,
  EquipmentSlot.Legs,
  EquipmentSlot.Weapon,
  EquipmentSlot.Pickaxe,
  EquipmentSlot.Axe,
  EquipmentSlot.Accessory1,
  EquipmentSlot.Accessory2,
  EquipmentSlot.Accessory3,
];

const COLUMNS: Array<{ label: string; slots: EquipmentSlot[] }> = [
  {
    label: 'Armadura',
    slots: [EquipmentSlot.Helmet, EquipmentSlot.Chest, EquipmentSlot.Legs],
  },
  {
    label: 'Mano',
    slots: [EquipmentSlot.Weapon, EquipmentSlot.Pickaxe, EquipmentSlot.Axe],
  },
  {
    label: 'Accesorios',
    slots: [EquipmentSlot.Accessory1, EquipmentSlot.Accessory2, EquipmentSlot.Accessory3],
  },
];

export function EquipmentPlate() {
  const g = useGameChannel(['player', 'inventory']);
  const narrow = useNarrow();
  const [picking, setPicking] = useState<EquipmentSlot | null>(null);
  // En movil las nueve casillas se llevan 170 px de alto que hacen falta para
  // el mundo, asi que el equipo entero se abre pulsando un boton.
  const [open, setOpen] = useState(false);

  const candidates = picking ? g.player.candidatesFor(picking) : [];
  const equipped = picking ? g.player.equippedIn(picking) : undefined;

  const grid = (
    <div className="gear">
      {COLUMNS.map((column) => (
        <div key={column.label} className="gear__column">
            <div className="gear__label">{column.label}</div>
            {column.slots.map((slot) => {
              const item = g.player.equippedIn(slot);
              const prefix = item ? getPrefix(g.inventory.prefixOf(item)) : undefined;
              return (
                <button
                  key={slot}
                  className={`slot${item ? '' : ' slot--empty-usable'}${
                    prefix ? (prefix.bad ? ' slot--bad' : ' slot--prefixed') : ''
                  }`}
                  title={
                    item
                      ? `${prefix ? `${prefix.name} ` : ''}${getItem(item).name} — click para cambiar`
                      : LABEL[slot]
                  }
                  onClick={() => setPicking(slot)}
                >
                  {item ? (
                    <Sprite name={item} size={30} />
                  ) : (
                    <span className="slot__label">{SHORT[slot]}</span>
                  )}
                </button>
              );
            })}
          </div>
      ))}
    </div>
  );

  return (
    <>
      {narrow ? (
        <>
          <button className="chapa chapa--gear" onClick={() => setOpen(true)}>
            {ALL_SLOTS.map((slot) => {
              const item = g.player.equippedIn(slot);
              return item ? (
                <Sprite key={slot} name={item} size={20} title={getItem(item).name} />
              ) : (
                <span key={slot} className="gear__hole" title={LABEL[slot]} />
              );
            })}
          </button>
          {open ? (
            <Modal title="Equipo" onClose={() => setOpen(false)} width={420}>
              {grid}
            </Modal>
          ) : null}
        </>
      ) : (
        <div className="plate plate--gear">{grid}</div>
      )}

      {picking ? (
        <Modal
          title={LABEL[picking]}
          aside={`${candidates.length} en la mochila`}
          onClose={() => setPicking(null)}
          width={560}
        >
          {candidates.length === 0 ? (
            <p className="empty-state">No tienes nada que puedas poner aqui todavia.</p>
          ) : (
            <div className="picker__list">
              {candidates.map((id) => {
                const item = getItem(id);
                const prefix = getPrefix(g.inventory.prefixOf(id));
                const active = equipped === id;
                return (
                  <button
                    key={id}
                    className={`picker__item${active ? ' picker__item--active' : ''}`}
                    onClick={() => {
                      game().equip(id, picking);
                      setPicking(null);
                    }}
                    disabled={active}
                  >
                    <Sprite name={id} size={26} />
                    <span className="picker__item__body">
                      <span className="picker__item__name">
                        {prefix ? (
                          <span className={prefix.bad ? 'prefix prefix--bad' : 'prefix'}>
                            {prefix.name}{' '}
                          </span>
                        ) : null}
                        {item.name}
                      </span>
                      <span className="faint">{statSummary(g.player.statsOf(id))}</span>
                    </span>
                    {active ? <span className="faint">puesto</span> : null}
                  </button>
                );
              })}
            </div>
          )}

          {equipped ? (
            <button
              className="btn btn--danger btn--block"
              style={{ marginTop: 10 }}
              onClick={() => {
                game().unequip(picking);
                setPicking(null);
              }}
            >
              Quitar {getItem(equipped).name}
            </button>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
}
