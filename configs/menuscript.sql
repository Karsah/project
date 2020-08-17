create table if not exists backendmenu(
    id tinyint unsigned auto_increment primary key,
    name varchar(31) collate   utf8mb4_unicode_ci not null,
    icon varchar(31) collate   utf8mb4_unicode_ci not null,
    parent_id tinyint unsigned null
);