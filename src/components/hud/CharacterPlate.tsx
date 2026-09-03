import { useState } from 'react';
import { useGameChannel } from '../../hooks/useGame';
import { useNarrow } from '../../hooks/useNarrow';
import {
  AUTO_CLICKS_PER_SECOND,
  MAX_LIFE_CRYSTALS,
  MAX_LIFE_FRUITS,
  MAX_MANA_CRYSTALS,
} from '../../modules/GameConstants';
import { formatNumber } from '../../modules/GameHelper';
import { Modal } from '../shared/Modal';
import { Sprite } from '../shared/Sprite';

/**
 * La placa del personaje. En pantalla ancha esta entera y siempre a la vista:
 * el dano, la potencia de pico y la defensa son lo que decide si puedes con la
 * zona en la que estas, asi que no se esconden detras de un click.
 *
 * En movil no cabe entera sin scroll, asi que se queda lo que se mira mientras
 * se juega —las barras y cuatro cifras— y el resto se abre pulsandola. Nada
 * desaparece: cambia de sitio.
 */
export function CharacterPlate() {
  const g = useGameChannel(['player', 'inventory', 'npcs', 'settings']);
  const narrow = useNarrow();
  const [open, setOpen] = useState(false);
  const stats = g.player.stats;
  const showMana = g.player.maxMana > 20 || stats.manaCost > 0;

  const vitals = (
    <div className="vital">
      <div className="vital__bar vital__bar--hp">
        <div
          className="vital__fill"
          style={{ transform: `scaleX(${g.player.health / g.player.maxHealth})` }}
        />
        <span className="vital__text">
          {Math.ceil(g.player.health)} / {g.player.maxHealth}
        </span>
      </div>
      {showMana ? (
        <div className="vital__bar vital__bar--mana">
          <div
            className="vital__fill"
            style={{ transform: `scaleX(${g.player.mana / g.player.maxMana})` }}
          />
          <span className="vital__text">
            {Math.floor(g.player.mana)} / {g.player.maxMana}
          </span>
        </div>
      ) : null}
    </div>
  );

  const full = (
    <dl className="readout">
      <Stat icon="Copper_Broadsword" label="Dano" value={formatNumber(stats.clickDamage)} strong />
      <Stat icon="Drax" label="DPS" value={formatNumber(stats.autoDps)} strong />
      {/* Si el autoclicker esta picando, aqui se dice: si no, el jugador no sabe
          de donde sale el dano que cae sin que el toque nada. */}
      <Stat
        icon="Feral_Claws"
        label="Auto"
        value={
          g.save.settings.autoClick ? `${AUTO_CLICKS_PER_SECOND} clicks/s` : 'apagado'
        }
      />
      <Stat icon="Copper_Pickaxe" label="Pico" value={String(stats.pickPower)} />
      <Stat icon="Copper_Axe" label="Hacha" value={String(stats.axePower)} />
      <Stat icon="Iron_Chainmail" label="Defensa" value={String(stats.defense)} />
      <Stat icon="Diamond" label="Suerte" value={`${Math.round(stats.luck * 100)}%`} />
      <Stat icon="Gold_Coin" label="Monedas" value={`+${Math.round(stats.coinBonus * 100)}%`} />
      <Stat
        icon="Life_Crystal"
        label="Cristales"
        value={`${g.player.lifeCrystals}/${MAX_LIFE_CRYSTALS}`}
      />
      {g.player.lifeFruits > 0 || g.player.lifeCrystals >= MAX_LIFE_CRYSTALS ? (
        <Stat icon="Life_Fruit" label="Frutas" value={`${g.player.lifeFruits}/${MAX_LIFE_FRUITS}`} />
      ) : null}
      <Stat
        icon="Mana_Crystal"
        label="Mana"
        value={`${g.player.manaCrystals}/${MAX_MANA_CRYSTALS}`}
      />
      {g.npcs.housedCount > 0 ? (
        <Stat icon="Guide" label="Vecinos" value={String(g.npcs.housedCount)} />
      ) : null}
    </dl>
  );

  if (!narrow) {
    return (
      <div className="plate plate--char">
        {vitals}
        {full}
      </div>
    );
  }

  return (
    <>
      <button className="plate plate--char plate--compact" onClick={() => setOpen(true)}>
        {vitals}
        <div className="mini">
          <span className="mini__cell">
            <Sprite name="Copper_Broadsword" size={14} />
            <b>{formatNumber(stats.clickDamage)}</b>
          </span>
          <span className="mini__cell">
            <Sprite name="Drax" size={14} />
            <b>{formatNumber(stats.autoDps)}</b>
          </span>
          <span className="mini__cell">
            <Sprite name="Copper_Pickaxe" size={14} />
            <b>{stats.pickPower}</b>
          </span>
          <span className="mini__cell">
            <Sprite name="Iron_Chainmail" size={14} />
            <b>{stats.defense}</b>
          </span>
        </div>
      </button>

      {open ? (
        <Modal title="Personaje" onClose={() => setOpen(false)} width={420}>
          {full}
        </Modal>
      ) : null}
    </>
  );
}

function Stat({
  icon,
  label,
  value,
  strong,
}: {
  icon: string;
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`readout__row${strong ? ' readout__row--strong' : ''}`}>
      <dt>
        <Sprite name={icon} size={16} />
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
