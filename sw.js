// sw.js - Service Worker corretto per PWA
const CACHE_NAME = 'timer-app-v3';
const urlsToCache = [
    '/faccende/',
    '/faccende/index.html',
    '/faccende/manifest.json',
    '/faccende/sw.js'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('SW: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('SW: Cache opened');
                return cache.addAll(urlsToCache).catch((error) => {
                    console.error('SW: Cache addAll failed:', error);
                    // Prova a cacheare i file uno per uno
                    return Promise.allSettled(
                        urlsToCache.map(url => cache.add(url))
                    );
                });
            })
            .catch((error) => {
                console.error('SW: Install failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('SW: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - strategia cache-first con network fallback
self.addEventListener('fetch', (event) => {
    // Ignora richieste non HTTP
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    // Ignora richieste cross-origin
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('SW: Serving from cache:', event.request.url);
                    return cachedResponse;
                }
                
                console.log('SW: Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then((response) => {
                        // Controlla se la risposta è valida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clona la risposta per la cache
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('SW: Fetch failed:', error);
                        
                        // Fallback per documenti HTML
                        if (event.request.destination === 'document') {
                            return caches.match('/faccende/index.html');
                        }
                        
                        // Fallback generico
                        throw error;
                    });
            })
            .catch((error) => {
                console.error('SW: Request failed:', error);
                
                // Fallback finale per documenti
                if (event.request.destination === 'document') {
                    return new Response(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Timer & Abitudini - Offline</title>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                body { 
                                    font-family: Arial, sans-serif; 
                                    text-align: center; 
                                    padding: 50px; 
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                    min-height: 100vh;
                                    margin: 0;
                                }
                                .container { 
                                    max-width: 400px; 
                                    margin: 0 auto; 
                                    background: rgba(255,255,255,0.1);
                                    padding: 30px;
                                    border-radius: 20px;
                                }
                                button {
                                    background: #4CAF50;
                                    color: white;
                                    border: none;
                                    padding: 15px 30px;
                                    border-radius: 10px;
                                    font-size: 16px;
                                    cursor: pointer;
                                    margin-top: 20px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>⏰ Timer & Abitudini</h1>
                                <h2>📱 App Offline</h2>
                                <p>L'app non è completamente disponibile offline.</p>
                                <p>Controlla la connessione internet e riprova.</p>
                                <button onclick="window.location.reload()">🔄 Ricarica</button>
                            </div>
                        </body>
                        </html>
                    `, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }
            })
    );
});

// Timer notifications
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TIMER_START') {
        const { startTime, duration, isWorkTime } = event.data;
        console.log('SW: Timer started:', { startTime, duration, isWorkTime });
        
        const timeLeft = duration * 1000;
        setTimeout(() => {
            showTimerCompleteNotification(isWorkTime);
        }, timeLeft);
    }
    
    if (event.data && event.data.type === 'TIMER_COMPLETE') {
        showTimerCompleteNotification(event.data.wasWorkTime, event.data.message);
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const action = event.action;
    let url = '/faccende/';
    
    if (action === 'start-break') {
        url = '/faccende/?action=start-break';
    } else if (action === 'start-work') {
        url = '/faccende/?action=start-work';
    }
    
    event.waitUntil(
        clients.matchAll({ type: 'window' })
            .then((clientList) => {
                // Cerca se c'è già una finestra aperta
                for (const client of clientList) {
                    if (client.url.includes('/faccende') && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Se non c'è, apri una nuova finestra
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

function showTimerCompleteNotification(wasWorkTime, customMessage = null) {
    const message = customMessage || (wasWorkTime ? 'Tempo di lavoro completato!' : 'Tempo di riposo completato!');
    const nextAction = wasWorkTime ? 'Inizia Pausa' : 'Inizia Lavoro';
    const nextActionKey = wasWorkTime ? 'start-break' : 'start-work';
    
    const options = {
        body: message,
        icon: '/faccende/icon-192.png',
        badge: '/faccende/icon-192.png',
        tag: 'timer-complete',
        requireInteraction: true,
        actions: [
            {
                action: nextActionKey,
                title: nextAction
            },
            {
                action: 'dismiss',
                title: 'Chiudi'
            }
        ],
        data: {
            wasWorkTime: wasWorkTime,
            timestamp: Date.now()
        },
        vibrate: [200, 100, 200, 100, 200]
    };
    
    self.registration.showNotification('⏰ Timer Completato!', options);
}

// Error handling
self.addEventListener('error', (event) => {
    console.error('SW: Error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('SW: Unhandled promise rejection:', event.reason);
});

console.log('SW: Service Worker loaded successfully');