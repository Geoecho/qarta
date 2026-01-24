# 🎯 Professional Menu Structure Guide

## 📊 3-Level Hierarchy

Your menu now supports a professional 3-level structure perfect for restaurants, bars, and cafes:

```
CATEGORY (Top Navigation)
  └─ SECTION (Accordion)
      └─ SUB-CATEGORY (Filter Chips)
          └─ ITEMS (Products)
```

---

## 🏗️ How It Works

### Level 1: **CATEGORY** (Top Navigation Tabs)
Main menu divisions that appear as tabs at the top.

**Examples:**
- Drinks
- Food
- Alcoholic Beverages
- Desserts

**How to Create:**
1. Go to Admin → Manage Restaurant
2. Click "Create First Category" (or "Add Category")
3. Enter name in English, Macedonian, Albanian
4. Set ID (e.g., "drinks", "food")

---

### Level 2: **SECTION** (Accordion Dropdowns)
Subdivisions within a category that customers can expand/collapse.

**Examples:**
- Wine (under "Alcoholic Beverages")
- Coffee (under "Drinks")
- Pizza (under "Food")

**How to Create:**
1. Click "Add Section" on a category
2. Enter section name
3. **Optional:** Add Sub-Categories (filters)

---

### Level 3: **SUB-CATEGORY** (Filter Chips)
Optional filters that organize items within a section.

**Examples:**
- **Wine Section:**
  - Red
  - White
  - Rosé
- **Beer Section:**
  - Lager
  - IPA
  - Stout
- **Whiskey Section:**
  - Bourbon
  - Scotch
  - Irish

**How to Create:**
1. When creating a section, click "+ Add" under "Sub-Categories"
2. Enter filter names (e.g., "Red", "White")
3. Customers will see these as clickable chips

---

### Level 4: **ITEMS** (Actual Products)
The products customers can order.

**How to Create:**
1. Click "Add Item" in a section
2. Fill in:
   - Name (EN, MK, SQ)
   - Price
   - Image URL
   - **Sub-Category** (if section has filters)

---

## 🍷 Real-World Example: Wine Bar

### Setup in Admin:

**Category:** Alcoholic Beverages
- **Section:** Wine
  - **Sub-Categories:** Red, White, Rosé
  - **Items:**
    - Cabernet Sauvignon ($15) → Tag: "red"
    - Merlot ($12) → Tag: "red"
    - Chardonnay ($14) → Tag: "white"
    - Sauvignon Blanc ($13) → Tag: "white"
    - Provence Rosé ($16) → Tag: "rose"

### Customer Experience:

1. Clicks "Alcoholic Beverages" tab
2. Expands "Wine" section
3. Sees filter chips: **All** | Red | White | Rosé
4. Clicks "Red" → Only sees Cabernet & Merlot
5. Clicks "White" → Only sees Chardonnay & Sauvignon Blanc

---

## ✅ Best Practices

### For Bars/Pubs:
```
ALCOHOLIC BEVERAGES (Category)
  ├─ Beer (Section)
  │   ├─ Lager (Sub-category)
  │   ├─ IPA (Sub-category)
  │   └─ Stout (Sub-category)
  ├─ Wine (Section)
  │   ├─ Red (Sub-category)
  │   └─ White (Sub-category)
  └─ Whiskey (Section)
      ├─ Bourbon (Sub-category)
      ├─ Scotch (Sub-category)
      └─ Irish (Sub-category)
```

### For Cafes:
```
DRINKS (Category)
  ├─ Coffee (Section)
  │   ├─ Hot (Sub-category)
  │   └─ Iced (Sub-category)
  ├─ Tea (Section)
  │   ├─ Black (Sub-category)
  │   ├─ Green (Sub-category)
  │   └─ Herbal (Sub-category)
  └─ Smoothies (Section)
      └─ No filters needed
```

### For Restaurants:
```
FOOD (Category)
  ├─ Pizza (Section)
  │   ├─ Vegetarian (Sub-category)
  │   ├─ Meat (Sub-category)
  │   └─ Specialty (Sub-category)
  ├─ Pasta (Section)
  │   ├─ Red Sauce (Sub-category)
  │   └─ White Sauce (Sub-category)
  └─ Salads (Section)
      └─ No filters needed
```

---

## 🚀 Quick Start Workflow

1. **Create Category** → "Drinks"
2. **Add Section** → "Wine"
3. **Add Sub-Categories** → "Red", "White"
4. **Add Items:**
   - "Cabernet Sauvignon" → Select "Red"
   - "Chardonnay" → Select "White"
5. **Test Live** → Visit `qarta.xyz/your-slug`

---

## 💡 Pro Tips

- **Use Sub-Categories** for sections with 5+ items
- **Skip Sub-Categories** for simple sections (e.g., "Desserts")
- **Consistent Naming** helps customers navigate
- **Image URLs** make items more appealing
- **Multi-language** names improve accessibility

---

**Your menu structure is now production-ready for seamless business operations!** 🎉
