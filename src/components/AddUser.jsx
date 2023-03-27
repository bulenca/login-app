import React, { useState, useEffect, useCallback } from 'react'
import Card from '../UI/Card'
import classes from './AddUser.module.css'
import Button from '../UI/Button'
import ErrorModal from '../UI/ErrorModal'

function AddUser() {
	const [name, setName] = useState('')
	const [age, setAge] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorModal, setErrorModal] = useState(null)
	const [tableData, setTableData] = useState([])

	function namedChangeHandler(event) {
		setName(event.target.value)
	}
	function ageChangeHandler(event) {
		setAge(event.target.value)
		console.log(age)
	}

	function emailChangeHandler(event) {
		setEmail(event.target.value)
		console.log(email)
	}

	function passwordChangeHandler(event) {
		setPassword(event.target.value)
		console.log(password)
	}

	async function addUserHandler(event) {
		event.preventDefault()

		if (+age < 1) {
			return setErrorModal({
				title: 'Błędny wiek',
				msg: 'Wiek musi być > 0',
			})
		}

		if (password.length <= 3) {
			return setErrorModal({
				title: 'Krótkie hasło',
				msg: 'Hasło musi mieć powyżej 3 znaków',
			})
		}

		const my_object = {
			name,
			age,
			email,
			password,
		}

		console.log(my_object)

		const res = await fetch('https://loginapp-f3656-default-rtdb.firebaseio.com/users.json', {
			method: 'POST',
			body: JSON.stringify(my_object),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		const data = await res.json()
		console.log(data)

		setAge('')
		setName('')
		setEmail('')
		setPassword('')
	}

	const getDataHandler = useCallback(async () => {
		const res = await fetch('https://loginapp-f3656-default-rtdb.firebaseio.com/users.json')

		const data = await res.json()

		const loadedData = []
		for (const key in data) {
			loadedData.push({
				data: data[key],
				key,
			})
		}
		setTableData(loadedData)
	})

	useEffect(() => {
		getDataHandler()
	}, [getDataHandler])

	const errorHandler = () => {
		setErrorModal(null)
	}
	return (
		<>
			{errorModal && <ErrorModal title={errorModal.title} msg={errorModal.msg} removeError={errorHandler} />}
			<Card className={classes.input}>
				<form onSubmit={addUserHandler}>
					<label htmlFor='username'>Username</label>
					<input id='username' type='text ' onChange={namedChangeHandler} value={name} />

					<label htmlFor='age'>Age</label>
					<input id='age' type='Number' onChange={ageChangeHandler} value={age} />

					<label htmlFor='email'>Email</label>
					<input id='email' type='email' onChange={emailChangeHandler} value={email} />
					<label htmlFor='password'>password</label>
					<input id='password' type='password' onChange={passwordChangeHandler} value={password} />

					<Button myType='submit'> Add user </Button>

					<table>
						<thead>
							<tr>
								<th>Username</th>
								<th>Age</th>
								<th>Login</th>
								<th>Password</th>
							</tr>
						</thead>
						<tbody>
							{tableData.map(item => (
								<tr key={item.key}>
									<td>{item.data.name}</td>
									<td>{item.data.age}</td>
									<td>{item.data.email}</td>
									<td>{item.data.password}</td>
								</tr>
							))}
						</tbody>
					</table>
				</form>
			</Card>
		</>
	)
}

export default AddUser
