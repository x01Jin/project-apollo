(async () => {
  // Basic deterministic tests for triggerEvent configuration
  const { triggerEvent } = await import('../../src/mechanics/triggerEvent.js');

  // Mock config with single events for predictability
  const posEvent = { description: 'Positive boost', apply: async (s) => ({ ...s, message: 'pos' }) };
  const negEvent = { description: 'Negative hit', apply: async (s) => ({ ...s, message: 'neg' }) };

  // 1) eventChance = 0 => never triggers
  let gameState = { systems: [], message: '' };
  let result = await triggerEvent(gameState, { positiveEvents: [posEvent], negativeEvents: [negEvent], eventChance: 0 });
  console.log('No event expected, event:', result.event);
  if (result.event !== null) {
    console.error('triggerEvent test FAILED: event triggered when eventChance=0');
    process.exit(2);
  }

  // 2) eventChance = 1 and positive probability = 1 => positive event
  result = await triggerEvent(gameState, { positiveEvents: [posEvent], negativeEvents: [negEvent], eventChance: 1, positiveEventProbability: 1 });
  console.log('Positive event expected, event.isPositive:', result.event && result.event.isPositive);
  if (!result.event || !result.event.isPositive) {
    console.error('triggerEvent test FAILED: expected positive event');
    process.exit(2);
  }

  // 3) eventChance = 1 and positive probability = 0 => negative event
  result = await triggerEvent(gameState, { positiveEvents: [posEvent], negativeEvents: [negEvent], eventChance: 1, positiveEventProbability: 0 });
  console.log('Negative event expected, event.isPositive:', result.event && result.event.isPositive);
  if (!result.event || result.event.isPositive) {
    console.error('triggerEvent test FAILED: expected negative event');
    process.exit(2);
  }

  console.log('triggerEvent configuration tests PASSED');
})();