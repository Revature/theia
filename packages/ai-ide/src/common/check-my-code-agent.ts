// *****************************************************************************
// Copyright (C) 2024 EclipseSource GmbH.
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

import { inject, injectable } from '@theia/core/shared/inversify';
import { SystemMessageDescription } from '@theia/ai-chat';
import { AIVariableContext, LanguageModelRequirement, PromptTemplate } from '@theia/ai-core';

import {
    CommandRegistry,
    MessageService
} from '@theia/core';
import { EditorManager } from '@theia/editor/lib/browser/editor-manager';
import { AbstractStreamParsingChatAgent } from '@theia/ai-chat';

export const commandTemplate: PromptTemplate = {
    id: 'command-system',
    template: `Your task is to analyze the following code.
If it looks like it would work (according to any documentation or comments provided in the file, you should explain what it appears to do).
If the code seems unconventional in some way, point out why it's unconventional.
If the code seems like it either wouldn't run or compile, or it wouldn't work according the provided documentation or comments, you should explain why not. In this situation, please avoid giving an outright fix to the problem, as we should expect the coder to learn how to fix it according to your guidance.
Please keep your answers concise and avoid fluff.
Starting the code here: \n
    {{editor-context}}
    `};

@injectable()
export class CheckMyCodeChatAgent extends AbstractStreamParsingChatAgent {
    @inject(CommandRegistry)
    protected commandRegistry: CommandRegistry;
    @inject(MessageService)
    protected messageService: MessageService;
    @inject(EditorManager)
    protected editorManager: EditorManager

    id: string = 'Check my Code';
    name = 'Check my Code';
    languageModelRequirements: LanguageModelRequirement[] = [{
        purpose: 'command',
        identifier: 'openai/gpt-4o',
    }];
    protected defaultLanguageModelPurpose: string = 'command';

    override description = 'This agent will judge the code of the currently active editor.';
    override promptTemplates = [commandTemplate];
    override agentSpecificVariables = [{
        name: 'editor-context',
        description: 'The context of the current file.',
        usedInPrompt: true
    }];

    protected override async getSystemMessageDescription(context: AIVariableContext): Promise<SystemMessageDescription | undefined> {
        const currentEditor = this.editorManager.currentEditor;
        if (!currentEditor) {
            throw new Error('No active editor found');
        }

        const editorText = currentEditor.editor.document.getText();
        const systemPrompt = await this.promptService.getPrompt(commandTemplate.id, {
            'editor-context': editorText as string
        }, context);

        if (systemPrompt === undefined) {
            throw new Error('Couldn\'t get system prompt');
        }

        return SystemMessageDescription.fromResolvedPromptTemplate(systemPrompt);
    }

}
