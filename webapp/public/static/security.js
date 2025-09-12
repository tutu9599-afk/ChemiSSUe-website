// Security Protection Script for Non-Authenticated Users
// ChemiSSUe - Unauthorized Access Protection

(function() {
    'use strict';

    // Check if user is authenticated by looking for session cookie
    function isAuthenticated() {
        return document.cookie.includes('session_id=') && 
               document.cookie.split('session_id=')[1] && 
               document.cookie.split('session_id=')[1].split(';')[0].length > 0;
    }

    // Only apply security measures to non-authenticated users
    if (!isAuthenticated()) {
        console.log('🔒 Security measures activated for non-authenticated user');
        
        // 1. Screenshot Prevention
        function preventScreenshot() {
            // Add CSS to prevent screenshots on mobile
            const style = document.createElement('style');
            style.textContent = `
                * {
                    -webkit-user-select: none !important;
                    -moz-user-select: none !important;
                    -ms-user-select: none !important;
                    user-select: none !important;
                    -webkit-touch-callout: none !important;
                    -webkit-tap-highlight-color: transparent !important;
                }
                
                body {
                    -webkit-app-region: no-drag !important;
                }
                
                img, video, canvas {
                    -webkit-user-drag: none !important;
                    -moz-user-drag: none !important;
                    -ms-user-drag: none !important;
                    user-drag: none !important;
                    pointer-events: none !important;
                }
                
                /* Prevent print screen on some browsers */
                @media print {
                    * {
                        display: none !important;
                    }
                    body::after {
                        content: "이 페이지는 인쇄할 수 없습니다.";
                        display: block !important;
                        font-size: 24px;
                        text-align: center;
                        margin-top: 50px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // 2. Disable Right Click Context Menu
        function disableRightClick() {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showSecurityWarning('우클릭이 비활성화되어 있습니다.');
                return false;
            });
        }

        // 3. Prevent Drag and Drop
        function preventDragDrop() {
            document.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
            
            document.addEventListener('drop', function(e) {
                e.preventDefault();
                return false;
            });
        }

        // 4. Keyboard Security (Prevent common screenshot/save shortcuts)
        function preventKeyboardShortcuts() {
            document.addEventListener('keydown', function(e) {
                // Prevent F12 (Developer Tools)
                if (e.key === 'F12') {
                    e.preventDefault();
                    showSecurityWarning('개발자 도구 접근이 제한되어 있습니다.');
                    return false;
                }
                
                // Prevent Ctrl+Shift+I (Developer Tools)
                if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                    e.preventDefault();
                    showSecurityWarning('개발자 도구 접근이 제한되어 있습니다.');
                    return false;
                }
                
                // Prevent Ctrl+Shift+C (Element Inspector)
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    showSecurityWarning('요소 검사 기능이 제한되어 있습니다.');
                    return false;
                }
                
                // Prevent Ctrl+U (View Source)
                if (e.ctrlKey && e.key === 'u') {
                    e.preventDefault();
                    showSecurityWarning('소스 보기가 제한되어 있습니다.');
                    return false;
                }
                
                // Prevent Ctrl+S (Save Page)
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    showSecurityWarning('페이지 저장이 제한되어 있습니다.');
                    return false;
                }
                
                // Prevent Print Screen
                if (e.key === 'PrintScreen') {
                    e.preventDefault();
                    showSecurityWarning('화면 캡처가 제한되어 있습니다.');
                    return false;
                }
                
                // Prevent Ctrl+P (Print)
                if (e.ctrlKey && e.key === 'p') {
                    e.preventDefault();
                    showSecurityWarning('페이지 인쇄가 제한되어 있습니다.');
                    return false;
                }
                
                // Prevent Alt+Tab (might be used for screen capture tools)
                if (e.altKey && e.key === 'Tab') {
                    e.preventDefault();
                    return false;
                }
                
                // Prevent Windows+PrintScreen
                if (e.metaKey && e.key === 'PrintScreen') {
                    e.preventDefault();
                    showSecurityWarning('화면 캡처가 제한되어 있습니다.');
                    return false;
                }
            });
        }

        // 5. Developer Tools Detection
        function detectDevTools() {
            let devtools = {open: false, orientation: null};
            
            setInterval(function() {
                if (window.outerHeight - window.innerHeight > 200 || 
                    window.outerWidth - window.innerWidth > 200) {
                    if (!devtools.open) {
                        devtools.open = true;
                        showSecurityWarning('개발자 도구 사용이 감지되었습니다.');
                        // Redirect to login page
                        setTimeout(() => {
                            window.location.href = '/auth/login';
                        }, 2000);
                    }
                } else {
                    devtools.open = false;
                }
            }, 1000);
            
            // Console warning
            console.clear();
            console.log('%c🚫 WARNING! 경고!', 'color: red; font-size: 30px; font-weight: bold;');
            console.log('%c이 페이지는 보안이 적용되어 있습니다.', 'color: red; font-size: 16px;');
            console.log('%c로그인 후 이용해주세요.', 'color: red; font-size: 16px;');
        }

        // 6. Prevent Image/File Downloads
        function preventDownloads() {
            // Prevent image downloads
            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('dragstart', (e) => e.preventDefault());
                img.addEventListener('contextmenu', (e) => e.preventDefault());
            });
            
            // Prevent link downloads
            document.addEventListener('click', function(e) {
                const target = e.target;
                if (target.tagName === 'A' && (target.download || target.href.includes('download'))) {
                    e.preventDefault();
                    showSecurityWarning('파일 다운로드가 제한되어 있습니다. 로그인 후 이용해주세요.');
                    return false;
                }
            });
        }

        // 7. Blur content when window loses focus (prevent screenshot via other apps)
        function blurOnFocusLoss() {
            let blurTimer;
            
            window.addEventListener('blur', function() {
                blurTimer = setTimeout(() => {
                    document.body.style.filter = 'blur(10px)';
                    document.body.style.pointerEvents = 'none';
                    
                    // Show overlay
                    const overlay = document.createElement('div');
                    overlay.id = 'security-overlay';
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.8);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                        z-index: 999999;
                        text-align: center;
                    `;
                    overlay.innerHTML = `
                        <div>
                            <i class="fas fa-shield-alt" style="font-size: 48px; margin-bottom: 20px; display: block;"></i>
                            보안을 위해 화면이 보호되고 있습니다.<br>
                            다시 클릭하여 계속 이용하세요.
                        </div>
                    `;
                    document.body.appendChild(overlay);
                }, 100);
            });
            
            window.addEventListener('focus', function() {
                if (blurTimer) {
                    clearTimeout(blurTimer);
                }
                document.body.style.filter = '';
                document.body.style.pointerEvents = '';
                const overlay = document.getElementById('security-overlay');
                if (overlay) {
                    overlay.remove();
                }
            });
        }

        // Security Warning Modal
        function showSecurityWarning(message) {
            // Create modal if not exists
            if (!document.getElementById('security-warning-modal')) {
                const modal = document.createElement('div');
                modal.id = 'security-warning-modal';
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                modal.innerHTML = `
                    <div style="
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                        text-align: center;
                        max-width: 400px;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                    ">
                        <div style="color: #dc2626; font-size: 48px; margin-bottom: 15px;">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3 style="color: #dc2626; margin-bottom: 15px; font-size: 18px; font-weight: bold;">
                            보안 경고
                        </h3>
                        <p id="security-message" style="margin-bottom: 20px; color: #374151; line-height: 1.5;">
                            ${message}
                        </p>
                        <button onclick="document.getElementById('security-warning-modal').style.display='none'" 
                            style="
                                background: #2563eb;
                                color: white;
                                border: none;
                                padding: 10px 20px;
                                border-radius: 5px;
                                cursor: pointer;
                                font-weight: bold;
                            ">
                            확인
                        </button>
                    </div>
                `;
                
                document.body.appendChild(modal);
            }
            
            // Show modal
            const modal = document.getElementById('security-warning-modal');
            const messageElement = document.getElementById('security-message');
            messageElement.textContent = message;
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
            
            // Auto hide after 3 seconds
            setTimeout(() => {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }, 3000);
        }

        // Initialize all security measures
        function initSecurity() {
            preventScreenshot();
            disableRightClick();
            preventDragDrop();
            preventKeyboardShortcuts();
            detectDevTools();
            preventDownloads();
            blurOnFocusLoss();
            
            // Show initial security notice
            setTimeout(() => {
                console.log('🔒 ChemiSSUe 보안 시스템이 활성화되었습니다.');
                console.log('📱 더 많은 기능을 이용하려면 로그인해주세요: /auth/login');
            }, 1000);
        }

        // Start security when page is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSecurity);
        } else {
            initSecurity();
        }
        
    } else {
        console.log('✅ 인증된 사용자 - 보안 제한 없음');
    }

})();