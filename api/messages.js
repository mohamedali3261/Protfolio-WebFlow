// Messages API - Retrieve stored messages (Protected)
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Simple password protection
    const adminPassword = process.env.ADMIN_PASSWORD || 'webflow2024';
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        if (req.method === 'GET') {
            // Get all messages
            const messages = await kv.get('contact_messages') || [];
            const stats = await kv.get('contact_stats') || { total: 0 };

            return res.status(200).json({
                messages,
                stats,
                count: messages.length
            });
        }

        if (req.method === 'PUT') {
            // Mark message as read
            const { messageId } = req.body;
            let messages = await kv.get('contact_messages') || [];

            messages = messages.map(msg =>
                msg.id === messageId ? { ...msg, read: true } : msg
            );

            await kv.set('contact_messages', messages);
            return res.status(200).json({ success: true });
        }

        if (req.method === 'DELETE') {
            // Delete message
            const { messageId } = req.body;
            let messages = await kv.get('contact_messages') || [];

            messages = messages.filter(msg => msg.id !== messageId);

            await kv.set('contact_messages', messages);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Messages API Error:', error);
        return res.status(500).json({ error: 'Failed to process request' });
    }
}
