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

// 7 AI-generated items to upload to Cloudinary
const AI_ITEMS = [
    { file: 'plaid_mini_skirt_1772296281380.png', name: 'Pink Plaid Mini Skirt', category: 'Bottoms', color: 'pink', description: 'Cute Y2K high-waist pink and black plaid tartan mini skirt. Preppy and trendy.', aiHint: 'skirt bottoms pink preppy' },
    { file: 'denim_shorts_1772296296412.png', name: 'High-Waist Denim Shorts', category: 'Bottoms', color: 'blue', description: 'Classic light wash high-waist denim shorts with frayed hem. Perfect for summer.', aiHint: 'denim shorts bottoms summer' },
    { file: 'gym_leggings_1772296313362.png', name: 'Black Gym Leggings', category: 'Bottoms', color: 'black', description: 'Seamless high-waist black gym leggings with subtle texture. Essential activewear.', aiHint: 'gym leggings black activewear' },
    { file: 'sequin_party_dress_1772296343977.png', name: 'Silver Sequin Party Dress', category: 'Dresses', color: 'gray', description: 'Glamorous silver sequin body-con mini dress. Perfect for parties and NYE events.', aiHint: 'sequin party dress silver glamour' },
    { file: 'sports_bra_1772296360790.png', name: 'Lilac Sports Bra', category: 'Tops', color: 'purple', description: 'Stylish lilac purple criss-cross sports bra. Athleisure essential.', aiHint: 'sports bra purple activewear' },
    { file: 'satin_slip_dress_1772296377277.png', name: 'Champagne Satin Slip Dress', category: 'Dresses', color: 'beige', description: 'Elegant 90s-inspired champagne gold bias-cut satin slip dress with spaghetti straps.', aiHint: 'satin slip dress champagne party' },
    { file: 'white_crop_top_1772296415961.png', name: 'White Ribbed Crop Top', category: 'Tops', color: 'white', description: 'Cute ribbed square-neck white crop top. Trendy Y2K wardrobe staple.', aiHint: 'crop top white tops y2k trendy' },
];

// 3 items using Unsplash URLs (free, already whitelisted in next.config.ts)
const UNSPLASH_ITEMS = [
    {
        name: 'Boho Floral Maxi Skirt',
        category: 'Bottoms',
        color: 'brown',
        description: 'Flowy bohemian floral maxi skirt in earthy terracotta and sage green tones. Cottagecore romantic style.',
        aiHint: 'maxi skirt floral boho cottagecore',
        image_url: 'https://images.unsplash.com/photo-1583496661160-fb5218afa9a0?w=800&q=80',
    },
    {
        name: 'Sage Green Yoga Set',
        category: 'Tops',
        color: 'green',
        description: 'Matching sage green yoga set with sports bra and high-waist leggings. Minimalist athleisure.',
        aiHint: 'yoga set green activewear matching',
        image_url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    },
    {
        name: 'Pastel Pink Co-ord Set',
        category: 'Tops',
        color: 'pink',
        description: 'Aesthetic pastel pink matching co-ord set with blazer and mini skirt. Perfect for brunch or dates.',
        aiHint: 'pink coord set tops aesthetic',
        image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    },
];

async function uploadToCloudinary(filePath, name) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, {
            folder: 'smartdrobe/starters',
            overwrite: true,
            public_id: `aesthetic_${name.replace(/\s+/g, '_').toLowerCase()}`,
            transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' },
            ],
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
        });
    });
}

async function main() {
    // Get user
    const { data: profiles } = await supabase.from('profiles').select('id, display_name').limit(1);
    const userId = profiles?.[0]?.id;
    if (!userId) { console.log('❌ No users found. Sign up first.'); process.exit(1); }
    console.log(`\n✅ Seeding for: ${profiles[0].display_name}\n`);

    const rows = [];

    // Upload AI-generated images
    for (let i = 0; i < AI_ITEMS.length; i++) {
        const item = AI_ITEMS[i];
        const filePath = path.join(BRAIN_DIR, item.file);
        if (!fs.existsSync(filePath)) { console.log(`⚠️  Missing: ${item.file}`); continue; }
        process.stdout.write(`📤 [${i + 1}/${AI_ITEMS.length}] ${item.name}...`);
        try {
            const url = await uploadToCloudinary(filePath, item.name);
            console.log(' ✅');
            rows.push({ user_id: userId, name: item.name, category: item.category, color: item.color, colors: [item.color], description: item.description, image_url: url, ai_hint: `aesthetic ${item.aiHint}`, wear_count: 0, is_favorite: false });
        } catch (e) { console.log(` ❌ ${e.message}`); }
    }

    // Add Unsplash items directly (no upload needed)
    for (const item of UNSPLASH_ITEMS) {
        console.log(`🖼️  Adding ${item.name} (Unsplash)`);
        rows.push({ user_id: userId, name: item.name, category: item.category, color: item.color, colors: [item.color], description: item.description, image_url: item.image_url, ai_hint: `aesthetic ${item.aiHint}`, wear_count: 0, is_favorite: false });
    }

    console.log(`\n💾 Inserting ${rows.length} items into Supabase...`);
    const { error } = await supabase.from('wardrobe_items').insert(rows);
    if (error) { console.error('❌', error.message); process.exit(1); }
    console.log(`\n🎉 Done! ${rows.length} aesthetic items added. Open http://localhost:3000/closet\n`);
}

main().catch(console.error);
