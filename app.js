import { loadPage } from "./router.js";
import { loadTheme } from "./shared/theme.js";

window.go = loadPage;

loadTheme();

// default route
loadPage("modules/login_register/login.html");

// service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}