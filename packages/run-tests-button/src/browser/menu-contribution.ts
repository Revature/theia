// *****************************************************************************
// Copyright (C) 2024 and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

import {
    Command, CommandContribution, CommandRegistry, MAIN_MENU_BAR,
    MenuContribution, MenuModelRegistry, MessageService
} from '@theia/core/lib/common';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';

const RunTestsCommand: Command = {
    id: 'run-tests-button',
    label: 'Run all tests'
};

@injectable()
export class RunTestsMenuCommandContribution implements CommandContribution {

    @inject(MessageService)
    protected readonly messageService: MessageService;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(RunTestsCommand, {
            execute: () => {
                // Execute a VSCode extension command for running tests
                // Replace 'your-extension.runTests' with the actual command from your test extension
                commands.executeCommand('your-extension.runTests');
            }
        });
    }
}

@injectable()
export class RunTestsMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        setTimeout(() => {
            const subMenuPath = [...MAIN_MENU_BAR, 'RunTestsMenu'];
            menus.registerSubmenu(subMenuPath, 'Run Tests', {
                order: 'zzx' // Order it right before 'Browser' (which is 'zzy')
            });
            menus.registerMenuAction(subMenuPath, {
                commandId: RunTestsCommand.id,
                order: '0'
            });
        }, 10000);
    }
}

export const bindRunTestsMenu = (bind: interfaces.Bind) => {
    bind(CommandContribution).to(RunTestsMenuCommandContribution).inSingletonScope();
    bind(MenuContribution).to(RunTestsMenuContribution).inSingletonScope();
};

