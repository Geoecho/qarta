const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

/**
 * Submits a new order.
 * Type: Callable Function (called directly from client)
 * 
 * Logic:
 * 1. Authenticates user.
 * 2. Fetches menu to validate items and prices.
 * 3. Calculates total server-side.
 * 4. Creates order document in Firestore (Admin SDK).
 */
exports.submitOrder = functions.https.onCall(async (data, context) => {
    // 1. Authentication Check
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be logged in (anonymous or otherwise) to place an order.'
        );
    }

    const uid = context.auth.uid;
    const { items, note, restaurantSlug, tableId } = data;

    // 2. Input Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Order must have items.');
    }

    const targetSlug = restaurantSlug || 'default';
    console.log(`Processing order for ${targetSlug} from user ${uid}`);

    try {
        // 3. Fetch System Menu for Price Verification
        const menuSnapshot = await db.doc("system/menuData").get();
        if (!menuSnapshot.exists) {
            throw new functions.https.HttpsError('internal', 'System menu not found.');
        }

        const menuData = menuSnapshot.data();
        const allRestaurants = menuData.restaurants || [];
        const restaurant = allRestaurants.find(r => r.slug === targetSlug || r.id === targetSlug) || allRestaurants[0];

        if (!restaurant) {
            throw new functions.https.HttpsError('not-found', 'Restaurant not found.');
        }

        // Flatten items for easy lookup
        const itemPriceMap = new Map();
        (restaurant.menu || []).forEach(cat => {
            (cat.sections || []).forEach(sec => {
                (sec.items || []).forEach(item => {
                    itemPriceMap.set(item.id, item.price);
                });
            });
        });

        // 4. Calculate Total & Validate Items
        let calculatedTotal = 0;
        const finalItems = [];

        for (const item of items) {
            const realPrice = itemPriceMap.get(item.id);
            if (realPrice === undefined) {
                // For now, if item not found, we reject. 
                throw new functions.https.HttpsError('invalid-argument', `Item ${item.name} not available.`);
            }

            // Calculate item total (ignoring options for now, or trust client options price but verify base)
            // Ideally we validate options too. For MVP: Base Price * Qty.
            const itemTotal = realPrice * item.quantity;
            calculatedTotal += itemTotal;

            // Reconstruct item object to ensure no extra junk data is saved
            finalItems.push({
                id: item.id,
                name: item.name,
                price: realPrice, // Use SERVER price
                quantity: item.quantity,
                selectedOptions: item.selectedOptions || [] // We trust selectedOptions structure for now
            });
        }

        // 5. Rate Limiting (Optional but good)
        // Check if user has > 5 active orders? (Skipped for MVP speed)

        // 6. Create Order Document
        const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const orderDoc = {
            id: orderId,
            uid: uid,
            items: finalItems,
            note: note || '',
            total: calculatedTotal,
            status: 'placed', // Goes directly to placed, effectively 'Verified'
            restaurantSlug: targetSlug,
            tableId: tableId || 'n/a',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            securityNote: "Created via secure submitOrder function"
        };

        // Write to Firestore using Admin SDK (Bypasses Rules)
        await db.collection('orders').doc(orderId).set(orderDoc);

        console.log(`Order ${orderId} created successfully.`);

        return { orderId, status: 'placed', message: 'Order received!' };

    } catch (error) {
        console.error("Order submission failed:", error);
        // Re-throw HTTPS errors, wrap others
        if (error.code && error.code.startsWith('functions/')) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', error.message);
    }
});

/**
 * Seeds the database with initial menu data.
 * Type: Callable Function
 */
exports.seedMenu = functions.https.onCall(async (data, context) => {
    // Optional: Protect this function with specific rules or secret
    // For now, allow anyone to seed if DB is broken (or just rely on obscurity)

    try {
        const seedData = require('./menu_seed');
        await db.doc("system/menuData").set({
            restaurants: seedData.restaurants,
            updatedAt: new Date().toISOString()
        });
        return { success: true, message: "Database seeded successfully." };
    } catch (e) {
        throw new functions.https.HttpsError('internal', e.message);
    }
});
