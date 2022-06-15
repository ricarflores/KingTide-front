import { useRef, useState, useEffect } from "react"
import axios from 'axios'

const Login = () =>{
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUSer] = useState('');
    const [pwd, setPwd] = useState('');
    const [mail, setMail] = useState('');
    const [errMsg, setErrMsg] = useState()
    const [success, setSucess] = useState(false);

    useEffect(()=>{
        userRef.current.focus();
    },[]);

    useEffect(()=>{
        setErrMsg('')
    },[user,pwd])

    const handleSubmitLogin = async (e) =>{
        e.preventDefault();
        try{
            let body = {
                name: user,
                password: pwd
            }
            let headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
            let userData = await axios.post("http://localhost:3050/user/login", body, headers=headers)
            if(userData.status === 200){
                let userGet = userData.data[0]
                if(userGet){
                    setSucess(true);
                    setUSer('');
                    setPwd('')
                }
            }else{
                setErrMsg(userData.data)
            }
        }catch(err){
            console.log(err);
        }
    }

    return(
        <div>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen" } aria-live="assertive">
                {errMsg}
            </p>
            <h1>Login</h1>
            <form onSubmit={handleSubmitLogin}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" ref={userRef} autoComplete="off" onChange={(e)=> setUSer(e.target.value)} value={user} required></input>
                
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" onChange={(e)=> setPwd(e.target.value)} value={pwd} required></input>


                <button>Log In</button>
            </form>
        </div>
    )
}

export default Login