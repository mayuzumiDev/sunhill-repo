import CryptoJS from "crypto-js";

function generateCsrfToken() {
  const token = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  return token;
}

function setCsrfToken(token) {
  document.cookie = `csrftoken=${token}; path=/; secure; sameSite=strict`;
}
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export { generateCsrfToken, setCsrfToken, getCookie };
