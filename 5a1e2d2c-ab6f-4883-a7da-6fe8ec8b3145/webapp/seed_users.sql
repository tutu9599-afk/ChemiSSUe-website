-- 관리자 및 테스트 사용자 생성

-- 관리자 계정 (비밀번호: admin123)
INSERT OR IGNORE INTO users (username, email, password_hash, full_name, student_id, role, is_active, email_verified) VALUES 
  ('admin', 'admin@chemissue.ssu.ac.kr', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '관리자', NULL, 'admin', TRUE, TRUE);

-- 테스트 사용자들 (비밀번호: password123)  
INSERT OR IGNORE INTO users (username, email, password_hash, full_name, student_id, role, is_active, email_verified) VALUES 
  ('kim_student', 'kim@ssu.ac.kr', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '김철수', '20210001', 'member', TRUE, TRUE),
  ('lee_student', 'lee@ssu.ac.kr', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '이영희', '20210002', 'member', TRUE, TRUE),
  ('park_student', 'park@ssu.ac.kr', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', '박민수', '20210003', 'moderator', TRUE, TRUE);

-- 기존 게시글에 사용자 연결
UPDATE posts SET user_id = (SELECT id FROM users WHERE username = 'admin' LIMIT 1) WHERE id = 1;
UPDATE posts SET user_id = (SELECT id FROM users WHERE username = 'kim_student' LIMIT 1) WHERE id = 2;
UPDATE posts SET user_id = (SELECT id FROM users WHERE username = 'admin' LIMIT 1) WHERE id = 3;
UPDATE posts SET user_id = (SELECT id FROM users WHERE username = 'admin' LIMIT 1) WHERE id = 4;

-- 기존 댓글에 사용자 연결
UPDATE comments SET user_id = (SELECT id FROM users WHERE username = 'kim_student' LIMIT 1) WHERE id = 1;
UPDATE comments SET user_id = (SELECT id FROM users WHERE username = 'lee_student' LIMIT 1) WHERE id = 2;
UPDATE comments SET user_id = (SELECT id FROM users WHERE username = 'park_student' LIMIT 1) WHERE id = 3;
UPDATE comments SET user_id = (SELECT id FROM users WHERE username = 'lee_student' LIMIT 1) WHERE id = 4;

-- 기존 이벤트에 사용자 연결
UPDATE events SET user_id = (SELECT id FROM users WHERE username = 'admin' LIMIT 1);

-- 샘플 알림 생성
INSERT OR IGNORE INTO notifications (user_id, title, message, type, related_id) VALUES 
  ((SELECT id FROM users WHERE username = 'kim_student' LIMIT 1), '환영합니다!', 'ChemiSSUe에 오신 것을 환영합니다.', 'system', NULL),
  ((SELECT id FROM users WHERE username = 'lee_student' LIMIT 1), '새 공지사항', '신입생 환영회 안내가 등록되었습니다.', 'post', 1),
  ((SELECT id FROM users WHERE username = 'park_student' LIMIT 1), '회의 일정', '다음 주 정기 회의가 예정되어 있습니다.', 'event', 1);