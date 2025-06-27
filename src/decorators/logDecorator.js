function logDecorator(fn) {
	return function (...args) {
		console.log(`Calling function ${fn.name} with arguments [${args}]`);
		const res = fn(...args);
		console.log(`Called ${fn.name} and returned: ${result}`);
		return res;
    }
}

export default logDecorator;
