Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === "object") || typeof from === "function") {
    for (
      var keys = __getOwnPropNames(from), i = 0, n = keys.length, key;
      i < n;
      i++
    ) {
      key = keys[i];
      if (!__hasOwnProp.call(to, key) && key !== except) {
        __defProp(to, key, {
          get: (k => from[k]).bind(null, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
      }
    }
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, "default", {
          value: mod,
          enumerable: true
        })
      : target,
    mod
  )
);

//#endregion
let _stryke_capnp = require("@stryke/capnp");
_stryke_capnp = __toESM(_stryke_capnp);

//#region schemas/reflection.ts
const _capnpFileId = BigInt("0xae3c363dcecf2729");
const ReflectionKind = {
  NEVER: 0,
  ANY: 1,
  UNKNOWN: 2,
  VOID: 3,
  OBJECT: 4,
  STRING: 5,
  NUMBER: 6,
  BOOLEAN: 7,
  SYMBOL: 8,
  BIGINT: 9,
  NULL: 10,
  UNDEFINED: 11,
  REGEXP: 12,
  LITERAL: 13,
  TEMPLATE_LITERAL: 14,
  PROPERTY: 15,
  METHOD: 16,
  FUNCTION: 17,
  PARAMETER: 18,
  PROMISE: 19,
  CLASS: 20,
  TYPE_PARAMETER: 21,
  ENUM: 22,
  UNION: 23,
  INTERSECTION: 24,
  ARRAY: 25,
  TUPLE: 26,
  TUPLE_MEMBER: 27,
  ENUM_MEMBER: 28,
  REST: 29,
  OBJECT_LITERAL: 30,
  INDEX_SIGNATURE: 31,
  PROPERTY_SIGNATURE: 32,
  METHOD_SIGNATURE: 33,
  INFER: 34,
  CALL_SIGNATURE: 35
};
const ReflectionVisibility = {
  PUBLIC: 0,
  PROTECTED: 1,
  PRIVATE: 2
};
var TagsReflection = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "TagsReflection",
    id: "ab7e31d6b834bbf8",
    size: new _stryke_capnp.ObjectSize(8, 4)
  };
  _adoptAlias(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownAlias() {
    return _stryke_capnp.utils.disown(this.alias);
  }
  get alias() {
    return _stryke_capnp.utils.getList(0, _stryke_capnp.TextList, this);
  }
  _hasAlias() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initAlias(length) {
    return _stryke_capnp.utils.initList(
      0,
      _stryke_capnp.TextList,
      length,
      this
    );
  }
  set alias(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  get title() {
    return _stryke_capnp.utils.getText(1, this);
  }
  set title(value) {
    _stryke_capnp.utils.setText(1, value, this);
  }
  get hidden() {
    return _stryke_capnp.utils.getBit(0, this);
  }
  set hidden(value) {
    _stryke_capnp.utils.setBit(0, value, this);
  }
  get readonly() {
    return _stryke_capnp.utils.getBit(1, this);
  }
  set readonly(value) {
    _stryke_capnp.utils.setBit(1, value, this);
  }
  get ignore() {
    return _stryke_capnp.utils.getBit(2, this);
  }
  set ignore(value) {
    _stryke_capnp.utils.setBit(2, value, this);
  }
  get internal() {
    return _stryke_capnp.utils.getBit(3, this);
  }
  set internal(value) {
    _stryke_capnp.utils.setBit(3, value, this);
  }
  _adoptPermission(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownPermission() {
    return _stryke_capnp.utils.disown(this.permission);
  }
  get permission() {
    return _stryke_capnp.utils.getList(2, _stryke_capnp.TextList, this);
  }
  _hasPermission() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initPermission(length) {
    return _stryke_capnp.utils.initList(
      2,
      _stryke_capnp.TextList,
      length,
      this
    );
  }
  set permission(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  get domain() {
    return _stryke_capnp.utils.getText(3, this);
  }
  set domain(value) {
    _stryke_capnp.utils.setText(3, value, this);
  }
  toString() {
    return "TagsReflection_" + super.toString();
  }
};
const DefaultValueReflection_Value_Which = {
  UNDEFINED: 0,
  BOOLEAN: 1,
  INTEGER: 2,
  FLOAT: 3,
  STRING: 4
};
var DefaultValueReflection_Value = class extends _stryke_capnp.Struct {
  static UNDEFINED = DefaultValueReflection_Value_Which.UNDEFINED;
  static BOOLEAN = DefaultValueReflection_Value_Which.BOOLEAN;
  static INTEGER = DefaultValueReflection_Value_Which.INTEGER;
  static FLOAT = DefaultValueReflection_Value_Which.FLOAT;
  static STRING = DefaultValueReflection_Value_Which.STRING;
  static _capnp = {
    displayName: "value",
    id: "8748135e0497fe81",
    size: new _stryke_capnp.ObjectSize(16, 1)
  };
  get _isUndefined() {
    return _stryke_capnp.utils.getUint16(0, this) === 0;
  }
  set undefined(_) {
    _stryke_capnp.utils.setUint16(0, 0, this);
  }
  get boolean() {
    _stryke_capnp.utils.testWhich(
      "boolean",
      _stryke_capnp.utils.getUint16(0, this),
      1,
      this
    );
    return _stryke_capnp.utils.getBit(16, this);
  }
  get _isBoolean() {
    return _stryke_capnp.utils.getUint16(0, this) === 1;
  }
  set boolean(value) {
    _stryke_capnp.utils.setUint16(0, 1, this);
    _stryke_capnp.utils.setBit(16, value, this);
  }
  get integer() {
    _stryke_capnp.utils.testWhich(
      "integer",
      _stryke_capnp.utils.getUint16(0, this),
      2,
      this
    );
    return _stryke_capnp.utils.getInt32(4, this);
  }
  get _isInteger() {
    return _stryke_capnp.utils.getUint16(0, this) === 2;
  }
  set integer(value) {
    _stryke_capnp.utils.setUint16(0, 2, this);
    _stryke_capnp.utils.setInt32(4, value, this);
  }
  get float() {
    _stryke_capnp.utils.testWhich(
      "float",
      _stryke_capnp.utils.getUint16(0, this),
      3,
      this
    );
    return _stryke_capnp.utils.getFloat64(8, this);
  }
  get _isFloat() {
    return _stryke_capnp.utils.getUint16(0, this) === 3;
  }
  set float(value) {
    _stryke_capnp.utils.setUint16(0, 3, this);
    _stryke_capnp.utils.setFloat64(8, value, this);
  }
  get string() {
    _stryke_capnp.utils.testWhich(
      "string",
      _stryke_capnp.utils.getUint16(0, this),
      4,
      this
    );
    return _stryke_capnp.utils.getText(0, this);
  }
  get _isString() {
    return _stryke_capnp.utils.getUint16(0, this) === 4;
  }
  set string(value) {
    _stryke_capnp.utils.setUint16(0, 4, this);
    _stryke_capnp.utils.setText(0, value, this);
  }
  toString() {
    return "DefaultValueReflection_Value_" + super.toString();
  }
  which() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
};
var DefaultValueReflection = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "DefaultValueReflection",
    id: "96fe6f07954197c9",
    size: new _stryke_capnp.ObjectSize(16, 1)
  };
  get value() {
    return _stryke_capnp.utils.getAs(DefaultValueReflection_Value, this);
  }
  _initValue() {
    return _stryke_capnp.utils.getAs(DefaultValueReflection_Value, this);
  }
  toString() {
    return "DefaultValueReflection_" + super.toString();
  }
};
var SerializedTypeReference = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedTypeReference",
    id: "a83d8a28b5e80f3a",
    size: new _stryke_capnp.ObjectSize(8, 0)
  };
  get id() {
    return _stryke_capnp.utils.getUint32(0, this);
  }
  set id(value) {
    _stryke_capnp.utils.setUint32(0, value, this);
  }
  toString() {
    return "SerializedTypeReference_" + super.toString();
  }
};
var IndexAccessOrigin = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "IndexAccessOrigin",
    id: "ca50b18186c87afe",
    size: new _stryke_capnp.ObjectSize(0, 2)
  };
  _adoptContainer(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownContainer() {
    return _stryke_capnp.utils.disown(this.container);
  }
  get container() {
    return _stryke_capnp.utils.getStruct(0, SerializedTypeReference, this);
  }
  _hasContainer() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initContainer() {
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeReference, this);
  }
  set container(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptIndex(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownIndex() {
    return _stryke_capnp.utils.disown(this.index);
  }
  get index() {
    return _stryke_capnp.utils.getStruct(1, SerializedTypeReference, this);
  }
  _hasIndex() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initIndex() {
    return _stryke_capnp.utils.initStructAt(1, SerializedTypeReference, this);
  }
  set index(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  toString() {
    return "IndexAccessOrigin_" + super.toString();
  }
};
var EntityOptions_EntityIndexOptions = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "EntityIndexOptions",
    id: "de584ad10b7c5004",
    size: new _stryke_capnp.ObjectSize(0, 2)
  };
  _adoptNames(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownNames() {
    return _stryke_capnp.utils.disown(this.names);
  }
  get names() {
    return _stryke_capnp.utils.getList(0, _stryke_capnp.TextList, this);
  }
  _hasNames() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initNames(length) {
    return _stryke_capnp.utils.initList(
      0,
      _stryke_capnp.TextList,
      length,
      this
    );
  }
  set names(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  /**
   * JSON stringified options
   *
   */
  get options() {
    return _stryke_capnp.utils.getText(1, this);
  }
  set options(value) {
    _stryke_capnp.utils.setText(1, value, this);
  }
  toString() {
    return "EntityOptions_EntityIndexOptions_" + super.toString();
  }
};
var EntityOptions = class EntityOptions extends _stryke_capnp.Struct {
  static EntityIndexOptions = EntityOptions_EntityIndexOptions;
  static _capnp = {
    displayName: "EntityOptions",
    id: "948d2d02cf676d60",
    size: new _stryke_capnp.ObjectSize(8, 5)
  };
  static _Indexes;
  get name() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  get description() {
    return _stryke_capnp.utils.getText(1, this);
  }
  set description(value) {
    _stryke_capnp.utils.setText(1, value, this);
  }
  get collection() {
    return _stryke_capnp.utils.getText(2, this);
  }
  set collection(value) {
    _stryke_capnp.utils.setText(2, value, this);
  }
  get database() {
    return _stryke_capnp.utils.getText(3, this);
  }
  set database(value) {
    _stryke_capnp.utils.setText(3, value, this);
  }
  get singleTableInheritance() {
    return _stryke_capnp.utils.getBit(0, this);
  }
  set singleTableInheritance(value) {
    _stryke_capnp.utils.setBit(0, value, this);
  }
  _adoptIndexes(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownIndexes() {
    return _stryke_capnp.utils.disown(this.indexes);
  }
  get indexes() {
    return _stryke_capnp.utils.getList(4, EntityOptions._Indexes, this);
  }
  _hasIndexes() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initIndexes(length) {
    return _stryke_capnp.utils.initList(
      4,
      EntityOptions._Indexes,
      length,
      this
    );
  }
  set indexes(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  toString() {
    return "EntityOptions_" + super.toString();
  }
};
var SerializedTypeObjectLiteral = class SerializedTypeObjectLiteral
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeObjectLiteral",
    id: "8b56235ad9bcb2b1",
    size: new _stryke_capnp.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeObjectLiteral._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeObjectLiteral._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeObjectLiteral._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeObjectLiteral._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownTypes() {
    return _stryke_capnp.utils.disown(this.types);
  }
  get types() {
    return _stryke_capnp.utils.getList(
      4,
      SerializedTypeObjectLiteral._Types,
      this
    );
  }
  _hasTypes() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return _stryke_capnp.utils.initList(
      4,
      SerializedTypeObjectLiteral._Types,
      length,
      this
    );
  }
  set types(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(5, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(5, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(5, this));
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(5, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(5, this)
    );
  }
  toString() {
    return "SerializedTypeObjectLiteral_" + super.toString();
  }
};
var SerializedTypeClassType = class SerializedTypeClassType
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeClassType",
    id: "9855392bf9c48b25",
    size: new _stryke_capnp.ObjectSize(8, 11)
  };
  static _TypeArguments;
  static _Decorators;
  static _ExtendsArguments;
  static _Arguments;
  static _Types;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeClassType._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeClassType._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeClassType._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeClassType._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(4, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(4, value, this);
  }
  get globalObject() {
    return _stryke_capnp.utils.getBit(16, this);
  }
  set globalObject(value) {
    _stryke_capnp.utils.setBit(16, value, this);
  }
  get classType() {
    return _stryke_capnp.utils.getText(5, this);
  }
  set classType(value) {
    _stryke_capnp.utils.setText(5, value, this);
  }
  _adoptExtendsArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(6, this));
  }
  _disownExtendsArguments() {
    return _stryke_capnp.utils.disown(this.extendsArguments);
  }
  get extendsArguments() {
    return _stryke_capnp.utils.getList(
      6,
      SerializedTypeClassType._ExtendsArguments,
      this
    );
  }
  _hasExtendsArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(6, this));
  }
  _initExtendsArguments(length) {
    return _stryke_capnp.utils.initList(
      6,
      SerializedTypeClassType._ExtendsArguments,
      length,
      this
    );
  }
  set extendsArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(6, this)
    );
  }
  _adoptArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(7, this));
  }
  _disownArguments() {
    return _stryke_capnp.utils.disown(this.arguments);
  }
  get arguments() {
    return _stryke_capnp.utils.getList(
      7,
      SerializedTypeClassType._Arguments,
      this
    );
  }
  _hasArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(7, this));
  }
  _initArguments(length) {
    return _stryke_capnp.utils.initList(
      7,
      SerializedTypeClassType._Arguments,
      length,
      this
    );
  }
  set arguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(7, this)
    );
  }
  _adoptSuperClass(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(8, this));
  }
  _disownSuperClass() {
    return _stryke_capnp.utils.disown(this.superClass);
  }
  get superClass() {
    return _stryke_capnp.utils.getStruct(8, SerializedTypeReference, this);
  }
  _hasSuperClass() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(8, this));
  }
  _initSuperClass() {
    return _stryke_capnp.utils.initStructAt(8, SerializedTypeReference, this);
  }
  set superClass(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(8, this)
    );
  }
  _adoptTypes(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(9, this));
  }
  _disownTypes() {
    return _stryke_capnp.utils.disown(this.types);
  }
  get types() {
    return _stryke_capnp.utils.getList(9, SerializedTypeClassType._Types, this);
  }
  _hasTypes() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(9, this));
  }
  _initTypes(length) {
    return _stryke_capnp.utils.initList(
      9,
      SerializedTypeClassType._Types,
      length,
      this
    );
  }
  set types(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(9, this)
    );
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(10, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(10, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(
      _stryke_capnp.utils.getPointer(10, this)
    );
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(10, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(10, this)
    );
  }
  toString() {
    return "SerializedTypeClassType_" + super.toString();
  }
};
var SerializedTypeParameter = class SerializedTypeParameter
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeParameter",
    id: "fcbaa08bb97b8b1a",
    size: new _stryke_capnp.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeParameter._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeParameter._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeParameter._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeParameter._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(4, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(4, value, this);
  }
  _adoptType(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(5, this));
  }
  _disownType() {
    return _stryke_capnp.utils.disown(this.type);
  }
  get type() {
    return _stryke_capnp.utils.getStruct(5, SerializedTypeReference, this);
  }
  _hasType() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(5, this));
  }
  _initType() {
    return _stryke_capnp.utils.initStructAt(5, SerializedTypeReference, this);
  }
  set type(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(5, this)
    );
  }
  get visibility() {
    return _stryke_capnp.utils.getUint16(2, this);
  }
  set visibility(value) {
    _stryke_capnp.utils.setUint16(2, value, this);
  }
  get readonly() {
    return _stryke_capnp.utils.getBit(32, this);
  }
  set readonly(value) {
    _stryke_capnp.utils.setBit(32, value, this);
  }
  get optional() {
    return _stryke_capnp.utils.getBit(33, this);
  }
  set optional(value) {
    _stryke_capnp.utils.setBit(33, value, this);
  }
  _adoptDefault(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(6, this));
  }
  _disownDefault() {
    return _stryke_capnp.utils.disown(this.default);
  }
  get default() {
    return _stryke_capnp.utils.getStruct(6, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(6, this));
  }
  _initDefault() {
    return _stryke_capnp.utils.initStructAt(6, DefaultValueReflection, this);
  }
  set default(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(6, this)
    );
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(7, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(7, this));
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(7, this)
    );
  }
  toString() {
    return "SerializedTypeParameter_" + super.toString();
  }
};
var SerializedTypeMethod = class SerializedTypeMethod
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeMethod",
    id: "8b5eff6d9ec2fb06",
    size: new _stryke_capnp.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeMethod._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeMethod._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeMethod._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeMethod._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get visibility() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set visibility(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get abstract() {
    return _stryke_capnp.utils.getBit(16, this);
  }
  set abstract(value) {
    _stryke_capnp.utils.setBit(16, value, this);
  }
  get optional() {
    return _stryke_capnp.utils.getBit(17, this);
  }
  set optional(value) {
    _stryke_capnp.utils.setBit(17, value, this);
  }
  get readonly() {
    return _stryke_capnp.utils.getBit(18, this);
  }
  set readonly(value) {
    _stryke_capnp.utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(4, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(4, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(5, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(5, value, this);
  }
  _adoptParameters(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(6, this));
  }
  _disownParameters() {
    return _stryke_capnp.utils.disown(this.parameters);
  }
  get parameters() {
    return _stryke_capnp.utils.getList(
      6,
      SerializedTypeMethod._Parameters,
      this
    );
  }
  _hasParameters() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(6, this));
  }
  _initParameters(length) {
    return _stryke_capnp.utils.initList(
      6,
      SerializedTypeMethod._Parameters,
      length,
      this
    );
  }
  set parameters(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(6, this)
    );
  }
  _adoptReturn(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(7, this));
  }
  _disownReturn() {
    return _stryke_capnp.utils.disown(this.return);
  }
  get return() {
    return _stryke_capnp.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(7, this));
  }
  _initReturn() {
    return _stryke_capnp.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set return(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(7, this)
    );
  }
  toString() {
    return "SerializedTypeMethod_" + super.toString();
  }
};
var SerializedTypeProperty = class SerializedTypeProperty
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeProperty",
    id: "91d9dbea2037f78b",
    size: new _stryke_capnp.ObjectSize(8, 9)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeProperty._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeProperty._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeProperty._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeProperty._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get visibility() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set visibility(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get abstract() {
    return _stryke_capnp.utils.getBit(16, this);
  }
  set abstract(value) {
    _stryke_capnp.utils.setBit(16, value, this);
  }
  get optional() {
    return _stryke_capnp.utils.getBit(17, this);
  }
  set optional(value) {
    _stryke_capnp.utils.setBit(17, value, this);
  }
  get readonly() {
    return _stryke_capnp.utils.getBit(18, this);
  }
  set readonly(value) {
    _stryke_capnp.utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(4, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(4, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(5, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(5, value, this);
  }
  get description() {
    return _stryke_capnp.utils.getText(6, this);
  }
  set description(value) {
    _stryke_capnp.utils.setText(6, value, this);
  }
  _adoptType(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(7, this));
  }
  _disownType() {
    return _stryke_capnp.utils.disown(this.type);
  }
  get type() {
    return _stryke_capnp.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasType() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(7, this));
  }
  _initType() {
    return _stryke_capnp.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set type(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(7, this)
    );
  }
  _adoptDefault(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(8, this));
  }
  _disownDefault() {
    return _stryke_capnp.utils.disown(this.default);
  }
  get default() {
    return _stryke_capnp.utils.getStruct(8, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(8, this));
  }
  _initDefault() {
    return _stryke_capnp.utils.initStructAt(8, DefaultValueReflection, this);
  }
  set default(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(8, this)
    );
  }
  toString() {
    return "SerializedTypeProperty_" + super.toString();
  }
};
var SerializedTypeFunction = class SerializedTypeFunction
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeFunction",
    id: "9130bccd82dfcfd4",
    size: new _stryke_capnp.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeFunction._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeFunction._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeFunction._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeFunction._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get visibility() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set visibility(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get abstract() {
    return _stryke_capnp.utils.getBit(16, this);
  }
  set abstract(value) {
    _stryke_capnp.utils.setBit(16, value, this);
  }
  get optional() {
    return _stryke_capnp.utils.getBit(17, this);
  }
  set optional(value) {
    _stryke_capnp.utils.setBit(17, value, this);
  }
  get readonly() {
    return _stryke_capnp.utils.getBit(18, this);
  }
  set readonly(value) {
    _stryke_capnp.utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(4, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(4, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(5, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(5, value, this);
  }
  _adoptParameters(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(6, this));
  }
  _disownParameters() {
    return _stryke_capnp.utils.disown(this.parameters);
  }
  get parameters() {
    return _stryke_capnp.utils.getList(
      6,
      SerializedTypeFunction._Parameters,
      this
    );
  }
  _hasParameters() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(6, this));
  }
  _initParameters(length) {
    return _stryke_capnp.utils.initList(
      6,
      SerializedTypeFunction._Parameters,
      length,
      this
    );
  }
  set parameters(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(6, this)
    );
  }
  _adoptReturn(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(7, this));
  }
  _disownReturn() {
    return _stryke_capnp.utils.disown(this.return);
  }
  get return() {
    return _stryke_capnp.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(7, this));
  }
  _initReturn() {
    return _stryke_capnp.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set return(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(7, this)
    );
  }
  toString() {
    return "SerializedTypeFunction_" + super.toString();
  }
};
var SerializedTypePromise = class SerializedTypePromise
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypePromise",
    id: "e9b0cbe936a42398",
    size: new _stryke_capnp.ObjectSize(8, 4)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypePromise._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypePromise._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypePromise._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypePromise._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get visibility() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set visibility(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get abstract() {
    return _stryke_capnp.utils.getBit(16, this);
  }
  set abstract(value) {
    _stryke_capnp.utils.setBit(16, value, this);
  }
  toString() {
    return "SerializedTypePromise_" + super.toString();
  }
};
var SerializedTypeEnumEntry = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedTypeEnumEntry",
    id: "d5bcb8b7c49ba556",
    size: new _stryke_capnp.ObjectSize(0, 2)
  };
  get name() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  get value() {
    return _stryke_capnp.utils.getText(1, this);
  }
  set value(value) {
    _stryke_capnp.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeEnumEntry_" + super.toString();
  }
};
var SerializedTypeEnum = class SerializedTypeEnum extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedTypeEnum",
    id: "d7d36f0ae79e3841",
    size: new _stryke_capnp.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _EnumEntries;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeEnum._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeEnum._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(3, SerializedTypeEnum._Decorators, this);
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeEnum._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptEnumEntries(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownEnumEntries() {
    return _stryke_capnp.utils.disown(this.enumEntries);
  }
  get enumEntries() {
    return _stryke_capnp.utils.getList(
      4,
      SerializedTypeEnum._EnumEntries,
      this
    );
  }
  _hasEnumEntries() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initEnumEntries(length) {
    return _stryke_capnp.utils.initList(
      4,
      SerializedTypeEnum._EnumEntries,
      length,
      this
    );
  }
  set enumEntries(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  _adoptValues(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(5, this));
  }
  _disownValues() {
    return _stryke_capnp.utils.disown(this.values);
  }
  get values() {
    return _stryke_capnp.utils.getList(5, _stryke_capnp.TextList, this);
  }
  _hasValues() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(5, this));
  }
  _initValues(length) {
    return _stryke_capnp.utils.initList(
      5,
      _stryke_capnp.TextList,
      length,
      this
    );
  }
  set values(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(5, this)
    );
  }
  _adoptIndexType(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(6, this));
  }
  _disownIndexType() {
    return _stryke_capnp.utils.disown(this.indexType);
  }
  get indexType() {
    return _stryke_capnp.utils.getStruct(6, SerializedTypeReference, this);
  }
  _hasIndexType() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(6, this));
  }
  _initIndexType() {
    return _stryke_capnp.utils.initStructAt(6, SerializedTypeReference, this);
  }
  set indexType(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(6, this)
    );
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(7, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(7, this));
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(7, this)
    );
  }
  toString() {
    return "SerializedTypeEnum_" + super.toString();
  }
};
var SerializedTypeUnion = class SerializedTypeUnion
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeUnion",
    id: "a9ae4c95e41ff4ab",
    size: new _stryke_capnp.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeUnion._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeUnion._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeUnion._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeUnion._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownTypes() {
    return _stryke_capnp.utils.disown(this.types);
  }
  get types() {
    return _stryke_capnp.utils.getList(4, SerializedTypeUnion._Types, this);
  }
  _hasTypes() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return _stryke_capnp.utils.initList(
      4,
      SerializedTypeUnion._Types,
      length,
      this
    );
  }
  set types(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  toString() {
    return "SerializedTypeUnion_" + super.toString();
  }
};
var SerializedTypeIntersection = class SerializedTypeIntersection
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeIntersection",
    id: "9ae42bd17511c09b",
    size: new _stryke_capnp.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeIntersection._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeIntersection._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeIntersection._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeIntersection._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownTypes() {
    return _stryke_capnp.utils.disown(this.types);
  }
  get types() {
    return _stryke_capnp.utils.getList(
      4,
      SerializedTypeIntersection._Types,
      this
    );
  }
  _hasTypes() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return _stryke_capnp.utils.initList(
      4,
      SerializedTypeIntersection._Types,
      length,
      this
    );
  }
  set types(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  toString() {
    return "SerializedTypeIntersection_" + super.toString();
  }
};
var SerializedTypeArray = class SerializedTypeArray
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeArray",
    id: "97d1d75240151501",
    size: new _stryke_capnp.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeArray._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeArray._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeArray._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeArray._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownType() {
    return _stryke_capnp.utils.disown(this.type);
  }
  get type() {
    return _stryke_capnp.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initType() {
    return _stryke_capnp.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(5, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(5, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(5, this));
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(5, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(5, this)
    );
  }
  toString() {
    return "SerializedTypeArray_" + super.toString();
  }
};
var SerializedTypeIndexSignature = class SerializedTypeIndexSignature
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeIndexSignature",
    id: "93e335e2756821d8",
    size: new _stryke_capnp.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeIndexSignature._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeIndexSignature._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeIndexSignature._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeIndexSignature._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptIndex(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownIndex() {
    return _stryke_capnp.utils.disown(this.index);
  }
  get index() {
    return _stryke_capnp.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasIndex() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initIndex() {
    return _stryke_capnp.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set index(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  _adoptType(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(5, this));
  }
  _disownType() {
    return _stryke_capnp.utils.disown(this.type);
  }
  get type() {
    return _stryke_capnp.utils.getStruct(5, SerializedTypeReference, this);
  }
  _hasType() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(5, this));
  }
  _initType() {
    return _stryke_capnp.utils.initStructAt(5, SerializedTypeReference, this);
  }
  set type(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(5, this)
    );
  }
  toString() {
    return "SerializedTypeIndexSignature_" + super.toString();
  }
};
var SerializedTypePropertySignature = class SerializedTypePropertySignature
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypePropertySignature",
    id: "9bc1cebd2ca1569a",
    size: new _stryke_capnp.ObjectSize(8, 9)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypePropertySignature._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypePropertySignature._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypePropertySignature._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypePropertySignature._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(4, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(4, value, this);
  }
  get optional() {
    return _stryke_capnp.utils.getBit(16, this);
  }
  set optional(value) {
    _stryke_capnp.utils.setBit(16, value, this);
  }
  get readonly() {
    return _stryke_capnp.utils.getBit(17, this);
  }
  set readonly(value) {
    _stryke_capnp.utils.setBit(17, value, this);
  }
  get description() {
    return _stryke_capnp.utils.getText(5, this);
  }
  set description(value) {
    _stryke_capnp.utils.setText(5, value, this);
  }
  _adoptDefault(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(6, this));
  }
  _disownDefault() {
    return _stryke_capnp.utils.disown(this.default);
  }
  get default() {
    return _stryke_capnp.utils.getStruct(6, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(6, this));
  }
  _initDefault() {
    return _stryke_capnp.utils.initStructAt(6, DefaultValueReflection, this);
  }
  set default(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(6, this)
    );
  }
  _adoptType(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(7, this));
  }
  _disownType() {
    return _stryke_capnp.utils.disown(this.type);
  }
  get type() {
    return _stryke_capnp.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasType() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(7, this));
  }
  _initType() {
    return _stryke_capnp.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set type(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(7, this)
    );
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(8, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(8, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(8, this));
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(8, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(8, this)
    );
  }
  toString() {
    return "SerializedTypePropertySignature_" + super.toString();
  }
};
var SerializedTypeMethodSignature = class SerializedTypeMethodSignature
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeMethodSignature",
    id: "e25a2cc39d5930c8",
    size: new _stryke_capnp.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeMethodSignature._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeMethodSignature._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeMethodSignature._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeMethodSignature._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(4, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(4, value, this);
  }
  get optional() {
    return _stryke_capnp.utils.getBit(16, this);
  }
  set optional(value) {
    _stryke_capnp.utils.setBit(16, value, this);
  }
  _adoptParameters(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(5, this));
  }
  _disownParameters() {
    return _stryke_capnp.utils.disown(this.parameters);
  }
  get parameters() {
    return _stryke_capnp.utils.getList(
      5,
      SerializedTypeMethodSignature._Parameters,
      this
    );
  }
  _hasParameters() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(5, this));
  }
  _initParameters(length) {
    return _stryke_capnp.utils.initList(
      5,
      SerializedTypeMethodSignature._Parameters,
      length,
      this
    );
  }
  set parameters(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(5, this)
    );
  }
  _adoptReturn(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(6, this));
  }
  _disownReturn() {
    return _stryke_capnp.utils.disown(this.return);
  }
  get return() {
    return _stryke_capnp.utils.getStruct(6, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(6, this));
  }
  _initReturn() {
    return _stryke_capnp.utils.initStructAt(6, SerializedTypeReference, this);
  }
  set return(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(6, this)
    );
  }
  _adoptTags(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(7, this));
  }
  _disownTags() {
    return _stryke_capnp.utils.disown(this.tags);
  }
  get tags() {
    return _stryke_capnp.utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(7, this));
  }
  _initTags() {
    return _stryke_capnp.utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(7, this)
    );
  }
  toString() {
    return "SerializedTypeMethodSignature_" + super.toString();
  }
};
var SerializedTypeTypeParameter = class SerializedTypeTypeParameter
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeTypeParameter",
    id: "81210361a54d5d71",
    size: new _stryke_capnp.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeTypeParameter._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeTypeParameter._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeTypeParameter._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeTypeParameter._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(4, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(4, value, this);
  }
  toString() {
    return "SerializedTypeTypeParameter_" + super.toString();
  }
};
var SerializedTypeInfer = class SerializedTypeInfer
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeInfer",
    id: "91c6dd1e13f2b14d",
    size: new _stryke_capnp.ObjectSize(8, 4)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeInfer._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeInfer._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeInfer._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeInfer._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  toString() {
    return "SerializedTypeInfer_" + super.toString();
  }
};
var SerializedTypeTupleMember = class SerializedTypeTupleMember
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeTupleMember",
    id: "e21c2a18d0d56fdf",
    size: new _stryke_capnp.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeTupleMember._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeTupleMember._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeTupleMember._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeTupleMember._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownType() {
    return _stryke_capnp.utils.disown(this.type);
  }
  get type() {
    return _stryke_capnp.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initType() {
    return _stryke_capnp.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  get optional() {
    return _stryke_capnp.utils.getBit(16, this);
  }
  set optional(value) {
    _stryke_capnp.utils.setBit(16, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(5, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(5, value, this);
  }
  toString() {
    return "SerializedTypeTupleMember_" + super.toString();
  }
};
var SerializedTypeTuple = class SerializedTypeTuple
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeTuple",
    id: "eb7501eb1ee4fb6d",
    size: new _stryke_capnp.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeTuple._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeTuple._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeTuple._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeTuple._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownTypes() {
    return _stryke_capnp.utils.disown(this.types);
  }
  get types() {
    return _stryke_capnp.utils.getList(4, SerializedTypeTuple._Types, this);
  }
  _hasTypes() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return _stryke_capnp.utils.initList(
      4,
      SerializedTypeTuple._Types,
      length,
      this
    );
  }
  set types(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  toString() {
    return "SerializedTypeTuple_" + super.toString();
  }
};
var SerializedTypeRest = class SerializedTypeRest extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedTypeRest",
    id: "f9e684a435cce5d1",
    size: new _stryke_capnp.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeRest._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeRest._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(3, SerializedTypeRest._Decorators, this);
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeRest._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownType() {
    return _stryke_capnp.utils.disown(this.type);
  }
  get type() {
    return _stryke_capnp.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initType() {
    return _stryke_capnp.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  toString() {
    return "SerializedTypeRest_" + super.toString();
  }
};
var SimpleSerializedType = class SimpleSerializedType
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SimpleSerializedType",
    id: "80f983e4b811c3ca",
    size: new _stryke_capnp.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SimpleSerializedType._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SimpleSerializedType._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SimpleSerializedType._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SimpleSerializedType._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownOrigin() {
    return _stryke_capnp.utils.disown(this.origin);
  }
  get origin() {
    return _stryke_capnp.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initOrigin() {
    return _stryke_capnp.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set origin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  toString() {
    return "SimpleSerializedType_" + super.toString();
  }
};
var SerializedTypeLiteralSymbol = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedTypeLiteralSymbol",
    id: "f3dd6a3c6054bd55",
    size: new _stryke_capnp.ObjectSize(0, 2)
  };
  /**
   * "symbol"
   *
   */
  get type() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set type(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  get name() {
    return _stryke_capnp.utils.getText(1, this);
  }
  set name(value) {
    _stryke_capnp.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralSymbol_" + super.toString();
  }
};
var SerializedTypeLiteralBigInt = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedTypeLiteralBigInt",
    id: "821a872d8be30bb2",
    size: new _stryke_capnp.ObjectSize(0, 2)
  };
  /**
   * "bigint"
   *
   */
  get type() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set type(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  get value() {
    return _stryke_capnp.utils.getText(1, this);
  }
  set value(value) {
    _stryke_capnp.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralBigInt_" + super.toString();
  }
};
var SerializedTypeLiteralRegex = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedTypeLiteralRegex",
    id: "cc89f97b47927d99",
    size: new _stryke_capnp.ObjectSize(0, 2)
  };
  /**
   * "regex"
   *
   */
  get type() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set type(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  get regex() {
    return _stryke_capnp.utils.getText(1, this);
  }
  set regex(value) {
    _stryke_capnp.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralRegex_" + super.toString();
  }
};
const SerializedTypeLiteral_Literal_Which = {
  SYMBOL: 0,
  STRING: 1,
  NUMBER: 2,
  BOOLEAN: 3,
  BIGINT: 4,
  REGEX: 5
};
var SerializedTypeLiteral_Literal = class extends _stryke_capnp.Struct {
  static SYMBOL = SerializedTypeLiteral_Literal_Which.SYMBOL;
  static STRING = SerializedTypeLiteral_Literal_Which.STRING;
  static NUMBER = SerializedTypeLiteral_Literal_Which.NUMBER;
  static BOOLEAN = SerializedTypeLiteral_Literal_Which.BOOLEAN;
  static BIGINT = SerializedTypeLiteral_Literal_Which.BIGINT;
  static REGEX = SerializedTypeLiteral_Literal_Which.REGEX;
  static _capnp = {
    displayName: "literal",
    id: "e4f0538973f3909f",
    size: new _stryke_capnp.ObjectSize(16, 5)
  };
  _adoptSymbol(value) {
    _stryke_capnp.utils.setUint16(2, 0, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownSymbol() {
    return _stryke_capnp.utils.disown(this.symbol);
  }
  get symbol() {
    _stryke_capnp.utils.testWhich(
      "symbol",
      _stryke_capnp.utils.getUint16(2, this),
      0,
      this
    );
    return _stryke_capnp.utils.getStruct(4, SerializedTypeLiteralSymbol, this);
  }
  _hasSymbol() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initSymbol() {
    _stryke_capnp.utils.setUint16(2, 0, this);
    return _stryke_capnp.utils.initStructAt(
      4,
      SerializedTypeLiteralSymbol,
      this
    );
  }
  get _isSymbol() {
    return _stryke_capnp.utils.getUint16(2, this) === 0;
  }
  set symbol(value) {
    _stryke_capnp.utils.setUint16(2, 0, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  get string() {
    _stryke_capnp.utils.testWhich(
      "string",
      _stryke_capnp.utils.getUint16(2, this),
      1,
      this
    );
    return _stryke_capnp.utils.getText(4, this);
  }
  get _isString() {
    return _stryke_capnp.utils.getUint16(2, this) === 1;
  }
  set string(value) {
    _stryke_capnp.utils.setUint16(2, 1, this);
    _stryke_capnp.utils.setText(4, value, this);
  }
  get number() {
    _stryke_capnp.utils.testWhich(
      "number",
      _stryke_capnp.utils.getUint16(2, this),
      2,
      this
    );
    return _stryke_capnp.utils.getFloat64(8, this);
  }
  get _isNumber() {
    return _stryke_capnp.utils.getUint16(2, this) === 2;
  }
  set number(value) {
    _stryke_capnp.utils.setUint16(2, 2, this);
    _stryke_capnp.utils.setFloat64(8, value, this);
  }
  get boolean() {
    _stryke_capnp.utils.testWhich(
      "boolean",
      _stryke_capnp.utils.getUint16(2, this),
      3,
      this
    );
    return _stryke_capnp.utils.getBit(64, this);
  }
  get _isBoolean() {
    return _stryke_capnp.utils.getUint16(2, this) === 3;
  }
  set boolean(value) {
    _stryke_capnp.utils.setUint16(2, 3, this);
    _stryke_capnp.utils.setBit(64, value, this);
  }
  _adoptBigint(value) {
    _stryke_capnp.utils.setUint16(2, 4, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownBigint() {
    return _stryke_capnp.utils.disown(this.bigint);
  }
  get bigint() {
    _stryke_capnp.utils.testWhich(
      "bigint",
      _stryke_capnp.utils.getUint16(2, this),
      4,
      this
    );
    return _stryke_capnp.utils.getStruct(4, SerializedTypeLiteralBigInt, this);
  }
  _hasBigint() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initBigint() {
    _stryke_capnp.utils.setUint16(2, 4, this);
    return _stryke_capnp.utils.initStructAt(
      4,
      SerializedTypeLiteralBigInt,
      this
    );
  }
  get _isBigint() {
    return _stryke_capnp.utils.getUint16(2, this) === 4;
  }
  set bigint(value) {
    _stryke_capnp.utils.setUint16(2, 4, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  _adoptRegex(value) {
    _stryke_capnp.utils.setUint16(2, 5, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownRegex() {
    return _stryke_capnp.utils.disown(this.regex);
  }
  get regex() {
    _stryke_capnp.utils.testWhich(
      "regex",
      _stryke_capnp.utils.getUint16(2, this),
      5,
      this
    );
    return _stryke_capnp.utils.getStruct(4, SerializedTypeLiteralRegex, this);
  }
  _hasRegex() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initRegex() {
    _stryke_capnp.utils.setUint16(2, 5, this);
    return _stryke_capnp.utils.initStructAt(
      4,
      SerializedTypeLiteralRegex,
      this
    );
  }
  get _isRegex() {
    return _stryke_capnp.utils.getUint16(2, this) === 5;
  }
  set regex(value) {
    _stryke_capnp.utils.setUint16(2, 5, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  toString() {
    return "SerializedTypeLiteral_Literal_" + super.toString();
  }
  which() {
    return _stryke_capnp.utils.getUint16(2, this);
  }
};
var SerializedTypeLiteral = class SerializedTypeLiteral
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeLiteral",
    id: "b876ba24d27d88c8",
    size: new _stryke_capnp.ObjectSize(16, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeLiteral._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeLiteral._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeLiteral._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeLiteral._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  get literal() {
    return _stryke_capnp.utils.getAs(SerializedTypeLiteral_Literal, this);
  }
  _initLiteral() {
    return _stryke_capnp.utils.getAs(SerializedTypeLiteral_Literal, this);
  }
  toString() {
    return "SerializedTypeLiteral_" + super.toString();
  }
};
var SerializedTypeTemplateLiteral = class SerializedTypeTemplateLiteral
  extends _stryke_capnp.Struct
{
  static _capnp = {
    displayName: "SerializedTypeTemplateLiteral",
    id: "8dd6c284d46cc265",
    size: new _stryke_capnp.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return _stryke_capnp.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return _stryke_capnp.utils.getList(
      1,
      SerializedTypeTemplateLiteral._TypeArguments,
      this
    );
  }
  _hasTypeArguments() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return _stryke_capnp.utils.initList(
      1,
      SerializedTypeTemplateLiteral._TypeArguments,
      length,
      this
    );
  }
  set typeArguments(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(1, this)
    );
  }
  _adoptIndexAccessOrigin(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return _stryke_capnp.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return _stryke_capnp.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return _stryke_capnp.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(2, this)
    );
  }
  _adoptDecorators(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return _stryke_capnp.utils.disown(this.decorators);
  }
  get decorators() {
    return _stryke_capnp.utils.getList(
      3,
      SerializedTypeTemplateLiteral._Decorators,
      this
    );
  }
  _hasDecorators() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return _stryke_capnp.utils.initList(
      3,
      SerializedTypeTemplateLiteral._Decorators,
      length,
      this
    );
  }
  set decorators(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(3, this)
    );
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(4, this));
  }
  _disownTypes() {
    return _stryke_capnp.utils.disown(this.types);
  }
  get types() {
    return _stryke_capnp.utils.getList(
      4,
      SerializedTypeTemplateLiteral._Types,
      this
    );
  }
  _hasTypes() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return _stryke_capnp.utils.initList(
      4,
      SerializedTypeTemplateLiteral._Types,
      length,
      this
    );
  }
  set types(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(4, this)
    );
  }
  toString() {
    return "SerializedTypeTemplateLiteral_" + super.toString();
  }
};
var SerializedTypeOther = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedTypeOther",
    id: "9e1048a692ff49ce",
    size: new _stryke_capnp.ObjectSize(8, 1)
  };
  get typeName() {
    return _stryke_capnp.utils.getText(0, this);
  }
  set typeName(value) {
    _stryke_capnp.utils.setText(0, value, this);
  }
  get kind() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
  set kind(value) {
    _stryke_capnp.utils.setUint16(0, value, this);
  }
  toString() {
    return "SerializedTypeOther_" + super.toString();
  }
};
const SerializedType_Type_Which = {
  SIMPLE: 0,
  LITERAL: 1,
  TEMPLATE_LITERAL: 2,
  PARAMETER: 3,
  FUNCTION: 4,
  METHOD: 5,
  PROPERTY: 6,
  PROMISE: 7,
  CLASS_TYPE: 8,
  ENUM: 9,
  UNION: 10,
  INTERSECTION: 11,
  ARRAY: 12,
  OBJECT_LITERAL: 13,
  INDEX_SIGNATURE: 14,
  PROPERTY_SIGNATURE: 15,
  METHOD_SIGNATURE: 16,
  TYPE_PARAMETER: 17,
  INFER: 18,
  TUPLE: 19,
  TUPLE_MEMBER: 20,
  REST: 21,
  OTHER: 22
};
var SerializedType_Type = class extends _stryke_capnp.Struct {
  static SIMPLE = SerializedType_Type_Which.SIMPLE;
  static LITERAL = SerializedType_Type_Which.LITERAL;
  static TEMPLATE_LITERAL = SerializedType_Type_Which.TEMPLATE_LITERAL;
  static PARAMETER = SerializedType_Type_Which.PARAMETER;
  static FUNCTION = SerializedType_Type_Which.FUNCTION;
  static METHOD = SerializedType_Type_Which.METHOD;
  static PROPERTY = SerializedType_Type_Which.PROPERTY;
  static PROMISE = SerializedType_Type_Which.PROMISE;
  static CLASS_TYPE = SerializedType_Type_Which.CLASS_TYPE;
  static ENUM = SerializedType_Type_Which.ENUM;
  static UNION = SerializedType_Type_Which.UNION;
  static INTERSECTION = SerializedType_Type_Which.INTERSECTION;
  static ARRAY = SerializedType_Type_Which.ARRAY;
  static OBJECT_LITERAL = SerializedType_Type_Which.OBJECT_LITERAL;
  static INDEX_SIGNATURE = SerializedType_Type_Which.INDEX_SIGNATURE;
  static PROPERTY_SIGNATURE = SerializedType_Type_Which.PROPERTY_SIGNATURE;
  static METHOD_SIGNATURE = SerializedType_Type_Which.METHOD_SIGNATURE;
  static TYPE_PARAMETER = SerializedType_Type_Which.TYPE_PARAMETER;
  static INFER = SerializedType_Type_Which.INFER;
  static TUPLE = SerializedType_Type_Which.TUPLE;
  static TUPLE_MEMBER = SerializedType_Type_Which.TUPLE_MEMBER;
  static REST = SerializedType_Type_Which.REST;
  static OTHER = SerializedType_Type_Which.OTHER;
  static _capnp = {
    displayName: "type",
    id: "c677d7ed4a496eab",
    size: new _stryke_capnp.ObjectSize(8, 1)
  };
  _adoptSimple(value) {
    _stryke_capnp.utils.setUint16(0, 0, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownSimple() {
    return _stryke_capnp.utils.disown(this.simple);
  }
  get simple() {
    _stryke_capnp.utils.testWhich(
      "simple",
      _stryke_capnp.utils.getUint16(0, this),
      0,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SimpleSerializedType, this);
  }
  _hasSimple() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initSimple() {
    _stryke_capnp.utils.setUint16(0, 0, this);
    return _stryke_capnp.utils.initStructAt(0, SimpleSerializedType, this);
  }
  get _isSimple() {
    return _stryke_capnp.utils.getUint16(0, this) === 0;
  }
  set simple(value) {
    _stryke_capnp.utils.setUint16(0, 0, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptLiteral(value) {
    _stryke_capnp.utils.setUint16(0, 1, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownLiteral() {
    return _stryke_capnp.utils.disown(this.literal);
  }
  get literal() {
    _stryke_capnp.utils.testWhich(
      "literal",
      _stryke_capnp.utils.getUint16(0, this),
      1,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeLiteral, this);
  }
  _hasLiteral() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initLiteral() {
    _stryke_capnp.utils.setUint16(0, 1, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeLiteral, this);
  }
  get _isLiteral() {
    return _stryke_capnp.utils.getUint16(0, this) === 1;
  }
  set literal(value) {
    _stryke_capnp.utils.setUint16(0, 1, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptTemplateLiteral(value) {
    _stryke_capnp.utils.setUint16(0, 2, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownTemplateLiteral() {
    return _stryke_capnp.utils.disown(this.templateLiteral);
  }
  get templateLiteral() {
    _stryke_capnp.utils.testWhich(
      "templateLiteral",
      _stryke_capnp.utils.getUint16(0, this),
      2,
      this
    );
    return _stryke_capnp.utils.getStruct(
      0,
      SerializedTypeTemplateLiteral,
      this
    );
  }
  _hasTemplateLiteral() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initTemplateLiteral() {
    _stryke_capnp.utils.setUint16(0, 2, this);
    return _stryke_capnp.utils.initStructAt(
      0,
      SerializedTypeTemplateLiteral,
      this
    );
  }
  get _isTemplateLiteral() {
    return _stryke_capnp.utils.getUint16(0, this) === 2;
  }
  set templateLiteral(value) {
    _stryke_capnp.utils.setUint16(0, 2, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptParameter(value) {
    _stryke_capnp.utils.setUint16(0, 3, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownParameter() {
    return _stryke_capnp.utils.disown(this.parameter);
  }
  get parameter() {
    _stryke_capnp.utils.testWhich(
      "parameter",
      _stryke_capnp.utils.getUint16(0, this),
      3,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeParameter, this);
  }
  _hasParameter() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initParameter() {
    _stryke_capnp.utils.setUint16(0, 3, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeParameter, this);
  }
  get _isParameter() {
    return _stryke_capnp.utils.getUint16(0, this) === 3;
  }
  set parameter(value) {
    _stryke_capnp.utils.setUint16(0, 3, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptFunction(value) {
    _stryke_capnp.utils.setUint16(0, 4, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownFunction() {
    return _stryke_capnp.utils.disown(this.function);
  }
  get function() {
    _stryke_capnp.utils.testWhich(
      "function",
      _stryke_capnp.utils.getUint16(0, this),
      4,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeFunction, this);
  }
  _hasFunction() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initFunction() {
    _stryke_capnp.utils.setUint16(0, 4, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeFunction, this);
  }
  get _isFunction() {
    return _stryke_capnp.utils.getUint16(0, this) === 4;
  }
  set function(value) {
    _stryke_capnp.utils.setUint16(0, 4, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptMethod(value) {
    _stryke_capnp.utils.setUint16(0, 5, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownMethod() {
    return _stryke_capnp.utils.disown(this.method);
  }
  get method() {
    _stryke_capnp.utils.testWhich(
      "method",
      _stryke_capnp.utils.getUint16(0, this),
      5,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeMethod, this);
  }
  _hasMethod() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initMethod() {
    _stryke_capnp.utils.setUint16(0, 5, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeMethod, this);
  }
  get _isMethod() {
    return _stryke_capnp.utils.getUint16(0, this) === 5;
  }
  set method(value) {
    _stryke_capnp.utils.setUint16(0, 5, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptProperty(value) {
    _stryke_capnp.utils.setUint16(0, 6, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownProperty() {
    return _stryke_capnp.utils.disown(this.property);
  }
  get property() {
    _stryke_capnp.utils.testWhich(
      "property",
      _stryke_capnp.utils.getUint16(0, this),
      6,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeProperty, this);
  }
  _hasProperty() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initProperty() {
    _stryke_capnp.utils.setUint16(0, 6, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeProperty, this);
  }
  get _isProperty() {
    return _stryke_capnp.utils.getUint16(0, this) === 6;
  }
  set property(value) {
    _stryke_capnp.utils.setUint16(0, 6, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptPromise(value) {
    _stryke_capnp.utils.setUint16(0, 7, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownPromise() {
    return _stryke_capnp.utils.disown(this.promise);
  }
  get promise() {
    _stryke_capnp.utils.testWhich(
      "promise",
      _stryke_capnp.utils.getUint16(0, this),
      7,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypePromise, this);
  }
  _hasPromise() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initPromise() {
    _stryke_capnp.utils.setUint16(0, 7, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypePromise, this);
  }
  get _isPromise() {
    return _stryke_capnp.utils.getUint16(0, this) === 7;
  }
  set promise(value) {
    _stryke_capnp.utils.setUint16(0, 7, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptClassType(value) {
    _stryke_capnp.utils.setUint16(0, 8, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownClassType() {
    return _stryke_capnp.utils.disown(this.classType);
  }
  get classType() {
    _stryke_capnp.utils.testWhich(
      "classType",
      _stryke_capnp.utils.getUint16(0, this),
      8,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeClassType, this);
  }
  _hasClassType() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initClassType() {
    _stryke_capnp.utils.setUint16(0, 8, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeClassType, this);
  }
  get _isClassType() {
    return _stryke_capnp.utils.getUint16(0, this) === 8;
  }
  set classType(value) {
    _stryke_capnp.utils.setUint16(0, 8, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptEnum(value) {
    _stryke_capnp.utils.setUint16(0, 9, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownEnum() {
    return _stryke_capnp.utils.disown(this.enum);
  }
  get enum() {
    _stryke_capnp.utils.testWhich(
      "enum",
      _stryke_capnp.utils.getUint16(0, this),
      9,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeEnum, this);
  }
  _hasEnum() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initEnum() {
    _stryke_capnp.utils.setUint16(0, 9, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeEnum, this);
  }
  get _isEnum() {
    return _stryke_capnp.utils.getUint16(0, this) === 9;
  }
  set enum(value) {
    _stryke_capnp.utils.setUint16(0, 9, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptUnion(value) {
    _stryke_capnp.utils.setUint16(0, 10, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownUnion() {
    return _stryke_capnp.utils.disown(this.union);
  }
  get union() {
    _stryke_capnp.utils.testWhich(
      "union",
      _stryke_capnp.utils.getUint16(0, this),
      10,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeUnion, this);
  }
  _hasUnion() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initUnion() {
    _stryke_capnp.utils.setUint16(0, 10, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeUnion, this);
  }
  get _isUnion() {
    return _stryke_capnp.utils.getUint16(0, this) === 10;
  }
  set union(value) {
    _stryke_capnp.utils.setUint16(0, 10, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptIntersection(value) {
    _stryke_capnp.utils.setUint16(0, 11, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownIntersection() {
    return _stryke_capnp.utils.disown(this.intersection);
  }
  get intersection() {
    _stryke_capnp.utils.testWhich(
      "intersection",
      _stryke_capnp.utils.getUint16(0, this),
      11,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeIntersection, this);
  }
  _hasIntersection() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initIntersection() {
    _stryke_capnp.utils.setUint16(0, 11, this);
    return _stryke_capnp.utils.initStructAt(
      0,
      SerializedTypeIntersection,
      this
    );
  }
  get _isIntersection() {
    return _stryke_capnp.utils.getUint16(0, this) === 11;
  }
  set intersection(value) {
    _stryke_capnp.utils.setUint16(0, 11, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptArray(value) {
    _stryke_capnp.utils.setUint16(0, 12, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownArray() {
    return _stryke_capnp.utils.disown(this.array);
  }
  get array() {
    _stryke_capnp.utils.testWhich(
      "array",
      _stryke_capnp.utils.getUint16(0, this),
      12,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeArray, this);
  }
  _hasArray() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initArray() {
    _stryke_capnp.utils.setUint16(0, 12, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeArray, this);
  }
  get _isArray() {
    return _stryke_capnp.utils.getUint16(0, this) === 12;
  }
  set array(value) {
    _stryke_capnp.utils.setUint16(0, 12, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptObjectLiteral(value) {
    _stryke_capnp.utils.setUint16(0, 13, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownObjectLiteral() {
    return _stryke_capnp.utils.disown(this.objectLiteral);
  }
  get objectLiteral() {
    _stryke_capnp.utils.testWhich(
      "objectLiteral",
      _stryke_capnp.utils.getUint16(0, this),
      13,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeObjectLiteral, this);
  }
  _hasObjectLiteral() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initObjectLiteral() {
    _stryke_capnp.utils.setUint16(0, 13, this);
    return _stryke_capnp.utils.initStructAt(
      0,
      SerializedTypeObjectLiteral,
      this
    );
  }
  get _isObjectLiteral() {
    return _stryke_capnp.utils.getUint16(0, this) === 13;
  }
  set objectLiteral(value) {
    _stryke_capnp.utils.setUint16(0, 13, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptIndexSignature(value) {
    _stryke_capnp.utils.setUint16(0, 14, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownIndexSignature() {
    return _stryke_capnp.utils.disown(this.indexSignature);
  }
  get indexSignature() {
    _stryke_capnp.utils.testWhich(
      "indexSignature",
      _stryke_capnp.utils.getUint16(0, this),
      14,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeIndexSignature, this);
  }
  _hasIndexSignature() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initIndexSignature() {
    _stryke_capnp.utils.setUint16(0, 14, this);
    return _stryke_capnp.utils.initStructAt(
      0,
      SerializedTypeIndexSignature,
      this
    );
  }
  get _isIndexSignature() {
    return _stryke_capnp.utils.getUint16(0, this) === 14;
  }
  set indexSignature(value) {
    _stryke_capnp.utils.setUint16(0, 14, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptPropertySignature(value) {
    _stryke_capnp.utils.setUint16(0, 15, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownPropertySignature() {
    return _stryke_capnp.utils.disown(this.propertySignature);
  }
  get propertySignature() {
    _stryke_capnp.utils.testWhich(
      "propertySignature",
      _stryke_capnp.utils.getUint16(0, this),
      15,
      this
    );
    return _stryke_capnp.utils.getStruct(
      0,
      SerializedTypePropertySignature,
      this
    );
  }
  _hasPropertySignature() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initPropertySignature() {
    _stryke_capnp.utils.setUint16(0, 15, this);
    return _stryke_capnp.utils.initStructAt(
      0,
      SerializedTypePropertySignature,
      this
    );
  }
  get _isPropertySignature() {
    return _stryke_capnp.utils.getUint16(0, this) === 15;
  }
  set propertySignature(value) {
    _stryke_capnp.utils.setUint16(0, 15, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptMethodSignature(value) {
    _stryke_capnp.utils.setUint16(0, 16, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownMethodSignature() {
    return _stryke_capnp.utils.disown(this.methodSignature);
  }
  get methodSignature() {
    _stryke_capnp.utils.testWhich(
      "methodSignature",
      _stryke_capnp.utils.getUint16(0, this),
      16,
      this
    );
    return _stryke_capnp.utils.getStruct(
      0,
      SerializedTypeMethodSignature,
      this
    );
  }
  _hasMethodSignature() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initMethodSignature() {
    _stryke_capnp.utils.setUint16(0, 16, this);
    return _stryke_capnp.utils.initStructAt(
      0,
      SerializedTypeMethodSignature,
      this
    );
  }
  get _isMethodSignature() {
    return _stryke_capnp.utils.getUint16(0, this) === 16;
  }
  set methodSignature(value) {
    _stryke_capnp.utils.setUint16(0, 16, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptTypeParameter(value) {
    _stryke_capnp.utils.setUint16(0, 17, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownTypeParameter() {
    return _stryke_capnp.utils.disown(this.typeParameter);
  }
  get typeParameter() {
    _stryke_capnp.utils.testWhich(
      "typeParameter",
      _stryke_capnp.utils.getUint16(0, this),
      17,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeTypeParameter, this);
  }
  _hasTypeParameter() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initTypeParameter() {
    _stryke_capnp.utils.setUint16(0, 17, this);
    return _stryke_capnp.utils.initStructAt(
      0,
      SerializedTypeTypeParameter,
      this
    );
  }
  get _isTypeParameter() {
    return _stryke_capnp.utils.getUint16(0, this) === 17;
  }
  set typeParameter(value) {
    _stryke_capnp.utils.setUint16(0, 17, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptInfer(value) {
    _stryke_capnp.utils.setUint16(0, 18, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownInfer() {
    return _stryke_capnp.utils.disown(this.infer);
  }
  get infer() {
    _stryke_capnp.utils.testWhich(
      "infer",
      _stryke_capnp.utils.getUint16(0, this),
      18,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeInfer, this);
  }
  _hasInfer() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initInfer() {
    _stryke_capnp.utils.setUint16(0, 18, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeInfer, this);
  }
  get _isInfer() {
    return _stryke_capnp.utils.getUint16(0, this) === 18;
  }
  set infer(value) {
    _stryke_capnp.utils.setUint16(0, 18, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptTuple(value) {
    _stryke_capnp.utils.setUint16(0, 19, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownTuple() {
    return _stryke_capnp.utils.disown(this.tuple);
  }
  get tuple() {
    _stryke_capnp.utils.testWhich(
      "tuple",
      _stryke_capnp.utils.getUint16(0, this),
      19,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeTuple, this);
  }
  _hasTuple() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initTuple() {
    _stryke_capnp.utils.setUint16(0, 19, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeTuple, this);
  }
  get _isTuple() {
    return _stryke_capnp.utils.getUint16(0, this) === 19;
  }
  set tuple(value) {
    _stryke_capnp.utils.setUint16(0, 19, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptTupleMember(value) {
    _stryke_capnp.utils.setUint16(0, 20, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownTupleMember() {
    return _stryke_capnp.utils.disown(this.tupleMember);
  }
  get tupleMember() {
    _stryke_capnp.utils.testWhich(
      "tupleMember",
      _stryke_capnp.utils.getUint16(0, this),
      20,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeTupleMember, this);
  }
  _hasTupleMember() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initTupleMember() {
    _stryke_capnp.utils.setUint16(0, 20, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeTupleMember, this);
  }
  get _isTupleMember() {
    return _stryke_capnp.utils.getUint16(0, this) === 20;
  }
  set tupleMember(value) {
    _stryke_capnp.utils.setUint16(0, 20, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptRest(value) {
    _stryke_capnp.utils.setUint16(0, 21, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownRest() {
    return _stryke_capnp.utils.disown(this.rest);
  }
  get rest() {
    _stryke_capnp.utils.testWhich(
      "rest",
      _stryke_capnp.utils.getUint16(0, this),
      21,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeRest, this);
  }
  _hasRest() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initRest() {
    _stryke_capnp.utils.setUint16(0, 21, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeRest, this);
  }
  get _isRest() {
    return _stryke_capnp.utils.getUint16(0, this) === 21;
  }
  set rest(value) {
    _stryke_capnp.utils.setUint16(0, 21, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  _adoptOther(value) {
    _stryke_capnp.utils.setUint16(0, 22, this);
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownOther() {
    return _stryke_capnp.utils.disown(this.other);
  }
  /**
   * For any other type that is not explicitly defined
   *
   */
  get other() {
    _stryke_capnp.utils.testWhich(
      "other",
      _stryke_capnp.utils.getUint16(0, this),
      22,
      this
    );
    return _stryke_capnp.utils.getStruct(0, SerializedTypeOther, this);
  }
  _hasOther() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initOther() {
    _stryke_capnp.utils.setUint16(0, 22, this);
    return _stryke_capnp.utils.initStructAt(0, SerializedTypeOther, this);
  }
  get _isOther() {
    return _stryke_capnp.utils.getUint16(0, this) === 22;
  }
  set other(value) {
    _stryke_capnp.utils.setUint16(0, 22, this);
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  toString() {
    return "SerializedType_Type_" + super.toString();
  }
  which() {
    return _stryke_capnp.utils.getUint16(0, this);
  }
};
var SerializedType = class extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedType",
    id: "96856dcc2dd3d58f",
    size: new _stryke_capnp.ObjectSize(8, 1)
  };
  get type() {
    return _stryke_capnp.utils.getAs(SerializedType_Type, this);
  }
  _initType() {
    return _stryke_capnp.utils.getAs(SerializedType_Type, this);
  }
  toString() {
    return "SerializedType_" + super.toString();
  }
};
var SerializedTypes = class SerializedTypes extends _stryke_capnp.Struct {
  static _capnp = {
    displayName: "SerializedTypes",
    id: "ac55398ab0ef4958",
    size: new _stryke_capnp.ObjectSize(0, 1)
  };
  static _Types;
  _adoptTypes(value) {
    _stryke_capnp.utils.adopt(value, _stryke_capnp.utils.getPointer(0, this));
  }
  _disownTypes() {
    return _stryke_capnp.utils.disown(this.types);
  }
  get types() {
    return _stryke_capnp.utils.getList(0, SerializedTypes._Types, this);
  }
  _hasTypes() {
    return !_stryke_capnp.utils.isNull(_stryke_capnp.utils.getPointer(0, this));
  }
  _initTypes(length) {
    return _stryke_capnp.utils.initList(
      0,
      SerializedTypes._Types,
      length,
      this
    );
  }
  set types(value) {
    _stryke_capnp.utils.copyFrom(
      value,
      _stryke_capnp.utils.getPointer(0, this)
    );
  }
  toString() {
    return "SerializedTypes_" + super.toString();
  }
};
EntityOptions._Indexes = _stryke_capnp.CompositeList(
  EntityOptions_EntityIndexOptions
);
SerializedTypeObjectLiteral._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeObjectLiteral._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeObjectLiteral._Types = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeClassType._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeClassType._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeClassType._ExtendsArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeClassType._Arguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeClassType._Types = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeParameter._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeParameter._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeMethod._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeMethod._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeMethod._Parameters = _stryke_capnp.CompositeList(
  SerializedTypeParameter
);
SerializedTypeProperty._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeProperty._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeFunction._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeFunction._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeFunction._Parameters = _stryke_capnp.CompositeList(
  SerializedTypeParameter
);
SerializedTypePromise._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypePromise._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeEnum._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeEnum._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeEnum._EnumEntries = _stryke_capnp.CompositeList(
  SerializedTypeEnumEntry
);
SerializedTypeUnion._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeUnion._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeUnion._Types = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeIntersection._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeIntersection._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeIntersection._Types = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeArray._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeArray._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeIndexSignature._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeIndexSignature._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypePropertySignature._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypePropertySignature._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeMethodSignature._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeMethodSignature._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeMethodSignature._Parameters = _stryke_capnp.CompositeList(
  SerializedTypeParameter
);
SerializedTypeTypeParameter._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeTypeParameter._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeInfer._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeInfer._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeTupleMember._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeTupleMember._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeTuple._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeTuple._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeTuple._Types = _stryke_capnp.CompositeList(
  SerializedTypeTupleMember
);
SerializedTypeRest._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeRest._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SimpleSerializedType._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SimpleSerializedType._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeLiteral._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeLiteral._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeTemplateLiteral._TypeArguments = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeTemplateLiteral._Decorators = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypeTemplateLiteral._Types = _stryke_capnp.CompositeList(
  SerializedTypeReference
);
SerializedTypes._Types = _stryke_capnp.CompositeList(SerializedType);

//#endregion
exports.DefaultValueReflection = DefaultValueReflection;
exports.DefaultValueReflection_Value = DefaultValueReflection_Value;
exports.DefaultValueReflection_Value_Which = DefaultValueReflection_Value_Which;
exports.EntityOptions = EntityOptions;
exports.EntityOptions_EntityIndexOptions = EntityOptions_EntityIndexOptions;
exports.IndexAccessOrigin = IndexAccessOrigin;
exports.ReflectionKind = ReflectionKind;
exports.ReflectionVisibility = ReflectionVisibility;
exports.SerializedType = SerializedType;
exports.SerializedTypeArray = SerializedTypeArray;
exports.SerializedTypeClassType = SerializedTypeClassType;
exports.SerializedTypeEnum = SerializedTypeEnum;
exports.SerializedTypeEnumEntry = SerializedTypeEnumEntry;
exports.SerializedTypeFunction = SerializedTypeFunction;
exports.SerializedTypeIndexSignature = SerializedTypeIndexSignature;
exports.SerializedTypeInfer = SerializedTypeInfer;
exports.SerializedTypeIntersection = SerializedTypeIntersection;
exports.SerializedTypeLiteral = SerializedTypeLiteral;
exports.SerializedTypeLiteralBigInt = SerializedTypeLiteralBigInt;
exports.SerializedTypeLiteralRegex = SerializedTypeLiteralRegex;
exports.SerializedTypeLiteralSymbol = SerializedTypeLiteralSymbol;
exports.SerializedTypeLiteral_Literal = SerializedTypeLiteral_Literal;
exports.SerializedTypeLiteral_Literal_Which =
  SerializedTypeLiteral_Literal_Which;
exports.SerializedTypeMethod = SerializedTypeMethod;
exports.SerializedTypeMethodSignature = SerializedTypeMethodSignature;
exports.SerializedTypeObjectLiteral = SerializedTypeObjectLiteral;
exports.SerializedTypeOther = SerializedTypeOther;
exports.SerializedTypeParameter = SerializedTypeParameter;
exports.SerializedTypePromise = SerializedTypePromise;
exports.SerializedTypeProperty = SerializedTypeProperty;
exports.SerializedTypePropertySignature = SerializedTypePropertySignature;
exports.SerializedTypeReference = SerializedTypeReference;
exports.SerializedTypeRest = SerializedTypeRest;
exports.SerializedTypeTemplateLiteral = SerializedTypeTemplateLiteral;
exports.SerializedTypeTuple = SerializedTypeTuple;
exports.SerializedTypeTupleMember = SerializedTypeTupleMember;
exports.SerializedTypeTypeParameter = SerializedTypeTypeParameter;
exports.SerializedTypeUnion = SerializedTypeUnion;
exports.SerializedType_Type = SerializedType_Type;
exports.SerializedType_Type_Which = SerializedType_Type_Which;
exports.SerializedTypes = SerializedTypes;
exports.SimpleSerializedType = SimpleSerializedType;
exports.TagsReflection = TagsReflection;
exports._capnpFileId = _capnpFileId;
