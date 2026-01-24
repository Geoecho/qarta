# Description Update Error Fix

## Problem
When updating item descriptions in the Admin Dashboard, you're getting errors because the `handleSaveItem` function is being called (line 1389) but doesn't exist.

## Root Cause
There are two different item editing interfaces in AdminDashboard.jsx:
1. One around line 1389 that calls `handleSaveItem` (MISSING FUNCTION - causes error)
2. The `EditItemForm` component at line 2439 that works correctly

## Solution
Add the missing `handleSaveItem` function after line 1704 in AdminDashboard.jsx:

```javascript
const handleSaveItem = async (itemData) => {
    if (!itemData) return;
    
    // Ensure description object exists and has the correct structure
    const normalizedItem = {
        ...itemData,
        description: itemData.description || { en: '', mk: '', sq: '' },
        title: itemData.title || { en: '', mk: '', sq: '' }
    };
    
    // If item has an ID, it's an edit, otherwise it's new
    if (normalizedItem.id) {
        // Find which category and section this item belongs to
        let targetCategory, targetSection;
        for (const category of restaurant.menu || []) {
            for (const section of category.sections || []) {
                if (section.items?.some(i => i.id === normalizedItem.id)) {
                    targetCategory = category;
                    targetSection = section;
                    break;
                }
            }
            if (targetSection) break;
        }
        
        if (targetCategory && targetSection) {
            const updatedItems = targetSection.items.map(i => 
                i.id === normalizedItem.id ? normalizedItem : i
            );
            const updatedSection = { ...targetSection, items: updatedItems };
            updateSection(restaurant.id, targetCategory.id, targetSection.id, updatedSection);
        }
    } else {
        // This is a new item - need category and section context
        console.error('Cannot add new item without category/section context');
    }
    
    setEditingItem(null);
};
```

Insert this function between `handleDeleteItem` (ends at line 1704) and `handleSaveMenu` (starts at line 1706).
