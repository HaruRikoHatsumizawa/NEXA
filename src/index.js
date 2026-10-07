const SESSION_MAX_AGE = 60 * 60 * 8;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

function page() {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NEXA</title>
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
<style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;background:#f5f7fb;color:#18202a}
main{max-width:1100px;margin:0 auto;padding:24px}.card{background:white;border:1px solid #e2e6ed;border-radius:14px;padding:20px;margin:14px 0}
button{border:0;border-radius:9px;padding:10px 14px;cursor:pointer;background:#18202a;color:white}
input,select{padding:10px;border:1px solid #ccd2dc;border-radius:9px;width:100%;margin:6px 0 12px}
nav{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0}nav button{background:#e9edf3;color:#18202a}.hidden{display:none}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
.stat{font-size:28px;font-weight:700}.muted{color:#697386}
</style>
</head>
<body><main>
<div id="login" class="card">
<h1>NEXA</h1><p class="muted">Acesso administrativo</p>
<input id="user" placeholder="Usuário">
<input id="pass" type="password" placeholder="Senha">
<button onclick="login()">Entrar</button><p id="loginMsg"></p>
</div>
<div id="app" class="hidden">
<header><h1>NEXA</h1><button onclick="logout()">Sair</button></header>
<nav>
<button onclick="tab('geral')">Geral</button>
<button onclick="tab('upload')">Carregar Excel</button>
<button onclick="tab('db')">Banco de Dados</button>
</nav>
<section id="geral" class="card">
<h2>Visão geral</h2><div class="grid">
<div class="card"><div id="datasetCount" class="stat">0</div><div class="muted">Planilhas</div></div>
<div class="card"><div id="rowCount" class="stat">0</div><div class="muted">Registros</div></div>
</div></section>
<section id="upload" class="card hidden">
<h2>Carregar Excel</h2>
<input id="file" type="file" accept=".xlsx,.xls,.csv">
<select id="sheet"><option>Selecione um arquivo</option></select>
<input id="datasetName" placeholder="Nome do conjunto de dados">
<button onclick="importData()">Salvar no D1</button><p id="uploadMsg"></p>
</section>
<section id="db" class="card hidden">
<h2>Banco de Dados</h2>
<select id="datasets" onchange="loadDataset()"></select>
<div id="dbInfo" class="muted"></div>
<button onclick="exportExcel()">Gerar Excel</button>
<button onclick="deleteDataset()">Excluir conjunto</button>
</section>
</div>
</main>
<script>
let workbook=null,currentDataset=null;
const $=id=>document.getElementById(id);
async function api(url,opt={}){const r=await fetch(url,opt);const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.error||'Erro');return d}
async function start(){try{await api('/api/me');$('login').classList.add('hidden');$('app').classList.remove('hidden');await refresh()}catch{}}
async function login(){try{await api('/api/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:$('user').value,password:$('pass').value})});$('login').classList.add('hidden');$('app').classList.remove('hidden');await refresh()}catch(e){$('loginMsg').textContent=e.message}}
async function logout(){await api('/api/logout',{method:'POST'});location.reload()}
function tab(id){for(const x of ['geral','upload','db'])$(x).classList.toggle('hidden',x!==id)}
async function refresh(){const s=await api('/api/stats');$('datasetCount').textContent=s.datasets;$('rowCount').textContent=s.rows;const d=await api('/api/datasets');$('datasets').innerHTML=d.map(x=>`<option value="${x.id}">${escapeHtml(x.name)} — ${escapeHtml(x.sheet_name)}</option>`).join('')}
$('file').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{workbook=XLSX.read(rd.result,{type:'array'});$('sheet').innerHTML=workbook.SheetNames.map(x=>`<option>${escapeHtml(x)}</option>`).join('');if(!$('datasetName').value)$('datasetName').value=f.name.replace(/\.[^.]+$/,'')};rd.readAsArrayBuffer(f)})
async function importData(){try{const name=$('datasetName').value.trim(),sheet=$('sheet').value;if(!name||!workbook)throw Error('Escolha um arquivo e informe um nome.');const ws=workbook.Sheets[sheet];const rows=XLSX.utils.sheet_to_json(ws,{defval:null});if(!rows.length)throw Error('A planilha não possui registros.');const columns=[...new Set(rows.flatMap(r=>Object.keys(r)))];$('uploadMsg').textContent='Salvando...';await api('/api/import',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,sheetName:sheet,columns,rows})});$('uploadMsg').textContent='Salvo permanentemente no D1.';await refresh();tab('db')}catch(e){$('uploadMsg').textContent=e.message}}
async function loadDataset(){const id=$('datasets').value;if(!id)return;currentDataset=await api('/api/datasets/'+id);$('dbInfo').textContent=currentDataset.rows.length+' registros em '+currentDataset.name}
function exportExcel(){if(!currentDataset)return;const ws=XLSX.utils.json_to_sheet(currentDataset.rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Dados');XLSX.writeFile(wb,(currentDataset.name||'nexa')+'.xlsx')}
async function deleteDataset(){if(!currentDataset||!confirm('Excluir este conjunto de dados?'))return;await api('/api/datasets/'+currentDataset.id,{method:'DELETE'});currentDataset=null;await refresh();$('dbInfo').textContent='Excluído.'}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
start();
</script></body></html>`;
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function sessionCookie(env) {
  const payload = btoa(JSON.stringify({u:env.ADMIN_USER,exp:Date.now()+SESSION_MAX_AGE*1000})).replace(/=/g,"");
  return payload+"."+await sign(payload,env.SESSION_SECRET);
}
async function requireAuth(request,env) {
  const raw=request.headers.get("Cookie")||"",m=raw.match(/(?:^|;\s*)nexa_session=([^;]+)/);
  if(!m)return json({error:"Não autenticado"},401);
  const [payload,sig]=m[1].split(".");
  if(!payload||!sig||sig!==await sign(payload,env.SESSION_SECRET))return json({error:"Sessão inválida"},401);
  try{const data=JSON.parse(atob(payload));if(data.exp<Date.now())throw Error()}catch{return json({error:"Sessão expirada"},401)}
  return null;
}
async function readBody(request){return await request.json()}

export default {
 async fetch(request,env) {
  const url=new URL(request.url),path=url.pathname;
  if(path==="/"&&request.method==="GET")return new Response(page(),{headers:{"content-type":"text/html;charset=utf-8"}});
  if(path==="/api/login"&&request.method==="POST"){
   const b=await readBody(request);
   if(b.username!==env.ADMIN_USER||b.password!==env.ADMIN_PASSWORD)return json({error:"Usuário ou senha inválidos"},401);
   return new Response(JSON.stringify({ok:true}),{headers:{"content-type":"application/json","Set-Cookie":`nexa_session=${await sessionCookie(env)}; Max-Age=${SESSION_MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Strict`}})
  }
  if(path==="/api/logout"&&request.method==="POST")return new Response(JSON.stringify({ok:true}),{headers:{"content-type":"application/json","Set-Cookie":"nexa_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict"}});
  if(path.startsWith("/api/")){
   const denied=await requireAuth(request,env);if(denied)return denied;
  }
  if(path==="/api/me")return json({ok:true,user:env.ADMIN_USER});
  if(path==="/api/stats"){const [a,b]=await Promise.all([env.DB.prepare("SELECT COUNT(*) n FROM datasets").first(),env.DB.prepare("SELECT COUNT(*) n FROM rows_data").first()]);return json({datasets:a.n,rows:b.n})}
  if(path==="/api/datasets"&&request.method==="GET"){const r=await env.DB.prepare("SELECT id,name,sheet_name,created_at FROM datasets ORDER BY id DESC").all();return json(r.results)}
  const match=path.match(/^\/api\/datasets\/(\d+)$/);
  if(match&&request.method==="GET"){const id=Number(match[1]);const d=await env.DB.prepare("SELECT id,name,sheet_name,columns_json,created_at FROM datasets WHERE id=?").bind(id).first();if(!d)return json({error:"Não encontrado"},404);const r=await env.DB.prepare("SELECT row_json FROM rows_data WHERE dataset_id=? ORDER BY id").bind(id).all();return json({...d,columns:JSON.parse(d.columns_json),rows:r.results.map(x=>JSON.parse(x.row_json))})}
  if(match&&request.method==="DELETE"){const id=Number(match[1]);await env.DB.prepare("DELETE FROM rows_data WHERE dataset_id=?").bind(id).run();await env.DB.prepare("DELETE FROM datasets WHERE id=?").bind(id).run();return json({ok:true})}
  if(path==="/api/import"&&request.method==="POST"){
   const b=await readBody(request);if(!b.name||!b.sheetName||!Array.isArray(b.rows)||!b.rows.length)return json({error:"Dados inválidos"},400);
   const ins=await env.DB.prepare("INSERT INTO datasets(name,sheet_name,columns_json) VALUES(?,?,?)").bind(b.name,b.sheetName,JSON.stringify(b.columns||[])).run();
   const id=ins.meta.last_row_id;for(let i=0;i<b.rows.length;i+=50){const batch=b.rows.slice(i,i+50).map(row=>env.DB.prepare("INSERT INTO rows_data(dataset_id,row_json) VALUES(?,?)").bind(id,JSON.stringify(row)));await env.DB.batch(batch)}
   return json({ok:true,id});
  }
  return json({error:"Não encontrado"},404);
 }
};
