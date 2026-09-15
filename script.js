const $=id=>document.getElementById(id);
const canvas=$("canvas");
let linksData=[];
let state={positions:{avatar:[40,40,120,120],name:[40,180,260,55],username:[42,235,220,35],bio:[40,275,320,70],links:[40,355,310,240]}};

function applyState(){
  for(const [id,v] of Object.entries(state.positions)){
    const el=document.querySelector(`[data-id="${id}"]`);
    el.style.left=v[0]+"px";el.style.top=v[1]+"px";el.style.width=v[2]+"px";el.style.height=v[3]+"px";
  }
}
function updateProfile(){
  $("displayName").textContent=$("nameInput").value||"Your Name";
  $("displayUsername").textContent=$("usernameInput").value||"@username";
  $("displayBio").textContent=$("bioInput").value||"";
  renderLinks();
  const f=$("fontInput").value; canvas.style.fontFamily=f;
  if($("bgType").value==="solid") canvas.style.background=$("bg1").value;
  else canvas.style.background=`linear-gradient(135deg,${$("bg1").value},${$("bg2").value})`;
}
function renderLinks(){
  $("links").innerHTML="";
  linksData.forEach((x,i)=>{
    const a=document.createElement("a");a.className="link-btn";a.textContent=x.label||x.site;a.href=x.url||"#";a.target="_blank";
    $("links").appendChild(a);
    const row=document.createElement("div");row.className="link-row";
    row.innerHTML=`<input value="${escapeHtml(x.label)}" placeholder="Link name"><input value="${escapeHtml(x.url)}" placeholder="https://..."><button>×</button>`;
    const ins=row.querySelectorAll("input");
    ins[0].oninput=e=>{x.label=e.target.value;renderLinks()};
    ins[1].oninput=e=>{x.url=e.target.value;renderLinks()};
    row.querySelector("button").onclick=()=>{linksData.splice(i,1);renderLinks()};
    $("linkList").appendChild(row);
  });
}
function escapeHtml(s){return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;")}

document.querySelectorAll(".quick-links button").forEach(b=>b.onclick=()=>{
  const site=b.dataset.site;
  const base={Instagram:"https://instagram.com/",Pinterest:"https://pinterest.com/",TikTok:"https://tiktok.com/",Spotify:"https://open.spotify.com/",YouTube:"https://youtube.com/",Discord:"https://discord.com/",GitHub:"https://github.com/",Custom:"https://"};
  linksData.push({site,label:site,url:base[site]});
  renderLinks();
});
["nameInput","usernameInput","bioInput","bg1","bg2","bgType","fontInput"].forEach(id=>$(id).addEventListener("input",updateProfile));
$("avatarInput").onchange=e=>{
  const f=e.target.files[0]; if(!f)return;
  const r=new FileReader();r.onload=()=>{$("avatar").src=r.result;localStorage.setItem("xyloraAvatar",r.result)};r.readAsDataURL(f);
};
$("bgInput").onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=()=>{canvas.style.backgroundImage=`url("${r.result}")`;canvas.style.backgroundSize="cover";canvas.style.backgroundPosition="center";localStorage.setItem("xyloraBg",r.result)};r.readAsDataURL(f);
};

let active=null, offset=[0,0], resizing=false;
document.querySelectorAll(".profile-element").forEach(el=>{
  el.addEventListener("pointerdown",e=>{
    active=el;el.classList.add("selected");resizing=e.target.classList.contains("resize");
    const rect=canvas.getBoundingClientRect(), er=el.getBoundingClientRect();
    offset=[e.clientX-er.left,e.clientY-er.top];el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove",e=>{
    if(!active||active!==el)return;
    const cr=canvas.getBoundingClientRect(), er=el.getBoundingClientRect();
    if(resizing){
      const w=Math.max(70,e.clientX-er.left),h=Math.max(35,e.clientY-er.top);
      el.style.width=w+"px";el.style.height=h+"px";
      state.positions[el.dataset.id][2]=w;state.positions[el.dataset.id][3]=h;
    }else{
      let x=e.clientX-cr.left-offset[0],y=e.clientY-cr.top-offset[1];
      x=Math.max(0,Math.min(x,canvas.clientWidth-el.offsetWidth));y=Math.max(0,Math.min(y,canvas.clientHeight-el.offsetHeight));
      el.style.left=x+"px";el.style.top=y+"px";state.positions[el.dataset.id][0]=x;state.positions[el.dataset.id][1]=y;
    }
  });
  el.addEventListener("pointerup",()=>{active=null;resizing=false});
});
document.addEventListener("pointerdown",e=>{if(!e.target.closest(".profile-element"))document.querySelectorAll(".profile-element").forEach(x=>x.classList.remove("selected"))});

$("resetBtn").onclick=()=>{state.positions={avatar:[40,40,120,120],name:[40,180,260,55],username:[42,235,220,35],bio:[40,275,320,70],links:[40,355,310,240]};applyState()};
$("saveBtn").onclick=()=>{
  localStorage.setItem("xyloraProfile",JSON.stringify({name:$("nameInput").value,username:$("usernameInput").value,bio:$("bioInput").value,links:linksData,state, font:$("fontInput").value,bg1:$("bg1").value,bg2:$("bg2").value,bgType:$("bgType").value}));
  alert("Your Xylora profile was saved on this device! ✦");
};
function openPremium(){ $("premiumModal").classList.remove("hidden") }
$("premiumBtn").onclick=openPremium;$("premiumCardBtn").onclick=openPremium;$("closeModal").onclick=()=>$("premiumModal").classList.add("hidden");
$("subscribeBtn").onclick=()=>alert("Subscription checkout is ready to connect to Stripe or another payment provider. The $10/month plan is not charged in this prototype.");
$("startBtn").onclick=()=>$("builder").scrollIntoView({behavior:"smooth"});
$("editBtn").onclick=()=>$("builder").scrollIntoView({behavior:"smooth"});
$("previewBtn").onclick=()=>{document.querySelectorAll(".profile-element").forEach(x=>x.classList.remove("selected"));$("builder").scrollIntoView({behavior:"smooth"})};

const saved=localStorage.getItem("xyloraProfile");
if(saved){try{const p=JSON.parse(saved);$("nameInput").value=p.name||"Your Name";$("usernameInput").value=p.username||"@username";$("bioInput").value=p.bio||"";linksData=p.links||[];state=p.state||state;$("fontInput").value=p.font||"Inter";$("bg1").value=p.bg1||"#17152b";$("bg2").value=p.bg2||"#6047ff";$("bgType").value=p.bgType||"gradient"}catch(e){}}
const av=localStorage.getItem("xyloraAvatar");if(av)$("avatar").src=av;
const bg=localStorage.getItem("xyloraBg");if(bg){canvas.style.backgroundImage=`url("${bg}")`;canvas.style.backgroundSize="cover";canvas.style.backgroundPosition="center"}
applyState();updateProfile();