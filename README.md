# Food-Order-USSD
This is an application built with USSD. The application registers users and enable yours to make orders in the application where their food will be delivered.


# Tables
## Users
- bank_name
- account_name
- phone
- email
- fullName
- address

## Orders
- foodName
- userId
- amount


The idea behind this app is that when a user comes in the first time, he/she has to register to create an account.

After registering or coming in as a registered user, you can make orders based his/her email, the User table is queried based on user email where an address is generated to where the food will be delived to.

## Up Coming Features
- Make payment to our platform when order is generated
- Resolving bank_name and account_number to get user full name and save to profile.
- Make orders for another registered user.
