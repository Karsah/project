create table  if not exists feedbacks(
    id mediumint unsigned auto_increment primary key,
    stars_count  tinyint(1) unsigned not null,
    name varchar(127) collate   utf8mb4_unicode_ci not null,
    surname varchar(127) collate   utf8mb4_unicode_ci not null,
    email varchar(63) collate utf8mb4_unicode_ci not null,
    age tinyint(3)  unsigned not null,
    message varchar(500) collate utf8mb4_unicode_ci not null,
    date datetime default CURRENT_TIMESTAMP
);

alter table feedbacks
add status varchar(16) default 'not-blocked' not null;
truncate table feedbacks