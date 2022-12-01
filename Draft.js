function wrapValue(n, symbol) {
    let wrap = "";
    for (let i = 0; i <= n; i++) {
        wrap += symbol;
    }
    return (text) => wrap + text + wrap;
}
let wrap1 = wrapValue(1, "#");
let wrap2 = wrapValue(5, "*");
console.log(wrap1("text"));
console.log(wrap2("text"));