import * as React from 'react';
import { ChangePassword } from './ChangePassword';
import { DeleteAccount } from './DeleteAccount';
import { UserInfo } from '../UserInfo'; 


export const AccountController = () => {
	const { updateProfile } = React.useContext(UserInfo);
	const [prompt, updatePrompt] = React.useState(null);

	const changePassword = async () => {
		updatePrompt(<ChangePassword updatePrompt={updatePrompt}/>);
	}
	const changeProfile = async event => {
		const file = event.target.files[0];
		console.log(`Uploading file: ${file}`);
		if (!file) return;
		const formData = new FormData();
		formData.append('profile', file);
		// try to upload profile picture
		const resp = await fetch('/uploaduserprofile', {method: 'PUT', body: formData});
		if (resp.status == 200) {
			const payload = await resp.json();
			const { profile } = payload;
			updateProfile(`data:image/png;base64,${profile}`);
		}
	}
	const deleteChannel = async () => {}
	const deleteAccount = async () => updatePrompt(<DeleteAccount updatePrompt={updatePrompt}/>);

	return (<div id="settings-page">
		<div id="account-controller">
			<button id="change-password" onClick={changePassword}>{"Change Password"}</button>
			<label for="profile-uploader" id="change-profile">{"Change Profile"}</label>
			<input id="profile-uploader" type="file" accept="image/*" onChange={changeProfile}/>
			{/*<button id="delete-channel">{"Delete Channel"}</button>*/}
			<button id="delete-account" onClick={deleteAccount}>{"Delete Account"}</button>
		</div>
		{prompt}
	</div>);
}