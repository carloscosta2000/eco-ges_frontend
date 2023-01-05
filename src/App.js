import React, { useState } from 'react';
import './App.css';
import Navbar from './components/index';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages';
import SignUp from './pages/signup';
import Login from './pages/login';
import Logout from './pages/logout';
import useToken from './components/useToken';
import { Appliances } from './pages/appliances';


function App() {
	//const token = getToken();
	const { token, setToken } = useToken();

	return (
		<Router>
		<Navbar />
			<Routes>
				<Route exact path='/' exact element={<Home/>} />
				<Route path='/appliances' element={<Appliances/>} />
				<Route path='/login' element={<Login setToken={setToken}/>} />
				<Route path='/sign-up' element={<SignUp/>} />
				<Route path='/logout' element={<Logout/>} />
			</Routes>
		</Router>
	);
}

export default App;

 