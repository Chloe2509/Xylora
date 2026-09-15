const $ = id => document.getElementById(id);

const state = {
  plan: "free",
  links: [],
  sections: [],
  audioUrl: "",
  avatarUrl: "",
  bgImage: ""
};

function updatePreview() {
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

  const card = $("canvas").querySelector(".profile-card");

  if (state.bgImage && state.plan === "premium") {
    card.style.backgroundImage =
      `linear-gradient(120deg,rgba(12,10,25,.35),rgba(96,69,255,.25)),url("${state.bgImage}")`;

    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
  } else {
    const a = $("bgColor").value;
    const b = $("bgColor2").value;

    card.style.backgroundImage =
      $("backgroundStyle").value === "solid"
        ? `linear-gradient(${a},${a})`
        : `linear-gradient(120deg,${a},${b})`;
  }

  card.style.fontFamily = $("fontSelect").value;

  $("previewLinks").innerHTML =
    state.links
      .map(x => `<span class="link-pill">${x}</span>`)
      .join("");

  $("previewSections").innerHTML =
    state.sections
      .map(x => `<span class="section-pill">${x}</span>`)
      .join("");
}


$("displayName").addEventListener("input", updatePreview);
$("username").addEventListener("input", updatePreview);
$("bio").addEventListener("input", updatePreview);
$("bgColor").addEventListener("input", updatePreview);
$("bgColor2").addEventListener("input", updatePreview);
$("backgroundStyle").addEventListener("change", updatePreview);
$("fontSelect").addEventListener("change", updatePreview);


$("planSelect").addEventListener("change", e => {
  state.plan = e.target.value;

  if (state.plan === "free") {
    state.bgImage = "";
  }

  updatePreview();
});


$("avatarInput").addEventListener("change", e => {
  const file = e.target.files[0];

  if (!file) return;

  if (
    state.plan === "free" &&
    file.type === "image/gif"
  ) {
    alert(
      "Animated profile pictures are a Premium feature."
    );

    e.target.value = "";
    return;
  }

  state.avatarUrl = URL.createObjectURL(file);

  $("avatar").src = state.avatarUrl;
});


$("bgImageInput").addEventListener("change", e => {
  if (state.plan !== "premium") {
    alert(
      "Background pictures are a Premium feature."
    );

    e.target.value = "";
    return;
  }

  const file = e.target.files[0];

  if (!file) return;

  state.bgImage = URL.createObjectURL(file);

  updatePreview();
});


$("audioInput").addEventListener("change", e => {
  const file = e.target.files[0];

  if (!file) return;

  if (state.audioUrl) {
    URL.revokeObjectURL(state.audioUrl);
  }

  state.audioUrl = URL.createObjectURL(file);

  $("audioPlayer").src = state.audioUrl;
  $("audioName").textContent = file.name;
});


document.querySelectorAll("[data-link]")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      const name = btn.dataset.link;

      const url = prompt(
        `Enter your ${name} link:`
      );

      if (url) {
        state.links.push(name);
        updatePreview();
      }

    });

  });


document.querySelectorAll("[data-section]")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      if (
        !state.sections.includes(
          btn.dataset.section
        )
      ) {
        state.sections.push(
          btn.dataset.section
        );
      }

      updatePreview();
    });

  });


const defaults = {

  avatar: {
    left: "7%",
    top: "7%",
    width: "124px",
    height: "124px"
  },

  identity: {
    left: "7%",
    top: "29%",
    width: "70%",
    height: "auto"
  },

  audio: {
    left: "7%",
    top: "51%",
    width: "440px",
    height: "auto"
  },

  links: {
    left: "7%",
    top: "67%",
    width: "75%",
    height: "auto"
  },

  sections: {
    left: "7%",
    top: "78%",
    width: "80%",
    height: "auto"
  }

};


document.querySelectorAll(".draggable")
  .forEach(el => {

    let drag = false;
    let ox = 0;
    let oy = 0;

    el.addEventListener("pointerdown", e => {

      if (
        e.target.closest(
          "audio,button,a,input,textarea,select"
        )
      ) {
        return;
      }

      drag = true;

      el.setPointerCapture(
        e.pointerId
      );

      const r =
        el.getBoundingClientRect();

      ox = e.clientX - r.left;
      oy = e.clientY - r.top;

    });


    el.addEventListener("pointermove", e => {

      if (!drag) return;

      const cr =
        $("canvas").getBoundingClientRect();

      let x =
        e.clientX - cr.left - ox;

      let y =
        e.clientY - cr.top - oy;

      x = Math.max(
        0,
        Math.min(
          x,
          cr.width - el.offsetWidth
        )
      );

      y = Math.max(
        0,
        Math.min(
          y,
          cr.height - el.offsetHeight
        )
      );

      el.style.left = x + "px";
      el.style.top = y + "px";

    });


    el.addEventListener(
      "pointerup",
      () => drag = false
    );

  });


$("resetLayout").addEventListener(
  "click",
  () => {

    document
      .querySelectorAll(".draggable")
      .forEach(el => {

        const d =
          defaults[el.dataset.key];

        if (!d) return;

        el.style.left = d.left;
        el.style.top = d.top;
        el.style.width = d.width;

        if (d.height !== "auto") {
          el.style.height = d.height;
        } else {
          el.style.height = "";
        }

      });

  }
);


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


updatePreview();
