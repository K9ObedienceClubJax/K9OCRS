using DataAccess.Entities;
using Microsoft.AspNetCore.Http;

namespace DataAccess.Repositories
{
    public class PaymentMethodsRepository : BaseRepository<PaymentMethod>
    {
        public PaymentMethodsRepository(IHttpContextAccessor _httpContextAccessor) : base(nameof(PaymentMethod), _httpContextAccessor) { }
    }
}
