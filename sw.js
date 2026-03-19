const VERSION = '1.0.6';

self.addEventListener('install', (event) => {
  console.log('SW: Установлений');
});

self.addEventListener('activate', (event) => {
  console.log('SW: Активований');
});

// слухаємо мережеві запити
self.addEventListener('fetch', (event) => {
  return;
});
