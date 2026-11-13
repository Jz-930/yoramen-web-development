// Next 16.1.6 replays Location with appendHeader after rendering a redirect,
// producing two Location values on the first ISR request. Upstream: #82117.
// Keep this narrow, version-checked workaround until the upstream fix is adopted.
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
const require=createRequire(import.meta.url);
const root=dirname(require.resolve('next/package.json'));
const {version}=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
if(version!=='16.1.6') throw new Error('Review/remove the Next static redirect workaround before upgrading Next.');
const needle='if (typeof value === \'undefined\') continue;\n                    if (Array.isArray(value)) {';
const replacement='if (typeof value === \'undefined\') continue;\n                    // Yoramen: Location is single-valued, including on ISR cache MISS.\n                    if (key.toLowerCase() === "location") {\n                        res.setHeader(key, value);\n                        continue;\n                    }\n                    if (Array.isArray(value)) {';
for(const file of ['dist/build/templates/app-page.js','dist/esm/build/templates/app-page.js']) {
  const path=join(root,file);
  const source=await readFile(path,'utf8');
  if(source.includes('// Yoramen: Location is single-valued')) continue;
  const normalized=source.replaceAll('\r\n','\n');
  if(normalized.split(needle).length!==2) throw new Error(`Unexpected Next template: ${file}`);
  await writeFile(path,normalized.replace(needle,replacement));
}
console.log('Next static redirect Location workaround applied.');
