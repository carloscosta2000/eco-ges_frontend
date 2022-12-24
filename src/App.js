import React, { useState } from 'react';
import './App.css';
import Navbar from './components/index';
import { Switch } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Home from './pages';
import SignUp from './pages/signup';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Preferences from './pages/preferences';
import useToken from './components/useToken';
import { Appliances } from './pages/appliances';

// function setToken(userToken) {
// 	sessionStorage.setItem('token', JSON.stringify(userToken));
// }

// function getToken() {
// 	const tokenString = sessionStorage.getItem('token');
// 	const userToken = JSON.parse(tokenString);
// 	return userToken?.token
// }


function App() {
	//const token = getToken();
	const { token, setToken } = useToken();

	if(!token) {
		return (
			<Router>
			<Navbar />
				<Routes>
					<Route path='/login' element={<Login setToken={setToken}/>} />
					<Route path='/sign-up' element={<SignUp/>} />
				</Routes>
			</Router>
		);
		//return <Login setToken={setToken} />
	}

	return (
		<Router>
		<Navbar />
			<Routes>
				<Route exact path='/' exact element={<Home/>} />
				<Route path='/appliances' element={<Appliances/>} />
				<Route path='/dashboard' element={<Dashboard/>} />
				<Route path='/preferences' element={<Preferences/>} />
			</Routes>
		</Router>
	);
}

export default App;

 