import React from "react";
import Chat from "./components/Chat";
import AuthenticationManager from "../Login/components/AuthenticationManager";
import './Home.css'
const Home = ({name}) =>{
    const auth = new AuthenticationManager();

    if(!name){
        let getName = auth.getNameFromCookie();
        name = getName.name
    }
    return(
        <div>
            <Chat name={name} />
        </div>
    )   
}

export default Home