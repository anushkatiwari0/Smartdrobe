// Uses supabase-js with service_role to bootstrap the schema
// via individual REST operations where possible, then reports what needs manual SQL
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function checkTable(name) {
    const { data, error } = await supabase
        .from(name)
        .select('*')
        .limit(1);
    return !error;
}

async function main() {
    console.log('🔍 Checking which tables already exist in your Supabase database...\n');

    const tables = [
        'profiles',
        'user_preferences',
        'wardrobe_items',
        'outfit_recommendations',
        'saved_outfits',
        'outfit_history',
    ];

    const missing = [];
    const existing = [];

    for (const table of tables) {
        const exists = await checkTable(table);
        if (exists) {
            existing.push(table);
            console.log(`✅ ${table} — already exists`);
        } else {
            missing.push(table);
            console.log(`❌ ${table} — MISSING`);
        }
    }

    console.log('\n');

    if (missing.length === 0) {
        console.log('🎉 ALL TABLES EXIST! Your database is ready.');
        console.log('   Run: npm run dev');
    } else {
        console.log(`⚠️  ${missing.length} tables are missing: ${missing.join(', ')}`);
        console.log('\n📋 WHAT TO DO:');
        console.log('   The SQL Management API requires a personal Supabase access token.');
        console.log('   Please do ONE of these options:\n');
        console.log('   OPTION A (easiest): Go to your Supabase dashboard SQL Editor and paste the SQL.');
        console.log('   Direct link: https://supabase.com/dashboard/project/tdsloigobofmvcqlgkgk/sql/new\n');
        console.log('   OPTION B: Get your personal access token from:');
        console.log('   https://supabase.com/dashboard/account/tokens');
        console.log('   Then run: node run-schema.js YOUR_TOKEN_HERE\n');
    }
}

// Check if token provided as argument
const token = process.argv[2];
if (token) {
    // Re-run with management API using the personal token
    const fs = require('fs');
    const sql = fs.readFileSync('docs/schema.sql', 'utf8');

    fetch(`https://api.supabase.com/v1/projects/tdsloigobofmvcqlgkgk/database/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query: sql }),
    }).then(async (res) => {
        const data = await res.text();
        if (res.status >= 200 && res.status < 300) {
            console.log('🎉 Schema created successfully! Run: npm run dev');
        } else {
            console.log('❌ Failed:', res.status, data.slice(0, 300));
        }
    }).catch(console.error);
} else {
    main().catch(console.error);
}
