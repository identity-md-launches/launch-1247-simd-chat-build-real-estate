import { useEffect, useState, useRef } from "react";
import type { FormEvent } from "react";
import { Icon } from "./components/Icon";
import type { IconName } from "./components/Icon";
import { PropertyCard } from "./components/PropertyCard";
import { PropertyDialog } from "./components/PropertyDialog";
import { ContactForm } from "./components/ContactForm";
import {
  properties,
  emptyFilters,
  filterProperties,
  imageUrl,
} from "./properties";
import type { Filters, Property, PropertyType } from "./properties";
import { siteConfig } from "./site-config";

const navigation = [
  { id: "anasayfa", label: "Ana sayfa" },
  { id: "portfoy", label: "Portföy" },
  { id: "hizmetler", label: "Hizmetlerimiz" },
  { id: "hakkimizda", label: "Hakkımızda" },
];
const services: {
  number: string;
  icon: IconName;
  title: string;
  description: string;
  interest: string;
}[] = [
  {
    number: "01",
    icon: "home",
    title: "Alım & satım",
    description:
      "İhtiyacınızı anlayan bir bakışla, doğru mülkü doğru koşullarda buluşturuyoruz.",
    interest: "Gayrimenkul alım ve satım",
  },
  {
    number: "02",
    icon: "key",
    title: "Kiralama danışmanlığı",
    description:
      "Yeni bir başlangıç için, beklentilerinize ve yaşamınıza uygun alanları keşfediyoruz.",
    interest: "Kiralama danışmanlığı",
  },
  {
    number: "03",
    icon: "chart",
    title: "Yatırım danışmanlığı",
    description:
      "Bölge, kullanım ve bütçe önceliklerinizi birlikte değerlendirerek seçenekleri netleştiriyoruz.",
    interest: "Yatırım danışmanlığı",
  },
];
function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`logo${footer ? " logo-footer" : ""}`}
      href="#anasayfa"
      aria-label="24 GYO ana sayfa"
    >
      <span className="logo-number">
        24
        <span className="logo-square" />
      </span>
      <span className="logo-name">
        GYO<span>Gayrimenkul</span>
      </span>
    </a>
  );
}
function loadFavorites(): string[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("24gyo-favorites") || "[]",
    );
    return Array.isArray(value)
      ? value.filter(
          (item): item is string =>
            typeof item === "string" && properties.some((p) => p.id === item),
        )
      : [];
  } catch {
    return [];
  }
}
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("anasayfa");
  const [draftFilters, setDraftFilters] = useState<Filters>(emptyFilters);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [expanded, setExpanded] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);
  const [onlySaved, setOnlySaved] = useState(false);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Property | null>(null);
  const [interest, setInterest] = useState("Genel bilgi");
  const menuButton = useRef<HTMLButtonElement>(null);
  const filtered = filterProperties(
    properties,
    filters,
    onlySaved ? favorites : undefined,
  );
  const shown =
    expanded || onlySaved || Object.values(filters).some(Boolean)
      ? filtered
      : filtered.slice(0, 3);
  const hasFilters = Object.values(filters).some(Boolean) || onlySaved;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (menuOpen)
      document.querySelector<HTMLAnchorElement>(".main-nav a")?.focus();
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [menuOpen]);
  function save(id: string) {
    const saved = favorites.includes(id);
    const next = saved
      ? favorites.filter((value) => value !== id)
      : [...favorites, id];
    setFavorites(next);
    if (saved && onlySaved)
      requestAnimationFrame(() =>
        document.querySelector<HTMLButtonElement>(".favorites-filter")?.focus(),
      );
    try {
      localStorage.setItem("24gyo-favorites", JSON.stringify(next));
      setStatus(
        saved ? "Mülk favorilerden çıkarıldı." : "Mülk favorilere eklendi.",
      );
    } catch {
      setStatus(
        "Favoriler bu oturum için güncellendi. Tarayıcınız kalıcı kayda izin vermiyor.",
      );
    }
  }
  function showPortfolio() {
    requestAnimationFrame(() => {
      document
        .getElementById("portfolio-heading")
        ?.focus({ preventScroll: true });
      document.getElementById("portfoy")?.scrollIntoView({ behavior: "auto" });
    });
  }
  function search(event: FormEvent) {
    event.preventDefault();
    setFilters(draftFilters);
    setOnlySaved(false);
    setExpanded(true);
    showPortfolio();
  }
  function reset() {
    setFilters(emptyFilters);
    setDraftFilters(emptyFilters);
    setOnlySaved(false);
    setExpanded(true);
  }
  function contact(topic: string) {
    setInterest(topic);
    setSelected(null);
    requestAnimationFrame(() => {
      document.getElementById("iletisim")?.scrollIntoView({ behavior: "auto" });
      document.getElementById("contact-name")?.focus({ preventScroll: true });
    });
  }
  return (
    <>
      <a className="skip-link" href="#icerik">
        İçeriğe geç
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav
            aria-label="Ana menü"
            className={menuOpen ? "main-nav is-open" : "main-nav"}
            id="main-nav"
          >
            {navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              className="mobile-contact"
              href="#iletisim"
              onClick={() => setMenuOpen(false)}
            >
              İletişim
            </a>
          </nav>
          <a className="header-contact" href="#iletisim">
            Birlikte konuşalım <Icon name="arrow-up" size={17} />
          </a>
          <button
            ref={menuButton}
            className="menu-button icon-button"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </header>
      <main id="icerik">
        <section className="hero" id="anasayfa" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src={imageUrl("hero.webp")}
            alt=""
            width="1920"
            height="1274"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                <span /> Yaşama değer katan adresler
              </p>
              <h1 id="hero-title">
                İyi bir yaşam,
                <br />
                doğru bir
                <br />
                <span>adresle başlar.</span>
              </h1>
              <p className="hero-description">
                Hayalinizdeki yaşam alanını keşfedin.
                <br />
                Bir sonraki adımınızda 24 GYO yanınızda.
              </p>
              <a className="hero-link" href="#portfoy">
                Yaşam alanlarını keşfet{" "}
                <span>
                  <Icon name="arrow-up" size={20} />
                </span>
              </a>
            </div>
            <div className="hero-caption">
              <span className="caption-mark">24</span>
              <p>
                İyi düşünülmüş mekânlar.
                <br />
                <strong>Değerli yarınlar.</strong>
              </p>
            </div>
            <div className="hero-photo-note">Temsili mimari görsel</div>
          </div>
        </section>
        <div className="container search-container">
          <form
            className="property-search"
            onSubmit={search}
            aria-label="Gayrimenkul ara"
          >
            <div className="search-top">
              <fieldset className="listing-options">
                <legend className="sr-only">İlan durumu</legend>
                {(["", "Satılık", "Kiralık"] as const).map((value) => (
                  <label
                    key={value}
                    className={
                      draftFilters.listing === value ? "is-selected" : ""
                    }
                  >
                    <input
                      type="radio"
                      name="listing"
                      value={value}
                      checked={draftFilters.listing === value}
                      onChange={() =>
                        setDraftFilters((previous) => ({
                          ...previous,
                          listing: value,
                          budget: "",
                        }))
                      }
                    />
                    {value || "Tüm ilanlar"}
                  </label>
                ))}
              </fieldset>
              <p>Yeni hikâyeniz nerede başlasın?</p>
            </div>
            <div className="search-fields">
              <div className="search-field">
                <Icon name="pin" />
                <div>
                  <label htmlFor="search-city">Konum</label>
                  <div className="select-wrap">
                    <select
                      id="search-city"
                      value={draftFilters.city}
                      onChange={(e) =>
                        setDraftFilters((previous) => ({
                          ...previous,
                          city: e.target.value,
                        }))
                      }
                    >
                      <option value="">Tüm konumlar</option>
                      <option>İstanbul</option>
                      <option>Muğla</option>
                      <option>Ankara</option>
                    </select>
                    <Icon name="chevron" size={15} />
                  </div>
                </div>
              </div>
              <div className="search-field">
                <Icon name="building" />
                <div>
                  <label htmlFor="search-type">Gayrimenkul türü</label>
                  <div className="select-wrap">
                    <select
                      id="search-type"
                      value={draftFilters.type}
                      onChange={(e) =>
                        setDraftFilters((previous) => ({
                          ...previous,
                          type: e.target.value as PropertyType | "",
                        }))
                      }
                    >
                      <option value="">Tüm gayrimenkuller</option>
                      <option>Konut</option>
                      <option>Villa</option>
                      <option>Ticari</option>
                    </select>
                    <Icon name="chevron" size={15} />
                  </div>
                </div>
              </div>
              <div className="search-field budget-field">
                <span className="currency-icon" aria-hidden="true">
                  ₺
                </span>
                <div>
                  <label htmlFor="search-budget">
                    Bütçe {draftFilters.listing === "Kiralık" ? "(aylık)" : ""}
                  </label>
                  <div className="select-wrap">
                    <select
                      id="search-budget"
                      value={draftFilters.budget}
                      onChange={(e) =>
                        setDraftFilters((previous) => ({
                          ...previous,
                          budget: e.target.value,
                        }))
                      }
                    >
                      <option value="">Fiyat aralığı seçin</option>
                      {draftFilters.listing === "Kiralık" ? (
                        <>
                          <option value="50000">50.000 ₺’ye kadar</option>
                          <option value="75000">75.000 ₺’ye kadar</option>
                          <option value="100000">100.000 ₺’ye kadar</option>
                        </>
                      ) : (
                        <>
                          <option value="10000000">10 milyon ₺’ye kadar</option>
                          <option value="15000000">15 milyon ₺’ye kadar</option>
                          <option value="25000000">25 milyon ₺’ye kadar</option>
                        </>
                      )}
                    </select>
                    <Icon name="chevron" size={15} />
                  </div>
                </div>
              </div>
              <button
                className="button button-primary search-button"
                type="submit"
              >
                <Icon name="search" size={19} />
                Mülk bul <Icon name="arrow" size={19} />
              </button>
            </div>
          </form>
        </div>
        <section
          className="portfolio section-pad container"
          id="portfoy"
          aria-labelledby="portfolio-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Seçkin portföyümüz</p>
              <h2 id="portfolio-heading" tabIndex={-1}>
                {hasFilters
                  ? "Size uygun yaşam alanları."
                  : "Yeni bir başlangıç için."}
              </h2>
            </div>
            <button
              className="text-button portfolio-all"
              onClick={() => {
                reset();
                setStatus("Tüm portföy gösteriliyor.");
              }}
            >
              Tüm portföyü keşfet <Icon name="arrow-up" size={19} />
            </button>
          </div>
          <div className="portfolio-toolbar">
            <div
              className="property-categories"
              role="group"
              aria-label="Gayrimenkul türüne göre filtrele"
            >
              {(["", "Konut", "Villa", "Ticari"] as const).map((type) => (
                <button
                  key={type}
                  className={
                    filters.type === type ? "category is-active" : "category"
                  }
                  aria-pressed={filters.type === type}
                  onClick={() => {
                    setFilters((previous) => ({ ...previous, type }));
                    setDraftFilters((previous) => ({ ...previous, type }));
                    setExpanded(true);
                  }}
                >
                  {type || "Tümü"}
                  {type === "" && <span>{properties.length}</span>}
                </button>
              ))}
            </div>
            <button
              className={`favorites-filter${onlySaved ? " is-active" : ""}`}
              aria-pressed={onlySaved}
              onClick={() => {
                setOnlySaved((value) => !value);
                setExpanded(true);
              }}
            >
              <Icon name="heart" size={17} />
              Favoriler<span>{favorites.length}</span>
            </button>
          </div>
          <div className="results-line">
            <p role="status">
              {shown.length} mülk gösteriliyor
              {hasFilters &&
                ` · ${[filters.listing, filters.city, filters.type, filters.budget ? `En fazla ${Number(filters.budget).toLocaleString("tr-TR")} ₺` : "", onlySaved ? "Favoriler" : ""].filter(Boolean).join(" / ")}`}
            </p>
            {hasFilters && (
              <button className="reset-button" onClick={reset}>
                Filtreleri temizle <Icon name="close" size={14} />
              </button>
            )}
          </div>
          <div className="property-grid">
            {shown.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                saved={favorites.includes(p.id)}
                onSave={save}
                onOpen={setSelected}
              />
            ))}
          </div>
          {!shown.length && (
            <div className="empty-state">
              <Icon name={onlySaved ? "heart" : "search"} size={34} />
              <h3>
                {onlySaved
                  ? "Bu seçimde favori mülkünüz yok."
                  : "Bu kriterlerde bir mülk bulunamadı."}
              </h3>
              <p>
                {onlySaved
                  ? "Beğendiğiniz mülkleri kalp simgesiyle kaydedin veya filtreleri temizleyin."
                  : "Farklı bir konum, tür veya bütçe seçerek yeniden deneyebilirsiniz."}
              </p>
              <button className="button button-primary" onClick={reset}>
                Tüm mülkleri göster <Icon name="arrow" />
              </button>
            </div>
          )}
          <p className="portfolio-note">
            <span /> Örnek portföy. Görseller, konumlar ve fiyatlar temsilidir.
          </p>
        </section>
        <section
          className="services section-pad"
          id="hizmetler"
          aria-labelledby="services-heading"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Her adımda yanınızda</p>
                <h2 id="services-heading">
                  Gayrimenkulde güven,
                  <br />
                  her detayda özen.
                </h2>
              </div>
              <p className="section-intro">
                Bir mülkün ötesini görüyoruz. İhtiyaçlarınızı dinliyor, size
                uygun çözümleri birlikte şekillendiriyoruz.
              </p>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <div className="service-top">
                    <Icon name={service.icon} size={31} />
                    <span>{service.number}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <button
                    className="service-link"
                    onClick={() => contact(service.interest)}
                    aria-label={`${service.title} hakkında bilgi alın`}
                  >
                    Bilgi alın <Icon name="arrow-up" size={19} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          className="about section-pad container"
          id="hakkimizda"
          aria-labelledby="about-heading"
        >
          <div className="about-visual">
            <img
              src={imageUrl("about.webp")}
              alt="Ahşap detayların ve doğal ışığın buluştuğu ferah bir yaşam alanı"
              width="1000"
              height="1250"
              loading="lazy"
            />
            <div className="about-image-label">
              <span className="about-cross" aria-hidden="true">
                +
              </span>
              <p>
                Mekâna bakarız.
                <br />
                <strong>Hayatı görürüz.</strong>
              </p>
            </div>
          </div>
          <div className="about-copy">
            <p className="eyebrow">24 GYO’yu tanıyın</p>
            <h2 id="about-heading">
              Bugünün doğru kararı.
              <br />
              Yarının yaşam değeri.
            </h2>
            <p>
              Bizim için gayrimenkul; bir evden, bir ofisten ya da bir
              yatırımdan çok daha fazlası. İçinde hayatın geliştiği, yeni
              hikâyelerin başladığı bir alan.
            </p>
            <p>
              24 GYO olarak, ihtiyaçlarınızı merkeze alan ve her aşamada açık
              iletişime dayanan bir yaklaşım benimsiyoruz.
            </p>
            <div className="about-values">
              <div>
                <span>01 / Misyonumuz</span>
                <p>
                  Doğru bilgi ve özenli rehberlikle, size uygun gayrimenkule
                  ulaşmanızı kolaylaştırmak.
                </p>
              </div>
              <div>
                <span>02 / Vizyonumuz</span>
                <p>
                  Güvenin kalıcı olduğu, yaşam kalitesine değer katan bir
                  gayrimenkul anlayışı oluşturmak.
                </p>
              </div>
            </div>
            <a className="text-button" href="#iletisim">
              Birbirimizi tanıyalım <Icon name="arrow-up" size={20} />
            </a>
          </div>
        </section>
        <section
          className="contact section-pad"
          id="iletisim"
          aria-labelledby="contact-heading"
        >
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="eyebrow">Yeni bir adım atalım</p>
              <h2 id="contact-heading">
                Hayalinizdeki adresi
                <br />
                birlikte bulalım.
              </h2>
              <p>
                Bir sorunuz, bir planınız ya da sadece bir fikriniz mi var? Sizi
                dinlemeye hazırız.
              </p>
              <div className="contact-details">
                <div>
                  <Icon name="mail" size={22} />
                  <div>
                    <h3>E-posta</h3>
                    {siteConfig.email ? (
                      <a href={`mailto:${siteConfig.email}`}>
                        {siteConfig.email}
                      </a>
                    ) : (
                      <p>Yakında paylaşılacak</p>
                    )}
                  </div>
                </div>
                <div>
                  <Icon name="phone" size={22} />
                  <div>
                    <h3>Telefon</h3>
                    {siteConfig.phone ? (
                      <a
                        href={`tel:${siteConfig.phone.replace(/[\s()-]/g, "")}`}
                      >
                        {siteConfig.phone}
                      </a>
                    ) : (
                      <p>Yakında paylaşılacak</p>
                    )}
                  </div>
                </div>
                <div>
                  <Icon name="pin" size={22} />
                  <div>
                    <h3>Ofisimiz</h3>
                    <p>
                      {siteConfig.address ||
                        "Adres bilgisi yakında paylaşılacak"}
                    </p>
                    {siteConfig.officeHours && <p>{siteConfig.officeHours}</p>}
                  </div>
                </div>
              </div>
              <div className="contact-signoff">
                <span className="logo-number">24</span>
                <span>
                  Doğru yer.
                  <br />
                  Doğru başlangıç.
                </span>
              </div>
            </div>
            <ContactForm interest={interest} onInterestChange={setInterest} />
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <Logo footer />
              <p>Yaşama değer katan adresler.</p>
            </div>
            <nav aria-label="Alt menü">
              {navigation.slice(1).map((item) => (
                <a href={`#${item.id}`} key={item.id}>
                  {item.label}
                </a>
              ))}
              <a href="#iletisim">İletişim</a>
            </nav>
            <a
              className="back-top"
              href="#anasayfa"
              aria-label="Sayfanın başına dön"
            >
              <Icon name="arrow-up" size={22} />
            </a>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} 24 GYO. Tüm hakları saklıdır.</p>
            <p>Bu site örnek bir tanıtım çalışmasıdır.</p>
            <span>İyi yaşam, doğru adres.</span>
          </div>
        </div>
      </footer>
      <div className="sr-only" role="status">
        {status}
      </div>
      {selected && (
        <PropertyDialog
          property={selected}
          onClose={() => setSelected(null)}
          onEnquire={(p) => contact(`Mülk: ${p.name}`)}
        />
      )}
    </>
  );
}
