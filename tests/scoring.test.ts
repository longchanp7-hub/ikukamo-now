import { describe, expect, it } from "vitest";
import { computeScore, passesBudget, passesRain } from "@/lib/scoring";

describe("scoring", () => {
  it("closer and cheaper scores higher", () => {
    const near = computeScore({
      category: "ramen", city: "A", prefecture: "A県",
      distanceFromUserKm: 1, walkMinutes: 5,
      limitedPeriod: false, foodAppeal: 60, adultOriented: false,
      snsBuzz: 20, rarity: 10,
    });
    const far = computeScore({
      category: "ramen", city: "B", prefecture: "B県",
      distanceFromUserKm: 20, walkMinutes: 60,
      limitedPeriod: false, foodAppeal: 60, adultOriented: false,
      snsBuzz: 20, rarity: 10,
    });
    expect(near).toBeGreaterThan(far);
  });

  it("budget filter", () => {
    expect(passesBudget({ priceText: "800円" }, 1000)).toBe(true);
    expect(passesBudget({ priceText: "2000円" }, 1000)).toBe(false);
    expect(passesBudget({ priceText: undefined }, 1000)).toBe(true);
  });

  it("rain filter", () => {
    expect(passesRain({ weatherDependent: true }, false)).toBe(false);
    expect(passesRain({ weatherDependent: true }, true)).toBe(true);
  });
});
