const assert=require('node:assert/strict');const M=require('./model.js');
function run(edit,t=100){const c=M.defaults();edit(c);const s=M.initial();for(let i=0;i<t*10;i++)M.step(s,c);return {...M.metrics(s,c),s,c};}
let checks=0;function test(name,fn){fn();checks++;console.log('PASS '+name)}
test('Initial compartments and fractions',()=>{const s=M.initial(),m=M.metrics(s,M.defaults());assert.equal(m.n,120);assert.equal(m.resistant,6);assert.equal(s.pop.length,16)});
test('Sustained signaling increases population',()=>assert(run(c=>{}).n>run(c=>c.h.growth=false).n));
test('Angiogenesis increases capacity and growth',()=>{let a=run(c=>c.h.vessels=true);let b=run(c=>{});assert(a.k>b.k);assert(a.n>b.n)});
for(const id of ['suppress','death','immortal','evasion'])test(id+' increases net population',()=>assert(run(c=>c.h[id]=true,160).n>run(c=>{},160).n));
test('Invasion expands local spread index',()=>assert(run(c=>c.h.invasion=true).s.invasion>run(c=>{}).s.invasion));
test('Instability and amplifier generate more variation',()=>{const a=run(c=>{c.h.mutation=true;c.amplify=5});assert(a.resistant/a.n>run(c=>{}).resistant/run(c=>{}).n)});
for(let i=0;i<4;i++)test('Therapy '+i+' suppresses population and selects matching resistance',()=>{const a=run(c=>c.tx[i]=.7),b=run(c=>{});assert(a.n<b.n);assert(a.fractions[i]>b.fractions[i])});
test('Matched targeted therapy requires growth target',()=>{let no=run(c=>c.h.growth=false),drug=run(c=>{c.h.growth=false;c.tx[1]=1});assert(drug.n/no.n>.65)});
test('Deterministic restart',()=>assert.deepEqual(run(c=>{}).s,run(c=>{}).s));
test('Treatment extremes stay finite and nonnegative',()=>{for(const level of [0,1]){const a=run(c=>{Object.keys(c.h).forEach(k=>c.h[k]=true);c.tx.fill(level);c.amplify=5},300);assert(a.s.pop.every(x=>Number.isFinite(x)&&x>=0));assert(a.s.v>=0&&a.s.v<=1);assert(a.s.invasion>=0&&a.s.invasion<=1)}});
console.log(checks+' model checks passed');
