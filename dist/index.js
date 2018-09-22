// Slightly modified Facebook's Invariant

var validateFormat = function validateFormat(format) {
  if (format === undefined) {
    throw new Error('invariant(...): Second argument must be a string.');
  }
};

function invariant(condition, format) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  validateFormat(format);

  if (!condition) {
    var error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return String(args[argIndex++]);
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // Skip invariant's own stack frame.

    throw error;
  }
}

var invariant_1 = invariant;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _forEach = function _forEach(array, callback) {
	for (var i = 0; i < array.length; i++) {
		callback(array[i], i, array);
	}
};

var _objectKeys = function _objectKeys(obj) {
	var hasOwnProperty = Object.prototype.hasOwnProperty,
	    hasDontEnumBug = !{
		toString: null
	}.propertyIsEnumerable('toString'),
	    dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
	    dontEnumsLength = dontEnums.length;

	if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && (typeof obj !== 'function' || obj === null)) {
		throw new TypeError('Object.keys called on non-object');
	}

	var result = [],
	    prop,
	    i;

	for (prop in obj) {
		if (hasOwnProperty.call(obj, prop)) {
			result.push(prop);
		}
	}

	if (hasDontEnumBug) {
		for (i = 0; i < dontEnumsLength; i++) {
			if (hasOwnProperty.call(obj, dontEnums[i])) {
				result.push(dontEnums[i]);
			}
		}
	}

	return result;
};

var scriptPath = Folder.current.absoluteURI; // eslint-disable-line no-undef
var scriptName = '__SCRIPTNAME__'; // To be replaced at build time

/**
 * Create a UI node from a VDOM node
 *
 * @param {VNode} vnode - VDOM node to create a UI element from
 * @param {object} parent - Parent to append to
 * @param {object} props - Node props
 * @returns
 */
function createNode(vnode, parent, props) {
	// Prevent unexpected children
	if (vnode && vnode.children && vnode.children.length > 0) {
		invariant_1(vnode.name !== 'group' || vnode.name !== 'panel' || vnode.name !== 'statictext' || vnode.name !== 'listbox' || vnode.name !== 'dropdownlist' || vnode.name !== 'treeview' || vnode.name !== 'node', 'Unexpected child node passed to %s', vnode.name);
	}

	var node = void 0;

	// Create a UI element with the name of our VDOM node:
	switch (vnode.name) {
		case 'group':
			node = parent.add(vnode.name, props.dimensions, props.title);
			// We orient groups vertically by default
			if (!props.horizontal) {
				node.orientation = 'vertical';
			}

			break;
		case 'panel':
			node = parent.add(vnode.name, props.dimensions, props.title);
			if (props.horizontal) {
				node.orientation = 'horizontal';
			}

			break;
		case 'statictext':
			// Prevent unexpected children
			invariant_1(vnode.children[0] || vnode.children.length === 1 || typeof vnode.children[0] === 'string', "Invalid children supplied to '<Text>'. Text string expected.");

			node = parent.add(vnode.name, props.dimensions, vnode.children[0]);
			break;
		case 'button':
		case 'checkbox':
		case 'radiobutton':
			invariant_1(props.title, vnode.name + ' requires "title" prop');

			node = parent.add(vnode.name, props.dimensions, props.title);
			break;
		case 'scrollbar':
			node = parent.add(vnode.name, props.dimensions, props.title);
			break;
		case 'dropdownlist':
			// Ensure that "items" is present on the dropdown
			invariant_1(props.items && props.items.length > 0, 'Dropdown lists must not be empty');
			_forEach(props.items, function (item) {
				return invariant_1(typeof item === 'string', 'Dropdown items must be strings');
			});

			node = parent.add(vnode.name, props.dimensions, props.items);
			node.selection = 0; // There's no nice way to do this when using children, so dropdown is populated via props.items
			break;
		case 'progressbar':
		case 'slider':
			node = parent.add(vnode.name, props.dimensions, props.title);
			if (props.value) {
				node.value = props.value;
			}
			break;
		case 'image':
			node = parent.add(vnode.name, props.dimensions, scriptPath + '/' + scriptName + 'Data/' + props.path);
			break;
		case 'iconbutton':
			node = parent.add(vnode.name, props.dimensions, scriptPath + '/' + scriptName + 'Data/' + props.icon, props.title);
			break;
		case 'edittext':
			node = parent.add(vnode.name, props.dimensions, props.value || '');
			break;
		case 'tabbedpanel':
			node = parent.add(vnode.name, props.dimensions, props.title);
			break;
		case 'tab':
			// Prevent nameless tabs
			invariant_1(props.title, 'Tab must have a name');
			node = parent.add(vnode.name, props.dimensions, props.title);
			break;
		case 'listbox':
			invariant_1(props.title, 'List box requires a "title" prop');
			// TODO Find a nice way to handle listbox config
			// For now if you want column titles, etc., you should configure the list box post-render via a ref

			node = parent.add(vnode.name, props.dimensions, props.title /* skipping props.items since they're added via children automatically */);
			break;
		case 'item':
			// Prevent this from being rendered where it's not supposed to be rendered
			invariant_1(parent.vnode.name === 'treeview' || parent.vnode.name === 'node' || parent.vnode.name === 'listbox', 'ListItem can only be a child of ListBox, TreeView or TreeNode');
			invariant_1(props.title, 'ListItem requires a "title" prop');

			node = parent.add(vnode.name, props.title);
			break;
		case 'treeview':
			node = parent.add(vnode.name, props.dimensions, props.items, props.title);
			break;
		case 'node':
			// Prevent this from being rendered where it's not supposed to be rendered
			invariant_1(parent.vnode.name === 'treeview' || parent.vnode.name === 'node' || parent.vnode.name === 'listbox', 'TreeItem can only be a child of TreeView or another TreeItem');
			invariant_1(props.title, 'TreeNode requires a "title" prop');

			node = parent.add(vnode.name, props.title);
			break;
		default:
			// Throw when encountering an element that we don't know about
			throw new Error('Unknown UI element "' + vnode.name + '"');
	}

	// If there's a ref specified, call it
	if (props.ref) {
		invariant_1(typeof props.ref === 'function', 'Element refs must be functions');
		props.ref(node);
	}

	// Map "onClick" to onClick for buttons and event listeners for everything else
	if (props.onClick) {
		invariant_1(typeof props.onClick === 'function', 'onClick prop of ' + vnode.name + ' must be a function');
		if (vnode.name !== 'button') {
			node.addEventListener('click', props.onClick);
		}
	}

	// Store VNode information on the object for reference
	node.vnode = vnode;

	return node;
}

function render(vnode, parent) {
	// Support custom JSX components
	// Yes, calling vnode.name as a function is stupid but it's too late to rename it at this point
	if (typeof vnode.name === 'function') {
		return render(vnode.name(vnode.props), parent);
	}

	// Pass the children of the Fragment element through
	if (vnode.name === 'Fragment') {
		_forEach(vnode.children, function (child) {
			return render(child, parent);
		});
		return;
	}

	// At this point we don't expect the name to be anything but the string
	if (typeof vnode.name !== 'string') {
		return;
	}

	// Don't render string children directly
	if (vnode.split) {
		return;
	}

	// Extract props and create the UI node from VDOM
	var node = createNode(vnode, parent, vnode.props || {});

	// Clean up props and pass them through to the UI node
	var attrs = vnode.props || {};
	delete attrs.dimensions;
	delete attrs.horizontal;
	_forEach(_objectKeys(attrs), function (key) {
		return node[key] = attrs.key;
	});

	// Render (build) and append child nodes:
	_forEach(vnode.children || [], function (c) {
		return render(c, node);
	});

	return node;
}

/**
 * JSX Transform pragma
 *
 * @export
 * @param {string|Function} name - Node name
 * @param {object} props = Props
 * @param {array} args - Children
 * @returns
 */
function h(name, props) {
	var _ref;

	for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		args[_key - 2] = arguments[_key];
	}

	var children = args.length > 0 ? (_ref = []).concat.apply(_ref, args) : null;
	return { name: name, props: props, children: children };
}

var _consoleLog = function _consoleLog() {
	for (var i = 0; i < arguments.length; ++i) {
		$.write(arguments[i]);
		$.write(' ');
	}

	$.writeln();
};

/**
 * Create a window or return a dockable panel if this is what we're running in
 *
 * @export
 * @param {any} UI - JSX UI object
 * @param {string} title - Window title
 * @param {"dialog" | "palette"} type - Window type
 * @param {array} dimensions - Window dimensions
 * @param {object} options - Additional window options
 * @returns
 */
function createWindow(UI, title, type) {
	var dimensions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
	var options = arguments[4];

	invariant_1(UI && title && type, 'UI object, title and type arguments are required to create a window.');
	invariant_1(type === 'dialog' || type === 'palette', 'Invalid UI type "' + type + '" specified. Supported types are "dialog" and "palette"');

	// "ctx" will be injected into global scope at build time
	// eslint-disable-next-line no-undef
	var panel = ctx instanceof Panel ? ctx : new Window(type, title, dimensions, options);

	// Render the UI into the window
	render(UI, panel);

	return panel;
}

/**
 * Draw layout and show the window
 *
 * @export
 * @param {Window} win - Window to show
 */
function showWindow(win) {
	// Fuck knows what this does, I couldn't find any
	// proper docs on this and some people don't use it at all,
	// but dockable UI renders empty without doing this
	win.layout.layout(true);

	if (win instanceof Window) {
		win.center();
		win.show();
	} else {
		_consoleLog('Window object is not an instance of a Window class. Skipping showing');
	}
}

var ui = /*#__PURE__*/Object.freeze({
  createWindow: createWindow,
  showWindow: showWindow
});

var Group = 'group';
var Panel$1 = 'panel';
var Text = 'statictext';
var StaticText = Text; // Alias
var Button = 'button';
var IconButton = 'iconbutton';
var Checkbox = 'checkbox';
var RadioButton = 'radiobutton';
var Dropdown = 'dropdownlist';
var Progress = 'progressbar';
var ProgressBar = Progress; // Alias
var Image = 'image';
var Input = 'edittext';
var EditText = Input; // Alias
var Slider = 'slider';
var Scrollbar = 'scrollbar';
var Tabs = 'tabbedpanel';
var TabbedPanel = Tabs; // Alias
var Tab = 'tab';
var ListBox = 'listbox';
var TreeView = 'treeview';
var TreeNode = 'node';
var ListItem = 'item';

/** *** Service components *** **/
var Fragment = 'Fragment';

export { ui as UI, h, Group, Panel$1 as Panel, Text, StaticText, Button, IconButton, Checkbox, RadioButton, Dropdown, Progress, ProgressBar, Image, Input, EditText, Slider, Scrollbar, Tabs, TabbedPanel, Tab, ListBox, TreeView, TreeNode, ListItem, Fragment };
