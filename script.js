var fn1 = () => {
	console.log('fn1')
	return Promise.resolve(5)
}

var fn2 = () => new Promise(resolve => {
	console.log('fn2')
	setTimeout(() => resolve(2), 1000)
})

function promiseReduce(asyncFunctions, reduce, initialValue) {
	if(typeof initialValue != 'number' || typeof reduce !== 'function' || (typeof asyncFunctions !== 'object' && asyncFunctions.length)){
		throw 'значения переданы в неправильном формате' 
	}

	return new Promise(function(resolve, reject) {
		this.memo = initialValue;
		
 		(function loop(i){

			asyncFunctions[i]().then(
				x => {

					this.memo = reduce.apply(promiseReduce, [this.memo, x]);

					if(typeof asyncFunctions[++i] === 'function'){
						loop(i);
					} else {
						resolve(this.memo);
					}
					
				}
			)
			
		})(0)
	})

}

promiseReduce(
	[fn1, fn2],
	function (memo, value) {
		console.log('reduce')
		return memo * value
	}, 
	1
)
.then(console.log);