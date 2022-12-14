import React, { useState } from 'react';
import './App.css';
import Navbar from './components/index';
import { Switch } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route}
	from 'react-router-dom';
import Home from './pages';
import About from './pages/about';
import Blogs from './pages/blogs';
import SignUp from './pages/signup';
import Contact from './pages/contact';
import Dashboard from '../pages/dashboard';
import Preferences from '../pages/preferences';
import Login from './pages/login';


function App() {
	const [token, setToken] = useState();

	if(!token) {
		return <Login setToken={setToken} />
	}

	return (
		<Router>
		<Navbar />
		<Routes>
			<Route exact path='/' exact element={<Home />} />
			<Route path='/about' element={<About/>} />
			<Route path='/contact' element={<Contact/>} />
			<Route path='/blogs' element={<Blogs/>} />
			<Route path='/sign-up' element={<SignUp/>} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/preferences" element={<Preferences />} />	
		</Routes>
		</Router>
	);
}

export default App;

 