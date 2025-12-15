(async () => {
  // Mock a minimal document for Node test environment (only dispatchEvent needed)
  global.document = { dispatchEvent: () => {} };
  const { addDamageModifier, getDamageModifier, updateDamageModifiers } = await import('../../src/mechanics/damageModifiers.js');

  // Simulate gameState
  let state = { damageModifiers: [] };

  // Shields adds a global modifier 'all' for negative_events with turnsLeft 2
  state = addDamageModifier(state, 'all', 0.5, 'negative_events', 2, 'shields');

  // Immediately after adding, getDamageModifier for Power should reflect it
  const mod1 = getDamageModifier('Power', 'negative_events', state);
  console.log('Modifier immediately after add (expect 0.5):', mod1);

  // Simulate end-of-deterioration cleanup (decrement)
  state = updateDamageModifiers(state);

  // After decrement, turnsLeft should be 1 and modifier should still apply
  const mod2 = getDamageModifier('Power', 'negative_events', state);
  console.log('Modifier after one decrement (expect 0.5):', mod2);

  // Decrement again (should expire)
  state = updateDamageModifiers(state);
  const mod3 = getDamageModifier('Power', 'negative_events', state);
  console.log('Modifier after expiry (expect 1):', mod3);

  // Exit with non-zero code on failure
  if (mod1 !== 0.5 || mod2 !== 0.5 || mod3 !== 1) {
    console.error('Shields modifier behavior test FAILED');
    process.exit(2);
  }

  console.log('Shields modifier behavior test PASSED');
})();