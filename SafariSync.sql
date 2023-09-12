CREATE DATABASE SafariSync;
USE SafariSync;

CREATE TABLE SupplierType (
    SupplierType_ID INT IDENTITY(1,1) PRIMARY KEY,
    SupplierType_Name TEXT NOT NULL
);

CREATE TABLE ContractorType (
    ContractorType_ID INT IDENTITY(1,1) PRIMARY KEY,
    ContractorType_Name TEXT NOT NULL
);

CREATE TABLE Contractor (
    Contractor_ID INT IDENTITY(1,1) PRIMARY KEY,
    Contractor_Name TEXT NOT NULL,
    Contractor_Phone_Number TEXT NOT NULL,
    Contractor_Email_Address TEXT NOT NULL,
    Contractor_Address TEXT NOT NULL,
    ContractorType_ID INT,
    FOREIGN KEY (ContractorType_ID) REFERENCES ContractorType(ContractorType_ID)
);

CREATE TABLE Supplier (
    Supplier_ID INT IDENTITY(1,1) PRIMARY KEY,
    Supplier_Name TEXT NOT NULL,
    Supplier_Phone_Number TEXT NOT NULL,
    Supplier_Email_Address TEXT NOT NULL,
    Supplier_Address TEXT NOT NULL,
    SupplierType_ID INT,
    FOREIGN KEY (SupplierType_ID) REFERENCES SupplierType(SupplierType_ID)
);

CREATE TABLE Equipment (
    Equipment_ID INT IDENTITY(1,1) PRIMARY KEY,
    Equipment_Name TEXT NOT NULL,
    Equipment_Description TEXT NOT NULL,
    Equipment_Quantity_On_Hand INT NOT NULL,
    Equipment_Low_Level_Warning INT NOT NULL
);

CREATE TABLE Stock (
    Stock_ID int IDENTITY(1,1) PRIMARY KEY,
    Stock_Name text NOT NULL,
    Stock_Description text NOT NULL,
    Stock_Quantity_On_Hand int NOT NULL,
    Stock_Low_Level_Warning int NOT NULL
);

CREATE TABLE Toolbox (
  Toolbox_ID INT IDENTITY(1,1) PRIMARY KEY,
  Toolbox_Name VARCHAR(255) NOT NULL,
  Toolbox_Description TEXT
);

CREATE TABLE ToolboxEquipment (
  ToolboxEquipment_ID INT IDENTITY(1,1) PRIMARY KEY,
  Toolbox_ID INT,
  Equipment_ID INT,
  Quantity INT NOT NULL,
  FOREIGN KEY (Toolbox_ID) REFERENCES Toolbox(Toolbox_ID),
  FOREIGN KEY (Equipment_ID) REFERENCES Equipment(Equipment_ID)
);

CREATE TABLE ToolboxStock (
  ToolboxStock_ID INT IDENTITY(1,1) PRIMARY KEY,
  Toolbox_ID INT,
  Stock_ID INT,
  Quantity INT NOT NULL,
  FOREIGN KEY (Toolbox_ID) REFERENCES Toolbox(Toolbox_ID),
  FOREIGN KEY (Stock_ID) REFERENCES Stock(Stock_ID)
);

CREATE TABLE EquipmentSupplier (
	EquipmentSupplier_ID INT IDENTITY(1,1) PRIMARY KEY,
    Equipment_ID INT NOT NULL,
    Supplier_ID INT NOT NULL,
    FOREIGN KEY (Equipment_ID) REFERENCES Equipment(Equipment_ID),
    FOREIGN KEY (Supplier_ID) REFERENCES Supplier(Supplier_ID)
);

CREATE TABLE StockSupplier (
	StockSupplier_ID INT IDENTITY(1,1) PRIMARY KEY,
    Stock_ID INT NOT NULL,
    Supplier_ID INT NOT NULL,
    FOREIGN KEY (Stock_ID) REFERENCES Stock(Stock_ID),
    FOREIGN KEY (Supplier_ID) REFERENCES Supplier(Supplier_ID)
);

CREATE TABLE Skills (
    Skill_ID INT IDENTITY(1,1) PRIMARY KEY,
    Skill_Name TEXT NOT NULL,
    Skill_Description TEXT NOT NULL
);

CREATE TABLE Ratings (
    Rating_ID INT IDENTITY(1,1) PRIMARY KEY,
    Rating DECIMAL(10, 2) NOT NULL
);

CREATE TABLE [User](
    User_ID int IDENTITY(1,1) PRIMARY KEY NOT NULL,
    Username nvarchar(50) NOT NULL,
	PasswordHash nvarchar(100) NOT NULL,
    Email nvarchar(50),
    IdPassport nvarchar(50) NOT NULL,
    Surname nvarchar(50) NOT NULL,
    Cellphone nvarchar(50) NOT NULL,
    [Role] nvarchar(50) NOT NULL,
	ProfileImage nvarchar(MAX),
	IDImage nvarchar(MAX) NOT NULL,
	Rating_ID INT NOT NULL,
	RegDate DATETIME NOT NULL,
	FOREIGN KEY (Rating_ID) REFERENCES Ratings(Rating_ID)
);

CREATE TABLE UserSkill (
    UserSkill_ID INT IDENTITY(1,1) PRIMARY KEY,
    User_ID INT NOT NULL,
    Skill_ID INT NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES [User](User_ID),
    FOREIGN KEY (Skill_ID) REFERENCES Skills(Skill_ID)
);

CREATE TABLE Activity (
    Activity_ID INT IDENTITY(1,1) PRIMARY KEY,
    Activity_Name NVARCHAR(255) NOT NULL,
    Activity_Description NVARCHAR(1000) NOT NULL
);

CREATE TABLE TaskS (
    Task_ID INT IDENTITY(1,1) PRIMARY KEY,
    Task_Name NVARCHAR(255) NOT NULL,
    Task_Description NVARCHAR(1000) NOT NULL,
    Skill_ID INT NOT NULL,
    FOREIGN KEY (Skill_ID) REFERENCES Skills (Skill_ID)
);

CREATE TABLE ActivityTask (
    ActivityTask_ID INT IDENTITY(1,1) PRIMARY KEY,
    Activity_ID INT NOT NULL,
    Task_ID INT NOT NULL,
    FOREIGN KEY (Activity_ID) REFERENCES Activity (Activity_ID),
    FOREIGN KEY (Task_ID) REFERENCES TaskS (Task_ID)
);

CREATE TABLE ActivityStatus (
    ActivityStatus_ID INT IDENTITY(1,1) PRIMARY KEY,
    Activity_Status NVARCHAR(255) NOT NULL
);

CREATE TABLE TaskStatus (
    TaskStatus_ID INT IDENTITY(1,1) PRIMARY KEY,
    Task_Status NVARCHAR(255) NOT NULL
);

CREATE TABLE ScheduledActivity (
    ScheduledActivity_ID INT IDENTITY(1,1) PRIMARY KEY,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    Activity_Location NVARCHAR(255) NOT NULL,
    User_ID INT NOT NULL,
    ActivityStatus_ID INT NOT NULL,
    Activity_ID INT NOT NULL,
	FOREIGN KEY (User_ID) REFERENCES [User] (User_ID),
    FOREIGN KEY (ActivityStatus_ID) REFERENCES ActivityStatus (ActivityStatus_ID),
    FOREIGN KEY (Activity_ID) REFERENCES Activity (Activity_ID)
);

CREATE TABLE ScheduledTask (
    ScheduledTask_ID INT IDENTITY(1,1) PRIMARY KEY,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    Task_ID INT NOT NULL,
	TaskStatus_ID INT NOT NULL,
	FOREIGN KEY (Task_ID) REFERENCES TaskS (Task_ID),
	FOREIGN KEY (TaskStatus_ID) REFERENCES TaskStatus (TaskStatus_ID),
);

CREATE TABLE ScheduledActivityScheduledTask (
    ScheduledActivityScheduledTask_ID INT IDENTITY(1,1) PRIMARY KEY,
    ScheduledActivity_ID INT NOT NULL,
    ScheduledTask_ID INT NOT NULL,
	FOREIGN KEY (ScheduledActivity_ID) REFERENCES ScheduledActivity (ScheduledActivity_ID),
    FOREIGN KEY (ScheduledTask_ID) REFERENCES ScheduledTask (ScheduledTask_ID)
);

CREATE TABLE ScheduledTaskUser (
    ScheduledTaskUser_ID INT IDENTITY(1,1) PRIMARY KEY,
    User_ID INT NOT NULL,
    ScheduledTask_ID INT NOT NULL,
    FOREIGN KEY (User_ID) REFERENCES [User] (User_ID),
    FOREIGN KEY (ScheduledTask_ID) REFERENCES ScheduledTask (ScheduledTask_ID)
);

CREATE TABLE ScheduledTaskContractor (
    ScheduledTaskContractor_ID INT IDENTITY(1,1) PRIMARY KEY,
    ScheduledTask_ID INT NOT NULL,
    Contractor_ID INT NOT NULL,
    FOREIGN KEY (ScheduledTask_ID) REFERENCES ScheduledTask (ScheduledTask_ID),
    FOREIGN KEY (Contractor_ID) REFERENCES Contractor (Contractor_ID)
);

CREATE TABLE Report (
  Report_ID INT PRIMARY KEY IDENTITY,
  Report_Title VARCHAR(255) NOT NULL,
  CreatedAt DATETIME NOT NULL,
  PdfUrl VARCHAR(Max) NOT NULL,
  User_ID INT NOT NULL,
  FOREIGN KEY (User_ID) REFERENCES [User] (User_ID)
);

CREATE TABLE RatingSettings (
    RatingSettings_ID INT IDENTITY(1,1) PRIMARY KEY,
    RatingSettings_Upper INT NOT NULL,
	RatingSettings_Lower INT NOT NULL
);

CREATE TABLE NotificationStatus (
    NotificationStatus_ID INT IDENTITY(1,1) PRIMARY KEY,
    NotificationStatus_Name NVARCHAR(255) NOT NULL
);

CREATE TABLE Notification (
    Notification_ID INT IDENTITY(1,1) PRIMARY KEY,
    Date DATETIME NOT NULL,
	User_ID INT NOT NULL,
	NotificationStatus_ID INT NOT NULL,
	ScheduledTask_ID INT NOT NULL,
	ScheduledActivity_ID INT NOT NULL,
	FOREIGN KEY (NotificationStatus_ID) REFERENCES NotificationStatus (NotificationStatus_ID),
	FOREIGN KEY (ScheduledTask_ID) REFERENCES ScheduledTask (ScheduledTask_ID),
	FOREIGN KEY (ScheduledActivity_ID) REFERENCES ScheduledActivity (ScheduledActivity_ID),
	FOREIGN KEY (User_ID) REFERENCES [User] (User_ID)
);

INSERT INTO SupplierType (SupplierType_Name)
VALUES 
    ('Farming Tools Supplier'),
    ('Crop Seeds Supplier'),
    ('Fertilizer Supplier'),
    ('Livestock Feed Supplier'),
    ('Irrigation Equipment Supplier'),
    ('Farming Equipment Supplier');

INSERT INTO ContractorType (ContractorType_Name)
VALUES 
    ('Farm Labor Contractor'),
    ('Crop Consulting Contractor'),
    ('Irrigation Contractor'),
    ('Livestock Management Contractor'),
    ('Land Clearing Contractor'),
    ('Fencing Contractor');

INSERT INTO Supplier (Supplier_Name, Supplier_Phone_Number, Supplier_Email_Address, Supplier_Address, SupplierType_ID)
VALUES 
    ('Farm Equipment Co.', '1234567890', 'farmequipment@example.com', 'Farm Equipment Street, City', 1),
    ('CropCo Seeds', '9876543210', 'cropco@example.com', 'Crop Seeds Avenue, Town', 2),
    ('FertileFields', '5555555555', 'fertilefields@example.com', 'Fertilizer Farm, Countryside', 3),
    ('HealthyLivestock', '1111111111', 'livestock@example.com', 'Livestock Feed Farm, Rural', 4),
    ('AquaTech Irrigation', '9999999999', 'aquatech@example.com', 'Irrigation Equipment Plaza, Village', 5),
    ('FarmTech Solutions', '8888888888', 'farmtech@example.com', 'Farm Equipment Road, Suburb', 6),
    ('AgriTools Plus', '7777777777', 'agritools@example.com', 'Agricultural Tools Street, Outskirts', 6);

INSERT INTO Contractor (Contractor_Name, Contractor_Phone_Number, Contractor_Email_Address, Contractor_Address, ContractorType_ID)
VALUES 
    ('Harvest Helpers', '1234567890', 'harvesthelpers@example.com', 'Harvest Farm, Countryside', 1),
    ('CropCare Consultants', '9876543210', 'cropcare@example.com', 'Crop Consulting Avenue, Town', 2),
    ('AquaFlow Irrigation', '5555555555', 'aquaflow@example.com', 'Irrigation Solutions Street, Village', 3),
    ('HealthyHerd Management', '1111111111', 'healthyherd@example.com', 'Livestock Farm, Rural', 4),
    ('ClearFields Contractors', '9999999999', 'clearfields@example.com', 'Land Clearing Plaza, Suburb', 5),
    ('SecureFence Solutions', '8888888888', 'securefence@example.com', 'Fencing Farm, Outskirts', 6);

INSERT INTO Equipment (Equipment_Name, Equipment_Description, Equipment_Quantity_On_Hand, Equipment_Low_Level_Warning)
VALUES 
    ('Tractor', 'A farming vehicle used for plowing and cultivating fields.', 5, 1),
    ('Seeder', 'A machine used to plant seeds in the prepared soil.', 3, 1),
    ('Harvester', 'A machine used to gather ripe fruits and vegetables from the fields.', 2, 1),
	('Irrigation System', 'Equipment used to provide water to crops.', 1, 1),
	('Chainsaw', 'A power tool used for cutting trees and branches.', 6, 2),
	('Fence Repair Kit', 'A set of tools for repairing fences and enclosures.', 4, 1),
	('Leaf Blower', 'A device for blowing leaves and debris.', 3, 1),
	('Pressure Washer', 'A machine used for cleaning surfaces with high-pressure water.', 2, 1);

INSERT INTO Stock (Stock_Name, Stock_Description, Stock_Quantity_On_Hand, Stock_Low_Level_Warning)
VALUES 
    ('Fertilizer', 'Bag of fertilizer for enriching soil nutrients.', 10, 5),
    ('Pesticides', 'Bottle of pesticides for pest control.', 15, 8),
    ('Livestock Feed', 'Sack of livestock feed for feeding animals.', 20, 10),
	('Seeds', 'Packet of crop seeds for planting.', 30, 12),
	('Nails', 'Box of nails for various uses.', 10, 5),
    ('Screws', 'Box of assorted screws.', 20, 8),
    ('Bolts', 'Pack of bolts in different sizes.', 15, 6),
	('Nuts', 'Assorted nuts for various applications.', 13, 6);

INSERT INTO EquipmentSupplier (Equipment_ID, Supplier_ID)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 1),
    (2, 2),
    (2, 3),
    (3, 1),
    (3, 2),
    (3, 3),
    (4, 6),
    (5, 1),
    (6, 6),
    (7, 5),
    (8, 2);

INSERT INTO StockSupplier (Stock_ID, Supplier_ID)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 1),
    (2, 2),
    (2, 3),
    (3, 1),
    (3, 2),
    (3, 3),
    (4, 6),
    (5, 1),
    (6, 6),
    (7, 5),
    (8, 2);

INSERT INTO Skills (Skill_Name, Skill_Description)
VALUES 
    ('Plowing Fields', 'Using the tractor to plow the fields for planting.'),
    ('Sowing Seeds', 'Planting seeds in the prepared soil.'),
    ('Watering Crops', 'Ensuring the crops receive adequate water.'),
    ('Harvesting Produce', 'Gathering ripe fruits and vegetables from the fields.'),
    ('Pruning Plants', 'Trimming and cutting unwanted parts of plants for better growth.'),
    ('Fertilizing Crops', 'Applying fertilizers to provide essential nutrients to the crops.'),
    ('Pest Control', 'Identifying and controlling pests that can damage crops.'),
    ('Operating Farm Equipment', 'Using various farm equipment for different tasks.'),
    ('Irrigation Management', 'Managing the irrigation system to optimize water usage.'),
    ('Livestock Handling', 'Caring for and handling farm animals, such as cattle and poultry.');

INSERT INTO Ratings (Rating)
VALUES
    (4.5),
    (3.8),
    (5.0),
    (4.2),
	(2.5),
	(2.0);

-- Sample data with hashed passwords
INSERT INTO [User] (Username, PasswordHash, Email, IdPassport, Surname, Cellphone, [Role], ProfileImage, IDImage, Rating_ID, RegDate)
VALUES
    ('john_doe', '$2a$10$HhF2Sc4w7U5g7lKQzmPmyuwTOILv9lLpJIKjC7zCO9KjE3i4NUD7y', 'john.doe@example.com', '0106135076081', 'Doe', '1234567890', 'Farm Worker', 'profile_john_doe.jpg', 'profile_john_doe.jpg', 1, '2023-08-20 12:00:00'),
    ('sarah_smith', '$2a$10$HhF2Sc4w7U5g7lKQzmPmyuwTOILv9lLpJIKjC7zCO9KjE3i4NUD7y', 'sarah.smith@example.com', '0106135076085', 'Smith', '9876543210', 'Admin', 'profile_sarah_smith.jpg', 'profile_john_doe.jpg', 2, '2023-08-20 12:00:00'),
    ('mike_jackson', '$2a$10$HhF2Sc4w7U5g7lKQzmPmyuwTOILv9lLpJIKjC7zCO9KjE3i4NUD7y', 'mike.jackson@example.com', '0106135076083', 'Jackson', '5555555555', 'Supervisor', 'profile_mike_jackson.jpg', 'profile_john_doe.jpg', 3, '2023-08-20 12:00:00'),
    ('jane_williams', '$2a$10$HhF2Sc4w7U5g7lKQzmPmyuwTOILv9lLpJIKjC7zCO9KjE3i4NUD7y', 'jane.williams@example.com', '0106135076084', 'Williams', '7777777777', 'Supervisor', 'profile_jane_williams.jpg', 'profile_john_doe.jpg', 4, '2023-08-20 12:00:00'),
    ('alex_harris', '$2a$10$HhF2Sc4w7U5g7lKQzmPmyuwTOILv9lLpJIKjC7zCO9KjE3i4NUD7y', 'alex.harris@example.com', '0106135076087', 'Harris', '8888888888', 'Farm Worker', 'profile_alex_harris.jpg', 'profile_john_doe.jpg', 5, '2023-08-20 12:00:00'),
    ('emily_taylor', '$2a$10$HhF2Sc4w7U5g7lKQzmPmyuwTOILv9lLpJIKjC7zCO9KjE3i4NUD7y', 'emily.taylor@example.com', '0106135076080', 'Taylor', '9999999999', 'Farm Worker', 'profile_emily_taylor.jpg', 'profile_john_doe.jpg', 6, '2023-08-20 12:00:00');

INSERT INTO Toolbox (Toolbox_Name, Toolbox_Description)
VALUES
  ('Farm Maintenance Toolbox', 'A toolbox for general farm maintenance and repairs.'),
  ('Harvesting Toolbox', 'A toolbox for tasks related to harvesting crops.'),
  ('Irrigation Toolbox', 'A toolbox for maintaining and repairing irrigation systems.'),
  ('Fencing Toolbox', 'A toolbox for repairing and maintaining fences.'),
  ('Land Clearing Toolbox', 'A toolbox for tasks related to land clearing and preparation.');

INSERT INTO ToolboxEquipment (Toolbox_ID, Equipment_ID, Quantity)
VALUES
  (1, 1, 2),  -- 2 Tractors in Farm Maintenance Toolbox
  (1, 2, 5),  -- 5 Seeders in Farm Maintenance Toolbox
  (1, 3, 1),  -- 1 Harvester in Farm Maintenance Toolbox
  (2, 1, 3),  -- 3 Harvesters in Harvesting Toolbox
  (2, 4, 1),  -- 1 Irrigation System in Harvesting Toolbox
  (3, 2, 4),  -- 4 Chainsaws in Irrigation Toolbox
  (3, 3, 2),  -- 2 Fence Repair Kits in Irrigation Toolbox
  (4, 4, 1),  -- 1 Leaf Blower in Fencing Toolbox
  (4, 5, 1),  -- 1 Pressure Washer in Fencing Toolbox
  (4, 6, 3),  -- 3 Hammers in Fencing Toolbox
  (5, 1, 2),  -- 2 Screwdrivers in Land Clearing Toolbox
  (5, 3, 1);  -- 1 Wrench in Land Clearing Toolbox

INSERT INTO ToolboxStock (Toolbox_ID, Stock_ID, Quantity)
VALUES
  (1, 1, 500),  -- 500 Fertilizers in Farm Maintenance Toolbox
  (1, 2, 200),  -- 200 Pesticides in Farm Maintenance Toolbox
  (2, 3, 100),  -- 100 Livestock Feeds in Harvesting Toolbox
  (3, 4, 150),  -- 150 Seeds in Irrigation Toolbox
  (3, 5, 100),  -- 100 Nails in Irrigation Toolbox
  (4, 6, 50),   -- 50 Screws in Fencing Toolbox
  (4, 7, 20),   -- 20 Bolts in Fencing Toolbox
  (5, 8, 300);  -- 300 Nuts in Land Clearing Toolbox

INSERT INTO Activity (Activity_Name, Activity_Description)
VALUES
    ('Crop Cultivation', 'Prepare the fields and cultivate crops.'),
    ('Livestock Care', 'Take care of the farm animals.'),
    ('Farm Infrastructure', 'Maintain and repair farm structures.');

INSERT INTO TaskS (Task_Name, Task_Description, Skill_ID)
VALUES
    ('Plowing Fields', 'Use the tractor to plow the fields for planting.', 1),
    ('Sowing Seeds', 'Plant seeds in the prepared soil.', 1),
    ('Watering Crops', 'Ensure the crops receive adequate water.', 1),
    ('Harvesting Produce', 'Gather ripe fruits and vegetables from the fields.', 1),
    ('Feeding Livestock', 'Provide feed and water to the farm animals.', 2),
    ('Milking Cows', 'Gently milk the cows using proper techniques.', 2),
    ('Repairing Fences', 'Fix broken or damaged sections of the farm fences.', 3),
    ('Maintaining Barn', 'Inspect and maintain the barn and other structures.', 3);

INSERT INTO ActivityTask (Activity_ID, Task_ID)
VALUES
    (1, 1),  
    (1, 2),  
    (1, 3),  
    (1, 4), 
    (2, 5), 
    (2, 6),  
    (3, 7),  
    (3, 8)

INSERT INTO ActivityStatus (Activity_Status)
VALUES
    ('Not Started'),
    ('In Progress'),
    ('Completed');

INSERT INTO TaskStatus (Task_Status)
VALUES
    ('Not Started'),
    ('In Progress'),
    ('Completed');

INSERT INTO ScheduledActivity (StartDate, EndDate, Activity_Location, User_ID, ActivityStatus_ID, Activity_ID)
VALUES
    ('2023-07-29 09:00:00', '2023-07-29 12:00:00', 'Field A', 1, 1, 1),
    ('2023-07-30 10:00:00', '2023-07-30 13:00:00', 'Barn', 2, 1, 2),
    ('2023-07-31 08:30:00', '2023-07-31 11:30:00', 'Field B', 3, 1, 3);

INSERT INTO ScheduledTask (StartDate, EndDate, TaskStatus_ID, Task_ID)
VALUES
    ('2023-07-29 09:00:00', '2023-07-29 10:30:00', 1, 1),
    ('2023-07-29 11:00:00', '2023-07-29 12:00:00', 1, 2),
    ('2023-07-30 10:30:00', '2023-07-30 11:30:00', 2, 3),
    ('2023-07-30 12:00:00', '2023-07-30 13:00:00', 3, 4),
    ('2023-07-31 08:30:00', '2023-07-31 09:30:00', 1, 5),
    ('2023-07-31 10:00:00', '2023-07-31 11:00:00', 3, 6),
    ('2023-07-31 09:00:00', '2023-07-31 10:00:00', 3, 7),
    ('2023-07-31 10:30:00', '2023-07-31 11:30:00', 2, 8);

INSERT INTO ScheduledActivityScheduledTask (ScheduledActivity_ID, ScheduledTask_ID)
VALUES
    (1, 1),  
    (1, 2),  
    (1, 3),  
    (1, 4), 
    (2, 5), 
    (2, 6),  
    (3, 7),  
    (3, 8);

-- UserScheduledTask table
INSERT INTO ScheduledTaskUser (User_ID, ScheduledTask_ID)
VALUES 
    (1, 1),
	(5, 1),-- john_doe (Farm Worker) with ScheduledTask_ID = 1
    (5, 2), -- alex_harris (Farm Worker) with ScheduledTask_ID = 2
    (1, 3), -- john_doe (Farm Worker) with ScheduledTask_ID = 3
    (1, 4),
    (1, 5), -- john_doe (Farm Worker) with ScheduledTask_ID = 5
    (5, 6), -- emily_taylor (Farm Worker) with ScheduledTask_ID = 6
    (5, 7), 
    (5, 8); 


INSERT INTO ScheduledTaskContractor (ScheduledTask_ID, Contractor_ID)
VALUES
    (1, 1), -- Harvest Helpers with ScheduledTask_ID = 1
    (1, 2), -- CropCare Consultants with ScheduledTask_ID = 1
    (2, 3), -- AquaFlow Irrigation with ScheduledTask_ID = 2
    (2, 4), -- HealthyHerd Management with ScheduledTask_ID = 2
    (3, 5), -- ClearFields Contractors with ScheduledTask_ID = 3
    (3, 6), -- SecureFence Solutions with ScheduledTask_ID = 3
    (4, 1), -- Harvest Helpers with ScheduledTask_ID = 4
    (4, 3), -- AquaFlow Irrigation with ScheduledTask_ID = 4
    (5, 5), -- ClearFields Contractors with ScheduledTask_ID = 5
    (5, 6), -- SecureFence Solutions with ScheduledTask_ID = 5
    (6, 2), -- CropCare Consultants with ScheduledTask_ID = 6
    (6, 4), -- HealthyHerd Management with ScheduledTask_ID = 6
    (7, 1), -- Harvest Helpers with ScheduledTask_ID = 7
    (7, 6), -- SecureFence Solutions with ScheduledTask_ID = 7
    (8, 2), -- CropCare Consultants with ScheduledTask_ID = 8
    (8, 3); -- AquaFlow Irrigation with ScheduledTask_ID = 8

INSERT INTO UserSkill (User_ID, Skill_ID)
VALUES 
    (1, 1), -- john_doe has skill with Skill_ID = 1 (Plowing Fields)
    (1, 2), -- john_doe has skill with Skill_ID = 2 (Sowing Seeds)
    (1, 3), -- john_doe has skill with Skill_ID = 3 (Watering Crops)
    (1, 4), -- john_doe has skill with Skill_ID = 4 (Harvesting Produce)
    (2, 8), -- sarah_smith has skill with Skill_ID = 8 (Operating Farm Equipment)
    (3, 9), -- mike_jackson has skill with Skill_ID = 9 (Irrigation Management)
    (4, 5), -- jane_williams has skill with Skill_ID = 5 (Pruning Plants)
    (5, 6), -- alex_harris has skill with Skill_ID = 6 (Fertilizing Crops)
    (6, 10), -- emily_taylor has skill with Skill_ID = 10 (Livestock Handling)
    (6, 7); -- emily_taylor has skill with Skill_ID = 7 (Pest Control)

INSERT INTO Report (Report_Title, CreatedAt, User_ID, PdfUrl) VALUES
   ('Report 1', '2023-08-01', 2, 'https://example.com/report1.pdf'),
   ('Report 2', '2023-08-05', 2, 'https://example.com/report2.pdf'),
   ('Report 3', '2023-08-10', 2, 'https://example.com/report3.pdf');

INSERT INTO NotificationStatus (NotificationStatus_Name)
VALUES
    ('Accepted'),
    ('Rejected'),
    ('Pending');

INSERT INTO Notification (Date, User_ID, NotificationStatus_ID, ScheduledTask_ID, ScheduledActivity_ID)
VALUES
    ('2023-09-12 10:00:00', 1, 1, 1, 1),
    ('2023-09-12 11:00:00', 2, 2, 2, 2),
    ('2023-09-12 12:00:00', 4, 3, 3, 3),
	('2023-09-12 12:00:00', 5, 3, 3, 3),
	('2023-09-12 12:00:00', 6, 3, 3, 3),
	('2023-09-12 12:00:00', 3, 3, 3, 3),
	('2023-09-12 12:00:00', 3, 3, 3, 3);
