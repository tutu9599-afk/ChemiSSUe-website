-- 게시판별 권한 관리 시스템

-- 게시판별 권한 설정 테이블
CREATE TABLE IF NOT EXISTS board_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'member')),
  can_create BOOLEAN NOT NULL DEFAULT 0,
  can_edit_own BOOLEAN NOT NULL DEFAULT 0,
  can_edit_all BOOLEAN NOT NULL DEFAULT 0,
  can_delete_own BOOLEAN NOT NULL DEFAULT 0,
  can_delete_all BOOLEAN NOT NULL DEFAULT 0,
  can_comment BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(category_id, role)
);

-- 기본 권한 설정 추가 (모든 카테고리에 대해)
-- 관리자: 모든 권한
INSERT OR REPLACE INTO board_permissions (category_id, role, can_create, can_edit_own, can_edit_all, can_delete_own, can_delete_all, can_comment)
SELECT 
  c.id,
  'admin',
  1, 1, 1, 1, 1, 1
FROM categories c;

-- 운영진: 생성, 본인 편집/삭제, 댓글 가능
INSERT OR REPLACE INTO board_permissions (category_id, role, can_create, can_edit_own, can_edit_all, can_delete_own, can_delete_all, can_comment)
SELECT 
  c.id,
  'moderator',
  1, 1, 0, 1, 0, 1
FROM categories c;

-- 일반 회원: 기본적으로 댓글만 가능 (관리자가 개별 설정)
INSERT OR REPLACE INTO board_permissions (category_id, role, can_create, can_edit_own, can_edit_all, can_delete_own, can_delete_all, can_comment)
SELECT 
  c.id,
  'member',
  0, 0, 0, 0, 0, 1
FROM categories c;

-- 일부 게시판은 일반 회원도 글 작성 가능하게 설정
-- 게시판, 건의사항, 마음의 편지는 일반 회원도 글 작성 가능
UPDATE board_permissions 
SET can_create = 1, can_edit_own = 1, can_delete_own = 1
WHERE role = 'member' 
AND category_id IN (
  SELECT id FROM categories WHERE slug IN ('board', 'suggestions', 'letters')
);

-- 권한 변경 로그 테이블 (선택사항)
CREATE TABLE IF NOT EXISTS board_permission_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  permission_field TEXT NOT NULL,
  old_value BOOLEAN,
  new_value BOOLEAN,
  changed_by INTEGER NOT NULL,
  changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_board_permissions_category_role ON board_permissions(category_id, role);
CREATE INDEX IF NOT EXISTS idx_board_permission_logs_category ON board_permission_logs(category_id);