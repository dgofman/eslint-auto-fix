import React from 'react';

// lintfix/no-unused-imports
// ... not found in '...' - import/named
// '...' is defined but never used. - @typescript-eslint/no-unused-vars
// REMOVE NEXT LINE
import { readFileSync, writeFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';// remove writeFile
readFile('demo.ts', 'utf8');

// 'lintfix/no-unused-vars': 'error',
// '@typescript-eslint/no-unused-vars': 'warn', // is defined but never used
const unused = 'HelloWorld';

// 'lintfix/maxlen': ['error', { code: 200 }],
// 'max-len': ['warn', { code: 200 }], // This line has a length of xxx. Maximum allowed is 200.
export const maxLen = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' + 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ';
// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.*/
/*******************************************************************************************************************************************************************************************************/

// 'lintfix/console': 'error',
// 'no-console': ['error', { allow: ['error', 'warn', 'debug'] }],
console.trace('Test console trace');
console.debug('Test console debug');
console.log('Test console log');
console.info('Test console info');
console.warn('Test console warn');
console.error('Test console error');

// lintfix/boundary-types
// '@typescript-eslint/explicit-module-boundary-types': 'warn', // Argument '...' should be typed with a non-any type
export function funcArgs(_a: string, _b1: () => {}, c: () => true) {
  return 'Hello World!';
}
export const funcObject = function () {
  return { hello: 'Hello', hello1: 'World' };
};
export const funcEmptyArray = function () {
  return [];
};
export const funcAsyncEmptyArray = async function () {
  return [];
};
export const funcMix = function () {
  return [true, 1, 'Hello World!', [1, 2]];
};
export const arrowSpread = () => {
  return { a: 1, b: 3, c: { ...[1, 2] } };
};
export const arrowNumber = () => 1;
export const arrowAsync = () => async () => true;
export const arrowEmptyArray = () => () => [];
export const arrowArray = () => () => [1, 2];
export const arrowEmptyObject = () => () => { };
export const arrowMix = () => { 1; { [1, 2]; } JSON.parse('{}'); };
export const arrowObject = () => JSON.parse('{}');
export const arrowInstance = () => React.createRef();

// lintfix/implicit-any
export const implicitAny = (_a, b, c) => {
  b: 1;
  c: 'Hello World!';
};

// lintfix/prefer-const
// 'preferConst' is never reassigned. Use 'const' instead. - prefer-const
var _varToconst = true;
const _letToconst = true; // replace: const
let { _a, _b } = { _a: 1, _b: 2 }; // Manual fix required

// lintfix/ts-ignore
export const tsExpectError = {
  a: 1,
  // Include a description after the "@ts-expect-error" directive to explain why the @ts-expect-error is necessary. 
  // The description must be 3 characters or longer  @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  a: 1 // An object literal cannot have multiple properties with the same name.
};

// lintfix/ts-ignore
export const tsIgnore = {
  a: 1,
  // Do not use "@ts-ignore" because it alters compilation errors  @typescript-eslint/ban-ts-comment
  // @ts-ignore
  a: 1 // An object literal cannot have multiple properties with the same name.
};

// lintfix/eqeqeq
export const eqeqeq = () => {
  const a = 0, b = 0;
  if (a == b || a != b || a === b || a !== b) {
    console.log('a == b', 'a != b');
  }
};

// TODO

// '@typescript-eslint/ban-types': 'warn'
// Don't use `object` as a type. The `object` type is currently hard to use 
export const dontUseObject = <T extends object>(): boolean => true;

// '@typescript-eslint/no-empty-function': 'warn', 
// Unexpected empty arrow function
export const emptyArrowFunction = (): void => { };

// '@typescript-eslint/ban-types': 'warn'
// Don't use `{}` as a type. `{}` actually means "any non-nullish value".
export const nonNullish = (_e: React.ChangeEvent<{}>): boolean => true;

// '@typescript-eslint/ban-types': 'warn'
// Don't use `Function` as a type. The `Function` type accepts any function-like value.
export const functionLike = (_e: Function): boolean => true;

// '@typescript-eslint/no-empty-interface': 'warn'
// An empty interface is equivalent to `{}`
export interface EmptyInterface { }

// '@typescript-eslint/no-non-null-assertion: 'warn'
// '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn'
// Forbidden non-null assertion - @typescript-eslint/no-non-null-assertion
// Optional chain expressions can return undefined by design - using a non-null assertion is unsafe and wrong
export const notNullChain = JSON.parse('{}')?.todo!;