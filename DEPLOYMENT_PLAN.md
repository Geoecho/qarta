# Deployment Plan & Real-World Integration

Currently, your application uses **Local Storage** to save data. This means:
*   Changes you make in the Admin Panel are saved **only on your specific browser/device**.
*   If you upload the website now, users who visit the link **will not see your changes**. They will see the default menu, and any changes they make (if they could access admin) would only be visible to them.

To make the application work on the "Real Web" where **Admin updates affect all customers**, we need to move from **Local Storage** to a **Real Database**.

We recommend a **Serverless Architecture** using **Firebase** (by Google) and **Vercel** (for hosting). This is the modern, standard way to deploy React apps completely completely free for small projects.

---

## Phase 1: The Database (Firebase)
We need a central place to store your Restaurants, Menus, and Settings.

1.  **Create a Firebase Project**:
    *   Go to [console.firebase.google.com](https://console.firebase.google.com/).
    *   Click **Add project** -> Name it "Forme App" (or similar).
    *   Disable Google Analytics (not needed for now).
    *   Click **Create Project**.

2.  **Setup Firestore Database**:
    *   In the project sidebar, click **Build** -> **Firestore Database**.
    *   Click **Create database**.
    *   Choose a location close to your users (e.g., `europe-west` or `us-central`).
    *   **Security Rules**: Choose **Start in test mode** (allows read/write for 30 days, easy for development).
    *   Click **Create**.

3.  **Get Configuration**:
    *   Click the **Project Overview** (gear icon) -> **Project settings**.
    *   Scroll down to "Your apps" and click the **Web `</>`** icon.
    *   Nickname: "Web App". Click **Register app**.
    *   You will see a code block `const firebaseConfig = { ... }`. **Copy this config object**.

---

## Phase 2: Code Integration
I can help you with this step once you have the config. We will:

1.  Install Firebase: `npm install firebase`
2.  Create a `src/firebase.js` file with your config.
3.  Update `src/contexts/MenuContext.jsx` (the `PlatformContext`) to:
    *   **Read** from Firestore instead of `localStorage`.
    *   **Write** (Save/Update) to Firestore instead of `localStorage`.
    *   This ensures that when you click "Save" in Admin, it updates the central database, and *all* users see the new menu instantly (or on refresh).

---

## Phase 3: Hosting (Vercel)
Vercel is the gold standard for hosting React/Vite apps. It's free and handles "HTTPS" (security) automatically.

1.  **Create a GitHub Repository** (Recommended):
    *   Push your code to GitHub.
2.  **Connect to Vercel**:
    *   Go to [vercel.com](https://vercel.com) and sign up with GitHub.
    *   Click **Add New...** -> **Project**.
    *   Select your "Forme App" repository.
    *   Click **Deploy**.
3.  **Result**:
    *   Vercel will give you a live URL (e.g., `forme-app.vercel.app`).
    *   Anytime you push code changes to GitHub, Vercel automatically updates the site.

---

## Alternative: "Manual" Upload
If you don't want to use GitHub/Vercel yet and just want to see the files:

1.  Run `npm run build` in your terminal.
2.  This creates a `dist` folder.
3.  You can drag and drop this `dist` folder into [Netlify Drop](https://app.netlify.com/drop) to get a link instantly.
    *   *Warning: Without Phase 1 & 2 (Firebase), this will still be "Local Storage" only.*

---

## Immediate Next Steps
**Do you want to proceed with the Firebase integration (Phase 1 & 2)?** 
If yes, please create the Firebase project (Step 1) and paste the `firebaseConfig` keys here. I will then rewrite the `MenuContext` to make your app truly dynamic and ready for the web.

If you prefer to just upload the **static demo** for now (without real database/admin syncing for users), let me know and I can guide you through the "Manual" upload.
