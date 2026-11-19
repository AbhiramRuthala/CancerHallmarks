/* Deliberately dimensionless, deterministic teaching model. Not fitted to data. */
(function(root){
const environment={capacity:1400,delivery:1,immune:1,spread:1};
const hallmarks=[
['growth','Sustained proliferation','Growth signals stay on.','Raises division rate; enables the matched targeted-therapy vulnerability.'],
['suppress','Evading growth suppressors','The brakes come off.','Weakens density-dependent growth inhibition.'],
['death','Resisting cell death','Damaged cells survive.','Lowers spontaneous death and partially blunts chemotherapy and radiation.'],
['immortal','Replicative immortality','More generations of division.','Removes the gradual replicative limit in this conceptual model.'],
['vessels','Inducing angiogenesis','Recruit a blood supply.','Vessel supply increases over time, expanding capacity and reducing hypoxia.'],
['invasion','Activating invasion','Cross the tissue boundary.','Cells disperse beyond the dashed boundary; not a model of distant metastasis.'],
['evasion','Evading immune destruction','Hide from immune attack.','Reduces baseline immune killing. Checkpoint-like immunotherapy partly restores it.'],
['mutation','Genome instability','Generate more variation.','Raises the chance of new therapy-specific resistance during division.']
];
function initial(){return {t:0,pop:Array.from({length:16},(_,i)=>i===0?114:([1,2,4,8].includes(i)?1.5:0)),v:.18,invasion:0};}
function defaults(){return {h:{growth:true,suppress:false,death:false,immortal:false,vessels:false,invasion:false,evasion:false,mutation:false},tx:[0,0,0,0],amplify:1};}
function metrics(s,c){const o=environment,n=s.pop.reduce((a,b)=>a+b,0),k=o.capacity*(.34+.66*s.v)*(c.h.suppress?1.32:1),oxygen=Math.max(.1,Math.min(1,k/Math.max(1,n)*.7));return {n,k,oxygen,resistant:s.pop.slice(1).reduce((a,b)=>a+b,0),fractions:[0,1,2,3].map(j=>n?s.pop.reduce((a,b,i)=>a+((i&(1<<j))?b:0),0)/n:0)};}
function step(s,c,dt=.1){const h=c.h,o=environment,m=metrics(s,c);s.v+=((h.vessels?.94:.18)-s.v)*.055*dt;const age=h.immortal?1:Math.max(.2,1-s.t/260),birth=(.022+(h.growth?.045:0))*age*Math.max(0,1-m.n/m.k),immune=.012*o.immune*(h.evasion?.2:1),death=h.death?.003:.012,mu=(h.mutation?.016:.0008)*c.amplify,next=Array(16).fill(0);
for(let i=0;i<16;i++){const resistance=j=>(i&(1<<j))?.12:1;const kill=c.tx[0]*.105*o.delivery*(.35+birth/.067*.65)*(h.death?.65:1)*resistance(0)+c.tx[1]*(h.growth?.095:.003)*o.delivery*resistance(1)+c.tx[2]*.08*o.immune*(h.evasion?.65:1)*resistance(2)+c.tx[3]*.09*m.oxygen*(h.death?.75:1)*resistance(3);const growth=s.pop[i]*birth*dt,mut=growth*mu;next[i]+=Math.max(0,s.pop[i]+growth-s.pop[i]*(death+immune+kill+.001*bitcount(i))*dt);for(let j=0;j<4;j++)if(!(i&(1<<j))){next[i]-=mut/4;next[i|(1<<j)]+=mut/4;}}
s.pop=next.map(x=>Math.max(0,x));s.invasion+=((h.invasion?Math.min(1,m.n/600*o.spread):0)-s.invasion)*.035*dt;s.t+=dt;return s;}
function bitcount(i){let n=0;while(i){n+=i&1;i>>=1;}return n;}
// Paired counterfactuals share every intervention except one permanently disabled hallmark.
function createComparisons(){return Object.fromEntries(hallmarks.map(([id])=>[id,{state:initial(),used:false}]));}
function withoutHallmark(c,id){return {...c,h:{...c.h,[id]:false}};}
function stepComparisons(comparisons,c,dt=.1){for(const [id] of hallmarks){const pair=comparisons[id];pair.used=pair.used||!!c.h[id];step(pair.state,withoutHallmark(c,id),dt);}}
function compareHallmarks(s,c,comparisons){const actual=metrics(s,c);return hallmarks.map(([id])=>{const pair=comparisons[id],other=metrics(pair.state,withoutHallmark(c,id));return {id,used:pair.used,active:!!c.h[id],populationDelta:actual.n-other.n,populationPct:other.n>=1?100*(actual.n-other.n)/other.n:null,supplyPoints:100*(s.v-pair.state.v),invasionPoints:100*(s.invasion-pair.state.invasion),resistantDelta:actual.resistant-other.resistant};});}
// Context is a teaching annotation, never a stage classifier. Population is not TNM size.
function stageContext(s,c){

const invasive=s.invasion>1e-8;
let text=invasive?'Local invasion is developing in this run. Local extension can affect the T category, but does not by itself mean stage III or IV. This model has no lymph-node or distant-metastasis compartments.':'The display shows a local tumor without modeled dispersal. A localized pattern can be seen in stages I–II, but the model cannot distinguish them or rule out unmodeled spread.';
text+=' Population units, hallmark count and resistance are not staging criteria; shrinkage does not automatically change the original stage.';

return {kind:invasive?'invasion':'localized',title:invasive?'Current pattern: local invasion, not distant spread':'Current pattern: localized in this view',text,source:'https://www.cancer.gov/about-cancer/diagnosis-staging/staging'};
}
const api={environment,hallmarks,initial,defaults,metrics,step,createComparisons,stepComparisons,compareHallmarks,stageContext};if(typeof module!=='undefined')module.exports=api;root.OncoModel=api;
})(typeof window!=='undefined'?window:globalThis);
