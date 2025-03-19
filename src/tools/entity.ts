import { type McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { type WSS } from '../wss.ts';

export const register = (server: McpServer, wss: WSS) => {
    server.tool(
        'create_entity',
        'Create a new entity',
        {
            enabled: z.boolean().optional(),
            name: z.string().optional(),
            parent: z.string().optional(),
            position: z.array(z.number()).length(3).optional(),
            rotation: z.array(z.number()).length(3).optional(),
            scale: z.array(z.number()).length(3).optional(),
            tags: z.array(z.string()).optional()
        },
        async (options) => {
            try {
                const res = await wss.send('entity:create', options);
                return {
                    content: [{
                        type: 'text',
                        text: `Created entity: ${JSON.stringify(res)}`
                    }]
                };
            } catch (err: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to create entity: ${err.message}`
                    }],
                    isError: true
                };
            }
        }
    );

    server.tool(
        'modify_entity',
        'Modify an entity\'s properties',
        {
            id: z.string(),
            name: z.string().optional(),
            enabled: z.boolean().optional(),
            position: z.array(z.number()).length(3).optional(),
            rotation: z.array(z.number()).length(3).optional(),
            scale: z.array(z.number()).length(3).optional(),
            tags: z.array(z.string()).optional()
        },
        async (options) => {
            try {
                const res = await wss.send('entity:modify', options.id, options);
                return {
                    content: [{
                        type: 'text',
                        text: `Modified entity ${options.id}: ${JSON.stringify(res)}`
                    }]
                };
            } catch (err: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to modify entity: ${err.message}`
                    }],
                    isError: true
                };
            }
        }
    );

    server.tool(
        'reparent_entity',
        'Reparent an entity',
        {
            id: z.string(),
            parent: z.string(),
            index: z.number().optional(),
            preserveTransform: z.boolean().optional()
        },
        async (options) => {
            try {
                const res = await wss.send('entity:reparent', options);
                return {
                    content: [{
                        type: 'text',
                        text: `Reparented entity ${options.id}: ${JSON.stringify(res)}`
                    }]
                };
            } catch (err: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to reparent entity: ${err.message}`
                    }],
                    isError: true
                };
            }
        }
    );

    server.tool(
        'delete_entity',
        'Delete an entity',
        {
            id: z.string()
        },
        async ({ id }) => {
            try {
                const res = await wss.send('entity:delete', id);
                return {
                    content: [{
                        type: 'text',
                        text: `Deleted entity ${id}: ${JSON.stringify(res)}`
                    }]
                };
            } catch (err: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to delete entity ${id}: ${err.message}`
                    }],
                    isError: true
                };
            }
        }
    );

    server.tool(
        'list_entities',
        'List all entities',
        {},
        async () => {
            try {
                const res = await wss.send('entity:list');
                return {
                    content: [{
                        type: 'text',
                        text: `Entities: ${JSON.stringify(res)}`
                    }]
                };
            } catch (err: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to list entities: ${err.message}`
                    }],
                    isError: true
                };
            }
        }
    );

    server.tool(
        'create_render_component',
        'Create a render component on an entity',
        {
            id: z.string(),
            type: z.enum(['box', 'capsule', 'sphere', 'cylinder', 'cone', 'plane'])
        },
        async ({ id, type }) => {
            try {
                const res = await wss.send('entity:component:add', id, 'render', { type });
                return {
                    content: [{
                        type: 'text',
                        text: `Created render component: ${JSON.stringify(res)}`
                    }]
                };
            } catch (err: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to create render component: ${err.message}`
                    }],
                    isError: true
                };
            }
        }
    );

    server.tool(
        'set_render_component_material',
        'Set the material on a render component',
        {
            id: z.string(),
            assetId: z.number()
        },
        async ({ id, assetId }) => {
            try {
                const res = await wss.send('entity:component:property:set', id, 'render', 'materialAssets', [assetId]);
                return {
                    content: [{
                        type: 'text',
                        text: `Set material on render component ${id}: ${JSON.stringify(res)}`
                    }]
                };
            } catch (err: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to set material on render component ${id}: ${err.message}`
                    }],
                    isError: true
                };
            }
        }
    );

    server.tool(
        'create_script_component',
        'Create a script component on an entity',
        {
            id: z.string()
        },
        async ({ id }) => {
            try {
                const res = await wss.send('entity:component:add', id, 'script');
                return {
                    content: [{
                        type: 'text',
                        text: `Created script component: ${JSON.stringify(res)}`
                    }]
                };
            } catch (err: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to create script component: ${err.message}`
                    }],
                    isError: true
                };
            }
        }
    );

    server.tool(
        'add_script_component_script',
        'Add a script to a script component',
        {
            id: z.string(),
            scriptName: z.string()
        },
        async ({ id, scriptName }) => {
            try {
                const res = await wss.send('entity:component:script:add', id, scriptName);
                return {
                    content: [{
                        type: 'text',
                        text: `Added script on script component ${id}: ${JSON.stringify(res)}`
                    }]
                };
            } catch (err: any) {
                return {
                    content: [{
                        type: 'text',
                        text: `Failed to add script on script component ${id}: ${err.message}`
                    }],
                    isError: true
                };
            }
        }
    );
};
