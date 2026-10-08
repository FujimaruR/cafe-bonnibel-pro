import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const catalog=JSON.parse(readFileSync(new URL('../src/site/catalog.json',import.meta.url)));
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):/\.(jsx|tsx)$/.test(e.name)?[join(dir,e.name)]:[]);}
test('all keys have both languages and matching interpolation variables',()=>{for(const entry of Object.values(catalog)){assert.deepEqual(Object.keys(entry).sort(),['en','es']);for(const locale of ['es','en'])assert.ok(entry[locale].length);const vars=s=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();assert.deepEqual(vars(entry.es),vars(entry.en));}});
test('every translation reference resolves to a complete catalog entry',()=>{for(const file of files('src'))for(const m of readFileSync(file,'utf8').matchAll(/\b(?:tr|t)\(['"]([^'"]+)['"]/g))assert.ok(catalog[m[1]],file+': '+m[1]);});
