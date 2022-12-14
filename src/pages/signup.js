import React, { useState } from 'react';
import { signup_client } from '../services/SignupService';
import './signup.css';

const SignUp = () => {

	// useEffect(() => { 
	// 	async function signup() {
	// 	  const response = await signup_client("fiaes", "1234", "rsakeyyyy", "francisco");
	// 	}
	// 	//signup();
	// }, []);

	
	// States for registration
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [publickey, setPublickey] = useState('');
	
	// States for checking the errors
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState(false);

	// States for messages
	const [errorText, setErrorText] = useState("");
	const [successText, setSuccessText] = useState("");
   
	// Handling the name change
	const handleName = (e) => {
		setName(e.target.value);
		setSubmitted(false);
	};
   
	// Handling the username change
	const handleUsername = (e) => {
		setUsername(e.target.value);
		setSubmitted(false);
	};
   
	// Handling the password change
	const handlePassword = (e) => {
		setPassword(e.target.value);
		setSubmitted(false);
	};

	// Handling the publickey change
	const handlePublicKey = (e) => {
		setPublickey(e.target.value);
		setSubmitted(false);
	};


	// Handling the form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		//TODO testar a public key
		if (name === '' || username === '' || password === '') {
			setError(true);
		} else {
			//setSubmitted(true);
			//setError(false);
			const response = await signup_client(username, password, publickey, name);

			if("error" in response){
				setError(true);
				setErrorText(response.error)
			}else{
				setSubmitted(true);
				setError(false);
				setSuccessText(response.success)
			}
		}
	};
	 
	// Showing success message
	const successMessage = () => {
		return (
			<div
			className="success"
			style={{
				display: submitted ? '' : 'none',
			}}>
			<h1>{successText}</h1>
			</div>
		);
	};

	// Showing error message if error is true
	const errorMessage = () => {
		return (
		<div
			className="error"
			style={{
			display: error ? '' : 'none',
			}}>
			<h1>{errorText}</h1>
		</div>
		);
	};

	return ( 
		<div className="form">
      <div>
        <h1>User Registration</h1>
      </div>
 
      {/* Calling to the methods */}
      <div className="messages">
        {errorMessage()}
        {successMessage()}
      </div>
 
      <form>
        {/* Labels and inputs for form data */}
        <label className="label">Name</label>
        <input onChange={handleName} className="input"
          value={name} type="text" />
 
        <label className="label">Username</label>
        <input onChange={handleUsername} className="input"
          value={username} type="text" />
 
        <label className="label">Password</label>
        <input onChange={handlePassword} className="input"
          value={password} type="password" />

		<label className="label">Public Key</label>
        <input onChange={handlePublicKey} className="input"
          value={publickey} type="text" />
 
        <button onClick={handleSubmit} className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
	);
};

export default SignUp;
