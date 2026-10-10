import { formatPrice, imageUrl } from "../properties";
import type { Property } from "../properties";
import { Icon } from "./Icon";

export function PropertyCard({
  property: p,
  saved,
  onSave,
  onOpen,
}: {
  property: Property;
  saved: boolean;
  onSave: (id: string) => void;
  onOpen: (p: Property) => void;
}) {
  return (
    <article className="property-card">
      <div className="property-media">
        <button
          className="property-photo"
          onClick={() => onOpen(p)}
          aria-label={`${p.name} detaylarını incele`}
        >
          <img
            src={imageUrl(p.image)}
            alt={p.imageAlt}
            width="960"
            height="640"
            loading="lazy"
          />
        </button>
        <span className="listing-badge">{p.listing}</span>
        <button
          className={`save-button icon-button${saved ? " is-saved" : ""}`}
          aria-label={`${p.name}: ${saved ? "favorilerden çıkar" : "favorilere ekle"}`}
          aria-pressed={saved}
          onClick={() => onSave(p.id)}
        >
          <Icon name="heart" size={18} />
        </button>
      </div>
      <div className="property-content">
        <p className="property-location">
          <Icon name="pin" size={14} /> {p.district}, {p.city}
          <span>{p.type}</span>
        </p>
        <h3>
          <button onClick={() => onOpen(p)}>{p.name}</button>
        </h3>
        <ul className="property-specs" aria-label="Gayrimenkul özellikleri">
          <li>
            <Icon name="area" size={17} />
            {p.area} m² <span className="sr-only">brüt alan</span>
          </li>
          <li>
            <Icon name="bed" size={17} />
            {p.rooms}
            <span className="sr-only"> oda</span>
          </li>
          <li>
            <Icon name="bath" size={17} />
            {p.bathrooms} banyo
          </li>
        </ul>
        <div className="property-bottom">
          <p className="price">
            {formatPrice(p.price)}
            {p.listing === "Kiralık" && <span> / ay</span>}
          </p>
          <button
            className="property-details"
            onClick={() => onOpen(p)}
            aria-label={`${p.name} ilanını incele`}
          >
            <span>İncele</span>
            <Icon name="arrow-up" size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
