Nyx Virtual Machine
===================

Table of Contents
-----------------
* [Core Concepts](#core-concepts)
* [Data Types](#data-types)
* [Module Hierarchy](#module-hierarchy)
* [Instruction Set](#instruction-set)

Core Concepts
-------------

The NYX VM was designed to contain as few elements as possible while remaining reentrant and
convering all my language requirements for my host machine.  It is loosely based around object
oriented programming and data type "templates" for handling structuring and destructuring of
data.  This concept replaces what would normally be defined as a constant table, but allows
for context sensitive information to be embedded inside of various data types that will be
interpreted at run-time depending on the context in which it is used (assignment, value, etc)

The VM does not define a host language, and it is up to the module loader to parse, compile and
provide a module object to the VM.

Data Types
----------


Module Hierarchy
----------------

Instruction Set
---------------

Opcode | Mnemonic   | T-Op     | A-Op    | B-Op        | Description
------:|------------|----------|---------|-------------|---------------------------------------------
    00 | not        | target   | source               || t = !source
    01 | negate     | target   | source               || t = -source
    02 | length     | target   | source               || t = length(source)
    03 | add        | target   | right   | left        | t = left + right
    04 | sub        | target   | right   | left        | t = left - right
    05 | mul        | target   | right   | left        | t = left * right
    06 | div        | target   | right   | left        | t = left / right
    07 | mod        | target   | right   | left        | t = left % right
    08 | pow        | target   | right   | left        | t = Math.pow(left, right)
    09 | concat     | target   | right   | left        | t = left .. right
    0A | eq         | target   | right   | left        | t = left === right
    0B | lt         | target   | right   | left        | t = left < right
    0C | lte        | target   | right   | left        | t = left <= right
    0D | get        | target   | object  | key         | target = object[key]
    0E | put        | object   | key     | source      | object[key] = source
    0F | remove     | object   | key                  || delete object[key]
    10 | set        | target   | source               || target = source
    11 | new        | target   | source               || target = create new namespace w/context
    12 | break      | levels                         ||| move N levels up block stack
    13 | throw      | object                         ||| bubble exception up block stack
    14 | return     | value                          ||| return value out of function
    15 | tailcall   | function |  arg_object          || return value returned through call
    16 | pass       | block                          ||| move execution to another block
    17 | each       | iterator | block                || execute block for every iteration of object
    18 | array_comp | target   | iterator | block      | create array using iterator
    19 | call       | target   | function | arg_object | call function with arguments
    1A | if         | test     | block                || conditionally move execution block
    1B | not_if     | test     | block                || conditionally move execution block

module
    namespace list (namespace 0 = top level namespace)

namespace
    flags (final, sealed)
    extend list
        module list
    template list
    block list
    init block

block
    instructions
    trap block

Top level types
    boolean
    number
    atom
    string
    tuple
    array
    table
    function

function
    flags (co-routine, rest-parameter)
    closure table   (variable reference to calling function (taking variables 1..n, 0 = self/this))
    local count     (excluding closure references)
    arguments
    defaults
    block

template list
    boolean
    number
    atom
    string
    tuple
    array
    table
    reference
    module      (remote reference)
    function

