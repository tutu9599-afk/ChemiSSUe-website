// Authentication utilities and components

import { Context } from 'hono';

// Simple password hashing (in production, use bcrypt or similar)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'chemissue_salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

// Generate session ID
export function generateSessionId(): string {
  return crypto.randomUUID();
}

// Get user from session
export async function getUserFromSession(c: Context, sessionId?: string) {
  if (!sessionId) return null;
  
  const { env } = c;
  const session = await env.DB.prepare(`
    SELECT s.*, u.id, u.username, u.email, u.full_name, u.role, u.profile_image
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > datetime('now') AND u.is_active = TRUE
  `).bind(sessionId).first();
  
  return session || null;
}

// Login component
export const LoginForm = () => (
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <img 
          src="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" 
          alt="ChemiSSUe Logo" 
          class="w-20 h-20 mx-auto mb-4"
        />
        <h2 class="text-3xl font-bold text-gray-900 mb-2">ChemiSSUe 로그인</h2>
        <p class="text-gray-600">소모임 회원 전용 페이지입니다</p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {/* Login Error Message */}
        <div id="loginError" class="hidden bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                로그인에 실패했습니다
              </h3>
              <div class="mt-2 text-sm text-red-700">
                <p id="loginErrorMessage">아이디 또는 비밀번호를 확인해 주세요.</p>
              </div>
            </div>
          </div>
        </div>

        <form id="loginForm" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              아이디 또는 이메일
            </label>
            <div class="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="아이디 또는 이메일을 입력하세요"
              />
            </div>
            <div class="field-error text-red-600 text-sm mt-1 hidden"></div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div class="field-error text-red-600 text-sm mt-1 hidden"></div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                로그인 상태 유지
              </label>
            </div>
            
            <div class="text-sm">
              <a href="/auth/forgot-password" class="font-medium text-primary-600 hover:text-primary-500">
                비밀번호를 잊으셨나요?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i class="fas fa-sign-in-alt text-primary-500 group-hover:text-primary-400"></i>
              </span>
              로그인
            </button>
          </div>

          <div class="text-center">
            <span class="text-gray-600">계정이 없으신가요?</span>
            <a href="/auth/register" class="font-medium text-primary-600 hover:text-primary-500 ml-1">
              회원가입
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
);

// Register component  
export const RegisterForm = () => (
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <img 
          src="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" 
          alt="ChemiSSUe Logo" 
          class="w-20 h-20 mx-auto mb-4"
        />
        <h2 class="text-3xl font-bold text-gray-900 mb-2">ChemiSSUe 회원가입</h2>
        <p class="text-gray-600">숭실대학교 화학공학과 학생만 가입 가능합니다</p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form id="registerForm" class="space-y-6">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">
              실명 *
            </label>
            <div class="mt-1">
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="실명을 입력하세요"
              />
            </div>
            <div class="field-error text-red-600 text-sm mt-1 hidden"></div>
          </div>

          <div>
            <label for="studentId" class="block text-sm font-medium text-gray-700">
              학번
            </label>
            <div class="mt-1">
              <input
                id="studentId"
                name="studentId"
                type="text"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="학번을 입력하세요 (선택사항)"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              이메일 *
            </label>
            <div class="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div class="field-error text-red-600 text-sm mt-1 hidden"></div>
          </div>

          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              아이디 *
            </label>
            <div class="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div class="field-error text-red-600 text-sm mt-1 hidden"></div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              비밀번호 *
            </label>
            <div class="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="비밀번호를 입력하세요 (최소 6자)"
              />
            </div>
            <div class="field-error text-red-600 text-sm mt-1 hidden"></div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              비밀번호 확인 *
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
            <div class="field-error text-red-600 text-sm mt-1 hidden"></div>
          </div>

          <div>
            <button
              type="submit"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i class="fas fa-user-plus text-primary-500 group-hover:text-primary-400"></i>
              </span>
              회원가입
            </button>
          </div>

          <div class="text-center">
            <span class="text-gray-600">이미 계정이 있으신가요?</span>
            <a href="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 ml-1">
              로그인
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
);

// User menu component
export const UserMenu = ({ user, notificationCount }: { user: any; notificationCount?: number }) => (
  <div class="relative ml-3">
    <div class="flex items-center space-x-3">
      {/* Notification Icon */}
      <div class="relative">
        <a href="/notifications" class="text-gray-700 hover:text-primary-600 transition-colors">
          <i class="fas fa-bell text-lg"></i>
          {notificationCount > 0 && (
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </a>
      </div>
      
      {/* User Avatar */}
      <button id="user-menu-button" class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
        <span class="sr-only">사용자 메뉴 열기</span>
        {user.profile_image ? (
          <img class="h-8 w-8 rounded-full" src={user.profile_image} alt={user.full_name} />
        ) : (
          <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
            <span class="text-sm font-medium text-white">{user.full_name.charAt(0)}</span>
          </div>
        )}
      </button>
    </div>
    
    <div id="user-menu" class="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div class="py-1">
        <div class="px-4 py-2 text-sm text-gray-700 border-b">
          <div class="font-medium">{user.full_name}</div>
          <div class="text-gray-500">{user.email}</div>
        </div>
        <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <i class="fas fa-user mr-2"></i>프로필
        </a>
        <a href="/messages" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <i class="fas fa-envelope mr-2"></i>메시지
        </a>
        <a href="/notifications" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <i class="fas fa-bell mr-2"></i>알림
          {notificationCount > 0 && (
            <span class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {notificationCount}
            </span>
          )}
        </a>
        {user.role === 'admin' && (
          <a href="/admin" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <i class="fas fa-cog mr-2"></i>관리자 패널
          </a>
        )}
        <div class="border-t">
          <button id="logout-btn" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <i class="fas fa-sign-out-alt mr-2"></i>로그아웃
          </button>
        </div>
      </div>
    </div>
  </div>
);