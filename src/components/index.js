import React, { useEffect } from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";


const Navbar = () => {
return (
	<>
	<Nav>
		<NavMenu>
		<NavLink to="/" activeStyle>
			Critical Data
		</NavLink>
		<NavLink to="/appliances" activeStyle>
			Appliances
		</NavLink>
		<NavLink to="/sign-up" activeStyle>
			Sign Up
		</NavLink>
		<NavLink to="/login" activeStyle>
			Login
		</NavLink>
		<NavLink to="/logout" activeStyle>
			Logout
		</NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;
