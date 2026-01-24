import { get } from '@vercel/edge-config';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        // 1. Get Store Status from Edge Config
        // You can set "store_open": true/false in Vercel Dashboard
        const isOpen = await get('store_open');

        // Default to true if not set
        const status = isOpen === undefined ? true : isOpen;

        return new Response(
            JSON.stringify({
                isOpen: status,
                message: status ? "We are open!" : "Sorry, we are currently closed."
            }),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Edge Config not set up", isOpen: true }),
            { status: 200 } // Fail open
        );
    }
}
