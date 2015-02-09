module.exports = {
    Operations: {
        NOT: 0x00,
        NEGATE: 0x01,
        LENGTH: 0x02,
        ADD: 0x03,
        SUB: 0x04,
        MULTIPLY: 0x05,
        DIVIDE: 0x06,
        MODULO: 0x07,
        POWER: 0x08,
        CONCAT: 0x09,
        EQUALS: 0x0A,
        LESS_THAN: 0x0B,
        LESS_THAN_EQUAL: 0x0C,
        GET: 0x0D,
        PUT: 0x0E,
        DELETE: 0x0F,
        CALL: 0x10,
        SET: 0x11,
        NEW: 0x12,
        BREAK: 0x13,
        THROW: 0x14,
        RETURN: 0x15,
        TAILCALL: 0x16,
        PASS: 0x17,
        EACH: 0x18,
        ARRAY_COMP: 0x19,
        IF: 0x1A,
        NOT_IF: 0x1B
    },
    TypeCodes: {
        // Runtime type codes
        NIL: 0,
        BOOLEAN: 1,
        ATOM: 2,
        NUMBER: 3,
        STRING: 4,
        TUPLE: 5,
        FUNCTION 6,
        ARRAY: 7,
        TABLE: 8,

        // Template space type codes
        NAMESPACE: -1,
        REGISTER: -2
    }
};
