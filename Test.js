let re1 = new RegExp("abc");
let re2 = /abc/;
console.log(/abc/.test("abcde")); //
// → true
console.log(/abc/.test("abxde"));
// → false
console.log(/[0-9]/.test("in 1992"));
// → true