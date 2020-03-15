const elem = 10;

Number.prototype.toString = function() {
    if(+this < 10) return `${+this}`;
    return 'Превышен лимит';
}

Number.prototype.myFunc = function() {
    return 10;
}

console.log(elem.myFunc());