(async () => {
  const { createGameState } = await import('../../src/core/gameState.js');

  const config = { systems: [ { name: 'A', type: 'normal' }, { name: 'B', type: 'normal' } ] };

  // Default should be between 50 and 100
  let gs = await createGameState(config);
  console.log('Default initial healths:', gs.systems.map(s => s.health));
  for (const s of gs.systems) {
    if (s.health < 50 || s.health > 100) {
      console.error('Default initial health range test FAILED');
      process.exit(2);
    }
  }

  // Custom range 70-75
  const config2 = { systems: [ { name: 'A', type: 'normal' }, { name: 'B', type: 'normal' } ], initialHealthRange: { min: 70, max: 75 } };
  gs = await createGameState(config2);
  console.log('Custom range healths:', gs.systems.map(s => s.health));
  for (const s of gs.systems) {
    if (s.health < 70 || s.health > 75) {
      console.error('Custom initial health range test FAILED');
      process.exit(2);
    }
  }

  console.log('Initial health range tests PASSED');
})();