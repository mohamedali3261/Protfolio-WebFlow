// Admin Dashboard JavaScript
const API_BASE = '/api';
let authToken = '';
let currentMessages = [];
let currentFilter = 'all';
let analyticsData = null;

// DOM Elements
const loginModal = document.getElementById('loginModal');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const refreshBtn = document.getElementById('refreshBtn');
const logoutBtn = document.getElementById('logoutBtn');
const messageModal = document.getElementById('messageModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const savedToken = sessionStorage.getItem('adminToken');
    if (savedToken) {
        authToken = savedToken;
        showDashboard();
    }

    setupEventListeners();
    updateCurrentDate();
});

function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);

    // Navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            if (section) switchSection(section);
        });
    });

    // Logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });

    // Refresh
    refreshBtn.addEventListener('click', refreshData);

    // Filter tabs
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderMessages();
        });
    });

    // Close modal
    document.getElementById('closeModal').addEventListener('click', closeMessageModal);
    document.querySelector('.message-modal .modal-overlay').addEventListener('click', closeMessageModal);

    // Delete message
    document.getElementById('deleteMessage').addEventListener('click', deleteCurrentMessage);
}

function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ar-EG', options);
}

async function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;

    try {
        // Test the password by making a request to the messages API
        const response = await fetch(`${API_BASE}/messages`, {
            headers: {
                'Authorization': `Bearer ${password}`
            }
        });

        if (response.ok) {
            authToken = password;
            sessionStorage.setItem('adminToken', authToken);
            showDashboard();
        } else {
            loginError.textContent = 'كلمة المرور غير صحيحة';
        }
    } catch (error) {
        loginError.textContent = 'حدث خطأ. تأكد من الاتصال.';
    }
}

function handleLogout() {
    authToken = '';
    sessionStorage.removeItem('adminToken');
    loginModal.style.display = 'flex';
    dashboardContainer.style.display = 'none';
    document.getElementById('password').value = '';
}

function showDashboard() {
    loginModal.style.display = 'none';
    dashboardContainer.style.display = 'flex';
    loadDashboardData();
}

async function loadDashboardData() {
    refreshBtn.classList.add('loading');

    try {
        await Promise.all([
            loadMessages(),
            loadAnalytics()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
        refreshBtn.classList.remove('loading');
    }
}

async function loadMessages() {
    try {
        const response = await fetch(`${API_BASE}/messages`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentMessages = data.messages || [];

            // Update stats
            document.getElementById('totalMessages').textContent = currentMessages.length;

            // Update unread badge
            const unreadCount = currentMessages.filter(m => !m.read).length;
            document.getElementById('unreadBadge').textContent = unreadCount;

            renderMessages();
            renderRecentMessages();
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

async function loadAnalytics() {
    try {
        const response = await fetch(`${API_BASE}/track`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            analyticsData = await response.json();

            // Update stats
            document.getElementById('totalVisitors').textContent = analyticsData.totalVisits || 0;
            document.getElementById('uniqueVisitors').textContent = analyticsData.uniqueVisitorsCount || 0;

            const countriesCount = Object.keys(analyticsData.countries || {}).length;
            document.getElementById('totalCountries').textContent = countriesCount;

            renderCharts();
            renderCountries();
            renderPages();
            renderReferrers();
            renderVisitorsTable();
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

function renderMessages() {
    const container = document.getElementById('messagesList');

    let filtered = currentMessages;
    if (currentFilter === 'unread') {
        filtered = currentMessages.filter(m => !m.read);
    } else if (currentFilter === 'read') {
        filtered = currentMessages.filter(m => m.read);
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>لا توجد رسائل</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(msg => `
        <div class="message-card ${msg.read ? '' : 'unread'}" data-id="${msg.id}">
            <div class="message-header">
                <div class="message-sender">
                    <h4>${escapeHtml(msg.name)}</h4>
                    <p>${escapeHtml(msg.email)}</p>
                </div>
                <div class="message-meta">
                    <span class="message-date">${formatDate(msg.createdAt)}</span>
                    <span class="message-service">${getServiceLabel(msg.service)}</span>
                </div>
            </div>
            <p class="message-preview">${escapeHtml(msg.message)}</p>
        </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.message-card').forEach(card => {
        card.addEventListener('click', () => openMessage(card.dataset.id));
    });
}

function renderRecentMessages() {
    const container = document.getElementById('recentMessages');
    const recent = currentMessages.slice(0, 3);

    if (recent.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>لا توجد رسائل حتى الآن</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recent.map(msg => `
        <div class="message-card ${msg.read ? '' : 'unread'}" data-id="${msg.id}">
            <div class="message-header">
                <div class="message-sender">
                    <h4>${escapeHtml(msg.name)}</h4>
                    <p>${escapeHtml(msg.email)}</p>
                </div>
                <div class="message-meta">
                    <span class="message-date">${formatDate(msg.createdAt)}</span>
                </div>
            </div>
            <p class="message-preview">${escapeHtml(msg.message)}</p>
        </div>
    `).join('');

    container.querySelectorAll('.message-card').forEach(card => {
        card.addEventListener('click', () => {
            switchSection('messages');
            openMessage(card.dataset.id);
        });
    });
}

function renderCharts() {
    const dailyVisits = analyticsData?.dailyVisits || {};

    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }

    const maxVisits = Math.max(...days.map(d => dailyVisits[d] || 0), 1);

    // Daily chart
    const dailyChart = document.getElementById('dailyChart');
    dailyChart.innerHTML = days.map(day => {
        const visits = dailyVisits[day] || 0;
        const height = (visits / maxVisits) * 200;
        const dayName = new Date(day).toLocaleDateString('ar-EG', { weekday: 'short' });
        return `<div class="chart-bar" style="height: ${height}px" data-value="${visits}" data-label="${dayName}"></div>`;
    }).join('');

    // Weekly chart (larger version)
    const weeklyChart = document.getElementById('weeklyChart');
    weeklyChart.innerHTML = days.map(day => {
        const visits = dailyVisits[day] || 0;
        const height = (visits / maxVisits) * 250;
        const dayName = new Date(day).toLocaleDateString('ar-EG', { weekday: 'short', month: 'short', day: 'numeric' });
        return `<div class="chart-bar" style="height: ${height}px" data-value="${visits}" data-label="${dayName}"></div>`;
    }).join('');
}

function renderCountries() {
    const countries = analyticsData?.countries || {};
    const container = document.getElementById('countriesList');

    const sorted = Object.entries(countries).sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-globe"></i>
                <p>لا توجد بيانات</p>
            </div>
        `;
        return;
    }

    container.innerHTML = sorted.map(([country, count]) => `
        <div class="country-item">
            <div class="country-name">
                <span class="country-flag">${getCountryFlag(country)}</span>
                <span>${country}</span>
            </div>
            <span class="country-count">${count}</span>
        </div>
    `).join('');
}

function renderPages() {
    const pages = analyticsData?.pages || {};
    const container = document.getElementById('pagesList');

    const sorted = Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 10);

    if (sorted.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>لا توجد بيانات</p></div>`;
        return;
    }

    container.innerHTML = sorted.map(([page, count]) => `
        <div class="page-item">
            <span>${page}</span>
            <span class="country-count">${count}</span>
        </div>
    `).join('');
}

function renderReferrers() {
    const referrers = analyticsData?.referrers || {};
    const container = document.getElementById('referrersList');

    const sorted = Object.entries(referrers).sort((a, b) => b[1] - a[1]).slice(0, 10);

    if (sorted.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>لا توجد بيانات</p></div>`;
        return;
    }

    container.innerHTML = sorted.map(([referrer, count]) => `
        <div class="referrer-item">
            <span>${referrer}</span>
            <span class="country-count">${count}</span>
        </div>
    `).join('');
}

function renderVisitorsTable() {
    const visits = analyticsData?.recentVisits || [];
    const container = document.getElementById('visitorsTable');

    if (visits.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">لا توجد زيارات حتى الآن</td>
            </tr>
        `;
        return;
    }

    container.innerHTML = visits.slice(0, 50).map(visit => `
        <tr>
            <td>${formatDate(visit.timestamp)}</td>
            <td>${getCountryFlag(visit.country)} ${visit.country}</td>
            <td>${visit.city}</td>
            <td>${visit.page}</td>
            <td>${visit.referrer}</td>
        </tr>
    `).join('');
}

function openMessage(id) {
    const message = currentMessages.find(m => m.id === id);
    if (!message) return;

    // Mark as read
    if (!message.read) {
        markAsRead(id);
    }

    const detail = document.getElementById('messageDetail');
    detail.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">الاسم:</span>
            <span class="detail-value">${escapeHtml(message.name)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">البريد:</span>
            <span class="detail-value">${escapeHtml(message.email)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">نوع الخدمة:</span>
            <span class="detail-value">${getServiceLabel(message.service)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">التاريخ:</span>
            <span class="detail-value">${formatDate(message.createdAt)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">الرسالة:</span>
            <span class="detail-value message-text">${escapeHtml(message.message)}</span>
        </div>
    `;

    document.getElementById('replyEmail').href = `mailto:${message.email}?subject=رد على طلبك من Web Flow`;
    messageModal.dataset.currentId = id;
    messageModal.classList.add('active');
}

function closeMessageModal() {
    messageModal.classList.remove('active');
    messageModal.dataset.currentId = '';
}

async function markAsRead(id) {
    try {
        await fetch(`${API_BASE}/messages`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ messageId: id })
        });

        // Update local state
        const msg = currentMessages.find(m => m.id === id);
        if (msg) msg.read = true;

        // Update UI
        const unreadCount = currentMessages.filter(m => !m.read).length;
        document.getElementById('unreadBadge').textContent = unreadCount;
        renderMessages();
    } catch (error) {
        console.error('Error marking as read:', error);
    }
}

async function deleteCurrentMessage() {
    const id = messageModal.dataset.currentId;
    if (!id) return;

    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;

    try {
        await fetch(`${API_BASE}/messages`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ messageId: id })
        });

        // Update local state
        currentMessages = currentMessages.filter(m => m.id !== id);

        closeMessageModal();
        renderMessages();
        renderRecentMessages();

        document.getElementById('totalMessages').textContent = currentMessages.length;
        const unreadCount = currentMessages.filter(m => !m.read).length;
        document.getElementById('unreadBadge').textContent = unreadCount;
    } catch (error) {
        console.error('Error deleting message:', error);
    }
}

function switchSection(sectionId) {
    // Update nav
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Update sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });

    // Update title
    const titles = {
        overview: 'نظرة عامة',
        messages: 'الرسائل',
        analytics: 'الإحصائيات',
        visitors: 'الزوار'
    };
    document.getElementById('pageTitle').textContent = titles[sectionId] || 'لوحة التحكم';
}

function refreshData() {
    loadDashboardData();
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;

    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getServiceLabel(service) {
    const labels = {
        portfolio: 'صفحة بورتفوليو',
        pricing: 'صفحة عرض أسعار',
        landing: 'صفحة هبوط',
        company: 'موقع شركة',
        other: 'أخرى'
    };
    return labels[service] || service;
}

function getCountryFlag(country) {
    // Simple country to flag emoji mapping
    const flags = {
        'Egypt': '🇪🇬',
        'EG': '🇪🇬',
        'Saudi Arabia': '🇸🇦',
        'SA': '🇸🇦',
        'UAE': '🇦🇪',
        'AE': '🇦🇪',
        'Kuwait': '🇰🇼',
        'KW': '🇰🇼',
        'Qatar': '🇶🇦',
        'QA': '🇶🇦',
        'Bahrain': '🇧🇭',
        'BH': '🇧🇭',
        'Oman': '🇴🇲',
        'OM': '🇴🇲',
        'Jordan': '🇯🇴',
        'JO': '🇯🇴',
        'Lebanon': '🇱🇧',
        'LB': '🇱🇧',
        'Syria': '🇸🇾',
        'SY': '🇸🇾',
        'Iraq': '🇮🇶',
        'IQ': '🇮🇶',
        'Palestine': '🇵🇸',
        'PS': '🇵🇸',
        'Morocco': '🇲🇦',
        'MA': '🇲🇦',
        'Algeria': '🇩🇿',
        'DZ': '🇩🇿',
        'Tunisia': '🇹🇳',
        'TN': '🇹🇳',
        'Libya': '🇱🇾',
        'LY': '🇱🇾',
        'Sudan': '🇸🇩',
        'SD': '🇸🇩',
        'US': '🇺🇸',
        'United States': '🇺🇸',
        'UK': '🇬🇧',
        'United Kingdom': '🇬🇧',
        'Germany': '🇩🇪',
        'DE': '🇩🇪',
        'France': '🇫🇷',
        'FR': '🇫🇷',
        'Unknown': '🌍'
    };
    return flags[country] || '🌍';
}
