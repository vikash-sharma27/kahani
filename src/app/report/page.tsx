'use client';

import React from 'react';
import { useFormState } from 'react-dom';
import { submitReportAction, type ReportResult } from '@/server/actions/report';
import Link from 'next/link';

interface ReportPageProps {
  searchParams: { storyId?: string; commentId?: string; storyUrl?: string };
}

export default function ReportPage({ searchParams }: ReportPageProps) {
  const [state, formAction] = useFormState<ReportResult | null, FormData>(
    submitReportAction,
    null
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      <div className="bg-white border border-rose-200 border-b-4 border-b-rose-300 rounded-2xl p-6 md:p-10 shadow-sm">
        
        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">
            वैधानिक प्रक्रिया (Formal Legal Notice)
          </span>
          <span className="text-xs text-gray-500 font-devanagari">
            त्वरित समीक्षा एवं टेकडाउन प्रणाली
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a1618] mb-3 font-devanagari leading-snug">
          सामग्री उल्लंघन एवं टेकडाउन रिपोर्ट (Report Abuse / Legal Takedown)
        </h1>

        {/* Warning Banner against Fake Reports */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-8 text-xs font-devanagari text-amber-900 leading-relaxed space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-amber-950 text-sm">
            <span>⚖️</span>
            <span>महत्वपूर्ण कानूनी चेतावनी (Notice of Legal Liability):</span>
          </p>
          <p>
            फर्जी, भ्रामक अथवा अवांछित शिकायत दर्ज करना कानूनन अपराध है। गलत या दुर्भावनापूर्ण नोटिस भेजने पर शिकायतकर्ता के विरुद्ध मानहानि एवं कानूनी हर्जानों की प्रत्यक्ष कार्रवाई की जा सकती है। केवल वास्तविक कॉपीराइट स्वामी, पीड़ित अथवा अधिकृत विधिक प्रतिनिधि ही यह फॉर्म भरें।
          </p>
        </div>

        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl font-devanagari flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="storyId" value={searchParams?.storyId || ''} />
          <input type="hidden" name="commentId" value={searchParams?.commentId || ''} />

          {/* SECTION 1: COMPLAINANT IDENTIFICATION */}
          <div className="bg-rose-50/40 border border-rose-100 p-5 rounded-xl space-y-4">
            <h2 className="text-sm font-bold text-[#b8233e] font-devanagari flex items-center gap-2 uppercase tracking-wide">
              <span>👤</span>
              <span>1. शिकायतकर्ता की विधिक पहचान (Complainant Legal Information)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                  पूरा कानूनी नाम (Full Legal Name) *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="सरकारी पहचान पत्र के अनुसार"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-devanagari"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                  आधिकारिक ईमेल पता (Valid Email Address) *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                  संपर्क / मोबाइल नंबर (Phone Number with Code) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                  शिकायतकर्ता की स्थिति (Capacity / Relationship) *
                </label>
                <select
                  name="relationship"
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#b8233e] focus:outline-none font-devanagari"
                >
                  <option value="">-- अपनी स्थिति चुनें --</option>
                  <option value="मूल रचनाकार / कॉपीराइट स्वामी (Original Author / Copyright Owner)">
                    मूल रचनाकार / कॉपीराइट स्वामी (Author / Copyright Owner)
                  </option>
                  <option value="अधिकृत कानूनी प्रतिनिधि / अधिवक्ता (Authorized Legal Counsel)">
                    अधिकृत कानूनी प्रतिनिधि / अधिवक्ता (Legal Counsel)
                  </option>
                  <option value="सीधे प्रभावित व्यक्ति / पीड़ित (Affected Person / Victim)">
                    सीधे प्रभावित व्यक्ति / पीड़ित (Affected Person)
                  </option>
                  <option value="जागरूक नागरिक / पाठक (Concerned Citizen / Reader)">
                    जागरूक नागरिक / पाठक (Concerned Citizen)
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                  सत्यापन हेतु सरकारी पहचान पत्र प्रकार (ID Document Type) *
                </label>
                <select
                  name="idProofType"
                  required
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#b8233e] focus:outline-none font-devanagari"
                >
                  <option value="">-- पहचान पत्र प्रकार चुनें --</option>
                  <option value="Aadhaar Card (आधार कार्ड)">Aadhaar Card (आधार कार्ड)</option>
                  <option value="PAN Card (पैन कार्ड)">PAN Card (पैन कार्ड)</option>
                  <option value="Voter ID Card (मतदाता पहचान पत्र)">Voter ID Card (मतदाता पहचान पत्र)</option>
                  <option value="Passport (पासपोर्ट)">Passport (पासपोर्ट)</option>
                  <option value="Driving License (ड्राइविंग लाइसेंस)">Driving License (ड्राइविंग लाइसेंस)</option>
                  <option value="Advocate Bar Enrollment (अधिवक्ता पंजीकरण)">Advocate Bar Enrollment (अधिवक्ता पंजीकरण)</option>
                  <option value="Other Official ID (अन्य सरकारी पहचान)">Other Official ID (अन्य सरकारी पहचान)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: PHYSICAL POSTAL ADDRESS */}
          <div className="bg-rose-50/40 border border-rose-100 p-5 rounded-xl space-y-4">
            <h2 className="text-sm font-bold text-[#b8233e] font-devanagari flex items-center gap-2 uppercase tracking-wide">
              <span>🏠</span>
              <span>2. पूर्ण डाक पता (Physical Residential / Office Address)</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                  पूरा पता (मकान नं., सड़क, मोहल्ला, क्षेत्र) *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="उदा. मकान नं. 45, मेन रोड, ब्लॉक-बी..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-devanagari"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                    शहर (City) *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="उदा. नई दिल्ली"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                    राज्य (State) *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="उदा. उत्तर प्रदेश"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                    देश (Country) *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    defaultValue="भारत (India)"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-devanagari"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                    पिन कोड (Pincode) *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    placeholder="110001"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: INFRINGEMENT DETAILS */}
          <div className="bg-rose-50/40 border border-rose-100 p-5 rounded-xl space-y-4">
            <h2 className="text-sm font-bold text-[#b8233e] font-devanagari flex items-center gap-2 uppercase tracking-wide">
              <span>📄</span>
              <span>3. उल्लंघन एवं सामग्री विवरण (Infringement Specifics)</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                कथित उल्लंघनकारी कहानी का सीधा लिंक (Story Exact URL) *
              </label>
              <input
                type="url"
                name="storyUrl"
                required
                defaultValue={searchParams?.storyUrl || ''}
                placeholder="https://kahaninest.com/story/..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-mono"
              />
              <p className="text-[11px] text-gray-500 mt-1 font-devanagari">
                वेबसाइट पर मौजूद जिस कहानी के विरुद्ध रिपोर्ट है, उसका पूरा वेब पता यहाँ लिखें।
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                रिपोर्ट का मुख्य विधिक कारण (Legal Ground) *
              </label>
              <select
                name="reason"
                required
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#b8233e] focus:outline-none font-devanagari"
              >
                <option value="UNDERAGE_OR_MINOR">🚨 नाबालिग / बाल सुरक्षा नियम (POCSO / Underage) - तत्काल समीक्षा</option>
                <option value="NON_CONSENSUAL">🚨 गैर-सहमति / निजता हनन (Non-consensual / Privacy) - तत्काल समीक्षा</option>
                <option value="COPYRIGHT_OR_DMCA">©️ कॉपीराइट एवं बौद्धिक संपदा उल्लंघन (DMCA / Copyright Infringement)</option>
                <option value="HATE_SPEECH">⚠️ घृणास्पद / हिंसा भड़काने वाली सामग्री (Hate Speech)</option>
                <option value="SPAM_OR_ABUSE">🚫 अवांछित स्पैम / साइबर प्रताड़ना (Spam / Cyber Abuse)</option>
                <option value="OTHER">⚖️ अन्य गंभीर कानूनी कारण (Other Severe Legal Ground)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                सटीक अंश एवं साक्ष्य का विस्तृत विवरण (Specific Evidence & Paragraphs) *
              </label>
              <textarea
                name="details"
                required
                minLength={30}
                rows={5}
                placeholder="कृपया स्पष्ट रूप से उन पैराग्राफ, वाक्यों अथवा घटनाक्रम को उद्धृत (Quote) करें जो नियमों अथवा कॉपीराइट का उल्लंघन करते हैं। कम से कम 30 अक्षर आवश्यक हैं..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-devanagari leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 4: PERJURY DECLARATION & SIGNATURE */}
          <div className="bg-red-50/50 border border-red-200 p-5 rounded-xl space-y-4">
            <h2 className="text-sm font-bold text-red-900 font-devanagari flex items-center gap-2 uppercase tracking-wide">
              <span>✍️</span>
              <span>4. शपथपूर्वक विधिक घोषणा एवं डिजिटल हस्ताक्षर (Legal Declarations)</span>
            </h2>

            <div className="space-y-3 text-xs font-devanagari text-gray-800">
              <label className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-red-100 cursor-pointer">
                <input
                  type="checkbox"
                  name="perjuryAffirmed"
                  required
                  className="mt-0.5 w-4 h-4 accent-[#b8233e] flex-shrink-0"
                />
                <span className="leading-relaxed">
                  <strong>शपथपूर्वक सत्यता की घोषणा (Under Penalty of Perjury):</strong> मैं सत्यनिष्ठा से प्रतिज्ञान करता/करती हूँ कि इस नोटिस में दी गई समस्त जानकारी पूर्णतः सत्य, सटीक एवं प्रामाणिक है।
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-red-100 cursor-pointer">
                <input
                  type="checkbox"
                  name="liabilityAffirmed"
                  required
                  className="mt-0.5 w-4 h-4 accent-[#b8233e] flex-shrink-0"
                />
                <span className="leading-relaxed">
                  <strong>कानूनी उत्तरदायित्व एवं हर्जाना दायित्व:</strong> मैं स्वीकार करता/करती हूँ कि यदि यह नोटिस दुर्भावनापूर्ण, झूठा अथवा गलत पाया जाता है, तो मैं प्रकाशक एवं प्लेटफॉर्म को होने वाले समस्त कानूनी हर्जानों एवं व्यय के लिए उत्तरदायी होऊँगा/होऊँगी।
                </span>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-800 mb-1 font-devanagari">
                शिकायतकर्ता का डिजिटल हस्ताक्षर (Type Full Name as Digital Signature) *
              </label>
              <input
                type="text"
                name="digitalSignature"
                required
                placeholder="हस्ताक्षर के रूप में अपना पूरा कानूनी नाम टाइप करें"
                className="w-full px-3.5 py-2.5 border border-red-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#b8233e] focus:outline-none bg-white font-devanagari"
              />
              <p className="text-[10px] text-gray-500 mt-1 font-devanagari">
                यहाँ टाइप किया गया नाम इलेक्ट्रॉनिक साक्ष्य एवं सूचना प्रौद्योगिकी अधिनियम के तहत वैध माना जाएगा।
              </p>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="btn-3d w-full py-3.5 px-4 bg-gradient-to-r from-[#b8233e] to-[#91152a] hover:from-[#cb2846] hover:to-[#a21931] text-white font-bold rounded-xl text-sm transition-all min-h-[48px] font-devanagari shadow-md flex items-center justify-center gap-2"
          >
            <span>📜</span>
            <span>वैधानिक नोटिस एवं रिपोर्ट दर्ज करें (Submit Formal Legal Report)</span>
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-gray-100 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 font-devanagari font-medium">
            ← मुख्य पृष्ठ पर वापस जाएँ (Back to Home)
          </Link>
        </div>
      </div>
    </div>
  );
}
