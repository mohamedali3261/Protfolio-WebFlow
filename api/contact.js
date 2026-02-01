// Contact Form API - Stores messages in Vercel KV
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, service, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create message object
        const messageData = {
            id: Date.now().toString(),
            name,
            email,
            service: service || 'other',
            message,
            createdAt: new Date().toISOString(),
            read: false,
            ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown'
        };

        // Get existing messages
        let messages = await kv.get('contact_messages') || [];
        
        // Add new message at the beginning
        messages.unshift(messageData);

        // Store back
        await kv.set('contact_messages', messages);

        // Update stats
        let stats = await kv.get('contact_stats') || { total: 0 };
        stats.total += 1;
        stats.lastMessage = new Date().toISOString();
        await kv.set('contact_stats', stats);

        return res.status(200).json({ 
            success: true, 
            message: 'تم إرسال رسالتك بنجاح!',
            messageEn: 'Your message has been sent successfully!'
        });

    } catch (error) {
        console.error('Contact API Error:', error);
        return res.status(500).json({ error: 'Failed to save message' });
    }
}
