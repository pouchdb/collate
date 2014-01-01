var should = require('chai').should();
var collate = require('../lib');

describe('collate',function(){
	var a = {
		array:[1,2,3],
		bool:true,
		string:'123',
		object:{
			a:3,
			b:2
		},
		number:1
	};
	var b = {
		array:['a','b'],
		bool:false,
		string:'ab',
		object:{
			c:1,
			b:3
		},
		number:2
	}
	var c = {
		object:{
			a:1,
			b:2,
			c:3
		},
		array:[1,2]
	}
	it('compare array to itself', function(){
		collate(a.array,a.array).should.equal(0);
		collate(b.array,b.array).should.equal(0);
		collate(c.array,c.array).should.equal(0);
	});
	it('compare boolean to itself', function(){
		collate(a.bool,a.bool).should.equal(0);
		collate(b.bool,b.bool).should.equal(0);
	});
	it('compare string to itself', function(){
		collate(a.string,a.string).should.equal(0);
		collate(b.string,b.string).should.equal(0);
	});
	it('compare number to itself', function(){
		collate(a.number,a.number).should.equal(0);
		collate(b.number,b.number).should.equal(0);
	});
	it('compare null to itself', function(){
		collate(null, null).should.equal(0);
	});
	it('compare object to itself', function(){
		collate(a.object,a.object).should.equal(0);
		collate(b.object,b.object).should.equal(0);
		collate(c.object,c.object).should.equal(0);
	});
	it('compare array to array', function(){
		collate(a.array,b.array).should.equal(-1);
		collate(b.array,a.array).should.equal(1);
		collate(c.array,b.array).should.equal(-1);
		collate(b.array,c.array).should.equal(1);
		collate(a.array,c.array).should.equal(1);
		collate(c.array,a.array).should.equal(-1);
	});
	it('compare boolean to boolean', function(){
		collate(a.bool,b.bool).should.equal(1);
		collate(b.bool,a.bool).should.equal(-1);
	});
	it('compare string to string', function(){
		collate(a.string,b.string).should.equal(-1);
		collate(b.string,a.string).should.equal(1);
	});
	it('compare number to number', function(){
		collate(a.number,b.number).should.equal(-1);
		collate(b.number,a.number).should.equal(1);
	});
	it('compare object to object', function(){
		collate(a.object,b.object).should.equal(-1);
		collate(b.object,a.object).should.equal(1);
		collate(c.object,b.object).should.equal(-1);
		collate(b.object,c.object).should.equal(1);
		collate(c.object,a.object).should.equal(-2);
		collate(a.object,c.object).should.equal(2);
	});
	it('objects differing only in num of keys',function(){
		collate({1:1},{1:1,2:2}).should.equal(-1);
		collate({1:1,2:2},{1:1}).should.equal(1);
	});
	it('compare number to null', function(){
		collate(a.number,null).should.equal(2);
	});
	it('compare number to function', function(){
		collate(a.number,function(){}).should.not.equal(collate(a.number,function(){}));
		collate(b.number,function(){}).should.not.equal(collate(b.number,function(){}));
		collate(function(){},a.number).should.not.equal(collate(function(){},a.number));
		collate(function(){},b.number).should.not.equal(collate(function(){},b.number));
	});
});