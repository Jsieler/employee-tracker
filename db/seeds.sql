INSERT INTO department (name) 
VALUES
('Executive Office'),
('Basketball Operations'),
('Broadcasting'),
('Player');

INSERT INTO role (title, salary, department_id)
VALUES
('Owner', 0, 1),
('President', 200000, 1),
('Executive VP', 500000, 2),
('General Manager', 400000, 2),
('Head Coach', 2000000, 2),
('Radio Broadcaster', 80000, 3),
('Television Broadcaster', 100000, 3),
('Television Studio Host', 100000, 3),
('ALL NBA PLAYER', 40000000, 4),
('ALL STAR PLAYER', 25000000, 4),
('STARTER', 15000000, 4),
('ROLE PLAYER',11000000, 4),
('BENCH RESERVE', 400000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Ryan', 'Smith', 1, 1),
('Jim', 'Olsen', 2, 5),
('Dennis', 'Lindsey', 3, 2),
('Justin', 'Zanik', 4, 3),
('Quin', 'Synder', 5, 4),
('Ron', 'Boone', 6, NULL),
('David', 'Locke', 6, NULL),
('Craig', 'Bolerjack', 7, NULL),
('Matt', 'Harpring', 7, NUll),
('Thurl', 'Bailey', 8, NULL),
('Alema', 'Harrington', 8, NULL),
('Donovan', 'Mitchell', 9, NULL),
('Rudy', 'Gobert', 9, NULL),
('Mike', 'Conely', 10, NULL),
('Royce', 'Oneale', 11, NULL),
('Bojan', 'Bogdanovic', 11, NULL),
('Joe', 'Ingles', 11, NULL),
('Jordan', 'Clarkson', 12, NULL),
('Derrick', 'Favors', 12, NULL),
('Georges', 'Niang', 13, NULL),
('Miye', 'Oni', 13, NULL);