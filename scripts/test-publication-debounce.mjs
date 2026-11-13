import assert from 'node:assert/strict';
import {test} from 'node:test';
import {encodeSignatureHeader} from '@sanity/webhook';
import {runPublicationDebounce, PUBLICATION_QUIET_MS} from '../src/lib/publication-debounce.ts';
import {handlePublicationCommit} from '../src/lib/publication-commit.ts';
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function harness(publish) {
  let now=0; const timers=[]; const values=[]; const readers=[]; const commits=[];
  const events={ [Symbol.asyncIterator](){return this;},next(){return values.length ? Promise.resolve(values.shift()) : new Promise(resolve=>readers.push(resolve));}};
  const put=value=>readers.length ? readers.shift()(value) : values.push(value);
  const running=runPublicationDebounce(events,{
    quietMs:PUBLICATION_QUIET_MS,now:()=>now,
    sleepUntil:deadline=>new Promise(resolve=>timers.push({deadline,resolve})),
    publish:async batch=>{commits.push({...batch,committedAt:now});await publish?.(batch);},
  });
  return {commits,
    async event(eventId,receivedAt=now){put({value:{eventId,receivedAt},done:false});await settle();},
    async tick(time){now=time;for(const timer of timers.splice(0)){if(timer.deadline<=now)timer.resolve();else timers.push(timer);}await settle();},
    async close(){put({done:true});await running;},
  };
}
test('last publication resets the full ten minutes; old timer cannot publish',async()=>{
  const h=harness();await h.event('a');await h.tick(599999);assert.equal(h.commits.length,0);
  await h.event('b');await h.tick(600000);assert.equal(h.commits.length,0);
  await h.tick(1199998);assert.equal(h.commits.length,0);
  await h.tick(1199999);assert.equal(h.commits.length,1);assert.equal(h.commits[0].eventId,'b');
  await h.tick(1500000);await h.event('b');await h.tick(2200000);assert.equal(h.commits.length,1);
  await h.close();
});
test('out-of-order deliveries cannot move the deadline backwards',async()=>{
  const h=harness();await h.event('new',100000);await h.event('older',20000);
  await h.tick(620000);assert.equal(h.commits.length,0);await h.tick(700000);assert.equal(h.commits.length,1);
  await h.close();
});
test('a publication received while committing is retained for the next quiet window',async()=>{
  let finish;const block=new Promise(resolve=>{finish=resolve;});const h=harness(()=>block);
  await h.event('a');await h.tick(600000);assert.equal(h.commits.length,1);
  await h.tick(610000);await h.event('b');finish();await settle();
  await h.tick(1209999);assert.equal(h.commits.length,1);await h.tick(1210000);assert.equal(h.commits.length,2);
  await h.close();
});
test('commit endpoint rejects early, forged and unsigned refreshes',async()=>{
  const secret='test-secret';const body={kind:'quiet-publication',eventId:'a'.repeat(64),receivedAt:1000,quietUntil:601000};
  const raw=JSON.stringify(body);let commits=0;
  async function send(now,signingSecret=secret,unsigned=false) {
    const signature=await encodeSignatureHeader(raw,Date.now(),signingSecret);
    return handlePublicationCommit(new Request('https://example.test/api/revalidate/commit',{
      method:'POST',body:raw,headers:unsigned?{}:{'sanity-webhook-signature':signature},
    }),{secret,now:()=>now,invalidate:()=>{commits++;}});
  }
  assert.equal((await send(600999)).status,409);assert.equal(commits,0);
  assert.equal((await send(700000,'wrong')).status,401);
  assert.equal((await send(700000,secret,true)).status,401);assert.equal(commits,0);
  assert.equal((await send(601000)).status,200);assert.equal(commits,1);
});
