/* Simple password screen while SB Desk is private. It hides the page from
   casual visitors and search engines; it is not a real lock (that comes with
   the real posting server). */
(function(){
var H='7d7df7f15585231f7ad6adca5c3ac49900fcd0fafa19e9dcdab2ae6124650fdf',K='sbgate';
try{localStorage.removeItem(K);if(sessionStorage.getItem(K)===H)return;}catch(e){}
var de=document.documentElement;de.classList.add('locked');
var st=document.createElement('style');
st.textContent='html.locked body>*{display:none!important}html.locked,html.locked body{background:#050505!important}'+
'#sbgate{position:fixed;inset:0;display:grid;place-items:center;background:#050505;z-index:99999;font:16px Tahoma,Verdana,sans-serif;color:#d8d8d8}'+
'#sbgate form{width:min(340px,90vw);border:1px solid #2a2a2a;background:#000;padding:22px}'+
'#sbgate h1{margin:0 0 4px;font:700 20px Consolas,"Courier New",monospace;letter-spacing:.08em;color:#fff}'+
'#sbgate p{margin:0 0 16px;color:#8a8a8a;font-size:13px}'+
'#sbgate input{width:100%;box-sizing:border-box;font:20px Consolas,monospace;padding:12px;background:#0a0a0a;color:#fff;border:1px solid #3a3a3a;letter-spacing:.2em}'+
'#sbgate button{margin-top:12px;width:100%;padding:13px;font:700 16px Tahoma,sans-serif;background:#ffb000;color:#000;border:0;cursor:pointer}'+
'#sbgate .err{color:#ff4545;font-size:14px;margin:10px 0 0;display:none}';
document.head.appendChild(st);
function hex(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0');}).join('');}
function show(){
  var g=document.createElement('div');g.id='sbgate';
  g.innerHTML='<form><h1>SB DESK</h1><p>Private preview. Enter the password.</p><input type="password" inputmode="numeric" autocomplete="current-password" autofocus><button type="submit">Enter</button><p class="err">Wrong password.</p></form>';
  de.appendChild(g);
  var f=g.querySelector('form'),i=g.querySelector('input'),er=g.querySelector('.err');i.focus();
  f.onsubmit=function(e){e.preventDefault();
    crypto.subtle.digest('SHA-256',new TextEncoder().encode('sbdesk-gate:'+i.value)).then(function(d){
      if(hex(d)===H){try{sessionStorage.setItem(K,H);}catch(_){}g.remove();de.classList.remove('locked');window.dispatchEvent(new Event('resize'));}
      else{er.style.display='block';i.value='';i.focus();}
    });};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show);else show();
})();
