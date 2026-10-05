import { PrismaClient, Role, StoryStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@storynest.internal';
  const adminPassword = process.env.ADMIN_PASSWORD || 'SuperSecretAdminPassword123!';

  console.log('🌱 Starting database seed...');

  // 1. Seed or Update Admin User
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      name: 'Super Admin',
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin seeded: ${admin.email}`);

  // 2. Seed 6 Neutral Categories
  const categoriesData = [
    {
      name: 'Romance',
      slug: 'romance',
      description: 'प्रेम और भावनाओं से भरी वयस्कों की मौलिक कहानियाँ।',
      seoTitle: 'Romance Stories | KahaniNest',
      seoDescription: 'Read original Hindi and Hinglish romance stories.',
      sortOrder: 1,
      colour: 'rose',
    },
    {
      name: 'Drama',
      slug: 'drama',
      description: 'जीवन के उतार-चढ़ाव, रिश्तों और मानवीय संवेदनाओं का गहरा ड्रामा।',
      seoTitle: 'Drama Stories | KahaniNest',
      seoDescription: 'Engaging dramatic adult stories in Hindi.',
      sortOrder: 2,
      colour: 'amber',
    },
    {
      name: 'Family Saga',
      slug: 'family-saga',
      description: 'पारिवारिक पृष्ठभूमि, जटिल रिश्तों और पीढ़ियों की कहानियाँ।',
      seoTitle: 'Family Saga Stories | KahaniNest',
      seoDescription: 'Generational family fiction in Hindi/Hinglish.',
      sortOrder: 3,
      colour: 'blue',
    },
    {
      name: 'Mystery',
      slug: 'mystery',
      description: 'रहस्य, अनसुलझे सवाल और अप्रत्याशित मोड़ों से भरी कहानियाँ।',
      seoTitle: 'Mystery Fiction | KahaniNest',
      seoDescription: 'Suspenseful mystery and thriller adult stories.',
      sortOrder: 4,
      colour: 'purple',
    },
    {
      name: 'Fantasy',
      slug: 'fantasy',
      description: 'काल्पनिक दुनिया, जादुई अहसास और अनोखे सफर।',
      seoTitle: 'Fantasy Stories | KahaniNest',
      seoDescription: 'Imaginative fantasy tales in Hindi.',
      sortOrder: 5,
      colour: 'indigo',
    },
    {
      name: 'Comedy',
      slug: 'comedy',
      description: 'हल्की-फुल्की, मनोरंजक और चेहरे पर मुस्कान लाने वाली कहानियाँ।',
      seoTitle: 'Comedy Stories | KahaniNest',
      seoDescription: 'Lighthearted and funny stories in Hindi and Hinglish.',
      sortOrder: 6,
      colour: 'emerald',
    },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories.push(createdCat);
  }
  console.log(`✅ ${categories.length} neutral categories seeded.`);

  // 3. Seed 25 SAMPLE Stories
  console.log('Creating 25 neutral SAMPLE stories for 10-per-page dynamic pagination testing...');

  const sampleTitles = [
    { hi: 'दिल के करीब एक शाम', en: 'A Close Evening' },
    { hi: 'सफर की नई दास्तान', en: 'New Journey Tale' },
    { hi: 'चाहत और खामोशी', en: 'Desire and Silence' },
    { hi: 'शहर की अनकही रातें', en: 'Untold Nights of the City' },
    { hi: 'हवाओं का रुख', en: 'Shift of Winds' },
    { hi: 'यादों के झरोखे', en: 'Windows of Memories' },
    { hi: 'रिश्तों की नई डोर', en: 'New Strings of Bonds' },
    { hi: 'कशमकश के दरमियां', en: 'Amidst Dilemmas' },
    { hi: 'चांदनी और बातें', en: 'Moonlight and Conversations' },
    { hi: 'अजनबी से हमसफर', en: 'Strangers to Companions' },
    { hi: 'उम्मीद की एक किरण', en: 'A Ray of Hope' },
    { hi: 'खुली खिड़की की हवा', en: 'Breeze from Open Window' },
    { hi: 'पुरानी डायरी के पन्ने', en: 'Pages of an Old Diary' },
    { hi: 'सपनों का आशियाना', en: 'Nest of Dreams' },
    { hi: 'दूरियां और नजदीकियां', en: 'Distances and Closeness' },
    { hi: 'एक मुलाकात जो बदल गई', en: 'A Meeting That Changed All' },
    { hi: 'धुंधली राहें साफ़ इरादे', en: 'Foggy Paths Clear Intentions' },
    { hi: 'रात का गहरा सन्नाटा', en: 'Deep Silence of Night' },
    { hi: 'हंसते मुस्कुराते लम्हे', en: 'Smiling Moments' },
    { hi: 'मन की उलझनें', en: 'Tangles of the Mind' },
    { hi: 'गुमनाम रास्तों का मुसाफिर', en: 'Traveler of Unknown Roads' },
    { hi: 'बारिश और गरम चाय', en: 'Rain and Hot Tea' },
    { hi: 'काले बादलों के पार', en: 'Beyond Dark Clouds' },
    { hi: 'आँखों में ठहरा सच', en: 'Truth Lingering in Eyes' },
    { hi: 'नई सुबह का पैगाम', en: 'Message of a New Dawn' },
  ];

  const now = new Date();

  for (let i = 0; i < 25; i++) {
    const slug = `sample-story-${i + 1}`;
    const category = categories[i % categories.length];
    const publishDate = new Date(now.getTime() - (25 - i) * 3600 * 1000 * 24);
    const titleObj = sampleTitles[i];

    const sampleContent = `
<p>यह एक <strong>SAMPLE</strong> परीक्षण कहानी है जो केवल वेबसाइट के लेआउट, फॉन्ट रेंडरिंग और पेजिनेशन के परीक्षण हेतु बनाई गई है। पात्र और घटनाएं पूर्णतः काल्पनिक हैं।</p>
<p>कमरे में हल्की धूप खिड़की से अंदर आ रही थी। मेज पर रखी चाय की प्याली से धुआं उठ रहा था। जिंदगी के कई अनसुलझे सवालों के बीच दोनों एक दूसरे की तरफ देख रहे थे।</p>
<p>"क्या सब कुछ पहले जैसा हो सकता है?" उसने पूछा। आवाज में एक ठहराव था, जैसे कई दिनों की सोच के बाद यह सवाल निकला हो।</p>
<p>सामने से मुस्कुराते हुए जवाब मिला, "समय बदलता है, पर सच्चाई और रिश्ते अपनी जगह मजबूत रहते हैं।" दोनों के बीच की खामोशी अब सुकून में बदल चुकी थी।</p>
`;

    await prisma.story.upsert({
      where: { slug },
      update: {
        title: `[SAMPLE] ${titleObj.hi}`,
        excerpt: `[SAMPLE] यह कहानी संख्या ${i + 1} है। ${titleObj.hi} - एक काल्पनिक और संजीदा वयस्क कथा।`,
        content: sampleContent,
        authorName: `लेखक ${['अमित शर्मा', 'रोहन वर्मा', 'प्रिया सिंह', 'नेहा कपूर', 'विकास मल्होत्रा'][i % 5]}`,
        status: StoryStatus.PUBLISHED,
        publishedAt: publishDate,
        categoryId: category.id,
        viewCount: (i + 1) * 42,
        likeCount: (i + 1) * 5,
        readingTimeMin: 4,
        adultContentConfirmed: true,
        seoTitle: `[SAMPLE] ${titleObj.hi} | KahaniNest`,
        seoDescription: `Read sample fiction story: ${titleObj.en} on KahaniNest.`,
      },
      create: {
        title: `[SAMPLE] ${titleObj.hi}`,
        slug,
        excerpt: `[SAMPLE] यह कहानी संख्या ${i + 1} है। ${titleObj.hi} - एक काल्पनिक और संजीदा वयस्क कथा।`,
        content: sampleContent,
        authorName: `लेखक ${['अमित शर्मा', 'रोहन वर्मा', 'प्रिया सिंह', 'नेहा कपूर', 'विकास मल्होत्रा'][i % 5]}`,
        status: StoryStatus.PUBLISHED,
        publishedAt: publishDate,
        categoryId: category.id,
        viewCount: (i + 1) * 42,
        likeCount: (i + 1) * 5,
        readingTimeMin: 4,
        adultContentConfirmed: true,
        seoTitle: `[SAMPLE] ${titleObj.hi} | KahaniNest`,
        seoDescription: `Read sample fiction story: ${titleObj.en} on KahaniNest.`,
      },
    });
  }
  console.log('✅ 25 SAMPLE stories seeded cleanly.');

  // 4. Seed Default SiteSettings
  const defaultSettings = [
    { key: 'adsEnabled', value: true },
    { key: 'commentAutoApprove', value: false },
    { key: 'maintenanceMode', value: false },
    { key: 'siteName', value: process.env.SITE_NAME || 'KahaniNest' },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('✅ Default site settings seeded.');

  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
