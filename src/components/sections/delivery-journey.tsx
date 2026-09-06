import { ArrowRight } from "lucide-react";
import type { TextItem } from "@/types/content";

export function DeliveryJourney({ route }: { route: TextItem[] }) {
  return (
    <figure className="delivery-journey">
      <figcaption className="journey-caption">
        <span>Путь вашего автомобиля</span>
        <span>Схема доставки</span>
      </figcaption>
      <svg
        className="journey-drawing"
        viewBox="0 0 1200 220"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="journey-contour"
          d="M0 170C180 170 235 15 470 15S825 198 1200 45M0 208C210 208 275 54 470 54S865 235 1200 94"
        />
        <path
          className="journey-track"
          d="M70 150C260 150 320 65 600 65S930 150 1130 150"
        />
        <path
          className="journey-track-accent"
          d="M70 150C260 150 320 65 600 65"
        />
        <path
          className="journey-guide"
          d="M70 166V220M600 81V220M1130 166V220"
        />
        {[
          { x: 70, y: 150 },
          { x: 600, y: 65 },
          { x: 1130, y: 150 },
        ].map(({ x, y }, i) => (
          <g key={x}>
            <circle className="journey-halo" cx={x} cy={y} r="24" />
            <circle className="journey-node" cx={x} cy={y} r="8" />
            <text x={x} y={y - 40} textAnchor="middle">
              0{i + 1}
            </text>
          </g>
        ))}
      </svg>
      <ol className="delivery-route">
        {route.map((item, i) => (
          <li key={item.title}>
            <div className="route-marker">
              <span />
              <i aria-hidden="true" />
              {i < route.length - 1 && (
                <ArrowRight size={20} aria-hidden="true" />
              )}
            </div>
            <span className="route-index">0{i + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
