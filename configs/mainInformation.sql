create table maininformationpages(
                                     id int unsigned auto_increment primary key,
                                     header varchar(31) collate   utf8mb4_unicode_ci not null,
                                     bg_image varchar (63) collate utf8mb4_unicode_ci not null
);
create table maininformation(
                                parent_id int unsigned,
                                foreign key(parent_id)  references maininformationpages(id),
                                header varchar(31) collate   utf8mb4_unicode_ci not null,
                                main_header varchar(31) collate   utf8mb4_unicode_ci not null,
                                info varchar(2000) collate   utf8mb4_unicode_ci not null
);

create table informationpagegallery(
                                parent_id int unsigned,
                                foreign key(parent_id)  references maininformationpages(id),
                                gallery_image varchar(63) collate   utf8mb4_unicode_ci not null
);
create table see_on_map(
                                id int unsigned auto_increment not null ,
                                name varchar(63) collate   utf8mb4_unicode_ci not null,
                                iframe varchar(200) collate utf8mb4_unicode_ci not null
)