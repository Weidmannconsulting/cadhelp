const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('nav');
function closeMenu(){
  nav?.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded','false');
  menuBtn?.setAttribute('aria-label','Open menu');
  const icon=menuBtn?.querySelector('span');
  if(icon)icon.textContent='☰';
}
menuBtn?.addEventListener('click',()=>{
  const isOpen=nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',String(isOpen));
  menuBtn.setAttribute('aria-label',isOpen?'Close menu':'Open menu');
  const icon=menuBtn.querySelector('span');
  if(icon)icon.textContent=isOpen?'×':'☰';
});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
window.addEventListener('resize',()=>{if(window.innerWidth>980)closeMenu()});

const input=document.getElementById('fileInput');
const browse=document.getElementById('browseBtn');
const drop=document.getElementById('dropZone');
browse?.addEventListener('click',()=>input.click());
['dragenter','dragover'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.add('dragover')}));
['dragleave','drop'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.remove('dragover')}));
drop?.addEventListener('drop',e=>showFiles(e.dataTransfer.files));
input?.addEventListener('change',()=>showFiles(input.files));
function showFiles(files){if(!files||!files.length)return;const small=drop.querySelector('small');small.textContent=`✓ ${files.length} file${files.length>1?'s':''} selected — ready to quote`;}
