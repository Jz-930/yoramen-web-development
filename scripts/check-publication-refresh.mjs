import assert from 'node:assert/strict';
import {encodeSignatureHeader} from '@sanity/webhook';
const base=process.env.CHECK_BASE_URL;
assert.ok(base && process.env.SANITY_REVALIDATE_SECRET, 'Provide CHECK_BASE_URL and SANITY_REVALIDATE_SECRET');
const pages=['','/about','/contact','/gallery','/locations','/menu','/order'];
const paths=['','/fr-ca','/zh-hant','/ja-jp'].flatMap(prefix=>pages.map(page=>(prefix+page)||'/'));
const previous=new Map();
for(const path of paths) {
  const r=await fetch(base+path,{redirect:'manual'});
  assert.ok([200,307].includes(r.status),`${path}: ${r.status}`);
  previous.set(path,{status:r.status,location:r.headers.get('location')});
  await r.arrayBuffer();
}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function send(revision) {
  const raw=JSON.stringify({_id:'homePage',_type:'homePage',_rev:revision,projectId:'08xf72v9',dataset:'production',operation:'update'});
  const signature=await encodeSignatureHeader(raw,Date.now(),process.env.SANITY_REVALIDATE_SECRET);
  const response=await fetch(base+'/api/revalidate',{method:'POST',headers:{'sanity-webhook-signature':signature},body:raw});
  const result=await response.json();
  assert.equal(response.status,202,JSON.stringify(result)); assert.equal(result.revalidated,false);
  return result;
}
const runStartedAt=Date.now();
const runLabel='debounce-smoke-'+runStartedAt;
const first=await send(runLabel+'-a'); console.log('First event queued:',JSON.stringify(first));
await delay(Number(process.env.CHECK_DEBOUNCE_RESET_MS ?? 45000));
const last=await send(runLabel+'-b'); assert.equal(first.runId,last.runId);
assert.ok(last.quietUntil>first.quietUntil);console.log('Second event resets deadline:',JSON.stringify(last));
await send(runLabel+'-b'); // Same signed revision is a delivery retry, not another publication.
const evidence={first,last,checks:[]};
async function waitUntil(deadline) {
 while(Date.now()<deadline) {
  await delay(Math.min(30000,deadline-Date.now()));
  const r=await fetch(base+'/',{redirect:'manual'});await r.arrayBuffer();
  const check={at:new Date().toISOString(),cache:r.headers.get('x-vercel-cache')??r.headers.get('x-nextjs-cache'),age:r.headers.get('age')};
  evidence.checks.push(check);console.log('Waiting with static page:',JSON.stringify(check));
 }
}
await waitUntil(first.quietUntil+3000);
const beforeLast=await fetch(base+'/');await beforeLast.arrayBuffer();
assert.equal(beforeLast.headers.get('x-vercel-cache')??beforeLast.headers.get('x-nextjs-cache'),'HIT','Old timer must not invalidate');
if(beforeLast.headers.has('age')) assert.ok(Number(beforeLast.headers.get('age'))>=Math.floor((Date.now()-runStartedAt)/1000)-5, 'Cache must survive the original deadline');
console.log('PASS: original deadline passed without invalidation.');
await waitUntil(last.quietUntil+3000);
for(const path of paths) {
  const states=[];
  for(let i=0;i<2;i++) {
    const r=await fetch(base+path,{redirect:'manual'});
    assert.equal(r.status,previous.get(path).status,`${path} after invalidation`);
    assert.equal(r.headers.get('location'),previous.get(path).location,`${path} redirect`);
    await r.arrayBuffer();
    states.push(r.headers.get('x-nextjs-cache') ?? r.headers.get('x-vercel-cache'));
  }
  // Vercel propagates invalidation asynchronously across its CDN. Allow a
  // bounded settling period, but never accept a permanently dynamic response.
  for(let retry=0;states.at(-1)!=='HIT' && retry<10;retry++) {
    await new Promise(resolve=>setTimeout(resolve,1000));
    const r=await fetch(base+path,{redirect:'manual'});
    assert.equal(r.status,previous.get(path).status,`${path} during propagation`);
    assert.equal(r.headers.get('location'),previous.get(path).location);
    await r.arrayBuffer();
    states.push(r.headers.get('x-nextjs-cache') ?? r.headers.get('x-vercel-cache'));
  }
  assert.equal(states.at(-1),'HIT',`${path} repeat should become static: ${states}`);
  console.log(path,states.join(' -> '));
}
const query=await fetch(base+'/fr-ca?utm_source=static-check',{redirect:'manual'});
if(query.status===307) assert.ok(query.headers.get('location')?.endsWith('/?utm_source=static-check'));
assert.equal((await fetch(base+'/not-a-locale/order',{redirect:'manual'})).status,404);
console.log('PASS: all 28 routes survive publication and return to static cache; query and unknown-locale behavior preserved.');

const finalRoot=await fetch(base+'/');await finalRoot.arrayBuffer();
if(finalRoot.headers.has('age')) assert.ok(Number(finalRoot.headers.get('age')) < Math.floor((Date.now()-runStartedAt)/1000)-30,'The final quiet window must actually refresh the cache');
evidence.finalRootAge=finalRoot.headers.get('age');
const {writeFile}=await import('node:fs/promises');
await writeFile(new URL('../tmp/debounce-production-result.json',import.meta.url),JSON.stringify({...evidence,passed:true},null,2));
