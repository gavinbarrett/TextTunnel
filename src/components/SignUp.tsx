import * as React from 'react';
import * as Router from 'react-router-dom';
import { updateDataStore } from './dataStore';
import { Footer } from './Footer';
import { UserAuth } from '../UserAuth';
import './sass/SignUp.scss';

export const SignUp = ({updateLandingMessage}) => {
	const { updateLoggedIn, updateUser } = React.useContext(UserAuth);
	const [username, updateUsername] = React.useState('');
	const [password, updatePassword] = React.useState('');
	const [rePassword, updateRePassword] = React.useState('');
	const [email, updateEmail] = React.useState('');
	const [signUpError, updateSignUpError] = React.useState('');
	const [errorDisplay, updateErrorDisplay] = React.useState('');
	const pageHistory = Router.useHistory();
	const userRegex = /^[a-z0-9]+$/i;
	const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z0-9]+$/i;

	const attemptSignUp = async () => {
		/* attempt to sign the user up for Tunnelr */
		if (validCredentials()) {
			const resp = await fetch("/signup", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({"user": username, "pass": password, "email": email})});
			const r = await resp.json();
			if (resp.status != 200) return; // FIXME: throw error
			updateLandingMessage("Please verify your account from your email address");
			setTimeout(() => updateLandingMessage(''), 5000);
			pageHistory.push("/");
		} else {
			//updateSignUpError('Could not sign up');
			//setTimeout(() => updateSignUpError(''), 5000);
		}
	}

	const validCredentials = () => {
		if (!username.match(userRegex)) {
			console.log('username');
			updateSignUpError('Username is invalid');
			updateErrorDisplay('error-displayed');
			setTimeout(() => {
				updateSignUpError('');
				updateErrorDisplay('');
			}, 5000);
			return false;
		} else if (!password.match(userRegex)) {
			console.log('password');
			updateSignUpError('Password is invalid');
			updateErrorDisplay('error-displayed');
			setTimeout(() => {
				updateSignUpError('');
				updateErrorDisplay('');
			}, 5000);
			return false;
		} else if (password != rePassword) {
			console.log('retype');
			updateSignUpError('Passwords do not match');
			updateErrorDisplay('error-displayed');
			setTimeout(() => {
				updateSignUpError('');
				updateErrorDisplay('');
			}, 5000);
			return false;
		} else if (!email.match(emailRegex)) {
			console.log('email');
			updateSignUpError('Email is not valid');
			updateErrorDisplay('error-displayed');
			setTimeout(() => {
				updateSignUpError('');
				updateErrorDisplay('');
			}, 5000);
			return false;
		} else {
			console.log('success');
			return true;
		}
	}

	return (<><div id="signup-wrapper">
		<div id="signup-box">
			<div id="signup-title">
				<p className={`error ${errorDisplay}`}>{signUpError}</p>
			</div>
			<label htmlFor="username">Username</label>
			<input name="username" maxLength={64} placeholder={"enter username"} autoComplete={"off"} onChange={e => updateUsername(e.target.value)}/>
			<label htmlFor="password">Password</label>
			<input name="password" maxLength={64} placeholder={"enter password"} autoComplete={"off"} type={"password"} onChange={e => updatePassword(e.target.value)}/>
			<label htmlFor="rePassword">Re-enter Password</label>
			<input name="rePassword" maxLength={64} placeholder={"enter password"} autoComplete={"off"} type={"password"} onChange={e => updateRePassword(e.target.value)}/>
			<label hmltFor="email">Email</label>
			<input name="email" maxLength={64} placeholder={"enter email"} autoComplete={"off"} onChange={e => updateEmail(e.target.value)}/>
			<button onClick={attemptSignUp}>{"Sign Up"}</button>
		</div>
	</div>
	<Footer/></>);
}