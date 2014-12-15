var BaseType = require("./nil");

class BooleanType extends BaseType {
    constructor(ident) {
        this._value = ident;
    }
}

BooleanType.FALSE = new BooleanType(false);
BooleanType.TRUE = new BooleanType(true);

module.exports = BooleanType;
