create table if not exists main_slider(
    id int unsigned auto_increment primary key,
    name varchar(31) collate   utf8mb4_unicode_ci not null,
    info varchar(2000) collate   utf8mb4_unicode_ci not null,
    bg_image varchar(64) collate  utf8mb4_unicode_ci not null
);
insert into main_slider ( name, info, bg_image)


values('Amberd','Amberd is one of the largest castles in Armenia.','amberd.jpg'),
       ('Saghmosavank','The Saghmosavank is a 13th-century Armenian monastic complex. ','saghmosavank.jpg'),
       ('Qagheni castle','Qagheni fortress is a large complex located on the southern edge of Dashtadem village. ','Qagheni castle.jpg'),
       ('Veratsnund memorial','Veratsnund Memorial was erected in memory of the Battle of Bash-Aparan.','Veratsnundmemorial.jpg')