import { test } from "node:test";
import assert from "node:assert/strict";
import {
  properties,
  filterProperties,
  emptyFilters,
  formatPrice,
} from "../src/properties.ts";

test("unfiltered inventory contains all six uniquely identified properties", () => {
  assert.equal(filterProperties(properties, emptyFilters).length, 6);
  assert.equal(new Set(properties.map((p) => p.id)).size, 6);
});
test("combined city, listing and inclusive budget filter finds the expected rental", () => {
  const results = filterProperties(properties, {
    listing: "Kiralık",
    city: "İstanbul",
    type: "",
    budget: "65000",
  });
  assert.deepEqual(
    results.map((p) => p.id),
    ["konut-02"],
  );
});
test("sale budget excludes more expensive villas", () => {
  const results = filterProperties(properties, {
    listing: "Satılık",
    city: "",
    type: "",
    budget: "15000000",
  });
  assert.deepEqual(
    results.map((p) => p.id),
    ["konut-01", "konut-03"],
  );
});
test("property type filter finds both villas across different cities", () => {
  assert.deepEqual(
    filterProperties(properties, { ...emptyFilters, type: "Villa" }).map(
      (p) => p.id,
    ),
    ["villa-01", "villa-02"],
  );
});
test("no-match search returns an empty list, never unrelated fallback listings", () => {
  assert.equal(
    filterProperties(properties, {
      listing: "Kiralık",
      city: "Ankara",
      type: "",
      budget: "",
    }).length,
    0,
  );
});
test("favorites intersect with filters and an empty favorites list stays empty", () => {
  assert.equal(filterProperties(properties, emptyFilters, []).length, 0);
  assert.deepEqual(
    filterProperties(properties, { ...emptyFilters, type: "Villa" }, [
      "villa-02",
      "konut-01",
    ]).map((p) => p.id),
    ["villa-02"],
  );
});
test("Turkish money formatting has correct grouping and no decimal places", () => {
  assert.equal(formatPrice(24500000), "₺24.500.000");
  assert.equal(formatPrice(65000), "₺65.000");
});
test("property filtering does not mutate its input", () => {
  const original = JSON.stringify(properties);
  filterProperties(properties, {
    listing: "Satılık",
    city: "Muğla",
    type: "Villa",
    budget: "32000000",
  });
  assert.equal(JSON.stringify(properties), original);
});
