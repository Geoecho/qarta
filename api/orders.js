const redis = require('./db');

module.exports = async function handler(request, response) {
    try {
        if (request.method === 'POST') {
            // 1. PLACE ORDER
            const order = request.body;
            // Push to list "orders_v1"
            await redis.lpush('orders_v1', JSON.stringify(order));
            console.log('✅ Order saved:', order.id);
            return response.status(200).json({ success: true, id: order.id });

        } else if (request.method === 'PUT') {
            // 2. UPDATE ORDER (Accept/Reject/Modify)
            const { id } = request.body; // Extract ID first

            // Fetch existing
            const rawOrders = await redis.lrange('orders_v1', 0, -1);
            const orders = rawOrders.map(o => JSON.parse(o));

            let finalStatus = null; // Track for logging

            const updatedOrders = orders.map(o => {
                if (o.id === id) {
                    // Extract fields that need special handling
                    const { status: newStatus, estimatedMinutes: newTime, ...restUpdates } = request.body;

                    finalStatus = newStatus || o.status;

                    return {
                        ...o,              // Keep original fields
                        ...restUpdates,    // Apply updates (items, total, note, etc.)
                        status: finalStatus,
                        estimatedMinutes: newTime || o.estimatedMinutes,
                        acceptedAt: newStatus === 'accepted' ? new Date().toISOString() : o.acceptedAt
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

            console.log('✅ Order updated:', id, finalStatus);
            return response.status(200).json({ success: true });

        } else {
            // 3. GET ORDERS
            const rawOrders = await redis.lrange('orders_v1', 0, -1);
            const orders = rawOrders.map(o => JSON.parse(o));
            console.log('✅ Loaded orders:', orders.length);
            return response.status(200).json(orders);
        }
    } catch (error) {
        console.error('❌ Orders Error:', error);
        return response.status(500).json({ error: error.message, stack: error.stack });
    }
};
