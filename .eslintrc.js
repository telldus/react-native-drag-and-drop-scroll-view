module.exports = {
	'root': true,
	'parser': 'babel-eslint',

	'env': {
		'es6': true,
		'jasmine': true,
	},

	'plugins': [
		'flowtype',
		'react',
		'react-hooks',
	],

	'settings': {
		'flowtype': {
			'onlyFilesWithFlowAnnotation': true,
		},
	},

	// Map from global var to bool specifying if it can be redefined
	'globals': {
		'__BUNDLE_START_TIME__': false,
		'__DEV__': true,
		'__dirname': false,
		'__filename': false,
		'__fbBatchedBridgeConfig': false,
		'alert': false,
		'cancelAnimationFrame': false,
		'clearImmediate': true,
		'clearInterval': false,
		'clearTimeout': false,
		'console': false,
		'document': false,
		'escape': false,
		'exports': false,
		'fetch': false,
		'global': false,
		'jest': false,
		'pit': false,
		'Map': true,
		'module': false,
		'navigator': false,
		'process': false,
		'Promise': false,
		'requestAnimationFrame': true,
		'require': false,
		'Set': true,
		'setImmediate': true,
		'setInterval': false,
		'setTimeout': false,
		'window': false,
		'FormData': true,
		'WebSocket': false,
		'XMLHttpRequest': false,

		// Flow "known-globals" annotations:
		'ReactElement': false,
		'ReactClass': false,
		'Class': false,
	},

	'rules': {
		'comma-dangle': [2, 'always-multiline'], // disallow trailing commas in object literals
		'no-cond-assign': 1, // disallow assignment in conditional expressions
		'no-console': 0, // disallow use of console (off by default in the node environment)
		'no-constant-condition': 0, // disallow use of constant expressions in conditions
		'no-control-regex': 1, // disallow control characters in regular expressions
		'no-debugger': 1, // disallow use of debugger
		'no-dupe-keys': 2, // disallow duplicate keys when creating object literals
		'no-empty': 2, // disallow empty statements
		'no-empty-character-class': 1, // disallow the use of empty character classes in regular expressions
		'no-ex-assign': 1, // disallow assigning to the exception in a catch block
		'no-extra-boolean-cast': 1, // disallow double-negation boolean casts in a boolean context
		'no-extra-parens': 0, // disallow unnecessary parentheses (off by default)
		'no-extra-semi': 1, // disallow unnecessary semicolons
		'no-func-assign': 0, // disallow overwriting functions written as function declarations
		'no-inner-declarations': 0, // disallow function or variable declarations in nested blocks
		'no-invalid-regexp': 1, // disallow invalid regular expression strings in the RegExp constructor
		'no-negated-in-lhs': 1, // disallow negation of the left operand of an in expression
		'no-obj-calls': 1, // disallow the use of object properties of the global object (Math and JSON) as functions
		'no-regex-spaces': 1, // disallow multiple spaces in a regular expression literal
		'no-reserved-keys': 0, // disallow reserved words being used as object literal keys (off by default)
		'no-sparse-arrays': 1, // disallow sparse arrays
		'no-unreachable': 2, // disallow unreachable statements after a return, throw, continue, or break statement
		'use-isnan': 1, // disallow comparisons with the value NaN
		'valid-jsdoc': 0, // Ensure JSDoc comments are valid (off by default)
		'valid-typeof': 1, // Ensure that the results of typeof are compared against a valid string

		// Best Practices
		// These are rules designed to prevent you from making mistakes. They either prescribe a better way of doing something or help you avoid footguns.

		'block-scoped-var': 0, // treat var statements as if they were block scoped (off by default)
		'complexity': 0, // specify the maximum cyclomatic complexity allowed in a program (off by default)
		'consistent-return': 0, // require return statements to either always or never specify values
		'curly': 2, // specify curly brace conventions for all control statements
		'default-case': 2, // require default case in switch statements (off by default)
		'dot-notation': 1, // encourages use of dot notation whenever possible
		'eqeqeq': 2, // require the use of === and !==
		'guard-for-in': 0, // make sure for-in loops have an if statement (off by default)
		'no-alert': 2, // disallow the use of alert, confirm, and prompt
		'no-caller': 1, // disallow use of arguments.caller or arguments.callee
		'no-div-regex': 1, // disallow division operators explicitly at beginning of regular expression (off by default)
		'no-else-return': 2, // disallow else after a return in an if (off by default)
		'no-eq-null': 0, // disallow comparisons to null without a type-checking operator (off by default)
		'no-eval': 1, // disallow use of eval()
		'no-extend-native': 1, // disallow adding to native types
		'no-extra-bind': 1, // disallow unnecessary function binding
		'no-fallthrough': 1, // disallow fallthrough of case statements
		'no-floating-decimal': 1, // disallow the use of leading or trailing decimal points in numeric literals (off by default)
		'no-implied-eval': 1, // disallow use of eval()-like methods
		'no-labels': 1, // disallow use of labeled statements
		'no-iterator': 1, // disallow usage of __iterator__ property
		'no-lone-blocks': 1, // disallow unnecessary nested blocks
		'no-loop-func': 0, // disallow creation of functions within loops
		'no-multi-str': 0, // disallow use of multiline strings
		'no-native-reassign': 0, // disallow reassignments of native objects
		'no-new': 1, // disallow use of new operator when not part of the assignment or comparison
		'no-new-func': 1, // disallow use of new operator for Function object
		'no-new-wrappers': 1, // disallows creating new instances of String,Number, and Boolean
		'no-octal': 1, // disallow use of octal literals
		'no-octal-escape': 1, // disallow use of octal escape sequences in string literals, such as var foo = "Copyright \251";
		'no-proto': 1, // disallow usage of __proto__ property
		'no-redeclare': 0, // disallow declaring the same variable more then once
		'no-return-assign': 1, // disallow use of assignment in return statement
		'no-script-url': 1, // disallow use of javascript: urls.
		'no-self-compare': 1, // disallow comparisons where both sides are exactly the same (off by default)
		'no-sequences': 1, // disallow use of comma operator
		'no-unused-expressions': [2, {
			'allowShortCircuit': true,
			'allowTernary': true,
		}], // disallow usage of expressions in statement position
		'no-void': 1, // disallow use of void operator (off by default)
		'no-warning-comments': 0, // disallow usage of configurable warning terms in comments": 1,                        // e.g. TODO or FIXME (off by default)
		'no-with': 1, // disallow use of the with statement
		'prefer-arrow-callback': ['error', {
			'allowNamedFunctions': true,
			'allowUnboundThis': false,
		}],
		'prefer-template': 2, // Suggest using template literals instead of string concatenation.
		'radix': 1, // require use of the second argument for parseInt() (off by default)
		'semi-spacing': 1, // require a space after a semi-colon
		'vars-on-top': 0, // requires to declare all vars on top of their containing scope (off by default)
		'wrap-iife': 2, // require immediate function invocation to be wrapped in parentheses (off by default)
		'yoda': 1, // require or disallow Yoda conditions

		// Strict Mode
		// These rules relate to using strict mode.

		// "strict": [2, "global"],         // require or disallow the "use strict" pragma in the global scope (off by default in the node environment)

		// Variables
		// These rules have to do with variable declarations.

		'no-catch-shadow': 1, // disallow the catch clause parameter name being the same as a variable in the outer scope (off by default in the node environment)
		'no-delete-var': 1, // disallow deletion of variables
		'no-label-var': 1, // disallow labels that share a name with a variable
		'no-shadow': [2, {
			'allow': ['err'],
		}], // disallow declaration of variables already declared in the outer scope
		'no-shadow-restricted-names': 1, // disallow shadowing of names such as arguments
		'no-undef': 2, // disallow use of undeclared variables unless mentioned in a /*global */ block.
		'no-undefined': 0, // disallow use of undefined variable (off by default)
		'no-undef-init': 1, // disallow use of undefined when initializing variables
		'no-unused-vars': [1, {
			'vars': 'all',
			'args': 'none',
		}], // disallow declaration of variables that are not used in the code
		'no-use-before-define': 0, // disallow use of variables before they are defined
		'no-var': 1, // disallow use of variables before they are defined

		// Node.js
		// These rules are specific to JavaScript running on Node.js.

		'handle-callback-err': 1, // enforces error handling in callbacks (off by default) (on by default in the node environment)
		'indent': ['error', 'tab', {
			'SwitchCase': 1,
		}], // enforce consistent indentation
		'no-mixed-requires': 1, // disallow mixing regular variable and require declarations (off by default) (on by default in the node environment)
		'no-new-require': 1, // disallow use of new operator with the require function (off by default) (on by default in the node environment)
		'no-path-concat': 1, // disallow string concatenation with __dirname and __filename (off by default) (on by default in the node environment)
		'no-process-exit': 0, // disallow process.exit() (on by default in the node environment)
		'no-restricted-modules': 1, // restrict usage of specified node modules (off by default)
		'no-sync': 0, // disallow use of synchronous methods (off by default)

		// Stylistic Issues
		// These rules are purely matters of style and are quite subjective.

		'key-spacing': ['error', {
			'beforeColon': false,
			'afterColon': true,
		}], // enforce consistent spacing between keys and values in object literal properties
		'comma-spacing': ['error', {
			'before': false,
			'after': true,
		}], // Spacing around commas improve readability of a list of items.
		'no-multi-spaces': 2, // Multiple spaces in a row that are not used for indentation are typically mistakes
		'brace-style': [1, '1tbs'], // enforce one true brace style (off by default)
		'camelcase': 0, // require camel case names
		'consistent-this': 1, // enforces consistent naming when capturing the current execution context (off by default)
		'eol-last': 1, // enforce newline at the end of file, with no multiple empty lines
		'func-names': 0, // require function expressions to have a name (off by default)
		'func-style': 0, // enforces use of function declarations or expressions (off by default)
		'max-nested-callbacks': 0, // specify the maximum depth callbacks can be nested (off by default)
		'new-cap': 0, // require a capital letter for constructors
		'new-parens': 1, // disallow the omission of parentheses when invoking a constructor with no arguments
		'no-nested-ternary': 0, // disallow nested ternary expressions (off by default)
		'no-array-constructor': 1, // disallow use of the Array constructor
		'no-lonely-if': 1, // disallow if as the only statement in an else block (off by default)
		'no-new-object': 2, // disallow use of the Object constructor
		'no-spaced-func': 1, // disallow space between function identifier and application
		'no-ternary': 0, // disallow the use of ternary operators (off by default)
		'no-trailing-spaces': 1, // disallow trailing whitespace at the end of lines
		'no-underscore-dangle': 0, // disallow dangling underscores in identifiers
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'], // disallow mixed spaces and tabs for indentation
		'quotes': [1, 'single', 'avoid-escape'], // specify whether double or single quotes should be used
		'quote-props': 0, // require quotes around object literal property names (off by default)
		'semi': 2, // require or disallow use of semicolons instead of ASI
		'sort-vars': 0, // sort variables within the same declaration block (off by default)
		'space-before-function-paren': [
			'warn', {
				'anonymous': 'always',
				'named': 'never',
			}], // Require or disallow a space before function parenthesis
		'keyword-spacing': ['error', {
			'before': true,
			'after': true,
		}], // require a space after certain keywords (off by default)
		'space-before-blocks': 2, // Require Or Disallow Space Before Blocks
		'space-in-brackets': 0, // require or disallow spaces inside brackets (off by default)
		'space-in-parens': 0, // require or disallow spaces inside parentheses (off by default)
		'space-infix-ops': 2, // require spaces around operators
		'space-unary-ops': [1, {
			'words': true,
			'nonwords': false,
		}], // require or disallow spaces before/after unary operators (words on by default, nonwords off by default)
		'spaced-comment': ['error', 'always', {
			'block': {
				'balanced': true,
			},
		}], // requires or disallows a whitespace (space or tab) beginning a comment
		'template-curly-spacing': 2, // Enforce Usage of Spacing in Template Strings
		'one-var': 0, // allow just one var statement per function (off by default)
		'wrap-regex': 0, // require regex literals to be wrapped in parentheses (off by default)

		// Legacy
		// The following rules are included for compatibility with JSHint and JSLint. While the names of the rules may not match up with the JSHint/JSLint counterpart, the functionality is the same.

		'max-depth': 0, // specify the maximum depth that blocks can be nested (off by default)
		'max-len': 0, // specify the maximum length of a line in your program (off by default)
		'max-params': 0, // limits the number of parameters that can be used in the function declaration. (off by default)
		'max-statements': 0, // specify the maximum number of statement allowed in a function (off by default)
		'no-bitwise': 1, // disallow use of bitwise operators (off by default)
		'no-plusplus': 0, // disallow use of unary operators, ++ and -- (off by default)

		// React, React Native and JSX
		'react/display-name': 0,
		'react/jsx-boolean-value': 0,
		'react/jsx-curly-spacing': [2, 'never'],
		'jsx-quotes': [1, 'prefer-double'],
		'react/jsx-sort-props': 0,
		'react/jsx-uses-react': 1,
		'react/jsx-uses-vars': 1,
		'react/jsx-no-duplicate-props': 2,
		'react/no-multi-comp': 0,
		'react/no-unknown-property': 0,
		'react/prop-types': 0,
		'react/react-in-jsx-scope': 0,
		'react/self-closing-comp': 1,
		'react/wrap-multilines': 0,
		'react/jsx-no-undef': 2,
		'react/jsx-no-bind': 2,

		// Flow
		'flowtype/boolean-style': [
	  2,
	  'boolean',
		],
		'flowtype/define-flow-type': 1,
		'flowtype/delimiter-dangle': [
	  2,
	  'always-multiline',
		],
		'flowtype/generic-spacing': [
	  2,
	  'never',
		],
		'flowtype/no-primitive-constructor-types': 2,
		'flowtype/no-types-missing-file-annotation': 2,
		'flowtype/no-weak-types': 0,
		'flowtype/object-type-delimiter': [
	  2,
	  'comma',
		],
		'flowtype/require-parameter-type': 2,
		'flowtype/require-return-type': [
	  1,
	  'always',
	  {
		  'annotateUndefined': 'never',
	  },
		],
		'flowtype/require-valid-file-annotation': 2,
		'flowtype/semi': [
	  2,
	  'always',
		],
		'flowtype/space-after-type-colon': [
	  2,
	  'always',
		],
		'flowtype/space-before-generic-bracket': [
	  2,
	  'never',
		],
		'flowtype/space-before-type-colon': [
	  2,
	  'never',
		],
		'flowtype/type-id-match': [
	  0,
	  '^([A-Z][a-z0-9]+)+Type$',
		],
		'flowtype/union-intersection-spacing': [
	  2,
	  'always',
		],
		'flowtype/use-flow-type': 1,
		'flowtype/valid-syntax': 1,

		// React Hooks
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',

	},
};

