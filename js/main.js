import {UploadClient} from './uploadcare-client.js';

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
let submitted=false;
browse?.addEventListener('click',()=>input.click());
document.getElementById('addFileBtn')?.addEventListener('click',()=>input.click());
['dragenter','dragover'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.add('dragover')}));
['dragleave','drop'].forEach(evt=>drop?.addEventListener(evt,e=>{e.preventDefault();drop.classList.remove('dragover')}));
drop?.addEventListener('drop',e=>uploadFiles(e.dataTransfer.files));
input?.addEventListener('change',()=>{uploadFiles(input.files);input.value=''});
async function uploadFiles(files){
  if(!files?.length)return;
  if(submitted){uploaded.length=0;submitted=false;send.textContent='Send request →';}
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
    if(uploaded.length)status.textContent=`${uploaded.length} file(s) uploaded. Enter your email and click Send request.`;
  }
}
send?.addEventListener('click',async()=>{
  if(pending||!uploaded.length||submitted)return;
  const email=document.getElementById('clientEmail');
  if(!email.reportValidity())return;
  const description=document.getElementById('requestText').value.trim();
  send.disabled=true;
  send.textContent='Sending…';
  status.textContent='Submitting your request…';
  const data=new FormData();
  data.append('email',email.value.trim());
  data.append('message',description||'(No description provided)');
  data.append('uploaded_files',uploaded.map(f=>`${f.name}: ${f.url}`).join('\n'));
  data.append('_subject','New CADHelp job request');
  data.append('_replyto',email.value.trim());
  data.append('_captcha','false');
  data.append('_honey','');
  try{
    const response=await fetch('https://formsubmit.co/ajax/cadhelp@gmail.com',{method:'POST',body:data});
    const result=await response.json();
    if(!response.ok||result.success===false||result.success==='false'||!result.success){
      throw new Error(result.message||'Request could not be sent.');
    }
    submitted=true;
    send.textContent='Request sent ✓';
    status.textContent='Thank you! Your request has been submitted. We’ll review your files and get back to you.';
  }catch(error){
    status.textContent=`Could not send your request: ${error.message||'Please try again.'} Your files are still uploaded; you can try again.`;
    send.disabled=false;
    send.textContent='Try sending again →';
  }
});
