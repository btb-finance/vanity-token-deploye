"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isParsedInstanceOfMatcherCall = exports.isInstanceOfBinaryExpression = exports.isBooleanLiteral = exports.isBooleanEqualityMatcher = exports.getFirstMatcherArg = exports.findTopMostCallExpression = exports.createRule = exports.TestCaseName = exports.ModifierName = exports.HookName = exports.EqualityMatcher = exports.DescribeAlias = void 0;
var _path = require("path");
var _utils = require("@typescript-eslint/utils");
var _package = require("../../../package.json");
var _accessors = require("./accessors");
var _followTypeAssertionChain = require("./followTypeAssertionChain");
const createRule = exports.createRule = _utils.ESLintUtils.RuleCreator(name => {
  const ruleName = (0, _path.parse)(name).name;
  return `${_package.repository}/blob/v${_package.version}/docs/rules/${ruleName}.md`;
});

/**
 * Represents a `MemberExpression` with a "known" `property`.
 */

/**
 * Represents a `CallExpression` with a "known" `property` accessor.
 *
 * i.e `KnownCallExpression<'includes'>` represents `.includes()`.
 */

/**
 * Represents a `MemberExpression` with a "known" `property`, that is called.
 *
 * This is `KnownCallExpression` from the perspective of the `MemberExpression` node.
 */
let DescribeAlias = exports.DescribeAlias = /*#__PURE__*/function (DescribeAlias) {
  DescribeAlias["describe"] = "describe";
  DescribeAlias["fdescribe"] = "fdescribe";
  DescribeAlias["xdescribe"] = "xdescribe";
  return DescribeAlias;
}({});
let TestCaseName = exports.TestCaseName = /*#__PURE__*/function (TestCaseName) {
  TestCaseName["fit"] = "fit";
  TestCaseName["it"] = "it";
  TestCaseName["test"] = "test";
  TestCaseName["xit"] = "xit";
  TestCaseName["xtest"] = "xtest";
  return TestCaseName;
}({});
let HookName = exports.HookName = /*#__PURE__*/function (HookName) {
  HookName["beforeAll"] = "beforeAll";
  HookName["beforeEach"] = "beforeEach";
  HookName["afterAll"] = "afterAll";
  HookName["afterEach"] = "afterEach";
  return HookName;
}({});
let ModifierName = exports.ModifierName = /*#__PURE__*/function (ModifierName) {
  ModifierName["not"] = "not";
  ModifierName["rejects"] = "rejects";
  ModifierName["resolves"] = "resolves";
  return ModifierName;
}({});
let EqualityMatcher = exports.EqualityMatcher = /*#__PURE__*/function (EqualityMatcher) {
  EqualityMatcher["toBe"] = "toBe";
  EqualityMatcher["toEqual"] = "toEqual";
  EqualityMatcher["toStrictEqual"] = "toStrictEqual";
  return EqualityMatcher;
}({});
const findTopMostCallExpression = node => {
  let topMostCallExpression = node;
  let {
    parent
  } = node;
  while (parent) {
    if (parent.type === _utils.AST_NODE_TYPES.CallExpression) {
      topMostCallExpression = parent;
      parent = parent.parent;
      continue;
    }
    if (parent.type !== _utils.AST_NODE_TYPES.MemberExpression) {
      break;
    }
    parent = parent.parent;
  }
  return topMostCallExpression;
};
exports.findTopMostCallExpression = findTopMostCallExpression;
const isBooleanLiteral = node => node.type === _utils.AST_NODE_TYPES.Literal && typeof node.value === 'boolean';
exports.isBooleanLiteral = isBooleanLiteral;
const getFirstMatcherArg = expectFnCall => {
  const [firstArg] = expectFnCall.args;
  if (firstArg.type === _utils.AST_NODE_TYPES.SpreadElement) {
    return firstArg;
  }
  return (0, _followTypeAssertionChain.followTypeAssertionChain)(firstArg);
};
exports.getFirstMatcherArg = getFirstMatcherArg;
const isInstanceOfBinaryExpression = (node, className) => node.type === _utils.AST_NODE_TYPES.BinaryExpression && node.operator === 'instanceof' && (0, _accessors.isSupportedAccessor)(node.right, className);
exports.isInstanceOfBinaryExpression = isInstanceOfBinaryExpression;
const isParsedInstanceOfMatcherCall = (expectFnCall, classArg) => {
  return (0, _accessors.getAccessorValue)(expectFnCall.matcher) === 'toBeInstanceOf' && expectFnCall.args.length === 1 && (0, _accessors.isSupportedAccessor)(expectFnCall.args[0], classArg);
};

/**
 * Checks if the given `ParsedExpectMatcher` is either a call to one of the equality matchers,
 * with a boolean` literal as the sole argument, *or* is a call to `toBeTrue` or `toBeFalse`.
 */
exports.isParsedInstanceOfMatcherCall = isParsedInstanceOfMatcherCall;
const isBooleanEqualityMatcher = expectFnCall => {
  const matcherName = (0, _accessors.getAccessorValue)(expectFnCall.matcher);
  if (['toBeTrue', 'toBeFalse'].includes(matcherName)) {
    return true;
  }
  if (expectFnCall.args.length !== 1) {
    return false;
  }
  const arg = getFirstMatcherArg(expectFnCall);
  return EqualityMatcher.hasOwnProperty(matcherName) && isBooleanLiteral(arg);
};
exports.isBooleanEqualityMatcher = isBooleanEqualityMatcher;