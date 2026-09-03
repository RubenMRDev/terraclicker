import { useState } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import {
  EquipmentSlot,
  MAX_LIFE_CRYSTALS,
  MAX_LIFE_FRUITS,
  MAX_MANA_CRYSTALS,
} from '../../modules/GameConstants';
import { formatNumber } from '../../modules/GameHelper';
import { getItem } from '../../modules/items/ItemList';
import { getPrefix } from '../../modules/items/Prefixes';
import { Bar } from '../shared/Bar';
import { statSummary } from '../shared/itemStatFormat';
import { Panel } from '../shared/Panel';
import { Sprite } from '../shared/Sprite';

const SLOTS: Array<{ slot: EquipmentSlot; label: string }> = [
  { slot: EquipmentSlot.Weapon, label: 'Arma' },
  { slot: EquipmentSlot.Pickaxe, label: 'Pico' },
  { slot: EquipmentSlot.Axe, label: 'Hacha' },
  { slot: EquipmentSlot.Helmet, label: 'Casco' },
  { slot: EquipmentSlot.Chest, label: 'Peto' },
  { slot: EquipmentSlot.Legs, label: 'Piernas' },
  { slot: EquipmentSlot.Accessory1, label: 'Acces. 1' },
  { slot: EquipmentSlot.Accessory2, label: 'Acces. 2' },
  { slot: EquipmentSlot.Accessory3, label: 'Acces. 3' },
];

/**
 * Como se coloca el equipo en pantalla, imitando el inventario de Terraria: tres
 * columnas verticales, la armadura, lo que llevas en la mano y los accesorios.
 * Antes era una rejilla de 3x3 en la que el casco quedaba al lado del hacha y no
 * se leia como un conjunto.
 */
const COLUMNS: Array<{ label: string; slots: readonly EquipmentSlot[] }> = [
  {
    label: 'Armadura',
    slots: [EquipmentSlot.Helmet, EquipmentSlot.Chest, EquipmentSlot.Legs],
  },
  {
    label: 'En la mano',
    slots: [EquipmentSlot.Weapon, EquipmentSlot.Pickaxe, EquipmentSlot.Axe],
  },
  {
    label: 'Accesorios',
    slots: [EquipmentSlot.Accessory1, EquipmentSlot.Accessory2, EquipmentSlot.Accessory3],
  },
];

/** Un hueco de equipo. Pulsarlo abre el selector de ese slot. */
function EquipSlot({
  slot,
  active,
  onPick,
}: {
  slot: EquipmentSlot;
  active: boolean;
  onPick: (slot: EquipmentSlot | null) => void;
}) {
  const g = useGameChannel(['player', 'inventory']);
  const equipped = g.player.equippedIn(slot);
  const label = SLOTS.find((entry) => entry.slot === slot)?.label ?? '';
  const prefix = equipped ? getPrefix(g.inventory.prefixOf(equipped)) : undefined;

  return (
    <button
      className={`slot${equipped ? '' : ' slot--empty-usable'}${active ? ' slot--selected' : ''}${
        prefix ? (prefix.bad ? ' slot--bad' : ' slot--prefixed') : ''
      }`}
      title={
        equipped
          ? `${prefix ? `${prefix.name} ` : ''}${getItem(equipped).name} — click para cambiar`
          : label
      }
      onClick={() => onPick(active ? null : slot)}
    >
      {equipped ? <Sprite name={equipped} size={28} /> : <span className="slot__label">{label}</span>}
    </button>
  );
}

export function PlayerPanel() {
  const g = useGameChannel(['player', 'inventory', 'wallet', 'npcs']);
  const stats = g.player.stats;
  // Slot cuyo selector esta abierto. Antes un click en el slot desequipaba
  // directamente, que es justo lo que nadie quiere al ir a cambiarse de espada.
  const [pickerSlot, setPickerSlot] = useState<EquipmentSlot | null>(null);

  const candidates = pickerSlot ? g.player.candidatesFor(pickerSlot) : [];
  const equippedInPicker = pickerSlot ? g.player.equippedIn(pickerSlot) : undefined;
  const pickerLabel = SLOTS.find((entry) => entry.slot === pickerSlot)?.label ?? '';

  return (
    <>
      <Panel title="Personaje">
        <Bar
          value={g.player.health}
          max={g.player.maxHealth}
          variant="health"
          label={`${Math.ceil(g.player.health)} / ${g.player.maxHealth} PV`}
        />
        {/* La barra de mana solo aparece si el jugador ya juega con magia. */}
        {g.player.maxMana > 20 || stats.manaCost > 0 ? (
          <div style={{ marginTop: 5 }}>
            <Bar
              value={g.player.mana}
              max={g.player.maxMana}
              variant="mana"
              label={`${Math.floor(g.player.mana)} / ${g.player.maxMana} mana`}
            />
          </div>
        ) : null}
        <div className="stats-list" style={{ marginTop: 10 }}>
          <div className="stats-list__row">
            <span>Dano por click</span>
            <b>{formatNumber(stats.clickDamage)}</b>
          </div>
          <div className="stats-list__row">
            <span>DPS pasivo</span>
            <b>{formatNumber(stats.autoDps)}</b>
          </div>
          <div className="stats-list__row">
            <span>Potencia de pico</span>
            <b>{stats.pickPower}</b>
          </div>
          <div className="stats-list__row">
            <span>Potencia de hacha</span>
            <b>{stats.axePower}</b>
          </div>
          <div className="stats-list__row">
            <span>Defensa</span>
            <b>{stats.defense}</b>
          </div>
          <div className="stats-list__row">
            <span>Suerte</span>
            <b>+{Math.round(stats.luck * 100)}%</b>
          </div>
          <div className="stats-list__row">
            <span>Monedas extra</span>
            <b>+{Math.round(stats.coinBonus * 100)}%</b>
          </div>
          {stats.manaCost > 0 ? (
            <div className="stats-list__row">
              <span>Mana por golpe</span>
              <b>{stats.manaCost}</b>
            </div>
          ) : null}
          {g.npcs.housedCount > 0 ? (
            <div className="stats-list__row">
              <span>Vecinos en el pueblo</span>
              <b>{g.npcs.housedCount}</b>
            </div>
          ) : null}
          <div className="stats-list__row">
            <span>Cristales de vida</span>
            <b>
              {g.player.lifeCrystals}/{MAX_LIFE_CRYSTALS}
            </b>
          </div>
          {g.player.lifeFruits > 0 || g.player.lifeCrystals >= MAX_LIFE_CRYSTALS ? (
            <div className="stats-list__row">
              <span>Frutas de vida</span>
              <b>
                {g.player.lifeFruits}/{MAX_LIFE_FRUITS}
              </b>
            </div>
          ) : null}
          <div className="stats-list__row">
            <span>Cristales de mana</span>
            <b>
              {g.player.manaCrystals}/{MAX_MANA_CRYSTALS}
            </b>
          </div>
        </div>
      </Panel>

      <Panel title="Equipo" aside="click para cambiar">
        <div className="equipment">
          {COLUMNS.map((column) => (
            <div key={column.label} className="equipment__column">
              <div className="faint equipment__label">{column.label}</div>
              {column.slots.map((slot) => (
                <EquipSlot
                  key={slot}
                  slot={slot}
                  active={pickerSlot === slot}
                  onPick={setPickerSlot}
                />
              ))}
            </div>
          ))}
        </div>

        {pickerSlot ? (
          <div className="picker">
            <div className="picker__head">
              <span>{pickerLabel}</span>
              <button className="btn btn--small" onClick={() => setPickerSlot(null)}>
                Cerrar
              </button>
            </div>

            {candidates.length === 0 ? (
              <p className="faint">No tienes nada que puedas poner aqui todavia.</p>
            ) : (
              <div className="picker__list">
                {candidates.map((id) => {
                  const item = getItem(id);
                  const prefix = getPrefix(g.inventory.prefixOf(id));
                  const active = equippedInPicker === id;
                  return (
                    <button
                      key={id}
                      className={`picker__item${active ? ' picker__item--active' : ''}`}
                      onClick={() => {
                        game().equip(id, pickerSlot);
                        setPickerSlot(null);
                      }}
                      disabled={active}
                    >
                      <Sprite name={id} size={24} />
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

            {equippedInPicker ? (
              <button
                className="btn btn--small btn--danger btn--block"
                onClick={() => {
                  game().unequip(pickerSlot);
                  setPickerSlot(null);
                }}
              >
                Quitar {getItem(equippedInPicker).name}
              </button>
            ) : null}
          </div>
        ) : null}
      </Panel>
    </>
  );
}
