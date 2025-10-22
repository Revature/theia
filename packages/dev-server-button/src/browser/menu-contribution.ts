// *****************************************************************************
// Copyright (C) 2020 TORO Limited and others.
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

import { QuickInputService } from '@theia/core/lib/browser';
import {
    Command, CommandContribution, CommandRegistry, MAIN_MENU_BAR,
    MenuContribution, MenuModelRegistry, MenuNode, MessageService, SubMenuOptions
} from '@theia/core/lib/common';
import { inject, injectable, interfaces } from '@theia/core/shared/inversify';

const DevServerCommand: Command = {
    id: 'dev-server-button',
    label: 'Open port in browser...'
};
const ToggleChatCommand: Command = {
    id: 'toggle-chat',
    label: 'Toggle chat'
};
const ImproveMyCode: Command = {
    id: 'improve-my-code',
    label: 'Improve my code'
};
const CheckMyCode: Command = {
    id: 'check-my-code',
    label: 'Check my code'
};
const SuggestTestCases: Command = {
    id: 'suggest-test-cases',
    label: 'Suggest test cases'
};

@injectable()
export class BrowserMenuCommandContribution implements CommandContribution {

    @inject(QuickInputService)
    protected readonly quickInputService: QuickInputService;

    @inject(MessageService)
    protected readonly messageService: MessageService;

    registerCommands(commands: CommandRegistry): void {

        commands.registerCommand(DevServerCommand, {
            execute: () => {
                commands.executeCommand('cloud-ide-extension.openDevServer');
            }
        });
        commands.registerCommand(CheckMyCode, {
            execute: () => {
                commands.executeCommand('cloud-ide-extension.checkMyCode');
            }
        });
        commands.registerCommand(ImproveMyCode, {
            execute: () => {
                commands.executeCommand('cloud-ide-extension.improveMyCode');
            }
        });
        commands.registerCommand(SuggestTestCases, {
            execute: () => {
                commands.executeCommand('cloud-ide-extension.suggestTestCases');
            }
        });
        commands.registerCommand(ToggleChatCommand, {
            execute: () => {
                commands.executeCommand('view.toggleChat');
            }
        });
    }
}

@injectable()
export class BrowserMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        setTimeout(() => {

            const subMenuPath = [...MAIN_MENU_BAR, 'DevServerMenu'];
            menus.registerSubmenu(subMenuPath, 'Browser', {
                order: 'zzy'
            });
            menus.registerMenuAction(subMenuPath, {
                commandId: DevServerCommand.id,
                order: '0'
            });

        }, 10000);
    }

}

@injectable()
export class AIMenuContribution implements MenuContribution {
    registerMenus(menus: MenuModelRegistry): void {
        setTimeout(() => {

            const subMenuPath = [...MAIN_MENU_BAR, 'AIMenu'];
            menus.registerSubmenu(subMenuPath, 'AI features', {
                order: 'zzz'
            });
            menus.registerMenuAction(subMenuPath, {
                commandId: CheckMyCode.id,
                order: '0'
            });
            menus.registerMenuAction(subMenuPath, {
                commandId: ImproveMyCode.id,
                order: '1'
            });
            menus.registerMenuAction(subMenuPath, {
                commandId: SuggestTestCases.id,
                order: '2'
            });
            menus.registerMenuAction(subMenuPath, {
                commandId: ToggleChatCommand.id,
                order: '3'
            });

        }, 10000);
    }
}

/**
 * Special menu node that is not backed by any commands and is always disabled.
 */
export class PlaceholderMenuNode implements MenuNode {

    constructor(readonly id: string, public readonly label: string, protected options?: SubMenuOptions) { }

    get icon(): string | undefined {
        return this.options?.iconClass;
    }

    get sortString(): string {
        return this.options?.order || this.label;
    }

}

// Fix: Bind both menu contributions
export const bindSampleMenu = (bind: interfaces.Bind) => {
    bind(CommandContribution).to(BrowserMenuCommandContribution).inSingletonScope();
    bind(MenuContribution).to(BrowserMenuContribution).inSingletonScope();
    // AI features button is disabled
    // bind(MenuContribution).to(AIMenuContribution).inSingletonScope();
};
