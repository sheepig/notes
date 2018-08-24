const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function INTERNAL(){}

function Promise(resolver) {
	var self = this;	
	if (typeof resolver !== 'function') {
		throw new TypeError('resolver must be a function, instead, received ' + typeof resolver);
	}
	this.state = PENDING;
	this.queue = [];
	this.outcome = void 0;
	if (resolver !== INTERNAL) {
		resolveThenable(self, resolver);
	}
}