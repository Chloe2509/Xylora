const supabaseClient = window.supabase.createClient(
  "https://jejwsdvololiabbatfj.supabase.co",
  "sb_publishable_lIsXchSu46GbMWCr2R8Y-g_Zu-BICr2"
);

const $ = id => document.getElementById(id);

let mode = "login";

function updateMode() {
  const signup = mode === "signup";

  $("authTitle").textContent =
    signup ? "Create your account" : "Welcome to Xylora";

  $("authSubtitle").textContent =
    signup
      ? "Create an account to start building your profile."
      : "Log in to continue to your profile.";

  $("authSubmit").textContent =
    signup ? "Sign Up" : "Log In";

  $("authToggleText").textContent =
    signup
      ? "Already have an account?"
      : "Don't have an account?";

  $("authToggle").textContent =
    signup ? "Log In" : "Sign Up";

  $("authMessage").textContent = "";
}

$("authToggle").onclick = () => {
  mode = mode === "login" ? "signup" : "login";
  updateMode();
};

$("authSubmit").onclick = async () => {

  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;

  if (!email || !password) {
    $("authMessage").textContent =
      "Enter your email and password.";
    return;
  }

  $("authMessage").textContent =
    mode === "signup"
      ? "Creating your account..."
      : "Logging in...";

  const result =
    mode === "signup"
      ? await supabase.auth.signUp({
          email,
          password
        })
      : await supabase.auth.signInWithPassword({
          email,
          password
        });

  if (result.error) {
    $("authMessage").textContent =
      result.error.message;
    return;
  }

  if (mode === "signup" && !result.data.session) {
    $("authMessage").textContent =
      "Check your email to confirm your account.";
    return;
  }

  window.location.href = "builder.html";
};

$("discordLogin").onclick = async () => {

  $("authMessage").textContent =
    "Opening Discord...";

  const result =
    await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo:
          window.location.origin +
          window.location.pathname
      }
    });

  if (result.error) {
    $("authMessage").textContent =
      result.error.message;
  }
};

async function checkLogin() {

  const { data } =
    await supabase.auth.getSession();

  if (data.session) {
    window.location.href = "builder.html";
  }
}

updateMode();
checkLogin();
