import type { RequirementProgress } from '../../modules/requirements/Requirement';
import { Bar } from './Bar';

/** Lista de requisitos con su barra de progreso. */
export function Requirements({ items }: { items: RequirementProgress[] }) {
  if (items.length === 0) return null;
  return (
    <div className="reqs">
      {items.map((item, index) => (
        <div key={index} className={`req${item.met ? ' req--met' : ''}`}>
          <div className="req__head">
            <span>
              {item.met ? '✔ ' : ''}
              {item.label}
            </span>
            {item.target > 1 ? (
              <span>
                {Math.floor(item.current)}/{item.target}
              </span>
            ) : null}
          </div>
          {item.target > 1 && !item.met ? (
            <Bar value={item.current} max={item.target} slim variant="progress" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
