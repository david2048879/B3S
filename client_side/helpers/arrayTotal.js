export const computeTotal = (arrayOfObjects = []) => {
	try {
		console.log('Array: ', arrayOfObjects)
		let total = arrayOfObjects.reduce(function (acc, curr) {
			return acc + curr.amount
		}, 0)
	} catch (e) {
		console.log(e)
	}
}
