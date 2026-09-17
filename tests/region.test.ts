import { describe, expect, it } from "vitest";
import { haversineKm } from "@/lib/region";

describe("haversine", () => {
  it("same point is ~0", () => {
    expect(haversineKm(35, 135, 35, 135)).toBeLessThan(0.1);
  });
  it("tokyo to osaka ~400km", () => {
    const d = haversineKm(35.68, 139.69, 34.69, 135.5);
    expect(d).toBeGreaterThan(380);
    expect(d).toBeLessThan(420);
  });
});
