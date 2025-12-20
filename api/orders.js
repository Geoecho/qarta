import redis from './db';

export default async function handler(request, response) {
    try {
        if (request.method === 'POST') {
            // 1. PLACE ORDER
            const order = request.body;
            // Push to list "orders_v1"
            await redis.lpush('orders_v1', JSON.stringify(order));
            return response.status(200).json({ success: true, id: order.id });

        } else if (request.method === 'PUT') {
            // 2. UPDATE ORDER (Accept/Reject)
            const { id, status, estimatedMinutes } = request.body;

            const rawOrders = await redis.lrange('orders_v1', 0, -1);
            const orders = rawOrders.map(o => JSON.parse(o));

            const updatedOrders = orders.map(o => {
                if (o.id === id) {
                    return {
                        ...o,
                        status: status || o.status,
                        estimatedMinutes: estimatedMinutes || o.estimatedMinutes,
                        acceptedAt: status === 'accepted' ? new Date().toISOString() : o.acceptedAt
                    };
                }
                return o;
            });

            // Replace list
            await redis.del('orders_v1');
            // Push back (reverse to keep order)
            for (const ord of updatedOrders.reverse()) {
                await redis.lpush('orders_v1', JSON.stringify(ord));
            }

            return response.status(200).json({ success: true });

        } else {
            // 3. GET ORDERS
            const rawOrders = await redis.lrange('orders_v1', 0, -1);
            const orders = rawOrders.map(o => JSON.parse(o));
            return response.status(200).json(orders);
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: error.message });
    }
}
