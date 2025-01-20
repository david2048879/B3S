export const formatDate = (date) => {
	let months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]
	let d = new Date(date)
	// month = '' + (d.getMonth() + 1),
	let month = months[d.getMonth()]
	let day = '' + d.getDate()
	let year = d.getFullYear()

	// if (month.length < 2) month = '0' + month
	if (day.length < 2) day = '0' + day

	// return [year, month, day].join('-')
	return month + ' ' + day + ', ' + year
}

export const monthDiff = async (myDates) => {
	d1 = new Date(myDates[0])
	d2 = new Date(myDates[1])
	var months
	months = (d2.getFullYear() - d1.getFullYear()) * 12
	months -= d1.getMonth()
	months += d2.getMonth()
	return months <= 0 ? 0 : months
}

export const daysInMonth = async (month, year) => {
	return new Date(year, month, 0).getDate();
}
