﻿using Microsoft.EntityFrameworkCore;
using SafariSync_API.Models.ActivityModel;
using SafariSync_API.Models;
using SafariSync_API.Models.ContractorModel;
using SafariSync_API.Models.EquipmentModel;
using SafariSync_API.Models.SkillsModel;
using SafariSync_API.Models.StockModel;
using SafariSync_API.Models.SupplierModel;
using SafariSync_API.Models.ToolboxModel;
using SafariSync_API.Models.UserModel;
using SafariSync_API.Models.Reporting;

namespace SafariSync_API.Data
{
    public class SafariSyncDBContext : DbContext
    {
        public SafariSyncDBContext(DbContextOptions<SafariSyncDBContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Supplier> Supplier { get; set; }
        public DbSet<Contractor> Contractor { get; set; }
        public DbSet<SupplierType> SupplierType { get; set; }
        public DbSet<ContractorType> ContractorType { get; set; }
        public DbSet<Skills> Skills { get; set; }
        public DbSet<UserSkill> UserSkill { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<Stock> Stock { get; set; }
        public DbSet<EquipmentSupplier> EquipmentSupplier { get; set; }
        public DbSet<StockSupplier> StockSupplier { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Activity> Activity { get; set; }
        public DbSet<TaskS> TaskS { get; set; }
        public DbSet<ActivityTask> ActivityTask { get; set; }
        public DbSet<ScheduledActivity> ScheduledActivity { get; set; }
        public DbSet<ActivityStatus> ActivityStatus { get; set; }
        public DbSet<ScheduledTask> ScheduledTask { get; set; }
        public DbSet<ScheduledTaskUser> ScheduledTaskUser { get; set; }
        public DbSet<ScheduledTaskContractor> ScheduledTaskContractor { get; set; }
        public DbSet<ScheduledActivityScheduledTask> ScheduledActivityScheduledTask { get; set; }
        public DbSet<Toolbox> Toolbox { get; set; }
        public DbSet<ToolboxEquipment> ToolboxEquipment { get; set; }
        public DbSet<ToolboxStock> ToolboxStock { get; set; }
        public DbSet<Report> Report { get; set; }
    }
}