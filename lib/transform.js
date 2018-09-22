import invariant from './utils/invariant';

const scriptPath = Folder.current.absoluteURI; // eslint-disable-line no-undef
const scriptName = '__SCRIPTNAME__'; // To be replaced at build time

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
		invariant(
			(vnode.name !== 'group') ||
			(vnode.name !== 'panel') ||
			(vnode.name !== 'statictext') ||
			(vnode.name !== 'listbox') ||
			(vnode.name !== 'dropdownlist') ||
			(vnode.name !== 'treeview') ||
			(vnode.name !== 'node'),
			'Unexpected child node passed to %s',
			vnode.name
		);
	}

	let node;

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
		invariant(
			vnode.children[0] || vnode.children.length === 1 || typeof vnode.children[0] === 'string',
			"Invalid children supplied to '<Text>'. Text string expected.",
		);

		node = parent.add(vnode.name, props.dimensions, vnode.children[0]);
		break;
	case 'button':
	case 'checkbox':
	case 'radiobutton':
		invariant(props.title, `${vnode.name} requires "title" prop`);

		node = parent.add(vnode.name, props.dimensions, props.title);
		break;
	case 'scrollbar':
		node = parent.add(vnode.name, props.dimensions, props.title);
		break;
	case 'dropdownlist':
		// Ensure that "items" is present on the dropdown
		invariant(props.items && props.items.length > 0, 'Dropdown lists must not be empty');
		props.items.forEach((item) => invariant(typeof item === 'string', 'Dropdown items must be strings'));

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
		node = parent.add(vnode.name, props.dimensions, `${scriptPath}/${scriptName}Data/${props.path}`);
		break;
	case 'iconbutton':
		node = parent.add(vnode.name, props.dimensions, `${scriptPath}/${scriptName}Data/${props.icon}`, props.title);
		break;
	case 'edittext':
		node = parent.add(vnode.name, props.dimensions, props.value || '');
		break;
	case 'tabbedpanel':
		node = parent.add(vnode.name, props.dimensions, props.title);
		break;
	case 'tab':
		// Prevent nameless tabs
		invariant(props.title, 'Tab must have a name');
		node = parent.add(vnode.name, props.dimensions, props.title);
		break;
	case 'listbox':
		invariant(props.title, 'List box requires a "title" prop');
		// TODO Find a nice way to handle listbox config
		// For now if you want column titles, etc., you should configure the list box post-render via a ref

		node = parent.add(vnode.name, props.dimensions, props.title, /* skipping props.items since they're added via children automatically */);
		break;
	case 'item':
		// Prevent this from being rendered where it's not supposed to be rendered
		invariant(
			parent.vnode.name === 'treeview' ||
			parent.vnode.name === 'node' ||
			parent.vnode.name === 'listbox',
			'ListItem can only be a child of ListBox, TreeView or TreeNode',
		);
		invariant(props.title, 'ListItem requires a "title" prop');

		node = parent.add(vnode.name, props.title);
		break;
	case 'treeview':
		node = parent.add(vnode.name, props.dimensions, props.items, props.title);
		break;
	case 'node':
		// Prevent this from being rendered where it's not supposed to be rendered
		invariant(
			parent.vnode.name === 'treeview' ||
			parent.vnode.name === 'node' ||
			parent.vnode.name === 'listbox',
			'TreeItem can only be a child of TreeView or another TreeItem',
		);
		invariant(props.title, 'TreeNode requires a "title" prop');

		node = parent.add(vnode.name, props.title);
		break;
	default:
		// Throw when encountering an element that we don't know about
		throw new Error(`Unknown UI element "${vnode.name}"`);
	}

	// If there's a ref specified, call it
	if (props.ref) {
		invariant(typeof props.ref === 'function', 'Element refs must be functions');
		props.ref(node);
	}

	// Map "onClick" to onClick for buttons and event listeners for everything else
	if (props.onClick) {
		invariant(typeof props.onClick === 'function', `onClick prop of ${vnode.name} must be a function`);
		if (vnode.name !== 'button') {
			node.addEventListener('click', props.onClick);
		}
	}

	// Store VNode information on the object for reference
	node.vnode = vnode;

	return node;
}

export function render(vnode, parent) {
	// Support custom JSX components
	// Yes, calling vnode.name as a function is stupid but it's too late to rename it at this point
	if (typeof vnode.name === 'function') {
		return render(vnode.name(vnode.props), parent);
	}

	// Pass the children of the Fragment element through
	if (vnode.name === 'Fragment') {
		vnode.children.forEach((child) => render(child, parent));
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
	const node = createNode(vnode, parent, vnode.props || {});

	// Clean up props and pass them through to the UI node
	const attrs = vnode.props || {};
	delete attrs.dimensions;
	delete attrs.horizontal;
	Object.keys(attrs).forEach((key) => node[key] = attrs.key);

	// Render (build) and append child nodes:
	(vnode.children || []).forEach((c) => render(c, node));

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
export default function h(name, props, ...args) {
	const children = args.length > 0 ? [].concat(...args) : null;
	return { name, props, children };
}
