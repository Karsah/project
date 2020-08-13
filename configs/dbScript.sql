create schema da_database collate utf8mb4_0900_ai_ci;

create table admins
(
    id int unsigned auto_increment
        primary key,
    name varchar(31) collate utf8mb4_unicode_ci not null,
    surname varchar(64) not null,
    email varchar(127) collate utf8mb4_unicode_ci not null,
    password varchar(255) not null,
    is_super enum('1','0') default '0' not null ,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    updated_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    constraint users_email_uindex
        unique (email)
);
insert into admins(name,surname,email,password,is_super)
values ('Karen','Sahakyan','admin@mail.ru','$2b$12$VGChWeTja6tDYyM3EYy1le5X4Yru32tqYQdlShI4n5T/QydRnRk9i','1');
