
import Cookies from "universal-cookie";
import jwtDecode from "jwt-decode";
const tokenKey = "session";


class AuthenticationManager {
    constructor(){
        const cokkies = new Cookies();
        this.cookie = cokkies;
    }
    _token;
    _user = null;

    updateToken(token){
        this._token= token;
        if(token){
            this.cookie.set(tokenKey, token, 
                {
                    path: '/'
                }
            )
        }
        else{
            this.cookie.remove(tokenKey, {
                path: '/'
            })
        }
    }
    updateTokenUser(userId){
        if(userId){
            this.cookie.set("userid", userId,{
                path:'/'
            })
        }
        else{
            this.cookie.remove("userid", {
                path: '/'
            })
        }
    }
    getAccessToken(){
        let result = this.cookie.get(tokenKey);
        if(!result){
            return ""
        }else{
            return result
        }
    }
    getNameFromCookie(){
        let cook = this.cookie.get(tokenKey);
        if(!cook){
            return false
        }else{
            return jwtDecode(cook);
        }
    }
    getIdFromCookie(){
        let cook = this.cookie.get("userid");
        if(!cook){
            return ""
        }else{
            return cook;
        }
    }
    logout() {
        this.updateToken(null);
    }
}

export default AuthenticationManager;