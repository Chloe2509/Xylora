const $ = id => document.getElementById(id);

const state = {
  plan: "free",
  links: [],
  sections: [],
  audioUrl: "",
  avatarUrl: "",
  bgImage: ""
};


/* UPDATE PREVIEW */

function updatePreview(){

  $("previewName").textContent =
    $("displayName").value || "Your Name";

  $("previewUsername").textContent =
    $("username").value || "@username";

  $("previewBio").textContent =
    $("bio").value || "";

  $("status").textContent =
    state.plan === "premium"
      ? "Premium plan"
      : "Free plan";

  $("planButton").textContent =
    state.plan === "premium"
      ? "💎 Premium"
      : "🆓 Free";


  const card =
    $("canvas").querySelector(".profile-card");


  if(state.bgImage && state.plan === "premium"){

    card.style.backgroundImage =
      `linear-gradient(120deg,rgba(12,10,25,.35),rgba(96,69,255,.25)),url("${state.bgImage}")`;

    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";

  }else{

    const a = $("bgColor").value;
    const b = $("bgColor2").value;

    if($("backgroundStyle").value === "solid"){

      card.style.backgroundImage =
        `linear-gradient(${a},${a})`;

    }else{

      card.style.backgroundImage =
        `linear-gradient(120deg,${a},${b})`;

    }

  }


  card.style.fontFamily =
    $("fontSelect").value;


  $("previewLinks").innerHTML =
    state.links.map(link =>
      `<span class="link-pill">${link.name}</span>`
    ).join("");


  $("previewSections").innerHTML =
    state.sections.map(section =>
      `<span class="section-pill">${section}</span>`
    ).join("");
}


/* TEXT */

$("displayName").addEventListener(
  "input",
  updatePreview
);

$("username").addEventListener(
  "input",
  updatePreview
);

$("bio").addEventListener(
  "input",
  updatePreview
);

$("bgColor").addEventListener(
  "input",
  updatePreview
);

$("bgColor2").addEventListener(
  "input",
  updatePreview
);

$("backgroundStyle").addEventListener(
  "change",
  updatePreview
);

$("fontSelect").addEventListener(
  "change",
  updatePreview
);


/* PLAN */

$("planSelect").addEventListener(
  "change",
  event => {

    state.plan = event.target.value;

    if(state.plan === "free"){
      state.bgImage = "";
    }

    updatePreview();

  }
);


/* PROFILE PICTURE */

$("avatarInput").addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];

    if(!file) return;


    if(
      state.plan === "free" &&
      (
        file.type === "image/gif" ||
        file.type === "image/webp"
      )
    ){

      alert(
        "Animated profile pictures are a Premium feature."
      );

      event.target.value = "";
      return;
    }


    if(state.avatarUrl){
      URL.revokeObjectURL(
        state.avatarUrl
      );
    }


    state.avatarUrl =
      URL.createObjectURL(file);


    $("avatar").src =
      state.avatarUrl;

    $("avatar").style.display =
      "block";

    document.querySelector(
      ".avatar-placeholder"
    ).style.display = "none";

  }
);


/* BACKGROUND */

$("bgImageInput").addEventListener(
  "change",
  event => {

    if(state.plan !== "premium"){

      alert(
        "Background pictures are a Premium feature."
      );

      event.target.value = "";
      return;
    }


    const file =
      event.target.files[0];

    if(!file) return;


    state.bgImage =
      URL.createObjectURL(file);

    updatePreview();

  }
);


/* AUDIO */

$("audioInput").addEventListener(
  "change",
  event => {

    const file =
      event.target.files[0];

    if(!file) return;


    if(state.audioUrl){
      URL.revokeObjectURL(
        state.audioUrl
      );
    }


    state.audioUrl =
      URL.createObjectURL(file);


    $("audioPlayer").src =
      state.audioUrl;

    $("audioName").textContent =
      file.name;

  }
);


/* LINKS */

document
  .querySelectorAll("[data-link]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const name =
          button.dataset.link;

        const url =
          prompt(
            `Enter your ${name} link:`
          );

        if(!url) return;


        state.links.push({
          name:name,
          url:url
        });


        updatePreview();

      }
    );

  });


/* SECTIONS */

document
  .querySelectorAll("[data-section]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const section =
          button.dataset.section;

        if(
          !state.sections.includes(section)
        ){

          state.sections.push(section);

        }

        updatePreview();

      }
    );

  });


/* ================================================= */
/* INDIVIDUAL DRAGGING */
/* ================================================= */

document
  .querySelectorAll(".draggable")
  .forEach(element => {

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;


    element.addEventListener(
      "pointerdown",
      event => {

        if(
          event.target.closest(
            "audio,button,a,input,textarea,select"
          )
        ){
          return;
        }


        dragging = true;


        const rect =
          element.getBoundingClientRect();


        offsetX =
          event.clientX - rect.left;

        offsetY =
          event.clientY - rect.top;


        element.setPointerCapture(
          event.pointerId
        );

      }
    );


    element.addEventListener(
      "pointermove",
      event => {

        if(!dragging) return;


        const canvas =
          $("canvas");

        const canvasRect =
          canvas.getBoundingClientRect();


        let x =
          event.clientX -
          canvasRect.left -
          offsetX;


        let y =
          event.clientY -
          canvasRect.top -
          offsetY;


        x = Math.max(
          0,
          Math.min(
            x,
            canvasRect.width -
            element.offsetWidth
          )
        );


        y = Math.max(
          0,
          Math.min(
            y,
            canvasRect.height -
            element.offsetHeight
          )
        );


        element.style.left =
          x + "px";

        element.style.top =
          y + "px";

      }
    );


    element.addEventListener(
      "pointerup",
      event => {

        dragging = false;

        try{

          element.releasePointerCapture(
            event.pointerId
          );

        }catch(error){}

      }
    );


    element.addEventListener(
      "pointercancel",
      () => {

        dragging = false;

      }
    );

  });


/* RESET */

const defaults = {

  avatar:{
    left:"7%",
    top:"7%"
  },

  name:{
    left:"7%",
    top:"29%"
  },

  username:{
    left:"7%",
    top:"37%"
  },

  bio:{
    left:"7%",
    top:"42%"
  },

  audio:{
    left:"7%",
    top:"51%"
  },

  links:{
    left:"7%",
    top:"67%"
  },

  sections:{
    left:"7%",
    top:"78%"
  }

};


$("resetLayout").addEventListener(
  "click",
  () => {

    document
      .querySelectorAll(".draggable")
      .forEach(element => {

        const position =
          defaults[element.dataset.key];

        if(!position) return;


        element.style.left =
          position.left;

        element.style.top =
          position.top;

      });

  }
);


/* SAVE */

$("saveProfile").addEventListener(
  "click",
  () => {

    const data = {

      displayName:
        $("displayName").value,

      username:
        $("username").value,

      bio:
        $("bio").value,

      plan:
        state.plan,

      links:
        state.links,

      sections:
        state.sections

    };


    localStorage.setItem(
      "xyloraProfile",
      JSON.stringify(data)
    );


    $("status").textContent =
      "Saved ✓";


    setTimeout(
      updatePreview,
      1500
    );

  }
);


/* START */

updatePreview();
