const $=id=>document.getElementById(id);
let plan="free",links=[],sections=[];
const positions={avatar:{x:35,y:35,w:140,h:140},name:{x:205,y:60,w:240,h:70},bio:{x:205,y:135,w:260,h:90},audio:{x:35,y:205,w:300,h:90},links:{x:35,y:320,w:340,h:100},sections:{x:35,y:440,w:350,h:170}};
function setPlan(v){plan=v;document.body.classList.toggle("premium-mode",v==="premium");$("status").textContent=v==="premium"?"Premium plan":"Free plan";$("planButton").textContent=v==="premium"?"💎 Premium":"🆓 Free";$("planSelect").value=v}
$("planSelect").onchange=e=>setPlan(e.target.value);
$("displayName").oninput=()=>$("previewName").textContent=$("displayName").value;
$("username").oninput=()=>$("previewUsername").textContent=$("username").value;
$("bio").oninput=()=>$("previewBio").textContent=$("bio").value;
$("fontSelect").onchange=e=>$("canvas").style.fontFamily=e.target.value;
$("bgColor").oninput=e=>$("canvas").style.background=e.target.value;
$("avatarInput").onchange=e=>{let f=e.target.files[0];if(!f)return;let animated=/image\/(gif|webp)/i.test(f.type);if(animated&&plan!=="premium"){alert("Live/animated profile pictures are a Premium feature.");e.target.value="";return}$("avatar").src=URL.createObjectURL(f)};
$("bgImageInput").onchange=e=>{if(plan!=="premium"){alert("Picture backgrounds are a Premium feature.");e.target.value="";return}let f=e.target.files[0];if(f)$("canvas").style.background=`center/cover no-repeat url("${URL.createObjectURL(f)}")`};
$("audioInput").onchange=e=>{let f=e.target.files[0];if(f){$("audioPlayer").src=URL.createObjectURL(f);$("audioPlayer").hidden=false;$("audioEmpty").hidden=true}};
document.querySelectorAll("[data-link]").forEach(b=>b.onclick=()=>{let name=b.dataset.link,url=prompt("Enter the URL for "+name+":");if(url){links.push({name,url});renderLinks()}});
function renderLinks(){$("previewLinks").innerHTML=links.map(l=>`<a class="preview-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)}</a>`).join("")}
document.querySelectorAll("[data-section]").forEach(b=>b.onclick=()=>{if(!sections.includes(b.dataset.section))sections.push(b.dataset.section);renderSections()});
function renderSections(){$("previewSections").innerHTML=sections.map(s=>`<div class="preview-section">${esc(s)}</div>`).join("")}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function apply(k){let e=document.querySelector(`[data-key="${k}"]`),p=positions[k];e.style.left=p.x+"px";e.style.top=p.y+"px";e.style.width=p.w+"px";e.style.height=p.h+"px"}
Object.keys(positions).forEach(apply);
document.querySelectorAll(".draggable").forEach(el=>el.addEventListener("pointerdown",e=>{if(e.target.closest("audio")||e.target.closest("a"))return;el.setPointerCapture(e.pointerId);let r=el.getBoundingClientRect(),c=$("canvas").getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top;const move=ev=>{let p=positions[el.dataset.key];p.x=Math.max(0,Math.min(c.width-el.offsetWidth,ev.clientX-c.left-sx));p.y=Math.max(0,Math.min(c.height-el.offsetHeight,ev.clientY-c.top-sy));apply(el.dataset.key)};el.addEventListener("pointermove",move);el.addEventListener("pointerup",()=>el.removeEventListener("pointermove",move),{once:true})}));
$("resetLayout").onclick=()=>{Object.assign(positions,{avatar:{x:35,y:35,w:140,h:140},name:{x:205,y:60,w:240,h:70},bio:{x:205,y:135,w:260,h:90},audio:{x:35,y:205,w:300,h:90},links:{x:35,y:320,w:340,h:100},sections:{x:35,y:440,w:350,h:170}});Object.keys(positions).forEach(apply)};
$("saveProfile").onclick=()=>{localStorage.setItem("xyloraProfile",JSON.stringify({plan,displayName:$("displayName").value,username:$("username").value,bio:$("bio").value,font:$("fontSelect").value,bgColor:$("bgColor").value,links,sections,positions}));alert("Profile saved on this device!")};
setPlan("free");