import assert from 'node:assert/strict';
import {test} from 'node:test';
import {secondsUntilTransition, promotionIsActive} from '../src/lib/content-transitions.ts';
test('only the next future deadline expires a static page; past deadlines stop recurring', () => {
  assert.equal(secondsUntilTransition([], 1000), false);
  assert.equal(secondsUntilTransition([NaN, 500, 1000], 1000), false);
  assert.equal(secondsUntilTransition([6000, 3501], 1000), 3);
  assert.equal(secondsUntilTransition([6000, 3501], 6000), false);
});
test('promotions start and expire at their configured boundaries', () => {
  const promotion = {startsAt:new Date(1000).toISOString(),endsAt:new Date(3000).toISOString()};
  assert.equal(promotionIsActive(promotion,999),false);
  assert.equal(promotionIsActive(promotion,1000),true);
  assert.equal(promotionIsActive(promotion,3000),true);
  assert.equal(promotionIsActive(promotion,3001),false);
  assert.equal(promotionIsActive({},3001),true);
});
