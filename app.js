const $ = id => document.getElementById(id);

const SUPABASE_URL = "https://jejwsdvololiabbatfj.supabase.co";
const SUPABASE_KEY = "sb_publishable_lIsXchSu46GbMWCr2R8Y-g_Zu-BICr2";

const sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let mode = "login";

let state = {
  plan: "free",
  links: [],
  worlds: [],
  name: "",
  username: "",
  bio: ""
};


/* =========================
   AUTH
========================= */

async function start() {
  const { data } = await sb.auth.getSession();

  if (data.session) {
    openApp();
  }
}

start();


function openApp() {
  $("auth").hidden = true;
  $("app").hidden = false;

  load();
  render();
}


/* SIGN UP */

$("signup").onclick = async () => {

  mode = "signup";

  const email = $("email").value;
  const password = $("password").value;

  if (!email || !password) {
    $("msg").textContent = "Enter your email and password.";
    return;
  }

  const result = await sb.auth.signUp({
    email,
    password
  });

  if (result.error) {
    $("msg").textContent = result.error.message;
  } else {
    $("msg").textContent =
      "Check your email to confirm your account.";
  }
};


/* LOG IN */

$("authBtn").onclick = async () => {

  mode = "login";

  const email = $("email").value;
  const password = $("password").value;

  if (!email || !password) {
    $("msg").textContent = "Enter your email and password.";
    return;
  }

  const result = await sb.auth.signInWithPassword({
    email,
    password
  });

  if (result.error) {
    $("msg").textContent = result.error.message;
  } else {
    openApp();
  }
};


/* DISCORD / GOOGLE */

async function oauth(provider) {

  const result = await sb.auth.signInWithOAuth({
    provider,

    options: {
      redirectTo: window.location.href
    }
  });

  if (result.error) {
    $("msg").textContent = result.error.message;
  }
}


$("discord").onclick = () => {
  oauth("discord");
};


$("google").onclick = () => {
  oauth("google");
};


/* LOG OUT */

$("logout").onclick = async () => {

  await sb.auth.signOut();

  location.reload();
};


/* =========================
   PROFILE PREVIEW
========================= */

function render() {

  $("pname").textContent =
    $("name").value || "Your Name";

  $("un").textContent =
    $("username").value || "@username";

  $("bio").textContent =
    $("bio").value || "Your bio goes here.";

  $("profile").style.fontFamily =
    $("font").value;

  const color1 = $("c1").value;
  const color2 = $("c2").value;

  $("profile").style.background =
    `linear-gradient(120deg, ${color1}, ${color2})`;

  $("badge").style.display =
    $("plan").value === "premium" &&
    !$("branding").checked
      ? "none"
      : "block";


  /* LINKS */

  $("links").innerHTML =
    state.links
      .map(link =>
        `<span class="pill">${link}</span>`
      )
      .join("");


  /* WORLDS */

  $("worlds").innerHTML =
    state.worlds
      .map(world =>
        `<span class="pill">🌎 ${world}</span>`
      )
      .join("");
}


/* =========================
   LIVE UPDATES
========================= */

[
  "name",
  "username",
  "bio",
  "font",
  "c1",
  "c2",
  "plan",
  "branding"
].forEach(id => {

  $(id).addEventListener("input", render);

  $(id).addEventListener("change", render);

});


/* =========================
   PROFILE PICTURE
========================= */

$("avatar").onchange = event => {

  const file = event.target.files[0];

  if (!file) return;


  if (
    $("plan").value === "free" &&
    /gif|webp/i.test(file.type)
  ) {

    alert(
      "Animated profile pictures are a Premium feature."
    );

    event.target.value = "";

    return;
  }


  const image = $("avatarImg");

  image.src = URL.createObjectURL(file);

  image.style.display = "block";

  image.nextElementSibling.style.display = "none";
};


/* =========================
   AUDIO
========================= */

$("audio").onchange = event => {

  const file = event.target.files[0];

  if (!file) return;

  $("player").src =
    URL.createObjectURL(file);
};


/* =========================
   SPOTIFY
========================= */

$("addSpotify").onclick = () => {

  const value =
    $("spotify").value.trim();

  const match =
    value.match(
      /spotify\.com\/track\/([A-Za-z0-9]+)/i
    );

  if (!match) {

    alert(
      "Paste a valid Spotify track link."
    );

    return;
  }

  const trackID = match[1];

  $("sp").src =
    `https://open.spotify.com/embed/track/${trackID}`;

  $("sp").hidden = false;

  $("player").removeAttribute("src");
};


/* =========================
   SOCIAL LINKS
========================= */

document
  .querySelectorAll("[data-social]")
  .forEach(button => {

    button.onclick = () => {

      const name =
        button.dataset.social;

      const link =
        prompt(`Enter your ${name} link:`);

      if (!link) return;

      state.links.push(name);

      render();
    };

  });


/* =========================
   WORLDS
========================= */

document
  .querySelectorAll("[data-world]")
  .forEach(button => {

    button.onclick = () => {

      const world =
        button.dataset.world;

      if (!state.worlds.includes(world)) {

        state.worlds.push(world);

        render();
      }
    };

  });


/* =========================
   PREMIUM EFFECTS
========================= */

document
  .querySelectorAll(".premiumEffect")
  .forEach(effect => {

    effect.onchange = () => {

      if ($("plan").value !== "premium") {

        effect.checked = false;

        alert(
          "This effect is a Premium feature."
        );
      }

    };

  });


/* =========================
   DRAGGING
========================= */

document
  .querySelectorAll(".drag")
  .forEach(element => {

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;


    element.onpointerdown = event => {

      if (
        event.target.closest(
          "audio, iframe, button, input, textarea, select"
        )
      ) {
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
    };


    element.onpointermove = event => {

      if (!dragging) return;

      const canvas =
        $("canvas").getBoundingClientRect();

      let x =
        event.clientX -
        canvas.left -
        offsetX;

      let y =
        event.clientY -
        canvas.top -
        offsetY;


      x = Math.max(
        0,
        Math.min(
          x,
          canvas.width -
          element.offsetWidth
        )
      );


      y = Math.max(
        0,
        Math.min(
          y,
          canvas.height -
          element.offsetHeight
        )
      );


      element.style.left =
        x + "px";

      element.style.top =
        y + "px";
    };


    element.onpointerup = () => {
      dragging = false;
    };

  });


/* =========================
   SAVE
========================= */

$("save").onclick = () => {

  state.plan =
    $("plan").value;

  state.name =
    $("name").value;

  state.username =
    $("username").value;

  state.bio =
    $("bio").value;


  localStorage.setItem(
    "xylora",
    JSON.stringify(state)
  );


  alert("Profile saved ✓");
};


/* =========================
   RESET
========================= */

$("reset").onclick = () => {

  location.reload();

};


/* =========================
   LOAD SAVED PROFILE
========================= */

function load() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem("xylora") || "{}"
      );

    Object.assign(
      state,
      saved
    );


    $("name").value =
      state.name || "";

    $("username").value =
      state.username || "";

    $("bio").value =
      state.bio || "";

    $("plan").value =
      state.plan || "free";


  } catch {

    console.log(
      "No saved Xylora profile found."
    );

  }

}
