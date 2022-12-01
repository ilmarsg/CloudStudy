function countChar(string, ch) {
    let counted = 0;
    if (ch.length === 1) {
        for (let i = 0; i < string.length; i++) {
            if (string[i] == ch) {
                counted += 1;
            }
        }
        return counted;
    } else return "Nav ievadīts viens skaitāmais simbols"
}

function CountT(string) {
    return countChar(string, "T")
}

function CountU(string) {
    return countChar(string, "U")
}

console.log(CountT("BCTTu"));
console.log(CountU("BUTUU"));