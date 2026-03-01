/**
 * Seed script: uploads 10 AI-generated outfit images to Cloudinary
 * and inserts them as wardrobe items in Supabase for the first user found.
 * 
 * Run: node seed-wardrobe.js <supabase_user_id>
 * Or:  node seed-wardrobe.js   (will prompt you to find your user ID)
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

const BRAIN_DIR = 'C:\\Users\\Maa\\.gemini\\antigravity\\brain\\e7132ce6-a81e-46f9-9cda-3df1a37bb31d';

const ITEMS = [
    {
        file: 'white_tshirt_1772295607010.png',
        name: 'Classic White T-Shirt',
        category: 'Tops',
        color: 'white',
        description: 'A clean, minimalist plain white cotton t-shirt. Versatile wardrobe essential.',
        aiHint: 'white tshirt tops casual',
    },
    {
        file: 'blue_jeans_1772295622850.png',
        name: 'Classic Blue Jeans',
        category: 'Bottoms',
        color: 'blue',
        description: 'Classic mid-rise straight-cut blue denim jeans. A wardrobe staple.',
        aiHint: 'blue jeans denim casual',
    },
    {
        file: 'black_blazer_1772295640115.png',
        name: 'Black Tailored Blazer',
        category: 'Outerwear',
        color: 'black',
        description: 'Slim-fit single-breasted black blazer. Perfect for formal and smart-casual occasions.',
        aiHint: 'black blazer formal outerwear',
    },
    {
        file: 'red_dress_1772295667836.png',
        name: 'Red Midi Dress',
        category: 'Dresses',
        color: 'red',
        description: 'Elegant red A-line sleeveless midi dress. Ideal for evening events and dinners.',
        aiHint: 'red dress midi elegant',
    },
    {
        file: 'navy_hoodie_1772295684548.png',
        name: 'Navy Blue Hoodie',
        category: 'Tops',
        color: 'blue',
        description: 'Comfortable navy blue pullover hoodie. Great for casual days and weekends.',
        aiHint: 'navy hoodie casual tops',
    },
    {
        file: 'beige_trench_1772295699075.png',
        name: 'Beige Trench Coat',
        category: 'Outerwear',
        color: 'beige',
        description: 'Classic double-breasted belted beige trench coat. Timeless outerwear staple.',
        aiHint: 'beige trench coat outerwear classic',
    },
    {
        file: 'white_sneakers_1772295724498.png',
        name: 'White Leather Sneakers',
        category: 'Shoes',
        color: 'white',
        description: 'Minimalist white leather low-top sneakers. Pairs with almost any outfit.',
        aiHint: 'white sneakers shoes casual',
    },
    {
        file: 'floral_blouse_1772295747035.png',
        name: 'Floral Print Blouse',
        category: 'Tops',
        color: 'pink',
        description: 'Feminine pink floral print v-neck blouse. Light and perfect for spring/summer.',
        aiHint: 'floral blouse tops feminine',
    },
    {
        file: 'denim_jacket_1772295769243.png',
        name: 'Classic Denim Jacket',
        category: 'Outerwear',
        color: 'blue',
        description: 'Slightly distressed classic blue denim jacket. Casual layering essential.',
        aiHint: 'denim jacket casual outerwear',
    },
    {
        file: 'black_formal_pants_1772295796210.png',
        name: 'Black Formal Trousers',
        category: 'Bottoms',
        color: 'black',
        description: 'Tailored straight-cut black formal dress trousers with pressed crease.',
        aiHint: 'black formal pants trousers bottoms',
    },
];

async function uploadToCloudinary(filePath, publicId) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filePath,
            {
                public_id: publicId,
                folder: 'smartdrobe/starters',
                overwrite: true,
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
    });
}

async function main() {
    // Get user ID
    let userId = process.argv[2];

    if (!userId) {
        // Find the first user in the profiles table
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, display_name')
            .limit(5);

        if (error || !profiles?.length) {
            console.log('\n❌ No users found. Please sign up first, then run:');
            console.log('   node seed-wardrobe.js YOUR_USER_ID\n');
            console.log('   Find your user ID at: Supabase → Authentication → Users');
            process.exit(1);
        }

        console.log('\n👥 Found users:');
        profiles.forEach((p, i) => console.log(`   ${i + 1}. ${p.display_name || 'Unknown'} — ${p.id}`));

        userId = profiles[0].id;
        console.log(`\n✅ Using user: ${profiles[0].display_name || userId}\n`);
    }

    // Check if items already seeded
    const { data: existing } = await supabase
        .from('wardrobe_items')
        .select('id')
        .eq('user_id', userId)
        .like('ai_hint', '%starter%')
        .limit(1);

    if (existing?.length) {
        console.log('⚠️  Starter items already seeded for this user. Skipping.\n');
        process.exit(0);
    }

    console.log('🚀 Uploading 10 outfit images to Cloudinary...\n');

    const rows = [];

    for (let i = 0; i < ITEMS.length; i++) {
        const item = ITEMS[i];
        const filePath = path.join(BRAIN_DIR, item.file);

        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  [${i + 1}/10] File not found: ${item.file} — skipping`);
            continue;
        }

        try {
            process.stdout.write(`📤 [${i + 1}/10] Uploading ${item.name}...`);
            const url = await uploadToCloudinary(filePath, `starter_${i + 1}_${item.name.replace(/\s+/g, '_').toLowerCase()}`);
            console.log(` ✅`);

            rows.push({
                user_id: userId,
                name: item.name,
                category: item.category,
                color: item.color,
                colors: [item.color],
                description: item.description,
                image_url: url,
                ai_hint: `starter ${item.aiHint}`,
                wear_count: 0,
                is_favorite: false,
            });
        } catch (err) {
            console.log(` ❌ Upload failed: ${err.message}`);
        }
    }

    if (rows.length === 0) {
        console.log('\n❌ No items to insert.\n');
        process.exit(1);
    }

    console.log(`\n💾 Inserting ${rows.length} items into Supabase...`);

    const { error: insertError } = await supabase
        .from('wardrobe_items')
        .insert(rows);

    if (insertError) {
        console.error('❌ Insert failed:', insertError.message);
        process.exit(1);
    }

    console.log(`\n🎉 Done! ${rows.length} starter wardrobe items added to your closet.`);
    console.log('   Open http://localhost:3000/closet to see them!\n');
}

main().catch(console.error);
