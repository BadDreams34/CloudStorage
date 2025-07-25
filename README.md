#CloudStorage
A simple CloudStorage App made with NodeJS and Vanilla JS.

##Demo
https://drive.google.com/file/d/1mx6HYfoSzWR-jeFHU-YsckYuHHqMu9Yq/view

##Functionality
- user can create an account and upload files.
- can create nested folders and all data will be stored under his account.
- Data can be downloaded at any point of time in future.

##Features
- Uses ExpressJS frameworks for API.
- Utilize session based authentiation with PassportJS.
- PostreSQL for database and Prisma for simplifying queries.
- Uses Supabase Storage to store data under the hood

##Usage
if u want to locally use it:
- Clone this repository.
- create a .env file on your root folder and save Keys `DATABASE_URL` AND `SUPABASE_KEY` respectively.
  ```
  \\example .env
  \\ Change values of Keys accordingly
  DATABASE_URL= "postgresql://sdafasfasd@localhost:5432/dsafasdfdasf?schema=public"
  ```
- Run `npm run setup` to install required packages and Setup prisma.
- After settting up run `npm run start` and app will starting listening to *Port*.

##Support: 
For any issues contact me over Discord: https://discord.com/users/860408741936627714
