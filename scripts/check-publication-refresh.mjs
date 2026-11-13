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
const raw=JSON.stringify({_id:'homePage',_type:'homePage',projectId:'08xf72v9',dataset:'production',operation:'update'});
const signature=await encodeSignatureHeader(raw,Date.now(),process.env.SANITY_REVALIDATE_SECRET);
const result=await fetch(base+'/api/revalidate',{method:'POST',headers:{'sanity-webhook-signature':signature},body:raw});
assert.equal(result.status,200); assert.equal((await result.json()).revalidated,true);
console.log('PASS: signed invalidation accepted.');
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
