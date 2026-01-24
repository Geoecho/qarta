# FINAL DEPLOYMENT STEP: Manual Upload

You now have a **Real Cloud Database** (Firebase) connected to your code.
Your app is built and ready for the web.

### How to Upload (3 Minutes)
This is the "fastest and cheapest" way as you requested (Free).

1.  **Open the Output Folder**:
    *   Go to your desktop file explorer.
    *   Open `c:\Users\hbris\OneDrive\Desktop\Ex app\dist`
    *   (Make sure you see `index.html` and an `assets` folder inside).

2.  **Go to Netlify Drop**:
    *   Open [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
    *   (You might need to sign up/login - it's free).

3.  **Drag and Drop**:
    *   Drag the entire `dist` folder from your explorer onto the page where it says "Drag and drop your project folder here".

4.  **Done!**:
    *   Netlify will give you a random link (e.g., `fast-food-123.netlify.app`).
    *   **Test this link**: Open it on your phone.
    *   Go to `/admin` to log in (`admin123`).
    *   Add a new menu item.
    *   Refresh the page on your phone (Client view).
    *   **You will see the synced change!**

---

### Why this works
Because we connected Firebase, the data lives in Google's cloud. The files you upload to Netlify are just the "viewer". This means you never have to re-upload the website just to change a price or add a burger. You only re-upload if you change the *code* (design, features).
