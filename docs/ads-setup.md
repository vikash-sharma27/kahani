# Adult-Friendly Advertising Setup Guide

Google AdSense strictly prohibits adult or mature romance content. Use adult-compliant ad networks such as **ExoClick**, **JuicyAds**, or **TrafficStars**.

## 1. Getting Approved

1. Ensure the **18+ Age Gate** is live on the domain.
2. Confirm the **Disclaimer** (`/disclaimer`) and **Content Policy** (`/content-policy`) pages are accessible.
3. Apply for a publisher account on the chosen ad network.

## 2. Managing Ads from StoryNest Admin Panel

1. Log in to `/admin/login` using your administrator account.
2. Navigate to **Ads** (`/admin/ads`).
3. You can configure HTML snippets for each position:
   - `HOME_TOP`: Banner below header on the homepage
   - `HOME_MIDDLE_1`: After story #3
   - `HOME_MIDDLE_2`: After story #6
   - `HOME_BOTTOM`: End of page
   - `STORY_TOP`: Above reading content
   - `STORY_MIDDLE_1`: Inside reader after ~1/3 of text
   - `STORY_BOTTOM`: Below story content before report links
4. **Global Kill Switch**:
   - Go to `/admin/settings`.
   - Uncheck **विज्ञापनों को सक्षम रखें (Global Ads Kill Switch)** and click Save.
   - All advertisements across the entire platform will immediately stop rendering without requiring a redeployment or code update.
