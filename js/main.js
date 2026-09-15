const menuBtn=document.getElementById('menuBtn');
const nav=document.getElementById('nav');
menuBtn?.addEventListener('click',()=>nav.classList.toggle('open'));

const input=document.getElementById('fileInput');
const browse=document.getElementById('browseBtn');
const drop=document.getElementById('dropZone');
browse?.addEventListener('click',()=>input.click());
['dragenter','dragover'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.add('dragover')}));
['dragleave','drop'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.remove('dragover')}));
drop?.addEventListener('drop',e=>showFiles(e.dataTransfer.files));
input?.addEventListener('change',()=>showFiles(input.files));
function showFiles(files){if(!files||!files.length)return;const small=drop.querySelector('small');small.textContent=`✓ ${files.length} file${files.length>1?'s':''} selected — ready to quote`;}
