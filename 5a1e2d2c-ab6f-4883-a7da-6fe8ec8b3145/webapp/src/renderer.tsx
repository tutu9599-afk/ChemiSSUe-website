import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title ? `${title} - ChemiSSUe` : 'ChemiSSUe - 숭실대학교 화학공학과 소모임'}</title>
        <meta name="description" content="숭실대학교 화학공학과 소모임 ChemiSSUe 공식 홈페이지입니다." />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" href="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" />
        <link rel="apple-touch-icon" href="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" />
        
        {/* Tailwind CSS */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* Font Awesome Icons */}
        <link 
          href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" 
          rel="stylesheet" 
        />
        
        {/* Custom CSS */}
        <link href="/static/style.css" rel="stylesheet" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChemiSSUe" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* iOS Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" />
        <link rel="apple-touch-icon" sizes="152x152" href="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" />
        <link rel="apple-touch-icon" sizes="144x144" href="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" />
        <link rel="apple-touch-icon" sizes="120x120" href="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" />
        
        {/* Splash Screens for iOS */}
        <link rel="apple-touch-startup-image" href="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        
        {/* Android Chrome */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="background-color" content="#ffffff" />
        
        {/* Tailwind Config */}
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: {
                      50: '#eff6ff',
                      500: '#3b82f6',
                      600: '#2563eb',
                      700: '#1d4ed8'
                    },
                    secondary: {
                      50: '#f0f9ff',
                      500: '#06b6d4',
                      600: '#0891b2'
                    }
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body class="bg-gray-50 min-h-screen">
        {children}
        
        {/* JavaScript */}
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
        {/* Security Protection for Non-Authenticated Users */}
        <script src="/static/security.js"></script>
        
        {/* PWA Service Worker */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Register service worker
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', async () => {
                try {
                  const registration = await navigator.serviceWorker.register('/sw.js');
                  console.log('SW registered successfully:', registration.scope);
                  
                  // Listen for updates
                  registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                      newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                          // Show update notification
                          const updateBanner = document.createElement('div');
                          updateBanner.className = 'fixed top-0 left-0 right-0 bg-primary-600 text-white p-3 text-center z-50';
                          updateBanner.innerHTML = \`
                            <span>새 버전이 사용 가능합니다.</span>
                            <button onclick="window.location.reload()" class="ml-4 bg-white text-primary-600 px-3 py-1 rounded text-sm">
                              업데이트
                            </button>
                          \`;
                          document.body.insertBefore(updateBanner, document.body.firstChild);
                        }
                      });
                    }
                  });
                } catch (error) {
                  console.log('SW registration failed:', error);
                }
              });
            }
            
            // PWA Install Prompt
            let deferredPrompt;
            window.addEventListener('beforeinstallprompt', (e) => {
              e.preventDefault();
              deferredPrompt = e;
              
              // Show install button
              const installButton = document.createElement('button');
              installButton.className = 'fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-primary-700 transition-colors';
              installButton.innerHTML = '<i class="fas fa-download"></i>';
              installButton.title = 'ChemiSSUe 앱 설치';
              
              installButton.addEventListener('click', async () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  const result = await deferredPrompt.userChoice;
                  console.log('User choice:', result);
                  deferredPrompt = null;
                  installButton.remove();
                }
              });
              
              document.body.appendChild(installButton);
            });
            
            // Hide install button when app is installed
            window.addEventListener('appinstalled', () => {
              console.log('ChemiSSUe PWA was installed');
              deferredPrompt = null;
              const installButton = document.querySelector('.fixed.bottom-4.right-4');
              if (installButton) installButton.remove();
            });
          `
        }} />
      </body>
    </html>
  )
})
