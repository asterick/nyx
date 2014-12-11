Nyx Virtual Machine
===================

Table of Contents
-----------------
* [Core Concepts](#core-concepts)
* [Modules](#modules)
* [Data Types](#data-types)
* [Meta-tables](#meta-tables)
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

Modules
-------

Modules are the top level element of a virtual machine.  They are containers called [Namespaces](#namespaces),
which provide the basis for a object oriented language, without any of the complications of things such as
prototype chains or multiple inheritance.

Multiple namespaces can be provided in a single module, with the first namespace being defined as the root
namespace.  Remote modules cannot reference sub namespaces directly although the root namespace may provide
references to them.

### Structure
* Foreign Namespace List
* [Namespace](#namespaces) List
* [Template](#templates) List

This is all a module loader is expected to provide.  The block requesting the module will receive the context
table of the first namespace in the table as the requested value.  Namespaces are initialized lazily, sometimes
never in the case of extended global contexts.

The reference list is simply a list of plain text module names that the module loader is required to resolve.
The format and implentation is at the discretion of the loader implementer.

Namespaces are indexed as such:  0..n are foreign references, and indexes number after this are local namespaces

### Namespaces
* Flags
    * Points to a block
    * final, sealed
* Extend list
* [Block](#blocks) List
* Initalizer

TODO: WRITE THIS CRAP

### Templates
* Atomic Values Templates
    * Boolean, Atom, Number, String
* Compound templates
    * Local register
    * Function
    * Namespace
    * Array / Tuple / Table

Templates are the heart of the nyx runtime.  Templates are, in essesnce, constants that can make reference
to local values.  They behave as a quick method of describing more complicated data types in a way that full
values can be build with a single instruction without losing the reentrant nature of the runtime.  The behavior
of a template varys depending on if it is being assigned to, or accessed as a value.

[nil](#nil-type) is always entry zero in the template table, and is excluded from
the module storage model

#### Templates as a value
* Atomic Value: applied in-place as a constant
* Function: closure variables and context are inherited from the current execution state of the VM.
* Array: contains a list of nested templates.  These templates are referenced
    as a value, and then used to construct a new array
* Table: Same as an array, except key / value pairs are used
* Local Register: The value of the local register referenced is used in-place
* Namespace: The requested namespace is one-time initialzed, and it's context table is returned

#### Templates as an assignment target
* Atomic Value: If assigned value does not match, an assignment assertion error occurs
* Local Register: Value is assigned to the local register
* Array: Right side is de-structured and assigned to the indexes of the template
    * If the source is not an array, or of a different length, an assignment assertion error occurs
* Tuple: Identical to array, only with Tuple type
    * If the source is not an tuple, or of a different length, an assignment assertion error occurs
* Table: Keys referenced in the template are assigned to the key/value pairs in the right side
    * If source is not a table, assignment assertion error occurs
    * Keys not found in the source will be assigned as 'nil'

Assigning to a namespace or function template is not permitted and will throw an validation error to the
module loader.

### Blocks
* [Instruction](#instruction-set) List
* Trap block

Blocks are consecutive chains of instructions that are used as flow control for your module.  Instructions
are executed in order until execution is passed on to a new block or is otherwise interrupted.

Trap block is an optional block that may be provided as a alternate code path if a value is throwed to the
virtual machine.  If no trap is specified, the next block in the call stack's trap is called.  If no trap is
received, the exception is sent to the virtual machine and execution will stop.

### Functions
* Flags
    * co-routine
    * rest-parameter
* Closure Table
* Local Registers
* Arguments
    * Count
    * Defaults
* Entry Point

TODO: WRITE THIS CRAP

Data Types
----------

Data types are broken down into three basic categories:
[Value types](#value-types), [Reference Types](#reference-types) and finally [Runtime Types](#runtime-types).

### Value Types
* [Nil](#nil-type)
* [Boolean](#boolean-type)
* [Atom](#atom-type)
* [Number](#number-type)
* [String](#string-type)
* [Tuple](#tuple-type)

Value types are the atomic values in the machine.  They do not maintain ownership over anything other than
their identity, and are not equal to anything else in the runtime other than items that share the same
identity.

Internally, they contain no properties, indicies, and only respond to comparison and arithmatic operators.
This functionality can be overloaded using a global meta-table that is shared across all values of a similar
type.  This behavior is discouraged as it alters global behavior of the runtime.

#### Nil Type

The nil type is provided to describe a value without an identity.  Any operation applied to a nil value will
return nil, including calls and index access.  Nil does not have a global meta-table.

#### Boolean Type

Booleans are the atomic value for implying the truthfulness of a value.  Arithmatic operations

#### Atom Type

Atoms are symbols that are used as singleton style markers.  You can think of them internally as strings
that do not respond to operations.  Like [nil](#nil-type), by default all operations on atoms return nil.

#### Number Type

Number types are exactly as they sound, they provide the basic unit for arithmatic.  The VM standard
is double precision floating point.  Index and call operations return nil.

#### String Type

Strings are chains of characters used to to signify natural language.  Strings can be internally encoded
in any fashion, but outwardly there is no upper limit on the value of a single character.  Character codes
should conform to the Unicode encoding standard, and length and indexes are provided in printable characters,
not serialized formats. Arithmatic, call and index operations return nil.

#### Tuple Type

Tuple types are a base container that are atomic.  This means, that so long as all the contained values
are atomic as well (numbers, booleans, etc), than the identity is the same between two tuples.  This is
useful for using multi-key indexes inside of tables.  Concatination will create a new tuple with the
patterns joined.  All other operations will return nil.

### Reference Types
* [Array](#array-type)
* [Table](#table-type)
* [Function](#function-type)

Reference types are elements that have an identity based on when they were contructed.  This is mostly provided
for speed, as tables, arrays, and functions hold context and any operation placed on them should offer in-place
modification.  This type of value is mostly reserved for container types.

#### Array Type

Arrays are a container type that is used to hold values and references to other values.  Arrays are indexed by
non-negative numbers, starting with zero.  Arithmatic oerpations, calls, and indexes on non-integer values will
return nil.

#### Table Type

Tables are a super case of Arrays.  This is the container format of choice if you wish to index on values other
than integers.  It is also the base type used for meta-tables and namespace contexts. Length and arithmatic
operations return nil.

#### Function Type

Functions are links to [blocks](#blocks) that provide the sub-routine / method type.  They respond to the 'call'
operation and will eventually return with a value (defaulting to nil).  There is also a bound 'this' value which
defaults to the namespace instance in which they originated from.  The value of the this object cannot be changed,
although the namespaces can be cloned.

More information can be found in the (namespace function description)[#functions]

### Runtime Types
* [Namespace](#namespace-type)

Runtime types are internal types that are not presented as a visible type to the VM.  This is reserved for
internal types required to handle the object level architecture.  Currently this is reserved for the Namespace
type.

#### Namespace Type

### Comparison Hierarchy

This is the relative 'rank' of types in terms of relative comparisons.  Values at top will always compare
greater than values lower on the list.  Relative comparison of reference types is left to implementation,
but should be deterministic: ```if a != b then (a < b) != (a > b)```

* Table
* Array
* Function
* Tuple
* String
* Number
* Atom
* Boolean
* Nil

Meta-Tables
-----------

Meta-tables provide the ability to override internal functionality of various types and objects.  This is
most useful with arrays and tables to provide operator overloads for run-time created types.  Meta-tables
are a hidden [Table](#table-type) stored on types.  Value types share the same meta-table globally.

These tables contain a list of keys corresponding to low level VM operations that should be applied when
they are performed on the object.  If the key is undefined, the value goes to the types internal operation.
In the case of two parameter operations, the left-hand operator takes priority, followed by right-hand,
followed by the left-hand's internal operation.

Internally less_equal will fall back on equal and less_than if either is provided.

  Operation | Arguments               | Description
-----------:|-------------------------|------------------------------------------------------------
        not | value                   | Logical not value (unary ! operator)
     negate | value                   | Negative of value (unary - operator)
     length | value                   | Length of value (unary @ operator)
        add | left, right             | Addition of left and right
   subtract | left, right             | Subtraction of left and right
   multiply | left, right             | Multiplication of left and right
     divide | left, right             | Division of left and right
     modulo | left, right             | Remainder after division of left and right
      power | left, right             | Exponential power of right over left
concatenate | left, right             | Append right to left
      equal | left, right             | Identity of left vs right
  less_than | left, right             | Returns true if left is less than right
 less_equal | left, right             | Returns true if left is less than or equal to right
        get | container, index        | Get value at index in container
        put | container, index, value | Put value in container at index
     delete | container, index        | Remove index from container
       call | object, arguments       | Call object as function using arguments


Instruction Set
---------------

Opcode | Mnemonic   | T-Op     | A-Op    | B-Op        | Description
------:|------------|----------|---------|-------------|-------------------------------------------
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
    0F | delete     | object   | key                  || delete object[key]
    10 | call       | target   | function | arg_object | call function with arguments
    11 | set        | target   | source               || target = source
    12 | new        | target   | namespace index      || target = create new namespace w/context
    13 | break      | levels                         ||| move N levels up block stack
    14 | throw      | object                         ||| bubble exception up block stack
    15 | return     | value                          ||| return value out of function
    16 | tailcall   | function |  arg_object          || return value returned through call
    17 | pass       | block                          ||| move execution to another block
    18 | each       | iterator | block                || execute block for every iteration of object
    19 | array_comp | target   | iterator | block      | create array using iterator
    1A | if         | test     | block                || conditionally move execution block
    1B | not_if     | test     | block                || conditionally move execution block

