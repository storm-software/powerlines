import * as $ from '@stryke/capnp';

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
var TagsReflection = class extends $.Struct {
  static {
    __name(this, "TagsReflection");
  }
  static _capnp = {
    displayName: "TagsReflection",
    id: "ab7e31d6b834bbf8",
    size: new $.ObjectSize(8, 4)
  };
  _adoptAlias(value) {
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownAlias() {
    return $.utils.disown(this.alias);
  }
  get alias() {
    return $.utils.getList(0, $.TextList, this);
  }
  _hasAlias() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initAlias(length) {
    return $.utils.initList(0, $.TextList, length, this);
  }
  set alias(value) {
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  get title() {
    return $.utils.getText(1, this);
  }
  set title(value) {
    $.utils.setText(1, value, this);
  }
  get hidden() {
    return $.utils.getBit(0, this);
  }
  set hidden(value) {
    $.utils.setBit(0, value, this);
  }
  get readonly() {
    return $.utils.getBit(1, this);
  }
  set readonly(value) {
    $.utils.setBit(1, value, this);
  }
  get ignore() {
    return $.utils.getBit(2, this);
  }
  set ignore(value) {
    $.utils.setBit(2, value, this);
  }
  get internal() {
    return $.utils.getBit(3, this);
  }
  set internal(value) {
    $.utils.setBit(3, value, this);
  }
  _adoptPermission(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownPermission() {
    return $.utils.disown(this.permission);
  }
  get permission() {
    return $.utils.getList(2, $.TextList, this);
  }
  _hasPermission() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initPermission(length) {
    return $.utils.initList(2, $.TextList, length, this);
  }
  set permission(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  get domain() {
    return $.utils.getText(3, this);
  }
  set domain(value) {
    $.utils.setText(3, value, this);
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
var DefaultValueReflection_Value = class extends $.Struct {
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
    size: new $.ObjectSize(16, 1)
  };
  get _isUndefined() {
    return $.utils.getUint16(0, this) === 0;
  }
  set undefined(_) {
    $.utils.setUint16(0, 0, this);
  }
  get boolean() {
    $.utils.testWhich("boolean", $.utils.getUint16(0, this), 1, this);
    return $.utils.getBit(16, this);
  }
  get _isBoolean() {
    return $.utils.getUint16(0, this) === 1;
  }
  set boolean(value) {
    $.utils.setUint16(0, 1, this);
    $.utils.setBit(16, value, this);
  }
  get integer() {
    $.utils.testWhich("integer", $.utils.getUint16(0, this), 2, this);
    return $.utils.getInt32(4, this);
  }
  get _isInteger() {
    return $.utils.getUint16(0, this) === 2;
  }
  set integer(value) {
    $.utils.setUint16(0, 2, this);
    $.utils.setInt32(4, value, this);
  }
  get float() {
    $.utils.testWhich("float", $.utils.getUint16(0, this), 3, this);
    return $.utils.getFloat64(8, this);
  }
  get _isFloat() {
    return $.utils.getUint16(0, this) === 3;
  }
  set float(value) {
    $.utils.setUint16(0, 3, this);
    $.utils.setFloat64(8, value, this);
  }
  get string() {
    $.utils.testWhich("string", $.utils.getUint16(0, this), 4, this);
    return $.utils.getText(0, this);
  }
  get _isString() {
    return $.utils.getUint16(0, this) === 4;
  }
  set string(value) {
    $.utils.setUint16(0, 4, this);
    $.utils.setText(0, value, this);
  }
  toString() {
    return "DefaultValueReflection_Value_" + super.toString();
  }
  which() {
    return $.utils.getUint16(0, this);
  }
};
var DefaultValueReflection = class extends $.Struct {
  static {
    __name(this, "DefaultValueReflection");
  }
  static _capnp = {
    displayName: "DefaultValueReflection",
    id: "96fe6f07954197c9",
    size: new $.ObjectSize(16, 1)
  };
  get value() {
    return $.utils.getAs(DefaultValueReflection_Value, this);
  }
  _initValue() {
    return $.utils.getAs(DefaultValueReflection_Value, this);
  }
  toString() {
    return "DefaultValueReflection_" + super.toString();
  }
};
var SerializedTypeReference = class extends $.Struct {
  static {
    __name(this, "SerializedTypeReference");
  }
  static _capnp = {
    displayName: "SerializedTypeReference",
    id: "a83d8a28b5e80f3a",
    size: new $.ObjectSize(8, 0)
  };
  get id() {
    return $.utils.getUint32(0, this);
  }
  set id(value) {
    $.utils.setUint32(0, value, this);
  }
  toString() {
    return "SerializedTypeReference_" + super.toString();
  }
};
var IndexAccessOrigin = class extends $.Struct {
  static {
    __name(this, "IndexAccessOrigin");
  }
  static _capnp = {
    displayName: "IndexAccessOrigin",
    id: "ca50b18186c87afe",
    size: new $.ObjectSize(0, 2)
  };
  _adoptContainer(value) {
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownContainer() {
    return $.utils.disown(this.container);
  }
  get container() {
    return $.utils.getStruct(0, SerializedTypeReference, this);
  }
  _hasContainer() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initContainer() {
    return $.utils.initStructAt(0, SerializedTypeReference, this);
  }
  set container(value) {
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptIndex(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownIndex() {
    return $.utils.disown(this.index);
  }
  get index() {
    return $.utils.getStruct(1, SerializedTypeReference, this);
  }
  _hasIndex() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initIndex() {
    return $.utils.initStructAt(1, SerializedTypeReference, this);
  }
  set index(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  toString() {
    return "IndexAccessOrigin_" + super.toString();
  }
};
var EntityOptions_EntityIndexOptions = class extends $.Struct {
  static {
    __name(this, "EntityOptions_EntityIndexOptions");
  }
  static _capnp = {
    displayName: "EntityIndexOptions",
    id: "de584ad10b7c5004",
    size: new $.ObjectSize(0, 2)
  };
  _adoptNames(value) {
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownNames() {
    return $.utils.disown(this.names);
  }
  get names() {
    return $.utils.getList(0, $.TextList, this);
  }
  _hasNames() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initNames(length) {
    return $.utils.initList(0, $.TextList, length, this);
  }
  set names(value) {
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  /**
  * JSON stringified options
  *
  */
  get options() {
    return $.utils.getText(1, this);
  }
  set options(value) {
    $.utils.setText(1, value, this);
  }
  toString() {
    return "EntityOptions_EntityIndexOptions_" + super.toString();
  }
};
var EntityOptions = class _EntityOptions extends $.Struct {
  static {
    __name(this, "EntityOptions");
  }
  static EntityIndexOptions = EntityOptions_EntityIndexOptions;
  static _capnp = {
    displayName: "EntityOptions",
    id: "948d2d02cf676d60",
    size: new $.ObjectSize(8, 5)
  };
  static _Indexes;
  get name() {
    return $.utils.getText(0, this);
  }
  set name(value) {
    $.utils.setText(0, value, this);
  }
  get description() {
    return $.utils.getText(1, this);
  }
  set description(value) {
    $.utils.setText(1, value, this);
  }
  get collection() {
    return $.utils.getText(2, this);
  }
  set collection(value) {
    $.utils.setText(2, value, this);
  }
  get database() {
    return $.utils.getText(3, this);
  }
  set database(value) {
    $.utils.setText(3, value, this);
  }
  get singleTableInheritance() {
    return $.utils.getBit(0, this);
  }
  set singleTableInheritance(value) {
    $.utils.setBit(0, value, this);
  }
  _adoptIndexes(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownIndexes() {
    return $.utils.disown(this.indexes);
  }
  get indexes() {
    return $.utils.getList(4, _EntityOptions._Indexes, this);
  }
  _hasIndexes() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initIndexes(length) {
    return $.utils.initList(4, _EntityOptions._Indexes, length, this);
  }
  set indexes(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  toString() {
    return "EntityOptions_" + super.toString();
  }
};
var SerializedTypeObjectLiteral = class _SerializedTypeObjectLiteral extends $.Struct {
  static {
    __name(this, "SerializedTypeObjectLiteral");
  }
  static _capnp = {
    displayName: "SerializedTypeObjectLiteral",
    id: "8b56235ad9bcb2b1",
    size: new $.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeObjectLiteral._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeObjectLiteral._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeObjectLiteral._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeObjectLiteral._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $.utils.disown(this.types);
  }
  get types() {
    return $.utils.getList(4, _SerializedTypeObjectLiteral._Types, this);
  }
  _hasTypes() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $.utils.initList(4, _SerializedTypeObjectLiteral._Types, length, this);
  }
  set types(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(5, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(5, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(5, this));
  }
  _initTags() {
    return $.utils.initStructAt(5, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(5, this));
  }
  toString() {
    return "SerializedTypeObjectLiteral_" + super.toString();
  }
};
var SerializedTypeClassType = class _SerializedTypeClassType extends $.Struct {
  static {
    __name(this, "SerializedTypeClassType");
  }
  static _capnp = {
    displayName: "SerializedTypeClassType",
    id: "9855392bf9c48b25",
    size: new $.ObjectSize(8, 11)
  };
  static _TypeArguments;
  static _Decorators;
  static _ExtendsArguments;
  static _Arguments;
  static _Types;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeClassType._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeClassType._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeClassType._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeClassType._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  get name() {
    return $.utils.getText(4, this);
  }
  set name(value) {
    $.utils.setText(4, value, this);
  }
  get globalObject() {
    return $.utils.getBit(16, this);
  }
  set globalObject(value) {
    $.utils.setBit(16, value, this);
  }
  get classType() {
    return $.utils.getText(5, this);
  }
  set classType(value) {
    $.utils.setText(5, value, this);
  }
  _adoptExtendsArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(6, this));
  }
  _disownExtendsArguments() {
    return $.utils.disown(this.extendsArguments);
  }
  get extendsArguments() {
    return $.utils.getList(6, _SerializedTypeClassType._ExtendsArguments, this);
  }
  _hasExtendsArguments() {
    return !$.utils.isNull($.utils.getPointer(6, this));
  }
  _initExtendsArguments(length) {
    return $.utils.initList(6, _SerializedTypeClassType._ExtendsArguments, length, this);
  }
  set extendsArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(6, this));
  }
  _adoptArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(7, this));
  }
  _disownArguments() {
    return $.utils.disown(this.arguments);
  }
  get arguments() {
    return $.utils.getList(7, _SerializedTypeClassType._Arguments, this);
  }
  _hasArguments() {
    return !$.utils.isNull($.utils.getPointer(7, this));
  }
  _initArguments(length) {
    return $.utils.initList(7, _SerializedTypeClassType._Arguments, length, this);
  }
  set arguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(7, this));
  }
  _adoptSuperClass(value) {
    $.utils.adopt(value, $.utils.getPointer(8, this));
  }
  _disownSuperClass() {
    return $.utils.disown(this.superClass);
  }
  get superClass() {
    return $.utils.getStruct(8, SerializedTypeReference, this);
  }
  _hasSuperClass() {
    return !$.utils.isNull($.utils.getPointer(8, this));
  }
  _initSuperClass() {
    return $.utils.initStructAt(8, SerializedTypeReference, this);
  }
  set superClass(value) {
    $.utils.copyFrom(value, $.utils.getPointer(8, this));
  }
  _adoptTypes(value) {
    $.utils.adopt(value, $.utils.getPointer(9, this));
  }
  _disownTypes() {
    return $.utils.disown(this.types);
  }
  get types() {
    return $.utils.getList(9, _SerializedTypeClassType._Types, this);
  }
  _hasTypes() {
    return !$.utils.isNull($.utils.getPointer(9, this));
  }
  _initTypes(length) {
    return $.utils.initList(9, _SerializedTypeClassType._Types, length, this);
  }
  set types(value) {
    $.utils.copyFrom(value, $.utils.getPointer(9, this));
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(10, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(10, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(10, this));
  }
  _initTags() {
    return $.utils.initStructAt(10, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(10, this));
  }
  toString() {
    return "SerializedTypeClassType_" + super.toString();
  }
};
var SerializedTypeParameter = class _SerializedTypeParameter extends $.Struct {
  static {
    __name(this, "SerializedTypeParameter");
  }
  static _capnp = {
    displayName: "SerializedTypeParameter",
    id: "fcbaa08bb97b8b1a",
    size: new $.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeParameter._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeParameter._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeParameter._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeParameter._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  get name() {
    return $.utils.getText(4, this);
  }
  set name(value) {
    $.utils.setText(4, value, this);
  }
  _adoptType(value) {
    $.utils.adopt(value, $.utils.getPointer(5, this));
  }
  _disownType() {
    return $.utils.disown(this.type);
  }
  get type() {
    return $.utils.getStruct(5, SerializedTypeReference, this);
  }
  _hasType() {
    return !$.utils.isNull($.utils.getPointer(5, this));
  }
  _initType() {
    return $.utils.initStructAt(5, SerializedTypeReference, this);
  }
  set type(value) {
    $.utils.copyFrom(value, $.utils.getPointer(5, this));
  }
  get visibility() {
    return $.utils.getUint16(2, this);
  }
  set visibility(value) {
    $.utils.setUint16(2, value, this);
  }
  get readonly() {
    return $.utils.getBit(32, this);
  }
  set readonly(value) {
    $.utils.setBit(32, value, this);
  }
  get optional() {
    return $.utils.getBit(33, this);
  }
  set optional(value) {
    $.utils.setBit(33, value, this);
  }
  _adoptDefault(value) {
    $.utils.adopt(value, $.utils.getPointer(6, this));
  }
  _disownDefault() {
    return $.utils.disown(this.default);
  }
  get default() {
    return $.utils.getStruct(6, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !$.utils.isNull($.utils.getPointer(6, this));
  }
  _initDefault() {
    return $.utils.initStructAt(6, DefaultValueReflection, this);
  }
  set default(value) {
    $.utils.copyFrom(value, $.utils.getPointer(6, this));
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(7, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(7, this));
  }
  _initTags() {
    return $.utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeParameter_" + super.toString();
  }
};
var SerializedTypeMethod = class _SerializedTypeMethod extends $.Struct {
  static {
    __name(this, "SerializedTypeMethod");
  }
  static _capnp = {
    displayName: "SerializedTypeMethod",
    id: "8b5eff6d9ec2fb06",
    size: new $.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeMethod._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeMethod._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeMethod._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeMethod._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get visibility() {
    return $.utils.getUint16(0, this);
  }
  set visibility(value) {
    $.utils.setUint16(0, value, this);
  }
  get abstract() {
    return $.utils.getBit(16, this);
  }
  set abstract(value) {
    $.utils.setBit(16, value, this);
  }
  get optional() {
    return $.utils.getBit(17, this);
  }
  set optional(value) {
    $.utils.setBit(17, value, this);
  }
  get readonly() {
    return $.utils.getBit(18, this);
  }
  set readonly(value) {
    $.utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initTags() {
    return $.utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  get kind() {
    return $.utils.getUint16(4, this);
  }
  set kind(value) {
    $.utils.setUint16(4, value, this);
  }
  get name() {
    return $.utils.getText(5, this);
  }
  set name(value) {
    $.utils.setText(5, value, this);
  }
  _adoptParameters(value) {
    $.utils.adopt(value, $.utils.getPointer(6, this));
  }
  _disownParameters() {
    return $.utils.disown(this.parameters);
  }
  get parameters() {
    return $.utils.getList(6, _SerializedTypeMethod._Parameters, this);
  }
  _hasParameters() {
    return !$.utils.isNull($.utils.getPointer(6, this));
  }
  _initParameters(length) {
    return $.utils.initList(6, _SerializedTypeMethod._Parameters, length, this);
  }
  set parameters(value) {
    $.utils.copyFrom(value, $.utils.getPointer(6, this));
  }
  _adoptReturn(value) {
    $.utils.adopt(value, $.utils.getPointer(7, this));
  }
  _disownReturn() {
    return $.utils.disown(this.return);
  }
  get return() {
    return $.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !$.utils.isNull($.utils.getPointer(7, this));
  }
  _initReturn() {
    return $.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set return(value) {
    $.utils.copyFrom(value, $.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeMethod_" + super.toString();
  }
};
var SerializedTypeProperty = class _SerializedTypeProperty extends $.Struct {
  static {
    __name(this, "SerializedTypeProperty");
  }
  static _capnp = {
    displayName: "SerializedTypeProperty",
    id: "91d9dbea2037f78b",
    size: new $.ObjectSize(8, 9)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeProperty._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeProperty._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeProperty._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeProperty._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get visibility() {
    return $.utils.getUint16(0, this);
  }
  set visibility(value) {
    $.utils.setUint16(0, value, this);
  }
  get abstract() {
    return $.utils.getBit(16, this);
  }
  set abstract(value) {
    $.utils.setBit(16, value, this);
  }
  get optional() {
    return $.utils.getBit(17, this);
  }
  set optional(value) {
    $.utils.setBit(17, value, this);
  }
  get readonly() {
    return $.utils.getBit(18, this);
  }
  set readonly(value) {
    $.utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initTags() {
    return $.utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  get kind() {
    return $.utils.getUint16(4, this);
  }
  set kind(value) {
    $.utils.setUint16(4, value, this);
  }
  get name() {
    return $.utils.getText(5, this);
  }
  set name(value) {
    $.utils.setText(5, value, this);
  }
  get description() {
    return $.utils.getText(6, this);
  }
  set description(value) {
    $.utils.setText(6, value, this);
  }
  _adoptType(value) {
    $.utils.adopt(value, $.utils.getPointer(7, this));
  }
  _disownType() {
    return $.utils.disown(this.type);
  }
  get type() {
    return $.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasType() {
    return !$.utils.isNull($.utils.getPointer(7, this));
  }
  _initType() {
    return $.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set type(value) {
    $.utils.copyFrom(value, $.utils.getPointer(7, this));
  }
  _adoptDefault(value) {
    $.utils.adopt(value, $.utils.getPointer(8, this));
  }
  _disownDefault() {
    return $.utils.disown(this.default);
  }
  get default() {
    return $.utils.getStruct(8, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !$.utils.isNull($.utils.getPointer(8, this));
  }
  _initDefault() {
    return $.utils.initStructAt(8, DefaultValueReflection, this);
  }
  set default(value) {
    $.utils.copyFrom(value, $.utils.getPointer(8, this));
  }
  toString() {
    return "SerializedTypeProperty_" + super.toString();
  }
};
var SerializedTypeFunction = class _SerializedTypeFunction extends $.Struct {
  static {
    __name(this, "SerializedTypeFunction");
  }
  static _capnp = {
    displayName: "SerializedTypeFunction",
    id: "9130bccd82dfcfd4",
    size: new $.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeFunction._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeFunction._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeFunction._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeFunction._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get visibility() {
    return $.utils.getUint16(0, this);
  }
  set visibility(value) {
    $.utils.setUint16(0, value, this);
  }
  get abstract() {
    return $.utils.getBit(16, this);
  }
  set abstract(value) {
    $.utils.setBit(16, value, this);
  }
  get optional() {
    return $.utils.getBit(17, this);
  }
  set optional(value) {
    $.utils.setBit(17, value, this);
  }
  get readonly() {
    return $.utils.getBit(18, this);
  }
  set readonly(value) {
    $.utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initTags() {
    return $.utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  get kind() {
    return $.utils.getUint16(4, this);
  }
  set kind(value) {
    $.utils.setUint16(4, value, this);
  }
  get name() {
    return $.utils.getText(5, this);
  }
  set name(value) {
    $.utils.setText(5, value, this);
  }
  _adoptParameters(value) {
    $.utils.adopt(value, $.utils.getPointer(6, this));
  }
  _disownParameters() {
    return $.utils.disown(this.parameters);
  }
  get parameters() {
    return $.utils.getList(6, _SerializedTypeFunction._Parameters, this);
  }
  _hasParameters() {
    return !$.utils.isNull($.utils.getPointer(6, this));
  }
  _initParameters(length) {
    return $.utils.initList(6, _SerializedTypeFunction._Parameters, length, this);
  }
  set parameters(value) {
    $.utils.copyFrom(value, $.utils.getPointer(6, this));
  }
  _adoptReturn(value) {
    $.utils.adopt(value, $.utils.getPointer(7, this));
  }
  _disownReturn() {
    return $.utils.disown(this.return);
  }
  get return() {
    return $.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !$.utils.isNull($.utils.getPointer(7, this));
  }
  _initReturn() {
    return $.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set return(value) {
    $.utils.copyFrom(value, $.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeFunction_" + super.toString();
  }
};
var SerializedTypePromise = class _SerializedTypePromise extends $.Struct {
  static {
    __name(this, "SerializedTypePromise");
  }
  static _capnp = {
    displayName: "SerializedTypePromise",
    id: "e9b0cbe936a42398",
    size: new $.ObjectSize(8, 4)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypePromise._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypePromise._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypePromise._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypePromise._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get visibility() {
    return $.utils.getUint16(0, this);
  }
  set visibility(value) {
    $.utils.setUint16(0, value, this);
  }
  get abstract() {
    return $.utils.getBit(16, this);
  }
  set abstract(value) {
    $.utils.setBit(16, value, this);
  }
  toString() {
    return "SerializedTypePromise_" + super.toString();
  }
};
var SerializedTypeEnumEntry = class extends $.Struct {
  static {
    __name(this, "SerializedTypeEnumEntry");
  }
  static _capnp = {
    displayName: "SerializedTypeEnumEntry",
    id: "d5bcb8b7c49ba556",
    size: new $.ObjectSize(0, 2)
  };
  get name() {
    return $.utils.getText(0, this);
  }
  set name(value) {
    $.utils.setText(0, value, this);
  }
  get value() {
    return $.utils.getText(1, this);
  }
  set value(value) {
    $.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeEnumEntry_" + super.toString();
  }
};
var SerializedTypeEnum = class _SerializedTypeEnum extends $.Struct {
  static {
    __name(this, "SerializedTypeEnum");
  }
  static _capnp = {
    displayName: "SerializedTypeEnum",
    id: "d7d36f0ae79e3841",
    size: new $.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _EnumEntries;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeEnum._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeEnum._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeEnum._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeEnum._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptEnumEntries(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownEnumEntries() {
    return $.utils.disown(this.enumEntries);
  }
  get enumEntries() {
    return $.utils.getList(4, _SerializedTypeEnum._EnumEntries, this);
  }
  _hasEnumEntries() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initEnumEntries(length) {
    return $.utils.initList(4, _SerializedTypeEnum._EnumEntries, length, this);
  }
  set enumEntries(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  _adoptValues(value) {
    $.utils.adopt(value, $.utils.getPointer(5, this));
  }
  _disownValues() {
    return $.utils.disown(this.values);
  }
  get values() {
    return $.utils.getList(5, $.TextList, this);
  }
  _hasValues() {
    return !$.utils.isNull($.utils.getPointer(5, this));
  }
  _initValues(length) {
    return $.utils.initList(5, $.TextList, length, this);
  }
  set values(value) {
    $.utils.copyFrom(value, $.utils.getPointer(5, this));
  }
  _adoptIndexType(value) {
    $.utils.adopt(value, $.utils.getPointer(6, this));
  }
  _disownIndexType() {
    return $.utils.disown(this.indexType);
  }
  get indexType() {
    return $.utils.getStruct(6, SerializedTypeReference, this);
  }
  _hasIndexType() {
    return !$.utils.isNull($.utils.getPointer(6, this));
  }
  _initIndexType() {
    return $.utils.initStructAt(6, SerializedTypeReference, this);
  }
  set indexType(value) {
    $.utils.copyFrom(value, $.utils.getPointer(6, this));
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(7, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(7, this));
  }
  _initTags() {
    return $.utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeEnum_" + super.toString();
  }
};
var SerializedTypeUnion = class _SerializedTypeUnion extends $.Struct {
  static {
    __name(this, "SerializedTypeUnion");
  }
  static _capnp = {
    displayName: "SerializedTypeUnion",
    id: "a9ae4c95e41ff4ab",
    size: new $.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeUnion._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeUnion._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeUnion._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeUnion._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $.utils.disown(this.types);
  }
  get types() {
    return $.utils.getList(4, _SerializedTypeUnion._Types, this);
  }
  _hasTypes() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $.utils.initList(4, _SerializedTypeUnion._Types, length, this);
  }
  set types(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeUnion_" + super.toString();
  }
};
var SerializedTypeIntersection = class _SerializedTypeIntersection extends $.Struct {
  static {
    __name(this, "SerializedTypeIntersection");
  }
  static _capnp = {
    displayName: "SerializedTypeIntersection",
    id: "9ae42bd17511c09b",
    size: new $.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeIntersection._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeIntersection._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeIntersection._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeIntersection._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $.utils.disown(this.types);
  }
  get types() {
    return $.utils.getList(4, _SerializedTypeIntersection._Types, this);
  }
  _hasTypes() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $.utils.initList(4, _SerializedTypeIntersection._Types, length, this);
  }
  set types(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeIntersection_" + super.toString();
  }
};
var SerializedTypeArray = class _SerializedTypeArray extends $.Struct {
  static {
    __name(this, "SerializedTypeArray");
  }
  static _capnp = {
    displayName: "SerializedTypeArray",
    id: "97d1d75240151501",
    size: new $.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeArray._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeArray._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeArray._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeArray._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownType() {
    return $.utils.disown(this.type);
  }
  get type() {
    return $.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initType() {
    return $.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(5, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(5, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(5, this));
  }
  _initTags() {
    return $.utils.initStructAt(5, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(5, this));
  }
  toString() {
    return "SerializedTypeArray_" + super.toString();
  }
};
var SerializedTypeIndexSignature = class _SerializedTypeIndexSignature extends $.Struct {
  static {
    __name(this, "SerializedTypeIndexSignature");
  }
  static _capnp = {
    displayName: "SerializedTypeIndexSignature",
    id: "93e335e2756821d8",
    size: new $.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeIndexSignature._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeIndexSignature._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeIndexSignature._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeIndexSignature._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptIndex(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownIndex() {
    return $.utils.disown(this.index);
  }
  get index() {
    return $.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasIndex() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initIndex() {
    return $.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set index(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  _adoptType(value) {
    $.utils.adopt(value, $.utils.getPointer(5, this));
  }
  _disownType() {
    return $.utils.disown(this.type);
  }
  get type() {
    return $.utils.getStruct(5, SerializedTypeReference, this);
  }
  _hasType() {
    return !$.utils.isNull($.utils.getPointer(5, this));
  }
  _initType() {
    return $.utils.initStructAt(5, SerializedTypeReference, this);
  }
  set type(value) {
    $.utils.copyFrom(value, $.utils.getPointer(5, this));
  }
  toString() {
    return "SerializedTypeIndexSignature_" + super.toString();
  }
};
var SerializedTypePropertySignature = class _SerializedTypePropertySignature extends $.Struct {
  static {
    __name(this, "SerializedTypePropertySignature");
  }
  static _capnp = {
    displayName: "SerializedTypePropertySignature",
    id: "9bc1cebd2ca1569a",
    size: new $.ObjectSize(8, 9)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypePropertySignature._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypePropertySignature._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypePropertySignature._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypePropertySignature._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  get name() {
    return $.utils.getText(4, this);
  }
  set name(value) {
    $.utils.setText(4, value, this);
  }
  get optional() {
    return $.utils.getBit(16, this);
  }
  set optional(value) {
    $.utils.setBit(16, value, this);
  }
  get readonly() {
    return $.utils.getBit(17, this);
  }
  set readonly(value) {
    $.utils.setBit(17, value, this);
  }
  get description() {
    return $.utils.getText(5, this);
  }
  set description(value) {
    $.utils.setText(5, value, this);
  }
  _adoptDefault(value) {
    $.utils.adopt(value, $.utils.getPointer(6, this));
  }
  _disownDefault() {
    return $.utils.disown(this.default);
  }
  get default() {
    return $.utils.getStruct(6, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !$.utils.isNull($.utils.getPointer(6, this));
  }
  _initDefault() {
    return $.utils.initStructAt(6, DefaultValueReflection, this);
  }
  set default(value) {
    $.utils.copyFrom(value, $.utils.getPointer(6, this));
  }
  _adoptType(value) {
    $.utils.adopt(value, $.utils.getPointer(7, this));
  }
  _disownType() {
    return $.utils.disown(this.type);
  }
  get type() {
    return $.utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasType() {
    return !$.utils.isNull($.utils.getPointer(7, this));
  }
  _initType() {
    return $.utils.initStructAt(7, SerializedTypeReference, this);
  }
  set type(value) {
    $.utils.copyFrom(value, $.utils.getPointer(7, this));
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(8, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(8, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(8, this));
  }
  _initTags() {
    return $.utils.initStructAt(8, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(8, this));
  }
  toString() {
    return "SerializedTypePropertySignature_" + super.toString();
  }
};
var SerializedTypeMethodSignature = class _SerializedTypeMethodSignature extends $.Struct {
  static {
    __name(this, "SerializedTypeMethodSignature");
  }
  static _capnp = {
    displayName: "SerializedTypeMethodSignature",
    id: "e25a2cc39d5930c8",
    size: new $.ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeMethodSignature._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeMethodSignature._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeMethodSignature._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeMethodSignature._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  get name() {
    return $.utils.getText(4, this);
  }
  set name(value) {
    $.utils.setText(4, value, this);
  }
  get optional() {
    return $.utils.getBit(16, this);
  }
  set optional(value) {
    $.utils.setBit(16, value, this);
  }
  _adoptParameters(value) {
    $.utils.adopt(value, $.utils.getPointer(5, this));
  }
  _disownParameters() {
    return $.utils.disown(this.parameters);
  }
  get parameters() {
    return $.utils.getList(5, _SerializedTypeMethodSignature._Parameters, this);
  }
  _hasParameters() {
    return !$.utils.isNull($.utils.getPointer(5, this));
  }
  _initParameters(length) {
    return $.utils.initList(5, _SerializedTypeMethodSignature._Parameters, length, this);
  }
  set parameters(value) {
    $.utils.copyFrom(value, $.utils.getPointer(5, this));
  }
  _adoptReturn(value) {
    $.utils.adopt(value, $.utils.getPointer(6, this));
  }
  _disownReturn() {
    return $.utils.disown(this.return);
  }
  get return() {
    return $.utils.getStruct(6, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !$.utils.isNull($.utils.getPointer(6, this));
  }
  _initReturn() {
    return $.utils.initStructAt(6, SerializedTypeReference, this);
  }
  set return(value) {
    $.utils.copyFrom(value, $.utils.getPointer(6, this));
  }
  _adoptTags(value) {
    $.utils.adopt(value, $.utils.getPointer(7, this));
  }
  _disownTags() {
    return $.utils.disown(this.tags);
  }
  get tags() {
    return $.utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !$.utils.isNull($.utils.getPointer(7, this));
  }
  _initTags() {
    return $.utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    $.utils.copyFrom(value, $.utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeMethodSignature_" + super.toString();
  }
};
var SerializedTypeTypeParameter = class _SerializedTypeTypeParameter extends $.Struct {
  static {
    __name(this, "SerializedTypeTypeParameter");
  }
  static _capnp = {
    displayName: "SerializedTypeTypeParameter",
    id: "81210361a54d5d71",
    size: new $.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeTypeParameter._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeTypeParameter._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeTypeParameter._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeTypeParameter._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  get name() {
    return $.utils.getText(4, this);
  }
  set name(value) {
    $.utils.setText(4, value, this);
  }
  toString() {
    return "SerializedTypeTypeParameter_" + super.toString();
  }
};
var SerializedTypeInfer = class _SerializedTypeInfer extends $.Struct {
  static {
    __name(this, "SerializedTypeInfer");
  }
  static _capnp = {
    displayName: "SerializedTypeInfer",
    id: "91c6dd1e13f2b14d",
    size: new $.ObjectSize(8, 4)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeInfer._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeInfer._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeInfer._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeInfer._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  toString() {
    return "SerializedTypeInfer_" + super.toString();
  }
};
var SerializedTypeTupleMember = class _SerializedTypeTupleMember extends $.Struct {
  static {
    __name(this, "SerializedTypeTupleMember");
  }
  static _capnp = {
    displayName: "SerializedTypeTupleMember",
    id: "e21c2a18d0d56fdf",
    size: new $.ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeTupleMember._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeTupleMember._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeTupleMember._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeTupleMember._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownType() {
    return $.utils.disown(this.type);
  }
  get type() {
    return $.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initType() {
    return $.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  get optional() {
    return $.utils.getBit(16, this);
  }
  set optional(value) {
    $.utils.setBit(16, value, this);
  }
  get name() {
    return $.utils.getText(5, this);
  }
  set name(value) {
    $.utils.setText(5, value, this);
  }
  toString() {
    return "SerializedTypeTupleMember_" + super.toString();
  }
};
var SerializedTypeTuple = class _SerializedTypeTuple extends $.Struct {
  static {
    __name(this, "SerializedTypeTuple");
  }
  static _capnp = {
    displayName: "SerializedTypeTuple",
    id: "eb7501eb1ee4fb6d",
    size: new $.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeTuple._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeTuple._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeTuple._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeTuple._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $.utils.disown(this.types);
  }
  get types() {
    return $.utils.getList(4, _SerializedTypeTuple._Types, this);
  }
  _hasTypes() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $.utils.initList(4, _SerializedTypeTuple._Types, length, this);
  }
  set types(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeTuple_" + super.toString();
  }
};
var SerializedTypeRest = class _SerializedTypeRest extends $.Struct {
  static {
    __name(this, "SerializedTypeRest");
  }
  static _capnp = {
    displayName: "SerializedTypeRest",
    id: "f9e684a435cce5d1",
    size: new $.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeRest._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeRest._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeRest._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeRest._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownType() {
    return $.utils.disown(this.type);
  }
  get type() {
    return $.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initType() {
    return $.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeRest_" + super.toString();
  }
};
var SimpleSerializedType = class _SimpleSerializedType extends $.Struct {
  static {
    __name(this, "SimpleSerializedType");
  }
  static _capnp = {
    displayName: "SimpleSerializedType",
    id: "80f983e4b811c3ca",
    size: new $.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SimpleSerializedType._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SimpleSerializedType._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SimpleSerializedType._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SimpleSerializedType._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownOrigin() {
    return $.utils.disown(this.origin);
  }
  get origin() {
    return $.utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasOrigin() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initOrigin() {
    return $.utils.initStructAt(4, SerializedTypeReference, this);
  }
  set origin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  toString() {
    return "SimpleSerializedType_" + super.toString();
  }
};
var SerializedTypeLiteralSymbol = class extends $.Struct {
  static {
    __name(this, "SerializedTypeLiteralSymbol");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteralSymbol",
    id: "f3dd6a3c6054bd55",
    size: new $.ObjectSize(0, 2)
  };
  /**
  * "symbol"
  *
  */
  get type() {
    return $.utils.getText(0, this);
  }
  set type(value) {
    $.utils.setText(0, value, this);
  }
  get name() {
    return $.utils.getText(1, this);
  }
  set name(value) {
    $.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralSymbol_" + super.toString();
  }
};
var SerializedTypeLiteralBigInt = class extends $.Struct {
  static {
    __name(this, "SerializedTypeLiteralBigInt");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteralBigInt",
    id: "821a872d8be30bb2",
    size: new $.ObjectSize(0, 2)
  };
  /**
  * "bigint"
  *
  */
  get type() {
    return $.utils.getText(0, this);
  }
  set type(value) {
    $.utils.setText(0, value, this);
  }
  get value() {
    return $.utils.getText(1, this);
  }
  set value(value) {
    $.utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralBigInt_" + super.toString();
  }
};
var SerializedTypeLiteralRegex = class extends $.Struct {
  static {
    __name(this, "SerializedTypeLiteralRegex");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteralRegex",
    id: "cc89f97b47927d99",
    size: new $.ObjectSize(0, 2)
  };
  /**
  * "regex"
  *
  */
  get type() {
    return $.utils.getText(0, this);
  }
  set type(value) {
    $.utils.setText(0, value, this);
  }
  get regex() {
    return $.utils.getText(1, this);
  }
  set regex(value) {
    $.utils.setText(1, value, this);
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
var SerializedTypeLiteral_Literal = class extends $.Struct {
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
    size: new $.ObjectSize(16, 5)
  };
  _adoptSymbol(value) {
    $.utils.setUint16(2, 0, this);
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownSymbol() {
    return $.utils.disown(this.symbol);
  }
  get symbol() {
    $.utils.testWhich("symbol", $.utils.getUint16(2, this), 0, this);
    return $.utils.getStruct(4, SerializedTypeLiteralSymbol, this);
  }
  _hasSymbol() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initSymbol() {
    $.utils.setUint16(2, 0, this);
    return $.utils.initStructAt(4, SerializedTypeLiteralSymbol, this);
  }
  get _isSymbol() {
    return $.utils.getUint16(2, this) === 0;
  }
  set symbol(value) {
    $.utils.setUint16(2, 0, this);
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  get string() {
    $.utils.testWhich("string", $.utils.getUint16(2, this), 1, this);
    return $.utils.getText(4, this);
  }
  get _isString() {
    return $.utils.getUint16(2, this) === 1;
  }
  set string(value) {
    $.utils.setUint16(2, 1, this);
    $.utils.setText(4, value, this);
  }
  get number() {
    $.utils.testWhich("number", $.utils.getUint16(2, this), 2, this);
    return $.utils.getFloat64(8, this);
  }
  get _isNumber() {
    return $.utils.getUint16(2, this) === 2;
  }
  set number(value) {
    $.utils.setUint16(2, 2, this);
    $.utils.setFloat64(8, value, this);
  }
  get boolean() {
    $.utils.testWhich("boolean", $.utils.getUint16(2, this), 3, this);
    return $.utils.getBit(64, this);
  }
  get _isBoolean() {
    return $.utils.getUint16(2, this) === 3;
  }
  set boolean(value) {
    $.utils.setUint16(2, 3, this);
    $.utils.setBit(64, value, this);
  }
  _adoptBigint(value) {
    $.utils.setUint16(2, 4, this);
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownBigint() {
    return $.utils.disown(this.bigint);
  }
  get bigint() {
    $.utils.testWhich("bigint", $.utils.getUint16(2, this), 4, this);
    return $.utils.getStruct(4, SerializedTypeLiteralBigInt, this);
  }
  _hasBigint() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initBigint() {
    $.utils.setUint16(2, 4, this);
    return $.utils.initStructAt(4, SerializedTypeLiteralBigInt, this);
  }
  get _isBigint() {
    return $.utils.getUint16(2, this) === 4;
  }
  set bigint(value) {
    $.utils.setUint16(2, 4, this);
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  _adoptRegex(value) {
    $.utils.setUint16(2, 5, this);
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownRegex() {
    return $.utils.disown(this.regex);
  }
  get regex() {
    $.utils.testWhich("regex", $.utils.getUint16(2, this), 5, this);
    return $.utils.getStruct(4, SerializedTypeLiteralRegex, this);
  }
  _hasRegex() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initRegex() {
    $.utils.setUint16(2, 5, this);
    return $.utils.initStructAt(4, SerializedTypeLiteralRegex, this);
  }
  get _isRegex() {
    return $.utils.getUint16(2, this) === 5;
  }
  set regex(value) {
    $.utils.setUint16(2, 5, this);
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeLiteral_Literal_" + super.toString();
  }
  which() {
    return $.utils.getUint16(2, this);
  }
};
var SerializedTypeLiteral = class _SerializedTypeLiteral extends $.Struct {
  static {
    __name(this, "SerializedTypeLiteral");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteral",
    id: "b876ba24d27d88c8",
    size: new $.ObjectSize(16, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeLiteral._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeLiteral._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeLiteral._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeLiteral._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  get literal() {
    return $.utils.getAs(SerializedTypeLiteral_Literal, this);
  }
  _initLiteral() {
    return $.utils.getAs(SerializedTypeLiteral_Literal, this);
  }
  toString() {
    return "SerializedTypeLiteral_" + super.toString();
  }
};
var SerializedTypeTemplateLiteral = class _SerializedTypeTemplateLiteral extends $.Struct {
  static {
    __name(this, "SerializedTypeTemplateLiteral");
  }
  static _capnp = {
    displayName: "SerializedTypeTemplateLiteral",
    id: "8dd6c284d46cc265",
    size: new $.ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    $.utils.adopt(value, $.utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return $.utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return $.utils.getList(1, _SerializedTypeTemplateLiteral._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !$.utils.isNull($.utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return $.utils.initList(1, _SerializedTypeTemplateLiteral._TypeArguments, length, this);
  }
  set typeArguments(value) {
    $.utils.copyFrom(value, $.utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    $.utils.adopt(value, $.utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return $.utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return $.utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !$.utils.isNull($.utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return $.utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    $.utils.copyFrom(value, $.utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    $.utils.adopt(value, $.utils.getPointer(3, this));
  }
  _disownDecorators() {
    return $.utils.disown(this.decorators);
  }
  get decorators() {
    return $.utils.getList(3, _SerializedTypeTemplateLiteral._Decorators, this);
  }
  _hasDecorators() {
    return !$.utils.isNull($.utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return $.utils.initList(3, _SerializedTypeTemplateLiteral._Decorators, length, this);
  }
  set decorators(value) {
    $.utils.copyFrom(value, $.utils.getPointer(3, this));
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    $.utils.adopt(value, $.utils.getPointer(4, this));
  }
  _disownTypes() {
    return $.utils.disown(this.types);
  }
  get types() {
    return $.utils.getList(4, _SerializedTypeTemplateLiteral._Types, this);
  }
  _hasTypes() {
    return !$.utils.isNull($.utils.getPointer(4, this));
  }
  _initTypes(length) {
    return $.utils.initList(4, _SerializedTypeTemplateLiteral._Types, length, this);
  }
  set types(value) {
    $.utils.copyFrom(value, $.utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeTemplateLiteral_" + super.toString();
  }
};
var SerializedTypeOther = class extends $.Struct {
  static {
    __name(this, "SerializedTypeOther");
  }
  static _capnp = {
    displayName: "SerializedTypeOther",
    id: "9e1048a692ff49ce",
    size: new $.ObjectSize(8, 1)
  };
  get typeName() {
    return $.utils.getText(0, this);
  }
  set typeName(value) {
    $.utils.setText(0, value, this);
  }
  get kind() {
    return $.utils.getUint16(0, this);
  }
  set kind(value) {
    $.utils.setUint16(0, value, this);
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
var SerializedType_Type = class extends $.Struct {
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
    size: new $.ObjectSize(8, 1)
  };
  _adoptSimple(value) {
    $.utils.setUint16(0, 0, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownSimple() {
    return $.utils.disown(this.simple);
  }
  get simple() {
    $.utils.testWhich("simple", $.utils.getUint16(0, this), 0, this);
    return $.utils.getStruct(0, SimpleSerializedType, this);
  }
  _hasSimple() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initSimple() {
    $.utils.setUint16(0, 0, this);
    return $.utils.initStructAt(0, SimpleSerializedType, this);
  }
  get _isSimple() {
    return $.utils.getUint16(0, this) === 0;
  }
  set simple(value) {
    $.utils.setUint16(0, 0, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptLiteral(value) {
    $.utils.setUint16(0, 1, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownLiteral() {
    return $.utils.disown(this.literal);
  }
  get literal() {
    $.utils.testWhich("literal", $.utils.getUint16(0, this), 1, this);
    return $.utils.getStruct(0, SerializedTypeLiteral, this);
  }
  _hasLiteral() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initLiteral() {
    $.utils.setUint16(0, 1, this);
    return $.utils.initStructAt(0, SerializedTypeLiteral, this);
  }
  get _isLiteral() {
    return $.utils.getUint16(0, this) === 1;
  }
  set literal(value) {
    $.utils.setUint16(0, 1, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptTemplateLiteral(value) {
    $.utils.setUint16(0, 2, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownTemplateLiteral() {
    return $.utils.disown(this.templateLiteral);
  }
  get templateLiteral() {
    $.utils.testWhich("templateLiteral", $.utils.getUint16(0, this), 2, this);
    return $.utils.getStruct(0, SerializedTypeTemplateLiteral, this);
  }
  _hasTemplateLiteral() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initTemplateLiteral() {
    $.utils.setUint16(0, 2, this);
    return $.utils.initStructAt(0, SerializedTypeTemplateLiteral, this);
  }
  get _isTemplateLiteral() {
    return $.utils.getUint16(0, this) === 2;
  }
  set templateLiteral(value) {
    $.utils.setUint16(0, 2, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptParameter(value) {
    $.utils.setUint16(0, 3, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownParameter() {
    return $.utils.disown(this.parameter);
  }
  get parameter() {
    $.utils.testWhich("parameter", $.utils.getUint16(0, this), 3, this);
    return $.utils.getStruct(0, SerializedTypeParameter, this);
  }
  _hasParameter() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initParameter() {
    $.utils.setUint16(0, 3, this);
    return $.utils.initStructAt(0, SerializedTypeParameter, this);
  }
  get _isParameter() {
    return $.utils.getUint16(0, this) === 3;
  }
  set parameter(value) {
    $.utils.setUint16(0, 3, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptFunction(value) {
    $.utils.setUint16(0, 4, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownFunction() {
    return $.utils.disown(this.function);
  }
  get function() {
    $.utils.testWhich("function", $.utils.getUint16(0, this), 4, this);
    return $.utils.getStruct(0, SerializedTypeFunction, this);
  }
  _hasFunction() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initFunction() {
    $.utils.setUint16(0, 4, this);
    return $.utils.initStructAt(0, SerializedTypeFunction, this);
  }
  get _isFunction() {
    return $.utils.getUint16(0, this) === 4;
  }
  set function(value) {
    $.utils.setUint16(0, 4, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptMethod(value) {
    $.utils.setUint16(0, 5, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownMethod() {
    return $.utils.disown(this.method);
  }
  get method() {
    $.utils.testWhich("method", $.utils.getUint16(0, this), 5, this);
    return $.utils.getStruct(0, SerializedTypeMethod, this);
  }
  _hasMethod() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initMethod() {
    $.utils.setUint16(0, 5, this);
    return $.utils.initStructAt(0, SerializedTypeMethod, this);
  }
  get _isMethod() {
    return $.utils.getUint16(0, this) === 5;
  }
  set method(value) {
    $.utils.setUint16(0, 5, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptProperty(value) {
    $.utils.setUint16(0, 6, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownProperty() {
    return $.utils.disown(this.property);
  }
  get property() {
    $.utils.testWhich("property", $.utils.getUint16(0, this), 6, this);
    return $.utils.getStruct(0, SerializedTypeProperty, this);
  }
  _hasProperty() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initProperty() {
    $.utils.setUint16(0, 6, this);
    return $.utils.initStructAt(0, SerializedTypeProperty, this);
  }
  get _isProperty() {
    return $.utils.getUint16(0, this) === 6;
  }
  set property(value) {
    $.utils.setUint16(0, 6, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptPromise(value) {
    $.utils.setUint16(0, 7, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownPromise() {
    return $.utils.disown(this.promise);
  }
  get promise() {
    $.utils.testWhich("promise", $.utils.getUint16(0, this), 7, this);
    return $.utils.getStruct(0, SerializedTypePromise, this);
  }
  _hasPromise() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initPromise() {
    $.utils.setUint16(0, 7, this);
    return $.utils.initStructAt(0, SerializedTypePromise, this);
  }
  get _isPromise() {
    return $.utils.getUint16(0, this) === 7;
  }
  set promise(value) {
    $.utils.setUint16(0, 7, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptClassType(value) {
    $.utils.setUint16(0, 8, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownClassType() {
    return $.utils.disown(this.classType);
  }
  get classType() {
    $.utils.testWhich("classType", $.utils.getUint16(0, this), 8, this);
    return $.utils.getStruct(0, SerializedTypeClassType, this);
  }
  _hasClassType() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initClassType() {
    $.utils.setUint16(0, 8, this);
    return $.utils.initStructAt(0, SerializedTypeClassType, this);
  }
  get _isClassType() {
    return $.utils.getUint16(0, this) === 8;
  }
  set classType(value) {
    $.utils.setUint16(0, 8, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptEnum(value) {
    $.utils.setUint16(0, 9, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownEnum() {
    return $.utils.disown(this.enum);
  }
  get enum() {
    $.utils.testWhich("enum", $.utils.getUint16(0, this), 9, this);
    return $.utils.getStruct(0, SerializedTypeEnum, this);
  }
  _hasEnum() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initEnum() {
    $.utils.setUint16(0, 9, this);
    return $.utils.initStructAt(0, SerializedTypeEnum, this);
  }
  get _isEnum() {
    return $.utils.getUint16(0, this) === 9;
  }
  set enum(value) {
    $.utils.setUint16(0, 9, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptUnion(value) {
    $.utils.setUint16(0, 10, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownUnion() {
    return $.utils.disown(this.union);
  }
  get union() {
    $.utils.testWhich("union", $.utils.getUint16(0, this), 10, this);
    return $.utils.getStruct(0, SerializedTypeUnion, this);
  }
  _hasUnion() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initUnion() {
    $.utils.setUint16(0, 10, this);
    return $.utils.initStructAt(0, SerializedTypeUnion, this);
  }
  get _isUnion() {
    return $.utils.getUint16(0, this) === 10;
  }
  set union(value) {
    $.utils.setUint16(0, 10, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptIntersection(value) {
    $.utils.setUint16(0, 11, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownIntersection() {
    return $.utils.disown(this.intersection);
  }
  get intersection() {
    $.utils.testWhich("intersection", $.utils.getUint16(0, this), 11, this);
    return $.utils.getStruct(0, SerializedTypeIntersection, this);
  }
  _hasIntersection() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initIntersection() {
    $.utils.setUint16(0, 11, this);
    return $.utils.initStructAt(0, SerializedTypeIntersection, this);
  }
  get _isIntersection() {
    return $.utils.getUint16(0, this) === 11;
  }
  set intersection(value) {
    $.utils.setUint16(0, 11, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptArray(value) {
    $.utils.setUint16(0, 12, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownArray() {
    return $.utils.disown(this.array);
  }
  get array() {
    $.utils.testWhich("array", $.utils.getUint16(0, this), 12, this);
    return $.utils.getStruct(0, SerializedTypeArray, this);
  }
  _hasArray() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initArray() {
    $.utils.setUint16(0, 12, this);
    return $.utils.initStructAt(0, SerializedTypeArray, this);
  }
  get _isArray() {
    return $.utils.getUint16(0, this) === 12;
  }
  set array(value) {
    $.utils.setUint16(0, 12, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptObjectLiteral(value) {
    $.utils.setUint16(0, 13, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownObjectLiteral() {
    return $.utils.disown(this.objectLiteral);
  }
  get objectLiteral() {
    $.utils.testWhich("objectLiteral", $.utils.getUint16(0, this), 13, this);
    return $.utils.getStruct(0, SerializedTypeObjectLiteral, this);
  }
  _hasObjectLiteral() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initObjectLiteral() {
    $.utils.setUint16(0, 13, this);
    return $.utils.initStructAt(0, SerializedTypeObjectLiteral, this);
  }
  get _isObjectLiteral() {
    return $.utils.getUint16(0, this) === 13;
  }
  set objectLiteral(value) {
    $.utils.setUint16(0, 13, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptIndexSignature(value) {
    $.utils.setUint16(0, 14, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownIndexSignature() {
    return $.utils.disown(this.indexSignature);
  }
  get indexSignature() {
    $.utils.testWhich("indexSignature", $.utils.getUint16(0, this), 14, this);
    return $.utils.getStruct(0, SerializedTypeIndexSignature, this);
  }
  _hasIndexSignature() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initIndexSignature() {
    $.utils.setUint16(0, 14, this);
    return $.utils.initStructAt(0, SerializedTypeIndexSignature, this);
  }
  get _isIndexSignature() {
    return $.utils.getUint16(0, this) === 14;
  }
  set indexSignature(value) {
    $.utils.setUint16(0, 14, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptPropertySignature(value) {
    $.utils.setUint16(0, 15, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownPropertySignature() {
    return $.utils.disown(this.propertySignature);
  }
  get propertySignature() {
    $.utils.testWhich("propertySignature", $.utils.getUint16(0, this), 15, this);
    return $.utils.getStruct(0, SerializedTypePropertySignature, this);
  }
  _hasPropertySignature() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initPropertySignature() {
    $.utils.setUint16(0, 15, this);
    return $.utils.initStructAt(0, SerializedTypePropertySignature, this);
  }
  get _isPropertySignature() {
    return $.utils.getUint16(0, this) === 15;
  }
  set propertySignature(value) {
    $.utils.setUint16(0, 15, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptMethodSignature(value) {
    $.utils.setUint16(0, 16, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownMethodSignature() {
    return $.utils.disown(this.methodSignature);
  }
  get methodSignature() {
    $.utils.testWhich("methodSignature", $.utils.getUint16(0, this), 16, this);
    return $.utils.getStruct(0, SerializedTypeMethodSignature, this);
  }
  _hasMethodSignature() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initMethodSignature() {
    $.utils.setUint16(0, 16, this);
    return $.utils.initStructAt(0, SerializedTypeMethodSignature, this);
  }
  get _isMethodSignature() {
    return $.utils.getUint16(0, this) === 16;
  }
  set methodSignature(value) {
    $.utils.setUint16(0, 16, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptTypeParameter(value) {
    $.utils.setUint16(0, 17, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownTypeParameter() {
    return $.utils.disown(this.typeParameter);
  }
  get typeParameter() {
    $.utils.testWhich("typeParameter", $.utils.getUint16(0, this), 17, this);
    return $.utils.getStruct(0, SerializedTypeTypeParameter, this);
  }
  _hasTypeParameter() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initTypeParameter() {
    $.utils.setUint16(0, 17, this);
    return $.utils.initStructAt(0, SerializedTypeTypeParameter, this);
  }
  get _isTypeParameter() {
    return $.utils.getUint16(0, this) === 17;
  }
  set typeParameter(value) {
    $.utils.setUint16(0, 17, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptInfer(value) {
    $.utils.setUint16(0, 18, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownInfer() {
    return $.utils.disown(this.infer);
  }
  get infer() {
    $.utils.testWhich("infer", $.utils.getUint16(0, this), 18, this);
    return $.utils.getStruct(0, SerializedTypeInfer, this);
  }
  _hasInfer() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initInfer() {
    $.utils.setUint16(0, 18, this);
    return $.utils.initStructAt(0, SerializedTypeInfer, this);
  }
  get _isInfer() {
    return $.utils.getUint16(0, this) === 18;
  }
  set infer(value) {
    $.utils.setUint16(0, 18, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptTuple(value) {
    $.utils.setUint16(0, 19, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownTuple() {
    return $.utils.disown(this.tuple);
  }
  get tuple() {
    $.utils.testWhich("tuple", $.utils.getUint16(0, this), 19, this);
    return $.utils.getStruct(0, SerializedTypeTuple, this);
  }
  _hasTuple() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initTuple() {
    $.utils.setUint16(0, 19, this);
    return $.utils.initStructAt(0, SerializedTypeTuple, this);
  }
  get _isTuple() {
    return $.utils.getUint16(0, this) === 19;
  }
  set tuple(value) {
    $.utils.setUint16(0, 19, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptTupleMember(value) {
    $.utils.setUint16(0, 20, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownTupleMember() {
    return $.utils.disown(this.tupleMember);
  }
  get tupleMember() {
    $.utils.testWhich("tupleMember", $.utils.getUint16(0, this), 20, this);
    return $.utils.getStruct(0, SerializedTypeTupleMember, this);
  }
  _hasTupleMember() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initTupleMember() {
    $.utils.setUint16(0, 20, this);
    return $.utils.initStructAt(0, SerializedTypeTupleMember, this);
  }
  get _isTupleMember() {
    return $.utils.getUint16(0, this) === 20;
  }
  set tupleMember(value) {
    $.utils.setUint16(0, 20, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptRest(value) {
    $.utils.setUint16(0, 21, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownRest() {
    return $.utils.disown(this.rest);
  }
  get rest() {
    $.utils.testWhich("rest", $.utils.getUint16(0, this), 21, this);
    return $.utils.getStruct(0, SerializedTypeRest, this);
  }
  _hasRest() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initRest() {
    $.utils.setUint16(0, 21, this);
    return $.utils.initStructAt(0, SerializedTypeRest, this);
  }
  get _isRest() {
    return $.utils.getUint16(0, this) === 21;
  }
  set rest(value) {
    $.utils.setUint16(0, 21, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  _adoptOther(value) {
    $.utils.setUint16(0, 22, this);
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownOther() {
    return $.utils.disown(this.other);
  }
  /**
  * For any other type that is not explicitly defined
  *
  */
  get other() {
    $.utils.testWhich("other", $.utils.getUint16(0, this), 22, this);
    return $.utils.getStruct(0, SerializedTypeOther, this);
  }
  _hasOther() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initOther() {
    $.utils.setUint16(0, 22, this);
    return $.utils.initStructAt(0, SerializedTypeOther, this);
  }
  get _isOther() {
    return $.utils.getUint16(0, this) === 22;
  }
  set other(value) {
    $.utils.setUint16(0, 22, this);
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  toString() {
    return "SerializedType_Type_" + super.toString();
  }
  which() {
    return $.utils.getUint16(0, this);
  }
};
var SerializedType = class extends $.Struct {
  static {
    __name(this, "SerializedType");
  }
  static _capnp = {
    displayName: "SerializedType",
    id: "96856dcc2dd3d58f",
    size: new $.ObjectSize(8, 1)
  };
  get type() {
    return $.utils.getAs(SerializedType_Type, this);
  }
  _initType() {
    return $.utils.getAs(SerializedType_Type, this);
  }
  toString() {
    return "SerializedType_" + super.toString();
  }
};
var SerializedTypes = class _SerializedTypes extends $.Struct {
  static {
    __name(this, "SerializedTypes");
  }
  static _capnp = {
    displayName: "SerializedTypes",
    id: "ac55398ab0ef4958",
    size: new $.ObjectSize(0, 1)
  };
  static _Types;
  _adoptTypes(value) {
    $.utils.adopt(value, $.utils.getPointer(0, this));
  }
  _disownTypes() {
    return $.utils.disown(this.types);
  }
  get types() {
    return $.utils.getList(0, _SerializedTypes._Types, this);
  }
  _hasTypes() {
    return !$.utils.isNull($.utils.getPointer(0, this));
  }
  _initTypes(length) {
    return $.utils.initList(0, _SerializedTypes._Types, length, this);
  }
  set types(value) {
    $.utils.copyFrom(value, $.utils.getPointer(0, this));
  }
  toString() {
    return "SerializedTypes_" + super.toString();
  }
};
EntityOptions._Indexes = $.CompositeList(EntityOptions_EntityIndexOptions);
SerializedTypeObjectLiteral._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeObjectLiteral._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeObjectLiteral._Types = $.CompositeList(SerializedTypeReference);
SerializedTypeClassType._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeClassType._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeClassType._ExtendsArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeClassType._Arguments = $.CompositeList(SerializedTypeReference);
SerializedTypeClassType._Types = $.CompositeList(SerializedTypeReference);
SerializedTypeParameter._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeParameter._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeMethod._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeMethod._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeMethod._Parameters = $.CompositeList(SerializedTypeParameter);
SerializedTypeProperty._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeProperty._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeFunction._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeFunction._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeFunction._Parameters = $.CompositeList(SerializedTypeParameter);
SerializedTypePromise._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypePromise._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeEnum._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeEnum._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeEnum._EnumEntries = $.CompositeList(SerializedTypeEnumEntry);
SerializedTypeUnion._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeUnion._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeUnion._Types = $.CompositeList(SerializedTypeReference);
SerializedTypeIntersection._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeIntersection._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeIntersection._Types = $.CompositeList(SerializedTypeReference);
SerializedTypeArray._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeArray._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeIndexSignature._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeIndexSignature._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypePropertySignature._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypePropertySignature._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeMethodSignature._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeMethodSignature._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeMethodSignature._Parameters = $.CompositeList(SerializedTypeParameter);
SerializedTypeTypeParameter._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeTypeParameter._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeInfer._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeInfer._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeTupleMember._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeTupleMember._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeTuple._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeTuple._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeTuple._Types = $.CompositeList(SerializedTypeTupleMember);
SerializedTypeRest._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeRest._Decorators = $.CompositeList(SerializedTypeReference);
SimpleSerializedType._TypeArguments = $.CompositeList(SerializedTypeReference);
SimpleSerializedType._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeLiteral._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeLiteral._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeTemplateLiteral._TypeArguments = $.CompositeList(SerializedTypeReference);
SerializedTypeTemplateLiteral._Decorators = $.CompositeList(SerializedTypeReference);
SerializedTypeTemplateLiteral._Types = $.CompositeList(SerializedTypeReference);
SerializedTypes._Types = $.CompositeList(SerializedType);

export { DefaultValueReflection, DefaultValueReflection_Value, DefaultValueReflection_Value_Which, EntityOptions, EntityOptions_EntityIndexOptions, IndexAccessOrigin, ReflectionKind, ReflectionVisibility, SerializedType, SerializedTypeArray, SerializedTypeClassType, SerializedTypeEnum, SerializedTypeEnumEntry, SerializedTypeFunction, SerializedTypeIndexSignature, SerializedTypeInfer, SerializedTypeIntersection, SerializedTypeLiteral, SerializedTypeLiteralBigInt, SerializedTypeLiteralRegex, SerializedTypeLiteralSymbol, SerializedTypeLiteral_Literal, SerializedTypeLiteral_Literal_Which, SerializedTypeMethod, SerializedTypeMethodSignature, SerializedTypeObjectLiteral, SerializedTypeOther, SerializedTypeParameter, SerializedTypePromise, SerializedTypeProperty, SerializedTypePropertySignature, SerializedTypeReference, SerializedTypeRest, SerializedTypeTemplateLiteral, SerializedTypeTuple, SerializedTypeTupleMember, SerializedTypeTypeParameter, SerializedTypeUnion, SerializedType_Type, SerializedType_Type_Which, SerializedTypes, SimpleSerializedType, TagsReflection, _capnpFileId };
