import assert from 'node:assert/strict';
import { test } from 'node:test';
import { encodeSignatureHeader } from '@sanity/webhook';
import { handlePublishedContentWebhook } from '../src/lib/published-content-webhook.ts';

const secret = 'unit-test-only-published-content-secret';
const payload = {_id:'homePage', _type:'homePage', projectId:'project-test', dataset:'production', operation:'update'};
async function run(body = payload, options = {}) {
  const raw = typeof body === 'string' ? body : JSON.stringify(body);
  const signature = await encodeSignatureHeader(raw, Date.now(), options.signingSecret ?? secret);
  let invalidations = 0; let eventId;
  const request = new Request('https://example.test/api/revalidate', {
    method:'POST', headers: options.unsigned ? {} : {'sanity-webhook-signature':signature}, body:raw,
  });
  const response = await handlePublishedContentWebhook(request, {
    secret: options.unconfigured ? undefined : secret, projectId:'project-test', dataset:'production',
    enqueue: async event => { if(options.failQueue) throw new Error("queue offline"); invalidations++; eventId=event.eventId; return {runId:"test-run",quietUntil:event.receivedAt+600000}; },
  });
  assert.equal(response.headers.get('cache-control'), 'no-store');
  return {response, invalidations, eventId};
}
test('signed published create, update and delete queue without invalidating', async () => {
  for (const operation of ['create','update','delete']) {
    const {response,invalidations}=await run({...payload,operation});
    assert.equal(response.status,202); assert.equal(invalidations,1); assert.equal((await response.json()).revalidated,false);
  }
});
test('unsigned, forged and unconfigured requests cannot invalidate', async () => {
  for(const options of [{unsigned:true},{signingSecret:'wrong'},{unconfigured:true}]) {
    const {response,invalidations}=await run(payload,options);
    assert.ok(response.status>=400); assert.equal(invalidations,0);
  }
});
test('drafts, release versions and unrelated content are ignored', async () => {
  for(const changes of [{_id:'drafts.homePage'},{_id:'versions.release.homePage'},{_type:'unrelated'}]) {
    const {response,invalidations}=await run({...payload,...changes});
    assert.equal(response.status,200); assert.equal(invalidations,0);
  }
});
test('wrong project/dataset, malformed JSON, operation, and oversized bodies are rejected', async () => {
  for(const changes of [{projectId:'other'},{dataset:'other'},{operation:'read'},{_id:null}]) {
    const {response,invalidations}=await run({...payload,...changes});
    assert.equal(response.status,400); assert.equal(invalidations,0);
  }
  assert.equal((await run('{')).response.status,400);
  assert.equal((await run('x'.repeat(17000))).response.status,413);
});

test('queue failure requests a Sanity retry, and signed revisions deduplicate delivery retries',async()=>{
 assert.equal((await run(payload,{failQueue:true})).response.status,503);
 const first=await run({...payload,_rev:'revision-one'});
 const retry=await run({...payload,_rev:'revision-one'});
 const next=await run({...payload,_rev:'revision-two'});
 assert.equal(first.eventId,retry.eventId); assert.notEqual(first.eventId,next.eventId);
});
