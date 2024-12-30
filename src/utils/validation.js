// src/utils/validation.js

export const validatePhoneNumber = phoneNumber => {
	const errors = {}
	if (!phoneNumber) {
		errors.phoneNumber = 'Phone number is required.'
	} else if (!/^\d{8,12}$/.test(phoneNumber)) {
		errors.phoneNumber = 'Phone number must contain 10-12 digits.'
	}
	return errors
}

export const validatePassword = password => {
	const errors = {}
	if (!password) {
		errors.password = 'Password is required.'
	} else if (password.length < 6) {
		errors.password = 'Password must be at least 6 characters long.'
	}
	return errors
}

export const validateFirstName = firstName => {
	const errors = {}
	if (!firstName) {
		errors.firstName = 'First name is required.'
	}
	return errors
}

export const validateLastName = lastName => {
	const errors = {}
	if (!lastName) {
		errors.lastName = 'Last name is required.'
	}
	return errors
}
