import React, { useEffect } from 'react';
import useToken from '../components/useToken';
import PropTypes from 'prop-types';

export default function Logut() {
  
  const { token, setToken } = useToken();

  useEffect(() => {
    if(token){
        setToken({})
    }
    }, []);

  return(
    <div className="login-wrapper">
      <h1>You have logged out.</h1>
    </div>
  )
}

