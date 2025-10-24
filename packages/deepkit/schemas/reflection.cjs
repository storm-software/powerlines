'use strict';

var $ = require('@stryke/capnp');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var $__namespace = /*#__PURE__*/_interopNamespace($);

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var _capnpFileId = BigInt("0xae3c363dcecf2729");
var ReflectionKind = {
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
var ReflectionVisibility = {
  PUBLIC: 0,
  PROTECTED: 1,
  PRIVATE: 2
};
var TagsReflection = class extends $__namespace.Struct {
  static {
    __name(this, "TagsReflection");
  }
  static _capnp = {
    displayName: "TagsReflection",
    id: "ab7e31d6b834bbf8",
    size: new $__namespace.ObjectSize(8, 4)
  };
  _adoptAlias(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownAlias() {
    return $__namespace.utils.disown(this.alias);
  }
  get alias() {
    return $__namespace.utils.getList(0, $__namespace.TextList, this);
  }
  _hasAlias() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initAlias(length) {
    return $__namespace.utils.initList(0, $__namespace.TextList, length, this);
  }
  set alias(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  get title() {
    return $__namespace.utils.getText(1, this);
  }
  set title(value) {
    $__namespace.utils.setText(1, value, this);
  }
  get hidden() {
    return $__namespace.utils.getBit(0, this);
  }
  set hidden(value) {
    $__namespace.utils.setBit(0, value, this);
  }
  get readonly() {
    return $__namespace.utils.getBit(1, this);
  }
  set readonly(value) {
    $__namespace.utils.setBit(1, value, this);
  }
  get ignore() {
    return $__namespace.utils.getBit(2, this);
  }
  set ignore(value) {
    $__namespace.utils.setBit(2, value, this);
  }
  get internal() {
    return $__namespace.utils.getBit(3, this);
  }
  set internal(value) {
    $__namespace.utils.setBit(3, value, this);
  }
  _adoptPermission(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownPermission() {
    return $__namespace.utils.disown(this.permission);
  }
  get permission() {
    return $__namespace.utils.getList(2, $__namespace.TextList, this);
  }
  _hasPermission() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initPermission(length) {
    return $__namespace.utils.initList(2, $__namespace.TextList, length, this);
  }
  set permission(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  get domain() {
    return $__namespace.utils.getText(3, this);
  }
  set domain(value) {
    $__namespace.utils.setText(3, value, this);
  }
  toString() {
    return "TagsReflection_" + super.toString();
  }
};
var DefaultValueReflection_Value_Which = {
  UNDEFINED: 0,
  BOOLEAN: 1,
  INTEGER: 2,
  FLOAT: 3,
  STRING: 4
};
var DefaultValueReflection_Value = class extends $__namespace.Struct {
  static {
    __name(this, "DefaultValueReflection_Value");
  }
  static UNDEFINED = DefaultValueReflection_Value_Which.UNDEFINED;
  static BOOLEAN = DefaultValueReflection_Value_Which.BOOLEAN;
  static INTEGER = DefaultValueReflection_Value_Which.INTEGER;
  static FLOAT = DefaultValueReflection_Value_Which.FLOAT;
  static STRING = DefaultValueReflection_Value_Which.STRING;
  static _capnp = {
    displayName: "value",
    id: "8748135e0497fe81",
    size: new $__namespace.ObjectSize(16, 1)
  };
  get _isUndefined() {
    return $__namespace.utils.getUint16(0, this) === 0;
  }
  set undefined(_) {
    $__namespace.utils.setUint16(0, 0, this);
  }
  get boolean() {
    $__namespace.utils.testWhich("boolean", $__namespace.utils.getUint16(0, this), 1, this);
    return $__namespace.utils.getBit(16, this);
  }
  get _isBoolean() {
    return $__namespace.utils.getUint16(0, this) === 1;
  }
  set boolean(value) {
    $__namespace.utils.setUint16(0, 1, this);
    $__namespace.utils.setBit(16, value, this);
  }
  get integer() {
    $__namespace.utils.testWhich("integer", $__namespace.utils.getUint16(0, this), 2, this);
    return $__namespace.utils.getInt32(4, this);
  }
  get _isInteger() {
    return $__namespace.utils.getUint16(0, this) === 2;
  }
  set integer(value) {
    $__namespace.utils.setUint16(0, 2, this);
    $__namespace.utils.setInt32(4, value, this);
  }
  get float() {
    $__namespace.utils.testWhich("float", $__namespace.utils.getUint16(0, this), 3, this);
    return $__namespace.utils.getFloat64(8, this);
  }
  get _isFloat() {
    return $__namespace.utils.getUint16(0, this) === 3;
  }
  set float(value) {
    $__namespace.utils.setUint16(0, 3, this);
    $__namespace.utils.setFloat64(8, value, this);
  }
  get string() {
    $__namespace.utils.testWhich("string", $__namespace.utils.getUint16(0, this), 4, this);
    return $__namespace.utils.getText(0, this);
  }
  get _isString() {
    return $__namespace.utils.getUint16(0, this) === 4;
  }
  set string(value) {
    $__namespace.utils.setUint16(0, 4, this);
    $__namespace.utils.setText(0, value, this);
  }
  toString() {
    return "DefaultValueReflection_Value_" + super.toString();
  }
  which() {
    return $__namespace.utils.getUint16(0, this);
  }
};
var DefaultValueReflection = class extends $__namespace.Struct {
  static {
    __name(this, "DefaultValueReflection");
  }
  static _capnp = {
    displayName: "DefaultValueReflection",
    id: "96fe6f07954197c9",
    size: new $__namespace.ObjectSize(16, 1)
  };
  get value() {
    return $__namespace.utils.getAs(DefaultValueReflection_Value, this);
  }
  _initValue() {
    return $__namespace.utils.getAs(DefaultValueReflection_Value, this);
  }
  toString() {
    return "DefaultValueReflection_" + super.toString();
  }
};
var SerializedTypeReference = class extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeReference");
  }
  static _capnp = {
    displayName: "SerializedTypeReference",
    id: "a83d8a28b5e80f3a",
    size: new $__namespace.ObjectSize(8, 0)
  };
  get id() {
    return $__namespace.utils.getUint32(0, this);
  }
  set id(value) {
    $__namespace.utils.setUint32(0, value, this);
  }
  toString() {
    return "SerializedTypeReference_" + super.toString();
  }
};
var IndexAccessOrigin = class extends $__namespace.Struct {
  static {
    __name(this, "IndexAccessOrigin");
  }
  static _capnp = {
    displayName: "IndexAccessOrigin",
    id: "ca50b18186c87afe",
    size: new $__namespace.ObjectSize(0, 2)
  };
  _adoptContainer(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownContainer() {
    return $__namespace.utils.disown(this.container);
  }
  get container() {
    return $__namespace.utils.getStruct(0, SerializedTypeReference, this);
  }
  _hasContainer() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initContainer() {
    return $__namespace.utils.initStructAt(0, SerializedTypeReference, this);
  }
  set container(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptIndex(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownIndex() {
    return $__namespace.utils.disown(this.index);
  }
  get index() {
    return $__namespace.utils.getStruct(1, SerializedTypeReference, this);
  }
  _hasIndex() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initIndex() {
    return $__namespace.utils.initStructAt(1, SerializedTypeReference, this);
  }
  set index(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  toString() {
    return "IndexAccessOrigin_" + super.toString();
  }
};
var EntityOptions_EntityIndexOptions = class extends $__namespace.Struct {
  static {
    __name(this, "EntityOptions_EntityIndexOptions");
  }
  static _capnp = {
    displayName: "EntityIndexOptions",
    id: "de584ad10b7c5004",
    size: new $__namespace.ObjectSize(0, 2)
  };
  _adoptNames(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownNames() {
    return $__namespace.utils.disown(this.names);
  }
  get names() {
    return $__namespace.utils.getList(0, $__namespace.TextList, this);
  }
  _hasNames() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initNames(length) {
    return $__namespace.utils.initList(0, $__namespace.TextList, length, this);
  }
  set names(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  /**
  * JSON stringified options
  *
  */
  get options() {
    return $__namespace.utils.getText(1, this);
  }
  set options(value) {
    $__namespace.utils.setText(1, value, this);
  }
  toString() {
    return "EntityOptions_EntityIndexOptions_" + super.toString();
  }
};
var EntityOptions = class _EntityOptions extends $__namespace.Struct {
  static {
    __name(this, "EntityOptions");
  }
  static EntityIndexOptions = EntityOptions_EntityIndexOptions;
  static _capnp = {
    displayName: "EntityOptions",
    id: "948d2d02cf676d60",
    size: new $__namespace.ObjectSize(8, 5)
  };
  static _Indexes;
  get name() {
    return $__namespace.utils.getText(0, this);
  }
  set name(value) {
    $__namespace.utils.setText(0, value, this);
  }
  get description() {
    return $__namespace.utils.getText(1, this);
  }
  set description(value) {
    $__namespace.utils.setText(1, value, this);
  }
  get collection() {
    return $__namespace.utils.getText(2, this);
  }
  set collection(value) {
    $__namespace.utils.setText(2, value, this);
  }
  get database() {
    return $__namespace.utils.getText(3, this);
  }
  set database(value) {
    $__namespace.utils.setText(3, value, this);
  }
  get singleTableInheritance() {
    return $__namespace.utils.getBit(0, this);
  }
  set singleTableInheritance(value) {
    $__namespace.utils.setBit(0, value, this);
  }
  _adoptIndexes(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownIndexes() {
    return $__namespace.utils.disown(this.indexes);
  }
  get indexes() {
    return $__namespace.utils.getList(4, _EntityOptions._Indexes, this);
  }
  _hasIndexes() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initIndexes(length) {
    return $__namespace.utils.initList(4, _EntityOptions._Indexes, length, this);
  }
  set indexes(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  toString() {
    return "EntityOptions_" + super.toString();
  }
};
var SerializedTypeObjectLiteral = class _SerializedTypeObjectLiteral extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeObjectLiteral");
  }
  static _capnp = {
    displayName: "SerializedTypeObjectLiteral",
    id: "8b56235ad9bcb2b1",
    size: new $__namespace.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeObjectLiteral._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeObjectLiteral._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeObjectLiteral._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeObjectLiteral._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $__namespace.utils.disown(this.types);
  }
  get types() {
    return $__namespace.utils.getList(4, _SerializedTypeObjectLiteral._Types, this);
  }
  _hasTypes() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $__namespace.utils.initList(4, _SerializedTypeObjectLiteral._Types, length, this);
  }
  set types(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(5, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(5, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(5, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(5, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(5, this));
  }
  toString() {
    return "SerializedTypeObjectLiteral_" + super.toString();
  }
};
var SerializedTypeClassType = class _SerializedTypeClassType extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeClassType");
  }
  static _capnp = {
    displayName: "SerializedTypeClassType",
    id: "9855392bf9c48b25",
    size: new $__namespace.ObjectSize(8, 11)
  };
  static _TypeArguments;
  static _Decorators;
  static _ExtendsArguments;
  static _Arguments;
  static _Types;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeClassType._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeClassType._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeClassType._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeClassType._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get name() {
    return $__namespace.utils.getText(4, this);
  }
  set name(value) {
    $__namespace.utils.setText(4, value, this);
  }
  get globalObject() {
    return $__namespace.utils.getBit(16, this);
  }
  set globalObject(value) {
    $__namespace.utils.setBit(16, value, this);
  }
  get classType() {
    return $__namespace.utils.getText(5, this);
  }
  set classType(value) {
    $__namespace.utils.setText(5, value, this);
  }
  _adoptExtendsArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(6, this));
  }
  _disownExtendsArguments() {
    return $__namespace.utils.disown(this.extendsArguments);
  }
  get extendsArguments() {
    return $__namespace.utils.getList(6, _SerializedTypeClassType._ExtendsArguments, this);
  }
  _hasExtendsArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(6, this));
  }
  _initExtendsArguments(length) {
    return $__namespace.utils.initList(6, _SerializedTypeClassType._ExtendsArguments, length, this);
  }
  set extendsArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(6, this));
  }
  _adoptArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(7, this));
  }
  _disownArguments() {
    return $__namespace.utils.disown(this.arguments);
  }
  get arguments() {
    return $__namespace.utils.getList(7, _SerializedTypeClassType._Arguments, this);
  }
  _hasArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(7, this));
  }
  _initArguments(length) {
    return $__namespace.utils.initList(7, _SerializedTypeClassType._Arguments, length, this);
  }
  set arguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(7, this));
  }
  _adoptSuperClass(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(8, this));
  }
  _disownSuperClass() {
    return $__namespace.utils.disown(this.superClass);
  }
  get superClass() {
    return $__namespace.utils.getStruct(8, SerializedTypeReference, this);
  }
  _hasSuperClass() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(8, this));
  }
  _initSuperClass() {
    return $__namespace.utils.initStructAt(8, SerializedTypeReference, this);
  }
  set superClass(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(8, this));
  }
  _adoptTypes(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(9, this));
  }
  _disownTypes() {
    return $__namespace.utils.disown(this.types);
  }
  get types() {
    return $__namespace.utils.getList(9, _SerializedTypeClassType._Types, this);
  }
  _hasTypes() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(9, this));
  }
  _initTypes(length) {
    return $__namespace.utils.initList(9, _SerializedTypeClassType._Types, length, this);
  }
  set types(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(9, this));
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(10, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(10, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(10, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(10, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(10, this));
  }
  toString() {
    return "SerializedTypeClassType_" + super.toString();
  }
};
var SerializedTypeParameter = class _SerializedTypeParameter extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeParameter");
  }
  static _capnp = {
    displayName: "SerializedTypeParameter",
    id: "fcbaa08bb97b8b1a",
    size: new $__namespace.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeParameter._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeParameter._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeParameter._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeParameter._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get name() {
    return $__namespace.utils.getText(4, this);
  }
  set name(value) {
    $__namespace.utils.setText(4, value, this);
  }
  _adoptType(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(5, this));
  }
  _disownType() {
    return $__namespace.utils.disown(this.type);
  }
  get type() {
    return $__namespace.utils.getStruct(5, SerializedTypeReference, this);
  }
  _hasType() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(5, this));
  }
  _initType() {
    return $__namespace.utils.initStructAt(5, SerializedTypeReference, this);
  }
  set type(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(5, this));
  }
  get visibility() {
    return $__namespace.utils.getUint16(2, this);
  }
  set visibility(value) {
    $__namespace.utils.setUint16(2, value, this);
  }
  get readonly() {
    return $__namespace.utils.getBit(32, this);
  }
  set readonly(value) {
    $__namespace.utils.setBit(32, value, this);
  }
  get optional() {
    return $__namespace.utils.getBit(33, this);
  }
  set optional(value) {
    $__namespace.utils.setBit(33, value, this);
  }
  _adoptDefault(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(6, this));
  }
  _disownDefault() {
    return $__namespace.utils.disown(this.default);
  }
  get default() {
    return $__namespace.utils.getStruct(6, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(6, this));
  }
  _initDefault() {
    return $__namespace.utils.initStructAt(6, DefaultValueReflection, this);
  }
  set default(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(6, this));
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(7, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(7, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeParameter_" + super.toString();
  }
};
var SerializedTypeMethod = class _SerializedTypeMethod extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeMethod");
  }
  static _capnp = {
    displayName: "SerializedTypeMethod",
    id: "8b5eff6d9ec2fb06",
    size: new $__namespace.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeMethod._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeMethod._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeMethod._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeMethod._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get visibility() {
    return $__namespace.utils.getUint16(0, this);
  }
  set visibility(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get abstract() {
    return $__namespace.utils.getBit(16, this);
  }
  set abstract(value) {
    $__namespace.utils.setBit(16, value, this);
  }
  get optional() {
    return $__namespace.utils.getBit(17, this);
  }
  set optional(value) {
    $__namespace.utils.setBit(17, value, this);
  }
  get readonly() {
    return $__namespace.utils.getBit(18, this);
  }
  set readonly(value) {
    $__namespace.utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(4, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(4, value, this);
  }
  get name() {
    return $__namespace.utils.getText(5, this);
  }
  set name(value) {
    $__namespace.utils.setText(5, value, this);
  }
  _adoptParameters(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(6, this));
  }
  _disownParameters() {
    return $__namespace.utils.disown(this.parameters);
  }
  get parameters() {
    return $__namespace.utils.getList(6, _SerializedTypeMethod._Parameters, this);
  }
  _hasParameters() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(6, this));
  }
  _initParameters(length) {
    return $__namespace.utils.initList(6, _SerializedTypeMethod._Parameters, length, this);
  }
  set parameters(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(6, this));
  }
  _adoptReturn(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(7, this));
  }
  _disownReturn() {
    return $__namespace.utils.disown(this.return);
  }
  get return() {
    return $__namespace.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(7, this));
  }
  _initReturn() {
    return $__namespace.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set return(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeMethod_" + super.toString();
  }
};
var SerializedTypeProperty = class _SerializedTypeProperty extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeProperty");
  }
  static _capnp = {
    displayName: "SerializedTypeProperty",
    id: "91d9dbea2037f78b",
    size: new $__namespace.ObjectSize(8, 9)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeProperty._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeProperty._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeProperty._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeProperty._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get visibility() {
    return $__namespace.utils.getUint16(0, this);
  }
  set visibility(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get abstract() {
    return $__namespace.utils.getBit(16, this);
  }
  set abstract(value) {
    $__namespace.utils.setBit(16, value, this);
  }
  get optional() {
    return $__namespace.utils.getBit(17, this);
  }
  set optional(value) {
    $__namespace.utils.setBit(17, value, this);
  }
  get readonly() {
    return $__namespace.utils.getBit(18, this);
  }
  set readonly(value) {
    $__namespace.utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(4, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(4, value, this);
  }
  get name() {
    return $__namespace.utils.getText(5, this);
  }
  set name(value) {
    $__namespace.utils.setText(5, value, this);
  }
  get description() {
    return $__namespace.utils.getText(6, this);
  }
  set description(value) {
    $__namespace.utils.setText(6, value, this);
  }
  _adoptType(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(7, this));
  }
  _disownType() {
    return $__namespace.utils.disown(this.type);
  }
  get type() {
    return $__namespace.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasType() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(7, this));
  }
  _initType() {
    return $__namespace.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set type(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(7, this));
  }
  _adoptDefault(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(8, this));
  }
  _disownDefault() {
    return $__namespace.utils.disown(this.default);
  }
  get default() {
    return $__namespace.utils.getStruct(8, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(8, this));
  }
  _initDefault() {
    return $__namespace.utils.initStructAt(8, DefaultValueReflection, this);
  }
  set default(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(8, this));
  }
  toString() {
    return "SerializedTypeProperty_" + super.toString();
  }
};
var SerializedTypeFunction = class _SerializedTypeFunction extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeFunction");
  }
  static _capnp = {
    displayName: "SerializedTypeFunction",
    id: "9130bccd82dfcfd4",
    size: new $__namespace.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeFunction._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeFunction._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeFunction._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeFunction._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get visibility() {
    return $__namespace.utils.getUint16(0, this);
  }
  set visibility(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get abstract() {
    return $__namespace.utils.getBit(16, this);
  }
  set abstract(value) {
    $__namespace.utils.setBit(16, value, this);
  }
  get optional() {
    return $__namespace.utils.getBit(17, this);
  }
  set optional(value) {
    $__namespace.utils.setBit(17, value, this);
  }
  get readonly() {
    return $__namespace.utils.getBit(18, this);
  }
  set readonly(value) {
    $__namespace.utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(4, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(4, value, this);
  }
  get name() {
    return $__namespace.utils.getText(5, this);
  }
  set name(value) {
    $__namespace.utils.setText(5, value, this);
  }
  _adoptParameters(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(6, this));
  }
  _disownParameters() {
    return $__namespace.utils.disown(this.parameters);
  }
  get parameters() {
    return $__namespace.utils.getList(6, _SerializedTypeFunction._Parameters, this);
  }
  _hasParameters() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(6, this));
  }
  _initParameters(length) {
    return $__namespace.utils.initList(6, _SerializedTypeFunction._Parameters, length, this);
  }
  set parameters(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(6, this));
  }
  _adoptReturn(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(7, this));
  }
  _disownReturn() {
    return $__namespace.utils.disown(this.return);
  }
  get return() {
    return $__namespace.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(7, this));
  }
  _initReturn() {
    return $__namespace.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set return(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeFunction_" + super.toString();
  }
};
var SerializedTypePromise = class _SerializedTypePromise extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypePromise");
  }
  static _capnp = {
    displayName: "SerializedTypePromise",
    id: "e9b0cbe936a42398",
    size: new $__namespace.ObjectSize(8, 4)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypePromise._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypePromise._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypePromise._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypePromise._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get visibility() {
    return $__namespace.utils.getUint16(0, this);
  }
  set visibility(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get abstract() {
    return $__namespace.utils.getBit(16, this);
  }
  set abstract(value) {
    $__namespace.utils.setBit(16, value, this);
  }
  toString() {
    return "SerializedTypePromise_" + super.toString();
  }
};
var SerializedTypeEnumEntry = class extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeEnumEntry");
  }
  static _capnp = {
    displayName: "SerializedTypeEnumEntry",
    id: "d5bcb8b7c49ba556",
    size: new $__namespace.ObjectSize(0, 2)
  };
  get name() {
    return $__namespace.utils.getText(0, this);
  }
  set name(value) {
    $__namespace.utils.setText(0, value, this);
  }
  get value() {
    return $__namespace.utils.getText(1, this);
  }
  set value(value) {
    $__namespace.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeEnumEntry_" + super.toString();
  }
};
var SerializedTypeEnum = class _SerializedTypeEnum extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeEnum");
  }
  static _capnp = {
    displayName: "SerializedTypeEnum",
    id: "d7d36f0ae79e3841",
    size: new $__namespace.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _EnumEntries;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeEnum._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeEnum._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeEnum._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeEnum._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptEnumEntries(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownEnumEntries() {
    return $__namespace.utils.disown(this.enumEntries);
  }
  get enumEntries() {
    return $__namespace.utils.getList(4, _SerializedTypeEnum._EnumEntries, this);
  }
  _hasEnumEntries() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initEnumEntries(length) {
    return $__namespace.utils.initList(4, _SerializedTypeEnum._EnumEntries, length, this);
  }
  set enumEntries(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  _adoptValues(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(5, this));
  }
  _disownValues() {
    return $__namespace.utils.disown(this.values);
  }
  get values() {
    return $__namespace.utils.getList(5, $__namespace.TextList, this);
  }
  _hasValues() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(5, this));
  }
  _initValues(length) {
    return $__namespace.utils.initList(5, $__namespace.TextList, length, this);
  }
  set values(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(5, this));
  }
  _adoptIndexType(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(6, this));
  }
  _disownIndexType() {
    return $__namespace.utils.disown(this.indexType);
  }
  get indexType() {
    return $__namespace.utils.getStruct(6, SerializedTypeReference, this);
  }
  _hasIndexType() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(6, this));
  }
  _initIndexType() {
    return $__namespace.utils.initStructAt(6, SerializedTypeReference, this);
  }
  set indexType(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(6, this));
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(7, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(7, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeEnum_" + super.toString();
  }
};
var SerializedTypeUnion = class _SerializedTypeUnion extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeUnion");
  }
  static _capnp = {
    displayName: "SerializedTypeUnion",
    id: "a9ae4c95e41ff4ab",
    size: new $__namespace.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeUnion._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeUnion._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeUnion._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeUnion._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $__namespace.utils.disown(this.types);
  }
  get types() {
    return $__namespace.utils.getList(4, _SerializedTypeUnion._Types, this);
  }
  _hasTypes() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $__namespace.utils.initList(4, _SerializedTypeUnion._Types, length, this);
  }
  set types(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeUnion_" + super.toString();
  }
};
var SerializedTypeIntersection = class _SerializedTypeIntersection extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeIntersection");
  }
  static _capnp = {
    displayName: "SerializedTypeIntersection",
    id: "9ae42bd17511c09b",
    size: new $__namespace.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeIntersection._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeIntersection._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeIntersection._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeIntersection._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $__namespace.utils.disown(this.types);
  }
  get types() {
    return $__namespace.utils.getList(4, _SerializedTypeIntersection._Types, this);
  }
  _hasTypes() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $__namespace.utils.initList(4, _SerializedTypeIntersection._Types, length, this);
  }
  set types(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeIntersection_" + super.toString();
  }
};
var SerializedTypeArray = class _SerializedTypeArray extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeArray");
  }
  static _capnp = {
    displayName: "SerializedTypeArray",
    id: "97d1d75240151501",
    size: new $__namespace.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeArray._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeArray._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeArray._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeArray._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownType() {
    return $__namespace.utils.disown(this.type);
  }
  get type() {
    return $__namespace.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initType() {
    return $__namespace.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(5, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(5, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(5, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(5, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(5, this));
  }
  toString() {
    return "SerializedTypeArray_" + super.toString();
  }
};
var SerializedTypeIndexSignature = class _SerializedTypeIndexSignature extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeIndexSignature");
  }
  static _capnp = {
    displayName: "SerializedTypeIndexSignature",
    id: "93e335e2756821d8",
    size: new $__namespace.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeIndexSignature._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeIndexSignature._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeIndexSignature._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeIndexSignature._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptIndex(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownIndex() {
    return $__namespace.utils.disown(this.index);
  }
  get index() {
    return $__namespace.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasIndex() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initIndex() {
    return $__namespace.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set index(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  _adoptType(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(5, this));
  }
  _disownType() {
    return $__namespace.utils.disown(this.type);
  }
  get type() {
    return $__namespace.utils.getStruct(5, SerializedTypeReference, this);
  }
  _hasType() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(5, this));
  }
  _initType() {
    return $__namespace.utils.initStructAt(5, SerializedTypeReference, this);
  }
  set type(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(5, this));
  }
  toString() {
    return "SerializedTypeIndexSignature_" + super.toString();
  }
};
var SerializedTypePropertySignature = class _SerializedTypePropertySignature extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypePropertySignature");
  }
  static _capnp = {
    displayName: "SerializedTypePropertySignature",
    id: "9bc1cebd2ca1569a",
    size: new $__namespace.ObjectSize(8, 9)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypePropertySignature._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypePropertySignature._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypePropertySignature._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypePropertySignature._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get name() {
    return $__namespace.utils.getText(4, this);
  }
  set name(value) {
    $__namespace.utils.setText(4, value, this);
  }
  get optional() {
    return $__namespace.utils.getBit(16, this);
  }
  set optional(value) {
    $__namespace.utils.setBit(16, value, this);
  }
  get readonly() {
    return $__namespace.utils.getBit(17, this);
  }
  set readonly(value) {
    $__namespace.utils.setBit(17, value, this);
  }
  get description() {
    return $__namespace.utils.getText(5, this);
  }
  set description(value) {
    $__namespace.utils.setText(5, value, this);
  }
  _adoptDefault(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(6, this));
  }
  _disownDefault() {
    return $__namespace.utils.disown(this.default);
  }
  get default() {
    return $__namespace.utils.getStruct(6, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(6, this));
  }
  _initDefault() {
    return $__namespace.utils.initStructAt(6, DefaultValueReflection, this);
  }
  set default(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(6, this));
  }
  _adoptType(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(7, this));
  }
  _disownType() {
    return $__namespace.utils.disown(this.type);
  }
  get type() {
    return $__namespace.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasType() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(7, this));
  }
  _initType() {
    return $__namespace.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set type(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(7, this));
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(8, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(8, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(8, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(8, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(8, this));
  }
  toString() {
    return "SerializedTypePropertySignature_" + super.toString();
  }
};
var SerializedTypeMethodSignature = class _SerializedTypeMethodSignature extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeMethodSignature");
  }
  static _capnp = {
    displayName: "SerializedTypeMethodSignature",
    id: "e25a2cc39d5930c8",
    size: new $__namespace.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeMethodSignature._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeMethodSignature._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeMethodSignature._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeMethodSignature._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get name() {
    return $__namespace.utils.getText(4, this);
  }
  set name(value) {
    $__namespace.utils.setText(4, value, this);
  }
  get optional() {
    return $__namespace.utils.getBit(16, this);
  }
  set optional(value) {
    $__namespace.utils.setBit(16, value, this);
  }
  _adoptParameters(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(5, this));
  }
  _disownParameters() {
    return $__namespace.utils.disown(this.parameters);
  }
  get parameters() {
    return $__namespace.utils.getList(5, _SerializedTypeMethodSignature._Parameters, this);
  }
  _hasParameters() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(5, this));
  }
  _initParameters(length) {
    return $__namespace.utils.initList(5, _SerializedTypeMethodSignature._Parameters, length, this);
  }
  set parameters(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(5, this));
  }
  _adoptReturn(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(6, this));
  }
  _disownReturn() {
    return $__namespace.utils.disown(this.return);
  }
  get return() {
    return $__namespace.utils.getStruct(6, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(6, this));
  }
  _initReturn() {
    return $__namespace.utils.initStructAt(6, SerializedTypeReference, this);
  }
  set return(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(6, this));
  }
  _adoptTags(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(7, this));
  }
  _disownTags() {
    return $__namespace.utils.disown(this.tags);
  }
  get tags() {
    return $__namespace.utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(7, this));
  }
  _initTags() {
    return $__namespace.utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeMethodSignature_" + super.toString();
  }
};
var SerializedTypeTypeParameter = class _SerializedTypeTypeParameter extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeTypeParameter");
  }
  static _capnp = {
    displayName: "SerializedTypeTypeParameter",
    id: "81210361a54d5d71",
    size: new $__namespace.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeTypeParameter._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeTypeParameter._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeTypeParameter._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeTypeParameter._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get name() {
    return $__namespace.utils.getText(4, this);
  }
  set name(value) {
    $__namespace.utils.setText(4, value, this);
  }
  toString() {
    return "SerializedTypeTypeParameter_" + super.toString();
  }
};
var SerializedTypeInfer = class _SerializedTypeInfer extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeInfer");
  }
  static _capnp = {
    displayName: "SerializedTypeInfer",
    id: "91c6dd1e13f2b14d",
    size: new $__namespace.ObjectSize(8, 4)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeInfer._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeInfer._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeInfer._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeInfer._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  toString() {
    return "SerializedTypeInfer_" + super.toString();
  }
};
var SerializedTypeTupleMember = class _SerializedTypeTupleMember extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeTupleMember");
  }
  static _capnp = {
    displayName: "SerializedTypeTupleMember",
    id: "e21c2a18d0d56fdf",
    size: new $__namespace.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeTupleMember._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeTupleMember._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeTupleMember._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeTupleMember._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownType() {
    return $__namespace.utils.disown(this.type);
  }
  get type() {
    return $__namespace.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initType() {
    return $__namespace.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  get optional() {
    return $__namespace.utils.getBit(16, this);
  }
  set optional(value) {
    $__namespace.utils.setBit(16, value, this);
  }
  get name() {
    return $__namespace.utils.getText(5, this);
  }
  set name(value) {
    $__namespace.utils.setText(5, value, this);
  }
  toString() {
    return "SerializedTypeTupleMember_" + super.toString();
  }
};
var SerializedTypeTuple = class _SerializedTypeTuple extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeTuple");
  }
  static _capnp = {
    displayName: "SerializedTypeTuple",
    id: "eb7501eb1ee4fb6d",
    size: new $__namespace.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeTuple._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeTuple._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeTuple._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeTuple._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $__namespace.utils.disown(this.types);
  }
  get types() {
    return $__namespace.utils.getList(4, _SerializedTypeTuple._Types, this);
  }
  _hasTypes() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $__namespace.utils.initList(4, _SerializedTypeTuple._Types, length, this);
  }
  set types(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeTuple_" + super.toString();
  }
};
var SerializedTypeRest = class _SerializedTypeRest extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeRest");
  }
  static _capnp = {
    displayName: "SerializedTypeRest",
    id: "f9e684a435cce5d1",
    size: new $__namespace.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeRest._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeRest._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeRest._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeRest._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownType() {
    return $__namespace.utils.disown(this.type);
  }
  get type() {
    return $__namespace.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initType() {
    return $__namespace.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeRest_" + super.toString();
  }
};
var SimpleSerializedType = class _SimpleSerializedType extends $__namespace.Struct {
  static {
    __name(this, "SimpleSerializedType");
  }
  static _capnp = {
    displayName: "SimpleSerializedType",
    id: "80f983e4b811c3ca",
    size: new $__namespace.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SimpleSerializedType._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SimpleSerializedType._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SimpleSerializedType._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SimpleSerializedType._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownOrigin() {
    return $__namespace.utils.disown(this.origin);
  }
  get origin() {
    return $__namespace.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initOrigin() {
    return $__namespace.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set origin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  toString() {
    return "SimpleSerializedType_" + super.toString();
  }
};
var SerializedTypeLiteralSymbol = class extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeLiteralSymbol");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteralSymbol",
    id: "f3dd6a3c6054bd55",
    size: new $__namespace.ObjectSize(0, 2)
  };
  /**
  * "symbol"
  *
  */
  get type() {
    return $__namespace.utils.getText(0, this);
  }
  set type(value) {
    $__namespace.utils.setText(0, value, this);
  }
  get name() {
    return $__namespace.utils.getText(1, this);
  }
  set name(value) {
    $__namespace.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralSymbol_" + super.toString();
  }
};
var SerializedTypeLiteralBigInt = class extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeLiteralBigInt");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteralBigInt",
    id: "821a872d8be30bb2",
    size: new $__namespace.ObjectSize(0, 2)
  };
  /**
  * "bigint"
  *
  */
  get type() {
    return $__namespace.utils.getText(0, this);
  }
  set type(value) {
    $__namespace.utils.setText(0, value, this);
  }
  get value() {
    return $__namespace.utils.getText(1, this);
  }
  set value(value) {
    $__namespace.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralBigInt_" + super.toString();
  }
};
var SerializedTypeLiteralRegex = class extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeLiteralRegex");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteralRegex",
    id: "cc89f97b47927d99",
    size: new $__namespace.ObjectSize(0, 2)
  };
  /**
  * "regex"
  *
  */
  get type() {
    return $__namespace.utils.getText(0, this);
  }
  set type(value) {
    $__namespace.utils.setText(0, value, this);
  }
  get regex() {
    return $__namespace.utils.getText(1, this);
  }
  set regex(value) {
    $__namespace.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralRegex_" + super.toString();
  }
};
var SerializedTypeLiteral_Literal_Which = {
  SYMBOL: 0,
  STRING: 1,
  NUMBER: 2,
  BOOLEAN: 3,
  BIGINT: 4,
  REGEX: 5
};
var SerializedTypeLiteral_Literal = class extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeLiteral_Literal");
  }
  static SYMBOL = SerializedTypeLiteral_Literal_Which.SYMBOL;
  static STRING = SerializedTypeLiteral_Literal_Which.STRING;
  static NUMBER = SerializedTypeLiteral_Literal_Which.NUMBER;
  static BOOLEAN = SerializedTypeLiteral_Literal_Which.BOOLEAN;
  static BIGINT = SerializedTypeLiteral_Literal_Which.BIGINT;
  static REGEX = SerializedTypeLiteral_Literal_Which.REGEX;
  static _capnp = {
    displayName: "literal",
    id: "e4f0538973f3909f",
    size: new $__namespace.ObjectSize(16, 5)
  };
  _adoptSymbol(value) {
    $__namespace.utils.setUint16(2, 0, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownSymbol() {
    return $__namespace.utils.disown(this.symbol);
  }
  get symbol() {
    $__namespace.utils.testWhich("symbol", $__namespace.utils.getUint16(2, this), 0, this);
    return $__namespace.utils.getStruct(4, SerializedTypeLiteralSymbol, this);
  }
  _hasSymbol() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initSymbol() {
    $__namespace.utils.setUint16(2, 0, this);
    return $__namespace.utils.initStructAt(4, SerializedTypeLiteralSymbol, this);
  }
  get _isSymbol() {
    return $__namespace.utils.getUint16(2, this) === 0;
  }
  set symbol(value) {
    $__namespace.utils.setUint16(2, 0, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  get string() {
    $__namespace.utils.testWhich("string", $__namespace.utils.getUint16(2, this), 1, this);
    return $__namespace.utils.getText(4, this);
  }
  get _isString() {
    return $__namespace.utils.getUint16(2, this) === 1;
  }
  set string(value) {
    $__namespace.utils.setUint16(2, 1, this);
    $__namespace.utils.setText(4, value, this);
  }
  get number() {
    $__namespace.utils.testWhich("number", $__namespace.utils.getUint16(2, this), 2, this);
    return $__namespace.utils.getFloat64(8, this);
  }
  get _isNumber() {
    return $__namespace.utils.getUint16(2, this) === 2;
  }
  set number(value) {
    $__namespace.utils.setUint16(2, 2, this);
    $__namespace.utils.setFloat64(8, value, this);
  }
  get boolean() {
    $__namespace.utils.testWhich("boolean", $__namespace.utils.getUint16(2, this), 3, this);
    return $__namespace.utils.getBit(64, this);
  }
  get _isBoolean() {
    return $__namespace.utils.getUint16(2, this) === 3;
  }
  set boolean(value) {
    $__namespace.utils.setUint16(2, 3, this);
    $__namespace.utils.setBit(64, value, this);
  }
  _adoptBigint(value) {
    $__namespace.utils.setUint16(2, 4, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownBigint() {
    return $__namespace.utils.disown(this.bigint);
  }
  get bigint() {
    $__namespace.utils.testWhich("bigint", $__namespace.utils.getUint16(2, this), 4, this);
    return $__namespace.utils.getStruct(4, SerializedTypeLiteralBigInt, this);
  }
  _hasBigint() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initBigint() {
    $__namespace.utils.setUint16(2, 4, this);
    return $__namespace.utils.initStructAt(4, SerializedTypeLiteralBigInt, this);
  }
  get _isBigint() {
    return $__namespace.utils.getUint16(2, this) === 4;
  }
  set bigint(value) {
    $__namespace.utils.setUint16(2, 4, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  _adoptRegex(value) {
    $__namespace.utils.setUint16(2, 5, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownRegex() {
    return $__namespace.utils.disown(this.regex);
  }
  get regex() {
    $__namespace.utils.testWhich("regex", $__namespace.utils.getUint16(2, this), 5, this);
    return $__namespace.utils.getStruct(4, SerializedTypeLiteralRegex, this);
  }
  _hasRegex() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initRegex() {
    $__namespace.utils.setUint16(2, 5, this);
    return $__namespace.utils.initStructAt(4, SerializedTypeLiteralRegex, this);
  }
  get _isRegex() {
    return $__namespace.utils.getUint16(2, this) === 5;
  }
  set regex(value) {
    $__namespace.utils.setUint16(2, 5, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeLiteral_Literal_" + super.toString();
  }
  which() {
    return $__namespace.utils.getUint16(2, this);
  }
};
var SerializedTypeLiteral = class _SerializedTypeLiteral extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeLiteral");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteral",
    id: "b876ba24d27d88c8",
    size: new $__namespace.ObjectSize(16, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeLiteral._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeLiteral._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeLiteral._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeLiteral._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  get literal() {
    return $__namespace.utils.getAs(SerializedTypeLiteral_Literal, this);
  }
  _initLiteral() {
    return $__namespace.utils.getAs(SerializedTypeLiteral_Literal, this);
  }
  toString() {
    return "SerializedTypeLiteral_" + super.toString();
  }
};
var SerializedTypeTemplateLiteral = class _SerializedTypeTemplateLiteral extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeTemplateLiteral");
  }
  static _capnp = {
    displayName: "SerializedTypeTemplateLiteral",
    id: "8dd6c284d46cc265",
    size: new $__namespace.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $__namespace.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $__namespace.utils.getList(1, _SerializedTypeTemplateLiteral._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $__namespace.utils.initList(1, _SerializedTypeTemplateLiteral._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $__namespace.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $__namespace.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $__namespace.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $__namespace.utils.disown(this.decorators);
  }
  get decorators() {
    return $__namespace.utils.getList(3, _SerializedTypeTemplateLiteral._Decorators, this);
  }
  _hasDecorators() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $__namespace.utils.initList(3, _SerializedTypeTemplateLiteral._Decorators, length, this);
  }
  set decorators(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(3, this));
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $__namespace.utils.disown(this.types);
  }
  get types() {
    return $__namespace.utils.getList(4, _SerializedTypeTemplateLiteral._Types, this);
  }
  _hasTypes() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $__namespace.utils.initList(4, _SerializedTypeTemplateLiteral._Types, length, this);
  }
  set types(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeTemplateLiteral_" + super.toString();
  }
};
var SerializedTypeOther = class extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypeOther");
  }
  static _capnp = {
    displayName: "SerializedTypeOther",
    id: "9e1048a692ff49ce",
    size: new $__namespace.ObjectSize(8, 1)
  };
  get typeName() {
    return $__namespace.utils.getText(0, this);
  }
  set typeName(value) {
    $__namespace.utils.setText(0, value, this);
  }
  get kind() {
    return $__namespace.utils.getUint16(0, this);
  }
  set kind(value) {
    $__namespace.utils.setUint16(0, value, this);
  }
  toString() {
    return "SerializedTypeOther_" + super.toString();
  }
};
var SerializedType_Type_Which = {
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
  /**
  * For any other type that is not explicitly defined
  *
  */
  OTHER: 22
};
var SerializedType_Type = class extends $__namespace.Struct {
  static {
    __name(this, "SerializedType_Type");
  }
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
    size: new $__namespace.ObjectSize(8, 1)
  };
  _adoptSimple(value) {
    $__namespace.utils.setUint16(0, 0, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownSimple() {
    return $__namespace.utils.disown(this.simple);
  }
  get simple() {
    $__namespace.utils.testWhich("simple", $__namespace.utils.getUint16(0, this), 0, this);
    return $__namespace.utils.getStruct(0, SimpleSerializedType, this);
  }
  _hasSimple() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initSimple() {
    $__namespace.utils.setUint16(0, 0, this);
    return $__namespace.utils.initStructAt(0, SimpleSerializedType, this);
  }
  get _isSimple() {
    return $__namespace.utils.getUint16(0, this) === 0;
  }
  set simple(value) {
    $__namespace.utils.setUint16(0, 0, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptLiteral(value) {
    $__namespace.utils.setUint16(0, 1, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownLiteral() {
    return $__namespace.utils.disown(this.literal);
  }
  get literal() {
    $__namespace.utils.testWhich("literal", $__namespace.utils.getUint16(0, this), 1, this);
    return $__namespace.utils.getStruct(0, SerializedTypeLiteral, this);
  }
  _hasLiteral() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initLiteral() {
    $__namespace.utils.setUint16(0, 1, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeLiteral, this);
  }
  get _isLiteral() {
    return $__namespace.utils.getUint16(0, this) === 1;
  }
  set literal(value) {
    $__namespace.utils.setUint16(0, 1, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptTemplateLiteral(value) {
    $__namespace.utils.setUint16(0, 2, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownTemplateLiteral() {
    return $__namespace.utils.disown(this.templateLiteral);
  }
  get templateLiteral() {
    $__namespace.utils.testWhich("templateLiteral", $__namespace.utils.getUint16(0, this), 2, this);
    return $__namespace.utils.getStruct(0, SerializedTypeTemplateLiteral, this);
  }
  _hasTemplateLiteral() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initTemplateLiteral() {
    $__namespace.utils.setUint16(0, 2, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeTemplateLiteral, this);
  }
  get _isTemplateLiteral() {
    return $__namespace.utils.getUint16(0, this) === 2;
  }
  set templateLiteral(value) {
    $__namespace.utils.setUint16(0, 2, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptParameter(value) {
    $__namespace.utils.setUint16(0, 3, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownParameter() {
    return $__namespace.utils.disown(this.parameter);
  }
  get parameter() {
    $__namespace.utils.testWhich("parameter", $__namespace.utils.getUint16(0, this), 3, this);
    return $__namespace.utils.getStruct(0, SerializedTypeParameter, this);
  }
  _hasParameter() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initParameter() {
    $__namespace.utils.setUint16(0, 3, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeParameter, this);
  }
  get _isParameter() {
    return $__namespace.utils.getUint16(0, this) === 3;
  }
  set parameter(value) {
    $__namespace.utils.setUint16(0, 3, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptFunction(value) {
    $__namespace.utils.setUint16(0, 4, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownFunction() {
    return $__namespace.utils.disown(this.function);
  }
  get function() {
    $__namespace.utils.testWhich("function", $__namespace.utils.getUint16(0, this), 4, this);
    return $__namespace.utils.getStruct(0, SerializedTypeFunction, this);
  }
  _hasFunction() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initFunction() {
    $__namespace.utils.setUint16(0, 4, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeFunction, this);
  }
  get _isFunction() {
    return $__namespace.utils.getUint16(0, this) === 4;
  }
  set function(value) {
    $__namespace.utils.setUint16(0, 4, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptMethod(value) {
    $__namespace.utils.setUint16(0, 5, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownMethod() {
    return $__namespace.utils.disown(this.method);
  }
  get method() {
    $__namespace.utils.testWhich("method", $__namespace.utils.getUint16(0, this), 5, this);
    return $__namespace.utils.getStruct(0, SerializedTypeMethod, this);
  }
  _hasMethod() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initMethod() {
    $__namespace.utils.setUint16(0, 5, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeMethod, this);
  }
  get _isMethod() {
    return $__namespace.utils.getUint16(0, this) === 5;
  }
  set method(value) {
    $__namespace.utils.setUint16(0, 5, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptProperty(value) {
    $__namespace.utils.setUint16(0, 6, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownProperty() {
    return $__namespace.utils.disown(this.property);
  }
  get property() {
    $__namespace.utils.testWhich("property", $__namespace.utils.getUint16(0, this), 6, this);
    return $__namespace.utils.getStruct(0, SerializedTypeProperty, this);
  }
  _hasProperty() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initProperty() {
    $__namespace.utils.setUint16(0, 6, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeProperty, this);
  }
  get _isProperty() {
    return $__namespace.utils.getUint16(0, this) === 6;
  }
  set property(value) {
    $__namespace.utils.setUint16(0, 6, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptPromise(value) {
    $__namespace.utils.setUint16(0, 7, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownPromise() {
    return $__namespace.utils.disown(this.promise);
  }
  get promise() {
    $__namespace.utils.testWhich("promise", $__namespace.utils.getUint16(0, this), 7, this);
    return $__namespace.utils.getStruct(0, SerializedTypePromise, this);
  }
  _hasPromise() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initPromise() {
    $__namespace.utils.setUint16(0, 7, this);
    return $__namespace.utils.initStructAt(0, SerializedTypePromise, this);
  }
  get _isPromise() {
    return $__namespace.utils.getUint16(0, this) === 7;
  }
  set promise(value) {
    $__namespace.utils.setUint16(0, 7, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptClassType(value) {
    $__namespace.utils.setUint16(0, 8, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownClassType() {
    return $__namespace.utils.disown(this.classType);
  }
  get classType() {
    $__namespace.utils.testWhich("classType", $__namespace.utils.getUint16(0, this), 8, this);
    return $__namespace.utils.getStruct(0, SerializedTypeClassType, this);
  }
  _hasClassType() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initClassType() {
    $__namespace.utils.setUint16(0, 8, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeClassType, this);
  }
  get _isClassType() {
    return $__namespace.utils.getUint16(0, this) === 8;
  }
  set classType(value) {
    $__namespace.utils.setUint16(0, 8, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptEnum(value) {
    $__namespace.utils.setUint16(0, 9, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownEnum() {
    return $__namespace.utils.disown(this.enum);
  }
  get enum() {
    $__namespace.utils.testWhich("enum", $__namespace.utils.getUint16(0, this), 9, this);
    return $__namespace.utils.getStruct(0, SerializedTypeEnum, this);
  }
  _hasEnum() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initEnum() {
    $__namespace.utils.setUint16(0, 9, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeEnum, this);
  }
  get _isEnum() {
    return $__namespace.utils.getUint16(0, this) === 9;
  }
  set enum(value) {
    $__namespace.utils.setUint16(0, 9, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptUnion(value) {
    $__namespace.utils.setUint16(0, 10, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownUnion() {
    return $__namespace.utils.disown(this.union);
  }
  get union() {
    $__namespace.utils.testWhich("union", $__namespace.utils.getUint16(0, this), 10, this);
    return $__namespace.utils.getStruct(0, SerializedTypeUnion, this);
  }
  _hasUnion() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initUnion() {
    $__namespace.utils.setUint16(0, 10, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeUnion, this);
  }
  get _isUnion() {
    return $__namespace.utils.getUint16(0, this) === 10;
  }
  set union(value) {
    $__namespace.utils.setUint16(0, 10, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptIntersection(value) {
    $__namespace.utils.setUint16(0, 11, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownIntersection() {
    return $__namespace.utils.disown(this.intersection);
  }
  get intersection() {
    $__namespace.utils.testWhich("intersection", $__namespace.utils.getUint16(0, this), 11, this);
    return $__namespace.utils.getStruct(0, SerializedTypeIntersection, this);
  }
  _hasIntersection() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initIntersection() {
    $__namespace.utils.setUint16(0, 11, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeIntersection, this);
  }
  get _isIntersection() {
    return $__namespace.utils.getUint16(0, this) === 11;
  }
  set intersection(value) {
    $__namespace.utils.setUint16(0, 11, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptArray(value) {
    $__namespace.utils.setUint16(0, 12, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownArray() {
    return $__namespace.utils.disown(this.array);
  }
  get array() {
    $__namespace.utils.testWhich("array", $__namespace.utils.getUint16(0, this), 12, this);
    return $__namespace.utils.getStruct(0, SerializedTypeArray, this);
  }
  _hasArray() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initArray() {
    $__namespace.utils.setUint16(0, 12, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeArray, this);
  }
  get _isArray() {
    return $__namespace.utils.getUint16(0, this) === 12;
  }
  set array(value) {
    $__namespace.utils.setUint16(0, 12, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptObjectLiteral(value) {
    $__namespace.utils.setUint16(0, 13, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownObjectLiteral() {
    return $__namespace.utils.disown(this.objectLiteral);
  }
  get objectLiteral() {
    $__namespace.utils.testWhich("objectLiteral", $__namespace.utils.getUint16(0, this), 13, this);
    return $__namespace.utils.getStruct(0, SerializedTypeObjectLiteral, this);
  }
  _hasObjectLiteral() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initObjectLiteral() {
    $__namespace.utils.setUint16(0, 13, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeObjectLiteral, this);
  }
  get _isObjectLiteral() {
    return $__namespace.utils.getUint16(0, this) === 13;
  }
  set objectLiteral(value) {
    $__namespace.utils.setUint16(0, 13, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptIndexSignature(value) {
    $__namespace.utils.setUint16(0, 14, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownIndexSignature() {
    return $__namespace.utils.disown(this.indexSignature);
  }
  get indexSignature() {
    $__namespace.utils.testWhich("indexSignature", $__namespace.utils.getUint16(0, this), 14, this);
    return $__namespace.utils.getStruct(0, SerializedTypeIndexSignature, this);
  }
  _hasIndexSignature() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initIndexSignature() {
    $__namespace.utils.setUint16(0, 14, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeIndexSignature, this);
  }
  get _isIndexSignature() {
    return $__namespace.utils.getUint16(0, this) === 14;
  }
  set indexSignature(value) {
    $__namespace.utils.setUint16(0, 14, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptPropertySignature(value) {
    $__namespace.utils.setUint16(0, 15, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownPropertySignature() {
    return $__namespace.utils.disown(this.propertySignature);
  }
  get propertySignature() {
    $__namespace.utils.testWhich("propertySignature", $__namespace.utils.getUint16(0, this), 15, this);
    return $__namespace.utils.getStruct(0, SerializedTypePropertySignature, this);
  }
  _hasPropertySignature() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initPropertySignature() {
    $__namespace.utils.setUint16(0, 15, this);
    return $__namespace.utils.initStructAt(0, SerializedTypePropertySignature, this);
  }
  get _isPropertySignature() {
    return $__namespace.utils.getUint16(0, this) === 15;
  }
  set propertySignature(value) {
    $__namespace.utils.setUint16(0, 15, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptMethodSignature(value) {
    $__namespace.utils.setUint16(0, 16, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownMethodSignature() {
    return $__namespace.utils.disown(this.methodSignature);
  }
  get methodSignature() {
    $__namespace.utils.testWhich("methodSignature", $__namespace.utils.getUint16(0, this), 16, this);
    return $__namespace.utils.getStruct(0, SerializedTypeMethodSignature, this);
  }
  _hasMethodSignature() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initMethodSignature() {
    $__namespace.utils.setUint16(0, 16, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeMethodSignature, this);
  }
  get _isMethodSignature() {
    return $__namespace.utils.getUint16(0, this) === 16;
  }
  set methodSignature(value) {
    $__namespace.utils.setUint16(0, 16, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptTypeParameter(value) {
    $__namespace.utils.setUint16(0, 17, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownTypeParameter() {
    return $__namespace.utils.disown(this.typeParameter);
  }
  get typeParameter() {
    $__namespace.utils.testWhich("typeParameter", $__namespace.utils.getUint16(0, this), 17, this);
    return $__namespace.utils.getStruct(0, SerializedTypeTypeParameter, this);
  }
  _hasTypeParameter() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initTypeParameter() {
    $__namespace.utils.setUint16(0, 17, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeTypeParameter, this);
  }
  get _isTypeParameter() {
    return $__namespace.utils.getUint16(0, this) === 17;
  }
  set typeParameter(value) {
    $__namespace.utils.setUint16(0, 17, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptInfer(value) {
    $__namespace.utils.setUint16(0, 18, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownInfer() {
    return $__namespace.utils.disown(this.infer);
  }
  get infer() {
    $__namespace.utils.testWhich("infer", $__namespace.utils.getUint16(0, this), 18, this);
    return $__namespace.utils.getStruct(0, SerializedTypeInfer, this);
  }
  _hasInfer() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initInfer() {
    $__namespace.utils.setUint16(0, 18, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeInfer, this);
  }
  get _isInfer() {
    return $__namespace.utils.getUint16(0, this) === 18;
  }
  set infer(value) {
    $__namespace.utils.setUint16(0, 18, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptTuple(value) {
    $__namespace.utils.setUint16(0, 19, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownTuple() {
    return $__namespace.utils.disown(this.tuple);
  }
  get tuple() {
    $__namespace.utils.testWhich("tuple", $__namespace.utils.getUint16(0, this), 19, this);
    return $__namespace.utils.getStruct(0, SerializedTypeTuple, this);
  }
  _hasTuple() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initTuple() {
    $__namespace.utils.setUint16(0, 19, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeTuple, this);
  }
  get _isTuple() {
    return $__namespace.utils.getUint16(0, this) === 19;
  }
  set tuple(value) {
    $__namespace.utils.setUint16(0, 19, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptTupleMember(value) {
    $__namespace.utils.setUint16(0, 20, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownTupleMember() {
    return $__namespace.utils.disown(this.tupleMember);
  }
  get tupleMember() {
    $__namespace.utils.testWhich("tupleMember", $__namespace.utils.getUint16(0, this), 20, this);
    return $__namespace.utils.getStruct(0, SerializedTypeTupleMember, this);
  }
  _hasTupleMember() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initTupleMember() {
    $__namespace.utils.setUint16(0, 20, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeTupleMember, this);
  }
  get _isTupleMember() {
    return $__namespace.utils.getUint16(0, this) === 20;
  }
  set tupleMember(value) {
    $__namespace.utils.setUint16(0, 20, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptRest(value) {
    $__namespace.utils.setUint16(0, 21, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownRest() {
    return $__namespace.utils.disown(this.rest);
  }
  get rest() {
    $__namespace.utils.testWhich("rest", $__namespace.utils.getUint16(0, this), 21, this);
    return $__namespace.utils.getStruct(0, SerializedTypeRest, this);
  }
  _hasRest() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initRest() {
    $__namespace.utils.setUint16(0, 21, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeRest, this);
  }
  get _isRest() {
    return $__namespace.utils.getUint16(0, this) === 21;
  }
  set rest(value) {
    $__namespace.utils.setUint16(0, 21, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  _adoptOther(value) {
    $__namespace.utils.setUint16(0, 22, this);
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownOther() {
    return $__namespace.utils.disown(this.other);
  }
  /**
  * For any other type that is not explicitly defined
  *
  */
  get other() {
    $__namespace.utils.testWhich("other", $__namespace.utils.getUint16(0, this), 22, this);
    return $__namespace.utils.getStruct(0, SerializedTypeOther, this);
  }
  _hasOther() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initOther() {
    $__namespace.utils.setUint16(0, 22, this);
    return $__namespace.utils.initStructAt(0, SerializedTypeOther, this);
  }
  get _isOther() {
    return $__namespace.utils.getUint16(0, this) === 22;
  }
  set other(value) {
    $__namespace.utils.setUint16(0, 22, this);
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  toString() {
    return "SerializedType_Type_" + super.toString();
  }
  which() {
    return $__namespace.utils.getUint16(0, this);
  }
};
var SerializedType = class extends $__namespace.Struct {
  static {
    __name(this, "SerializedType");
  }
  static _capnp = {
    displayName: "SerializedType",
    id: "96856dcc2dd3d58f",
    size: new $__namespace.ObjectSize(8, 1)
  };
  get type() {
    return $__namespace.utils.getAs(SerializedType_Type, this);
  }
  _initType() {
    return $__namespace.utils.getAs(SerializedType_Type, this);
  }
  toString() {
    return "SerializedType_" + super.toString();
  }
};
var SerializedTypes = class _SerializedTypes extends $__namespace.Struct {
  static {
    __name(this, "SerializedTypes");
  }
  static _capnp = {
    displayName: "SerializedTypes",
    id: "ac55398ab0ef4958",
    size: new $__namespace.ObjectSize(0, 1)
  };
  static _Types;
  _adoptTypes(value) {
    $__namespace.utils.adopt(value, $__namespace.utils.getPointer(0, this));
  }
  _disownTypes() {
    return $__namespace.utils.disown(this.types);
  }
  get types() {
    return $__namespace.utils.getList(0, _SerializedTypes._Types, this);
  }
  _hasTypes() {
    return !$__namespace.utils.isNull($__namespace.utils.getPointer(0, this));
  }
  _initTypes(length) {
    return $__namespace.utils.initList(0, _SerializedTypes._Types, length, this);
  }
  set types(value) {
    $__namespace.utils.copyFrom(value, $__namespace.utils.getPointer(0, this));
  }
  toString() {
    return "SerializedTypes_" + super.toString();
  }
};
EntityOptions._Indexes = $__namespace.CompositeList(EntityOptions_EntityIndexOptions);
SerializedTypeObjectLiteral._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeObjectLiteral._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeObjectLiteral._Types = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeClassType._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeClassType._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeClassType._ExtendsArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeClassType._Arguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeClassType._Types = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeParameter._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeParameter._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeMethod._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeMethod._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeMethod._Parameters = $__namespace.CompositeList(SerializedTypeParameter);
SerializedTypeProperty._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeProperty._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeFunction._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeFunction._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeFunction._Parameters = $__namespace.CompositeList(SerializedTypeParameter);
SerializedTypePromise._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypePromise._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeEnum._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeEnum._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeEnum._EnumEntries = $__namespace.CompositeList(SerializedTypeEnumEntry);
SerializedTypeUnion._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeUnion._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeUnion._Types = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeIntersection._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeIntersection._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeIntersection._Types = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeArray._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeArray._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeIndexSignature._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeIndexSignature._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypePropertySignature._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypePropertySignature._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeMethodSignature._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeMethodSignature._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeMethodSignature._Parameters = $__namespace.CompositeList(SerializedTypeParameter);
SerializedTypeTypeParameter._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeTypeParameter._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeInfer._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeInfer._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeTupleMember._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeTupleMember._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeTuple._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeTuple._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeTuple._Types = $__namespace.CompositeList(SerializedTypeTupleMember);
SerializedTypeRest._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeRest._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SimpleSerializedType._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SimpleSerializedType._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeLiteral._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeLiteral._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeTemplateLiteral._TypeArguments = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeTemplateLiteral._Decorators = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypeTemplateLiteral._Types = $__namespace.CompositeList(SerializedTypeReference);
SerializedTypes._Types = $__namespace.CompositeList(SerializedType);

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
exports.SerializedTypeLiteral_Literal_Which = SerializedTypeLiteral_Literal_Which;
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
