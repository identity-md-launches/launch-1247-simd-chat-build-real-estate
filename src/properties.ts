export type PropertyType = "Konut" | "Villa" | "Ticari";
export type ListingType = "Satılık" | "Kiralık";
export interface Property {
  id: string;
  name: string;
  district: string;
  city: string;
  type: PropertyType;
  listing: ListingType;
  price: number;
  area: number;
  rooms: string;
  bathrooms: number;
  image: string;
  imageAlt: string;
  description: string;
  features: string[];
}

// Demonstration inventory, not verified company listings. Replace before live marketing.
export const properties: Property[] = [
  {
    id: "villa-01",
    name: "Doğanın içinde, hayatın merkezinde",
    district: "Beykoz",
    city: "İstanbul",
    type: "Villa",
    listing: "Satılık",
    price: 24500000,
    area: 320,
    rooms: "5+1",
    bathrooms: 3,
    image: "villa.webp",
    imageAlt: "Bahçesi ve yüzme havuzu olan çağdaş beyaz villa",
    description:
      "Geniş bahçesi, ferah yaşam alanları ve açık hava keyfini eve taşıyan terasıyla sakin bir yaşamı hayal edin. Bu örnek villa, doğayla iç içe bir yaşam arayanlar için hazırlanmıştır.",
    features: ["Müstakil bahçe", "Özel havuz", "Kapalı otopark", "Geniş teras"],
  },
  {
    id: "konut-01",
    name: "Şehrin ritmine yeni bir perspektif",
    district: "Kadıköy",
    city: "İstanbul",
    type: "Konut",
    listing: "Satılık",
    price: 12750000,
    area: 165,
    rooms: "3+1",
    bathrooms: 2,
    image: "residence.webp",
    imageAlt: "Büyük camlarla aydınlanan modern ve ferah yaşam alanı",
    description:
      "Gün ışığını içeri alan geniş pencereler ve rahat bir yerleşim. Şehir yaşamının olanaklarına yakın, işlevsel bir ev fikrini bu örnek konutta keşfedin.",
    features: ["Açık mutfak", "Geniş pencereler", "Ebeveyn banyosu", "Balkon"],
  },
  {
    id: "konut-02",
    name: "Her detayında iyi hissettiren bir ev",
    district: "Beşiktaş",
    city: "İstanbul",
    type: "Konut",
    listing: "Kiralık",
    price: 65000,
    area: 120,
    rooms: "2+1",
    bathrooms: 2,
    image: "apartment.webp",
    imageAlt: "Doğal tonlarda döşenmiş, aydınlık bir dairenin iç mekânı",
    description:
      "Doğal dokular, sade çizgiler ve dengeli bir plan. Şehrin içinde kendinize ait bir alan fikri sunan bu örnek daireyi inceleyin.",
    features: ["Aydınlık iç mekân", "Eşyalı", "Ankastre mutfak", "Asansör"],
  },
  {
    id: "ticari-01",
    name: "Fikirlerinize yer açan bir ofis",
    district: "Şişli",
    city: "İstanbul",
    type: "Ticari",
    listing: "Kiralık",
    price: 95000,
    area: 210,
    rooms: "Açık plan",
    bathrooms: 2,
    image: "office.webp",
    imageAlt: "Yeşil bitkiler ve geniş çalışma alanları bulunan aydınlık ofis",
    description:
      "Birlikte üretmeye uygun açık plan, toplantı alanları ve gün ışığı. Ekibinizin çalışma düzenine ilham vermek için sunulan örnek ofis.",
    features: ["Açık çalışma alanı", "Toplantı odası", "Mutfak", "Otopark"],
  },
  {
    id: "villa-02",
    name: "Ege’nin sakinliğine açılan kapı",
    district: "Bodrum",
    city: "Muğla",
    type: "Villa",
    listing: "Satılık",
    price: 32000000,
    area: 280,
    rooms: "4+1",
    bathrooms: 3,
    image: "coastal.webp",
    imageAlt: "Havuz kenarında geniş teraslı modern villa",
    description:
      "İç ve dış yaşamı buluşturan bir mimari; uzun yaz akşamları için geniş bir teras. Ege’deki yaşam hayalinize eşlik eden örnek villa.",
    features: ["Özel havuz", "Güneşlenme terası", "Bahçe", "Açık otopark"],
  },
  {
    id: "konut-03",
    name: "Sadelikle buluşan şehir yaşamı",
    district: "Çankaya",
    city: "Ankara",
    type: "Konut",
    listing: "Satılık",
    price: 8900000,
    area: 145,
    rooms: "3+1",
    bathrooms: 2,
    image: "about.webp",
    imageAlt:
      "Sıcak nötr tonlarda dekore edilmiş, geniş pencereli oturma odası",
    description:
      "Kullanışlı alanlar ve sıcak bir iç mekân. Günlük yaşamda konforu önceliklendirenler için hazırlanmış örnek bir konut seçeneği.",
    features: ["Geniş salon", "Ebeveyn banyosu", "Balkon", "Kapalı otopark"],
  },
];
export interface Filters {
  listing: ListingType | "";
  city: string;
  type: PropertyType | "";
  budget: string;
}
export const emptyFilters: Filters = {
  listing: "",
  city: "",
  type: "",
  budget: "",
};
export function filterProperties(
  items: Property[],
  filters: Filters,
  favorites?: string[],
): Property[] {
  return items.filter(
    (p) =>
      (!filters.listing || p.listing === filters.listing) &&
      (!filters.city || p.city === filters.city) &&
      (!filters.type || p.type === filters.type) &&
      (!filters.budget || p.price <= Number(filters.budget)) &&
      (!favorites || favorites.includes(p.id)),
  );
}
export const formatPrice = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
export const imageUrl = (file: string) =>
  `${import.meta.env.BASE_URL}images/${file}`;
