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
    state.plan === "premium" ? "Premium plan" : "Free plan";

  $("planButton").textContent =
    state.plan === "premium" ? "💎 Premium" : "🆓 Free";

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
    state.links.map(x =>
      `<span class="link-pill">${x.name}</span>`
    ).join("");

  $("previewSections").innerHTML =
    state.sections.map(x =>
      `<span class="section-pill">${x}</span>`
    ).join("");
}


/* TEXT + COLORS */

[
  "displayName",
  "username",
  "bio",
  "bgColor",
  "bgColor2"
].forEach(id => {
  $(id).addEventListener("input", updatePreview);
});

$("backgroundStyle").addEventListener("change", updatePreview);
$("fontSelect").addEventListener("change", updatePreview);


/* PLAN */

$("planSelect").addEventListener("change", e => {
  state.plan = e.target.value;

  if (state.plan === "free") {
    state.bgImage = "";
  }

  updatePreview();
});


/* AVATAR */

$("avatarInput").addEventListener("change", e => {
  const file = e.target.files[0];

  if (!file) return;

  if (
    state.plan === "free" &&
    file.type === "image/gif"
  ) {
    alert("Animated profile pictures are a Premium feature.");
    e.target.value = "";
    return;
  }

  state.avatarUrl = URL.createObjectURL(file);
  $("avatar").src = state.avatarUrl;
});


/* BACKGROUND IMAGE */

$("bgImageInput").addEventListener("change", e => {
  if (state.plan !== "premium") {
    alert("Background pictures are a Premium feature.");
    e.target.value = "";
    return;
  }

  const file = e.target.files[0];

  if (!file) return;

  state.bgImage = URL.createObjectURL(file);

  updatePreview();
});


/* AUDIO */

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


/* LINKS */

document.querySelectorAll("[data-link]").forEach(button => {
  button.addEventListener("click", () => {

    const name = button.dataset.link;

    const url = prompt(
      `Enter your ${name} link:`
    );

    if (!url) return;

    state.links.push({
      name: name,
      url: url
    });

    updatePreview();
  });
});


/* SECTIONS */

document.querySelectorAll("[data-section]").forEach(button => {

  button.addEventListener("click", () => {

    const section = button.dataset.section;

    if (!state.sections.includes(section)) {
      state.sections.push(section);
    }

    updatePreview();
  });

});


/* ================================================= */
/* INDIVIDUAL DRAGGING */
/* ================================================= */

document.querySelectorAll(".draggable").forEach(element => {

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener("pointerdown", event => {

    if (
      event.target.closest(
        "audio,button,a,input,textarea,select"
      )
    ) {
      return;
    }

    dragging = true;

    const elementRect =
      element.getBoundingClientRect();

    offsetX =
      event.clientX - elementRect.left;

    offsetY =
      event.clientY - elementRect.top;

    element.setPointerCapture(
      event.pointerId
    );
  });


  element.addEventListener("pointermove", event => {

    if (!dragging) return;

    const canvas =
      document.getElementById("canvas");

    const canvasRect =
      canvas.getBoundingClientRect();

    const x =
      event.clientX -
      canvasRect.left -
      offsetX;

    const y =
      event.clientY -
      canvasRect.top -
      offsetY;

    element.style.left =
      Math.max(0, x) + "px";

    element.style.top =
      Math.max(0, y) + "px";
  });


  element.addEventListener("pointerup", event => {

    dragging = false;

    try {
      element.releasePointerCapture(
        event.pointerId
      );
    } catch {}
  });


  element.addEventListener("pointercancel", () => {
    dragging = false;
  });

});


/* RESET */

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
    width: "70%"
  },

  audio: {
    left: "7%",
    top: "51%",
    width: "440px"
  },

  links: {
    left: "7%",
    top: "67%",
    width: "75%"
  },

  sections: {
    left: "7%",
    top: "78%",
    width: "80%"
  }
};


$("resetLayout").addEventListener("click", () => {

  document.querySelectorAll(".draggable")
    .forEach(element => {

      const settings =
        defaults[element.dataset.key];

      if (!settings) return;

      element.style.left =
        settings.left;

      element.style.top =
        settings.top;

      element.style.width =
        settings.width;

      if (settings.height) {
        element.style.height =
          settings.height;
      }
    });

});


/* SAVE */

$("saveProfile").addEventListener("click", () => {

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
});


/* START */

updatePreview();
