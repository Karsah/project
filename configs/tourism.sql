create table sights(
    id int unsigned auto_increment primary key,
    name varchar(50) collate   utf8mb4_unicode_ci not null,
    image varchar(50) collate   utf8mb4_unicode_ci not null,
    info varchar(3000) collate   utf8mb4_unicode_ci not null,
    type varchar(50)  collate   utf8mb4_unicode_ci not null
)