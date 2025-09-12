-- Content Management System for Homepage
-- This allows admin to edit all text content without coding

-- Main content sections table
CREATE TABLE IF NOT EXISTS content_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_key TEXT UNIQUE NOT NULL, -- e.g. 'about_us', 'professor_info'
  section_title TEXT NOT NULL,
  section_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Individual content items within sections
CREATE TABLE IF NOT EXISTS content_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_key TEXT NOT NULL,
  item_key TEXT NOT NULL, -- e.g. 'title', 'description', 'phone'
  item_type TEXT NOT NULL DEFAULT 'text', -- text, textarea, email, phone, url
  item_label TEXT NOT NULL, -- Human readable label for admin
  item_value TEXT, -- The actual content
  item_order INTEGER DEFAULT 0, -- Display order
  is_required BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(section_key, item_key)
);

-- Activity list items (for checklist items)
CREATE TABLE IF NOT EXISTS activity_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL, -- 'academic' or 'communication'
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'fas fa-check',
  item_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Values and goals items
CREATE TABLE IF NOT EXISTS values_goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'fas fa-star',
  item_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Content change log for tracking edits
CREATE TABLE IF NOT EXISTS content_change_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_name TEXT NOT NULL,
  record_id INTEGER NOT NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by INTEGER NOT NULL,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Insert default content sections
INSERT OR IGNORE INTO content_sections (section_key, section_title, section_description) VALUES
  ('about_us', '소개 섹션', '우리는 누구인가요 섹션의 내용을 관리합니다'),
  ('professor_info', '지도교수 정보', '지도교수님의 연락처와 정보를 관리합니다'),
  ('contact_info', '연락처 정보', '소모임 연락처와 가입 안내 정보를 관리합니다');

-- Insert default content items
INSERT OR IGNORE INTO content_items (section_key, item_key, item_type, item_label, item_value, item_order) VALUES
  -- About Us Section
  ('about_us', 'main_title', 'text', '메인 제목', '우리는 누구인가요?', 1),
  ('about_us', 'main_description', 'textarea', '소개 설명', 'ChemiSSUe는 숭실대학교 화학공학과 학생들로 이루어진 소모임입니다. 화학공학에 대한 지식을 공유하고, 함께 성장하며 소통하는 공간을 만들어가고 있습니다.', 2),
  ('about_us', 'detail_description', 'textarea', '상세 설명', '우리는 학업부터 미래의 대학원 진학을 통해 폭넓은 시각의 성장을 나누고, 더불어 원활한 의사소통을 통해 균형 잡힌 사회인으로 거듭나고자 합니다.', 3),
  
  -- Professor Info Section  
  ('professor_info', 'name', 'text', '교수님 성명', '임태호 교수님', 1),
  ('professor_info', 'title', 'text', '직책/소속', '숭실대학교 화학공학과', 2),
  ('professor_info', 'phone', 'phone', '전화번호', '+82-2-820-0617', 3),
  ('professor_info', 'office', 'text', '사무실', '황룡관 908호', 4),
  ('professor_info', 'email', 'email', '이메일', 'taeholim@ssu.ac.kr', 5),
  ('professor_info', 'department', 'text', '학과', '화학공학과', 6),
  ('professor_info', 'note', 'textarea', '안내 메시지', 'ChemiSSUe 소모임의 지도교수님이며, 학술활동에 관련된 문의나 가입 상담은 아래 연락처로 문의하시기 바랍니다.', 7),
  
  -- Contact Info Section
  ('contact_info', 'join_title', 'text', '가입 안내 제목', '함께하고 싶으시다면', 1),
  ('contact_info', 'join_description', 'textarea', '가입 안내 설명', 'ChemiSSUe에 관심이 있으시거나 가입을 원하신다면 연락해주세요!', 2),
  ('contact_info', 'contact_email', 'email', '소모임 이메일', 'chemissue@ssu.ac.kr', 3),
  ('contact_info', 'department_name', 'text', '학과명', '숭실대학교 화학공학과', 4),
  ('contact_info', 'button_text', 'text', '연락처 버튼 텍스트', '연락처 남기기', 5);

-- Insert default activity items
INSERT OR IGNORE INTO activity_items (category, title, description, item_order) VALUES
  -- Academic Activities
  ('academic', '정기 스터디 그룹 운영', '전공 과목별 스터디 그룹을 운영합니다', 1),
  ('academic', '강의 자료 인완동', '유용한 강의 자료를 공유합니다', 2),
  ('academic', '실력 내외 승급 측정', '학습 성과를 측정하고 개선점을 찾습니다', 3),
  ('academic', '세미나와 발표 토론', '정기적인 세미나와 토론 활동을 진행합니다', 4),
  
  -- Communication Activities  
  ('communication', '정기 모임 및 MT', '정기적인 모임과 MT를 통해 친목을 도모합니다', 1),
  ('communication', '친목 네트워킹', '선후배 간의 네트워킹을 강화합니다', 2),
  ('communication', '취업 정보 공유', '취업 관련 정보를 공유합니다', 3),
  ('communication', '동아리 문화 참여', '다양한 동아리 활동에 참여합니다', 4);

-- Insert default values and goals
INSERT OR IGNORE INTO values_goals (title, description, icon, item_order) VALUES
  ('학업 성취', '함께 공부하며 더 나은 학업 성과를 달성합니다', 'fas fa-graduation-cap', 1),
  ('상호 협력', '서로 도우며 협력하는 문화를 만들어갑니다', 'fas fa-hands-helping', 2),
  ('미래 준비', '전문가로서 미래를 준비하는 기회를 제공합니다', 'fas fa-rocket', 3);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_sections_key ON content_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_content_items_section ON content_items(section_key);
CREATE INDEX IF NOT EXISTS idx_content_items_order ON content_items(item_order);
CREATE INDEX IF NOT EXISTS idx_activity_items_category ON activity_items(category);
CREATE INDEX IF NOT EXISTS idx_activity_items_order ON activity_items(item_order);
CREATE INDEX IF NOT EXISTS idx_values_goals_order ON values_goals(item_order);
CREATE INDEX IF NOT EXISTS idx_content_change_log_table ON content_change_log(table_name, record_id);