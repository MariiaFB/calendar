# event
CREATE TABLE events
(
id_event int NOT NULL AUTO_INCREMENT,
id_group int NOT NULL,
date_start datetime NOT NULL,
date_end datetime NOT NULL,
event_description varchar(255),
id_color varchar(255),
PRIMARY KEY (id_event),
CONSTRAINT group_constr FOREIGN KEY (id_group)
REFERENCES groups(id_group)
);

# colors
CREATE TABLE colors
(
id_color int NOT NULL AUTO_INCREMENT,
color_code int NOT NULL,
color_name varchar(255),
PRIMARY KEY (id_color)
);

# insert into events
insert_events(null, data.group, data.start, data.end, data.description, data.color);