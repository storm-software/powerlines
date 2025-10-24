'use strict';

var console$1 = require('@storm-software/config-tools/logger/console');
var actualFS = require('fs');
var promises = require('fs/promises');
var buffer = require('buffer');
var defu = require('defu');
var url = require('url');
var path$1 = require('path');
var events = require('events');
var Stream = require('stream');
var string_decoder = require('string_decoder');
var ts = require('typescript');
var child_process = require('child_process');
var worker_threads = require('worker_threads');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

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

var actualFS__namespace = /*#__PURE__*/_interopNamespace(actualFS);
var defu__default = /*#__PURE__*/_interopDefault(defu);
var Stream__default = /*#__PURE__*/_interopDefault(Stream);
var ts__default = /*#__PURE__*/_interopDefault(ts);

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../node_modules/.pnpm/@stryke+capnp@0.12.2_magicast@0.3.5_nx@21.6.6_@swc-node+register@1.10.10_@swc+core@1.13_fd22771bb9e47ee907b716dcf2a1b1d9/node_modules/@stryke/capnp/dist/chunk-SHUYVCID.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", {
  value,
  configurable: true
}), "__name");

// ../../node_modules/.pnpm/jsonc-parser@3.2.0/node_modules/jsonc-parser/lib/esm/impl/scanner.js
function createScanner(text, ignoreTrivia = false) {
  const len = text.length;
  let pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
  function scanHexDigits(count, exact) {
    let digits = 0;
    let value2 = 0;
    while (digits < count || !exact) {
      let ch = text.charCodeAt(pos);
      if (ch >= 48 && ch <= 57) {
        value2 = value2 * 16 + ch - 48;
      } else if (ch >= 65 && ch <= 70) {
        value2 = value2 * 16 + ch - 65 + 10;
      } else if (ch >= 97 && ch <= 102) {
        value2 = value2 * 16 + ch - 97 + 10;
      } else {
        break;
      }
      pos++;
      digits++;
    }
    if (digits < count) {
      value2 = -1;
    }
    return value2;
  }
  __name(scanHexDigits, "scanHexDigits");
  function setPosition(newPosition) {
    pos = newPosition;
    value = "";
    tokenOffset = 0;
    token = 16;
    scanError = 0;
  }
  __name(setPosition, "setPosition");
  function scanNumber() {
    let start = pos;
    if (text.charCodeAt(pos) === 48) {
      pos++;
    } else {
      pos++;
      while (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
      }
    }
    if (pos < text.length && text.charCodeAt(pos) === 46) {
      pos++;
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
      } else {
        scanError = 3;
        return text.substring(start, pos);
      }
    }
    let end = pos;
    if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
      pos++;
      if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) {
        pos++;
      }
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
        end = pos;
      } else {
        scanError = 3;
      }
    }
    return text.substring(start, end);
  }
  __name(scanNumber, "scanNumber");
  function scanString() {
    let result = "", start = pos;
    while (true) {
      if (pos >= len) {
        result += text.substring(start, pos);
        scanError = 2;
        break;
      }
      const ch = text.charCodeAt(pos);
      if (ch === 34) {
        result += text.substring(start, pos);
        pos++;
        break;
      }
      if (ch === 92) {
        result += text.substring(start, pos);
        pos++;
        if (pos >= len) {
          scanError = 2;
          break;
        }
        const ch2 = text.charCodeAt(pos++);
        switch (ch2) {
          case 34:
            result += '"';
            break;
          case 92:
            result += "\\";
            break;
          case 47:
            result += "/";
            break;
          case 98:
            result += "\b";
            break;
          case 102:
            result += "\f";
            break;
          case 110:
            result += "\n";
            break;
          case 114:
            result += "\r";
            break;
          case 116:
            result += "	";
            break;
          case 117:
            const ch3 = scanHexDigits(4, true);
            if (ch3 >= 0) {
              result += String.fromCharCode(ch3);
            } else {
              scanError = 4;
            }
            break;
          default:
            scanError = 5;
        }
        start = pos;
        continue;
      }
      if (ch >= 0 && ch <= 31) {
        if (isLineBreak(ch)) {
          result += text.substring(start, pos);
          scanError = 2;
          break;
        } else {
          scanError = 6;
        }
      }
      pos++;
    }
    return result;
  }
  __name(scanString, "scanString");
  function scanNext() {
    value = "";
    scanError = 0;
    tokenOffset = pos;
    lineStartOffset = lineNumber;
    prevTokenLineStartOffset = tokenLineStartOffset;
    if (pos >= len) {
      tokenOffset = len;
      return token = 17;
    }
    let code = text.charCodeAt(pos);
    if (isWhiteSpace(code)) {
      do {
        pos++;
        value += String.fromCharCode(code);
        code = text.charCodeAt(pos);
      } while (isWhiteSpace(code));
      return token = 15;
    }
    if (isLineBreak(code)) {
      pos++;
      value += String.fromCharCode(code);
      if (code === 13 && text.charCodeAt(pos) === 10) {
        pos++;
        value += "\n";
      }
      lineNumber++;
      tokenLineStartOffset = pos;
      return token = 14;
    }
    switch (code) {
      // tokens: []{}:,
      case 123:
        pos++;
        return token = 1;
      case 125:
        pos++;
        return token = 2;
      case 91:
        pos++;
        return token = 3;
      case 93:
        pos++;
        return token = 4;
      case 58:
        pos++;
        return token = 6;
      case 44:
        pos++;
        return token = 5;
      // strings
      case 34:
        pos++;
        value = scanString();
        return token = 10;
      // comments
      case 47:
        const start = pos - 1;
        if (text.charCodeAt(pos + 1) === 47) {
          pos += 2;
          while (pos < len) {
            if (isLineBreak(text.charCodeAt(pos))) {
              break;
            }
            pos++;
          }
          value = text.substring(start, pos);
          return token = 12;
        }
        if (text.charCodeAt(pos + 1) === 42) {
          pos += 2;
          const safeLength = len - 1;
          let commentClosed = false;
          while (pos < safeLength) {
            const ch = text.charCodeAt(pos);
            if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
              pos += 2;
              commentClosed = true;
              break;
            }
            pos++;
            if (isLineBreak(ch)) {
              if (ch === 13 && text.charCodeAt(pos) === 10) {
                pos++;
              }
              lineNumber++;
              tokenLineStartOffset = pos;
            }
          }
          if (!commentClosed) {
            pos++;
            scanError = 1;
          }
          value = text.substring(start, pos);
          return token = 13;
        }
        value += String.fromCharCode(code);
        pos++;
        return token = 16;
      // numbers
      case 45:
        value += String.fromCharCode(code);
        pos++;
        if (pos === len || !isDigit(text.charCodeAt(pos))) {
          return token = 16;
        }
      // found a minus, followed by a number so
      // we fall through to proceed with scanning
      // numbers
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        value += scanNumber();
        return token = 11;
      // literals and unknown symbols
      default:
        while (pos < len && isUnknownContentCharacter(code)) {
          pos++;
          code = text.charCodeAt(pos);
        }
        if (tokenOffset !== pos) {
          value = text.substring(tokenOffset, pos);
          switch (value) {
            case "true":
              return token = 8;
            case "false":
              return token = 9;
            case "null":
              return token = 7;
          }
          return token = 16;
        }
        value += String.fromCharCode(code);
        pos++;
        return token = 16;
    }
  }
  __name(scanNext, "scanNext");
  function isUnknownContentCharacter(code) {
    if (isWhiteSpace(code) || isLineBreak(code)) {
      return false;
    }
    switch (code) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return false;
    }
    return true;
  }
  __name(isUnknownContentCharacter, "isUnknownContentCharacter");
  function scanNextNonTrivia() {
    let result;
    do {
      result = scanNext();
    } while (result >= 12 && result <= 15);
    return result;
  }
  __name(scanNextNonTrivia, "scanNextNonTrivia");
  return {
    setPosition,
    getPosition: /* @__PURE__ */ __name(() => pos, "getPosition"),
    scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
    getToken: /* @__PURE__ */ __name(() => token, "getToken"),
    getTokenValue: /* @__PURE__ */ __name(() => value, "getTokenValue"),
    getTokenOffset: /* @__PURE__ */ __name(() => tokenOffset, "getTokenOffset"),
    getTokenLength: /* @__PURE__ */ __name(() => pos - tokenOffset, "getTokenLength"),
    getTokenStartLine: /* @__PURE__ */ __name(() => lineStartOffset, "getTokenStartLine"),
    getTokenStartCharacter: /* @__PURE__ */ __name(() => tokenOffset - prevTokenLineStartOffset, "getTokenStartCharacter"),
    getTokenError: /* @__PURE__ */ __name(() => scanError, "getTokenError")
  };
}
__name(createScanner, "createScanner");
function isWhiteSpace(ch) {
  return ch === 32 || ch === 9;
}
__name(isWhiteSpace, "isWhiteSpace");
function isLineBreak(ch) {
  return ch === 10 || ch === 13;
}
__name(isLineBreak, "isLineBreak");
function isDigit(ch) {
  return ch >= 48 && ch <= 57;
}
__name(isDigit, "isDigit");
var CharacterCodes;
(function(CharacterCodes2) {
  CharacterCodes2[CharacterCodes2["lineFeed"] = 10] = "lineFeed";
  CharacterCodes2[CharacterCodes2["carriageReturn"] = 13] = "carriageReturn";
  CharacterCodes2[CharacterCodes2["space"] = 32] = "space";
  CharacterCodes2[CharacterCodes2["_0"] = 48] = "_0";
  CharacterCodes2[CharacterCodes2["_1"] = 49] = "_1";
  CharacterCodes2[CharacterCodes2["_2"] = 50] = "_2";
  CharacterCodes2[CharacterCodes2["_3"] = 51] = "_3";
  CharacterCodes2[CharacterCodes2["_4"] = 52] = "_4";
  CharacterCodes2[CharacterCodes2["_5"] = 53] = "_5";
  CharacterCodes2[CharacterCodes2["_6"] = 54] = "_6";
  CharacterCodes2[CharacterCodes2["_7"] = 55] = "_7";
  CharacterCodes2[CharacterCodes2["_8"] = 56] = "_8";
  CharacterCodes2[CharacterCodes2["_9"] = 57] = "_9";
  CharacterCodes2[CharacterCodes2["a"] = 97] = "a";
  CharacterCodes2[CharacterCodes2["b"] = 98] = "b";
  CharacterCodes2[CharacterCodes2["c"] = 99] = "c";
  CharacterCodes2[CharacterCodes2["d"] = 100] = "d";
  CharacterCodes2[CharacterCodes2["e"] = 101] = "e";
  CharacterCodes2[CharacterCodes2["f"] = 102] = "f";
  CharacterCodes2[CharacterCodes2["g"] = 103] = "g";
  CharacterCodes2[CharacterCodes2["h"] = 104] = "h";
  CharacterCodes2[CharacterCodes2["i"] = 105] = "i";
  CharacterCodes2[CharacterCodes2["j"] = 106] = "j";
  CharacterCodes2[CharacterCodes2["k"] = 107] = "k";
  CharacterCodes2[CharacterCodes2["l"] = 108] = "l";
  CharacterCodes2[CharacterCodes2["m"] = 109] = "m";
  CharacterCodes2[CharacterCodes2["n"] = 110] = "n";
  CharacterCodes2[CharacterCodes2["o"] = 111] = "o";
  CharacterCodes2[CharacterCodes2["p"] = 112] = "p";
  CharacterCodes2[CharacterCodes2["q"] = 113] = "q";
  CharacterCodes2[CharacterCodes2["r"] = 114] = "r";
  CharacterCodes2[CharacterCodes2["s"] = 115] = "s";
  CharacterCodes2[CharacterCodes2["t"] = 116] = "t";
  CharacterCodes2[CharacterCodes2["u"] = 117] = "u";
  CharacterCodes2[CharacterCodes2["v"] = 118] = "v";
  CharacterCodes2[CharacterCodes2["w"] = 119] = "w";
  CharacterCodes2[CharacterCodes2["x"] = 120] = "x";
  CharacterCodes2[CharacterCodes2["y"] = 121] = "y";
  CharacterCodes2[CharacterCodes2["z"] = 122] = "z";
  CharacterCodes2[CharacterCodes2["A"] = 65] = "A";
  CharacterCodes2[CharacterCodes2["B"] = 66] = "B";
  CharacterCodes2[CharacterCodes2["C"] = 67] = "C";
  CharacterCodes2[CharacterCodes2["D"] = 68] = "D";
  CharacterCodes2[CharacterCodes2["E"] = 69] = "E";
  CharacterCodes2[CharacterCodes2["F"] = 70] = "F";
  CharacterCodes2[CharacterCodes2["G"] = 71] = "G";
  CharacterCodes2[CharacterCodes2["H"] = 72] = "H";
  CharacterCodes2[CharacterCodes2["I"] = 73] = "I";
  CharacterCodes2[CharacterCodes2["J"] = 74] = "J";
  CharacterCodes2[CharacterCodes2["K"] = 75] = "K";
  CharacterCodes2[CharacterCodes2["L"] = 76] = "L";
  CharacterCodes2[CharacterCodes2["M"] = 77] = "M";
  CharacterCodes2[CharacterCodes2["N"] = 78] = "N";
  CharacterCodes2[CharacterCodes2["O"] = 79] = "O";
  CharacterCodes2[CharacterCodes2["P"] = 80] = "P";
  CharacterCodes2[CharacterCodes2["Q"] = 81] = "Q";
  CharacterCodes2[CharacterCodes2["R"] = 82] = "R";
  CharacterCodes2[CharacterCodes2["S"] = 83] = "S";
  CharacterCodes2[CharacterCodes2["T"] = 84] = "T";
  CharacterCodes2[CharacterCodes2["U"] = 85] = "U";
  CharacterCodes2[CharacterCodes2["V"] = 86] = "V";
  CharacterCodes2[CharacterCodes2["W"] = 87] = "W";
  CharacterCodes2[CharacterCodes2["X"] = 88] = "X";
  CharacterCodes2[CharacterCodes2["Y"] = 89] = "Y";
  CharacterCodes2[CharacterCodes2["Z"] = 90] = "Z";
  CharacterCodes2[CharacterCodes2["asterisk"] = 42] = "asterisk";
  CharacterCodes2[CharacterCodes2["backslash"] = 92] = "backslash";
  CharacterCodes2[CharacterCodes2["closeBrace"] = 125] = "closeBrace";
  CharacterCodes2[CharacterCodes2["closeBracket"] = 93] = "closeBracket";
  CharacterCodes2[CharacterCodes2["colon"] = 58] = "colon";
  CharacterCodes2[CharacterCodes2["comma"] = 44] = "comma";
  CharacterCodes2[CharacterCodes2["dot"] = 46] = "dot";
  CharacterCodes2[CharacterCodes2["doubleQuote"] = 34] = "doubleQuote";
  CharacterCodes2[CharacterCodes2["minus"] = 45] = "minus";
  CharacterCodes2[CharacterCodes2["openBrace"] = 123] = "openBrace";
  CharacterCodes2[CharacterCodes2["openBracket"] = 91] = "openBracket";
  CharacterCodes2[CharacterCodes2["plus"] = 43] = "plus";
  CharacterCodes2[CharacterCodes2["slash"] = 47] = "slash";
  CharacterCodes2[CharacterCodes2["formFeed"] = 12] = "formFeed";
  CharacterCodes2[CharacterCodes2["tab"] = 9] = "tab";
})(CharacterCodes || (CharacterCodes = {}));

// ../../node_modules/.pnpm/jsonc-parser@3.2.0/node_modules/jsonc-parser/lib/esm/impl/parser.js
var ParseOptions;
(function(ParseOptions2) {
  ParseOptions2.DEFAULT = {
    allowTrailingComma: false
  };
})(ParseOptions || (ParseOptions = {}));
function parse(text, errors = [], options = ParseOptions.DEFAULT) {
  let currentProperty = null;
  let currentParent = [];
  const previousParents = [];
  function onValue(value) {
    if (Array.isArray(currentParent)) {
      currentParent.push(value);
    } else if (currentProperty !== null) {
      currentParent[currentProperty] = value;
    }
  }
  __name(onValue, "onValue");
  const visitor = {
    onObjectBegin: /* @__PURE__ */ __name(() => {
      const object = {};
      onValue(object);
      previousParents.push(currentParent);
      currentParent = object;
      currentProperty = null;
    }, "onObjectBegin"),
    onObjectProperty: /* @__PURE__ */ __name((name) => {
      currentProperty = name;
    }, "onObjectProperty"),
    onObjectEnd: /* @__PURE__ */ __name(() => {
      currentParent = previousParents.pop();
    }, "onObjectEnd"),
    onArrayBegin: /* @__PURE__ */ __name(() => {
      const array = [];
      onValue(array);
      previousParents.push(currentParent);
      currentParent = array;
      currentProperty = null;
    }, "onArrayBegin"),
    onArrayEnd: /* @__PURE__ */ __name(() => {
      currentParent = previousParents.pop();
    }, "onArrayEnd"),
    onLiteralValue: onValue,
    onError: /* @__PURE__ */ __name((error, offset, length) => {
      errors.push({
        error,
        offset,
        length
      });
    }, "onError")
  };
  visit(text, visitor, options);
  return currentParent[0];
}
__name(parse, "parse");
function visit(text, visitor, options = ParseOptions.DEFAULT) {
  const _scanner = createScanner(text, false);
  const _jsonPath = [];
  function toNoArgVisit(visitFunction) {
    return visitFunction ? () => visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  __name(toNoArgVisit, "toNoArgVisit");
  function toNoArgVisitWithPath(visitFunction) {
    return visitFunction ? () => visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
  }
  __name(toNoArgVisitWithPath, "toNoArgVisitWithPath");
  function toOneArgVisit(visitFunction) {
    return visitFunction ? (arg) => visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  __name(toOneArgVisit, "toOneArgVisit");
  function toOneArgVisitWithPath(visitFunction) {
    return visitFunction ? (arg) => visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
  }
  __name(toOneArgVisitWithPath, "toOneArgVisitWithPath");
  const onObjectBegin = toNoArgVisitWithPath(visitor.onObjectBegin), onObjectProperty = toOneArgVisitWithPath(visitor.onObjectProperty), onObjectEnd = toNoArgVisit(visitor.onObjectEnd), onArrayBegin = toNoArgVisitWithPath(visitor.onArrayBegin), onArrayEnd = toNoArgVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisitWithPath(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
  const disallowComments = options && options.disallowComments;
  const allowTrailingComma = options && options.allowTrailingComma;
  function scanNext() {
    while (true) {
      const token = _scanner.scan();
      switch (_scanner.getTokenError()) {
        case 4:
          handleError(
            14
            /* ParseErrorCode.InvalidUnicode */
          );
          break;
        case 5:
          handleError(
            15
            /* ParseErrorCode.InvalidEscapeCharacter */
          );
          break;
        case 3:
          handleError(
            13
            /* ParseErrorCode.UnexpectedEndOfNumber */
          );
          break;
        case 1:
          if (!disallowComments) {
            handleError(
              11
              /* ParseErrorCode.UnexpectedEndOfComment */
            );
          }
          break;
        case 2:
          handleError(
            12
            /* ParseErrorCode.UnexpectedEndOfString */
          );
          break;
        case 6:
          handleError(
            16
            /* ParseErrorCode.InvalidCharacter */
          );
          break;
      }
      switch (token) {
        case 12:
        case 13:
          if (disallowComments) {
            handleError(
              10
              /* ParseErrorCode.InvalidCommentToken */
            );
          } else {
            onComment();
          }
          break;
        case 16:
          handleError(
            1
            /* ParseErrorCode.InvalidSymbol */
          );
          break;
        case 15:
        case 14:
          break;
        default:
          return token;
      }
    }
  }
  __name(scanNext, "scanNext");
  function handleError(error, skipUntilAfter = [], skipUntil = []) {
    onError(error);
    if (skipUntilAfter.length + skipUntil.length > 0) {
      let token = _scanner.getToken();
      while (token !== 17) {
        if (skipUntilAfter.indexOf(token) !== -1) {
          scanNext();
          break;
        } else if (skipUntil.indexOf(token) !== -1) {
          break;
        }
        token = scanNext();
      }
    }
  }
  __name(handleError, "handleError");
  function parseString(isValue) {
    const value = _scanner.getTokenValue();
    if (isValue) {
      onLiteralValue(value);
    } else {
      onObjectProperty(value);
      _jsonPath.push(value);
    }
    scanNext();
    return true;
  }
  __name(parseString, "parseString");
  function parseLiteral() {
    switch (_scanner.getToken()) {
      case 11:
        const tokenValue = _scanner.getTokenValue();
        let value = Number(tokenValue);
        if (isNaN(value)) {
          handleError(
            2
            /* ParseErrorCode.InvalidNumberFormat */
          );
          value = 0;
        }
        onLiteralValue(value);
        break;
      case 7:
        onLiteralValue(null);
        break;
      case 8:
        onLiteralValue(true);
        break;
      case 9:
        onLiteralValue(false);
        break;
      default:
        return false;
    }
    scanNext();
    return true;
  }
  __name(parseLiteral, "parseLiteral");
  function parseProperty() {
    if (_scanner.getToken() !== 10) {
      handleError(3, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
      return false;
    }
    parseString(false);
    if (_scanner.getToken() === 6) {
      onSeparator(":");
      scanNext();
      if (!parseValue()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
    } else {
      handleError(5, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
    }
    _jsonPath.pop();
    return true;
  }
  __name(parseProperty, "parseProperty");
  function parseObject() {
    onObjectBegin();
    scanNext();
    let needsComma = false;
    while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 2 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (!parseProperty()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onObjectEnd();
    if (_scanner.getToken() !== 2) {
      handleError(7, [
        2
        /* SyntaxKind.CloseBraceToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  __name(parseObject, "parseObject");
  function parseArray() {
    onArrayBegin();
    scanNext();
    let isFirstElement = true;
    let needsComma = false;
    while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 4 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (isFirstElement) {
        _jsonPath.push(0);
        isFirstElement = false;
      } else {
        _jsonPath[_jsonPath.length - 1]++;
      }
      if (!parseValue()) {
        handleError(4, [], [
          4,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onArrayEnd();
    if (!isFirstElement) {
      _jsonPath.pop();
    }
    if (_scanner.getToken() !== 4) {
      handleError(8, [
        4
        /* SyntaxKind.CloseBracketToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  __name(parseArray, "parseArray");
  function parseValue() {
    switch (_scanner.getToken()) {
      case 3:
        return parseArray();
      case 1:
        return parseObject();
      case 10:
        return parseString(true);
      default:
        return parseLiteral();
    }
  }
  __name(parseValue, "parseValue");
  scanNext();
  if (_scanner.getToken() === 17) {
    if (options.allowEmptyContent) {
      return true;
    }
    handleError(4, [], []);
    return false;
  }
  if (!parseValue()) {
    handleError(4, [], []);
    return false;
  }
  if (_scanner.getToken() !== 17) {
    handleError(9, [], []);
  }
  return true;
}
__name(visit, "visit");

// ../../node_modules/.pnpm/jsonc-parser@3.2.0/node_modules/jsonc-parser/lib/esm/main.js
var ScanError;
(function(ScanError2) {
  ScanError2[ScanError2["None"] = 0] = "None";
  ScanError2[ScanError2["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
  ScanError2[ScanError2["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
  ScanError2[ScanError2["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
  ScanError2[ScanError2["InvalidUnicode"] = 4] = "InvalidUnicode";
  ScanError2[ScanError2["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
  ScanError2[ScanError2["InvalidCharacter"] = 6] = "InvalidCharacter";
})(ScanError || (ScanError = {}));
var SyntaxKind;
(function(SyntaxKind2) {
  SyntaxKind2[SyntaxKind2["OpenBraceToken"] = 1] = "OpenBraceToken";
  SyntaxKind2[SyntaxKind2["CloseBraceToken"] = 2] = "CloseBraceToken";
  SyntaxKind2[SyntaxKind2["OpenBracketToken"] = 3] = "OpenBracketToken";
  SyntaxKind2[SyntaxKind2["CloseBracketToken"] = 4] = "CloseBracketToken";
  SyntaxKind2[SyntaxKind2["CommaToken"] = 5] = "CommaToken";
  SyntaxKind2[SyntaxKind2["ColonToken"] = 6] = "ColonToken";
  SyntaxKind2[SyntaxKind2["NullKeyword"] = 7] = "NullKeyword";
  SyntaxKind2[SyntaxKind2["TrueKeyword"] = 8] = "TrueKeyword";
  SyntaxKind2[SyntaxKind2["FalseKeyword"] = 9] = "FalseKeyword";
  SyntaxKind2[SyntaxKind2["StringLiteral"] = 10] = "StringLiteral";
  SyntaxKind2[SyntaxKind2["NumericLiteral"] = 11] = "NumericLiteral";
  SyntaxKind2[SyntaxKind2["LineCommentTrivia"] = 12] = "LineCommentTrivia";
  SyntaxKind2[SyntaxKind2["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
  SyntaxKind2[SyntaxKind2["LineBreakTrivia"] = 14] = "LineBreakTrivia";
  SyntaxKind2[SyntaxKind2["Trivia"] = 15] = "Trivia";
  SyntaxKind2[SyntaxKind2["Unknown"] = 16] = "Unknown";
  SyntaxKind2[SyntaxKind2["EOF"] = 17] = "EOF";
})(SyntaxKind || (SyntaxKind = {}));
var parse2 = parse;
var ParseErrorCode;
(function(ParseErrorCode2) {
  ParseErrorCode2[ParseErrorCode2["InvalidSymbol"] = 1] = "InvalidSymbol";
  ParseErrorCode2[ParseErrorCode2["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
  ParseErrorCode2[ParseErrorCode2["PropertyNameExpected"] = 3] = "PropertyNameExpected";
  ParseErrorCode2[ParseErrorCode2["ValueExpected"] = 4] = "ValueExpected";
  ParseErrorCode2[ParseErrorCode2["ColonExpected"] = 5] = "ColonExpected";
  ParseErrorCode2[ParseErrorCode2["CommaExpected"] = 6] = "CommaExpected";
  ParseErrorCode2[ParseErrorCode2["CloseBraceExpected"] = 7] = "CloseBraceExpected";
  ParseErrorCode2[ParseErrorCode2["CloseBracketExpected"] = 8] = "CloseBracketExpected";
  ParseErrorCode2[ParseErrorCode2["EndOfFileExpected"] = 9] = "EndOfFileExpected";
  ParseErrorCode2[ParseErrorCode2["InvalidCommentToken"] = 10] = "InvalidCommentToken";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
  ParseErrorCode2[ParseErrorCode2["InvalidUnicode"] = 14] = "InvalidUnicode";
  ParseErrorCode2[ParseErrorCode2["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
  ParseErrorCode2[ParseErrorCode2["InvalidCharacter"] = 16] = "InvalidCharacter";
})(ParseErrorCode || (ParseErrorCode = {}));
function printParseErrorCode(code) {
  switch (code) {
    case 1:
      return "InvalidSymbol";
    case 2:
      return "InvalidNumberFormat";
    case 3:
      return "PropertyNameExpected";
    case 4:
      return "ValueExpected";
    case 5:
      return "ColonExpected";
    case 6:
      return "CommaExpected";
    case 7:
      return "CloseBraceExpected";
    case 8:
      return "CloseBracketExpected";
    case 9:
      return "EndOfFileExpected";
    case 10:
      return "InvalidCommentToken";
    case 11:
      return "UnexpectedEndOfComment";
    case 12:
      return "UnexpectedEndOfString";
    case 13:
      return "UnexpectedEndOfNumber";
    case 14:
      return "InvalidUnicode";
    case 15:
      return "InvalidEscapeCharacter";
    case 16:
      return "InvalidCharacter";
  }
  return "<unknown ParseErrorCode>";
}
__name(printParseErrorCode, "printParseErrorCode");

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/double-indexed-kv.js
var DoubleIndexedKV = class {
  static {
    __name(this, "DoubleIndexedKV");
  }
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map();
    this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(key, value) {
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  }
  getByKey(key) {
    return this.keyToValue.get(key);
  }
  getByValue(value) {
    return this.valueToKey.get(value);
  }
  clear() {
    this.keyToValue.clear();
    this.valueToKey.clear();
  }
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/registry.js
var Registry = class {
  static {
    __name(this, "Registry");
  }
  constructor(generateIdentifier) {
    this.generateIdentifier = generateIdentifier;
    this.kv = new DoubleIndexedKV();
  }
  register(value, identifier) {
    if (this.kv.getByValue(value)) {
      return;
    }
    if (!identifier) {
      identifier = this.generateIdentifier(value);
    }
    this.kv.set(identifier, value);
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(value) {
    return this.kv.getByValue(value);
  }
  getValue(identifier) {
    return this.kv.getByKey(identifier);
  }
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/class-registry.js
var ClassRegistry = class extends Registry {
  static {
    __name(this, "ClassRegistry");
  }
  constructor() {
    super((c) => c.name);
    this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(value, options) {
    if (typeof options === "object") {
      if (options.allowProps) {
        this.classToAllowedProps.set(value, options.allowProps);
      }
      super.register(value, options.identifier);
    } else {
      super.register(value, options);
    }
  }
  getAllowedProps(value) {
    return this.classToAllowedProps.get(value);
  }
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/util.js
function valuesOfObj(record) {
  if ("values" in Object) {
    return Object.values(record);
  }
  const values = [];
  for (const key in record) {
    if (record.hasOwnProperty(key)) {
      values.push(record[key]);
    }
  }
  return values;
}
__name(valuesOfObj, "valuesOfObj");
function find(record, predicate) {
  const values = valuesOfObj(record);
  if ("find" in values) {
    return values.find(predicate);
  }
  const valuesNotNever = values;
  for (let i = 0; i < valuesNotNever.length; i++) {
    const value = valuesNotNever[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
__name(find, "find");
function forEach(record, run) {
  Object.entries(record).forEach(([key, value]) => run(value, key));
}
__name(forEach, "forEach");
function includes(arr, value) {
  return arr.indexOf(value) !== -1;
}
__name(includes, "includes");
function findArr(record, predicate) {
  for (let i = 0; i < record.length; i++) {
    const value = record[i];
    if (predicate(value)) {
      return value;
    }
  }
  return void 0;
}
__name(findArr, "findArr");

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/custom-transformer-registry.js
var CustomTransformerRegistry = class {
  static {
    __name(this, "CustomTransformerRegistry");
  }
  constructor() {
    this.transfomers = {};
  }
  register(transformer) {
    this.transfomers[transformer.name] = transformer;
  }
  findApplicable(v) {
    return find(this.transfomers, (transformer) => transformer.isApplicable(v));
  }
  findByName(name) {
    return this.transfomers[name];
  }
};

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/is.js
var getType = /* @__PURE__ */ __name((payload) => Object.prototype.toString.call(payload).slice(8, -1), "getType");
var isUndefined = /* @__PURE__ */ __name((payload) => typeof payload === "undefined", "isUndefined");
var isNull = /* @__PURE__ */ __name((payload) => payload === null, "isNull");
var isPlainObject = /* @__PURE__ */ __name((payload) => {
  if (typeof payload !== "object" || payload === null) return false;
  if (payload === Object.prototype) return false;
  if (Object.getPrototypeOf(payload) === null) return true;
  return Object.getPrototypeOf(payload) === Object.prototype;
}, "isPlainObject");
var isEmptyObject = /* @__PURE__ */ __name((payload) => isPlainObject(payload) && Object.keys(payload).length === 0, "isEmptyObject");
var isArray = /* @__PURE__ */ __name((payload) => Array.isArray(payload), "isArray");
var isString = /* @__PURE__ */ __name((payload) => typeof payload === "string", "isString");
var isNumber = /* @__PURE__ */ __name((payload) => typeof payload === "number" && !isNaN(payload), "isNumber");
var isBoolean = /* @__PURE__ */ __name((payload) => typeof payload === "boolean", "isBoolean");
var isRegExp = /* @__PURE__ */ __name((payload) => payload instanceof RegExp, "isRegExp");
var isMap = /* @__PURE__ */ __name((payload) => payload instanceof Map, "isMap");
var isSet = /* @__PURE__ */ __name((payload) => payload instanceof Set, "isSet");
var isSymbol = /* @__PURE__ */ __name((payload) => getType(payload) === "Symbol", "isSymbol");
var isDate = /* @__PURE__ */ __name((payload) => payload instanceof Date && !isNaN(payload.valueOf()), "isDate");
var isError = /* @__PURE__ */ __name((payload) => payload instanceof Error, "isError");
var isNaNValue = /* @__PURE__ */ __name((payload) => typeof payload === "number" && isNaN(payload), "isNaNValue");
var isPrimitive = /* @__PURE__ */ __name((payload) => isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload), "isPrimitive");
var isBigint = /* @__PURE__ */ __name((payload) => typeof payload === "bigint", "isBigint");
var isInfinite = /* @__PURE__ */ __name((payload) => payload === Infinity || payload === -Infinity, "isInfinite");
var isTypedArray = /* @__PURE__ */ __name((payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView), "isTypedArray");
var isURL = /* @__PURE__ */ __name((payload) => payload instanceof URL, "isURL");

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/pathstringifier.js
var escapeKey = /* @__PURE__ */ __name((key) => key.replace(/\./g, "\\."), "escapeKey");
var stringifyPath = /* @__PURE__ */ __name((path2) => path2.map(String).map(escapeKey).join("."), "stringifyPath");
var parsePath = /* @__PURE__ */ __name((string) => {
  const result = [];
  let segment = "";
  for (let i = 0; i < string.length; i++) {
    let char = string.charAt(i);
    const isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
    if (isEscapedDot) {
      segment += ".";
      i++;
      continue;
    }
    const isEndOfSegment = char === ".";
    if (isEndOfSegment) {
      result.push(segment);
      segment = "";
      continue;
    }
    segment += char;
  }
  const lastSegment = segment;
  result.push(lastSegment);
  return result;
}, "parsePath");

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/transformer.js
function simpleTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
__name(simpleTransformation, "simpleTransformation");
var simpleRules = [
  simpleTransformation(isUndefined, "undefined", () => null, () => void 0),
  simpleTransformation(isBigint, "bigint", (v) => v.toString(), (v) => {
    if (typeof BigInt !== "undefined") {
      return BigInt(v);
    }
    console.error("Please add a BigInt polyfill.");
    return v;
  }),
  simpleTransformation(isDate, "Date", (v) => v.toISOString(), (v) => new Date(v)),
  simpleTransformation(isError, "Error", (v, superJson) => {
    const baseError = {
      name: v.name,
      message: v.message
    };
    superJson.allowedErrorProps.forEach((prop) => {
      baseError[prop] = v[prop];
    });
    return baseError;
  }, (v, superJson) => {
    const e = new Error(v.message);
    e.name = v.name;
    e.stack = v.stack;
    superJson.allowedErrorProps.forEach((prop) => {
      e[prop] = v[prop];
    });
    return e;
  }),
  simpleTransformation(isRegExp, "regexp", (v) => "" + v, (regex) => {
    const body = regex.slice(1, regex.lastIndexOf("/"));
    const flags = regex.slice(regex.lastIndexOf("/") + 1);
    return new RegExp(body, flags);
  }),
  simpleTransformation(
    isSet,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (v) => [
      ...v.values()
    ],
    (v) => new Set(v)
  ),
  simpleTransformation(isMap, "map", (v) => [
    ...v.entries()
  ], (v) => new Map(v)),
  simpleTransformation((v) => isNaNValue(v) || isInfinite(v), "number", (v) => {
    if (isNaNValue(v)) {
      return "NaN";
    }
    if (v > 0) {
      return "Infinity";
    } else {
      return "-Infinity";
    }
  }, Number),
  simpleTransformation((v) => v === 0 && 1 / v === -Infinity, "number", () => {
    return "-0";
  }, Number),
  simpleTransformation(isURL, "URL", (v) => v.toString(), (v) => new URL(v))
];
function compositeTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
__name(compositeTransformation, "compositeTransformation");
var symbolRule = compositeTransformation((s, superJson) => {
  if (isSymbol(s)) {
    const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
    return isRegistered;
  }
  return false;
}, (s, superJson) => {
  const identifier = superJson.symbolRegistry.getIdentifier(s);
  return [
    "symbol",
    identifier
  ];
}, (v) => v.description, (_, a, superJson) => {
  const value = superJson.symbolRegistry.getValue(a[1]);
  if (!value) {
    throw new Error("Trying to deserialize unknown symbol");
  }
  return value;
});
var constructorToName = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((obj, ctor) => {
  obj[ctor.name] = ctor;
  return obj;
}, {});
var typedArrayRule = compositeTransformation(isTypedArray, (v) => [
  "typed-array",
  v.constructor.name
], (v) => [
  ...v
], (v, a) => {
  const ctor = constructorToName[a[1]];
  if (!ctor) {
    throw new Error("Trying to deserialize unknown typed array");
  }
  return new ctor(v);
});
function isInstanceOfRegisteredClass(potentialClass, superJson) {
  if (potentialClass?.constructor) {
    const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
    return isRegistered;
  }
  return false;
}
__name(isInstanceOfRegisteredClass, "isInstanceOfRegisteredClass");
var classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
  const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
  return [
    "class",
    identifier
  ];
}, (clazz, superJson) => {
  const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
  if (!allowedProps) {
    return {
      ...clazz
    };
  }
  const result = {};
  allowedProps.forEach((prop) => {
    result[prop] = clazz[prop];
  });
  return result;
}, (v, a, superJson) => {
  const clazz = superJson.classRegistry.getValue(a[1]);
  if (!clazz) {
    throw new Error(`Trying to deserialize unknown class '${a[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
  }
  return Object.assign(Object.create(clazz.prototype), v);
});
var customRule = compositeTransformation((value, superJson) => {
  return !!superJson.customTransformerRegistry.findApplicable(value);
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return [
    "custom",
    transformer.name
  ];
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return transformer.serialize(value);
}, (v, a, superJson) => {
  const transformer = superJson.customTransformerRegistry.findByName(a[1]);
  if (!transformer) {
    throw new Error("Trying to deserialize unknown custom value");
  }
  return transformer.deserialize(v);
});
var compositeRules = [
  classRule,
  symbolRule,
  customRule,
  typedArrayRule
];
var transformValue = /* @__PURE__ */ __name((value, superJson) => {
  const applicableCompositeRule = findArr(compositeRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableCompositeRule) {
    return {
      value: applicableCompositeRule.transform(value, superJson),
      type: applicableCompositeRule.annotation(value, superJson)
    };
  }
  const applicableSimpleRule = findArr(simpleRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableSimpleRule) {
    return {
      value: applicableSimpleRule.transform(value, superJson),
      type: applicableSimpleRule.annotation
    };
  }
  return void 0;
}, "transformValue");
var simpleRulesByAnnotation = {};
simpleRules.forEach((rule) => {
  simpleRulesByAnnotation[rule.annotation] = rule;
});
var untransformValue = /* @__PURE__ */ __name((json, type, superJson) => {
  if (isArray(type)) {
    switch (type[0]) {
      case "symbol":
        return symbolRule.untransform(json, type, superJson);
      case "class":
        return classRule.untransform(json, type, superJson);
      case "custom":
        return customRule.untransform(json, type, superJson);
      case "typed-array":
        return typedArrayRule.untransform(json, type, superJson);
      default:
        throw new Error("Unknown transformation: " + type);
    }
  } else {
    const transformation = simpleRulesByAnnotation[type];
    if (!transformation) {
      throw new Error("Unknown transformation: " + type);
    }
    return transformation.untransform(json, superJson);
  }
}, "untransformValue");

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/accessDeep.js
var getNthKey = /* @__PURE__ */ __name((value, n) => {
  if (n > value.size) throw new Error("index out of bounds");
  const keys = value.keys();
  while (n > 0) {
    keys.next();
    n--;
  }
  return keys.next().value;
}, "getNthKey");
function validatePath(path2) {
  if (includes(path2, "__proto__")) {
    throw new Error("__proto__ is not allowed as a property");
  }
  if (includes(path2, "prototype")) {
    throw new Error("prototype is not allowed as a property");
  }
  if (includes(path2, "constructor")) {
    throw new Error("constructor is not allowed as a property");
  }
}
__name(validatePath, "validatePath");
var getDeep = /* @__PURE__ */ __name((object, path2) => {
  validatePath(path2);
  for (let i = 0; i < path2.length; i++) {
    const key = path2[i];
    if (isSet(object)) {
      object = getNthKey(object, +key);
    } else if (isMap(object)) {
      const row = +key;
      const type = +path2[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(object, row);
      switch (type) {
        case "key":
          object = keyOfRow;
          break;
        case "value":
          object = object.get(keyOfRow);
          break;
      }
    } else {
      object = object[key];
    }
  }
  return object;
}, "getDeep");
var setDeep = /* @__PURE__ */ __name((object, path2, mapper) => {
  validatePath(path2);
  if (path2.length === 0) {
    return mapper(object);
  }
  let parent = object;
  for (let i = 0; i < path2.length - 1; i++) {
    const key = path2[i];
    if (isArray(parent)) {
      const index = +key;
      parent = parent[index];
    } else if (isPlainObject(parent)) {
      parent = parent[key];
    } else if (isSet(parent)) {
      const row = +key;
      parent = getNthKey(parent, row);
    } else if (isMap(parent)) {
      const isEnd = i === path2.length - 2;
      if (isEnd) {
        break;
      }
      const row = +key;
      const type = +path2[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(parent, row);
      switch (type) {
        case "key":
          parent = keyOfRow;
          break;
        case "value":
          parent = parent.get(keyOfRow);
          break;
      }
    }
  }
  const lastKey = path2[path2.length - 1];
  if (isArray(parent)) {
    parent[+lastKey] = mapper(parent[+lastKey]);
  } else if (isPlainObject(parent)) {
    parent[lastKey] = mapper(parent[lastKey]);
  }
  if (isSet(parent)) {
    const oldValue = getNthKey(parent, +lastKey);
    const newValue = mapper(oldValue);
    if (oldValue !== newValue) {
      parent.delete(oldValue);
      parent.add(newValue);
    }
  }
  if (isMap(parent)) {
    const row = +path2[path2.length - 2];
    const keyToRow = getNthKey(parent, row);
    const type = +lastKey === 0 ? "key" : "value";
    switch (type) {
      case "key": {
        const newKey = mapper(keyToRow);
        parent.set(newKey, parent.get(keyToRow));
        if (newKey !== keyToRow) {
          parent.delete(keyToRow);
        }
        break;
      }
      case "value": {
        parent.set(keyToRow, mapper(parent.get(keyToRow)));
        break;
      }
    }
  }
  return object;
}, "setDeep");

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/plainer.js
function traverse(tree, walker2, origin = []) {
  if (!tree) {
    return;
  }
  if (!isArray(tree)) {
    forEach(tree, (subtree, key) => traverse(subtree, walker2, [
      ...origin,
      ...parsePath(key)
    ]));
    return;
  }
  const [nodeValue, children] = tree;
  if (children) {
    forEach(children, (child, key) => {
      traverse(child, walker2, [
        ...origin,
        ...parsePath(key)
      ]);
    });
  }
  walker2(nodeValue, origin);
}
__name(traverse, "traverse");
function applyValueAnnotations(plain, annotations, superJson) {
  traverse(annotations, (type, path2) => {
    plain = setDeep(plain, path2, (v) => untransformValue(v, type, superJson));
  });
  return plain;
}
__name(applyValueAnnotations, "applyValueAnnotations");
function applyReferentialEqualityAnnotations(plain, annotations) {
  function apply(identicalPaths, path2) {
    const object = getDeep(plain, parsePath(path2));
    identicalPaths.map(parsePath).forEach((identicalObjectPath) => {
      plain = setDeep(plain, identicalObjectPath, () => object);
    });
  }
  __name(apply, "apply");
  if (isArray(annotations)) {
    const [root, other] = annotations;
    root.forEach((identicalPath) => {
      plain = setDeep(plain, parsePath(identicalPath), () => plain);
    });
    if (other) {
      forEach(other, apply);
    }
  } else {
    forEach(annotations, apply);
  }
  return plain;
}
__name(applyReferentialEqualityAnnotations, "applyReferentialEqualityAnnotations");
var isDeep = /* @__PURE__ */ __name((object, superJson) => isPlainObject(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson), "isDeep");
function addIdentity(object, path2, identities) {
  const existingSet = identities.get(object);
  if (existingSet) {
    existingSet.push(path2);
  } else {
    identities.set(object, [
      path2
    ]);
  }
}
__name(addIdentity, "addIdentity");
function generateReferentialEqualityAnnotations(identitites, dedupe) {
  const result = {};
  let rootEqualityPaths = void 0;
  identitites.forEach((paths) => {
    if (paths.length <= 1) {
      return;
    }
    if (!dedupe) {
      paths = paths.map((path2) => path2.map(String)).sort((a, b) => a.length - b.length);
    }
    const [representativePath, ...identicalPaths] = paths;
    if (representativePath.length === 0) {
      rootEqualityPaths = identicalPaths.map(stringifyPath);
    } else {
      result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
    }
  });
  if (rootEqualityPaths) {
    if (isEmptyObject(result)) {
      return [
        rootEqualityPaths
      ];
    } else {
      return [
        rootEqualityPaths,
        result
      ];
    }
  } else {
    return isEmptyObject(result) ? void 0 : result;
  }
}
__name(generateReferentialEqualityAnnotations, "generateReferentialEqualityAnnotations");
var walker = /* @__PURE__ */ __name((object, identities, superJson, dedupe, path2 = [], objectsInThisPath = [], seenObjects = /* @__PURE__ */ new Map()) => {
  const primitive = isPrimitive(object);
  if (!primitive) {
    addIdentity(object, path2, identities);
    const seen = seenObjects.get(object);
    if (seen) {
      return dedupe ? {
        transformedValue: null
      } : seen;
    }
  }
  if (!isDeep(object, superJson)) {
    const transformed2 = transformValue(object, superJson);
    const result2 = transformed2 ? {
      transformedValue: transformed2.value,
      annotations: [
        transformed2.type
      ]
    } : {
      transformedValue: object
    };
    if (!primitive) {
      seenObjects.set(object, result2);
    }
    return result2;
  }
  if (includes(objectsInThisPath, object)) {
    return {
      transformedValue: null
    };
  }
  const transformationResult = transformValue(object, superJson);
  const transformed = transformationResult?.value ?? object;
  const transformedValue = isArray(transformed) ? [] : {};
  const innerAnnotations = {};
  forEach(transformed, (value, index) => {
    if (index === "__proto__" || index === "constructor" || index === "prototype") {
      throw new Error(`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`);
    }
    const recursiveResult = walker(value, identities, superJson, dedupe, [
      ...path2,
      index
    ], [
      ...objectsInThisPath,
      object
    ], seenObjects);
    transformedValue[index] = recursiveResult.transformedValue;
    if (isArray(recursiveResult.annotations)) {
      innerAnnotations[index] = recursiveResult.annotations;
    } else if (isPlainObject(recursiveResult.annotations)) {
      forEach(recursiveResult.annotations, (tree, key) => {
        innerAnnotations[escapeKey(index) + "." + key] = tree;
      });
    }
  });
  const result = isEmptyObject(innerAnnotations) ? {
    transformedValue,
    annotations: !!transformationResult ? [
      transformationResult.type
    ] : void 0
  } : {
    transformedValue,
    annotations: !!transformationResult ? [
      transformationResult.type,
      innerAnnotations
    ] : innerAnnotations
  };
  if (!primitive) {
    seenObjects.set(object, result);
  }
  return result;
}, "walker");

// ../../node_modules/.pnpm/is-what@4.1.16/node_modules/is-what/dist/index.js
function getType2(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}
__name(getType2, "getType");
function isArray2(payload) {
  return getType2(payload) === "Array";
}
__name(isArray2, "isArray");
function isPlainObject2(payload) {
  if (getType2(payload) !== "Object") return false;
  const prototype = Object.getPrototypeOf(payload);
  return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}
__name(isPlainObject2, "isPlainObject");
function isNull2(payload) {
  return getType2(payload) === "Null";
}
__name(isNull2, "isNull");
function isOneOf(a, b, c, d, e) {
  return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
}
__name(isOneOf, "isOneOf");
function isUndefined2(payload) {
  return getType2(payload) === "Undefined";
}
__name(isUndefined2, "isUndefined");

// ../../node_modules/.pnpm/copy-anything@3.0.5/node_modules/copy-anything/dist/index.js
function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable") carry[key] = newVal;
  if (includeNonenumerable && propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
__name(assignProp, "assignProp");
function copy(target, options = {}) {
  if (isArray2(target)) {
    return target.map((item) => copy(item, options));
  }
  if (!isPlainObject2(target)) {
    return target;
  }
  const props = Object.getOwnPropertyNames(target);
  const symbols = Object.getOwnPropertySymbols(target);
  return [
    ...props,
    ...symbols
  ].reduce((carry, key) => {
    if (isArray2(options.props) && !options.props.includes(key)) {
      return carry;
    }
    const val = target[key];
    const newVal = copy(val, options);
    assignProp(carry, key, newVal, target, options.nonenumerable);
    return carry;
  }, {});
}
__name(copy, "copy");

// ../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.js
var SuperJSON = class {
  static {
    __name(this, "SuperJSON");
  }
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe = false } = {}) {
    this.classRegistry = new ClassRegistry();
    this.symbolRegistry = new Registry((s) => s.description ?? "");
    this.customTransformerRegistry = new CustomTransformerRegistry();
    this.allowedErrorProps = [];
    this.dedupe = dedupe;
  }
  serialize(object) {
    const identities = /* @__PURE__ */ new Map();
    const output = walker(object, identities, this, this.dedupe);
    const res = {
      json: output.transformedValue
    };
    if (output.annotations) {
      res.meta = {
        ...res.meta,
        values: output.annotations
      };
    }
    const equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
    if (equalityAnnotations) {
      res.meta = {
        ...res.meta,
        referentialEqualities: equalityAnnotations
      };
    }
    return res;
  }
  deserialize(payload) {
    const { json, meta } = payload;
    let result = copy(json);
    if (meta?.values) {
      result = applyValueAnnotations(result, meta.values, this);
    }
    if (meta?.referentialEqualities) {
      result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
    }
    return result;
  }
  stringify(object) {
    return JSON.stringify(this.serialize(object));
  }
  parse(string) {
    return this.deserialize(JSON.parse(string));
  }
  registerClass(v, options) {
    this.classRegistry.register(v, options);
  }
  registerSymbol(v, identifier) {
    this.symbolRegistry.register(v, identifier);
  }
  registerCustom(transformer, name) {
    this.customTransformerRegistry.register({
      name,
      ...transformer
    });
  }
  allowErrorProps(...props) {
    this.allowedErrorProps.push(...props);
  }
};
SuperJSON.defaultInstance = new SuperJSON();
SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
SuperJSON.serialize;
SuperJSON.deserialize;
SuperJSON.stringify;
SuperJSON.parse;
SuperJSON.registerClass;
SuperJSON.registerCustom;
SuperJSON.registerSymbol;
SuperJSON.allowErrorProps;

// ../../node_modules/.pnpm/lines-and-columns@2.0.4/node_modules/lines-and-columns/build/index.mjs
var LF = "\n";
var CR = "\r";
var LinesAndColumns = (
  /** @class */
  (function() {
    function LinesAndColumns2(string) {
      this.length = string.length;
      var offsets = [0];
      for (var offset = 0; offset < string.length; ) {
        switch (string[offset]) {
          case LF:
            offset += LF.length;
            offsets.push(offset);
            break;
          case CR:
            offset += CR.length;
            if (string[offset] === LF) {
              offset += LF.length;
            }
            offsets.push(offset);
            break;
          default:
            offset++;
            break;
        }
      }
      this.offsets = offsets;
    }
    __name(LinesAndColumns2, "LinesAndColumns");
    LinesAndColumns2.prototype.locationForIndex = function(index) {
      if (index < 0 || index > this.length) {
        return null;
      }
      var line = 0;
      var offsets = this.offsets;
      while (offsets[line + 1] <= index) {
        line++;
      }
      var column = index - offsets[line];
      return { line, column };
    };
    LinesAndColumns2.prototype.indexForLocation = function(location) {
      var line = location.line, column = location.column;
      if (line < 0 || line >= this.offsets.length) {
        return null;
      }
      if (column < 0 || column > this.lengthOfLine(line)) {
        return null;
      }
      return this.offsets[line] + column;
    };
    LinesAndColumns2.prototype.lengthOfLine = function(line) {
      var offset = this.offsets[line];
      var nextOffset = line === this.offsets.length - 1 ? this.length : this.offsets[line + 1];
      return nextOffset - offset;
    };
    return LinesAndColumns2;
  })()
);

// ../../node_modules/.pnpm/@isaacs+balanced-match@4.0.1/node_modules/@isaacs/balanced-match/dist/esm/index.js
var balanced = /* @__PURE__ */ __name((a, b, str) => {
  const ma = a instanceof RegExp ? maybeMatch(a, str) : a;
  const mb = b instanceof RegExp ? maybeMatch(b, str) : b;
  const r = ma !== null && mb != null && range(ma, mb, str);
  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + ma.length, r[1]),
    post: str.slice(r[1] + mb.length)
  };
}, "balanced");
var maybeMatch = /* @__PURE__ */ __name((reg, str) => {
  const m = str.match(reg);
  return m ? m[0] : null;
}, "maybeMatch");
var range = /* @__PURE__ */ __name((a, b, str) => {
  let begs, beg, left, right = void 0, result;
  let ai = str.indexOf(a);
  let bi = str.indexOf(b, ai + 1);
  let i = ai;
  if (ai >= 0 && bi > 0) {
    if (a === b) {
      return [
        ai,
        bi
      ];
    }
    begs = [];
    left = str.length;
    while (i >= 0 && !result) {
      if (i === ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length === 1) {
        const r = begs.pop();
        if (r !== void 0) result = [
          r,
          bi
        ];
      } else {
        beg = begs.pop();
        if (beg !== void 0 && beg < left) {
          left = beg;
          right = bi;
        }
        bi = str.indexOf(b, i + 1);
      }
      i = ai < bi && ai >= 0 ? ai : bi;
    }
    if (begs.length && right !== void 0) {
      result = [
        left,
        right
      ];
    }
  }
  return result;
}, "range");

// ../../node_modules/.pnpm/@isaacs+brace-expansion@5.0.0/node_modules/@isaacs/brace-expansion/dist/esm/index.js
var escSlash = "\0SLASH" + Math.random() + "\0";
var escOpen = "\0OPEN" + Math.random() + "\0";
var escClose = "\0CLOSE" + Math.random() + "\0";
var escComma = "\0COMMA" + Math.random() + "\0";
var escPeriod = "\0PERIOD" + Math.random() + "\0";
var escSlashPattern = new RegExp(escSlash, "g");
var escOpenPattern = new RegExp(escOpen, "g");
var escClosePattern = new RegExp(escClose, "g");
var escCommaPattern = new RegExp(escComma, "g");
var escPeriodPattern = new RegExp(escPeriod, "g");
var slashPattern = /\\\\/g;
var openPattern = /\\{/g;
var closePattern = /\\}/g;
var commaPattern = /\\,/g;
var periodPattern = /\\./g;
function numeric(str) {
  return !isNaN(str) ? parseInt(str, 10) : str.charCodeAt(0);
}
__name(numeric, "numeric");
function escapeBraces(str) {
  return str.replace(slashPattern, escSlash).replace(openPattern, escOpen).replace(closePattern, escClose).replace(commaPattern, escComma).replace(periodPattern, escPeriod);
}
__name(escapeBraces, "escapeBraces");
function unescapeBraces(str) {
  return str.replace(escSlashPattern, "\\").replace(escOpenPattern, "{").replace(escClosePattern, "}").replace(escCommaPattern, ",").replace(escPeriodPattern, ".");
}
__name(unescapeBraces, "unescapeBraces");
function parseCommaParts(str) {
  if (!str) {
    return [
      ""
    ];
  }
  const parts = [];
  const m = balanced("{", "}", str);
  if (!m) {
    return str.split(",");
  }
  const { pre, body, post } = m;
  const p = pre.split(",");
  p[p.length - 1] += "{" + body + "}";
  const postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length - 1] += postParts.shift();
    p.push.apply(p, postParts);
  }
  parts.push.apply(parts, p);
  return parts;
}
__name(parseCommaParts, "parseCommaParts");
function expand(str) {
  if (!str) {
    return [];
  }
  if (str.slice(0, 2) === "{}") {
    str = "\\{\\}" + str.slice(2);
  }
  return expand_(escapeBraces(str), true).map(unescapeBraces);
}
__name(expand, "expand");
function embrace(str) {
  return "{" + str + "}";
}
__name(embrace, "embrace");
function isPadded(el) {
  return /^-?0\d/.test(el);
}
__name(isPadded, "isPadded");
function lte(i, y) {
  return i <= y;
}
__name(lte, "lte");
function gte(i, y) {
  return i >= y;
}
__name(gte, "gte");
function expand_(str, isTop) {
  const expansions = [];
  const m = balanced("{", "}", str);
  if (!m) return [
    str
  ];
  const pre = m.pre;
  const post = m.post.length ? expand_(m.post, false) : [
    ""
  ];
  if (/\$$/.test(m.pre)) {
    for (let k = 0; k < post.length; k++) {
      const expansion = pre + "{" + m.body + "}" + post[k];
      expansions.push(expansion);
    }
  } else {
    const isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    const isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    const isSequence = isNumericSequence || isAlphaSequence;
    const isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions) {
      if (m.post.match(/,(?!,).*\}/)) {
        str = m.pre + "{" + m.body + escClose + m.post;
        return expand_(str);
      }
      return [
        str
      ];
    }
    let n;
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1 && n[0] !== void 0) {
        n = expand_(n[0], false).map(embrace);
        if (n.length === 1) {
          return post.map((p) => m.pre + n[0] + p);
        }
      }
    }
    let N;
    if (isSequence && n[0] !== void 0 && n[1] !== void 0) {
      const x = numeric(n[0]);
      const y = numeric(n[1]);
      const width = Math.max(n[0].length, n[1].length);
      let incr = n.length === 3 && n[2] !== void 0 ? Math.abs(numeric(n[2])) : 1;
      let test = lte;
      const reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      const pad2 = n.some(isPadded);
      N = [];
      for (let i = x; test(i, y); i += incr) {
        let c;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === "\\") {
            c = "";
          }
        } else {
          c = String(i);
          if (pad2) {
            const need = width - c.length;
            if (need > 0) {
              const z = new Array(need + 1).join("0");
              if (i < 0) {
                c = "-" + z + c.slice(1);
              } else {
                c = z + c;
              }
            }
          }
        }
        N.push(c);
      }
    } else {
      N = [];
      for (let j = 0; j < n.length; j++) {
        N.push.apply(N, expand_(n[j], false));
      }
    }
    for (let j = 0; j < N.length; j++) {
      for (let k = 0; k < post.length; k++) {
        const expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion) {
          expansions.push(expansion);
        }
      }
    }
  }
  return expansions;
}
__name(expand_, "expand_");

// ../../node_modules/.pnpm/minimatch@10.0.3/node_modules/minimatch/dist/esm/assert-valid-pattern.js
var MAX_PATTERN_LENGTH = 1024 * 64;
var assertValidPattern = /* @__PURE__ */ __name((pattern) => {
  if (typeof pattern !== "string") {
    throw new TypeError("invalid pattern");
  }
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError("pattern is too long");
  }
}, "assertValidPattern");

// ../../node_modules/.pnpm/minimatch@10.0.3/node_modules/minimatch/dist/esm/brace-expressions.js
var posixClasses = {
  "[:alnum:]": [
    "\\p{L}\\p{Nl}\\p{Nd}",
    true
  ],
  "[:alpha:]": [
    "\\p{L}\\p{Nl}",
    true
  ],
  "[:ascii:]": [
    "\\x00-\\x7f",
    false
  ],
  "[:blank:]": [
    "\\p{Zs}\\t",
    true
  ],
  "[:cntrl:]": [
    "\\p{Cc}",
    true
  ],
  "[:digit:]": [
    "\\p{Nd}",
    true
  ],
  "[:graph:]": [
    "\\p{Z}\\p{C}",
    true,
    true
  ],
  "[:lower:]": [
    "\\p{Ll}",
    true
  ],
  "[:print:]": [
    "\\p{C}",
    true
  ],
  "[:punct:]": [
    "\\p{P}",
    true
  ],
  "[:space:]": [
    "\\p{Z}\\t\\r\\n\\v\\f",
    true
  ],
  "[:upper:]": [
    "\\p{Lu}",
    true
  ],
  "[:word:]": [
    "\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}",
    true
  ],
  "[:xdigit:]": [
    "A-Fa-f0-9",
    false
  ]
};
var braceEscape = /* @__PURE__ */ __name((s) => s.replace(/[[\]\\-]/g, "\\$&"), "braceEscape");
var regexpEscape = /* @__PURE__ */ __name((s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "regexpEscape");
var rangesToString = /* @__PURE__ */ __name((ranges) => ranges.join(""), "rangesToString");
var parseClass = /* @__PURE__ */ __name((glob2, position) => {
  const pos = position;
  if (glob2.charAt(pos) !== "[") {
    throw new Error("not in a brace expression");
  }
  const ranges = [];
  const negs = [];
  let i = pos + 1;
  let sawStart = false;
  let uflag = false;
  let escaping = false;
  let negate = false;
  let endPos = pos;
  let rangeStart = "";
  WHILE: while (i < glob2.length) {
    const c = glob2.charAt(i);
    if ((c === "!" || c === "^") && i === pos + 1) {
      negate = true;
      i++;
      continue;
    }
    if (c === "]" && sawStart && !escaping) {
      endPos = i + 1;
      break;
    }
    sawStart = true;
    if (c === "\\") {
      if (!escaping) {
        escaping = true;
        i++;
        continue;
      }
    }
    if (c === "[" && !escaping) {
      for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
        if (glob2.startsWith(cls, i)) {
          if (rangeStart) {
            return [
              "$.",
              false,
              glob2.length - pos,
              true
            ];
          }
          i += cls.length;
          if (neg) negs.push(unip);
          else ranges.push(unip);
          uflag = uflag || u;
          continue WHILE;
        }
      }
    }
    escaping = false;
    if (rangeStart) {
      if (c > rangeStart) {
        ranges.push(braceEscape(rangeStart) + "-" + braceEscape(c));
      } else if (c === rangeStart) {
        ranges.push(braceEscape(c));
      }
      rangeStart = "";
      i++;
      continue;
    }
    if (glob2.startsWith("-]", i + 1)) {
      ranges.push(braceEscape(c + "-"));
      i += 2;
      continue;
    }
    if (glob2.startsWith("-", i + 1)) {
      rangeStart = c;
      i += 2;
      continue;
    }
    ranges.push(braceEscape(c));
    i++;
  }
  if (endPos < i) {
    return [
      "",
      false,
      0,
      false
    ];
  }
  if (!ranges.length && !negs.length) {
    return [
      "$.",
      false,
      glob2.length - pos,
      true
    ];
  }
  if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) {
    const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
    return [
      regexpEscape(r),
      false,
      endPos - pos,
      false
    ];
  }
  const sranges = "[" + (negate ? "^" : "") + rangesToString(ranges) + "]";
  const snegs = "[" + (negate ? "" : "^") + rangesToString(negs) + "]";
  const comb = ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs;
  return [
    comb,
    uflag,
    endPos - pos,
    true
  ];
}, "parseClass");

// ../../node_modules/.pnpm/minimatch@10.0.3/node_modules/minimatch/dist/esm/unescape.js
var unescape = /* @__PURE__ */ __name((s, { windowsPathsNoEscape = false } = {}) => {
  return windowsPathsNoEscape ? s.replace(/\[([^\/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
}, "unescape");

// ../../node_modules/.pnpm/minimatch@10.0.3/node_modules/minimatch/dist/esm/ast.js
var types = /* @__PURE__ */ new Set([
  "!",
  "?",
  "+",
  "*",
  "@"
]);
var isExtglobType = /* @__PURE__ */ __name((c) => types.has(c), "isExtglobType");
var startNoTraversal = "(?!(?:^|/)\\.\\.?(?:$|/))";
var startNoDot = "(?!\\.)";
var addPatternStart = /* @__PURE__ */ new Set([
  "[",
  "."
]);
var justDots = /* @__PURE__ */ new Set([
  "..",
  "."
]);
var reSpecials = new Set("().*{}+?[]^$\\!");
var regExpEscape = /* @__PURE__ */ __name((s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "regExpEscape");
var qmark = "[^/]";
var star = qmark + "*?";
var starNoEmpty = qmark + "+?";
var AST = class _AST {
  static {
    __name(this, "AST");
  }
  type;
  #root;
  #hasMagic;
  #uflag = false;
  #parts = [];
  #parent;
  #parentIndex;
  #negs;
  #filledNegs = false;
  #options;
  #toString;
  // set to true if it's an extglob with no children
  // (which really means one child of '')
  #emptyExt = false;
  constructor(type, parent, options = {}) {
    this.type = type;
    if (type) this.#hasMagic = true;
    this.#parent = parent;
    this.#root = this.#parent ? this.#parent.#root : this;
    this.#options = this.#root === this ? options : this.#root.#options;
    this.#negs = this.#root === this ? [] : this.#root.#negs;
    if (type === "!" && !this.#root.#filledNegs) this.#negs.push(this);
    this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
  }
  get hasMagic() {
    if (this.#hasMagic !== void 0) return this.#hasMagic;
    for (const p of this.#parts) {
      if (typeof p === "string") continue;
      if (p.type || p.hasMagic) return this.#hasMagic = true;
    }
    return this.#hasMagic;
  }
  // reconstructs the pattern
  toString() {
    if (this.#toString !== void 0) return this.#toString;
    if (!this.type) {
      return this.#toString = this.#parts.map((p) => String(p)).join("");
    } else {
      return this.#toString = this.type + "(" + this.#parts.map((p) => String(p)).join("|") + ")";
    }
  }
  #fillNegs() {
    if (this !== this.#root) throw new Error("should only call on root");
    if (this.#filledNegs) return this;
    this.toString();
    this.#filledNegs = true;
    let n;
    while (n = this.#negs.pop()) {
      if (n.type !== "!") continue;
      let p = n;
      let pp = p.#parent;
      while (pp) {
        for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
          for (const part of n.#parts) {
            if (typeof part === "string") {
              throw new Error("string part in extglob AST??");
            }
            part.copyIn(pp.#parts[i]);
          }
        }
        p = pp;
        pp = p.#parent;
      }
    }
    return this;
  }
  push(...parts) {
    for (const p of parts) {
      if (p === "") continue;
      if (typeof p !== "string" && !(p instanceof _AST && p.#parent === this)) {
        throw new Error("invalid part: " + p);
      }
      this.#parts.push(p);
    }
  }
  toJSON() {
    const ret = this.type === null ? this.#parts.slice().map((p) => typeof p === "string" ? p : p.toJSON()) : [
      this.type,
      ...this.#parts.map((p) => p.toJSON())
    ];
    if (this.isStart() && !this.type) ret.unshift([]);
    if (this.isEnd() && (this === this.#root || this.#root.#filledNegs && this.#parent?.type === "!")) {
      ret.push({});
    }
    return ret;
  }
  isStart() {
    if (this.#root === this) return true;
    if (!this.#parent?.isStart()) return false;
    if (this.#parentIndex === 0) return true;
    const p = this.#parent;
    for (let i = 0; i < this.#parentIndex; i++) {
      const pp = p.#parts[i];
      if (!(pp instanceof _AST && pp.type === "!")) {
        return false;
      }
    }
    return true;
  }
  isEnd() {
    if (this.#root === this) return true;
    if (this.#parent?.type === "!") return true;
    if (!this.#parent?.isEnd()) return false;
    if (!this.type) return this.#parent?.isEnd();
    const pl = this.#parent ? this.#parent.#parts.length : 0;
    return this.#parentIndex === pl - 1;
  }
  copyIn(part) {
    if (typeof part === "string") this.push(part);
    else this.push(part.clone(this));
  }
  clone(parent) {
    const c = new _AST(this.type, parent);
    for (const p of this.#parts) {
      c.copyIn(p);
    }
    return c;
  }
  static #parseAST(str, ast, pos, opt) {
    let escaping = false;
    let inBrace = false;
    let braceStart = -1;
    let braceNeg = false;
    if (ast.type === null) {
      let i2 = pos;
      let acc2 = "";
      while (i2 < str.length) {
        const c = str.charAt(i2++);
        if (escaping || c === "\\") {
          escaping = !escaping;
          acc2 += c;
          continue;
        }
        if (inBrace) {
          if (i2 === braceStart + 1) {
            if (c === "^" || c === "!") {
              braceNeg = true;
            }
          } else if (c === "]" && !(i2 === braceStart + 2 && braceNeg)) {
            inBrace = false;
          }
          acc2 += c;
          continue;
        } else if (c === "[") {
          inBrace = true;
          braceStart = i2;
          braceNeg = false;
          acc2 += c;
          continue;
        }
        if (!opt.noext && isExtglobType(c) && str.charAt(i2) === "(") {
          ast.push(acc2);
          acc2 = "";
          const ext2 = new _AST(c, ast);
          i2 = _AST.#parseAST(str, ext2, i2, opt);
          ast.push(ext2);
          continue;
        }
        acc2 += c;
      }
      ast.push(acc2);
      return i2;
    }
    let i = pos + 1;
    let part = new _AST(null, ast);
    const parts = [];
    let acc = "";
    while (i < str.length) {
      const c = str.charAt(i++);
      if (escaping || c === "\\") {
        escaping = !escaping;
        acc += c;
        continue;
      }
      if (inBrace) {
        if (i === braceStart + 1) {
          if (c === "^" || c === "!") {
            braceNeg = true;
          }
        } else if (c === "]" && !(i === braceStart + 2 && braceNeg)) {
          inBrace = false;
        }
        acc += c;
        continue;
      } else if (c === "[") {
        inBrace = true;
        braceStart = i;
        braceNeg = false;
        acc += c;
        continue;
      }
      if (isExtglobType(c) && str.charAt(i) === "(") {
        part.push(acc);
        acc = "";
        const ext2 = new _AST(c, part);
        part.push(ext2);
        i = _AST.#parseAST(str, ext2, i, opt);
        continue;
      }
      if (c === "|") {
        part.push(acc);
        acc = "";
        parts.push(part);
        part = new _AST(null, ast);
        continue;
      }
      if (c === ")") {
        if (acc === "" && ast.#parts.length === 0) {
          ast.#emptyExt = true;
        }
        part.push(acc);
        acc = "";
        ast.push(...parts, part);
        return i;
      }
      acc += c;
    }
    ast.type = null;
    ast.#hasMagic = void 0;
    ast.#parts = [
      str.substring(pos - 1)
    ];
    return i;
  }
  static fromGlob(pattern, options = {}) {
    const ast = new _AST(null, void 0, options);
    _AST.#parseAST(pattern, ast, 0, options);
    return ast;
  }
  // returns the regular expression if there's magic, or the unescaped
  // string if not.
  toMMPattern() {
    if (this !== this.#root) return this.#root.toMMPattern();
    const glob2 = this.toString();
    const [re, body, hasMagic2, uflag] = this.toRegExpSource();
    const anyMagic = hasMagic2 || this.#hasMagic || this.#options.nocase && !this.#options.nocaseMagicOnly && glob2.toUpperCase() !== glob2.toLowerCase();
    if (!anyMagic) {
      return body;
    }
    const flags = (this.#options.nocase ? "i" : "") + (uflag ? "u" : "");
    return Object.assign(new RegExp(`^${re}$`, flags), {
      _src: re,
      _glob: glob2
    });
  }
  get options() {
    return this.#options;
  }
  // returns the string match, the regexp source, whether there's magic
  // in the regexp (so a regular expression is required) and whether or
  // not the uflag is needed for the regular expression (for posix classes)
  // TODO: instead of injecting the start/end at this point, just return
  // the BODY of the regexp, along with the start/end portions suitable
  // for binding the start/end in either a joined full-path makeRe context
  // (where we bind to (^|/), or a standalone matchPart context (where
  // we bind to ^, and not /).  Otherwise slashes get duped!
  //
  // In part-matching mode, the start is:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: ^(?!\.\.?$)
  // - if dots allowed or not possible: ^
  // - if dots possible and not allowed: ^(?!\.)
  // end is:
  // - if not isEnd(): nothing
  // - else: $
  //
  // In full-path matching mode, we put the slash at the START of the
  // pattern, so start is:
  // - if first pattern: same as part-matching mode
  // - if not isStart(): nothing
  // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
  // - if dots allowed or not possible: /
  // - if dots possible and not allowed: /(?!\.)
  // end is:
  // - if last pattern, same as part-matching mode
  // - else nothing
  //
  // Always put the (?:$|/) on negated tails, though, because that has to be
  // there to bind the end of the negated pattern portion, and it's easier to
  // just stick it in now rather than try to inject it later in the middle of
  // the pattern.
  //
  // We can just always return the same end, and leave it up to the caller
  // to know whether it's going to be used joined or in parts.
  // And, if the start is adjusted slightly, can do the same there:
  // - if not isStart: nothing
  // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
  // - if dots allowed or not possible: (?:/|^)
  // - if dots possible and not allowed: (?:/|^)(?!\.)
  //
  // But it's better to have a simpler binding without a conditional, for
  // performance, so probably better to return both start options.
  //
  // Then the caller just ignores the end if it's not the first pattern,
  // and the start always gets applied.
  //
  // But that's always going to be $ if it's the ending pattern, or nothing,
  // so the caller can just attach $ at the end of the pattern when building.
  //
  // So the todo is:
  // - better detect what kind of start is needed
  // - return both flavors of starting pattern
  // - attach $ at the end of the pattern when creating the actual RegExp
  //
  // Ah, but wait, no, that all only applies to the root when the first pattern
  // is not an extglob. If the first pattern IS an extglob, then we need all
  // that dot prevention biz to live in the extglob portions, because eg
  // +(*|.x*) can match .xy but not .yx.
  //
  // So, return the two flavors if it's #root and the first child is not an
  // AST, otherwise leave it to the child AST to handle it, and there,
  // use the (?:^|/) style of start binding.
  //
  // Even simplified further:
  // - Since the start for a join is eg /(?!\.) and the start for a part
  // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
  // or start or whatever) and prepend ^ or / at the Regexp construction.
  toRegExpSource(allowDot) {
    const dot = allowDot ?? !!this.#options.dot;
    if (this.#root === this) this.#fillNegs();
    if (!this.type) {
      const noEmpty = this.isStart() && this.isEnd();
      const src = this.#parts.map((p) => {
        const [re, _, hasMagic2, uflag] = typeof p === "string" ? _AST.#parseGlob(p, this.#hasMagic, noEmpty) : p.toRegExpSource(allowDot);
        this.#hasMagic = this.#hasMagic || hasMagic2;
        this.#uflag = this.#uflag || uflag;
        return re;
      }).join("");
      let start2 = "";
      if (this.isStart()) {
        if (typeof this.#parts[0] === "string") {
          const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
          if (!dotTravAllowed) {
            const aps = addPatternStart;
            const needNoTrav = (
              // dots are allowed, and the pattern starts with [ or .
              dot && aps.has(src.charAt(0)) || // the pattern starts with \., and then [ or .
              src.startsWith("\\.") && aps.has(src.charAt(2)) || // the pattern starts with \.\., and then [ or .
              src.startsWith("\\.\\.") && aps.has(src.charAt(4))
            );
            const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
            start2 = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : "";
          }
        }
      }
      let end = "";
      if (this.isEnd() && this.#root.#filledNegs && this.#parent?.type === "!") {
        end = "(?:$|\\/)";
      }
      const final2 = start2 + src + end;
      return [
        final2,
        unescape(src),
        this.#hasMagic = !!this.#hasMagic,
        this.#uflag
      ];
    }
    const repeated = this.type === "*" || this.type === "+";
    const start = this.type === "!" ? "(?:(?!(?:" : "(?:";
    let body = this.#partsToRegExp(dot);
    if (this.isStart() && this.isEnd() && !body && this.type !== "!") {
      const s = this.toString();
      this.#parts = [
        s
      ];
      this.type = null;
      this.#hasMagic = void 0;
      return [
        s,
        unescape(this.toString()),
        false,
        false
      ];
    }
    let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot ? "" : this.#partsToRegExp(true);
    if (bodyDotAllowed === body) {
      bodyDotAllowed = "";
    }
    if (bodyDotAllowed) {
      body = `(?:${body})(?:${bodyDotAllowed})*?`;
    }
    let final = "";
    if (this.type === "!" && this.#emptyExt) {
      final = (this.isStart() && !dot ? startNoDot : "") + starNoEmpty;
    } else {
      const close = this.type === "!" ? "))" + (this.isStart() && !dot && !allowDot ? startNoDot : "") + star + ")" : this.type === "@" ? ")" : this.type === "?" ? ")?" : this.type === "+" && bodyDotAllowed ? ")" : this.type === "*" && bodyDotAllowed ? `)?` : `)${this.type}`;
      final = start + body + close;
    }
    return [
      final,
      unescape(body),
      this.#hasMagic = !!this.#hasMagic,
      this.#uflag
    ];
  }
  #partsToRegExp(dot) {
    return this.#parts.map((p) => {
      if (typeof p === "string") {
        throw new Error("string type in extglob ast??");
      }
      const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
      this.#uflag = this.#uflag || uflag;
      return re;
    }).filter((p) => !(this.isStart() && this.isEnd()) || !!p).join("|");
  }
  static #parseGlob(glob2, hasMagic2, noEmpty = false) {
    let escaping = false;
    let re = "";
    let uflag = false;
    for (let i = 0; i < glob2.length; i++) {
      const c = glob2.charAt(i);
      if (escaping) {
        escaping = false;
        re += (reSpecials.has(c) ? "\\" : "") + c;
        continue;
      }
      if (c === "\\") {
        if (i === glob2.length - 1) {
          re += "\\\\";
        } else {
          escaping = true;
        }
        continue;
      }
      if (c === "[") {
        const [src, needUflag, consumed, magic] = parseClass(glob2, i);
        if (consumed) {
          re += src;
          uflag = uflag || needUflag;
          i += consumed - 1;
          hasMagic2 = hasMagic2 || magic;
          continue;
        }
      }
      if (c === "*") {
        if (noEmpty && glob2 === "*") re += starNoEmpty;
        else re += star;
        hasMagic2 = true;
        continue;
      }
      if (c === "?") {
        re += qmark;
        hasMagic2 = true;
        continue;
      }
      re += regExpEscape(c);
    }
    return [
      re,
      unescape(glob2),
      !!hasMagic2,
      uflag
    ];
  }
};

// ../../node_modules/.pnpm/minimatch@10.0.3/node_modules/minimatch/dist/esm/escape.js
var escape = /* @__PURE__ */ __name((s, { windowsPathsNoEscape = false } = {}) => {
  return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
}, "escape");

// ../../node_modules/.pnpm/minimatch@10.0.3/node_modules/minimatch/dist/esm/index.js
var minimatch = /* @__PURE__ */ __name((p, pattern, options = {}) => {
  assertValidPattern(pattern);
  if (!options.nocomment && pattern.charAt(0) === "#") {
    return false;
  }
  return new Minimatch(pattern, options).match(p);
}, "minimatch");
var starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
var starDotExtTest = /* @__PURE__ */ __name((ext2) => (f) => !f.startsWith(".") && f.endsWith(ext2), "starDotExtTest");
var starDotExtTestDot = /* @__PURE__ */ __name((ext2) => (f) => f.endsWith(ext2), "starDotExtTestDot");
var starDotExtTestNocase = /* @__PURE__ */ __name((ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => !f.startsWith(".") && f.toLowerCase().endsWith(ext2);
}, "starDotExtTestNocase");
var starDotExtTestNocaseDot = /* @__PURE__ */ __name((ext2) => {
  ext2 = ext2.toLowerCase();
  return (f) => f.toLowerCase().endsWith(ext2);
}, "starDotExtTestNocaseDot");
var starDotStarRE = /^\*+\.\*+$/;
var starDotStarTest = /* @__PURE__ */ __name((f) => !f.startsWith(".") && f.includes("."), "starDotStarTest");
var starDotStarTestDot = /* @__PURE__ */ __name((f) => f !== "." && f !== ".." && f.includes("."), "starDotStarTestDot");
var dotStarRE = /^\.\*+$/;
var dotStarTest = /* @__PURE__ */ __name((f) => f !== "." && f !== ".." && f.startsWith("."), "dotStarTest");
var starRE = /^\*+$/;
var starTest = /* @__PURE__ */ __name((f) => f.length !== 0 && !f.startsWith("."), "starTest");
var starTestDot = /* @__PURE__ */ __name((f) => f.length !== 0 && f !== "." && f !== "..", "starTestDot");
var qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
var qmarksTestNocase = /* @__PURE__ */ __name(([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([
    $0
  ]);
  if (!ext2) return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
}, "qmarksTestNocase");
var qmarksTestNocaseDot = /* @__PURE__ */ __name(([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([
    $0
  ]);
  if (!ext2) return noext;
  ext2 = ext2.toLowerCase();
  return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
}, "qmarksTestNocaseDot");
var qmarksTestDot = /* @__PURE__ */ __name(([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExtDot([
    $0
  ]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
}, "qmarksTestDot");
var qmarksTest = /* @__PURE__ */ __name(([$0, ext2 = ""]) => {
  const noext = qmarksTestNoExt([
    $0
  ]);
  return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
}, "qmarksTest");
var qmarksTestNoExt = /* @__PURE__ */ __name(([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && !f.startsWith(".");
}, "qmarksTestNoExt");
var qmarksTestNoExtDot = /* @__PURE__ */ __name(([$0]) => {
  const len = $0.length;
  return (f) => f.length === len && f !== "." && f !== "..";
}, "qmarksTestNoExtDot");
var defaultPlatform = typeof process === "object" && process ? typeof process.env === "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
var path = {
  win32: {
    sep: "\\"
  },
  posix: {
    sep: "/"
  }
};
var sep = defaultPlatform === "win32" ? path.win32.sep : path.posix.sep;
minimatch.sep = sep;
var GLOBSTAR = Symbol("globstar **");
minimatch.GLOBSTAR = GLOBSTAR;
var qmark2 = "[^/]";
var star2 = qmark2 + "*?";
var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
var filter = /* @__PURE__ */ __name((pattern, options = {}) => (p) => minimatch(p, pattern, options), "filter");
minimatch.filter = filter;
var ext = /* @__PURE__ */ __name((a, b = {}) => Object.assign({}, a, b), "ext");
var defaults = /* @__PURE__ */ __name((def) => {
  if (!def || typeof def !== "object" || !Object.keys(def).length) {
    return minimatch;
  }
  const orig = minimatch;
  const m = /* @__PURE__ */ __name((p, pattern, options = {}) => orig(p, pattern, ext(def, options)), "m");
  return Object.assign(m, {
    Minimatch: class Minimatch extends orig.Minimatch {
      static {
        __name(this, "Minimatch");
      }
      constructor(pattern, options = {}) {
        super(pattern, ext(def, options));
      }
      static defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      }
    },
    AST: class AST extends orig.AST {
      static {
        __name(this, "AST");
      }
      /* c8 ignore start */
      constructor(type, parent, options = {}) {
        super(type, parent, ext(def, options));
      }
      /* c8 ignore stop */
      static fromGlob(pattern, options = {}) {
        return orig.AST.fromGlob(pattern, ext(def, options));
      }
    },
    unescape: /* @__PURE__ */ __name((s, options = {}) => orig.unescape(s, ext(def, options)), "unescape"),
    escape: /* @__PURE__ */ __name((s, options = {}) => orig.escape(s, ext(def, options)), "escape"),
    filter: /* @__PURE__ */ __name((pattern, options = {}) => orig.filter(pattern, ext(def, options)), "filter"),
    defaults: /* @__PURE__ */ __name((options) => orig.defaults(ext(def, options)), "defaults"),
    makeRe: /* @__PURE__ */ __name((pattern, options = {}) => orig.makeRe(pattern, ext(def, options)), "makeRe"),
    braceExpand: /* @__PURE__ */ __name((pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)), "braceExpand"),
    match: /* @__PURE__ */ __name((list2, pattern, options = {}) => orig.match(list2, pattern, ext(def, options)), "match"),
    sep: orig.sep,
    GLOBSTAR
  });
}, "defaults");
minimatch.defaults = defaults;
var braceExpand = /* @__PURE__ */ __name((pattern, options = {}) => {
  assertValidPattern(pattern);
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    return [
      pattern
    ];
  }
  return expand(pattern);
}, "braceExpand");
minimatch.braceExpand = braceExpand;
var makeRe = /* @__PURE__ */ __name((pattern, options = {}) => new Minimatch(pattern, options).makeRe(), "makeRe");
minimatch.makeRe = makeRe;
var match = /* @__PURE__ */ __name((list2, pattern, options = {}) => {
  const mm = new Minimatch(pattern, options);
  list2 = list2.filter((f) => mm.match(f));
  if (mm.options.nonull && !list2.length) {
    list2.push(pattern);
  }
  return list2;
}, "match");
minimatch.match = match;
var globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
var regExpEscape2 = /* @__PURE__ */ __name((s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "regExpEscape");
var Minimatch = class {
  static {
    __name(this, "Minimatch");
  }
  options;
  set;
  pattern;
  windowsPathsNoEscape;
  nonegate;
  negate;
  comment;
  empty;
  preserveMultipleSlashes;
  partial;
  globSet;
  globParts;
  nocase;
  isWindows;
  platform;
  windowsNoMagicRoot;
  regexp;
  constructor(pattern, options = {}) {
    assertValidPattern(pattern);
    options = options || {};
    this.options = options;
    this.pattern = pattern;
    this.platform = options.platform || defaultPlatform;
    this.isWindows = this.platform === "win32";
    this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, "/");
    }
    this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
    this.regexp = null;
    this.negate = false;
    this.nonegate = !!options.nonegate;
    this.comment = false;
    this.empty = false;
    this.partial = !!options.partial;
    this.nocase = !!this.options.nocase;
    this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
    this.globSet = [];
    this.globParts = [];
    this.set = [];
    this.make();
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) {
      return true;
    }
    for (const pattern of this.set) {
      for (const part of pattern) {
        if (typeof part !== "string") return true;
      }
    }
    return false;
  }
  debug(..._) {
  }
  make() {
    const pattern = this.pattern;
    const options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    this.globSet = [
      ...new Set(this.braceExpand())
    ];
    if (options.debug) {
      this.debug = (...args) => console.error(...args);
    }
    this.debug(this.pattern, this.globSet);
    const rawGlobParts = this.globSet.map((s) => this.slashSplit(s));
    this.globParts = this.preprocess(rawGlobParts);
    this.debug(this.pattern, this.globParts);
    let set = this.globParts.map((s, _, __) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && !globMagic.test(s[3]);
        const isDrive = /^[a-z]:/i.test(s[0]);
        if (isUNC) {
          return [
            ...s.slice(0, 4),
            ...s.slice(4).map((ss) => this.parse(ss))
          ];
        } else if (isDrive) {
          return [
            s[0],
            ...s.slice(1).map((ss) => this.parse(ss))
          ];
        }
      }
      return s.map((ss) => this.parse(ss));
    });
    this.debug(this.pattern, set);
    this.set = set.filter((s) => s.indexOf(false) === -1);
    if (this.isWindows) {
      for (let i = 0; i < this.set.length; i++) {
        const p = this.set[i];
        if (p[0] === "" && p[1] === "" && this.globParts[i][2] === "?" && typeof p[3] === "string" && /^[a-z]:$/i.test(p[3])) {
          p[2] = "?";
        }
      }
    }
    this.debug(this.pattern, this.set);
  }
  // various transforms to equivalent pattern sets that are
  // faster to process in a filesystem walk.  The goal is to
  // eliminate what we can, and push all ** patterns as far
  // to the right as possible, even if it increases the number
  // of patterns that we have to process.
  preprocess(globParts) {
    if (this.options.noglobstar) {
      for (let i = 0; i < globParts.length; i++) {
        for (let j = 0; j < globParts[i].length; j++) {
          if (globParts[i][j] === "**") {
            globParts[i][j] = "*";
          }
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      globParts = this.firstPhasePreProcess(globParts);
      globParts = this.secondPhasePreProcess(globParts);
    } else if (optimizationLevel >= 1) {
      globParts = this.levelOneOptimize(globParts);
    } else {
      globParts = this.adjascentGlobstarOptimize(globParts);
    }
    return globParts;
  }
  // just get rid of adjascent ** portions
  adjascentGlobstarOptimize(globParts) {
    return globParts.map((parts) => {
      let gs = -1;
      while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
        let i = gs;
        while (parts[i + 1] === "**") {
          i++;
        }
        if (i !== gs) {
          parts.splice(gs, i - gs);
        }
      }
      return parts;
    });
  }
  // get rid of adjascent ** and resolve .. portions
  levelOneOptimize(globParts) {
    return globParts.map((parts) => {
      parts = parts.reduce((set, part) => {
        const prev = set[set.length - 1];
        if (part === "**" && prev === "**") {
          return set;
        }
        if (part === "..") {
          if (prev && prev !== ".." && prev !== "." && prev !== "**") {
            set.pop();
            return set;
          }
        }
        set.push(part);
        return set;
      }, []);
      return parts.length === 0 ? [
        ""
      ] : parts;
    });
  }
  levelTwoFileOptimize(parts) {
    if (!Array.isArray(parts)) {
      parts = this.slashSplit(parts);
    }
    let didSomething = false;
    do {
      didSomething = false;
      if (!this.preserveMultipleSlashes) {
        for (let i = 1; i < parts.length - 1; i++) {
          const p = parts[i];
          if (i === 1 && p === "" && parts[0] === "") continue;
          if (p === "." || p === "") {
            didSomething = true;
            parts.splice(i, 1);
            i--;
          }
        }
        if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
          didSomething = true;
          parts.pop();
        }
      }
      let dd = 0;
      while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
        const p = parts[dd - 1];
        if (p && p !== "." && p !== ".." && p !== "**") {
          didSomething = true;
          parts.splice(dd - 1, 2);
          dd -= 2;
        }
      }
    } while (didSomething);
    return parts.length === 0 ? [
      ""
    ] : parts;
  }
  // First phase: single-pattern processing
  // <pre> is 1 or more portions
  // <rest> is 1 or more portions
  // <p> is any portion other than ., .., '', or **
  // <e> is . or ''
  //
  // **/.. is *brutal* for filesystem walking performance, because
  // it effectively resets the recursive walk each time it occurs,
  // and ** cannot be reduced out by a .. pattern part like a regexp
  // or most strings (other than .., ., and '') can be.
  //
  // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
  // <pre>/<e>/<rest> -> <pre>/<rest>
  // <pre>/<p>/../<rest> -> <pre>/<rest>
  // **/**/<rest> -> **/<rest>
  //
  // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
  // this WOULD be allowed if ** did follow symlinks, or * didn't
  firstPhasePreProcess(globParts) {
    let didSomething = false;
    do {
      didSomething = false;
      for (let parts of globParts) {
        let gs = -1;
        while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
          let gss = gs;
          while (parts[gss + 1] === "**") {
            gss++;
          }
          if (gss > gs) {
            parts.splice(gs + 1, gss - gs);
          }
          let next = parts[gs + 1];
          const p = parts[gs + 2];
          const p2 = parts[gs + 3];
          if (next !== "..") continue;
          if (!p || p === "." || p === ".." || !p2 || p2 === "." || p2 === "..") {
            continue;
          }
          didSomething = true;
          parts.splice(gs, 1);
          const other = parts.slice(0);
          other[gs] = "**";
          globParts.push(other);
          gs--;
        }
        if (!this.preserveMultipleSlashes) {
          for (let i = 1; i < parts.length - 1; i++) {
            const p = parts[i];
            if (i === 1 && p === "" && parts[0] === "") continue;
            if (p === "." || p === "") {
              didSomething = true;
              parts.splice(i, 1);
              i--;
            }
          }
          if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
            didSomething = true;
            parts.pop();
          }
        }
        let dd = 0;
        while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
          const p = parts[dd - 1];
          if (p && p !== "." && p !== ".." && p !== "**") {
            didSomething = true;
            const needDot = dd === 1 && parts[dd + 1] === "**";
            const splin = needDot ? [
              "."
            ] : [];
            parts.splice(dd - 1, 2, ...splin);
            if (parts.length === 0) parts.push("");
            dd -= 2;
          }
        }
      }
    } while (didSomething);
    return globParts;
  }
  // second phase: multi-pattern dedupes
  // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
  // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
  // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
  //
  // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
  // ^-- not valid because ** doens't follow symlinks
  secondPhasePreProcess(globParts) {
    for (let i = 0; i < globParts.length - 1; i++) {
      for (let j = i + 1; j < globParts.length; j++) {
        const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
        if (matched) {
          globParts[i] = [];
          globParts[j] = matched;
          break;
        }
      }
    }
    return globParts.filter((gs) => gs.length);
  }
  partsMatch(a, b, emptyGSMatch = false) {
    let ai = 0;
    let bi = 0;
    let result = [];
    let which = "";
    while (ai < a.length && bi < b.length) {
      if (a[ai] === b[bi]) {
        result.push(which === "b" ? b[bi] : a[ai]);
        ai++;
        bi++;
      } else if (emptyGSMatch && a[ai] === "**" && b[bi] === a[ai + 1]) {
        result.push(a[ai]);
        ai++;
      } else if (emptyGSMatch && b[bi] === "**" && a[ai] === b[bi + 1]) {
        result.push(b[bi]);
        bi++;
      } else if (a[ai] === "*" && b[bi] && (this.options.dot || !b[bi].startsWith(".")) && b[bi] !== "**") {
        if (which === "b") return false;
        which = "a";
        result.push(a[ai]);
        ai++;
        bi++;
      } else if (b[bi] === "*" && a[ai] && (this.options.dot || !a[ai].startsWith(".")) && a[ai] !== "**") {
        if (which === "a") return false;
        which = "b";
        result.push(b[bi]);
        ai++;
        bi++;
      } else {
        return false;
      }
    }
    return a.length === b.length && result;
  }
  parseNegate() {
    if (this.nonegate) return;
    const pattern = this.pattern;
    let negate = false;
    let negateOffset = 0;
    for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset) this.pattern = pattern.slice(negateOffset);
    this.negate = negate;
  }
  // set partial to true to test if, for example,
  // "/a/b" matches the start of "/*/b/*/d"
  // Partial means, if you run out of file before you run
  // out of pattern, then that's fine, as long as all
  // the parts match.
  matchOne(file, pattern, partial = false) {
    const options = this.options;
    if (this.isWindows) {
      const fileDrive = typeof file[0] === "string" && /^[a-z]:$/i.test(file[0]);
      const fileUNC = !fileDrive && file[0] === "" && file[1] === "" && file[2] === "?" && /^[a-z]:$/i.test(file[3]);
      const patternDrive = typeof pattern[0] === "string" && /^[a-z]:$/i.test(pattern[0]);
      const patternUNC = !patternDrive && pattern[0] === "" && pattern[1] === "" && pattern[2] === "?" && typeof pattern[3] === "string" && /^[a-z]:$/i.test(pattern[3]);
      const fdi = fileUNC ? 3 : fileDrive ? 0 : void 0;
      const pdi = patternUNC ? 3 : patternDrive ? 0 : void 0;
      if (typeof fdi === "number" && typeof pdi === "number") {
        const [fd, pd] = [
          file[fdi],
          pattern[pdi]
        ];
        if (fd.toLowerCase() === pd.toLowerCase()) {
          pattern[pdi] = fd;
          if (pdi > fdi) {
            pattern = pattern.slice(pdi);
          } else if (fdi > pdi) {
            file = file.slice(fdi);
          }
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      file = this.levelTwoFileOptimize(file);
    }
    this.debug("matchOne", this, {
      file,
      pattern
    });
    this.debug("matchOne", file.length, pattern.length);
    for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      this.debug("matchOne loop");
      var p = pattern[pi];
      var f = file[fi];
      this.debug(pattern, p, f);
      if (p === false) {
        return false;
      }
      if (p === GLOBSTAR) {
        this.debug("GLOBSTAR", [
          pattern,
          p,
          f
        ]);
        var fr = fi;
        var pr = pi + 1;
        if (pr === pl) {
          this.debug("** at the end");
          for (; fi < fl; fi++) {
            if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".") return false;
          }
          return true;
        }
        while (fr < fl) {
          var swallowee = file[fr];
          this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
          if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
            this.debug("globstar found match!", fr, fl, swallowee);
            return true;
          } else {
            if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
              this.debug("dot detected!", file, fr, pattern, pr);
              break;
            }
            this.debug("globstar swallow a segment, and continue");
            fr++;
          }
        }
        if (partial) {
          this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
          if (fr === fl) {
            return true;
          }
        }
        return false;
      }
      let hit;
      if (typeof p === "string") {
        hit = f === p;
        this.debug("string match", p, f, hit);
      } else {
        hit = p.test(f);
        this.debug("pattern match", p, f, hit);
      }
      if (!hit) return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      return fi === fl - 1 && file[fi] === "";
    } else {
      throw new Error("wtf?");
    }
  }
  braceExpand() {
    return braceExpand(this.pattern, this.options);
  }
  parse(pattern) {
    assertValidPattern(pattern);
    const options = this.options;
    if (pattern === "**") return GLOBSTAR;
    if (pattern === "") return "";
    let m;
    let fastTest = null;
    if (m = pattern.match(starRE)) {
      fastTest = options.dot ? starTestDot : starTest;
    } else if (m = pattern.match(starDotExtRE)) {
      fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
    } else if (m = pattern.match(qmarksRE)) {
      fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
    } else if (m = pattern.match(starDotStarRE)) {
      fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
    } else if (m = pattern.match(dotStarRE)) {
      fastTest = dotStarTest;
    }
    const re = AST.fromGlob(pattern, this.options).toMMPattern();
    if (fastTest && typeof re === "object") {
      Reflect.defineProperty(re, "test", {
        value: fastTest
      });
    }
    return re;
  }
  makeRe() {
    if (this.regexp || this.regexp === false) return this.regexp;
    const set = this.set;
    if (!set.length) {
      this.regexp = false;
      return this.regexp;
    }
    const options = this.options;
    const twoStar = options.noglobstar ? star2 : options.dot ? twoStarDot : twoStarNoDot;
    const flags = new Set(options.nocase ? [
      "i"
    ] : []);
    let re = set.map((pattern) => {
      const pp = pattern.map((p) => {
        if (p instanceof RegExp) {
          for (const f of p.flags.split("")) flags.add(f);
        }
        return typeof p === "string" ? regExpEscape2(p) : p === GLOBSTAR ? GLOBSTAR : p._src;
      });
      pp.forEach((p, i) => {
        const next = pp[i + 1];
        const prev = pp[i - 1];
        if (p !== GLOBSTAR || prev === GLOBSTAR) {
          return;
        }
        if (prev === void 0) {
          if (next !== void 0 && next !== GLOBSTAR) {
            pp[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + next;
          } else {
            pp[i] = twoStar;
          }
        } else if (next === void 0) {
          pp[i - 1] = prev + "(?:\\/|" + twoStar + ")?";
        } else if (next !== GLOBSTAR) {
          pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + "\\/)" + next;
          pp[i + 1] = GLOBSTAR;
        }
      });
      return pp.filter((p) => p !== GLOBSTAR).join("/");
    }).join("|");
    const [open, close] = set.length > 1 ? [
      "(?:",
      ")"
    ] : [
      "",
      ""
    ];
    re = "^" + open + re + close + "$";
    if (this.negate) re = "^(?!" + re + ").+$";
    try {
      this.regexp = new RegExp(re, [
        ...flags
      ].join(""));
    } catch (ex) {
      this.regexp = false;
    }
    return this.regexp;
  }
  slashSplit(p) {
    if (this.preserveMultipleSlashes) {
      return p.split("/");
    } else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
      return [
        "",
        ...p.split(/\/+/)
      ];
    } else {
      return p.split(/\/+/);
    }
  }
  match(f, partial = this.partial) {
    this.debug("match", f, this.pattern);
    if (this.comment) {
      return false;
    }
    if (this.empty) {
      return f === "";
    }
    if (f === "/" && partial) {
      return true;
    }
    const options = this.options;
    if (this.isWindows) {
      f = f.split("\\").join("/");
    }
    const ff = this.slashSplit(f);
    this.debug(this.pattern, "split", ff);
    const set = this.set;
    this.debug(this.pattern, "set", set);
    let filename = ff[ff.length - 1];
    if (!filename) {
      for (let i = ff.length - 2; !filename && i >= 0; i--) {
        filename = ff[i];
      }
    }
    for (let i = 0; i < set.length; i++) {
      const pattern = set[i];
      let file = ff;
      if (options.matchBase && pattern.length === 1) {
        file = [
          filename
        ];
      }
      const hit = this.matchOne(file, pattern, partial);
      if (hit) {
        if (options.flipNegate) {
          return true;
        }
        return !this.negate;
      }
    }
    if (options.flipNegate) {
      return false;
    }
    return this.negate;
  }
  static defaults(def) {
    return minimatch.defaults(def).Minimatch;
  }
};
minimatch.AST = AST;
minimatch.Minimatch = Minimatch;
minimatch.escape = escape;
minimatch.unescape = unescape;

// ../../node_modules/.pnpm/lru-cache@8.0.5/node_modules/lru-cache/dist/mjs/index.js
var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
var warned = /* @__PURE__ */ new Set();
var emitWarning = /* @__PURE__ */ __name((msg, type, code, fn) => {
  typeof process === "object" && process && typeof process.emitWarning === "function" ? process.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
}, "emitWarning");
var shouldWarn = /* @__PURE__ */ __name((code) => !warned.has(code), "shouldWarn");
var isPosInt = /* @__PURE__ */ __name((n) => n && n === Math.floor(n) && n > 0 && isFinite(n), "isPosInt");
var getUintArray = /* @__PURE__ */ __name((max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null, "getUintArray");
var ZeroArray = class ZeroArray2 extends Array {
  static {
    __name(this, "ZeroArray");
  }
  constructor(size) {
    super(size);
    this.fill(0);
  }
};
var Stack = class Stack2 {
  static {
    __name(this, "Stack");
  }
  heap;
  length;
  // private constructor
  static #constructing = false;
  static create(max) {
    const HeapCls = getUintArray(max);
    if (!HeapCls) return [];
    Stack2.#constructing = true;
    const s = new Stack2(max, HeapCls);
    Stack2.#constructing = false;
    return s;
  }
  constructor(max, HeapCls) {
    if (!Stack2.#constructing) {
      throw new TypeError("instantiate Stack using Stack.create(n)");
    }
    this.heap = new HeapCls(max);
    this.length = 0;
  }
  push(n) {
    this.heap[this.length++] = n;
  }
  pop() {
    return this.heap[--this.length];
  }
};
var LRUCache = class _LRUCache {
  static {
    __name(this, "LRUCache");
  }
  // properties coming in from the options of these, only max and maxSize
  // really *need* to be protected. The rest can be modified, as they just
  // set defaults for various methods.
  #max;
  #maxSize;
  #dispose;
  #disposeAfter;
  #fetchMethod;
  /**
   * {@link LRUCache.OptionsBase.ttl}
   */
  ttl;
  /**
   * {@link LRUCache.OptionsBase.ttlResolution}
   */
  ttlResolution;
  /**
   * {@link LRUCache.OptionsBase.ttlAutopurge}
   */
  ttlAutopurge;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnGet}
   */
  updateAgeOnGet;
  /**
   * {@link LRUCache.OptionsBase.updateAgeOnHas}
   */
  updateAgeOnHas;
  /**
   * {@link LRUCache.OptionsBase.allowStale}
   */
  allowStale;
  /**
   * {@link LRUCache.OptionsBase.noDisposeOnSet}
   */
  noDisposeOnSet;
  /**
   * {@link LRUCache.OptionsBase.noUpdateTTL}
   */
  noUpdateTTL;
  /**
   * {@link LRUCache.OptionsBase.maxEntrySize}
   */
  maxEntrySize;
  /**
   * {@link LRUCache.OptionsBase.sizeCalculation}
   */
  sizeCalculation;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
   */
  noDeleteOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
   */
  noDeleteOnStaleGet;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
   */
  allowStaleOnFetchAbort;
  /**
   * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
   */
  allowStaleOnFetchRejection;
  /**
   * {@link LRUCache.OptionsBase.ignoreFetchAbort}
   */
  ignoreFetchAbort;
  // computed properties
  #size;
  #calculatedSize;
  #keyMap;
  #keyList;
  #valList;
  #next;
  #prev;
  #head;
  #tail;
  #free;
  #disposed;
  #sizes;
  #starts;
  #ttls;
  #hasDispose;
  #hasFetchMethod;
  #hasDisposeAfter;
  /**
   * Do not call this method unless you need to inspect the
   * inner workings of the cache.  If anything returned by this
   * object is modified in any way, strange breakage may occur.
   *
   * These fields are private for a reason!
   *
   * @internal
   */
  static unsafeExposeInternals(c) {
    return {
      // properties
      starts: c.#starts,
      ttls: c.#ttls,
      sizes: c.#sizes,
      keyMap: c.#keyMap,
      keyList: c.#keyList,
      valList: c.#valList,
      next: c.#next,
      prev: c.#prev,
      get head() {
        return c.#head;
      },
      get tail() {
        return c.#tail;
      },
      free: c.#free,
      // methods
      isBackgroundFetch: /* @__PURE__ */ __name((p) => c.#isBackgroundFetch(p), "isBackgroundFetch"),
      backgroundFetch: /* @__PURE__ */ __name((k, index, options, context) => c.#backgroundFetch(k, index, options, context), "backgroundFetch"),
      moveToTail: /* @__PURE__ */ __name((index) => c.#moveToTail(index), "moveToTail"),
      indexes: /* @__PURE__ */ __name((options) => c.#indexes(options), "indexes"),
      rindexes: /* @__PURE__ */ __name((options) => c.#rindexes(options), "rindexes"),
      isStale: /* @__PURE__ */ __name((index) => c.#isStale(index), "isStale")
    };
  }
  // Protected read-only members
  /**
   * {@link LRUCache.OptionsBase.max} (read-only)
   */
  get max() {
    return this.#max;
  }
  /**
   * {@link LRUCache.OptionsBase.maxSize} (read-only)
   */
  get maxSize() {
    return this.#maxSize;
  }
  /**
   * The total computed size of items in the cache (read-only)
   */
  get calculatedSize() {
    return this.#calculatedSize;
  }
  /**
   * The number of items stored in the cache (read-only)
   */
  get size() {
    return this.#size;
  }
  /**
   * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
   */
  get fetchMethod() {
    return this.#fetchMethod;
  }
  /**
   * {@link LRUCache.OptionsBase.dispose} (read-only)
   */
  get dispose() {
    return this.#dispose;
  }
  /**
   * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
   */
  get disposeAfter() {
    return this.#disposeAfter;
  }
  constructor(options) {
    const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
    if (max !== 0 && !isPosInt(max)) {
      throw new TypeError("max option must be a nonnegative integer");
    }
    const UintArray = max ? getUintArray(max) : Array;
    if (!UintArray) {
      throw new Error("invalid max value: " + max);
    }
    this.#max = max;
    this.#maxSize = maxSize;
    this.maxEntrySize = maxEntrySize || this.#maxSize;
    this.sizeCalculation = sizeCalculation;
    if (this.sizeCalculation) {
      if (!this.#maxSize && !this.maxEntrySize) {
        throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
      }
      if (typeof this.sizeCalculation !== "function") {
        throw new TypeError("sizeCalculation set to non-function");
      }
    }
    if (fetchMethod !== void 0 && typeof fetchMethod !== "function") {
      throw new TypeError("fetchMethod must be a function if specified");
    }
    this.#fetchMethod = fetchMethod;
    this.#hasFetchMethod = !!fetchMethod;
    this.#keyMap = /* @__PURE__ */ new Map();
    this.#keyList = new Array(max).fill(void 0);
    this.#valList = new Array(max).fill(void 0);
    this.#next = new UintArray(max);
    this.#prev = new UintArray(max);
    this.#head = 0;
    this.#tail = 0;
    this.#free = Stack.create(max);
    this.#size = 0;
    this.#calculatedSize = 0;
    if (typeof dispose === "function") {
      this.#dispose = dispose;
    }
    if (typeof disposeAfter === "function") {
      this.#disposeAfter = disposeAfter;
      this.#disposed = [];
    } else {
      this.#disposeAfter = void 0;
      this.#disposed = void 0;
    }
    this.#hasDispose = !!this.#dispose;
    this.#hasDisposeAfter = !!this.#disposeAfter;
    this.noDisposeOnSet = !!noDisposeOnSet;
    this.noUpdateTTL = !!noUpdateTTL;
    this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
    this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
    this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
    this.ignoreFetchAbort = !!ignoreFetchAbort;
    if (this.maxEntrySize !== 0) {
      if (this.#maxSize !== 0) {
        if (!isPosInt(this.#maxSize)) {
          throw new TypeError("maxSize must be a positive integer if specified");
        }
      }
      if (!isPosInt(this.maxEntrySize)) {
        throw new TypeError("maxEntrySize must be a positive integer if specified");
      }
      this.#initializeSizeTracking();
    }
    this.allowStale = !!allowStale;
    this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
    this.updateAgeOnGet = !!updateAgeOnGet;
    this.updateAgeOnHas = !!updateAgeOnHas;
    this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
    this.ttlAutopurge = !!ttlAutopurge;
    this.ttl = ttl || 0;
    if (this.ttl) {
      if (!isPosInt(this.ttl)) {
        throw new TypeError("ttl must be a positive integer if specified");
      }
      this.#initializeTTLTracking();
    }
    if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
      throw new TypeError("At least one of max, maxSize, or ttl is required");
    }
    if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
      const code = "LRU_CACHE_UNBOUNDED";
      if (shouldWarn(code)) {
        warned.add(code);
        const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
        emitWarning(msg, "UnboundedCacheWarning", code, _LRUCache);
      }
    }
  }
  /**
   * Return the remaining TTL time for a given entry key
   */
  getRemainingTTL(key) {
    return this.#keyMap.has(key) ? Infinity : 0;
  }
  #initializeTTLTracking() {
    const ttls = new ZeroArray(this.#max);
    const starts = new ZeroArray(this.#max);
    this.#ttls = ttls;
    this.#starts = starts;
    this.#setItemTTL = (index, ttl, start = perf.now()) => {
      starts[index] = ttl !== 0 ? start : 0;
      ttls[index] = ttl;
      if (ttl !== 0 && this.ttlAutopurge) {
        const t = setTimeout(() => {
          if (this.#isStale(index)) {
            this.delete(this.#keyList[index]);
          }
        }, ttl + 1);
        if (t.unref) {
          t.unref();
        }
      }
    };
    this.#updateItemAge = (index) => {
      starts[index] = ttls[index] !== 0 ? perf.now() : 0;
    };
    this.#statusTTL = (status, index) => {
      if (ttls[index]) {
        const ttl = ttls[index];
        const start = starts[index];
        status.ttl = ttl;
        status.start = start;
        status.now = cachedNow || getNow();
        status.remainingTTL = status.now + ttl - start;
      }
    };
    let cachedNow = 0;
    const getNow = /* @__PURE__ */ __name(() => {
      const n = perf.now();
      if (this.ttlResolution > 0) {
        cachedNow = n;
        const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
        if (t.unref) {
          t.unref();
        }
      }
      return n;
    }, "getNow");
    this.getRemainingTTL = (key) => {
      const index = this.#keyMap.get(key);
      if (index === void 0) {
        return 0;
      }
      return ttls[index] === 0 || starts[index] === 0 ? Infinity : starts[index] + ttls[index] - (cachedNow || getNow());
    };
    this.#isStale = (index) => {
      return ttls[index] !== 0 && starts[index] !== 0 && (cachedNow || getNow()) - starts[index] > ttls[index];
    };
  }
  // conditionally set private methods related to TTL
  #updateItemAge = /* @__PURE__ */ __name(() => {
  }, "#updateItemAge");
  #statusTTL = /* @__PURE__ */ __name(() => {
  }, "#statusTTL");
  #setItemTTL = /* @__PURE__ */ __name(() => {
  }, "#setItemTTL");
  /* c8 ignore stop */
  #isStale = /* @__PURE__ */ __name(() => false, "#isStale");
  #initializeSizeTracking() {
    const sizes = new ZeroArray(this.#max);
    this.#calculatedSize = 0;
    this.#sizes = sizes;
    this.#removeItemSize = (index) => {
      this.#calculatedSize -= sizes[index];
      sizes[index] = 0;
    };
    this.#requireSize = (k, v, size, sizeCalculation) => {
      if (this.#isBackgroundFetch(v)) {
        return 0;
      }
      if (!isPosInt(size)) {
        if (sizeCalculation) {
          if (typeof sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation must be a function");
          }
          size = sizeCalculation(v, k);
          if (!isPosInt(size)) {
            throw new TypeError("sizeCalculation return invalid (expect positive integer)");
          }
        } else {
          throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
        }
      }
      return size;
    };
    this.#addItemSize = (index, size, status) => {
      sizes[index] = size;
      if (this.#maxSize) {
        const maxSize = this.#maxSize - sizes[index];
        while (this.#calculatedSize > maxSize) {
          this.#evict(true);
        }
      }
      this.#calculatedSize += sizes[index];
      if (status) {
        status.entrySize = size;
        status.totalCalculatedSize = this.#calculatedSize;
      }
    };
  }
  #removeItemSize = /* @__PURE__ */ __name((_i) => {
  }, "#removeItemSize");
  #addItemSize = /* @__PURE__ */ __name((_i, _s, _st) => {
  }, "#addItemSize");
  #requireSize = /* @__PURE__ */ __name((_k, _v, size, sizeCalculation) => {
    if (size || sizeCalculation) {
      throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
    }
    return 0;
  }, "#requireSize");
  *#indexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#tail; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#head) {
          break;
        } else {
          i = this.#prev[i];
        }
      }
    }
  }
  *#rindexes({ allowStale = this.allowStale } = {}) {
    if (this.#size) {
      for (let i = this.#head; true; ) {
        if (!this.#isValidIndex(i)) {
          break;
        }
        if (allowStale || !this.#isStale(i)) {
          yield i;
        }
        if (i === this.#tail) {
          break;
        } else {
          i = this.#next[i];
        }
      }
    }
  }
  #isValidIndex(index) {
    return index !== void 0 && this.#keyMap.get(this.#keyList[index]) === index;
  }
  /**
   * Return a generator yielding `[key, value]` pairs,
   * in order from most recently used to least recently used.
   */
  *entries() {
    for (const i of this.#indexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [
          this.#keyList[i],
          this.#valList[i]
        ];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.entries}
   *
   * Return a generator yielding `[key, value]` pairs,
   * in order from least recently used to most recently used.
   */
  *rentries() {
    for (const i of this.#rindexes()) {
      if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield [
          this.#keyList[i],
          this.#valList[i]
        ];
      }
    }
  }
  /**
   * Return a generator yielding the keys in the cache,
   * in order from most recently used to least recently used.
   */
  *keys() {
    for (const i of this.#indexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.keys}
   *
   * Return a generator yielding the keys in the cache,
   * in order from least recently used to most recently used.
   */
  *rkeys() {
    for (const i of this.#rindexes()) {
      const k = this.#keyList[i];
      if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield k;
      }
    }
  }
  /**
   * Return a generator yielding the values in the cache,
   * in order from most recently used to least recently used.
   */
  *values() {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Inverse order version of {@link LRUCache.values}
   *
   * Return a generator yielding the values in the cache,
   * in order from least recently used to most recently used.
   */
  *rvalues() {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
        yield this.#valList[i];
      }
    }
  }
  /**
   * Iterating over the cache itself yields the same results as
   * {@link LRUCache.entries}
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Find a value for which the supplied fn method returns a truthy value,
   * similar to Array.find().  fn is called as fn(value, key, cache).
   */
  find(fn, getOptions = {}) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0) continue;
      if (fn(value, this.#keyList[i], this)) {
        return this.get(this.#keyList[i], getOptions);
      }
    }
  }
  /**
   * Call the supplied function on each item in the cache, in order from
   * most recently used to least recently used.  fn is called as
   * fn(value, key, cache).  Does not update age or recenty of use.
   * Does not iterate over stale values.
   */
  forEach(fn, thisp = this) {
    for (const i of this.#indexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0) continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * The same as {@link LRUCache.forEach} but items are iterated over in
   * reverse order.  (ie, less recently used items are iterated over first.)
   */
  rforEach(fn, thisp = this) {
    for (const i of this.#rindexes()) {
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0) continue;
      fn.call(thisp, value, this.#keyList[i], this);
    }
  }
  /**
   * Delete any stale entries. Returns true if anything was removed,
   * false otherwise.
   */
  purgeStale() {
    let deleted = false;
    for (const i of this.#rindexes({
      allowStale: true
    })) {
      if (this.#isStale(i)) {
        this.delete(this.#keyList[i]);
        deleted = true;
      }
    }
    return deleted;
  }
  /**
   * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
   * passed to cache.load()
   */
  dump() {
    const arr = [];
    for (const i of this.#indexes({
      allowStale: true
    })) {
      const key = this.#keyList[i];
      const v = this.#valList[i];
      const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      if (value === void 0 || key === void 0) continue;
      const entry = {
        value
      };
      if (this.#ttls && this.#starts) {
        entry.ttl = this.#ttls[i];
        const age = perf.now() - this.#starts[i];
        entry.start = Math.floor(Date.now() - age);
      }
      if (this.#sizes) {
        entry.size = this.#sizes[i];
      }
      arr.unshift([
        key,
        entry
      ]);
    }
    return arr;
  }
  /**
   * Reset the cache and load in the items in entries in the order listed.
   * Note that the shape of the resulting cache may be different if the
   * same options are not used in both caches.
   */
  load(arr) {
    this.clear();
    for (const [key, entry] of arr) {
      if (entry.start) {
        const age = Date.now() - entry.start;
        entry.start = perf.now() - age;
      }
      this.set(key, entry.value, entry);
    }
  }
  /**
   * Add a value to the cache.
   */
  set(k, v, setOptions = {}) {
    const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
    let { noUpdateTTL = this.noUpdateTTL } = setOptions;
    const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
    if (this.maxEntrySize && size > this.maxEntrySize) {
      if (status) {
        status.set = "miss";
        status.maxEntrySizeExceeded = true;
      }
      this.delete(k);
      return this;
    }
    let index = this.#size === 0 ? void 0 : this.#keyMap.get(k);
    if (index === void 0) {
      index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
      this.#keyList[index] = k;
      this.#valList[index] = v;
      this.#keyMap.set(k, index);
      this.#next[this.#tail] = index;
      this.#prev[index] = this.#tail;
      this.#tail = index;
      this.#size++;
      this.#addItemSize(index, size, status);
      if (status) status.set = "add";
      noUpdateTTL = false;
    } else {
      this.#moveToTail(index);
      const oldVal = this.#valList[index];
      if (v !== oldVal) {
        if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
          oldVal.__abortController.abort(new Error("replaced"));
        } else if (!noDisposeOnSet) {
          if (this.#hasDispose) {
            this.#dispose?.(oldVal, k, "set");
          }
          if (this.#hasDisposeAfter) {
            this.#disposed?.push([
              oldVal,
              k,
              "set"
            ]);
          }
        }
        this.#removeItemSize(index);
        this.#addItemSize(index, size, status);
        this.#valList[index] = v;
        if (status) {
          status.set = "replace";
          const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
          if (oldValue !== void 0) status.oldValue = oldValue;
        }
      } else if (status) {
        status.set = "update";
      }
    }
    if (ttl !== 0 && !this.#ttls) {
      this.#initializeTTLTracking();
    }
    if (this.#ttls) {
      if (!noUpdateTTL) {
        this.#setItemTTL(index, ttl, start);
      }
      if (status) this.#statusTTL(status, index);
    }
    if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return this;
  }
  /**
   * Evict the least recently used item, returning its value or
   * `undefined` if cache is empty.
   */
  pop() {
    try {
      while (this.#size) {
        const val = this.#valList[this.#head];
        this.#evict(true);
        if (this.#isBackgroundFetch(val)) {
          if (val.__staleWhileFetching) {
            return val.__staleWhileFetching;
          }
        } else if (val !== void 0) {
          return val;
        }
      }
    } finally {
      if (this.#hasDisposeAfter && this.#disposed) {
        const dt = this.#disposed;
        let task;
        while (task = dt?.shift()) {
          this.#disposeAfter?.(...task);
        }
      }
    }
  }
  #evict(free) {
    const head = this.#head;
    const k = this.#keyList[head];
    const v = this.#valList[head];
    if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
      v.__abortController.abort(new Error("evicted"));
    } else if (this.#hasDispose || this.#hasDisposeAfter) {
      if (this.#hasDispose) {
        this.#dispose?.(v, k, "evict");
      }
      if (this.#hasDisposeAfter) {
        this.#disposed?.push([
          v,
          k,
          "evict"
        ]);
      }
    }
    this.#removeItemSize(head);
    if (free) {
      this.#keyList[head] = void 0;
      this.#valList[head] = void 0;
      this.#free.push(head);
    }
    if (this.#size === 1) {
      this.#head = this.#tail = 0;
      this.#free.length = 0;
    } else {
      this.#head = this.#next[head];
    }
    this.#keyMap.delete(k);
    this.#size--;
    return head;
  }
  /**
   * Check if a key is in the cache, without updating the recency of use.
   * Will return false if the item is stale, even though it is technically
   * in the cache.
   *
   * Will not update item age unless
   * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
   */
  has(k, hasOptions = {}) {
    const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === void 0) {
        return false;
      }
      if (!this.#isStale(index)) {
        if (updateAgeOnHas) {
          this.#updateItemAge(index);
        }
        if (status) {
          status.has = "hit";
          this.#statusTTL(status, index);
        }
        return true;
      } else if (status) {
        status.has = "stale";
        this.#statusTTL(status, index);
      }
    } else if (status) {
      status.has = "miss";
    }
    return false;
  }
  /**
   * Like {@link LRUCache#get} but doesn't update recency or delete stale
   * items.
   *
   * Returns `undefined` if the item is stale, unless
   * {@link LRUCache.OptionsBase.allowStale} is set.
   */
  peek(k, peekOptions = {}) {
    const { allowStale = this.allowStale } = peekOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0 && (allowStale || !this.#isStale(index))) {
      const v = this.#valList[index];
      return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
    }
  }
  #backgroundFetch(k, index, options, context) {
    const v = index === void 0 ? void 0 : this.#valList[index];
    if (this.#isBackgroundFetch(v)) {
      return v;
    }
    const ac = new AbortController();
    const { signal } = options;
    signal?.addEventListener("abort", () => ac.abort(signal.reason), {
      signal: ac.signal
    });
    const fetchOpts = {
      signal: ac.signal,
      options,
      context
    };
    const cb = /* @__PURE__ */ __name((v2, updateCache = false) => {
      const { aborted } = ac.signal;
      const ignoreAbort = options.ignoreFetchAbort && v2 !== void 0;
      if (options.status) {
        if (aborted && !updateCache) {
          options.status.fetchAborted = true;
          options.status.fetchError = ac.signal.reason;
          if (ignoreAbort) options.status.fetchAbortIgnored = true;
        } else {
          options.status.fetchResolved = true;
        }
      }
      if (aborted && !ignoreAbort && !updateCache) {
        return fetchFail(ac.signal.reason);
      }
      const bf2 = p;
      if (this.#valList[index] === p) {
        if (v2 === void 0) {
          if (bf2.__staleWhileFetching) {
            this.#valList[index] = bf2.__staleWhileFetching;
          } else {
            this.delete(k);
          }
        } else {
          if (options.status) options.status.fetchUpdated = true;
          this.set(k, v2, fetchOpts.options);
        }
      }
      return v2;
    }, "cb");
    const eb = /* @__PURE__ */ __name((er) => {
      if (options.status) {
        options.status.fetchRejected = true;
        options.status.fetchError = er;
      }
      return fetchFail(er);
    }, "eb");
    const fetchFail = /* @__PURE__ */ __name((er) => {
      const { aborted } = ac.signal;
      const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
      const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
      const noDelete = allowStale || options.noDeleteOnFetchRejection;
      const bf2 = p;
      if (this.#valList[index] === p) {
        const del = !noDelete || bf2.__staleWhileFetching === void 0;
        if (del) {
          this.delete(k);
        } else if (!allowStaleAborted) {
          this.#valList[index] = bf2.__staleWhileFetching;
        }
      }
      if (allowStale) {
        if (options.status && bf2.__staleWhileFetching !== void 0) {
          options.status.returnedStale = true;
        }
        return bf2.__staleWhileFetching;
      } else if (bf2.__returned === bf2) {
        throw er;
      }
    }, "fetchFail");
    const pcall = /* @__PURE__ */ __name((res, rej) => {
      const fmp = this.#fetchMethod?.(k, v, fetchOpts);
      if (fmp && fmp instanceof Promise) {
        fmp.then((v2) => res(v2), rej);
      }
      ac.signal.addEventListener("abort", () => {
        if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
          res();
          if (options.allowStaleOnFetchAbort) {
            res = /* @__PURE__ */ __name((v2) => cb(v2, true), "res");
          }
        }
      });
    }, "pcall");
    if (options.status) options.status.fetchDispatched = true;
    const p = new Promise(pcall).then(cb, eb);
    const bf = Object.assign(p, {
      __abortController: ac,
      __staleWhileFetching: v,
      __returned: void 0
    });
    if (index === void 0) {
      this.set(k, bf, {
        ...fetchOpts.options,
        status: void 0
      });
      index = this.#keyMap.get(k);
    } else {
      this.#valList[index] = bf;
    }
    return bf;
  }
  #isBackgroundFetch(p) {
    if (!this.#hasFetchMethod) return false;
    const b = p;
    return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AbortController;
  }
  async fetch(k, fetchOptions = {}) {
    const {
      // get options
      allowStale = this.allowStale,
      updateAgeOnGet = this.updateAgeOnGet,
      noDeleteOnStaleGet = this.noDeleteOnStaleGet,
      // set options
      ttl = this.ttl,
      noDisposeOnSet = this.noDisposeOnSet,
      size = 0,
      sizeCalculation = this.sizeCalculation,
      noUpdateTTL = this.noUpdateTTL,
      // fetch exclusive options
      noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
      allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
      ignoreFetchAbort = this.ignoreFetchAbort,
      allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
      context,
      forceRefresh = false,
      status,
      signal
    } = fetchOptions;
    if (!this.#hasFetchMethod) {
      if (status) status.fetch = "get";
      return this.get(k, {
        allowStale,
        updateAgeOnGet,
        noDeleteOnStaleGet,
        status
      });
    }
    const options = {
      allowStale,
      updateAgeOnGet,
      noDeleteOnStaleGet,
      ttl,
      noDisposeOnSet,
      size,
      sizeCalculation,
      noUpdateTTL,
      noDeleteOnFetchRejection,
      allowStaleOnFetchRejection,
      allowStaleOnFetchAbort,
      ignoreFetchAbort,
      status,
      signal
    };
    let index = this.#keyMap.get(k);
    if (index === void 0) {
      if (status) status.fetch = "miss";
      const p = this.#backgroundFetch(k, index, options, context);
      return p.__returned = p;
    } else {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        const stale = allowStale && v.__staleWhileFetching !== void 0;
        if (status) {
          status.fetch = "inflight";
          if (stale) status.returnedStale = true;
        }
        return stale ? v.__staleWhileFetching : v.__returned = v;
      }
      const isStale = this.#isStale(index);
      if (!forceRefresh && !isStale) {
        if (status) status.fetch = "hit";
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        if (status) this.#statusTTL(status, index);
        return v;
      }
      const p = this.#backgroundFetch(k, index, options, context);
      const hasStale = p.__staleWhileFetching !== void 0;
      const staleVal = hasStale && allowStale;
      if (status) {
        status.fetch = isStale ? "stale" : "refresh";
        if (staleVal && isStale) status.returnedStale = true;
      }
      return staleVal ? p.__staleWhileFetching : p.__returned = p;
    }
  }
  /**
   * Return a value from the cache. Will update the recency of the cache
   * entry found.
   *
   * If the key is not found, get() will return `undefined`.
   */
  get(k, getOptions = {}) {
    const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
    const index = this.#keyMap.get(k);
    if (index !== void 0) {
      const value = this.#valList[index];
      const fetching = this.#isBackgroundFetch(value);
      if (status) this.#statusTTL(status, index);
      if (this.#isStale(index)) {
        if (status) status.get = "stale";
        if (!fetching) {
          if (!noDeleteOnStaleGet) {
            this.delete(k);
          }
          if (status && allowStale) status.returnedStale = true;
          return allowStale ? value : void 0;
        } else {
          if (status && allowStale && value.__staleWhileFetching !== void 0) {
            status.returnedStale = true;
          }
          return allowStale ? value.__staleWhileFetching : void 0;
        }
      } else {
        if (status) status.get = "hit";
        if (fetching) {
          return value.__staleWhileFetching;
        }
        this.#moveToTail(index);
        if (updateAgeOnGet) {
          this.#updateItemAge(index);
        }
        return value;
      }
    } else if (status) {
      status.get = "miss";
    }
  }
  #connect(p, n) {
    this.#prev[n] = p;
    this.#next[p] = n;
  }
  #moveToTail(index) {
    if (index !== this.#tail) {
      if (index === this.#head) {
        this.#head = this.#next[index];
      } else {
        this.#connect(this.#prev[index], this.#next[index]);
      }
      this.#connect(this.#tail, index);
      this.#tail = index;
    }
  }
  /**
   * Deletes a key out of the cache.
   * Returns true if the key was deleted, false otherwise.
   */
  delete(k) {
    let deleted = false;
    if (this.#size !== 0) {
      const index = this.#keyMap.get(k);
      if (index !== void 0) {
        deleted = true;
        if (this.#size === 1) {
          this.clear();
        } else {
          this.#removeItemSize(index);
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error("deleted"));
          } else if (this.#hasDispose || this.#hasDisposeAfter) {
            if (this.#hasDispose) {
              this.#dispose?.(v, k, "delete");
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([
                v,
                k,
                "delete"
              ]);
            }
          }
          this.#keyMap.delete(k);
          this.#keyList[index] = void 0;
          this.#valList[index] = void 0;
          if (index === this.#tail) {
            this.#tail = this.#prev[index];
          } else if (index === this.#head) {
            this.#head = this.#next[index];
          } else {
            this.#next[this.#prev[index]] = this.#next[index];
            this.#prev[this.#next[index]] = this.#prev[index];
          }
          this.#size--;
          this.#free.push(index);
        }
      }
    }
    if (this.#hasDisposeAfter && this.#disposed?.length) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
    return deleted;
  }
  /**
   * Clear the cache entirely, throwing away all values.
   */
  clear() {
    for (const index of this.#rindexes({
      allowStale: true
    })) {
      const v = this.#valList[index];
      if (this.#isBackgroundFetch(v)) {
        v.__abortController.abort(new Error("deleted"));
      } else {
        const k = this.#keyList[index];
        if (this.#hasDispose) {
          this.#dispose?.(v, k, "delete");
        }
        if (this.#hasDisposeAfter) {
          this.#disposed?.push([
            v,
            k,
            "delete"
          ]);
        }
      }
    }
    this.#keyMap.clear();
    this.#valList.fill(void 0);
    this.#keyList.fill(void 0);
    if (this.#ttls && this.#starts) {
      this.#ttls.fill(0);
      this.#starts.fill(0);
    }
    if (this.#sizes) {
      this.#sizes.fill(0);
    }
    this.#head = 0;
    this.#tail = 0;
    this.#free.length = 0;
    this.#calculatedSize = 0;
    this.#size = 0;
    if (this.#hasDisposeAfter && this.#disposed) {
      const dt = this.#disposed;
      let task;
      while (task = dt?.shift()) {
        this.#disposeAfter?.(...task);
      }
    }
  }
};
var proc = typeof process === "object" && process ? process : {
  stdout: null,
  stderr: null
};
var isStream = /* @__PURE__ */ __name((s) => !!s && typeof s === "object" && (s instanceof Minipass || s instanceof Stream__default.default || isReadable(s) || isWritable(s)), "isStream");
var isReadable = /* @__PURE__ */ __name((s) => !!s && typeof s === "object" && s instanceof events.EventEmitter && typeof s.pipe === "function" && // node core Writable streams have a pipe() method, but it throws
s.pipe !== Stream__default.default.Writable.prototype.pipe, "isReadable");
var isWritable = /* @__PURE__ */ __name((s) => !!s && typeof s === "object" && s instanceof events.EventEmitter && typeof s.write === "function" && typeof s.end === "function", "isWritable");
var EOF = Symbol("EOF");
var MAYBE_EMIT_END = Symbol("maybeEmitEnd");
var EMITTED_END = Symbol("emittedEnd");
var EMITTING_END = Symbol("emittingEnd");
var EMITTED_ERROR = Symbol("emittedError");
var CLOSED = Symbol("closed");
var READ = Symbol("read");
var FLUSH = Symbol("flush");
var FLUSHCHUNK = Symbol("flushChunk");
var ENCODING = Symbol("encoding");
var DECODER = Symbol("decoder");
var FLOWING = Symbol("flowing");
var PAUSED = Symbol("paused");
var RESUME = Symbol("resume");
var BUFFER = Symbol("buffer");
var PIPES = Symbol("pipes");
var BUFFERLENGTH = Symbol("bufferLength");
var BUFFERPUSH = Symbol("bufferPush");
var BUFFERSHIFT = Symbol("bufferShift");
var OBJECTMODE = Symbol("objectMode");
var DESTROYED = Symbol("destroyed");
var ERROR = Symbol("error");
var EMITDATA = Symbol("emitData");
var EMITEND = Symbol("emitEnd");
var EMITEND2 = Symbol("emitEnd2");
var ASYNC = Symbol("async");
var ABORT = Symbol("abort");
var ABORTED = Symbol("aborted");
var SIGNAL = Symbol("signal");
var DATALISTENERS = Symbol("dataListeners");
var DISCARDED = Symbol("discarded");
var defer = /* @__PURE__ */ __name((fn) => Promise.resolve().then(fn), "defer");
var nodefer = /* @__PURE__ */ __name((fn) => fn(), "nodefer");
var isEndish = /* @__PURE__ */ __name((ev) => ev === "end" || ev === "finish" || ev === "prefinish", "isEndish");
var isArrayBufferLike = /* @__PURE__ */ __name((b) => b instanceof ArrayBuffer || !!b && typeof b === "object" && b.constructor && b.constructor.name === "ArrayBuffer" && b.byteLength >= 0, "isArrayBufferLike");
var isArrayBufferView = /* @__PURE__ */ __name((b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b), "isArrayBufferView");
var Pipe = class Pipe2 {
  static {
    __name(this, "Pipe");
  }
  src;
  dest;
  opts;
  ondrain;
  constructor(src, dest, opts) {
    this.src = src;
    this.dest = dest;
    this.opts = opts;
    this.ondrain = () => src[RESUME]();
    this.dest.on("drain", this.ondrain);
  }
  unpipe() {
    this.dest.removeListener("drain", this.ondrain);
  }
  // only here for the prototype
  /* c8 ignore start */
  proxyErrors(_er) {
  }
  /* c8 ignore stop */
  end() {
    this.unpipe();
    if (this.opts.end) this.dest.end();
  }
};
var PipeProxyErrors = class PipeProxyErrors2 extends Pipe {
  static {
    __name(this, "PipeProxyErrors");
  }
  unpipe() {
    this.src.removeListener("error", this.proxyErrors);
    super.unpipe();
  }
  constructor(src, dest, opts) {
    super(src, dest, opts);
    this.proxyErrors = (er) => dest.emit("error", er);
    src.on("error", this.proxyErrors);
  }
};
var isObjectModeOptions = /* @__PURE__ */ __name((o) => !!o.objectMode, "isObjectModeOptions");
var isEncodingOptions = /* @__PURE__ */ __name((o) => !o.objectMode && !!o.encoding && o.encoding !== "buffer", "isEncodingOptions");
var Minipass = class extends events.EventEmitter {
  static {
    __name(this, "Minipass");
  }
  [FLOWING] = false;
  [PAUSED] = false;
  [PIPES] = [];
  [BUFFER] = [];
  [OBJECTMODE];
  [ENCODING];
  [ASYNC];
  [DECODER];
  [EOF] = false;
  [EMITTED_END] = false;
  [EMITTING_END] = false;
  [CLOSED] = false;
  [EMITTED_ERROR] = null;
  [BUFFERLENGTH] = 0;
  [DESTROYED] = false;
  [SIGNAL];
  [ABORTED] = false;
  [DATALISTENERS] = 0;
  [DISCARDED] = false;
  /**
   * true if the stream can be written
   */
  writable = true;
  /**
   * true if the stream can be read
   */
  readable = true;
  /**
   * If `RType` is Buffer, then options do not need to be provided.
   * Otherwise, an options object must be provided to specify either
   * {@link Minipass.SharedOptions.objectMode} or
   * {@link Minipass.SharedOptions.encoding}, as appropriate.
   */
  constructor(...args) {
    const options = args[0] || {};
    super();
    if (options.objectMode && typeof options.encoding === "string") {
      throw new TypeError("Encoding and objectMode may not be used together");
    }
    if (isObjectModeOptions(options)) {
      this[OBJECTMODE] = true;
      this[ENCODING] = null;
    } else if (isEncodingOptions(options)) {
      this[ENCODING] = options.encoding;
      this[OBJECTMODE] = false;
    } else {
      this[OBJECTMODE] = false;
      this[ENCODING] = null;
    }
    this[ASYNC] = !!options.async;
    this[DECODER] = this[ENCODING] ? new string_decoder.StringDecoder(this[ENCODING]) : null;
    if (options && options.debugExposeBuffer === true) {
      Object.defineProperty(this, "buffer", {
        get: /* @__PURE__ */ __name(() => this[BUFFER], "get")
      });
    }
    if (options && options.debugExposePipes === true) {
      Object.defineProperty(this, "pipes", {
        get: /* @__PURE__ */ __name(() => this[PIPES], "get")
      });
    }
    const { signal } = options;
    if (signal) {
      this[SIGNAL] = signal;
      if (signal.aborted) {
        this[ABORT]();
      } else {
        signal.addEventListener("abort", () => this[ABORT]());
      }
    }
  }
  /**
   * The amount of data stored in the buffer waiting to be read.
   *
   * For Buffer strings, this will be the total byte length.
   * For string encoding streams, this will be the string character length,
   * according to JavaScript's `string.length` logic.
   * For objectMode streams, this is a count of the items waiting to be
   * emitted.
   */
  get bufferLength() {
    return this[BUFFERLENGTH];
  }
  /**
   * The `BufferEncoding` currently in use, or `null`
   */
  get encoding() {
    return this[ENCODING];
  }
  /**
   * @deprecated - This is a read only property
   */
  set encoding(_enc) {
    throw new Error("Encoding must be set at instantiation time");
  }
  /**
   * @deprecated - Encoding may only be set at instantiation time
   */
  setEncoding(_enc) {
    throw new Error("Encoding must be set at instantiation time");
  }
  /**
   * True if this is an objectMode stream
   */
  get objectMode() {
    return this[OBJECTMODE];
  }
  /**
   * @deprecated - This is a read-only property
   */
  set objectMode(_om) {
    throw new Error("objectMode must be set at instantiation time");
  }
  /**
   * true if this is an async stream
   */
  get ["async"]() {
    return this[ASYNC];
  }
  /**
   * Set to true to make this stream async.
   *
   * Once set, it cannot be unset, as this would potentially cause incorrect
   * behavior.  Ie, a sync stream can be made async, but an async stream
   * cannot be safely made sync.
   */
  set ["async"](a) {
    this[ASYNC] = this[ASYNC] || !!a;
  }
  // drop everything and get out of the flow completely
  [ABORT]() {
    this[ABORTED] = true;
    this.emit("abort", this[SIGNAL]?.reason);
    this.destroy(this[SIGNAL]?.reason);
  }
  /**
   * True if the stream has been aborted.
   */
  get aborted() {
    return this[ABORTED];
  }
  /**
   * No-op setter. Stream aborted status is set via the AbortSignal provided
   * in the constructor options.
   */
  set aborted(_) {
  }
  write(chunk, encoding, cb) {
    if (this[ABORTED]) return false;
    if (this[EOF]) throw new Error("write after end");
    if (this[DESTROYED]) {
      this.emit("error", Object.assign(new Error("Cannot call write after a stream was destroyed"), {
        code: "ERR_STREAM_DESTROYED"
      }));
      return true;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = "utf8";
    }
    if (!encoding) encoding = "utf8";
    const fn = this[ASYNC] ? defer : nodefer;
    if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
      if (isArrayBufferView(chunk)) {
        chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
      } else if (isArrayBufferLike(chunk)) {
        chunk = Buffer.from(chunk);
      } else if (typeof chunk !== "string") {
        throw new Error("Non-contiguous data written to non-objectMode stream");
      }
    }
    if (this[OBJECTMODE]) {
      if (this[FLOWING] && this[BUFFERLENGTH] !== 0) this[FLUSH](true);
      if (this[FLOWING]) this.emit("data", chunk);
      else this[BUFFERPUSH](chunk);
      if (this[BUFFERLENGTH] !== 0) this.emit("readable");
      if (cb) fn(cb);
      return this[FLOWING];
    }
    if (!chunk.length) {
      if (this[BUFFERLENGTH] !== 0) this.emit("readable");
      if (cb) fn(cb);
      return this[FLOWING];
    }
    if (typeof chunk === "string" && // unless it is a string already ready for us to use
    !(encoding === this[ENCODING] && !this[DECODER]?.lastNeed)) {
      chunk = Buffer.from(chunk, encoding);
    }
    if (Buffer.isBuffer(chunk) && this[ENCODING]) {
      chunk = this[DECODER].write(chunk);
    }
    if (this[FLOWING] && this[BUFFERLENGTH] !== 0) this[FLUSH](true);
    if (this[FLOWING]) this.emit("data", chunk);
    else this[BUFFERPUSH](chunk);
    if (this[BUFFERLENGTH] !== 0) this.emit("readable");
    if (cb) fn(cb);
    return this[FLOWING];
  }
  /**
   * Low-level explicit read method.
   *
   * In objectMode, the argument is ignored, and one item is returned if
   * available.
   *
   * `n` is the number of bytes (or in the case of encoding streams,
   * characters) to consume. If `n` is not provided, then the entire buffer
   * is returned, or `null` is returned if no data is available.
   *
   * If `n` is greater that the amount of data in the internal buffer,
   * then `null` is returned.
   */
  read(n) {
    if (this[DESTROYED]) return null;
    this[DISCARDED] = false;
    if (this[BUFFERLENGTH] === 0 || n === 0 || n && n > this[BUFFERLENGTH]) {
      this[MAYBE_EMIT_END]();
      return null;
    }
    if (this[OBJECTMODE]) n = null;
    if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
      this[BUFFER] = [
        this[ENCODING] ? this[BUFFER].join("") : Buffer.concat(this[BUFFER], this[BUFFERLENGTH])
      ];
    }
    const ret = this[READ](n || null, this[BUFFER][0]);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [READ](n, chunk) {
    if (this[OBJECTMODE]) this[BUFFERSHIFT]();
    else {
      const c = chunk;
      if (n === c.length || n === null) this[BUFFERSHIFT]();
      else if (typeof c === "string") {
        this[BUFFER][0] = c.slice(n);
        chunk = c.slice(0, n);
        this[BUFFERLENGTH] -= n;
      } else {
        this[BUFFER][0] = c.subarray(n);
        chunk = c.subarray(0, n);
        this[BUFFERLENGTH] -= n;
      }
    }
    this.emit("data", chunk);
    if (!this[BUFFER].length && !this[EOF]) this.emit("drain");
    return chunk;
  }
  end(chunk, encoding, cb) {
    if (typeof chunk === "function") {
      cb = chunk;
      chunk = void 0;
    }
    if (typeof encoding === "function") {
      cb = encoding;
      encoding = "utf8";
    }
    if (chunk !== void 0) this.write(chunk, encoding);
    if (cb) this.once("end", cb);
    this[EOF] = true;
    this.writable = false;
    if (this[FLOWING] || !this[PAUSED]) this[MAYBE_EMIT_END]();
    return this;
  }
  // don't let the internal resume be overwritten
  [RESUME]() {
    if (this[DESTROYED]) return;
    if (!this[DATALISTENERS] && !this[PIPES].length) {
      this[DISCARDED] = true;
    }
    this[PAUSED] = false;
    this[FLOWING] = true;
    this.emit("resume");
    if (this[BUFFER].length) this[FLUSH]();
    else if (this[EOF]) this[MAYBE_EMIT_END]();
    else this.emit("drain");
  }
  /**
   * Resume the stream if it is currently in a paused state
   *
   * If called when there are no pipe destinations or `data` event listeners,
   * this will place the stream in a "discarded" state, where all data will
   * be thrown away. The discarded state is removed if a pipe destination or
   * data handler is added, if pause() is called, or if any synchronous or
   * asynchronous iteration is started.
   */
  resume() {
    return this[RESUME]();
  }
  /**
   * Pause the stream
   */
  pause() {
    this[FLOWING] = false;
    this[PAUSED] = true;
    this[DISCARDED] = false;
  }
  /**
   * true if the stream has been forcibly destroyed
   */
  get destroyed() {
    return this[DESTROYED];
  }
  /**
   * true if the stream is currently in a flowing state, meaning that
   * any writes will be immediately emitted.
   */
  get flowing() {
    return this[FLOWING];
  }
  /**
   * true if the stream is currently in a paused state
   */
  get paused() {
    return this[PAUSED];
  }
  [BUFFERPUSH](chunk) {
    if (this[OBJECTMODE]) this[BUFFERLENGTH] += 1;
    else this[BUFFERLENGTH] += chunk.length;
    this[BUFFER].push(chunk);
  }
  [BUFFERSHIFT]() {
    if (this[OBJECTMODE]) this[BUFFERLENGTH] -= 1;
    else this[BUFFERLENGTH] -= this[BUFFER][0].length;
    return this[BUFFER].shift();
  }
  [FLUSH](noDrain = false) {
    do {
    } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) && this[BUFFER].length);
    if (!noDrain && !this[BUFFER].length && !this[EOF]) this.emit("drain");
  }
  [FLUSHCHUNK](chunk) {
    this.emit("data", chunk);
    return this[FLOWING];
  }
  /**
   * Pipe all data emitted by this stream into the destination provided.
   *
   * Triggers the flow of data.
   */
  pipe(dest, opts) {
    if (this[DESTROYED]) return dest;
    this[DISCARDED] = false;
    const ended = this[EMITTED_END];
    opts = opts || {};
    if (dest === proc.stdout || dest === proc.stderr) opts.end = false;
    else opts.end = opts.end !== false;
    opts.proxyErrors = !!opts.proxyErrors;
    if (ended) {
      if (opts.end) dest.end();
    } else {
      this[PIPES].push(!opts.proxyErrors ? new Pipe(this, dest, opts) : new PipeProxyErrors(this, dest, opts));
      if (this[ASYNC]) defer(() => this[RESUME]());
      else this[RESUME]();
    }
    return dest;
  }
  /**
   * Fully unhook a piped destination stream.
   *
   * If the destination stream was the only consumer of this stream (ie,
   * there are no other piped destinations or `'data'` event listeners)
   * then the flow of data will stop until there is another consumer or
   * {@link Minipass#resume} is explicitly called.
   */
  unpipe(dest) {
    const p = this[PIPES].find((p2) => p2.dest === dest);
    if (p) {
      if (this[PIPES].length === 1) {
        if (this[FLOWING] && this[DATALISTENERS] === 0) {
          this[FLOWING] = false;
        }
        this[PIPES] = [];
      } else this[PIPES].splice(this[PIPES].indexOf(p), 1);
      p.unpipe();
    }
  }
  /**
   * Alias for {@link Minipass#on}
   */
  addListener(ev, handler) {
    return this.on(ev, handler);
  }
  /**
   * Mostly identical to `EventEmitter.on`, with the following
   * behavior differences to prevent data loss and unnecessary hangs:
   *
   * - Adding a 'data' event handler will trigger the flow of data
   *
   * - Adding a 'readable' event handler when there is data waiting to be read
   *   will cause 'readable' to be emitted immediately.
   *
   * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
   *   already passed will cause the event to be emitted immediately and all
   *   handlers removed.
   *
   * - Adding an 'error' event handler after an error has been emitted will
   *   cause the event to be re-emitted immediately with the error previously
   *   raised.
   */
  on(ev, handler) {
    const ret = super.on(ev, handler);
    if (ev === "data") {
      this[DISCARDED] = false;
      this[DATALISTENERS]++;
      if (!this[PIPES].length && !this[FLOWING]) {
        this[RESUME]();
      }
    } else if (ev === "readable" && this[BUFFERLENGTH] !== 0) {
      super.emit("readable");
    } else if (isEndish(ev) && this[EMITTED_END]) {
      super.emit(ev);
      this.removeAllListeners(ev);
    } else if (ev === "error" && this[EMITTED_ERROR]) {
      const h = handler;
      if (this[ASYNC]) defer(() => h.call(this, this[EMITTED_ERROR]));
      else h.call(this, this[EMITTED_ERROR]);
    }
    return ret;
  }
  /**
   * Alias for {@link Minipass#off}
   */
  removeListener(ev, handler) {
    return this.off(ev, handler);
  }
  /**
   * Mostly identical to `EventEmitter.off`
   *
   * If a 'data' event handler is removed, and it was the last consumer
   * (ie, there are no pipe destinations or other 'data' event listeners),
   * then the flow of data will stop until there is another consumer or
   * {@link Minipass#resume} is explicitly called.
   */
  off(ev, handler) {
    const ret = super.off(ev, handler);
    if (ev === "data") {
      this[DATALISTENERS] = this.listeners("data").length;
      if (this[DATALISTENERS] === 0 && !this[DISCARDED] && !this[PIPES].length) {
        this[FLOWING] = false;
      }
    }
    return ret;
  }
  /**
   * Mostly identical to `EventEmitter.removeAllListeners`
   *
   * If all 'data' event handlers are removed, and they were the last consumer
   * (ie, there are no pipe destinations), then the flow of data will stop
   * until there is another consumer or {@link Minipass#resume} is explicitly
   * called.
   */
  removeAllListeners(ev) {
    const ret = super.removeAllListeners(ev);
    if (ev === "data" || ev === void 0) {
      this[DATALISTENERS] = 0;
      if (!this[DISCARDED] && !this[PIPES].length) {
        this[FLOWING] = false;
      }
    }
    return ret;
  }
  /**
   * true if the 'end' event has been emitted
   */
  get emittedEnd() {
    return this[EMITTED_END];
  }
  [MAYBE_EMIT_END]() {
    if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this[BUFFER].length === 0 && this[EOF]) {
      this[EMITTING_END] = true;
      this.emit("end");
      this.emit("prefinish");
      this.emit("finish");
      if (this[CLOSED]) this.emit("close");
      this[EMITTING_END] = false;
    }
  }
  /**
   * Mostly identical to `EventEmitter.emit`, with the following
   * behavior differences to prevent data loss and unnecessary hangs:
   *
   * If the stream has been destroyed, and the event is something other
   * than 'close' or 'error', then `false` is returned and no handlers
   * are called.
   *
   * If the event is 'end', and has already been emitted, then the event
   * is ignored. If the stream is in a paused or non-flowing state, then
   * the event will be deferred until data flow resumes. If the stream is
   * async, then handlers will be called on the next tick rather than
   * immediately.
   *
   * If the event is 'close', and 'end' has not yet been emitted, then
   * the event will be deferred until after 'end' is emitted.
   *
   * If the event is 'error', and an AbortSignal was provided for the stream,
   * and there are no listeners, then the event is ignored, matching the
   * behavior of node core streams in the presense of an AbortSignal.
   *
   * If the event is 'finish' or 'prefinish', then all listeners will be
   * removed after emitting the event, to prevent double-firing.
   */
  emit(ev, ...args) {
    const data = args[0];
    if (ev !== "error" && ev !== "close" && ev !== DESTROYED && this[DESTROYED]) {
      return false;
    } else if (ev === "data") {
      return !this[OBJECTMODE] && !data ? false : this[ASYNC] ? (defer(() => this[EMITDATA](data)), true) : this[EMITDATA](data);
    } else if (ev === "end") {
      return this[EMITEND]();
    } else if (ev === "close") {
      this[CLOSED] = true;
      if (!this[EMITTED_END] && !this[DESTROYED]) return false;
      const ret2 = super.emit("close");
      this.removeAllListeners("close");
      return ret2;
    } else if (ev === "error") {
      this[EMITTED_ERROR] = data;
      super.emit(ERROR, data);
      const ret2 = !this[SIGNAL] || this.listeners("error").length ? super.emit("error", data) : false;
      this[MAYBE_EMIT_END]();
      return ret2;
    } else if (ev === "resume") {
      const ret2 = super.emit("resume");
      this[MAYBE_EMIT_END]();
      return ret2;
    } else if (ev === "finish" || ev === "prefinish") {
      const ret2 = super.emit(ev);
      this.removeAllListeners(ev);
      return ret2;
    }
    const ret = super.emit(ev, ...args);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [EMITDATA](data) {
    for (const p of this[PIPES]) {
      if (p.dest.write(data) === false) this.pause();
    }
    const ret = this[DISCARDED] ? false : super.emit("data", data);
    this[MAYBE_EMIT_END]();
    return ret;
  }
  [EMITEND]() {
    if (this[EMITTED_END]) return false;
    this[EMITTED_END] = true;
    this.readable = false;
    return this[ASYNC] ? (defer(() => this[EMITEND2]()), true) : this[EMITEND2]();
  }
  [EMITEND2]() {
    if (this[DECODER]) {
      const data = this[DECODER].end();
      if (data) {
        for (const p of this[PIPES]) {
          p.dest.write(data);
        }
        if (!this[DISCARDED]) super.emit("data", data);
      }
    }
    for (const p of this[PIPES]) {
      p.end();
    }
    const ret = super.emit("end");
    this.removeAllListeners("end");
    return ret;
  }
  /**
   * Return a Promise that resolves to an array of all emitted data once
   * the stream ends.
   */
  async collect() {
    const buf = Object.assign([], {
      dataLength: 0
    });
    if (!this[OBJECTMODE]) buf.dataLength = 0;
    const p = this.promise();
    this.on("data", (c) => {
      buf.push(c);
      if (!this[OBJECTMODE]) buf.dataLength += c.length;
    });
    await p;
    return buf;
  }
  /**
   * Return a Promise that resolves to the concatenation of all emitted data
   * once the stream ends.
   *
   * Not allowed on objectMode streams.
   */
  async concat() {
    if (this[OBJECTMODE]) {
      throw new Error("cannot concat in objectMode");
    }
    const buf = await this.collect();
    return this[ENCODING] ? buf.join("") : Buffer.concat(buf, buf.dataLength);
  }
  /**
   * Return a void Promise that resolves once the stream ends.
   */
  async promise() {
    return new Promise((resolve2, reject) => {
      this.on(DESTROYED, () => reject(new Error("stream destroyed")));
      this.on("error", (er) => reject(er));
      this.on("end", () => resolve2());
    });
  }
  /**
   * Asynchronous `for await of` iteration.
   *
   * This will continue emitting all chunks until the stream terminates.
   */
  [Symbol.asyncIterator]() {
    this[DISCARDED] = false;
    let stopped = false;
    const stop = /* @__PURE__ */ __name(async () => {
      this.pause();
      stopped = true;
      return {
        value: void 0,
        done: true
      };
    }, "stop");
    const next = /* @__PURE__ */ __name(() => {
      if (stopped) return stop();
      const res = this.read();
      if (res !== null) return Promise.resolve({
        done: false,
        value: res
      });
      if (this[EOF]) return stop();
      let resolve2;
      let reject;
      const onerr = /* @__PURE__ */ __name((er) => {
        this.off("data", ondata);
        this.off("end", onend);
        this.off(DESTROYED, ondestroy);
        stop();
        reject(er);
      }, "onerr");
      const ondata = /* @__PURE__ */ __name((value) => {
        this.off("error", onerr);
        this.off("end", onend);
        this.off(DESTROYED, ondestroy);
        this.pause();
        resolve2({
          value,
          done: !!this[EOF]
        });
      }, "ondata");
      const onend = /* @__PURE__ */ __name(() => {
        this.off("error", onerr);
        this.off("data", ondata);
        this.off(DESTROYED, ondestroy);
        stop();
        resolve2({
          done: true,
          value: void 0
        });
      }, "onend");
      const ondestroy = /* @__PURE__ */ __name(() => onerr(new Error("stream destroyed")), "ondestroy");
      return new Promise((res2, rej) => {
        reject = rej;
        resolve2 = res2;
        this.once(DESTROYED, ondestroy);
        this.once("error", onerr);
        this.once("end", onend);
        this.once("data", ondata);
      });
    }, "next");
    return {
      next,
      throw: stop,
      return: stop,
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  /**
   * Synchronous `for of` iteration.
   *
   * The iteration will terminate when the internal buffer runs out, even
   * if the stream has not yet terminated.
   */
  [Symbol.iterator]() {
    this[DISCARDED] = false;
    let stopped = false;
    const stop = /* @__PURE__ */ __name(() => {
      this.pause();
      this.off(ERROR, stop);
      this.off(DESTROYED, stop);
      this.off("end", stop);
      stopped = true;
      return {
        done: true,
        value: void 0
      };
    }, "stop");
    const next = /* @__PURE__ */ __name(() => {
      if (stopped) return stop();
      const value = this.read();
      return value === null ? stop() : {
        done: false,
        value
      };
    }, "next");
    this.once("end", stop);
    this.once(ERROR, stop);
    this.once(DESTROYED, stop);
    return {
      next,
      throw: stop,
      return: stop,
      [Symbol.iterator]() {
        return this;
      }
    };
  }
  /**
   * Destroy a stream, preventing it from being used for any further purpose.
   *
   * If the stream has a `close()` method, then it will be called on
   * destruction.
   *
   * After destruction, any attempt to write data, read data, or emit most
   * events will be ignored.
   *
   * If an error argument is provided, then it will be emitted in an
   * 'error' event.
   */
  destroy(er) {
    if (this[DESTROYED]) {
      if (er) this.emit("error", er);
      else this.emit(DESTROYED);
      return this;
    }
    this[DESTROYED] = true;
    this[DISCARDED] = true;
    this[BUFFER].length = 0;
    this[BUFFERLENGTH] = 0;
    const wc = this;
    if (typeof wc.close === "function" && !this[CLOSED]) wc.close();
    if (er) this.emit("error", er);
    else this.emit(DESTROYED);
    return this;
  }
  /**
   * Alias for {@link isStream}
   *
   * Former export location, maintained for backwards compatibility.
   *
   * @deprecated
   */
  static get isStream() {
    return isStream;
  }
};

// ../../node_modules/.pnpm/path-scurry@2.0.0/node_modules/path-scurry/dist/esm/index.js
var realpathSync = actualFS.realpathSync.native;
var defaultFS = {
  lstatSync: actualFS.lstatSync,
  readdir: actualFS.readdir,
  readdirSync: actualFS.readdirSync,
  readlinkSync: actualFS.readlinkSync,
  realpathSync,
  promises: {
    lstat: promises.lstat,
    readdir: promises.readdir,
    readlink: promises.readlink,
    realpath: promises.realpath
  }
};
var fsFromOption = /* @__PURE__ */ __name((fsOption) => !fsOption || fsOption === defaultFS || fsOption === actualFS__namespace ? defaultFS : {
  ...defaultFS,
  ...fsOption,
  promises: {
    ...defaultFS.promises,
    ...fsOption.promises || {}
  }
}, "fsFromOption");
var uncDriveRegexp = /^\\\\\?\\([a-z]:)\\?$/i;
var uncToDrive = /* @__PURE__ */ __name((rootPath) => rootPath.replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\"), "uncToDrive");
var eitherSep = /[\\\/]/;
var UNKNOWN = 0;
var IFIFO = 1;
var IFCHR = 2;
var IFDIR = 4;
var IFBLK = 6;
var IFREG = 8;
var IFLNK = 10;
var IFSOCK = 12;
var IFMT = 15;
var IFMT_UNKNOWN = ~IFMT;
var READDIR_CALLED = 16;
var LSTAT_CALLED = 32;
var ENOTDIR = 64;
var ENOENT = 128;
var ENOREADLINK = 256;
var ENOREALPATH = 512;
var ENOCHILD = ENOTDIR | ENOENT | ENOREALPATH;
var TYPEMASK = 1023;
var entToType = /* @__PURE__ */ __name((s) => s.isFile() ? IFREG : s.isDirectory() ? IFDIR : s.isSymbolicLink() ? IFLNK : s.isCharacterDevice() ? IFCHR : s.isBlockDevice() ? IFBLK : s.isSocket() ? IFSOCK : s.isFIFO() ? IFIFO : UNKNOWN, "entToType");
var normalizeCache = /* @__PURE__ */ new Map();
var normalize = /* @__PURE__ */ __name((s) => {
  const c = normalizeCache.get(s);
  if (c) return c;
  const n = s.normalize("NFKD");
  normalizeCache.set(s, n);
  return n;
}, "normalize");
var normalizeNocaseCache = /* @__PURE__ */ new Map();
var normalizeNocase = /* @__PURE__ */ __name((s) => {
  const c = normalizeNocaseCache.get(s);
  if (c) return c;
  const n = normalize(s.toLowerCase());
  normalizeNocaseCache.set(s, n);
  return n;
}, "normalizeNocase");
var ResolveCache = class extends LRUCache {
  static {
    __name(this, "ResolveCache");
  }
  constructor() {
    super({
      max: 256
    });
  }
};
var ChildrenCache = class extends LRUCache {
  static {
    __name(this, "ChildrenCache");
  }
  constructor(maxSize = 16 * 1024) {
    super({
      maxSize,
      // parent + children
      sizeCalculation: /* @__PURE__ */ __name((a) => a.length + 1, "sizeCalculation")
    });
  }
};
var setAsCwd = Symbol("PathScurry setAsCwd");
var PathBase = class {
  static {
    __name(this, "PathBase");
  }
  /**
   * the basename of this path
   *
   * **Important**: *always* test the path name against any test string
   * usingthe {@link isNamed} method, and not by directly comparing this
   * string. Otherwise, unicode path strings that the system sees as identical
   * will not be properly treated as the same path, leading to incorrect
   * behavior and possible security issues.
   */
  name;
  /**
   * the Path entry corresponding to the path root.
   *
   * @internal
   */
  root;
  /**
   * All roots found within the current PathScurry family
   *
   * @internal
   */
  roots;
  /**
   * a reference to the parent path, or undefined in the case of root entries
   *
   * @internal
   */
  parent;
  /**
   * boolean indicating whether paths are compared case-insensitively
   * @internal
   */
  nocase;
  /**
   * boolean indicating that this path is the current working directory
   * of the PathScurry collection that contains it.
   */
  isCWD = false;
  // potential default fs override
  #fs;
  // Stats fields
  #dev;
  get dev() {
    return this.#dev;
  }
  #mode;
  get mode() {
    return this.#mode;
  }
  #nlink;
  get nlink() {
    return this.#nlink;
  }
  #uid;
  get uid() {
    return this.#uid;
  }
  #gid;
  get gid() {
    return this.#gid;
  }
  #rdev;
  get rdev() {
    return this.#rdev;
  }
  #blksize;
  get blksize() {
    return this.#blksize;
  }
  #ino;
  get ino() {
    return this.#ino;
  }
  #size;
  get size() {
    return this.#size;
  }
  #blocks;
  get blocks() {
    return this.#blocks;
  }
  #atimeMs;
  get atimeMs() {
    return this.#atimeMs;
  }
  #mtimeMs;
  get mtimeMs() {
    return this.#mtimeMs;
  }
  #ctimeMs;
  get ctimeMs() {
    return this.#ctimeMs;
  }
  #birthtimeMs;
  get birthtimeMs() {
    return this.#birthtimeMs;
  }
  #atime;
  get atime() {
    return this.#atime;
  }
  #mtime;
  get mtime() {
    return this.#mtime;
  }
  #ctime;
  get ctime() {
    return this.#ctime;
  }
  #birthtime;
  get birthtime() {
    return this.#birthtime;
  }
  #matchName;
  #depth;
  #fullpath;
  #fullpathPosix;
  #relative;
  #relativePosix;
  #type;
  #children;
  #linkTarget;
  #realpath;
  /**
   * This property is for compatibility with the Dirent class as of
   * Node v20, where Dirent['parentPath'] refers to the path of the
   * directory that was passed to readdir. For root entries, it's the path
   * to the entry itself.
   */
  get parentPath() {
    return (this.parent || this).fullpath();
  }
  /**
   * Deprecated alias for Dirent['parentPath'] Somewhat counterintuitively,
   * this property refers to the *parent* path, not the path object itself.
   *
   * @deprecated
   */
  get path() {
    return this.parentPath;
  }
  /**
   * Do not create new Path objects directly.  They should always be accessed
   * via the PathScurry class or other methods on the Path class.
   *
   * @internal
   */
  constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
    this.name = name;
    this.#matchName = nocase ? normalizeNocase(name) : normalize(name);
    this.#type = type & TYPEMASK;
    this.nocase = nocase;
    this.roots = roots;
    this.root = root || this;
    this.#children = children;
    this.#fullpath = opts.fullpath;
    this.#relative = opts.relative;
    this.#relativePosix = opts.relativePosix;
    this.parent = opts.parent;
    if (this.parent) {
      this.#fs = this.parent.#fs;
    } else {
      this.#fs = fsFromOption(opts.fs);
    }
  }
  /**
   * Returns the depth of the Path object from its root.
   *
   * For example, a path at `/foo/bar` would have a depth of 2.
   */
  depth() {
    if (this.#depth !== void 0) return this.#depth;
    if (!this.parent) return this.#depth = 0;
    return this.#depth = this.parent.depth() + 1;
  }
  /**
   * @internal
   */
  childrenCache() {
    return this.#children;
  }
  /**
   * Get the Path object referenced by the string path, resolved from this Path
   */
  resolve(path2) {
    if (!path2) {
      return this;
    }
    const rootPath = this.getRootString(path2);
    const dir = path2.substring(rootPath.length);
    const dirParts = dir.split(this.splitSep);
    const result = rootPath ? this.getRoot(rootPath).#resolveParts(dirParts) : this.#resolveParts(dirParts);
    return result;
  }
  #resolveParts(dirParts) {
    let p = this;
    for (const part of dirParts) {
      p = p.child(part);
    }
    return p;
  }
  /**
   * Returns the cached children Path objects, if still available.  If they
   * have fallen out of the cache, then returns an empty array, and resets the
   * READDIR_CALLED bit, so that future calls to readdir() will require an fs
   * lookup.
   *
   * @internal
   */
  children() {
    const cached = this.#children.get(this);
    if (cached) {
      return cached;
    }
    const children = Object.assign([], {
      provisional: 0
    });
    this.#children.set(this, children);
    this.#type &= ~READDIR_CALLED;
    return children;
  }
  /**
   * Resolves a path portion and returns or creates the child Path.
   *
   * Returns `this` if pathPart is `''` or `'.'`, or `parent` if pathPart is
   * `'..'`.
   *
   * This should not be called directly.  If `pathPart` contains any path
   * separators, it will lead to unsafe undefined behavior.
   *
   * Use `Path.resolve()` instead.
   *
   * @internal
   */
  child(pathPart, opts) {
    if (pathPart === "" || pathPart === ".") {
      return this;
    }
    if (pathPart === "..") {
      return this.parent || this;
    }
    const children = this.children();
    const name = this.nocase ? normalizeNocase(pathPart) : normalize(pathPart);
    for (const p of children) {
      if (p.#matchName === name) {
        return p;
      }
    }
    const s = this.parent ? this.sep : "";
    const fullpath = this.#fullpath ? this.#fullpath + s + pathPart : void 0;
    const pchild = this.newChild(pathPart, UNKNOWN, {
      ...opts,
      parent: this,
      fullpath
    });
    if (!this.canReaddir()) {
      pchild.#type |= ENOENT;
    }
    children.push(pchild);
    return pchild;
  }
  /**
   * The relative path from the cwd. If it does not share an ancestor with
   * the cwd, then this ends up being equivalent to the fullpath()
   */
  relative() {
    if (this.isCWD) return "";
    if (this.#relative !== void 0) {
      return this.#relative;
    }
    const name = this.name;
    const p = this.parent;
    if (!p) {
      return this.#relative = this.name;
    }
    const pv = p.relative();
    return pv + (!pv || !p.parent ? "" : this.sep) + name;
  }
  /**
   * The relative path from the cwd, using / as the path separator.
   * If it does not share an ancestor with
   * the cwd, then this ends up being equivalent to the fullpathPosix()
   * On posix systems, this is identical to relative().
   */
  relativePosix() {
    if (this.sep === "/") return this.relative();
    if (this.isCWD) return "";
    if (this.#relativePosix !== void 0) return this.#relativePosix;
    const name = this.name;
    const p = this.parent;
    if (!p) {
      return this.#relativePosix = this.fullpathPosix();
    }
    const pv = p.relativePosix();
    return pv + (!pv || !p.parent ? "" : "/") + name;
  }
  /**
   * The fully resolved path string for this Path entry
   */
  fullpath() {
    if (this.#fullpath !== void 0) {
      return this.#fullpath;
    }
    const name = this.name;
    const p = this.parent;
    if (!p) {
      return this.#fullpath = this.name;
    }
    const pv = p.fullpath();
    const fp = pv + (!p.parent ? "" : this.sep) + name;
    return this.#fullpath = fp;
  }
  /**
   * On platforms other than windows, this is identical to fullpath.
   *
   * On windows, this is overridden to return the forward-slash form of the
   * full UNC path.
   */
  fullpathPosix() {
    if (this.#fullpathPosix !== void 0) return this.#fullpathPosix;
    if (this.sep === "/") return this.#fullpathPosix = this.fullpath();
    if (!this.parent) {
      const p2 = this.fullpath().replace(/\\/g, "/");
      if (/^[a-z]:\//i.test(p2)) {
        return this.#fullpathPosix = `//?/${p2}`;
      } else {
        return this.#fullpathPosix = p2;
      }
    }
    const p = this.parent;
    const pfpp = p.fullpathPosix();
    const fpp = pfpp + (!pfpp || !p.parent ? "" : "/") + this.name;
    return this.#fullpathPosix = fpp;
  }
  /**
   * Is the Path of an unknown type?
   *
   * Note that we might know *something* about it if there has been a previous
   * filesystem operation, for example that it does not exist, or is not a
   * link, or whether it has child entries.
   */
  isUnknown() {
    return (this.#type & IFMT) === UNKNOWN;
  }
  isType(type) {
    return this[`is${type}`]();
  }
  getType() {
    return this.isUnknown() ? "Unknown" : this.isDirectory() ? "Directory" : this.isFile() ? "File" : this.isSymbolicLink() ? "SymbolicLink" : this.isFIFO() ? "FIFO" : this.isCharacterDevice() ? "CharacterDevice" : this.isBlockDevice() ? "BlockDevice" : (
      /* c8 ignore start */
      this.isSocket() ? "Socket" : "Unknown"
    );
  }
  /**
   * Is the Path a regular file?
   */
  isFile() {
    return (this.#type & IFMT) === IFREG;
  }
  /**
   * Is the Path a directory?
   */
  isDirectory() {
    return (this.#type & IFMT) === IFDIR;
  }
  /**
   * Is the path a character device?
   */
  isCharacterDevice() {
    return (this.#type & IFMT) === IFCHR;
  }
  /**
   * Is the path a block device?
   */
  isBlockDevice() {
    return (this.#type & IFMT) === IFBLK;
  }
  /**
   * Is the path a FIFO pipe?
   */
  isFIFO() {
    return (this.#type & IFMT) === IFIFO;
  }
  /**
   * Is the path a socket?
   */
  isSocket() {
    return (this.#type & IFMT) === IFSOCK;
  }
  /**
   * Is the path a symbolic link?
   */
  isSymbolicLink() {
    return (this.#type & IFLNK) === IFLNK;
  }
  /**
   * Return the entry if it has been subject of a successful lstat, or
   * undefined otherwise.
   *
   * Does not read the filesystem, so an undefined result *could* simply
   * mean that we haven't called lstat on it.
   */
  lstatCached() {
    return this.#type & LSTAT_CALLED ? this : void 0;
  }
  /**
   * Return the cached link target if the entry has been the subject of a
   * successful readlink, or undefined otherwise.
   *
   * Does not read the filesystem, so an undefined result *could* just mean we
   * don't have any cached data. Only use it if you are very sure that a
   * readlink() has been called at some point.
   */
  readlinkCached() {
    return this.#linkTarget;
  }
  /**
   * Returns the cached realpath target if the entry has been the subject
   * of a successful realpath, or undefined otherwise.
   *
   * Does not read the filesystem, so an undefined result *could* just mean we
   * don't have any cached data. Only use it if you are very sure that a
   * realpath() has been called at some point.
   */
  realpathCached() {
    return this.#realpath;
  }
  /**
   * Returns the cached child Path entries array if the entry has been the
   * subject of a successful readdir(), or [] otherwise.
   *
   * Does not read the filesystem, so an empty array *could* just mean we
   * don't have any cached data. Only use it if you are very sure that a
   * readdir() has been called recently enough to still be valid.
   */
  readdirCached() {
    const children = this.children();
    return children.slice(0, children.provisional);
  }
  /**
   * Return true if it's worth trying to readlink.  Ie, we don't (yet) have
   * any indication that readlink will definitely fail.
   *
   * Returns false if the path is known to not be a symlink, if a previous
   * readlink failed, or if the entry does not exist.
   */
  canReadlink() {
    if (this.#linkTarget) return true;
    if (!this.parent) return false;
    const ifmt = this.#type & IFMT;
    return !(ifmt !== UNKNOWN && ifmt !== IFLNK || this.#type & ENOREADLINK || this.#type & ENOENT);
  }
  /**
   * Return true if readdir has previously been successfully called on this
   * path, indicating that cachedReaddir() is likely valid.
   */
  calledReaddir() {
    return !!(this.#type & READDIR_CALLED);
  }
  /**
   * Returns true if the path is known to not exist. That is, a previous lstat
   * or readdir failed to verify its existence when that would have been
   * expected, or a parent entry was marked either enoent or enotdir.
   */
  isENOENT() {
    return !!(this.#type & ENOENT);
  }
  /**
   * Return true if the path is a match for the given path name.  This handles
   * case sensitivity and unicode normalization.
   *
   * Note: even on case-sensitive systems, it is **not** safe to test the
   * equality of the `.name` property to determine whether a given pathname
   * matches, due to unicode normalization mismatches.
   *
   * Always use this method instead of testing the `path.name` property
   * directly.
   */
  isNamed(n) {
    return !this.nocase ? this.#matchName === normalize(n) : this.#matchName === normalizeNocase(n);
  }
  /**
   * Return the Path object corresponding to the target of a symbolic link.
   *
   * If the Path is not a symbolic link, or if the readlink call fails for any
   * reason, `undefined` is returned.
   *
   * Result is cached, and thus may be outdated if the filesystem is mutated.
   */
  async readlink() {
    const target = this.#linkTarget;
    if (target) {
      return target;
    }
    if (!this.canReadlink()) {
      return void 0;
    }
    if (!this.parent) {
      return void 0;
    }
    try {
      const read = await this.#fs.promises.readlink(this.fullpath());
      const linkTarget = (await this.parent.realpath())?.resolve(read);
      if (linkTarget) {
        return this.#linkTarget = linkTarget;
      }
    } catch (er) {
      this.#readlinkFail(er.code);
      return void 0;
    }
  }
  /**
   * Synchronous {@link PathBase.readlink}
   */
  readlinkSync() {
    const target = this.#linkTarget;
    if (target) {
      return target;
    }
    if (!this.canReadlink()) {
      return void 0;
    }
    if (!this.parent) {
      return void 0;
    }
    try {
      const read = this.#fs.readlinkSync(this.fullpath());
      const linkTarget = this.parent.realpathSync()?.resolve(read);
      if (linkTarget) {
        return this.#linkTarget = linkTarget;
      }
    } catch (er) {
      this.#readlinkFail(er.code);
      return void 0;
    }
  }
  #readdirSuccess(children) {
    this.#type |= READDIR_CALLED;
    for (let p = children.provisional; p < children.length; p++) {
      const c = children[p];
      if (c) c.#markENOENT();
    }
  }
  #markENOENT() {
    if (this.#type & ENOENT) return;
    this.#type = (this.#type | ENOENT) & IFMT_UNKNOWN;
    this.#markChildrenENOENT();
  }
  #markChildrenENOENT() {
    const children = this.children();
    children.provisional = 0;
    for (const p of children) {
      p.#markENOENT();
    }
  }
  #markENOREALPATH() {
    this.#type |= ENOREALPATH;
    this.#markENOTDIR();
  }
  // save the information when we know the entry is not a dir
  #markENOTDIR() {
    if (this.#type & ENOTDIR) return;
    let t = this.#type;
    if ((t & IFMT) === IFDIR) t &= IFMT_UNKNOWN;
    this.#type = t | ENOTDIR;
    this.#markChildrenENOENT();
  }
  #readdirFail(code = "") {
    if (code === "ENOTDIR" || code === "EPERM") {
      this.#markENOTDIR();
    } else if (code === "ENOENT") {
      this.#markENOENT();
    } else {
      this.children().provisional = 0;
    }
  }
  #lstatFail(code = "") {
    if (code === "ENOTDIR") {
      const p = this.parent;
      p.#markENOTDIR();
    } else if (code === "ENOENT") {
      this.#markENOENT();
    }
  }
  #readlinkFail(code = "") {
    let ter = this.#type;
    ter |= ENOREADLINK;
    if (code === "ENOENT") ter |= ENOENT;
    if (code === "EINVAL" || code === "UNKNOWN") {
      ter &= IFMT_UNKNOWN;
    }
    this.#type = ter;
    if (code === "ENOTDIR" && this.parent) {
      this.parent.#markENOTDIR();
    }
  }
  #readdirAddChild(e, c) {
    return this.#readdirMaybePromoteChild(e, c) || this.#readdirAddNewChild(e, c);
  }
  #readdirAddNewChild(e, c) {
    const type = entToType(e);
    const child = this.newChild(e.name, type, {
      parent: this
    });
    const ifmt = child.#type & IFMT;
    if (ifmt !== IFDIR && ifmt !== IFLNK && ifmt !== UNKNOWN) {
      child.#type |= ENOTDIR;
    }
    c.unshift(child);
    c.provisional++;
    return child;
  }
  #readdirMaybePromoteChild(e, c) {
    for (let p = c.provisional; p < c.length; p++) {
      const pchild = c[p];
      const name = this.nocase ? normalizeNocase(e.name) : normalize(e.name);
      if (name !== pchild.#matchName) {
        continue;
      }
      return this.#readdirPromoteChild(e, pchild, p, c);
    }
  }
  #readdirPromoteChild(e, p, index, c) {
    const v = p.name;
    p.#type = p.#type & IFMT_UNKNOWN | entToType(e);
    if (v !== e.name) p.name = e.name;
    if (index !== c.provisional) {
      if (index === c.length - 1) c.pop();
      else c.splice(index, 1);
      c.unshift(p);
    }
    c.provisional++;
    return p;
  }
  /**
   * Call lstat() on this Path, and update all known information that can be
   * determined.
   *
   * Note that unlike `fs.lstat()`, the returned value does not contain some
   * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
   * information is required, you will need to call `fs.lstat` yourself.
   *
   * If the Path refers to a nonexistent file, or if the lstat call fails for
   * any reason, `undefined` is returned.  Otherwise the updated Path object is
   * returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   */
  async lstat() {
    if ((this.#type & ENOENT) === 0) {
      try {
        this.#applyStat(await this.#fs.promises.lstat(this.fullpath()));
        return this;
      } catch (er) {
        this.#lstatFail(er.code);
      }
    }
  }
  /**
   * synchronous {@link PathBase.lstat}
   */
  lstatSync() {
    if ((this.#type & ENOENT) === 0) {
      try {
        this.#applyStat(this.#fs.lstatSync(this.fullpath()));
        return this;
      } catch (er) {
        this.#lstatFail(er.code);
      }
    }
  }
  #applyStat(st) {
    const { atime, atimeMs, birthtime, birthtimeMs, blksize, blocks, ctime, ctimeMs, dev, gid, ino, mode, mtime, mtimeMs, nlink, rdev, size, uid } = st;
    this.#atime = atime;
    this.#atimeMs = atimeMs;
    this.#birthtime = birthtime;
    this.#birthtimeMs = birthtimeMs;
    this.#blksize = blksize;
    this.#blocks = blocks;
    this.#ctime = ctime;
    this.#ctimeMs = ctimeMs;
    this.#dev = dev;
    this.#gid = gid;
    this.#ino = ino;
    this.#mode = mode;
    this.#mtime = mtime;
    this.#mtimeMs = mtimeMs;
    this.#nlink = nlink;
    this.#rdev = rdev;
    this.#size = size;
    this.#uid = uid;
    const ifmt = entToType(st);
    this.#type = this.#type & IFMT_UNKNOWN | ifmt | LSTAT_CALLED;
    if (ifmt !== UNKNOWN && ifmt !== IFDIR && ifmt !== IFLNK) {
      this.#type |= ENOTDIR;
    }
  }
  #onReaddirCB = [];
  #readdirCBInFlight = false;
  #callOnReaddirCB(children) {
    this.#readdirCBInFlight = false;
    const cbs = this.#onReaddirCB.slice();
    this.#onReaddirCB.length = 0;
    cbs.forEach((cb) => cb(null, children));
  }
  /**
   * Standard node-style callback interface to get list of directory entries.
   *
   * If the Path cannot or does not contain any children, then an empty array
   * is returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   *
   * @param cb The callback called with (er, entries).  Note that the `er`
   * param is somewhat extraneous, as all readdir() errors are handled and
   * simply result in an empty set of entries being returned.
   * @param allowZalgo Boolean indicating that immediately known results should
   * *not* be deferred with `queueMicrotask`. Defaults to `false`. Release
   * zalgo at your peril, the dark pony lord is devious and unforgiving.
   */
  readdirCB(cb, allowZalgo = false) {
    if (!this.canReaddir()) {
      if (allowZalgo) cb(null, []);
      else queueMicrotask(() => cb(null, []));
      return;
    }
    const children = this.children();
    if (this.calledReaddir()) {
      const c = children.slice(0, children.provisional);
      if (allowZalgo) cb(null, c);
      else queueMicrotask(() => cb(null, c));
      return;
    }
    this.#onReaddirCB.push(cb);
    if (this.#readdirCBInFlight) {
      return;
    }
    this.#readdirCBInFlight = true;
    const fullpath = this.fullpath();
    this.#fs.readdir(fullpath, {
      withFileTypes: true
    }, (er, entries) => {
      if (er) {
        this.#readdirFail(er.code);
        children.provisional = 0;
      } else {
        for (const e of entries) {
          this.#readdirAddChild(e, children);
        }
        this.#readdirSuccess(children);
      }
      this.#callOnReaddirCB(children.slice(0, children.provisional));
      return;
    });
  }
  #asyncReaddirInFlight;
  /**
   * Return an array of known child entries.
   *
   * If the Path cannot or does not contain any children, then an empty array
   * is returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   */
  async readdir() {
    if (!this.canReaddir()) {
      return [];
    }
    const children = this.children();
    if (this.calledReaddir()) {
      return children.slice(0, children.provisional);
    }
    const fullpath = this.fullpath();
    if (this.#asyncReaddirInFlight) {
      await this.#asyncReaddirInFlight;
    } else {
      let resolve2 = /* @__PURE__ */ __name(() => {
      }, "resolve");
      this.#asyncReaddirInFlight = new Promise((res) => resolve2 = res);
      try {
        for (const e of await this.#fs.promises.readdir(fullpath, {
          withFileTypes: true
        })) {
          this.#readdirAddChild(e, children);
        }
        this.#readdirSuccess(children);
      } catch (er) {
        this.#readdirFail(er.code);
        children.provisional = 0;
      }
      this.#asyncReaddirInFlight = void 0;
      resolve2();
    }
    return children.slice(0, children.provisional);
  }
  /**
   * synchronous {@link PathBase.readdir}
   */
  readdirSync() {
    if (!this.canReaddir()) {
      return [];
    }
    const children = this.children();
    if (this.calledReaddir()) {
      return children.slice(0, children.provisional);
    }
    const fullpath = this.fullpath();
    try {
      for (const e of this.#fs.readdirSync(fullpath, {
        withFileTypes: true
      })) {
        this.#readdirAddChild(e, children);
      }
      this.#readdirSuccess(children);
    } catch (er) {
      this.#readdirFail(er.code);
      children.provisional = 0;
    }
    return children.slice(0, children.provisional);
  }
  canReaddir() {
    if (this.#type & ENOCHILD) return false;
    const ifmt = IFMT & this.#type;
    if (!(ifmt === UNKNOWN || ifmt === IFDIR || ifmt === IFLNK)) {
      return false;
    }
    return true;
  }
  shouldWalk(dirs, walkFilter) {
    return (this.#type & IFDIR) === IFDIR && !(this.#type & ENOCHILD) && !dirs.has(this) && (!walkFilter || walkFilter(this));
  }
  /**
   * Return the Path object corresponding to path as resolved
   * by realpath(3).
   *
   * If the realpath call fails for any reason, `undefined` is returned.
   *
   * Result is cached, and thus may be outdated if the filesystem is mutated.
   * On success, returns a Path object.
   */
  async realpath() {
    if (this.#realpath) return this.#realpath;
    if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type) return void 0;
    try {
      const rp = await this.#fs.promises.realpath(this.fullpath());
      return this.#realpath = this.resolve(rp);
    } catch (_) {
      this.#markENOREALPATH();
    }
  }
  /**
   * Synchronous {@link realpath}
   */
  realpathSync() {
    if (this.#realpath) return this.#realpath;
    if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type) return void 0;
    try {
      const rp = this.#fs.realpathSync(this.fullpath());
      return this.#realpath = this.resolve(rp);
    } catch (_) {
      this.#markENOREALPATH();
    }
  }
  /**
   * Internal method to mark this Path object as the scurry cwd,
   * called by {@link PathScurry#chdir}
   *
   * @internal
   */
  [setAsCwd](oldCwd) {
    if (oldCwd === this) return;
    oldCwd.isCWD = false;
    this.isCWD = true;
    const changed = /* @__PURE__ */ new Set([]);
    let rp = [];
    let p = this;
    while (p && p.parent) {
      changed.add(p);
      p.#relative = rp.join(this.sep);
      p.#relativePosix = rp.join("/");
      p = p.parent;
      rp.push("..");
    }
    p = oldCwd;
    while (p && p.parent && !changed.has(p)) {
      p.#relative = void 0;
      p.#relativePosix = void 0;
      p = p.parent;
    }
  }
};
var PathWin32 = class _PathWin32 extends PathBase {
  static {
    __name(this, "PathWin32");
  }
  /**
   * Separator for generating path strings.
   */
  sep = "\\";
  /**
   * Separator for parsing path strings.
   */
  splitSep = eitherSep;
  /**
   * Do not create new Path objects directly.  They should always be accessed
   * via the PathScurry class or other methods on the Path class.
   *
   * @internal
   */
  constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
    super(name, type, root, roots, nocase, children, opts);
  }
  /**
   * @internal
   */
  newChild(name, type = UNKNOWN, opts = {}) {
    return new _PathWin32(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
  }
  /**
   * @internal
   */
  getRootString(path2) {
    return path$1.win32.parse(path2).root;
  }
  /**
   * @internal
   */
  getRoot(rootPath) {
    rootPath = uncToDrive(rootPath.toUpperCase());
    if (rootPath === this.root.name) {
      return this.root;
    }
    for (const [compare, root] of Object.entries(this.roots)) {
      if (this.sameRoot(rootPath, compare)) {
        return this.roots[rootPath] = root;
      }
    }
    return this.roots[rootPath] = new PathScurryWin32(rootPath, this).root;
  }
  /**
   * @internal
   */
  sameRoot(rootPath, compare = this.root.name) {
    rootPath = rootPath.toUpperCase().replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\");
    return rootPath === compare;
  }
};
var PathPosix = class _PathPosix extends PathBase {
  static {
    __name(this, "PathPosix");
  }
  /**
   * separator for parsing path strings
   */
  splitSep = "/";
  /**
   * separator for generating path strings
   */
  sep = "/";
  /**
   * Do not create new Path objects directly.  They should always be accessed
   * via the PathScurry class or other methods on the Path class.
   *
   * @internal
   */
  constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
    super(name, type, root, roots, nocase, children, opts);
  }
  /**
   * @internal
   */
  getRootString(path2) {
    return path2.startsWith("/") ? "/" : "";
  }
  /**
   * @internal
   */
  getRoot(_rootPath) {
    return this.root;
  }
  /**
   * @internal
   */
  newChild(name, type = UNKNOWN, opts = {}) {
    return new _PathPosix(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
  }
};
var PathScurryBase = class {
  static {
    __name(this, "PathScurryBase");
  }
  /**
   * The root Path entry for the current working directory of this Scurry
   */
  root;
  /**
   * The string path for the root of this Scurry's current working directory
   */
  rootPath;
  /**
   * A collection of all roots encountered, referenced by rootPath
   */
  roots;
  /**
   * The Path entry corresponding to this PathScurry's current working directory.
   */
  cwd;
  #resolveCache;
  #resolvePosixCache;
  #children;
  /**
   * Perform path comparisons case-insensitively.
   *
   * Defaults true on Darwin and Windows systems, false elsewhere.
   */
  nocase;
  #fs;
  /**
   * This class should not be instantiated directly.
   *
   * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
   *
   * @internal
   */
  constructor(cwd2 = process.cwd(), pathImpl, sep2, { nocase, childrenCacheSize = 16 * 1024, fs = defaultFS } = {}) {
    this.#fs = fsFromOption(fs);
    if (cwd2 instanceof URL || cwd2.startsWith("file://")) {
      cwd2 = url.fileURLToPath(cwd2);
    }
    const cwdPath = pathImpl.resolve(cwd2);
    this.roots = /* @__PURE__ */ Object.create(null);
    this.rootPath = this.parseRootPath(cwdPath);
    this.#resolveCache = new ResolveCache();
    this.#resolvePosixCache = new ResolveCache();
    this.#children = new ChildrenCache(childrenCacheSize);
    const split = cwdPath.substring(this.rootPath.length).split(sep2);
    if (split.length === 1 && !split[0]) {
      split.pop();
    }
    if (nocase === void 0) {
      throw new TypeError("must provide nocase setting to PathScurryBase ctor");
    }
    this.nocase = nocase;
    this.root = this.newRoot(this.#fs);
    this.roots[this.rootPath] = this.root;
    let prev = this.root;
    let len = split.length - 1;
    const joinSep = pathImpl.sep;
    let abs = this.rootPath;
    let sawFirst = false;
    for (const part of split) {
      const l = len--;
      prev = prev.child(part, {
        relative: new Array(l).fill("..").join(joinSep),
        relativePosix: new Array(l).fill("..").join("/"),
        fullpath: abs += (sawFirst ? "" : joinSep) + part
      });
      sawFirst = true;
    }
    this.cwd = prev;
  }
  /**
   * Get the depth of a provided path, string, or the cwd
   */
  depth(path2 = this.cwd) {
    if (typeof path2 === "string") {
      path2 = this.cwd.resolve(path2);
    }
    return path2.depth();
  }
  /**
   * Return the cache of child entries.  Exposed so subclasses can create
   * child Path objects in a platform-specific way.
   *
   * @internal
   */
  childrenCache() {
    return this.#children;
  }
  /**
   * Resolve one or more path strings to a resolved string
   *
   * Same interface as require('path').resolve.
   *
   * Much faster than path.resolve() when called multiple times for the same
   * path, because the resolved Path objects are cached.  Much slower
   * otherwise.
   */
  resolve(...paths) {
    let r = "";
    for (let i = paths.length - 1; i >= 0; i--) {
      const p = paths[i];
      if (!p || p === ".") continue;
      r = r ? `${p}/${r}` : p;
      if (this.isAbsolute(p)) {
        break;
      }
    }
    const cached = this.#resolveCache.get(r);
    if (cached !== void 0) {
      return cached;
    }
    const result = this.cwd.resolve(r).fullpath();
    this.#resolveCache.set(r, result);
    return result;
  }
  /**
   * Resolve one or more path strings to a resolved string, returning
   * the posix path.  Identical to .resolve() on posix systems, but on
   * windows will return a forward-slash separated UNC path.
   *
   * Same interface as require('path').resolve.
   *
   * Much faster than path.resolve() when called multiple times for the same
   * path, because the resolved Path objects are cached.  Much slower
   * otherwise.
   */
  resolvePosix(...paths) {
    let r = "";
    for (let i = paths.length - 1; i >= 0; i--) {
      const p = paths[i];
      if (!p || p === ".") continue;
      r = r ? `${p}/${r}` : p;
      if (this.isAbsolute(p)) {
        break;
      }
    }
    const cached = this.#resolvePosixCache.get(r);
    if (cached !== void 0) {
      return cached;
    }
    const result = this.cwd.resolve(r).fullpathPosix();
    this.#resolvePosixCache.set(r, result);
    return result;
  }
  /**
   * find the relative path from the cwd to the supplied path string or entry
   */
  relative(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.relative();
  }
  /**
   * find the relative path from the cwd to the supplied path string or
   * entry, using / as the path delimiter, even on Windows.
   */
  relativePosix(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.relativePosix();
  }
  /**
   * Return the basename for the provided string or Path object
   */
  basename(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.name;
  }
  /**
   * Return the dirname for the provided string or Path object
   */
  dirname(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return (entry.parent || entry).fullpath();
  }
  async readdir(entry = this.cwd, opts = {
    withFileTypes: true
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes } = opts;
    if (!entry.canReaddir()) {
      return [];
    } else {
      const p = await entry.readdir();
      return withFileTypes ? p : p.map((e) => e.name);
    }
  }
  readdirSync(entry = this.cwd, opts = {
    withFileTypes: true
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true } = opts;
    if (!entry.canReaddir()) {
      return [];
    } else if (withFileTypes) {
      return entry.readdirSync();
    } else {
      return entry.readdirSync().map((e) => e.name);
    }
  }
  /**
   * Call lstat() on the string or Path object, and update all known
   * information that can be determined.
   *
   * Note that unlike `fs.lstat()`, the returned value does not contain some
   * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
   * information is required, you will need to call `fs.lstat` yourself.
   *
   * If the Path refers to a nonexistent file, or if the lstat call fails for
   * any reason, `undefined` is returned.  Otherwise the updated Path object is
   * returned.
   *
   * Results are cached, and thus may be out of date if the filesystem is
   * mutated.
   */
  async lstat(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.lstat();
  }
  /**
   * synchronous {@link PathScurryBase.lstat}
   */
  lstatSync(entry = this.cwd) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    }
    return entry.lstatSync();
  }
  async readlink(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = await entry.readlink();
    return withFileTypes ? e : e?.fullpath();
  }
  readlinkSync(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = entry.readlinkSync();
    return withFileTypes ? e : e?.fullpath();
  }
  async realpath(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = await entry.realpath();
    return withFileTypes ? e : e?.fullpath();
  }
  realpathSync(entry = this.cwd, { withFileTypes } = {
    withFileTypes: false
  }) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      withFileTypes = entry.withFileTypes;
      entry = this.cwd;
    }
    const e = entry.realpathSync();
    return withFileTypes ? e : e?.fullpath();
  }
  async walk(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = [];
    if (!filter2 || filter2(entry)) {
      results.push(withFileTypes ? entry : entry.fullpath());
    }
    const dirs = /* @__PURE__ */ new Set();
    const walk = /* @__PURE__ */ __name((dir, cb) => {
      dirs.add(dir);
      dir.readdirCB((er, entries) => {
        if (er) {
          return cb(er);
        }
        let len = entries.length;
        if (!len) return cb();
        const next = /* @__PURE__ */ __name(() => {
          if (--len === 0) {
            cb();
          }
        }, "next");
        for (const e of entries) {
          if (!filter2 || filter2(e)) {
            results.push(withFileTypes ? e : e.fullpath());
          }
          if (follow && e.isSymbolicLink()) {
            e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r).then((r) => r?.shouldWalk(dirs, walkFilter) ? walk(r, next) : next());
          } else {
            if (e.shouldWalk(dirs, walkFilter)) {
              walk(e, next);
            } else {
              next();
            }
          }
        }
      }, true);
    }, "walk");
    const start = entry;
    return new Promise((res, rej) => {
      walk(start, (er) => {
        if (er) return rej(er);
        res(results);
      });
    });
  }
  walkSync(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = [];
    if (!filter2 || filter2(entry)) {
      results.push(withFileTypes ? entry : entry.fullpath());
    }
    const dirs = /* @__PURE__ */ new Set([
      entry
    ]);
    for (const dir of dirs) {
      const entries = dir.readdirSync();
      for (const e of entries) {
        if (!filter2 || filter2(e)) {
          results.push(withFileTypes ? e : e.fullpath());
        }
        let r = e;
        if (e.isSymbolicLink()) {
          if (!(follow && (r = e.realpathSync()))) continue;
          if (r.isUnknown()) r.lstatSync();
        }
        if (r.shouldWalk(dirs, walkFilter)) {
          dirs.add(r);
        }
      }
    }
    return results;
  }
  /**
   * Support for `for await`
   *
   * Alias for {@link PathScurryBase.iterate}
   *
   * Note: As of Node 19, this is very slow, compared to other methods of
   * walking.  Consider using {@link PathScurryBase.stream} if memory overhead
   * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
   */
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
  iterate(entry = this.cwd, options = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      options = entry;
      entry = this.cwd;
    }
    return this.stream(entry, options)[Symbol.asyncIterator]();
  }
  /**
   * Iterating over a PathScurry performs a synchronous walk.
   *
   * Alias for {@link PathScurryBase.iterateSync}
   */
  [Symbol.iterator]() {
    return this.iterateSync();
  }
  *iterateSync(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    if (!filter2 || filter2(entry)) {
      yield withFileTypes ? entry : entry.fullpath();
    }
    const dirs = /* @__PURE__ */ new Set([
      entry
    ]);
    for (const dir of dirs) {
      const entries = dir.readdirSync();
      for (const e of entries) {
        if (!filter2 || filter2(e)) {
          yield withFileTypes ? e : e.fullpath();
        }
        let r = e;
        if (e.isSymbolicLink()) {
          if (!(follow && (r = e.realpathSync()))) continue;
          if (r.isUnknown()) r.lstatSync();
        }
        if (r.shouldWalk(dirs, walkFilter)) {
          dirs.add(r);
        }
      }
    }
  }
  stream(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = new Minipass({
      objectMode: true
    });
    if (!filter2 || filter2(entry)) {
      results.write(withFileTypes ? entry : entry.fullpath());
    }
    const dirs = /* @__PURE__ */ new Set();
    const queue = [
      entry
    ];
    let processing = 0;
    const process1 = /* @__PURE__ */ __name(() => {
      let paused = false;
      while (!paused) {
        const dir = queue.shift();
        if (!dir) {
          if (processing === 0) results.end();
          return;
        }
        processing++;
        dirs.add(dir);
        const onReaddir = /* @__PURE__ */ __name((er, entries, didRealpaths = false) => {
          if (er) return results.emit("error", er);
          if (follow && !didRealpaths) {
            const promises = [];
            for (const e of entries) {
              if (e.isSymbolicLink()) {
                promises.push(e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r));
              }
            }
            if (promises.length) {
              Promise.all(promises).then(() => onReaddir(null, entries, true));
              return;
            }
          }
          for (const e of entries) {
            if (e && (!filter2 || filter2(e))) {
              if (!results.write(withFileTypes ? e : e.fullpath())) {
                paused = true;
              }
            }
          }
          processing--;
          for (const e of entries) {
            const r = e.realpathCached() || e;
            if (r.shouldWalk(dirs, walkFilter)) {
              queue.push(r);
            }
          }
          if (paused && !results.flowing) {
            results.once("drain", process1);
          } else if (!sync2) {
            process1();
          }
        }, "onReaddir");
        let sync2 = true;
        dir.readdirCB(onReaddir, true);
        sync2 = false;
      }
    }, "process1");
    process1();
    return results;
  }
  streamSync(entry = this.cwd, opts = {}) {
    if (typeof entry === "string") {
      entry = this.cwd.resolve(entry);
    } else if (!(entry instanceof PathBase)) {
      opts = entry;
      entry = this.cwd;
    }
    const { withFileTypes = true, follow = false, filter: filter2, walkFilter } = opts;
    const results = new Minipass({
      objectMode: true
    });
    const dirs = /* @__PURE__ */ new Set();
    if (!filter2 || filter2(entry)) {
      results.write(withFileTypes ? entry : entry.fullpath());
    }
    const queue = [
      entry
    ];
    let processing = 0;
    const process1 = /* @__PURE__ */ __name(() => {
      let paused = false;
      while (!paused) {
        const dir = queue.shift();
        if (!dir) {
          if (processing === 0) results.end();
          return;
        }
        processing++;
        dirs.add(dir);
        const entries = dir.readdirSync();
        for (const e of entries) {
          if (!filter2 || filter2(e)) {
            if (!results.write(withFileTypes ? e : e.fullpath())) {
              paused = true;
            }
          }
        }
        processing--;
        for (const e of entries) {
          let r = e;
          if (e.isSymbolicLink()) {
            if (!(follow && (r = e.realpathSync()))) continue;
            if (r.isUnknown()) r.lstatSync();
          }
          if (r.shouldWalk(dirs, walkFilter)) {
            queue.push(r);
          }
        }
      }
      if (paused && !results.flowing) results.once("drain", process1);
    }, "process1");
    process1();
    return results;
  }
  chdir(path2 = this.cwd) {
    const oldCwd = this.cwd;
    this.cwd = typeof path2 === "string" ? this.cwd.resolve(path2) : path2;
    this.cwd[setAsCwd](oldCwd);
  }
};
var PathScurryWin32 = class extends PathScurryBase {
  static {
    __name(this, "PathScurryWin32");
  }
  /**
   * separator for generating path strings
   */
  sep = "\\";
  constructor(cwd2 = process.cwd(), opts = {}) {
    const { nocase = true } = opts;
    super(cwd2, path$1.win32, "\\", {
      ...opts,
      nocase
    });
    this.nocase = nocase;
    for (let p = this.cwd; p; p = p.parent) {
      p.nocase = this.nocase;
    }
  }
  /**
   * @internal
   */
  parseRootPath(dir) {
    return path$1.win32.parse(dir).root.toUpperCase();
  }
  /**
   * @internal
   */
  newRoot(fs) {
    return new PathWin32(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), {
      fs
    });
  }
  /**
   * Return true if the provided path string is an absolute path
   */
  isAbsolute(p) {
    return p.startsWith("/") || p.startsWith("\\") || /^[a-z]:(\/|\\)/i.test(p);
  }
};
var PathScurryPosix = class extends PathScurryBase {
  static {
    __name(this, "PathScurryPosix");
  }
  /**
   * separator for generating path strings
   */
  sep = "/";
  constructor(cwd2 = process.cwd(), opts = {}) {
    const { nocase = false } = opts;
    super(cwd2, path$1.posix, "/", {
      ...opts,
      nocase
    });
    this.nocase = nocase;
  }
  /**
   * @internal
   */
  parseRootPath(_dir) {
    return "/";
  }
  /**
   * @internal
   */
  newRoot(fs) {
    return new PathPosix(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), {
      fs
    });
  }
  /**
   * Return true if the provided path string is an absolute path
   */
  isAbsolute(p) {
    return p.startsWith("/");
  }
};
var PathScurryDarwin = class extends PathScurryPosix {
  static {
    __name(this, "PathScurryDarwin");
  }
  constructor(cwd2 = process.cwd(), opts = {}) {
    const { nocase = true } = opts;
    super(cwd2, {
      ...opts,
      nocase
    });
  }
};
process.platform === "win32" ? PathWin32 : PathPosix;
var PathScurry = process.platform === "win32" ? PathScurryWin32 : process.platform === "darwin" ? PathScurryDarwin : PathScurryPosix;

// ../../node_modules/.pnpm/glob@11.0.3/node_modules/glob/dist/esm/pattern.js
var isPatternList = /* @__PURE__ */ __name((pl) => pl.length >= 1, "isPatternList");
var isGlobList = /* @__PURE__ */ __name((gl) => gl.length >= 1, "isGlobList");
var Pattern = class _Pattern {
  static {
    __name(this, "Pattern");
  }
  #patternList;
  #globList;
  #index;
  length;
  #platform;
  #rest;
  #globString;
  #isDrive;
  #isUNC;
  #isAbsolute;
  #followGlobstar = true;
  constructor(patternList, globList, index, platform) {
    if (!isPatternList(patternList)) {
      throw new TypeError("empty pattern list");
    }
    if (!isGlobList(globList)) {
      throw new TypeError("empty glob list");
    }
    if (globList.length !== patternList.length) {
      throw new TypeError("mismatched pattern list and glob list lengths");
    }
    this.length = patternList.length;
    if (index < 0 || index >= this.length) {
      throw new TypeError("index out of range");
    }
    this.#patternList = patternList;
    this.#globList = globList;
    this.#index = index;
    this.#platform = platform;
    if (this.#index === 0) {
      if (this.isUNC()) {
        const [p0, p1, p2, p3, ...prest] = this.#patternList;
        const [g0, g1, g2, g3, ...grest] = this.#globList;
        if (prest[0] === "") {
          prest.shift();
          grest.shift();
        }
        const p = [
          p0,
          p1,
          p2,
          p3,
          ""
        ].join("/");
        const g = [
          g0,
          g1,
          g2,
          g3,
          ""
        ].join("/");
        this.#patternList = [
          p,
          ...prest
        ];
        this.#globList = [
          g,
          ...grest
        ];
        this.length = this.#patternList.length;
      } else if (this.isDrive() || this.isAbsolute()) {
        const [p1, ...prest] = this.#patternList;
        const [g1, ...grest] = this.#globList;
        if (prest[0] === "") {
          prest.shift();
          grest.shift();
        }
        const p = p1 + "/";
        const g = g1 + "/";
        this.#patternList = [
          p,
          ...prest
        ];
        this.#globList = [
          g,
          ...grest
        ];
        this.length = this.#patternList.length;
      }
    }
  }
  /**
   * The first entry in the parsed list of patterns
   */
  pattern() {
    return this.#patternList[this.#index];
  }
  /**
   * true of if pattern() returns a string
   */
  isString() {
    return typeof this.#patternList[this.#index] === "string";
  }
  /**
   * true of if pattern() returns GLOBSTAR
   */
  isGlobstar() {
    return this.#patternList[this.#index] === GLOBSTAR;
  }
  /**
   * true if pattern() returns a regexp
   */
  isRegExp() {
    return this.#patternList[this.#index] instanceof RegExp;
  }
  /**
   * The /-joined set of glob parts that make up this pattern
   */
  globString() {
    return this.#globString = this.#globString || (this.#index === 0 ? this.isAbsolute() ? this.#globList[0] + this.#globList.slice(1).join("/") : this.#globList.join("/") : this.#globList.slice(this.#index).join("/"));
  }
  /**
   * true if there are more pattern parts after this one
   */
  hasMore() {
    return this.length > this.#index + 1;
  }
  /**
   * The rest of the pattern after this part, or null if this is the end
   */
  rest() {
    if (this.#rest !== void 0) return this.#rest;
    if (!this.hasMore()) return this.#rest = null;
    this.#rest = new _Pattern(this.#patternList, this.#globList, this.#index + 1, this.#platform);
    this.#rest.#isAbsolute = this.#isAbsolute;
    this.#rest.#isUNC = this.#isUNC;
    this.#rest.#isDrive = this.#isDrive;
    return this.#rest;
  }
  /**
   * true if the pattern represents a //unc/path/ on windows
   */
  isUNC() {
    const pl = this.#patternList;
    return this.#isUNC !== void 0 ? this.#isUNC : this.#isUNC = this.#platform === "win32" && this.#index === 0 && pl[0] === "" && pl[1] === "" && typeof pl[2] === "string" && !!pl[2] && typeof pl[3] === "string" && !!pl[3];
  }
  // pattern like C:/...
  // split = ['C:', ...]
  // XXX: would be nice to handle patterns like `c:*` to test the cwd
  // in c: for *, but I don't know of a way to even figure out what that
  // cwd is without actually chdir'ing into it?
  /**
   * True if the pattern starts with a drive letter on Windows
   */
  isDrive() {
    const pl = this.#patternList;
    return this.#isDrive !== void 0 ? this.#isDrive : this.#isDrive = this.#platform === "win32" && this.#index === 0 && this.length > 1 && typeof pl[0] === "string" && /^[a-z]:$/i.test(pl[0]);
  }
  // pattern = '/' or '/...' or '/x/...'
  // split = ['', ''] or ['', ...] or ['', 'x', ...]
  // Drive and UNC both considered absolute on windows
  /**
   * True if the pattern is rooted on an absolute path
   */
  isAbsolute() {
    const pl = this.#patternList;
    return this.#isAbsolute !== void 0 ? this.#isAbsolute : this.#isAbsolute = pl[0] === "" && pl.length > 1 || this.isDrive() || this.isUNC();
  }
  /**
   * consume the root of the pattern, and return it
   */
  root() {
    const p = this.#patternList[0];
    return typeof p === "string" && this.isAbsolute() && this.#index === 0 ? p : "";
  }
  /**
   * Check to see if the current globstar pattern is allowed to follow
   * a symbolic link.
   */
  checkFollowGlobstar() {
    return !(this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar);
  }
  /**
   * Mark that the current globstar pattern is following a symbolic link
   */
  markFollowGlobstar() {
    if (this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar) return false;
    this.#followGlobstar = false;
    return true;
  }
};

// ../../node_modules/.pnpm/glob@11.0.3/node_modules/glob/dist/esm/ignore.js
var defaultPlatform2 = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
var Ignore = class {
  static {
    __name(this, "Ignore");
  }
  relative;
  relativeChildren;
  absolute;
  absoluteChildren;
  platform;
  mmopts;
  constructor(ignored, { nobrace, nocase, noext, noglobstar, platform = defaultPlatform2 }) {
    this.relative = [];
    this.absolute = [];
    this.relativeChildren = [];
    this.absoluteChildren = [];
    this.platform = platform;
    this.mmopts = {
      dot: true,
      nobrace,
      nocase,
      noext,
      noglobstar,
      optimizationLevel: 2,
      platform,
      nocomment: true,
      nonegate: true
    };
    for (const ign of ignored) this.add(ign);
  }
  add(ign) {
    const mm = new Minimatch(ign, this.mmopts);
    for (let i = 0; i < mm.set.length; i++) {
      const parsed = mm.set[i];
      const globParts = mm.globParts[i];
      if (!parsed || !globParts) {
        throw new Error("invalid pattern object");
      }
      while (parsed[0] === "." && globParts[0] === ".") {
        parsed.shift();
        globParts.shift();
      }
      const p = new Pattern(parsed, globParts, 0, this.platform);
      const m = new Minimatch(p.globString(), this.mmopts);
      const children = globParts[globParts.length - 1] === "**";
      const absolute = p.isAbsolute();
      if (absolute) this.absolute.push(m);
      else this.relative.push(m);
      if (children) {
        if (absolute) this.absoluteChildren.push(m);
        else this.relativeChildren.push(m);
      }
    }
  }
  ignored(p) {
    const fullpath = p.fullpath();
    const fullpaths = `${fullpath}/`;
    const relative2 = p.relative() || ".";
    const relatives = `${relative2}/`;
    for (const m of this.relative) {
      if (m.match(relative2) || m.match(relatives)) return true;
    }
    for (const m of this.absolute) {
      if (m.match(fullpath) || m.match(fullpaths)) return true;
    }
    return false;
  }
  childrenIgnored(p) {
    const fullpath = p.fullpath() + "/";
    const relative2 = (p.relative() || ".") + "/";
    for (const m of this.relativeChildren) {
      if (m.match(relative2)) return true;
    }
    for (const m of this.absoluteChildren) {
      if (m.match(fullpath)) return true;
    }
    return false;
  }
};

// ../../node_modules/.pnpm/glob@11.0.3/node_modules/glob/dist/esm/processor.js
var HasWalkedCache = class _HasWalkedCache {
  static {
    __name(this, "HasWalkedCache");
  }
  store;
  constructor(store = /* @__PURE__ */ new Map()) {
    this.store = store;
  }
  copy() {
    return new _HasWalkedCache(new Map(this.store));
  }
  hasWalked(target, pattern) {
    return this.store.get(target.fullpath())?.has(pattern.globString());
  }
  storeWalked(target, pattern) {
    const fullpath = target.fullpath();
    const cached = this.store.get(fullpath);
    if (cached) cached.add(pattern.globString());
    else this.store.set(fullpath, /* @__PURE__ */ new Set([
      pattern.globString()
    ]));
  }
};
var MatchRecord = class {
  static {
    __name(this, "MatchRecord");
  }
  store = /* @__PURE__ */ new Map();
  add(target, absolute, ifDir) {
    const n = (absolute ? 2 : 0) | (ifDir ? 1 : 0);
    const current = this.store.get(target);
    this.store.set(target, current === void 0 ? n : n & current);
  }
  // match, absolute, ifdir
  entries() {
    return [
      ...this.store.entries()
    ].map(([path2, n]) => [
      path2,
      !!(n & 2),
      !!(n & 1)
    ]);
  }
};
var SubWalks = class {
  static {
    __name(this, "SubWalks");
  }
  store = /* @__PURE__ */ new Map();
  add(target, pattern) {
    if (!target.canReaddir()) {
      return;
    }
    const subs = this.store.get(target);
    if (subs) {
      if (!subs.find((p) => p.globString() === pattern.globString())) {
        subs.push(pattern);
      }
    } else this.store.set(target, [
      pattern
    ]);
  }
  get(target) {
    const subs = this.store.get(target);
    if (!subs) {
      throw new Error("attempting to walk unknown path");
    }
    return subs;
  }
  entries() {
    return this.keys().map((k) => [
      k,
      this.store.get(k)
    ]);
  }
  keys() {
    return [
      ...this.store.keys()
    ].filter((t) => t.canReaddir());
  }
};
var Processor = class _Processor {
  static {
    __name(this, "Processor");
  }
  hasWalkedCache;
  matches = new MatchRecord();
  subwalks = new SubWalks();
  patterns;
  follow;
  dot;
  opts;
  constructor(opts, hasWalkedCache) {
    this.opts = opts;
    this.follow = !!opts.follow;
    this.dot = !!opts.dot;
    this.hasWalkedCache = hasWalkedCache ? hasWalkedCache.copy() : new HasWalkedCache();
  }
  processPatterns(target, patterns) {
    this.patterns = patterns;
    const processingSet = patterns.map((p) => [
      target,
      p
    ]);
    for (let [t, pattern] of processingSet) {
      this.hasWalkedCache.storeWalked(t, pattern);
      const root = pattern.root();
      const absolute = pattern.isAbsolute() && this.opts.absolute !== false;
      if (root) {
        t = t.resolve(root === "/" && this.opts.root !== void 0 ? this.opts.root : root);
        const rest2 = pattern.rest();
        if (!rest2) {
          this.matches.add(t, true, false);
          continue;
        } else {
          pattern = rest2;
        }
      }
      if (t.isENOENT()) continue;
      let p;
      let rest;
      let changed = false;
      while (typeof (p = pattern.pattern()) === "string" && (rest = pattern.rest())) {
        const c = t.resolve(p);
        t = c;
        pattern = rest;
        changed = true;
      }
      p = pattern.pattern();
      rest = pattern.rest();
      if (changed) {
        if (this.hasWalkedCache.hasWalked(t, pattern)) continue;
        this.hasWalkedCache.storeWalked(t, pattern);
      }
      if (typeof p === "string") {
        const ifDir = p === ".." || p === "" || p === ".";
        this.matches.add(t.resolve(p), absolute, ifDir);
        continue;
      } else if (p === GLOBSTAR) {
        if (!t.isSymbolicLink() || this.follow || pattern.checkFollowGlobstar()) {
          this.subwalks.add(t, pattern);
        }
        const rp = rest?.pattern();
        const rrest = rest?.rest();
        if (!rest || (rp === "" || rp === ".") && !rrest) {
          this.matches.add(t, absolute, rp === "" || rp === ".");
        } else {
          if (rp === "..") {
            const tp = t.parent || t;
            if (!rrest) this.matches.add(tp, absolute, true);
            else if (!this.hasWalkedCache.hasWalked(tp, rrest)) {
              this.subwalks.add(tp, rrest);
            }
          }
        }
      } else if (p instanceof RegExp) {
        this.subwalks.add(t, pattern);
      }
    }
    return this;
  }
  subwalkTargets() {
    return this.subwalks.keys();
  }
  child() {
    return new _Processor(this.opts, this.hasWalkedCache);
  }
  // return a new Processor containing the subwalks for each
  // child entry, and a set of matches, and
  // a hasWalkedCache that's a copy of this one
  // then we're going to call
  filterEntries(parent, entries) {
    const patterns = this.subwalks.get(parent);
    const results = this.child();
    for (const e of entries) {
      for (const pattern of patterns) {
        const absolute = pattern.isAbsolute();
        const p = pattern.pattern();
        const rest = pattern.rest();
        if (p === GLOBSTAR) {
          results.testGlobstar(e, pattern, rest, absolute);
        } else if (p instanceof RegExp) {
          results.testRegExp(e, p, rest, absolute);
        } else {
          results.testString(e, p, rest, absolute);
        }
      }
    }
    return results;
  }
  testGlobstar(e, pattern, rest, absolute) {
    if (this.dot || !e.name.startsWith(".")) {
      if (!pattern.hasMore()) {
        this.matches.add(e, absolute, false);
      }
      if (e.canReaddir()) {
        if (this.follow || !e.isSymbolicLink()) {
          this.subwalks.add(e, pattern);
        } else if (e.isSymbolicLink()) {
          if (rest && pattern.checkFollowGlobstar()) {
            this.subwalks.add(e, rest);
          } else if (pattern.markFollowGlobstar()) {
            this.subwalks.add(e, pattern);
          }
        }
      }
    }
    if (rest) {
      const rp = rest.pattern();
      if (typeof rp === "string" && // dots and empty were handled already
      rp !== ".." && rp !== "" && rp !== ".") {
        this.testString(e, rp, rest.rest(), absolute);
      } else if (rp === "..") {
        const ep = e.parent || e;
        this.subwalks.add(ep, rest);
      } else if (rp instanceof RegExp) {
        this.testRegExp(e, rp, rest.rest(), absolute);
      }
    }
  }
  testRegExp(e, p, rest, absolute) {
    if (!p.test(e.name)) return;
    if (!rest) {
      this.matches.add(e, absolute, false);
    } else {
      this.subwalks.add(e, rest);
    }
  }
  testString(e, p, rest, absolute) {
    if (!e.isNamed(p)) return;
    if (!rest) {
      this.matches.add(e, absolute, false);
    } else {
      this.subwalks.add(e, rest);
    }
  }
};

// ../../node_modules/.pnpm/glob@11.0.3/node_modules/glob/dist/esm/walker.js
var makeIgnore = /* @__PURE__ */ __name((ignore, opts) => typeof ignore === "string" ? new Ignore([
  ignore
], opts) : Array.isArray(ignore) ? new Ignore(ignore, opts) : ignore, "makeIgnore");
var GlobUtil = class {
  static {
    __name(this, "GlobUtil");
  }
  path;
  patterns;
  opts;
  seen = /* @__PURE__ */ new Set();
  paused = false;
  aborted = false;
  #onResume = [];
  #ignore;
  #sep;
  signal;
  maxDepth;
  includeChildMatches;
  constructor(patterns, path2, opts) {
    this.patterns = patterns;
    this.path = path2;
    this.opts = opts;
    this.#sep = !opts.posix && opts.platform === "win32" ? "\\" : "/";
    this.includeChildMatches = opts.includeChildMatches !== false;
    if (opts.ignore || !this.includeChildMatches) {
      this.#ignore = makeIgnore(opts.ignore ?? [], opts);
      if (!this.includeChildMatches && typeof this.#ignore.add !== "function") {
        const m = "cannot ignore child matches, ignore lacks add() method.";
        throw new Error(m);
      }
    }
    this.maxDepth = opts.maxDepth || Infinity;
    if (opts.signal) {
      this.signal = opts.signal;
      this.signal.addEventListener("abort", () => {
        this.#onResume.length = 0;
      });
    }
  }
  #ignored(path2) {
    return this.seen.has(path2) || !!this.#ignore?.ignored?.(path2);
  }
  #childrenIgnored(path2) {
    return !!this.#ignore?.childrenIgnored?.(path2);
  }
  // backpressure mechanism
  pause() {
    this.paused = true;
  }
  resume() {
    if (this.signal?.aborted) return;
    this.paused = false;
    let fn = void 0;
    while (!this.paused && (fn = this.#onResume.shift())) {
      fn();
    }
  }
  onResume(fn) {
    if (this.signal?.aborted) return;
    if (!this.paused) {
      fn();
    } else {
      this.#onResume.push(fn);
    }
  }
  // do the requisite realpath/stat checking, and return the path
  // to add or undefined to filter it out.
  async matchCheck(e, ifDir) {
    if (ifDir && this.opts.nodir) return void 0;
    let rpc;
    if (this.opts.realpath) {
      rpc = e.realpathCached() || await e.realpath();
      if (!rpc) return void 0;
      e = rpc;
    }
    const needStat = e.isUnknown() || this.opts.stat;
    const s = needStat ? await e.lstat() : e;
    if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
      const target = await s.realpath();
      if (target && (target.isUnknown() || this.opts.stat)) {
        await target.lstat();
      }
    }
    return this.matchCheckTest(s, ifDir);
  }
  matchCheckTest(e, ifDir) {
    return e && (this.maxDepth === Infinity || e.depth() <= this.maxDepth) && (!ifDir || e.canReaddir()) && (!this.opts.nodir || !e.isDirectory()) && (!this.opts.nodir || !this.opts.follow || !e.isSymbolicLink() || !e.realpathCached()?.isDirectory()) && !this.#ignored(e) ? e : void 0;
  }
  matchCheckSync(e, ifDir) {
    if (ifDir && this.opts.nodir) return void 0;
    let rpc;
    if (this.opts.realpath) {
      rpc = e.realpathCached() || e.realpathSync();
      if (!rpc) return void 0;
      e = rpc;
    }
    const needStat = e.isUnknown() || this.opts.stat;
    const s = needStat ? e.lstatSync() : e;
    if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
      const target = s.realpathSync();
      if (target && (target?.isUnknown() || this.opts.stat)) {
        target.lstatSync();
      }
    }
    return this.matchCheckTest(s, ifDir);
  }
  matchFinish(e, absolute) {
    if (this.#ignored(e)) return;
    if (!this.includeChildMatches && this.#ignore?.add) {
      const ign = `${e.relativePosix()}/**`;
      this.#ignore.add(ign);
    }
    const abs = this.opts.absolute === void 0 ? absolute : this.opts.absolute;
    this.seen.add(e);
    const mark = this.opts.mark && e.isDirectory() ? this.#sep : "";
    if (this.opts.withFileTypes) {
      this.matchEmit(e);
    } else if (abs) {
      const abs2 = this.opts.posix ? e.fullpathPosix() : e.fullpath();
      this.matchEmit(abs2 + mark);
    } else {
      const rel = this.opts.posix ? e.relativePosix() : e.relative();
      const pre = this.opts.dotRelative && !rel.startsWith(".." + this.#sep) ? "." + this.#sep : "";
      this.matchEmit(!rel ? "." + mark : pre + rel + mark);
    }
  }
  async match(e, absolute, ifDir) {
    const p = await this.matchCheck(e, ifDir);
    if (p) this.matchFinish(p, absolute);
  }
  matchSync(e, absolute, ifDir) {
    const p = this.matchCheckSync(e, ifDir);
    if (p) this.matchFinish(p, absolute);
  }
  walkCB(target, patterns, cb) {
    if (this.signal?.aborted) cb();
    this.walkCB2(target, patterns, new Processor(this.opts), cb);
  }
  walkCB2(target, patterns, processor, cb) {
    if (this.#childrenIgnored(target)) return cb();
    if (this.signal?.aborted) cb();
    if (this.paused) {
      this.onResume(() => this.walkCB2(target, patterns, processor, cb));
      return;
    }
    processor.processPatterns(target, patterns);
    let tasks = 1;
    const next = /* @__PURE__ */ __name(() => {
      if (--tasks === 0) cb();
    }, "next");
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m)) continue;
      tasks++;
      this.match(m, absolute, ifDir).then(() => next());
    }
    for (const t of processor.subwalkTargets()) {
      if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
        continue;
      }
      tasks++;
      const childrenCached = t.readdirCached();
      if (t.calledReaddir()) this.walkCB3(t, childrenCached, processor, next);
      else {
        t.readdirCB((_, entries) => this.walkCB3(t, entries, processor, next), true);
      }
    }
    next();
  }
  walkCB3(target, entries, processor, cb) {
    processor = processor.filterEntries(target, entries);
    let tasks = 1;
    const next = /* @__PURE__ */ __name(() => {
      if (--tasks === 0) cb();
    }, "next");
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m)) continue;
      tasks++;
      this.match(m, absolute, ifDir).then(() => next());
    }
    for (const [target2, patterns] of processor.subwalks.entries()) {
      tasks++;
      this.walkCB2(target2, patterns, processor.child(), next);
    }
    next();
  }
  walkCBSync(target, patterns, cb) {
    if (this.signal?.aborted) cb();
    this.walkCB2Sync(target, patterns, new Processor(this.opts), cb);
  }
  walkCB2Sync(target, patterns, processor, cb) {
    if (this.#childrenIgnored(target)) return cb();
    if (this.signal?.aborted) cb();
    if (this.paused) {
      this.onResume(() => this.walkCB2Sync(target, patterns, processor, cb));
      return;
    }
    processor.processPatterns(target, patterns);
    let tasks = 1;
    const next = /* @__PURE__ */ __name(() => {
      if (--tasks === 0) cb();
    }, "next");
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m)) continue;
      this.matchSync(m, absolute, ifDir);
    }
    for (const t of processor.subwalkTargets()) {
      if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
        continue;
      }
      tasks++;
      const children = t.readdirSync();
      this.walkCB3Sync(t, children, processor, next);
    }
    next();
  }
  walkCB3Sync(target, entries, processor, cb) {
    processor = processor.filterEntries(target, entries);
    let tasks = 1;
    const next = /* @__PURE__ */ __name(() => {
      if (--tasks === 0) cb();
    }, "next");
    for (const [m, absolute, ifDir] of processor.matches.entries()) {
      if (this.#ignored(m)) continue;
      this.matchSync(m, absolute, ifDir);
    }
    for (const [target2, patterns] of processor.subwalks.entries()) {
      tasks++;
      this.walkCB2Sync(target2, patterns, processor.child(), next);
    }
    next();
  }
};
var GlobWalker = class extends GlobUtil {
  static {
    __name(this, "GlobWalker");
  }
  matches = /* @__PURE__ */ new Set();
  constructor(patterns, path2, opts) {
    super(patterns, path2, opts);
  }
  matchEmit(e) {
    this.matches.add(e);
  }
  async walk() {
    if (this.signal?.aborted) throw this.signal.reason;
    if (this.path.isUnknown()) {
      await this.path.lstat();
    }
    await new Promise((res, rej) => {
      this.walkCB(this.path, this.patterns, () => {
        if (this.signal?.aborted) {
          rej(this.signal.reason);
        } else {
          res(this.matches);
        }
      });
    });
    return this.matches;
  }
  walkSync() {
    if (this.signal?.aborted) throw this.signal.reason;
    if (this.path.isUnknown()) {
      this.path.lstatSync();
    }
    this.walkCBSync(this.path, this.patterns, () => {
      if (this.signal?.aborted) throw this.signal.reason;
    });
    return this.matches;
  }
};
var GlobStream = class extends GlobUtil {
  static {
    __name(this, "GlobStream");
  }
  results;
  constructor(patterns, path2, opts) {
    super(patterns, path2, opts);
    this.results = new Minipass({
      signal: this.signal,
      objectMode: true
    });
    this.results.on("drain", () => this.resume());
    this.results.on("resume", () => this.resume());
  }
  matchEmit(e) {
    this.results.write(e);
    if (!this.results.flowing) this.pause();
  }
  stream() {
    const target = this.path;
    if (target.isUnknown()) {
      target.lstat().then(() => {
        this.walkCB(target, this.patterns, () => this.results.end());
      });
    } else {
      this.walkCB(target, this.patterns, () => this.results.end());
    }
    return this.results;
  }
  streamSync() {
    if (this.path.isUnknown()) {
      this.path.lstatSync();
    }
    this.walkCBSync(this.path, this.patterns, () => this.results.end());
    return this.results;
  }
};

// ../../node_modules/.pnpm/glob@11.0.3/node_modules/glob/dist/esm/glob.js
var defaultPlatform3 = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
var Glob = class {
  static {
    __name(this, "Glob");
  }
  absolute;
  cwd;
  root;
  dot;
  dotRelative;
  follow;
  ignore;
  magicalBraces;
  mark;
  matchBase;
  maxDepth;
  nobrace;
  nocase;
  nodir;
  noext;
  noglobstar;
  pattern;
  platform;
  realpath;
  scurry;
  stat;
  signal;
  windowsPathsNoEscape;
  withFileTypes;
  includeChildMatches;
  /**
   * The options provided to the constructor.
   */
  opts;
  /**
   * An array of parsed immutable {@link Pattern} objects.
   */
  patterns;
  /**
   * All options are stored as properties on the `Glob` object.
   *
   * See {@link GlobOptions} for full options descriptions.
   *
   * Note that a previous `Glob` object can be passed as the
   * `GlobOptions` to another `Glob` instantiation to re-use settings
   * and caches with a new pattern.
   *
   * Traversal functions can be called multiple times to run the walk
   * again.
   */
  constructor(pattern, opts) {
    if (!opts) throw new TypeError("glob options required");
    this.withFileTypes = !!opts.withFileTypes;
    this.signal = opts.signal;
    this.follow = !!opts.follow;
    this.dot = !!opts.dot;
    this.dotRelative = !!opts.dotRelative;
    this.nodir = !!opts.nodir;
    this.mark = !!opts.mark;
    if (!opts.cwd) {
      this.cwd = "";
    } else if (opts.cwd instanceof URL || opts.cwd.startsWith("file://")) {
      opts.cwd = url.fileURLToPath(opts.cwd);
    }
    this.cwd = opts.cwd || "";
    this.root = opts.root;
    this.magicalBraces = !!opts.magicalBraces;
    this.nobrace = !!opts.nobrace;
    this.noext = !!opts.noext;
    this.realpath = !!opts.realpath;
    this.absolute = opts.absolute;
    this.includeChildMatches = opts.includeChildMatches !== false;
    this.noglobstar = !!opts.noglobstar;
    this.matchBase = !!opts.matchBase;
    this.maxDepth = typeof opts.maxDepth === "number" ? opts.maxDepth : Infinity;
    this.stat = !!opts.stat;
    this.ignore = opts.ignore;
    if (this.withFileTypes && this.absolute !== void 0) {
      throw new Error("cannot set absolute and withFileTypes:true");
    }
    if (typeof pattern === "string") {
      pattern = [
        pattern
      ];
    }
    this.windowsPathsNoEscape = !!opts.windowsPathsNoEscape || opts.allowWindowsEscape === false;
    if (this.windowsPathsNoEscape) {
      pattern = pattern.map((p) => p.replace(/\\/g, "/"));
    }
    if (this.matchBase) {
      if (opts.noglobstar) {
        throw new TypeError("base matching requires globstar");
      }
      pattern = pattern.map((p) => p.includes("/") ? p : `./**/${p}`);
    }
    this.pattern = pattern;
    this.platform = opts.platform || defaultPlatform3;
    this.opts = {
      ...opts,
      platform: this.platform
    };
    if (opts.scurry) {
      this.scurry = opts.scurry;
      if (opts.nocase !== void 0 && opts.nocase !== opts.scurry.nocase) {
        throw new Error("nocase option contradicts provided scurry option");
      }
    } else {
      const Scurry = opts.platform === "win32" ? PathScurryWin32 : opts.platform === "darwin" ? PathScurryDarwin : opts.platform ? PathScurryPosix : PathScurry;
      this.scurry = new Scurry(this.cwd, {
        nocase: opts.nocase,
        fs: opts.fs
      });
    }
    this.nocase = this.scurry.nocase;
    const nocaseMagicOnly = this.platform === "darwin" || this.platform === "win32";
    const mmo = {
      // default nocase based on platform
      ...opts,
      dot: this.dot,
      matchBase: this.matchBase,
      nobrace: this.nobrace,
      nocase: this.nocase,
      nocaseMagicOnly,
      nocomment: true,
      noext: this.noext,
      nonegate: true,
      optimizationLevel: 2,
      platform: this.platform,
      windowsPathsNoEscape: this.windowsPathsNoEscape,
      debug: !!this.opts.debug
    };
    const mms = this.pattern.map((p) => new Minimatch(p, mmo));
    const [matchSet, globParts] = mms.reduce((set, m) => {
      set[0].push(...m.set);
      set[1].push(...m.globParts);
      return set;
    }, [
      [],
      []
    ]);
    this.patterns = matchSet.map((set, i) => {
      const g = globParts[i];
      if (!g) throw new Error("invalid pattern object");
      return new Pattern(set, g, 0, this.platform);
    });
  }
  async walk() {
    return [
      ...await new GlobWalker(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches
      }).walk()
    ];
  }
  walkSync() {
    return [
      ...new GlobWalker(this.patterns, this.scurry.cwd, {
        ...this.opts,
        maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
        platform: this.platform,
        nocase: this.nocase,
        includeChildMatches: this.includeChildMatches
      }).walkSync()
    ];
  }
  stream() {
    return new GlobStream(this.patterns, this.scurry.cwd, {
      ...this.opts,
      maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
      platform: this.platform,
      nocase: this.nocase,
      includeChildMatches: this.includeChildMatches
    }).stream();
  }
  streamSync() {
    return new GlobStream(this.patterns, this.scurry.cwd, {
      ...this.opts,
      maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
      platform: this.platform,
      nocase: this.nocase,
      includeChildMatches: this.includeChildMatches
    }).streamSync();
  }
  /**
   * Default sync iteration function. Returns a Generator that
   * iterates over the results.
   */
  iterateSync() {
    return this.streamSync()[Symbol.iterator]();
  }
  [Symbol.iterator]() {
    return this.iterateSync();
  }
  /**
   * Default async iteration function. Returns an AsyncGenerator that
   * iterates over the results.
   */
  iterate() {
    return this.stream()[Symbol.asyncIterator]();
  }
  [Symbol.asyncIterator]() {
    return this.iterate();
  }
};

// ../../node_modules/.pnpm/glob@11.0.3/node_modules/glob/dist/esm/has-magic.js
var hasMagic = /* @__PURE__ */ __name((pattern, options = {}) => {
  if (!Array.isArray(pattern)) {
    pattern = [
      pattern
    ];
  }
  for (const p of pattern) {
    if (new Minimatch(p, options).hasMagic()) return true;
  }
  return false;
}, "hasMagic");

// ../../node_modules/.pnpm/glob@11.0.3/node_modules/glob/dist/esm/index.js
function globStreamSync(pattern, options = {}) {
  return new Glob(pattern, options).streamSync();
}
__name(globStreamSync, "globStreamSync");
function globStream(pattern, options = {}) {
  return new Glob(pattern, options).stream();
}
__name(globStream, "globStream");
function globSync(pattern, options = {}) {
  return new Glob(pattern, options).walkSync();
}
__name(globSync, "globSync");
async function glob_(pattern, options = {}) {
  return new Glob(pattern, options).walk();
}
__name(glob_, "glob_");
function globIterateSync(pattern, options = {}) {
  return new Glob(pattern, options).iterateSync();
}
__name(globIterateSync, "globIterateSync");
function globIterate(pattern, options = {}) {
  return new Glob(pattern, options).iterate();
}
__name(globIterate, "globIterate");
var streamSync = globStreamSync;
var stream = Object.assign(globStream, {
  sync: globStreamSync
});
var iterateSync = globIterateSync;
var iterate = Object.assign(globIterate, {
  sync: globIterateSync
});
var sync = Object.assign(globSync, {
  stream: globStreamSync,
  iterate: globIterateSync
});
var glob = Object.assign(glob_, {
  glob: glob_,
  globSync,
  sync,
  globStream,
  stream,
  globStreamSync,
  streamSync,
  globIterate,
  iterate,
  globIterateSync,
  iterateSync,
  Glob,
  hasMagic,
  escape,
  unescape
});
glob.glob = glob;
function toArray(array) {
  array = array ?? [];
  return Array.isArray(array) ? array : [
    array
  ];
}
__name(toArray, "toArray");
__name2(toArray, "toArray");
function existsSync(filePath) {
  return actualFS.existsSync(filePath);
}
__name(existsSync, "existsSync");
__name2(existsSync, "existsSync");
var getObjectTag = /* @__PURE__ */ __name2((value) => {
  if (value == null) {
    return value === void 0 ? "[object Undefined]" : "[object Null]";
  }
  return Object.prototype.toString.call(value);
}, "getObjectTag");
var isObjectLike = /* @__PURE__ */ __name2((obj) => {
  return typeof obj === "object" && obj !== null;
}, "isObjectLike");
var isPlainObject3 = /* @__PURE__ */ __name2((obj) => {
  if (!isObjectLike(obj) || getObjectTag(obj) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}, "isPlainObject");
var isObject = /* @__PURE__ */ __name2((value) => {
  try {
    return typeof value === "object" || Boolean(value) && value?.constructor === Object || isPlainObject3(value);
  } catch {
    return false;
  }
}, "isObject");
var isString2 = /* @__PURE__ */ __name2((value) => {
  try {
    return typeof value === "string";
  } catch {
    return false;
  }
}, "isString");
var EMPTY_STRING = "";
var singleComment = Symbol("singleComment");
var multiComment = Symbol("multiComment");
function stripWithoutWhitespace() {
  return "";
}
__name(stripWithoutWhitespace, "stripWithoutWhitespace");
__name2(stripWithoutWhitespace, "stripWithoutWhitespace");
function stripWithWhitespace(value, start, end) {
  return value.slice(start, end).replace(/\S/g, " ");
}
__name(stripWithWhitespace, "stripWithWhitespace");
__name2(stripWithWhitespace, "stripWithWhitespace");
function isEscaped(value, quotePosition) {
  let index = quotePosition - 1;
  let backslashCount = 0;
  while (value[index] === "\\") {
    index -= 1;
    backslashCount += 1;
  }
  return Boolean(backslashCount % 2);
}
__name(isEscaped, "isEscaped");
__name2(isEscaped, "isEscaped");
function stripComments2(value, { whitespace = true, trailingCommas = false } = {}) {
  if (typeof value !== "string") {
    throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof value}\``);
  }
  const strip = whitespace ? stripWithWhitespace : stripWithoutWhitespace;
  let isInsideString = false;
  let isInsideComment = false;
  let offset = 0;
  let buffer = "";
  let result = "";
  let commaIndex = -1;
  for (let index = 0; index < value.length; index++) {
    const currentCharacter = value[index];
    const nextCharacter = value[index + 1];
    if (!isInsideComment && currentCharacter === '"') {
      const escaped = isEscaped(value, index);
      if (!escaped) {
        isInsideString = !isInsideString;
      }
    }
    if (isInsideString) {
      continue;
    }
    if (!isInsideComment && currentCharacter + (nextCharacter ?? EMPTY_STRING) === "//") {
      buffer += value.slice(offset, index);
      offset = index;
      isInsideComment = singleComment;
      index++;
    } else if (isInsideComment === singleComment && currentCharacter + (nextCharacter ?? EMPTY_STRING) === "\r\n") {
      index++;
      isInsideComment = false;
      buffer += strip(value, offset, index);
      offset = index;
    } else if (isInsideComment === singleComment && currentCharacter === "\n") {
      isInsideComment = false;
      buffer += strip(value, offset, index);
      offset = index;
    } else if (!isInsideComment && currentCharacter + (nextCharacter ?? EMPTY_STRING) === "/*") {
      buffer += value.slice(offset, index);
      offset = index;
      isInsideComment = multiComment;
      index++;
    } else if (isInsideComment === multiComment && currentCharacter + (nextCharacter ?? EMPTY_STRING) === "*/") {
      index++;
      isInsideComment = false;
      buffer += strip(value, offset, index + 1);
      offset = index + 1;
    } else if (trailingCommas && !isInsideComment) {
      if (commaIndex !== -1) {
        if (currentCharacter === "}" || currentCharacter === "]") {
          buffer += value.slice(offset, index);
          result += strip(buffer, 0, 1) + buffer.slice(1);
          buffer = "";
          offset = index;
          commaIndex = -1;
        } else if (currentCharacter !== " " && currentCharacter !== "	" && currentCharacter !== "\r" && currentCharacter !== "\n") {
          buffer += value.slice(offset, index);
          offset = index;
          commaIndex = -1;
        }
      } else if (currentCharacter === ",") {
        result += buffer + value.slice(offset, index);
        buffer = "";
        offset = index;
        commaIndex = index;
      }
    }
  }
  return result + buffer + (isInsideComment ? strip(value.slice(offset)) : value.slice(offset));
}
__name(stripComments2, "stripComments");
__name2(stripComments2, "stripComments");
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(?:\.\d{1,17})?(?:E[+-]?\d+)?\s*$/i;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    console.warn(`Dropping "${key}" key to prevent prototype pollution.`);
    return;
  }
  return value;
}
__name(jsonParseTransform, "jsonParseTransform");
__name2(jsonParseTransform, "jsonParseTransform");
function parse4(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  let stripped = stripComments2(value);
  if (stripped[0] === '"' && stripped[stripped.length - 1] === '"' && !stripped.includes("\\")) {
    return stripped.slice(1, -1);
  }
  stripped = stripped.trim();
  if (stripped.length <= 9) {
    switch (stripped.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(stripped)) {
    if (options.strict) {
      throw new Error("Invalid JSON");
    }
    return stripped;
  }
  try {
    if (suspectProtoRx.test(stripped) || suspectConstructorRx.test(stripped)) {
      if (options.strict) {
        throw new Error("Possible prototype pollution");
      }
      return JSON.parse(stripped, jsonParseTransform);
    }
    return JSON.parse(stripped);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}
__name(parse4, "parse");
__name2(parse4, "parse");
var NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
function getMarkerLines(loc, source, opts = {}) {
  const startLoc = {
    column: 0,
    line: -1,
    ...loc.start
  };
  const endLoc = {
    ...startLoc,
    ...loc.end
  };
  const { linesAbove = 2, linesBelow = 3 } = opts || {};
  const startLine = startLoc.line;
  const startColumn = startLoc.column;
  const endLine = endLoc.line;
  const endColumn = endLoc.column;
  let start = Math.max(startLine - (linesAbove + 1), 0);
  let end = Math.min(source.length, endLine + linesBelow);
  if (startLine === -1) {
    start = 0;
  }
  if (endLine === -1) {
    end = source.length;
  }
  const lineDiff = endLine - startLine;
  const markerLines = {};
  if (lineDiff) {
    for (let i = 0; i <= lineDiff; i++) {
      const lineNumber = i + startLine;
      if (!startColumn) {
        markerLines[lineNumber] = true;
      } else if (i === 0) {
        const sourceLength = source[lineNumber - 1]?.length ?? 0;
        markerLines[lineNumber] = [
          startColumn,
          sourceLength - startColumn + 1
        ];
      } else if (i === lineDiff) {
        markerLines[lineNumber] = [
          0,
          endColumn
        ];
      } else {
        const sourceLength = source[lineNumber - i]?.length ?? 0;
        markerLines[lineNumber] = [
          0,
          sourceLength
        ];
      }
    }
  } else if (startColumn === endColumn) {
    markerLines[startLine] = startColumn ? [
      startColumn,
      0
    ] : true;
  } else {
    markerLines[startLine] = [
      startColumn,
      endColumn - startColumn
    ];
  }
  return {
    start,
    end,
    markerLines
  };
}
__name(getMarkerLines, "getMarkerLines");
__name2(getMarkerLines, "getMarkerLines");
function codeFrameColumns(rawLines, loc, opts = {}) {
  const lines = rawLines.split(NEWLINE);
  const { start, end, markerLines } = getMarkerLines(loc, lines, opts);
  const numberMaxWidth = String(end).length;
  const highlightedLines = opts.highlight ? opts.highlight(rawLines) : rawLines;
  const frame = highlightedLines.split(NEWLINE).slice(start, end).map((line, index) => {
    const number = start + 1 + index;
    const paddedNumber = ` ${number}`.slice(-numberMaxWidth);
    const gutter = ` ${paddedNumber} | `;
    const hasMarker = Boolean(markerLines[number] ?? false);
    if (hasMarker) {
      let markerLine = "";
      if (Array.isArray(hasMarker)) {
        const markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " ");
        const numberOfMarkers = hasMarker[1] || 1;
        markerLine = [
          "\n ",
          gutter.replace(/\d/g, " "),
          markerSpacing,
          "^".repeat(numberOfMarkers)
        ].join("");
      }
      return [
        ">",
        gutter,
        line,
        markerLine
      ].join("");
    }
    return ` ${gutter}${line}`;
  }).join("\n");
  return frame;
}
__name(codeFrameColumns, "codeFrameColumns");
__name2(codeFrameColumns, "codeFrameColumns");
function formatParseError(input, parseError) {
  const { error, offset, length } = parseError;
  const result = new LinesAndColumns(input).locationForIndex(offset);
  let line = result?.line ?? 0;
  let column = result?.column ?? 0;
  line++;
  column++;
  return `${printParseErrorCode(error)} in JSON at ${line}:${column}
${codeFrameColumns(input, {
    start: {
      line,
      column
    },
    end: {
      line,
      column: column + length
    }
  })}
`;
}
__name(formatParseError, "formatParseError");
__name2(formatParseError, "formatParseError");
var isNumber2 = /* @__PURE__ */ __name2((value) => {
  try {
    return value instanceof Number || typeof value === "number" || Number(value) === value;
  } catch {
    return false;
  }
}, "isNumber");
var isUndefined3 = /* @__PURE__ */ __name2((value) => {
  return value === void 0;
}, "isUndefined");
var invalidKeyChars = [
  "@",
  "/",
  "#",
  "$",
  " ",
  ":",
  ";",
  ",",
  ".",
  "!",
  "?",
  "&",
  "=",
  "+",
  "-",
  "*",
  "%",
  "^",
  "~",
  "|",
  "\\",
  '"',
  "'",
  "`",
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "<",
  ">"
];
var stringify2 = /* @__PURE__ */ __name2((value, spacing = 2) => {
  const space = isNumber2(spacing) ? " ".repeat(spacing) : spacing;
  switch (value) {
    case null: {
      return "null";
    }
    case void 0: {
      return '"undefined"';
    }
    case true: {
      return "true";
    }
    case false: {
      return "false";
    }
    case Number.POSITIVE_INFINITY: {
      return "infinity";
    }
    case Number.NEGATIVE_INFINITY: {
      return "-infinity";
    }
  }
  if (Array.isArray(value)) {
    return `[${space}${value.map((v) => stringify2(v, space)).join(`,${space}`)}${space}]`;
  }
  if (value instanceof Uint8Array) {
    return value.toString();
  }
  switch (typeof value) {
    case "number": {
      return `${value}`;
    }
    case "string": {
      return JSON.stringify(value);
    }
    case "object": {
      const keys = Object.keys(value).filter((key) => !isUndefined3(value[key]));
      return `{${space}${keys.map((key) => `${invalidKeyChars.some((invalidKeyChar) => key.includes(invalidKeyChar)) ? `"${key}"` : key}: ${space}${stringify2(value[key], space)}`).join(`,${space}`)}${space}}`;
    }
    default:
      return "null";
  }
}, "stringify");
var StormJSON = class _StormJSON extends SuperJSON {
  static {
    __name(this, "_StormJSON");
  }
  static {
    __name2(this, "StormJSON");
  }
  static #instance;
  static get instance() {
    if (!_StormJSON.#instance) {
      _StormJSON.#instance = new _StormJSON();
    }
    return _StormJSON.#instance;
  }
  /**
  * Deserialize the given value with superjson using the given metadata
  */
  static deserialize(payload) {
    return _StormJSON.instance.deserialize(payload);
  }
  /**
  * Serialize the given value with superjson
  */
  static serialize(object) {
    return _StormJSON.instance.serialize(object);
  }
  /**
  * Parse the given string value with superjson using the given metadata
  *
  * @param value - The string value to parse
  * @returns The parsed data
  */
  static parse(value) {
    return parse4(value);
  }
  /**
  * Serializes the given data to a JSON string.
  * By default the JSON string is formatted with a 2 space indentation to be easy readable.
  *
  * @param value - Object which should be serialized to JSON
  * @param _options - JSON serialize options
  * @returns the formatted JSON representation of the object
  */
  static stringify(value, _options) {
    const customTransformer = _StormJSON.instance.customTransformerRegistry.findApplicable(value);
    let result = value;
    if (customTransformer && customTransformer.isApplicable(value)) {
      result = customTransformer.serialize(result);
    }
    return stringify2(result);
  }
  /**
  * Parses the given JSON string and returns the object the JSON content represents.
  * By default javascript-style comments and trailing commas are allowed.
  *
  * @param strData - JSON content as string
  * @param options - JSON parse options
  * @returns Object the JSON content represents
  */
  static parseJson(strData, options) {
    try {
      if (options?.expectComments === false) {
        return _StormJSON.instance.parse(strData);
      }
    } catch {
    }
    const errors = [];
    const opts = {
      allowTrailingComma: true,
      ...options
    };
    const result = parse2(strData, errors, opts);
    if (errors.length > 0 && errors[0]) {
      throw new Error(formatParseError(strData, errors[0]));
    }
    return result;
  }
  /**
  * Register a custom schema with superjson
  *
  * @param name - The name of the schema
  * @param serialize - The function to serialize the schema
  * @param deserialize - The function to deserialize the schema
  * @param isApplicable - The function to check if the schema is applicable
  */
  static register(name, serialize2, deserialize2, isApplicable) {
    _StormJSON.instance.registerCustom({
      isApplicable,
      serialize: serialize2,
      deserialize: deserialize2
    }, name);
  }
  /**
  * Register a class with superjson
  *
  * @param classConstructor - The class constructor to register
  */
  static registerClass(classConstructor, options) {
    _StormJSON.instance.registerClass(classConstructor, {
      identifier: isString2(options) ? options : options?.identifier || classConstructor.name,
      allowProps: options && isObject(options) && options?.allowProps && Array.isArray(options.allowProps) ? options.allowProps : [
        "__typename"
      ]
    });
  }
  constructor() {
    super({
      dedupe: true
    });
  }
};
StormJSON.instance.registerCustom({
  isApplicable: /* @__PURE__ */ __name2((v) => buffer.Buffer.isBuffer(v), "isApplicable"),
  serialize: /* @__PURE__ */ __name2((v) => v.toString("base64"), "serialize"),
  deserialize: /* @__PURE__ */ __name2((v) => buffer.Buffer.from(v, "base64"), "deserialize")
}, "Bytes");
var isError2 = /* @__PURE__ */ __name2((obj) => {
  if (!isObject(obj)) {
    return false;
  }
  const tag = getObjectTag(obj);
  return tag === "[object Error]" || tag === "[object DOMException]" || typeof obj?.message === "string" && typeof obj?.name === "string" && !isPlainObject3(obj);
}, "isError");
var readFile = /* @__PURE__ */ __name2(async (filePath) => {
  if (!filePath) {
    throw new Error("No file path provided to read data");
  }
  return promises.readFile(filePath, {
    encoding: "utf8"
  });
}, "readFile");
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
__name(cwd, "cwd");
__name2(cwd, "cwd");
var DRIVE_LETTER_START_REGEX = /^[A-Z]:\//i;
var DRIVE_LETTER_REGEX = /^[A-Z]:$/i;
var UNC_REGEX = /^[/\\]{2}/;
var ABSOLUTE_PATH_REGEX = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^~[/\\]|^[A-Z]:[/\\]/i;
var ROOT_FOLDER_REGEX = /^\/([A-Z]:)?$/i;
var FILE_EXTENSION_REGEX = /\.[0-9a-z]+$/i;
function slash(path2) {
  if (path2.startsWith("\\\\?\\")) {
    return path2;
  }
  return path2.replace(/\\/g, "/");
}
__name(slash, "slash");
__name2(slash, "slash");
function isAbsolutePath(path2) {
  return ABSOLUTE_PATH_REGEX.test(slash(path2));
}
__name(isAbsolutePath, "isAbsolutePath");
__name2(isAbsolutePath, "isAbsolutePath");
function isAbsolute(path2) {
  return isAbsolutePath(path2);
}
__name(isAbsolute, "isAbsolute");
__name2(isAbsolute, "isAbsolute");
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(DRIVE_LETTER_START_REGEX, (r) => r.toUpperCase());
}
__name(normalizeWindowsPath, "normalizeWindowsPath");
__name2(normalizeWindowsPath, "normalizeWindowsPath");
function correctPaths(path2) {
  if (!path2 || path2.length === 0) {
    return ".";
  }
  path2 = normalizeWindowsPath(path2);
  const isUNCPath = path2.match(UNC_REGEX);
  const isPathAbsolute = isAbsolute(path2);
  const trailingSeparator = path2[path2.length - 1] === "/";
  path2 = normalizeString(path2, !isPathAbsolute);
  if (path2.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path2 += "/";
  }
  if (DRIVE_LETTER_REGEX.test(path2)) {
    path2 += "/";
  }
  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path2}`;
    }
    return `//${path2}`;
  }
  return isPathAbsolute && !isAbsolute(path2) ? `/${path2}` : path2;
}
__name(correctPaths, "correctPaths");
__name2(correctPaths, "correctPaths");
function joinPaths(...segments) {
  let path2 = "";
  for (const seg of segments) {
    if (!seg) {
      continue;
    }
    if (path2.length > 0) {
      const pathTrailing = path2[path2.length - 1] === "/";
      const segLeading = seg[0] === "/";
      const both = pathTrailing && segLeading;
      if (both) {
        path2 += seg.slice(1);
      } else {
        path2 += pathTrailing || segLeading ? seg : `/${seg}`;
      }
    } else {
      path2 += seg;
    }
  }
  return correctPaths(path2);
}
__name(joinPaths, "joinPaths");
__name2(joinPaths, "joinPaths");
function normalizeString(path2, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path2.length; ++index) {
    if (index < path2.length) {
      char = path2[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path2.slice(lastSlash + 1, index)}`;
        } else {
          res = path2.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
__name(normalizeString, "normalizeString");
__name2(normalizeString, "normalizeString");
function normalizeWindowsPath2(input = "") {
  if (!input) {
    return input;
  }
  return slash(input).replace(DRIVE_LETTER_START_REGEX, (r) => r.toUpperCase());
}
__name(normalizeWindowsPath2, "normalizeWindowsPath2");
__name2(normalizeWindowsPath2, "normalizeWindowsPath");
function normalizeString2(path2, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path2.length; ++index) {
    if (index < path2.length) {
      char = path2[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path2.slice(lastSlash + 1, index)}`;
        } else {
          res = path2.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
__name(normalizeString2, "normalizeString2");
__name2(normalizeString2, "normalizeString");
var isNull3 = /* @__PURE__ */ __name2((value) => {
  try {
    return value === null;
  } catch {
    return false;
  }
}, "isNull");
var isEmpty = /* @__PURE__ */ __name2((value) => {
  try {
    return isUndefined3(value) || isNull3(value);
  } catch {
    return false;
  }
}, "isEmpty");
var isBufferExists = typeof Buffer !== "undefined";
isBufferExists ? Buffer.isBuffer.bind(Buffer) : (
  /**
     * Check if the provided value's type is `Buffer`
  
     * @param value - The value to type check
     * @returns An indicator specifying if the value provided is of type `Buffer`
     */
  /* @__PURE__ */ __name2(/* @__PURE__ */ __name(function isBuffer2(value) {
    return false;
  }, "isBuffer2"), "isBuffer")
);
((Obj) => {
  if (typeof globalThis === "object") {
    return globalThis;
  }
  Object.defineProperty(Obj, "typeDetectGlobalObject", {
    get() {
      return this;
    },
    configurable: true
  });
  return globalThis;
})(Object.prototype);
var isSet2 = /* @__PURE__ */ __name2((value) => {
  try {
    return !isEmpty(value);
  } catch {
    return false;
  }
}, "isSet");
var isSetString = /* @__PURE__ */ __name2((value) => {
  try {
    return isSet2(value) && isString2(value) && value.length > 0;
  } catch {
    return false;
  }
}, "isSetString");
function findFileName(filePath, options = {}) {
  const { requireExtension = false, withExtension = true } = options;
  const result = normalizeWindowsPath2(filePath)?.split(filePath?.includes("\\") ? "\\" : "/")?.pop() ?? "";
  if (requireExtension === true && !result.includes(".")) {
    return EMPTY_STRING;
  }
  if (withExtension === false && result.includes(".")) {
    return result.replace(`.${findFileExtension(result) ?? ""}`, "") || EMPTY_STRING;
  }
  return result;
}
__name(findFileName, "findFileName");
__name2(findFileName, "findFileName");
function findFilePath(filePath) {
  const normalizedPath = normalizeWindowsPath2(filePath);
  const result = normalizedPath.replace(findFileName(normalizedPath, {
    requireExtension: true
  }), "");
  return result === "/" ? result : result.replace(/\/$/, "");
}
__name(findFilePath, "findFilePath");
__name2(findFilePath, "findFilePath");
function findFileExtension(filePath) {
  if (filePath.endsWith(".") || filePath.endsWith("/")) {
    return void 0;
  }
  const match2 = FILE_EXTENSION_REGEX.exec(normalizeWindowsPath2(filePath));
  return match2 && match2.length > 0 && isSetString(match2[0]) ? match2[0].replace(".", "") : void 0;
}
__name(findFileExtension, "findFileExtension");
__name2(findFileExtension, "findFileExtension");
function resolve(...paths) {
  paths = paths.map((argument) => normalizeWindowsPath2(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = paths.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path2 = index >= 0 ? paths[index] : cwd();
    if (!path2 || path2.length === 0) {
      continue;
    }
    resolvedPath = `${path2}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path2);
  }
  resolvedPath = normalizeString2(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
}
__name(resolve, "resolve");
__name2(resolve, "resolve");
function relative(from, to) {
  const _from = resolve(from).replace(ROOT_FOLDER_REGEX, "$1").split("/");
  const _to = resolve(to).replace(ROOT_FOLDER_REGEX, "$1").split("/");
  if (_to[0][1] === ":" && _from[0][1] === ":" && _from[0] !== _to[0]) {
    return _to.join("/");
  }
  const _fromCopy = [
    ..._from
  ];
  for (const segment of _fromCopy) {
    if (_to[0] !== segment) {
      break;
    }
    _from.shift();
    _to.shift();
  }
  return [
    ..._from.map(() => ".."),
    ..._to
  ].join("/");
}
__name(relative, "relative");
__name2(relative, "relative");
function relativePath(from, to, withEndSlash = false) {
  return relative(withEndSlash !== true ? from.replace(/\/$/, "") : from, withEndSlash !== true ? to.replace(/\/$/, "") : to);
}
__name(relativePath, "relativePath");
__name2(relativePath, "relativePath");
async function readJsonFile(path2, options) {
  const content = await readFile(path2);
  if (options) {
    options.endsWithNewline = content.codePointAt(content.length - 1) === 10;
  }
  try {
    return StormJSON.parseJson(content, options);
  } catch (error) {
    if (isError2(error)) {
      error.message = error.message.replace("JSON", path2);
      throw error;
    }
    throw new Error(`Failed to parse JSON: ${path2}`);
  }
}
__name(readJsonFile, "readJsonFile");
__name2(readJsonFile, "readJsonFile");
var DEFAULT_OPTIONS = {
  dot: true
};
async function list(filesGlob, options) {
  return glob(isString2(filesGlob) ? filesGlob.includes("*") ? filesGlob : joinPaths(filesGlob, "**/*") : filesGlob.input ? joinPaths(filesGlob.input, filesGlob.glob) : filesGlob.glob, defu__default.default(isString2(filesGlob) ? {} : {
    dot: filesGlob.dot,
    ignore: filesGlob.ignore
  }, options ?? {}, DEFAULT_OPTIONS));
}
__name(list, "list");
__name2(list, "list");
async function listFiles(filesGlob, options) {
  const result = (await list(filesGlob, defu__default.default({
    withFileTypes: true
  }, options ?? {}))).filter((ret) => ret.isFile());
  if (!options?.withFileTypes) {
    return result.map((file) => file.fullpath());
  }
  return result;
}
__name(listFiles, "listFiles");
__name2(listFiles, "listFiles");
async function resolveOptions(options) {
  const tsconfigPath = options.tsconfigPath ? options.tsconfigPath.replace("{projectRoot}", options.projectRoot).replace("{workspaceRoot}", options.workspaceRoot) : void 0;
  const schemas = toArray(options.schemas ? options.schemas : joinPaths(options.projectRoot, "schemas/**/*.capnp")).filter(Boolean).map((schema) => schema.replace("{projectRoot}", options.projectRoot).replace("{workspaceRoot}", options.workspaceRoot));
  let resolvedTsconfig;
  if (options.tsconfig) {
    resolvedTsconfig = options.tsconfig;
  } else {
    if (!tsconfigPath || !existsSync(tsconfigPath)) {
      const errorMessage = tsconfigPath ? `\u2716 The specified TypeScript configuration file "${tsconfigPath}" does not exist. Please provide a valid path.` : "\u2716 The specified TypeScript configuration file does not exist. Please provide a valid path.";
      console$1.writeFatal(errorMessage, {
        logLevel: "all"
      });
      throw new Error(errorMessage);
    }
    const tsconfigFile = await readJsonFile(tsconfigPath);
    resolvedTsconfig = ts.parseJsonConfigFileContent(tsconfigFile, ts.sys, findFilePath(tsconfigPath));
    if (!resolvedTsconfig) {
      const errorMessage = `\u2716 The specified TypeScript configuration file "${tsconfigPath}" is invalid. Please provide a valid configuration.`;
      console$1.writeFatal(errorMessage, {
        logLevel: "all"
      });
      throw new Error(errorMessage);
    }
    resolvedTsconfig.options.configFilePath = tsconfigPath;
    resolvedTsconfig.options.noImplicitOverride = false;
    resolvedTsconfig.options.noUnusedLocals = false;
    resolvedTsconfig.options.noUnusedParameters = false;
  }
  const resolvedSchemas = [];
  for (const schema of schemas) {
    let formattedSchema = schema;
    if (!schema.endsWith(".capnp") && !schema.includes("*")) {
      formattedSchema = `${schema.replace(/\/$/g, "")}/*.capnp`;
    }
    resolvedSchemas.push(...await listFiles(formattedSchema));
  }
  if (resolvedSchemas.length === 0 || !resolvedSchemas[0]) {
    console$1.writeWarning(`\u2716 No Cap'n Proto schema files found in the specified source paths: ${schemas.join(", ")}. As a result, the Cap'n Proto compiler will not be able to generate any output files. Please ensure that the paths are correct and contain .capnp files.`, {
      logLevel: "all"
    });
    return null;
  }
  const output = options.output ? options.output.replace("{projectRoot}", options.projectRoot).replace("{workspaceRoot}", options.workspaceRoot) : joinPaths(options.projectRoot, relativePath(tsconfigPath ? findFilePath(tsconfigPath) : options.projectRoot, joinPaths(options.workspaceRoot, resolvedSchemas[0].endsWith(".capnp") ? findFilePath(resolvedSchemas[0]) : resolvedSchemas[0])));
  resolvedTsconfig.options.outDir = output;
  return {
    workspaceRoot: options.workspaceRoot,
    projectRoot: options.projectRoot,
    schemas: resolvedSchemas,
    output,
    js: options.js ?? false,
    ts: options.ts ?? (options.noTs !== void 0 ? !options.noTs : true),
    dts: options.dts ?? (options.noDts !== void 0 ? !options.noDts : true),
    tsconfig: resolvedTsconfig
  };
}
__name(resolveOptions, "resolveOptions");
__name2(resolveOptions, "resolveOptions");

// ../../node_modules/.pnpm/@stryke+capnp@0.12.2_magicast@0.3.5_nx@21.6.6_@swc-node+register@1.10.10_@swc+core@1.13_fd22771bb9e47ee907b716dcf2a1b1d9/node_modules/@stryke/capnp/dist/chunk-GI42NGKQ.js
var ListElementSize = /* @__PURE__ */ ((ListElementSize2) => {
  ListElementSize2[ListElementSize2["VOID"] = 0] = "VOID";
  ListElementSize2[ListElementSize2["BIT"] = 1] = "BIT";
  ListElementSize2[ListElementSize2["BYTE"] = 2] = "BYTE";
  ListElementSize2[ListElementSize2["BYTE_2"] = 3] = "BYTE_2";
  ListElementSize2[ListElementSize2["BYTE_4"] = 4] = "BYTE_4";
  ListElementSize2[ListElementSize2["BYTE_8"] = 5] = "BYTE_8";
  ListElementSize2[ListElementSize2["POINTER"] = 6] = "POINTER";
  ListElementSize2[ListElementSize2["COMPOSITE"] = 7] = "COMPOSITE";
  return ListElementSize2;
})(ListElementSize || {});
var tmpWord = new DataView(new ArrayBuffer(8));
new Uint16Array(tmpWord.buffer)[0] = 258;
var DEFAULT_BUFFER_SIZE = 4096;
var DEFAULT_TRAVERSE_LIMIT = 64 << 20;
var LIST_SIZE_MASK = 7;
var MAX_BUFFER_DUMP_BYTES = 8192;
var MAX_INT32 = 2147483647;
var MAX_UINT32 = 4294967295;
var MIN_SINGLE_SEGMENT_GROWTH = 4096;
var NATIVE_LITTLE_ENDIAN = tmpWord.getUint8(0) === 2;
var PACK_SPAN_THRESHOLD = 2;
var POINTER_DOUBLE_FAR_MASK = 4;
var POINTER_TYPE_MASK = 3;
var MAX_DEPTH = MAX_INT32;
var MAX_SEGMENT_LENGTH = MAX_UINT32;
var INVARIANT_UNREACHABLE_CODE = "CAPNP-TS000 Unreachable code detected.";
function assertNever(n) {
  throw new Error(INVARIANT_UNREACHABLE_CODE + ` (never block hit with: ${n})`);
}
__name(assertNever, "assertNever");
__name2(assertNever, "assertNever");
var MSG_INVALID_FRAME_HEADER = "CAPNP-TS001 Attempted to parse an invalid message frame header; are you sure this is a Cap'n Proto message?";
var MSG_PACK_NOT_WORD_ALIGNED = "CAPNP-TS003 Attempted to pack a message that was not word-aligned.";
var MSG_SEGMENT_OUT_OF_BOUNDS = "CAPNP-TS004 Segment ID %X is out of bounds for message %s.";
var MSG_SEGMENT_TOO_SMALL = "CAPNP-TS005 First segment must have at least enough room to hold the root pointer (8 bytes).";
var NOT_IMPLEMENTED = "CAPNP-TS006 %s is not implemented.";
var PTR_ADOPT_WRONG_MESSAGE = "CAPNP-TS008 Attempted to adopt %s into a pointer in a different message %s.";
var PTR_ALREADY_ADOPTED = "CAPNP-TS009 Attempted to adopt %s more than once.";
var PTR_COMPOSITE_SIZE_UNDEFINED = "CAPNP-TS010 Attempted to set a composite list without providing a composite element size.";
var PTR_DEPTH_LIMIT_EXCEEDED = "CAPNP-TS011 Nesting depth limit exceeded for %s.";
var PTR_INIT_COMPOSITE_STRUCT = "CAPNP-TS013 Attempted to initialize a struct member from a composite list (%s).";
var PTR_INVALID_FAR_TARGET = "CAPNP-TS015 Target of a far pointer (%s) is another far pointer.";
var PTR_INVALID_LIST_SIZE = "CAPNP-TS016 Invalid list element size: %x.";
var PTR_INVALID_POINTER_TYPE = "CAPNP-TS017 Invalid pointer type: %x.";
var PTR_INVALID_UNION_ACCESS = "CAPNP-TS018 Attempted to access getter on %s for union field %s that is not currently set (wanted: %d, found: %d).";
var PTR_OFFSET_OUT_OF_BOUNDS = "CAPNP-TS019 Pointer offset %a is out of bounds for underlying buffer.";
var PTR_STRUCT_DATA_OUT_OF_BOUNDS = "CAPNP-TS020 Attempted to access out-of-bounds struct data (struct: %s, %d bytes at %a, data words: %d).";
var PTR_STRUCT_POINTER_OUT_OF_BOUNDS = "CAPNP-TS021 Attempted to access out-of-bounds struct pointer (%s, index: %d, length: %d).";
var PTR_TRAVERSAL_LIMIT_EXCEEDED = "CAPNP-TS022 Traversal limit exceeded! Slow down! %s";
var PTR_WRONG_LIST_TYPE = "CAPNP-TS023 Cannot convert %s to a %s list.";
var PTR_WRONG_POINTER_TYPE = "CAPNP-TS024 Attempted to convert pointer %s to a %s type.";
var SEG_GET_NON_ZERO_SINGLE = "CAPNP-TS035 Attempted to get a segment other than 0 (%d) from a single segment arena.";
var SEG_ID_OUT_OF_BOUNDS = "CAPNP-TS036 Attempted to get an out-of-bounds segment (%d).";
var SEG_NOT_WORD_ALIGNED = "CAPNP-TS037 Segment buffer length %d is not a multiple of 8.";
var SEG_REPLACEMENT_BUFFER_TOO_SMALL = "CAPNP-TS038 Attempted to replace a segment buffer with one that is smaller than the allocated space.";
var SEG_SIZE_OVERFLOW = `CAPNP-TS039 Requested size %x exceeds maximum value (${MAX_SEGMENT_LENGTH}).`;
var TYPE_COMPOSITE_SIZE_UNDEFINED = "CAPNP-TS040 Must provide a composite element size for composite list pointers.";
var LIST_NO_MUTABLE = "CAPNP-TS045: Cannot call mutative methods on an immutable list.";
var LIST_NO_SEARCH = "CAPNP-TS046: Search is not supported for list.";
var RPC_NULL_CLIENT = "CAPNP-TS100 Call on null client.";
var RPC_CALL_QUEUE_FULL = "CAPNP-TS101 Promised answer call queue full.";
var RPC_QUEUE_CALL_CANCEL = "CAPNP-TS102 Queue call canceled.";
var RPC_ZERO_REF = "CAPNP-TS105 Ref() called on zeroed refcount.";
var RPC_IMPORT_CLOSED = "CAPNP-TS106 Call on closed import.";
var RPC_METHOD_NOT_IMPLEMENTED = "CAPNP-TS107 Method not implemented.";
var RPC_BAD_TARGET = "CAPNP-TS109 Target not found.";
var RPC_RETURN_FOR_UNKNOWN_QUESTION = "CAPNP-TS111 Received return for unknown question (id=%s).";
var RPC_QUESTION_ID_REUSED = "CAPNP-TS112 Attempted to re-use question id (%s).";
var RPC_UNKNOWN_EXPORT_ID = "CAPNP-TS113 Capability table references unknown export ID (%s).";
var RPC_UNKNOWN_ANSWER_ID = "CAPNP-TS114 Capability table references unknown answer ID (%s).";
var RPC_UNKNOWN_CAP_DESCRIPTOR = "CAPNP-TS115 Unknown cap descriptor type (which: %s).";
var RPC_METHOD_ERROR = "CAPNP-TS116 RPC method failed at %s.%s(): %s";
var RPC_ERROR = "CAPNP-TS117 RPC call failed, reason: %s";
var RPC_NO_MAIN_INTERFACE = "CAPNP-TS118 Received bootstrap message without main interface set.";
var RPC_FINISH_UNKNOWN_ANSWER = "CAPNP-TS119 Received finish message for unknown answer ID (%s).";
var RPC_FULFILL_ALREADY_CALLED = "CAPNP-TS120 Fulfill called more than once for question (%s).";
function bufferToHex(buffer) {
  const a = new Uint8Array(buffer);
  const h = [];
  for (let i = 0; i < a.byteLength; i++) {
    h.push(pad(a[i].toString(16), 2));
  }
  return `[${h.join(" ")}]`;
}
__name(bufferToHex, "bufferToHex");
__name2(bufferToHex, "bufferToHex");
function dumpBuffer(buffer) {
  const b = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const byteLength = Math.min(b.byteLength, MAX_BUFFER_DUMP_BYTES);
  let r = format2("\n=== buffer[%d] ===", byteLength);
  for (let j = 0; j < byteLength; j += 16) {
    r += `
${pad(j.toString(16), 8)}: `;
    let s = "";
    let k;
    for (k = 0; k < 16 && j + k < b.byteLength; k++) {
      const v = b[j + k];
      r += `${pad(v.toString(16), 2)} `;
      s += v > 31 && v < 255 ? String.fromCharCode(v) : "\xB7";
      if (k === 7) {
        r += " ";
      }
    }
    r += `${" ".repeat((17 - k) * 3)}${s}`;
  }
  r += "\n";
  if (byteLength !== b.byteLength) {
    r += format2("=== (truncated %d bytes) ===\n", b.byteLength - byteLength);
  }
  return r;
}
__name(dumpBuffer, "dumpBuffer");
__name2(dumpBuffer, "dumpBuffer");
function format2(s, ...args) {
  const n = s.length;
  let arg;
  let argIndex = 0;
  let c;
  let escaped = false;
  let i = 0;
  let leadingZero = false;
  let precision;
  let result = "";
  function nextArg() {
    return args[argIndex++];
  }
  __name(nextArg, "nextArg");
  __name2(nextArg, "nextArg");
  function slurpNumber() {
    let digits = "";
    while (/\d/.test(s[i])) {
      digits += s[i++];
      c = s[i];
    }
    return digits.length > 0 ? Number.parseInt(digits, 10) : null;
  }
  __name(slurpNumber, "slurpNumber");
  __name2(slurpNumber, "slurpNumber");
  for (; i < n; ++i) {
    c = s[i];
    if (escaped) {
      escaped = false;
      if (c === ".") {
        leadingZero = false;
        c = s[++i];
      } else if (c === "0" && s[i + 1] === ".") {
        leadingZero = true;
        i += 2;
        c = s[i];
      } else {
        leadingZero = true;
      }
      precision = slurpNumber();
      switch (c) {
        case "a": {
          result += "0x" + pad(Number.parseInt(String(nextArg()), 10).toString(16), 8);
          break;
        }
        case "b": {
          result += Number.parseInt(String(nextArg()), 10).toString(2);
          break;
        }
        case "c": {
          arg = nextArg();
          result += typeof arg === "string" || arg instanceof String ? arg : String.fromCharCode(Number.parseInt(String(arg), 10));
          break;
        }
        case "d": {
          result += Number.parseInt(String(nextArg()), 10);
          break;
        }
        case "f": {
          const tmp = Number.parseFloat(String(nextArg())).toFixed(precision || 6);
          result += leadingZero ? tmp : tmp.replace(/^0/, "");
          break;
        }
        case "j": {
          result += JSON.stringify(nextArg());
          break;
        }
        case "o": {
          result += "0" + Number.parseInt(String(nextArg()), 10).toString(8);
          break;
        }
        case "s": {
          result += nextArg();
          break;
        }
        case "x": {
          result += "0x" + Number.parseInt(String(nextArg()), 10).toString(16);
          break;
        }
        case "X": {
          result += "0x" + Number.parseInt(String(nextArg()), 10).toString(16).toUpperCase();
          break;
        }
        default: {
          result += c;
          break;
        }
      }
    } else if (c === "%") {
      escaped = true;
    } else {
      result += c;
    }
  }
  return result;
}
__name(format2, "format");
__name2(format2, "format");
function pad(v, width, pad2 = "0") {
  return v.length >= width ? v : Array.from({
    length: width - v.length + 1
  }).join(pad2) + v;
}
__name(pad, "pad");
__name2(pad, "pad");
function padToWord$1(size) {
  return size + 7 & -8;
}
__name(padToWord$1, "padToWord$1");
__name2(padToWord$1, "padToWord$1");
var ObjectSize = class {
  static {
    __name(this, "ObjectSize");
  }
  static {
    __name2(this, "ObjectSize");
  }
  /**
  * Creates a new ObjectSize instance.
  *
  * @param dataByteLength - The number of bytes in the data section of the struct
  * @param pointerLength - The number of pointers in the pointer section of the struct
  */
  constructor(dataByteLength, pointerLength) {
    this.dataByteLength = dataByteLength;
    this.pointerLength = pointerLength;
  }
  toString() {
    return format2("ObjectSize_dw:%d,pc:%d", getDataWordLength(this), this.pointerLength);
  }
};
function getByteLength(o) {
  return o.dataByteLength + o.pointerLength * 8;
}
__name(getByteLength, "getByteLength");
__name2(getByteLength, "getByteLength");
function getDataWordLength(o) {
  return o.dataByteLength / 8;
}
__name(getDataWordLength, "getDataWordLength");
__name2(getDataWordLength, "getDataWordLength");
function getWordLength(o) {
  return o.dataByteLength / 8 + o.pointerLength;
}
__name(getWordLength, "getWordLength");
__name2(getWordLength, "getWordLength");
function padToWord(o) {
  return new ObjectSize(padToWord$1(o.dataByteLength), o.pointerLength);
}
__name(padToWord, "padToWord");
__name2(padToWord, "padToWord");
var Orphan = class {
  static {
    __name(this, "Orphan");
  }
  static {
    __name2(this, "Orphan");
  }
  /** If this member is not present then the orphan has already been adopted, or something went very wrong. */
  _capnp;
  byteOffset;
  segment;
  constructor(src) {
    const c = getContent(src);
    this.segment = c.segment;
    this.byteOffset = c.byteOffset;
    this._capnp = {};
    this._capnp.type = getTargetPointerType(src);
    switch (this._capnp.type) {
      case PointerType.STRUCT: {
        this._capnp.size = getTargetStructSize(src);
        break;
      }
      case PointerType.LIST: {
        this._capnp.length = getTargetListLength(src);
        this._capnp.elementSize = getTargetListElementSize(src);
        if (this._capnp.elementSize === ListElementSize.COMPOSITE) {
          this._capnp.size = getTargetCompositeListSize(src);
        }
        break;
      }
      case PointerType.OTHER: {
        this._capnp.capId = getCapabilityId(src);
        break;
      }
      default: {
        throw new Error(PTR_INVALID_POINTER_TYPE);
      }
    }
    erasePointer(src);
  }
  /**
  * Adopt (move) this orphan into the target pointer location. This will allocate far pointers in `dst` as needed.
  *
  * @param dst The destination pointer.
  */
  _moveTo(dst) {
    if (this._capnp === void 0) {
      throw new Error(format2(PTR_ALREADY_ADOPTED, this));
    }
    if (this.segment.message !== dst.segment.message) {
      throw new Error(format2(PTR_ADOPT_WRONG_MESSAGE, this, dst));
    }
    erase(dst);
    const res = initPointer(this.segment, this.byteOffset, dst);
    switch (this._capnp.type) {
      case PointerType.STRUCT: {
        setStructPointer(res.offsetWords, this._capnp.size, res.pointer);
        break;
      }
      case PointerType.LIST: {
        let { offsetWords } = res;
        if (this._capnp.elementSize === ListElementSize.COMPOSITE) {
          offsetWords--;
        }
        setListPointer(offsetWords, this._capnp.elementSize, this._capnp.length, res.pointer, this._capnp.size);
        break;
      }
      case PointerType.OTHER: {
        setInterfacePointer(this._capnp.capId, res.pointer);
        break;
      }
      /* istanbul ignore next */
      default: {
        throw new Error(PTR_INVALID_POINTER_TYPE);
      }
    }
    this._capnp = void 0;
  }
  dispose() {
    if (this._capnp === void 0) {
      return;
    }
    switch (this._capnp.type) {
      case PointerType.STRUCT: {
        this.segment.fillZeroWords(this.byteOffset, getWordLength(this._capnp.size));
        break;
      }
      case PointerType.LIST: {
        const byteLength = getListByteLength(this._capnp.elementSize, this._capnp.length, this._capnp.size);
        this.segment.fillZeroWords(this.byteOffset, byteLength);
        break;
      }
    }
    this._capnp = void 0;
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return format2("Orphan_%d@%a,type:%s", this.segment.id, this.byteOffset, this._capnp && this._capnp.type);
  }
};
function adopt(src, p) {
  src._moveTo(p);
}
__name(adopt, "adopt");
__name2(adopt, "adopt");
function disown(p) {
  return new Orphan(p);
}
__name(disown, "disown");
__name2(disown, "disown");
function dump(p) {
  return bufferToHex(p.segment.buffer.slice(p.byteOffset, p.byteOffset + 8));
}
__name(dump, "dump");
__name2(dump, "dump");
function getListByteLength(elementSize, length, compositeSize) {
  switch (elementSize) {
    case ListElementSize.BIT: {
      return padToWord$1(length + 7 >>> 3);
    }
    case ListElementSize.BYTE:
    case ListElementSize.BYTE_2:
    case ListElementSize.BYTE_4:
    case ListElementSize.BYTE_8:
    case ListElementSize.POINTER:
    case ListElementSize.VOID: {
      return padToWord$1(getListElementByteLength(elementSize) * length);
    }
    /* istanbul ignore next */
    case ListElementSize.COMPOSITE: {
      if (compositeSize === void 0) {
        throw new Error(format2(PTR_INVALID_LIST_SIZE, Number.NaN));
      }
      return length * padToWord$1(getByteLength(compositeSize));
    }
    /* istanbul ignore next */
    default: {
      throw new Error(PTR_INVALID_LIST_SIZE);
    }
  }
}
__name(getListByteLength, "getListByteLength");
__name2(getListByteLength, "getListByteLength");
function getListElementByteLength(elementSize) {
  switch (elementSize) {
    /* istanbul ignore next */
    case ListElementSize.BIT: {
      return Number.NaN;
    }
    case ListElementSize.BYTE: {
      return 1;
    }
    case ListElementSize.BYTE_2: {
      return 2;
    }
    case ListElementSize.BYTE_4: {
      return 4;
    }
    case ListElementSize.BYTE_8:
    case ListElementSize.POINTER: {
      return 8;
    }
    /* istanbul ignore next */
    case ListElementSize.COMPOSITE: {
      return Number.NaN;
    }
    /* istanbul ignore next */
    case ListElementSize.VOID: {
      return 0;
    }
    /* istanbul ignore next */
    default: {
      throw new Error(format2(PTR_INVALID_LIST_SIZE, elementSize));
    }
  }
}
__name(getListElementByteLength, "getListElementByteLength");
__name2(getListElementByteLength, "getListElementByteLength");
function add(offset, p) {
  return new Pointer(p.segment, p.byteOffset + offset, p._capnp.depthLimit);
}
__name(add, "add");
__name2(add, "add");
function copyFrom(src, p) {
  if (p.segment === src.segment && p.byteOffset === src.byteOffset) {
    return;
  }
  erase(p);
  if (isNull4(src)) return;
  switch (getTargetPointerType(src)) {
    case PointerType.STRUCT: {
      copyFromStruct(src, p);
      break;
    }
    case PointerType.LIST: {
      copyFromList(src, p);
      break;
    }
    case PointerType.OTHER: {
      copyFromInterface(src, p);
      break;
    }
    /* istanbul ignore next */
    default: {
      throw new Error(format2(PTR_INVALID_POINTER_TYPE, getTargetPointerType(p)));
    }
  }
}
__name(copyFrom, "copyFrom");
__name2(copyFrom, "copyFrom");
function erase(p) {
  if (isNull4(p)) return;
  let c;
  switch (getTargetPointerType(p)) {
    case PointerType.STRUCT: {
      const size = getTargetStructSize(p);
      c = getContent(p);
      c.segment.fillZeroWords(c.byteOffset, size.dataByteLength / 8);
      for (let i = 0; i < size.pointerLength; i++) {
        erase(add(i * 8, c));
      }
      break;
    }
    case PointerType.LIST: {
      const elementSize = getTargetListElementSize(p);
      const length = getTargetListLength(p);
      let contentWords = padToWord$1(length * getListElementByteLength(elementSize));
      c = getContent(p);
      if (elementSize === ListElementSize.POINTER) {
        for (let i = 0; i < length; i++) {
          erase(new Pointer(c.segment, c.byteOffset + i * 8, p._capnp.depthLimit - 1));
        }
        break;
      } else if (elementSize === ListElementSize.COMPOSITE) {
        const tag = add(-8, c);
        const compositeSize = getStructSize(tag);
        const compositeByteLength = getByteLength(compositeSize);
        contentWords = getOffsetWords(tag);
        c.segment.setWordZero(c.byteOffset - 8);
        for (let i = 0; i < length; i++) {
          for (let j = 0; j < compositeSize.pointerLength; j++) {
            erase(new Pointer(c.segment, c.byteOffset + i * compositeByteLength + j * 8, p._capnp.depthLimit - 1));
          }
        }
      }
      c.segment.fillZeroWords(c.byteOffset, contentWords);
      break;
    }
    case PointerType.OTHER: {
      break;
    }
    default: {
      throw new Error(format2(PTR_INVALID_POINTER_TYPE, getTargetPointerType(p)));
    }
  }
  erasePointer(p);
}
__name(erase, "erase");
__name2(erase, "erase");
function erasePointer(p) {
  if (getPointerType(p) === PointerType.FAR) {
    const landingPad = followFar(p);
    if (isDoubleFar(p)) {
      landingPad.segment.setWordZero(landingPad.byteOffset + 8);
    }
    landingPad.segment.setWordZero(landingPad.byteOffset);
  }
  p.segment.setWordZero(p.byteOffset);
}
__name(erasePointer, "erasePointer");
__name2(erasePointer, "erasePointer");
function followFar(p) {
  const targetSegment = p.segment.message.getSegment(p.segment.getUint32(p.byteOffset + 4));
  const targetWordOffset = p.segment.getUint32(p.byteOffset) >>> 3;
  return new Pointer(targetSegment, targetWordOffset * 8, p._capnp.depthLimit - 1);
}
__name(followFar, "followFar");
__name2(followFar, "followFar");
function followFars(p) {
  if (getPointerType(p) === PointerType.FAR) {
    const landingPad = followFar(p);
    if (isDoubleFar(p)) {
      landingPad.byteOffset += 8;
    }
    return landingPad;
  }
  return p;
}
__name(followFars, "followFars");
__name2(followFars, "followFars");
function getCapabilityId(p) {
  return p.segment.getUint32(p.byteOffset + 4);
}
__name(getCapabilityId, "getCapabilityId");
__name2(getCapabilityId, "getCapabilityId");
function isCompositeList(p) {
  return getTargetPointerType(p) === PointerType.LIST && getTargetListElementSize(p) === ListElementSize.COMPOSITE;
}
__name(isCompositeList, "isCompositeList");
__name2(isCompositeList, "isCompositeList");
function getContent(p, ignoreCompositeIndex) {
  let c;
  if (isDoubleFar(p)) {
    const landingPad = followFar(p);
    c = new Pointer(p.segment.message.getSegment(getFarSegmentId(landingPad)), getOffsetWords(landingPad) * 8);
  } else {
    const target = followFars(p);
    c = new Pointer(target.segment, target.byteOffset + 8 + getOffsetWords(target) * 8);
  }
  if (isCompositeList(p)) {
    c.byteOffset += 8;
  }
  if (!ignoreCompositeIndex && p._capnp.compositeIndex !== void 0) {
    c.byteOffset -= 8;
    c.byteOffset += 8 + p._capnp.compositeIndex * getByteLength(padToWord(getStructSize(c)));
  }
  return c;
}
__name(getContent, "getContent");
__name2(getContent, "getContent");
function getFarSegmentId(p) {
  return p.segment.getUint32(p.byteOffset + 4);
}
__name(getFarSegmentId, "getFarSegmentId");
__name2(getFarSegmentId, "getFarSegmentId");
function getListElementSize(p) {
  return p.segment.getUint32(p.byteOffset + 4) & LIST_SIZE_MASK;
}
__name(getListElementSize, "getListElementSize");
__name2(getListElementSize, "getListElementSize");
function getListLength(p) {
  return p.segment.getUint32(p.byteOffset + 4) >>> 3;
}
__name(getListLength, "getListLength");
__name2(getListLength, "getListLength");
function getOffsetWords(p) {
  const o = p.segment.getInt32(p.byteOffset);
  return o & 2 ? o >> 3 : o >> 2;
}
__name(getOffsetWords, "getOffsetWords");
__name2(getOffsetWords, "getOffsetWords");
function getPointerType(p) {
  return p.segment.getUint32(p.byteOffset) & POINTER_TYPE_MASK;
}
__name(getPointerType, "getPointerType");
__name2(getPointerType, "getPointerType");
function getStructDataWords(p) {
  return p.segment.getUint16(p.byteOffset + 4);
}
__name(getStructDataWords, "getStructDataWords");
__name2(getStructDataWords, "getStructDataWords");
function getStructPointerLength(p) {
  return p.segment.getUint16(p.byteOffset + 6);
}
__name(getStructPointerLength, "getStructPointerLength");
__name2(getStructPointerLength, "getStructPointerLength");
function getStructSize(p) {
  return new ObjectSize(getStructDataWords(p) * 8, getStructPointerLength(p));
}
__name(getStructSize, "getStructSize");
__name2(getStructSize, "getStructSize");
function getTargetCompositeListTag(p) {
  const c = getContent(p);
  c.byteOffset -= 8;
  return c;
}
__name(getTargetCompositeListTag, "getTargetCompositeListTag");
__name2(getTargetCompositeListTag, "getTargetCompositeListTag");
function getTargetCompositeListSize(p) {
  return getStructSize(getTargetCompositeListTag(p));
}
__name(getTargetCompositeListSize, "getTargetCompositeListSize");
__name2(getTargetCompositeListSize, "getTargetCompositeListSize");
function getTargetListElementSize(p) {
  return getListElementSize(followFars(p));
}
__name(getTargetListElementSize, "getTargetListElementSize");
__name2(getTargetListElementSize, "getTargetListElementSize");
function getTargetListLength(p) {
  const t = followFars(p);
  if (getListElementSize(t) === ListElementSize.COMPOSITE) {
    return getOffsetWords(getTargetCompositeListTag(p));
  }
  return getListLength(t);
}
__name(getTargetListLength, "getTargetListLength");
__name2(getTargetListLength, "getTargetListLength");
function getTargetPointerType(p) {
  const t = getPointerType(followFars(p));
  if (t === PointerType.FAR) {
    throw new Error(format2(PTR_INVALID_FAR_TARGET, p));
  }
  return t;
}
__name(getTargetPointerType, "getTargetPointerType");
__name2(getTargetPointerType, "getTargetPointerType");
function getTargetStructSize(p) {
  return getStructSize(followFars(p));
}
__name(getTargetStructSize, "getTargetStructSize");
__name2(getTargetStructSize, "getTargetStructSize");
function initPointer(contentSegment, contentOffset, p) {
  if (p.segment !== contentSegment) {
    if (!contentSegment.hasCapacity(8)) {
      const landingPad2 = p.segment.allocate(16);
      setFarPointer(true, landingPad2.byteOffset / 8, landingPad2.segment.id, p);
      setFarPointer(false, contentOffset / 8, contentSegment.id, landingPad2);
      landingPad2.byteOffset += 8;
      return new PointerAllocationResult(landingPad2, 0);
    }
    const landingPad = contentSegment.allocate(8);
    if (landingPad.segment.id !== contentSegment.id) {
      throw new Error(INVARIANT_UNREACHABLE_CODE);
    }
    setFarPointer(false, landingPad.byteOffset / 8, landingPad.segment.id, p);
    return new PointerAllocationResult(landingPad, (contentOffset - landingPad.byteOffset - 8) / 8);
  }
  return new PointerAllocationResult(p, (contentOffset - p.byteOffset - 8) / 8);
}
__name(initPointer, "initPointer");
__name2(initPointer, "initPointer");
function isDoubleFar(p) {
  return getPointerType(p) === PointerType.FAR && (p.segment.getUint32(p.byteOffset) & POINTER_DOUBLE_FAR_MASK) !== 0;
}
__name(isDoubleFar, "isDoubleFar");
__name2(isDoubleFar, "isDoubleFar");
function isNull4(p) {
  return p.segment.isWordZero(p.byteOffset);
}
__name(isNull4, "isNull");
__name2(isNull4, "isNull");
function relocateTo(dst, src) {
  const t = followFars(src);
  const lo = t.segment.getUint8(t.byteOffset) & 3;
  const hi = t.segment.getUint32(t.byteOffset + 4);
  erase(dst);
  const res = initPointer(t.segment, t.byteOffset + 8 + getOffsetWords(t) * 8, dst);
  res.pointer.segment.setUint32(res.pointer.byteOffset, lo | res.offsetWords << 2);
  res.pointer.segment.setUint32(res.pointer.byteOffset + 4, hi);
  erasePointer(src);
}
__name(relocateTo, "relocateTo");
__name2(relocateTo, "relocateTo");
function setFarPointer(doubleFar, offsetWords, segmentId, p) {
  const A = PointerType.FAR;
  const B = doubleFar ? 1 : 0;
  const C = offsetWords;
  const D = segmentId;
  p.segment.setUint32(p.byteOffset, A | B << 2 | C << 3);
  p.segment.setUint32(p.byteOffset + 4, D);
}
__name(setFarPointer, "setFarPointer");
__name2(setFarPointer, "setFarPointer");
function setInterfacePointer(capId, p) {
  p.segment.setUint32(p.byteOffset, PointerType.OTHER);
  p.segment.setUint32(p.byteOffset + 4, capId);
}
__name(setInterfacePointer, "setInterfacePointer");
__name2(setInterfacePointer, "setInterfacePointer");
function getInterfacePointer(p) {
  return p.segment.getUint32(p.byteOffset + 4);
}
__name(getInterfacePointer, "getInterfacePointer");
__name2(getInterfacePointer, "getInterfacePointer");
function setListPointer(offsetWords, size, length, p, compositeSize) {
  const A = PointerType.LIST;
  const B = offsetWords;
  const C = size;
  let D = length;
  if (size === ListElementSize.COMPOSITE) {
    if (compositeSize === void 0) {
      throw new TypeError(TYPE_COMPOSITE_SIZE_UNDEFINED);
    }
    D *= getWordLength(compositeSize);
  }
  p.segment.setUint32(p.byteOffset, A | B << 2);
  p.segment.setUint32(p.byteOffset + 4, C | D << 3);
}
__name(setListPointer, "setListPointer");
__name2(setListPointer, "setListPointer");
function setStructPointer(offsetWords, size, p) {
  const A = PointerType.STRUCT;
  const B = offsetWords;
  const C = getDataWordLength(size);
  const D = size.pointerLength;
  p.segment.setUint32(p.byteOffset, A | B << 2);
  p.segment.setUint16(p.byteOffset + 4, C);
  p.segment.setUint16(p.byteOffset + 6, D);
}
__name(setStructPointer, "setStructPointer");
__name2(setStructPointer, "setStructPointer");
function validate(pointerType, p, elementSize) {
  if (isNull4(p)) {
    return;
  }
  const t = followFars(p);
  const A = t.segment.getUint32(t.byteOffset) & POINTER_TYPE_MASK;
  if (A !== pointerType) {
    throw new Error(format2(PTR_WRONG_POINTER_TYPE, p, pointerType));
  }
  if (elementSize !== void 0) {
    const C = t.segment.getUint32(t.byteOffset + 4) & LIST_SIZE_MASK;
    if (C !== elementSize) {
      throw new Error(format2(PTR_WRONG_LIST_TYPE, p, ListElementSize[elementSize]));
    }
  }
}
__name(validate, "validate");
__name2(validate, "validate");
function copyFromInterface(src, dst) {
  const srcCapId = getInterfacePointer(src);
  if (srcCapId < 0) {
    return;
  }
  const srcCapTable = src.segment.message._capnp.capTable;
  if (!srcCapTable) {
    return;
  }
  const client = srcCapTable[srcCapId];
  if (!client) {
    return;
  }
  const dstCapId = dst.segment.message.addCap(client);
  setInterfacePointer(dstCapId, dst);
}
__name(copyFromInterface, "copyFromInterface");
__name2(copyFromInterface, "copyFromInterface");
function copyFromList(src, dst) {
  if (dst._capnp.depthLimit <= 0) {
    throw new Error(PTR_DEPTH_LIMIT_EXCEEDED);
  }
  const srcContent = getContent(src);
  const srcElementSize = getTargetListElementSize(src);
  const srcLength = getTargetListLength(src);
  let srcCompositeSize;
  let srcStructByteLength;
  let dstContent;
  if (srcElementSize === ListElementSize.POINTER) {
    dstContent = dst.segment.allocate(srcLength << 3);
    for (let i = 0; i < srcLength; i++) {
      const srcPtr = new Pointer(srcContent.segment, srcContent.byteOffset + (i << 3), src._capnp.depthLimit - 1);
      const dstPtr = new Pointer(dstContent.segment, dstContent.byteOffset + (i << 3), dst._capnp.depthLimit - 1);
      copyFrom(srcPtr, dstPtr);
    }
  } else if (srcElementSize === ListElementSize.COMPOSITE) {
    srcCompositeSize = padToWord(getTargetCompositeListSize(src));
    srcStructByteLength = getByteLength(srcCompositeSize);
    dstContent = dst.segment.allocate(getByteLength(srcCompositeSize) * srcLength + 8);
    dstContent.segment.copyWord(dstContent.byteOffset, srcContent.segment, srcContent.byteOffset - 8);
    if (srcCompositeSize.dataByteLength > 0) {
      const wordLength = getWordLength(srcCompositeSize) * srcLength;
      dstContent.segment.copyWords(dstContent.byteOffset + 8, srcContent.segment, srcContent.byteOffset, wordLength);
    }
    for (let i = 0; i < srcLength; i++) {
      for (let j = 0; j < srcCompositeSize.pointerLength; j++) {
        const offset = i * srcStructByteLength + srcCompositeSize.dataByteLength + (j << 3);
        const srcPtr = new Pointer(srcContent.segment, srcContent.byteOffset + offset, src._capnp.depthLimit - 1);
        const dstPtr = new Pointer(dstContent.segment, dstContent.byteOffset + offset + 8, dst._capnp.depthLimit - 1);
        copyFrom(srcPtr, dstPtr);
      }
    }
  } else {
    const byteLength = padToWord$1(srcElementSize === ListElementSize.BIT ? srcLength + 7 >>> 3 : getListElementByteLength(srcElementSize) * srcLength);
    const wordLength = byteLength >>> 3;
    dstContent = dst.segment.allocate(byteLength);
    dstContent.segment.copyWords(dstContent.byteOffset, srcContent.segment, srcContent.byteOffset, wordLength);
  }
  const res = initPointer(dstContent.segment, dstContent.byteOffset, dst);
  setListPointer(res.offsetWords, srcElementSize, srcLength, res.pointer, srcCompositeSize);
}
__name(copyFromList, "copyFromList");
__name2(copyFromList, "copyFromList");
function copyFromStruct(src, dst) {
  if (dst._capnp.depthLimit <= 0) {
    throw new Error(PTR_DEPTH_LIMIT_EXCEEDED);
  }
  const srcContent = getContent(src);
  const srcSize = getTargetStructSize(src);
  const srcDataWordLength = getDataWordLength(srcSize);
  const dstContent = dst.segment.allocate(getByteLength(srcSize));
  dstContent.segment.copyWords(dstContent.byteOffset, srcContent.segment, srcContent.byteOffset, srcDataWordLength);
  for (let i = 0; i < srcSize.pointerLength; i++) {
    const offset = srcSize.dataByteLength + i * 8;
    const srcPtr = new Pointer(srcContent.segment, srcContent.byteOffset + offset, src._capnp.depthLimit - 1);
    const dstPtr = new Pointer(dstContent.segment, dstContent.byteOffset + offset, dst._capnp.depthLimit - 1);
    copyFrom(srcPtr, dstPtr);
  }
  if (dst._capnp.compositeList) {
    return;
  }
  const res = initPointer(dstContent.segment, dstContent.byteOffset, dst);
  setStructPointer(res.offsetWords, srcSize, res.pointer);
}
__name(copyFromStruct, "copyFromStruct");
__name2(copyFromStruct, "copyFromStruct");
function trackPointerAllocation(message, p) {
  message._capnp.traversalLimit -= 8;
  if (message._capnp.traversalLimit <= 0) {
    throw new Error(format2(PTR_TRAVERSAL_LIMIT_EXCEEDED, p));
  }
}
__name(trackPointerAllocation, "trackPointerAllocation");
__name2(trackPointerAllocation, "trackPointerAllocation");
var PointerAllocationResult = class {
  static {
    __name(this, "PointerAllocationResult");
  }
  static {
    __name2(this, "PointerAllocationResult");
  }
  constructor(pointer, offsetWords) {
    this.pointer = pointer;
    this.offsetWords = offsetWords;
  }
};
var PointerType = /* @__PURE__ */ ((PointerType2) => {
  PointerType2[PointerType2["STRUCT"] = 0] = "STRUCT";
  PointerType2[PointerType2["LIST"] = 1] = "LIST";
  PointerType2[PointerType2["FAR"] = 2] = "FAR";
  PointerType2[PointerType2["OTHER"] = 3] = "OTHER";
  return PointerType2;
})(PointerType || {});
var Pointer = class {
  static {
    __name(this, "Pointer");
  }
  static {
    __name2(this, "Pointer");
  }
  static _capnp = {
    displayName: "Pointer"
  };
  _capnp;
  /** Offset, in bytes, from the start of the segment to the beginning of this pointer. */
  byteOffset;
  /**
  * The starting segment for this pointer's data. In the case of a far pointer, the actual content this pointer is
  * referencing will be in another segment within the same message.
  */
  segment;
  constructor(segment, byteOffset, depthLimit = MAX_DEPTH) {
    this._capnp = {
      compositeList: false,
      depthLimit
    };
    this.segment = segment;
    this.byteOffset = byteOffset;
    if (depthLimit < 1) {
      throw new Error(format2(PTR_DEPTH_LIMIT_EXCEEDED, this));
    }
    trackPointerAllocation(segment.message, this);
    if (byteOffset < 0 || byteOffset > segment.byteLength) {
      throw new Error(format2(PTR_OFFSET_OUT_OF_BOUNDS, byteOffset));
    }
  }
  [Symbol.toStringTag]() {
    return format2("Pointer_%d", this.segment.id);
  }
  toString() {
    return format2("->%d@%a%s", this.segment.id, this.byteOffset, dump(this));
  }
};
var List = class _List extends Pointer {
  static {
    __name(this, "_List");
  }
  static {
    __name2(this, "List");
  }
  static _capnp = {
    displayName: "List<Generic>",
    size: ListElementSize.VOID
  };
  constructor(segment, byteOffset, depthLimit) {
    super(segment, byteOffset, depthLimit);
    return new Proxy(this, _List.#proxyHandler);
  }
  static #proxyHandler = {
    get(target, prop, receiver) {
      const val = Reflect.get(target, prop, receiver);
      if (val !== void 0) {
        return val;
      }
      if (typeof prop === "string") {
        return target.get(+prop);
      }
    }
  };
  get length() {
    return getTargetListLength(this);
  }
  toArray() {
    const { length } = this;
    const res = Array.from({
      length
    });
    for (let i = 0; i < length; i++) {
      res[i] = this.at(i);
    }
    return res;
  }
  get(_index) {
    throw new TypeError("Cannot get from a generic list.");
  }
  set(_index, _value) {
    throw new TypeError("Cannot set on a generic list.");
  }
  at(index) {
    return this.get(index < 0 ? this.length + index : index);
  }
  concat(other) {
    const { length } = this;
    const otherLength = other.length;
    const res = Array.from({
      length: length + otherLength
    });
    for (let i = 0; i < length; i++) res[i] = this.at(i);
    for (let i = 0; i < otherLength; i++) res[i + length] = other.at(i);
    return res;
  }
  some(cb, _this) {
    for (let i = 0; i < this.length; i++) {
      if (cb.call(_this, this.at(i), i, this)) {
        return true;
      }
    }
    return false;
  }
  filter(cb, _this) {
    const res = [];
    for (let i = 0; i < this.length; i++) {
      const value = this.at(i);
      if (cb.call(_this, value, i, this)) {
        res.push(value);
      }
    }
    return res;
  }
  find(cb, _this) {
    for (let i = 0; i < this.length; i++) {
      const value = this.at(i);
      if (cb.call(_this, value, i, this)) {
        return value;
      }
    }
    return void 0;
  }
  findIndex(cb, _this) {
    for (let i = 0; i < this.length; i++) {
      const value = this.at(i);
      if (cb.call(_this, value, i, this)) {
        return i;
      }
    }
    return -1;
  }
  forEach(cb, _this) {
    for (let i = 0; i < this.length; i++) {
      cb.call(_this, this.at(i), i, this);
    }
  }
  map(cb, _this) {
    const { length } = this;
    const res = Array.from({
      length
    });
    for (let i = 0; i < length; i++) {
      res[i] = cb.call(_this, this.at(i), i, this);
    }
    return res;
  }
  flatMap(cb, _this) {
    const res = [];
    for (let i = 0; i < this.length; i++) {
      const r = cb.call(_this, this.at(i), i, this);
      res.push(...Array.isArray(r) ? r : [
        r
      ]);
    }
    return res;
  }
  every(cb, _this) {
    for (let i = 0; i < this.length; i++) {
      if (!cb.call(_this, this.at(i), i, this)) {
        return false;
      }
    }
    return true;
  }
  reduce(cb, initialValue) {
    let i = 0;
    let res;
    if (initialValue === void 0) {
      res = this.at(0);
      i++;
    } else {
      res = initialValue;
    }
    for (; i < this.length; i++) {
      res = cb(res, this.at(i), i, this);
    }
    return res;
  }
  reduceRight(cb, initialValue) {
    let i = this.length - 1;
    let res;
    if (initialValue === void 0) {
      res = this.at(i);
      i--;
    } else {
      res = initialValue;
    }
    for (; i >= 0; i--) {
      res = cb(res, this.at(i), i, this);
    }
    return res;
  }
  slice(start = 0, end) {
    const length = end ? Math.min(this.length, end) : this.length;
    const res = Array.from({
      length: length - start
    });
    for (let i = start; i < length; i++) {
      res[i] = this.at(i);
    }
    return res;
  }
  join(separator) {
    return this.toArray().join(separator);
  }
  toReversed() {
    return this.toArray().reverse();
  }
  toSorted(compareFn) {
    return this.toArray().sort(compareFn);
  }
  toSpliced(start, deleteCount, ...items) {
    return this.toArray().splice(start, deleteCount, ...items);
  }
  fill(value, start, end) {
    const { length } = this;
    const s = Math.max(start ?? 0, 0);
    const e = Math.min(end ?? length, length);
    for (let i = s; i < e; i++) {
      this.set(i, value);
    }
    return this;
  }
  copyWithin(target, start, end) {
    const { length } = this;
    const e = end ?? length;
    const s = start < 0 ? Math.max(length + start, 0) : start;
    const t = target < 0 ? Math.max(length + target, 0) : target;
    const len = Math.min(e - s, length - t);
    for (let i = 0; i < len; i++) {
      this.set(t + i, this.at(s + i));
    }
    return this;
  }
  keys() {
    return Array.from({
      length: this.length
    }, (_, i) => i)[Symbol.iterator]();
  }
  values() {
    return this.toArray().values();
  }
  entries() {
    return this.toArray().entries();
  }
  flat(depth) {
    return this.toArray().flat(depth);
  }
  with(index, value) {
    return this.toArray().with(index, value);
  }
  includes(_searchElement, _fromIndex) {
    throw new Error(LIST_NO_SEARCH);
  }
  findLast(_cb, _thisArg) {
    throw new Error(LIST_NO_SEARCH);
  }
  findLastIndex(_cb, _t) {
    throw new Error(LIST_NO_SEARCH);
  }
  indexOf(_searchElement, _fromIndex) {
    throw new Error(LIST_NO_SEARCH);
  }
  lastIndexOf(_searchElement, _fromIndex) {
    throw new Error(LIST_NO_SEARCH);
  }
  pop() {
    throw new Error(LIST_NO_MUTABLE);
  }
  push(..._items) {
    throw new Error(LIST_NO_MUTABLE);
  }
  reverse() {
    throw new Error(LIST_NO_MUTABLE);
  }
  shift() {
    throw new Error(LIST_NO_MUTABLE);
  }
  unshift(..._items) {
    throw new Error(LIST_NO_MUTABLE);
  }
  splice(_start, _deleteCount, ..._rest) {
    throw new Error(LIST_NO_MUTABLE);
  }
  sort(_fn) {
    throw new Error(LIST_NO_MUTABLE);
  }
  get [Symbol.unscopables]() {
    return Array.prototype[Symbol.unscopables];
  }
  [Symbol.iterator]() {
    return this.values();
  }
  toJSON() {
    return this.toArray();
  }
  toString() {
    return this.join(",");
  }
  toLocaleString(_locales, _options) {
    return this.toString();
  }
  [Symbol.toStringTag]() {
    return "[object Array]";
  }
  static [Symbol.toStringTag]() {
    return this._capnp.displayName;
  }
};
function initList$1(elementSize, length, list2, compositeSize) {
  let c;
  switch (elementSize) {
    case ListElementSize.BIT: {
      c = list2.segment.allocate(Math.ceil(length / 8));
      break;
    }
    case ListElementSize.BYTE:
    case ListElementSize.BYTE_2:
    case ListElementSize.BYTE_4:
    case ListElementSize.BYTE_8:
    case ListElementSize.POINTER: {
      c = list2.segment.allocate(length * getListElementByteLength(elementSize));
      break;
    }
    case ListElementSize.COMPOSITE: {
      if (compositeSize === void 0) {
        throw new Error(format2(PTR_COMPOSITE_SIZE_UNDEFINED));
      }
      compositeSize = padToWord(compositeSize);
      const byteLength = getByteLength(compositeSize) * length;
      c = list2.segment.allocate(byteLength + 8);
      setStructPointer(length, compositeSize, c);
      break;
    }
    case ListElementSize.VOID: {
      setListPointer(0, elementSize, length, list2);
      return;
    }
    default: {
      throw new Error(format2(PTR_INVALID_LIST_SIZE, elementSize));
    }
  }
  const res = initPointer(c.segment, c.byteOffset, list2);
  setListPointer(res.offsetWords, elementSize, length, res.pointer, compositeSize);
}
__name(initList$1, "initList$1");
__name2(initList$1, "initList$1");
var Data = class extends List {
  static {
    __name(this, "Data");
  }
  static {
    __name2(this, "Data");
  }
  static fromPointer(pointer) {
    validate(PointerType.LIST, pointer, ListElementSize.BYTE);
    return this._fromPointerUnchecked(pointer);
  }
  static _fromPointerUnchecked(pointer) {
    return new this(pointer.segment, pointer.byteOffset, pointer._capnp.depthLimit);
  }
  /**
  * Copy the contents of `src` into this Data pointer. If `src` is smaller than the length of this pointer then the
  * remaining bytes will be zeroed out. Extra bytes in `src` are ignored.
  *
  * @param src The source buffer.
  */
  // TODO: Would be nice to have a way to zero-copy a buffer by allocating a new segment into the message with that
  // buffer data.
  copyBuffer(src) {
    const c = getContent(this);
    const dstLength = this.length;
    const srcLength = src.byteLength;
    const i = src instanceof ArrayBuffer ? new Uint8Array(src) : new Uint8Array(src.buffer, src.byteOffset, Math.min(dstLength, srcLength));
    const o = new Uint8Array(c.segment.buffer, c.byteOffset, this.length);
    o.set(i);
    if (dstLength > srcLength) {
      o.fill(0, srcLength, dstLength);
    }
  }
  /**
  * Read a byte from the specified offset.
  *
  * @param byteOffset The byte offset to read.
  * @returns The byte value.
  */
  get(byteOffset) {
    const c = getContent(this);
    return c.segment.getUint8(c.byteOffset + byteOffset);
  }
  /**
  * Write a byte at the specified offset.
  *
  * @param byteOffset The byte offset to set.
  * @param value The byte value to set.
  */
  set(byteOffset, value) {
    const c = getContent(this);
    c.segment.setUint8(c.byteOffset + byteOffset, value);
  }
  /**
  * Creates a **copy** of the underlying buffer data and returns it as an ArrayBuffer.
  *
  * To obtain a reference to the underlying buffer instead, use `toUint8Array()` or `toDataView()`.
  *
  * @returns A copy of this data buffer.
  */
  toArrayBuffer() {
    const c = getContent(this);
    return c.segment.buffer.slice(c.byteOffset, c.byteOffset + this.length);
  }
  /**
  * Convert this Data pointer to a DataView representing the pointer's contents.
  *
  * WARNING: The DataView references memory from a message segment, so do not venture outside the bounds of the
  * DataView or else BAD THINGS.
  *
  * @returns A live reference to the underlying buffer.
  */
  toDataView() {
    const c = getContent(this);
    return new DataView(c.segment.buffer, c.byteOffset, this.length);
  }
  [Symbol.toStringTag]() {
    return `Data_${super.toString()}`;
  }
  /**
  * Convert this Data pointer to a Uint8Array representing the pointer's contents.
  *
  * WARNING: The Uint8Array references memory from a message segment, so do not venture outside the bounds of the
  * Uint8Array or else BAD THINGS.
  *
  * @returns A live reference to the underlying buffer.
  */
  toUint8Array() {
    const c = getContent(this);
    return new Uint8Array(c.segment.buffer, c.byteOffset, this.length);
  }
};
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder();
var Text = class extends List {
  static {
    __name(this, "Text");
  }
  static {
    __name2(this, "Text");
  }
  static fromPointer(pointer) {
    validate(PointerType.LIST, pointer, ListElementSize.BYTE);
    return textFromPointerUnchecked(pointer);
  }
  /**
  * Read a utf-8 encoded string value from this pointer.
  *
  * @param index The index at which to start reading; defaults to zero.
  * @returns The string value.
  */
  get(index = 0) {
    if (isNull4(this)) {
      return "";
    }
    const c = getContent(this);
    return textDecoder.decode(new Uint8Array(c.segment.buffer, c.byteOffset + index, this.length - index));
  }
  /**
  * Get the number of utf-8 encoded bytes in this text. This does **not** include the NUL byte.
  *
  * @returns The number of bytes allocated for the text.
  */
  get length() {
    return super.length - 1;
  }
  /**
  * Write a utf-8 encoded string value starting at the specified index.
  *
  * @param index The index at which to start copying the string. Note that if this is not zero the bytes
  * before `index` will be left as-is. All bytes after `index` will be overwritten.
  * @param value The string value to set.
  */
  set(index, value) {
    const src = textEncoder.encode(value);
    const dstLength = src.byteLength + index;
    let c;
    let original;
    if (!isNull4(this)) {
      c = getContent(this);
      const originalLength = Math.min(this.length, index);
      original = new Uint8Array(c.segment.buffer.slice(c.byteOffset, c.byteOffset + originalLength));
      erase(this);
    }
    initList$1(ListElementSize.BYTE, dstLength + 1, this);
    c = getContent(this);
    const dst = new Uint8Array(c.segment.buffer, c.byteOffset, dstLength);
    if (original) {
      dst.set(original);
    }
    dst.set(src, index);
  }
  toString() {
    return this.get();
  }
  toJSON() {
    return this.get();
  }
  [Symbol.toPrimitive]() {
    return this.get();
  }
  [Symbol.toStringTag]() {
    return `Text_${super.toString()}`;
  }
};
function textFromPointerUnchecked(pointer) {
  return new Text(pointer.segment, pointer.byteOffset, pointer._capnp.depthLimit);
}
__name(textFromPointerUnchecked, "textFromPointerUnchecked");
__name2(textFromPointerUnchecked, "textFromPointerUnchecked");
var Struct = class extends Pointer {
  static {
    __name(this, "Struct");
  }
  static {
    __name2(this, "Struct");
  }
  static _capnp = {
    displayName: "Struct"
  };
  /**
  * Create a new pointer to a struct.
  *
  * @param segment The segment the pointer resides in.
  * @param byteOffset The offset from the beginning of the segment to the beginning of the pointer data.
  * @param depthLimit The nesting depth limit for this object.
  * @param compositeIndex If set, then this pointer is actually a reference to a composite list
  * (`this._getPointerTargetType() === PointerType.LIST`), and this number is used as the index of the struct within
  * the list. It is not valid to call `initStruct()` on a composite struct – the struct contents are initialized when
  * the list pointer is initialized.
  */
  constructor(segment, byteOffset, depthLimit = MAX_DEPTH, compositeIndex) {
    super(segment, byteOffset, depthLimit);
    this._capnp.compositeIndex = compositeIndex;
    this._capnp.compositeList = compositeIndex !== void 0;
  }
  static [Symbol.toStringTag]() {
    return this._capnp.displayName;
  }
  [Symbol.toStringTag]() {
    return `Struct_${super.toString()}${this._capnp.compositeIndex === void 0 ? "" : `,ci:${this._capnp.compositeIndex}`} > ${getContent(this).toString()}`;
  }
};
var AnyStruct = class extends Struct {
  static {
    __name(this, "AnyStruct");
  }
  static {
    __name2(this, "AnyStruct");
  }
  static _capnp = {
    displayName: "AnyStruct",
    id: "0",
    size: new ObjectSize(0, 0)
  };
};
var FixedAnswer = class {
  static {
    __name(this, "FixedAnswer");
  }
  static {
    __name2(this, "FixedAnswer");
  }
  struct() {
    return Promise.resolve(this.structSync());
  }
};
var ErrorAnswer = class extends FixedAnswer {
  static {
    __name(this, "ErrorAnswer");
  }
  static {
    __name2(this, "ErrorAnswer");
  }
  constructor(err) {
    super();
    this.err = err;
  }
  structSync() {
    throw this.err;
  }
  pipelineCall(_transform, _call) {
    return this;
  }
  pipelineClose(_transform) {
    throw this.err;
  }
};
var ErrorClient = class {
  static {
    __name(this, "ErrorClient");
  }
  static {
    __name2(this, "ErrorClient");
  }
  constructor(err) {
    this.err = err;
  }
  call(_call) {
    return new ErrorAnswer(this.err);
  }
  close() {
    throw this.err;
  }
};
function clientOrNull(client) {
  return client ?? new ErrorClient(new Error(RPC_NULL_CLIENT));
}
__name(clientOrNull, "clientOrNull");
__name2(clientOrNull, "clientOrNull");
var TMP_WORD = new DataView(new ArrayBuffer(8));
function initStruct(size, s) {
  if (s._capnp.compositeIndex !== void 0) {
    throw new Error(format2(PTR_INIT_COMPOSITE_STRUCT, s));
  }
  erase(s);
  const c = s.segment.allocate(getByteLength(size));
  const res = initPointer(c.segment, c.byteOffset, s);
  setStructPointer(res.offsetWords, size, res.pointer);
}
__name(initStruct, "initStruct");
__name2(initStruct, "initStruct");
function initStructAt(index, StructClass, p) {
  const s = getPointerAs(index, StructClass, p);
  initStruct(StructClass._capnp.size, s);
  return s;
}
__name(initStructAt, "initStructAt");
__name2(initStructAt, "initStructAt");
function checkPointerBounds(index, s) {
  const { pointerLength } = getSize(s);
  if (index < 0 || index >= pointerLength) {
    throw new Error(format2(PTR_STRUCT_POINTER_OUT_OF_BOUNDS, s, index, pointerLength));
  }
}
__name(checkPointerBounds, "checkPointerBounds");
__name2(checkPointerBounds, "checkPointerBounds");
function getInterfaceClientOrNullAt(index, s) {
  return getInterfaceClientOrNull(getPointer(index, s));
}
__name(getInterfaceClientOrNullAt, "getInterfaceClientOrNullAt");
__name2(getInterfaceClientOrNullAt, "getInterfaceClientOrNullAt");
function getInterfaceClientOrNull(p) {
  let client = null;
  const capId = getInterfacePointer(p);
  const { capTable } = p.segment.message._capnp;
  if (capTable && capId >= 0 && capId < capTable.length) {
    client = capTable[capId];
  }
  return clientOrNull(client);
}
__name(getInterfaceClientOrNull, "getInterfaceClientOrNull");
__name2(getInterfaceClientOrNull, "getInterfaceClientOrNull");
function resize(dstSize, s) {
  const srcSize = getSize(s);
  const srcContent = getContent(s);
  const dstContent = s.segment.allocate(getByteLength(dstSize));
  dstContent.segment.copyWords(dstContent.byteOffset, srcContent.segment, srcContent.byteOffset, Math.min(getDataWordLength(srcSize), getDataWordLength(dstSize)));
  const res = initPointer(dstContent.segment, dstContent.byteOffset, s);
  setStructPointer(res.offsetWords, dstSize, res.pointer);
  for (let i = 0; i < Math.min(srcSize.pointerLength, dstSize.pointerLength); i++) {
    const srcPtr = new Pointer(srcContent.segment, srcContent.byteOffset + srcSize.dataByteLength + i * 8);
    if (isNull4(srcPtr)) {
      continue;
    }
    const srcPtrTarget = followFars(srcPtr);
    const srcPtrContent = getContent(srcPtr);
    const dstPtr = new Pointer(dstContent.segment, dstContent.byteOffset + dstSize.dataByteLength + i * 8);
    if (getTargetPointerType(srcPtr) === PointerType.LIST && getTargetListElementSize(srcPtr) === ListElementSize.COMPOSITE) {
      srcPtrContent.byteOffset -= 8;
    }
    const r = initPointer(srcPtrContent.segment, srcPtrContent.byteOffset, dstPtr);
    const a = srcPtrTarget.segment.getUint8(srcPtrTarget.byteOffset) & 3;
    const b = srcPtrTarget.segment.getUint32(srcPtrTarget.byteOffset + 4);
    r.pointer.segment.setUint32(r.pointer.byteOffset, a | r.offsetWords << 2);
    r.pointer.segment.setUint32(r.pointer.byteOffset + 4, b);
  }
  srcContent.segment.fillZeroWords(srcContent.byteOffset, getWordLength(srcSize));
}
__name(resize, "resize");
__name2(resize, "resize");
function getAs(StructClass, s) {
  return new StructClass(s.segment, s.byteOffset, s._capnp.depthLimit, s._capnp.compositeIndex);
}
__name(getAs, "getAs");
__name2(getAs, "getAs");
function getBit(bitOffset, s, defaultMask) {
  const byteOffset = Math.floor(bitOffset / 8);
  const bitMask = 1 << bitOffset % 8;
  checkDataBounds(byteOffset, 1, s);
  const ds = getDataSection(s);
  const v = ds.segment.getUint8(ds.byteOffset + byteOffset);
  if (defaultMask === void 0) {
    return (v & bitMask) !== 0;
  }
  const defaultValue = defaultMask.getUint8(0);
  return ((v ^ defaultValue) & bitMask) !== 0;
}
__name(getBit, "getBit");
__name2(getBit, "getBit");
function getData(index, s, defaultValue) {
  checkPointerBounds(index, s);
  const ps = getPointerSection(s);
  ps.byteOffset += index * 8;
  const l = new Data(ps.segment, ps.byteOffset, s._capnp.depthLimit - 1);
  if (isNull4(l)) {
    if (defaultValue) {
      copyFrom(defaultValue, l);
    } else {
      initList$1(ListElementSize.BYTE, 0, l);
    }
  }
  return l;
}
__name(getData, "getData");
__name2(getData, "getData");
function getDataSection(s) {
  return getContent(s);
}
__name(getDataSection, "getDataSection");
__name2(getDataSection, "getDataSection");
function getFloat32(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 4, s);
  const ds = getDataSection(s);
  if (defaultMask === void 0) {
    return ds.segment.getFloat32(ds.byteOffset + byteOffset);
  }
  const v = ds.segment.getUint32(ds.byteOffset + byteOffset) ^ defaultMask.getUint32(0, true);
  TMP_WORD.setUint32(0, v, NATIVE_LITTLE_ENDIAN);
  return TMP_WORD.getFloat32(0, NATIVE_LITTLE_ENDIAN);
}
__name(getFloat32, "getFloat32");
__name2(getFloat32, "getFloat32");
function getFloat64(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 8, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    const lo = ds.segment.getUint32(ds.byteOffset + byteOffset) ^ defaultMask.getUint32(0, true);
    const hi = ds.segment.getUint32(ds.byteOffset + byteOffset + 4) ^ defaultMask.getUint32(4, true);
    TMP_WORD.setUint32(0, lo, NATIVE_LITTLE_ENDIAN);
    TMP_WORD.setUint32(4, hi, NATIVE_LITTLE_ENDIAN);
    return TMP_WORD.getFloat64(0, NATIVE_LITTLE_ENDIAN);
  }
  return ds.segment.getFloat64(ds.byteOffset + byteOffset);
}
__name(getFloat64, "getFloat64");
__name2(getFloat64, "getFloat64");
function getInt16(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 2, s);
  const ds = getDataSection(s);
  if (defaultMask === void 0) {
    return ds.segment.getInt16(ds.byteOffset + byteOffset);
  }
  const v = ds.segment.getUint16(ds.byteOffset + byteOffset) ^ defaultMask.getUint16(0, true);
  TMP_WORD.setUint16(0, v, NATIVE_LITTLE_ENDIAN);
  return TMP_WORD.getInt16(0, NATIVE_LITTLE_ENDIAN);
}
__name(getInt16, "getInt16");
__name2(getInt16, "getInt16");
function getInt32(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 4, s);
  const ds = getDataSection(s);
  if (defaultMask === void 0) {
    return ds.segment.getInt32(ds.byteOffset + byteOffset);
  }
  const v = ds.segment.getUint32(ds.byteOffset + byteOffset) ^ defaultMask.getUint16(0, true);
  TMP_WORD.setUint32(0, v, NATIVE_LITTLE_ENDIAN);
  return TMP_WORD.getInt32(0, NATIVE_LITTLE_ENDIAN);
}
__name(getInt32, "getInt32");
__name2(getInt32, "getInt32");
function getInt64(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 8, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    const lo = ds.segment.getUint32(ds.byteOffset + byteOffset) ^ defaultMask.getUint32(0, true);
    const hi = ds.segment.getUint32(ds.byteOffset + byteOffset + 4) ^ defaultMask.getUint32(4, true);
    TMP_WORD.setUint32(NATIVE_LITTLE_ENDIAN ? 0 : 4, lo, NATIVE_LITTLE_ENDIAN);
    TMP_WORD.setUint32(NATIVE_LITTLE_ENDIAN ? 4 : 0, hi, NATIVE_LITTLE_ENDIAN);
    return TMP_WORD.getBigInt64(0, NATIVE_LITTLE_ENDIAN);
  }
  return ds.segment.getInt64(ds.byteOffset + byteOffset);
}
__name(getInt64, "getInt64");
__name2(getInt64, "getInt64");
function getInt8(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 1, s);
  const ds = getDataSection(s);
  if (defaultMask === void 0) {
    return ds.segment.getInt8(ds.byteOffset + byteOffset);
  }
  const v = ds.segment.getUint8(ds.byteOffset + byteOffset) ^ defaultMask.getUint8(0);
  TMP_WORD.setUint8(0, v);
  return TMP_WORD.getInt8(0);
}
__name(getInt8, "getInt8");
__name2(getInt8, "getInt8");
function getList(index, ListClass, s, defaultValue) {
  checkPointerBounds(index, s);
  const ps = getPointerSection(s);
  ps.byteOffset += index * 8;
  const l = new ListClass(ps.segment, ps.byteOffset, s._capnp.depthLimit - 1);
  if (isNull4(l)) {
    if (defaultValue) {
      copyFrom(defaultValue, l);
    } else {
      initList$1(ListClass._capnp.size, 0, l, ListClass._capnp.compositeSize);
    }
  } else if (ListClass._capnp.compositeSize !== void 0) {
    const srcSize = getTargetCompositeListSize(l);
    const dstSize = ListClass._capnp.compositeSize;
    if (dstSize.dataByteLength > srcSize.dataByteLength || dstSize.pointerLength > srcSize.pointerLength) {
      const srcContent = getContent(l);
      const srcLength = getTargetListLength(l);
      const dstContent = l.segment.allocate(getByteLength(dstSize) * srcLength + 8);
      const res = initPointer(dstContent.segment, dstContent.byteOffset, l);
      setListPointer(res.offsetWords, ListClass._capnp.size, srcLength, res.pointer, dstSize);
      setStructPointer(srcLength, dstSize, dstContent);
      dstContent.byteOffset += 8;
      for (let i = 0; i < srcLength; i++) {
        const srcElementOffset = srcContent.byteOffset + i * getByteLength(srcSize);
        const dstElementOffset = dstContent.byteOffset + i * getByteLength(dstSize);
        dstContent.segment.copyWords(dstElementOffset, srcContent.segment, srcElementOffset, getWordLength(srcSize));
        for (let j = 0; j < srcSize.pointerLength; j++) {
          const srcPtr = new Pointer(srcContent.segment, srcElementOffset + srcSize.dataByteLength + j * 8);
          const dstPtr = new Pointer(dstContent.segment, dstElementOffset + dstSize.dataByteLength + j * 8);
          const srcPtrTarget = followFars(srcPtr);
          const srcPtrContent = getContent(srcPtr);
          if (getTargetPointerType(srcPtr) === PointerType.LIST && getTargetListElementSize(srcPtr) === ListElementSize.COMPOSITE) {
            srcPtrContent.byteOffset -= 8;
          }
          const r = initPointer(srcPtrContent.segment, srcPtrContent.byteOffset, dstPtr);
          const a = srcPtrTarget.segment.getUint8(srcPtrTarget.byteOffset) & 3;
          const b = srcPtrTarget.segment.getUint32(srcPtrTarget.byteOffset + 4);
          r.pointer.segment.setUint32(r.pointer.byteOffset, a | r.offsetWords << 2);
          r.pointer.segment.setUint32(r.pointer.byteOffset + 4, b);
        }
      }
      srcContent.segment.fillZeroWords(srcContent.byteOffset, getWordLength(srcSize) * srcLength);
    }
  }
  return l;
}
__name(getList, "getList");
__name2(getList, "getList");
function getPointer(index, s) {
  checkPointerBounds(index, s);
  const ps = getPointerSection(s);
  ps.byteOffset += index * 8;
  return new Pointer(ps.segment, ps.byteOffset, s._capnp.depthLimit - 1);
}
__name(getPointer, "getPointer");
__name2(getPointer, "getPointer");
function getPointerAs(index, PointerClass, s) {
  checkPointerBounds(index, s);
  const ps = getPointerSection(s);
  ps.byteOffset += index * 8;
  return new PointerClass(ps.segment, ps.byteOffset, s._capnp.depthLimit - 1);
}
__name(getPointerAs, "getPointerAs");
__name2(getPointerAs, "getPointerAs");
function getPointerSection(s) {
  const ps = getContent(s);
  ps.byteOffset += padToWord$1(getSize(s).dataByteLength);
  return ps;
}
__name(getPointerSection, "getPointerSection");
__name2(getPointerSection, "getPointerSection");
function getSize(s) {
  if (s._capnp.compositeIndex !== void 0) {
    const c = getContent(s, true);
    c.byteOffset -= 8;
    return getStructSize(c);
  }
  return getTargetStructSize(s);
}
__name(getSize, "getSize");
__name2(getSize, "getSize");
function getStruct(index, StructClass, s, defaultValue) {
  const t = getPointerAs(index, StructClass, s);
  if (isNull4(t)) {
    if (defaultValue) {
      copyFrom(defaultValue, t);
    } else {
      initStruct(StructClass._capnp.size, t);
    }
  } else {
    validate(PointerType.STRUCT, t);
    const ts2 = getTargetStructSize(t);
    if (ts2.dataByteLength < StructClass._capnp.size.dataByteLength || ts2.pointerLength < StructClass._capnp.size.pointerLength) {
      resize(StructClass._capnp.size, t);
    }
  }
  return t;
}
__name(getStruct, "getStruct");
__name2(getStruct, "getStruct");
function getText(index, s, defaultValue) {
  const t = Text.fromPointer(getPointer(index, s));
  if (isNull4(t) && defaultValue) {
    t.set(0, defaultValue);
  }
  return t.get(0);
}
__name(getText, "getText");
__name2(getText, "getText");
function getUint16(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 2, s);
  const ds = getDataSection(s);
  if (defaultMask === void 0) {
    return ds.segment.getUint16(ds.byteOffset + byteOffset);
  }
  return ds.segment.getUint16(ds.byteOffset + byteOffset) ^ defaultMask.getUint16(0, true);
}
__name(getUint16, "getUint16");
__name2(getUint16, "getUint16");
function getUint32(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 4, s);
  const ds = getDataSection(s);
  if (defaultMask === void 0) {
    return ds.segment.getUint32(ds.byteOffset + byteOffset);
  }
  return ds.segment.getUint32(ds.byteOffset + byteOffset) ^ defaultMask.getUint32(0, true);
}
__name(getUint32, "getUint32");
__name2(getUint32, "getUint32");
function getUint64(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 8, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    const lo = ds.segment.getUint32(ds.byteOffset + byteOffset) ^ defaultMask.getUint32(0, true);
    const hi = ds.segment.getUint32(ds.byteOffset + byteOffset + 4) ^ defaultMask.getUint32(4, true);
    TMP_WORD.setUint32(NATIVE_LITTLE_ENDIAN ? 0 : 4, lo, NATIVE_LITTLE_ENDIAN);
    TMP_WORD.setUint32(NATIVE_LITTLE_ENDIAN ? 4 : 0, hi, NATIVE_LITTLE_ENDIAN);
    return TMP_WORD.getBigUint64(0, NATIVE_LITTLE_ENDIAN);
  }
  return ds.segment.getUint64(ds.byteOffset + byteOffset);
}
__name(getUint64, "getUint64");
__name2(getUint64, "getUint64");
function getUint8(byteOffset, s, defaultMask) {
  checkDataBounds(byteOffset, 1, s);
  const ds = getDataSection(s);
  if (defaultMask === void 0) {
    return ds.segment.getUint8(ds.byteOffset + byteOffset);
  }
  return ds.segment.getUint8(ds.byteOffset + byteOffset) ^ defaultMask.getUint8(0);
}
__name(getUint8, "getUint8");
__name2(getUint8, "getUint8");
function initData(index, length, s) {
  checkPointerBounds(index, s);
  const ps = getPointerSection(s);
  ps.byteOffset += index * 8;
  const l = new Data(ps.segment, ps.byteOffset, s._capnp.depthLimit - 1);
  erase(l);
  initList$1(ListElementSize.BYTE, length, l);
  return l;
}
__name(initData, "initData");
__name2(initData, "initData");
function initList(index, ListClass, length, s) {
  checkPointerBounds(index, s);
  const ps = getPointerSection(s);
  ps.byteOffset += index * 8;
  const l = new ListClass(ps.segment, ps.byteOffset, s._capnp.depthLimit - 1);
  erase(l);
  initList$1(ListClass._capnp.size, length, l, ListClass._capnp.compositeSize);
  return l;
}
__name(initList, "initList");
__name2(initList, "initList");
function setBit(bitOffset, value, s, defaultMask) {
  const byteOffset = Math.floor(bitOffset / 8);
  const bitMask = 1 << bitOffset % 8;
  checkDataBounds(byteOffset, 1, s);
  const ds = getDataSection(s);
  const b = ds.segment.getUint8(ds.byteOffset + byteOffset);
  if (defaultMask !== void 0) {
    value = (defaultMask.getUint8(0) & bitMask) === 0 ? value : !value;
  }
  ds.segment.setUint8(ds.byteOffset + byteOffset, value ? b | bitMask : b & ~bitMask);
}
__name(setBit, "setBit");
__name2(setBit, "setBit");
function setFloat32(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 4, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    TMP_WORD.setFloat32(0, value, NATIVE_LITTLE_ENDIAN);
    const v = TMP_WORD.getUint32(0, NATIVE_LITTLE_ENDIAN) ^ defaultMask.getUint32(0, true);
    ds.segment.setUint32(ds.byteOffset + byteOffset, v);
    return;
  }
  ds.segment.setFloat32(ds.byteOffset + byteOffset, value);
}
__name(setFloat32, "setFloat32");
__name2(setFloat32, "setFloat32");
function setFloat64(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 8, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    TMP_WORD.setFloat64(0, value, NATIVE_LITTLE_ENDIAN);
    const lo = TMP_WORD.getUint32(0, NATIVE_LITTLE_ENDIAN) ^ defaultMask.getUint32(0, true);
    const hi = TMP_WORD.getUint32(4, NATIVE_LITTLE_ENDIAN) ^ defaultMask.getUint32(4, true);
    ds.segment.setUint32(ds.byteOffset + byteOffset, lo);
    ds.segment.setUint32(ds.byteOffset + byteOffset + 4, hi);
    return;
  }
  ds.segment.setFloat64(ds.byteOffset + byteOffset, value);
}
__name(setFloat64, "setFloat64");
__name2(setFloat64, "setFloat64");
function setInt16(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 2, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    TMP_WORD.setInt16(0, value, NATIVE_LITTLE_ENDIAN);
    const v = TMP_WORD.getUint16(0, NATIVE_LITTLE_ENDIAN) ^ defaultMask.getUint16(0, true);
    ds.segment.setUint16(ds.byteOffset + byteOffset, v);
    return;
  }
  ds.segment.setInt16(ds.byteOffset + byteOffset, value);
}
__name(setInt16, "setInt16");
__name2(setInt16, "setInt16");
function setInt32(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 4, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    TMP_WORD.setInt32(0, value, NATIVE_LITTLE_ENDIAN);
    const v = TMP_WORD.getUint32(0, NATIVE_LITTLE_ENDIAN) ^ defaultMask.getUint32(0, true);
    ds.segment.setUint32(ds.byteOffset + byteOffset, v);
    return;
  }
  ds.segment.setInt32(ds.byteOffset + byteOffset, value);
}
__name(setInt32, "setInt32");
__name2(setInt32, "setInt32");
function setInt64(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 8, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    TMP_WORD.setBigInt64(0, value, NATIVE_LITTLE_ENDIAN);
    const lo = TMP_WORD.getUint32(NATIVE_LITTLE_ENDIAN ? 0 : 4, NATIVE_LITTLE_ENDIAN) ^ defaultMask.getUint32(0, true);
    const hi = TMP_WORD.getUint32(NATIVE_LITTLE_ENDIAN ? 4 : 0, NATIVE_LITTLE_ENDIAN) ^ defaultMask.getUint32(4, true);
    ds.segment.setUint32(ds.byteOffset + byteOffset, lo);
    ds.segment.setUint32(ds.byteOffset + byteOffset + 4, hi);
    return;
  }
  ds.segment.setInt64(ds.byteOffset + byteOffset, value);
}
__name(setInt64, "setInt64");
__name2(setInt64, "setInt64");
function setInt8(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 1, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    TMP_WORD.setInt8(0, value);
    const v = TMP_WORD.getUint8(0) ^ defaultMask.getUint8(0);
    ds.segment.setUint8(ds.byteOffset + byteOffset, v);
    return;
  }
  ds.segment.setInt8(ds.byteOffset + byteOffset, value);
}
__name(setInt8, "setInt8");
__name2(setInt8, "setInt8");
function setText(index, value, s) {
  Text.fromPointer(getPointer(index, s)).set(0, value);
}
__name(setText, "setText");
__name2(setText, "setText");
function setUint16(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 2, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    value ^= defaultMask.getUint16(0, true);
  }
  ds.segment.setUint16(ds.byteOffset + byteOffset, value);
}
__name(setUint16, "setUint16");
__name2(setUint16, "setUint16");
function setUint32(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 4, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    value ^= defaultMask.getUint32(0, true);
  }
  ds.segment.setUint32(ds.byteOffset + byteOffset, value);
}
__name(setUint32, "setUint32");
__name2(setUint32, "setUint32");
function setUint64(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 8, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    TMP_WORD.setBigUint64(0, value, NATIVE_LITTLE_ENDIAN);
    const lo = TMP_WORD.getUint32(NATIVE_LITTLE_ENDIAN ? 0 : 4, NATIVE_LITTLE_ENDIAN) ^ defaultMask.getUint32(0, true);
    const hi = TMP_WORD.getUint32(NATIVE_LITTLE_ENDIAN ? 4 : 0, NATIVE_LITTLE_ENDIAN) ^ defaultMask.getUint32(4, true);
    ds.segment.setUint32(ds.byteOffset + byteOffset, lo);
    ds.segment.setUint32(ds.byteOffset + byteOffset + 4, hi);
    return;
  }
  ds.segment.setUint64(ds.byteOffset + byteOffset, value);
}
__name(setUint64, "setUint64");
__name2(setUint64, "setUint64");
function setUint8(byteOffset, value, s, defaultMask) {
  checkDataBounds(byteOffset, 1, s);
  const ds = getDataSection(s);
  if (defaultMask !== void 0) {
    value ^= defaultMask.getUint8(0);
  }
  ds.segment.setUint8(ds.byteOffset + byteOffset, value);
}
__name(setUint8, "setUint8");
__name2(setUint8, "setUint8");
function testWhich(name, found, wanted, s) {
  if (found !== wanted) {
    throw new Error(format2(PTR_INVALID_UNION_ACCESS, s, name, found, wanted));
  }
}
__name(testWhich, "testWhich");
__name2(testWhich, "testWhich");
function checkDataBounds(byteOffset, byteLength, s) {
  const { dataByteLength } = getSize(s);
  if (byteOffset < 0 || byteLength < 0 || byteOffset + byteLength > dataByteLength) {
    throw new Error(format2(PTR_STRUCT_DATA_OUT_OF_BOUNDS, s, byteLength, byteOffset, dataByteLength));
  }
}
__name(checkDataBounds, "checkDataBounds");
__name2(checkDataBounds, "checkDataBounds");
function CompositeList(CompositeClass) {
  return class extends List {
    static _capnp = {
      compositeSize: CompositeClass._capnp.size,
      displayName: `List<${CompositeClass._capnp.displayName}>`,
      size: ListElementSize.COMPOSITE
    };
    get(index) {
      return new CompositeClass(this.segment, this.byteOffset, this._capnp.depthLimit - 1, index);
    }
    set(index, value) {
      copyFrom(value, this.get(index));
    }
    [Symbol.toStringTag]() {
      return `Composite_${super.toString()},cls:${CompositeClass.toString()}`;
    }
  };
}
__name(CompositeList, "CompositeList");
__name2(CompositeList, "CompositeList");
function _makePrimitiveMaskFn(byteLength, setter) {
  return (x) => {
    const dv = new DataView(new ArrayBuffer(byteLength));
    setter.call(dv, 0, x, true);
    return dv;
  };
}
__name(_makePrimitiveMaskFn, "_makePrimitiveMaskFn");
__name2(_makePrimitiveMaskFn, "_makePrimitiveMaskFn");
var getUint16Mask = _makePrimitiveMaskFn(2, DataView.prototype.setUint16);
var getUint8Mask = _makePrimitiveMaskFn(1, DataView.prototype.setUint8);
function getBitMask(value, bitOffset) {
  const dv = new DataView(new ArrayBuffer(1));
  if (!value) {
    return dv;
  }
  dv.setUint8(0, 1 << bitOffset % 8);
  return dv;
}
__name(getBitMask, "getBitMask");
__name2(getBitMask, "getBitMask");
var ArenaKind = /* @__PURE__ */ ((ArenaKind2) => {
  ArenaKind2[ArenaKind2["SINGLE_SEGMENT"] = 0] = "SINGLE_SEGMENT";
  ArenaKind2[ArenaKind2["MULTI_SEGMENT"] = 1] = "MULTI_SEGMENT";
  return ArenaKind2;
})(ArenaKind || {});
var ArenaAllocationResult = class {
  static {
    __name(this, "ArenaAllocationResult");
  }
  static {
    __name2(this, "ArenaAllocationResult");
  }
  /**
  * The newly allocated buffer. This buffer might be a copy of an existing segment's buffer with free space appended.
  */
  buffer;
  /**
  * The id of the newly-allocated segment.
  */
  id;
  constructor(id, buffer) {
    this.id = id;
    this.buffer = buffer;
  }
};
var MultiSegmentArena = class {
  static {
    __name(this, "MultiSegmentArena");
  }
  static {
    __name2(this, "MultiSegmentArena");
  }
  constructor(buffers = [
    new ArrayBuffer(DEFAULT_BUFFER_SIZE)
  ]) {
    this.buffers = buffers;
    let i = buffers.length;
    while (--i >= 0) {
      if ((buffers[i].byteLength & 7) !== 0) {
        throw new Error(format2(SEG_NOT_WORD_ALIGNED, buffers[i].byteLength));
      }
    }
  }
  static allocate = allocate$2;
  static getBuffer = getBuffer$2;
  static getNumSegments = getNumSegments$2;
  kind = ArenaKind.MULTI_SEGMENT;
  toString() {
    return format2("MultiSegmentArena_segments:%d", getNumSegments$2(this));
  }
};
function allocate$2(minSize, m) {
  const b = new ArrayBuffer(padToWord$1(Math.max(minSize, DEFAULT_BUFFER_SIZE)));
  m.buffers.push(b);
  return new ArenaAllocationResult(m.buffers.length - 1, b);
}
__name(allocate$2, "allocate$2");
__name2(allocate$2, "allocate$2");
function getBuffer$2(id, m) {
  if (id < 0 || id >= m.buffers.length) {
    throw new Error(format2(SEG_ID_OUT_OF_BOUNDS, id));
  }
  return m.buffers[id];
}
__name(getBuffer$2, "getBuffer$2");
__name2(getBuffer$2, "getBuffer$2");
function getNumSegments$2(m) {
  return m.buffers.length;
}
__name(getNumSegments$2, "getNumSegments$2");
__name2(getNumSegments$2, "getNumSegments$2");
var SingleSegmentArena = class {
  static {
    __name(this, "SingleSegmentArena");
  }
  static {
    __name2(this, "SingleSegmentArena");
  }
  static allocate = allocate$1;
  static getBuffer = getBuffer$1;
  static getNumSegments = getNumSegments$1;
  buffer;
  kind = ArenaKind.SINGLE_SEGMENT;
  constructor(buffer = new ArrayBuffer(DEFAULT_BUFFER_SIZE)) {
    if ((buffer.byteLength & 7) !== 0) {
      throw new Error(format2(SEG_NOT_WORD_ALIGNED, buffer.byteLength));
    }
    this.buffer = buffer;
  }
  toString() {
    return format2("SingleSegmentArena_len:%x", this.buffer.byteLength);
  }
};
function allocate$1(minSize, segments, s) {
  const srcBuffer = segments.length > 0 ? segments[0].buffer : s.buffer;
  minSize = minSize < MIN_SINGLE_SEGMENT_GROWTH ? MIN_SINGLE_SEGMENT_GROWTH : padToWord$1(minSize);
  s.buffer = new ArrayBuffer(srcBuffer.byteLength + minSize);
  new Float64Array(s.buffer).set(new Float64Array(srcBuffer));
  return new ArenaAllocationResult(0, s.buffer);
}
__name(allocate$1, "allocate$1");
__name2(allocate$1, "allocate$1");
function getBuffer$1(id, s) {
  if (id !== 0) throw new Error(format2(SEG_GET_NON_ZERO_SINGLE, id));
  return s.buffer;
}
__name(getBuffer$1, "getBuffer$1");
__name2(getBuffer$1, "getBuffer$1");
function getNumSegments$1() {
  return 1;
}
__name(getNumSegments$1, "getNumSegments$1");
__name2(getNumSegments$1, "getNumSegments$1");
var Arena = class {
  static {
    __name(this, "Arena");
  }
  static {
    __name2(this, "Arena");
  }
  static allocate = allocate;
  static copy = copy$1;
  static getBuffer = getBuffer;
  static getNumSegments = getNumSegments;
};
function allocate(minSize, segments, a) {
  switch (a.kind) {
    case ArenaKind.MULTI_SEGMENT: {
      return MultiSegmentArena.allocate(minSize, a);
    }
    case ArenaKind.SINGLE_SEGMENT: {
      return SingleSegmentArena.allocate(minSize, segments, a);
    }
    default: {
      return assertNever(a);
    }
  }
}
__name(allocate, "allocate");
__name2(allocate, "allocate");
function copy$1(a) {
  switch (a.kind) {
    case ArenaKind.MULTI_SEGMENT: {
      let i = a.buffers.length;
      const buffers = Array.from({
        length: i
      });
      while (--i >= 0) {
        buffers[i] = a.buffers[i].slice(0);
      }
      return new MultiSegmentArena(buffers);
    }
    case ArenaKind.SINGLE_SEGMENT: {
      return new SingleSegmentArena(a.buffer.slice(0));
    }
    default: {
      return assertNever(a);
    }
  }
}
__name(copy$1, "copy$1");
__name2(copy$1, "copy$1");
function getBuffer(id, a) {
  switch (a.kind) {
    case ArenaKind.MULTI_SEGMENT: {
      return MultiSegmentArena.getBuffer(id, a);
    }
    case ArenaKind.SINGLE_SEGMENT: {
      return SingleSegmentArena.getBuffer(id, a);
    }
    default: {
      return assertNever(a);
    }
  }
}
__name(getBuffer, "getBuffer");
__name2(getBuffer, "getBuffer");
function getNumSegments(a) {
  switch (a.kind) {
    case ArenaKind.MULTI_SEGMENT: {
      return MultiSegmentArena.getNumSegments(a);
    }
    case ArenaKind.SINGLE_SEGMENT: {
      return SingleSegmentArena.getNumSegments();
    }
    default: {
      return assertNever(a);
    }
  }
}
__name(getNumSegments, "getNumSegments");
__name2(getNumSegments, "getNumSegments");
function getHammingWeight(x) {
  let w = x - (x >> 1 & 1431655765);
  w = (w & 858993459) + (w >> 2 & 858993459);
  return (w + (w >> 4) & 252645135) * 16843009 >> 24;
}
__name(getHammingWeight, "getHammingWeight");
__name2(getHammingWeight, "getHammingWeight");
function getTagByte(a, b, c, d, e, f, g, h) {
  return (a === 0 ? 0 : 1) | (b === 0 ? 0 : 2) | (c === 0 ? 0 : 4) | (d === 0 ? 0 : 8) | (e === 0 ? 0 : 16) | (f === 0 ? 0 : 32) | (g === 0 ? 0 : 64) | (h === 0 ? 0 : 128);
}
__name(getTagByte, "getTagByte");
__name2(getTagByte, "getTagByte");
function getUnpackedByteLength(packed) {
  const p = new Uint8Array(packed);
  let wordCount = 0;
  let lastTag = 119;
  for (let i = 0; i < p.byteLength; ) {
    const tag = p[i];
    if (lastTag === 0) {
      wordCount += tag;
      i++;
      lastTag = 119;
    } else if (lastTag === 255) {
      wordCount += tag;
      i += tag * 8 + 1;
      lastTag = 119;
    } else {
      wordCount++;
      i += getHammingWeight(tag) + 1;
      lastTag = tag;
    }
  }
  return wordCount * 8;
}
__name(getUnpackedByteLength, "getUnpackedByteLength");
__name2(getUnpackedByteLength, "getUnpackedByteLength");
function getZeroByteCount(a, b, c, d, e, f, g, h) {
  return (a === 0 ? 1 : 0) + (b === 0 ? 1 : 0) + (c === 0 ? 1 : 0) + (d === 0 ? 1 : 0) + (e === 0 ? 1 : 0) + (f === 0 ? 1 : 0) + (g === 0 ? 1 : 0) + (h === 0 ? 1 : 0);
}
__name(getZeroByteCount, "getZeroByteCount");
__name2(getZeroByteCount, "getZeroByteCount");
function pack(unpacked, byteOffset = 0, byteLength) {
  if (unpacked.byteLength % 8 !== 0) {
    throw new Error(MSG_PACK_NOT_WORD_ALIGNED);
  }
  const src = new Uint8Array(unpacked, byteOffset, byteLength);
  const dst = [];
  let lastTag = 119;
  let spanWordCountOffset = 0;
  let rangeWordCount = 0;
  for (let srcByteOffset = 0; srcByteOffset < src.byteLength; srcByteOffset += 8) {
    const a = src[srcByteOffset];
    const b = src[srcByteOffset + 1];
    const c = src[srcByteOffset + 2];
    const d = src[srcByteOffset + 3];
    const e = src[srcByteOffset + 4];
    const f = src[srcByteOffset + 5];
    const g = src[srcByteOffset + 6];
    const h = src[srcByteOffset + 7];
    const tag = getTagByte(a, b, c, d, e, f, g, h);
    let skipWriteWord = true;
    switch (lastTag) {
      case 0: {
        if (tag !== 0 || rangeWordCount >= 255) {
          dst.push(rangeWordCount);
          rangeWordCount = 0;
          skipWriteWord = false;
        } else {
          rangeWordCount++;
        }
        break;
      }
      case 255: {
        const zeroCount = getZeroByteCount(a, b, c, d, e, f, g, h);
        if (zeroCount >= PACK_SPAN_THRESHOLD || rangeWordCount >= 255) {
          dst[spanWordCountOffset] = rangeWordCount;
          rangeWordCount = 0;
          skipWriteWord = false;
        } else {
          dst.push(a, b, c, d, e, f, g, h);
          rangeWordCount++;
        }
        break;
      }
      default: {
        skipWriteWord = false;
        break;
      }
    }
    if (skipWriteWord) {
      continue;
    }
    dst.push(tag);
    lastTag = tag;
    if (a !== 0) dst.push(a);
    if (b !== 0) dst.push(b);
    if (c !== 0) dst.push(c);
    if (d !== 0) dst.push(d);
    if (e !== 0) dst.push(e);
    if (f !== 0) dst.push(f);
    if (g !== 0) dst.push(g);
    if (h !== 0) dst.push(h);
    if (tag === 255) {
      spanWordCountOffset = dst.length;
      dst.push(0);
    }
  }
  if (lastTag === 0) {
    dst.push(rangeWordCount);
  } else if (lastTag === 255) {
    dst[spanWordCountOffset] = rangeWordCount;
  }
  return new Uint8Array(dst).buffer;
}
__name(pack, "pack");
__name2(pack, "pack");
function unpack(packed) {
  const src = new Uint8Array(packed);
  const dst = new Uint8Array(new ArrayBuffer(getUnpackedByteLength(packed)));
  let lastTag = 119;
  for (let srcByteOffset = 0, dstByteOffset = 0; srcByteOffset < src.byteLength; ) {
    const tag = src[srcByteOffset];
    if (lastTag === 0) {
      dstByteOffset += tag * 8;
      srcByteOffset++;
      lastTag = 119;
    } else if (lastTag === 255) {
      const spanByteLength = tag * 8;
      dst.set(src.subarray(srcByteOffset + 1, srcByteOffset + 1 + spanByteLength), dstByteOffset);
      dstByteOffset += spanByteLength;
      srcByteOffset += 1 + spanByteLength;
      lastTag = 119;
    } else {
      srcByteOffset++;
      for (let i = 1; i <= 128; i <<= 1) {
        if ((tag & i) !== 0) {
          dst[dstByteOffset] = src[srcByteOffset++];
        }
        dstByteOffset++;
      }
      lastTag = tag;
    }
  }
  return dst.buffer;
}
__name(unpack, "unpack");
__name2(unpack, "unpack");
var Segment = class {
  static {
    __name(this, "Segment");
  }
  static {
    __name2(this, "Segment");
  }
  constructor(id, message, buffer, byteLength = 0) {
    this.id = id;
    this.message = message;
    this.message = message;
    this.buffer = buffer;
    this._dv = new DataView(buffer);
    this.byteOffset = 0;
    this.byteLength = byteLength;
  }
  buffer;
  /** The number of bytes currently allocated in the segment. */
  byteLength;
  /**
  * This value should always be zero. It's only here to satisfy the DataView interface.
  *
  * In the future the Segment implementation (or a child class) may allow accessing the buffer from a nonzero offset,
  * but that adds a lot of extra arithmetic.
  */
  byteOffset;
  [Symbol.toStringTag] = "Segment";
  _dv;
  /**
  * Attempt to allocate the requested number of bytes in this segment. If this segment is full this method will return
  * a pointer to freshly allocated space in another segment from the same message.
  *
  * @param byteLength The number of bytes to allocate, will be rounded up to the nearest word.
  * @returns A pointer to the newly allocated space.
  */
  allocate(byteLength) {
    let segment = this;
    byteLength = padToWord$1(byteLength);
    if (byteLength > MAX_SEGMENT_LENGTH - 8) {
      throw new Error(format2(SEG_SIZE_OVERFLOW, byteLength));
    }
    if (!segment.hasCapacity(byteLength)) {
      segment = segment.message.allocateSegment(byteLength);
    }
    const byteOffset = segment.byteLength;
    segment.byteLength += byteLength;
    return new Pointer(segment, byteOffset);
  }
  /**
  * Quickly copy a word (8 bytes) from `srcSegment` into this one at the given offset.
  *
  * @param byteOffset The offset to write the word to.
  * @param srcSegment The segment to copy the word from.
  * @param srcByteOffset The offset from the start of `srcSegment` to copy from.
  */
  copyWord(byteOffset, srcSegment, srcByteOffset) {
    const value = srcSegment._dv.getFloat64(srcByteOffset, NATIVE_LITTLE_ENDIAN);
    this._dv.setFloat64(byteOffset, value, NATIVE_LITTLE_ENDIAN);
  }
  /**
  * Quickly copy words from `srcSegment` into this one.
  *
  * @param byteOffset The offset to start copying into.
  * @param srcSegment The segment to copy from.
  * @param srcByteOffset The start offset to copy from.
  * @param wordLength The number of words to copy.
  */
  copyWords(byteOffset, srcSegment, srcByteOffset, wordLength) {
    const dst = new Float64Array(this.buffer, byteOffset, wordLength);
    const src = new Float64Array(srcSegment.buffer, srcByteOffset, wordLength);
    dst.set(src);
  }
  /**
  * Quickly fill a number of words in the buffer with zeroes.
  *
  * @param byteOffset The first byte to set to zero.
  * @param wordLength The number of words (not bytes!) to zero out.
  */
  fillZeroWords(byteOffset, wordLength) {
    new Float64Array(this.buffer, byteOffset, wordLength).fill(0);
  }
  getBigInt64(byteOffset, littleEndian) {
    return this._dv.getBigInt64(byteOffset, littleEndian);
  }
  getBigUint64(byteOffset, littleEndian) {
    return this._dv.getBigUint64(byteOffset, littleEndian);
  }
  /**
  * Get the total number of bytes available in this segment (the size of its underlying buffer).
  *
  * @returns The total number of bytes this segment can hold.
  */
  getCapacity() {
    return this.buffer.byteLength;
  }
  /**
  * Read a float32 value out of this segment.
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getFloat32(byteOffset) {
    return this._dv.getFloat32(byteOffset, true);
  }
  /**
  * Read a float64 value out of this segment.
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getFloat64(byteOffset) {
    return this._dv.getFloat64(byteOffset, true);
  }
  /**
  * Read an int16 value out of this segment.
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getInt16(byteOffset) {
    return this._dv.getInt16(byteOffset, true);
  }
  /**
  * Read an int32 value out of this segment.
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getInt32(byteOffset) {
    return this._dv.getInt32(byteOffset, true);
  }
  /**
  * Read an int64 value out of this segment.
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getInt64(byteOffset) {
    return this._dv.getBigInt64(byteOffset, true);
  }
  /**
  * Read an int8 value out of this segment.
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getInt8(byteOffset) {
    return this._dv.getInt8(byteOffset);
  }
  /**
  * Read a uint16 value out of this segment.
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getUint16(byteOffset) {
    return this._dv.getUint16(byteOffset, true);
  }
  /**
  * Read a uint32 value out of this segment.
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getUint32(byteOffset) {
    return this._dv.getUint32(byteOffset, true);
  }
  /**
  * Read a uint64 value (as a bigint) out of this segment.
  * NOTE: this does not copy the memory region, so updates to the underlying buffer will affect the returned value!
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getUint64(byteOffset) {
    return this._dv.getBigUint64(byteOffset, true);
  }
  /**
  * Read a uint8 value out of this segment.
  *
  * @param byteOffset The offset in bytes to the value.
  * @returns The value.
  */
  getUint8(byteOffset) {
    return this._dv.getUint8(byteOffset);
  }
  hasCapacity(byteLength) {
    return this.buffer.byteLength - this.byteLength >= byteLength;
  }
  /**
  * Quickly check the word at the given offset to see if it is equal to zero.
  *
  * PERF_V8: Fastest way to do this is by reading the whole word as a `number` (float64) in the _native_ endian format
  * and see if it's zero.
  *
  * Benchmark: http://jsben.ch/#/Pjooc
  *
  * @param byteOffset The offset to the word.
  * @returns `true` if the word is zero.
  */
  isWordZero(byteOffset) {
    return this._dv.getFloat64(byteOffset, NATIVE_LITTLE_ENDIAN) === 0;
  }
  /**
  * Swap out this segment's underlying buffer with a new one. It's assumed that the new buffer has the same content but
  * more free space, otherwise all existing pointers to this segment will be hilariously broken.
  *
  * @param buffer The new buffer to use.
  */
  replaceBuffer(buffer) {
    if (this.buffer === buffer) {
      return;
    }
    if (buffer.byteLength < this.byteLength) {
      throw new Error(SEG_REPLACEMENT_BUFFER_TOO_SMALL);
    }
    this._dv = new DataView(buffer);
    this.buffer = buffer;
  }
  setBigInt64(byteOffset, value, littleEndian) {
    this._dv.setBigInt64(byteOffset, value, littleEndian);
  }
  /** WARNING: This function is not yet implemented.  */
  setBigUint64(byteOffset, value, littleEndian) {
    this._dv.setBigUint64(byteOffset, value, littleEndian);
  }
  /**
  * Write a float32 value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setFloat32(byteOffset, val) {
    this._dv.setFloat32(byteOffset, val, true);
  }
  /**
  * Write an float64 value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setFloat64(byteOffset, val) {
    this._dv.setFloat64(byteOffset, val, true);
  }
  /**
  * Write an int16 value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setInt16(byteOffset, val) {
    this._dv.setInt16(byteOffset, val, true);
  }
  /**
  * Write an int32 value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setInt32(byteOffset, val) {
    this._dv.setInt32(byteOffset, val, true);
  }
  /**
  * Write an int8 value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setInt8(byteOffset, val) {
    this._dv.setInt8(byteOffset, val);
  }
  /**
  * Write an int64 value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setInt64(byteOffset, val) {
    this._dv.setBigInt64(byteOffset, val, true);
  }
  /**
  * Write a uint16 value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setUint16(byteOffset, val) {
    this._dv.setUint16(byteOffset, val, true);
  }
  /**
  * Write a uint32 value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setUint32(byteOffset, val) {
    this._dv.setUint32(byteOffset, val, true);
  }
  /**
  * Write a uint64 value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setUint64(byteOffset, val) {
    this._dv.setBigUint64(byteOffset, val, true);
  }
  /**
  * Write a uint8 (byte) value to the specified offset.
  *
  * @param byteOffset The offset from the beginning of the buffer.
  * @param val The value to store.
  */
  setUint8(byteOffset, val) {
    this._dv.setUint8(byteOffset, val);
  }
  /**
  * Write a zero word (8 bytes) to the specified offset. This is slightly faster than calling `setUint64` or
  * `setFloat64` with a zero value.
  *
  * Benchmark: http://jsben.ch/#/dUdPI
  *
  * @param byteOffset The offset of the word to set to zero.
  */
  setWordZero(byteOffset) {
    this._dv.setFloat64(byteOffset, 0, NATIVE_LITTLE_ENDIAN);
  }
  toString() {
    return format2("Segment_id:%d,off:%a,len:%a,cap:%a", this.id, this.byteLength, this.byteOffset, this.buffer.byteLength);
  }
};
var Message = class {
  static {
    __name(this, "Message");
  }
  static {
    __name2(this, "Message");
  }
  static allocateSegment = allocateSegment;
  static dump = dump2;
  static getRoot = getRoot;
  static getSegment = getSegment;
  static initRoot = initRoot;
  static readRawPointer = readRawPointer;
  static toArrayBuffer = toArrayBuffer;
  static toPackedArrayBuffer = toPackedArrayBuffer;
  _capnp;
  /**
  * A Cap'n Proto message.
  *
  * SECURITY WARNING: In Node.js do not pass a Buffer's internal array buffer into this constructor. Pass the buffer
  * directly and everything will be fine. If not, your message will potentially be initialized with random memory
  * contents!
  *
  * The constructor method creates a new Message, optionally using a provided arena for segment allocation, or a buffer
  * to read from.
  *
  * @param src The source for the message.
  * A value of `undefined` will cause the message to initialize with a single segment arena only big enough for the
  * root pointer; it will expand as you go. This is a reasonable choice for most messages.
  *
  * Passing an arena will cause the message to use that arena for its segment allocation. Contents will be accepted
  * as-is.
  *
  * Passing an array buffer view (like `DataView`, `Uint8Array` or `Buffer`) will create a **copy** of the source
  * buffer; beware of the potential performance cost!
  *
  * @param packed Whether or not the message is packed. If `true` (the default), the message will be
  * unpacked.
  *
  * @param singleSegment If true, `src` will be treated as a message consisting of a single segment without
  * a framing header.
  *
  */
  constructor(src, packed = true, singleSegment = false) {
    this._capnp = initMessage(src, packed, singleSegment);
    if (src) {
      preallocateSegments(this);
    }
  }
  allocateSegment(byteLength) {
    return allocateSegment(byteLength, this);
  }
  /**
  * Copies the contents of this message into an identical message with its own ArrayBuffers.
  *
  * @returns A copy of this message.
  */
  copy() {
    return copy2(this);
  }
  /**
  * Create a pretty-printed string dump of this message; incredibly useful for debugging.
  *
  * WARNING: Do not call this method on large messages!
  *
  * @returns A big steaming pile of pretty hex digits.
  */
  dump() {
    return dump2(this);
  }
  /**
  * Get a struct pointer for the root of this message. This is primarily used when reading a message; it will not
  * overwrite existing data.
  *
  * @param RootStruct The struct type to use as the root.
  * @returns A struct representing the root of the message.
  */
  getRoot(RootStruct) {
    return getRoot(RootStruct, this);
  }
  /**
  * Get a segment by its id.
  *
  * This will lazily allocate the first segment if it doesn't already exist.
  *
  * @param id The segment id.
  * @returns The requested segment.
  */
  getSegment(id) {
    return getSegment(id, this);
  }
  /**
  * Initialize a new message using the provided struct type as the root.
  *
  * @param RootStruct The struct type to use as the root.
  * @returns An initialized struct pointing to the root of the message.
  */
  initRoot(RootStruct) {
    return initRoot(RootStruct, this);
  }
  /**
  * Set the root of the message to a copy of the given pointer. Used internally
  * to make copies of pointers for default values.
  *
  * @param src The source pointer to copy.
  */
  setRoot(src) {
    setRoot(src, this);
  }
  /**
  * Combine the contents of this message's segments into a single array buffer and prepend a stream framing header
  * containing information about the following segment data.
  *
  * @returns An ArrayBuffer with the contents of this message.
  */
  toArrayBuffer() {
    return toArrayBuffer(this);
  }
  /**
  * Like `toArrayBuffer()`, but also applies the packing algorithm to the output. This is typically what you want to
  * use if you're sending the message over a network link or other slow I/O interface where size matters.
  *
  * @returns A packed message.
  */
  toPackedArrayBuffer() {
    return toPackedArrayBuffer(this);
  }
  addCap(client) {
    if (!this._capnp.capTable) {
      this._capnp.capTable = [];
    }
    const id = this._capnp.capTable.length;
    this._capnp.capTable.push(client);
    return id;
  }
  toString() {
    return `Message_arena:${this._capnp.arena}`;
  }
};
function initMessage(src, packed = true, singleSegment = false) {
  if (src === void 0) {
    return {
      arena: new SingleSegmentArena(),
      segments: [],
      traversalLimit: DEFAULT_TRAVERSE_LIMIT
    };
  }
  if (isAnyArena(src)) {
    return {
      arena: src,
      segments: [],
      traversalLimit: DEFAULT_TRAVERSE_LIMIT
    };
  }
  let buf = src;
  if (isArrayBufferView2(buf)) {
    buf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }
  if (packed) {
    buf = unpack(buf);
  }
  if (singleSegment) {
    return {
      arena: new SingleSegmentArena(buf),
      segments: [],
      traversalLimit: DEFAULT_TRAVERSE_LIMIT
    };
  }
  return {
    arena: new MultiSegmentArena(getFramedSegments(buf)),
    segments: [],
    traversalLimit: DEFAULT_TRAVERSE_LIMIT
  };
}
__name(initMessage, "initMessage");
__name2(initMessage, "initMessage");
function getFramedSegments(message) {
  const dv = new DataView(message);
  const segmentCount = dv.getUint32(0, true) + 1;
  const segments = Array.from({
    length: segmentCount
  });
  let byteOffset = 4 + segmentCount * 4;
  byteOffset += byteOffset % 8;
  if (byteOffset + segmentCount * 4 > message.byteLength) {
    throw new Error(MSG_INVALID_FRAME_HEADER);
  }
  for (let i = 0; i < segmentCount; i++) {
    const byteLength = dv.getUint32(4 + i * 4, true) * 8;
    if (byteOffset + byteLength > message.byteLength) {
      throw new Error(MSG_INVALID_FRAME_HEADER);
    }
    segments[i] = message.slice(byteOffset, byteOffset + byteLength);
    byteOffset += byteLength;
  }
  return segments;
}
__name(getFramedSegments, "getFramedSegments");
__name2(getFramedSegments, "getFramedSegments");
function preallocateSegments(m) {
  const numSegments = Arena.getNumSegments(m._capnp.arena);
  m._capnp.segments = Array.from({
    length: numSegments
  });
  for (let i = 0; i < numSegments; i++) {
    if (i === 0 && Arena.getBuffer(i, m._capnp.arena).byteLength < 8) {
      throw new Error(MSG_SEGMENT_TOO_SMALL);
    }
    const buffer = Arena.getBuffer(i, m._capnp.arena);
    const segment = new Segment(i, m, buffer, buffer.byteLength);
    m._capnp.segments[i] = segment;
  }
}
__name(preallocateSegments, "preallocateSegments");
__name2(preallocateSegments, "preallocateSegments");
function isArrayBufferView2(src) {
  return src.byteOffset !== void 0;
}
__name(isArrayBufferView2, "isArrayBufferView");
__name2(isArrayBufferView2, "isArrayBufferView");
function isAnyArena(o) {
  return o.kind !== void 0;
}
__name(isAnyArena, "isAnyArena");
__name2(isAnyArena, "isAnyArena");
function allocateSegment(byteLength, m) {
  const res = Arena.allocate(byteLength, m._capnp.segments, m._capnp.arena);
  let s;
  if (res.id === m._capnp.segments.length) {
    s = new Segment(res.id, m, res.buffer);
    m._capnp.segments.push(s);
  } else if (res.id < 0 || res.id > m._capnp.segments.length) {
    throw new Error(format2(MSG_SEGMENT_OUT_OF_BOUNDS, res.id, m));
  } else {
    s = m._capnp.segments[res.id];
    s.replaceBuffer(res.buffer);
  }
  return s;
}
__name(allocateSegment, "allocateSegment");
__name2(allocateSegment, "allocateSegment");
function dump2(m) {
  let r = "";
  if (m._capnp.segments.length === 0) {
    return "================\nNo Segments\n================\n";
  }
  for (let i = 0; i < m._capnp.segments.length; i++) {
    r += `================
Segment #${i}
================
`;
    const { buffer, byteLength } = m._capnp.segments[i];
    const b = new Uint8Array(buffer, 0, byteLength);
    r += dumpBuffer(b);
  }
  return r;
}
__name(dump2, "dump2");
__name2(dump2, "dump");
function getRoot(RootStruct, m) {
  const root = new RootStruct(m.getSegment(0), 0);
  validate(PointerType.STRUCT, root);
  const ts2 = getTargetStructSize(root);
  if (ts2.dataByteLength < RootStruct._capnp.size.dataByteLength || ts2.pointerLength < RootStruct._capnp.size.pointerLength) {
    resize(RootStruct._capnp.size, root);
  }
  return root;
}
__name(getRoot, "getRoot");
__name2(getRoot, "getRoot");
function getSegment(id, m) {
  const segmentLength = m._capnp.segments.length;
  if (id === 0 && segmentLength === 0) {
    const arenaSegments = Arena.getNumSegments(m._capnp.arena);
    if (arenaSegments === 0) {
      allocateSegment(DEFAULT_BUFFER_SIZE, m);
    } else {
      m._capnp.segments[0] = new Segment(0, m, Arena.getBuffer(0, m._capnp.arena));
    }
    if (!m._capnp.segments[0].hasCapacity(8)) {
      throw new Error(MSG_SEGMENT_TOO_SMALL);
    }
    m._capnp.segments[0].allocate(8);
    return m._capnp.segments[0];
  }
  if (id < 0 || id >= segmentLength) {
    throw new Error(format2(MSG_SEGMENT_OUT_OF_BOUNDS, id, m));
  }
  return m._capnp.segments[id];
}
__name(getSegment, "getSegment");
__name2(getSegment, "getSegment");
function initRoot(RootStruct, m) {
  const root = new RootStruct(m.getSegment(0), 0);
  initStruct(RootStruct._capnp.size, root);
  return root;
}
__name(initRoot, "initRoot");
__name2(initRoot, "initRoot");
function readRawPointer(data) {
  return new Pointer(new Message(data).getSegment(0), 0);
}
__name(readRawPointer, "readRawPointer");
__name2(readRawPointer, "readRawPointer");
function setRoot(src, m) {
  copyFrom(src, new Pointer(m.getSegment(0), 0));
}
__name(setRoot, "setRoot");
__name2(setRoot, "setRoot");
function toArrayBuffer(m) {
  const streamFrame = getStreamFrame(m);
  if (m._capnp.segments.length === 0) {
    getSegment(0, m);
  }
  const { segments } = m._capnp;
  const totalLength = streamFrame.byteLength + segments.reduce((l, s) => l + padToWord$1(s.byteLength), 0);
  const out = new Uint8Array(new ArrayBuffer(totalLength));
  let o = streamFrame.byteLength;
  out.set(new Uint8Array(streamFrame));
  for (const s of segments) {
    const segmentLength = padToWord$1(s.byteLength);
    out.set(new Uint8Array(s.buffer, 0, segmentLength), o);
    o += segmentLength;
  }
  return out.buffer;
}
__name(toArrayBuffer, "toArrayBuffer");
__name2(toArrayBuffer, "toArrayBuffer");
function toPackedArrayBuffer(m) {
  const streamFrame = pack(getStreamFrame(m));
  if (m._capnp.segments.length === 0) {
    m.getSegment(0);
  }
  const segments = m._capnp.segments.map((s) => pack(s.buffer, 0, padToWord$1(s.byteLength)));
  const totalLength = streamFrame.byteLength + segments.reduce((l, s) => l + s.byteLength, 0);
  const out = new Uint8Array(new ArrayBuffer(totalLength));
  let o = streamFrame.byteLength;
  out.set(new Uint8Array(streamFrame));
  for (const s of segments) {
    out.set(new Uint8Array(s), o);
    o += s.byteLength;
  }
  return out.buffer;
}
__name(toPackedArrayBuffer, "toPackedArrayBuffer");
__name2(toPackedArrayBuffer, "toPackedArrayBuffer");
function getStreamFrame(m) {
  const { length } = m._capnp.segments;
  if (length === 0) {
    return new Float64Array(1).buffer;
  }
  const frameLength = 4 + length * 4 + (1 - length % 2) * 4;
  const out = new DataView(new ArrayBuffer(frameLength));
  out.setUint32(0, length - 1, true);
  for (const [i, s] of m._capnp.segments.entries()) {
    out.setUint32(i * 4 + 4, s.byteLength / 8, true);
  }
  return out.buffer;
}
__name(getStreamFrame, "getStreamFrame");
__name2(getStreamFrame, "getStreamFrame");
function copy2(m) {
  return new Message(Arena.copy(m._capnp.arena));
}
__name(copy2, "copy");
__name2(copy2, "copy");
BigInt("0xa93fc509624c72d9");
var Node_Parameter = class extends Struct {
  static {
    __name(this, "Node_Parameter");
  }
  static {
    __name2(this, "Node_Parameter");
  }
  static _capnp = {
    displayName: "Parameter",
    id: "b9521bccf10fa3b1",
    size: new ObjectSize(0, 1)
  };
  get name() {
    return getText(0, this);
  }
  set name(value) {
    setText(0, value, this);
  }
  toString() {
    return "Node_Parameter_" + super.toString();
  }
};
var Node_NestedNode = class extends Struct {
  static {
    __name(this, "Node_NestedNode");
  }
  static {
    __name2(this, "Node_NestedNode");
  }
  static _capnp = {
    displayName: "NestedNode",
    id: "debf55bbfa0fc242",
    size: new ObjectSize(8, 1)
  };
  /**
  * Unqualified symbol name.  Unlike Node.displayName, this *can* be used programmatically.
  *
  * (On Zooko's triangle, this is the node's petname according to its parent scope.)
  *
  */
  get name() {
    return getText(0, this);
  }
  set name(value) {
    setText(0, value, this);
  }
  /**
  * ID of the nested node.  Typically, the target node's scopeId points back to this node, but
  * robust code should avoid relying on this.
  *
  */
  get id() {
    return getUint64(0, this);
  }
  set id(value) {
    setUint64(0, value, this);
  }
  toString() {
    return "Node_NestedNode_" + super.toString();
  }
};
var Node_SourceInfo_Member = class extends Struct {
  static {
    __name(this, "Node_SourceInfo_Member");
  }
  static {
    __name2(this, "Node_SourceInfo_Member");
  }
  static _capnp = {
    displayName: "Member",
    id: "c2ba9038898e1fa2",
    size: new ObjectSize(0, 1)
  };
  /**
  * Doc comment on the member.
  *
  */
  get docComment() {
    return getText(0, this);
  }
  set docComment(value) {
    setText(0, value, this);
  }
  toString() {
    return "Node_SourceInfo_Member_" + super.toString();
  }
};
var Node_SourceInfo = class _Node_SourceInfo extends Struct {
  static {
    __name(this, "_Node_SourceInfo");
  }
  static {
    __name2(this, "Node_SourceInfo");
  }
  static Member = Node_SourceInfo_Member;
  static _capnp = {
    displayName: "SourceInfo",
    id: "f38e1de3041357ae",
    size: new ObjectSize(8, 2)
  };
  static _Members;
  /**
  * ID of the Node which this info describes.
  *
  */
  get id() {
    return getUint64(0, this);
  }
  set id(value) {
    setUint64(0, value, this);
  }
  /**
  * The top-level doc comment for the Node.
  *
  */
  get docComment() {
    return getText(0, this);
  }
  set docComment(value) {
    setText(0, value, this);
  }
  _adoptMembers(value) {
    adopt(value, getPointer(1, this));
  }
  _disownMembers() {
    return disown(this.members);
  }
  /**
  * Information about each member -- i.e. fields (for structs), enumerants (for enums), or
  * methods (for interfaces).
  *
  * This list is the same length and order as the corresponding list in the Node, i.e.
  * Node.struct.fields, Node.enum.enumerants, or Node.interface.methods.
  *
  */
  get members() {
    return getList(1, _Node_SourceInfo._Members, this);
  }
  _hasMembers() {
    return !isNull4(getPointer(1, this));
  }
  _initMembers(length) {
    return initList(1, _Node_SourceInfo._Members, length, this);
  }
  set members(value) {
    copyFrom(value, getPointer(1, this));
  }
  toString() {
    return "Node_SourceInfo_" + super.toString();
  }
};
var Node_Struct = class _Node_Struct extends Struct {
  static {
    __name(this, "_Node_Struct");
  }
  static {
    __name2(this, "Node_Struct");
  }
  static _capnp = {
    displayName: "struct",
    id: "9ea0b19b37fb4435",
    size: new ObjectSize(40, 6)
  };
  static _Fields;
  /**
  * Size of the data section, in words.
  *
  */
  get dataWordCount() {
    return getUint16(14, this);
  }
  set dataWordCount(value) {
    setUint16(14, value, this);
  }
  /**
  * Size of the pointer section, in pointers (which are one word each).
  *
  */
  get pointerCount() {
    return getUint16(24, this);
  }
  set pointerCount(value) {
    setUint16(24, value, this);
  }
  /**
  * The preferred element size to use when encoding a list of this struct.  If this is anything
  * other than `inlineComposite` then the struct is one word or less in size and is a candidate
  * for list packing optimization.
  *
  */
  get preferredListEncoding() {
    return getUint16(26, this);
  }
  set preferredListEncoding(value) {
    setUint16(26, value, this);
  }
  /**
  * If true, then this "struct" node is actually not an independent node, but merely represents
  * some named union or group within a particular parent struct.  This node's scopeId refers
  * to the parent struct, which may itself be a union/group in yet another struct.
  *
  * All group nodes share the same dataWordCount and pointerCount as the top-level
  * struct, and their fields live in the same ordinal and offset spaces as all other fields in
  * the struct.
  *
  * Note that a named union is considered a special kind of group -- in fact, a named union
  * is exactly equivalent to a group that contains nothing but an unnamed union.
  *
  */
  get isGroup() {
    return getBit(224, this);
  }
  set isGroup(value) {
    setBit(224, value, this);
  }
  /**
  * Number of fields in this struct which are members of an anonymous union, and thus may
  * overlap.  If this is non-zero, then a 16-bit discriminant is present indicating which
  * of the overlapping fields is active.  This can never be 1 -- if it is non-zero, it must be
  * two or more.
  *
  * Note that the fields of an unnamed union are considered fields of the scope containing the
  * union -- an unnamed union is not its own group.  So, a top-level struct may contain a
  * non-zero discriminant count.  Named unions, on the other hand, are equivalent to groups
  * containing unnamed unions.  So, a named union has its own independent schema node, with
  * `isGroup` = true.
  *
  */
  get discriminantCount() {
    return getUint16(30, this);
  }
  set discriminantCount(value) {
    setUint16(30, value, this);
  }
  /**
  * If `discriminantCount` is non-zero, this is the offset of the union discriminant, in
  * multiples of 16 bits.
  *
  */
  get discriminantOffset() {
    return getUint32(32, this);
  }
  set discriminantOffset(value) {
    setUint32(32, value, this);
  }
  _adoptFields(value) {
    adopt(value, getPointer(3, this));
  }
  _disownFields() {
    return disown(this.fields);
  }
  /**
  * Fields defined within this scope (either the struct's top-level fields, or the fields of
  * a particular group; see `isGroup`).
  *
  * The fields are sorted by ordinal number, but note that because groups share the same
  * ordinal space, the field's index in this list is not necessarily exactly its ordinal.
  * On the other hand, the field's position in this list does remain the same even as the
  * protocol evolves, since it is not possible to insert or remove an earlier ordinal.
  * Therefore, for most use cases, if you want to identify a field by number, it may make the
  * most sense to use the field's index in this list rather than its ordinal.
  *
  */
  get fields() {
    return getList(3, _Node_Struct._Fields, this);
  }
  _hasFields() {
    return !isNull4(getPointer(3, this));
  }
  _initFields(length) {
    return initList(3, _Node_Struct._Fields, length, this);
  }
  set fields(value) {
    copyFrom(value, getPointer(3, this));
  }
  toString() {
    return "Node_Struct_" + super.toString();
  }
};
var Node_Enum = class _Node_Enum extends Struct {
  static {
    __name(this, "_Node_Enum");
  }
  static {
    __name2(this, "Node_Enum");
  }
  static _capnp = {
    displayName: "enum",
    id: "b54ab3364333f598",
    size: new ObjectSize(40, 6)
  };
  static _Enumerants;
  _adoptEnumerants(value) {
    adopt(value, getPointer(3, this));
  }
  _disownEnumerants() {
    return disown(this.enumerants);
  }
  /**
  * Enumerants ordered by numeric value (ordinal).
  *
  */
  get enumerants() {
    return getList(3, _Node_Enum._Enumerants, this);
  }
  _hasEnumerants() {
    return !isNull4(getPointer(3, this));
  }
  _initEnumerants(length) {
    return initList(3, _Node_Enum._Enumerants, length, this);
  }
  set enumerants(value) {
    copyFrom(value, getPointer(3, this));
  }
  toString() {
    return "Node_Enum_" + super.toString();
  }
};
var Node_Interface = class _Node_Interface extends Struct {
  static {
    __name(this, "_Node_Interface");
  }
  static {
    __name2(this, "Node_Interface");
  }
  static _capnp = {
    displayName: "interface",
    id: "e82753cff0c2218f",
    size: new ObjectSize(40, 6)
  };
  static _Methods;
  static _Superclasses;
  _adoptMethods(value) {
    adopt(value, getPointer(3, this));
  }
  _disownMethods() {
    return disown(this.methods);
  }
  /**
  * Methods ordered by ordinal.
  *
  */
  get methods() {
    return getList(3, _Node_Interface._Methods, this);
  }
  _hasMethods() {
    return !isNull4(getPointer(3, this));
  }
  _initMethods(length) {
    return initList(3, _Node_Interface._Methods, length, this);
  }
  set methods(value) {
    copyFrom(value, getPointer(3, this));
  }
  _adoptSuperclasses(value) {
    adopt(value, getPointer(4, this));
  }
  _disownSuperclasses() {
    return disown(this.superclasses);
  }
  /**
  * Superclasses of this interface.
  *
  */
  get superclasses() {
    return getList(4, _Node_Interface._Superclasses, this);
  }
  _hasSuperclasses() {
    return !isNull4(getPointer(4, this));
  }
  _initSuperclasses(length) {
    return initList(4, _Node_Interface._Superclasses, length, this);
  }
  set superclasses(value) {
    copyFrom(value, getPointer(4, this));
  }
  toString() {
    return "Node_Interface_" + super.toString();
  }
};
var Node_Const = class extends Struct {
  static {
    __name(this, "Node_Const");
  }
  static {
    __name2(this, "Node_Const");
  }
  static _capnp = {
    displayName: "const",
    id: "b18aa5ac7a0d9420",
    size: new ObjectSize(40, 6)
  };
  _adoptType(value) {
    adopt(value, getPointer(3, this));
  }
  _disownType() {
    return disown(this.type);
  }
  get type() {
    return getStruct(3, Type, this);
  }
  _hasType() {
    return !isNull4(getPointer(3, this));
  }
  _initType() {
    return initStructAt(3, Type, this);
  }
  set type(value) {
    copyFrom(value, getPointer(3, this));
  }
  _adoptValue(value) {
    adopt(value, getPointer(4, this));
  }
  _disownValue() {
    return disown(this.value);
  }
  get value() {
    return getStruct(4, Value, this);
  }
  _hasValue() {
    return !isNull4(getPointer(4, this));
  }
  _initValue() {
    return initStructAt(4, Value, this);
  }
  set value(value) {
    copyFrom(value, getPointer(4, this));
  }
  toString() {
    return "Node_Const_" + super.toString();
  }
};
var Node_Annotation = class extends Struct {
  static {
    __name(this, "Node_Annotation");
  }
  static {
    __name2(this, "Node_Annotation");
  }
  static _capnp = {
    displayName: "annotation",
    id: "ec1619d4400a0290",
    size: new ObjectSize(40, 6)
  };
  _adoptType(value) {
    adopt(value, getPointer(3, this));
  }
  _disownType() {
    return disown(this.type);
  }
  get type() {
    return getStruct(3, Type, this);
  }
  _hasType() {
    return !isNull4(getPointer(3, this));
  }
  _initType() {
    return initStructAt(3, Type, this);
  }
  set type(value) {
    copyFrom(value, getPointer(3, this));
  }
  get targetsFile() {
    return getBit(112, this);
  }
  set targetsFile(value) {
    setBit(112, value, this);
  }
  get targetsConst() {
    return getBit(113, this);
  }
  set targetsConst(value) {
    setBit(113, value, this);
  }
  get targetsEnum() {
    return getBit(114, this);
  }
  set targetsEnum(value) {
    setBit(114, value, this);
  }
  get targetsEnumerant() {
    return getBit(115, this);
  }
  set targetsEnumerant(value) {
    setBit(115, value, this);
  }
  get targetsStruct() {
    return getBit(116, this);
  }
  set targetsStruct(value) {
    setBit(116, value, this);
  }
  get targetsField() {
    return getBit(117, this);
  }
  set targetsField(value) {
    setBit(117, value, this);
  }
  get targetsUnion() {
    return getBit(118, this);
  }
  set targetsUnion(value) {
    setBit(118, value, this);
  }
  get targetsGroup() {
    return getBit(119, this);
  }
  set targetsGroup(value) {
    setBit(119, value, this);
  }
  get targetsInterface() {
    return getBit(120, this);
  }
  set targetsInterface(value) {
    setBit(120, value, this);
  }
  get targetsMethod() {
    return getBit(121, this);
  }
  set targetsMethod(value) {
    setBit(121, value, this);
  }
  get targetsParam() {
    return getBit(122, this);
  }
  set targetsParam(value) {
    setBit(122, value, this);
  }
  get targetsAnnotation() {
    return getBit(123, this);
  }
  set targetsAnnotation(value) {
    setBit(123, value, this);
  }
  toString() {
    return "Node_Annotation_" + super.toString();
  }
};
var Node_Which = {
  FILE: 0,
  /**
  * Name to present to humans to identify this Node.  You should not attempt to parse this.  Its
  * format could change.  It is not guaranteed to be unique.
  *
  * (On Zooko's triangle, this is the node's nickname.)
  *
  */
  STRUCT: 1,
  /**
  * If you want a shorter version of `displayName` (just naming this node, without its surrounding
  * scope), chop off this many characters from the beginning of `displayName`.
  *
  */
  ENUM: 2,
  /**
  * ID of the lexical parent node.  Typically, the scope node will have a NestedNode pointing back
  * at this node, but robust code should avoid relying on this (and, in fact, group nodes are not
  * listed in the outer struct's nestedNodes, since they are listed in the fields).  `scopeId` is
  * zero if the node has no parent, which is normally only the case with files, but should be
  * allowed for any kind of node (in order to make runtime type generation easier).
  *
  */
  INTERFACE: 3,
  /**
  * List of nodes nested within this node, along with the names under which they were declared.
  *
  */
  CONST: 4,
  /**
  * Annotations applied to this node.
  *
  */
  ANNOTATION: 5
};
var Node = class _Node extends Struct {
  static {
    __name(this, "_Node");
  }
  static {
    __name2(this, "Node");
  }
  static FILE = Node_Which.FILE;
  static STRUCT = Node_Which.STRUCT;
  static ENUM = Node_Which.ENUM;
  static INTERFACE = Node_Which.INTERFACE;
  static CONST = Node_Which.CONST;
  static ANNOTATION = Node_Which.ANNOTATION;
  static Parameter = Node_Parameter;
  static NestedNode = Node_NestedNode;
  static SourceInfo = Node_SourceInfo;
  static _capnp = {
    displayName: "Node",
    id: "e682ab4cf923a417",
    size: new ObjectSize(40, 6)
  };
  static _Parameters;
  static _NestedNodes;
  static _Annotations;
  get id() {
    return getUint64(0, this);
  }
  set id(value) {
    setUint64(0, value, this);
  }
  /**
  * Name to present to humans to identify this Node.  You should not attempt to parse this.  Its
  * format could change.  It is not guaranteed to be unique.
  *
  * (On Zooko's triangle, this is the node's nickname.)
  *
  */
  get displayName() {
    return getText(0, this);
  }
  set displayName(value) {
    setText(0, value, this);
  }
  /**
  * If you want a shorter version of `displayName` (just naming this node, without its surrounding
  * scope), chop off this many characters from the beginning of `displayName`.
  *
  */
  get displayNamePrefixLength() {
    return getUint32(8, this);
  }
  set displayNamePrefixLength(value) {
    setUint32(8, value, this);
  }
  /**
  * ID of the lexical parent node.  Typically, the scope node will have a NestedNode pointing back
  * at this node, but robust code should avoid relying on this (and, in fact, group nodes are not
  * listed in the outer struct's nestedNodes, since they are listed in the fields).  `scopeId` is
  * zero if the node has no parent, which is normally only the case with files, but should be
  * allowed for any kind of node (in order to make runtime type generation easier).
  *
  */
  get scopeId() {
    return getUint64(16, this);
  }
  set scopeId(value) {
    setUint64(16, value, this);
  }
  _adoptParameters(value) {
    adopt(value, getPointer(5, this));
  }
  _disownParameters() {
    return disown(this.parameters);
  }
  /**
  * If this node is parameterized (generic), the list of parameters. Empty for non-generic types.
  *
  */
  get parameters() {
    return getList(5, _Node._Parameters, this);
  }
  _hasParameters() {
    return !isNull4(getPointer(5, this));
  }
  _initParameters(length) {
    return initList(5, _Node._Parameters, length, this);
  }
  set parameters(value) {
    copyFrom(value, getPointer(5, this));
  }
  /**
  * True if this node is generic, meaning that it or one of its parent scopes has a non-empty
  * `parameters`.
  *
  */
  get isGeneric() {
    return getBit(288, this);
  }
  set isGeneric(value) {
    setBit(288, value, this);
  }
  _adoptNestedNodes(value) {
    adopt(value, getPointer(1, this));
  }
  _disownNestedNodes() {
    return disown(this.nestedNodes);
  }
  /**
  * List of nodes nested within this node, along with the names under which they were declared.
  *
  */
  get nestedNodes() {
    return getList(1, _Node._NestedNodes, this);
  }
  _hasNestedNodes() {
    return !isNull4(getPointer(1, this));
  }
  _initNestedNodes(length) {
    return initList(1, _Node._NestedNodes, length, this);
  }
  set nestedNodes(value) {
    copyFrom(value, getPointer(1, this));
  }
  _adoptAnnotations(value) {
    adopt(value, getPointer(2, this));
  }
  _disownAnnotations() {
    return disown(this.annotations);
  }
  /**
  * Annotations applied to this node.
  *
  */
  get annotations() {
    return getList(2, _Node._Annotations, this);
  }
  _hasAnnotations() {
    return !isNull4(getPointer(2, this));
  }
  _initAnnotations(length) {
    return initList(2, _Node._Annotations, length, this);
  }
  set annotations(value) {
    copyFrom(value, getPointer(2, this));
  }
  get _isFile() {
    return getUint16(12, this) === 0;
  }
  set file(_) {
    setUint16(12, 0, this);
  }
  get struct() {
    testWhich("struct", getUint16(12, this), 1, this);
    return getAs(Node_Struct, this);
  }
  _initStruct() {
    setUint16(12, 1, this);
    return getAs(Node_Struct, this);
  }
  get _isStruct() {
    return getUint16(12, this) === 1;
  }
  set struct(_) {
    setUint16(12, 1, this);
  }
  get enum() {
    testWhich("enum", getUint16(12, this), 2, this);
    return getAs(Node_Enum, this);
  }
  _initEnum() {
    setUint16(12, 2, this);
    return getAs(Node_Enum, this);
  }
  get _isEnum() {
    return getUint16(12, this) === 2;
  }
  set enum(_) {
    setUint16(12, 2, this);
  }
  get interface() {
    testWhich("interface", getUint16(12, this), 3, this);
    return getAs(Node_Interface, this);
  }
  _initInterface() {
    setUint16(12, 3, this);
    return getAs(Node_Interface, this);
  }
  get _isInterface() {
    return getUint16(12, this) === 3;
  }
  set interface(_) {
    setUint16(12, 3, this);
  }
  get const() {
    testWhich("const", getUint16(12, this), 4, this);
    return getAs(Node_Const, this);
  }
  _initConst() {
    setUint16(12, 4, this);
    return getAs(Node_Const, this);
  }
  get _isConst() {
    return getUint16(12, this) === 4;
  }
  set const(_) {
    setUint16(12, 4, this);
  }
  get annotation() {
    testWhich("annotation", getUint16(12, this), 5, this);
    return getAs(Node_Annotation, this);
  }
  _initAnnotation() {
    setUint16(12, 5, this);
    return getAs(Node_Annotation, this);
  }
  get _isAnnotation() {
    return getUint16(12, this) === 5;
  }
  set annotation(_) {
    setUint16(12, 5, this);
  }
  toString() {
    return "Node_" + super.toString();
  }
  which() {
    return getUint16(12, this);
  }
};
var Field_Slot = class extends Struct {
  static {
    __name(this, "Field_Slot");
  }
  static {
    __name2(this, "Field_Slot");
  }
  static _capnp = {
    displayName: "slot",
    id: "c42305476bb4746f",
    size: new ObjectSize(24, 4)
  };
  /**
  * Offset, in units of the field's size, from the beginning of the section in which the field
  * resides.  E.g. for a UInt32 field, multiply this by 4 to get the byte offset from the
  * beginning of the data section.
  *
  */
  get offset() {
    return getUint32(4, this);
  }
  set offset(value) {
    setUint32(4, value, this);
  }
  _adoptType(value) {
    adopt(value, getPointer(2, this));
  }
  _disownType() {
    return disown(this.type);
  }
  get type() {
    return getStruct(2, Type, this);
  }
  _hasType() {
    return !isNull4(getPointer(2, this));
  }
  _initType() {
    return initStructAt(2, Type, this);
  }
  set type(value) {
    copyFrom(value, getPointer(2, this));
  }
  _adoptDefaultValue(value) {
    adopt(value, getPointer(3, this));
  }
  _disownDefaultValue() {
    return disown(this.defaultValue);
  }
  get defaultValue() {
    return getStruct(3, Value, this);
  }
  _hasDefaultValue() {
    return !isNull4(getPointer(3, this));
  }
  _initDefaultValue() {
    return initStructAt(3, Value, this);
  }
  set defaultValue(value) {
    copyFrom(value, getPointer(3, this));
  }
  /**
  * Whether the default value was specified explicitly.  Non-explicit default values are always
  * zero or empty values.  Usually, whether the default value was explicit shouldn't matter.
  * The main use case for this flag is for structs representing method parameters:
  * explicitly-defaulted parameters may be allowed to be omitted when calling the method.
  *
  */
  get hadExplicitDefault() {
    return getBit(128, this);
  }
  set hadExplicitDefault(value) {
    setBit(128, value, this);
  }
  toString() {
    return "Field_Slot_" + super.toString();
  }
};
var Field_Group = class extends Struct {
  static {
    __name(this, "Field_Group");
  }
  static {
    __name2(this, "Field_Group");
  }
  static _capnp = {
    displayName: "group",
    id: "cafccddb68db1d11",
    size: new ObjectSize(24, 4)
  };
  /**
  * The ID of the group's node.
  *
  */
  get typeId() {
    return getUint64(16, this);
  }
  set typeId(value) {
    setUint64(16, value, this);
  }
  toString() {
    return "Field_Group_" + super.toString();
  }
};
var Field_Ordinal_Which = {
  IMPLICIT: 0,
  /**
  * The original ordinal number given to the field.  You probably should NOT use this; if you need
  * a numeric identifier for a field, use its position within the field array for its scope.
  * The ordinal is given here mainly just so that the original schema text can be reproduced given
  * the compiled version -- i.e. so that `capnp compile -ocapnp` can do its job.
  *
  */
  EXPLICIT: 1
};
var Field_Ordinal = class extends Struct {
  static {
    __name(this, "Field_Ordinal");
  }
  static {
    __name2(this, "Field_Ordinal");
  }
  static IMPLICIT = Field_Ordinal_Which.IMPLICIT;
  static EXPLICIT = Field_Ordinal_Which.EXPLICIT;
  static _capnp = {
    displayName: "ordinal",
    id: "bb90d5c287870be6",
    size: new ObjectSize(24, 4)
  };
  get _isImplicit() {
    return getUint16(10, this) === 0;
  }
  set implicit(_) {
    setUint16(10, 0, this);
  }
  /**
  * The original ordinal number given to the field.  You probably should NOT use this; if you need
  * a numeric identifier for a field, use its position within the field array for its scope.
  * The ordinal is given here mainly just so that the original schema text can be reproduced given
  * the compiled version -- i.e. so that `capnp compile -ocapnp` can do its job.
  *
  */
  get explicit() {
    testWhich("explicit", getUint16(10, this), 1, this);
    return getUint16(12, this);
  }
  get _isExplicit() {
    return getUint16(10, this) === 1;
  }
  set explicit(value) {
    setUint16(10, 1, this);
    setUint16(12, value, this);
  }
  toString() {
    return "Field_Ordinal_" + super.toString();
  }
  which() {
    return getUint16(10, this);
  }
};
var Field_Which = {
  SLOT: 0,
  /**
  * Indicates where this member appeared in the code, relative to other members.
  * Code ordering may have semantic relevance -- programmers tend to place related fields
  * together.  So, using code ordering makes sense in human-readable formats where ordering is
  * otherwise irrelevant, like JSON.  The values of codeOrder are tightly-packed, so the maximum
  * value is count(members) - 1.  Fields that are members of a union are only ordered relative to
  * the other members of that union, so the maximum value there is count(union.members).
  *
  */
  GROUP: 1
};
var Field = class _Field extends Struct {
  static {
    __name(this, "_Field");
  }
  static {
    __name2(this, "Field");
  }
  static NO_DISCRIMINANT = 65535;
  static SLOT = Field_Which.SLOT;
  static GROUP = Field_Which.GROUP;
  static _capnp = {
    displayName: "Field",
    id: "9aad50a41f4af45f",
    size: new ObjectSize(24, 4),
    defaultDiscriminantValue: getUint16Mask(65535)
  };
  static _Annotations;
  get name() {
    return getText(0, this);
  }
  set name(value) {
    setText(0, value, this);
  }
  /**
  * Indicates where this member appeared in the code, relative to other members.
  * Code ordering may have semantic relevance -- programmers tend to place related fields
  * together.  So, using code ordering makes sense in human-readable formats where ordering is
  * otherwise irrelevant, like JSON.  The values of codeOrder are tightly-packed, so the maximum
  * value is count(members) - 1.  Fields that are members of a union are only ordered relative to
  * the other members of that union, so the maximum value there is count(union.members).
  *
  */
  get codeOrder() {
    return getUint16(0, this);
  }
  set codeOrder(value) {
    setUint16(0, value, this);
  }
  _adoptAnnotations(value) {
    adopt(value, getPointer(1, this));
  }
  _disownAnnotations() {
    return disown(this.annotations);
  }
  get annotations() {
    return getList(1, _Field._Annotations, this);
  }
  _hasAnnotations() {
    return !isNull4(getPointer(1, this));
  }
  _initAnnotations(length) {
    return initList(1, _Field._Annotations, length, this);
  }
  set annotations(value) {
    copyFrom(value, getPointer(1, this));
  }
  /**
  * If the field is in a union, this is the value which the union's discriminant should take when
  * the field is active.  If the field is not in a union, this is 0xffff.
  *
  */
  get discriminantValue() {
    return getUint16(2, this, _Field._capnp.defaultDiscriminantValue);
  }
  set discriminantValue(value) {
    setUint16(2, value, this, _Field._capnp.defaultDiscriminantValue);
  }
  /**
  * A regular, non-group, non-fixed-list field.
  *
  */
  get slot() {
    testWhich("slot", getUint16(8, this), 0, this);
    return getAs(Field_Slot, this);
  }
  _initSlot() {
    setUint16(8, 0, this);
    return getAs(Field_Slot, this);
  }
  get _isSlot() {
    return getUint16(8, this) === 0;
  }
  set slot(_) {
    setUint16(8, 0, this);
  }
  /**
  * A group.
  *
  */
  get group() {
    testWhich("group", getUint16(8, this), 1, this);
    return getAs(Field_Group, this);
  }
  _initGroup() {
    setUint16(8, 1, this);
    return getAs(Field_Group, this);
  }
  get _isGroup() {
    return getUint16(8, this) === 1;
  }
  set group(_) {
    setUint16(8, 1, this);
  }
  get ordinal() {
    return getAs(Field_Ordinal, this);
  }
  _initOrdinal() {
    return getAs(Field_Ordinal, this);
  }
  toString() {
    return "Field_" + super.toString();
  }
  which() {
    return getUint16(8, this);
  }
};
var Enumerant = class _Enumerant extends Struct {
  static {
    __name(this, "_Enumerant");
  }
  static {
    __name2(this, "Enumerant");
  }
  static _capnp = {
    displayName: "Enumerant",
    id: "978a7cebdc549a4d",
    size: new ObjectSize(8, 2)
  };
  static _Annotations;
  get name() {
    return getText(0, this);
  }
  set name(value) {
    setText(0, value, this);
  }
  /**
  * Specifies order in which the enumerants were declared in the code.
  * Like utils.Field.codeOrder.
  *
  */
  get codeOrder() {
    return getUint16(0, this);
  }
  set codeOrder(value) {
    setUint16(0, value, this);
  }
  _adoptAnnotations(value) {
    adopt(value, getPointer(1, this));
  }
  _disownAnnotations() {
    return disown(this.annotations);
  }
  get annotations() {
    return getList(1, _Enumerant._Annotations, this);
  }
  _hasAnnotations() {
    return !isNull4(getPointer(1, this));
  }
  _initAnnotations(length) {
    return initList(1, _Enumerant._Annotations, length, this);
  }
  set annotations(value) {
    copyFrom(value, getPointer(1, this));
  }
  toString() {
    return "Enumerant_" + super.toString();
  }
};
var Superclass = class extends Struct {
  static {
    __name(this, "Superclass");
  }
  static {
    __name2(this, "Superclass");
  }
  static _capnp = {
    displayName: "Superclass",
    id: "a9962a9ed0a4d7f8",
    size: new ObjectSize(8, 1)
  };
  get id() {
    return getUint64(0, this);
  }
  set id(value) {
    setUint64(0, value, this);
  }
  _adoptBrand(value) {
    adopt(value, getPointer(0, this));
  }
  _disownBrand() {
    return disown(this.brand);
  }
  get brand() {
    return getStruct(0, Brand, this);
  }
  _hasBrand() {
    return !isNull4(getPointer(0, this));
  }
  _initBrand() {
    return initStructAt(0, Brand, this);
  }
  set brand(value) {
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Superclass_" + super.toString();
  }
};
var Method = class _Method extends Struct {
  static {
    __name(this, "_Method");
  }
  static {
    __name2(this, "Method");
  }
  static _capnp = {
    displayName: "Method",
    id: "9500cce23b334d80",
    size: new ObjectSize(24, 5)
  };
  static _ImplicitParameters;
  static _Annotations;
  get name() {
    return getText(0, this);
  }
  set name(value) {
    setText(0, value, this);
  }
  /**
  * Specifies order in which the methods were declared in the code.
  * Like utils.Field.codeOrder.
  *
  */
  get codeOrder() {
    return getUint16(0, this);
  }
  set codeOrder(value) {
    setUint16(0, value, this);
  }
  _adoptImplicitParameters(value) {
    adopt(value, getPointer(4, this));
  }
  _disownImplicitParameters() {
    return disown(this.implicitParameters);
  }
  /**
  * The parameters listed in [] (typically, type / generic parameters), whose bindings are intended
  * to be inferred rather than specified explicitly, although not all languages support this.
  *
  */
  get implicitParameters() {
    return getList(4, _Method._ImplicitParameters, this);
  }
  _hasImplicitParameters() {
    return !isNull4(getPointer(4, this));
  }
  _initImplicitParameters(length) {
    return initList(4, _Method._ImplicitParameters, length, this);
  }
  set implicitParameters(value) {
    copyFrom(value, getPointer(4, this));
  }
  /**
  * ID of the parameter struct type.  If a named parameter list was specified in the method
  * declaration (rather than a single struct parameter type) then a corresponding struct type is
  * auto-generated.  Such an auto-generated type will not be listed in the interface's
  * `nestedNodes` and its `scopeId` will be zero -- it is completely detached from the namespace.
  * (Awkwardly, it does of course inherit generic parameters from the method's scope, which makes
  * this a situation where you can't just climb the scope chain to find where a particular
  * generic parameter was introduced. Making the `scopeId` zero was a mistake.)
  *
  */
  get paramStructType() {
    return getUint64(8, this);
  }
  set paramStructType(value) {
    setUint64(8, value, this);
  }
  _adoptParamBrand(value) {
    adopt(value, getPointer(2, this));
  }
  _disownParamBrand() {
    return disown(this.paramBrand);
  }
  /**
  * Brand of param struct type.
  *
  */
  get paramBrand() {
    return getStruct(2, Brand, this);
  }
  _hasParamBrand() {
    return !isNull4(getPointer(2, this));
  }
  _initParamBrand() {
    return initStructAt(2, Brand, this);
  }
  set paramBrand(value) {
    copyFrom(value, getPointer(2, this));
  }
  /**
  * ID of the return struct type; similar to `paramStructType`.
  *
  */
  get resultStructType() {
    return getUint64(16, this);
  }
  set resultStructType(value) {
    setUint64(16, value, this);
  }
  _adoptResultBrand(value) {
    adopt(value, getPointer(3, this));
  }
  _disownResultBrand() {
    return disown(this.resultBrand);
  }
  /**
  * Brand of result struct type.
  *
  */
  get resultBrand() {
    return getStruct(3, Brand, this);
  }
  _hasResultBrand() {
    return !isNull4(getPointer(3, this));
  }
  _initResultBrand() {
    return initStructAt(3, Brand, this);
  }
  set resultBrand(value) {
    copyFrom(value, getPointer(3, this));
  }
  _adoptAnnotations(value) {
    adopt(value, getPointer(1, this));
  }
  _disownAnnotations() {
    return disown(this.annotations);
  }
  get annotations() {
    return getList(1, _Method._Annotations, this);
  }
  _hasAnnotations() {
    return !isNull4(getPointer(1, this));
  }
  _initAnnotations(length) {
    return initList(1, _Method._Annotations, length, this);
  }
  set annotations(value) {
    copyFrom(value, getPointer(1, this));
  }
  toString() {
    return "Method_" + super.toString();
  }
};
var Type_List = class extends Struct {
  static {
    __name(this, "Type_List");
  }
  static {
    __name2(this, "Type_List");
  }
  static _capnp = {
    displayName: "list",
    id: "87e739250a60ea97",
    size: new ObjectSize(24, 1)
  };
  _adoptElementType(value) {
    adopt(value, getPointer(0, this));
  }
  _disownElementType() {
    return disown(this.elementType);
  }
  get elementType() {
    return getStruct(0, Type, this);
  }
  _hasElementType() {
    return !isNull4(getPointer(0, this));
  }
  _initElementType() {
    return initStructAt(0, Type, this);
  }
  set elementType(value) {
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Type_List_" + super.toString();
  }
};
var Type_Enum = class extends Struct {
  static {
    __name(this, "Type_Enum");
  }
  static {
    __name2(this, "Type_Enum");
  }
  static _capnp = {
    displayName: "enum",
    id: "9e0e78711a7f87a9",
    size: new ObjectSize(24, 1)
  };
  get typeId() {
    return getUint64(8, this);
  }
  set typeId(value) {
    setUint64(8, value, this);
  }
  _adoptBrand(value) {
    adopt(value, getPointer(0, this));
  }
  _disownBrand() {
    return disown(this.brand);
  }
  get brand() {
    return getStruct(0, Brand, this);
  }
  _hasBrand() {
    return !isNull4(getPointer(0, this));
  }
  _initBrand() {
    return initStructAt(0, Brand, this);
  }
  set brand(value) {
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Type_Enum_" + super.toString();
  }
};
var Type_Struct = class extends Struct {
  static {
    __name(this, "Type_Struct");
  }
  static {
    __name2(this, "Type_Struct");
  }
  static _capnp = {
    displayName: "struct",
    id: "ac3a6f60ef4cc6d3",
    size: new ObjectSize(24, 1)
  };
  get typeId() {
    return getUint64(8, this);
  }
  set typeId(value) {
    setUint64(8, value, this);
  }
  _adoptBrand(value) {
    adopt(value, getPointer(0, this));
  }
  _disownBrand() {
    return disown(this.brand);
  }
  get brand() {
    return getStruct(0, Brand, this);
  }
  _hasBrand() {
    return !isNull4(getPointer(0, this));
  }
  _initBrand() {
    return initStructAt(0, Brand, this);
  }
  set brand(value) {
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Type_Struct_" + super.toString();
  }
};
var Type_Interface = class extends Struct {
  static {
    __name(this, "Type_Interface");
  }
  static {
    __name2(this, "Type_Interface");
  }
  static _capnp = {
    displayName: "interface",
    id: "ed8bca69f7fb0cbf",
    size: new ObjectSize(24, 1)
  };
  get typeId() {
    return getUint64(8, this);
  }
  set typeId(value) {
    setUint64(8, value, this);
  }
  _adoptBrand(value) {
    adopt(value, getPointer(0, this));
  }
  _disownBrand() {
    return disown(this.brand);
  }
  get brand() {
    return getStruct(0, Brand, this);
  }
  _hasBrand() {
    return !isNull4(getPointer(0, this));
  }
  _initBrand() {
    return initStructAt(0, Brand, this);
  }
  set brand(value) {
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Type_Interface_" + super.toString();
  }
};
var Type_AnyPointer_Unconstrained_Which = {
  /**
  * truly AnyPointer
  *
  */
  ANY_KIND: 0,
  /**
  * AnyStruct
  *
  */
  STRUCT: 1,
  /**
  * AnyList
  *
  */
  LIST: 2,
  /**
  * Capability
  *
  */
  CAPABILITY: 3
};
var Type_AnyPointer_Unconstrained = class extends Struct {
  static {
    __name(this, "Type_AnyPointer_Unconstrained");
  }
  static {
    __name2(this, "Type_AnyPointer_Unconstrained");
  }
  static ANY_KIND = Type_AnyPointer_Unconstrained_Which.ANY_KIND;
  static STRUCT = Type_AnyPointer_Unconstrained_Which.STRUCT;
  static LIST = Type_AnyPointer_Unconstrained_Which.LIST;
  static CAPABILITY = Type_AnyPointer_Unconstrained_Which.CAPABILITY;
  static _capnp = {
    displayName: "unconstrained",
    id: "8e3b5f79fe593656",
    size: new ObjectSize(24, 1)
  };
  get _isAnyKind() {
    return getUint16(10, this) === 0;
  }
  set anyKind(_) {
    setUint16(10, 0, this);
  }
  get _isStruct() {
    return getUint16(10, this) === 1;
  }
  set struct(_) {
    setUint16(10, 1, this);
  }
  get _isList() {
    return getUint16(10, this) === 2;
  }
  set list(_) {
    setUint16(10, 2, this);
  }
  get _isCapability() {
    return getUint16(10, this) === 3;
  }
  set capability(_) {
    setUint16(10, 3, this);
  }
  toString() {
    return "Type_AnyPointer_Unconstrained_" + super.toString();
  }
  which() {
    return getUint16(10, this);
  }
};
var Type_AnyPointer_Parameter = class extends Struct {
  static {
    __name(this, "Type_AnyPointer_Parameter");
  }
  static {
    __name2(this, "Type_AnyPointer_Parameter");
  }
  static _capnp = {
    displayName: "parameter",
    id: "9dd1f724f4614a85",
    size: new ObjectSize(24, 1)
  };
  /**
  * ID of the generic type whose parameter we're referencing. This should be a parent of the
  * current scope.
  *
  */
  get scopeId() {
    return getUint64(16, this);
  }
  set scopeId(value) {
    setUint64(16, value, this);
  }
  /**
  * Index of the parameter within the generic type's parameter list.
  *
  */
  get parameterIndex() {
    return getUint16(10, this);
  }
  set parameterIndex(value) {
    setUint16(10, value, this);
  }
  toString() {
    return "Type_AnyPointer_Parameter_" + super.toString();
  }
};
var Type_AnyPointer_ImplicitMethodParameter = class extends Struct {
  static {
    __name(this, "Type_AnyPointer_ImplicitMethodParameter");
  }
  static {
    __name2(this, "Type_AnyPointer_ImplicitMethodParameter");
  }
  static _capnp = {
    displayName: "implicitMethodParameter",
    id: "baefc9120c56e274",
    size: new ObjectSize(24, 1)
  };
  get parameterIndex() {
    return getUint16(10, this);
  }
  set parameterIndex(value) {
    setUint16(10, value, this);
  }
  toString() {
    return "Type_AnyPointer_ImplicitMethodParameter_" + super.toString();
  }
};
var Type_AnyPointer_Which = {
  /**
  * A regular AnyPointer.
  *
  * The name "unconstrained" means as opposed to constraining it to match a type parameter.
  * In retrospect this name is probably a poor choice given that it may still be constrained
  * to be a struct, list, or capability.
  *
  */
  UNCONSTRAINED: 0,
  /**
  * This is actually a reference to a type parameter defined within this scope.
  *
  */
  PARAMETER: 1,
  /**
  * This is actually a reference to an implicit (generic) parameter of a method. The only
  * legal context for this type to appear is inside Method.paramBrand or Method.resultBrand.
  *
  */
  IMPLICIT_METHOD_PARAMETER: 2
};
var Type_AnyPointer = class extends Struct {
  static {
    __name(this, "Type_AnyPointer");
  }
  static {
    __name2(this, "Type_AnyPointer");
  }
  static UNCONSTRAINED = Type_AnyPointer_Which.UNCONSTRAINED;
  static PARAMETER = Type_AnyPointer_Which.PARAMETER;
  static IMPLICIT_METHOD_PARAMETER = Type_AnyPointer_Which.IMPLICIT_METHOD_PARAMETER;
  static _capnp = {
    displayName: "anyPointer",
    id: "c2573fe8a23e49f1",
    size: new ObjectSize(24, 1)
  };
  /**
  * A regular AnyPointer.
  *
  * The name "unconstrained" means as opposed to constraining it to match a type parameter.
  * In retrospect this name is probably a poor choice given that it may still be constrained
  * to be a struct, list, or capability.
  *
  */
  get unconstrained() {
    testWhich("unconstrained", getUint16(8, this), 0, this);
    return getAs(Type_AnyPointer_Unconstrained, this);
  }
  _initUnconstrained() {
    setUint16(8, 0, this);
    return getAs(Type_AnyPointer_Unconstrained, this);
  }
  get _isUnconstrained() {
    return getUint16(8, this) === 0;
  }
  set unconstrained(_) {
    setUint16(8, 0, this);
  }
  /**
  * This is actually a reference to a type parameter defined within this scope.
  *
  */
  get parameter() {
    testWhich("parameter", getUint16(8, this), 1, this);
    return getAs(Type_AnyPointer_Parameter, this);
  }
  _initParameter() {
    setUint16(8, 1, this);
    return getAs(Type_AnyPointer_Parameter, this);
  }
  get _isParameter() {
    return getUint16(8, this) === 1;
  }
  set parameter(_) {
    setUint16(8, 1, this);
  }
  /**
  * This is actually a reference to an implicit (generic) parameter of a method. The only
  * legal context for this type to appear is inside Method.paramBrand or Method.resultBrand.
  *
  */
  get implicitMethodParameter() {
    testWhich("implicitMethodParameter", getUint16(8, this), 2, this);
    return getAs(Type_AnyPointer_ImplicitMethodParameter, this);
  }
  _initImplicitMethodParameter() {
    setUint16(8, 2, this);
    return getAs(Type_AnyPointer_ImplicitMethodParameter, this);
  }
  get _isImplicitMethodParameter() {
    return getUint16(8, this) === 2;
  }
  set implicitMethodParameter(_) {
    setUint16(8, 2, this);
  }
  toString() {
    return "Type_AnyPointer_" + super.toString();
  }
  which() {
    return getUint16(8, this);
  }
};
var Type_Which = {
  VOID: 0,
  BOOL: 1,
  INT8: 2,
  INT16: 3,
  INT32: 4,
  INT64: 5,
  UINT8: 6,
  UINT16: 7,
  UINT32: 8,
  UINT64: 9,
  FLOAT32: 10,
  FLOAT64: 11,
  TEXT: 12,
  DATA: 13,
  LIST: 14,
  ENUM: 15,
  STRUCT: 16,
  INTERFACE: 17,
  ANY_POINTER: 18
};
var Type = class extends Struct {
  static {
    __name(this, "Type");
  }
  static {
    __name2(this, "Type");
  }
  static VOID = Type_Which.VOID;
  static BOOL = Type_Which.BOOL;
  static INT8 = Type_Which.INT8;
  static INT16 = Type_Which.INT16;
  static INT32 = Type_Which.INT32;
  static INT64 = Type_Which.INT64;
  static UINT8 = Type_Which.UINT8;
  static UINT16 = Type_Which.UINT16;
  static UINT32 = Type_Which.UINT32;
  static UINT64 = Type_Which.UINT64;
  static FLOAT32 = Type_Which.FLOAT32;
  static FLOAT64 = Type_Which.FLOAT64;
  static TEXT = Type_Which.TEXT;
  static DATA = Type_Which.DATA;
  static LIST = Type_Which.LIST;
  static ENUM = Type_Which.ENUM;
  static STRUCT = Type_Which.STRUCT;
  static INTERFACE = Type_Which.INTERFACE;
  static ANY_POINTER = Type_Which.ANY_POINTER;
  static _capnp = {
    displayName: "Type",
    id: "d07378ede1f9cc60",
    size: new ObjectSize(24, 1)
  };
  get _isVoid() {
    return getUint16(0, this) === 0;
  }
  set void(_) {
    setUint16(0, 0, this);
  }
  get _isBool() {
    return getUint16(0, this) === 1;
  }
  set bool(_) {
    setUint16(0, 1, this);
  }
  get _isInt8() {
    return getUint16(0, this) === 2;
  }
  set int8(_) {
    setUint16(0, 2, this);
  }
  get _isInt16() {
    return getUint16(0, this) === 3;
  }
  set int16(_) {
    setUint16(0, 3, this);
  }
  get _isInt32() {
    return getUint16(0, this) === 4;
  }
  set int32(_) {
    setUint16(0, 4, this);
  }
  get _isInt64() {
    return getUint16(0, this) === 5;
  }
  set int64(_) {
    setUint16(0, 5, this);
  }
  get _isUint8() {
    return getUint16(0, this) === 6;
  }
  set uint8(_) {
    setUint16(0, 6, this);
  }
  get _isUint16() {
    return getUint16(0, this) === 7;
  }
  set uint16(_) {
    setUint16(0, 7, this);
  }
  get _isUint32() {
    return getUint16(0, this) === 8;
  }
  set uint32(_) {
    setUint16(0, 8, this);
  }
  get _isUint64() {
    return getUint16(0, this) === 9;
  }
  set uint64(_) {
    setUint16(0, 9, this);
  }
  get _isFloat32() {
    return getUint16(0, this) === 10;
  }
  set float32(_) {
    setUint16(0, 10, this);
  }
  get _isFloat64() {
    return getUint16(0, this) === 11;
  }
  set float64(_) {
    setUint16(0, 11, this);
  }
  get _isText() {
    return getUint16(0, this) === 12;
  }
  set text(_) {
    setUint16(0, 12, this);
  }
  get _isData() {
    return getUint16(0, this) === 13;
  }
  set data(_) {
    setUint16(0, 13, this);
  }
  get list() {
    testWhich("list", getUint16(0, this), 14, this);
    return getAs(Type_List, this);
  }
  _initList() {
    setUint16(0, 14, this);
    return getAs(Type_List, this);
  }
  get _isList() {
    return getUint16(0, this) === 14;
  }
  set list(_) {
    setUint16(0, 14, this);
  }
  get enum() {
    testWhich("enum", getUint16(0, this), 15, this);
    return getAs(Type_Enum, this);
  }
  _initEnum() {
    setUint16(0, 15, this);
    return getAs(Type_Enum, this);
  }
  get _isEnum() {
    return getUint16(0, this) === 15;
  }
  set enum(_) {
    setUint16(0, 15, this);
  }
  get struct() {
    testWhich("struct", getUint16(0, this), 16, this);
    return getAs(Type_Struct, this);
  }
  _initStruct() {
    setUint16(0, 16, this);
    return getAs(Type_Struct, this);
  }
  get _isStruct() {
    return getUint16(0, this) === 16;
  }
  set struct(_) {
    setUint16(0, 16, this);
  }
  get interface() {
    testWhich("interface", getUint16(0, this), 17, this);
    return getAs(Type_Interface, this);
  }
  _initInterface() {
    setUint16(0, 17, this);
    return getAs(Type_Interface, this);
  }
  get _isInterface() {
    return getUint16(0, this) === 17;
  }
  set interface(_) {
    setUint16(0, 17, this);
  }
  get anyPointer() {
    testWhich("anyPointer", getUint16(0, this), 18, this);
    return getAs(Type_AnyPointer, this);
  }
  _initAnyPointer() {
    setUint16(0, 18, this);
    return getAs(Type_AnyPointer, this);
  }
  get _isAnyPointer() {
    return getUint16(0, this) === 18;
  }
  set anyPointer(_) {
    setUint16(0, 18, this);
  }
  toString() {
    return "Type_" + super.toString();
  }
  which() {
    return getUint16(0, this);
  }
};
var Brand_Scope_Which = {
  /**
  * ID of the scope to which these params apply.
  *
  */
  BIND: 0,
  /**
  * List of parameter bindings.
  *
  */
  INHERIT: 1
};
var Brand_Scope = class _Brand_Scope extends Struct {
  static {
    __name(this, "_Brand_Scope");
  }
  static {
    __name2(this, "Brand_Scope");
  }
  static BIND = Brand_Scope_Which.BIND;
  static INHERIT = Brand_Scope_Which.INHERIT;
  static _capnp = {
    displayName: "Scope",
    id: "abd73485a9636bc9",
    size: new ObjectSize(16, 1)
  };
  static _Bind;
  /**
  * ID of the scope to which these params apply.
  *
  */
  get scopeId() {
    return getUint64(0, this);
  }
  set scopeId(value) {
    setUint64(0, value, this);
  }
  _adoptBind(value) {
    setUint16(8, 0, this);
    adopt(value, getPointer(0, this));
  }
  _disownBind() {
    return disown(this.bind);
  }
  /**
  * List of parameter bindings.
  *
  */
  get bind() {
    testWhich("bind", getUint16(8, this), 0, this);
    return getList(0, _Brand_Scope._Bind, this);
  }
  _hasBind() {
    return !isNull4(getPointer(0, this));
  }
  _initBind(length) {
    setUint16(8, 0, this);
    return initList(0, _Brand_Scope._Bind, length, this);
  }
  get _isBind() {
    return getUint16(8, this) === 0;
  }
  set bind(value) {
    setUint16(8, 0, this);
    copyFrom(value, getPointer(0, this));
  }
  get _isInherit() {
    return getUint16(8, this) === 1;
  }
  set inherit(_) {
    setUint16(8, 1, this);
  }
  toString() {
    return "Brand_Scope_" + super.toString();
  }
  which() {
    return getUint16(8, this);
  }
};
var Brand_Binding_Which = {
  UNBOUND: 0,
  TYPE: 1
};
var Brand_Binding = class extends Struct {
  static {
    __name(this, "Brand_Binding");
  }
  static {
    __name2(this, "Brand_Binding");
  }
  static UNBOUND = Brand_Binding_Which.UNBOUND;
  static TYPE = Brand_Binding_Which.TYPE;
  static _capnp = {
    displayName: "Binding",
    id: "c863cd16969ee7fc",
    size: new ObjectSize(8, 1)
  };
  get _isUnbound() {
    return getUint16(0, this) === 0;
  }
  set unbound(_) {
    setUint16(0, 0, this);
  }
  _adoptType(value) {
    setUint16(0, 1, this);
    adopt(value, getPointer(0, this));
  }
  _disownType() {
    return disown(this.type);
  }
  get type() {
    testWhich("type", getUint16(0, this), 1, this);
    return getStruct(0, Type, this);
  }
  _hasType() {
    return !isNull4(getPointer(0, this));
  }
  _initType() {
    setUint16(0, 1, this);
    return initStructAt(0, Type, this);
  }
  get _isType() {
    return getUint16(0, this) === 1;
  }
  set type(value) {
    setUint16(0, 1, this);
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Brand_Binding_" + super.toString();
  }
  which() {
    return getUint16(0, this);
  }
};
var Brand = class _Brand extends Struct {
  static {
    __name(this, "_Brand");
  }
  static {
    __name2(this, "Brand");
  }
  static Scope = Brand_Scope;
  static Binding = Brand_Binding;
  static _capnp = {
    displayName: "Brand",
    id: "903455f06065422b",
    size: new ObjectSize(0, 1)
  };
  static _Scopes;
  _adoptScopes(value) {
    adopt(value, getPointer(0, this));
  }
  _disownScopes() {
    return disown(this.scopes);
  }
  /**
  * For each of the target type and each of its parent scopes, a parameterization may be included
  * in this list. If no parameterization is included for a particular relevant scope, then either
  * that scope has no parameters or all parameters should be considered to be `AnyPointer`.
  *
  */
  get scopes() {
    return getList(0, _Brand._Scopes, this);
  }
  _hasScopes() {
    return !isNull4(getPointer(0, this));
  }
  _initScopes(length) {
    return initList(0, _Brand._Scopes, length, this);
  }
  set scopes(value) {
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Brand_" + super.toString();
  }
};
var Value_Which = {
  VOID: 0,
  BOOL: 1,
  INT8: 2,
  INT16: 3,
  INT32: 4,
  INT64: 5,
  UINT8: 6,
  UINT16: 7,
  UINT32: 8,
  UINT64: 9,
  FLOAT32: 10,
  FLOAT64: 11,
  TEXT: 12,
  DATA: 13,
  LIST: 14,
  ENUM: 15,
  STRUCT: 16,
  /**
  * The only interface value that can be represented statically is "null", whose methods always
  * throw exceptions.
  *
  */
  INTERFACE: 17,
  ANY_POINTER: 18
};
var Value = class extends Struct {
  static {
    __name(this, "Value");
  }
  static {
    __name2(this, "Value");
  }
  static VOID = Value_Which.VOID;
  static BOOL = Value_Which.BOOL;
  static INT8 = Value_Which.INT8;
  static INT16 = Value_Which.INT16;
  static INT32 = Value_Which.INT32;
  static INT64 = Value_Which.INT64;
  static UINT8 = Value_Which.UINT8;
  static UINT16 = Value_Which.UINT16;
  static UINT32 = Value_Which.UINT32;
  static UINT64 = Value_Which.UINT64;
  static FLOAT32 = Value_Which.FLOAT32;
  static FLOAT64 = Value_Which.FLOAT64;
  static TEXT = Value_Which.TEXT;
  static DATA = Value_Which.DATA;
  static LIST = Value_Which.LIST;
  static ENUM = Value_Which.ENUM;
  static STRUCT = Value_Which.STRUCT;
  static INTERFACE = Value_Which.INTERFACE;
  static ANY_POINTER = Value_Which.ANY_POINTER;
  static _capnp = {
    displayName: "Value",
    id: "ce23dcd2d7b00c9b",
    size: new ObjectSize(16, 1)
  };
  get _isVoid() {
    return getUint16(0, this) === 0;
  }
  set void(_) {
    setUint16(0, 0, this);
  }
  get bool() {
    testWhich("bool", getUint16(0, this), 1, this);
    return getBit(16, this);
  }
  get _isBool() {
    return getUint16(0, this) === 1;
  }
  set bool(value) {
    setUint16(0, 1, this);
    setBit(16, value, this);
  }
  get int8() {
    testWhich("int8", getUint16(0, this), 2, this);
    return getInt8(2, this);
  }
  get _isInt8() {
    return getUint16(0, this) === 2;
  }
  set int8(value) {
    setUint16(0, 2, this);
    setInt8(2, value, this);
  }
  get int16() {
    testWhich("int16", getUint16(0, this), 3, this);
    return getInt16(2, this);
  }
  get _isInt16() {
    return getUint16(0, this) === 3;
  }
  set int16(value) {
    setUint16(0, 3, this);
    setInt16(2, value, this);
  }
  get int32() {
    testWhich("int32", getUint16(0, this), 4, this);
    return getInt32(4, this);
  }
  get _isInt32() {
    return getUint16(0, this) === 4;
  }
  set int32(value) {
    setUint16(0, 4, this);
    setInt32(4, value, this);
  }
  get int64() {
    testWhich("int64", getUint16(0, this), 5, this);
    return getInt64(8, this);
  }
  get _isInt64() {
    return getUint16(0, this) === 5;
  }
  set int64(value) {
    setUint16(0, 5, this);
    setInt64(8, value, this);
  }
  get uint8() {
    testWhich("uint8", getUint16(0, this), 6, this);
    return getUint8(2, this);
  }
  get _isUint8() {
    return getUint16(0, this) === 6;
  }
  set uint8(value) {
    setUint16(0, 6, this);
    setUint8(2, value, this);
  }
  get uint16() {
    testWhich("uint16", getUint16(0, this), 7, this);
    return getUint16(2, this);
  }
  get _isUint16() {
    return getUint16(0, this) === 7;
  }
  set uint16(value) {
    setUint16(0, 7, this);
    setUint16(2, value, this);
  }
  get uint32() {
    testWhich("uint32", getUint16(0, this), 8, this);
    return getUint32(4, this);
  }
  get _isUint32() {
    return getUint16(0, this) === 8;
  }
  set uint32(value) {
    setUint16(0, 8, this);
    setUint32(4, value, this);
  }
  get uint64() {
    testWhich("uint64", getUint16(0, this), 9, this);
    return getUint64(8, this);
  }
  get _isUint64() {
    return getUint16(0, this) === 9;
  }
  set uint64(value) {
    setUint16(0, 9, this);
    setUint64(8, value, this);
  }
  get float32() {
    testWhich("float32", getUint16(0, this), 10, this);
    return getFloat32(4, this);
  }
  get _isFloat32() {
    return getUint16(0, this) === 10;
  }
  set float32(value) {
    setUint16(0, 10, this);
    setFloat32(4, value, this);
  }
  get float64() {
    testWhich("float64", getUint16(0, this), 11, this);
    return getFloat64(8, this);
  }
  get _isFloat64() {
    return getUint16(0, this) === 11;
  }
  set float64(value) {
    setUint16(0, 11, this);
    setFloat64(8, value, this);
  }
  get text() {
    testWhich("text", getUint16(0, this), 12, this);
    return getText(0, this);
  }
  get _isText() {
    return getUint16(0, this) === 12;
  }
  set text(value) {
    setUint16(0, 12, this);
    setText(0, value, this);
  }
  _adoptData(value) {
    setUint16(0, 13, this);
    adopt(value, getPointer(0, this));
  }
  _disownData() {
    return disown(this.data);
  }
  get data() {
    testWhich("data", getUint16(0, this), 13, this);
    return getData(0, this);
  }
  _hasData() {
    return !isNull4(getPointer(0, this));
  }
  _initData(length) {
    setUint16(0, 13, this);
    return initData(0, length, this);
  }
  get _isData() {
    return getUint16(0, this) === 13;
  }
  set data(value) {
    setUint16(0, 13, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptList(value) {
    setUint16(0, 14, this);
    adopt(value, getPointer(0, this));
  }
  _disownList() {
    return disown(this.list);
  }
  get list() {
    testWhich("list", getUint16(0, this), 14, this);
    return getPointer(0, this);
  }
  _hasList() {
    return !isNull4(getPointer(0, this));
  }
  get _isList() {
    return getUint16(0, this) === 14;
  }
  set list(value) {
    setUint16(0, 14, this);
    copyFrom(value, getPointer(0, this));
  }
  get enum() {
    testWhich("enum", getUint16(0, this), 15, this);
    return getUint16(2, this);
  }
  get _isEnum() {
    return getUint16(0, this) === 15;
  }
  set enum(value) {
    setUint16(0, 15, this);
    setUint16(2, value, this);
  }
  _adoptStruct(value) {
    setUint16(0, 16, this);
    adopt(value, getPointer(0, this));
  }
  _disownStruct() {
    return disown(this.struct);
  }
  get struct() {
    testWhich("struct", getUint16(0, this), 16, this);
    return getPointer(0, this);
  }
  _hasStruct() {
    return !isNull4(getPointer(0, this));
  }
  get _isStruct() {
    return getUint16(0, this) === 16;
  }
  set struct(value) {
    setUint16(0, 16, this);
    copyFrom(value, getPointer(0, this));
  }
  get _isInterface() {
    return getUint16(0, this) === 17;
  }
  set interface(_) {
    setUint16(0, 17, this);
  }
  _adoptAnyPointer(value) {
    setUint16(0, 18, this);
    adopt(value, getPointer(0, this));
  }
  _disownAnyPointer() {
    return disown(this.anyPointer);
  }
  get anyPointer() {
    testWhich("anyPointer", getUint16(0, this), 18, this);
    return getPointer(0, this);
  }
  _hasAnyPointer() {
    return !isNull4(getPointer(0, this));
  }
  get _isAnyPointer() {
    return getUint16(0, this) === 18;
  }
  set anyPointer(value) {
    setUint16(0, 18, this);
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Value_" + super.toString();
  }
  which() {
    return getUint16(0, this);
  }
};
var Annotation = class extends Struct {
  static {
    __name(this, "Annotation");
  }
  static {
    __name2(this, "Annotation");
  }
  static _capnp = {
    displayName: "Annotation",
    id: "f1c8950dab257542",
    size: new ObjectSize(8, 2)
  };
  /**
  * ID of the annotation node.
  *
  */
  get id() {
    return getUint64(0, this);
  }
  set id(value) {
    setUint64(0, value, this);
  }
  _adoptBrand(value) {
    adopt(value, getPointer(1, this));
  }
  _disownBrand() {
    return disown(this.brand);
  }
  /**
  * Brand of the annotation.
  *
  * Note that the annotation itself is not allowed to be parameterized, but its scope might be.
  *
  */
  get brand() {
    return getStruct(1, Brand, this);
  }
  _hasBrand() {
    return !isNull4(getPointer(1, this));
  }
  _initBrand() {
    return initStructAt(1, Brand, this);
  }
  set brand(value) {
    copyFrom(value, getPointer(1, this));
  }
  _adoptValue(value) {
    adopt(value, getPointer(0, this));
  }
  _disownValue() {
    return disown(this.value);
  }
  get value() {
    return getStruct(0, Value, this);
  }
  _hasValue() {
    return !isNull4(getPointer(0, this));
  }
  _initValue() {
    return initStructAt(0, Value, this);
  }
  set value(value) {
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Annotation_" + super.toString();
  }
};
var ElementSize = {
  INLINE_COMPOSITE: 7
};
var CapnpVersion = class extends Struct {
  static {
    __name(this, "CapnpVersion");
  }
  static {
    __name2(this, "CapnpVersion");
  }
  static _capnp = {
    displayName: "CapnpVersion",
    id: "d85d305b7d839963",
    size: new ObjectSize(8, 0)
  };
  get major() {
    return getUint16(0, this);
  }
  set major(value) {
    setUint16(0, value, this);
  }
  get minor() {
    return getUint8(2, this);
  }
  set minor(value) {
    setUint8(2, value, this);
  }
  get micro() {
    return getUint8(3, this);
  }
  set micro(value) {
    setUint8(3, value, this);
  }
  toString() {
    return "CapnpVersion_" + super.toString();
  }
};
var CodeGeneratorRequest_RequestedFile_Import = class extends Struct {
  static {
    __name(this, "CodeGeneratorRequest_RequestedFile_Import");
  }
  static {
    __name2(this, "CodeGeneratorRequest_RequestedFile_Import");
  }
  static _capnp = {
    displayName: "Import",
    id: "ae504193122357e5",
    size: new ObjectSize(8, 1)
  };
  /**
  * ID of the imported file.
  *
  */
  get id() {
    return getUint64(0, this);
  }
  set id(value) {
    setUint64(0, value, this);
  }
  /**
  * Name which *this* file used to refer to the foreign file.  This may be a relative name.
  * This information is provided because it might be useful for code generation, e.g. to
  * generate #include directives in C++.  We don't put this in Node.file because this
  * information is only meaningful at compile time anyway.
  *
  * (On Zooko's triangle, this is the import's petname according to the importing file.)
  *
  */
  get name() {
    return getText(0, this);
  }
  set name(value) {
    setText(0, value, this);
  }
  toString() {
    return "CodeGeneratorRequest_RequestedFile_Import_" + super.toString();
  }
};
var CodeGeneratorRequest_RequestedFile = class _CodeGeneratorRequest_RequestedFile extends Struct {
  static {
    __name(this, "_CodeGeneratorRequest_RequestedFile");
  }
  static {
    __name2(this, "CodeGeneratorRequest_RequestedFile");
  }
  static Import = CodeGeneratorRequest_RequestedFile_Import;
  static _capnp = {
    displayName: "RequestedFile",
    id: "cfea0eb02e810062",
    size: new ObjectSize(8, 2)
  };
  static _Imports;
  /**
  * ID of the file.
  *
  */
  get id() {
    return getUint64(0, this);
  }
  set id(value) {
    setUint64(0, value, this);
  }
  /**
  * Name of the file as it appeared on the command-line (minus the src-prefix).  You may use
  * this to decide where to write the output.
  *
  */
  get filename() {
    return getText(0, this);
  }
  set filename(value) {
    setText(0, value, this);
  }
  _adoptImports(value) {
    adopt(value, getPointer(1, this));
  }
  _disownImports() {
    return disown(this.imports);
  }
  /**
  * List of all imported paths seen in this file.
  *
  */
  get imports() {
    return getList(1, _CodeGeneratorRequest_RequestedFile._Imports, this);
  }
  _hasImports() {
    return !isNull4(getPointer(1, this));
  }
  _initImports(length) {
    return initList(1, _CodeGeneratorRequest_RequestedFile._Imports, length, this);
  }
  set imports(value) {
    copyFrom(value, getPointer(1, this));
  }
  toString() {
    return "CodeGeneratorRequest_RequestedFile_" + super.toString();
  }
};
var CodeGeneratorRequest = class _CodeGeneratorRequest extends Struct {
  static {
    __name(this, "_CodeGeneratorRequest");
  }
  static {
    __name2(this, "CodeGeneratorRequest");
  }
  static RequestedFile = CodeGeneratorRequest_RequestedFile;
  static _capnp = {
    displayName: "CodeGeneratorRequest",
    id: "bfc546f6210ad7ce",
    size: new ObjectSize(0, 4)
  };
  static _Nodes;
  static _SourceInfo;
  static _RequestedFiles;
  _adoptCapnpVersion(value) {
    adopt(value, getPointer(2, this));
  }
  _disownCapnpVersion() {
    return disown(this.capnpVersion);
  }
  /**
  * Version of the `capnp` executable. Generally, code generators should ignore this, but the code
  * generators that ship with `capnp` itself will print a warning if this mismatches since that
  * probably indicates something is misconfigured.
  *
  * The first version of 'capnp' to set this was 0.6.0. So, if it's missing, the compiler version
  * is older than that.
  *
  */
  get capnpVersion() {
    return getStruct(2, CapnpVersion, this);
  }
  _hasCapnpVersion() {
    return !isNull4(getPointer(2, this));
  }
  _initCapnpVersion() {
    return initStructAt(2, CapnpVersion, this);
  }
  set capnpVersion(value) {
    copyFrom(value, getPointer(2, this));
  }
  _adoptNodes(value) {
    adopt(value, getPointer(0, this));
  }
  _disownNodes() {
    return disown(this.nodes);
  }
  /**
  * All nodes parsed by the compiler, including for the files on the command line and their
  * imports.
  *
  */
  get nodes() {
    return getList(0, _CodeGeneratorRequest._Nodes, this);
  }
  _hasNodes() {
    return !isNull4(getPointer(0, this));
  }
  _initNodes(length) {
    return initList(0, _CodeGeneratorRequest._Nodes, length, this);
  }
  set nodes(value) {
    copyFrom(value, getPointer(0, this));
  }
  _adoptSourceInfo(value) {
    adopt(value, getPointer(3, this));
  }
  _disownSourceInfo() {
    return disown(this.sourceInfo);
  }
  /**
  * Information about the original source code for each node, where available. This array may be
  * omitted or may be missing some nodes if no info is available for them.
  *
  */
  get sourceInfo() {
    return getList(3, _CodeGeneratorRequest._SourceInfo, this);
  }
  _hasSourceInfo() {
    return !isNull4(getPointer(3, this));
  }
  _initSourceInfo(length) {
    return initList(3, _CodeGeneratorRequest._SourceInfo, length, this);
  }
  set sourceInfo(value) {
    copyFrom(value, getPointer(3, this));
  }
  _adoptRequestedFiles(value) {
    adopt(value, getPointer(1, this));
  }
  _disownRequestedFiles() {
    return disown(this.requestedFiles);
  }
  /**
  * Files which were listed on the command line.
  *
  */
  get requestedFiles() {
    return getList(1, _CodeGeneratorRequest._RequestedFiles, this);
  }
  _hasRequestedFiles() {
    return !isNull4(getPointer(1, this));
  }
  _initRequestedFiles(length) {
    return initList(1, _CodeGeneratorRequest._RequestedFiles, length, this);
  }
  set requestedFiles(value) {
    copyFrom(value, getPointer(1, this));
  }
  toString() {
    return "CodeGeneratorRequest_" + super.toString();
  }
};
Node_SourceInfo._Members = CompositeList(Node_SourceInfo_Member);
Node_Struct._Fields = CompositeList(Field);
Node_Enum._Enumerants = CompositeList(Enumerant);
Node_Interface._Methods = CompositeList(Method);
Node_Interface._Superclasses = CompositeList(Superclass);
Node._Parameters = CompositeList(Node_Parameter);
Node._NestedNodes = CompositeList(Node_NestedNode);
Node._Annotations = CompositeList(Annotation);
Field._Annotations = CompositeList(Annotation);
Enumerant._Annotations = CompositeList(Annotation);
Method._ImplicitParameters = CompositeList(Node_Parameter);
Method._Annotations = CompositeList(Annotation);
Brand_Scope._Bind = CompositeList(Brand_Binding);
Brand._Scopes = CompositeList(Brand_Scope);
CodeGeneratorRequest_RequestedFile._Imports = CompositeList(CodeGeneratorRequest_RequestedFile_Import);
CodeGeneratorRequest._Nodes = CompositeList(Node);
CodeGeneratorRequest._SourceInfo = CompositeList(Node_SourceInfo);
CodeGeneratorRequest._RequestedFiles = CompositeList(CodeGeneratorRequest_RequestedFile);
var GEN_EXPLICIT_DEFAULT_NON_PRIMITIVE = "CAPNP-ES000 Don't know how to generate a %s field with an explicit default value.";
var GEN_FIELD_NON_INLINE_STRUCT_LIST = "CAPNP-ES001 Don't know how to generate non-inline struct lists.";
var GEN_NODE_LOOKUP_FAIL = "CAPNP-ES002 Failed to look up node id %s.";
var GEN_NODE_UNKNOWN_TYPE = `CAPNP-ES003 Don't know how to generate a "%s" node.`;
var GEN_SERIALIZE_UNKNOWN_VALUE = "CAPNP-ES004 Don't know how to serialize a value of kind %s.";
var GEN_UNKNOWN_STRUCT_FIELD = "CAPNP-ES005 Don't know how to generate a struct field of kind %d.";
var GEN_UNKNOWN_TYPE = "CAPNP-ES006 Unknown slot type encountered: %d";
var GEN_UNSUPPORTED_LIST_ELEMENT_TYPE = "CAPNP-ES007 Encountered an unsupported list element type: %d";
var GEN_TS_EMIT_FAILED = "CAPNP-ES009 Failed to transpile emitted schema source code; see above for error messages.";
var GEN_UNKNOWN_DEFAULT = "CAPNP-ES010 Don't know how to generate a default value for %s fields.";
var ConcreteListType = {
  [Type.ANY_POINTER]: "$.AnyPointerList",
  [Type.BOOL]: "$.BoolList",
  [Type.DATA]: "$.DataList",
  [Type.ENUM]: "$.Uint16List",
  [Type.FLOAT32]: "$.Float32List",
  [Type.FLOAT64]: "$.Float64List",
  [Type.INT16]: "$.Int16List",
  [Type.INT32]: "$.Int32List",
  [Type.INT64]: "$.Int64List",
  [Type.INT8]: "$.Int8List",
  [Type.INTERFACE]: "$.InterfaceList",
  [Type.LIST]: "$.PointerList",
  [Type.STRUCT]: "$.CompositeList",
  [Type.TEXT]: "$.TextList",
  [Type.UINT16]: "$.Uint16List",
  [Type.UINT32]: "$.Uint32List",
  [Type.UINT64]: "$.Uint64List",
  [Type.UINT8]: "$.Uint8List",
  [Type.VOID]: "$.VoidList"
};
var Primitives = {
  [Type.BOOL]: {
    byteLength: 1,
    getter: "getBit",
    mask: "getBitMask",
    setter: "setBit"
  },
  [Type.ENUM]: {
    byteLength: 2,
    getter: "getUint16",
    mask: "getUint16Mask",
    setter: "setUint16"
  },
  [Type.FLOAT32]: {
    byteLength: 4,
    getter: "getFloat32",
    mask: "getFloat32Mask",
    setter: "setFloat32"
  },
  [Type.FLOAT64]: {
    byteLength: 8,
    getter: "getFloat64",
    mask: "getFloat64Mask",
    setter: "setFloat64"
  },
  [Type.INT16]: {
    byteLength: 2,
    getter: "getInt16",
    mask: "getInt16Mask",
    setter: "setInt16"
  },
  [Type.INT32]: {
    byteLength: 4,
    getter: "getInt32",
    mask: "getInt32Mask",
    setter: "setInt32"
  },
  [Type.INT64]: {
    byteLength: 8,
    getter: "getInt64",
    mask: "getInt64Mask",
    setter: "setInt64"
  },
  [Type.INT8]: {
    byteLength: 1,
    getter: "getInt8",
    mask: "getInt8Mask",
    setter: "setInt8"
  },
  [Type.UINT16]: {
    byteLength: 2,
    getter: "getUint16",
    mask: "getUint16Mask",
    setter: "setUint16"
  },
  [Type.UINT32]: {
    byteLength: 4,
    getter: "getUint32",
    mask: "getUint32Mask",
    setter: "setUint32"
  },
  [Type.UINT64]: {
    byteLength: 8,
    getter: "getUint64",
    mask: "getUint64Mask",
    setter: "setUint64"
  },
  [Type.UINT8]: {
    byteLength: 1,
    getter: "getUint8",
    mask: "getUint8Mask",
    setter: "setUint8"
  },
  [Type.VOID]: {
    byteLength: 0,
    getter: "getVoid",
    mask: "getVoidMask",
    setter: "setVoid"
  }
};
var SOURCE_COMMENT = `
/* eslint-disable */
// biome-ignore lint: disable

// Generated by storm-capnpc
// Note: Do not edit this file manually - it will be overwritten automatically

`;
var TS_FILE_ID = "e37ded525a68a7c9";
var hex2dec;
var hasRequiredHex2dec;
function requireHex2dec() {
  if (hasRequiredHex2dec) return hex2dec;
  hasRequiredHex2dec = 1;
  function add2(x, y, base) {
    var z = [];
    var n = Math.max(x.length, y.length);
    var carry = 0;
    var i = 0;
    while (i < n || carry) {
      var xi = i < x.length ? x[i] : 0;
      var yi = i < y.length ? y[i] : 0;
      var zi = carry + xi + yi;
      z.push(zi % base);
      carry = Math.floor(zi / base);
      i++;
    }
    return z;
  }
  __name(add2, "add");
  __name2(add2, "add");
  function multiplyByNumber(num, x, base) {
    if (num < 0) return null;
    if (num == 0) return [];
    var result = [];
    var power = x;
    while (true) {
      if (num & 1) {
        result = add2(result, power, base);
      }
      num = num >> 1;
      if (num === 0) break;
      power = add2(power, power, base);
    }
    return result;
  }
  __name(multiplyByNumber, "multiplyByNumber");
  __name2(multiplyByNumber, "multiplyByNumber");
  function parseToDigitsArray(str, base) {
    var digits = str.split("");
    var ary = [];
    for (var i = digits.length - 1; i >= 0; i--) {
      var n = parseInt(digits[i], base);
      if (isNaN(n)) return null;
      ary.push(n);
    }
    return ary;
  }
  __name(parseToDigitsArray, "parseToDigitsArray");
  __name2(parseToDigitsArray, "parseToDigitsArray");
  function convertBase(str, fromBase, toBase) {
    var digits = parseToDigitsArray(str, fromBase);
    if (digits === null) return null;
    var outArray = [];
    var power = [
      1
    ];
    for (var i = 0; i < digits.length; i++) {
      if (digits[i]) {
        outArray = add2(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
      }
      power = multiplyByNumber(fromBase, power, toBase);
    }
    var out = "";
    for (var i = outArray.length - 1; i >= 0; i--) {
      out += outArray[i].toString(toBase);
    }
    if (out === "") {
      out = "0";
    }
    return out;
  }
  __name(convertBase, "convertBase");
  __name2(convertBase, "convertBase");
  function decToHex(decStr, opts) {
    var hidePrefix = opts && opts.prefix === false;
    var hex = convertBase(decStr, 10, 16);
    return hex ? hidePrefix ? hex : "0x" + hex : null;
  }
  __name(decToHex, "decToHex");
  __name2(decToHex, "decToHex");
  function hexToDec(hexStr) {
    if (hexStr.substring(0, 2) === "0x") hexStr = hexStr.substring(2);
    hexStr = hexStr.toLowerCase();
    return convertBase(hexStr, 16, 10);
  }
  __name(hexToDec, "hexToDec");
  __name2(hexToDec, "hexToDec");
  hex2dec = {
    hexToDec,
    decToHex
  };
  return hex2dec;
}
__name(requireHex2dec, "requireHex2dec");
__name2(requireHex2dec, "requireHex2dec");
var hex2decExports = requireHex2dec();
function c2s(s) {
  return splitCamel(s).map((x) => x.toUpperCase()).join("_");
}
__name(c2s, "c2s");
__name2(c2s, "c2s");
function c2t(s) {
  return s[0].toUpperCase() + s.slice(1);
}
__name(c2t, "c2t");
__name2(c2t, "c2t");
function splitCamel(s) {
  let wasLo = false;
  return s.split("").reduce((a, c) => {
    const lo = c.toUpperCase() !== c;
    const up = c.toLowerCase() !== c;
    if (a.length === 0 || wasLo && up) {
      a.push(c);
    } else {
      const i = a.length - 1;
      a[i] = a[i] + c;
    }
    wasLo = lo;
    return a;
  }, []);
}
__name(splitCamel, "splitCamel");
__name2(splitCamel, "splitCamel");
function hexToBigInt(hexString) {
  return BigInt(hex2decExports.hexToDec(hexString));
}
__name(hexToBigInt, "hexToBigInt");
__name2(hexToBigInt, "hexToBigInt");
function compareCodeOrder(a, b) {
  return a.codeOrder - b.codeOrder;
}
__name(compareCodeOrder, "compareCodeOrder");
__name2(compareCodeOrder, "compareCodeOrder");
function getConcreteListType(ctx, type) {
  if (!type._isList) {
    return getJsType(ctx, type, false);
  }
  const { elementType } = type.list;
  const elementTypeWhich = elementType.which();
  if (elementTypeWhich === Type.LIST) {
    return `$.PointerList(${getConcreteListType(ctx, elementType)})`;
  } else if (elementTypeWhich === Type.STRUCT) {
    const structNode = lookupNode(ctx, elementType.struct.typeId);
    if (structNode.struct.preferredListEncoding !== ElementSize.INLINE_COMPOSITE) {
      throw new Error(GEN_FIELD_NON_INLINE_STRUCT_LIST);
    }
    return `$.CompositeList(${getJsType(ctx, elementType, false)})`;
  }
  return ConcreteListType[elementTypeWhich];
}
__name(getConcreteListType, "getConcreteListType");
__name2(getConcreteListType, "getConcreteListType");
function getDisplayNamePrefix(node) {
  return node.displayName.slice(node.displayNamePrefixLength);
}
__name(getDisplayNamePrefix, "getDisplayNamePrefix");
__name2(getDisplayNamePrefix, "getDisplayNamePrefix");
function getFullClassName(node) {
  return node.displayName.split(":")[1].split(".").map((s) => c2t(s)).join("_");
}
__name(getFullClassName, "getFullClassName");
__name2(getFullClassName, "getFullClassName");
function getJsType(ctx, type, constructor) {
  const whichType = type.which();
  switch (whichType) {
    case Type.ANY_POINTER: {
      return "$.Pointer";
    }
    case Type.BOOL: {
      return "boolean";
    }
    case Type.DATA: {
      return "$.Data";
    }
    case Type.ENUM: {
      return getFullClassName(lookupNode(ctx, type.enum.typeId));
    }
    case Type.FLOAT32:
    case Type.FLOAT64:
    case Type.INT16:
    case Type.INT32:
    case Type.INT8:
    case Type.UINT16:
    case Type.UINT32:
    case Type.UINT8: {
      return "number";
    }
    case Type.UINT64:
    case Type.INT64: {
      return "bigint";
    }
    case Type.INTERFACE: {
      return getFullClassName(lookupNode(ctx, type.interface.typeId));
    }
    case Type.LIST: {
      return `$.List${constructor ? "Ctor" : ""}<${getJsType(ctx, type.list.elementType, false)}>`;
    }
    case Type.STRUCT: {
      const c = getFullClassName(lookupNode(ctx, type.struct.typeId));
      return constructor ? `$.StructCtor<${c}>` : c;
    }
    case Type.TEXT: {
      return "string";
    }
    case Type.VOID: {
      return "$.Void";
    }
    default: {
      throw new Error(format2(GEN_UNKNOWN_TYPE, whichType));
    }
  }
}
__name(getJsType, "getJsType");
__name2(getJsType, "getJsType");
function getUnnamedUnionFields(node) {
  return node.struct.fields.filter((field) => field.discriminantValue !== Field.NO_DISCRIMINANT);
}
__name(getUnnamedUnionFields, "getUnnamedUnionFields");
__name2(getUnnamedUnionFields, "getUnnamedUnionFields");
function hasNode(ctx, lookup) {
  const id = typeof lookup === "bigint" ? lookup : lookup.id;
  return ctx.nodes.some((n) => n.id === id);
}
__name(hasNode, "hasNode");
__name2(hasNode, "hasNode");
function loadRequestedFile(req, file) {
  const ctx = new CodeGeneratorFileContext(req, file);
  const schema2 = lookupNode(ctx, file.id);
  ctx.tsPath = schema2.displayName.replace(/\.capnp$/, "") + ".ts";
  return ctx;
}
__name(loadRequestedFile, "loadRequestedFile");
__name2(loadRequestedFile, "loadRequestedFile");
function lookupNode(ctx, lookup) {
  const id = typeof lookup === "bigint" ? lookup : lookup.id;
  const node = ctx.nodes.find((n) => n.id === id);
  if (node === void 0) {
    throw new Error(format2(GEN_NODE_LOOKUP_FAIL, id));
  }
  return node;
}
__name(lookupNode, "lookupNode");
__name2(lookupNode, "lookupNode");
function lookupNodeSourceInfo(ctx, lookup) {
  const id = typeof lookup === "bigint" ? lookup : lookup.id;
  return ctx.req.sourceInfo.find((s) => s.id === id);
}
__name(lookupNodeSourceInfo, "lookupNodeSourceInfo");
__name2(lookupNodeSourceInfo, "lookupNodeSourceInfo");
function needsConcreteListClass(field) {
  if (!field._isSlot) {
    return false;
  }
  const slotType = field.slot.type;
  if (!slotType._isList) {
    return false;
  }
  const { elementType } = slotType.list;
  return elementType._isStruct || elementType._isList;
}
__name(needsConcreteListClass, "needsConcreteListClass");
__name2(needsConcreteListClass, "needsConcreteListClass");
function createBigInt(value) {
  let v = value.toString(16);
  let sign = "";
  if (v[0] === "-") {
    v = v.slice(1);
    sign = "-";
  }
  return `${sign}BigInt("0x${v}")`;
}
__name(createBigInt, "createBigInt");
__name2(createBigInt, "createBigInt");
function extractJSDocs(sourceInfo) {
  const docComment = sourceInfo?.docComment;
  if (!docComment) {
    return "";
  }
  return "/**\n" + docComment.toString().split("\n").map((l) => `* ${l}`).join("\n") + "\n*/";
}
__name(extractJSDocs, "extractJSDocs");
__name2(extractJSDocs, "extractJSDocs");
function generateEnumNode(ctx, className, parentNode, fields) {
  const fieldIndexInCodeOrder = fields.map(({ codeOrder }, fieldIndex) => ({
    fieldIndex,
    codeOrder
  })).sort(compareCodeOrder).map(({ fieldIndex }) => fieldIndex);
  const sourceInfo = lookupNodeSourceInfo(ctx, parentNode);
  const propInits = fieldIndexInCodeOrder.map((index) => {
    const field = fields[index];
    const docComment = extractJSDocs(sourceInfo?.members.at(index));
    const key = c2s(field.name);
    const val = field.discriminantValue || index;
    return `
      ${docComment}
      ${key}: ${val}`;
  });
  ctx.codeParts.push(`
    export const ${className} = {
      ${propInits.join(",\n")}
    } as const;

    export type ${className} = (typeof ${className})[keyof typeof ${className}];
  `);
}
__name(generateEnumNode, "generateEnumNode");
__name2(generateEnumNode, "generateEnumNode");
function generateInterfaceClasses(ctx, node) {
  generateMethodStructs(ctx, node);
  generateClient(ctx, node);
  generateServer(ctx, node);
}
__name(generateInterfaceClasses, "generateInterfaceClasses");
__name2(generateInterfaceClasses, "generateInterfaceClasses");
function generateMethodStructs(ctx, node) {
  for (const method of node.interface.methods) {
    const paramNode = lookupNode(ctx, method.paramStructType);
    const resultNode = lookupNode(ctx, method.resultStructType);
    generateNode(ctx, paramNode);
    generateNode(ctx, resultNode);
    generateResultPromise(ctx, resultNode);
  }
}
__name(generateMethodStructs, "generateMethodStructs");
__name2(generateMethodStructs, "generateMethodStructs");
function generateServer(ctx, node) {
  const fullClassName = getFullClassName(node);
  const serverName = `${fullClassName}$Server`;
  const serverTargetName = `${serverName}$Target`;
  const clientName = `${fullClassName}$Client`;
  const methodSignatures = node.interface.methods.map((method) => {
    const paramTypeName = getFullClassName(lookupNode(ctx, method.paramStructType));
    const resultTypeName = getFullClassName(lookupNode(ctx, method.resultStructType));
    return `${method.name}(params: ${paramTypeName}, results: ${resultTypeName}): Promise<void>;`;
  }).join("\n");
  ctx.codeParts.push(`
  export interface ${serverTargetName} {
    ${methodSignatures}
  }`);
  const members = [];
  members.push(`public override readonly target: ${serverTargetName};`);
  const codeServerMethods = [];
  let index = 0;
  for (const method of node.interface.methods) {
    codeServerMethods.push(`{
        ...${clientName}.methods[${index}],
        impl: target.${method.name}
      }`);
    index++;
  }
  members.push(`
      constructor(target: ${serverTargetName}) {
        super(target, [
          ${codeServerMethods.join(",\n")}
        ]);
        this.target = target;
      }
      client(): ${clientName} {
        return new ${clientName}(this);
      }
  `);
  ctx.codeParts.push(`
    export class ${serverName} extends $.Server {
      ${members.join("\n")}
    }
  `);
}
__name(generateServer, "generateServer");
__name2(generateServer, "generateServer");
function generateClient(ctx, node) {
  const fullClassName = getFullClassName(node);
  const clientName = `${fullClassName}$Client`;
  const members = [];
  members.push(`
    client: $.Client;
    static readonly interfaceId: bigint = ${createBigInt(node.id)};
    constructor(client: $.Client) {
      this.client = client;
    }
  `);
  const methods = [];
  const methodDefs = [];
  const methodDefTypes = [];
  for (let index = 0; index < node.interface.methods.length; index++) {
    generateClientMethod(ctx, node, clientName, methods, methodDefs, methodDefTypes, index);
  }
  members.push(`
    static readonly methods:[
      ${methodDefTypes.join(",\n")}
    ] = [
      ${methodDefs.join(",\n")}
    ];
    ${methods.join("\n")}
    `);
  ctx.codeParts.push(`
    export class ${clientName} {
      ${members.join("\n")}
    }
    $.Registry.register(${clientName}.interfaceId, ${clientName});
  `);
}
__name(generateClient, "generateClient");
__name2(generateClient, "generateClient");
function generateResultPromise(ctx, node) {
  const nodeId = node.id;
  if (ctx.generatedResultsPromiseIds.has(nodeId)) {
    return;
  }
  ctx.generatedResultsPromiseIds.add(nodeId);
  const resultsClassName = getFullClassName(node);
  const fullClassName = `${resultsClassName}$Promise`;
  const members = [];
  members.push(`
    pipeline: $.Pipeline<any, any, ${resultsClassName}>;
    constructor(pipeline: $.Pipeline<any, any, ${resultsClassName}>) {
      this.pipeline = pipeline;
    }
  `);
  const { struct } = node;
  const fields = struct.fields.toArray().sort(compareCodeOrder);
  const generatePromiseFieldMethod = /* @__PURE__ */ __name2((field) => {
    let jsType;
    let isInterface2 = false;
    let slot;
    if (field._isSlot) {
      slot = field.slot;
      const slotType = slot.type;
      if (slotType.which() !== Type.INTERFACE) {
        return;
      }
      isInterface2 = true;
      jsType = getJsType(ctx, slotType, false);
    } else if (field._isGroup) {
      return;
    } else {
      throw new Error(format2(GEN_UNKNOWN_STRUCT_FIELD, field.which()));
    }
    const promisedJsType = jsType;
    if (isInterface2) {
      jsType = `${jsType}$Client`;
    }
    const { name } = field;
    const properName = c2t(name);
    members.push(`
      get${properName}(): ${jsType} {
        return new ${jsType}(this.pipeline.getPipeline(${promisedJsType}, ${slot.offset}).client());
      }
    `);
  }, "generatePromiseFieldMethod");
  for (const field of fields) {
    generatePromiseFieldMethod(field);
  }
  members.push(`
    async promise(): Promise<${resultsClassName}> {
      return await this.pipeline.struct();
    }
  `);
  ctx.codeParts.push(`
    export class ${fullClassName} {
      ${members.join("\n")}
    }
  `);
}
__name(generateResultPromise, "generateResultPromise");
__name2(generateResultPromise, "generateResultPromise");
function generateClientMethod(ctx, node, clientName, methodsCode, methodDefs, methodDefTypes, index) {
  const method = node.interface.methods[index];
  const { name } = method;
  const paramTypeName = getFullClassName(lookupNode(ctx, method.paramStructType));
  const resultTypeName = getFullClassName(lookupNode(ctx, method.resultStructType));
  methodDefTypes.push(`$.Method<${paramTypeName}, ${resultTypeName}>`);
  methodDefs.push(`{
    ParamsClass: ${paramTypeName},
    ResultsClass: ${resultTypeName},
    interfaceId: ${clientName}.interfaceId,
    methodId: ${index},
    interfaceName: "${node.displayName}",
    methodName: "${method.name}"
  }`);
  const docComment = extractJSDocs(lookupNodeSourceInfo(ctx, node)?.members.at(index));
  methodsCode.push(`
    ${docComment}
    ${name}(paramsFunc?: (params: ${paramTypeName}) => void): ${resultTypeName}$Promise {
      const answer = this.client.call({
        method: ${clientName}.methods[${index}],
        paramsFunc: paramsFunc
      });
      const pipeline = new $.Pipeline(${resultTypeName}, answer);
      return new ${resultTypeName}$Promise(pipeline);
    }
  `);
}
__name(generateClientMethod, "generateClientMethod");
__name2(generateClientMethod, "generateClientMethod");
function generateStructNode(ctx, node) {
  const displayNamePrefix = getDisplayNamePrefix(node);
  const fullClassName = getFullClassName(node);
  const nestedNodes = node.nestedNodes.map(({ id }) => lookupNode(ctx, id)).filter((node2) => !node2._isConst && !node2._isAnnotation);
  const nodeId = node.id;
  const nodeIdHex = nodeId.toString(16);
  const unionFields = getUnnamedUnionFields(node);
  const { struct } = node;
  const { dataWordCount, discriminantCount, discriminantOffset, pointerCount } = struct;
  const dataByteLength = dataWordCount * 8;
  const fields = struct.fields.toArray();
  const fieldIndexInCodeOrder = fields.map(({ codeOrder }, fieldIndex) => ({
    fieldIndex,
    codeOrder
  })).sort(compareCodeOrder).map(({ fieldIndex }) => fieldIndex);
  const concreteLists = fields.filter((field) => needsConcreteListClass(field)).sort(compareCodeOrder);
  const consts = ctx.nodes.filter((node2) => node2.scopeId === nodeId && node2._isConst);
  const hasUnnamedUnion = discriminantCount !== 0;
  if (hasUnnamedUnion) {
    generateEnumNode(ctx, fullClassName + "_Which", node, unionFields);
  }
  const members = [];
  members.push(...consts.map((node2) => {
    const name = c2s(getDisplayNamePrefix(node2));
    const value = createValue(node2.const.value);
    return `static readonly ${name} = ${value}`;
  }), ...unionFields.sort(compareCodeOrder).map((field) => createUnionConstProperty(fullClassName, field)), ...nestedNodes.map((node2) => createNestedNodeProperty(node2)));
  const defaultValues = [];
  for (const index of fieldIndexInCodeOrder) {
    const field = fields[index];
    if (field._isSlot && field.slot.hadExplicitDefault && field.slot.type.which() !== Type.VOID) {
      defaultValues.push(generateDefaultValue(field));
    }
  }
  members.push(`
      public static override readonly _capnp = {
        displayName: "${displayNamePrefix}",
        id: "${nodeIdHex}",
        size: new $.ObjectSize(${dataByteLength}, ${pointerCount}),
        ${defaultValues.join(",")}
      }`, ...concreteLists.map((field) => createConcreteListProperty(ctx, field)));
  for (const index of fieldIndexInCodeOrder) {
    const field = fields[index];
    generateStructFieldMethods(ctx, members, node, field, index);
  }
  members.push(`public override toString(): string { return "${fullClassName}_" + super.toString(); }`);
  if (hasUnnamedUnion) {
    members.push(`
      which(): ${fullClassName}_Which {
        return $.utils.getUint16(${discriminantOffset * 2}, this) as ${fullClassName}_Which;
      }
    `);
  }
  const docComment = extractJSDocs(lookupNodeSourceInfo(ctx, node));
  const classCode = `
  ${docComment}
  export class ${fullClassName} extends $.Struct {
    ${members.join("\n")}
  }`;
  ctx.codeParts.push(classCode);
  ctx.concreteLists.push(...concreteLists.map((field) => [
    fullClassName,
    field
  ]));
}
__name(generateStructNode, "generateStructNode");
__name2(generateStructNode, "generateStructNode");
function generateStructFieldMethods(ctx, members, node, field, fieldIndex) {
  let jsType;
  let whichType;
  if (field._isSlot) {
    const slotType = field.slot.type;
    jsType = getJsType(ctx, slotType, false);
    whichType = slotType.which();
  } else if (field._isGroup) {
    jsType = getFullClassName(lookupNode(ctx, field.group.typeId));
    whichType = "group";
  } else {
    throw new Error(format2(GEN_UNKNOWN_STRUCT_FIELD, field.which()));
  }
  const isInterface2 = whichType === Type.INTERFACE;
  if (isInterface2) {
    jsType = `${jsType}$Client`;
  }
  const { discriminantOffset } = node.struct;
  const { name } = field;
  const accessorName = name === "constructor" ? "$constructor" : name;
  const capitalizedName = c2t(name);
  const { discriminantValue } = field;
  const fullClassName = getFullClassName(node);
  const hadExplicitDefault = field._isSlot && field.slot.hadExplicitDefault;
  const maybeDefaultArg = hadExplicitDefault ? `, ${fullClassName}._capnp.default${capitalizedName}` : "";
  const union = discriminantValue !== Field.NO_DISCRIMINANT;
  const offset = field._isSlot ? field.slot.offset : 0;
  let adopt2 = false;
  let disown2 = false;
  let has = false;
  let init;
  let get;
  let set;
  switch (whichType) {
    case Type.ANY_POINTER: {
      adopt2 = true;
      disown2 = true;
      has = true;
      get = `$.utils.getPointer(${offset}, this${maybeDefaultArg})`;
      set = `$.utils.copyFrom(value, ${get})`;
      break;
    }
    case Type.BOOL:
    case Type.ENUM:
    case Type.FLOAT32:
    case Type.FLOAT64:
    case Type.INT16:
    case Type.INT32:
    case Type.INT64:
    case Type.INT8:
    case Type.UINT16:
    case Type.UINT32:
    case Type.UINT64:
    case Type.UINT8: {
      const { byteLength, getter, setter } = Primitives[whichType];
      const byteOffset = offset * byteLength;
      get = `$.utils.${getter}(${byteOffset}, this${maybeDefaultArg})`;
      set = `$.utils.${setter}(${byteOffset}, value, this${maybeDefaultArg})`;
      if (whichType === Type.ENUM) {
        get = `${get} as ${jsType}`;
      }
      break;
    }
    case Type.DATA: {
      adopt2 = true;
      disown2 = true;
      has = true;
      get = `$.utils.getData(${offset}, this${maybeDefaultArg})`;
      set = `$.utils.copyFrom(value, $.utils.getPointer(${offset}, this))`;
      init = `$.utils.initData(${offset}, length, this)`;
      break;
    }
    case Type.INTERFACE: {
      get = `new ${jsType}($.utils.getInterfaceClientOrNullAt(${offset}, this))`;
      set = `$.utils.setInterfacePointer(this.segment.message.addCap(value.client), $.utils.getPointer(${offset}, this))`;
      break;
    }
    case Type.LIST: {
      const elementType = field.slot.type.list.elementType.which();
      let listClass = ConcreteListType[elementType];
      if (elementType === Type.LIST || elementType === Type.STRUCT) {
        listClass = `${fullClassName}._${capitalizedName}`;
      } else if (listClass === void 0) {
        throw new Error(format2(GEN_UNSUPPORTED_LIST_ELEMENT_TYPE, elementType));
      }
      adopt2 = true;
      disown2 = true;
      has = true;
      get = `$.utils.getList(${offset}, ${listClass}, this${maybeDefaultArg})`;
      set = `$.utils.copyFrom(value, $.utils.getPointer(${offset}, this))`;
      init = `$.utils.initList(${offset}, ${listClass}, length, this)`;
      if (elementType === Type.ENUM) {
        get = `${get} as ${jsType}`;
        init = `${init} as ${jsType}`;
      }
      break;
    }
    case Type.STRUCT: {
      adopt2 = true;
      disown2 = true;
      has = true;
      get = `$.utils.getStruct(${offset}, ${jsType}, this${maybeDefaultArg})`;
      set = `$.utils.copyFrom(value, $.utils.getPointer(${offset}, this))`;
      init = `$.utils.initStructAt(${offset}, ${jsType}, this)`;
      break;
    }
    case Type.TEXT: {
      get = `$.utils.getText(${offset}, this${maybeDefaultArg})`;
      set = `$.utils.setText(${offset}, value, this)`;
      break;
    }
    case Type.VOID: {
      break;
    }
    case "group": {
      if (hadExplicitDefault) {
        throw new Error(format2(GEN_EXPLICIT_DEFAULT_NON_PRIMITIVE, "group"));
      }
      get = `$.utils.getAs(${jsType}, this)`;
      init = get;
      break;
    }
  }
  if (adopt2) {
    members.push(`
      _adopt${capitalizedName}(value: $.Orphan<${jsType}>): void {
        ${union ? `$.utils.setUint16(${discriminantOffset * 2}, ${discriminantValue}, this);` : ""}
        $.utils.adopt(value, $.utils.getPointer(${offset}, this));
      }
    `);
  }
  if (disown2) {
    members.push(`
      _disown${capitalizedName}(): $.Orphan<${jsType}> {
        return $.utils.disown(this.${name === "constructor" ? `$${name}` : name});
      }
    `);
  }
  if (get) {
    const docComment = extractJSDocs(lookupNodeSourceInfo(ctx, node)?.members.at(fieldIndex));
    members.push(`
      ${docComment}
      get ${accessorName}(): ${jsType} {
        ${union ? `$.utils.testWhich(${JSON.stringify(name)}, $.utils.getUint16(${discriminantOffset * 2}, this), ${discriminantValue}, this);` : ""}
        return ${get};
      }
    `);
  }
  if (has) {
    members.push(`
      _has${capitalizedName}(): boolean {
        return !$.utils.isNull($.utils.getPointer(${offset}, this));
      }
    `);
  }
  if (init) {
    const params = whichType === Type.DATA || whichType === Type.LIST ? `length: number` : "";
    members.push(`
      _init${capitalizedName}(${params}): ${jsType} {
        ${union ? `$.utils.setUint16(${discriminantOffset * 2}, ${discriminantValue}, this);` : ""}
        return ${init};
      }
    `);
  }
  if (union) {
    members.push(`
      get _is${capitalizedName}(): boolean {
        return $.utils.getUint16(${discriminantOffset * 2}, this) === ${discriminantValue};
      }
    `);
  }
  if (set || union) {
    const param = set ? `value: ${jsType}` : `_: true`;
    members.push(`
      set ${accessorName}(${param}) {
        ${union ? `$.utils.setUint16(${discriminantOffset * 2}, ${discriminantValue}, this);` : ""}
        ${set ? `${set};` : ""}
      }
    `);
  }
}
__name(generateStructFieldMethods, "generateStructFieldMethods");
__name2(generateStructFieldMethods, "generateStructFieldMethods");
function generateDefaultValue(field) {
  const { name, slot } = field;
  const whichSlotType = slot.type.which();
  const primitive = Primitives[whichSlotType];
  let initializer;
  switch (whichSlotType) {
    case Type_Which.ANY_POINTER:
    case Type_Which.DATA:
    case Type_Which.LIST:
    case Type_Which.STRUCT:
    case Type_Which.INTERFACE: {
      initializer = createValue(slot.defaultValue);
      break;
    }
    case Type_Which.TEXT: {
      initializer = JSON.stringify(slot.defaultValue.text);
      break;
    }
    case Type_Which.BOOL: {
      const value = createValue(slot.defaultValue);
      const bitOffset = slot.offset % 8;
      initializer = `$.${primitive.mask}(${value}, ${bitOffset})`;
      break;
    }
    case Type_Which.ENUM:
    case Type_Which.FLOAT32:
    case Type_Which.FLOAT64:
    case Type_Which.INT16:
    case Type_Which.INT32:
    case Type_Which.INT64:
    case Type_Which.INT8:
    case Type_Which.UINT16:
    case Type_Which.UINT32:
    case Type_Which.UINT64:
    case Type_Which.UINT8: {
      const value = createValue(slot.defaultValue);
      initializer = `$.${primitive.mask}(${value})`;
      break;
    }
    default: {
      throw new Error(format2(GEN_UNKNOWN_DEFAULT, whichSlotType));
    }
  }
  return `default${c2t(name)}: ${initializer}`;
}
__name(generateDefaultValue, "generateDefaultValue");
__name2(generateDefaultValue, "generateDefaultValue");
function createConcreteListProperty(ctx, field) {
  const name = `_${c2t(field.name)}`;
  const type = getJsType(ctx, field.slot.type, true);
  return `static ${name}: ${type};`;
}
__name(createConcreteListProperty, "createConcreteListProperty");
__name2(createConcreteListProperty, "createConcreteListProperty");
function createUnionConstProperty(fullClassName, field) {
  const name = c2s(field.name);
  const initializer = `${fullClassName}_Which.${name}`;
  return `static readonly ${name} = ${initializer};`;
}
__name(createUnionConstProperty, "createUnionConstProperty");
__name2(createUnionConstProperty, "createUnionConstProperty");
function createValue(value) {
  let p;
  switch (value.which()) {
    case Value.BOOL: {
      return value.bool ? `true` : `false`;
    }
    case Value.ENUM: {
      return String(value.enum);
    }
    case Value.FLOAT32: {
      return String(value.float32);
    }
    case Value.FLOAT64: {
      return String(value.float64);
    }
    case Value.INT8: {
      return String(value.int8);
    }
    case Value.INT16: {
      return String(value.int16);
    }
    case Value.INT32: {
      return String(value.int32);
    }
    case Value.INT64: {
      return createBigInt(value.int64);
    }
    case Value.UINT8: {
      return String(value.uint8);
    }
    case Value.UINT16: {
      return String(value.uint16);
    }
    case Value.UINT32: {
      return String(value.uint32);
    }
    case Value.UINT64: {
      return createBigInt(value.uint64);
    }
    case Value.TEXT: {
      return JSON.stringify(value.text);
    }
    case Value.VOID: {
      return "undefined";
    }
    case Value.ANY_POINTER: {
      p = value.anyPointer;
      break;
    }
    case Value.DATA: {
      p = value.data;
      break;
    }
    case Value.LIST: {
      p = value.list;
      break;
    }
    case Value.STRUCT: {
      p = value.struct;
      break;
    }
    case Value.INTERFACE: {
      testWhich("interface", getUint16(0, value), 17, value);
      p = getPointer(0, value);
      break;
    }
    default: {
      throw new Error(format2(GEN_SERIALIZE_UNKNOWN_VALUE, value.which()));
    }
  }
  const message = new Message();
  message.setRoot(p);
  const buf = new Uint8Array(message.toPackedArrayBuffer());
  const values = [];
  for (let i = 0; i < buf.byteLength; i++) {
    values.push(`0x${pad(buf[i].toString(16), 2)}`);
  }
  return `$.readRawPointer(new Uint8Array([${values.join(",")}]).buffer)`;
}
__name(createValue, "createValue");
__name2(createValue, "createValue");
function createNestedNodeProperty(node) {
  const name = getDisplayNamePrefix(node);
  const initializer = getFullClassName(node);
  return `static readonly ${name} = ${initializer};`;
}
__name(createNestedNodeProperty, "createNestedNodeProperty");
__name2(createNestedNodeProperty, "createNestedNodeProperty");
function generateInterfaceNode(ctx, node) {
  const displayNamePrefix = getDisplayNamePrefix(node);
  const fullClassName = getFullClassName(node);
  const nestedNodes = node.nestedNodes.map((n) => lookupNode(ctx, n)).filter((n) => !n._isConst && !n._isAnnotation);
  const nodeId = node.id;
  const nodeIdHex = nodeId.toString(16);
  const consts = ctx.nodes.filter((n) => n.scopeId === nodeId && n._isConst);
  const members = [];
  members.push(...consts.map((node2) => {
    const name = c2s(getDisplayNamePrefix(node2));
    const value = createValue(node2.const.value);
    return `static readonly ${name} = ${value}`;
  }), ...nestedNodes.map((node2) => createNestedNodeProperty(node2)), `static readonly Client = ${fullClassName}$Client;
     static readonly Server = ${fullClassName}$Server;
     public static override readonly _capnp = {
        displayName: "${displayNamePrefix}",
        id: "${nodeIdHex}",
        size: new $.ObjectSize(0, 0),
      }
    public override toString(): string { return "${fullClassName}_" + super.toString(); }`);
  const docComment = extractJSDocs(lookupNodeSourceInfo(ctx, node));
  const classCode = `
  ${docComment}
  export class ${fullClassName} extends $.Interface {
    ${members.join("\n")}
  }`;
  generateInterfaceClasses(ctx, node);
  ctx.codeParts.push(classCode);
}
__name(generateInterfaceNode, "generateInterfaceNode");
__name2(generateInterfaceNode, "generateInterfaceNode");
function generateNode(ctx, node) {
  const nodeId = node.id;
  const nodeIdHex = nodeId.toString(16);
  if (ctx.generatedNodeIds.has(nodeIdHex)) {
    return;
  }
  ctx.generatedNodeIds.add(nodeIdHex);
  const nestedNodes = node.nestedNodes.map((node2) => lookupNode(ctx, node2));
  for (const nestedNode of nestedNodes) {
    generateNode(ctx, nestedNode);
  }
  const groupNodes = ctx.nodes.filter((node2) => node2.scopeId === nodeId && node2._isStruct && node2.struct.isGroup);
  for (const groupNode of groupNodes) {
    generateNode(ctx, groupNode);
  }
  const nodeType = node.which();
  switch (nodeType) {
    case Node.STRUCT: {
      generateStructNode(ctx, node);
      break;
    }
    case Node.CONST: {
      break;
    }
    case Node.ENUM: {
      generateEnumNode(ctx, getFullClassName(node), node, node.enum.enumerants.toArray());
      break;
    }
    case Node.INTERFACE: {
      generateInterfaceNode(ctx, node);
      break;
    }
    case Node.ANNOTATION: {
      break;
    }
    // case s.Node.FILE:
    default: {
      throw new Error(format2(GEN_NODE_UNKNOWN_TYPE, nodeType));
    }
  }
}
__name(generateNode, "generateNode");
__name2(generateNode, "generateNode");
var CodeGeneratorContext = class {
  static {
    __name(this, "CodeGeneratorContext");
  }
  static {
    __name2(this, "CodeGeneratorContext");
  }
  files = [];
};
var CodeGeneratorFileContext = class {
  static {
    __name(this, "CodeGeneratorFileContext");
  }
  static {
    __name2(this, "CodeGeneratorFileContext");
  }
  constructor(req, file) {
    this.req = req;
    this.file = file;
    this.nodes = req.nodes.toArray();
    this.imports = file.imports.toArray();
  }
  // inputs
  nodes;
  imports;
  // outputs
  concreteLists = [];
  generatedNodeIds = /* @__PURE__ */ new Set();
  generatedResultsPromiseIds = /* @__PURE__ */ new Set();
  tsPath = "";
  codeParts = [];
  toString() {
    return this.file?.filename ?? "CodeGeneratorFileContext()";
  }
};
function generateFileId(ctx) {
  ctx.codeParts.push(`export const _capnpFileId = BigInt("0x${ctx.file.id.toString(16)}");`);
}
__name(generateFileId, "generateFileId");
__name2(generateFileId, "generateFileId");
function generateConcreteListInitializer(ctx, fullClassName, field) {
  const name = `_${c2t(field.name)}`;
  const type = getConcreteListType(ctx, field.slot.type);
  ctx.codeParts.push(`${fullClassName}.${name} = ${type};`);
}
__name(generateConcreteListInitializer, "generateConcreteListInitializer");
__name2(generateConcreteListInitializer, "generateConcreteListInitializer");
function generateCapnpImport(ctx) {
  const fileNode = lookupNode(ctx, ctx.file);
  const tsFileId = hexToBigInt(TS_FILE_ID);
  const tsAnnotationFile = ctx.nodes.find((n) => n.id === tsFileId);
  const tsImportPathAnnotation = tsAnnotationFile?.nestedNodes.find((n) => n.name === "importPath");
  const importAnnotation = tsImportPathAnnotation && fileNode.annotations.find((a) => a.id === tsImportPathAnnotation.id);
  const importPath = importAnnotation === void 0 ? "@stryke/capnp" : importAnnotation.value.text;
  ctx.codeParts.push(`import * as $ from '${importPath}';`);
}
__name(generateCapnpImport, "generateCapnpImport");
__name2(generateCapnpImport, "generateCapnpImport");
function generateNestedImports(ctx) {
  for (const imp of ctx.imports) {
    const { name } = imp;
    let importPath;
    if (name.startsWith("/capnp/")) {
      importPath = `@stryke/capnp/schemas/${name.slice(7).replace(/\.capnp$/, "")}`;
    } else {
      importPath = name.replace(/\.capnp$/, "");
      if (importPath[0] !== ".") {
        importPath = `./${importPath}`;
      }
    }
    const importNode = lookupNode(ctx, imp);
    const imports = getImportNodes(ctx, importNode).flatMap((node) => {
      const fullClassName = getFullClassName(node);
      if (node._isInterface) {
        return [
          fullClassName,
          `${fullClassName}$Client`
        ];
      }
      return fullClassName;
    }).sort().join(", ");
    if (imports.length === 0) {
      continue;
    }
    ctx.codeParts.push(`import { ${imports} } from "${importPath}";`);
  }
}
__name(generateNestedImports, "generateNestedImports");
__name2(generateNestedImports, "generateNestedImports");
function getImportNodes(ctx, node, visitedIds = /* @__PURE__ */ new Set()) {
  visitedIds.add(node.id);
  const nestedNodes = node.nestedNodes.filter(({ id }) => hasNode(ctx, id));
  const newNestedNodes = nestedNodes.filter(({ id }) => !visitedIds.has(id));
  const nodes = newNestedNodes.map(({ id }) => lookupNode(ctx, id)).filter((node2) => node2._isStruct || node2._isEnum || node2._isInterface);
  return nodes.concat(nodes.flatMap((node2) => getImportNodes(ctx, node2, visitedIds)));
}
__name(getImportNodes, "getImportNodes");
__name2(getImportNodes, "getImportNodes");
async function compileAll(codeGenRequest, opts) {
  const req = new Message(codeGenRequest, false).getRoot(CodeGeneratorRequest);
  const ctx = new CodeGeneratorContext();
  ctx.files = req.requestedFiles.map((file) => loadRequestedFile(req, file));
  if (ctx.files.length === 0) {
    throw new Error(GEN_NO_FILES);
  }
  const files = new Map(ctx.files.map((file) => [
    file.tsPath,
    compileFile(file)
  ]));
  if (files.size === 0) {
    throw new Error(GEN_NO_FILES);
  }
  if (opts?.dts === true || opts?.js === true) {
    tsCompile(files, opts?.dts === true, opts?.js === true, opts?.tsconfig);
  }
  if (!opts?.ts) {
    for (const [fileName] of files) {
      if (fileName.endsWith(".ts") && !fileName.endsWith(".d.ts")) {
        files.delete(fileName);
      }
    }
  }
  return {
    ctx,
    files
  };
}
__name(compileAll, "compileAll");
__name2(compileAll, "compileAll");
function compileFile(ctx) {
  generateCapnpImport(ctx);
  generateNestedImports(ctx);
  generateFileId(ctx);
  const nestedNodes = lookupNode(ctx, ctx.file).nestedNodes.map((n) => lookupNode(ctx, n));
  for (const node of nestedNodes) {
    generateNode(ctx, node);
  }
  for (const [fullClassName, field] of ctx.concreteLists) {
    generateConcreteListInitializer(ctx, fullClassName, field);
  }
  const sourceFile = ts__default.default.createSourceFile(ctx.tsPath, ctx.codeParts.map((p) => p.toString()).join(""), ts__default.default.ScriptTarget.Latest, false, ts__default.default.ScriptKind.TS);
  return SOURCE_COMMENT + ts__default.default.createPrinter().printFile(sourceFile);
}
__name(compileFile, "compileFile");
__name2(compileFile, "compileFile");
function tsCompile(files, dts, js, tsconfig) {
  if (!dts && !js) {
    return;
  }
  const compileOptions = {
    moduleResolution: ts__default.default.ModuleResolutionKind.Bundler,
    target: ts__default.default.ScriptTarget.ESNext,
    strict: true,
    ...tsconfig,
    noEmitOnError: false,
    noFallthroughCasesInSwitch: true,
    preserveConstEnums: true,
    noImplicitReturns: true,
    noUnusedLocals: false,
    noUnusedParameters: false,
    removeComments: false,
    skipLibCheck: true,
    sourceMap: false,
    emitDeclarationOnly: dts && !js,
    declaration: dts
  };
  const compilerHost = ts__default.default.createCompilerHost(compileOptions);
  compilerHost.writeFile = (fileName, declaration) => {
    files.set(fileName, declaration);
  };
  const _readFile = compilerHost.readFile;
  compilerHost.readFile = (filename) => {
    if (files.has(filename)) {
      return files.get(filename);
    }
    return _readFile(filename);
  };
  const program = ts__default.default.createProgram([
    ...files.keys()
  ], compileOptions, compilerHost);
  const emitResult = program.emit();
  const allDiagnostics = [
    ...ts__default.default.getPreEmitDiagnostics(program),
    ...emitResult.diagnostics
  ];
  if (allDiagnostics.length > 0) {
    for (const diagnostic of allDiagnostics) {
      const message = ts__default.default.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (diagnostic.file && diagnostic.start) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        console.log(`${diagnostic.file.fileName}:${line + 1}:${character + 1} ${message}`);
      } else {
        console.log(`==> ${message}`);
      }
    }
    throw new Error(GEN_TS_EMIT_FAILED);
  }
}
__name(tsCompile, "tsCompile");
__name2(tsCompile, "tsCompile");
async function capnpc(options) {
  const { output, tsconfig, schemas = [], tty } = options;
  let dataBuf = buffer.Buffer.alloc(0);
  if (tty) {
    const chunks = [];
    process.stdin.on("data", (chunk) => {
      chunks.push(chunk);
    });
    await new Promise((resolve2) => {
      process.stdin.on("end", resolve2);
    });
    const reqBuffer = buffer.Buffer.alloc(chunks.reduce((l, chunk) => l + chunk.byteLength, 0));
    let i = 0;
    for (const chunk of chunks) {
      chunk.copy(reqBuffer, i);
      i += chunk.byteLength;
    }
    dataBuf = reqBuffer;
  }
  if (dataBuf.byteLength === 0) {
    const opts = [];
    if (output && existsSync(output)) {
      opts.push(`-o-:${output}`);
    } else {
      if (output && !existsSync(output)) {
        console$1.writeWarning(`Output directory "${output}" does not exist, will write to schema path...`);
      }
      opts.push("-o-");
    }
    dataBuf = await new Promise((resolve2) => {
      child_process.exec(`capnpc ${opts.join(" ")} ${schemas.join(" ")}`, {
        encoding: "buffer"
      }, (error, stdout, stderr) => {
        if (stderr.length > 0) {
          process.stderr.write(stderr);
        }
        if (error) {
          throw error;
        }
        resolve2(stdout);
      });
    });
  }
  return compileAll(dataBuf, {
    ts: options.ts ?? true,
    js: false,
    dts: false,
    tsconfig: tsconfig.options
  });
}
__name(capnpc, "capnpc");
__name2(capnpc, "capnpc");
async function compile(dataBuf, options) {
  const resolvedOptions = await resolveOptions(options);
  if (!resolvedOptions) {
    console$1.writeWarning("\u2716 Unable to resolve Cap'n Proto compiler options - the program will terminate", {
      logLevel: "all"
    });
    return;
  }
  return compileAll(dataBuf, defu__default.default({
    tsconfig: resolvedOptions.tsconfig.options
  }, resolvedOptions, {
    ts: true,
    js: false,
    dts: false
  }));
}
__name(compile, "compile");
__name2(compile, "compile");
var Interface = class extends Pointer {
  static {
    __name(this, "Interface");
  }
  static {
    __name2(this, "Interface");
  }
  static _capnp = {
    displayName: "Interface"
  };
  static getCapID = getCapID;
  static getAsInterface = getAsInterface;
  static isInterface = isInterface;
  static getClient = getClient;
  constructor(segment, byteOffset, depthLimit = MAX_DEPTH) {
    super(segment, byteOffset, depthLimit);
  }
  static fromPointer(p) {
    return getAsInterface(p);
  }
  getCapId() {
    return getCapID(this);
  }
  getClient() {
    return getClient(this);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return format2("Interface_%d@%a,%d,limit:%x", this.segment.id, this.byteOffset, this.getCapId(), this._capnp.depthLimit);
  }
};
function getAsInterface(p) {
  if (getTargetPointerType(p) === PointerType.OTHER) {
    return new Interface(p.segment, p.byteOffset, p._capnp.depthLimit);
  }
  return null;
}
__name(getAsInterface, "getAsInterface");
__name2(getAsInterface, "getAsInterface");
function isInterface(p) {
  return getTargetPointerType(p) === PointerType.OTHER;
}
__name(isInterface, "isInterface");
__name2(isInterface, "isInterface");
function getCapID(i) {
  if (i.segment.getUint32(i.byteOffset) !== PointerType.OTHER) {
    return -1;
  }
  return i.segment.getUint32(i.byteOffset + 4);
}
__name(getCapID, "getCapID");
__name2(getCapID, "getCapID");
function getClient(i) {
  const capID = getCapID(i);
  const { capTable } = i.segment.message._capnp;
  if (!capTable) {
    return null;
  }
  return capTable[capID];
}
__name(getClient, "getClient");
__name2(getClient, "getClient");
function isFuncCall(call) {
  return !isDataCall(call);
}
__name(isFuncCall, "isFuncCall");
__name2(isFuncCall, "isFuncCall");
function isDataCall(call) {
  return !!call.params;
}
__name(isDataCall, "isDataCall");
__name2(isDataCall, "isDataCall");
function copyCall(call) {
  if (isDataCall(call)) {
    return call;
  }
  return {
    method: call.method,
    params: placeParams(call, void 0)
  };
}
__name(copyCall, "copyCall");
__name2(copyCall, "copyCall");
function placeParams(call, contentPtr) {
  if (isDataCall(call)) {
    return call.params;
  }
  let p;
  if (contentPtr) {
    p = new call.method.ParamsClass(contentPtr.segment, contentPtr.byteOffset, contentPtr._capnp.depthLimit);
  } else {
    const msg = new Message();
    p = new call.method.ParamsClass(msg.getSegment(0), 0);
  }
  initStruct(call.method.ParamsClass._capnp.size, p);
  if (call.paramsFunc) {
    call.paramsFunc(p);
  }
  return p;
}
__name(placeParams, "placeParams");
__name2(placeParams, "placeParams");
function pointerToStruct(p) {
  if (getTargetPointerType(p) === PointerType.STRUCT) {
    return new Struct(p.segment, p.byteOffset, p._capnp.depthLimit, p._capnp.compositeIndex);
  }
  return null;
}
__name(pointerToStruct, "pointerToStruct");
__name2(pointerToStruct, "pointerToStruct");
function transformPtr(p, transform) {
  if (transform.length === 0) {
    return p;
  }
  let s = pointerToStruct(p);
  if (!s) {
    return p;
  }
  for (const op of transform) {
    s = getPointer(op.field, s);
  }
  return s;
}
__name(transformPtr, "transformPtr");
__name2(transformPtr, "transformPtr");
var Deferred = class _Deferred {
  static {
    __name(this, "_Deferred");
  }
  static {
    __name2(this, "Deferred");
  }
  static fromPromise(p) {
    const d = new _Deferred();
    p.then(d.resolve, d.reject);
    return d;
  }
  promise;
  reject;
  resolve;
  constructor() {
    this.promise = new Promise((a, b) => {
      this.resolve = a;
      this.reject = b;
    });
  }
};
var ImmediateAnswer = class extends FixedAnswer {
  static {
    __name(this, "ImmediateAnswer");
  }
  static {
    __name2(this, "ImmediateAnswer");
  }
  constructor(s) {
    super();
    this.s = s;
  }
  structSync() {
    return this.s;
  }
  findClient(transform) {
    const p = transformPtr(this.s, transform);
    return getInterfaceClientOrNull(p);
  }
  pipelineCall(transform, call) {
    return this.findClient(transform).call(call);
  }
  pipelineClose(transform) {
    this.findClient(transform).close();
  }
};
var Queue = class {
  static {
    __name(this, "Queue");
  }
  static {
    __name2(this, "Queue");
  }
  // creates a new queue that starts with n elements.
  // The interface's length must not change over the course of
  // the queue's usage.
  constructor(q, n) {
    this.q = q;
    this.n = n;
    this.cap = q.len();
  }
  start = 0;
  cap;
  // len returns the length of the queue. This is different from the underlying
  // interface's length, which is the queue's capacity.
  len() {
    return this.n;
  }
  // push reserves space for an element on the queue, returning its index.
  // if the queue is full, push returns -1.
  push() {
    if (this.n >= this.cap) {
      return -1;
    }
    const i = (this.start + this.n) % this.cap;
    this.n++;
    return i;
  }
  // front returns the index of the front of the queue, or -1 if the queue is empty.
  front() {
    if (this.n === 0) {
      return -1;
    }
    return this.start;
  }
  // pop pops an element from the queue, returning whether it succeeded.
  pop() {
    if (this.n === 0) {
      return false;
    }
    this.q.clear(this.start);
    this.start = (this.start + 1) % this.cap;
    this.n--;
    return true;
  }
};
var EmbargoClient = class {
  static {
    __name(this, "EmbargoClient");
  }
  static {
    __name2(this, "EmbargoClient");
  }
  _client;
  q;
  calls;
  constructor(client, queue) {
    this._client = client;
    this.calls = queue.copy();
    this.q = new Queue(this.calls, this.calls.len());
    this.flushQueue();
  }
  flushQueue() {
    let c = null;
    {
      const i = this.q.front();
      if (i !== -1) {
        c = this.calls.data[i];
      }
    }
    while (c && c.call) {
      const ans = this._client.call(c.call);
      void (async (f, ans2) => {
        try {
          f.fulfill(await ans2.struct());
        } catch (error_) {
          f.reject(error_);
        }
      })(c.f, ans);
      this.q.pop();
      {
        const i = this.q.front();
        c = i === -1 ? null : this.calls.data[i];
      }
    }
  }
  // client returns the underlying client if the embargo has
  // been lifted and null otherwise
  client() {
    return this.isPassthrough() ? this._client : null;
  }
  isPassthrough() {
    return this.q.len() === 0;
  }
  // call either queues a call to the underlying client or starts a
  // call if the embargo has been lifted
  call(call) {
    if (this.isPassthrough()) {
      return this._client.call(call);
    }
    return this.push(call);
  }
  push(_call) {
    const f = new Fulfiller();
    const call = copyCall(_call);
    const i = this.q.push();
    if (i === -1) {
      return new ErrorAnswer(new Error(RPC_CALL_QUEUE_FULL));
    }
    this.calls.data[i] = {
      call,
      f
    };
    return f;
  }
  close() {
    while (this.q.len() > 0) {
      const first = this.calls.data[this.q.front()];
      if (!first) {
        throw new Error(INVARIANT_UNREACHABLE_CODE);
      }
      first.f.reject(new Error(RPC_QUEUE_CALL_CANCEL));
      this.q.pop();
    }
    this._client.close();
  }
};
var Ecalls = class _Ecalls {
  static {
    __name(this, "_Ecalls");
  }
  static {
    __name2(this, "Ecalls");
  }
  data;
  constructor(data) {
    this.data = data;
  }
  static copyOf(data) {
    return new _Ecalls([
      ...data
    ]);
  }
  len() {
    return this.data.length;
  }
  clear(i) {
    this.data[i] = null;
  }
  copy() {
    return _Ecalls.copyOf(this.data);
  }
};
var callQueueSize = 64;
var Fulfiller = class _Fulfiller {
  static {
    __name(this, "_Fulfiller");
  }
  static {
    __name2(this, "Fulfiller");
  }
  resolved = false;
  answer;
  queue = [];
  queueCap = callQueueSize;
  deferred = new Deferred();
  fulfill(s) {
    this.answer = new ImmediateAnswer(s);
    const queues = this.emptyQueue(s);
    const msgcap = s.segment.message._capnp;
    if (!msgcap.capTable) {
      msgcap.capTable = [];
    }
    const ctab = msgcap.capTable;
    for (const _capIdx of Object.keys(queues)) {
      const capIdx = +_capIdx;
      const q = queues[capIdx];
      const client = ctab[capIdx];
      if (!client) {
        throw new Error(INVARIANT_UNREACHABLE_CODE);
      }
      ctab[capIdx] = new EmbargoClient(client, q);
    }
    this.deferred.resolve(s);
  }
  reject(err) {
    this.deferred.reject(err);
  }
  peek() {
    return this.answer;
  }
  async struct() {
    return await this.deferred.promise;
  }
  // pipelineCall calls pipelineCall on the fulfilled answer or
  // queues the call if f has not been fulfilled
  pipelineCall(transform, call) {
    {
      const a = this.peek();
      if (a) {
        return a.pipelineCall(transform, call);
      }
    }
    if (this.queue.length === this.queueCap) {
      return new ErrorAnswer(new Error(RPC_CALL_QUEUE_FULL));
    }
    const cc = copyCall(call);
    const g = new _Fulfiller();
    this.queue.push({
      call: cc,
      f: g,
      transform
    });
    return g;
  }
  // pipelineClose waits until f is resolved and then calls
  // pipelineClose on the fulfilled answer
  // FIXME: should this be async?
  pipelineClose(transform) {
    const onFinally = /* @__PURE__ */ __name2(() => {
      if (this.answer) {
        this.answer.pipelineClose(transform);
      }
    }, "onFinally");
    this.deferred.promise.then(onFinally, onFinally);
  }
  // emptyQueue splits the queue by which capability it targets and
  // drops any invalid calls.  Once this function returns, f.queue will
  // be nil.
  emptyQueue(s) {
    const qs = {};
    for (let i = 0; i < this.queue.length; i++) {
      const pc = this.queue[i];
      let c;
      try {
        c = transformPtr(s, pc.transform);
      } catch (error_) {
        pc.f.reject(error_);
        continue;
      }
      const iface = Interface.fromPointer(c);
      if (!iface) {
        pc.f.reject(new Error(RPC_NULL_CLIENT));
        continue;
      }
      const cn = iface.getCapId();
      if (!qs[cn]) {
        qs[cn] = new Ecalls([]);
      }
      qs[cn].data.push(pc);
    }
    this.queue = [];
    return qs;
  }
};
var PipelineClient = class {
  static {
    __name(this, "PipelineClient");
  }
  static {
    __name2(this, "PipelineClient");
  }
  constructor(pipeline) {
    this.pipeline = pipeline;
  }
  transform() {
    return this.pipeline.transform();
  }
  call(call) {
    return this.pipeline.answer.pipelineCall(this.transform(), call);
  }
  close() {
    this.pipeline.answer.pipelineClose(this.transform());
  }
};
var Pipeline = class _Pipeline {
  static {
    __name(this, "_Pipeline");
  }
  static {
    __name2(this, "Pipeline");
  }
  // Returns a new Pipeline based on an answer
  constructor(ResultsClass, answer, op, parent) {
    this.ResultsClass = ResultsClass;
    this.answer = answer;
    this.parent = parent;
    this.op = op || {
      field: 0
    };
  }
  op;
  pipelineClient;
  // transform returns the operations needed to transform the root answer
  // into the value p represents.
  transform() {
    const xform = [];
    for (let q = this; q.parent; q = q.parent) {
      xform.unshift(q.op);
    }
    return xform;
  }
  // Struct waits until the answer is resolved and returns the struct
  // this pipeline represents.
  async struct() {
    const s = await this.answer.struct();
    const t = transformPtr(s, this.transform());
    if (!t) {
      if (this.op.defaultValue) {
        copyFrom(this.op.defaultValue, t);
      } else {
        initStruct(this.ResultsClass._capnp.size, t);
      }
    }
    return getAs(this.ResultsClass, t);
  }
  // client returns the client version of this pipeline
  client() {
    if (!this.pipelineClient) {
      this.pipelineClient = new PipelineClient(this);
    }
    return this.pipelineClient;
  }
  // getPipeline returns a derived pipeline which yields the pointer field given
  getPipeline(ResultsClass, off, defaultValue) {
    return new _Pipeline(ResultsClass, this.answer, {
      field: off,
      defaultValue
    }, this);
  }
};
var MethodError = class extends Error {
  static {
    __name(this, "MethodError");
  }
  static {
    __name2(this, "MethodError");
  }
  constructor(method, message) {
    super(format2(RPC_METHOD_ERROR, method.interfaceName, method.methodName, message));
    this.method = method;
  }
};
var Registry2 = class {
  static {
    __name(this, "Registry");
  }
  static {
    __name2(this, "Registry");
  }
  static interfaces = /* @__PURE__ */ new Map();
  static register(id, def) {
    this.interfaces.set(id, def);
  }
  static lookup(id) {
    return this.interfaces.get(id);
  }
};
(class {
  static {
    __name(this, "Server");
  }
  static {
    __name2(this, "Server");
  }
  constructor(target, methods) {
    this.target = target;
    this.methods = methods;
  }
  startCall(call) {
    const msg = new Message();
    const results = msg.initRoot(call.method.ResultsClass);
    call.serverMethod.impl.call(this.target, call.params, results).then(() => call.answer.fulfill(results)).catch((error_) => call.answer.reject(error_));
  }
  call(call) {
    const serverMethod = this.methods[call.method.methodId];
    if (!serverMethod) {
      return new ErrorAnswer(new MethodError(call.method, RPC_METHOD_NOT_IMPLEMENTED));
    }
    const serverCall = {
      ...copyCall(call),
      answer: new Fulfiller(),
      serverMethod
    };
    this.startCall(serverCall);
    return serverCall.answer;
  }
  close() {
  }
});
BigInt("0xb312981b2552a250");
var Message_Which = {
  /**
  * The sender previously received this message from the peer but didn't understand it or doesn't
  * yet implement the functionality that was requested.  So, the sender is echoing the message
  * back.  In some cases, the receiver may be able to recover from this by pretending the sender
  * had taken some appropriate "null" action.
  *
  * For example, say `resolve` is received by a level 0 implementation (because a previous call
  * or return happened to contain a promise).  The level 0 implementation will echo it back as
  * `unimplemented`.  The original sender can then simply release the cap to which the promise
  * had resolved, thus avoiding a leak.
  *
  * For any message type that introduces a question, if the message comes back unimplemented,
  * the original sender may simply treat it as if the question failed with an exception.
  *
  * In cases where there is no sensible way to react to an `unimplemented` message (without
  * resource leaks or other serious problems), the connection may need to be aborted.  This is
  * a gray area; different implementations may take different approaches.
  *
  */
  UNIMPLEMENTED: 0,
  /**
  * Sent when a connection is being aborted due to an unrecoverable error.  This could be e.g.
  * because the sender received an invalid or nonsensical message or because the sender had an
  * internal error.  The sender will shut down the outgoing half of the connection after `abort`
  * and will completely close the connection shortly thereafter (it's up to the sender how much
  * of a time buffer they want to offer for the client to receive the `abort` before the
  * connection is reset).
  *
  */
  ABORT: 1,
  /**
  * Request the peer's bootstrap interface.
  *
  */
  BOOTSTRAP: 8,
  /**
  * Begin a method call.
  *
  */
  CALL: 2,
  /**
  * Complete a method call.
  *
  */
  RETURN: 3,
  /**
  * Release a returned answer / cancel a call.
  *
  */
  FINISH: 4,
  /**
  * Resolve a previously-sent promise.
  *
  */
  RESOLVE: 5,
  /**
  * Release a capability so that the remote object can be deallocated.
  *
  */
  RELEASE: 6,
  /**
  * Lift an embargo used to enforce E-order over promise resolution.
  *
  */
  DISEMBARGO: 13,
  /**
  * Obsolete request to save a capability, resulting in a SturdyRef. This has been replaced
  * by the `Persistent` interface defined in `persistent.capnp`. This operation was never
  * implemented.
  *
  */
  OBSOLETE_SAVE: 7,
  /**
  * Obsolete way to delete a SturdyRef. This operation was never implemented.
  *
  */
  OBSOLETE_DELETE: 9,
  /**
  * Provide a capability to a third party.
  *
  */
  PROVIDE: 10,
  /**
  * Accept a capability provided by a third party.
  *
  */
  ACCEPT: 11,
  /**
  * Directly connect to the common root of two or more proxied caps.
  *
  */
  JOIN: 12
};
var Message2 = class _Message extends Struct {
  static {
    __name(this, "_Message");
  }
  static {
    __name2(this, "Message");
  }
  static UNIMPLEMENTED = Message_Which.UNIMPLEMENTED;
  static ABORT = Message_Which.ABORT;
  static BOOTSTRAP = Message_Which.BOOTSTRAP;
  static CALL = Message_Which.CALL;
  static RETURN = Message_Which.RETURN;
  static FINISH = Message_Which.FINISH;
  static RESOLVE = Message_Which.RESOLVE;
  static RELEASE = Message_Which.RELEASE;
  static DISEMBARGO = Message_Which.DISEMBARGO;
  static OBSOLETE_SAVE = Message_Which.OBSOLETE_SAVE;
  static OBSOLETE_DELETE = Message_Which.OBSOLETE_DELETE;
  static PROVIDE = Message_Which.PROVIDE;
  static ACCEPT = Message_Which.ACCEPT;
  static JOIN = Message_Which.JOIN;
  static _capnp = {
    displayName: "Message",
    id: "91b79f1f808db032",
    size: new ObjectSize(8, 1)
  };
  _adoptUnimplemented(value) {
    setUint16(0, 0, this);
    adopt(value, getPointer(0, this));
  }
  _disownUnimplemented() {
    return disown(this.unimplemented);
  }
  /**
  * The sender previously received this message from the peer but didn't understand it or doesn't
  * yet implement the functionality that was requested.  So, the sender is echoing the message
  * back.  In some cases, the receiver may be able to recover from this by pretending the sender
  * had taken some appropriate "null" action.
  *
  * For example, say `resolve` is received by a level 0 implementation (because a previous call
  * or return happened to contain a promise).  The level 0 implementation will echo it back as
  * `unimplemented`.  The original sender can then simply release the cap to which the promise
  * had resolved, thus avoiding a leak.
  *
  * For any message type that introduces a question, if the message comes back unimplemented,
  * the original sender may simply treat it as if the question failed with an exception.
  *
  * In cases where there is no sensible way to react to an `unimplemented` message (without
  * resource leaks or other serious problems), the connection may need to be aborted.  This is
  * a gray area; different implementations may take different approaches.
  *
  */
  get unimplemented() {
    testWhich("unimplemented", getUint16(0, this), 0, this);
    return getStruct(0, _Message, this);
  }
  _hasUnimplemented() {
    return !isNull4(getPointer(0, this));
  }
  _initUnimplemented() {
    setUint16(0, 0, this);
    return initStructAt(0, _Message, this);
  }
  get _isUnimplemented() {
    return getUint16(0, this) === 0;
  }
  set unimplemented(value) {
    setUint16(0, 0, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptAbort(value) {
    setUint16(0, 1, this);
    adopt(value, getPointer(0, this));
  }
  _disownAbort() {
    return disown(this.abort);
  }
  /**
  * Sent when a connection is being aborted due to an unrecoverable error.  This could be e.g.
  * because the sender received an invalid or nonsensical message or because the sender had an
  * internal error.  The sender will shut down the outgoing half of the connection after `abort`
  * and will completely close the connection shortly thereafter (it's up to the sender how much
  * of a time buffer they want to offer for the client to receive the `abort` before the
  * connection is reset).
  *
  */
  get abort() {
    testWhich("abort", getUint16(0, this), 1, this);
    return getStruct(0, Exception, this);
  }
  _hasAbort() {
    return !isNull4(getPointer(0, this));
  }
  _initAbort() {
    setUint16(0, 1, this);
    return initStructAt(0, Exception, this);
  }
  get _isAbort() {
    return getUint16(0, this) === 1;
  }
  set abort(value) {
    setUint16(0, 1, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptBootstrap(value) {
    setUint16(0, 8, this);
    adopt(value, getPointer(0, this));
  }
  _disownBootstrap() {
    return disown(this.bootstrap);
  }
  /**
  * Request the peer's bootstrap interface.
  *
  */
  get bootstrap() {
    testWhich("bootstrap", getUint16(0, this), 8, this);
    return getStruct(0, Bootstrap, this);
  }
  _hasBootstrap() {
    return !isNull4(getPointer(0, this));
  }
  _initBootstrap() {
    setUint16(0, 8, this);
    return initStructAt(0, Bootstrap, this);
  }
  get _isBootstrap() {
    return getUint16(0, this) === 8;
  }
  set bootstrap(value) {
    setUint16(0, 8, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptCall(value) {
    setUint16(0, 2, this);
    adopt(value, getPointer(0, this));
  }
  _disownCall() {
    return disown(this.call);
  }
  /**
  * Begin a method call.
  *
  */
  get call() {
    testWhich("call", getUint16(0, this), 2, this);
    return getStruct(0, Call, this);
  }
  _hasCall() {
    return !isNull4(getPointer(0, this));
  }
  _initCall() {
    setUint16(0, 2, this);
    return initStructAt(0, Call, this);
  }
  get _isCall() {
    return getUint16(0, this) === 2;
  }
  set call(value) {
    setUint16(0, 2, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptReturn(value) {
    setUint16(0, 3, this);
    adopt(value, getPointer(0, this));
  }
  _disownReturn() {
    return disown(this.return);
  }
  /**
  * Complete a method call.
  *
  */
  get return() {
    testWhich("return", getUint16(0, this), 3, this);
    return getStruct(0, Return, this);
  }
  _hasReturn() {
    return !isNull4(getPointer(0, this));
  }
  _initReturn() {
    setUint16(0, 3, this);
    return initStructAt(0, Return, this);
  }
  get _isReturn() {
    return getUint16(0, this) === 3;
  }
  set return(value) {
    setUint16(0, 3, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptFinish(value) {
    setUint16(0, 4, this);
    adopt(value, getPointer(0, this));
  }
  _disownFinish() {
    return disown(this.finish);
  }
  /**
  * Release a returned answer / cancel a call.
  *
  */
  get finish() {
    testWhich("finish", getUint16(0, this), 4, this);
    return getStruct(0, Finish, this);
  }
  _hasFinish() {
    return !isNull4(getPointer(0, this));
  }
  _initFinish() {
    setUint16(0, 4, this);
    return initStructAt(0, Finish, this);
  }
  get _isFinish() {
    return getUint16(0, this) === 4;
  }
  set finish(value) {
    setUint16(0, 4, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptResolve(value) {
    setUint16(0, 5, this);
    adopt(value, getPointer(0, this));
  }
  _disownResolve() {
    return disown(this.resolve);
  }
  /**
  * Resolve a previously-sent promise.
  *
  */
  get resolve() {
    testWhich("resolve", getUint16(0, this), 5, this);
    return getStruct(0, Resolve, this);
  }
  _hasResolve() {
    return !isNull4(getPointer(0, this));
  }
  _initResolve() {
    setUint16(0, 5, this);
    return initStructAt(0, Resolve, this);
  }
  get _isResolve() {
    return getUint16(0, this) === 5;
  }
  set resolve(value) {
    setUint16(0, 5, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptRelease(value) {
    setUint16(0, 6, this);
    adopt(value, getPointer(0, this));
  }
  _disownRelease() {
    return disown(this.release);
  }
  /**
  * Release a capability so that the remote object can be deallocated.
  *
  */
  get release() {
    testWhich("release", getUint16(0, this), 6, this);
    return getStruct(0, Release, this);
  }
  _hasRelease() {
    return !isNull4(getPointer(0, this));
  }
  _initRelease() {
    setUint16(0, 6, this);
    return initStructAt(0, Release, this);
  }
  get _isRelease() {
    return getUint16(0, this) === 6;
  }
  set release(value) {
    setUint16(0, 6, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptDisembargo(value) {
    setUint16(0, 13, this);
    adopt(value, getPointer(0, this));
  }
  _disownDisembargo() {
    return disown(this.disembargo);
  }
  /**
  * Lift an embargo used to enforce E-order over promise resolution.
  *
  */
  get disembargo() {
    testWhich("disembargo", getUint16(0, this), 13, this);
    return getStruct(0, Disembargo, this);
  }
  _hasDisembargo() {
    return !isNull4(getPointer(0, this));
  }
  _initDisembargo() {
    setUint16(0, 13, this);
    return initStructAt(0, Disembargo, this);
  }
  get _isDisembargo() {
    return getUint16(0, this) === 13;
  }
  set disembargo(value) {
    setUint16(0, 13, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptObsoleteSave(value) {
    setUint16(0, 7, this);
    adopt(value, getPointer(0, this));
  }
  _disownObsoleteSave() {
    return disown(this.obsoleteSave);
  }
  /**
  * Obsolete request to save a capability, resulting in a SturdyRef. This has been replaced
  * by the `Persistent` interface defined in `persistent.capnp`. This operation was never
  * implemented.
  *
  */
  get obsoleteSave() {
    testWhich("obsoleteSave", getUint16(0, this), 7, this);
    return getPointer(0, this);
  }
  _hasObsoleteSave() {
    return !isNull4(getPointer(0, this));
  }
  get _isObsoleteSave() {
    return getUint16(0, this) === 7;
  }
  set obsoleteSave(value) {
    setUint16(0, 7, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptObsoleteDelete(value) {
    setUint16(0, 9, this);
    adopt(value, getPointer(0, this));
  }
  _disownObsoleteDelete() {
    return disown(this.obsoleteDelete);
  }
  /**
  * Obsolete way to delete a SturdyRef. This operation was never implemented.
  *
  */
  get obsoleteDelete() {
    testWhich("obsoleteDelete", getUint16(0, this), 9, this);
    return getPointer(0, this);
  }
  _hasObsoleteDelete() {
    return !isNull4(getPointer(0, this));
  }
  get _isObsoleteDelete() {
    return getUint16(0, this) === 9;
  }
  set obsoleteDelete(value) {
    setUint16(0, 9, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptProvide(value) {
    setUint16(0, 10, this);
    adopt(value, getPointer(0, this));
  }
  _disownProvide() {
    return disown(this.provide);
  }
  /**
  * Provide a capability to a third party.
  *
  */
  get provide() {
    testWhich("provide", getUint16(0, this), 10, this);
    return getStruct(0, Provide, this);
  }
  _hasProvide() {
    return !isNull4(getPointer(0, this));
  }
  _initProvide() {
    setUint16(0, 10, this);
    return initStructAt(0, Provide, this);
  }
  get _isProvide() {
    return getUint16(0, this) === 10;
  }
  set provide(value) {
    setUint16(0, 10, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptAccept(value) {
    setUint16(0, 11, this);
    adopt(value, getPointer(0, this));
  }
  _disownAccept() {
    return disown(this.accept);
  }
  /**
  * Accept a capability provided by a third party.
  *
  */
  get accept() {
    testWhich("accept", getUint16(0, this), 11, this);
    return getStruct(0, Accept, this);
  }
  _hasAccept() {
    return !isNull4(getPointer(0, this));
  }
  _initAccept() {
    setUint16(0, 11, this);
    return initStructAt(0, Accept, this);
  }
  get _isAccept() {
    return getUint16(0, this) === 11;
  }
  set accept(value) {
    setUint16(0, 11, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptJoin(value) {
    setUint16(0, 12, this);
    adopt(value, getPointer(0, this));
  }
  _disownJoin() {
    return disown(this.join);
  }
  /**
  * Directly connect to the common root of two or more proxied caps.
  *
  */
  get join() {
    testWhich("join", getUint16(0, this), 12, this);
    return getStruct(0, Join, this);
  }
  _hasJoin() {
    return !isNull4(getPointer(0, this));
  }
  _initJoin() {
    setUint16(0, 12, this);
    return initStructAt(0, Join, this);
  }
  get _isJoin() {
    return getUint16(0, this) === 12;
  }
  set join(value) {
    setUint16(0, 12, this);
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Message_" + super.toString();
  }
  which() {
    return getUint16(0, this);
  }
};
var Bootstrap = class extends Struct {
  static {
    __name(this, "Bootstrap");
  }
  static {
    __name2(this, "Bootstrap");
  }
  static _capnp = {
    displayName: "Bootstrap",
    id: "e94ccf8031176ec4",
    size: new ObjectSize(8, 1)
  };
  /**
  * A new question ID identifying this request, which will eventually receive a Return message
  * containing the restored capability.
  *
  */
  get questionId() {
    return getUint32(0, this);
  }
  set questionId(value) {
    setUint32(0, value, this);
  }
  _adoptDeprecatedObjectId(value) {
    adopt(value, getPointer(0, this));
  }
  _disownDeprecatedObjectId() {
    return disown(this.deprecatedObjectId);
  }
  /**
  * ** DEPRECATED **
  *
  * A Vat may export multiple bootstrap interfaces. In this case, `deprecatedObjectId` specifies
  * which one to return. If this pointer is null, then the default bootstrap interface is returned.
  *
  * As of version 0.5, use of this field is deprecated. If a service wants to export multiple
  * bootstrap interfaces, it should instead define a single bootstrap interface that has methods
  * that return each of the other interfaces.
  *
  * **History**
  *
  * In the first version of Cap'n Proto RPC (0.4.x) the `Bootstrap` message was called `Restore`.
  * At the time, it was thought that this would eventually serve as the way to restore SturdyRefs
  * (level 2). Meanwhile, an application could offer its "main" interface on a well-known
  * (non-secret) SturdyRef.
  *
  * Since level 2 RPC was not implemented at the time, the `Restore` message was in practice only
  * used to obtain the main interface. Since most applications had only one main interface that
  * they wanted to restore, they tended to designate this with a null `objectId`.
  *
  * Unfortunately, the earliest version of the EZ RPC interfaces set a precedent of exporting
  * multiple main interfaces by allowing them to be exported under string names. In this case,
  * `objectId` was a Text value specifying the name.
  *
  * All of this proved problematic for several reasons:
  *
  * - The arrangement assumed that a client wishing to restore a SturdyRef would know exactly what
  *   machine to connect to and would be able to immediately restore a SturdyRef on connection.
  *   However, in practice, the ability to restore SturdyRefs is itself a capability that may
  *   require going through an authentication process to obtain. Thus, it makes more sense to
  *   define a "restorer service" as a full Cap'n Proto interface. If this restorer interface is
  *   offered as the vat's bootstrap interface, then this is equivalent to the old arrangement.
  *
  * - Overloading "Restore" for the purpose of obtaining well-known capabilities encouraged the
  *   practice of exporting singleton services with string names. If singleton services are desired,
  *   it is better to have one main interface that has methods that can be used to obtain each
  *   service, in order to get all the usual benefits of schemas and type checking.
  *
  * - Overloading "Restore" also had a security problem: Often, "main" or "well-known"
  *   capabilities exported by a vat are in fact not public: they are intended to be accessed only
  *   by clients who are capable of forming a connection to the vat. This can lead to trouble if
  *   the client itself has other clients and wishes to forward some `Restore` requests from those
  *   external clients -- it has to be very careful not to allow through `Restore` requests
  *   addressing the default capability.
  *
  *   For example, consider the case of a sandboxed Sandstorm application and its supervisor. The
  *   application exports a default capability to its supervisor that provides access to
  *   functionality that only the supervisor is supposed to access. Meanwhile, though, applications
  *   may publish other capabilities that may be persistent, in which case the application needs
  *   to field `Restore` requests that could come from anywhere. These requests of course have to
  *   pass through the supervisor, as all communications with the outside world must. But, the
  *   supervisor has to be careful not to honor an external request addressing the application's
  *   default capability, since this capability is privileged. Unfortunately, the default
  *   capability cannot be given an unguessable name, because then the supervisor itself would not
  *   be able to address it!
  *
  * As of Cap'n Proto 0.5, `Restore` has been renamed to `Bootstrap` and is no longer planned for
  * use in restoring SturdyRefs.
  *
  * Note that 0.4 also defined a message type called `Delete` that, like `Restore`, addressed a
  * SturdyRef, but indicated that the client would not restore the ref again in the future. This
  * operation was never implemented, so it was removed entirely. If a "delete" operation is desired,
  * it should exist as a method on the same interface that handles restoring SturdyRefs. However,
  * the utility of such an operation is questionable. You wouldn't be able to rely on it for
  * garbage collection since a client could always disappear permanently without remembering to
  * delete all its SturdyRefs, thus leaving them dangling forever. Therefore, it is advisable to
  * design systems such that SturdyRefs never represent "owned" pointers.
  *
  * For example, say a SturdyRef points to an image file hosted on some server. That image file
  * should also live inside a collection (a gallery, perhaps) hosted on the same server, owned by
  * a user who can delete the image at any time. If the user deletes the image, the SturdyRef
  * stops working. On the other hand, if the SturdyRef is discarded, this has no effect on the
  * existence of the image in its collection.
  *
  */
  get deprecatedObjectId() {
    return getPointer(0, this);
  }
  _hasDeprecatedObjectId() {
    return !isNull4(getPointer(0, this));
  }
  set deprecatedObjectId(value) {
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Bootstrap_" + super.toString();
  }
};
var Call_SendResultsTo_Which = {
  /**
  * Send the return message back to the caller (the usual).
  *
  */
  CALLER: 0,
  /**
  * **(level 1)**
  *
  * Don't actually return the results to the sender.  Instead, hold on to them and await
  * instructions from the sender regarding what to do with them.  In particular, the sender
  * may subsequently send a `Return` for some other call (which the receiver had previously made
  * to the sender) with `takeFromOtherQuestion` set.  The results from this call are then used
  * as the results of the other call.
  *
  * When `yourself` is used, the receiver must still send a `Return` for the call, but sets the
  * field `resultsSentElsewhere` in that `Return` rather than including the results.
  *
  * This feature can be used to implement tail calls in which a call from Vat A to Vat B ends up
  * returning the result of a call from Vat B back to Vat A.
  *
  * In particular, the most common use case for this feature is when Vat A makes a call to a
  * promise in Vat B, and then that promise ends up resolving to a capability back in Vat A.
  * Vat B must forward all the queued calls on that promise back to Vat A, but can set `yourself`
  * in the calls so that the results need not pass back through Vat B.
  *
  * For example:
  * - Alice, in Vat A, calls foo() on Bob in Vat B.
  * - Alice makes a pipelined call bar() on the promise returned by foo().
  * - Later on, Bob resolves the promise from foo() to point at Carol, who lives in Vat A (next
  *   to Alice).
  * - Vat B dutifully forwards the bar() call to Carol.  Let us call this forwarded call bar'().
  *   Notice that bar() and bar'() are travelling in opposite directions on the same network
  *   link.
  * - The `Call` for bar'() has `sendResultsTo` set to `yourself`.
  * - Vat B sends a `Return` for bar() with `takeFromOtherQuestion` set in place of the results,
  *   with the value set to the question ID of bar'().  Vat B does not wait for bar'() to return,
  *   as doing so would introduce unnecessary round trip latency.
  * - Vat A receives bar'() and delivers it to Carol.
  * - When bar'() returns, Vat A sends a `Return` for bar'() to Vat B, with `resultsSentElsewhere`
  *   set in place of results.
  * - Vat A sends a `Finish` for the bar() call to Vat B.
  * - Vat B receives the `Finish` for bar() and sends a `Finish` for bar'().
  *
  */
  YOURSELF: 1,
  /**
  * **(level 3)**
  *
  * The call's result should be returned to a different vat.  The receiver (the callee) expects
  * to receive an `Accept` message from the indicated vat, and should return the call's result
  * to it, rather than to the sender of the `Call`.
  *
  * This operates much like `yourself`, above, except that Carol is in a separate Vat C.  `Call`
  * messages are sent from Vat A -> Vat B and Vat B -> Vat C.  A `Return` message is sent from
  * Vat B -> Vat A that contains `acceptFromThirdParty` in place of results.  When Vat A sends
  * an `Accept` to Vat C, it receives back a `Return` containing the call's actual result.  Vat C
  * also sends a `Return` to Vat B with `resultsSentElsewhere`.
  *
  */
  THIRD_PARTY: 2
};
var Call_SendResultsTo = class extends Struct {
  static {
    __name(this, "Call_SendResultsTo");
  }
  static {
    __name2(this, "Call_SendResultsTo");
  }
  static CALLER = Call_SendResultsTo_Which.CALLER;
  static YOURSELF = Call_SendResultsTo_Which.YOURSELF;
  static THIRD_PARTY = Call_SendResultsTo_Which.THIRD_PARTY;
  static _capnp = {
    displayName: "sendResultsTo",
    id: "dae8b0f61aab5f99",
    size: new ObjectSize(24, 3)
  };
  get _isCaller() {
    return getUint16(6, this) === 0;
  }
  set caller(_) {
    setUint16(6, 0, this);
  }
  get _isYourself() {
    return getUint16(6, this) === 1;
  }
  set yourself(_) {
    setUint16(6, 1, this);
  }
  _adoptThirdParty(value) {
    setUint16(6, 2, this);
    adopt(value, getPointer(2, this));
  }
  _disownThirdParty() {
    return disown(this.thirdParty);
  }
  /**
  * **(level 3)**
  *
  * The call's result should be returned to a different vat.  The receiver (the callee) expects
  * to receive an `Accept` message from the indicated vat, and should return the call's result
  * to it, rather than to the sender of the `Call`.
  *
  * This operates much like `yourself`, above, except that Carol is in a separate Vat C.  `Call`
  * messages are sent from Vat A -> Vat B and Vat B -> Vat C.  A `Return` message is sent from
  * Vat B -> Vat A that contains `acceptFromThirdParty` in place of results.  When Vat A sends
  * an `Accept` to Vat C, it receives back a `Return` containing the call's actual result.  Vat C
  * also sends a `Return` to Vat B with `resultsSentElsewhere`.
  *
  */
  get thirdParty() {
    testWhich("thirdParty", getUint16(6, this), 2, this);
    return getPointer(2, this);
  }
  _hasThirdParty() {
    return !isNull4(getPointer(2, this));
  }
  get _isThirdParty() {
    return getUint16(6, this) === 2;
  }
  set thirdParty(value) {
    setUint16(6, 2, this);
    copyFrom(value, getPointer(2, this));
  }
  toString() {
    return "Call_SendResultsTo_" + super.toString();
  }
  which() {
    return getUint16(6, this);
  }
};
var Call = class _Call extends Struct {
  static {
    __name(this, "_Call");
  }
  static {
    __name2(this, "Call");
  }
  static _capnp = {
    displayName: "Call",
    id: "836a53ce789d4cd4",
    size: new ObjectSize(24, 3),
    defaultAllowThirdPartyTailCall: getBitMask(false, 0),
    defaultNoPromisePipelining: getBitMask(false, 1),
    defaultOnlyPromisePipeline: getBitMask(false, 2)
  };
  /**
  * A number, chosen by the caller, that identifies this call in future messages.  This number
  * must be different from all other calls originating from the same end of the connection (but
  * may overlap with question IDs originating from the opposite end).  A fine strategy is to use
  * sequential question IDs, but the recipient should not assume this.
  *
  * A question ID can be reused once both:
  * - A matching Return has been received from the callee.
  * - A matching Finish has been sent from the caller.
  *
  */
  get questionId() {
    return getUint32(0, this);
  }
  set questionId(value) {
    setUint32(0, value, this);
  }
  _adoptTarget(value) {
    adopt(value, getPointer(0, this));
  }
  _disownTarget() {
    return disown(this.target);
  }
  /**
  * The object that should receive this call.
  *
  */
  get target() {
    return getStruct(0, MessageTarget, this);
  }
  _hasTarget() {
    return !isNull4(getPointer(0, this));
  }
  _initTarget() {
    return initStructAt(0, MessageTarget, this);
  }
  set target(value) {
    copyFrom(value, getPointer(0, this));
  }
  /**
  * The type ID of the interface being called.  Each capability may implement multiple interfaces.
  *
  */
  get interfaceId() {
    return getUint64(8, this);
  }
  set interfaceId(value) {
    setUint64(8, value, this);
  }
  /**
  * The ordinal number of the method to call within the requested interface.
  *
  */
  get methodId() {
    return getUint16(4, this);
  }
  set methodId(value) {
    setUint16(4, value, this);
  }
  /**
  * Indicates whether or not the receiver is allowed to send a `Return` containing
  * `acceptFromThirdParty`.  Level 3 implementations should set this true.  Otherwise, the callee
  * will have to proxy the return in the case of a tail call to a third-party vat.
  *
  */
  get allowThirdPartyTailCall() {
    return getBit(128, this, _Call._capnp.defaultAllowThirdPartyTailCall);
  }
  set allowThirdPartyTailCall(value) {
    setBit(128, value, this, _Call._capnp.defaultAllowThirdPartyTailCall);
  }
  /**
  * If true, the sender promises that it won't make any promise-pipelined calls on the results of
  * this call. If it breaks this promise, the receiver may throw an arbitrary error from such
  * calls.
  *
  * The receiver may use this as an optimization, by skipping the bookkeeping needed for pipelining
  * when no pipelined calls are expected. The sender typically sets this to false when the method's
  * schema does not specify any return capabilities.
  *
  */
  get noPromisePipelining() {
    return getBit(129, this, _Call._capnp.defaultNoPromisePipelining);
  }
  set noPromisePipelining(value) {
    setBit(129, value, this, _Call._capnp.defaultNoPromisePipelining);
  }
  /**
  * If true, the sender only plans to use this call to make pipelined calls. The receiver need not
  * send a `Return` message (but is still allowed to do so).
  *
  * Since the sender does not know whether a `Return` will be sent, it must release all state
  * related to the call when it sends `Finish`. However, in the case that the callee does not
  * recognize this hint and chooses to send a `Return`, then technically the caller is not allowed
  * to reuse the question ID until it receives said `Return`. This creates a conundrum: How does
  * the caller decide when it's OK to reuse the ID? To sidestep the problem, the C++ implementation
  * uses high-numbered IDs (with the high-order bit set) for such calls, and cycles through the
  * IDs in order. If all 2^31 IDs in this space are used without ever seeing a `Return`, then the
  * implementation assumes that the other end is in fact honoring the hint, and the ID counter is
  * allowed to loop around. If a `Return` is ever seen when `onlyPromisePipeline` was set, then
  * the implementation stops using this hint.
  *
  */
  get onlyPromisePipeline() {
    return getBit(130, this, _Call._capnp.defaultOnlyPromisePipeline);
  }
  set onlyPromisePipeline(value) {
    setBit(130, value, this, _Call._capnp.defaultOnlyPromisePipeline);
  }
  _adoptParams(value) {
    adopt(value, getPointer(1, this));
  }
  _disownParams() {
    return disown(this.params);
  }
  /**
  * The call parameters.  `params.content` is a struct whose fields correspond to the parameters of
  * the method.
  *
  */
  get params() {
    return getStruct(1, Payload, this);
  }
  _hasParams() {
    return !isNull4(getPointer(1, this));
  }
  _initParams() {
    return initStructAt(1, Payload, this);
  }
  set params(value) {
    copyFrom(value, getPointer(1, this));
  }
  /**
  * Where should the return message be sent?
  *
  */
  get sendResultsTo() {
    return getAs(Call_SendResultsTo, this);
  }
  _initSendResultsTo() {
    return getAs(Call_SendResultsTo, this);
  }
  toString() {
    return "Call_" + super.toString();
  }
};
var Return_Which = {
  /**
  * Equal to the QuestionId of the corresponding `Call` message.
  *
  */
  RESULTS: 0,
  /**
  * If true, all capabilities that were in the params should be considered released.  The sender
  * must not send separate `Release` messages for them.  Level 0 implementations in particular
  * should always set this true.  This defaults true because if level 0 implementations forget to
  * set it they'll never notice (just silently leak caps), but if level >=1 implementations forget
  * to set it to false they'll quickly get errors.
  *
  * The receiver should act as if the sender had sent a release message with count=1 for each
  * CapDescriptor in the original Call message.
  *
  */
  EXCEPTION: 1,
  /**
  * The result.
  *
  * For regular method calls, `results.content` points to the result struct.
  *
  * For a `Return` in response to an `Accept` or `Bootstrap`, `results` contains a single
  * capability (rather than a struct), and `results.content` is just a capability pointer with
  * index 0.  A `Finish` is still required in this case.
  *
  */
  CANCELED: 2,
  /**
  * Indicates that the call failed and explains why.
  *
  */
  RESULTS_SENT_ELSEWHERE: 3,
  /**
  * Indicates that the call was canceled due to the caller sending a Finish message
  * before the call had completed.
  *
  */
  TAKE_FROM_OTHER_QUESTION: 4,
  /**
  * This is set when returning from a `Call` that had `sendResultsTo` set to something other
  * than `caller`.
  *
  * It doesn't matter too much when this is sent, as the receiver doesn't need to do anything
  * with it, but the C++ implementation appears to wait for the call to finish before sending
  * this.
  *
  */
  ACCEPT_FROM_THIRD_PARTY: 5
};
var Return = class _Return extends Struct {
  static {
    __name(this, "_Return");
  }
  static {
    __name2(this, "Return");
  }
  static RESULTS = Return_Which.RESULTS;
  static EXCEPTION = Return_Which.EXCEPTION;
  static CANCELED = Return_Which.CANCELED;
  static RESULTS_SENT_ELSEWHERE = Return_Which.RESULTS_SENT_ELSEWHERE;
  static TAKE_FROM_OTHER_QUESTION = Return_Which.TAKE_FROM_OTHER_QUESTION;
  static ACCEPT_FROM_THIRD_PARTY = Return_Which.ACCEPT_FROM_THIRD_PARTY;
  static _capnp = {
    displayName: "Return",
    id: "9e19b28d3db3573a",
    size: new ObjectSize(16, 1),
    defaultReleaseParamCaps: getBitMask(true, 0),
    defaultNoFinishNeeded: getBitMask(false, 1)
  };
  /**
  * Equal to the QuestionId of the corresponding `Call` message.
  *
  */
  get answerId() {
    return getUint32(0, this);
  }
  set answerId(value) {
    setUint32(0, value, this);
  }
  /**
  * If true, all capabilities that were in the params should be considered released.  The sender
  * must not send separate `Release` messages for them.  Level 0 implementations in particular
  * should always set this true.  This defaults true because if level 0 implementations forget to
  * set it they'll never notice (just silently leak caps), but if level >=1 implementations forget
  * to set it to false they'll quickly get errors.
  *
  * The receiver should act as if the sender had sent a release message with count=1 for each
  * CapDescriptor in the original Call message.
  *
  */
  get releaseParamCaps() {
    return getBit(32, this, _Return._capnp.defaultReleaseParamCaps);
  }
  set releaseParamCaps(value) {
    setBit(32, value, this, _Return._capnp.defaultReleaseParamCaps);
  }
  /**
  * If true, the sender does not need the receiver to send a `Finish` message; its answer table
  * entry has already been cleaned up. This implies that the results do not contain any
  * capabilities, since the `Finish` message would normally release those capabilities from
  * promise pipelining responsibility. The caller may still send a `Finish` message if it wants,
  * which will be silently ignored by the callee.
  *
  */
  get noFinishNeeded() {
    return getBit(33, this, _Return._capnp.defaultNoFinishNeeded);
  }
  set noFinishNeeded(value) {
    setBit(33, value, this, _Return._capnp.defaultNoFinishNeeded);
  }
  _adoptResults(value) {
    setUint16(6, 0, this);
    adopt(value, getPointer(0, this));
  }
  _disownResults() {
    return disown(this.results);
  }
  /**
  * The result.
  *
  * For regular method calls, `results.content` points to the result struct.
  *
  * For a `Return` in response to an `Accept` or `Bootstrap`, `results` contains a single
  * capability (rather than a struct), and `results.content` is just a capability pointer with
  * index 0.  A `Finish` is still required in this case.
  *
  */
  get results() {
    testWhich("results", getUint16(6, this), 0, this);
    return getStruct(0, Payload, this);
  }
  _hasResults() {
    return !isNull4(getPointer(0, this));
  }
  _initResults() {
    setUint16(6, 0, this);
    return initStructAt(0, Payload, this);
  }
  get _isResults() {
    return getUint16(6, this) === 0;
  }
  set results(value) {
    setUint16(6, 0, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptException(value) {
    setUint16(6, 1, this);
    adopt(value, getPointer(0, this));
  }
  _disownException() {
    return disown(this.exception);
  }
  /**
  * Indicates that the call failed and explains why.
  *
  */
  get exception() {
    testWhich("exception", getUint16(6, this), 1, this);
    return getStruct(0, Exception, this);
  }
  _hasException() {
    return !isNull4(getPointer(0, this));
  }
  _initException() {
    setUint16(6, 1, this);
    return initStructAt(0, Exception, this);
  }
  get _isException() {
    return getUint16(6, this) === 1;
  }
  set exception(value) {
    setUint16(6, 1, this);
    copyFrom(value, getPointer(0, this));
  }
  get _isCanceled() {
    return getUint16(6, this) === 2;
  }
  set canceled(_) {
    setUint16(6, 2, this);
  }
  get _isResultsSentElsewhere() {
    return getUint16(6, this) === 3;
  }
  set resultsSentElsewhere(_) {
    setUint16(6, 3, this);
  }
  /**
  * The sender has also sent (before this message) a `Call` with the given question ID and with
  * `sendResultsTo.yourself` set, and the results of that other call should be used as the
  * results here.  `takeFromOtherQuestion` can only used once per question.
  *
  */
  get takeFromOtherQuestion() {
    testWhich("takeFromOtherQuestion", getUint16(6, this), 4, this);
    return getUint32(8, this);
  }
  get _isTakeFromOtherQuestion() {
    return getUint16(6, this) === 4;
  }
  set takeFromOtherQuestion(value) {
    setUint16(6, 4, this);
    setUint32(8, value, this);
  }
  _adoptAcceptFromThirdParty(value) {
    setUint16(6, 5, this);
    adopt(value, getPointer(0, this));
  }
  _disownAcceptFromThirdParty() {
    return disown(this.acceptFromThirdParty);
  }
  /**
  * **(level 3)**
  *
  * The caller should contact a third-party vat to pick up the results.  An `Accept` message
  * sent to the vat will return the result.  This pairs with `Call.sendResultsTo.thirdParty`.
  * It should only be used if the corresponding `Call` had `allowThirdPartyTailCall` set.
  *
  */
  get acceptFromThirdParty() {
    testWhich("acceptFromThirdParty", getUint16(6, this), 5, this);
    return getPointer(0, this);
  }
  _hasAcceptFromThirdParty() {
    return !isNull4(getPointer(0, this));
  }
  get _isAcceptFromThirdParty() {
    return getUint16(6, this) === 5;
  }
  set acceptFromThirdParty(value) {
    setUint16(6, 5, this);
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Return_" + super.toString();
  }
  which() {
    return getUint16(6, this);
  }
};
var Finish = class _Finish extends Struct {
  static {
    __name(this, "_Finish");
  }
  static {
    __name2(this, "Finish");
  }
  static _capnp = {
    displayName: "Finish",
    id: "d37d2eb2c2f80e63",
    size: new ObjectSize(8, 0),
    defaultReleaseResultCaps: getBitMask(true, 0),
    defaultRequireEarlyCancellationWorkaround: getBitMask(true, 1)
  };
  /**
  * ID of the call whose result is to be released.
  *
  */
  get questionId() {
    return getUint32(0, this);
  }
  set questionId(value) {
    setUint32(0, value, this);
  }
  /**
  * If true, all capabilities that were in the results should be considered released.  The sender
  * must not send separate `Release` messages for them.  Level 0 implementations in particular
  * should always set this true.  This defaults true because if level 0 implementations forget to
  * set it they'll never notice (just silently leak caps), but if level >=1 implementations forget
  * set it false they'll quickly get errors.
  *
  */
  get releaseResultCaps() {
    return getBit(32, this, _Finish._capnp.defaultReleaseResultCaps);
  }
  set releaseResultCaps(value) {
    setBit(32, value, this, _Finish._capnp.defaultReleaseResultCaps);
  }
  /**
  * If true, if the RPC system receives this Finish message before the original call has even been
  * delivered, it should defer cancellation util after delivery. In particular, this gives the
  * destination object a chance to opt out of cancellation, e.g. as controlled by the
  * `allowCancellation` annotation defined in `c++.capnp`.
  *
  * This is a work-around. Versions 1.0 and up of Cap'n Proto always set this to false. However,
  * older versions of Cap'n Proto unintentionally exhibited this errant behavior by default, and
  * as a result programs built with older versions could be inadvertently relying on their peers
  * to implement the behavior. The purpose of this flag is to let newer versions know when the
  * peer is an older version, so that it can attempt to work around the issue.
  *
  * See also comments in handleFinish() in rpc.c++ for more details.
  *
  */
  get requireEarlyCancellationWorkaround() {
    return getBit(33, this, _Finish._capnp.defaultRequireEarlyCancellationWorkaround);
  }
  set requireEarlyCancellationWorkaround(value) {
    setBit(33, value, this, _Finish._capnp.defaultRequireEarlyCancellationWorkaround);
  }
  toString() {
    return "Finish_" + super.toString();
  }
};
var Resolve_Which = {
  /**
  * The ID of the promise to be resolved.
  *
  * Unlike all other instances of `ExportId` sent from the exporter, the `Resolve` message does
  * _not_ increase the reference count of `promiseId`.  In fact, it is expected that the receiver
  * will release the export soon after receiving `Resolve`, and the sender will not send this
  * `ExportId` again until it has been released and recycled.
  *
  * When an export ID sent over the wire (e.g. in a `CapDescriptor`) is indicated to be a promise,
  * this indicates that the sender will follow up at some point with a `Resolve` message.  If the
  * same `promiseId` is sent again before `Resolve`, still only one `Resolve` is sent.  If the
  * same ID is sent again later _after_ a `Resolve`, it can only be because the export's
  * reference count hit zero in the meantime and the ID was re-assigned to a new export, therefore
  * this later promise does _not_ correspond to the earlier `Resolve`.
  *
  * If a promise ID's reference count reaches zero before a `Resolve` is sent, the `Resolve`
  * message may or may not still be sent (the `Resolve` may have already been in-flight when
  * `Release` was sent, but if the `Release` is received before `Resolve` then there is no longer
  * any reason to send a `Resolve`).  Thus a `Resolve` may be received for a promise of which
  * the receiver has no knowledge, because it already released it earlier.  In this case, the
  * receiver should simply release the capability to which the promise resolved.
  *
  */
  CAP: 0,
  /**
  * The object to which the promise resolved.
  *
  * The sender promises that from this point forth, until `promiseId` is released, it shall
  * simply forward all messages to the capability designated by `cap`.  This is true even if
  * `cap` itself happens to designate another promise, and that other promise later resolves --
  * messages sent to `promiseId` shall still go to that other promise, not to its resolution.
  * This is important in the case that the receiver of the `Resolve` ends up sending a
  * `Disembargo` message towards `promiseId` in order to control message ordering -- that
  * `Disembargo` really needs to reflect back to exactly the object designated by `cap` even
  * if that object is itself a promise.
  *
  */
  EXCEPTION: 1
};
var Resolve = class extends Struct {
  static {
    __name(this, "Resolve");
  }
  static {
    __name2(this, "Resolve");
  }
  static CAP = Resolve_Which.CAP;
  static EXCEPTION = Resolve_Which.EXCEPTION;
  static _capnp = {
    displayName: "Resolve",
    id: "bbc29655fa89086e",
    size: new ObjectSize(8, 1)
  };
  /**
  * The ID of the promise to be resolved.
  *
  * Unlike all other instances of `ExportId` sent from the exporter, the `Resolve` message does
  * _not_ increase the reference count of `promiseId`.  In fact, it is expected that the receiver
  * will release the export soon after receiving `Resolve`, and the sender will not send this
  * `ExportId` again until it has been released and recycled.
  *
  * When an export ID sent over the wire (e.g. in a `CapDescriptor`) is indicated to be a promise,
  * this indicates that the sender will follow up at some point with a `Resolve` message.  If the
  * same `promiseId` is sent again before `Resolve`, still only one `Resolve` is sent.  If the
  * same ID is sent again later _after_ a `Resolve`, it can only be because the export's
  * reference count hit zero in the meantime and the ID was re-assigned to a new export, therefore
  * this later promise does _not_ correspond to the earlier `Resolve`.
  *
  * If a promise ID's reference count reaches zero before a `Resolve` is sent, the `Resolve`
  * message may or may not still be sent (the `Resolve` may have already been in-flight when
  * `Release` was sent, but if the `Release` is received before `Resolve` then there is no longer
  * any reason to send a `Resolve`).  Thus a `Resolve` may be received for a promise of which
  * the receiver has no knowledge, because it already released it earlier.  In this case, the
  * receiver should simply release the capability to which the promise resolved.
  *
  */
  get promiseId() {
    return getUint32(0, this);
  }
  set promiseId(value) {
    setUint32(0, value, this);
  }
  _adoptCap(value) {
    setUint16(4, 0, this);
    adopt(value, getPointer(0, this));
  }
  _disownCap() {
    return disown(this.cap);
  }
  /**
  * The object to which the promise resolved.
  *
  * The sender promises that from this point forth, until `promiseId` is released, it shall
  * simply forward all messages to the capability designated by `cap`.  This is true even if
  * `cap` itself happens to designate another promise, and that other promise later resolves --
  * messages sent to `promiseId` shall still go to that other promise, not to its resolution.
  * This is important in the case that the receiver of the `Resolve` ends up sending a
  * `Disembargo` message towards `promiseId` in order to control message ordering -- that
  * `Disembargo` really needs to reflect back to exactly the object designated by `cap` even
  * if that object is itself a promise.
  *
  */
  get cap() {
    testWhich("cap", getUint16(4, this), 0, this);
    return getStruct(0, CapDescriptor, this);
  }
  _hasCap() {
    return !isNull4(getPointer(0, this));
  }
  _initCap() {
    setUint16(4, 0, this);
    return initStructAt(0, CapDescriptor, this);
  }
  get _isCap() {
    return getUint16(4, this) === 0;
  }
  set cap(value) {
    setUint16(4, 0, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptException(value) {
    setUint16(4, 1, this);
    adopt(value, getPointer(0, this));
  }
  _disownException() {
    return disown(this.exception);
  }
  /**
  * Indicates that the promise was broken.
  *
  */
  get exception() {
    testWhich("exception", getUint16(4, this), 1, this);
    return getStruct(0, Exception, this);
  }
  _hasException() {
    return !isNull4(getPointer(0, this));
  }
  _initException() {
    setUint16(4, 1, this);
    return initStructAt(0, Exception, this);
  }
  get _isException() {
    return getUint16(4, this) === 1;
  }
  set exception(value) {
    setUint16(4, 1, this);
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "Resolve_" + super.toString();
  }
  which() {
    return getUint16(4, this);
  }
};
var Release = class extends Struct {
  static {
    __name(this, "Release");
  }
  static {
    __name2(this, "Release");
  }
  static _capnp = {
    displayName: "Release",
    id: "ad1a6c0d7dd07497",
    size: new ObjectSize(8, 0)
  };
  /**
  * What to release.
  *
  */
  get id() {
    return getUint32(0, this);
  }
  set id(value) {
    setUint32(0, value, this);
  }
  /**
  * The amount by which to decrement the reference count.  The export is only actually released
  * when the reference count reaches zero.
  *
  */
  get referenceCount() {
    return getUint32(4, this);
  }
  set referenceCount(value) {
    setUint32(4, value, this);
  }
  toString() {
    return "Release_" + super.toString();
  }
};
var Disembargo_Context_Which = {
  /**
  * The sender is requesting a disembargo on a promise that is known to resolve back to a
  * capability hosted by the sender.  As soon as the receiver has echoed back all pipelined calls
  * on this promise, it will deliver the Disembargo back to the sender with `receiverLoopback`
  * set to the same value as `senderLoopback`.  This value is chosen by the sender, and since
  * it is also consumed be the sender, the sender can use whatever strategy it wants to make sure
  * the value is unambiguous.
  *
  * The receiver must verify that the target capability actually resolves back to the sender's
  * vat.  Otherwise, the sender has committed a protocol error and should be disconnected.
  *
  */
  SENDER_LOOPBACK: 0,
  /**
  * The receiver previously sent a `senderLoopback` Disembargo towards a promise resolving to
  * this capability, and that Disembargo is now being echoed back.
  *
  */
  RECEIVER_LOOPBACK: 1,
  /**
  * **(level 3)**
  *
  * The sender is requesting a disembargo on a promise that is known to resolve to a third-party
  * capability that the sender is currently in the process of accepting (using `Accept`).
  * The receiver of this `Disembargo` has an outstanding `Provide` on said capability.  The
  * receiver should now send a `Disembargo` with `provide` set to the question ID of that
  * `Provide` message.
  *
  * See `Accept.embargo` for an example.
  *
  */
  ACCEPT: 2,
  /**
  * **(level 3)**
  *
  * The sender is requesting a disembargo on a capability currently being provided to a third
  * party.  The question ID identifies the `Provide` message previously sent by the sender to
  * this capability.  On receipt, the receiver (the capability host) shall release the embargo
  * on the `Accept` message that it has received from the third party.  See `Accept.embargo` for
  * an example.
  *
  */
  PROVIDE: 3
};
var Disembargo_Context = class extends Struct {
  static {
    __name(this, "Disembargo_Context");
  }
  static {
    __name2(this, "Disembargo_Context");
  }
  static SENDER_LOOPBACK = Disembargo_Context_Which.SENDER_LOOPBACK;
  static RECEIVER_LOOPBACK = Disembargo_Context_Which.RECEIVER_LOOPBACK;
  static ACCEPT = Disembargo_Context_Which.ACCEPT;
  static PROVIDE = Disembargo_Context_Which.PROVIDE;
  static _capnp = {
    displayName: "context",
    id: "d562b4df655bdd4d",
    size: new ObjectSize(8, 1)
  };
  /**
  * The sender is requesting a disembargo on a promise that is known to resolve back to a
  * capability hosted by the sender.  As soon as the receiver has echoed back all pipelined calls
  * on this promise, it will deliver the Disembargo back to the sender with `receiverLoopback`
  * set to the same value as `senderLoopback`.  This value is chosen by the sender, and since
  * it is also consumed be the sender, the sender can use whatever strategy it wants to make sure
  * the value is unambiguous.
  *
  * The receiver must verify that the target capability actually resolves back to the sender's
  * vat.  Otherwise, the sender has committed a protocol error and should be disconnected.
  *
  */
  get senderLoopback() {
    testWhich("senderLoopback", getUint16(4, this), 0, this);
    return getUint32(0, this);
  }
  get _isSenderLoopback() {
    return getUint16(4, this) === 0;
  }
  set senderLoopback(value) {
    setUint16(4, 0, this);
    setUint32(0, value, this);
  }
  /**
  * The receiver previously sent a `senderLoopback` Disembargo towards a promise resolving to
  * this capability, and that Disembargo is now being echoed back.
  *
  */
  get receiverLoopback() {
    testWhich("receiverLoopback", getUint16(4, this), 1, this);
    return getUint32(0, this);
  }
  get _isReceiverLoopback() {
    return getUint16(4, this) === 1;
  }
  set receiverLoopback(value) {
    setUint16(4, 1, this);
    setUint32(0, value, this);
  }
  get _isAccept() {
    return getUint16(4, this) === 2;
  }
  set accept(_) {
    setUint16(4, 2, this);
  }
  /**
  * **(level 3)**
  *
  * The sender is requesting a disembargo on a capability currently being provided to a third
  * party.  The question ID identifies the `Provide` message previously sent by the sender to
  * this capability.  On receipt, the receiver (the capability host) shall release the embargo
  * on the `Accept` message that it has received from the third party.  See `Accept.embargo` for
  * an example.
  *
  */
  get provide() {
    testWhich("provide", getUint16(4, this), 3, this);
    return getUint32(0, this);
  }
  get _isProvide() {
    return getUint16(4, this) === 3;
  }
  set provide(value) {
    setUint16(4, 3, this);
    setUint32(0, value, this);
  }
  toString() {
    return "Disembargo_Context_" + super.toString();
  }
  which() {
    return getUint16(4, this);
  }
};
var Disembargo = class extends Struct {
  static {
    __name(this, "Disembargo");
  }
  static {
    __name2(this, "Disembargo");
  }
  static _capnp = {
    displayName: "Disembargo",
    id: "f964368b0fbd3711",
    size: new ObjectSize(8, 1)
  };
  _adoptTarget(value) {
    adopt(value, getPointer(0, this));
  }
  _disownTarget() {
    return disown(this.target);
  }
  /**
  * What is to be disembargoed.
  *
  */
  get target() {
    return getStruct(0, MessageTarget, this);
  }
  _hasTarget() {
    return !isNull4(getPointer(0, this));
  }
  _initTarget() {
    return initStructAt(0, MessageTarget, this);
  }
  set target(value) {
    copyFrom(value, getPointer(0, this));
  }
  get context() {
    return getAs(Disembargo_Context, this);
  }
  _initContext() {
    return getAs(Disembargo_Context, this);
  }
  toString() {
    return "Disembargo_" + super.toString();
  }
};
var Provide = class extends Struct {
  static {
    __name(this, "Provide");
  }
  static {
    __name2(this, "Provide");
  }
  static _capnp = {
    displayName: "Provide",
    id: "9c6a046bfbc1ac5a",
    size: new ObjectSize(8, 2)
  };
  /**
  * Question ID to be held open until the recipient has received the capability.  A result will be
  * returned once the third party has successfully received the capability.  The sender must at some
  * point send a `Finish` message as with any other call, and that message can be used to cancel the
  * whole operation.
  *
  */
  get questionId() {
    return getUint32(0, this);
  }
  set questionId(value) {
    setUint32(0, value, this);
  }
  _adoptTarget(value) {
    adopt(value, getPointer(0, this));
  }
  _disownTarget() {
    return disown(this.target);
  }
  /**
  * What is to be provided to the third party.
  *
  */
  get target() {
    return getStruct(0, MessageTarget, this);
  }
  _hasTarget() {
    return !isNull4(getPointer(0, this));
  }
  _initTarget() {
    return initStructAt(0, MessageTarget, this);
  }
  set target(value) {
    copyFrom(value, getPointer(0, this));
  }
  _adoptRecipient(value) {
    adopt(value, getPointer(1, this));
  }
  _disownRecipient() {
    return disown(this.recipient);
  }
  /**
  * Identity of the third party that is expected to pick up the capability.
  *
  */
  get recipient() {
    return getPointer(1, this);
  }
  _hasRecipient() {
    return !isNull4(getPointer(1, this));
  }
  set recipient(value) {
    copyFrom(value, getPointer(1, this));
  }
  toString() {
    return "Provide_" + super.toString();
  }
};
var Accept = class extends Struct {
  static {
    __name(this, "Accept");
  }
  static {
    __name2(this, "Accept");
  }
  static _capnp = {
    displayName: "Accept",
    id: "d4c9b56290554016",
    size: new ObjectSize(8, 1)
  };
  /**
  * A new question ID identifying this accept message, which will eventually receive a Return
  * message containing the provided capability (or the call result in the case of a redirected
  * return).
  *
  */
  get questionId() {
    return getUint32(0, this);
  }
  set questionId(value) {
    setUint32(0, value, this);
  }
  _adoptProvision(value) {
    adopt(value, getPointer(0, this));
  }
  _disownProvision() {
    return disown(this.provision);
  }
  /**
  * Identifies the provided object to be picked up.
  *
  */
  get provision() {
    return getPointer(0, this);
  }
  _hasProvision() {
    return !isNull4(getPointer(0, this));
  }
  set provision(value) {
    copyFrom(value, getPointer(0, this));
  }
  /**
  * If true, this accept shall be temporarily embargoed.  The resulting `Return` will not be sent,
  * and any pipelined calls will not be delivered, until the embargo is released.  The receiver
  * (the capability host) will expect the provider (the vat that sent the `Provide` message) to
  * eventually send a `Disembargo` message with the field `context.provide` set to the question ID
  * of the original `Provide` message.  At that point, the embargo is released and the queued
  * messages are delivered.
  *
  * For example:
  * - Alice, in Vat A, holds a promise P, which currently points toward Vat B.
  * - Alice calls foo() on P.  The `Call` message is sent to Vat B.
  * - The promise P in Vat B ends up resolving to Carol, in Vat C.
  * - Vat B sends a `Provide` message to Vat C, identifying Vat A as the recipient.
  * - Vat B sends a `Resolve` message to Vat A, indicating that the promise has resolved to a
  *   `ThirdPartyCapId` identifying Carol in Vat C.
  * - Vat A sends an `Accept` message to Vat C to pick up the capability.  Since Vat A knows that
  *   it has an outstanding call to the promise, it sets `embargo` to `true` in the `Accept`
  *   message.
  * - Vat A sends a `Disembargo` message to Vat B on promise P, with `context.accept` set.
  * - Alice makes a call bar() to promise P, which is now pointing towards Vat C.  Alice doesn't
  *   know anything about the mechanics of promise resolution happening under the hood, but she
  *   expects that bar() will be delivered after foo() because that is the order in which she
  *   initiated the calls.
  * - Vat A sends the bar() call to Vat C, as a pipelined call on the result of the `Accept` (which
  *   hasn't returned yet, due to the embargo).  Since calls to the newly-accepted capability
  *   are embargoed, Vat C does not deliver the call yet.
  * - At some point, Vat B forwards the foo() call from the beginning of this example on to Vat C.
  * - Vat B forwards the `Disembargo` from Vat A on to vat C.  It sets `context.provide` to the
  *   question ID of the `Provide` message it had sent previously.
  * - Vat C receives foo() before `Disembargo`, thus allowing it to correctly deliver foo()
  *   before delivering bar().
  * - Vat C receives `Disembargo` from Vat B.  It can now send a `Return` for the `Accept` from
  *   Vat A, as well as deliver bar().
  *
  */
  get embargo() {
    return getBit(32, this);
  }
  set embargo(value) {
    setBit(32, value, this);
  }
  toString() {
    return "Accept_" + super.toString();
  }
};
var Join = class extends Struct {
  static {
    __name(this, "Join");
  }
  static {
    __name2(this, "Join");
  }
  static _capnp = {
    displayName: "Join",
    id: "fbe1980490e001af",
    size: new ObjectSize(8, 2)
  };
  /**
  * Question ID used to respond to this Join.  (Note that this ID only identifies one part of the
  * request for one hop; each part has a different ID and relayed copies of the request have
  * (probably) different IDs still.)
  *
  * The receiver will reply with a `Return` whose `results` is a JoinResult.  This `JoinResult`
  * is relayed from the joined object's host, possibly with transformation applied as needed
  * by the network.
  *
  * Like any return, the result must be released using a `Finish`.  However, this release
  * should not occur until the joiner has either successfully connected to the joined object.
  * Vats relaying a `Join` message similarly must not release the result they receive until the
  * return they relayed back towards the joiner has itself been released.  This allows the
  * joined object's host to detect when the Join operation is canceled before completing -- if
  * it receives a `Finish` for one of the join results before the joiner successfully
  * connects.  It can then free any resources it had allocated as part of the join.
  *
  */
  get questionId() {
    return getUint32(0, this);
  }
  set questionId(value) {
    setUint32(0, value, this);
  }
  _adoptTarget(value) {
    adopt(value, getPointer(0, this));
  }
  _disownTarget() {
    return disown(this.target);
  }
  /**
  * The capability to join.
  *
  */
  get target() {
    return getStruct(0, MessageTarget, this);
  }
  _hasTarget() {
    return !isNull4(getPointer(0, this));
  }
  _initTarget() {
    return initStructAt(0, MessageTarget, this);
  }
  set target(value) {
    copyFrom(value, getPointer(0, this));
  }
  _adoptKeyPart(value) {
    adopt(value, getPointer(1, this));
  }
  _disownKeyPart() {
    return disown(this.keyPart);
  }
  /**
  * A part of the join key.  These combine to form the complete join key, which is used to establish
  * a direct connection.
  *
  */
  get keyPart() {
    return getPointer(1, this);
  }
  _hasKeyPart() {
    return !isNull4(getPointer(1, this));
  }
  set keyPart(value) {
    copyFrom(value, getPointer(1, this));
  }
  toString() {
    return "Join_" + super.toString();
  }
};
var MessageTarget_Which = {
  /**
  * This message is to a capability or promise previously imported by the caller (exported by
  * the receiver).
  *
  */
  IMPORTED_CAP: 0,
  /**
  * This message is to a capability that is expected to be returned by another call that has not
  * yet been completed.
  *
  * At level 0, this is supported only for addressing the result of a previous `Bootstrap`, so
  * that initial startup doesn't require a round trip.
  *
  */
  PROMISED_ANSWER: 1
};
var MessageTarget = class extends Struct {
  static {
    __name(this, "MessageTarget");
  }
  static {
    __name2(this, "MessageTarget");
  }
  static IMPORTED_CAP = MessageTarget_Which.IMPORTED_CAP;
  static PROMISED_ANSWER = MessageTarget_Which.PROMISED_ANSWER;
  static _capnp = {
    displayName: "MessageTarget",
    id: "95bc14545813fbc1",
    size: new ObjectSize(8, 1)
  };
  /**
  * This message is to a capability or promise previously imported by the caller (exported by
  * the receiver).
  *
  */
  get importedCap() {
    testWhich("importedCap", getUint16(4, this), 0, this);
    return getUint32(0, this);
  }
  get _isImportedCap() {
    return getUint16(4, this) === 0;
  }
  set importedCap(value) {
    setUint16(4, 0, this);
    setUint32(0, value, this);
  }
  _adoptPromisedAnswer(value) {
    setUint16(4, 1, this);
    adopt(value, getPointer(0, this));
  }
  _disownPromisedAnswer() {
    return disown(this.promisedAnswer);
  }
  /**
  * This message is to a capability that is expected to be returned by another call that has not
  * yet been completed.
  *
  * At level 0, this is supported only for addressing the result of a previous `Bootstrap`, so
  * that initial startup doesn't require a round trip.
  *
  */
  get promisedAnswer() {
    testWhich("promisedAnswer", getUint16(4, this), 1, this);
    return getStruct(0, PromisedAnswer, this);
  }
  _hasPromisedAnswer() {
    return !isNull4(getPointer(0, this));
  }
  _initPromisedAnswer() {
    setUint16(4, 1, this);
    return initStructAt(0, PromisedAnswer, this);
  }
  get _isPromisedAnswer() {
    return getUint16(4, this) === 1;
  }
  set promisedAnswer(value) {
    setUint16(4, 1, this);
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "MessageTarget_" + super.toString();
  }
  which() {
    return getUint16(4, this);
  }
};
var Payload = class _Payload extends Struct {
  static {
    __name(this, "_Payload");
  }
  static {
    __name2(this, "Payload");
  }
  static _capnp = {
    displayName: "Payload",
    id: "9a0e61223d96743b",
    size: new ObjectSize(0, 2)
  };
  static _CapTable;
  _adoptContent(value) {
    adopt(value, getPointer(0, this));
  }
  _disownContent() {
    return disown(this.content);
  }
  /**
  * Some Cap'n Proto data structure.  Capability pointers embedded in this structure index into
  * `capTable`.
  *
  */
  get content() {
    return getPointer(0, this);
  }
  _hasContent() {
    return !isNull4(getPointer(0, this));
  }
  set content(value) {
    copyFrom(value, getPointer(0, this));
  }
  _adoptCapTable(value) {
    adopt(value, getPointer(1, this));
  }
  _disownCapTable() {
    return disown(this.capTable);
  }
  /**
  * Descriptors corresponding to the cap pointers in `content`.
  *
  */
  get capTable() {
    return getList(1, _Payload._CapTable, this);
  }
  _hasCapTable() {
    return !isNull4(getPointer(1, this));
  }
  _initCapTable(length) {
    return initList(1, _Payload._CapTable, length, this);
  }
  set capTable(value) {
    copyFrom(value, getPointer(1, this));
  }
  toString() {
    return "Payload_" + super.toString();
  }
};
var CapDescriptor_Which = {
  /**
  * There is no capability here.  This `CapDescriptor` should not appear in the payload content.
  * A `none` CapDescriptor can be generated when an application inserts a capability into a
  * message and then later changes its mind and removes it -- rewriting all of the other
  * capability pointers may be hard, so instead a tombstone is left, similar to the way a removed
  * struct or list instance is zeroed out of the message but the space is not reclaimed.
  * Hopefully this is unusual.
  *
  */
  NONE: 0,
  /**
  * The ID of a capability in the sender's export table (receiver's import table).  It may be a
  * newly allocated table entry, or an existing entry (increments the reference count).
  *
  */
  SENDER_HOSTED: 1,
  /**
  * A promise that the sender will resolve later.  The sender will send exactly one Resolve
  * message at a future point in time to replace this promise.  Note that even if the same
  * `senderPromise` is received multiple times, only one `Resolve` is sent to cover all of
  * them.  If `senderPromise` is released before the `Resolve` is sent, the sender (of this
  * `CapDescriptor`) may choose not to send the `Resolve` at all.
  *
  */
  SENDER_PROMISE: 2,
  /**
  * A capability (or promise) previously exported by the receiver (imported by the sender).
  *
  */
  RECEIVER_HOSTED: 3,
  /**
  * A capability expected to be returned in the results of a currently-outstanding call posed
  * by the sender.
  *
  */
  RECEIVER_ANSWER: 4,
  /**
  * **(level 3)**
  *
  * A capability that lives in neither the sender's nor the receiver's vat.  The sender needs
  * to form a direct connection to a third party to pick up the capability.
  *
  * Level 1 and 2 implementations that receive a `thirdPartyHosted` may simply send calls to its
  * `vine` instead.
  *
  */
  THIRD_PARTY_HOSTED: 5
};
var CapDescriptor = class _CapDescriptor extends Struct {
  static {
    __name(this, "_CapDescriptor");
  }
  static {
    __name2(this, "CapDescriptor");
  }
  static NONE = CapDescriptor_Which.NONE;
  static SENDER_HOSTED = CapDescriptor_Which.SENDER_HOSTED;
  static SENDER_PROMISE = CapDescriptor_Which.SENDER_PROMISE;
  static RECEIVER_HOSTED = CapDescriptor_Which.RECEIVER_HOSTED;
  static RECEIVER_ANSWER = CapDescriptor_Which.RECEIVER_ANSWER;
  static THIRD_PARTY_HOSTED = CapDescriptor_Which.THIRD_PARTY_HOSTED;
  static _capnp = {
    displayName: "CapDescriptor",
    id: "8523ddc40b86b8b0",
    size: new ObjectSize(8, 1),
    defaultAttachedFd: getUint8Mask(255)
  };
  get _isNone() {
    return getUint16(0, this) === 0;
  }
  set none(_) {
    setUint16(0, 0, this);
  }
  /**
  * The ID of a capability in the sender's export table (receiver's import table).  It may be a
  * newly allocated table entry, or an existing entry (increments the reference count).
  *
  */
  get senderHosted() {
    testWhich("senderHosted", getUint16(0, this), 1, this);
    return getUint32(4, this);
  }
  get _isSenderHosted() {
    return getUint16(0, this) === 1;
  }
  set senderHosted(value) {
    setUint16(0, 1, this);
    setUint32(4, value, this);
  }
  /**
  * A promise that the sender will resolve later.  The sender will send exactly one Resolve
  * message at a future point in time to replace this promise.  Note that even if the same
  * `senderPromise` is received multiple times, only one `Resolve` is sent to cover all of
  * them.  If `senderPromise` is released before the `Resolve` is sent, the sender (of this
  * `CapDescriptor`) may choose not to send the `Resolve` at all.
  *
  */
  get senderPromise() {
    testWhich("senderPromise", getUint16(0, this), 2, this);
    return getUint32(4, this);
  }
  get _isSenderPromise() {
    return getUint16(0, this) === 2;
  }
  set senderPromise(value) {
    setUint16(0, 2, this);
    setUint32(4, value, this);
  }
  /**
  * A capability (or promise) previously exported by the receiver (imported by the sender).
  *
  */
  get receiverHosted() {
    testWhich("receiverHosted", getUint16(0, this), 3, this);
    return getUint32(4, this);
  }
  get _isReceiverHosted() {
    return getUint16(0, this) === 3;
  }
  set receiverHosted(value) {
    setUint16(0, 3, this);
    setUint32(4, value, this);
  }
  _adoptReceiverAnswer(value) {
    setUint16(0, 4, this);
    adopt(value, getPointer(0, this));
  }
  _disownReceiverAnswer() {
    return disown(this.receiverAnswer);
  }
  /**
  * A capability expected to be returned in the results of a currently-outstanding call posed
  * by the sender.
  *
  */
  get receiverAnswer() {
    testWhich("receiverAnswer", getUint16(0, this), 4, this);
    return getStruct(0, PromisedAnswer, this);
  }
  _hasReceiverAnswer() {
    return !isNull4(getPointer(0, this));
  }
  _initReceiverAnswer() {
    setUint16(0, 4, this);
    return initStructAt(0, PromisedAnswer, this);
  }
  get _isReceiverAnswer() {
    return getUint16(0, this) === 4;
  }
  set receiverAnswer(value) {
    setUint16(0, 4, this);
    copyFrom(value, getPointer(0, this));
  }
  _adoptThirdPartyHosted(value) {
    setUint16(0, 5, this);
    adopt(value, getPointer(0, this));
  }
  _disownThirdPartyHosted() {
    return disown(this.thirdPartyHosted);
  }
  /**
  * **(level 3)**
  *
  * A capability that lives in neither the sender's nor the receiver's vat.  The sender needs
  * to form a direct connection to a third party to pick up the capability.
  *
  * Level 1 and 2 implementations that receive a `thirdPartyHosted` may simply send calls to its
  * `vine` instead.
  *
  */
  get thirdPartyHosted() {
    testWhich("thirdPartyHosted", getUint16(0, this), 5, this);
    return getStruct(0, ThirdPartyCapDescriptor, this);
  }
  _hasThirdPartyHosted() {
    return !isNull4(getPointer(0, this));
  }
  _initThirdPartyHosted() {
    setUint16(0, 5, this);
    return initStructAt(0, ThirdPartyCapDescriptor, this);
  }
  get _isThirdPartyHosted() {
    return getUint16(0, this) === 5;
  }
  set thirdPartyHosted(value) {
    setUint16(0, 5, this);
    copyFrom(value, getPointer(0, this));
  }
  /**
  * If the RPC message in which this CapDescriptor was delivered also had file descriptors
  * attached, and `fd` is a valid index into the list of attached file descriptors, then
  * that file descriptor should be attached to this capability. If `attachedFd` is out-of-bounds
  * for said list, then no FD is attached.
  *
  * For example, if the RPC message arrived over a Unix socket, then file descriptors may be
  * attached by sending an SCM_RIGHTS ancillary message attached to the data bytes making up the
  * raw message. Receivers who wish to opt into FD passing should arrange to receive SCM_RIGHTS
  * whenever receiving an RPC message. Senders who wish to send FDs need not verify whether the
  * receiver knows how to receive them, because the operating system will automatically discard
  * ancillary messages like SCM_RIGHTS if the receiver doesn't ask to receive them, including
  * automatically closing any FDs.
  *
  * It is up to the application protocol to define what capabilities are expected to have file
  * descriptors attached, and what those FDs mean. But, for example, an application could use this
  * to open a file on disk and then transmit the open file descriptor to a sandboxed process that
  * does not otherwise have permission to access the filesystem directly. This is usually an
  * optimization: the sending process could instead provide an RPC interface supporting all the
  * operations needed (such as reading and writing a file), but by passing the file descriptor
  * directly, the recipient can often perform operations much more efficiently. Application
  * designers are encouraged to provide such RPC interfaces and automatically fall back to them
  * when FD passing is not available, so that the application can still work when the parties are
  * remote over a network.
  *
  * An attached FD is most often associated with a `senderHosted` descriptor. It could also make
  * sense in the case of `thirdPartyHosted`: in this case, the sender is forwarding the FD that
  * they received from the third party, so that the receiver can start using it without first
  * interacting with the third party. This is an optional optimization -- the middleman may choose
  * not to forward capabilities, in which case the receiver will need to complete the handshake
  * with the third party directly before receiving the FD. If an implementation receives a second
  * attached FD after having already received one previously (e.g. both in a `thirdPartyHosted`
  * CapDescriptor and then later again when receiving the final capability directly from the
  * third party), the implementation should discard the later FD and stick with the original. At
  * present, there is no known reason why other capability types (e.g. `receiverHosted`) would want
  * to carry an attached FD, but we reserve the right to define a meaning for this in the future.
  *
  * Each file descriptor attached to the message must be used in no more than one CapDescriptor,
  * so that the receiver does not need to use dup() or refcounting to handle the possibility of
  * multiple capabilities using the same descriptor. If multiple CapDescriptors do point to the
  * same FD index, then the receiver can arbitrarily choose which capability ends up having the
  * FD attached.
  *
  * To mitigate DoS attacks, RPC implementations should limit the number of FDs they are willing to
  * receive in a single message to a small value. If a message happens to contain more than that,
  * the list is truncated. Moreover, in some cases, FD passing needs to be blocked entirely for
  * security or implementation reasons, in which case the list may be truncated to zero. Hence,
  * `attachedFd` might point past the end of the list, which the implementation should treat as if
  * no FD was attached at all.
  *
  * The type of this field was chosen to be UInt8 because Linux supports sending only a maximum
  * of 253 file descriptors in an SCM_RIGHTS message anyway, and CapDescriptor had two bytes of
  * padding left -- so after adding this, there is still one byte for a future feature.
  * Conveniently, this also means we're able to use 0xff as the default value, which will always
  * be out-of-range (of course, the implementation should explicitly enforce that 255 descriptors
  * cannot be sent at once, rather than relying on Linux to do so).
  *
  */
  get attachedFd() {
    return getUint8(2, this, _CapDescriptor._capnp.defaultAttachedFd);
  }
  set attachedFd(value) {
    setUint8(2, value, this, _CapDescriptor._capnp.defaultAttachedFd);
  }
  toString() {
    return "CapDescriptor_" + super.toString();
  }
  which() {
    return getUint16(0, this);
  }
};
var PromisedAnswer_Op_Which = {
  /**
  * Does nothing.  This member is mostly defined so that we can make `Op` a union even
  * though (as of this writing) only one real operation is defined.
  *
  */
  NOOP: 0,
  /**
  * Get a pointer field within a struct.  The number is an index into the pointer section, NOT
  * a field ordinal, so that the receiver does not need to understand the schema.
  *
  */
  GET_POINTER_FIELD: 1
};
var PromisedAnswer_Op = class extends Struct {
  static {
    __name(this, "PromisedAnswer_Op");
  }
  static {
    __name2(this, "PromisedAnswer_Op");
  }
  static NOOP = PromisedAnswer_Op_Which.NOOP;
  static GET_POINTER_FIELD = PromisedAnswer_Op_Which.GET_POINTER_FIELD;
  static _capnp = {
    displayName: "Op",
    id: "f316944415569081",
    size: new ObjectSize(8, 0)
  };
  get _isNoop() {
    return getUint16(0, this) === 0;
  }
  set noop(_) {
    setUint16(0, 0, this);
  }
  /**
  * Get a pointer field within a struct.  The number is an index into the pointer section, NOT
  * a field ordinal, so that the receiver does not need to understand the schema.
  *
  */
  get getPointerField() {
    testWhich("getPointerField", getUint16(0, this), 1, this);
    return getUint16(2, this);
  }
  get _isGetPointerField() {
    return getUint16(0, this) === 1;
  }
  set getPointerField(value) {
    setUint16(0, 1, this);
    setUint16(2, value, this);
  }
  toString() {
    return "PromisedAnswer_Op_" + super.toString();
  }
  which() {
    return getUint16(0, this);
  }
};
var PromisedAnswer = class _PromisedAnswer extends Struct {
  static {
    __name(this, "_PromisedAnswer");
  }
  static {
    __name2(this, "PromisedAnswer");
  }
  static Op = PromisedAnswer_Op;
  static _capnp = {
    displayName: "PromisedAnswer",
    id: "d800b1d6cd6f1ca0",
    size: new ObjectSize(8, 1)
  };
  static _Transform;
  /**
  * ID of the question (in the sender's question table / receiver's answer table) whose answer is
  * expected to contain the capability.
  *
  */
  get questionId() {
    return getUint32(0, this);
  }
  set questionId(value) {
    setUint32(0, value, this);
  }
  _adoptTransform(value) {
    adopt(value, getPointer(0, this));
  }
  _disownTransform() {
    return disown(this.transform);
  }
  /**
  * Operations / transformations to apply to the result in order to get the capability actually
  * being addressed.  E.g. if the result is a struct and you want to call a method on a capability
  * pointed to by a field of the struct, you need a `getPointerField` op.
  *
  */
  get transform() {
    return getList(0, _PromisedAnswer._Transform, this);
  }
  _hasTransform() {
    return !isNull4(getPointer(0, this));
  }
  _initTransform(length) {
    return initList(0, _PromisedAnswer._Transform, length, this);
  }
  set transform(value) {
    copyFrom(value, getPointer(0, this));
  }
  toString() {
    return "PromisedAnswer_" + super.toString();
  }
};
var ThirdPartyCapDescriptor = class extends Struct {
  static {
    __name(this, "ThirdPartyCapDescriptor");
  }
  static {
    __name2(this, "ThirdPartyCapDescriptor");
  }
  static _capnp = {
    displayName: "ThirdPartyCapDescriptor",
    id: "d37007fde1f0027d",
    size: new ObjectSize(8, 1)
  };
  _adoptId(value) {
    adopt(value, getPointer(0, this));
  }
  _disownId() {
    return disown(this.id);
  }
  /**
  * Identifies the third-party host and the specific capability to accept from it.
  *
  */
  get id() {
    return getPointer(0, this);
  }
  _hasId() {
    return !isNull4(getPointer(0, this));
  }
  set id(value) {
    copyFrom(value, getPointer(0, this));
  }
  /**
  * A proxy for the third-party object exported by the sender.  In CapTP terminology this is called
  * a "vine", because it is an indirect reference to the third-party object that snakes through the
  * sender vat.  This serves two purposes:
  *
  * * Level 1 and 2 implementations that don't understand how to connect to a third party may
  *   simply send calls to the vine.  Such calls will be forwarded to the third-party by the
  *   sender.
  *
  * * Level 3 implementations must release the vine only once they have successfully picked up the
  *   object from the third party.  This ensures that the capability is not released by the sender
  *   prematurely.
  *
  * The sender will close the `Provide` request that it has sent to the third party as soon as
  * it receives either a `Call` or a `Release` message directed at the vine.
  *
  */
  get vineId() {
    return getUint32(0, this);
  }
  set vineId(value) {
    setUint32(0, value, this);
  }
  toString() {
    return "ThirdPartyCapDescriptor_" + super.toString();
  }
};
var Exception_Type = {
  /**
  * A generic problem occurred, and it is believed that if the operation were repeated without
  * any change in the state of the world, the problem would occur again.
  *
  * A client might respond to this error by logging it for investigation by the developer and/or
  * displaying it to the user.
  *
  */
  FAILED: 0,
  /**
  * The request was rejected due to a temporary lack of resources.
  *
  * Examples include:
  * - There's not enough CPU time to keep up with incoming requests, so some are rejected.
  * - The server ran out of RAM or disk space during the request.
  * - The operation timed out (took significantly longer than it should have).
  *
  * A client might respond to this error by scheduling to retry the operation much later. The
  * client should NOT retry again immediately since this would likely exacerbate the problem.
  *
  */
  OVERLOADED: 1,
  /**
  * The method failed because a connection to some necessary capability was lost.
  *
  * Examples include:
  * - The client introduced the server to a third-party capability, the connection to that third
  *   party was subsequently lost, and then the client requested that the server use the dead
  *   capability for something.
  * - The client previously requested that the server obtain a capability from some third party.
  *   The server returned a capability to an object wrapping the third-party capability. Later,
  *   the server's connection to the third party was lost.
  * - The capability has been revoked. Revocation does not necessarily mean that the client is
  *   no longer authorized to use the capability; it is often used simply as a way to force the
  *   client to repeat the setup process, perhaps to efficiently move them to a new back-end or
  *   get them to recognize some other change that has occurred.
  *
  * A client should normally respond to this error by releasing all capabilities it is currently
  * holding related to the one it called and then re-creating them by restoring SturdyRefs and/or
  * repeating the method calls used to create them originally. In other words, disconnect and
  * start over. This should in turn cause the server to obtain a new copy of the capability that
  * it lost, thus making everything work.
  *
  * If the client receives another `disconnected` error in the process of rebuilding the
  * capability and retrying the call, it should treat this as an `overloaded` error: the network
  * is currently unreliable, possibly due to load or other temporary issues.
  *
  */
  DISCONNECTED: 2,
  /**
  * The server doesn't implement the requested method. If there is some other method that the
  * client could call (perhaps an older and/or slower interface), it should try that instead.
  * Otherwise, this should be treated like `failed`.
  *
  */
  UNIMPLEMENTED: 3
};
var Exception = class extends Struct {
  static {
    __name(this, "Exception");
  }
  static {
    __name2(this, "Exception");
  }
  static Type = Exception_Type;
  static _capnp = {
    displayName: "Exception",
    id: "d625b7063acf691a",
    size: new ObjectSize(8, 2)
  };
  /**
  * Human-readable failure description.
  *
  */
  get reason() {
    return getText(0, this);
  }
  set reason(value) {
    setText(0, value, this);
  }
  /**
  * The type of the error. The purpose of this enum is not to describe the error itself, but
  * rather to describe how the client might want to respond to the error.
  *
  */
  get type() {
    return getUint16(4, this);
  }
  set type(value) {
    setUint16(4, value, this);
  }
  /**
  * OBSOLETE. Ignore.
  *
  */
  get obsoleteIsCallersFault() {
    return getBit(0, this);
  }
  set obsoleteIsCallersFault(value) {
    setBit(0, value, this);
  }
  /**
  * OBSOLETE. See `type` instead.
  *
  */
  get obsoleteDurability() {
    return getUint16(2, this);
  }
  set obsoleteDurability(value) {
    setUint16(2, value, this);
  }
  /**
  * Stack trace text from the remote server. The format is not specified. By default,
  * implementations do not provide stack traces; the application must explicitly enable them
  * when desired.
  *
  */
  get trace() {
    return getText(1, this);
  }
  set trace(value) {
    setText(1, value, this);
  }
  toString() {
    return "Exception_" + super.toString();
  }
};
Payload._CapTable = CompositeList(CapDescriptor);
PromisedAnswer._Transform = CompositeList(PromisedAnswer_Op);
var Void = class extends Struct {
  static {
    __name(this, "Void");
  }
  static {
    __name2(this, "Void");
  }
  static _capnp = {
    displayName: "Void",
    id: "0",
    size: new ObjectSize(0, 0)
  };
};
var utils = {
  __proto__: null,
  PointerAllocationResult,
  add,
  adopt,
  checkDataBounds,
  checkPointerBounds,
  copyFrom,
  copyFromInterface,
  copyFromList,
  copyFromStruct,
  disown,
  dump,
  erase,
  erasePointer,
  followFar,
  followFars,
  getAs,
  getBit,
  getCapabilityId,
  getContent,
  getData,
  getDataSection,
  getFarSegmentId,
  getFloat32,
  getFloat64,
  getInt16,
  getInt32,
  getInt64,
  getInt8,
  getInterfaceClientOrNull,
  getInterfaceClientOrNullAt,
  getInterfacePointer,
  getList,
  getListByteLength,
  getListElementByteLength,
  getListElementSize,
  getListLength,
  getOffsetWords,
  getPointer,
  getPointerAs,
  getPointerSection,
  getPointerType,
  getSize,
  getStruct,
  getStructDataWords,
  getStructPointerLength,
  getStructSize,
  getTargetCompositeListSize,
  getTargetCompositeListTag,
  getTargetListElementSize,
  getTargetListLength,
  getTargetPointerType,
  getTargetStructSize,
  getText,
  getUint16,
  getUint32,
  getUint64,
  getUint8,
  initData,
  initList,
  initPointer,
  initStruct,
  initStructAt,
  isDoubleFar,
  isNull: isNull4,
  relocateTo,
  resize,
  setBit,
  setFarPointer,
  setFloat32,
  setFloat64,
  setInt16,
  setInt32,
  setInt64,
  setInt8,
  setInterfacePointer,
  setListPointer,
  setStructPointer,
  setText,
  setUint16,
  setUint32,
  setUint64,
  setUint8,
  testWhich,
  trackPointerAllocation,
  validate
};
function PointerList(PointerClass) {
  return class extends List {
    static _capnp = {
      displayName: `List<${PointerClass._capnp.displayName}>`,
      size: ListElementSize.POINTER
    };
    get(index) {
      const c = getContent(this);
      return new PointerClass(c.segment, c.byteOffset + index * 8, this._capnp.depthLimit - 1);
    }
    set(index, value) {
      copyFrom(value, this.get(index));
    }
    [Symbol.toStringTag]() {
      return `Pointer_${super.toString()},cls:${PointerClass.toString()}`;
    }
  };
}
__name(PointerList, "PointerList");
__name2(PointerList, "PointerList");
PointerList(Pointer);
(class extends List {
  static {
    __name(this, "BoolList");
  }
  static {
    __name2(this, "BoolList");
  }
  static _capnp = {
    displayName: "List<boolean>",
    size: ListElementSize.BIT
  };
  get(index) {
    const bitMask = 1 << index % 8;
    const byteOffset = index >>> 3;
    const c = getContent(this);
    const v = c.segment.getUint8(c.byteOffset + byteOffset);
    return (v & bitMask) !== 0;
  }
  set(index, value) {
    const bitMask = 1 << index % 8;
    const c = getContent(this);
    const byteOffset = c.byteOffset + (index >>> 3);
    const v = c.segment.getUint8(byteOffset);
    c.segment.setUint8(byteOffset, value ? v | bitMask : v & ~bitMask);
  }
  [Symbol.toStringTag]() {
    return `Bool_${super.toString()}`;
  }
});
PointerList(Data);
(class extends List {
  static {
    __name(this, "Float32List");
  }
  static {
    __name2(this, "Float32List");
  }
  static _capnp = {
    displayName: "List<Float32>",
    size: ListElementSize.BYTE_4
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getFloat32(c.byteOffset + index * 4);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setFloat32(c.byteOffset + index * 4, value);
  }
  [Symbol.toStringTag]() {
    return `Float32_${super.toString()}`;
  }
});
(class extends List {
  static {
    __name(this, "Float64List");
  }
  static {
    __name2(this, "Float64List");
  }
  static _capnp = {
    displayName: "List<Float64>",
    size: ListElementSize.BYTE_8
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getFloat64(c.byteOffset + index * 8);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setFloat64(c.byteOffset + index * 8, value);
  }
  [Symbol.toStringTag]() {
    return `Float64_${super.toString()}`;
  }
});
(class extends List {
  static {
    __name(this, "Int8List");
  }
  static {
    __name2(this, "Int8List");
  }
  static _capnp = {
    displayName: "List<Int8>",
    size: ListElementSize.BYTE
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getInt8(c.byteOffset + index);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setInt8(c.byteOffset + index, value);
  }
  [Symbol.toStringTag]() {
    return `Int8_${super.toString()}`;
  }
});
(class extends List {
  static {
    __name(this, "Int16List");
  }
  static {
    __name2(this, "Int16List");
  }
  static _capnp = {
    displayName: "List<Int16>",
    size: ListElementSize.BYTE_2
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getInt16(c.byteOffset + index * 2);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setInt16(c.byteOffset + index * 2, value);
  }
  [Symbol.toStringTag]() {
    return `Int16_${super.toString()}`;
  }
});
(class extends List {
  static {
    __name(this, "Int32List");
  }
  static {
    __name2(this, "Int32List");
  }
  static _capnp = {
    displayName: "List<Int32>",
    size: ListElementSize.BYTE_4
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getInt32(c.byteOffset + index * 4);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setInt32(c.byteOffset + index * 4, value);
  }
  [Symbol.toStringTag]() {
    return `Int32_${super.toString()}`;
  }
});
(class extends List {
  static {
    __name(this, "Int64List");
  }
  static {
    __name2(this, "Int64List");
  }
  static _capnp = {
    displayName: "List<Int64>",
    size: ListElementSize.BYTE_8
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getInt64(c.byteOffset + index * 8);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setInt64(c.byteOffset + index * 8, value);
  }
  [Symbol.toStringTag]() {
    return `Int64_${super.toString()}`;
  }
});
PointerList(Interface);
var TextList = class extends List {
  static {
    __name(this, "TextList");
  }
  static {
    __name2(this, "TextList");
  }
  static _capnp = {
    displayName: "List<Text>",
    size: ListElementSize.POINTER
  };
  get(index) {
    const c = getContent(this);
    c.byteOffset += index * 8;
    return Text.fromPointer(c).get(0);
  }
  set(index, value) {
    const c = getContent(this);
    c.byteOffset += index * 8;
    Text.fromPointer(c).set(0, value);
  }
  [Symbol.toStringTag]() {
    return `Text_${super.toString()}`;
  }
};
(class extends List {
  static {
    __name(this, "Uint8List");
  }
  static {
    __name2(this, "Uint8List");
  }
  static _capnp = {
    displayName: "List<Uint8>",
    size: ListElementSize.BYTE
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getUint8(c.byteOffset + index);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setUint8(c.byteOffset + index, value);
  }
  [Symbol.toStringTag]() {
    return `Uint8_${super.toString()}`;
  }
});
(class extends List {
  static {
    __name(this, "Uint16List");
  }
  static {
    __name2(this, "Uint16List");
  }
  static _capnp = {
    displayName: "List<Uint16>",
    size: ListElementSize.BYTE_2
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getUint16(c.byteOffset + index * 2);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setUint16(c.byteOffset + index * 2, value);
  }
  [Symbol.toStringTag]() {
    return `Uint16_${super.toString()}`;
  }
});
(class extends List {
  static {
    __name(this, "Uint32List");
  }
  static {
    __name2(this, "Uint32List");
  }
  static _capnp = {
    displayName: "List<Uint32>",
    size: ListElementSize.BYTE_4
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getUint32(c.byteOffset + index * 4);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setUint32(c.byteOffset + index * 4, value);
  }
  [Symbol.toStringTag]() {
    return `Uint32_${super.toString()}`;
  }
});
(class extends List {
  static {
    __name(this, "Uint64List");
  }
  static {
    __name2(this, "Uint64List");
  }
  static _capnp = {
    displayName: "List<Uint64>",
    size: ListElementSize.BYTE_8
  };
  get(index) {
    const c = getContent(this);
    return c.segment.getUint64(c.byteOffset + index * 8);
  }
  set(index, value) {
    const c = getContent(this);
    c.segment.setUint64(c.byteOffset + index * 8, value);
  }
  [Symbol.toStringTag]() {
    return `Uint64_${super.toString()}`;
  }
});
PointerList(Void);
function isSameClient(c, d) {
  const norm = /* @__PURE__ */ __name2((c2) => {
    return c2;
  }, "norm");
  return norm(c) === norm(d);
}
__name(isSameClient, "isSameClient");
__name2(isSameClient, "isSameClient");
function clientFromResolution(transform, obj, err) {
  if (err) {
    return new ErrorClient(err);
  }
  if (!obj) {
    return new ErrorClient(new Error(`null obj!`));
  }
  const out = transformPtr(obj, transform);
  return getInterfaceClientOrNull(out);
}
__name(clientFromResolution, "clientFromResolution");
__name2(clientFromResolution, "clientFromResolution");
var IDGen = class {
  static {
    __name(this, "IDGen");
  }
  static {
    __name2(this, "IDGen");
  }
  i = 0;
  free = [];
  next() {
    return this.free.pop() ?? this.i++;
  }
  remove(i) {
    this.free.push(i);
  }
};
var Ref = class {
  static {
    __name(this, "Ref");
  }
  static {
    __name2(this, "Ref");
  }
  constructor(rc, finalize) {
    this.rc = rc;
    const closeState = {
      closed: false
    };
    this.closeState = closeState;
    finalize(this, () => {
      if (!closeState.closed) {
        closeState.closed = true;
        rc.decref();
      }
    });
  }
  closeState;
  call(cl) {
    return this.rc.call(cl);
  }
  client() {
    return this.rc._client;
  }
  close() {
    if (!this.closeState.closed) {
      this.closeState.closed = true;
      this.rc.decref();
    }
  }
};
var RefCount = class _RefCount {
  static {
    __name(this, "_RefCount");
  }
  static {
    __name2(this, "RefCount");
  }
  refs;
  finalize;
  _client;
  constructor(c, _finalize) {
    this._client = c;
    this.finalize = _finalize;
    this.refs = 1;
  }
  // New creates a reference counter and the first client reference.
  static new(c, finalize) {
    const rc = new _RefCount(c, finalize);
    const ref = rc.newRef();
    return [
      rc,
      ref
    ];
  }
  call(cl) {
    return this._client.call(cl);
  }
  client() {
    return this._client;
  }
  close() {
    this._client.close();
  }
  ref() {
    if (this.refs <= 0) {
      return new ErrorClient(new Error(RPC_ZERO_REF));
    }
    this.refs++;
    return this.newRef();
  }
  newRef() {
    return new Ref(this, this.finalize);
  }
  decref() {
    this.refs--;
    if (this.refs === 0) {
      this._client.close();
    }
  }
};
var RPCError = class extends Error {
  static {
    __name(this, "RPCError");
  }
  static {
    __name2(this, "RPCError");
  }
  constructor(exception) {
    super(format2(RPC_ERROR, exception.reason));
    this.exception = exception;
  }
};
function toException(exc, err) {
  if (err instanceof RPCError) {
    exc.reason = err.exception.reason;
    exc.type = err.exception.type;
    return;
  }
  exc.reason = err.message;
  exc.type = Exception.Type.FAILED;
}
__name(toException, "toException");
__name2(toException, "toException");
function newMessage() {
  return new Message().initRoot(Message2);
}
__name(newMessage, "newMessage");
__name2(newMessage, "newMessage");
function newFinishMessage(questionID, release) {
  const m = newMessage();
  const f = m._initFinish();
  f.questionId = questionID;
  f.releaseResultCaps = release;
  return m;
}
__name(newFinishMessage, "newFinishMessage");
__name2(newFinishMessage, "newFinishMessage");
function newUnimplementedMessage(m) {
  const n = newMessage();
  n.unimplemented = m;
  return n;
}
__name(newUnimplementedMessage, "newUnimplementedMessage");
__name2(newUnimplementedMessage, "newUnimplementedMessage");
function newReturnMessage(id) {
  const m = newMessage();
  const ret = m._initReturn();
  ret.answerId = id;
  return m;
}
__name(newReturnMessage, "newReturnMessage");
__name2(newReturnMessage, "newReturnMessage");
function setReturnException(ret, err) {
  const exc = ret._initException();
  toException(exc, err);
  return exc;
}
__name(setReturnException, "setReturnException");
__name2(setReturnException, "setReturnException");
function newDisembargoMessage(which, id) {
  const m = newMessage();
  const dis = m._initDisembargo();
  const ctx = dis._initContext();
  switch (which) {
    case Disembargo_Context_Which.SENDER_LOOPBACK: {
      ctx.senderLoopback = id;
      break;
    }
    case Disembargo_Context_Which.RECEIVER_LOOPBACK: {
      ctx.receiverLoopback = id;
      break;
    }
    default: {
      throw new Error(INVARIANT_UNREACHABLE_CODE);
    }
  }
  return m;
}
__name(newDisembargoMessage, "newDisembargoMessage");
__name2(newDisembargoMessage, "newDisembargoMessage");
function transformToPromisedAnswer(answer, transform) {
  const opList = answer._initTransform(transform.length);
  for (const [i, op] of transform.entries()) {
    opList.get(i).getPointerField = op.field;
  }
}
__name(transformToPromisedAnswer, "transformToPromisedAnswer");
__name2(transformToPromisedAnswer, "transformToPromisedAnswer");
function promisedAnswerOpsToTransform(list2) {
  const transform = [];
  for (const op of list2) {
    switch (op.which()) {
      case PromisedAnswer_Op.GET_POINTER_FIELD: {
        transform.push({
          field: op.getPointerField
        });
        break;
      }
      case PromisedAnswer_Op.NOOP: {
        break;
      }
    }
  }
  return transform;
}
__name(promisedAnswerOpsToTransform, "promisedAnswerOpsToTransform");
__name2(promisedAnswerOpsToTransform, "promisedAnswerOpsToTransform");
var QuestionState = /* @__PURE__ */ ((QuestionState2) => {
  QuestionState2[QuestionState2["IN_PROGRESS"] = 0] = "IN_PROGRESS";
  QuestionState2[QuestionState2["RESOLVED"] = 1] = "RESOLVED";
  QuestionState2[QuestionState2["CANCELED"] = 2] = "CANCELED";
  return QuestionState2;
})(QuestionState || {});
var Question = class {
  static {
    __name(this, "Question");
  }
  static {
    __name2(this, "Question");
  }
  constructor(conn, id, method) {
    this.conn = conn;
    this.id = id;
    this.method = method;
  }
  paramCaps = [];
  state = 0;
  obj;
  err;
  derived = [];
  deferred = new Deferred();
  async struct() {
    return await this.deferred.promise;
  }
  // start signals the question has been sent
  start() {
  }
  // fulfill is called to resolve a question successfully.
  // The caller must be holding onto q.conn.mu.
  fulfill(obj) {
    if (this.state !== 0) {
      throw new Error(RPC_FULFILL_ALREADY_CALLED);
    }
    if (this.method) {
      this.obj = getAs(this.method.ResultsClass, obj);
    } else {
      this.obj = obj;
    }
    this.state = 1;
    this.deferred.resolve(this.obj);
  }
  // reject is called to resolve a question with failure
  reject(err) {
    if (!err) {
      throw new Error(`Question.reject called with null`);
    }
    if (this.state !== 0) {
      throw new Error(`Question.reject called more than once`);
    }
    this.err = err;
    this.state = 1;
    this.deferred.reject(err);
  }
  // cancel is called to resolve a question with cancellation.
  cancel(err) {
    if (this.state === 0) {
      this.err = err;
      this.state = 2;
      this.deferred.reject(err);
      return true;
    }
    return false;
  }
  pipelineCall(transform, call) {
    if (this.conn.findQuestion(this.id) !== this) {
      if (this.state === 0) {
        throw new Error(`question popped but not done`);
      }
      const client = clientFromResolution(transform, this.obj, this.err);
      return client.call(call);
    }
    const pipeq = this.conn.newQuestion(call.method);
    const msg = newMessage();
    const msgCall = msg._initCall();
    msgCall.questionId = pipeq.id;
    msgCall.interfaceId = call.method.interfaceId;
    msgCall.methodId = call.method.methodId;
    const target = msgCall._initTarget();
    const a = target._initPromisedAnswer();
    a.questionId = this.id;
    transformToPromisedAnswer(a, transform);
    const payload = msgCall._initParams();
    this.conn.fillParams(payload, call);
    this.conn.sendMessage(msg);
    this.addPromise(transform);
    return pipeq;
  }
  addPromise(transform) {
    for (const d of this.derived) {
      if (transformsEqual(transform, d)) {
        return;
      }
    }
    this.derived.push(transform);
  }
  pipelineClose() {
    throw new Error(NOT_IMPLEMENTED);
  }
};
function transformsEqual(t, u) {
  if (t.length !== u.length) {
    return false;
  }
  for (const [i, element_] of t.entries()) {
    if (element_.field !== u[i].field) {
      return false;
    }
  }
  return true;
}
__name(transformsEqual, "transformsEqual");
__name2(transformsEqual, "transformsEqual");
var Qcalls = class _Qcalls {
  static {
    __name(this, "_Qcalls");
  }
  static {
    __name2(this, "Qcalls");
  }
  constructor(data) {
    this.data = data;
  }
  static copyOf(data) {
    return new _Qcalls([
      ...data
    ]);
  }
  len() {
    return this.data.length;
  }
  clear(i) {
    this.data[i] = null;
  }
  copy() {
    return _Qcalls.copyOf(this.data);
  }
};
function joinAnswer(fl, answer) {
  answer.struct().then((obj) => {
    fl.fulfill(obj);
  }).catch((error_) => {
    fl.reject(error_);
  });
}
__name(joinAnswer, "joinAnswer");
__name2(joinAnswer, "joinAnswer");
var callQueueSize2 = 64;
var QueueClient = class {
  static {
    __name(this, "QueueClient");
  }
  static {
    __name2(this, "QueueClient");
  }
  constructor(conn, client, calls) {
    this.conn = conn;
    this._client = client;
    this.calls = Qcalls.copyOf(calls);
    this.q = new Queue(this.calls, callQueueSize2);
  }
  _client;
  calls;
  q;
  pushCall(call) {
    const f = new Fulfiller();
    try {
      call = copyCall(call);
    } catch (error_) {
      return new ErrorAnswer(error_);
    }
    const i = this.q.push();
    if (i === -1) {
      return new ErrorAnswer(new Error(RPC_CALL_QUEUE_FULL));
    }
    this.calls.data[i] = {
      call,
      f
    };
    return f;
  }
  pushEmbargo(id, tgt) {
    const i = this.q.push();
    if (i === -1) {
      throw new Error(RPC_CALL_QUEUE_FULL);
    }
    this.calls.data[i] = {
      embargoID: id,
      embargoTarget: tgt
    };
  }
  flushQueue() {
    let c = null;
    {
      const i = this.q.front();
      if (i !== -1) {
        c = this.calls.data[i];
      }
    }
    while (c) {
      this.handle(c);
      this.q.pop();
      {
        const i = this.q.front();
        c = i === -1 ? null : this.calls.data[i];
      }
    }
  }
  handle(c) {
    if (!c) {
      return;
    }
    if (isRemoteCall(c)) {
      const answer = this._client.call(c.call);
      joinAnswer(c.a, answer);
    } else if (isLocalCall(c)) {
      const answer = this._client.call(c.call);
      joinAnswer(c.f, answer);
    } else if (isDisembargo(c)) {
      const msg = newDisembargoMessage(Disembargo_Context_Which.RECEIVER_LOOPBACK, c.embargoID);
      msg.disembargo.target = c.embargoTarget;
      this.conn.sendMessage(msg);
    }
  }
  isPassthrough() {
    return this.q.len() === 0;
  }
  call(call) {
    if (this.isPassthrough()) {
      return this._client.call(call);
    }
    return this.pushCall(call);
  }
  // close releases any resources associated with this client.
  // No further calls to the client should be made after calling Close.
  close() {
  }
};
var AnswerEntry = class {
  static {
    __name(this, "AnswerEntry");
  }
  static {
    __name2(this, "AnswerEntry");
  }
  id;
  conn;
  resultCaps = [];
  done = false;
  obj;
  err;
  deferred = new Deferred();
  queue = [];
  constructor(conn, id) {
    this.conn = conn;
    this.id = id;
  }
  // fulfill is called to resolve an answer successfully.
  fulfill(obj) {
    if (this.done) {
      throw new Error(`answer.fulfill called more than once`);
    }
    this.done = true;
    this.obj = obj;
    const retmsg = newReturnMessage(this.id);
    const ret = retmsg.return;
    const payload = ret._initResults();
    payload.content = obj;
    let firstErr;
    try {
      this.conn.makeCapTable(ret.segment, (len) => payload._initCapTable(len));
      this.deferred.resolve(obj);
      this.conn.sendMessage(retmsg);
    } catch (error_) {
      if (!firstErr) {
        firstErr = error_;
      }
    }
    const [queues, queuesErr] = this.emptyQueue(obj);
    if (queuesErr && !firstErr) {
      firstErr = queuesErr;
    }
    const objcap = obj.segment.message._capnp;
    if (!objcap.capTable) {
      objcap.capTable = [];
    }
    for (const capIdxStr of Object.keys(queues)) {
      const capIdx = Number(capIdxStr);
      const q = queues[capIdx];
      if (objcap.capTable === null) throw new Error(INVARIANT_UNREACHABLE_CODE);
      objcap.capTable[capIdx] = new QueueClient(this.conn, objcap.capTable[capIdx], q);
    }
    if (firstErr) {
      throw firstErr;
    }
  }
  // reject is called to resolve an answer with failure.
  reject(err) {
    if (!err) {
      throw new Error(`answer.reject called with nil`);
    }
    if (this.done) {
      throw new Error(`answer.reject claled more than once`);
    }
    const m = newReturnMessage(this.id);
    const mret = m.return;
    setReturnException(mret, err);
    this.err = err;
    this.done = true;
    this.deferred.reject(err);
    let firstErr;
    try {
      this.conn.sendMessage(m);
    } catch (error_) {
      firstErr = error_;
    }
    for (let i = 0; i < this.queue.length; i++) {
      const qa = this.queue[i];
      try {
        if (qa.qcall && isRemoteCall(qa.qcall)) {
          qa.qcall.a.reject(err);
        }
      } catch (error_) {
        if (!firstErr) {
          firstErr = error_;
        }
      }
    }
    this.queue = [];
    if (firstErr) {
      throw firstErr;
    }
  }
  // emptyQueue splits the queue by which capability it targets
  // and drops any invalid calls. Once this function returns,
  // this.queue will be empty.
  emptyQueue(obj) {
    let firstErr;
    const qs = {};
    for (let i = 0; i < this.queue.length; i++) {
      const pc = this.queue[i];
      if (!isRemoteCall(pc.qcall)) {
        continue;
      }
      if (!pc.qcall.a) {
        continue;
      }
      let c;
      try {
        c = transformPtr(obj, pc.transform);
      } catch (error_) {
        try {
          pc.qcall.a.reject(error_);
        } catch (error_2) {
          if (!firstErr) {
            firstErr = error_2;
          }
        }
        continue;
      }
      const ci = Interface.fromPointer(c);
      if (!ci) {
        try {
          pc.qcall.a.reject(new Error(RPC_NULL_CLIENT));
        } catch (error_) {
          if (!firstErr) {
            firstErr = error_;
          }
        }
        continue;
      }
      const cn = ci.getCapId();
      if (!qs[cn]) {
        qs[cn] = [];
      }
      qs[cn].push(pc.qcall);
    }
    this.queue = [];
    return [
      qs,
      firstErr
    ];
  }
  queueCall(call, transform, a) {
    if (this.queue.length >= callQueueSize2) {
      throw new Error(RPC_CALL_QUEUE_FULL);
    }
    const qcall = {
      a,
      call: copyCall(call)
    };
    const pcall = {
      qcall,
      transform
    };
    this.queue.push(pcall);
  }
};
function isRemoteCall(a) {
  return !!a.a;
}
__name(isRemoteCall, "isRemoteCall");
__name2(isRemoteCall, "isRemoteCall");
function isLocalCall(a) {
  return !!a.f;
}
__name(isLocalCall, "isLocalCall");
__name2(isLocalCall, "isLocalCall");
function isDisembargo(a) {
  return !!a.embargoTarget;
}
__name(isDisembargo, "isDisembargo");
__name2(isDisembargo, "isDisembargo");
var ImportClient = class {
  static {
    __name(this, "ImportClient");
  }
  static {
    __name2(this, "ImportClient");
  }
  constructor(conn, id) {
    this.conn = conn;
    this.id = id;
  }
  closed = false;
  call(cl) {
    if (this.closed) {
      return new ErrorAnswer(new Error(RPC_IMPORT_CLOSED));
    }
    const q = this.conn.newQuestion(cl.method);
    const msg = newMessage();
    const msgCall = msg._initCall();
    msgCall.questionId = q.id;
    msgCall.interfaceId = cl.method.interfaceId;
    msgCall.methodId = cl.method.methodId;
    const target = msgCall._initTarget();
    target.importedCap = this.id;
    const payload = msgCall._initParams();
    this.conn.fillParams(payload, cl);
    this.conn.sendMessage(msg);
    return q;
  }
  close() {
  }
};
var LocalAnswerClient = class {
  static {
    __name(this, "LocalAnswerClient");
  }
  static {
    __name2(this, "LocalAnswerClient");
  }
  constructor(a, transform) {
    this.a = a;
    this.transform = transform;
  }
  call(call) {
    if (this.a.done) {
      return clientFromResolution(this.transform, this.a.obj, this.a.err).call(call);
    }
    return new Fulfiller();
  }
  close() {
    throw new Error(NOT_IMPLEMENTED);
  }
};
var ConnWeakRefRegistry = globalThis.FinalizationRegistry ? new FinalizationRegistry((cb) => cb()) : void 0;
var ConDefaultFinalize = /* @__PURE__ */ __name2((obj, finalizer) => {
  ConnWeakRefRegistry?.register(obj, finalizer);
}, "ConDefaultFinalize");
var Conn = class {
  static {
    __name(this, "Conn");
  }
  static {
    __name2(this, "Conn");
  }
  /**
  * Create a new connection
  * @param transport The transport used to receive/send messages.
  * @param finalize Weak reference implementation. Compatible with
  * the 'weak' module on node.js (just add weak as a dependency and pass
  * require("weak")), but alternative implementations can be provided for
  * other platforms like Electron. Defaults to using FinalizationRegistry if
  * available.
  * @returns A new connection.
  */
  constructor(transport, finalize = ConDefaultFinalize) {
    this.transport = transport;
    this.finalize = finalize;
    this.startWork();
  }
  questionID = new IDGen();
  questions = [];
  answers = {};
  exportID = new IDGen();
  exports = [];
  imports = {};
  onError;
  main;
  working = false;
  bootstrap(InterfaceClass) {
    const q = this.newQuestion();
    const msg = newMessage();
    const boot = msg._initBootstrap();
    boot.questionId = q.id;
    this.sendMessage(msg);
    return new InterfaceClass.Client(new Pipeline(AnyStruct, q).client());
  }
  initMain(InterfaceClass, target) {
    this.main = new InterfaceClass.Server(target);
    this.addExport(this.main);
  }
  startWork() {
    this.work().catch((error_) => {
      if (this.onError) {
        this.onError(error_);
      } else if (error_ !== void 0) {
        throw error_;
      }
    });
  }
  sendReturnException(id, err) {
    const m = newReturnMessage(id);
    setReturnException(m.return, err);
    this.sendMessage(m);
  }
  handleBootstrapMessage(m) {
    const boot = m.bootstrap;
    const id = boot.questionId;
    const ret = newReturnMessage(id);
    ret.return.releaseParamCaps = false;
    const a = this.insertAnswer(id);
    if (a === null) {
      return this.sendReturnException(id, new Error(RPC_QUESTION_ID_REUSED));
    }
    if (this.main === void 0) {
      return a.reject(new Error(RPC_NO_MAIN_INTERFACE));
    }
    const msg = new Message();
    msg.addCap(this.main);
    a.fulfill(new Interface(msg.getSegment(0), 0));
  }
  handleFinishMessage(m) {
    const { finish } = m;
    const id = finish.questionId;
    const a = this.popAnswer(id);
    if (a === null) {
      throw new Error(format2(RPC_FINISH_UNKNOWN_ANSWER, id));
    }
    if (finish.releaseResultCaps) {
      const caps = a.resultCaps;
      let i = caps.length;
      while (--i >= 0) {
        this.releaseExport(i, 1);
      }
    }
  }
  handleMessage(m) {
    switch (m.which()) {
      case Message2.UNIMPLEMENTED: {
        break;
      }
      case Message2.BOOTSTRAP: {
        this.handleBootstrapMessage(m);
        break;
      }
      case Message2.ABORT: {
        this.shutdown(new RPCError(m.abort));
        break;
      }
      case Message2.FINISH: {
        this.handleFinishMessage(m);
        break;
      }
      case Message2.RETURN: {
        this.handleReturnMessage(m);
        break;
      }
      case Message2.CALL: {
        this.handleCallMessage(m);
        break;
      }
    }
  }
  handleReturnMessage(m) {
    const ret = m.return;
    const id = ret.answerId;
    const q = this.popQuestion(id);
    if (!q) {
      throw new Error(format2(RPC_RETURN_FOR_UNKNOWN_QUESTION, id));
    }
    if (ret.releaseParamCaps) {
      for (let i = 0; i < q.paramCaps.length; i++) {
        this.releaseExport(id, 1);
      }
    }
    let releaseResultCaps = true;
    switch (ret.which()) {
      case Return.RESULTS: {
        releaseResultCaps = false;
        const { results } = ret;
        this.populateMessageCapTable(results);
        const { content } = results;
        q.fulfill(content);
        break;
      }
      case Return.EXCEPTION: {
        const exc = ret.exception;
        const err = q.method ? new MethodError(q.method, exc.reason) : new RPCError(exc);
        q.reject(err);
        break;
      }
    }
    const fin = newFinishMessage(id, releaseResultCaps);
    this.sendMessage(fin);
  }
  handleCallMessage(m) {
    const mcall = m.call;
    const mt = mcall.target;
    if (mt.which() !== MessageTarget.IMPORTED_CAP && mt.which() !== MessageTarget.PROMISED_ANSWER) {
      const um = newUnimplementedMessage(m);
      this.sendMessage(um);
      return;
    }
    const mparams = mcall.params;
    try {
      this.populateMessageCapTable(mparams);
    } catch {
      const um = newUnimplementedMessage(m);
      this.sendMessage(um);
      return;
    }
    const id = mcall.questionId;
    const a = this.insertAnswer(id);
    if (!a) {
      throw new Error(format2(RPC_QUESTION_ID_REUSED, id));
    }
    const interfaceDef = Registry2.lookup(mcall.interfaceId);
    if (!interfaceDef) {
      const um = newUnimplementedMessage(m);
      this.sendMessage(um);
      return;
    }
    const method = interfaceDef.methods[mcall.methodId];
    if (!method) {
      const um = newUnimplementedMessage(m);
      this.sendMessage(um);
      return;
    }
    const paramContent = mparams.content;
    const call = {
      method,
      params: getAs(method.ParamsClass, paramContent)
    };
    try {
      this.routeCallMessage(a, mt, call);
    } catch (error_) {
      a.reject(error_);
    }
  }
  routeCallMessage(result, mt, cl) {
    switch (mt.which()) {
      case MessageTarget.IMPORTED_CAP: {
        const id = mt.importedCap;
        const e = this.findExport(id);
        if (!e) {
          throw new Error(RPC_BAD_TARGET);
        }
        const answer = this.call(e.client, cl);
        joinAnswer(result, answer);
        break;
      }
      case MessageTarget.PROMISED_ANSWER: {
        const mpromise = mt.promisedAnswer;
        const id = mpromise.questionId;
        if (id === result.id) {
          throw new Error(RPC_BAD_TARGET);
        }
        const pa = this.answers[id];
        if (!pa) {
          throw new Error(RPC_BAD_TARGET);
        }
        const mtrans = mpromise.transform;
        const transform = promisedAnswerOpsToTransform(mtrans);
        if (pa.done) {
          const { obj, err } = pa;
          const client = clientFromResolution(transform, obj, err);
          const answer = this.call(client, cl);
          joinAnswer(result, answer);
        } else {
          pa.queueCall(cl, transform, result);
        }
        break;
      }
      default: {
        throw new Error(INVARIANT_UNREACHABLE_CODE);
      }
    }
  }
  populateMessageCapTable(payload) {
    const msg = payload.segment.message;
    const ctab = payload.capTable;
    for (const desc of ctab) {
      switch (desc.which()) {
        case CapDescriptor.NONE: {
          msg.addCap(null);
          break;
        }
        case CapDescriptor.SENDER_HOSTED: {
          const id = desc.senderHosted;
          const client = this.addImport(id);
          msg.addCap(client);
          break;
        }
        case CapDescriptor.SENDER_PROMISE: {
          const id = desc.senderPromise;
          const client = this.addImport(id);
          msg.addCap(client);
          break;
        }
        case CapDescriptor.RECEIVER_HOSTED: {
          const id = desc.receiverHosted;
          const e = this.findExport(id);
          if (!e) {
            throw new Error(format2(RPC_UNKNOWN_EXPORT_ID, id));
          }
          msg.addCap(e.rc.ref());
          break;
        }
        case CapDescriptor.RECEIVER_ANSWER: {
          const recvAns = desc.receiverAnswer;
          const id = recvAns.questionId;
          const a = this.answers[id];
          if (!a) {
            throw new Error(format2(RPC_UNKNOWN_ANSWER_ID, id));
          }
          const recvTransform = recvAns.transform;
          const transform = promisedAnswerOpsToTransform(recvTransform);
          msg.addCap(answerPipelineClient(a, transform));
          break;
        }
        default: {
          throw new Error(format2(RPC_UNKNOWN_CAP_DESCRIPTOR, desc.which()));
        }
      }
    }
  }
  addImport(id) {
    const importEntry = this.imports[id];
    if (importEntry) {
      importEntry.refs++;
      return importEntry.rc.ref();
    }
    const client = new ImportClient(this, id);
    const [rc, ref] = RefCount.new(client, this.finalize);
    this.imports[id] = {
      rc,
      refs: 1
    };
    return ref;
  }
  findExport(id) {
    if (id > this.exports.length) {
      return null;
    }
    return this.exports[id];
  }
  addExport(client) {
    for (let i = 0; i < this.exports.length; i++) {
      const e = this.exports[i];
      if (e && isSameClient(e.rc._client, client)) {
        e.wireRefs++;
        return i;
      }
    }
    const id = this.exportID.next();
    const [rc, ref] = RefCount.new(client, this.finalize);
    const _export = {
      client: ref,
      id,
      rc,
      wireRefs: 1
    };
    if (id === this.exports.length) {
      this.exports.push(_export);
    } else {
      this.exports[id] = _export;
    }
    return id;
  }
  releaseExport(id, refs) {
    const e = this.findExport(id);
    if (!e) {
      return;
    }
    e.wireRefs -= refs;
    if (e.wireRefs > 0) {
      return;
    }
    if (e.wireRefs < 0) {
      this.error(`warning: export ${id} has negative refcount (${e.wireRefs})`);
    }
    e.client.close();
    this.exports[id] = null;
    this.exportID.remove(id);
  }
  error(s) {
    console.error(s);
  }
  newQuestion(method) {
    const id = this.questionID.next();
    const q = new Question(this, id, method);
    if (id === this.questions.length) {
      this.questions.push(q);
    } else {
      this.questions[id] = q;
    }
    return q;
  }
  findQuestion(id) {
    if (id > this.questions.length) {
      return null;
    }
    return this.questions[id];
  }
  popQuestion(id) {
    const q = this.findQuestion(id);
    if (!q) {
      return q;
    }
    this.questions[id] = null;
    this.questionID.remove(id);
    return q;
  }
  // TODO: cancel context?
  insertAnswer(id) {
    if (this.answers[id]) {
      return null;
    }
    const a = new AnswerEntry(this, id);
    this.answers[id] = a;
    return a;
  }
  popAnswer(id) {
    const a = this.answers[id];
    delete this.answers[id];
    return a;
  }
  shutdown(_err) {
    this.transport.close();
  }
  call(client, call) {
    return client.call(call);
  }
  fillParams(payload, cl) {
    const params = placeParams(cl, payload.content);
    payload.content = params;
    this.makeCapTable(payload.segment, (length) => payload._initCapTable(length));
  }
  makeCapTable(s, init) {
    const msgtab = s.message._capnp.capTable;
    if (!msgtab) {
      return;
    }
    const t = init(msgtab.length);
    for (const [i, client] of msgtab.entries()) {
      const desc = t.get(i);
      if (!client) {
        desc.none = true;
        continue;
      }
      this.descriptorForClient(desc, client);
    }
  }
  // descriptorForClient fills desc for client, adding it to the export
  // table if necessary.  The caller must be holding onto c.mu.
  descriptorForClient(desc, _client) {
    {
      dig: for (let client = _client; ; ) {
        if (client instanceof ImportClient) {
          if (client.conn !== this) {
            break dig;
          }
          desc.receiverHosted = client.id;
          return;
        } else if (client instanceof Ref) {
          client = client.client();
        } else if (client instanceof PipelineClient) {
          const p = client.pipeline;
          const ans = p.answer;
          const transform = p.transform();
          if (ans instanceof FixedAnswer) {
            let s;
            let err;
            try {
              s = ans.structSync();
            } catch (error_) {
              err = error_;
            }
            client = clientFromResolution(transform, s, err);
          } else if (ans instanceof Question) {
            if (ans.state !== QuestionState.IN_PROGRESS) {
              client = clientFromResolution(transform, ans.obj, ans.err);
              continue;
            }
            if (ans.conn !== this) {
              break dig;
            }
            const a = desc._initReceiverAnswer();
            a.questionId = ans.id;
            transformToPromisedAnswer(a, p.transform());
            return;
          } else {
            break dig;
          }
        } else {
          break dig;
        }
      }
    }
    const id = this.addExport(_client);
    desc.senderHosted = id;
  }
  sendMessage(msg) {
    this.transport.sendMessage(msg);
  }
  async work() {
    this.working = true;
    while (this.working) {
      try {
        const m = await this.transport.recvMessage();
        this.handleMessage(m);
      } catch (error_) {
        if (error_ !== void 0) {
          throw error_;
        }
        this.working = false;
      }
    }
  }
};
function answerPipelineClient(a, transform) {
  return new LocalAnswerClient(a, transform);
}
__name(answerPipelineClient, "answerPipelineClient");
__name2(answerPipelineClient, "answerPipelineClient");
var DeferredTransport = class {
  static {
    __name(this, "DeferredTransport");
  }
  static {
    __name2(this, "DeferredTransport");
  }
  d;
  closed = false;
  close() {
    this.closed = true;
    this.d?.reject();
  }
  recvMessage() {
    if (this.closed) {
      return Promise.reject();
    }
    if (this.d) {
      this.d.reject();
    }
    this.d = new Deferred();
    return this.d.promise;
  }
  reject = /* @__PURE__ */ __name2((err) => {
    this.d?.reject(err);
  }, "reject");
  resolve = /* @__PURE__ */ __name2((buf) => {
    try {
      this.d?.resolve(new Message(buf, false).getRoot(Message2));
    } catch (error_) {
      this.d?.reject(error_);
    }
  }, "resolve");
};
var MessageChannelTransport = class extends DeferredTransport {
  static {
    __name(this, "MessageChannelTransport");
  }
  static {
    __name2(this, "MessageChannelTransport");
  }
  port;
  constructor(port) {
    super(), this.port = port, this.close = () => {
      this.port.off("message", this.resolve);
      this.port.off("messageerror", this.reject);
      this.port.off("close", this.close);
      this.port.close();
      super.close();
    };
    this.port.on("message", this.resolve);
    this.port.on("messageerror", this.reject);
    this.port.on("close", this.close);
  }
  close;
  sendMessage(msg) {
    const m = new Message();
    m.setRoot(msg);
    const buf = m.toArrayBuffer();
    this.port.postMessage(buf, [
      buf
    ]);
  }
};
(class {
  static {
    __name(this, "CapnpRPC");
  }
  static {
    __name2(this, "CapnpRPC");
  }
  /**
  * A queue for deferred connections that are waiting to be accepted.
  *
  * @remarks
  * This is used to manage incoming connections when the accept method is called.
  */
  acceptQueue = new Array();
  /**
  * A map of connections by their ID.
  *
  * @remarks
  * This is used to manage multiple connections and allows for easy retrieval by ID.
  */
  connections = {};
  /**
  * A queue for connections that are waiting to be accepted.
  *
  * @remarks
  * This is used to manage incoming connections when the accept method is called.
  */
  connectQueue = new Array();
  /**
  * Creates a new {@link Conn} instance.
  *
  * @remarks
  * This class is used to manage connections and accept incoming connections using the {@link MessageChannel} API.
  */
  connect(id = 0) {
    if (this.connections[id] !== void 0) {
      return this.connections[id];
    }
    const ch = new worker_threads.MessageChannel();
    const conn = new Conn(new MessageChannelTransport(ch.port1));
    const accept = this.acceptQueue.pop();
    this.connections[id] = conn;
    if (accept === void 0) {
      this.connectQueue.push(ch.port2);
    } else {
      accept.resolve(new Conn(new MessageChannelTransport(ch.port2)));
    }
    return conn;
  }
  /**
  * Accepts a connection from the connect queue.
  *
  * @returns A promise that resolves to a Conn instance when a connection is accepted.
  * @throws If no connections are available in the connect queue.
  */
  async accept() {
    const port2 = this.connectQueue.pop();
    if (port2 !== void 0) {
      return Promise.resolve(new Conn(new MessageChannelTransport(port2)));
    }
    const deferred = new Deferred();
    this.acceptQueue.push(deferred);
    return deferred.promise;
  }
  /**
  * Closes all connections and clears the queues.
  *
  * @remarks
  * This method will reject all pending accept promises and close all
  * connections in the connect queue.
  */
  close() {
    let i = this.acceptQueue.length;
    while (--i >= 0) {
      this.acceptQueue[i]?.reject();
    }
    i = this.connectQueue.length;
    while (--i >= 0) {
      this.connectQueue[i].close();
    }
    for (const id in this.connections) {
      this.connections[id]?.shutdown();
    }
    this.acceptQueue.length = 0;
    this.connectQueue.length = 0;
    this.connections = {};
  }
});

// ../../node_modules/.pnpm/@stryke+capnp@0.12.2_magicast@0.3.5_nx@21.6.6_@swc-node+register@1.10.10_@swc+core@1.13_fd22771bb9e47ee907b716dcf2a1b1d9/node_modules/@stryke/capnp/dist/chunk-CCU32X36.js
(class {
  static {
    __name(this, "CodeGeneratorContext");
  }
  static {
    __name2(this, "CodeGeneratorContext");
  }
  files = [];
});

// schemas/reflection.ts
var _capnpFileId3 = BigInt("0xae3c363dcecf2729");
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
var TagsReflection = class extends Struct {
  static {
    __name(this, "TagsReflection");
  }
  static _capnp = {
    displayName: "TagsReflection",
    id: "ab7e31d6b834bbf8",
    size: new ObjectSize(8, 4)
  };
  _adoptAlias(value) {
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownAlias() {
    return utils.disown(this.alias);
  }
  get alias() {
    return utils.getList(0, TextList, this);
  }
  _hasAlias() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initAlias(length) {
    return utils.initList(0, TextList, length, this);
  }
  set alias(value) {
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  get title() {
    return utils.getText(1, this);
  }
  set title(value) {
    utils.setText(1, value, this);
  }
  get hidden() {
    return utils.getBit(0, this);
  }
  set hidden(value) {
    utils.setBit(0, value, this);
  }
  get readonly() {
    return utils.getBit(1, this);
  }
  set readonly(value) {
    utils.setBit(1, value, this);
  }
  get ignore() {
    return utils.getBit(2, this);
  }
  set ignore(value) {
    utils.setBit(2, value, this);
  }
  get internal() {
    return utils.getBit(3, this);
  }
  set internal(value) {
    utils.setBit(3, value, this);
  }
  _adoptPermission(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownPermission() {
    return utils.disown(this.permission);
  }
  get permission() {
    return utils.getList(2, TextList, this);
  }
  _hasPermission() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initPermission(length) {
    return utils.initList(2, TextList, length, this);
  }
  set permission(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  get domain() {
    return utils.getText(3, this);
  }
  set domain(value) {
    utils.setText(3, value, this);
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
var DefaultValueReflection_Value = class extends Struct {
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
    size: new ObjectSize(16, 1)
  };
  get _isUndefined() {
    return utils.getUint16(0, this) === 0;
  }
  set undefined(_) {
    utils.setUint16(0, 0, this);
  }
  get boolean() {
    utils.testWhich("boolean", utils.getUint16(0, this), 1, this);
    return utils.getBit(16, this);
  }
  get _isBoolean() {
    return utils.getUint16(0, this) === 1;
  }
  set boolean(value) {
    utils.setUint16(0, 1, this);
    utils.setBit(16, value, this);
  }
  get integer() {
    utils.testWhich("integer", utils.getUint16(0, this), 2, this);
    return utils.getInt32(4, this);
  }
  get _isInteger() {
    return utils.getUint16(0, this) === 2;
  }
  set integer(value) {
    utils.setUint16(0, 2, this);
    utils.setInt32(4, value, this);
  }
  get float() {
    utils.testWhich("float", utils.getUint16(0, this), 3, this);
    return utils.getFloat64(8, this);
  }
  get _isFloat() {
    return utils.getUint16(0, this) === 3;
  }
  set float(value) {
    utils.setUint16(0, 3, this);
    utils.setFloat64(8, value, this);
  }
  get string() {
    utils.testWhich("string", utils.getUint16(0, this), 4, this);
    return utils.getText(0, this);
  }
  get _isString() {
    return utils.getUint16(0, this) === 4;
  }
  set string(value) {
    utils.setUint16(0, 4, this);
    utils.setText(0, value, this);
  }
  toString() {
    return "DefaultValueReflection_Value_" + super.toString();
  }
  which() {
    return utils.getUint16(0, this);
  }
};
var DefaultValueReflection = class extends Struct {
  static {
    __name(this, "DefaultValueReflection");
  }
  static _capnp = {
    displayName: "DefaultValueReflection",
    id: "96fe6f07954197c9",
    size: new ObjectSize(16, 1)
  };
  get value() {
    return utils.getAs(DefaultValueReflection_Value, this);
  }
  _initValue() {
    return utils.getAs(DefaultValueReflection_Value, this);
  }
  toString() {
    return "DefaultValueReflection_" + super.toString();
  }
};
var SerializedTypeReference = class extends Struct {
  static {
    __name(this, "SerializedTypeReference");
  }
  static _capnp = {
    displayName: "SerializedTypeReference",
    id: "a83d8a28b5e80f3a",
    size: new ObjectSize(8, 0)
  };
  get id() {
    return utils.getUint32(0, this);
  }
  set id(value) {
    utils.setUint32(0, value, this);
  }
  toString() {
    return "SerializedTypeReference_" + super.toString();
  }
};
var IndexAccessOrigin = class extends Struct {
  static {
    __name(this, "IndexAccessOrigin");
  }
  static _capnp = {
    displayName: "IndexAccessOrigin",
    id: "ca50b18186c87afe",
    size: new ObjectSize(0, 2)
  };
  _adoptContainer(value) {
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownContainer() {
    return utils.disown(this.container);
  }
  get container() {
    return utils.getStruct(0, SerializedTypeReference, this);
  }
  _hasContainer() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initContainer() {
    return utils.initStructAt(0, SerializedTypeReference, this);
  }
  set container(value) {
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptIndex(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownIndex() {
    return utils.disown(this.index);
  }
  get index() {
    return utils.getStruct(1, SerializedTypeReference, this);
  }
  _hasIndex() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initIndex() {
    return utils.initStructAt(1, SerializedTypeReference, this);
  }
  set index(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  toString() {
    return "IndexAccessOrigin_" + super.toString();
  }
};
var EntityOptions_EntityIndexOptions = class extends Struct {
  static {
    __name(this, "EntityOptions_EntityIndexOptions");
  }
  static _capnp = {
    displayName: "EntityIndexOptions",
    id: "de584ad10b7c5004",
    size: new ObjectSize(0, 2)
  };
  _adoptNames(value) {
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownNames() {
    return utils.disown(this.names);
  }
  get names() {
    return utils.getList(0, TextList, this);
  }
  _hasNames() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initNames(length) {
    return utils.initList(0, TextList, length, this);
  }
  set names(value) {
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  /**
  * JSON stringified options
  *
  */
  get options() {
    return utils.getText(1, this);
  }
  set options(value) {
    utils.setText(1, value, this);
  }
  toString() {
    return "EntityOptions_EntityIndexOptions_" + super.toString();
  }
};
var EntityOptions = class _EntityOptions extends Struct {
  static {
    __name(this, "EntityOptions");
  }
  static EntityIndexOptions = EntityOptions_EntityIndexOptions;
  static _capnp = {
    displayName: "EntityOptions",
    id: "948d2d02cf676d60",
    size: new ObjectSize(8, 5)
  };
  static _Indexes;
  get name() {
    return utils.getText(0, this);
  }
  set name(value) {
    utils.setText(0, value, this);
  }
  get description() {
    return utils.getText(1, this);
  }
  set description(value) {
    utils.setText(1, value, this);
  }
  get collection() {
    return utils.getText(2, this);
  }
  set collection(value) {
    utils.setText(2, value, this);
  }
  get database() {
    return utils.getText(3, this);
  }
  set database(value) {
    utils.setText(3, value, this);
  }
  get singleTableInheritance() {
    return utils.getBit(0, this);
  }
  set singleTableInheritance(value) {
    utils.setBit(0, value, this);
  }
  _adoptIndexes(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownIndexes() {
    return utils.disown(this.indexes);
  }
  get indexes() {
    return utils.getList(4, _EntityOptions._Indexes, this);
  }
  _hasIndexes() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initIndexes(length) {
    return utils.initList(4, _EntityOptions._Indexes, length, this);
  }
  set indexes(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  toString() {
    return "EntityOptions_" + super.toString();
  }
};
var SerializedTypeObjectLiteral = class _SerializedTypeObjectLiteral extends Struct {
  static {
    __name(this, "SerializedTypeObjectLiteral");
  }
  static _capnp = {
    displayName: "SerializedTypeObjectLiteral",
    id: "8b56235ad9bcb2b1",
    size: new ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeObjectLiteral._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeObjectLiteral._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeObjectLiteral._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeObjectLiteral._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownTypes() {
    return utils.disown(this.types);
  }
  get types() {
    return utils.getList(4, _SerializedTypeObjectLiteral._Types, this);
  }
  _hasTypes() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initTypes(length) {
    return utils.initList(4, _SerializedTypeObjectLiteral._Types, length, this);
  }
  set types(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(5, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(5, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(5, this));
  }
  _initTags() {
    return utils.initStructAt(5, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(5, this));
  }
  toString() {
    return "SerializedTypeObjectLiteral_" + super.toString();
  }
};
var SerializedTypeClassType = class _SerializedTypeClassType extends Struct {
  static {
    __name(this, "SerializedTypeClassType");
  }
  static _capnp = {
    displayName: "SerializedTypeClassType",
    id: "9855392bf9c48b25",
    size: new ObjectSize(8, 11)
  };
  static _TypeArguments;
  static _Decorators;
  static _ExtendsArguments;
  static _Arguments;
  static _Types;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeClassType._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeClassType._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeClassType._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeClassType._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  get name() {
    return utils.getText(4, this);
  }
  set name(value) {
    utils.setText(4, value, this);
  }
  get globalObject() {
    return utils.getBit(16, this);
  }
  set globalObject(value) {
    utils.setBit(16, value, this);
  }
  get classType() {
    return utils.getText(5, this);
  }
  set classType(value) {
    utils.setText(5, value, this);
  }
  _adoptExtendsArguments(value) {
    utils.adopt(value, utils.getPointer(6, this));
  }
  _disownExtendsArguments() {
    return utils.disown(this.extendsArguments);
  }
  get extendsArguments() {
    return utils.getList(6, _SerializedTypeClassType._ExtendsArguments, this);
  }
  _hasExtendsArguments() {
    return !utils.isNull(utils.getPointer(6, this));
  }
  _initExtendsArguments(length) {
    return utils.initList(6, _SerializedTypeClassType._ExtendsArguments, length, this);
  }
  set extendsArguments(value) {
    utils.copyFrom(value, utils.getPointer(6, this));
  }
  _adoptArguments(value) {
    utils.adopt(value, utils.getPointer(7, this));
  }
  _disownArguments() {
    return utils.disown(this.arguments);
  }
  get arguments() {
    return utils.getList(7, _SerializedTypeClassType._Arguments, this);
  }
  _hasArguments() {
    return !utils.isNull(utils.getPointer(7, this));
  }
  _initArguments(length) {
    return utils.initList(7, _SerializedTypeClassType._Arguments, length, this);
  }
  set arguments(value) {
    utils.copyFrom(value, utils.getPointer(7, this));
  }
  _adoptSuperClass(value) {
    utils.adopt(value, utils.getPointer(8, this));
  }
  _disownSuperClass() {
    return utils.disown(this.superClass);
  }
  get superClass() {
    return utils.getStruct(8, SerializedTypeReference, this);
  }
  _hasSuperClass() {
    return !utils.isNull(utils.getPointer(8, this));
  }
  _initSuperClass() {
    return utils.initStructAt(8, SerializedTypeReference, this);
  }
  set superClass(value) {
    utils.copyFrom(value, utils.getPointer(8, this));
  }
  _adoptTypes(value) {
    utils.adopt(value, utils.getPointer(9, this));
  }
  _disownTypes() {
    return utils.disown(this.types);
  }
  get types() {
    return utils.getList(9, _SerializedTypeClassType._Types, this);
  }
  _hasTypes() {
    return !utils.isNull(utils.getPointer(9, this));
  }
  _initTypes(length) {
    return utils.initList(9, _SerializedTypeClassType._Types, length, this);
  }
  set types(value) {
    utils.copyFrom(value, utils.getPointer(9, this));
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(10, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(10, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(10, this));
  }
  _initTags() {
    return utils.initStructAt(10, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(10, this));
  }
  toString() {
    return "SerializedTypeClassType_" + super.toString();
  }
};
var SerializedTypeParameter = class _SerializedTypeParameter extends Struct {
  static {
    __name(this, "SerializedTypeParameter");
  }
  static _capnp = {
    displayName: "SerializedTypeParameter",
    id: "fcbaa08bb97b8b1a",
    size: new ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeParameter._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeParameter._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeParameter._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeParameter._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  get name() {
    return utils.getText(4, this);
  }
  set name(value) {
    utils.setText(4, value, this);
  }
  _adoptType(value) {
    utils.adopt(value, utils.getPointer(5, this));
  }
  _disownType() {
    return utils.disown(this.type);
  }
  get type() {
    return utils.getStruct(5, SerializedTypeReference, this);
  }
  _hasType() {
    return !utils.isNull(utils.getPointer(5, this));
  }
  _initType() {
    return utils.initStructAt(5, SerializedTypeReference, this);
  }
  set type(value) {
    utils.copyFrom(value, utils.getPointer(5, this));
  }
  get visibility() {
    return utils.getUint16(2, this);
  }
  set visibility(value) {
    utils.setUint16(2, value, this);
  }
  get readonly() {
    return utils.getBit(32, this);
  }
  set readonly(value) {
    utils.setBit(32, value, this);
  }
  get optional() {
    return utils.getBit(33, this);
  }
  set optional(value) {
    utils.setBit(33, value, this);
  }
  _adoptDefault(value) {
    utils.adopt(value, utils.getPointer(6, this));
  }
  _disownDefault() {
    return utils.disown(this.default);
  }
  get default() {
    return utils.getStruct(6, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !utils.isNull(utils.getPointer(6, this));
  }
  _initDefault() {
    return utils.initStructAt(6, DefaultValueReflection, this);
  }
  set default(value) {
    utils.copyFrom(value, utils.getPointer(6, this));
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(7, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(7, this));
  }
  _initTags() {
    return utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeParameter_" + super.toString();
  }
};
var SerializedTypeMethod = class _SerializedTypeMethod extends Struct {
  static {
    __name(this, "SerializedTypeMethod");
  }
  static _capnp = {
    displayName: "SerializedTypeMethod",
    id: "8b5eff6d9ec2fb06",
    size: new ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeMethod._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeMethod._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeMethod._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeMethod._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get visibility() {
    return utils.getUint16(0, this);
  }
  set visibility(value) {
    utils.setUint16(0, value, this);
  }
  get abstract() {
    return utils.getBit(16, this);
  }
  set abstract(value) {
    utils.setBit(16, value, this);
  }
  get optional() {
    return utils.getBit(17, this);
  }
  set optional(value) {
    utils.setBit(17, value, this);
  }
  get readonly() {
    return utils.getBit(18, this);
  }
  set readonly(value) {
    utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initTags() {
    return utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  get kind() {
    return utils.getUint16(4, this);
  }
  set kind(value) {
    utils.setUint16(4, value, this);
  }
  get name() {
    return utils.getText(5, this);
  }
  set name(value) {
    utils.setText(5, value, this);
  }
  _adoptParameters(value) {
    utils.adopt(value, utils.getPointer(6, this));
  }
  _disownParameters() {
    return utils.disown(this.parameters);
  }
  get parameters() {
    return utils.getList(6, _SerializedTypeMethod._Parameters, this);
  }
  _hasParameters() {
    return !utils.isNull(utils.getPointer(6, this));
  }
  _initParameters(length) {
    return utils.initList(6, _SerializedTypeMethod._Parameters, length, this);
  }
  set parameters(value) {
    utils.copyFrom(value, utils.getPointer(6, this));
  }
  _adoptReturn(value) {
    utils.adopt(value, utils.getPointer(7, this));
  }
  _disownReturn() {
    return utils.disown(this.return);
  }
  get return() {
    return utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !utils.isNull(utils.getPointer(7, this));
  }
  _initReturn() {
    return utils.initStructAt(7, SerializedTypeReference, this);
  }
  set return(value) {
    utils.copyFrom(value, utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeMethod_" + super.toString();
  }
};
var SerializedTypeProperty = class _SerializedTypeProperty extends Struct {
  static {
    __name(this, "SerializedTypeProperty");
  }
  static _capnp = {
    displayName: "SerializedTypeProperty",
    id: "91d9dbea2037f78b",
    size: new ObjectSize(8, 9)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeProperty._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeProperty._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeProperty._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeProperty._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get visibility() {
    return utils.getUint16(0, this);
  }
  set visibility(value) {
    utils.setUint16(0, value, this);
  }
  get abstract() {
    return utils.getBit(16, this);
  }
  set abstract(value) {
    utils.setBit(16, value, this);
  }
  get optional() {
    return utils.getBit(17, this);
  }
  set optional(value) {
    utils.setBit(17, value, this);
  }
  get readonly() {
    return utils.getBit(18, this);
  }
  set readonly(value) {
    utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initTags() {
    return utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  get kind() {
    return utils.getUint16(4, this);
  }
  set kind(value) {
    utils.setUint16(4, value, this);
  }
  get name() {
    return utils.getText(5, this);
  }
  set name(value) {
    utils.setText(5, value, this);
  }
  get description() {
    return utils.getText(6, this);
  }
  set description(value) {
    utils.setText(6, value, this);
  }
  _adoptType(value) {
    utils.adopt(value, utils.getPointer(7, this));
  }
  _disownType() {
    return utils.disown(this.type);
  }
  get type() {
    return utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasType() {
    return !utils.isNull(utils.getPointer(7, this));
  }
  _initType() {
    return utils.initStructAt(7, SerializedTypeReference, this);
  }
  set type(value) {
    utils.copyFrom(value, utils.getPointer(7, this));
  }
  _adoptDefault(value) {
    utils.adopt(value, utils.getPointer(8, this));
  }
  _disownDefault() {
    return utils.disown(this.default);
  }
  get default() {
    return utils.getStruct(8, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !utils.isNull(utils.getPointer(8, this));
  }
  _initDefault() {
    return utils.initStructAt(8, DefaultValueReflection, this);
  }
  set default(value) {
    utils.copyFrom(value, utils.getPointer(8, this));
  }
  toString() {
    return "SerializedTypeProperty_" + super.toString();
  }
};
var SerializedTypeFunction = class _SerializedTypeFunction extends Struct {
  static {
    __name(this, "SerializedTypeFunction");
  }
  static _capnp = {
    displayName: "SerializedTypeFunction",
    id: "9130bccd82dfcfd4",
    size: new ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeFunction._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeFunction._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeFunction._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeFunction._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get visibility() {
    return utils.getUint16(0, this);
  }
  set visibility(value) {
    utils.setUint16(0, value, this);
  }
  get abstract() {
    return utils.getBit(16, this);
  }
  set abstract(value) {
    utils.setBit(16, value, this);
  }
  get optional() {
    return utils.getBit(17, this);
  }
  set optional(value) {
    utils.setBit(17, value, this);
  }
  get readonly() {
    return utils.getBit(18, this);
  }
  set readonly(value) {
    utils.setBit(18, value, this);
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(4, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initTags() {
    return utils.initStructAt(4, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  get kind() {
    return utils.getUint16(4, this);
  }
  set kind(value) {
    utils.setUint16(4, value, this);
  }
  get name() {
    return utils.getText(5, this);
  }
  set name(value) {
    utils.setText(5, value, this);
  }
  _adoptParameters(value) {
    utils.adopt(value, utils.getPointer(6, this));
  }
  _disownParameters() {
    return utils.disown(this.parameters);
  }
  get parameters() {
    return utils.getList(6, _SerializedTypeFunction._Parameters, this);
  }
  _hasParameters() {
    return !utils.isNull(utils.getPointer(6, this));
  }
  _initParameters(length) {
    return utils.initList(6, _SerializedTypeFunction._Parameters, length, this);
  }
  set parameters(value) {
    utils.copyFrom(value, utils.getPointer(6, this));
  }
  _adoptReturn(value) {
    utils.adopt(value, utils.getPointer(7, this));
  }
  _disownReturn() {
    return utils.disown(this.return);
  }
  get return() {
    return utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !utils.isNull(utils.getPointer(7, this));
  }
  _initReturn() {
    return utils.initStructAt(7, SerializedTypeReference, this);
  }
  set return(value) {
    utils.copyFrom(value, utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeFunction_" + super.toString();
  }
};
var SerializedTypePromise = class _SerializedTypePromise extends Struct {
  static {
    __name(this, "SerializedTypePromise");
  }
  static _capnp = {
    displayName: "SerializedTypePromise",
    id: "e9b0cbe936a42398",
    size: new ObjectSize(8, 4)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypePromise._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypePromise._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypePromise._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypePromise._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get visibility() {
    return utils.getUint16(0, this);
  }
  set visibility(value) {
    utils.setUint16(0, value, this);
  }
  get abstract() {
    return utils.getBit(16, this);
  }
  set abstract(value) {
    utils.setBit(16, value, this);
  }
  toString() {
    return "SerializedTypePromise_" + super.toString();
  }
};
var SerializedTypeEnumEntry = class extends Struct {
  static {
    __name(this, "SerializedTypeEnumEntry");
  }
  static _capnp = {
    displayName: "SerializedTypeEnumEntry",
    id: "d5bcb8b7c49ba556",
    size: new ObjectSize(0, 2)
  };
  get name() {
    return utils.getText(0, this);
  }
  set name(value) {
    utils.setText(0, value, this);
  }
  get value() {
    return utils.getText(1, this);
  }
  set value(value) {
    utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeEnumEntry_" + super.toString();
  }
};
var SerializedTypeEnum = class _SerializedTypeEnum extends Struct {
  static {
    __name(this, "SerializedTypeEnum");
  }
  static _capnp = {
    displayName: "SerializedTypeEnum",
    id: "d7d36f0ae79e3841",
    size: new ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _EnumEntries;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeEnum._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeEnum._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeEnum._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeEnum._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptEnumEntries(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownEnumEntries() {
    return utils.disown(this.enumEntries);
  }
  get enumEntries() {
    return utils.getList(4, _SerializedTypeEnum._EnumEntries, this);
  }
  _hasEnumEntries() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initEnumEntries(length) {
    return utils.initList(4, _SerializedTypeEnum._EnumEntries, length, this);
  }
  set enumEntries(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  _adoptValues(value) {
    utils.adopt(value, utils.getPointer(5, this));
  }
  _disownValues() {
    return utils.disown(this.values);
  }
  get values() {
    return utils.getList(5, TextList, this);
  }
  _hasValues() {
    return !utils.isNull(utils.getPointer(5, this));
  }
  _initValues(length) {
    return utils.initList(5, TextList, length, this);
  }
  set values(value) {
    utils.copyFrom(value, utils.getPointer(5, this));
  }
  _adoptIndexType(value) {
    utils.adopt(value, utils.getPointer(6, this));
  }
  _disownIndexType() {
    return utils.disown(this.indexType);
  }
  get indexType() {
    return utils.getStruct(6, SerializedTypeReference, this);
  }
  _hasIndexType() {
    return !utils.isNull(utils.getPointer(6, this));
  }
  _initIndexType() {
    return utils.initStructAt(6, SerializedTypeReference, this);
  }
  set indexType(value) {
    utils.copyFrom(value, utils.getPointer(6, this));
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(7, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(7, this));
  }
  _initTags() {
    return utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeEnum_" + super.toString();
  }
};
var SerializedTypeUnion = class _SerializedTypeUnion extends Struct {
  static {
    __name(this, "SerializedTypeUnion");
  }
  static _capnp = {
    displayName: "SerializedTypeUnion",
    id: "a9ae4c95e41ff4ab",
    size: new ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeUnion._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeUnion._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeUnion._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeUnion._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownTypes() {
    return utils.disown(this.types);
  }
  get types() {
    return utils.getList(4, _SerializedTypeUnion._Types, this);
  }
  _hasTypes() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initTypes(length) {
    return utils.initList(4, _SerializedTypeUnion._Types, length, this);
  }
  set types(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeUnion_" + super.toString();
  }
};
var SerializedTypeIntersection = class _SerializedTypeIntersection extends Struct {
  static {
    __name(this, "SerializedTypeIntersection");
  }
  static _capnp = {
    displayName: "SerializedTypeIntersection",
    id: "9ae42bd17511c09b",
    size: new ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeIntersection._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeIntersection._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeIntersection._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeIntersection._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownTypes() {
    return utils.disown(this.types);
  }
  get types() {
    return utils.getList(4, _SerializedTypeIntersection._Types, this);
  }
  _hasTypes() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initTypes(length) {
    return utils.initList(4, _SerializedTypeIntersection._Types, length, this);
  }
  set types(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeIntersection_" + super.toString();
  }
};
var SerializedTypeArray = class _SerializedTypeArray extends Struct {
  static {
    __name(this, "SerializedTypeArray");
  }
  static _capnp = {
    displayName: "SerializedTypeArray",
    id: "97d1d75240151501",
    size: new ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeArray._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeArray._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeArray._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeArray._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownType() {
    return utils.disown(this.type);
  }
  get type() {
    return utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initType() {
    return utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(5, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(5, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(5, this));
  }
  _initTags() {
    return utils.initStructAt(5, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(5, this));
  }
  toString() {
    return "SerializedTypeArray_" + super.toString();
  }
};
var SerializedTypeIndexSignature = class _SerializedTypeIndexSignature extends Struct {
  static {
    __name(this, "SerializedTypeIndexSignature");
  }
  static _capnp = {
    displayName: "SerializedTypeIndexSignature",
    id: "93e335e2756821d8",
    size: new ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeIndexSignature._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeIndexSignature._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeIndexSignature._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeIndexSignature._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptIndex(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownIndex() {
    return utils.disown(this.index);
  }
  get index() {
    return utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasIndex() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initIndex() {
    return utils.initStructAt(4, SerializedTypeReference, this);
  }
  set index(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  _adoptType(value) {
    utils.adopt(value, utils.getPointer(5, this));
  }
  _disownType() {
    return utils.disown(this.type);
  }
  get type() {
    return utils.getStruct(5, SerializedTypeReference, this);
  }
  _hasType() {
    return !utils.isNull(utils.getPointer(5, this));
  }
  _initType() {
    return utils.initStructAt(5, SerializedTypeReference, this);
  }
  set type(value) {
    utils.copyFrom(value, utils.getPointer(5, this));
  }
  toString() {
    return "SerializedTypeIndexSignature_" + super.toString();
  }
};
var SerializedTypePropertySignature = class _SerializedTypePropertySignature extends Struct {
  static {
    __name(this, "SerializedTypePropertySignature");
  }
  static _capnp = {
    displayName: "SerializedTypePropertySignature",
    id: "9bc1cebd2ca1569a",
    size: new ObjectSize(8, 9)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypePropertySignature._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypePropertySignature._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypePropertySignature._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypePropertySignature._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  get name() {
    return utils.getText(4, this);
  }
  set name(value) {
    utils.setText(4, value, this);
  }
  get optional() {
    return utils.getBit(16, this);
  }
  set optional(value) {
    utils.setBit(16, value, this);
  }
  get readonly() {
    return utils.getBit(17, this);
  }
  set readonly(value) {
    utils.setBit(17, value, this);
  }
  get description() {
    return utils.getText(5, this);
  }
  set description(value) {
    utils.setText(5, value, this);
  }
  _adoptDefault(value) {
    utils.adopt(value, utils.getPointer(6, this));
  }
  _disownDefault() {
    return utils.disown(this.default);
  }
  get default() {
    return utils.getStruct(6, DefaultValueReflection, this);
  }
  _hasDefault() {
    return !utils.isNull(utils.getPointer(6, this));
  }
  _initDefault() {
    return utils.initStructAt(6, DefaultValueReflection, this);
  }
  set default(value) {
    utils.copyFrom(value, utils.getPointer(6, this));
  }
  _adoptType(value) {
    utils.adopt(value, utils.getPointer(7, this));
  }
  _disownType() {
    return utils.disown(this.type);
  }
  get type() {
    return utils.getStruct(7, SerializedTypeReference, this);
  }
  _hasType() {
    return !utils.isNull(utils.getPointer(7, this));
  }
  _initType() {
    return utils.initStructAt(7, SerializedTypeReference, this);
  }
  set type(value) {
    utils.copyFrom(value, utils.getPointer(7, this));
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(8, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(8, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(8, this));
  }
  _initTags() {
    return utils.initStructAt(8, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(8, this));
  }
  toString() {
    return "SerializedTypePropertySignature_" + super.toString();
  }
};
var SerializedTypeMethodSignature = class _SerializedTypeMethodSignature extends Struct {
  static {
    __name(this, "SerializedTypeMethodSignature");
  }
  static _capnp = {
    displayName: "SerializedTypeMethodSignature",
    id: "e25a2cc39d5930c8",
    size: new ObjectSize(8, 8)
  };
  static _TypeArguments;
  static _Decorators;
  static _Parameters;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeMethodSignature._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeMethodSignature._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeMethodSignature._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeMethodSignature._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  get name() {
    return utils.getText(4, this);
  }
  set name(value) {
    utils.setText(4, value, this);
  }
  get optional() {
    return utils.getBit(16, this);
  }
  set optional(value) {
    utils.setBit(16, value, this);
  }
  _adoptParameters(value) {
    utils.adopt(value, utils.getPointer(5, this));
  }
  _disownParameters() {
    return utils.disown(this.parameters);
  }
  get parameters() {
    return utils.getList(5, _SerializedTypeMethodSignature._Parameters, this);
  }
  _hasParameters() {
    return !utils.isNull(utils.getPointer(5, this));
  }
  _initParameters(length) {
    return utils.initList(5, _SerializedTypeMethodSignature._Parameters, length, this);
  }
  set parameters(value) {
    utils.copyFrom(value, utils.getPointer(5, this));
  }
  _adoptReturn(value) {
    utils.adopt(value, utils.getPointer(6, this));
  }
  _disownReturn() {
    return utils.disown(this.return);
  }
  get return() {
    return utils.getStruct(6, SerializedTypeReference, this);
  }
  _hasReturn() {
    return !utils.isNull(utils.getPointer(6, this));
  }
  _initReturn() {
    return utils.initStructAt(6, SerializedTypeReference, this);
  }
  set return(value) {
    utils.copyFrom(value, utils.getPointer(6, this));
  }
  _adoptTags(value) {
    utils.adopt(value, utils.getPointer(7, this));
  }
  _disownTags() {
    return utils.disown(this.tags);
  }
  get tags() {
    return utils.getStruct(7, TagsReflection, this);
  }
  _hasTags() {
    return !utils.isNull(utils.getPointer(7, this));
  }
  _initTags() {
    return utils.initStructAt(7, TagsReflection, this);
  }
  set tags(value) {
    utils.copyFrom(value, utils.getPointer(7, this));
  }
  toString() {
    return "SerializedTypeMethodSignature_" + super.toString();
  }
};
var SerializedTypeTypeParameter = class _SerializedTypeTypeParameter extends Struct {
  static {
    __name(this, "SerializedTypeTypeParameter");
  }
  static _capnp = {
    displayName: "SerializedTypeTypeParameter",
    id: "81210361a54d5d71",
    size: new ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeTypeParameter._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeTypeParameter._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeTypeParameter._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeTypeParameter._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  get name() {
    return utils.getText(4, this);
  }
  set name(value) {
    utils.setText(4, value, this);
  }
  toString() {
    return "SerializedTypeTypeParameter_" + super.toString();
  }
};
var SerializedTypeInfer = class _SerializedTypeInfer extends Struct {
  static {
    __name(this, "SerializedTypeInfer");
  }
  static _capnp = {
    displayName: "SerializedTypeInfer",
    id: "91c6dd1e13f2b14d",
    size: new ObjectSize(8, 4)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeInfer._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeInfer._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeInfer._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeInfer._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  toString() {
    return "SerializedTypeInfer_" + super.toString();
  }
};
var SerializedTypeTupleMember = class _SerializedTypeTupleMember extends Struct {
  static {
    __name(this, "SerializedTypeTupleMember");
  }
  static _capnp = {
    displayName: "SerializedTypeTupleMember",
    id: "e21c2a18d0d56fdf",
    size: new ObjectSize(8, 6)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeTupleMember._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeTupleMember._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeTupleMember._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeTupleMember._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownType() {
    return utils.disown(this.type);
  }
  get type() {
    return utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initType() {
    return utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  get optional() {
    return utils.getBit(16, this);
  }
  set optional(value) {
    utils.setBit(16, value, this);
  }
  get name() {
    return utils.getText(5, this);
  }
  set name(value) {
    utils.setText(5, value, this);
  }
  toString() {
    return "SerializedTypeTupleMember_" + super.toString();
  }
};
var SerializedTypeTuple = class _SerializedTypeTuple extends Struct {
  static {
    __name(this, "SerializedTypeTuple");
  }
  static _capnp = {
    displayName: "SerializedTypeTuple",
    id: "eb7501eb1ee4fb6d",
    size: new ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeTuple._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeTuple._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeTuple._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeTuple._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownTypes() {
    return utils.disown(this.types);
  }
  get types() {
    return utils.getList(4, _SerializedTypeTuple._Types, this);
  }
  _hasTypes() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initTypes(length) {
    return utils.initList(4, _SerializedTypeTuple._Types, length, this);
  }
  set types(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeTuple_" + super.toString();
  }
};
var SerializedTypeRest = class _SerializedTypeRest extends Struct {
  static {
    __name(this, "SerializedTypeRest");
  }
  static _capnp = {
    displayName: "SerializedTypeRest",
    id: "f9e684a435cce5d1",
    size: new ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeRest._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeRest._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeRest._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeRest._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptType(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownType() {
    return utils.disown(this.type);
  }
  get type() {
    return utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasType() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initType() {
    return utils.initStructAt(4, SerializedTypeReference, this);
  }
  set type(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeRest_" + super.toString();
  }
};
var SimpleSerializedType = class _SimpleSerializedType extends Struct {
  static {
    __name(this, "SimpleSerializedType");
  }
  static _capnp = {
    displayName: "SimpleSerializedType",
    id: "80f983e4b811c3ca",
    size: new ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SimpleSerializedType._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SimpleSerializedType._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SimpleSerializedType._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SimpleSerializedType._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptOrigin(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownOrigin() {
    return utils.disown(this.origin);
  }
  get origin() {
    return utils.getStruct(4, SerializedTypeReference, this);
  }
  _hasOrigin() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initOrigin() {
    return utils.initStructAt(4, SerializedTypeReference, this);
  }
  set origin(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  toString() {
    return "SimpleSerializedType_" + super.toString();
  }
};
var SerializedTypeLiteralSymbol = class extends Struct {
  static {
    __name(this, "SerializedTypeLiteralSymbol");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteralSymbol",
    id: "f3dd6a3c6054bd55",
    size: new ObjectSize(0, 2)
  };
  /**
  * "symbol"
  *
  */
  get type() {
    return utils.getText(0, this);
  }
  set type(value) {
    utils.setText(0, value, this);
  }
  get name() {
    return utils.getText(1, this);
  }
  set name(value) {
    utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralSymbol_" + super.toString();
  }
};
var SerializedTypeLiteralBigInt = class extends Struct {
  static {
    __name(this, "SerializedTypeLiteralBigInt");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteralBigInt",
    id: "821a872d8be30bb2",
    size: new ObjectSize(0, 2)
  };
  /**
  * "bigint"
  *
  */
  get type() {
    return utils.getText(0, this);
  }
  set type(value) {
    utils.setText(0, value, this);
  }
  get value() {
    return utils.getText(1, this);
  }
  set value(value) {
    utils.setText(1, value, this);
  }
  toString() {
    return "SerializedTypeLiteralBigInt_" + super.toString();
  }
};
var SerializedTypeLiteralRegex = class extends Struct {
  static {
    __name(this, "SerializedTypeLiteralRegex");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteralRegex",
    id: "cc89f97b47927d99",
    size: new ObjectSize(0, 2)
  };
  /**
  * "regex"
  *
  */
  get type() {
    return utils.getText(0, this);
  }
  set type(value) {
    utils.setText(0, value, this);
  }
  get regex() {
    return utils.getText(1, this);
  }
  set regex(value) {
    utils.setText(1, value, this);
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
var SerializedTypeLiteral_Literal = class extends Struct {
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
    size: new ObjectSize(16, 5)
  };
  _adoptSymbol(value) {
    utils.setUint16(2, 0, this);
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownSymbol() {
    return utils.disown(this.symbol);
  }
  get symbol() {
    utils.testWhich("symbol", utils.getUint16(2, this), 0, this);
    return utils.getStruct(4, SerializedTypeLiteralSymbol, this);
  }
  _hasSymbol() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initSymbol() {
    utils.setUint16(2, 0, this);
    return utils.initStructAt(4, SerializedTypeLiteralSymbol, this);
  }
  get _isSymbol() {
    return utils.getUint16(2, this) === 0;
  }
  set symbol(value) {
    utils.setUint16(2, 0, this);
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  get string() {
    utils.testWhich("string", utils.getUint16(2, this), 1, this);
    return utils.getText(4, this);
  }
  get _isString() {
    return utils.getUint16(2, this) === 1;
  }
  set string(value) {
    utils.setUint16(2, 1, this);
    utils.setText(4, value, this);
  }
  get number() {
    utils.testWhich("number", utils.getUint16(2, this), 2, this);
    return utils.getFloat64(8, this);
  }
  get _isNumber() {
    return utils.getUint16(2, this) === 2;
  }
  set number(value) {
    utils.setUint16(2, 2, this);
    utils.setFloat64(8, value, this);
  }
  get boolean() {
    utils.testWhich("boolean", utils.getUint16(2, this), 3, this);
    return utils.getBit(64, this);
  }
  get _isBoolean() {
    return utils.getUint16(2, this) === 3;
  }
  set boolean(value) {
    utils.setUint16(2, 3, this);
    utils.setBit(64, value, this);
  }
  _adoptBigint(value) {
    utils.setUint16(2, 4, this);
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownBigint() {
    return utils.disown(this.bigint);
  }
  get bigint() {
    utils.testWhich("bigint", utils.getUint16(2, this), 4, this);
    return utils.getStruct(4, SerializedTypeLiteralBigInt, this);
  }
  _hasBigint() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initBigint() {
    utils.setUint16(2, 4, this);
    return utils.initStructAt(4, SerializedTypeLiteralBigInt, this);
  }
  get _isBigint() {
    return utils.getUint16(2, this) === 4;
  }
  set bigint(value) {
    utils.setUint16(2, 4, this);
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  _adoptRegex(value) {
    utils.setUint16(2, 5, this);
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownRegex() {
    return utils.disown(this.regex);
  }
  get regex() {
    utils.testWhich("regex", utils.getUint16(2, this), 5, this);
    return utils.getStruct(4, SerializedTypeLiteralRegex, this);
  }
  _hasRegex() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initRegex() {
    utils.setUint16(2, 5, this);
    return utils.initStructAt(4, SerializedTypeLiteralRegex, this);
  }
  get _isRegex() {
    return utils.getUint16(2, this) === 5;
  }
  set regex(value) {
    utils.setUint16(2, 5, this);
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeLiteral_Literal_" + super.toString();
  }
  which() {
    return utils.getUint16(2, this);
  }
};
var SerializedTypeLiteral = class _SerializedTypeLiteral extends Struct {
  static {
    __name(this, "SerializedTypeLiteral");
  }
  static _capnp = {
    displayName: "SerializedTypeLiteral",
    id: "b876ba24d27d88c8",
    size: new ObjectSize(16, 5)
  };
  static _TypeArguments;
  static _Decorators;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeLiteral._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeLiteral._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeLiteral._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeLiteral._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  get literal() {
    return utils.getAs(SerializedTypeLiteral_Literal, this);
  }
  _initLiteral() {
    return utils.getAs(SerializedTypeLiteral_Literal, this);
  }
  toString() {
    return "SerializedTypeLiteral_" + super.toString();
  }
};
var SerializedTypeTemplateLiteral = class _SerializedTypeTemplateLiteral extends Struct {
  static {
    __name(this, "SerializedTypeTemplateLiteral");
  }
  static _capnp = {
    displayName: "SerializedTypeTemplateLiteral",
    id: "8dd6c284d46cc265",
    size: new ObjectSize(8, 5)
  };
  static _TypeArguments;
  static _Decorators;
  static _Types;
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  _adoptTypeArguments(value) {
    utils.adopt(value, utils.getPointer(1, this));
  }
  _disownTypeArguments() {
    return utils.disown(this.typeArguments);
  }
  get typeArguments() {
    return utils.getList(1, _SerializedTypeTemplateLiteral._TypeArguments, this);
  }
  _hasTypeArguments() {
    return !utils.isNull(utils.getPointer(1, this));
  }
  _initTypeArguments(length) {
    return utils.initList(1, _SerializedTypeTemplateLiteral._TypeArguments, length, this);
  }
  set typeArguments(value) {
    utils.copyFrom(value, utils.getPointer(1, this));
  }
  _adoptIndexAccessOrigin(value) {
    utils.adopt(value, utils.getPointer(2, this));
  }
  _disownIndexAccessOrigin() {
    return utils.disown(this.indexAccessOrigin);
  }
  get indexAccessOrigin() {
    return utils.getStruct(2, IndexAccessOrigin, this);
  }
  _hasIndexAccessOrigin() {
    return !utils.isNull(utils.getPointer(2, this));
  }
  _initIndexAccessOrigin() {
    return utils.initStructAt(2, IndexAccessOrigin, this);
  }
  set indexAccessOrigin(value) {
    utils.copyFrom(value, utils.getPointer(2, this));
  }
  _adoptDecorators(value) {
    utils.adopt(value, utils.getPointer(3, this));
  }
  _disownDecorators() {
    return utils.disown(this.decorators);
  }
  get decorators() {
    return utils.getList(3, _SerializedTypeTemplateLiteral._Decorators, this);
  }
  _hasDecorators() {
    return !utils.isNull(utils.getPointer(3, this));
  }
  _initDecorators(length) {
    return utils.initList(3, _SerializedTypeTemplateLiteral._Decorators, length, this);
  }
  set decorators(value) {
    utils.copyFrom(value, utils.getPointer(3, this));
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
  }
  _adoptTypes(value) {
    utils.adopt(value, utils.getPointer(4, this));
  }
  _disownTypes() {
    return utils.disown(this.types);
  }
  get types() {
    return utils.getList(4, _SerializedTypeTemplateLiteral._Types, this);
  }
  _hasTypes() {
    return !utils.isNull(utils.getPointer(4, this));
  }
  _initTypes(length) {
    return utils.initList(4, _SerializedTypeTemplateLiteral._Types, length, this);
  }
  set types(value) {
    utils.copyFrom(value, utils.getPointer(4, this));
  }
  toString() {
    return "SerializedTypeTemplateLiteral_" + super.toString();
  }
};
var SerializedTypeOther = class extends Struct {
  static {
    __name(this, "SerializedTypeOther");
  }
  static _capnp = {
    displayName: "SerializedTypeOther",
    id: "9e1048a692ff49ce",
    size: new ObjectSize(8, 1)
  };
  get typeName() {
    return utils.getText(0, this);
  }
  set typeName(value) {
    utils.setText(0, value, this);
  }
  get kind() {
    return utils.getUint16(0, this);
  }
  set kind(value) {
    utils.setUint16(0, value, this);
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
var SerializedType_Type = class extends Struct {
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
    size: new ObjectSize(8, 1)
  };
  _adoptSimple(value) {
    utils.setUint16(0, 0, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownSimple() {
    return utils.disown(this.simple);
  }
  get simple() {
    utils.testWhich("simple", utils.getUint16(0, this), 0, this);
    return utils.getStruct(0, SimpleSerializedType, this);
  }
  _hasSimple() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initSimple() {
    utils.setUint16(0, 0, this);
    return utils.initStructAt(0, SimpleSerializedType, this);
  }
  get _isSimple() {
    return utils.getUint16(0, this) === 0;
  }
  set simple(value) {
    utils.setUint16(0, 0, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptLiteral(value) {
    utils.setUint16(0, 1, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownLiteral() {
    return utils.disown(this.literal);
  }
  get literal() {
    utils.testWhich("literal", utils.getUint16(0, this), 1, this);
    return utils.getStruct(0, SerializedTypeLiteral, this);
  }
  _hasLiteral() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initLiteral() {
    utils.setUint16(0, 1, this);
    return utils.initStructAt(0, SerializedTypeLiteral, this);
  }
  get _isLiteral() {
    return utils.getUint16(0, this) === 1;
  }
  set literal(value) {
    utils.setUint16(0, 1, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptTemplateLiteral(value) {
    utils.setUint16(0, 2, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownTemplateLiteral() {
    return utils.disown(this.templateLiteral);
  }
  get templateLiteral() {
    utils.testWhich("templateLiteral", utils.getUint16(0, this), 2, this);
    return utils.getStruct(0, SerializedTypeTemplateLiteral, this);
  }
  _hasTemplateLiteral() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initTemplateLiteral() {
    utils.setUint16(0, 2, this);
    return utils.initStructAt(0, SerializedTypeTemplateLiteral, this);
  }
  get _isTemplateLiteral() {
    return utils.getUint16(0, this) === 2;
  }
  set templateLiteral(value) {
    utils.setUint16(0, 2, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptParameter(value) {
    utils.setUint16(0, 3, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownParameter() {
    return utils.disown(this.parameter);
  }
  get parameter() {
    utils.testWhich("parameter", utils.getUint16(0, this), 3, this);
    return utils.getStruct(0, SerializedTypeParameter, this);
  }
  _hasParameter() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initParameter() {
    utils.setUint16(0, 3, this);
    return utils.initStructAt(0, SerializedTypeParameter, this);
  }
  get _isParameter() {
    return utils.getUint16(0, this) === 3;
  }
  set parameter(value) {
    utils.setUint16(0, 3, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptFunction(value) {
    utils.setUint16(0, 4, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownFunction() {
    return utils.disown(this.function);
  }
  get function() {
    utils.testWhich("function", utils.getUint16(0, this), 4, this);
    return utils.getStruct(0, SerializedTypeFunction, this);
  }
  _hasFunction() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initFunction() {
    utils.setUint16(0, 4, this);
    return utils.initStructAt(0, SerializedTypeFunction, this);
  }
  get _isFunction() {
    return utils.getUint16(0, this) === 4;
  }
  set function(value) {
    utils.setUint16(0, 4, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptMethod(value) {
    utils.setUint16(0, 5, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownMethod() {
    return utils.disown(this.method);
  }
  get method() {
    utils.testWhich("method", utils.getUint16(0, this), 5, this);
    return utils.getStruct(0, SerializedTypeMethod, this);
  }
  _hasMethod() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initMethod() {
    utils.setUint16(0, 5, this);
    return utils.initStructAt(0, SerializedTypeMethod, this);
  }
  get _isMethod() {
    return utils.getUint16(0, this) === 5;
  }
  set method(value) {
    utils.setUint16(0, 5, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptProperty(value) {
    utils.setUint16(0, 6, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownProperty() {
    return utils.disown(this.property);
  }
  get property() {
    utils.testWhich("property", utils.getUint16(0, this), 6, this);
    return utils.getStruct(0, SerializedTypeProperty, this);
  }
  _hasProperty() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initProperty() {
    utils.setUint16(0, 6, this);
    return utils.initStructAt(0, SerializedTypeProperty, this);
  }
  get _isProperty() {
    return utils.getUint16(0, this) === 6;
  }
  set property(value) {
    utils.setUint16(0, 6, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptPromise(value) {
    utils.setUint16(0, 7, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownPromise() {
    return utils.disown(this.promise);
  }
  get promise() {
    utils.testWhich("promise", utils.getUint16(0, this), 7, this);
    return utils.getStruct(0, SerializedTypePromise, this);
  }
  _hasPromise() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initPromise() {
    utils.setUint16(0, 7, this);
    return utils.initStructAt(0, SerializedTypePromise, this);
  }
  get _isPromise() {
    return utils.getUint16(0, this) === 7;
  }
  set promise(value) {
    utils.setUint16(0, 7, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptClassType(value) {
    utils.setUint16(0, 8, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownClassType() {
    return utils.disown(this.classType);
  }
  get classType() {
    utils.testWhich("classType", utils.getUint16(0, this), 8, this);
    return utils.getStruct(0, SerializedTypeClassType, this);
  }
  _hasClassType() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initClassType() {
    utils.setUint16(0, 8, this);
    return utils.initStructAt(0, SerializedTypeClassType, this);
  }
  get _isClassType() {
    return utils.getUint16(0, this) === 8;
  }
  set classType(value) {
    utils.setUint16(0, 8, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptEnum(value) {
    utils.setUint16(0, 9, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownEnum() {
    return utils.disown(this.enum);
  }
  get enum() {
    utils.testWhich("enum", utils.getUint16(0, this), 9, this);
    return utils.getStruct(0, SerializedTypeEnum, this);
  }
  _hasEnum() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initEnum() {
    utils.setUint16(0, 9, this);
    return utils.initStructAt(0, SerializedTypeEnum, this);
  }
  get _isEnum() {
    return utils.getUint16(0, this) === 9;
  }
  set enum(value) {
    utils.setUint16(0, 9, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptUnion(value) {
    utils.setUint16(0, 10, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownUnion() {
    return utils.disown(this.union);
  }
  get union() {
    utils.testWhich("union", utils.getUint16(0, this), 10, this);
    return utils.getStruct(0, SerializedTypeUnion, this);
  }
  _hasUnion() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initUnion() {
    utils.setUint16(0, 10, this);
    return utils.initStructAt(0, SerializedTypeUnion, this);
  }
  get _isUnion() {
    return utils.getUint16(0, this) === 10;
  }
  set union(value) {
    utils.setUint16(0, 10, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptIntersection(value) {
    utils.setUint16(0, 11, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownIntersection() {
    return utils.disown(this.intersection);
  }
  get intersection() {
    utils.testWhich("intersection", utils.getUint16(0, this), 11, this);
    return utils.getStruct(0, SerializedTypeIntersection, this);
  }
  _hasIntersection() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initIntersection() {
    utils.setUint16(0, 11, this);
    return utils.initStructAt(0, SerializedTypeIntersection, this);
  }
  get _isIntersection() {
    return utils.getUint16(0, this) === 11;
  }
  set intersection(value) {
    utils.setUint16(0, 11, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptArray(value) {
    utils.setUint16(0, 12, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownArray() {
    return utils.disown(this.array);
  }
  get array() {
    utils.testWhich("array", utils.getUint16(0, this), 12, this);
    return utils.getStruct(0, SerializedTypeArray, this);
  }
  _hasArray() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initArray() {
    utils.setUint16(0, 12, this);
    return utils.initStructAt(0, SerializedTypeArray, this);
  }
  get _isArray() {
    return utils.getUint16(0, this) === 12;
  }
  set array(value) {
    utils.setUint16(0, 12, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptObjectLiteral(value) {
    utils.setUint16(0, 13, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownObjectLiteral() {
    return utils.disown(this.objectLiteral);
  }
  get objectLiteral() {
    utils.testWhich("objectLiteral", utils.getUint16(0, this), 13, this);
    return utils.getStruct(0, SerializedTypeObjectLiteral, this);
  }
  _hasObjectLiteral() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initObjectLiteral() {
    utils.setUint16(0, 13, this);
    return utils.initStructAt(0, SerializedTypeObjectLiteral, this);
  }
  get _isObjectLiteral() {
    return utils.getUint16(0, this) === 13;
  }
  set objectLiteral(value) {
    utils.setUint16(0, 13, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptIndexSignature(value) {
    utils.setUint16(0, 14, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownIndexSignature() {
    return utils.disown(this.indexSignature);
  }
  get indexSignature() {
    utils.testWhich("indexSignature", utils.getUint16(0, this), 14, this);
    return utils.getStruct(0, SerializedTypeIndexSignature, this);
  }
  _hasIndexSignature() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initIndexSignature() {
    utils.setUint16(0, 14, this);
    return utils.initStructAt(0, SerializedTypeIndexSignature, this);
  }
  get _isIndexSignature() {
    return utils.getUint16(0, this) === 14;
  }
  set indexSignature(value) {
    utils.setUint16(0, 14, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptPropertySignature(value) {
    utils.setUint16(0, 15, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownPropertySignature() {
    return utils.disown(this.propertySignature);
  }
  get propertySignature() {
    utils.testWhich("propertySignature", utils.getUint16(0, this), 15, this);
    return utils.getStruct(0, SerializedTypePropertySignature, this);
  }
  _hasPropertySignature() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initPropertySignature() {
    utils.setUint16(0, 15, this);
    return utils.initStructAt(0, SerializedTypePropertySignature, this);
  }
  get _isPropertySignature() {
    return utils.getUint16(0, this) === 15;
  }
  set propertySignature(value) {
    utils.setUint16(0, 15, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptMethodSignature(value) {
    utils.setUint16(0, 16, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownMethodSignature() {
    return utils.disown(this.methodSignature);
  }
  get methodSignature() {
    utils.testWhich("methodSignature", utils.getUint16(0, this), 16, this);
    return utils.getStruct(0, SerializedTypeMethodSignature, this);
  }
  _hasMethodSignature() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initMethodSignature() {
    utils.setUint16(0, 16, this);
    return utils.initStructAt(0, SerializedTypeMethodSignature, this);
  }
  get _isMethodSignature() {
    return utils.getUint16(0, this) === 16;
  }
  set methodSignature(value) {
    utils.setUint16(0, 16, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptTypeParameter(value) {
    utils.setUint16(0, 17, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownTypeParameter() {
    return utils.disown(this.typeParameter);
  }
  get typeParameter() {
    utils.testWhich("typeParameter", utils.getUint16(0, this), 17, this);
    return utils.getStruct(0, SerializedTypeTypeParameter, this);
  }
  _hasTypeParameter() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initTypeParameter() {
    utils.setUint16(0, 17, this);
    return utils.initStructAt(0, SerializedTypeTypeParameter, this);
  }
  get _isTypeParameter() {
    return utils.getUint16(0, this) === 17;
  }
  set typeParameter(value) {
    utils.setUint16(0, 17, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptInfer(value) {
    utils.setUint16(0, 18, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownInfer() {
    return utils.disown(this.infer);
  }
  get infer() {
    utils.testWhich("infer", utils.getUint16(0, this), 18, this);
    return utils.getStruct(0, SerializedTypeInfer, this);
  }
  _hasInfer() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initInfer() {
    utils.setUint16(0, 18, this);
    return utils.initStructAt(0, SerializedTypeInfer, this);
  }
  get _isInfer() {
    return utils.getUint16(0, this) === 18;
  }
  set infer(value) {
    utils.setUint16(0, 18, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptTuple(value) {
    utils.setUint16(0, 19, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownTuple() {
    return utils.disown(this.tuple);
  }
  get tuple() {
    utils.testWhich("tuple", utils.getUint16(0, this), 19, this);
    return utils.getStruct(0, SerializedTypeTuple, this);
  }
  _hasTuple() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initTuple() {
    utils.setUint16(0, 19, this);
    return utils.initStructAt(0, SerializedTypeTuple, this);
  }
  get _isTuple() {
    return utils.getUint16(0, this) === 19;
  }
  set tuple(value) {
    utils.setUint16(0, 19, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptTupleMember(value) {
    utils.setUint16(0, 20, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownTupleMember() {
    return utils.disown(this.tupleMember);
  }
  get tupleMember() {
    utils.testWhich("tupleMember", utils.getUint16(0, this), 20, this);
    return utils.getStruct(0, SerializedTypeTupleMember, this);
  }
  _hasTupleMember() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initTupleMember() {
    utils.setUint16(0, 20, this);
    return utils.initStructAt(0, SerializedTypeTupleMember, this);
  }
  get _isTupleMember() {
    return utils.getUint16(0, this) === 20;
  }
  set tupleMember(value) {
    utils.setUint16(0, 20, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptRest(value) {
    utils.setUint16(0, 21, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownRest() {
    return utils.disown(this.rest);
  }
  get rest() {
    utils.testWhich("rest", utils.getUint16(0, this), 21, this);
    return utils.getStruct(0, SerializedTypeRest, this);
  }
  _hasRest() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initRest() {
    utils.setUint16(0, 21, this);
    return utils.initStructAt(0, SerializedTypeRest, this);
  }
  get _isRest() {
    return utils.getUint16(0, this) === 21;
  }
  set rest(value) {
    utils.setUint16(0, 21, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  _adoptOther(value) {
    utils.setUint16(0, 22, this);
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownOther() {
    return utils.disown(this.other);
  }
  /**
  * For any other type that is not explicitly defined
  *
  */
  get other() {
    utils.testWhich("other", utils.getUint16(0, this), 22, this);
    return utils.getStruct(0, SerializedTypeOther, this);
  }
  _hasOther() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initOther() {
    utils.setUint16(0, 22, this);
    return utils.initStructAt(0, SerializedTypeOther, this);
  }
  get _isOther() {
    return utils.getUint16(0, this) === 22;
  }
  set other(value) {
    utils.setUint16(0, 22, this);
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  toString() {
    return "SerializedType_Type_" + super.toString();
  }
  which() {
    return utils.getUint16(0, this);
  }
};
var SerializedType = class extends Struct {
  static {
    __name(this, "SerializedType");
  }
  static _capnp = {
    displayName: "SerializedType",
    id: "96856dcc2dd3d58f",
    size: new ObjectSize(8, 1)
  };
  get type() {
    return utils.getAs(SerializedType_Type, this);
  }
  _initType() {
    return utils.getAs(SerializedType_Type, this);
  }
  toString() {
    return "SerializedType_" + super.toString();
  }
};
var SerializedTypes = class _SerializedTypes extends Struct {
  static {
    __name(this, "SerializedTypes");
  }
  static _capnp = {
    displayName: "SerializedTypes",
    id: "ac55398ab0ef4958",
    size: new ObjectSize(0, 1)
  };
  static _Types;
  _adoptTypes(value) {
    utils.adopt(value, utils.getPointer(0, this));
  }
  _disownTypes() {
    return utils.disown(this.types);
  }
  get types() {
    return utils.getList(0, _SerializedTypes._Types, this);
  }
  _hasTypes() {
    return !utils.isNull(utils.getPointer(0, this));
  }
  _initTypes(length) {
    return utils.initList(0, _SerializedTypes._Types, length, this);
  }
  set types(value) {
    utils.copyFrom(value, utils.getPointer(0, this));
  }
  toString() {
    return "SerializedTypes_" + super.toString();
  }
};
EntityOptions._Indexes = CompositeList(EntityOptions_EntityIndexOptions);
SerializedTypeObjectLiteral._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeObjectLiteral._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeObjectLiteral._Types = CompositeList(SerializedTypeReference);
SerializedTypeClassType._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeClassType._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeClassType._ExtendsArguments = CompositeList(SerializedTypeReference);
SerializedTypeClassType._Arguments = CompositeList(SerializedTypeReference);
SerializedTypeClassType._Types = CompositeList(SerializedTypeReference);
SerializedTypeParameter._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeParameter._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeMethod._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeMethod._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeMethod._Parameters = CompositeList(SerializedTypeParameter);
SerializedTypeProperty._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeProperty._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeFunction._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeFunction._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeFunction._Parameters = CompositeList(SerializedTypeParameter);
SerializedTypePromise._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypePromise._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeEnum._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeEnum._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeEnum._EnumEntries = CompositeList(SerializedTypeEnumEntry);
SerializedTypeUnion._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeUnion._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeUnion._Types = CompositeList(SerializedTypeReference);
SerializedTypeIntersection._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeIntersection._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeIntersection._Types = CompositeList(SerializedTypeReference);
SerializedTypeArray._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeArray._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeIndexSignature._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeIndexSignature._Decorators = CompositeList(SerializedTypeReference);
SerializedTypePropertySignature._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypePropertySignature._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeMethodSignature._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeMethodSignature._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeMethodSignature._Parameters = CompositeList(SerializedTypeParameter);
SerializedTypeTypeParameter._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeTypeParameter._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeInfer._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeInfer._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeTupleMember._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeTupleMember._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeTuple._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeTuple._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeTuple._Types = CompositeList(SerializedTypeTupleMember);
SerializedTypeRest._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeRest._Decorators = CompositeList(SerializedTypeReference);
SimpleSerializedType._TypeArguments = CompositeList(SerializedTypeReference);
SimpleSerializedType._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeLiteral._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeLiteral._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeTemplateLiteral._TypeArguments = CompositeList(SerializedTypeReference);
SerializedTypeTemplateLiteral._Decorators = CompositeList(SerializedTypeReference);
SerializedTypeTemplateLiteral._Types = CompositeList(SerializedTypeReference);
SerializedTypes._Types = CompositeList(SerializedType);

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
exports._capnpFileId = _capnpFileId3;
