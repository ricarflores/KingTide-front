import axios from "axios";
import React, {useState, useEffect, useRef} from "react";
import socket from "./Socket";
import AuthenticationManager from "../../Login/components/AuthenticationManager";
import './PrivateChat.css';

const PrivateChat = ({nombre}) =>{
    const auth = new AuthenticationManager();
    const [users , setUsers] = useState([]);
    const [privateMesaje, setPrivateMesaje] = useState("");
    const [toUser, setToUser] = useState("");
    const [errorUser, setErrorUser] = useState(false);
    const [mensajesPrivados, setMensajesPrivados] = useState([]);
    const [reload, setReload] = useState(false);
    const userId = auth.getIdFromCookie();
    useEffect(()=>{
        const users = async () =>{
            let headers = {
                'accept': 'application/json'
            }
            let data = await axios.get("http://localhost:3050/users/list", headers);
            if(data.status === 200)
            {
                let usersName = data.data;
                setUsers([{_id:0,name:"---select---", "mail": "n/a"},...usersName])
            }
        }
        users()
    },[]);

    useEffect(()=>{
        const getMessages = async( ) =>{
            let from = auth.getIdFromCookie();
            let too = toUser;
            if(from !== ""&& too !== "")
            {
                let headers = {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
                let body ={
                    from : auth.getIdFromCookie(),
                    too: toUser
                }
                let roomInfo = await axios.post("http://localhost:3050/getRoom", body, headers);
                if(roomInfo.status === 200)
                {
                    let idTalk = roomInfo.data.idTalk;
                    if(idTalk){
                        socket.on(`${idTalk}`, async (mensaje) =>{
                            let getLastMensajes = await axios.post("http://localhost:3050/get/messages/room", {
                                idTalk: idTalk
                            },headers);
                            if(getLastMensajes.status === 200)
                            {
                                setMensajesPrivados(getLastMensajes.data)
                            }else
                            {
                                setMensajesPrivados([...mensajesPrivados, mensaje])
                            }
                        })
                    }
                }
            }
        }
        getMessages()
        
        return () =>{socket.off()}
    },[mensajesPrivados])


    const divRef = useRef(null);
    useEffect(()=>{
        divRef.current.scrollIntoView({behavior: 'smooth'})
    })
    const handleChangeUser = async (e) =>{
        try{
            setToUser(e.target.value)
            if(errorUser){
                setErrorUser(false)
            }
            let headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
            let body ={
                from : auth.getIdFromCookie(),
                too: e.target.value
            }
            let roomInfo = await axios.post("http://localhost:3050/getRoom", body, headers);
            if(roomInfo.status === 200)
            {
                let idTalk = roomInfo.data.idTalk 
                if(idTalk){
                    let getLastMensajes = await axios.post("http://localhost:3050/get/messages/room", {
                        idTalk: idTalk
                    },headers);
                    if(getLastMensajes.status === 200)
                    {
                        setMensajesPrivados(getLastMensajes.data)
                    }else{
                        setMensajesPrivados([])
                    }
                }else{
                    setMensajesPrivados([])
                }
            }
        }catch(err){
            console.log(err)
        }
    }
    const sendPrivateMesaje = (e) =>{
        e.preventDefault();
        if(!toUser)
        {
            setErrorUser(true);
            return;
        }
        socket.emit("privateMensaje", toUser, userId, privateMesaje)
        setPrivateMesaje("");
        setReload(!reload);
    }
    
    return(
        <div>
            <div className="mgs-header">
                <div className="msger-header-title">
                    <select name="usuarios" onChange={handleChangeUser}>
                        {users.map(usuario =>(
                            <option key={usuario._id} value={usuario['_id']}> {usuario.name}</option>
                        ))}
                    </select>
                    {
                        errorUser ? 
                        <label className="label-error">
                            Usuario no valido
                        </label> : null
                    }
                </div>
            </div>
                <div className="msg-chat">
                    <div className="chat">
                        {mensajesPrivados.map((e, i)=> 
                        <div key={i} className={e.from === userId ? "msg right-msg" : "msg left-msg"}>
                            <div className="msg-bubble">
                                <div className="msg-info">
                                    <div className="msg-info-time">{e.date}</div>
                                </div>
                                <div className="msg-text">{e.mensaje}</div>
                            </div> 
                        </div> )}
                        <div ref={divRef}></div>
                    </div>
                </div>
                <form onSubmit={sendPrivateMesaje} className="msger-inputarea">
                    <textarea value={privateMesaje} onChange={e =>setPrivateMesaje(e.target.value)} className="send-area" placeholder="Enter your message..."></textarea>
                    <button className="send-button">Enviar</button>
                </form>
        </div>
    )
}

export default PrivateChat