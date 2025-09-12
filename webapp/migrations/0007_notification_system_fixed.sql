-- Notification System Tables (Fixed version)
-- Note: notifications table already exists, we'll add missing columns if needed

-- Add missing columns to existing notifications table
ALTER TABLE notifications ADD COLUMN notification_type TEXT NOT NULL DEFAULT 'general';
ALTER TABLE notifications ADD COLUMN target_type TEXT NOT NULL DEFAULT 'all';
ALTER TABLE notifications ADD COLUMN target_value TEXT;
ALTER TABLE notifications ADD COLUMN expires_at DATETIME;

-- Notification Recipients (tracking who received/read notifications)
CREATE TABLE IF NOT EXISTS notification_recipients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  notification_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  is_read INTEGER DEFAULT 0,
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(notification_id, user_id)
);

-- Announcement posts (special posts that appear on top)
-- We'll use the existing posts table with is_featured flag instead
-- No need for separate announcements table

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_notification ON notification_recipients(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_user ON notification_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_read ON notification_recipients(is_read);