(async () => {
  const { meteorShower } = await import('../../events/negative/meteorShower.js');
  const { oxygenLeak } = await import('../../events/negative/oxygenLeak.js');

  // Meteor Shower should deal 20 damage to each system by default (after balance)
  let state = { systems: [{ name: 'A', health: 100 }, { name: 'B', health: 90 }] };
  state = meteorShower.apply(state);
  console.log('Meteor results:', state.systems.map(s => s.health));
  if (state.systems[0].health !== 80 || state.systems[1].health !== 70) {
    console.error('meteorShower magnitude test FAILED');
    process.exit(2);
  }

  // Oxygen Leak should deal 35 damage to Life Support
  state = { systems: [{ name: 'Life Support', health: 100 }, { name: 'Other', health: 100 }] };
  state = oxygenLeak.apply(state);
  console.log('Oxygen leak results:', state.systems.map(s => s.health));
  if (state.systems[0].health !== 65) {
    console.error('oxygenLeak magnitude test FAILED');
    process.exit(2);
  }

  console.log('Event magnitude tests PASSED');
})();