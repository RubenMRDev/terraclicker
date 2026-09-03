import { useState } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import {
  AUTO_CLICKS_PER_SECOND,
  AUTO_POTION_THRESHOLD,
} from '../../modules/GameConstants';
import type { SettingsSave } from '../../modules/save/SaveTypes';
import { Panel } from '../shared/Panel';

/** Ajustes agrupados: primero lo que se ve, luego lo que juega por ti. */
const GROUPS: Array<{
  title: string;
  toggles: Array<{ key: keyof SettingsSave; label: string; hint: string }>;
}> = [
  {
    title: 'Interfaz',
    toggles: [
      {
        key: 'showDamageNumbers',
        label: 'Numeros de dano',
        hint: 'Muestra el dano flotante al golpear.',
      },
      {
        key: 'showLootFeed',
        label: 'Registro de botin',
        hint: 'Lista lo que va cayendo en la zona.',
      },
      {
        key: 'animations',
        label: 'Animaciones',
        hint: 'Los modales y los paneles entran deslizandose.',
      },
      {
        key: 'autoTravelOnUnlock',
        label: 'Viajar al desbloquear',
        hint: 'Te lleva a la zona nueva en cuanto se abre.',
      },
    ],
  },
  {
    title: 'Automatico',
    toggles: [
      {
        key: 'autoClick',
        label: `Autoclicker (${AUTO_CLICKS_PER_SECOND} por segundo)`,
        hint: 'Pica el objetivo de la zona solo. Los clicks cuentan en las estadisticas.',
      },
      {
        key: 'autoBattle',
        label: 'Autocombate en bossfights',
        hint: `Pega solo al jefe y bebe una pocion por debajo del ${Math.round(AUTO_POTION_THRESHOLD * 100)}% de vida.`,
      },
    ],
  },
];

export function SettingsPanel() {
  const g = useGameChannel(['settings', 'save']);
  const [exported, setExported] = useState('');
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <>
      {GROUPS.map((group) => (
        <Panel key={group.title} title={group.title}>
          <div className="col">
            {group.toggles.map((toggle) => (
              <label key={toggle.key} className="row toggle">
                <input
                  type="checkbox"
                  checked={g.save.settings[toggle.key]}
                  onChange={(event) => game().save.setSetting(toggle.key, event.target.checked)}
                />
                <span>
                  {toggle.label}
                  <span className="faint"> — {toggle.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </Panel>
      ))}

      <Panel title="Partida" aside={g.save.lastSavedAt ? 'guardado automatico cada 30s' : undefined}>
        <div className="col">
          <div className="row row--wrap">
            <button className="btn btn--small btn--primary" onClick={() => game().save.save()}>
              Guardar ahora
            </button>
            <button
              className="btn btn--small"
              onClick={() => {
                setExported(game().save.export());
                setMessage('Copia el texto para guardar tu partida.');
              }}
            >
              Exportar
            </button>
            <span className="faint">
              {g.save.lastSavedAt
                ? `Guardado a las ${new Date(g.save.lastSavedAt).toLocaleTimeString('es-ES')}`
                : 'Sin guardar todavia'}
            </span>
          </div>

          {exported ? (
            <textarea className="textarea" readOnly value={exported} onFocus={(e) => e.target.select()} />
          ) : null}

          <div className="col">
            <span className="faint">Importar una partida exportada:</span>
            <textarea
              className="textarea"
              value={importText}
              placeholder="Pega aqui el texto exportado"
              onChange={(event) => setImportText(event.target.value)}
            />
            <div>
              <button
                className="btn btn--small"
                disabled={importText.trim().length === 0}
                onClick={() => {
                  const error = game().save.import(importText);
                  setMessage(error ?? 'Partida importada.');
                  if (!error) setImportText('');
                }}
              >
                Importar
              </button>
            </div>
          </div>

          {message ? <p className="faint">{message}</p> : null}
        </div>
      </Panel>

      <Panel title="Zona peligrosa">
        {confirmReset ? (
          <div className="col">
            <p className="muted">Esto borra la partida entera. No hay vuelta atras.</p>
            <div className="row">
              <button className="btn btn--small btn--danger" onClick={() => game().hardReset()}>
                Si, borrar todo
              </button>
              <button className="btn btn--small" onClick={() => setConfirmReset(false)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn--small btn--danger" onClick={() => setConfirmReset(true)}>
            Empezar de cero
          </button>
        )}
      </Panel>
    </>
  );
}
