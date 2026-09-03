import { useState } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { formatNumber } from '../../modules/GameHelper';
import { getItem } from '../../modules/items/ItemList';
import type { NpcDef } from '../../modules/npcs/NpcList';
import { statSummary } from '../shared/itemStatFormat';
import { Coins } from '../shared/Coins';
import { Modal } from '../shared/Modal';
import { Panel } from '../shared/Panel';
import { Requirements } from '../shared/Requirements';
import { Sprite } from '../shared/Sprite';
import { GuideCard } from './GuideCard';
import { NpcShop } from './NpcShop';
import { ReforgeCard } from './ReforgeCard';

/** Submenu abierto encima de la ficha de un vecino. */
type Submenu = 'shop' | 'reforge' | null;

/**
 * Frase de un vecino. Se elige por el id y no al azar: con Math.random() la
 * frase cambiaba en cada repintado, o sea veinte veces por segundo.
 */
function quoteOf(npc: { id: string; quotes: string[] }): string {
  let hash = 0;
  for (const char of npc.id) hash = (hash * 31 + char.charCodeAt(0)) % 9973;
  return npc.quotes[hash % npc.quotes.length];
}

/**
 * El pueblo. Construir una casa cuesta madera y muebles de madera; cada vecino
 * llega cuando cumple su condicion y aporta su bonificacion mientras viva ahi.
 *
 * Cada vecino se abre en un modal, y sus oficios (tienda, taller de reforjado)
 * en un submenu encima: desplegados dentro de la rejilla descolocaban el resto
 * de las tarjetas, y el taller del duende no cabia de ninguna manera.
 */
export function NpcsPanel() {
  const g = useGameChannel([
    'npcs',
    'inventory',
    'wallet',
    'player',
    'statistics',
    'zone',
    'boss',
    'settings',
  ]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [submenu, setSubmenu] = useState<Submenu>(null);

  const cost = g.npcs.houseCost();
  const views = g.npcs.views();
  const housed = views.filter((view) => view.housed);
  const ready = views.filter((view) => !view.housed && view.available);
  const locked = views.filter((view) => !view.housed && !view.available);
  const open = openId ? views.find((view) => view.npc.id === openId) : undefined;

  const closeAll = () => {
    setSubmenu(null);
    setOpenId(null);
  };

  return (
    <>
      <Panel
        title="Pueblo"
        aside={`${g.npcs.housedCount}/${views.length} vecinos · ${g.npcs.houses} casa${g.npcs.houses === 1 ? '' : 's'}`}
      >
        <div className="town">
          <div className="town__build">
            <Sprite name="Wooden_Door" size={38} />
            <div className="town__build__body">
              <div className="town__build__title">Construir la casa {g.npcs.houses + 1}</div>
              <div className="row row--wrap">
                {cost.map((entry) => {
                  const owned = g.inventory.count(entry.itemId);
                  return (
                    <span
                      key={entry.itemId}
                      className={`recipe__input${owned >= entry.amount ? ' recipe__input--ok' : ''}`}
                      title={getItem(entry.itemId).name}
                    >
                      <Sprite name={entry.itemId} size={16} />
                      {formatNumber(owned)}/{entry.amount}
                    </span>
                  );
                })}
              </div>
              <div className="faint">
                Cada casa cuesta 40 de madera mas que la anterior. Los muebles se hacen en la mesa
                de trabajo.
              </div>
            </div>
            <button
              className="btn btn--primary"
              disabled={!g.npcs.canBuildHouse()}
              onClick={() => game().npcs.buildHouse()}
            >
              Construir
            </button>
          </div>

          <div className="row row--wrap town__stats">
            <span className="topbar__stat">
              Casas libres <b>{g.npcs.freeHouses}</b>
            </span>
            {ready.length > 0 ? (
              <span className="topbar__stat">
                Esperando casa <b>{ready.length}</b>
              </span>
            ) : null}
            {g.npcs.taxRate > 0 ? (
              <span className="topbar__stat row">
                Impuestos <Coins amount={g.npcs.taxRate} size={13} /> /s
              </span>
            ) : null}
          </div>
        </div>

        <GuideCard />

        {g.npcs.hasRole('heal') ? (
          <div className="town__service">
            <Sprite name="Nurse" size={32} />
            <div className="town__build__body">
              <div className="town__build__title">Curarte del todo</div>
              <div className="faint">
                {g.player.health >= g.player.maxHealth
                  ? 'Estas al maximo. Vuelve cuando te hayan pegado.'
                  : 'No gasta la espera de las pociones.'}
              </div>
            </div>
            <span className="row faint">
              <Coins amount={g.npcs.healCost()} size={14} />
            </span>
            <button
              className="btn btn--small btn--primary"
              disabled={!g.npcs.canHeal()}
              onClick={() => game().npcs.heal()}
            >
              Curar
            </button>
          </div>
        ) : null}
      </Panel>

      <Panel title="Vecinos" aside={ready.length > 0 ? `${ready.length} sin casa` : 'pulsa uno'}>
        {g.npcs.houses === 0 ? (
          <p className="empty-state">
            Todavia no hay ni una casa. El Guia se muda a la primera que construyas.
          </p>
        ) : null}

        <div className="grid grid--npcs">
          {[...housed, ...ready, ...locked].map(({ npc, housed: isHome, available }) => (
            <button
              key={npc.id}
              className={`npc${isHome ? ' npc--home' : available ? ' npc--ready' : ' npc--locked'}`}
              onClick={() => {
                setSubmenu(null);
                setOpenId(npc.id);
              }}
            >
              <Sprite
                name={npc.sprite}
                size={44}
                className={isHome ? undefined : 'achievement__sprite--locked'}
              />
              <div className="npc__id">
                <div className="npc__name">{npc.name}</div>
                <div className="faint">{npc.title}</div>
              </div>
              <span className="npc__state">
                {isHome ? 'en el pueblo' : available ? 'sin casa' : 'no ha llegado'}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      {open ? (
        <Modal
          title={open.npc.name}
          aside={open.npc.title}
          icon={<Sprite name={open.npc.sprite} size={28} />}
          onClose={closeAll}
          width={620}
        >
          <NpcDetail
            npc={open.npc}
            housed={open.housed}
            available={open.available}
            onOpenSubmenu={setSubmenu}
          />
        </Modal>
      ) : null}

      {open && submenu === 'shop' ? (
        <Modal
          title={`Tienda de ${open.npc.name}`}
          icon={<Sprite name={open.npc.sprite} size={28} />}
          onClose={() => setSubmenu(null)}
          level={1}
          width={680}
        >
          <NpcShop npc={open.npc} />
        </Modal>
      ) : null}

      {open && submenu === 'reforge' ? (
        <Modal
          title="Taller del Inventor duende"
          aside="reforjar rasgos"
          icon={<Sprite name="Goblin_Tinkerer" size={28} />}
          onClose={() => setSubmenu(null)}
          level={1}
          width={780}
        >
          <ReforgeCard />
        </Modal>
      ) : null}
    </>
  );
}

/** Contenido del modal de un vecino: quien es, que aporta y que sabe hacer. */
function NpcDetail({
  npc,
  housed,
  available,
  onOpenSubmenu,
}: {
  npc: NpcDef;
  housed: boolean;
  available: boolean;
  onOpenSubmenu: (submenu: Submenu) => void;
}) {
  const g = useGameChannel(['npcs', 'inventory', 'wallet', 'statistics', 'zone', 'player']);
  const bonus = statSummary(npc.bonus);
  const requirements = g.npcs.views().find((view) => view.npc.id === npc.id)?.requirements ?? [];

  return (
    <div className="npc-detail">
      <p className="detail__desc" style={{ marginTop: 0 }}>
        {npc.description}
      </p>

      {bonus ? (
        <div className="row row--wrap">
          <span className="detail__stat">Mientras viva aqui: {bonus}</span>
        </div>
      ) : null}

      {housed && npc.quotes.length > 0 ? (
        <p className="npc__quote">&laquo;{quoteOf(npc)}&raquo;</p>
      ) : null}

      {!housed ? (
        <>
          {requirements.length > 0 ? <Requirements items={requirements} /> : null}
          <button
            className="btn btn--primary"
            disabled={!g.npcs.canMoveIn(npc.id)}
            onClick={() => game().npcs.moveIn(npc.id)}
          >
            {available
              ? g.npcs.freeHouses > 0
                ? 'Que se mude'
                : 'Hace falta una casa libre'
              : 'Todavia no llega'}
          </button>
        </>
      ) : (
        <div className="npc-detail__actions">
          {npc.roles.includes('reforge') ? (
            <button className="btn btn--primary" onClick={() => onOpenSubmenu('reforge')}>
              Abrir el taller
            </button>
          ) : null}
          {npc.roles.includes('shop') ? (
            <button className="btn btn--primary" onClick={() => onOpenSubmenu('shop')}>
              Ver la tienda ({g.npcs.stockOf(npc.id).length})
            </button>
          ) : null}
          {npc.roles.includes('heal') ? (
            <button className="btn" disabled={!g.npcs.canHeal()} onClick={() => game().npcs.heal()}>
              Curarme del todo
            </button>
          ) : null}
          {npc.roles.includes('tax') ? (
            <span className="row faint">
              Recauda <Coins amount={g.npcs.taxRate} size={14} /> por segundo con{' '}
              {g.npcs.housedCount} vecinos.
            </span>
          ) : null}
          {npc.roles.includes('guide') ? (
            <span className="faint">Sus consejos salen arriba, en el panel del pueblo.</span>
          ) : null}
          {npc.roles.includes('lore') ? (
            <span className="faint">No vende nada. Solo estaba de paso.</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
