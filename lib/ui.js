import { render } from './transform';
import invariant from './utils/invariant';


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
export function createWindow(UI, title, type, dimensions = undefined, options) {
	invariant(UI && title && type, 'UI object, title and type arguments are required to create a window.');
	invariant(
		type === 'dialog' || type === 'palette',
		`Invalid UI type "${type}" specified. Supported types are "dialog" and "palette"`,
	);

	// "ctx" will be injected into global scope at build time
	// eslint-disable-next-line no-undef
	const panel = ctx instanceof Panel ? ctx : new Window(type, title, dimensions, options);

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
export function showWindow(win) {
	// Fuck knows what this does, I couldn't find any
	// proper docs on this and some people don't use it at all,
	// but dockable UI renders empty without doing this
	win.layout.layout(true);

	if (win instanceof Window) {
		win.center();
		win.show();
	} else {
		console.log('Window object is not an instance of a Window class. Skipping showing');
	}
}
