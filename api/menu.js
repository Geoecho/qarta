const redis = require('./db');

module.exports = async function handler(request, response) {
    try {
        if (request.method === 'POST') {
            const { restaurants } = request.body;
            if (!Array.isArray(restaurants)) {
                return response.status(400).json({ error: 'Body must contain restaurants array' });
            }

            // Save as string
            await redis.set('restaurants', JSON.stringify(restaurants));
            console.log('✅ Saved to Redis:', restaurants.length, 'restaurants');
            return response.status(200).json({ success: true });
        }

        // GET
        if (request.method === 'GET') {
            const data = await redis.get('restaurants');
            if (data) {
                const parsed = JSON.parse(data);
                console.log('✅ Loaded from Redis:', parsed.length, 'restaurants');
                return response.status(200).json(parsed);
            }
            console.log('⚠️ No data in Redis, returning empty array');
            return response.status(200).json([]);
        }

        return response.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error("❌ Redis Error:", error);
        return response.status(500).json({ error: error.message, stack: error.stack });
    }
};
