-- Page Content Management System
-- 페이지별 편집 가능한 콘텐츠 관리 시스템

-- 페이지 콘텐츠 테이블
CREATE TABLE IF NOT EXISTS page_contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_key TEXT NOT NULL UNIQUE, -- 페이지 식별자 (home, about, professor, etc.)
  title TEXT NOT NULL, -- 페이지 제목
  description TEXT, -- 페이지 설명
  content TEXT, -- 메인 콘텐츠 (HTML 지원)
  meta_title TEXT, -- SEO 메타 제목
  meta_description TEXT, -- SEO 메타 설명
  is_published BOOLEAN DEFAULT TRUE, -- 공개 여부
  updated_by INTEGER, -- 최종 수정자
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- 페이지 섹션 테이블 (페이지 내 여러 편집 가능한 섹션)
CREATE TABLE IF NOT EXISTS page_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_key TEXT NOT NULL, -- 페이지 식별자
  section_key TEXT NOT NULL, -- 섹션 식별자 (hero, features, gallery, etc.)
  section_name TEXT NOT NULL, -- 섹션 이름
  content TEXT, -- 섹션 콘텐츠
  image_url TEXT, -- 섹션 이미지
  is_visible BOOLEAN DEFAULT TRUE, -- 표시 여부
  sort_order INTEGER DEFAULT 0, -- 정렬 순서
  updated_by INTEGER, -- 최종 수정자
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_key, section_key),
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- 페이지 설정 테이블 (사이트 전체 설정)
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text', -- text, html, image, boolean, number
  description TEXT,
  updated_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- 기본 페이지 콘텐츠 데이터 삽입
INSERT OR IGNORE INTO page_contents (page_key, title, description, content, meta_title, meta_description) VALUES
(
  'home', 
  'ChemiSSUe에 오신 것을 환영합니다',
  '숭실대학교 화학공학과 소모임 ChemiSSUe 공식 홈페이지입니다.',
  '<div class="text-center">
    <h2 class="text-3xl font-bold text-gray-900 mb-6">화학공학과의 든든한 동반자</h2>
    <p class="text-lg text-gray-600 mb-8">ChemiSSUe는 숭실대학교 화학공학과 학생들이 함께 성장하고 배우는 소모임입니다. 학업, 진로, 그리고 소중한 추억을 함께 만들어가고 있습니다.</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div class="text-center">
        <div class="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-users text-primary-600 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2">함께 성장</h3>
        <p class="text-gray-600">선후배 간 멘토링과 스터디를 통해 함께 발전해나갑니다.</p>
      </div>
      <div class="text-center">
        <div class="bg-secondary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-flask text-secondary-600 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2">전공 심화</h3>
        <p class="text-gray-600">화학공학 전문 지식을 심화하고 실무 경험을 쌓습니다.</p>
      </div>
      <div class="text-center">
        <div class="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-heart text-green-600 text-2xl"></i>
        </div>
        <h3 class="text-xl font-semibold mb-3">소중한 인연</h3>
        <p class="text-gray-600">평생 함께할 동기, 선후배들과 특별한 추억을 만듭니다.</p>
      </div>
    </div>
  </div>',
  'ChemiSSUe - 숭실대학교 화학공학과 소모임',
  '숭실대학교 화학공학과 소모임 ChemiSSUe 공식 홈페이지입니다. 학업, 진로, 그리고 소중한 추억을 함께 만들어가는 공간입니다.'
),
(
  'professor',
  '지도교수 소개',
  '임태호 교수님을 소개합니다.',
  '<div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="md:flex">
        <div class="md:flex-shrink-0 p-8">
          <img 
            class="h-48 w-full object-cover md:h-full md:w-48 rounded-lg" 
            src="https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=임태호+교수님" 
            alt="임태호 교수님"
          />
        </div>
        <div class="p-8">
          <div class="uppercase tracking-wide text-sm text-primary-600 font-semibold">지도교수</div>
          <h2 class="block mt-1 text-2xl leading-tight font-bold text-gray-900">임태호 교수님</h2>
          <p class="mt-2 text-gray-600">화학공학과 교수</p>
          
          <div class="mt-6 space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">전공 분야</h3>
              <ul class="text-gray-600 space-y-1">
                <li>• 화학공정 시스템 설계</li>
                <li>• 공정 최적화</li>
                <li>• 환경 화학공학</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">연구실</h3>
              <p class="text-gray-600">화학공학과 연구실 (베어드홀 XXX호)</p>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">연락처</h3>
              <p class="text-gray-600">이메일: professor@ssu.ac.kr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-8 bg-gray-50 rounded-lg p-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-4">교수님 말씀</h3>
      <blockquote class="text-gray-700 italic">
        "ChemiSSUe는 화학공학과 학생들이 함께 성장하고 배우는 소중한 공간입니다. 
        여러분들이 이 소모임을 통해 학업적 성취뿐만 아니라 인생의 좋은 동반자들을 만나기를 바랍니다."
      </blockquote>
    </div>
  </div>',
  '지도교수 소개 - ChemiSSUe',
  'ChemiSSUe 지도교수 임태호 교수님을 소개합니다.'
);

-- 기본 페이지 섹션 데이터
INSERT OR IGNORE INTO page_sections (page_key, section_key, section_name, content, sort_order) VALUES
('home', 'hero', '메인 히어로', 'ChemiSSUe와 함께하는 화학공학의 여정', 1),
('home', 'stats', '통계 정보', '활동 통계 및 성과 정보', 2),
('home', 'recent_posts', '최근 게시글', '최근 공지사항 및 활동 소식', 3),
('home', 'upcoming_events', '다가오는 일정', '예정된 모임 및 행사 일정', 4);

-- 기본 사이트 설정
INSERT OR IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_title', 'ChemiSSUe', 'text', '사이트 제목'),
('site_description', '숭실대학교 화학공학과 소모임', 'text', '사이트 설명'),
('contact_email', 'chemissue@ssu.ac.kr', 'text', '연락처 이메일'),
('footer_text', '© 2024 ChemiSSUe. All rights reserved.', 'text', '푸터 텍스트'),
('logo_url', 'https://page.gensparksite.com/v1/base64_upload/3112448ea471353bb7c3b074a1213546', 'image', '로고 URL'),
('primary_color', '#3b82f6', 'text', '메인 컬러'),
('show_professor_section', 'true', 'boolean', '교수님 섹션 표시 여부'),
('enable_notifications', 'true', 'boolean', '알림 기능 활성화'),
('max_upload_size', '10485760', 'number', '최대 업로드 크기 (바이트)');

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_page_contents_page_key ON page_contents(page_key);
CREATE INDEX IF NOT EXISTS idx_page_sections_page_key ON page_sections(page_key);
CREATE INDEX IF NOT EXISTS idx_page_sections_sort_order ON page_sections(page_key, sort_order);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);