import React, {useState} from 'react';
import Login from './pages/Login/Login'
import Home from './pages/Home/Home';
import './App.css';
import AuthenticationManager from './pages/Login/components/AuthenticationManager';

function App() {
  const auth = new AuthenticationManager();
  const[login, setLogin] = useState(false)
  const onLoginSuccess = loginInfo =>{
    setLogin(loginInfo)
  }
  let token = auth.getAccessToken();
  if(!login && !token){
    return (
      <main className="App">
        <Login onLoginSuccess={onLoginSuccess}/>
      </main>
    );
  }else{
    return(
      <main>
        <Home name={login} /> 
      </main>
    )
  }
  
}

export default App;
