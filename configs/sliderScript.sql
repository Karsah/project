create table if not exists main_slider(
    id int unsigned auto_increment primary key,
    name varchar(31) collate   utf8mb4_unicode_ci not null,
    info varchar(2000) collate   utf8mb4_unicode_ci not null,
    bg_image varchar(64) collate  utf8mb4_unicode_ci not null
);
insert into main_slider ( name, info, bg_image)
values('Amberd','Amberd is one of the largest castles in Armenia. It is especially appealing to those who are interested in history and is popular not only with local hiking enthusiasts but also with thousands of foreigners visiting Armenia.On the way to the castle you will also get acquainted with the indescribable nature of Armenia.','amberd.jpg'),
       ('Saghmosavank','The Saghmosavank is a 13th-century Armenian monastic complex located in the village of Saghmosavan in the Aragatsotn Province of Armenia. Like the Hovhannavank monastery which is five kilometers south, Saghmosavank is situated atop the precipitous gorge carved by the Kasagh river. Their silhouettes dominate the adjacent villages and rise sharp against the background of the mountains crowned by Mount Aragats.','saghmosavank.jpg')