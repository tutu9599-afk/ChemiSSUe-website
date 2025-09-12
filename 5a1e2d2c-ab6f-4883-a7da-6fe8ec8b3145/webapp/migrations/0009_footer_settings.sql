-- Footer Settings Migration
-- Create footer_settings table to store customizable footer information

CREATE TABLE IF NOT EXISTS footer_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL UNIQUE, -- 'contact', 'description', 'copyright'
  title TEXT,
  content TEXT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default footer settings
INSERT OR REPLACE INTO footer_settings (section, title, content, icon, display_order) VALUES
('description', 'ChemiSSUe', '숭실대학교 화학공학과 소모임\n함께 성장하고 소통하는 공간', 'fas fa-flask', 1),
('contact_university', '연락처', '숭실대학교 화학공학과', 'fas fa-university', 2),
('contact_email', NULL, 'chemissue@ssu.ac.kr', 'fas fa-envelope', 3),
('copyright', NULL, '© 2024 ChemiSSUe. All rights reserved.', NULL, 4);

-- Create footer_links table for quick links section
CREATE TABLE IF NOT EXISTS footer_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default footer links
INSERT OR REPLACE INTO footer_links (title, url, display_order) VALUES
('공지사항', '/board/notices', 1),
('활동사진', '/board/photos', 2),
('일정표', '/board/schedule', 3),
('회의록', '/board/meetings', 4);