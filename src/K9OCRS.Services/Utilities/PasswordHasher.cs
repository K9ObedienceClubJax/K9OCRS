using System;
using System.Security.Cryptography;
using System.Text;

namespace K9OCRS.Services.Utilities
{
    public class PasswordHasher
    {
        public static string GetHashedPassword(string password)
        {
            var encryptor = SHA256.Create();

            byte[] passBytes = Encoding.ASCII.GetBytes(password);
            byte[] hashBytes = encryptor.ComputeHash(passBytes);
            string hashedPassword = Convert.ToBase64String(hashBytes);

            return hashedPassword;
        }
    }
}
