import redis from './db';

// Initial Default Restaurant (Same as in Context)
const DEFAULT_RESTAURANT = {
    id: 'default',
    slug: 'default',
    name: 'Default Restaurant',
    type: 'Fine Dining',
    status: 'Active',
    logo: '/logo.png',
    theme: { primary: '#ff5f1f', background: '#ffffff', surface: '#f8f8f8' },
    promotion: { active: false, title: 'Welcome!', message: 'Check out our new specials.', image: '' },
    // We assume INITIAL_MENU is handled by client if empty, 
    // but here we serve the DB state.
    menu: []
};

export default async function handler(request, response) {
    try {
        // GET: Fetch
        if (request.method === 'GET') {
            const data = await redis.get('restaurants');
            if (!data) {
                return response.status(200).json([DEFAULT_RESTAURANT]);
            }
            return response.status(200).json(JSON.parse(data));
        }

        // POST: Save
        if (request.method === 'POST') {
            const { restaurants } = request.body;
            if (!Array.isArray(restaurants)) {
                return response.status(400).json({ error: 'Body must contain restaurants array' });
            }

            // Save as string
            await redis.set('restaurants', JSON.stringify(restaurants));
            return response.status(200).json({ success: true });
        }

        return response.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error("Redis Error:", error);
        return response.status(500).json({ error: error.message });
    }
}
