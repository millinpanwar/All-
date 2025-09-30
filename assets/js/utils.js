
// Original utility helpers (MIT).
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

async function readTextFromFile(file){
  if(!file) return "";
  return await file.text();
}

function download(filename, text){
  const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function buildTable(container, rows){
  container.innerHTML = "";
  if(!rows || !rows.length){
    container.innerHTML = '<div class="alert">No rows to display.</div>';
    return;
  }
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const header = rows[0];
  const trh = document.createElement('tr');
  header.forEach(h=>{
    const th = document.createElement('th');
    th.textContent = h;
    trh.appendChild(th);
  });
  thead.appendChild(trh);
  for(let i=1;i<rows.length;i++){
    const tr = document.createElement('tr');
    rows[i].forEach(c=>{
      const td = document.createElement('td');
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

function toCSV(rows, delimiter=",", quoteChar='"'){
  const esc = (s) => {
    s = (s ?? "").toString();
    let needsQuote = s.includes(delimiter) || s.includes('\n') || s.includes(quoteChar);
    if (s.includes(quoteChar)) s = s.replaceAll(quoteChar, quoteChar+quoteChar);
    return needsQuote ? `${quoteChar}${s}${quoteChar}` : s;
  }
  return rows.map(r=>r.map(esc).join(delimiter)).join("\n");
}

function uniqueByKeyRows(rows, keyIdxs, keep="first"){
  const header = rows[0];
  const body = rows.slice(1);
  const seen = new Map();
  const out = [];
  body.forEach((r, idx)=>{
    const k = keyIdxs.map(i=>r[i]).join("§§");
    if(!seen.has(k)){ seen.set(k, idx); out.push(r); }
    else if(keep==="last"){ seen.set(k, idx); }
  });
  if(keep==="last"){
    const lastMap = new Map();
    body.forEach((r, idx)=>{
      const k = keyIdxs.map(i=>r[i]).join("§§");
      lastMap.set(k, r);
    });
    return [header, ...Array.from(lastMap.values())];
  }
  return [header, ...out];
}

function simpleSortRows(rows, colIdx, dir="asc"){
  const header = rows[0];
  const body = rows.slice(1);
  const mul = dir==="asc" ? 1 : -1;
  body.sort((a,b)=>{
    const av = a[colIdx] ?? "";
    const bv = b[colIdx] ?? "";
    const na = parseFloat(av); const nb = parseFloat(bv);
    const bothNum = !isNaN(na) && !isNaN(nb);
    if(bothNum) return (na-nb)*mul;
    return (av+"").localeCompare(bv+"")*mul;
  });
  return [header, ...body];
}

function parseWithPapa(text, delimiter, header){
  return Papa.parse(text, {
    delimiter: delimiter || "",
    header: !!header,
    skipEmptyLines: "greedy",
  });
}

function arrayOfObjectsToRows(objs){
  if(!objs || !objs.length) return [[]];
  const keys = Array.from(new Set(objs.flatMap(o=>Object.keys(o))));
  const rows = [keys];
  for(const o of objs){
    const r = keys.map(k=> o[k] ?? "");
    rows.push(r);
  }
  return rows;
}

function rowsToObjects(rows){
  const header = rows[0];
  return rows.slice(1).map(r=>{
    const obj = {};
    header.forEach((h,i)=>obj[h]=r[i]);
    return obj;
  });
}


// FAQ accordion (robust, delegated, first-open)
(function(){
  function setOpen(item){
    const panel = item.querySelector('.faq-a');
    const btn = item.querySelector('.faq-q');
    item.classList.add('open');
    if(panel){ panel.style.maxHeight = panel.scrollHeight + 'px'; }
    if(btn){ btn.setAttribute('aria-expanded','true'); }
  }
  function setClosed(item){
    const panel = item.querySelector('.faq-a');
    const btn = item.querySelector('.faq-q');
    item.classList.remove('open');
    if(panel){ panel.style.maxHeight = '0px'; }
    if(btn){ btn.setAttribute('aria-expanded','false'); }
  }
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.faq').forEach(faq => {
      const items = faq.querySelectorAll('.faq-item');
      items.forEach((it, idx)=> idx===0 ? setOpen(it) : setClosed(it));
    });
  });
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.faq-q');
    if(!btn) return;
    const item = btn.closest('.faq-item');
    if(!item) return;
    if(item.classList.contains('open')) setClosed(item);
    else setOpen(item);
  });
})();
