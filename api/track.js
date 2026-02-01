// Analytics Tracking API
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'POST') {
            // Track a page visit
            const { page, referrer } = req.body;
            const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
            const userAgent = req.headers['user-agent'] || 'unknown';

            // Get country from IP using Vercel's geo headers
            const country = req.headers['x-vercel-ip-country'] || 'Unknown';
            const city = req.headers['x-vercel-ip-city'] || 'Unknown';

            // Get today's date as key
            const today = new Date().toISOString().split('T')[0];

            // Get existing analytics
            let analytics = await kv.get('analytics') || {
                totalVisits: 0,
                uniqueVisitors: new Set(),
                dailyVisits: {},
                countries: {},
                pages: {},
                referrers: {}
            };

            // Convert uniqueVisitors back to Set if it's an array
            if (Array.isArray(analytics.uniqueVisitors)) {
                analytics.uniqueVisitors = new Set(analytics.uniqueVisitors);
            }

            // Update total visits
            analytics.totalVisits += 1;

            // Track unique visitors by IP
            if (!analytics.uniqueVisitors.has(ip)) {
                analytics.uniqueVisitors.add(ip);
            }

            // Update daily visits
            analytics.dailyVisits[today] = (analytics.dailyVisits[today] || 0) + 1;

            // Update country stats
            analytics.countries[country] = (analytics.countries[country] || 0) + 1;

            // Update page stats
            const pageName = page || '/';
            analytics.pages[pageName] = (analytics.pages[pageName] || 0) + 1;

            // Update referrer stats
            if (referrer && referrer !== 'direct') {
                try {
                    const refDomain = new URL(referrer).hostname;
                    analytics.referrers[refDomain] = (analytics.referrers[refDomain] || 0) + 1;
                } catch {
                    analytics.referrers['direct'] = (analytics.referrers['direct'] || 0) + 1;
                }
            } else {
                analytics.referrers['direct'] = (analytics.referrers['direct'] || 0) + 1;
            }

            // Store visit log
            const visitLog = {
                timestamp: new Date().toISOString(),
                ip: ip.substring(0, ip.lastIndexOf('.')) + '.xxx', // Anonymize IP
                country,
                city,
                page: pageName,
                userAgent: userAgent.substring(0, 100),
                referrer: referrer || 'direct'
            };

            let recentVisits = await kv.get('recent_visits') || [];
            recentVisits.unshift(visitLog);
            recentVisits = recentVisits.slice(0, 100); // Keep last 100 visits
            await kv.set('recent_visits', recentVisits);

            // Convert Set to Array before storing
            const analyticsToStore = {
                ...analytics,
                uniqueVisitors: Array.from(analytics.uniqueVisitors)
            };
            await kv.set('analytics', analyticsToStore);

            return res.status(200).json({ success: true });
        }

        if (req.method === 'GET') {
            // Get analytics (protected)
            const adminPassword = process.env.ADMIN_PASSWORD || 'webflow2024';
            const authHeader = req.headers.authorization;

            if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const analytics = await kv.get('analytics') || {
                totalVisits: 0,
                uniqueVisitors: [],
                dailyVisits: {},
                countries: {},
                pages: {},
                referrers: {}
            };

            const recentVisits = await kv.get('recent_visits') || [];

            return res.status(200).json({
                ...analytics,
                uniqueVisitorsCount: Array.isArray(analytics.uniqueVisitors)
                    ? analytics.uniqueVisitors.length
                    : 0,
                recentVisits
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return res.status(500).json({ error: 'Failed to process analytics' });
    }
}
