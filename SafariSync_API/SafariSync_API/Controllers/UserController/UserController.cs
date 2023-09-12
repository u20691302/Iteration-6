using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SafariSync_API.Models.UserModel;
using SafariSync_API.Repositories.UserRepository;
using SafariSync_API.ViewModels.UserViewModel;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SafariSync_API.Repositories.CRUD;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using System;
using SafariSync_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

namespace SafariSync_API.Controllers.UserController
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly ICRUDRepository iCRUDRepository;
        private readonly SafariSyncDBContext safariSyncDBContext;

        public UserController(IConfiguration configuration, IUserRepository userRepository, ICRUDRepository crudRepository, SafariSyncDBContext SafariSyncDBContext)
        {
            iCRUDRepository = crudRepository;
            _configuration = configuration;
            _userRepository = userRepository;
            safariSyncDBContext = SafariSyncDBContext;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserViewModel userViewModel)
        {
            if (await _userRepository.GetUserByIdPassport(userViewModel.IdPassport) != null)
            {
                return BadRequest("User is already registered (ID/Passport number already in use)");
            }

            // Create a new rating for the user
            var rating = new Ratings
            {
                Rating = 3 // You can set an initial rating value, like 0.
            };

            // Create a new user and associate the rating with the user
            var user = new User
            {
                Username = userViewModel.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userViewModel.Password), // Use BCrypt to hash the password
                Role = userViewModel.Role,
                Email = userViewModel.Email,
                IdPassport = userViewModel.IdPassport,
                Surname = userViewModel.Surname,
                Cellphone = userViewModel.Cellphone,
                ProfileImage = userViewModel.ProfileImage,
                IDImage = userViewModel.IDImage,
                RegDate = DateTime.Now,
                Ratings = rating // Associate the rating with the user
            };

            await _userRepository.CreateUser(user);

            // Create associated UserSkill records
            foreach (var skill in userViewModel.Skills)
            {
                var userSkill = new UserSkill
                {
                    User_ID = user.User_ID,
                    Skill_ID = skill.Skill_ID
                };
                // Add the equipmentsupplier to the database using ICRUDRepository
                iCRUDRepository.Add(userSkill);
            }
            // Save changes asynchronously in the CRUD repository
            await iCRUDRepository.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserViewModel userDto)
        {
            var user = await _userRepository.GetUserByIdPassport(userDto.IdPassport);

            if (user == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid ID/Passport number or password");
            }

            var token = GenerateJwtToken(user);

            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(User user)
        {
            if (string.IsNullOrEmpty(user.Username))
            {
                throw new ArgumentNullException(nameof(user.Username));
            }

            var tokenHandler = new JwtSecurityTokenHandler();

            //var key = Encoding.ASCII.GetBytes(_configuration.GetSection("Jwt:Secret").Value);

            ///////////////////////////////////////////////////////////
            var secret = _configuration.GetSection("Jwt:Secret").Value;

            if (string.IsNullOrEmpty(secret))
            {
                throw new Exception("JWT Secret is not set in configuration");
            }

            var key = Encoding.ASCII.GetBytes(secret);
            ///////////////////////////////////////////////////////////////

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Surname, user.Surname),
                    new Claim(ClaimTypes.SerialNumber, user.IdPassport),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim("cellphone", user.Cellphone),
                    new Claim("userid", user.User_ID.ToString()),
                    new Claim("profileImage", user.ProfileImage),
                    new Claim("rating", Convert.ToString(user.Ratings?.Rating ?? 0m)) // Convert decimal to string
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            // Print the rating value
            Debug.WriteLine($"Rating value for user '{user.Username}': {user.Ratings?.Rating ?? 0}");

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserViewModel userDto)
        {
            // Retrieve the user from the database based on the provided id
            var user = await _userRepository.GetUserById(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Update the user properties with the values from the userDto object
            user.Username = userDto.Username;
            user.Email = userDto.Email;
            user.IdPassport = userDto.IdPassport;
            user.Surname = userDto.Surname;
            user.Cellphone = userDto.Cellphone;
         

            // Remove existing user skills
            await _userRepository.RemoveUserSkills(user.User_ID);

            // Create associated UserSkill records for new skills
            foreach (var skill in userDto.Skills)
            {
                var userSkill = new UserSkill
                {
                    User_ID = user.User_ID,
                    Skill_ID = skill.Skill_ID
                };
                // Add the userSkill to the database using ICRUDRepository
                iCRUDRepository.Add(userSkill);
            }

            // Save changes asynchronously in the CRUD repository
            await iCRUDRepository.SaveChangesAsync();

            // Save the updated user to the database
            await _userRepository.UpdateUser(user);

            var token = GenerateJwtToken(user);

            return Ok(new { message = "User updated successfully", Token = token });
        }


        [HttpPut("updatepassword/{id}")]
        public async Task<IActionResult> UpdatePassword(int id, string currentPassword, string newPassword)
        {
            // Retrieve the user from the database based on the provided id
            var user = await _userRepository.GetUserById(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Check if the current password provided in the request matches the stored password
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                return BadRequest("Invalid current password");
            }

            // Update the user's password with the new password provided in the request
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            // Save the updated user to the database
            await _userRepository.UpdateUser(user);

            var token = GenerateJwtToken(user);

            return Ok(new { message = "Password updated successfully", Token = token });
        }

        [HttpPut("updateprofileimage/{id}")]
        //[HttpPost("updateprofileimage/{id}")]
        public async Task<IActionResult> UpdateProfileImage(int id, IFormFile newProfilePhoto)
        {
            // Retrieve the user from the database based on the provided id
            var user = await _userRepository.GetUserById(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Read the image data from the IFormFile
            using (var stream = new MemoryStream())
            {
                await newProfilePhoto.CopyToAsync(stream);
                user.ProfileImage = Convert.ToBase64String(stream.ToArray());
            }

            // Save the updated user to the database
            await _userRepository.UpdateUser(user);

            var token = GenerateJwtToken(user);

            return Ok(new { message = "Profile photo updated successfully", Token = token });
        }

        ///////////////////////////////////
        //////////////////////////////////
        ///////////////////////////////
        string accountSid = "ACcaa3fc10e2076ea95e51736c6a201c8b";
        string authToken = "b63c5e7df0403044f422cd39119f7f50";

        [HttpPost]
        [Route("SendSMS")]
        public async Task<IActionResult> SendSMS(string idpass)
        {

            var user = await _userRepository.GetUserByIdPassport(idpass);

            if (user == null)
            {
                return BadRequest("User not found");
            }
            try
            {
                string convertedCellNum = "";
                convertedCellNum = "+27" + user.Cellphone.Substring(1);
                TwilioClient.Init(accountSid, authToken);

                string newPassword = GenerateRandomPassword();
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
                await _userRepository.UpdateUser(user);

                var smsMessage = MessageResource.Create(
                    body: "SafariSync new password is: " + newPassword,
                    from: new Twilio.Types.PhoneNumber("+14786067955"),  // Replace with your Twilio phone number

                    to: new Twilio.Types.PhoneNumber(convertedCellNum)
                    
                );

                // SMS sent successfully
                var responseObj = new { smsId = smsMessage.Sid };
                return Ok(responseObj);
            }
            catch (Exception ex)
            {
                // Error occurred while sending SMS
                return StatusCode(500, "Failed to send SMS. Error: " + ex.Message);
            }
        }

        private static readonly Random random = new Random();
        private static readonly string symbols = "!@#$%^&*";
        private static string GenerateRandomPassword()
        {
            const string capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string numbers = "0123456789";

            var passwordChars = new char[8];

            // Add one symbol
            passwordChars[0] = symbols[random.Next(symbols.Length)];

            // Add one capital letter
            passwordChars[1] = capitalLetters[random.Next(capitalLetters.Length)];

            // Add one number
            passwordChars[2] = numbers[random.Next(numbers.Length)];

            // Add five random characters
            for (int i = 3; i < 8; i++)
            {
                passwordChars[i] = (char)random.Next('a', 'z' + 1);
            }

            // Shuffle the characters to make the password more random
            for (int i = 0; i < passwordChars.Length; i++)
            {
                int randomIndex = random.Next(i, passwordChars.Length);
                (passwordChars[i], passwordChars[randomIndex]) = (passwordChars[randomIndex], passwordChars[i]);
            }

            return new string(passwordChars);
        }

        /////////////////////////////////
        private string GenerateUniqueToken()
        {
            // Generate a unique token (you can use a library or create your own logic)
            // For simplicity, I'm using a random 10-character alphanumeric string
            string token = Guid.NewGuid().ToString("N").Substring(0, 10);
            return token;
        }

        [HttpPost]
        [Route("SendRegSMS")]
        public async Task<IActionResult> SendRegSMS(string cellnum, string role)
        {
            try
            {
                string convertedCellNum = "+27" + cellnum.Substring(1);
                TwilioClient.Init(accountSid, authToken);

                // Generate a unique token for this registration request
                string token = GenerateUniqueToken();

                // Compose the message body with the token
                string messageBody = GetMessageBodyBasedOnRole(role, token);

                var smsMessage = MessageResource.Create(
                    body: messageBody,
                    from: new Twilio.Types.PhoneNumber("+14786067955"),  // Replace with your Twilio phone number
                    to: new Twilio.Types.PhoneNumber(convertedCellNum)
                );

                // SMS sent successfully
                var responseObj = new { smsId = smsMessage.Sid };
                return Ok(responseObj);
            }
            catch (Exception ex)
            {
                // Error occurred while sending SMS
                return StatusCode(500, "Failed to send SMS. Error: " + ex.Message);
            }
        }

        private string GetMessageBodyBasedOnRole(string role, string token)
        {
            switch (role)
            {
                case "User":
                    return $"Hello, you are registered as a user. Your registration link is: http://localhost:4200/register-user?token={token}";
                case "Admin":
                    return $"Hello, you are registered as an admin. Your registration link is: http://localhost:4200/register-admin?token={token}";
                case "Farm Worker":
                    return $"Hello, you are registered as a worker. Your registration link is: http://localhost:4200/register-farmworker?token={token}";
                default:
                    return "Hello, you are registered. Your registration link is: www.hello.com";
            }
        }


        /////////////////////////////////

        [HttpGet("getUserSkills/{id}")]
        public async Task<IActionResult> GetSkillsByUserId(int id)
        {
            // Retrieve the user from the database based on the provided id
            var user = await _userRepository.GetUserById(id);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Get the skills associated with the user by calling the repository method
            var userSkills = await _userRepository.GetSkillsByUserId(id);

            // If you need to return just the Skill_IDs as an array of integers, you can do:
            // var skillIds = userSkills.Select(skill => skill.Skill_ID).ToArray();

            return Ok(userSkills);
        }


        [HttpGet]
        [Route("ReadAllUsersAsync")]
        public async Task<IActionResult> ReadAllUsersAsync()
        {
            try
            {
                var results = await safariSyncDBContext.User
                    .Include(e => e.UserSkill).ThenInclude(e => e.Skills)
                    .Include(e => e.Ratings)
                    .ToListAsync();

                // Return an Ok response with the retrieved users
                return Ok(results);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadAllRatingsAsync")]
        public async Task<IActionResult> ReadAllRatingsAsync()
        {
            try
            {
                // Retrieve all ratingss asynchronously from the CRUD repository
                var results = await iCRUDRepository.ReadAllAsync<Ratings>();

                // Order the ratingss in alphabetical order
                results = results.OrderBy(ratings => ratings.Rating).ToArray();

                // Return an Ok response with the retrieved ratingss
                return Ok(results);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadOneUserAsync/{userID}")]
        public async Task<IActionResult> ReadOneUserAsync(int userID)
        {
            try
            {
                var results = await safariSyncDBContext.User
                    .Include(e => e.UserSkill).ThenInclude(e => e.Skills)
                    .Include(e => e.Ratings).Where(e => e.User_ID == userID)
                    .FirstOrDefaultAsync();

                // Return an Ok response with the retrieved user
                return Ok(results);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("ReadOneUserSkillAsync/{userID}")]
        public async Task<IActionResult> ReadOneUserSkillAsync(int userID)
        {
            try
            {
                var result = await safariSyncDBContext.UserSkill
                  .Where(e => e.User_ID == userID)
                  .Include(e => e.Skills)
                  .ToListAsync();

                // Return an Ok response with the retrieved user
                return Ok(result);
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPut]
        [Route("UpdateUserAsync/{UserID}")]
        public async Task<ActionResult<UserViewModel>> UpdateUserAsync(int UserID, UserViewModel svm)
        {
            try
            {
                // Retrieve the existing user from the CRUD repository based on the UserID
                var existingUser = await iCRUDRepository.ReadOneAsync<User>(UserID);

                // If the existing user is not found, return a NotFound response with an appropriate message
                if (existingUser == null)
                    return NotFound("The user does not exist");

                // Retrieve all Ratingss from the CRUD repository
                var existingRatings = await iCRUDRepository.ReadAllAsync<Ratings>();

                // Retrieve the Ratings by name from the list of Ratingss using LINQ
                var ratings = existingRatings.FirstOrDefault(st => st.Rating_ID == svm.Rating_ID);

                // If the Ratings is not found, return a BadRequest response with an appropriate message
                if (ratings == null)
                    return BadRequest("User type does not exist");

                // Update the properties of the existing user with the values from the UserViewModel
                existingUser.Username = svm.Username;
                existingUser.Email = svm.Email;
                existingUser.IdPassport = svm.IdPassport;
                existingUser.Surname = svm.Surname;
                existingUser.Cellphone = svm.Cellphone;

                // Update the user in the CRUD repository
                iCRUDRepository.Update(existingUser);

                // Save changes asynchronously in the CRUD repository and check if the operation succeeds
                if (await iCRUDRepository.SaveChangesAsync())
                {
                    // Return an Ok response with the updated user
                    return Ok(existingUser);
                }
            }
            catch (Exception)
            {
                // Return a StatusCode 500 response if an exception occurs during the operation
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            // Return a BadRequest response if the request is invalid
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                // Fetch the existing user by ID using SafariSyncDBContext
                var existingUser = await safariSyncDBContext.User
                    .Include(e => e.UserSkill)
                    .Include(e => e.Ratings)
                    .FirstOrDefaultAsync(e => e.User_ID == id);

                // If user with the given ID is not found, return a not found response
                if (existingUser == null)
                {
                    return NotFound();
                }

                // Remove the associated user ratings first
                if (existingUser.Ratings != null)
                {
                    iCRUDRepository.Delete(existingUser.Ratings);
                }

                // Remove the user from the database using ICRUDRepository
                iCRUDRepository.Delete(existingUser);

                // Remove the associated userSkill records from the database using ICRUDRepository
                foreach (var userSkill in existingUser.UserSkill.ToList())
                {
                    iCRUDRepository.Delete(userSkill);
                }

                try
                {
                    // Save changes asynchronously in the context
                    await safariSyncDBContext.SaveChangesAsync();

                    // Return the successful response
                    return Ok(existingUser);
                }
                catch (DbUpdateException ex)
                {
                    // Check if the exception is due to a foreign key violation
                    if (ex.InnerException is SqlException sqlEx && sqlEx.Number == 547)
                    {
                        // Return a 400 Bad Request status code indicating the foreign key violation
                        return BadRequest("Cannot delete the user because it is associated with other entities.");
                    }
                    else
                    {
                        // Handle other exceptions and return an error response
                        return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the user.");
                    }
                }
            }
            catch (Exception)
            {
                // Handle the exception and return an error response
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the user.");
            }
        }
    }
}