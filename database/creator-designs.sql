CREATE TABLE IF NOT EXISTS creator_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(254) NULL,
  password_hash VARCHAR(255) NULL,
  instagram_username VARCHAR(30) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY creator_users_email_unique (email)
);

ALTER TABLE creator_users MODIFY password_hash VARCHAR(255) NULL;
ALTER TABLE creator_users MODIFY email VARCHAR(254) NULL;

SET @auth_column_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'creator_users' AND column_name = 'instagram_username'
);
SET @auth_column_sql = IF(@auth_column_exists = 0,
  'ALTER TABLE creator_users ADD COLUMN instagram_username VARCHAR(30) NULL',
  'SELECT 1'
);
PREPARE auth_column_stmt FROM @auth_column_sql;
EXECUTE auth_column_stmt;
DEALLOCATE PREPARE auth_column_stmt;

SET @auth_column_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'creator_users' AND column_name = 'email_verified'
);
SET @auth_column_sql = IF(@auth_column_exists = 0,
  'ALTER TABLE creator_users ADD COLUMN email_verified DATETIME NULL',
  'SELECT 1'
);
PREPARE auth_column_stmt FROM @auth_column_sql;
EXECUTE auth_column_stmt;
DEALLOCATE PREPARE auth_column_stmt;

SET @auth_column_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'creator_users' AND column_name = 'name'
);
SET @auth_column_sql = IF(@auth_column_exists = 0,
  'ALTER TABLE creator_users ADD COLUMN name VARCHAR(255) NULL',
  'SELECT 1'
);
PREPARE auth_column_stmt FROM @auth_column_sql;
EXECUTE auth_column_stmt;
DEALLOCATE PREPARE auth_column_stmt;

SET @auth_column_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'creator_users' AND column_name = 'image'
);
SET @auth_column_sql = IF(@auth_column_exists = 0,
  'ALTER TABLE creator_users ADD COLUMN image TEXT NULL',
  'SELECT 1'
);
PREPARE auth_column_stmt FROM @auth_column_sql;
EXECUTE auth_column_stmt;
DEALLOCATE PREPARE auth_column_stmt;

CREATE TABLE IF NOT EXISTS creator_identities (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  owner_id BIGINT UNSIGNED NOT NULL,
  provider ENUM('google', 'facebook', 'instagram') NOT NULL,
  provider_user_id VARCHAR(191) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY creator_identity_provider_user_unique (provider, provider_user_id),
  KEY creator_identity_owner_id (owner_id),
  CONSTRAINT creator_identity_owner_fk
    FOREIGN KEY (owner_id) REFERENCES creator_users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS creator_designs (
  owner_id BIGINT UNSIGNED NOT NULL,
  design_id VARCHAR(64) NOT NULL,
  design_json LONGTEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (owner_id, design_id),
  KEY creator_designs_updated_at (owner_id, updated_at),
  CONSTRAINT creator_designs_owner_fk
    FOREIGN KEY (owner_id) REFERENCES creator_users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS creator_password_resets (
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY creator_password_resets_token_hash_unique (token_hash),
  CONSTRAINT creator_password_resets_user_fk
    FOREIGN KEY (user_id) REFERENCES creator_users (id) ON DELETE CASCADE
);
