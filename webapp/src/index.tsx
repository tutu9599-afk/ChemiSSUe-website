import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { renderer } from './renderer'
import { 
  LoginForm, 
  RegisterForm, 
  UserMenu, 
  hashPassword, 
  verifyPassword, 
  generateSessionId, 
  getUserFromSession 
} from './auth'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS middleware for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Authentication middleware
app.use('*', async (c, next) => {
  const sessionId = getCookie(c, 'session_id');
  const user = sessionId ? await getUserFromSession(c, sessionId) : null;
  c.set('user', user);
  await next();
});

// Renderer middleware
app.use(renderer)

// Layout Component with Dynamic Footer
const Layout = ({ children, user, footerSettings }: { children: any; user?: any; footerSettings?: any }) => (
  <div class="min-h-screen bg-gray-50">
    {/* Navigation */}
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <a href="/" class="text-2xl font-bold text-primary-600 flex items-center">
                <img 
                  src="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" 
                  alt="ChemiSSUe Logo" 
                  class="w-8 h-8 mr-2"
                />
                ChemiSSUe
              </a>
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <a href="/" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  홈
                </a>
                <a href="/about" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  소개
                </a>
                <div class="relative group">
                  <button class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                    게시판
                    <i class="fas fa-chevron-down ml-1 text-xs"></i>
                  </button>
                  <div class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div class="py-1">
                      <a href="/board/notices" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">공지사항</a>
                      <a href="/board/photos" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">활동사진</a>
                      <a href="/board/schedule" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">일정표</a>
                      <a href="/board/meetings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">회의록</a>
                      <a href="/board/board" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">게시판</a>
                      <a href="/board/suggestions" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">건의사항</a>
                      <a href="/board/promotion" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">홍보자료</a>
                      <a href="/board/letters" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">마음의 편지</a>
                      <a href="/board/resources" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">자료실</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* User Menu or Login */}
          <div class="flex items-center">
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div class="hidden md:flex items-center space-x-4">
                <a href="/auth/login" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  로그인
                </a>
                <a href="/auth/register" class="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">
                  회원가입
                </a>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div class="md:hidden ml-2">
              <button id="mobile-menu-btn" class="text-gray-700 hover:text-primary-600 focus:outline-none">
                <i class="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div id="mobile-menu" class="md:hidden hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="/" class="block px-3 py-2 text-gray-700 hover:text-primary-600">홈</a>
            <a href="/about" class="block px-3 py-2 text-gray-700 hover:text-primary-600">소개</a>
            <div class="pl-3">
              <p class="text-gray-500 text-sm font-medium mb-2">게시판</p>
              <a href="/board/notices" class="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600">공지사항</a>
              <a href="/board/photos" class="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600">활동사진</a>
              <a href="/board/schedule" class="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600">일정표</a>
              <a href="/board/meetings" class="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600">회의록</a>
              <a href="/board/board" class="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600">게시판</a>
              <a href="/board/suggestions" class="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600">건의사항</a>
              <a href="/board/promotion" class="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600">홍보자료</a>
              <a href="/board/letters" class="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600">마음의 편지</a>
              <a href="/board/resources" class="block px-3 py-1 text-sm text-gray-600 hover:text-primary-600">자료실</a>
            </div>
            
            {/* Mobile Auth Menu */}
            {user ? (
              <div class="border-t pt-2">
                <div class="px-3 py-2">
                  <div class="text-sm font-medium text-gray-900">{user.full_name}</div>
                  <div class="text-sm text-gray-500">{user.email}</div>
                </div>
                <a href="/profile" class="block px-3 py-2 text-gray-700 hover:text-primary-600">프로필</a>
                <a href="/notifications" class="block px-3 py-2 text-gray-700 hover:text-primary-600">알림</a>
                {user.role === 'admin' && (
                  <a href="/admin" class="block px-3 py-2 text-gray-700 hover:text-primary-600">관리자 패널</a>
                )}
                <button id="mobile-logout-btn" class="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600">로그아웃</button>
              </div>
            ) : (
              <div class="border-t pt-2 space-y-1">
                <a href="/auth/login" class="block px-3 py-2 text-gray-700 hover:text-primary-600">로그인</a>
                <a href="/auth/register" class="block px-3 py-2 bg-primary-600 text-white rounded-md mx-3">회원가입</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Main Content */}
    <main>
      {children}
    </main>

    {/* Footer */}
    <footer class="bg-gray-800 text-white">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <img 
                src="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" 
                alt="ChemiSSUe Logo" 
                class="w-8 h-8 mr-2"
              />
              <h3 class="text-xl font-bold">ChemiSSUe</h3>
            </div>
            <p class="text-gray-400">
              {footerSettings?.description ? 
                footerSettings.description.split('\n').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    {i < footerSettings.description.split('\n').length - 1 && <br />}
                  </span>
                )) : 
                <>숭실대학교 화학공학과 소모임<br />함께 성장하고 소통하는 공간</>
              }
            </p>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">빠른 링크</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="/board/notices" class="hover:text-white transition-colors">공지사항</a></li>
              <li><a href="/board/photos" class="hover:text-white transition-colors">활동사진</a></li>
              <li><a href="/board/schedule" class="hover:text-white transition-colors">일정표</a></li>
              <li><a href="/board/meetings" class="hover:text-white transition-colors">회의록</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-lg font-semibold mb-4">연락처</h4>
            <div class="space-y-2 text-gray-400">
              {footerSettings?.contact_university && (
                <p class="flex items-center">
                  <i class="fas fa-university w-5 mr-2"></i>
                  {footerSettings.contact_university}
                </p>
              )}
              {footerSettings?.contact_email && (
                <p class="flex items-center">
                  <i class="fas fa-envelope w-5 mr-2"></i>
                  {footerSettings.contact_email}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>{footerSettings?.copyright || '© 2024 ChemiSSUe. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  </div>
)

// Home Page
app.get('/', async (c) => {
  const { env } = c;
  
  try {
    // Get featured posts
    const featuredPosts = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = 1
      ORDER BY p.created_at DESC
      LIMIT 3
    `).all();
    
    // Get recent events
    const upcomingEvents = await env.DB.prepare(`
      SELECT *
      FROM events
      WHERE start_date >= datetime('now')
      ORDER BY start_date ASC
      LIMIT 3
    `).all();

    // Get footer settings
    const footerSettingsResult = await env.DB.prepare(`
      SELECT section, content FROM footer_settings WHERE is_active = 1
    `).all();
    
    const footerSettings = footerSettingsResult.results.reduce((acc: any, setting: any) => {
      acc[setting.section] = setting.content;
      return acc;
    }, {});

    const user = c.get('user');
    
    return c.render(
      <Layout user={user} footerSettings={footerSettings}>
        {/* Hero Section */}
        <section class="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div class="text-center">
              {/* Logo */}
              <div class="mb-8">
                <img 
                  src="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" 
                  alt="ChemiSSUe Logo" 
                  class="w-40 h-40 md:w-48 md:h-48 mx-auto mb-6 drop-shadow-lg"
                />
              </div>
              <h1 class="text-4xl md:text-6xl font-bold mb-6">
                ChemiSSUe
              </h1>
              <p class="text-xl md:text-2xl mb-8 text-blue-100">
                Chemical Engineering Club at Soongsil University
              </p>
              <p class="text-lg mb-10 text-blue-50 max-w-3xl mx-auto">
                함께 성장하고 소통하며, 화학공학의 꿈을 키워나가는 공간입니다.<br />
                다양한 활동과 스터디를 통해 전공 지식을 쌓고 소중한 인연을 만들어보세요.
              </p>
              <div class="space-x-4">
                <a href="/about" class="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
                  소모임 소개
                </a>
                <a href="/board/photos" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-block">
                  활동 갤러리
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section class="py-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                <i class="fas fa-star text-yellow-400 mr-2"></i>
                주요 소식
              </h2>
              <p class="text-gray-600">ChemiSSUe의 최신 소식과 중요한 공지사항을 확인하세요</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.results.map((post: any) => (
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="p-6">
                    <div class="flex items-center mb-3">
                      <span class="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category_name}
                      </span>
                    </div>
                    <h3 class="text-xl font-semibold mb-3 text-gray-900">
                      <a href={`/board/${post.category_slug}/${post.id}`} class="hover:text-primary-600 transition-colors">
                        {post.title}
                      </a>
                    </h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                      {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                    </p>
                    <div class="flex items-center justify-between text-sm text-gray-500">
                      <span class="flex items-center">
                        <i class="fas fa-user mr-1"></i>
                        {post.author}
                      </span>
                      <span class="flex items-center">
                        <i class="fas fa-clock mr-1"></i>
                        {new Date(post.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div class="text-center mt-10">
              <a href="/board/notices" class="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-block">
                더 많은 소식 보기
              </a>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section class="bg-white py-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                <i class="fas fa-calendar-alt text-secondary-500 mr-2"></i>
                다가오는 일정
              </h2>
              <p class="text-gray-600">놓치면 안 되는 중요한 일정들을 확인하세요</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.results.map((event: any) => (
                <div class="border border-gray-200 rounded-lg p-6 hover:border-secondary-300 transition-colors">
                  <div class="flex items-start space-x-4">
                    <div class="bg-secondary-100 rounded-lg p-3 flex-shrink-0">
                      <i class={`fas ${
                        event.event_type === 'meeting' ? 'fa-users' :
                        event.event_type === 'activity' ? 'fa-calendar-day' :
                        'fa-calendar'
                      } text-secondary-600 text-xl`}></i>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p class="text-gray-600 text-sm mb-3">{event.description}</p>
                      <div class="space-y-1 text-sm text-gray-500">
                        <p class="flex items-center">
                          <i class="fas fa-clock w-4 mr-2"></i>
                          {new Date(event.start_date).toLocaleDateString('ko-KR', {
                            month: 'long',
                            day: 'numeric',
                            weekday: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {event.location && (
                          <p class="flex items-center">
                            <i class="fas fa-map-marker-alt w-4 mr-2"></i>
                            {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div class="text-center mt-10">
              <a href="/board/schedule" class="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors inline-block">
                전체 일정 보기
              </a>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section class="bg-gray-100 py-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                빠른 메뉴
              </h2>
              <p class="text-gray-600">자주 찾는 메뉴를 바로 이용하세요</p>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <a href="/board/photos" class="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow group">
                <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <i class="fas fa-images text-blue-600 text-2xl"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">활동사진</h3>
                <p class="text-gray-600 text-sm">다양한 활동 모습</p>
              </a>
              
              <a href="/board/meetings" class="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow group">
                <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <i class="fas fa-file-alt text-green-600 text-2xl"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">회의록</h3>
                <p class="text-gray-600 text-sm">회의 결과 확인</p>
              </a>
              
              <a href="/board/resources" class="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow group">
                <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <i class="fas fa-folder-open text-purple-600 text-2xl"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">자료실</h3>
                <p class="text-gray-600 text-sm">학습 자료 공유</p>
              </a>
              
              <a href="/board/suggestions" class="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow group">
                <div class="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <i class="fas fa-lightbulb text-red-600 text-2xl"></i>
                </div>
                <h3 class="font-semibold text-gray-900 mb-2">건의사항</h3>
                <p class="text-gray-600 text-sm">개선 아이디어 제안</p>
              </a>
            </div>
          </div>
        </section>
      </Layout>,
      { title: '홈' }
    );
  } catch (error) {
    console.error('Database error:', error);
    return c.render(
      <Layout user={c.get('user')}>
        <div class="max-w-4xl mx-auto px-4 py-16">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <i class="fas fa-exclamation-triangle text-yellow-600 text-4xl mb-4"></i>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">데이터베이스 준비 중</h2>
            <p class="text-gray-600 mb-6">
              아직 데이터베이스가 초기화되지 않았습니다.<br />
              관리자에게 문의하거나 잠시 후 다시 시도해주세요.
            </p>
            <a href="/about" class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              소개 페이지 보기
            </a>
          </div>
        </div>
      </Layout>,
      { title: '홈' }
    );
  }
})

// About Page
app.get('/about', (c) => {
  const user = c.get('user');
  
  return c.render(
    <Layout user={user}>
      {/* Hero Section */}
      <section class="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="mb-8">
            <img 
              src="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" 
              alt="ChemiSSUe Logo" 
              class="w-32 h-32 mx-auto mb-4 drop-shadow-lg"
            />
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            ChemiSSUe 소개
          </h1>
          <p class="text-xl text-blue-100 max-w-3xl mx-auto">
            숭실대학교 화학공학과 학생들이 함께하는 소모임입니다
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section class="py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 소모임 소개 */}
          <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
              <i class="fas fa-users text-primary-600 mr-2"></i>
              우리는 누구인가요?
            </h2>
            <div class="prose prose-lg mx-auto">
              <p class="text-gray-700 leading-relaxed mb-6">
                ChemiSSUe는 숭실대학교 화학공학과 학생들이 모여 만든 소모임입니다. 
                화학공학에 대한 열정을 공유하고, 함께 성장하며, 소중한 인연을 만들어가는 공간입니다.
              </p>
              <p class="text-gray-700 leading-relaxed mb-6">
                우리는 학업뿐만 아니라 다양한 활동을 통해 서로의 경험을 나누고, 
                미래의 화학공학 전문가로서 필요한 역량을 함께 키워나가고 있습니다.
              </p>
            </div>
          </div>

          {/* 활동 소개 */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex items-center mb-4">
                <div class="bg-blue-100 rounded-lg p-3 mr-4">
                  <i class="fas fa-book-open text-blue-600 text-2xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900">학습 활동</h3>
              </div>
              <ul class="text-gray-700 space-y-2">
                <li class="flex items-center">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  정기 스터디 그룹 운영
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  전공 과목 멘토링
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  시험 대비 공동 학습
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  논문 리뷰 및 발표
                </li>
              </ul>
            </div>

            <div class="bg-white rounded-lg shadow-lg p-6">
              <div class="flex items-center mb-4">
                <div class="bg-green-100 rounded-lg p-3 mr-4">
                  <i class="fas fa-users text-green-600 text-2xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900">소통 활동</h3>
              </div>
              <ul class="text-gray-700 space-y-2">
                <li class="flex items-center">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  정기 모임 및 MT
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  선후배 네트워킹
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  취업 정보 공유
                </li>
                <li class="flex items-center">
                  <i class="fas fa-check text-green-500 mr-2"></i>
                  동아리 행사 참여
                </li>
              </ul>
            </div>
          </div>

          {/* 가치와 목표 */}
          <div class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
              <i class="fas fa-heart text-red-500 mr-2"></i>
              우리의 가치와 목표
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-graduation-cap text-primary-600 text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">학업 성취</h3>
                <p class="text-gray-600">
                  함께 공부하며 더 나은 학업 성과를 달성합니다
                </p>
              </div>
              
              <div class="text-center">
                <div class="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-handshake text-secondary-600 text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">상호 협력</h3>
                <p class="text-gray-600">
                  서로 도우며 함께 성장하는 문화를 만듭니다
                </p>
              </div>
              
              <div class="text-center">
                <div class="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <i class="fas fa-rocket text-green-600 text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-3">미래 준비</h3>
                <p class="text-gray-600">
                  전문가로서의 역량을 키우며 미래를 준비합니다
                </p>
              </div>
            </div>
          </div>

          {/* 지도교수 정보 */}
          <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg p-8 mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
              <i class="fas fa-user-tie text-primary-600 mr-2"></i>
              지도교수
            </h2>
            <div class="max-w-2xl mx-auto">
              <div class="bg-white rounded-lg p-6 shadow-sm">
                <div class="text-center mb-6">
                  <div class="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-user-graduate text-primary-600 text-3xl"></i>
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 mb-2">임태호 교수님</h3>
                  <p class="text-gray-600">숭실대학교 화학공학과</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div class="flex items-center">
                      <i class="fas fa-phone text-primary-600 w-5 mr-3"></i>
                      <div>
                        <p class="text-sm text-gray-500">연락처</p>
                        <p class="text-gray-900 font-medium">+82-2-820-0617</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center">
                      <i class="fas fa-envelope text-primary-600 w-5 mr-3"></i>
                      <div>
                        <p class="text-sm text-gray-500">이메일</p>
                        <p class="text-gray-900 font-medium">taeholim@ssu.ac.kr</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="space-y-4">
                    <div class="flex items-center">
                      <i class="fas fa-map-marker-alt text-primary-600 w-5 mr-3"></i>
                      <div>
                        <p class="text-sm text-gray-500">연구실</p>
                        <p class="text-gray-900 font-medium">형남공학관 908호</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center">
                      <i class="fas fa-university text-primary-600 w-5 mr-3"></i>
                      <div>
                        <p class="text-sm text-gray-500">소속</p>
                        <p class="text-gray-900 font-medium">화학공학과</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="mt-6 pt-6 border-t border-gray-200">
                  <p class="text-center text-gray-600 text-sm">
                    ChemiSSUe 소모임을 지도해주시며, 학생들의 학업과 진로에 대해 친근하게 상담해주십니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 연락처 */}
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
              <i class="fas fa-envelope text-primary-600 mr-2"></i>
              함께하고 싶으시다면
            </h2>
            <div class="text-center">
              <p class="text-gray-700 mb-6 text-lg">
                ChemiSSUe에 관심이 있으시거나 참여를 원하신다면 언제든 연락해주세요!
              </p>
              <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                <div class="flex items-center text-gray-600">
                  <i class="fas fa-envelope text-primary-600 mr-3 text-xl"></i>
                  <span class="text-lg">chemissue@ssu.ac.kr</span>
                </div>
                <div class="flex items-center text-gray-600">
                  <i class="fas fa-university text-secondary-600 mr-3 text-xl"></i>
                  <span class="text-lg">숭실대학교 화학공학과</span>
                </div>
              </div>
              <div class="mt-8">
                <a href="/board/suggestions" class="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-block">
                  <i class="fas fa-paper-plane mr-2"></i>
                  건의사항 남기기
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>,
    { title: '소개' }
  )
})

// API Routes
// Get posts by category
app.get('/api/posts', async (c) => {
  const { env } = c;
  const category = c.req.query('category') || 'board';
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const posts = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(category, limit, offset).all();

    const totalCount = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ?
    `).bind(category).first();

    return c.json({
      posts: posts.results,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        totalPages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

// Get single post
app.get('/api/posts/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');

  try {
    const post = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).bind(id).first();

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    // Get comments
    const comments = await env.DB.prepare(`
      SELECT * FROM comments
      WHERE post_id = ?
      ORDER BY created_at ASC
    `).bind(id).all();

    // Increment view count
    await env.DB.prepare(`
      UPDATE posts SET view_count = view_count + 1 WHERE id = ?
    `).bind(id).run();

    return c.json({
      post,
      comments: comments.results
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch post' }, 500);
  }
});

// Get events
app.get('/api/events', async (c) => {
  const { env } = c;

  try {
    const events = await env.DB.prepare(`
      SELECT * FROM events
      ORDER BY start_date ASC
    `).all();

    return c.json(events.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

// Get meeting minutes
app.get('/api/meetings', async (c) => {
  const { env } = c;

  try {
    const meetings = await env.DB.prepare(`
      SELECT * FROM meeting_minutes
      ORDER BY meeting_date DESC
    `).all();

    return c.json(meetings.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch meetings' }, 500);
  }
});

// Notifications API
app.get('/api/notifications', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: '로그인이 필요합니다.' }, 401);
  }

  try {
    const { env } = c;
    const notifications = await env.DB.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `).bind(user.id).all();

    return c.json(notifications.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// Mark notification as read
app.post('/api/notifications/:id/read', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: '로그인이 필요합니다.' }, 401);
  }

  try {
    const { env } = c;
    const notificationId = c.req.param('id');

    await env.DB.prepare(`
      UPDATE notifications 
      SET is_read = 1 
      WHERE id = ? AND user_id = ?
    `).bind(notificationId, user.id).run();

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to mark notification as read' }, 500);
  }
});

// Create notification (internal function)
async function createNotification(env: any, userId: number, title: string, message: string, type: string, relatedId?: number) {
  try {
    await env.DB.prepare(`
      INSERT INTO notifications (user_id, title, message, type, related_id)
      VALUES (?, ?, ?, ?, ?)
    `).bind(userId, title, message, type, relatedId || null).run();
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

// Board Category Pages
app.get('/board/:category', async (c) => {
  const { env } = c;
  const categorySlug = c.req.param('category');
  const page = parseInt(c.req.query('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    // Get category info
    const category = await env.DB.prepare(`
      SELECT * FROM categories WHERE slug = ?
    `).bind(categorySlug).first();

    if (!category) {
      return c.notFound();
    }

    // Get posts
    const posts = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(categorySlug, limit, offset).all();

    const totalCount = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ?
    `).bind(categorySlug).first();

    const totalPages = Math.ceil(totalCount.count / limit);

    // Special handling for schedule category
    if (categorySlug === 'schedule') {
      const events = await env.DB.prepare(`
        SELECT * FROM events
        ORDER BY start_date ASC
      `).all();

      return c.render(
        <Layout>
          <SchedulePage 
            category={category} 
            posts={posts.results}
            events={events.results}
            pagination={{ page, totalPages, totalCount: totalCount.count }}
          />
        </Layout>,
        { title: category.name }
      );
    }

    // Special handling for meetings category
    if (categorySlug === 'meetings') {
      const meetings = await env.DB.prepare(`
        SELECT * FROM meeting_minutes
        ORDER BY meeting_date DESC
      `).all();

      return c.render(
        <Layout>
          <MeetingsPage 
            category={category} 
            posts={posts.results}
            meetings={meetings.results}
            pagination={{ page, totalPages, totalCount: totalCount.count }}
          />
        </Layout>,
        { title: category.name }
      );
    }

    return c.render(
      <Layout>
        <BoardPage 
          category={category} 
          posts={posts.results}
          pagination={{ page, totalPages, totalCount: totalCount.count }}
        />
      </Layout>,
      { title: category.name }
    );

  } catch (error) {
    console.error('Board page error:', error);
    return c.render(
      <Layout>
        <div class="max-w-4xl mx-auto px-4 py-16">
          <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <i class="fas fa-exclamation-triangle text-red-600 text-4xl mb-4"></i>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">오류가 발생했습니다</h2>
            <p class="text-gray-600">페이지를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </Layout>,
      { title: '오류' }
    );
  }
});

// Individual Post Page
app.get('/board/:category/:id', async (c) => {
  const { env } = c;
  const categorySlug = c.req.param('category');
  const postId = c.req.param('id');

  try {
    // Get category info
    const category = await env.DB.prepare(`
      SELECT * FROM categories WHERE slug = ?
    `).bind(categorySlug).first();

    if (!category) {
      return c.notFound();
    }

    // Get post with comments
    const post = await env.DB.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND c.slug = ?
    `).bind(postId, categorySlug).first();

    if (!post) {
      return c.notFound();
    }

    // Get comments
    const comments = await env.DB.prepare(`
      SELECT * FROM comments
      WHERE post_id = ?
      ORDER BY created_at ASC
    `).bind(postId).all();

    // Increment view count
    await env.DB.prepare(`
      UPDATE posts SET view_count = view_count + 1 WHERE id = ?
    `).bind(postId).run();

    return c.render(
      <Layout>
        <PostPage 
          category={category}
          post={post}
          comments={comments.results}
        />
      </Layout>,
      { title: post.title }
    );

  } catch (error) {
    console.error('Post page error:', error);
    return c.render(
      <Layout>
        <div class="max-w-4xl mx-auto px-4 py-16">
          <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <i class="fas fa-exclamation-triangle text-red-600 text-4xl mb-4"></i>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">게시글을 찾을 수 없습니다</h2>
            <p class="text-gray-600">요청하신 게시글이 존재하지 않거나 삭제되었을 수 있습니다.</p>
            <div class="mt-6">
              <a href={`/board/${categorySlug}`} class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                게시판으로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </Layout>,
      { title: '게시글 없음' }
    );
  }
});

// Helper function to get board icons
function getBoardIcon(slug: string): string {
  const icons: { [key: string]: string } = {
    'notices': 'fa-bullhorn',
    'photos': 'fa-images',
    'schedule': 'fa-calendar-alt',
    'meetings': 'fa-file-alt',
    'board': 'fa-comments',
    'suggestions': 'fa-lightbulb',
    'promotion': 'fa-star',
    'letters': 'fa-heart',
    'resources': 'fa-folder-open'
  };
  return icons[slug] || 'fa-list';
}

// Board Components
const BoardPage = ({ category, posts, pagination }: any) => (
  <div class="bg-gray-50 min-h-screen">
    {/* Header */}
    <section class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            <i class={`fas ${getBoardIcon(category.slug)} text-primary-600 mr-3`}></i>
            {category.name}
          </h1>
          <p class="text-gray-600 text-lg">{category.description}</p>
        </div>
      </div>
    </section>

    {/* Content */}
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Posts List */}
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          {posts && posts.length > 0 ? (
            <div>
              {/* Header */}
              <div class="bg-gray-50 px-6 py-4 border-b">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-semibold text-gray-900">
                    게시글 목록 ({pagination.totalCount}개)
                  </h2>
                </div>
              </div>

              {/* Posts */}
              <div class="divide-y divide-gray-200">
                {posts.map((post: any, index: number) => (
                  <div class="p-6 hover:bg-gray-50 transition-colors">
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">
                          <a href={`/board/${category.slug}/${post.id}`} class="hover:text-primary-600 transition-colors">
                            {post.title}
                            {post.is_featured && (
                              <span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <i class="fas fa-star mr-1"></i>
                                공지
                              </span>
                            )}
                          </a>
                        </h3>
                        <p class="text-gray-600 mb-3 line-clamp-2">
                          {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                        </p>
                        <div class="flex items-center text-sm text-gray-500 space-x-4">
                          <span class="flex items-center">
                            <i class="fas fa-user mr-1"></i>
                            {post.author}
                          </span>
                          <span class="flex items-center">
                            <i class="fas fa-clock mr-1"></i>
                            {new Date(post.created_at).toLocaleDateString('ko-KR')}
                          </span>
                          <span class="flex items-center">
                            <i class="fas fa-eye mr-1"></i>
                            {post.view_count}
                          </span>
                        </div>
                      </div>
                      {post.image_url && (
                        <div class="ml-4 flex-shrink-0">
                          <img 
                            src={post.image_url} 
                            alt={post.title}
                            class="w-20 h-20 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div class="bg-white px-6 py-4 border-t">
                  <div class="flex items-center justify-center">
                    <nav class="flex space-x-2">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                        <a
                          href={`/board/${category.slug}?page=${pageNum}`}
                          class={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            pageNum === pagination.page
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-500 hover:text-primary-600 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div class="p-12 text-center">
              <i class="fas fa-inbox text-gray-400 text-5xl mb-4"></i>
              <h3 class="text-xl font-medium text-gray-900 mb-2">아직 게시글이 없습니다</h3>
              <p class="text-gray-500">첫 번째 게시글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  </div>
);

const PostPage = ({ category, post, comments }: any) => (
  <div class="bg-gray-50 min-h-screen">
    {/* Breadcrumb */}
    <section class="bg-white border-b">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav class="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" class="hover:text-primary-600">홈</a>
          <i class="fas fa-chevron-right"></i>
          <a href={`/board/${category.slug}`} class="hover:text-primary-600">{category.name}</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-gray-900">{post.title}</span>
        </nav>
      </div>
    </section>

    {/* Post Content */}
    <section class="py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Post Header */}
          <div class="px-6 py-8 border-b">
            <div class="flex items-center justify-between mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-600">
                <i class={`fas ${getBoardIcon(category.slug)} mr-1`}></i>
                {category.name}
              </span>
              {post.is_featured && (
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <i class="fas fa-star mr-1"></i>
                  공지
                </span>
              )}
            </div>
            
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div class="flex items-center text-sm text-gray-500 space-x-4">
              <span class="flex items-center">
                <i class="fas fa-user mr-2"></i>
                {post.author}
              </span>
              <span class="flex items-center">
                <i class="fas fa-clock mr-2"></i>
                {new Date(post.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </span>
              <span class="flex items-center">
                <i class="fas fa-eye mr-2"></i>
                조회수 {post.view_count}
              </span>
            </div>
          </div>

          {/* Post Body */}
          <div class="px-6 py-8">
            {post.image_url && (
              <div class="mb-6">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  class="w-full rounded-lg"
                />
              </div>
            )}
            <div class="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph: string, index: number) => (
                paragraph.trim() ? <p class="mb-4">{paragraph}</p> : <br />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div class="px-6 py-4 bg-gray-50 border-t">
            <div class="flex items-center justify-between">
              <a 
                href={`/board/${category.slug}`}
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <i class="fas fa-arrow-left mr-2"></i>
                목록으로
              </a>
              
              <div class="space-x-2">
                <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                  <i class="fas fa-heart mr-2"></i>
                  좋아요
                </button>
                <button class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                  <i class="fas fa-share mr-2"></i>
                  공유
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mt-8">
          <div class="px-6 py-4 bg-gray-50 border-b">
            <h3 class="text-lg font-semibold text-gray-900">
              <i class="fas fa-comments mr-2"></i>
              댓글 ({comments.length}개)
            </h3>
          </div>
          
          {comments && comments.length > 0 ? (
            <div class="divide-y divide-gray-200">
              {comments.map((comment: any) => (
                <div class="px-6 py-4">
                  <div class="flex items-start space-x-3">
                    <div class="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <i class="fas fa-user text-gray-600 text-sm"></i>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <span class="font-medium text-gray-900">{comment.author}</span>
                        <span class="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <p class="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div class="px-6 py-8 text-center">
              <i class="fas fa-comment text-gray-400 text-3xl mb-4"></i>
              <p class="text-gray-500">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  </div>
);

const SchedulePage = ({ category, posts, events, pagination }: any) => (
  <div class="bg-gray-50 min-h-screen">
    {/* Header */}
    <section class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            <i class="fas fa-calendar-alt text-primary-600 mr-3"></i>
            {category.name}
          </h1>
          <p class="text-gray-600 text-lg">{category.description}</p>
        </div>
      </div>
    </section>

    {/* Content */}
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upcoming Events */}
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">
                <i class="fas fa-clock text-secondary-600 mr-2"></i>
                다가오는 일정
              </h2>
              
              {events && events.length > 0 ? (
                <div class="space-y-4">
                  {events.slice(0, 5).map((event: any) => (
                    <div class="border border-gray-200 rounded-lg p-4 hover:border-secondary-300 transition-colors">
                      <div class="flex items-start space-x-4">
                        <div class="bg-secondary-100 rounded-lg p-3 flex-shrink-0">
                          <i class={`fas ${
                            event.event_type === 'meeting' ? 'fa-users' :
                            event.event_type === 'activity' ? 'fa-calendar-day' :
                            'fa-calendar'
                          } text-secondary-600 text-xl`}></i>
                        </div>
                        <div class="flex-1">
                          <h3 class="font-semibold text-gray-900 mb-2">{event.title}</h3>
                          <p class="text-gray-600 text-sm mb-3">{event.description}</p>
                          <div class="space-y-1 text-sm text-gray-500">
                            <p class="flex items-center">
                              <i class="fas fa-clock w-4 mr-2"></i>
                              {new Date(event.start_date).toLocaleDateString('ko-KR', {
                                month: 'long',
                                day: 'numeric',
                                weekday: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {event.location && (
                              <p class="flex items-center">
                                <i class="fas fa-map-marker-alt w-4 mr-2"></i>
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div class="text-center py-8">
                  <i class="fas fa-calendar-times text-gray-400 text-4xl mb-4"></i>
                  <p class="text-gray-500">예정된 일정이 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div class="space-y-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-info-circle text-primary-600 mr-2"></i>
                일정 안내
              </h3>
              <ul class="space-y-3 text-sm text-gray-600">
                <li class="flex items-start">
                  <i class="fas fa-circle text-xs text-green-500 mt-2 mr-2"></i>
                  정기 모임은 매주 수요일 6시에 진행됩니다
                </li>
                <li class="flex items-start">
                  <i class="fas fa-circle text-xs text-blue-500 mt-2 mr-2"></i>
                  MT 및 특별 행사는 사전에 공지됩니다
                </li>
                <li class="flex items-start">
                  <i class="fas fa-circle text-xs text-yellow-500 mt-2 mr-2"></i>
                  시험 기간에는 일정이 조정될 수 있습니다
                </li>
              </ul>
            </div>
            
            <div class="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg p-6 text-white">
              <h3 class="text-lg font-semibold mb-3">
                <i class="fas fa-bell mr-2"></i>
                일정 알림
              </h3>
              <p class="text-sm text-blue-100 mb-4">
                중요한 일정을 놓치지 않도록 건의사항을 통해 알림 서비스를 제안해보세요!
              </p>
              <a href="/board/suggestions" class="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors inline-block">
                건의하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const MeetingsPage = ({ category, posts, meetings, pagination }: any) => (
  <div class="bg-gray-50 min-h-screen">
    {/* Header */}
    <section class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            <i class="fas fa-file-alt text-primary-600 mr-3"></i>
            {category.name}
          </h1>
          <p class="text-gray-600 text-lg">{category.description}</p>
        </div>
      </div>
    </section>

    {/* Content */}
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Meeting Minutes */}
        <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div class="bg-gray-50 px-6 py-4 border-b">
            <h2 class="text-lg font-semibold text-gray-900">
              회의록 목록 ({meetings ? meetings.length : 0}개)
            </h2>
          </div>
          
          {meetings && meetings.length > 0 ? (
            <div class="divide-y divide-gray-200">
              {meetings.map((meeting: any) => (
                <div class="p-6 hover:bg-gray-50 transition-colors">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-2">
                        <a href={`/board/meetings/meeting-${meeting.id}`} class="hover:text-primary-600 transition-colors">
                          {meeting.title}
                        </a>
                      </h3>
                      <div class="text-gray-600 mb-3">
                        {meeting.agenda && (
                          <p class="line-clamp-2">안건: {meeting.agenda}</p>
                        )}
                      </div>
                      <div class="flex items-center text-sm text-gray-500 space-x-4">
                        <span class="flex items-center">
                          <i class="fas fa-calendar mr-1"></i>
                          {new Date(meeting.meeting_date).toLocaleDateString('ko-KR')}
                        </span>
                        <span class="flex items-center">
                          <i class="fas fa-user mr-1"></i>
                          작성자: {meeting.created_by}
                        </span>
                        <span class="flex items-center">
                          <i class="fas fa-users mr-1"></i>
                          참석자 정보 포함
                        </span>
                      </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i class="fas fa-check-circle mr-1"></i>
                        완료
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div class="p-12 text-center">
              <i class="fas fa-file-alt text-gray-400 text-5xl mb-4"></i>
              <h3 class="text-xl font-medium text-gray-900 mb-2">회의록이 없습니다</h3>
              <p class="text-gray-500">회의 후 회의록을 작성해주세요.</p>
            </div>
          )}
        </div>

        {/* Related Posts */}
        {posts && posts.length > 0 && (
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="bg-gray-50 px-6 py-4 border-b">
              <h2 class="text-lg font-semibold text-gray-900">관련 게시글</h2>
            </div>
            <div class="divide-y divide-gray-200">
              {posts.map((post: any) => (
                <div class="p-6 hover:bg-gray-50 transition-colors">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    <a href={`/board/${category.slug}/${post.id}`} class="hover:text-primary-600 transition-colors">
                      {post.title}
                    </a>
                  </h3>
                  <p class="text-gray-600 mb-3 line-clamp-2">
                    {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                  </p>
                  <div class="flex items-center text-sm text-gray-500 space-x-4">
                    <span>{post.author}</span>
                    <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  </div>
);

// Authentication Routes
app.get('/auth/login', (c) => {
  const user = c.get('user');
  if (user) {
    return c.redirect('/');
  }
  
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>로그인 - ChemiSSUe</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8'
                  }
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gray-50">
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
                    <!-- 로그인 에러 메시지 -->
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
                                id="loginButton"
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <i id="loginIcon" class="fas fa-sign-in-alt text-primary-500 group-hover:text-primary-400"></i>
                                </span>
                                <span id="loginText">로그인</span>
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

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const loginForm = document.getElementById('loginForm');
                const loginError = document.getElementById('loginError');
                const loginErrorMessage = document.getElementById('loginErrorMessage');
                const loginButton = document.getElementById('loginButton');
                const loginText = document.getElementById('loginText');
                const loginIcon = document.getElementById('loginIcon');
                const usernameInput = document.getElementById('username');
                const passwordInput = document.getElementById('password');

                // 입력 필드에서 타이핑 시작하면 에러 메시지 숨기기
                function hideError() {
                    loginError.classList.add('hidden');
                }

                usernameInput.addEventListener('input', hideError);
                passwordInput.addEventListener('input', hideError);

                // 로그인 폼 제출 처리
                loginForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    // 로딩 상태 표시
                    loginButton.disabled = true;
                    loginText.textContent = '로그인 중...';
                    loginIcon.className = 'fas fa-spinner fa-spin text-primary-500';
                    loginError.classList.add('hidden');

                    const formData = new FormData(loginForm);
                    const username = formData.get('username');
                    const password = formData.get('password');
                    const rememberMe = formData.get('remember-me') === 'on';

                    try {
                        const response = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                username: username,
                                password: password,
                                rememberMe: rememberMe
                            })
                        });

                        const result = await response.json();

                        if (response.ok) {
                            // 성공 시 리다이렉트
                            window.location.href = result.redirect || '/';
                        } else {
                            // 실패 시 에러 메시지 표시
                            loginErrorMessage.textContent = result.error || '아이디 또는 비밀번호를 확인해 주세요.';
                            loginError.classList.remove('hidden');
                            
                            // 비밀번호 필드 클리어 및 포커스
                            passwordInput.value = '';
                            passwordInput.focus();
                        }
                    } catch (error) {
                        console.error('로그인 요청 실패:', error);
                        loginErrorMessage.textContent = '네트워크 오류가 발생했습니다. 다시 시도해 주세요.';
                        loginError.classList.remove('hidden');
                    } finally {
                        // 로딩 상태 해제
                        loginButton.disabled = false;
                        loginText.textContent = '로그인';
                        loginIcon.className = 'fas fa-sign-in-alt text-primary-500 group-hover:text-primary-400';
                    }
                });
            });
        </script>
        <script src="/static/security.js"></script>
    </body>
    </html>
  `);
});

app.get('/auth/register', (c) => {
  const user = c.get('user');
  if (user) {
    return c.redirect('/');
  }
  
  return c.render(<RegisterForm />, { title: '회원가입' });
});

// Login API
app.post('/api/auth/login', async (c) => {
  const { env } = c;
  const { username, password, rememberMe } = await c.req.json();

  try {
    // Find user by username or email
    const user = await env.DB.prepare(`
      SELECT * FROM users 
      WHERE (username = ? OR email = ?) AND is_active = 1
    `).bind(username, username).first();

    if (!user) {
      return c.json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' }, 401);
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return c.json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' }, 401);
    }

    // Create session
    const sessionId = generateSessionId();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7)); // 30 days or 7 days

    await env.DB.prepare(`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `).bind(sessionId, user.id, expiresAt.toISOString()).run();

    // Update last login
    await env.DB.prepare(`
      UPDATE users SET last_login = datetime('now') WHERE id = ?
    `).bind(user.id).run();

    // Set cookie
    setCookie(c, 'session_id', sessionId, {
      expires: expiresAt,
      httpOnly: true,
      secure: true,
      sameSite: 'Lax'
    });

    return c.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: '로그인 중 오류가 발생했습니다.' }, 500);
  }
});

// Register API
app.post('/api/auth/register', async (c) => {
  const { env } = c;
  const { fullName, studentId, email, username, password, confirmPassword } = await c.req.json();

  try {
    // Validation
    if (password !== confirmPassword) {
      return c.json({ error: '비밀번호가 일치하지 않습니다.' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: '비밀번호는 최소 6자 이상이어야 합니다.' }, 400);
    }

    // Check if username or email already exists
    const existingUser = await env.DB.prepare(`
      SELECT id FROM users WHERE username = ? OR email = ?
    `).bind(username, email).first();

    if (existingUser) {
      return c.json({ error: '이미 사용 중인 아이디 또는 이메일입니다.' }, 400);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await env.DB.prepare(`
      INSERT INTO users (username, email, password_hash, full_name, student_id)
      VALUES (?, ?, ?, ?, ?)
    `).bind(username, email, passwordHash, fullName, studentId || null).run();

    return c.json({ 
      success: true, 
      message: '회원가입이 완료되었습니다. 로그인해주세요.' 
    });

  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: '회원가입 중 오류가 발생했습니다.' }, 500);
  }
});

// Logout API
app.post('/api/auth/logout', async (c) => {
  const { env } = c;
  const sessionId = getCookie(c, 'session_id');

  if (sessionId) {
    // Delete session from database
    await env.DB.prepare(`
      DELETE FROM sessions WHERE id = ?
    `).bind(sessionId).run();
  }

  // Delete cookie
  deleteCookie(c, 'session_id');

  return c.json({ success: true });
});

// File Upload API (using FormData)
app.post('/api/upload', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: '로그인이 필요합니다.' }, 401);
  }

  try {
    const { env } = c;
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const purpose = formData.get('purpose') as string || 'general';

    if (!file) {
      return c.json({ error: '파일이 선택되지 않았습니다.' }, 400);
    }

    // File validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return c.json({ error: '파일 크기는 10MB 이하여야 합니다.' }, 400);
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: '지원하지 않는 파일 형식입니다.' }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}_${randomString}.${extension}`;
    const filePath = `/uploads/${filename}`;

    // In a real implementation, you would save to R2 or similar storage
    // For now, we'll just save the metadata
    const result = await env.DB.prepare(`
      INSERT INTO uploaded_files (
        filename, original_name, file_path, file_size, 
        mime_type, uploaded_by, upload_purpose, is_public
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      filename, 
      file.name, 
      filePath, 
      file.size, 
      file.type, 
      user.id, 
      purpose, 
      purpose === 'profile_image' ? true : false
    ).run();

    return c.json({
      success: true,
      file: {
        id: result.meta.last_row_id,
        filename,
        original_name: file.name,
        file_path: filePath,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: '파일 업로드 중 오류가 발생했습니다.' }, 500);
  }
});

// Create Post API (with file attachments)
app.post('/api/posts', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: '로그인이 필요합니다.' }, 401);
  }

  try {
    const { env } = c;
    const { title, content, category_slug, attachments, is_featured } = await c.req.json();

    // Get category
    const category = await env.DB.prepare(`
      SELECT id FROM categories WHERE slug = ?
    `).bind(category_slug).first();

    if (!category) {
      return c.json({ error: '존재하지 않는 카테고리입니다.' }, 400);
    }

    // Check if user can create featured posts (admin only)
    const canFeature = user.role === 'admin' || user.role === 'moderator';
    const featuredFlag = canFeature && is_featured ? 1 : 0;

    // Create post
    const result = await env.DB.prepare(`
      INSERT INTO posts (title, content, category_id, user_id, author, is_featured)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(title, content, category.id, user.id, user.full_name, featuredFlag).run();

    const postId = result.meta.last_row_id;

    // Add attachments
    if (attachments && attachments.length > 0) {
      for (const fileId of attachments) {
        await env.DB.prepare(`
          UPDATE uploaded_files 
          SET upload_purpose = 'post_attachment'
          WHERE id = ? AND uploaded_by = ?
        `).bind(fileId, user.id).run();

        await env.DB.prepare(`
          INSERT INTO attachments (post_id, filename, file_url, file_size)
          SELECT ?, filename, file_path, file_size
          FROM uploaded_files WHERE id = ?
        `).bind(postId, fileId).run();
      }
    }

    // Notify all users about new post (for important categories)
    if (category_slug === 'notices' && featuredFlag) {
      // Get all users for notification
      const users = await env.DB.prepare(`
        SELECT id FROM users WHERE is_active = 1 AND id != ?
      `).bind(user.id).all();

      for (const notifyUser of users.results) {
        await createNotification(
          env,
          notifyUser.id,
          '새 공지사항',
          `${title}`,
          'post',
          postId
        );
      }
    }

    return c.json({ success: true, post_id: postId });

  } catch (error) {
    console.error('Create post error:', error);
    return c.json({ error: '게시글 작성 중 오류가 발생했습니다.' }, 500);
  }
});

// Admin Panel
app.get('/admin', async (c) => {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
    return c.redirect('/auth/login');
  }

  try {
    const { env } = c;
    
    // Get stats
    const stats = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM posts').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM events WHERE start_date >= datetime("now")').first(),
      env.DB.prepare('SELECT COUNT(*) as count FROM notifications WHERE is_read = 0').first()
    ]);

    const [usersCount, postsCount, eventsCount, unreadNotifications] = stats;

    return c.render(
      <Layout user={user}>
        <AdminPanel 
          stats={{
            users: usersCount.count,
            posts: postsCount.count,
            events: eventsCount.count,
            notifications: unreadNotifications.count
          }}
        />
      </Layout>,
      { title: '관리자 패널' }
    );

  } catch (error) {
    console.error('Admin panel error:', error);
    return c.render(
      <Layout user={user}>
        <div class="max-w-4xl mx-auto px-4 py-16">
          <div class="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <i class="fas fa-exclamation-triangle text-red-600 text-4xl mb-4"></i>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">오류가 발생했습니다</h2>
            <p class="text-gray-600">관리자 패널을 로드하는 중 문제가 발생했습니다.</p>
          </div>
        </div>
      </Layout>,
      { title: '오류' }
    );
  }
});

// Admin Panel Component
const AdminPanel = ({ stats }: { stats: any }) => (
  <div class="bg-gray-50 min-h-screen">
    {/* Header */}
    <section class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            <i class="fas fa-cog text-primary-600 mr-3"></i>
            관리자 패널
          </h1>
          <p class="text-gray-600 text-lg">ChemiSSUe 홈페이지 관리</p>
        </div>
      </div>
    </section>

    {/* Dashboard Stats */}
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-users text-blue-600 text-2xl"></i>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-500">총 회원 수</div>
                <div class="text-2xl font-bold text-gray-900">{stats.users}</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-file-alt text-green-600 text-2xl"></i>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-500">총 게시글</div>
                <div class="text-2xl font-bold text-gray-900">{stats.posts}</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-calendar text-purple-600 text-2xl"></i>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-500">예정 일정</div>
                <div class="text-2xl font-bold text-gray-900">{stats.events}</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-bell text-red-600 text-2xl"></i>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-500">읽지 않은 알림</div>
                <div class="text-2xl font-bold text-gray-900">{stats.notifications}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-plus-circle text-primary-600 mr-2"></i>
              컨텐츠 관리
            </h3>
            <div class="space-y-3">
              <a href="/admin/posts/create" class="block bg-primary-600 text-white text-center py-2 px-4 rounded hover:bg-primary-700 transition-colors">
                새 게시글 작성
              </a>
              <a href="/admin/events/create" class="block bg-secondary-600 text-white text-center py-2 px-4 rounded hover:bg-secondary-700 transition-colors">
                새 일정 추가
              </a>
              <a href="/admin/meetings/create" class="block bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700 transition-colors">
                회의록 작성
              </a>
              <a href="/admin/footer" class="block border border-gray-300 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                <i class="fas fa-edit mr-1"></i>Footer 편집
              </a>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-users-cog text-primary-600 mr-2"></i>
              사용자 관리
            </h3>
            <div class="space-y-3">
              <a href="/admin/users" class="block border border-gray-300 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                회원 목록
              </a>
              <a href="/admin/users/pending" class="block border border-gray-300 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                가입 승인 대기
              </a>
              <a href="/admin/roles" class="block border border-gray-300 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                권한 관리
              </a>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              <i class="fas fa-chart-line text-primary-600 mr-2"></i>
              통계 & 분석
            </h3>
            <div class="space-y-3">
              <a href="/admin/analytics" class="block border border-gray-300 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                방문 통계
              </a>
              <a href="/admin/reports" class="block border border-gray-300 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                활동 보고서
              </a>
              <a href="/admin/backup" class="block border border-gray-300 text-gray-700 text-center py-2 px-4 rounded hover:bg-gray-50 transition-colors">
                백업 관리
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div class="mt-8">
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b">
              <h3 class="text-lg font-semibold text-gray-900">
                <i class="fas fa-clock text-gray-500 mr-2"></i>
                최근 활동
              </h3>
            </div>
            <div class="p-6">
              <div class="text-gray-500 text-center py-8">
                <i class="fas fa-inbox text-4xl mb-4"></i>
                <p>최근 활동 내역이 여기에 표시됩니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

// Footer Settings Management
app.get('/admin/footer', async (c) => {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
    return c.redirect('/auth/login');
  }

  const { env } = c;
  
  try {
    // Get current footer settings
    const footerSettings = await env.DB.prepare(`
      SELECT * FROM footer_settings ORDER BY display_order
    `).all();

    const contact_university = footerSettings.results.find((s: any) => s.section === 'contact_university')?.content || '숭실대학교 화학공학과';
    const contact_email = footerSettings.results.find((s: any) => s.section === 'contact_email')?.content || 'chemissue@ssu.ac.kr';
    const description = footerSettings.results.find((s: any) => s.section === 'description')?.content || '숭실대학교 화학공학과 소모임\n함께 성장하고 소통하는 공간';
    const copyright = footerSettings.results.find((s: any) => s.section === 'copyright')?.content || '© 2024 ChemiSSUe. All rights reserved.';

    return c.html(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Footer 설정 관리 - ChemiSSUe</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: {
                      50: '#eff6ff',
                      500: '#3b82f6',
                      600: '#2563eb',
                      700: '#1d4ed8'
                    }
                  }
                }
              }
            }
          </script>
      </head>
      <body class="bg-gray-100">
          <div class="min-h-screen py-8">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <!-- Header -->
              <div class="bg-white rounded-lg shadow mb-6">
                <div class="px-6 py-4 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-gray-900">
                      <i class="fas fa-edit text-primary-600 mr-3"></i>
                      Footer 설정 관리
                    </h1>
                    <a 
                      href="/admin" 
                      class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      <i class="fas fa-arrow-left mr-2"></i>관리자 패널
                    </a>
                  </div>
                </div>
              </div>

              <!-- Footer Settings Forms -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column - Contact Info -->
                <div class="space-y-6">
                  <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b">
                      <h2 class="text-lg font-semibold text-gray-900">
                        <i class="fas fa-address-card text-primary-600 mr-2"></i>
                        연락처 정보
                      </h2>
                    </div>
                    <div class="p-6">
                      <form id="contactForm" class="space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            소속 기관
                          </label>
                          <input
                            type="text"
                            id="contact_university"
                            name="contact_university"
                            value="${contact_university}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="예: 숭실대학교 화학공학과"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            이메일 주소
                          </label>
                          <input
                            type="email"
                            id="contact_email"
                            name="contact_email"
                            value="${contact_email}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="예: chemissue@ssu.ac.kr"
                          />
                        </div>
                        <button
                          type="submit"
                          class="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors"
                        >
                          <i class="fas fa-save mr-2"></i>연락처 정보 저장
                        </button>
                      </form>
                    </div>
                  </div>

                  <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b">
                      <h2 class="text-lg font-semibold text-gray-900">
                        <i class="fas fa-info-circle text-primary-600 mr-2"></i>
                        소개 문구
                      </h2>
                    </div>
                    <div class="p-6">
                      <form id="descriptionForm">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            소모임 소개
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="소모임에 대한 간단한 소개를 입력하세요..."
                          >${description}</textarea>
                          <p class="mt-1 text-sm text-gray-500">줄바꿈은 자동으로 처리됩니다.</p>
                        </div>
                        <button
                          type="submit"
                          class="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                        >
                          <i class="fas fa-save mr-2"></i>소개 문구 저장
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <!-- Right Column - Copyright -->
                <div class="space-y-6">
                  <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b">
                      <h2 class="text-lg font-semibold text-gray-900">
                        <i class="fas fa-copyright text-primary-600 mr-2"></i>
                        저작권 표시
                      </h2>
                    </div>
                    <div class="p-6">
                      <form id="copyrightForm">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-2">
                            저작권 문구
                          </label>
                          <input
                            type="text"
                            id="copyright"
                            name="copyright"
                            value="${copyright}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="© 2024 ChemiSSUe. All rights reserved."
                          />
                        </div>
                        <button
                          type="submit"
                          class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        >
                          <i class="fas fa-save mr-2"></i>저작권 표시 저장
                        </button>
                      </form>
                    </div>
                  </div>

                  <!-- Preview Section -->
                  <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b">
                      <h2 class="text-lg font-semibold text-gray-900">
                        <i class="fas fa-eye text-primary-600 mr-2"></i>
                        Footer 미리보기
                      </h2>
                    </div>
                    <div class="p-6">
                      <div class="bg-gray-800 text-white p-4 rounded-lg text-sm">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div class="flex items-center mb-3">
                              <img 
                                src="https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546" 
                                alt="ChemiSSUe Logo" 
                                class="w-6 h-6 mr-2"
                              />
                              <h3 class="font-bold">ChemiSSUe</h3>
                            </div>
                            <p class="text-gray-400" id="preview-description">
                              ${description.replace(/\n/g, '<br/>')}
                            </p>
                          </div>
                          <div>
                            <h4 class="font-semibold mb-3">빠른 링크</h4>
                            <ul class="space-y-1 text-gray-400">
                              <li><a href="/board/notices" class="hover:text-white transition-colors">공지사항</a></li>
                              <li><a href="/board/photos" class="hover:text-white transition-colors">활동사진</a></li>
                              <li><a href="/board/schedule" class="hover:text-white transition-colors">일정표</a></li>
                              <li><a href="/board/meetings" class="hover:text-white transition-colors">회의록</a></li>
                            </ul>
                          </div>
                          <div>
                            <h4 class="font-semibold mb-3">연락처</h4>
                            <div class="space-y-1 text-gray-400">
                              <p class="flex items-center" id="preview-university">
                                <i class="fas fa-university w-4 mr-2"></i>
                                ${contact_university}
                              </p>
                              <p class="flex items-center" id="preview-email">
                                <i class="fas fa-envelope w-4 mr-2"></i>
                                ${contact_email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="border-t border-gray-700 mt-4 pt-4 text-center text-gray-400">
                          <p id="preview-copyright">${copyright}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <script>
            // Footer Management JavaScript
            document.addEventListener('DOMContentLoaded', function() {
              
              // Contact Form Handler
              document.getElementById('contactForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                try {
                  const response = await fetch('/api/admin/footer/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contact_university: formData.get('contact_university'),
                      contact_email: formData.get('contact_email')
                    })
                  });

                  if (response.ok) {
                    showNotification('연락처 정보가 저장되었습니다.', 'success');
                    updatePreview();
                  } else {
                    showNotification('저장에 실패했습니다.', 'error');
                  }
                } catch (error) {
                  showNotification('오류가 발생했습니다.', 'error');
                }
              });

              // Description Form Handler  
              document.getElementById('descriptionForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                try {
                  const response = await fetch('/api/admin/footer/description', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      description: formData.get('description')
                    })
                  });

                  if (response.ok) {
                    showNotification('소개 문구가 저장되었습니다.', 'success');
                    updatePreview();
                  } else {
                    showNotification('저장에 실패했습니다.', 'error');
                  }
                } catch (error) {
                  showNotification('오류가 발생했습니다.', 'error');
                }
              });

              // Copyright Form Handler
              document.getElementById('copyrightForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                try {
                  const response = await fetch('/api/admin/footer/copyright', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      copyright: formData.get('copyright')
                    })
                  });

                  if (response.ok) {
                    showNotification('저작권 표시가 저장되었습니다.', 'success');
                    updatePreview();
                  } else {
                    showNotification('저장에 실패했습니다.', 'error');
                  }
                } catch (error) {
                  showNotification('오류가 발생했습니다.', 'error');
                }
              });
            });

            // Update Preview
            function updatePreview() {
              const university = document.getElementById('contact_university').value;
              const email = document.getElementById('contact_email').value;
              const description = document.getElementById('description').value;
              const copyright = document.getElementById('copyright').value;

              document.getElementById('preview-university').innerHTML = 
                '<i class="fas fa-university w-4 mr-2"></i>' + university;
              document.getElementById('preview-email').innerHTML = 
                '<i class="fas fa-envelope w-4 mr-2"></i>' + email;
              document.getElementById('preview-description').innerHTML = 
                description.replace(/\\n/g, '<br/>');
              document.getElementById('preview-copyright').textContent = copyright;
            }

            // Show Notification
            function showNotification(message, type) {
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ' + 
                (type === 'success' ? 'bg-green-600' : 'bg-red-600');
              notification.textContent = message;
              document.body.appendChild(notification);
              
              setTimeout(() => {
                notification.remove();
              }, 3000);
            }

            // Real-time preview updates
            document.getElementById('contact_university').addEventListener('input', updatePreview);
            document.getElementById('contact_email').addEventListener('input', updatePreview);
            document.getElementById('description').addEventListener('input', updatePreview);
            document.getElementById('copyright').addEventListener('input', updatePreview);
          </script>
          <script src="/static/security.js"></script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error loading footer settings:', error);
    return c.text('Internal Server Error', 500);
  }
});

// Footer Settings API endpoints
app.post('/api/admin/footer/contact', async (c) => {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { env } = c;
  const { contact_university, contact_email } = await c.req.json();

  try {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO footer_settings (section, content, updated_at)
      VALUES (?, ?, datetime('now'))
    `).bind('contact_university', contact_university).run();

    await env.DB.prepare(`
      INSERT OR REPLACE INTO footer_settings (section, content, updated_at)
      VALUES (?, ?, datetime('now'))
    `).bind('contact_email', contact_email).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return c.json({ error: 'Database error' }, 500);
  }
});

app.post('/api/admin/footer/description', async (c) => {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { env } = c;
  const { description } = await c.req.json();

  try {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO footer_settings (section, content, updated_at)
      VALUES (?, ?, datetime('now'))
    `).bind('description', description).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating description:', error);
    return c.json({ error: 'Database error' }, 500);
  }
});

app.post('/api/admin/footer/copyright', async (c) => {
  const user = c.get('user');
  if (!user || user.role !== 'admin') {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { env } = c;
  const { copyright } = await c.req.json();

  try {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO footer_settings (section, content, updated_at)
      VALUES (?, ?, datetime('now'))
    `).bind('copyright', copyright).run();

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating copyright:', error);
    return c.json({ error: 'Database error' }, 500);
  }
});

export default app
