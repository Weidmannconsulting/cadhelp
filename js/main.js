import {UploadClient} from './vendor/uploadcare-client.js';

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
const status=document.getElementById('uploadStatus');
const send=document.getElementById('sendRequestBtn');
const uploaded=[];
const client=new UploadClient({publicKey:'94d2e39bed035557fe62'});
let pending=0;
browse?.addEventListener('click',()=>input.click());
document.getElementById('addFileBtn')?.addEventListener('click',()=>input.click());
['dragenter','dragover'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.add('dragover')}));
['dragleave','drop'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.remove('dragover')}));
drop?.addEventListener('drop',e=>uploadFiles(e.dataTransfer.files));
input?.addEventListener('change',()=>{uploadFiles(input.files);input.value=''});
async function uploadFiles(files){
  if(!files?.length)return;
  pending+=files.length;
  send.disabled=true;
  for(const file of files){
      status.textContent=`Uploading ${file.name}… Keep this page open.`;
      try{
        const result=await client.uploadFile(file,{store:true,onProgress:({isComputable,value})=>{
          if(isComputable)status.textContent=`Uploading ${file.name}: ${Math.round(value*100)}% — keep this page open.`;
        }});
        uploaded.push({name:file.name,url:result.cdnUrl||`https://ucarecdn.com/${result.uuid}/`});
      }catch(error){
        status.textContent=`${file.name} failed: ${error.message||'Please try again.'}`;
      }finally{pending--;}
  }
  if(!pending){
    send.disabled=!uploaded.length;
    if(uploaded.length)status.textContent=`${uploaded.length} file(s) uploaded. Click Send request to email the links.`;
  }
}
send?.addEventListener('click',()=>{
  if(pending||!uploaded.length)return;
  const email=document.getElementById('clientEmail');
  if(!email.reportValidity())return;
  const description=document.getElementById('requestText').value.trim();
  const body=`Client email: ${email.value.trim()}\n\nRequest:\n${description||'(No description provided)'}\n\nUploaded files:\n${uploaded.map(f=>`${f.name}: ${f.url}`).join('\n')}\n\nPlease send this email to submit your request.`;
  window.location.href=`mailto:cadhelp@gmail.com?subject=${encodeURIComponent('New CADHelp job request')}&body=${encodeURIComponent(body)}`;
  status.textContent='Your email app should open. Please send the drafted email to complete your request.';
});
