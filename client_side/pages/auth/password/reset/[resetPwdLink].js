import { useState, useEffect } from 'react'
import axios from 'axios'
import { withRouter } from 'next/router'
import jwt from 'jsonwebtoken'

import {
	showErrorMessage,
	showSuccessMessage,
} from '../../../../helpers/alerts'
import { API } from '../../../../config'
import Layout from '../../../../components/Layout'

const ResetPassword = ({ router }) => {
	const [state, setState] = useState({
		name: '',
		token: '',
		newPassword: '',
		buttonText: 'Reset Password',
		success: '',
		error: '',
	})
	const { name, token, newPassword, buttonText, success, error } = state

	useEffect(() => {
		const decoded = jwt.decode(router.query.resetPwdLink)
		if (decoded)
			setState({
				...state,
				name: decoded.name,
				token: router.query.resetPwdLink,
			})
	}, [router])

	const handleChange = (e) => {
		setState({
			...state,
			newPassword: e.target.value,
			success: '',
			error: '',
		})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setState({ ...state, buttonText: 'Resetting Password ...' })
		try {
			const response = await axios.put(`${API}/reset-password`, {
				resetPasswordLink: token,
				newPassword,
			})
			setState({
				...state,
				newPassword: '',
				buttonText: 'Done',
				success: response.data.message,
			})
		} catch (error) {
			setState({
				...state,
				buttonText: 'Reset Password',
				error: error.response.data.error,
			})
		}
	}

	const passwordResetForm = () => (
		<form onSubmit={handleSubmit}>
			<div className='form-group'>
				<input
					type='password'
					className='form-control'
					onChange={handleChange}
					value={newPassword}
					placeholder='Type your new password'
					required
				/>
			</div>
			<div>
				<button className='btn btn-outline-warning btn-block'>
					{buttonText}
				</button>
			</div>
		</form>
	)

	return (
		<Layout>
			<div className='row'>
				<div className='col-md-8 offset-md-2 py-3'>
					<h4>Hi {name}, Ready to reset your password? </h4>
					<br />
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{passwordResetForm()}
				</div>
			</div>
		</Layout>
	)
}
export default withRouter(ResetPassword)
