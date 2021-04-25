drop table if exists orders_log cascade;
drop table if exists orders_items cascade;
drop table if exists orders cascade;
drop table if exists items cascade;
drop table if exists users cascade;

create table users (
    user_id int auto_increment primary key,
    username varchar(50) not null,
    password varchar(64) not null,
    profile enum('client', 'admin') not null,
    login_attempts int,
    last_login_timestamp timestamp null,
    enabled boolean not null,
    creation_timestamp timestamp default current_timestamp,
    update_timestamp timestamp default current_timestamp,
    unique (username)
);

create table items (
    item_id int auto_increment primary key,
    code varchar(100) not null,
    name varchar(100) not null,
    description varchar(2000) not null,
    category enum('2x2', '3x3', '4x4', '5x5', '6x6', '7x7', '8x8', 'MxN', 'NxN', 'other') not null,
    price decimal(11,2) not null,
    picture blob not null,
    creation_timestamp timestamp default current_timestamp,
    update_timestamp timestamp default current_timestamp,
    unique (name, category)
);

create table orders (
    order_id int auto_increment primary key,
    user_id int not null,
    code varchar(100) not null,
    total decimal(11,2) not null,
    creation_timestamp timestamp,
    foreign key order_user (user_id) references users (user_id)
);

create table orders_items (
    item_id int not null,
    order_id int not null,
    quantity int not null,
    primary key (item_id, order_id),
    foreign key order_item_item (item_id) references items (item_id),
    foreign key order_item_order (order_id) references orders (order_id)
);

create table orders_log (
    order_log_entry_id int primary key auto_increment,
    order_id int not null,
    status enum('placed', 'client-cancelled', 'admin-cancelled', 'purchased', 'delivered', 'completed') not null,
    comment varchar(2000),
    creation_timestamp timestamp,
    foreign key log_entry_order (order_id) references orders (order_id)
);

insert into users (username, password, profile, enabled) values ('admin', upper(md5('4dm1n')), 'admin', true);
