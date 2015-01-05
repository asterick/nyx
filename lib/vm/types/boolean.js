var NilType = require("./nil");

class BooleanType extends NilType {
    constructor(ident) {
        this._value = ident;
    }
}

BooleanType.FALSE = new BooleanType(false);
BooleanType.TRUE = new BooleanType(true);

module.exports = BooleanType;
