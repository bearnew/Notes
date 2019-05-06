function test() {
	try {
		console.log('11111')
		return 2222
	} catch(err) {
		console.log('3333')
	} finally {
		console.log('4444')
	}
}

console.log(test())
