import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import socket from "./Socket";
import './Chat.css'
import PrivateChat from "./PrivateChat";
import AuthenticationManager from "../../Login/components/AuthenticationManager";


const Chat = ({name}) =>{
    const auth = new AuthenticationManager();
    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);
    const [privateMesaje, setPrivateMesaje] = useState(false)
    const [reload, setReload] = useState(false)
    if(!name){
        let getName = auth.getNameFromCookie();
        name = getName.name
    }
    useEffect(()=>{
        const lastMesajes = async () =>{
            try{
                let headers = {
                    'accept': 'application/json'
                }
                let data = await axios.get("http://localhost:3050/mensajes", headers);
                if(data.status === 200)
                {
                    let lastMesajes = data.data;
                    setMensajes([...lastMesajes])
                    socket.on("mensajes", mensaje =>{
                        setMensajes([...mensajes, mensaje])
                        setReload(!reload)
                    })
                }else{
                    setMensajes([])
                }
            }catch(err){
                console.log(err)
                setMensajes([])
            }
        }
        lastMesajes();
        return () =>{socket.off()}
    },[reload])

    const divRef = useRef(null)
    useEffect(()=>{
        divRef.current.scrollIntoView({behavior: 'smooth'})
    })
    const sendMesaje = (e) =>{
        e.preventDefault();
        socket.emit("mensaje", name, mensaje)
        setMensaje('');
        setReload(!reload)
    }
    const handlePrivate = (e) =>{
        e.preventDefault();
        setPrivateMesaje(true);
        
    }
    return(
        <div className="msger">
            <header className="msger-header">
                <div className="msger-header-title">
                    <i className="fas fa-comment-alt"></i> Global Chat
                </div>
                <div className="msger-header-title">
                    <i className="fas fa-comment-alt"></i> User: {name}
                </div>
            </header>
            <div className="msg-chat">
                <div className="chat">
                    {mensajes.map((e, i) => 
                        <div key={i} className= {(e.nombre) ? e.nombre : e.from === name ? "msg right-msg" : "msg left-msg"}>
                            <div className="msg-bubble">
                                <div className="msg-info">
                                    <div className="msg-info-name">{(e.nombre) ? e.nombre : e.from}</div>
                                    <div className="msg-info-time">{e.date}</div>
                                </div>
                                <div className="msg-text">{e.mensaje}</div>
                            </div> 
                        </div> )}
                        <div ref={divRef}></div>
                </div>
                <div>
                    <form onSubmit={sendMesaje} className="msger-inputarea">
                        <textarea value={mensaje} onChange={e =>setMensaje(e.target.value) } className="send-area" placeholder="Enter your message..."></textarea>
                        <button className="send-button">Enviar</button>
                    </form>
                </div>
            </div>
            <div className="msger-header">
                <label>Chat Privado</label>
                <button onClick={handlePrivate} className="send-button">Iniciar</button>
            </div>
            {
                privateMesaje ?
                <PrivateChat nombre={name}/>
                : null
            }
        </div>
    )
}

export default Chat;