using ReactApp1.Server.Database.Models;

namespace ReactApp1.Server.Services
{
    public class CustomerService
    {
        public void CreateCustomer(Customer requestCustomer)
        {
            if (string.IsNullOrWhiteSpace(requestCustomer.CustomerCode) ||
                string.IsNullOrWhiteSpace(requestCustomer.CustomerName) ||
                string.IsNullOrWhiteSpace(requestCustomer.CustomerPhone) ||
                string.IsNullOrWhiteSpace(requestCustomer.CustomerAddress)
                )
            {
                throw new Exception("All fields are required.");
            }
        }

        public void GetCustomerById(int customerId)
        {
            if(customerId <=0 )
            {
                throw new Exception("CustomerId cannot be null.");
            }
        }


        public void UpdateCustomer(int customerId, Customer requestCustomer)
        {
            if(customerId <= 0)
            {
                throw new Exception("CustomerId cannot be null.");
            }
            if(requestCustomer == null)
            {
                throw new Exception("Request Customer cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(requestCustomer.CustomerCode) ||
                string.IsNullOrWhiteSpace(requestCustomer.CustomerName) ||
                string.IsNullOrWhiteSpace(requestCustomer.CustomerPhone) ||
                string.IsNullOrWhiteSpace(requestCustomer.CustomerAddress)
                )
            {
                throw new Exception("All fields are required.");
            }

        }

        public void DeleteCustomer(int customerId)
        {
            if (customerId <= 0)
            {
                throw new Exception("CustomerId cannot be null.");
            }
        }
    }
}
