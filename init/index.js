import { Group, Text, UI } from 'afterscript';

const ScriptUI = (
	<Group>
		<Text>
			Welcome to AfterScript!
		</Text>
	</Group>
);

const win = UI.createWindow(ScriptUI, 'My AfterScript', 'palette');
UI.showWindow(win);
