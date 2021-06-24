import { load } from 'dotenv/types';
import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import './sass/Account.scss';

export const Account = ({user, updateUser, updateLoggedIn, profile, updateProfile, loc}) => {
	const [name, updateName] = React.useState(null);
	const [self, updateSelf] = React.useState(true);
	const [joinedDate, updateJoinedDate] = React.useState(null);
	const [friendsList, updateFriendsList] = React.useState([]);
	React.useEffect(() => {
		loadAccount();
	}, [loc]);
	const loadAccount = async () => {
		const username = loc.pathname.split('/')[2];
		// FIXME: download user's account data
		console.log(`Username: ${username}`);
		if (username) {
			updateName(username);
			grabUserInfo(username);
		}
	}
	const grabUserInfo = async name => {
		console.log(`Grabbing ${name}`);
		const resp = await fetch(`/loaduserinfo/?name=${name}`, {method: 'GET'});
		const r = await resp.json();
		const created_date = r["created_at"].split(' ');
		const date = created_date.splice(1, 4);
		// set joined date
		updateJoinedDate(date.join(' '));
		const profilepic = r['profile'];
		// set profile picture
		(profilepic == "null") ? updateProfile('images/blank.png') : updateProfile(`data:image/png;base64,${profilepic}`);
		if (!r['friends']) return;
		updateFriendsList(r['friends']);
	}
	return (<><div id="account-page">
		<div id="side">
			{name === user ? <Selector updateSelf={updateSelf} updateUser={updateUser} updateLoggedIn={updateLoggedIn} name={name} user={user}/> : ''}
		</div>
		{self ? <HomePage name={name} user={user} joinedDate={joinedDate} friendsList={friendsList} profile={profile} updateName={updateName}/> : <Settings name={name}/>}
	</div>
	<Footer/></>);
}

const FriendsList = ({friendsList, updateName}) => {
	const history = useHistory();
	const showUser = async user => {
		updateName(user);
		history.push(`/account/${user}`);
	}
	return (<div id="friends-list">
		<p id="friends-header">{"Friends"}</p>
		<div id="friend-wrapper">
			{friendsList.length ? friendsList.map((elem, id) => {
				console.log(elem);
				return <p className="friend-slide" onClick={() => showUser(elem.friend)}>{elem.friend}</p>
			}) : <p id="no-friends">{"No Friends"}</p>}
		</div>
	</div>);
}

const Selector = ({updateSelf, updateUser, updateLoggedIn, name, user}) => {
	const hist = useHistory();
	const logUserOut = async () => {
		console.log(`Logging out ${user.user}`);
		const resp = await fetch('/logout', {method: "GET"});
		const r = await resp.json();
		console.log(r);
		if (r["status"] === "logged out") {
			// log user out of front end
			updateUser('');
			updateLoggedIn(false);
			document.cookie = "";
			// return to the landing page
			hist.push('/');
		}
	}
	return (<div id="self-sidebar"><div id="homepage" onClick={() => updateSelf(true)}>
		{"Home Page"}
	</div>
	<div id="settings" onClick={() => updateSelf(false)}>
		{"Settings"}
	</div>
	<div id="logout" onClick={logUserOut}>
		{"Log Out"}
	</div>
	</div>);
}

const HomePage = ({name, user, joinedDate, friendsList, profile, updateName}) => {
	return (<div id="account-wrapper">
		<div id="account-home">
			<div id="account-name">
				{name}
			</div>
			<div id="account-pic">
				<div id="pic-container">
					<img id="profile" src={profile} accept={'image/*'}/>
				</div>
			</div>
			<div id="account-date">{`Joined: ${joinedDate}`}</div>
			{name != user ? <FriendStatus name={name} friend={user}/> : ''}
		</div>
		<div id="account-friends">
			<FriendsList friendsList={friendsList} updateName={updateName}/>
		</div>
	</div>);
}

const JoinedDate = ({date}) => {
	return (<div id="joined-date">
		{date}
	</div>);
}

const AccountController = () => {
	const startPasswordChange = async () => {
		// add prompt box component, wait for user input and grab the new password
		// perform input validation
		// send password to the server and remove the prompt component
	}
	const changePassword = async () => {
		//const resp = await fetch('/changepassword', {method: 'POST'});
	}
	const changeProfile = async event => {
		const file = event.target.files[0];
		if (!file) return;
		const formData = new FormData();
		formData.append('profile', file);
		// try to upload profile picture
		const resp = await fetch('/uploaduserprofile', {method: 'PUT', body: formData});
		console.log(resp);
		const r = await resp.json();
		console.log(r);
		// FIXME: pull new profile picture
	}
	const leaveChannel = async () => {}
	const deleteChannel = async () => {}
	const deleteAccount = async () => {}
	return (<div id="account-controller">
		<button id="change-password" onClick={startPasswordChange}>{"Change Password"}</button>
		<label for="profile-uploader" id="change-profile">{"Change Profile"}</label>
		<input id="profile-uploader" type="file" accept="image/*" onChange={changeProfile}/>
		<button id="leave-channel">{"Leave Channel"}</button>
		<button id="delete-channel">{"Delete Channel"}</button>
		<button id="delete-account">{"Delete Account"}</button>
	</div>);
}

const Settings = name => {
	return (<div id="settings-page">
		<AccountController/>
	</div>);
}

const FriendStatus = ({name, friend}) => {
	const sendFriendRequest = () => {

	}
	return (<div id="befriend">
		<button id="befriend-button">
			{"Add Friend"}
		</button>
	</div>);
}