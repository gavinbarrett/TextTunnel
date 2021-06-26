import * as React from 'react';
import * as Router from 'react-router-dom';
import { Footer } from './Footer';
import { UserAuth } from '../UserAuth';
import './sass/LandingPage.scss';

const LandingText = () => {
	return (<div id="landing-text">
		<p id="landing-tag">{"Type securely with Tunnelr"}</p>
	</div>);
}

const SignUp = ({loggedIn}) => {
	return (<div id="sign-up">
		{loggedIn ? "" :
		<button id="signup-button">
			<Router.Link to="/signup">{"sign up"}</Router.Link>
		</button>}
	</div>);
}

export const LandingPage = () => {
	const { loggedIn } = React.useContext(UserAuth);
	return (<><div id="landing-page">
		<LandingText/>
		<SignUp loggedIn={loggedIn}/>
	</div>
	<Footer/></>);
}