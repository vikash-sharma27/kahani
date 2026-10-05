import React from 'react';
import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { updateSiteSettingsAction } from '@/server/actions/settings';
import { Role } from '@prisma/client';

export const metadata: Metadata = { title: 'Site Settings | Admin' };

export default async function AdminSettingsPage() {
  await requireRole(Role.ADMIN);

  const settingsRows = await db.siteSetting.findMany();
  const settings: Record<string, unknown> = {};
  for (const s of settingsRows) {
    settings[s.key] = s.value;
  }

  const adsEnabled = settings['adsEnabled'] !== false;
  const commentAutoApprove = settings['commentAutoApprove'] === true;
  const maintenanceMode = settings['maintenanceMode'] === true;
  const siteName = (settings['siteName'] as string) || process.env.SITE_NAME || 'KahaniNest';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-devanagari">
          साइट सेटिंग्स (Site Settings)
        </h1>
        <p className="text-xs text-gray-500">
          वैश्विक प्लेटफ़ॉर्म सेटिंग्स एवं एड्स किल-स्विच (Global Settings)
        </p>
      </div>

      <form action={updateSiteSettingsAction} className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Site Name
          </label>
          <input
            type="text"
            name="siteName"
            defaultValue={siteName}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Global Ads Kill Switch */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="adsEnabled"
              value="true"
              defaultChecked={adsEnabled}
              className="h-5 w-5 text-red-600 rounded border-gray-300"
            />
            <div>
              <span className="text-sm font-bold text-gray-900 block">
                विज्ञापनों को सक्षम रखें (Global Ads Kill Switch)
              </span>
              <span className="text-xs text-gray-500">
                इसे अनचेक करने पर पूरी वेबसाइट से सभी विज्ञापन तुरंत गायब हो जाएंगे (बिना किसी रीडिप्लॉयमेंट के)।
              </span>
            </div>
          </label>
        </div>

        {/* Auto Approve Comments */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="commentAutoApprove"
              value="true"
              defaultChecked={commentAutoApprove}
              className="h-5 w-5 text-red-600 rounded border-gray-300"
            />
            <div>
              <span className="text-sm font-bold text-gray-900 block">
                टिप्पणियों को स्वतः स्वीकृत करें (Comment Auto-Approve)
              </span>
              <span className="text-xs text-gray-500">
                यदि बंद है, तो सभी नई टिप्पणियाँ पहले संपादक समीक्षा के लिए PENDING स्थिति में रहेंगी।
              </span>
            </div>
          </label>
        </div>

        {/* Maintenance Mode */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="maintenanceMode"
              value="true"
              defaultChecked={maintenanceMode}
              className="h-5 w-5 text-red-600 rounded border-gray-300"
            />
            <div>
              <span className="text-sm font-bold text-gray-900 block">
                रखरखाव मोड (Maintenance Mode)
              </span>
              <span className="text-xs text-gray-500">
                केवल एडमिन लॉगिन कर सकेंगे; आम पाठकों को मेंटेनेंस संदेश दिखेगा।
              </span>
            </div>
          </label>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors"
          >
            सेटिंग्स सहेजें (Save Settings)
          </button>
        </div>
      </form>
    </div>
  );
}
