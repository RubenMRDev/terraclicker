import { useMemo, useState } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { useUi } from '../../hooks/useUi';
import { getItem } from '../../modules/items/ItemList';
import type { RecipeView } from '../../modules/crafting/Crafting';
import type { StationId } from '../../modules/crafting/RecipeList';
import { groupRecipes } from '../../modules/crafting/RecipeFamily';
import { statEntries, formatStat } from '../shared/itemStatFormat';
import { Panel } from '../shared/Panel';
import { Sprite } from '../shared/Sprite';

/** Quita acentos y pasa a minusculas, para que "estano" encuentre "estaño". */
const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/**
 * Ordena poniendo delante lo que se puede fabricar ahora mismo, luego lo que
 * solo espera materiales, y al final lo que ni siquiera tiene estacion.
 */
function byAvailability(a: RecipeView, b: RecipeView): number {
  const rank = (view: RecipeView) => (view.craftable > 0 ? 0 : view.missingStation ? 2 : 1);
  const diff = rank(a) - rank(b);
  if (diff !== 0) return diff;
  return getItem(a.recipe.output.itemId).name.localeCompare(getItem(b.recipe.output.itemId).name);
}

function RecipeCard({ view }: { view: RecipeView }) {
  const output = getItem(view.recipe.output.itemId);
  const hint = game().crafting.stationHint(view.recipe.station);
  const stats = statEntries(output.stats);
  return (
    <div className={`recipe${view.missingStation ? ' recipe--locked' : ''}`}>
      <div className="recipe__head">
        <Sprite name={view.recipe.output.itemId} size={34} />
        <div>
          <div className="recipe__name">{output.name}</div>
          <div className="faint">{output.description}</div>
        </div>
        {view.recipe.output.amount > 1 ? (
          <span className="recipe__out">x{view.recipe.output.amount}</span>
        ) : null}
      </div>

      {/* Las estadisticas reales, no la frase de sabor: "mucho DPS pasivo" no
          dice si son 200 o 2000, y es justo lo que hay que comparar. */}
      {stats.length > 0 ? (
        <div className="recipe__stats">
          {stats.map(([key, value]) => (
            <span key={key} className="detail__stat">
              {formatStat(key, value)}
            </span>
          ))}
        </div>
      ) : null}

      <div className="recipe__inputs">
        {view.inputs.map((input) => (
          <span
            key={input.itemId}
            className={`recipe__input${input.enough ? ' recipe__input--ok' : ''}`}
            title={getItem(input.itemId).name}
          >
            <Sprite name={input.itemId} size={16} />
            {input.owned}/{input.needed}
          </span>
        ))}
      </div>

      <div className="recipe__actions">
        <button
          className="btn btn--small btn--primary"
          disabled={view.craftable < 1}
          onClick={() => game().crafting.craft(view.recipe, 1)}
        >
          Fabricar
        </button>
        <button
          className="btn btn--small"
          disabled={view.craftable < 2}
          onClick={() => game().crafting.craftMax(view.recipe)}
        >
          Todo ({view.craftable})
        </button>
        {hint ? (
          <span className="faint" style={{ alignSelf: 'center' }}>
            {hint}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function CraftingPanel() {
  const g = useGameChannel(['inventory', 'crafting', 'npcs']);
  const groups = g.crafting.grouped();
  const [openStation, setOpenStation] = useState<string>('hand');
  const [onlyCraftable, setOnlyCraftable] = useState(false);
  // El buscador vive en el contexto de UI: asi "ir a fabricarlo" desde el
  // catalogo puede dejarlo escrito antes de que este panel se monte.
  const { craftSearch: search, setCraftSearch: setSearch } = useUi();

  const searching = search.trim().length > 0;

  // Buscando se ignoran las pestanas: se busca en TODO el recetario a la vez.
  const results = useMemo(() => {
    const all = groups.flatMap((group) => group.recipes);
    const term = normalize(search.trim());
    return all
      .filter((view) => {
        if (onlyCraftable && view.craftable < 1) return false;
        if (!term) return true;
        const output = getItem(view.recipe.output.itemId);
        const haystack = [
          output.name,
          output.id,
          output.description,
          ...view.inputs.map((input) => getItem(input.itemId).name),
        ].join(' ');
        return normalize(haystack).includes(term);
      })
      .sort(byAvailability);
  }, [groups, search, onlyCraftable]);

  const active = groups.find((group) => group.station === openStation) ?? groups[0];
  const listed = [...(active?.recipes ?? [])].filter(
    (view) => !onlyCraftable || view.craftable >= 1,
  );

  // Buscando o filtrando manda lo que puedes hacer; en la vista normal se
  // agrupa por conjunto de material, que es como busca la gente con la vista.
  const flat = searching || onlyCraftable;
  const families = flat
    ? []
    : groupRecipes(listed, (view) => view.recipe.output.itemId).map((group) => ({
        ...group,
        recipes: [...group.entries].sort(byAvailability),
      }));

  const visible = searching ? results : listed.sort(byAvailability);

  const craftableNow = groups.reduce(
    (total, group) => total + group.recipes.filter((view) => view.craftable > 0).length,
    0,
  );

  return (
    <Panel title="Fabricacion" aside={`${craftableNow} recetas listas ahora mismo`}>
      <div className="row row--wrap" style={{ marginBottom: 10 }}>
        <input
          className="search"
          type="search"
          value={search}
          placeholder="Buscar en todas las recetas..."
          onChange={(event) => setSearch(event.target.value)}
        />
        <label className="row" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={onlyCraftable}
            onChange={(event) => setOnlyCraftable(event.target.checked)}
          />
          Solo lo que puedo fabricar
        </label>
      </div>

      {searching ? (
        <p className="faint" style={{ marginBottom: 8 }}>
          {results.length} resultados en todo el recetario
          <button
            className="btn btn--small"
            style={{ marginLeft: 8 }}
            onClick={() => setSearch('')}
          >
            Limpiar
          </button>
        </p>
      ) : (
        <div className="tabs">
          {groups.map((group) => {
            const available = group.station === 'hand' || g.crafting.hasStation(group.station as StationId);
            const ready = group.recipes.filter((view) => view.craftable > 0).length;
            return (
              <button
                key={group.station}
                className={`tab${group.station === active?.station ? ' tab--active' : ''}`}
                onClick={() => setOpenStation(group.station)}
              >
                {group.label}
                {!available ? ' 🔒' : ready > 0 ? ` · ${ready}` : ''}
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="empty-state">
          {searching || onlyCraftable
            ? 'Ninguna receta coincide.'
            : 'Nada que fabricar aqui todavia.'}
        </p>
      ) : flat ? (
        <div className="grid grid--wide">
          {visible.map((view) => (
            <RecipeCard key={view.recipe.id} view={view} />
          ))}
        </div>
      ) : (
        families.map((family) => (
          <section key={family.id} className="family">
            <h3 className="family__title">
              {family.label}
              <span className="faint"> · {family.recipes.length}</span>
            </h3>
            <div className="grid grid--wide">
              {family.recipes.map((view) => (
                <RecipeCard key={view.recipe.id} view={view} />
              ))}
            </div>
          </section>
        ))
      )}
    </Panel>
  );
}
