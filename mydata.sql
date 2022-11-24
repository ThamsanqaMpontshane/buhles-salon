create table clients(
    id serial primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    phone_number varchar(50) not null
);
create table treatments(
    id serial primary key,
    type varchar(50) not null,
    code varchar(50) not null,
    price numeric(10,2) not null
);
create table stylist(
    id serial primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    phone_number varchar(50) not null,
    commission numeric(10,2) not null
);
create table bookings(
    id serial primary key,
    the_date varchar(50) not null,
    the_time time,
    client_id integer references clients(id),
    treatment_id integer references treatments(id),
    stylist_id integer references stylist(id)
);
create table date_test ( the_date date,  slot time  );
insert into clients(first_name, last_name, phone_number) values('John', 'Smith', '0123456789');
insert into clients(first_name, last_name, phone_number) values('Jane', 'Doe', '0456789012');
insert into clients(first_name, last_name, phone_number) values('Mary', 'Jones', '0789012345');
insert into clients(first_name, last_name, phone_number) values('Peter', 'Parker', '0120987654');
insert into clients(first_name, last_name, phone_number) values('Tony', 'Stark', '0454904321');
insert into clients(first_name, last_name, phone_number) values('Bruce', 'Wayne', '07893432109');
insert into clients(first_name, last_name, phone_number) values('Gur','Geva', '01207456789');

insert into treatments(type, code, price) values('Pedicure', 'PED', 175);
insert into treatments(type, code, price) values('Manicure', 'MAN', 215);
insert into treatments(type, code, price) values('Makeup', 'MAK', 185);
insert into treatments(type, code, price) values('Brows and Lashes', 'BRO', 240);

-- insert into stylist table
-- The stylist commission is stored as a decimal amount like 0.15 for 15% and 0.17 for 17%.
insert into stylist(first_name, last_name, phone_number, commission) values('Sive', 'Mavesta', '01207456789', 0.15);
insert into stylist(first_name, last_name, phone_number, commission) values('Ras', 'Phanjile', '01207459039', 0.17);
insert into stylist(first_name, last_name, phone_number, commission) values('Wayne', 'York', '01207440289', 0.7);


