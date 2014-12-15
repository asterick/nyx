class NilType {
    constructor() {
        return NilType.SINGLETON || this;
    }

    // Comparison operations
    equal (l, r) {
    }

    lessThan (l, r) {
    }

    lessEqual (l, r) {
    }

    // Mathmatics operations
    negate () {
        return NilType.SINGLETON ;
    }
    add (l, r) {
        return NilType.SINGLETON ;
    }
    subtract (l, r) {
        return NilType.SINGLETON ;
    }
    multiply (l, r) {
        return NilType.SINGLETON ;
    }
    divide (l, r) {
        return NilType.SINGLETON ;
    }
    modulo (l, r) {
        return NilType.SINGLETON ;
    }

    power (l, r) {
        return NilType.SINGLETON ;
    }

    // Logical operations
    not () {
        return NilType.SINGLETON ;
    }
    length () {
        return NilType.SINGLETON ;
    }
    concatenate () {
        return NilType.SINGLETON ;
    }

    // Object operations
    get (object, key) {
        return NilType.SINGLETON;
    }

    put (object, key) {
        return NilType.SINGLETON;
    }

    delete (object, key) {
        return NilType.SINGLETON;
    }

    call (funct, args) {
        return NilType.SINGLETON;
    }
}

NilType.SINGLETON = new NilType();

module.exports = NilType;
