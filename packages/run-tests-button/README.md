# Theia - Run Tests Button

## Description

The `@theia/run-tests-button` extension adds a "Run Tests" button to the main menu bar in Theia.

This button:
- Appears as a green button in the menu bar (8th position, before the "Browser" button)
- Executes a command to run tests when clicked
- Can be configured to invoke any VSCode extension command for running tests

## Usage

The button is automatically added to the menu bar when the extension is loaded. By default, it attempts to execute the command `your-extension.runTests`. 

To customize the command that gets executed, edit `src/browser/menu-contribution.ts` and change the command ID in the `RunTestsCommand` execute function:

```typescript
commands.executeCommand('your-extension.runTests');
```

Replace `'your-extension.runTests'` with the actual command ID from your test extension.

## Styling

The button styling (green color, rounded corners, hover effects) is provided by the `@theia/revature` package's CSS.

## License

- [Eclipse Public License 2.0](http://www.eclipse.org/legal/epl-2.0/)
- [一 (Secondary) GNU General Public License, version 2 with the GNU Classpath Exception](https://projects.eclipse.org/license/secondary-gpl-2.0-cp)

