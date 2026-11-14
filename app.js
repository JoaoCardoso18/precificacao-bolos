(function(){
const VERSION='v0.0.2';
const KEY='mh-bolos-v2';
const $=s=>document.querySelector(s);
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pf=v=>{const n=parseFloat(String(v??'').replace(/\./g,'').replace(',','.'));return isFinite(n)?n:0};
const pfd=v=>{const s=String(v??'').trim();if(/,/.test(s))return pf(s);const n=parseFloat(s);return isFinite(n)?n:0};
const brl=v=>(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const num=(v,d=0)=>(v||0).toLocaleString('pt-BR',{maximumFractionDigits:d,minimumFractionDigits:0});
const ic=(n,c='hi')=>`<svg class="${c}"><use href="#i-${n}"/></svg>`;
const localISO=t=>new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const dAgo=n=>{const t=new Date();t.setDate(t.getDate()-n);return localISO(t)};
const today=()=>localISO(new Date());
const days=d=>Math.round((new Date(today()+'T12:00:00')-new Date(d+'T12:00:00'))/864e5);
const fdate=d=>new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'2-digit'}).replace(/\./g,'');
const BIG={g:'kg',ml:'L',un:'un'};
const UNAME={g:'peso',ml:'volume',un:'unidade'};
const fq=(q,u)=>u==='un'?`${num(q,1)} un`:(q>=1000?`${num(q/1000,2)} ${BIG[u]}`:`${num(q,0)} ${u}`);

/* ---------- dados de exemplo ---------- */
function seed(){
  const I={};const mk=(k,nome,un,c,est)=>{I[k]={id:k,nome,un,est,compras:c.map(([d,q,p])=>({id:uid(),data:dAgo(d),qtd:q,preco:p}))}};
  mk('lc','Leite condensado','g',[[120,395,6.29],[85,395,6.79],[50,395,6.99],[20,395,7.29],[6,395,7.49]],1580);
  mk('cr','Creme de leite','g',[[90,200,3.49],[40,200,3.79],[8,200,3.99]],800);
  mk('mt','Manteiga','g',[[60,200,11.9],[10,200,12.9]],400);
  mk('cn','Chocolate nobre 50% cacau','g',[[100,1000,54.9],[45,1000,57.9],[12,1000,59.9]],1200);
  mk('cb','Chocolate branco nobre','g',[[30,1000,64.9]],600);
  mk('cp','Chocolate em pó 50%','g',[[70,200,13.9],[15,200,14.9]],150);
  mk('lp','Leite em pó','g',[[80,400,21.9],[25,400,22.9],[4,400,24.5]],650);
  mk('co','Coco ralado','g',[[40,100,5.49]],200);
  mk('li','Limão siciliano','un',[[14,1,2.5]],3);
  mk('fa','Farinha de trigo','g',[[60,1000,5.49],[9,1000,5.99]],3000);
  mk('ac','Açúcar','g',[[60,1000,4.59],[9,1000,4.79]],4000);
  mk('ov','Ovos','un',[[30,30,24.9],[5,30,26.9]],24);
  mk('le','Leite integral','ml',[[12,1000,5.49]],2000);
  mk('ol','Óleo','ml',[[45,900,8.49]],900);
  mk('fe','Fermento em pó','g',[[90,100,4.5]],60);
  mk('mo','Morango','g',[[18,250,8.9],[3,250,9.9]],500);
  mk('nu','Nutella','g',[[25,350,26.9]],350);
  mk('cx','Caixa para bolo','un',[[50,10,45]],6);
  mk('bs','Base laminada','un',[[50,10,25]],7);
  const R={};const rc=(k,nome,tipo,rend,its)=>{R[k]={id:k,nome,tipo,rend,itens:its.map(([i,q])=>({ins:i,qtd:q}))}};
  rc('mb','Massa branca','Massa',1100,[['fa',300],['ac',300],['ov',6],['le',240],['ol',120],['fe',15]]);
  rc('mc','Massa de chocolate','Massa',1150,[['fa',280],['ac',300],['cp',60],['ov',6],['le',240],['ol',120],['fe',15]]);
  rc('bn','Brigadeiro de chocolate nobre','Recheio',1000,[['lc',790],['cr',400],['cn',200],['mt',30]]);
  rc('bp','Brigadeiro de leite em pó','Recheio',980,[['lc',790],['cr',400],['lp',100],['mt',30]]);
  rc('bc','Brigadeiro de coco','Recheio',1000,[['lc',790],['cr',400],['co',100],['mt',30]]);
  rc('bb','Brigadeiro de chocolate branco','Recheio',1000,[['lc',790],['cr',400],['cb',200],['mt',30]]);
  rc('bl','Brigadeiro de limão siciliano','Recheio',1000,[['lc',790],['cr',400],['cb',150],['li',2],['mt',30]]);
  rc('am','Morango','Adicional',250,[['mo',250]]);
  rc('an','Nutella','Adicional',350,[['nu',350]]);
  const B={};const bo=(k,nome,partes,itens,forno,margem,mao,outros,tab)=>{B[k]={id:k,nome,partes:partes.map(([r,g])=>({rec:r,g})),itens:itens.map(([i,q])=>({ins:i,qtd:q})),forno,margem,mao,outros,tab}};
  bo('b1','Ninho com morango',[['mb',1000],['bp',800],['am',250]],[['cx',1],['bs',1]],45,60,25,0,'t2');
  bo('b2','Brigadeiro de chocolate nobre',[['mc',1000],['bn',900]],[['cx',1],['bs',1]],45,60,25,0,'t1');
  bo('b3','Bentô Cake de coco',[['mb',260],['bc',240]],[],25,60,8,0,'t3');
  mk('ve','Vela de aniversário','un',[[20,12,18]],8);
  const CAT={cn:'k2',cb:'k2',cp:'k2',nu:'k2',mo:'k3',li:'k3',cx:'k4',bs:'k4',ve:'k5'};Object.values(I).forEach(i=>i.cat=CAT[i.id]||'k1');
  const cats=[{id:'k1',nome:'Ingredientes'},{id:'k2',nome:'Chocolates e cremes'},{id:'k3',nome:'Frutas'},{id:'k4',nome:'Caixas e embalagens'},{id:'k5',nome:'Decoração'}];
  const cfg={metodo:'repos',margem:60,mao:25,gas:true,gasHora:6,fixo:false,fixoMes:150,bolosMes:20,prop:{massa:50,adicional:10},emb:[{ins:'cx',qtd:1},{ins:'bs',qtd:1}],
    tab:[{id:'t1',nome:'Recheios',kg:63},{id:'t2',nome:'Com adicional',kg:70},{id:'t3',nome:'Bentô Cake (R$ 50 / 500 g)',kg:100}]};
  const E={};const en=(k,cliente,tel,ent,st,o,peso,valor,pg)=>{E[k]=Object.assign({id:k,cliente,tel,entrega:dAgo(ent),criado:dAgo(Math.max(ent,0)+6),status:st,peso,valor,margem:60,mao:25,outros:0,forno:45,
    itens:[{ins:'cx',qtd:1},{ins:'bs',qtd:1}],modelo:'',massa:'',recheios:[],adicional:'',pags:pg.map(([d,v])=>({id:uid(),data:dAgo(d),valor:v}))},o)};
  en('e4','Juliana Rocha','47999990004',-2,'afazer',{massa:'mb',recheios:['bb','bl'],tab:'t1'},2.5,157.5,[[3,50]]);
  en('e5','Renata Alves','47999990005',-5,'afazer',{massa:'mc',recheios:['bn'],adicional:'an',tab:'t2'},1.5,105,[]);
  en('e1','Fernanda Souza','47999990001',30,'entregue',{massa:'mb',recheios:['bp'],adicional:'am',tab:'t2'},2,140,[[30,50],[16,40]]);
  en('e2','Carla Mendes','47999990002',9,'entregue',{massa:'mc',recheios:['bn'],tab:'t1'},1.9,119.7,[[5,60]]);
  en('e3','Patrícia Lima','47999990003',12,'entregue',{modelo:'b3',tab:'t3',mao:8,forno:25,itens:[]},0.5,50,[]);
  en('e6','Luciana Prado','47999990006',20,'entregue',{massa:'mb',recheios:['bp'],tab:'t1'},2,126,[[20,126]]);
  Object.values(E).forEach(e=>e.partes=montar(e,cfg.prop,B));
  return {exemplo:true,cats,ins:I,rec:R,bolos:B,enc:E,cfg};
}
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!S||!S.ins||!S.enc)S=seed();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};

/* ---------- cálculos ---------- */
const byDate=(a,b)=>a.data<b.data?-1:a.data>b.data?1:0;
function cRepos(i){const c=[...i.compras].sort(byDate).pop();return c?c.preco/c.qtd:0}
function cMedio(i){let q=0,p=0;i.compras.forEach(c=>{q+=c.qtd;p+=c.preco});return q?p/q:0}
const cUnit=i=>i?(S.cfg.metodo==='medio'?cMedio(i):cRepos(i)):0;
const perBig=(i,v)=>v*(i.un==='un'?1:1000);
function recCusto(r){return r.itens.reduce((s,it)=>s+cUnit(S.ins[it.ins])*it.qtd,0)}
const recG=r=>r.rend?recCusto(r)/r.rend:0;
function calcBolo(b,fator=1){
  const partes=b.partes.map(p=>{const r=S.rec[p.rec];const g=p.g*fator;return {r,g,custo:r?g*recG(r):0}}).filter(p=>p.r);
  const itens=b.itens.map(it=>{const i=S.ins[it.ins];return {i,qtd:it.qtd,custo:i?cUnit(i)*it.qtd:0}}).filter(p=>p.i);
  const peso=partes.reduce((s,p)=>s+p.g,0)/1000;
  const ingr=partes.reduce((s,p)=>s+p.custo,0);
  const extras=itens.reduce((s,p)=>s+p.custo,0);
  const gas=S.cfg.gas?(b.forno||0)/60*S.cfg.gasHora:0;
  const fixo=S.cfg.fixo?S.cfg.fixoMes/Math.max(1,S.cfg.bolosMes):0;
  const custo=ingr+extras+gas+fixo;
  const margemV=custo*(b.margem||0)/100;
  const preco=custo+margemV+(b.mao||0)+(b.outros||0);
  const t=S.cfg.tab.find(x=>x.id===b.tab);
  const precoTab=t?t.kg*peso:0;
  return {partes,itens,peso,ingr,extras,gas,fixo,custo,margemV,preco,porKg:peso?preco/peso:0,ganho:margemV+(b.mao||0),t,precoTab};
}
/* ingredientes brutos de um bolo (para produzir e para a ficha) */
function insumosBolo(b,fator=1){
  const m={};const add=(id,q)=>{m[id]=(m[id]||0)+q};
  b.partes.forEach(p=>{const r=S.rec[p.rec];if(!r||!r.rend)return;const f=p.g*fator/r.rend;r.itens.forEach(it=>add(it.ins,it.qtd*f))});
  b.itens.forEach(it=>add(it.ins,it.qtd));
  return Object.entries(m).filter(([id])=>S.ins[id]).map(([id,q])=>({i:S.ins[id],q}));
}
function saldo(e){const pago=e.pags.reduce((s,p)=>s+p.valor,0);return {pago,falta:e.valor-pago}}
function cobrar(){return Object.values(S.enc).map(e=>{const {pago,falta}=saldo(e);const ult=[e.entrega,...e.pags.map(p=>p.data)].sort().pop();
  return {e,pago,falta,ult,dias:days(ult),vencido:falta>0.009&&days(e.entrega)>=0&&days(ult)>=7}})}
function descEnc(e){if(e.modelo&&S.bolos[e.modelo])return S.bolos[e.modelo].nome;
  const ids=e.massa?[e.massa,...(e.recheios||[]),e.adicional]:(e.partes||[]).map(p=>p.rec);return ids.filter(Boolean).map(r=>S.rec[r]?.nome).filter(Boolean).join(' + ')}
function quando(d){const n=-days(d);if(n===0)return 'hoje';if(n===1)return 'amanhã';if(n>1)return `em ${n} dias`;return n===-1?'ontem':`há ${-n} dias`}
const fdia=d=>new Date(d+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short'}).replace(/\./g,'');
/* divide o peso da encomenda entre massa, recheios e adicional (ou segue um modelo) */
function montar(e,prop,bolos){
  const tot=e.peso*1000;
  if(e.modelo&&bolos[e.modelo]){const m=bolos[e.modelo];const base=m.partes.reduce((s,p)=>s+p.g,0)||1;return m.partes.map(p=>({rec:p.rec,g:Math.round(p.g*tot/base)}))}
  const rs=(e.recheios||[]).filter(Boolean),ad=e.adicional,man=e.man||{};
  const wr=(100-prop.massa-(ad?prop.adicional:0))/(rs.length||1);
  const ps=[{rec:e.massa,w:prop.massa,m:man.massa},...rs.map((r,j)=>({rec:r,w:wr,m:man.rec?.[j]}))];if(ad)ps.push({rec:ad,w:prop.adicional,m:man.ad});
  /* quantidade manual fica fixa; o resto do peso é dividido entre as partes automáticas pela proporção */
  const fixo=ps.reduce((s,p)=>s+(p.m>0?p.m:0),0),autos=ps.filter(p=>!(p.m>0)),wt=autos.reduce((s,p)=>s+p.w,0)||1,resto=tot-fixo;
  return ps.map(p=>({rec:p.rec,g:Math.round(p.m>0?p.m:resto*p.w/wt)})).filter(p=>p.rec&&p.g>0);
}
/* ---------- navegação ---------- */
let tab='bolos',stack=[],recFiltro='Todos',catFiltro='Todos',busca='',escala={},escRec={},armed=null;
const go=v=>{stack.push(v);render();scrollTo(0,0)};
const back=()=>{stack.pop();render()};
const TABS=[['bolos','Encomendas','cake'],['receitas','Receitas','bowl'],['insumos','Insumos','basket'],['receber','A receber','wallet']];
function renderTabs(){
  const n=cobrar().filter(x=>x.vencido).length;
  $('#tabs').innerHTML=TABS.map(([k,l,i])=>`<button class="tab${tab===k?' on':''}" data-act="tab" data-t="${k}"${tab===k?' aria-current="page"':''}>${ic(i)}<span>${l}</span>${k==='receber'&&n?`<span class="dot">${n}</span>`:''}</button>`).join('');
}
function render(){
  const v=stack[stack.length-1]||{t:tab};
  $('#view').innerHTML=(S.exemplo?`<button class="example" data-act="tab" data-t="ajustes">Estes são dados de exemplo para conhecer o sistema. Quando quiser começar com os seus, toque aqui e use "Apagar exemplos".</button>`:'')+V[v.t](v);
  renderTabs();
  if(v.t==='insumo')drawChart(S.ins[v.id]);
}
const headBack=(t,extra='')=>`<button class="back" data-act="back">${ic('back')} Voltar</button><div class="head"><h1>${esc(t)}</h1>${extra}</div>`;

/* ---------- telas ---------- */
const V={};
V.bolos=()=>{
  const venc=cobrar().filter(x=>x.vencido);const mes=today().slice(0,7);const all=Object.values(S.enc);
  const doMes=all.filter(e=>e.entrega.slice(0,7)===mes);
  const fat=doMes.reduce((s,e)=>s+e.valor,0),gan=doMes.reduce((s,e)=>s+e.valor-calcBolo(e).custo,0);
  const af=all.filter(e=>e.status!=='entregue').sort((a,b)=>a.entrega<b.entrega?-1:1);
  const ent=all.filter(e=>e.status==='entregue').sort((a,b)=>a.entrega>b.entrega?-1:1);
  const mods=Object.values(S.bolos).map(b=>{const c=calcBolo(b);return `<button class="card" data-act="go" data-v="bolo" data-id="${b.id}"><div class="card-top"><h3>${esc(b.nome)}</h3><div class="big">${brl(c.porKg)}<small>/kg</small></div></div><div class="meta">${num(c.peso,2)} kg · custo ${brl(c.custo)} · preço sugerido por kg</div></button>`}).join('');
  const bk=!S.exemplo&&Object.keys(S.ins).length&&(!S.cfg.ultimoBackup||days(S.cfg.ultimoBackup)>=7);
  return (bk?`<button class="alert" data-act="tab" data-t="ajustes">${ic('alert')} ${S.cfg.ultimoBackup?`Último backup há ${days(S.cfg.ultimoBackup)} dias.`:'Você ainda não fez backup.'} Toque para fazer agora.</button>`:'')+(venc.length?`<button class="alert" data-act="tab" data-t="receber">${ic('alert')} ${venc.length===1?'1 cliente está':venc.length+' clientes estão'} há mais de uma semana sem pagar. Toque para ver.</button>`:'')+
  `<div class="head"><h1>Encomendas</h1></div>
  <button class="btn primary block" data-act="formEnc" style="margin-bottom:14px">${ic('plus')} Nova encomenda</button>
  <div class="tiles three"><div class="tile"><div class="k">Encomendas no mês</div><div class="v">${doMes.length}</div></div><div class="tile"><div class="k">Vendido no mês</div><div class="v">${brl(fat)}</div></div><div class="tile"><div class="k">Ganho no mês</div><div class="v" style="color:var(${gan<0?'--bad':'--good'})">${brl(gan)}</div></div></div>
  <h2 class="grp-h">A fazer</h2><div class="list">${af.map(encCard).join('')||'<p class="empty">Nenhuma encomenda para fazer.</p>'}</div>
  ${ent.length?`<details class="more sec" style="margin-top:12px"><summary>Entregues (${ent.length}) ${ic('chev')}</summary><div class="list" style="margin-top:10px">${ent.map(encCard).join('')}</div></details>`:''}
  <div class="head" style="margin-top:26px"><h2 class="grp-h" style="margin:0">Modelos de bolo</h2><button class="btn sm" data-act="formBolo">${ic('plus')} Novo modelo</button></div>
  <p class="sub">Combinações que ela faz sempre. Servem de ponto de partida para uma encomenda.</p>
  <div class="list">${mods||'<p class="empty">Nenhum modelo ainda.</p>'}</div>`;
};
function encCard(e){const c=calcBolo(e);const {falta}=saldo(e);const g=e.valor-c.custo;const ent=e.status==='entregue';const late=!ent&&days(e.entrega)>0;
  return `<button class="card" data-act="go" data-v="enc" data-id="${e.id}">
   <div class="card-top"><h3>${esc(e.cliente)}</h3><div class="big">${brl(e.valor)}</div></div>
   <div class="meta">${esc(descEnc(e))} · ${num(e.peso,2)} kg</div>
   <div class="pills">${ent?`<span class="pill neutral">${ic('check')} Entregue ${fdia(e.entrega)}</span>`:`<span class="pill ${late?'bad':days(e.entrega)>=-2?'warn':'neutral'}">${ic('cal')} Entrega ${fdia(e.entrega)} (${quando(e.entrega)})</span>`}
   <span class="pill ${g<=0?'bad':'good'}">Ganho ${brl(g)}</span>
   ${falta>0.009?`<span class="pill neutral">Falta ${brl(falta)}</span>`:`<span class="pill good">${ic('check')} Pago</span>`}</div></button>`}

V.bolo=({id})=>{
  const b=S.bolos[id];if(!b)return V.bolos();
  const base=calcBolo(b);const alvo=escala[id]??+base.peso.toFixed(2);const f=base.peso?alvo/base.peso:1;
  const c=calcBolo(b,f);const ins=insumosBolo(b,f);
  const lin=(l,v,s='')=>`<div class="line"><span class="l">${l}${s?`<small>${s}</small>`:''}</span><span class="num">${v}</span></div>`;
  const tabOpts=S.cfg.tab.map(t=>`<option value="${t.id}"${t.id===b.tab?' selected':''}>${esc(t.nome)} · ${brl(t.kg)}/kg</option>`).join('');
  const gTab=c.t?c.precoTab-c.custo-(b.outros||0):0;
  return headBack(b.nome)+'<p class="sub">Modelo de bolo</p>'+
  `<button class="btn primary block" data-act="formEnc" data-modelo="${id}">${ic('plus')} Nova encomenda com este modelo</button><div class="row-btns"><button class="btn sm" data-act="formBolo" data-id="${id}">${ic('edit')} Editar modelo</button><button class="btn sm" data-act="go" data-v="ficha" data-id="${id}">${ic('doc')} Ficha técnica</button></div>
  <div class="sec"><h2>Tamanho do bolo</h2>
    <div class="stepper"><button data-act="esc" data-id="${id}" data-d="-0.5" aria-label="Diminuir">−</button>
    <input class="inp" id="esc-${id}" inputmode="decimal" value="${num(alvo,2)}" data-live="esc" data-id="${id}" aria-label="Peso em kg"><span class="unit">kg</span>
    <button data-act="esc" data-id="${id}" data-d="0.5" aria-label="Aumentar">+</button></div>
    <p class="sub" style="margin:10px 0 0">A receita base tem ${num(base.peso,2)} kg. Mude o peso e todas as quantidades e valores se ajustam.</p></div>
  <div class="sec"><h2>Composição</h2>
    ${c.partes.map(p=>lin(esc(p.r.nome),brl(p.custo),`${p.r.tipo} · ${fq(p.g,'g')}`)).join('')}
    ${c.itens.map(p=>lin(esc(p.i.nome),brl(p.custo),fq(p.qtd,p.i.un))).join('')}
    <details class="more" style="margin-top:8px"><summary>Ingredientes para fazer ${ic('chev')}</summary>
    ${ins.map(x=>{const falta=x.q-x.i.est;return lin(esc(x.i.nome),fq(x.q,x.i.un),falta>0.0001?`<span class="short">Estoque: ${fq(Math.max(0,x.i.est),x.i.un)} (faltam ${fq(falta,x.i.un)})</span>`:`Estoque: ${fq(x.i.est,x.i.un)}`)}).join('')}
    <button class="btn block sm" style="margin-top:10px" data-act="produzir" data-k="bolos" data-id="${id}">${ic('box')} Produzi este bolo: tirar do estoque</button>
    </details></div>
  <div class="sec"><h2>Preço de venda</h2>
    ${lin('Ingredientes',brl(c.ingr))}
    ${c.extras?lin('Embalagem e extras',brl(c.extras)):''}
    ${S.cfg.gas?lin('Gás e energia',brl(c.gas),`${b.forno||0} min de forno`):''}
    ${S.cfg.fixo?lin('Custos fixos',brl(c.fixo),'parte do mês por bolo'):''}
    <div class="line total"><span>Custo do bolo</span><span class="num">${brl(c.custo)}</span></div>
    <div class="field" style="margin-top:14px"><label for="mg-${id}">Margem de lucro</label><div class="inp-wrap"><input class="inp" id="mg-${id}" inputmode="decimal" value="${num(b.margem,1)}" data-live="bf" data-k="margem" data-id="${id}"><span class="unit">%</span><span class="num" style="min-width:96px;text-align:right">+ ${brl(c.margemV)}</span></div></div>
    <div class="field"><label for="mo-${id}">Mão de obra adicional</label><div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="mo-${id}" inputmode="decimal" value="${num(b.mao,2)}" data-live="bf" data-k="mao" data-id="${id}"></div></div>
    <div class="field"><label for="ou-${id}">Outros valores adicionais</label><div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="ou-${id}" inputmode="decimal" value="${num(b.outros,2)}" data-live="bf" data-k="outros" data-id="${id}"></div><span class="help">Topper, decoração especial, entrega.</span></div>
    <div class="line total"><span>Preço sugerido</span><span class="num">${brl(c.preco)}</span></div>
    <div class="line result"><span>Preço por kg</span><span class="num" data-out="porkg">${brl(c.porKg)}</span></div>
    <div class="line"><span class="l">Seu ganho no bolo<small>margem + mão de obra</small></span><span class="num">${brl(c.ganho)}</span></div></div>
  <div class="sec"><h2>Comparar com o cardápio</h2>
    <div class="field"><label for="tb-${id}">Valor cobrado</label><select class="inp" id="tb-${id}" data-live="tab" data-id="${id}"><option value="">Não comparar</option>${tabOpts}</select></div>
    ${c.t?`${lin(`Preço pelo cardápio`,brl(c.precoTab),`${num(c.peso,2)} kg × ${brl(c.t.kg)}`)}
      ${lin('Custo do bolo',brl(c.custo))}
      <div class="line total"><span>Ganho cobrando o cardápio</span><span class="num" style="color:var(${gTab<=0?'--bad':'--good'})">${brl(gTab)}</span></div>
      ${c.precoTab<c.preco?`<span class="pill ${gTab<=0?'bad':'warn'}">${ic('alert')} O cardápio está ${brl(c.porKg-c.t.kg)}/kg abaixo do preço sugerido</span>`:`<span class="pill good">${ic('check')} O cardápio cobre o preço sugerido</span>`}`:''}
  </div>`;
};

V.ficha=({id,k})=>{
  const isE=k==='enc';const b=(isE?S.enc:S.bolos)[id];if(!b)return V.bolos();
  const base=calcBolo(b);const alvo=isE?base.peso:(escala[id]??base.peso);const f=base.peso?alvo/base.peso:1;const c=calcBolo(b,f);
  const rows=c.partes.map(p=>{const fr=p.g/p.r.rend;
    return `<tr class="grp"><td colspan="2">${esc(p.r.nome)} <span style="font-weight:600">(${fq(p.g,'g')})</span></td><td class="r">${brl(p.custo)}</td></tr>`+
    p.r.itens.filter(it=>S.ins[it.ins]).map(it=>{const i=S.ins[it.ins];const q=it.qtd*fr;return `<tr><td>${esc(i.nome)}</td><td class="r">${fq(q,i.un)}</td><td class="r">${brl(cUnit(i)*q)}</td></tr>`}).join('')}).join('')+
    (c.itens.length?`<tr class="grp"><td colspan="2">Embalagem e extras</td><td class="r">${brl(c.extras)}</td></tr>`+c.itens.map(p=>`<tr><td>${esc(p.i.nome)}</td><td class="r">${fq(p.qtd,p.i.un)}</td><td class="r">${brl(p.custo)}</td></tr>`).join(''):'')+
    (S.cfg.gas?`<tr><td colspan="2">Gás e energia (${b.forno||0} min)</td><td class="r">${brl(c.gas)}</td></tr>`:'')+
    (S.cfg.fixo?`<tr><td colspan="2">Custos fixos</td><td class="r">${brl(c.fixo)}</td></tr>`:'');
  return headBack('Ficha técnica')+
  `<div class="doc"><div class="dh">${document.querySelector('.brand-mark svg').outerHTML.replace('<svg','<svg style="width:44px;height:44px"')}<div class="dn">MARCIA HENDLER</div><div class="ds">ATELIÊ DE BOLOS FINOS</div></div>
  <h2>${esc(isE?descEnc(b):b.nome)}</h2><div class="dm">${isE?`Encomenda de ${esc(b.cliente)} · entrega ${fdate(b.entrega)} · `:''}Bolo de ${num(c.peso,2)} kg · custos pelo ${S.cfg.metodo==='medio'?'custo médio':'preço da última compra'} · ${fdate(today())}</div>
  <div class="tblw"><table><thead><tr><th>Ingrediente</th><th class="r">Qtd.</th><th class="r">Custo</th></tr></thead><tbody>${rows}
  <tr class="tot"><td colspan="2">Custo total</td><td class="r">${brl(c.custo)}</td></tr>
  <tr><td colspan="2">Custo por kg</td><td class="r">${brl(c.peso?c.custo/c.peso:0)}</td></tr></tbody></table></div></div>
  <button class="btn primary block" data-act="pdf">${ic('doc')} Salvar em PDF</button><p class="note">Na janela que abrir, escolha "Salvar como PDF".</p>`;
};

V.receitas=()=>{
  const tipos=['Todos','Massa','Recheio','Adicional','Cobertura'];
  const rs=Object.values(S.rec).filter(r=>recFiltro==='Todos'||r.tipo===recFiltro);
  return `<div class="head"><h1>Receitas</h1><button class="btn primary sm" data-act="formRec">${ic('plus')} Nova</button></div>
  <p class="sub">Massas, recheios e adicionais prontos para usar em vários bolos.</p>
  <div class="chips">${tipos.map(t=>`<button class="chip${t===recFiltro?' on':''}" data-act="recF" data-t="${t}">${t==='Todos'?t:t+(t==='Massa'?'s':'s')}</button>`).join('')}</div>
  <div class="list">${rs.map(r=>{const c=recCusto(r);const usos=Object.values(S.bolos).filter(b=>b.partes.some(p=>p.rec===r.id)).length;
    return `<button class="card" data-act="go" data-v="rec" data-id="${r.id}"><div class="card-top"><h3>${esc(r.nome)}</h3><div class="big">${brl(r.rend?c/r.rend*1000:0)}<small>/kg</small></div></div>
    <div class="meta">${r.tipo} · rende ${fq(r.rend,'g')} · custa ${brl(c)}${usos?` · em ${usos} bolo${usos>1?'s':''}`:''}</div></button>`}).join('')||'<p class="empty">Nenhuma receita deste tipo.</p>'}</div>`;
};

V.rec=({id})=>{
  const r=S.rec[id];if(!r)return V.receitas();
  const alvo=escRec[id]??r.rend;const f=r.rend?alvo/r.rend:1;const total=recCusto(r)*f;
  const usos=Object.values(S.bolos).filter(b=>b.partes.some(p=>p.rec===id));
  return headBack(r.nome)+`<p class="sub">${r.tipo}</p>
  <div class="row-btns"><button class="btn sm" data-act="formRec" data-id="${id}">${ic('edit')} Editar</button></div>
  <div class="tiles"><div class="tile"><div class="k">Custo da receita</div><div class="v">${brl(total)}</div></div><div class="tile"><div class="k">Custo por kg</div><div class="v">${brl(r.rend?recCusto(r)/r.rend*1000:0)}</div></div></div>
  <div class="sec"><h2>Quanto quer fazer</h2><div class="stepper"><button data-act="escR" data-id="${id}" data-d="-100" aria-label="Diminuir">−</button>
  <input class="inp" id="er-${id}" inputmode="numeric" value="${num(alvo)}" data-live="escR" data-id="${id}" aria-label="Rendimento em gramas"><span class="unit">g</span><button data-act="escR" data-id="${id}" data-d="100" aria-label="Aumentar">+</button></div>
  <div class="chips" style="margin:12px 0 0">${[0.5,1,2,3].map(m=>`<button class="chip${Math.abs(f-m)<1e-6?' on':''}" data-act="escRm" data-id="${id}" data-m="${m}">${m===0.5?'Meia':m===1?'Normal':m+'×'}</button>`).join('')}</div></div>
  <div class="sec"><h2>Ingredientes</h2>${r.itens.filter(it=>S.ins[it.ins]).map(it=>{const i=S.ins[it.ins];const q=it.qtd*f;
    return `<div class="line"><span class="l">${esc(i.nome)}<small>${fq(q,i.un)}</small></span><span class="num">${brl(cUnit(i)*q)}</span></div>`}).join('')}
  <div class="line total"><span>Total</span><span class="num">${brl(total)}</span></div></div>
  <div class="sec"><h2>Usado nos bolos</h2>${usos.length?usos.map(b=>`<button class="card" style="margin-top:8px" data-act="go" data-v="bolo" data-id="${b.id}"><h3>${esc(b.nome)}</h3><div class="meta">${fq(b.partes.find(p=>p.rec===id).g,'g')} por bolo</div></button>`).join(''):'<p class="sub" style="margin:0">Ainda não usado em nenhum bolo.</p>'}</div>`;
};

V.insumos=()=>{
  const q=busca.trim().toLowerCase();
  const all=Object.values(S.ins).filter(i=>!q||i.nome.toLowerCase().includes(q)).sort((a,b)=>a.nome.localeCompare(b.nome));
  const ids=new Set(S.cats.map(c=>c.id));let body='';
  if(catFiltro==='Todos'){
    body=[...S.cats.map(c=>({nome:c.nome,its:all.filter(i=>i.cat===c.id)})),{nome:'Sem categoria',its:all.filter(i=>!ids.has(i.cat))}].filter(g=>g.its.length)
      .map(g=>`<h2 class="grp-h">${esc(g.nome)}<span class="cnt">${g.its.length}</span></h2><div class="list">${g.its.map(insCard).join('')}</div>`).join('');
  }else{const its=all.filter(i=>i.cat===catFiltro);if(its.length)body=`<div class="list">${its.map(insCard).join('')}</div>`}
  return `<div class="head"><h1>Insumos</h1><button class="btn primary sm" data-act="formIns">${ic('plus')} Novo</button></div>
  <p class="sub">Toque num insumo para registrar uma compra e ver o histórico de preços.</p>
  <div class="search">${ic('search')}<input class="inp" id="busca" placeholder="Procurar insumo" value="${esc(busca)}" data-live="busca" aria-label="Procurar insumo"></div>
  <div class="chips">${[{id:'Todos',nome:'Todos'},...S.cats].map(c=>`<button class="chip${catFiltro===c.id?' on':''}" data-act="catF" data-t="${c.id}">${esc(c.nome)}</button>`).join('')}<button class="chip ghost" data-act="formCats">${ic('edit','hi sm')} Categorias</button></div>
  ${body||'<p class="empty">Nenhum insumo aqui ainda.</p>'}`;
};
function insCard(i){const cs=[...i.compras].sort(byDate);const a=cs[cs.length-1],p=cs[cs.length-2];
  let tr='';if(a&&p){const va=a.preco/a.qtd,vp=p.preco/p.qtd,d=(va-vp)/vp*100;if(Math.abs(d)>=0.5)tr=`<span class="pill ${d>0?'warn':'good'}" style="margin-top:6px">${ic(d>0?'up':'down')} ${d>0?'subiu':'baixou'} ${num(Math.abs(d),0)}% na última compra</span>`}
  return `<button class="card" data-act="go" data-v="insumo" data-id="${i.id}"><div class="card-top"><h3>${esc(i.nome)}</h3><div class="big">${brl(perBig(i,cUnit(i)))}<small>/${BIG[i.un]}</small></div></div>
  <div class="meta">Estoque: ${fq(i.est,i.un)}${a?` · última compra ${fdate(a.data)}`:''}</div>${tr}</button>`}

V.insumo=({id})=>{
  const i=S.ins[id];if(!i)return V.insumos();
  const cs=[...i.compras].sort(byDate).reverse();const u=BIG[i.un];const med=S.cfg.metodo==='medio';
  return headBack(i.nome)+`<p class="sub">Medido por ${UNAME[i.un]} · custo por ${u}</p>
  <div class="row-btns"><button class="btn primary" data-act="formCompra" data-id="${id}">${ic('plus')} Registrar compra</button><button class="btn" data-act="formIns" data-id="${id}">${ic('edit')} Editar</button></div>
  <div class="tiles">
    <div class="tile${!med?' on':''}"><div class="k">Última compra</div><div class="v">${brl(perBig(i,cRepos(i)))}</div>${!med?'<div class="tag">Usado nas contas</div>':''}</div>
    <div class="tile${med?' on':''}"><div class="k">Custo médio</div><div class="v">${brl(perBig(i,cMedio(i)))}</div>${med?'<div class="tag">Usado nas contas</div>':''}</div>
    <div class="tile"><div class="k">Em estoque</div><div class="v">${fq(i.est,i.un)}</div><button class="back" style="padding:2px 0;font-size:14px" data-act="formEst" data-id="${id}">Ajustar estoque</button></div>
  </div>
  <div class="sec"><h2>Preço ao longo do tempo (por ${u})</h2>
    ${cs.length>1?`<div class="legend"><span><i style="border-color:var(--s1)"></i>Preço pago</span><span><i style="border-color:var(--s2);border-top-style:dashed"></i>Custo médio</span></div><div class="chart" id="chart"></div><div class="tip" id="tip">Toque no gráfico para ver cada compra.</div>`:'<p class="sub" style="margin:0">O gráfico aparece a partir da segunda compra.</p>'}</div>
  <div class="sec"><h2>Compras</h2>${cs.map(c=>`<div class="line"><span class="l">${fdate(c.data)}<small>${fq(c.qtd,i.un)} por ${brl(c.preco)}</small></span><span class="num">${brl(perBig(i,c.preco/c.qtd))}/${u}</span></div>`).join('')||'<p class="sub">Nenhuma compra registrada.</p>'}</div>`;
};

V.receber=()=>{
  const cb=cobrar().sort((a,b)=>(b.vencido-a.vencido)||b.dias-a.dias);const ab=cb.filter(x=>x.falta>0.009),pg=cb.filter(x=>x.falta<=0.009);
  const tot=ab.reduce((s,x)=>s+x.falta,0);
  const pill=x=>x.vencido?`<span class="pill bad">${ic('alert')} Há ${x.dias} dias sem pagar: hora de lembrar</span>`
    :days(x.e.entrega)<0?`<span class="pill neutral">${ic('cal')} Entrega ${fdia(x.e.entrega)}</span>`
    :`<span class="pill good">${ic('check')} ${x.e.pags.length?'Último pagamento':'Entregue'} ${x.dias===0?'hoje':`há ${x.dias} dia${x.dias>1?'s':''}`}</span>`;
  return `<div class="head"><h1>A receber</h1></div>
  <p class="sub">Saldo das encomendas. Para lançar uma nova, use a aba Encomendas.</p>
  <div class="tiles"><div class="tile"><div class="k">Total a receber</div><div class="v">${brl(tot)}</div></div><div class="tile"><div class="k">Encomendas com saldo</div><div class="v">${ab.length}</div></div></div>
  <div class="list">${ab.map(x=>`<button class="card" data-act="go" data-v="enc" data-id="${x.e.id}"><div class="card-top"><h3>${esc(x.e.cliente)}</h3><div class="big">${brl(x.falta)}</div></div>
    <div class="meta">${esc(descEnc(x.e))} · pagou ${brl(x.pago)} de ${brl(x.e.valor)}</div>${pill(x)}</button>`).join('')||'<p class="empty">Ninguém devendo. Tudo pago.</p>'}</div>
  ${pg.length?`<details class="more sec" style="margin-top:12px"><summary>Quitadas (${pg.length}) ${ic('chev')}</summary>${pg.map(x=>`<div class="line"><span class="l">${esc(x.e.cliente)}<small>${esc(descEnc(x.e))}</small></span><span class="num">${brl(x.e.valor)}</span></div>`).join('')}</details>`:''}`;
};

V.enc=({id})=>{
  const e=S.enc[id];if(!e)return V.bolos();
  const c=calcBolo(e);const {pago,falta}=saldo(e);const g=e.valor-c.custo;const ins=insumosBolo(e);const ent=e.status==='entregue';
  const tel=String(e.tel||'').replace(/\D/g,'');
  const msg=encodeURIComponent(`Oi, ${e.cliente.split(' ')[0]}! Tudo bem? Passando para lembrar do saldo de ${brl(falta)} do bolo. Quando puder, o Pix é o mesmo de sempre. Obrigada! Marcia Hendler`);
  const lin=(l,v,s='')=>`<div class="line"><span class="l">${l}${s?`<small>${s}</small>`:''}</span><span class="num">${v}</span></div>`;
  return headBack(e.cliente)+`<p class="sub">${esc(descEnc(e))} · ${num(e.peso,2)} kg</p>
  <div class="pills" style="margin:-4px 0 14px">${ent?`<span class="pill good">${ic('check')} Entregue · ${fdia(e.entrega)}</span>`:`<span class="pill ${days(e.entrega)>0?'bad':'warn'}">${ic('cal')} Entrega ${fdia(e.entrega)} (${quando(e.entrega)})</span>`}</div>
  <div class="tiles"><div class="tile"><div class="k">Valor combinado</div><div class="v">${brl(e.valor)}</div></div><div class="tile"><div class="k">Custo do bolo</div><div class="v">${brl(c.custo)}</div></div>
  <div class="tile"><div class="k">Seu ganho</div><div class="v" style="color:var(${g<=0?'--bad':'--good'})">${brl(g)}</div></div><div class="tile"><div class="k">Falta pagar</div><div class="v" style="color:var(${falta>0.009?'--bad':'--good'})">${brl(Math.max(0,falta))}</div></div></div>
  <div class="row-btns">${falta>0.009?`<button class="btn primary" data-act="formPag" data-id="${id}">${ic('plus')} Registrar pagamento</button>`:''}<button class="btn" data-act="status" data-id="${id}">${ic(ent?'back':'check')} ${ent?'Voltar para "a fazer"':'Marcar como entregue'}</button></div>
  <div class="row-btns" style="margin-top:0">${tel&&falta>0.009?`<a class="btn sm" href="https://wa.me/55${tel}?text=${msg}" target="_blank" rel="noopener">${ic('msg')} Lembrar no WhatsApp</a>`:''}<button class="btn sm" data-act="formEnc" data-id="${id}">${ic('edit')} Editar</button><button class="btn sm" data-act="go" data-v="ficha" data-k="enc" data-id="${id}">${ic('doc')} Ficha técnica</button></div>
  <div class="sec"><h2>Composição</h2>
    ${c.partes.map(p=>lin(esc(p.r.nome),brl(p.custo),`${p.r.tipo} · ${fq(p.g,'g')}`)).join('')}
    ${c.itens.map(p=>lin(esc(p.i.nome),brl(p.custo),fq(p.qtd,p.i.un))).join('')}
    <details class="more" style="margin-top:8px"><summary>Ingredientes para fazer ${ic('chev')}</summary>
    ${ins.map(x=>{const fl=x.q-x.i.est;return lin(esc(x.i.nome),fq(x.q,x.i.un),fl>0.0001?`<span class="short">Estoque: ${fq(Math.max(0,x.i.est),x.i.un)} (faltam ${fq(fl,x.i.un)})</span>`:`Estoque: ${fq(x.i.est,x.i.un)}`)}).join('')}
    <button class="btn block sm" style="margin-top:10px" data-act="produzir" data-k="enc" data-id="${id}">${ic('box')} Produzi este bolo: tirar do estoque</button></details></div>
  <div class="sec"><h2>Como chegar no preço</h2>
    ${lin('Ingredientes',brl(c.ingr))}${c.extras?lin('Embalagem e extras',brl(c.extras)):''}
    ${S.cfg.gas?lin('Gás e energia',brl(c.gas),`${e.forno||0} min de forno`):''}${S.cfg.fixo?lin('Custos fixos',brl(c.fixo)):''}
    <div class="line total"><span>Custo do bolo</span><span class="num">${brl(c.custo)}</span></div>
    ${lin(`Margem de ${num(e.margem,1)}%`,'+ '+brl(c.margemV))}${e.mao?lin('Mão de obra adicional','+ '+brl(e.mao)):''}${e.outros?lin('Outros valores','+ '+brl(e.outros)):''}
    <div class="line total"><span>Preço sugerido</span><span class="num">${brl(c.preco)}</span></div>
    ${lin('Preço sugerido por kg',brl(c.porKg))}
    ${c.t?lin('Pelo cardápio',brl(c.precoTab),`${num(c.peso,2)} kg × ${brl(c.t.kg)}`):''}
    <div class="line result"><span>Valor combinado</span><span class="num">${brl(e.valor)}</span></div></div>
  <div class="sec"><h2>Pagamentos</h2>${[...e.pags].sort(byDate).reverse().map(p=>`<div class="line"><span>${fdate(p.data)}</span><span class="num">${brl(p.valor)}</span></div>`).join('')||'<p class="sub" style="margin:0">Nenhum pagamento ainda.</p>'}
    <div class="line total"><span>Pago</span><span class="num">${brl(pago)}</span></div></div>
  <button class="btn danger block" data-act="del" data-k="enc" data-id="${id}">Apagar encomenda</button>`;
};

V.ajustes=()=>{const g=S.cfg;
  return `<div class="head"><h1>Ajustes</h1></div>
  <div class="sec"><h2>Custo dos insumos</h2><div class="radio">
    <label><input type="radio" name="met" value="repos" data-live="cfg" data-k="metodo"${g.metodo==='repos'?' checked':''}><span><b>Preço da última compra</b><small>Mostra quanto custa repor hoje. Recomendado.</small></span></label>
    <label><input type="radio" name="met" value="medio" data-live="cfg" data-k="metodo"${g.metodo==='medio'?' checked':''}><span><b>Custo médio</b><small>Média de todas as compras registradas.</small></span></label></div></div>
  <div class="sec"><h2>Padrões para bolos novos</h2>
    <div class="field"><label for="cf-mg">Margem de lucro</label><div class="inp-wrap"><input class="inp" id="cf-mg" inputmode="decimal" value="${num(g.margem,1)}" data-live="cfgn" data-k="margem"><span class="unit">%</span></div></div>
    <div class="field"><label for="cf-mo">Mão de obra</label><div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="cf-mo" inputmode="decimal" value="${num(g.mao,2)}" data-live="cfgn" data-k="mao"></div></div></div>
  <div class="sec"><h2>Divisão do bolo</h2><p class="sub" style="margin:0 0 12px">Ao montar uma encomenda, o peso é dividido assim. O recheio fica com o restante.</p>
    <div class="field"><label for="cf-pm">Massa</label><div class="inp-wrap"><input class="inp" id="cf-pm" inputmode="decimal" value="${num(g.prop.massa,1)}" data-live="prop" data-k="massa"><span class="unit">%</span></div></div>
    <div class="field"><label for="cf-pa">Adicional (quando tiver)</label><div class="inp-wrap"><input class="inp" id="cf-pa" inputmode="decimal" value="${num(g.prop.adicional,1)}" data-live="prop" data-k="adicional"><span class="unit">%</span></div></div>
    <p class="sub" style="margin:0">Recheio: ${num(100-g.prop.massa-g.prop.adicional,1)}% com adicional, ${num(100-g.prop.massa,1)}% sem.</p></div>
  <div class="sec"><h2>Gás e energia</h2>
    <label class="switch"><span>Incluir no custo dos bolos</span><input type="checkbox" id="cf-gas" data-live="cfgb" data-k="gas"${g.gas?' checked':''}></label>
    ${g.gas?`<div class="field"><label for="cf-gh">Custo por hora de forno</label><div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="cf-gh" inputmode="decimal" value="${num(g.gasHora,2)}" data-live="cfgn" data-k="gasHora"></div><span class="help">Exemplo: botijão de R$ 120 que dura 20 horas de forno = R$ 6 por hora.</span></div>`:''}</div>
  <div class="sec"><h2>Custos fixos do mês</h2>
    <label class="switch"><span>Dividir entre os bolos</span><input type="checkbox" id="cf-fx" data-live="cfgb" data-k="fixo"${g.fixo?' checked':''}></label>
    ${g.fixo?`<div class="field"><label for="cf-fm">Total por mês</label><div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="cf-fm" inputmode="decimal" value="${num(g.fixoMes,2)}" data-live="cfgn" data-k="fixoMes"></div><span class="help">Internet, utensílios, parte da conta de luz.</span></div>
    <div class="field"><label for="cf-bm">Bolos por mês, em média</label><input class="inp" id="cf-bm" inputmode="numeric" value="${g.bolosMes}" data-live="cfgn" data-k="bolosMes"></div>`:''}</div>
  <div class="sec"><h2>Valores do cardápio</h2>${g.tab.map(t=>`<div class="field"><label for="tb-${t.id}">${esc(t.nome)}</label><div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="tb-${t.id}" inputmode="decimal" value="${num(t.kg,2)}" data-live="tabkg" data-id="${t.id}"><span class="unit">/kg</span></div></div>`).join('')}</div>
  <div class="sec"><h2>Backup</h2><p class="sub" style="margin:0 0 12px">Os dados ficam só neste celular. Faça um backup toda semana e guarde no WhatsApp ou no Google Drive.${S.cfg.ultimoBackup?` Último backup: ${fdate(S.cfg.ultimoBackup)}.`:''}</p>
    <div class="row-btns" style="margin:0"><button class="btn primary" data-act="backup">Fazer backup</button><label class="btn" for="restore">Restaurar backup</label><input type="file" id="restore" accept=".json,application/json" hidden></div></div>
  ${S.exemplo?`<button class="btn danger block" data-act="limpar">${armed==='limpar'?'Toque de novo: apaga os exemplos':'Apagar exemplos e começar do zero'}</button>`:''}
  <p class="version">Versão ${VERSION}</p>`;
};

/* ---------- gráfico ---------- */
function drawChart(i){
  const el=$('#chart');if(!el||!i)return;
  const cs=[...i.compras].sort(byDate);let q=0,p=0;
  const pts=cs.map(c=>{q+=c.qtd;p+=c.preco;return {d:c.data,t:new Date(c.data+'T12:00:00').getTime(),v:perBig(i,c.preco/c.qtd),m:perBig(i,p/q)}});
  const W=340,H=170,L=52,Rr=12,T=12,Bm=26;
  const vs=pts.flatMap(x=>[x.v,x.m]);let lo=Math.min(...vs),hi=Math.max(...vs);const pad=(hi-lo)*.15||hi*.1;lo=Math.max(0,lo-pad);hi=hi+pad;
  const step=niceStep((hi-lo)/3);lo=Math.floor(lo/step)*step;hi=Math.ceil(hi/step)*step;
  const t0=pts[0].t,t1=pts[pts.length-1].t||t0+1;
  const X=t=>L+(t1===t0?0.5:(t-t0)/(t1-t0))*(W-L-Rr),Y=v=>T+(1-(v-lo)/(hi-lo))*(H-T-Bm);
  let g='';for(let v=lo;v<=hi+1e-9;v+=step){g+=`<line class="grid" x1="${L}" x2="${W-Rr}" y1="${Y(v)}" y2="${Y(v)}"/><text class="axis" x="${L-6}" y="${Y(v)+4}" text-anchor="end">${brl(v).replace(/,00$/,'')}</text>`}
  const path=k=>pts.map((x,j)=>(j?'L':'M')+X(x.t).toFixed(1)+' '+Y(x[k]).toFixed(1)).join('');
  const lab=[pts[0],pts[pts.length-1]].map((x,j)=>`<text class="axis" x="${X(x.t)}" y="${H-6}" text-anchor="${j?'end':'start'}">${fdate(x.d)}</text>`).join('');
  const dots=pts.map(x=>`<circle cx="${X(x.t)}" cy="${Y(x.v)}" r="4.5" fill="var(--s1)" stroke="var(--surface)" stroke-width="2"/>`).join('');
  el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Preço pago e custo médio de ${esc(i.nome)}">${g}${lab}
   <path d="${path('m')}" fill="none" stroke="var(--s2)" stroke-width="2" stroke-dasharray="5 4"/>
   <path d="${path('v')}" fill="none" stroke="var(--s1)" stroke-width="2.2"/>${dots}
   <g id="hl" style="display:none"><line id="hl-l" y1="${T}" y2="${H-Bm}" stroke="var(--muted)" stroke-width="1"/><circle id="hl-c" r="7" fill="none" stroke="var(--s1)" stroke-width="2"/></g>
   <rect x="${L}" y="0" width="${W-L}" height="${H}" fill="transparent" id="hit"/></svg>`;
  const svg=el.querySelector('svg'),u=BIG[i.un];
  const show=e=>{const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*W;let best=pts[0],bd=1e9;pts.forEach(pp=>{const d=Math.abs(X(pp.t)-x);if(d<bd){bd=d;best=pp}});
    const hl=svg.querySelector('#hl');hl.style.display='';svg.querySelector('#hl-l').setAttribute('x1',X(best.t));svg.querySelector('#hl-l').setAttribute('x2',X(best.t));
    const c=svg.querySelector('#hl-c');c.setAttribute('cx',X(best.t));c.setAttribute('cy',Y(best.v));
    $('#tip').textContent=`${fdate(best.d)}: pagou ${brl(best.v)}/${u} · custo médio ${brl(best.m)}/${u}`};
  svg.addEventListener('pointermove',show);svg.addEventListener('pointerdown',show);
}
function niceStep(x){const p=Math.pow(10,Math.floor(Math.log10(x||1)));const n=x/p;return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p}

/* ---------- formulários ---------- */
function sheet(html,onSubmit){$('#sheet-in').innerHTML=html;$('#sheet').hidden=false;const f=$('#sheet-in form');
  f.addEventListener('submit',e=>{e.preventDefault();if(onSubmit(new FormData(f),f)!==false){closeSheet();render()}});
  const first=f.querySelector('input:not([type=hidden]),select');if(first)setTimeout(()=>first.focus(),50)}
function closeSheet(){$('#sheet').hidden=true;$('#sheet-in').innerHTML=''}
const actions=(del='')=>`<div class="row-btns"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn primary">Salvar</button></div>${del}`;
function toast(t){const el=$('#toast');el.textContent=t;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2600)}
const fld=(id,label,inner,help='')=>`<div class="field"><label for="${id}">${label}</label>${inner}${help?`<span class="help">${help}</span>`:''}</div>`;
const insOpts=(sel)=>{const ids=new Set(S.cats.map(c=>c.id));const all=Object.values(S.ins);
  return [...S.cats.map(c=>({n:c.nome,its:all.filter(i=>i.cat===c.id)})),{n:'Sem categoria',its:all.filter(i=>!ids.has(i.cat))}].filter(g=>g.its.length)
  .map(g=>`<optgroup label="${esc(g.n)}">${g.its.sort((a,b)=>a.nome.localeCompare(b.nome)).map(i=>`<option value="${i.id}"${i.id===sel?' selected':''}>${esc(i.nome)} (${i.un})</option>`).join('')}</optgroup>`).join('')};
const recOpts=(sel)=>Object.values(S.rec).sort((a,b)=>a.tipo.localeCompare(b.tipo)||a.nome.localeCompare(b.nome)).map(r=>`<option value="${r.id}"${r.id===sel?' selected':''}>${r.tipo}: ${esc(r.nome)}</option>`).join('');
const unitSel=(u,name='uq')=>`<select class="inp" name="${name}" style="max-width:96px">${u==='g'?'<option value="1">g</option><option value="1000">kg</option>':u==='ml'?'<option value="1">ml</option><option value="1000">L</option>':'<option value="1">un</option>'}</select>`;

function formIns(id){const i=S.ins[id];const cat0=i?i.cat:(catFiltro!=='Todos'?catFiltro:S.cats[0]?.id||'');
  sheet(`<form><h2>${i?'Editar insumo':'Novo insumo'}</h2>
  ${fld('f-n','Nome',`<input class="inp" id="f-n" name="nome" required value="${esc(i?.nome)}" placeholder="Ex.: Leite condensado">`)}
  ${fld('f-c','Categoria',`<select class="inp" id="f-c" name="cat">${S.cats.map(c=>`<option value="${c.id}"${c.id===cat0?' selected':''}>${esc(c.nome)}</option>`).join('')}<option value=""${!S.cats.some(c=>c.id===cat0)?' selected':''}>Sem categoria</option><option value="__new">+ Criar nova categoria</option></select>`)}
  <div class="field" id="nc-w" hidden><label for="f-nc">Nome da nova categoria</label><input class="inp" id="f-nc" name="newcat" placeholder="Ex.: Descartáveis"></div>
  ${fld('f-u','Como é medido',`<select class="inp" id="f-u" name="un"${i?' disabled':''}>${['g','ml','un'].map(u=>`<option value="${u}"${i?.un===u?' selected':''}>${u==='g'?'Peso (g ou kg)':u==='ml'?'Volume (ml ou litro)':'Unidade (ovos, caixas)'}</option>`).join('')}</select>`,i?'A medida não muda depois de criado.':'')}
  ${i?'':`<p class="lbl" style="margin:4px 0 8px">Primeira compra</p><div class="inp-wrap" style="margin-bottom:14px"><input class="inp" name="q" inputmode="decimal" placeholder="Quantidade" aria-label="Quantidade" required><select class="inp" name="uq" id="f-uq" style="max-width:96px"><option value="1">g</option><option value="1000">kg</option></select></div>
  ${fld('f-p','Preço pago',`<div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="f-p" name="p" inputmode="decimal" required placeholder="0,00"></div>`)}`}
  ${actions(i?`<button type="button" class="btn danger block" data-act="del" data-k="ins" data-id="${id}">Apagar insumo</button>`:'')}</form>`,fd=>{
    let cat=fd.get('cat');if(cat==='__new'){const n=String(fd.get('newcat')||'').trim();if(!n){toast('Digite o nome da nova categoria');return false}cat=uid();S.cats.push({id:cat,nome:n})}
    if(i){i.nome=fd.get('nome').trim();i.cat=cat;toast('Insumo salvo');save();return}
    const un=fd.get('un'),q=pfd(fd.get('q'))*pf(fd.get('uq')),p=pfd(fd.get('p'));if(!q||!p){toast('Preencha quantidade e preço');return false}
    const nid=uid();S.ins[nid]={id:nid,nome:fd.get('nome').trim(),un,cat,est:q,compras:[{id:uid(),data:today(),qtd:q,preco:p}]};save();toast('Insumo cadastrado')});
  $('#f-c').addEventListener('change',e=>{$('#nc-w').hidden=e.target.value!=='__new';if(e.target.value==='__new')$('#f-nc').focus()});
  if(!i){const u=$('#f-u');u.addEventListener('change',()=>{$('#f-uq').outerHTML=unitSel(u.value).replace('<select','<select id="f-uq"')})}
}
function formCompra(id){const i=S.ins[id];
  sheet(`<form><h2>Compra de ${esc(i.nome)}</h2>
  <p class="lbl" style="margin:0 0 8px">Quanto comprou</p><div class="inp-wrap" style="margin-bottom:14px"><input class="inp" name="q" inputmode="decimal" required placeholder="Ex.: 395" aria-label="Quantidade">${unitSel(i.un)}</div>
  ${fld('c-p','Quanto pagou (total)',`<div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="c-p" name="p" inputmode="decimal" required placeholder="0,00"></div>`)}
  ${fld('c-d','Data',`<input class="inp" type="date" id="c-d" name="d" value="${today()}">`)}
  <label class="switch"><span>Somar ao estoque</span><input type="checkbox" name="est" checked></label>
  ${actions()}</form>`,fd=>{const q=pfd(fd.get('q'))*pf(fd.get('uq')),p=pfd(fd.get('p'));if(!q||!p){toast('Preencha quantidade e preço');return false}
    i.compras.push({id:uid(),data:fd.get('d')||today(),qtd:q,preco:p});if(fd.get('est'))i.est+=q;save();toast('Compra registrada')});
}
function formEst(id){const i=S.ins[id];
  sheet(`<form><h2>Estoque de ${esc(i.nome)}</h2>${fld('e-q',`Quanto tem agora (${i.un})`,`<input class="inp" id="e-q" name="q" inputmode="decimal" value="${num(i.est,1)}">`,'O estoque é só um controle. Ele nunca impede de produzir.')}${actions()}</form>`,
  fd=>{i.est=pfd(fd.get('q'));save();toast('Estoque atualizado')});
}
function rowsHtml(kind,list){return list.map(x=>rowHtml(kind,x)).join('')}
function rowHtml(kind,x={}){
  if(kind==='ri')return `<div class="irow"><select class="inp" name="ri" aria-label="Insumo">${insOpts(x.ins)}</select><input class="inp" name="rq" inputmode="decimal" placeholder="Qtd." value="${x.qtd!=null?num(x.qtd,2):''}" aria-label="Quantidade (g, ml ou un)"><button type="button" class="rm" data-act="rmrow" aria-label="Remover">${ic('x')}</button></div>`;
  if(kind==='bp')return `<div class="irow"><select class="inp" name="bp" aria-label="Receita">${recOpts(x.rec)}</select><input class="inp" name="bg" inputmode="decimal" placeholder="Gramas" value="${x.g!=null?num(x.g):''}" aria-label="Gramas"><button type="button" class="rm" data-act="rmrow" aria-label="Remover">${ic('x')}</button></div>`;
  return `<div class="irow"><select class="inp" name="bi" aria-label="Item">${insOpts(x.ins)}</select><input class="inp" name="bq" inputmode="decimal" placeholder="Qtd." value="${x.qtd!=null?num(x.qtd,2):''}" aria-label="Quantidade"><button type="button" class="rm" data-act="rmrow" aria-label="Remover">${ic('x')}</button></div>`;
}
function formRec(id){const r=S.rec[id];
  sheet(`<form><h2>${r?'Editar receita':'Nova receita'}</h2>
  ${fld('r-n','Nome',`<input class="inp" id="r-n" name="nome" required value="${esc(r?.nome)}" placeholder="Ex.: Brigadeiro de coco">`)}
  ${fld('r-t','Tipo',`<select class="inp" id="r-t" name="tipo">${['Massa','Recheio','Adicional','Cobertura'].map(t=>`<option${r?.tipo===t?' selected':''}>${t}</option>`).join('')}</select>`)}
  <p class="lbl" style="margin:4px 0 4px">Ingredientes</p><p class="sub" style="margin:0 0 8px">Quantidade em g, ml ou unidades, conforme o insumo.</p>
  <div id="rows">${rowsHtml('ri',r?r.itens:[{}])}</div><button type="button" class="btn sm" data-act="addrow" data-k="ri">${ic('plus')} Ingrediente</button>
  <div style="height:14px"></div>
  ${fld('r-r','Quanto rende (pronto)',`<div class="inp-wrap"><input class="inp" id="r-r" name="rend" inputmode="decimal" required value="${r?num(r.rend):''}" placeholder="Ex.: 1000"><span class="unit">g</span></div>`,'Pese a receita depois de pronta. É o que entra no bolo.')}
  <div class="aviso" id="rec-aviso" hidden></div>
  ${actions(r?`<button type="button" class="btn danger block" data-act="del" data-k="rec" data-id="${id}">Apagar receita</button>`:'')}</form>`,(fd,f)=>{
    const ri=fd.getAll('ri'),rq=fd.getAll('rq');const itens=ri.map((x,j)=>({ins:x,qtd:pfd(rq[j])})).filter(x=>x.qtd>0);
    const o={nome:fd.get('nome').trim(),tipo:fd.get('tipo'),rend:pfd(fd.get('rend')),itens};if(!o.rend||!itens.length){toast('Informe ingredientes e rendimento');return false}
    const avisos=avisosRec(o),assin=JSON.stringify(o);
    if(avisos.length&&f.dataset.ok!==assin){f.dataset.ok=assin;const box=$('#rec-aviso');
      box.innerHTML=`<p class="t">${ic('alert')} Confira antes de salvar</p>${avisos.map(a=>`<p>${a}</p>`).join('')}<p class="s">Se estiver certo, toque em Salvar mesmo assim.</p>`;
      box.hidden=false;f.querySelector('.btn.primary').textContent='Salvar mesmo assim';box.scrollIntoView({behavior:'smooth',block:'center'});return false}
    if(r)Object.assign(r,o);else{const nid=uid();S.rec[nid]={id:nid,...o}}save();toast('Receita salva')});
  const f=$('#sheet-in form');f.addEventListener('input',()=>{if(f.dataset.ok){delete f.dataset.ok;$('#rec-aviso').hidden=true;f.querySelector('.btn.primary').textContent='Salvar'}});
}
/* Avisos de cadastro: pegam erros comuns, como rendimento em kg no campo de gramas ou ingrediente repetido. */
function avisosRec(o){const av=[];
  const cont={};o.itens.forEach(it=>cont[it.ins]=(cont[it.ins]||0)+1);
  Object.keys(cont).filter(k=>cont[k]>1&&S.ins[k]).forEach(k=>av.push(`<b>${esc(S.ins[k].nome)}</b> aparece ${cont[k]} vezes. Veja se um deles não era outro ingrediente.`));
  const peso=o.itens.reduce((s,it)=>{const i=S.ins[it.ins];return s+(i&&i.un!=='un'?it.qtd:0)},0);
  if(peso>0&&o.rend<peso*0.3)av.push(`Os ingredientes somam ${fq(peso,'g')}, mas o rendimento está ${fq(o.rend,'g')}. O rendimento é em <b>gramas</b>: 1 kg = 1000 g.`);
  return av}
function formBolo(id){const b=S.bolos[id];
  sheet(`<form><h2>${b?'Editar modelo':'Novo modelo de bolo'}</h2>
  ${fld('b-n','Nome do bolo',`<input class="inp" id="b-n" name="nome" required value="${esc(b?.nome)}" placeholder="Ex.: Ninho com morango">`)}
  <p class="lbl" style="margin:4px 0 4px">Massas, recheios e adicionais</p><p class="sub" style="margin:0 0 8px">Quantos gramas de cada receita vão no bolo.</p>
  <div id="rows">${rowsHtml('bp',b?b.partes:[{}])}</div><button type="button" class="btn sm" data-act="addrow" data-k="bp">${ic('plus')} Receita</button>
  <p class="lbl" style="margin:18px 0 8px">Embalagem e extras</p>
  <div id="rows2">${rowsHtml('bi',b?b.itens:[])}</div><button type="button" class="btn sm" data-act="addrow" data-k="bi" data-to="rows2">${ic('plus')} Item</button>
  <div style="height:14px"></div>
  ${S.cfg.gas?fld('b-f','Tempo de forno',`<div class="inp-wrap"><input class="inp" id="b-f" name="forno" inputmode="numeric" value="${b?.forno??40}"><span class="unit">min</span></div>`):''}
  ${actions(b?`<button type="button" class="btn danger block" data-act="del" data-k="bolos" data-id="${id}">Apagar modelo</button>`:'')}</form>`,fd=>{
    const bp=fd.getAll('bp'),bg=fd.getAll('bg'),bi=fd.getAll('bi'),bq=fd.getAll('bq');
    const partes=bp.map((x,j)=>({rec:x,g:pfd(bg[j])})).filter(x=>x.g>0);const itens=bi.map((x,j)=>({ins:x,qtd:pfd(bq[j])})).filter(x=>x.qtd>0);
    if(!partes.length){toast('Adicione pelo menos uma receita com gramas');return false}
    const o={nome:fd.get('nome').trim(),partes,itens,forno:fd.has('forno')?pfd(fd.get('forno')):(b?.forno||0)};
    if(b){Object.assign(b,o);delete escala[id]}else{const nid=uid();S.bolos[nid]={id:nid,...o,margem:S.cfg.margem,mao:S.cfg.mao,outros:0,tab:S.cfg.tab[0]?.id||''};stack.push({t:'bolo',id:nid})}
    save();toast('Modelo salvo')});
}
function encFrom(fd){
  encFrom.erro='';
  const modelo=fd.get('modelo')||'';let peso=pfd(fd.get('peso'));const bq=fd.getAll('bq');const md=S.bolos[modelo];
  const qg=k=>pfd(fd.get('q'+k))*(pf(fd.get('u'+k))||1);
  const rs=modelo?[]:[1,2,3].map(k=>({rec:fd.get('r'+k),g:qg(k)})).filter(x=>x.rec);
  const o={modelo,massa:modelo?'':(fd.get('massa')||''),recheios:rs.map(x=>x.rec),adicional:modelo?'':(fd.get('ad')||''),peso,
    itens:fd.getAll('bi').map((x,j)=>({ins:x,qtd:pfd(bq[j])})).filter(x=>x.qtd>0),
    forno:fd.has('forno')?pfd(fd.get('forno')):(md?.forno??45),margem:pfd(fd.get('margem')),mao:pfd(fd.get('mao')),outros:pfd(fd.get('outros')),tab:fd.get('tab')||''};
  if(!modelo){const man={massa:qg('m'),rec:rs.map(x=>x.g),ad:o.adicional?qg('a'):0};const qs=[man.massa,...man.rec,...(o.adicional?[man.ad]:[])];
    o.man=qs.some(q=>q>0)?man:undefined;
    const soma=qs.reduce((s,q)=>s+q,0);
    if(qs.length&&qs.every(q=>q>0))o.peso=peso=soma/1000;
    else if(o.man&&peso>0&&soma>=peso*1000){encFrom.erro='As quantidades preenchidas já somam o peso do bolo. Aumente o peso ou preencha todas as partes.';return null}}
  if(!(peso>0)||(!modelo&&(!o.massa||!o.recheios.length)))return null;
  o.partes=montar(o,S.cfg.prop,S.bolos);return o.partes.length?o:null;
}
/* quantidade usada de uma parte da encomenda: em branco = automático */
const qRow=(k,sel,g)=>`<div class="inp-wrap qrow" data-for="${sel}"><input class="inp" name="q${k}" inputmode="decimal" placeholder="Automático" value="${g>0?Math.round(g):''}" aria-label="Quantidade usada"><select class="inp" name="u${k}" aria-label="Unidade"><option value="1">g</option><option value="1000">kg</option></select></div>`;
function formEnc(id,modeloId){
  const e=S.enc[id];const m=S.bolos[e?.modelo||modeloId||''];
  const recsOf=t=>Object.values(S.rec).filter(r=>r.tipo===t).sort((a,b)=>a.nome.localeCompare(b.nome));
  const opt=(list,sel,none)=>(none?`<option value="">${none}</option>`:'')+list.map(r=>`<option value="${r.id}"${r.id===sel?' selected':''}>${esc(r.nome)}</option>`).join('');
  const peso0=e?e.peso:(m?+calcBolo(m).peso.toFixed(2):2);
  const src=e||m||{margem:S.cfg.margem,mao:S.cfg.mao,outros:0,itens:S.cfg.emb,forno:45};
  const ent0=e?e.entrega:(()=>{const t=new Date();t.setDate(t.getDate()+3);return localISO(t)})();
  sheet(`<form id="enc-f"><h2>${e?'Editar encomenda':'Nova encomenda'}</h2>
  <h3 class="grp-h" style="margin-top:0">Cliente</h3>
  ${fld('n-c','Nome',`<input class="inp" id="n-c" name="cliente" required value="${esc(e?.cliente)}" placeholder="Nome da cliente">`)}
  ${fld('n-t','WhatsApp (com DDD)',`<input class="inp" id="n-t" name="tel" inputmode="tel" value="${esc(e?.tel)}" placeholder="47 99999-0000">`)}
  ${fld('n-e','Data de entrega',`<input class="inp" type="date" id="n-e" name="entrega" value="${ent0}" required>`)}
  <h3 class="grp-h">Bolo</h3>
  ${fld('n-m','Modelo',`<select class="inp" id="n-m" name="modelo"><option value="">Montar agora (massa + recheio)</option>${Object.values(S.bolos).map(b=>`<option value="${b.id}"${b.id===m?.id?' selected':''}>${esc(b.nome)}</option>`).join('')}</select>`)}
  <div id="montar"${m?' hidden':''}>
   <p class="sub" style="margin:0 0 12px;font-size:14px">Em branco, o app divide o peso do bolo sozinho. Se quiser, coloque quanto usou de cada parte.</p>
   ${fld('n-ma','Massa',`<select class="inp" id="n-ma" name="massa">${opt(recsOf('Massa'),e?.massa)}</select>${qRow('m','massa',e?.man?.massa)}`)}
   ${fld('n-r1','Recheio',`<select class="inp" id="n-r1" name="r1">${opt(recsOf('Recheio'),e?.recheios?.[0])}</select>${qRow('1','r1',e?.man?.rec?.[0])}`)}
   ${fld('n-r2','Segundo recheio',`<select class="inp" id="n-r2" name="r2">${opt(recsOf('Recheio'),e?.recheios?.[1],'Nenhum')}</select>${qRow('2','r2',e?.man?.rec?.[1])}`)}
   ${fld('n-r3','Terceiro recheio',`<select class="inp" id="n-r3" name="r3">${opt(recsOf('Recheio'),e?.recheios?.[2],'Nenhum')}</select>${qRow('3','r3',e?.man?.rec?.[2])}`)}
   ${fld('n-ad','Adicional',`<select class="inp" id="n-ad" name="ad">${opt(recsOf('Adicional'),e?.adicional,'Nenhum')}</select>${qRow('a','ad',e?.man?.ad)}`)}
  </div>
  ${fld('n-p','Peso do bolo',`<div class="inp-wrap"><input class="inp" id="n-p" name="peso" inputmode="decimal" value="${num(peso0,2)}" required><span class="unit">kg</span></div>`)}
  <p class="sub" id="n-div" style="margin:-6px 0 14px;font-size:13.5px"></p>
  <p class="lbl" style="margin:0 0 8px">Embalagem e extras</p>
  <div id="rows2">${rowsHtml('bi',src.itens||[])}</div><button type="button" class="btn sm" data-act="addrow" data-k="bi" data-to="rows2">${ic('plus')} Item</button>
  <div style="height:14px"></div>
  ${S.cfg.gas?fld('n-f','Tempo de forno',`<div class="inp-wrap"><input class="inp" id="n-f" name="forno" inputmode="numeric" value="${src.forno??45}"><span class="unit">min</span></div>`):''}
  <h3 class="grp-h">Valor</h3>
  ${fld('n-mg','Margem de lucro',`<div class="inp-wrap"><input class="inp" id="n-mg" name="margem" inputmode="decimal" value="${num(src.margem,1)}"><span class="unit">%</span></div>`)}
  ${fld('n-mo','Mão de obra adicional',`<div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="n-mo" name="mao" inputmode="decimal" value="${num(src.mao,2)}"></div>`)}
  ${fld('n-ou','Outros valores adicionais',`<div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="n-ou" name="outros" inputmode="decimal" value="${num(src.outros||0,2)}"></div>`,'Topper, decoração especial, entrega.')}
  ${fld('n-tb','Preço do cardápio',`<select class="inp" id="n-tb" name="tab"><option value="">Não usar cardápio</option>${S.cfg.tab.map(t=>`<option value="${t.id}"${t.id===(e?.tab??m?.tab)?' selected':''}>${esc(t.nome)} · ${brl(t.kg)}/kg</option>`).join('')}</select>`)}
  <div class="sec" id="enc-sum" style="background:var(--bg)"></div>
  ${fld('n-v','Valor combinado com a cliente',`<div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="n-v" name="valor" inputmode="decimal" required value="${e?num(e.valor,2):''}"></div>`,'Começa com o valor do cardápio. Mude se combinou outro preço.')}
  ${e?'':fld('n-s','Sinal já recebido',`<div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="n-s" name="sinal" inputmode="decimal" placeholder="0,00"></div>`)}
  ${actions(e?`<button type="button" class="btn danger block" data-act="del" data-k="enc" data-id="${id}">Apagar encomenda</button>`:'')}</form>`,fd=>{
    const o=encFrom(fd);if(!o){toast(encFrom.erro||'Escolha massa, recheio e o peso');return false}
    const valor=pfd(fd.get('valor'));if(!valor){toast('Informe o valor combinado');return false}
    const base={cliente:String(fd.get('cliente')).trim(),tel:fd.get('tel'),entrega:fd.get('entrega')||today(),valor};
    if(e){Object.assign(e,o,base);toast('Encomenda salva')}
    else{const nid=uid();const s=pfd(fd.get('sinal'));S.enc[nid]={id:nid,criado:today(),status:'afazer',pags:s?[{id:uid(),data:today(),valor:s}]:[],...o,...base};stack.push({t:'enc',id:nid});toast('Encomenda criada')}
    save()});
  const f=$('#enc-f'),F=n=>f.elements.namedItem(n);let tVal=!!e,tTab=!!e||!!m;
  const upd=()=>{const mod=F('modelo').value;$('#montar').hidden=!!mod;
    if(!tTab){const md=S.bolos[mod];const want=md?md.tab:(F('ad').value?'t2':'t1');if(S.cfg.tab.some(t=>t.id===want))F('tab').value=want}
    f.querySelectorAll('.qrow').forEach(q=>q.hidden=!F(q.dataset.for).value);
    const o=encFrom(new FormData(f));
    if(!o){$('#enc-sum').innerHTML=`<p class="sub" style="margin:0${encFrom.erro?';color:var(--bad);font-weight:600':''}">${encFrom.erro||'Escolha massa, recheio e peso para ver o preço.'}</p>`;$('#n-div').textContent='';return}
    if(!mod){const pk=o.peso.toFixed(2);if(o.man&&pfd(F('peso').value).toFixed(2)!==pk&&[...f.querySelectorAll('.qrow:not([hidden]) input')].every(i=>pfd(i.value)>0))F('peso').value=num(o.peso,2);
      const gs=[o.massa,...o.recheios,...(o.adicional?[o.adicional]:[])].map((r,j)=>o.partes[j]?.g);let j=0;
      f.querySelectorAll('.qrow:not([hidden]) input').forEach(i=>{const g=gs[j++];i.placeholder=g?`Automático: ${fq(g,'g')}`:'Automático'})}
    $('#n-div').textContent=o.partes.map(p=>`${S.rec[p.rec]?.nome}: ${fq(p.g,'g')}`).join(' · ');
    const c=calcBolo(o);
    if(!tVal)F('valor').value=num(c.t?c.precoTab:c.preco,2);
    const v=pfd(F('valor').value),g=v-c.custo;
    $('#enc-sum').innerHTML=`<div class="line"><span>Custo do bolo</span><span class="num">${brl(c.custo)}</span></div>
     <div class="line"><span class="l">Preço sugerido<small>${brl(c.porKg)}/kg com margem e mão de obra</small></span><span class="num">${brl(c.preco)}</span></div>
     ${c.t?`<div class="line"><span class="l">Pelo cardápio<small>${num(c.peso,2)} kg × ${brl(c.t.kg)}</small></span><span class="num">${brl(c.precoTab)}</span></div>`:''}
     <div class="line total"><span>Seu ganho com o valor combinado</span><span class="num" style="color:var(${g<=0?'--bad':'--good'})">${brl(g)}</span></div>`};
  f.addEventListener('input',ev=>{const n=ev.target.name;if(n==='valor')tVal=true;if(n==='tab')tTab=true;upd()});
  f.addEventListener('change',ev=>{const n=ev.target.name;if(n==='tab')tTab=true;
    if(n==='modelo'&&ev.target.value&&!e){const md=S.bolos[ev.target.value];F('peso').value=num(calcBolo(md).peso,2);F('margem').value=num(md.margem,1);F('mao').value=num(md.mao,2);F('outros').value=num(md.outros||0,2);$('#rows2').innerHTML=rowsHtml('bi',md.itens);if(F('forno'))F('forno').value=md.forno||0}
    upd()});
  upd();
}
function formPag(id){const e=S.enc[id];const {falta}=saldo(e);
  sheet(`<form><h2>Pagamento de ${esc(e.cliente)}</h2>
  ${fld('p-v','Valor recebido',`<div class="inp-wrap"><span class="unit">R$</span><input class="inp" id="p-v" name="v" inputmode="decimal" required placeholder="${num(falta,2)}"></div>`,`Falta ${brl(falta)}.`)}
  ${fld('p-d','Data',`<input class="inp" type="date" id="p-d" name="d" value="${today()}">`)}${actions()}</form>`,
  fd=>{const v=pfd(fd.get('v'));if(!v){toast('Informe o valor');return false}e.pags.push({id:uid(),data:fd.get('d')||today(),valor:v});save();toast(v>=falta-0.009?'Encomenda quitada':'Pagamento registrado')});
}
const catRow=(c={})=>`<div class="irow" style="grid-template-columns:1fr 44px"><input type="hidden" name="cid" value="${c.id||''}"><input class="inp" name="cn" value="${esc(c.nome||'')}" placeholder="Nome da categoria" aria-label="Nome da categoria"><button type="button" class="rm" data-act="rmrow" aria-label="Apagar categoria">${ic('x')}</button></div>`;
function formCats(){
  sheet(`<form><h2>Categorias de insumos</h2><p class="sub" style="margin:0 0 12px">Mude os nomes, apague ou crie categorias. Insumos de uma categoria apagada vão para "Sem categoria".</p>
  <div id="cat-rows">${S.cats.map(catRow).join('')}</div>
  <button type="button" class="btn sm" data-act="addcat">${ic('plus')} Nova categoria</button>${actions()}</form>`,fd=>{
    const ids=fd.getAll('cid'),ns=fd.getAll('cn');const nc=[];ids.forEach((id,j)=>{const n=String(ns[j]||'').trim();if(n)nc.push({id:id||uid(),nome:n})});
    const ok=new Set(nc.map(c=>c.id));Object.values(S.ins).forEach(i=>{if(!ok.has(i.cat))i.cat=''});
    S.cats=nc;if(catFiltro!=='Todos'&&!ok.has(catFiltro))catFiltro='Todos';save();toast('Categorias salvas')});
}

/* ---------- ações ---------- */
const A={
  tab:d=>{tab=d.t;stack=[];armed=null;closeSheet();render();scrollTo(0,0)},
  go:d=>go({t:d.v,id:d.id,k:d.k}), back:()=>back(), close:()=>closeSheet(),
  formIns:d=>formIns(d.id), formCompra:d=>formCompra(d.id), formEst:d=>formEst(d.id),
  formRec:d=>formRec(d.id), formBolo:d=>formBolo(d.id), formEnc:d=>formEnc(d.id,d.modelo), formPag:d=>formPag(d.id), formCats:()=>formCats(),
  addcat:()=>{const b=$('#cat-rows');b.insertAdjacentHTML('beforeend',catRow());b.lastElementChild.querySelector('input[name=cn]').focus()},
  catF:d=>{catFiltro=d.t;render()},
  status:d=>{const e=S.enc[d.id];e.status=e.status==='entregue'?'afazer':'entregue';save();render();toast(e.status==='entregue'?'Marcada como entregue':'Voltou para a fazer')},
  recF:d=>{recFiltro=d.t;render()},
  esc:d=>{const b=S.bolos[d.id];const base=calcBolo(b).peso;escala[d.id]=Math.max(0.5,+((escala[d.id]??base)+pf(d.d)).toFixed(2));render()},
  escR:d=>{const r=S.rec[d.id];escRec[d.id]=Math.max(50,(escRec[d.id]??r.rend)+pf(d.d));render()},
  escRm:d=>{const r=S.rec[d.id];escRec[d.id]=r.rend*pf(d.m);render()},
  addrow:(d,el)=>{const box=$('#'+(d.to||'rows'));box.insertAdjacentHTML('beforeend',rowHtml(d.k));box.lastElementChild.querySelector('input').focus()},
  rmrow:(d,el)=>{const f=el.closest('form');el.closest('.irow').remove();f?.dispatchEvent(new Event('input'))},
  produzir:d=>{const isE=d.k==='enc';const b=(isE?S.enc:S.bolos)[d.id];const base=calcBolo(b).peso;const f=isE||!base?1:(escala[d.id]??base)/base;insumosBolo(b,f).forEach(x=>x.i.est-=x.q);save();render();toast('Estoque atualizado')},
  del:(d,el)=>{const k=d.k+d.id;if(armed!==k){armed=k;el.textContent='Toque de novo para apagar';return}
    delete S[d.k][d.id];armed=null;closeSheet();stack=stack.filter(v=>v.id!==d.id);save();render();toast('Apagado')},
  limpar:(d,el)=>{if(armed!=='limpar'){armed='limpar';render();return}
    S={exemplo:false,cats:S.cats,ins:{},rec:{},bolos:{},enc:{},cfg:S.cfg};armed=null;save();tab='insumos';stack=[];render();toast('Pronto. Comece cadastrando os insumos.')},
  backup:async()=>{const txt=JSON.stringify(S,null,1);const nome=`backup-marcia-bolos-${today()}.json`;
    const blob=new Blob([txt],{type:'application/json'});
    const done=()=>{S.cfg.ultimoBackup=today();save();render();toast('Backup feito')};
    try{const file=new File([blob],nome,{type:'application/json'});
      if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Backup Marcia Hendler'});done();return}}catch(err){if(err&&err.name==='AbortError')return}
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nome;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);done()},
  pdf:()=>window.print(),
};
document.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el)return;if(el.tagName==='A')return;
  if(armed&&el.dataset.act!=='del'&&el.dataset.act!=='limpar')armed=null;
  e.preventDefault();A[el.dataset.act]?.(el.dataset,el)});
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});

/* campos que recalculam ao digitar */
let tmr;
function liveRender(fid){clearTimeout(tmr);tmr=setTimeout(()=>{const el=document.getElementById(fid);const pos=el?.selectionStart;render();const n=document.getElementById(fid);if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(e){}}},350)}
document.addEventListener('input',e=>{const el=e.target;const d=el.dataset;if(!d.live)return;
  if(d.live==='busca'){busca=el.value;liveRender('busca')}
  else if(d.live==='esc'){const v=pfd(el.value);if(v>0){escala[d.id]=v;liveRender(el.id)}}
  else if(d.live==='escR'){const v=pfd(el.value);if(v>0){escRec[d.id]=v;liveRender(el.id)}}
  else if(d.live==='bf'){S.bolos[d.id][d.k]=pfd(el.value);save();liveRender(el.id)}
  else if(d.live==='prop'){S.cfg.prop[d.k]=pfd(el.value);save();liveRender(el.id)}
  else if(d.live==='cfgn'){S.cfg[d.k]=pfd(el.value);save()}
  else if(d.live==='tabkg'){const t=S.cfg.tab.find(x=>x.id===d.id);t.kg=pfd(el.value);save()}
});
document.addEventListener('change',e=>{const el=e.target;const d=el.dataset;
  if(d.live==='tab'){S.bolos[d.id].tab=el.value;save();render()}
  else if(d.live==='cfg'){S.cfg[d.k]=el.value;save();render();toast('Contas atualizadas')}
  else if(d.live==='cfgb'){S.cfg[d.k]=el.checked;save();render()}
  else if(el.id==='restore'&&el.files[0]){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o.ins||!o.enc)throw 0;S=o;save();render();toast('Backup restaurado')}catch(err){toast('Arquivo de backup inválido')}};r.readAsText(el.files[0])}
});
render();
})();
