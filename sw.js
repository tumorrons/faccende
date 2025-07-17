// sw.js - Service Worker per gestire il timer in background
const CACHE_NAME = 'timer-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aperta');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Background sync per timer
self.addEventListener('sync', (event) => {
    if (event.tag === 'timer-sync') {
        event.waitUntil(syncTimer());
    }
});

// Message handling per timer updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TIMER_START') {
        const { startTime, duration, isWorkTime } = event.data;
        
        // Salva lo stato del timer
        console.log('Timer avviato in background:', { startTime, duration, isWorkTime });
        
        // Programma notifica per quando il timer scade
        const timeLeft = duration * 1000; // converti in millisecondi
        setTimeout(() => {
            showTimerCompleteNotification(isWorkTime);
        }, timeLeft);
    }
    
    if (event.data && event.data.type === 'TIMER_COMPLETE') {
        // Mostra notifica quando il timer è completato
        showTimerCompleteNotification(event.data.wasWorkTime, event.data.message);
    }
});

// Gestione click su notifiche
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'start-break') {
        // Apri l'app e inizia la pausa
        event.waitUntil(
            clients.openWindow('/').then(client => {
                if (client) {
                    client.postMessage({ type: 'START_BREAK' });
                }
            })
        );
    } else if (event.action === 'start-work') {
        // Apri l'app e inizia il lavoro
        event.waitUntil(
            clients.openWindow('/').then(client => {
                if (client) {
                    client.postMessage({ type: 'START_WORK' });
                }
            })
        );
    } else {
        // Apri semplicemente l'app
        event.waitUntil(clients.openWindow('/'));
    }
});

// Funzione per mostrare notifica di completamento timer
function showTimerCompleteNotification(wasWorkTime, customMessage = null) {
    const message = customMessage || (wasWorkTime ? 'Tempo di lavoro completato!' : 'Tempo di riposo completato!');
    const nextAction = wasWorkTime ? 'Inizia Pausa' : 'Inizia Lavoro';
    const nextActionKey = wasWorkTime ? 'start-break' : 'start-work';
    
    self.registration.showNotification('⏰ Timer Completato!', {
        body: message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'timer-complete',
        requireInteraction: true,
        actions: [
            {
                action: nextActionKey,
                title: nextAction,
                icon: '/icon-192x192.png'
            },
            {
                action: 'dismiss',
                title: 'Chiudi',
                icon: '/icon-192x192.png'
            }
        ],
        data: {
            wasWorkTime: wasWorkTime,
            timestamp: Date.now()
        },
        vibrate: [200, 100, 200, 100, 200]
    });
}

// Funzione per sincronizzare il timer
function syncTimer() {
    return new Promise((resolve) => {
        console.log('Sincronizzazione timer in background');
        // Qui potresti aggiungere logica per sincronizzare con un server
        resolve();
    });
}

// Gestione degli errori
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

// Attivazione del service worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker attivato');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminazione cache vecchia:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Utility per formattare il tempo
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}