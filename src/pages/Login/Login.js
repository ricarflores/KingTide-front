import React, {useState} from "react";
import Title from "./components/Title";
import Label from "./components/Label";
import Input from "./components/Input";
import axios from 'axios'
import './Login.css'
import AuthenticationManager from './components/AuthenticationManager'
let headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
}

const Login = ({onLoginSuccess}) =>{
    const auth = new AuthenticationManager();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [mail, setMail] = useState('');
    const [repeatPass, setRepeatPass] = useState('');
    const [passErr, setPassErr] = useState(false);
    const [passRepeatErr, setPassRepeatErr] = useState(false)
    const [createError, setCreateError] = useState(false);
    const [isLogin, setLogin] = useState(false);
    const [tryLogin, setTryLogin] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    const [userLogin, setUserLogin] = useState('')
    const loginControl = () =>{ 
        if(isLogin){
            onLoginSuccess(userLogin)
        }        
    }

    const handleCreateAccount = (e) =>{
        e.preventDefault();
        setCreateAccount(true);
        setRepeatPass('');
        setPassRepeatErr('');
    }
    const handleCancelCreate = (e) =>{
        e.preventDefault();
        setCreateAccount(false)
    }

    const handleChange =(name, value) =>{
        if(name === "usuario"){
            setUser(value)
        }else{
            value = value.replace(/\s/g, '');
            if(value.length < 4)
            {
                setPassErr(true)
            }else{
                setPassErr(false)
                setPassword(value)
            }
        }
    }
    const handleChangeCreate = (name, value) =>{
        if(name === "usuario"){
            setUser(value.replace(/\s/g, ''))
        } else if(name === "contraseña"){
            setPassword(value.replace(/\s/g, ''))
        } else if (name === "contraseñaRepetida") {
            if(password !== value)
            {   
                setPassRepeatErr(true);
            }else{
                setPassRepeatErr(false);
                setRepeatPass(value.replace(/\s/g, ''))
            }
            
        } else if (name === "email" ){
            setMail(value.replace(/\s/g, ''))
        }
    }

    const handleSubmit = async () =>{
        let account = {
            name: user,
            password: password
        }
        if (account.name.length > 0 && account.password.length > 0){
            try{
                let body = {
                    name: account.name,
                    password: account.password
                }
                let userData = await axios.post("http://localhost:3050/user/login", body, headers=headers)
                if(userData.status === 200){
                    let userGet = userData.data
                    if(userGet){
                        auth.updateToken(userGet.token)
                        auth.updateTokenUser(userGet.id)
                        setUserLogin(userGet.name)
                        setTryLogin(false)
                        setLogin(true)
                    }
                    else{
                        setTryLogin(true)
                        setLogin(false)
                    }
                }else{
                    setTryLogin(true)
                    setLogin(false)
                }   
            }catch(err){
                console.log(err)
                setTryLogin(true)
                setLogin(false)
            }
        }
    }
    const handleCreateUser = async () =>{
        if(user && password && repeatPass && mail)
        {
            if(password === repeatPass){
                try{
                    let body = {
                        name: user
                    }
                    let valUserName = await axios.post("http://localhost:3050/user/create/validate",body, headers=headers)
                    if(valUserName.status === 200){
                        if(valUserName.data.length !== 0){
                            setCreateError(true)
                            return;
                        }
                        let bodyUser = {
                            name:user,
                            password: password,
                            mail: mail
                        }
                        let createUser = await axios.post("http://localhost:3050/users", bodyUser, headers=headers)
                        if(createUser.status === 200)
                        {
                            if(createUser.data){
                                alert("Usuario Creado")
                                setUser('')
                                setPassword('')
                                setRepeatPass('')
                                setMail('')
                                setCreateAccount(false)
                            }
                        }else{
                            setUser('')
                            setPassword('')
                            setRepeatPass('')
                            setMail('')
                            setCreateError(true)   
                        }
                    }
                }catch(err){
                    console.log(err)
                    setCreateError(true)
                }
            }else{
                setPassRepeatErr(true);
            }
        }
    }
    if(!isLogin && !createAccount){
        return(
            <div className="login-container">
                {
                    tryLogin ? 
                    <label className="label-error">
                        Usuario o contraseña incorrectos
                    </label> : null 
                }
                <Title  text= "¡Bienvenido!"/>
                <Input 
                    attribute={{
                        id:"name",
                        name: "usuario",
                        type:"text",
                        placeholder: "Username"
                    }}
                    handleChange = {handleChange}
                />
                <Input 
                     attribute={{
                        id:"password",
                        name: "contraseña",
                        type:"password",
                        placeholder: "Password"
                    }}
                    handleChange = {handleChange}
                    param={passErr}
                />
                {
                    passErr  ?
                        <label className="label-error">
                            La contraseña debe contar con al menos 6 caracteres
                        </label> : null 
                }
                <div className="buttons-container">
                    <button onClick={handleSubmit} className="loginButton">
                        <span>Sing In</span>
                    </button>
                    <button onClick={handleCreateAccount} className="loginButton">
                        <span>Registrer</span>
                    </button>
                </div>
            </div>
        )
    }
    if(createAccount){
        return(

            <div className="login-container"> 
                <Title  text= "¡Crea Tu Usuario!"/>
                <Input 
                    attribute={{
                        id:"name",
                        name: "usuario",
                        type:"text",
                        placeholder: "Ingresa su usuario"
                    }}
                    handleChange = {handleChangeCreate}
                />
                <Input 
                     attribute={{
                        id:"password",
                        name: "contraseña",
                        type:"password",
                        placeholder: "Ingresa su contraseña"
                    }}
                    handleChange = {handleChangeCreate}
                    param={passErr}
                />
                <Input 
                     attribute={{
                        id:"passwordRepeat",
                        name: "contraseñaRepetida",
                        type:"password",
                        placeholder: "Confirme su contraseña"
                    }}
                    handleChange = {handleChangeCreate}
                    param={passErr}
                />
                {
                    passRepeatErr ? 
                    <label className="label-error">
                        Las contraseñas no coinciden
                    </label> : null
                }
                <Input 
                     attribute={{
                        id:"email",
                        name: "email",
                        type:"email",
                        placeholder: "Ingrese Su correo"
                    }}
                    handleChange = {handleChangeCreate}
                    param={passErr}
                />
                <div className="buttons-container">
                    <button onClick={handleCreateUser} className="loginButton">
                        <span>Create</span>
                    </button>
                    <button onClick={handleCancelCreate} className="loginButton">
                        <span>Back</span>
                    </button>
                </div>
                <div className="error-create">
                    {createError ? 
                        <label className="label-error">
                            El usuario ya existe en la base de datos y/o ocurrio un error al realizar la peticion
                        </label> : null
                    }
                </div>
            </div>
        )
    }
    return(
        <div>
            <label>¡Bienvenido! {user}</label>
            <button onClick={loginControl}>Entrar al chat</button>
        </div>
    )

}
export default Login