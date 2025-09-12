// ChemiSSUe Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        document.querySelectorAll('.alert-auto-hide').forEach(alert => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        });
    }, 5000);
    
    // Form validation helper
    function validateForm(formElement) {
        let isValid = true;
        const requiredFields = formElement.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const errorElement = field.parentNode.querySelector('.field-error');
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
                if (errorElement) {
                    errorElement.textContent = '이 필드는 필수입니다.';
                    errorElement.classList.remove('hidden');
                }
            } else {
                field.classList.remove('border-red-500');
                if (errorElement) {
                    errorElement.classList.add('hidden');
                }
            }
        });
        
        return isValid;
    }
    
    // API helper functions
    window.ChemiSSUeAPI = {
        // Generic API request handler
        async request(url, options = {}) {
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            try {
                const response = await fetch(url, { ...defaultOptions, ...options });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
            } catch (error) {
                console.error('API request failed:', error);
                throw error;
            }
        },
        
        // Get posts by category
        async getPosts(category, page = 1, limit = 10) {
            return this.request(`/api/posts?category=${category}&page=${page}&limit=${limit}`);
        },
        
        // Get single post
        async getPost(id) {
            return this.request(`/api/posts/${id}`);
        },
        
        // Create new post
        async createPost(postData) {
            return this.request('/api/posts', {
                method: 'POST',
                body: JSON.stringify(postData)
            });
        },
        
        // Get events
        async getEvents() {
            return this.request('/api/events');
        },
        
        // Get meeting minutes
        async getMeetingMinutes() {
            return this.request('/api/meetings');
        }
    };
    
    // Utility functions
    window.ChemiSSUeUtils = {
        // Format date for Korean locale
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short'
            });
        },
        
        // Format datetime for Korean locale
        formatDateTime(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        // Truncate text
        truncate(text, length = 100) {
            return text.length > length ? text.substring(0, length) + '...' : text;
        },
        
        // Show loading state
        showLoading(element) {
            element.innerHTML = '<div class="flex justify-center"><div class="spinner"></div></div>';
        },
        
        // Show error message
        showError(element, message) {
            element.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <i class="fas fa-exclamation-triangle text-red-600 text-2xl mb-2"></i>
                    <p class="text-red-800">${message}</p>
                </div>
            `;
        },
        
        // Show success message
        showSuccess(message) {
            const alert = document.createElement('div');
            alert.className = 'fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 alert-auto-hide';
            alert.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check-circle mr-2"></i>
                    <span>${message}</span>
                </div>
            `;
            document.body.appendChild(alert);
        },
        
        // Debounce function
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };
    
    // Initialize any page-specific functionality
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('/board/')) {
        // Board page specific initialization
        initializeBoardPage();
    }
    
    // Initialize authentication
    initializeAuth();
    
    console.log('ChemiSSUe website initialized successfully! 🧪');
});

// Authentication initialization
function initializeAuth() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(loginForm);
            const loginData = {
                username: formData.get('username'),
                password: formData.get('password'),
                rememberMe: formData.get('remember-me') === 'on'
            };
            
            try {
                const response = await window.ChemiSSUeAPI.request('/api/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(loginData)
                });
                
                if (response.success) {
                    window.ChemiSSUeUtils.showSuccess('로그인되었습니다!');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                } else {
                    throw new Error(response.error);
                }
            } catch (error) {
                window.ChemiSSUeUtils.showError(
                    loginForm.querySelector('.field-error') || loginForm,
                    error.message || '로그인에 실패했습니다.'
                );
            }
        });
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(registerForm);
            const registerData = {
                fullName: formData.get('fullName'),
                studentId: formData.get('studentId'),
                email: formData.get('email'),
                username: formData.get('username'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword')
            };
            
            // Client-side validation
            if (registerData.password !== registerData.confirmPassword) {
                window.ChemiSSUeUtils.showError(
                    registerForm,
                    '비밀번호가 일치하지 않습니다.'
                );
                return;
            }
            
            if (registerData.password.length < 6) {
                window.ChemiSSUeUtils.showError(
                    registerForm,
                    '비밀번호는 최소 6자 이상이어야 합니다.'
                );
                return;
            }
            
            try {
                const response = await window.ChemiSSUeAPI.request('/api/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(registerData)
                });
                
                if (response.success) {
                    window.ChemiSSUeUtils.showSuccess('회원가입이 완료되었습니다!');
                    setTimeout(() => {
                        window.location.href = '/auth/login';
                    }, 2000);
                } else {
                    throw new Error(response.error);
                }
            } catch (error) {
                window.ChemiSSUeUtils.showError(
                    registerForm,
                    error.message || '회원가입에 실패했습니다.'
                );
            }
        });
    }
    
    // Logout button handlers
    const logoutBtns = document.querySelectorAll('#logout-btn, #mobile-logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            try {
                await window.ChemiSSUeAPI.request('/api/auth/logout', {
                    method: 'POST'
                });
                
                window.ChemiSSUeUtils.showSuccess('로그아웃되었습니다.');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    });
    
    // User menu toggle
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', function() {
            userMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
                userMenu.classList.add('hidden');
            }
        });
    }
}

// File upload utilities
window.ChemiSSUeFileUpload = {
    // Upload single file
    async uploadFile(file, purpose = 'general') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('purpose', purpose);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('File upload failed:', error);
            throw error;
        }
    },
    
    // Create file upload widget
    createUploadWidget(container, options = {}) {
        const {
            multiple = false,
            accept = 'image/*,.pdf,.doc,.docx,.txt',
            maxSize = 10 * 1024 * 1024, // 10MB
            purpose = 'general',
            onUpload = () => {},
            onError = () => {}
        } = options;
        
        const widget = document.createElement('div');
        widget.className = 'file-upload-widget border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors';
        
        widget.innerHTML = `
            <input type="file" class="hidden" ${multiple ? 'multiple' : ''} accept="${accept}">
            <div class="upload-content">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
                <p class="text-sm text-gray-500">최대 ${Math.round(maxSize / 1024 / 1024)}MB</p>
            </div>
            <div class="upload-progress hidden">
                <div class="bg-gray-200 rounded-full h-2 mb-2">
                    <div class="bg-primary-600 h-2 rounded-full" style="width: 0%"></div>
                </div>
                <p class="text-sm text-gray-600">업로드 중...</p>
            </div>
        `;
        
        const fileInput = widget.querySelector('input[type="file"]');
        const uploadContent = widget.querySelector('.upload-content');
        const uploadProgress = widget.querySelector('.upload-progress');
        const progressBar = widget.querySelector('.bg-primary-600');
        
        // File selection handler
        const handleFiles = async (files) => {
            if (files.length === 0) return;
            
            uploadContent.classList.add('hidden');
            uploadProgress.classList.remove('hidden');
            
            try {
                const uploadPromises = Array.from(files).map(async (file) => {
                    if (file.size > maxSize) {
                        throw new Error(`파일 크기가 너무 큽니다: ${file.name}`);
                    }
                    
                    return await window.ChemiSSUeFileUpload.uploadFile(file, purpose);
                });
                
                const results = await Promise.all(uploadPromises);
                onUpload(results);
                
                // Reset widget
                uploadContent.classList.remove('hidden');
                uploadProgress.classList.add('hidden');
                progressBar.style.width = '0%';
                
            } catch (error) {
                onError(error);
                uploadContent.classList.remove('hidden');
                uploadProgress.classList.add('hidden');
            }
        };
        
        // Click to upload
        widget.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
        
        // Drag and drop
        widget.addEventListener('dragover', (e) => {
            e.preventDefault();
            widget.classList.add('border-primary-500', 'bg-primary-50');
        });
        
        widget.addEventListener('dragleave', (e) => {
            e.preventDefault();
            widget.classList.remove('border-primary-500', 'bg-primary-50');
        });
        
        widget.addEventListener('drop', (e) => {
            e.preventDefault();
            widget.classList.remove('border-primary-500', 'bg-primary-50');
            handleFiles(e.dataTransfer.files);
        });
        
        container.appendChild(widget);
        return widget;
    }
};

// Board page initialization
function initializeBoardPage() {
    // Add search functionality
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', 
            window.ChemiSSUeUtils.debounce(function(e) {
                // Implement search functionality
                console.log('Searching for:', e.target.value);
            }, 300)
        );
    }
    
    // Add pagination functionality
    const paginationLinks = document.querySelectorAll('.pagination-link');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            loadPage(page);
        });
    });
}

// Load page content dynamically
async function loadPage(page) {
    const container = document.querySelector('#content-container');
    if (!container) return;
    
    try {
        window.ChemiSSUeUtils.showLoading(container);
        
        // Get current category from URL
        const pathParts = window.location.pathname.split('/');
        const category = pathParts[2] || 'board';
        
        const data = await window.ChemiSSUeAPI.getPosts(category, page);
        
        // Update content (this would be implemented based on specific needs)
        renderPosts(container, data);
        
        // Update URL without page reload
        const newUrl = `${window.location.pathname}?page=${page}`;
        window.history.pushState({ page }, '', newUrl);
        
    } catch (error) {
        window.ChemiSSUeUtils.showError(container, '페이지를 불러오는데 실패했습니다.');
    }
}

// Render posts (placeholder implementation)
function renderPosts(container, data) {
    // This would be implemented based on the specific board layout
    console.log('Rendering posts:', data);
}