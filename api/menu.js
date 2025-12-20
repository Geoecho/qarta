import redis from './db';

export default async function handler(request, response) {
    try {
        if (request.method === 'POST') {
            const { restaurants } = request.body;
            if (!Array.isArray(restaurants)) {
                return response.status(400).json({ error: 'Body must contain restaurants array' });
            }

            // Save as string
            await redis.set('restaurants', JSON.stringify(restaurants));
            return response.status(200).json({ success: true });
        }

        // GET
        if (request.method === 'GET') {
            const data = await redis.get('restaurants');
            if (data) {
                return response.status(200).json(JSON.parse(data));
            }
            return response.status(200).json([]);
        }

        return response.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error("Redis Error:", error);
        return response.status(500).json({ error: error.message });
    }
}
