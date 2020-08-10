create schema da_database collate utf8mb4_0900_ai_ci;

create table admins
(
	id int unsigned auto_increment
		primary key,
	name varchar(31) collate utf8mb4_unicode_ci not null,
	surname varchar(64) not null,
	email varchar(127) collate utf8mb4_unicode_ci not null,
	password varchar(255) not null,
	created_at timestamp default CURRENT_TIMESTAMP not null,
	updated_at timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	main tinyint(1) default 0 not null,
	constraint users_email_uindex
		unique (email)
);

