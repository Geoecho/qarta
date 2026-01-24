# 🎯 Cafe-Specific Orders Dashboard

## ✅ What's New

### Separate Orders Dashboard for Each Cafe

**Old System:**
- Orders were in `/admin` (global admin panel)
- Mixed with restaurant management

**New System:**
- Each cafe has its own orders dashboard at `/:slug/orders`
- Example: `qarta.xyz/test/orders`
- Requires separate login (password: `orders123`)

---

## 🔐 How It Works

### 1. Access Orders Dashboard

**URL Format:** `https://qarta.xyz/YOUR-CAFE-SLUG/orders`

**Examples:**
- Test Cafe: `https://qarta.xyz/test/orders`
- Netaville: `https://qarta.xyz/netaville/orders`
- Your Cafe: `https://qarta.xyz/your-slug/orders`

### 2. Login

**Password:** `orders123` (same for all cafes)

**Authentication:**
- Stored per-cafe in localStorage
- Key: `cafe_{slug}_auth`
- Stays logged in until you click "Logout"

### 3. View Orders

**Dashboard Shows:**
- All orders for THIS cafe only
- Order ID, timestamp, total price
- Order status (pending, accepted, rejected)
- All items in the order
- Real-time updates (polls every 3 seconds)

### 4. Manage Orders

**Actions:**
- ✅ **Accept** - Sets status to "accepted", estimated time: 15 minutes
- ❌ **Reject** - Sets status to "rejected"
- Once accepted/rejected, buttons disappear

---

## 📱 Customer Flow

1. Customer visits `qarta.xyz/test`
2. Adds items to cart
3. Places order
4. Order is saved with `restaurantSlug: "test"`

---

## 🏪 Cafe Owner Flow

1. Visit `qarta.xyz/test/orders`
2. Login with password: `orders123`
3. See all orders for "Test Cafe"
4. Accept or reject orders
5. Customer sees status update in real-time

---

## 🔧 Admin Panel vs Orders Dashboard

### Admin Panel (`/admin`)
**Purpose:** Manage ALL restaurants
**Login:** `admin123` / `123admin123admin123`
**Features:**
- Create/edit/delete restaurants
- Build menus
- Change settings
- View ALL orders (from all cafes)

### Orders Dashboard (`/:slug/orders`)
**Purpose:** Manage orders for ONE cafe
**Login:** `orders123` (per cafe)
**Features:**
- View orders for this cafe only
- Accept/reject orders
- See real-time updates
- Simple, focused interface

---

## 🚀 Live Now

**Test it:**
1. Go to `https://qarta.xyz/test/orders`
2. Login with: `orders123`
3. See orders dashboard

**Place a test order:**
1. Go to `https://qarta.xyz/test`
2. Add items to cart
3. Place order
4. Go back to `/test/orders`
5. See your order appear!

---

## 🔐 Security Notes

**Current Setup (Development):**
- Simple password: `orders123`
- Stored in localStorage
- Same password for all cafes

**For Production:**
- Each cafe should have unique password
- Store in database
- Add proper session management
- Consider 2FA for security

---

## 📊 Data Structure

**Order Object:**
```json
{
  "id": "ord-1734736800000",
  "restaurantSlug": "test",
  "timestamp": "2024-12-20T23:00:00.000Z",
  "items": [
    {
      "id": "item-1",
      "name": { "en": "Espresso", "mk": "Еспресо" },
      "price": 2.50,
      "quantity": 2
    }
  ],
  "total": 5.00,
  "status": "placed",
  "estimatedMinutes": null
}
```

---

**Your cafe-specific orders dashboard is live!** 🎉

Visit `qarta.xyz/YOUR-SLUG/orders` to manage orders!
