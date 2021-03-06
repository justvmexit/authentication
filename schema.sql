CREATE TABLE users(
    id VARCHAR(36) NOT NULL UNIQUE,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(128) NOT NULL UNIQUE,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE licenses(
    id VARCHAR(36) NOT NULL UNIQUE,
    license VARCHAR(36) NOT NULL UNIQUE,
    hwid VARCHAR(128),
    expiry DATETIME,
    duration INT NOT NULL DEFAULT 0,
    app VARCHAR(36) NOT NULL,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE apps(
    id VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    owner VARCHAR(36) NOT NULL,
    file VARCHAR(36),
    version VARCHAR(255) NOT NULL,
    status INT NOT NULL DEFAULT 0,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE variables(
    id VARCHAR(36) NOT NULL UNIQUE,
    app VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    content VARCHAR(1024) NOT NULL,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions(
    id VARCHAR(36) NOT NULL UNIQUE,
    license VARCHAR(36) NOT NULL,
    app VARCHAR(36) NOT NULL,
    token VARCHAR(128) NOT NULL UNIQUE,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP
);