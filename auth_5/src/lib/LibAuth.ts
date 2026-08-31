import Config from "../config"

const LibAuth = {
  getCookieValue: function (key) {
    const cookies = document.cookie.split('; ');
    console.log(cookies);
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === key) {
            return decodeURIComponent(value);
        }
    }
    return null;
  },

  isValidLogin: function () {
    const value = this.getCookieValue(Config.COOKIE_KEY)
    console.log("value=", value);
    if(!value){
      location.href = "/login";
    }
  },

}
export default LibAuth;
