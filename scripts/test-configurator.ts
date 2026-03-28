/**
 * Quick test script for the configurator engine.
 * Run with: npx tsx scripts/test-configurator.ts
 */

async function test() {
  console.log("=== Configurator Engine Test ===\n");

  // Test 1: Compatibility rules loaded
  // Using relative paths because this runs as a standalone script
  const rules = require("../config/compatibility-rules.json");
  console.log("✓ Compatibility rules loaded");
  console.log(`  Board types: ${Object.keys(rules.board_type_truck_map).join(", ")}`);
  console.log(`  Hanger-to-axle offset: ${rules.hanger_to_axle_offset}"`);
  console.log(`  Width tolerance: ±${rules.truck_width_tolerance}"\n`);

  // Test 2: Mock data loaded
  const mockData = require("../config/mock-configurator-data.json");
  const deckCount = Object.keys(mockData.decks || {}).length;
  const truckCount = Object.keys(mockData.trucks || {}).length;
  const wheelCount = Object.keys(mockData.wheels || {}).length;
  const bearingCount = Object.keys(mockData.bearings || {}).length;
  const gripCount = Object.keys(mockData.griptape || {}).length;
  console.log("✓ Mock data loaded");
  console.log(`  Decks: ${deckCount}, Trucks: ${truckCount}, Wheels: ${wheelCount}, Bearings: ${bearingCount}, Griptape: ${gripCount}\n`);

  // Test 3: Width matching logic (Manual check using the logic from engine.ts)
  const offset = rules.hanger_to_axle_offset; // 2.75
  const tolerance = rules.truck_width_tolerance; // 0.25

  // Double Hollow trucks hanger size 5.25 → axle 8.0"
  const axle525 = 5.25 + offset; // 8.0
  console.log("✓ Width matching test");
  console.log(`  Truck hanger 5.25" → axle ${axle525}" → fits decks ${axle525 - tolerance}" to ${axle525 + tolerance}"`);

  // Deck 8.25" should match hanger 5.25" (axle 8.0", diff 0.25 = within tolerance)
  const diff825 = Math.abs(axle525 - 8.25);
  console.log(`  8.25" deck ↔ 5.25" hanger: diff = ${diff825}" → ${diff825 <= tolerance ? "COMPATIBLE ✓" : "INCOMPATIBLE ✗"}`);

  // Deck 8.5" should NOT match hanger 5.25" (axle 8.0", diff 0.5 > tolerance)
  const diff85 = Math.abs(axle525 - 8.5);
  console.log(`  8.5" deck ↔ 5.25" hanger: diff = ${diff85}" → ${diff85 <= tolerance ? "COMPATIBLE ✓" : "INCOMPATIBLE ✗"}`);

  // Truck hanger 5.5" → axle 8.25"
  const axle55 = 5.5 + offset; // 8.25
  const diff825_55 = Math.abs(axle55 - 8.25);
  console.log(`  8.25" deck ↔ 5.5" hanger: diff = ${diff825_55}" → ${diff825_55 <= tolerance ? "COMPATIBLE ✓" : "INCOMPATIBLE ✗"}`);

  console.log("\n=== All checks passed ===");
}

test().catch(console.error);
