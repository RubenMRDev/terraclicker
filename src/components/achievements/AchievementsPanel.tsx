import { useState } from 'react';
import { useGameChannel } from '../../hooks/useGame';
import {
  GROUP_LABEL,
  GROUP_ORDER,
  type AchievementGroup,
} from '../../modules/achievements/AchievementList';
import type { AchievementView } from '../../modules/achievements/Achievements';
import { Bar } from '../shared/Bar';
import { Coins } from '../shared/Coins';
import { Panel } from '../shared/Panel';
import { Sprite } from '../shared/Sprite';

const TIER_LABEL = { bronce: 'Bronce', plata: 'Plata', oro: 'Oro' } as const;

function AchievementCard({ view }: { view: AchievementView }) {
  const { achievement, progress, unlocked } = view;
  return (
    <div
      className={`achievement achievement--${achievement.tier}${unlocked ? ' achievement--done' : ''}`}
    >
      <div className="achievement__icon">
        <Sprite
          name={achievement.icon}
          size={38}
          className={unlocked ? undefined : 'achievement__sprite--locked'}
        />
      </div>
      <div className="achievement__body">
        <div className="achievement__name">
          {achievement.name}
          <span className="achievement__tier">{TIER_LABEL[achievement.tier]}</span>
        </div>
        <div className="achievement__desc">{achievement.description}</div>
        {unlocked ? (
          <div className="row faint" style={{ marginTop: 4 }}>
            Conseguido · <Coins amount={achievement.coins} size={13} />
          </div>
        ) : (
          <div style={{ marginTop: 5 }}>
            <Bar value={progress.current} max={progress.target} slim />
            <div className="faint">
              {Math.floor(progress.current)}/{progress.target} ·{' '}
              <Coins amount={achievement.coins} size={12} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Los logros, agrupados por tema y con el marco del color de su rareza. La
 * pestana "cerca" ordena por lo que te falta menos, que es lo que de verdad
 * quieres saber cuando abres esta pantalla.
 */
export function AchievementsPanel() {
  const g = useGameChannel(['achievements', 'statistics', 'inventory', 'player', 'wallet', 'npcs', 'zone', 'lunar']);
  const [filter, setFilter] = useState<'all' | 'close' | 'done'>('all');
  const views = g.achievements.views();

  if (filter === 'close') {
    const pending = views
      .filter((view) => !view.unlocked)
      // Por fraccion de progreso: lo que esta al 90% va delante de lo que esta a 0.
      .sort(
        (a, b) =>
          b.progress.current / Math.max(1, b.progress.target) -
          a.progress.current / Math.max(1, a.progress.target),
      );
    return (
      <Panel aside={`${g.achievements.completed}/${g.achievements.total}`}>
        <Filters filter={filter} onChange={setFilter} />
        <div className="grid grid--wide">
          {pending.map((view) => (
            <AchievementCard key={view.achievement.id} view={view} />
          ))}
        </div>
      </Panel>
    );
  }

  const listed = filter === 'done' ? views.filter((view) => view.unlocked) : views;
  const byGroup = new Map<AchievementGroup, AchievementView[]>();
  for (const view of listed) {
    const group = view.achievement.group;
    if (!byGroup.has(group)) byGroup.set(group, []);
    byGroup.get(group)!.push(view);
  }

  return (
    <Panel aside={`${g.achievements.completed}/${g.achievements.total}`}>
      <Filters filter={filter} onChange={setFilter} />

      {listed.length === 0 ? (
        <p className="empty-state">Todavia no has conseguido ninguno.</p>
      ) : (
        GROUP_ORDER.filter((group) => byGroup.has(group)).map((group) => {
          const entries = byGroup.get(group)!;
          const done = entries.filter((view) => view.unlocked).length;
          return (
            <section key={group} className="family">
              <h3 className="family__title">
                {GROUP_LABEL[group]}
                <span className="faint">
                  {' '}
                  · {done}/{entries.length}
                </span>
              </h3>
              <div className="grid grid--wide">
                {entries.map((view) => (
                  <AchievementCard key={view.achievement.id} view={view} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </Panel>
  );
}

function Filters({
  filter,
  onChange,
}: {
  filter: 'all' | 'close' | 'done';
  onChange: (next: 'all' | 'close' | 'done') => void;
}) {
  return (
    <div className="tabs">
      <button
        className={`tab${filter === 'all' ? ' tab--active' : ''}`}
        onClick={() => onChange('all')}
      >
        Todos
      </button>
      <button
        className={`tab${filter === 'close' ? ' tab--active' : ''}`}
        onClick={() => onChange('close')}
      >
        Los que tienes mas cerca
      </button>
      <button
        className={`tab${filter === 'done' ? ' tab--active' : ''}`}
        onClick={() => onChange('done')}
      >
        Conseguidos
      </button>
    </div>
  );
}
