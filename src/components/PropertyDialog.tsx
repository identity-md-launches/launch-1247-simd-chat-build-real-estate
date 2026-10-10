import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import type { Property } from "../properties";
import { formatPrice, imageUrl } from "../properties";
import { Icon } from "./Icon";

export function PropertyDialog({
  property: p,
  onClose,
  onEnquire,
}: {
  property: Property;
  onClose: () => void;
  onEnquire: (p: Property) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement;
    const dialog = ref.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      dialog?.close();
      trigger?.focus({ preventScroll: true });
    };
  }, []);
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = Array.from(
      ref.current?.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex="0"]',
      ) || [],
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
  return (
    <dialog
      ref={ref}
      className="property-dialog"
      aria-labelledby="property-dialog-title"
      onCancel={onClose}
      onKeyDown={trapFocus}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <div className="dialog-media">
          <img
            src={imageUrl(p.image)}
            alt={p.imageAlt}
            width="960"
            height="640"
          />
          <button
            autoFocus
            className="icon-button dialog-close"
            aria-label="İlan detaylarını kapat"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
          <span className="listing-badge">
            {p.listing} · {p.type}
          </span>
        </div>
        <div className="dialog-content">
          <p className="eyebrow">
            {p.district} / {p.city}
          </p>
          <h2 id="property-dialog-title">{p.name}</h2>
          <p className="dialog-price">
            {formatPrice(p.price)}
            {p.listing === "Kiralık" && <span> / ay</span>}
          </p>
          <ul className="dialog-specs">
            <li>
              <Icon name="area" />
              {p.area} m² brüt
            </li>
            <li>
              <Icon name="bed" />
              {p.rooms} oda
            </li>
            <li>
              <Icon name="bath" />
              {p.bathrooms} banyo
            </li>
          </ul>
          <p className="dialog-description">{p.description}</p>
          <ul className="amenities">
            {p.features.map((feature) => (
              <li key={feature}>
                <Icon name="check" size={17} />
                {feature}
              </li>
            ))}
          </ul>
          <p className="sample-note">
            Örnek portföy: görsel, konum ve fiyat temsilidir; satış veya
            kiralama teklifi değildir.
          </p>
          <button
            className="button button-primary"
            onClick={() => onEnquire(p)}
          >
            Bu mülk için talep oluştur <Icon name="arrow" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
