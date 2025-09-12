-- ChemiSSUe 홈페이지 초기 데이터

-- 카테고리 데이터 삽입
INSERT OR IGNORE INTO categories (name, description, slug) VALUES 
  ('공지사항', '중요한 공지사항을 확인하세요', 'notices'),
  ('활동사진', 'ChemiSSUe의 다양한 활동 사진들', 'photos'),
  ('일정표', '소모임 일정을 확인하세요', 'schedule'),
  ('회의록', '회의 내용과 결정사항을 확인하세요', 'meetings'),
  ('게시판', '자유롭게 소통하는 공간', 'board'),
  ('건의사항', '소모임 발전을 위한 건의사항', 'suggestions'),
  ('홍보자료', 'ChemiSSUe 홍보 및 소개 자료', 'promotion'),
  ('마음의 편지', '서로에게 전하는 따뜻한 메시지', 'letters'),
  ('자료실', '학업 및 활동 관련 자료 공유', 'resources');

-- 샘플 게시글 데이터
INSERT OR IGNORE INTO posts (title, content, author, category_id, is_featured) VALUES 
  ('ChemiSSUe에 오신 것을 환영합니다!', 
   '숭실대학교 화학공학과 소모임 ChemiSSUe입니다. 함께 성장하고 소통하는 공간을 만들어가요!', 
   '운영진', 1, TRUE),
  
  ('2024년 신입생 환영회 사진', 
   '즐거웠던 신입생 환영회 현장을 사진으로 공유합니다!', 
   '홍길동', 2, TRUE),
   
  ('정기회의 회의록 - 2024년 3월', 
   '# 정기회의 회의록\n\n## 참석자\n- 회장: 김철수\n- 부회장: 이영희\n- 총무: 박민수\n\n## 안건\n1. 새 학기 활동 계획\n2. MT 일정 및 장소\n3. 스터디 그룹 운영\n\n## 결정사항\n- MT: 4월 둘째 주 토요일\n- 스터디 그룹: 주 1회 운영', 
   '김철수', 4, FALSE),
   
  ('학기말 총회 안내', 
   '학기말 총회를 다음과 같이 개최합니다.\n\n일시: 12월 15일 오후 6시\n장소: 화학공학과 세미나실\n\n많은 참석 부탁드립니다.', 
   '운영진', 1, FALSE);

-- 샘플 일정 데이터
INSERT OR IGNORE INTO events (title, description, start_date, end_date, location, event_type, created_by) VALUES 
  ('정기회의', '월례 정기회의', '2024-04-15 18:00:00', '2024-04-15 19:30:00', '화학공학과 세미나실', 'meeting', '김철수'),
  ('MT', 'ChemiSSUe 회원들과 함께하는 MT', '2024-04-20 10:00:00', '2024-04-21 15:00:00', '가평 펜션', 'activity', '이영희'),
  ('스터디 모임', '화공수학 스터디', '2024-04-22 19:00:00', '2024-04-22 21:00:00', '중앙도서관', 'general', '박민수');

-- 샘플 댓글 데이터
INSERT OR IGNORE INTO comments (post_id, author, content) VALUES 
  (1, '신입생A', '잘 부탁드립니다!'),
  (1, '재학생B', '환영해요~ 함께 열심히 활동해봅시다!'),
  (2, '참여자C', '정말 즐거웠어요! 사진 감사합니다.'),
  (4, '회원D', '참석하겠습니다!');