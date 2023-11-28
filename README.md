## Installation

### Dependencies
You must have npm installed on your system. Docker is optionally required if you would like to host the database instance locally. There are no other external dependencies, and everything required is managed through npm.

### Project Setup
To get started with our project, clone it locally to your system.

Then, navigate to the root folder of our project and run the command:
```shell
npm i
```
This will install all required dependencies.

Now, the project is ready to build and run. But first we will set up a database instance for our application.

Ideally for simplicity, we recommend you register an account on Supabase and create a project.
If you would like to avoid creating an account, you can instead self-host a Supabase instance locally 
on your own system. Instructions for this follow directly below. 

Otherwise, skip ahead to the [Supabase.com setup](#supabasecom-setup) section

### Supabase Local Deployment

If you decide instead to host the instance locally, follow the directions
[here](https://supabase.com/docs/guides/self-hosting/docker) first to get a local deployment. You will need docker, as they use docker compose to 
run all their services. Run these commands within a folder external to our project, as to not cause
issues with linting.

You will then want to replace the following environment variables in the root file .env:

`NEXT_PUBLIC_SUPABASE_URL`: `http://localhost:8000/`

`NEXT_PUBLIC_SUPABASE_ANON_KEY`: Inside the .example.env file you copied as part of setting up supabase.

`SUPABASE_SERVICE_KEY`: Inside the .example.env file you copied as part of setting up supabase.


You will also need to make note of the following in the .example.env, these are used to log in to the web portal:

`DASHBOARD_USERNAME`

`DASHBOARD_PASSWORD`

With those credentials, access the supabase interface by navigating to http://localhost:8000. You are now ready to
continue on with the steps for supabase.com, you do not need to create a project as you are given an initialized one.
Skip the portion on copying environment variables, as you have already done this.

### Supabase.com Setup:
Create an account on supabase.com by clicking [here](https://supabase.com/dashboard/sign-up).

Once you have an account setup, you will first be brought to a page to create a organization.
Pick a name and continue. Next you will select the option to create a new project. 
Give the project some name, the value you set for the password is unimportant for the demo. 
Once the project is set up, click on the third icon on the sidebar; it should look like a terminal prompt.

Within the root of our project, there are 2 SQL files you will need to execute. One is for the tables 
themselves and an initial employee if you would like to log in and view the app as a brand-new instance. 
However, because most of our project is about displaying data, we also include some seed data for you to insert. 

Go ahead and copy and paste the contents the `schema.sql` file and hit run. To load in the seed data, follow the same 
steps; copy and paste the contents of `seed.sql` into the terminal and hit run. 
The database should now be established with all required data for the demonstration.

Lastly to give our project access to your newly created database, there are 3 environment variables you need to add. 
Check back on the left sidebar where you clicked earlier and find the settings icon at the bottom of the bar. 
This will show you another panel on the left of your screen, click on the label API.

Here you will find the 3 environment variables you will be replacing in the root file `.env`:

`NEXT_PUBLIC_SUPABASE_URL`: Project URL -> URL

`NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project API keys -> (anon) (public)

`SUPABASE_SERVICE_KEY`: Project API keys -> (service_role) (secret)

With those copied, your project is now connected to your new database. You should be now be ready to deploy locally.

### Building and Running

To build and start our project, simply run:
```shell
npm run build_start
```
This will build the project and immediately start 
the Next.js server on `localhost:3000`. 

Connect to the website in your browser and use a pair of credentials in the next section to gain access


### Credentials
Included in the seed.sql are a collection of users, each with a certain role. These roles can be created by custom
within our app. 

(within seed.sql)

| Role                   | Email                             | Password    | 
|------------------------|-----------------------------------|-------------|
| Administrator          | `nathanial.beining@icloud.com`    | `password1` |
| Administrator          | `antione.ohlhoff@icloud.com`      | `password1` |
| Human Resources        | `sunny.mordomo@yahoo.com`         | `password1` |
| Sales Intern           | `sherman.pani@icloud.com`         | `password1` |
| Sales Associate        | `isela.beaumont@icloud.com`       | `password1` |
| Sales Associate        | `elissa.tsidilkovsky@hotmail.com` | `password1` |
| Sales Associate        | `rolanda.reble@outlook.com`       | `password1` |
| Senior Sales Associate | `mammie.matheo@outlook.com`       | `password1` |
Alternatively, if you did not add the seed data, you can connect with the admin integration test account:

| Role          | Email              | Password                                                           | 
|---------------|--------------------|--------------------------------------------------------------------|
| Administrator | `admin@domain.com` | `Q5EB5ZbTVP2WXXvdD5hYKEqXpc6DubqPkDNXUktiUNV56bf4xg5ReL4xiPJ8aGCH` |

The default roles included in the `seed.sql` file, along with their permissions are as summarized:

| Role                   | Abilities                                                                                                                     |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| Administrator          | Absolute access, can modify anything in the system and manage employees                                                       |
| Human Resources        | Similar in permissions to Administrator, but no access to creating/modifying sales.                                           |
| Financier              | Ability to see the system from the admin view, however no access to removing employees or any sales modification permissions. |
| Sales Intern           | Ability to create sales and view their own sales. Not permitted to modify their own previous sales.                           |
| Sales Associate        | Ability to create sales and view their own sales. Permitted to modify their own previous sales.                               |
| Senior Sales Associate | Ability to create and view their own and other's sales. Permitted to modify theirs and other's sales.                         |

### Deploying
To deploy this project in an actual environment, you would likely host the web app directly through [Vercel](https://vercel.com/).

An alternative approach could be to host the local supabase client and our web app behind a reverse proxy locally within
the business, if wanting to keep data in house.

The only other change required to supabase once deployed is changing the domain for authentication. This can be found in
the Authentication section on the sidebar, and under the URL Configuration label. This should be set to the domain of the
hosted web app, so Supabase knows where to direct users for authentication requests.

### Test Deployments
The following subdomains are set up to mirror the latest deployment of each user's branch. 
Some of them are just old versions of main, as some of them have never made a commit:

| Branch   | URL                                                          |
|----------|--------------------------------------------------------------|
| main     | [codeallergy.dev](https://codeallergy.dev)                   |
| dev      | [dev.codeallergy.dev](https://dev.codeallergy.dev)           |
| Amir     | [amir.codeallergy.dev](https://amir.codeallergy.dev)         |
| bill     | [bill.codeallergy.dev](https://bill.codeallergy.dev)         |
| Rudra    | [rudra.codeallergy.dev](https://rudra.codeallergy.dev)       |
| ryan     | [ryan.codeallergy.dev](https://ryan.codeallergy.dev)         |
| Suchetan | [suchetan.codeallergy.dev](https://suchetan.codeallergy.dev) |
| tolu     | [tolu.codeallergy.dev](https://tolu.codeallergy.dev)         |

## Testing
To run the test suite for the program, run the following in the terminal:
```shell
npm run test
```
This will run all tests in `/src/tests`, reporting on the status of each test as it runs.

There are also deployments of the Storybook for dev and main branches, along with auto-generated TypeDoc documentation:
| Site                 | URL                                                                     |
|----------------------|-------------------------------------------------------------------------|
| Storybook (main)     | [storybook.codeallergy.dev](https://storybook.codeallergy.dev)          |
| Storybook (dev)      | [dev.storybook.codeallergy.dev](https://dev.storybook.codeallergy.dev)  |
| TypeDocs             | [docs.codeallergy.dev](https://docs.codeallergy.dev)                    |


## Documentation
Some links to help you get started:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js/)


- [React Documentation](https://react.dev/reference/react)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs/)
- [Database Documentation](https://docs.codeallergy.dev/interfaces/DatabaseUsage.html)
- [Supabase-js Documentation](https://supabase.com/docs/reference/javascript/introduction)
- [Auto-generated JSDoc Documentation](https://docs.codeallergy.dev)
