import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

async function testApifyMeta() {
    console.log("Testing Apify Meta...");
    try {
        const input = {
            "urls": [
                { "url": `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=cyrela&search_type=keyword_unordered&media_type=all` }
            ],
            "count": 1,
            "scrapePageAds.activeStatus": "all",
            "scrapePageAds.sortBy": "impressions_desc",
            "scrapePageAds.countryCode": "BR"
        };
        const run = await client.actor(process.env.APIFY_META_ACTOR_ID).call(input);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        console.log("Meta Apify items count:", items.length);
    } catch (e) {
        console.error("Error Meta Apify:", e.message);
    }
}

testApifyMeta();
