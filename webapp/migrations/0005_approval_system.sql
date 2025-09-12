-- 회원가입 승인 시스템
-- 사용자 승인 상태 필드 추가

-- users 테이블에 승인 상태 컬럼 추가
ALTER TABLE users ADD COLUMN approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE users ADD COLUMN approved_by INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN approved_at DATETIME;
ALTER TABLE users ADD COLUMN rejection_reason TEXT;

-- 기존 사용자들은 자동으로 승인된 상태로 설정
UPDATE users SET approval_status = 'approved', approved_at = datetime('now') WHERE approval_status = 'pending';

-- 승인 관련 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);
CREATE INDEX IF NOT EXISTS idx_users_approved_by ON users(approved_by);