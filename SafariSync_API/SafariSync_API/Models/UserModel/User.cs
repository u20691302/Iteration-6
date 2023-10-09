﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SafariSync_API.Models.UserModel
{
    public class User
    {
        [Key]
        public int User_ID { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Surname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string IdPassport { get; set; } = string.Empty;

        public string Cellphone { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public string ProfileImage { get; set; } = string.Empty;

        public string IDImage { get; set; } = string.Empty;

        public DateTime RegDate { get; set; }

        public int Rating_ID { get; set; }

        [ForeignKey("Rating_ID")]
        public Ratings? Ratings { get; set; }

        [ForeignKey("User_ID")]
        public ICollection<UserSkill> UserSkill { get; set; } = new List<UserSkill>();
    }
}