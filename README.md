# Trainer Web-Application
The application is meant for being a dashboard for creating and logging workouts.

## Design

### Landing Page
<img src="images/Login Page.png" alt="Login Page" width="90%"/>

### Dashboard
<img src="images/Main Menu.png" alt="Main Menu Page" width="90%"/>

### Workouts
<img src="images/Workout Pages.png" alt="Workout Pages" width="90%"/>

### Admin
<img src="images/Admin Pages.png" alt="Admin Pages" width="90%"/>

### Logging Workouts
<img src="images/Log Pages.png" alt="Log Pages" width="90%"/>

### Visualize the Log
<img src="images/Stat Graph.png" alt="Graph" width="90%"/>

### Social
<img src="images/Social Pages.png" alt="Social Pages" width="90%"/>
<img src="images/Sharing Pages.png" alt="Sharing Pages" width="90%"/>


-------------------------------------------------------------------------------------------------------------------

## Tools to install in rider terminal: 

User managment tools: \
dotnet tool install --global dotnet-ef \
dotnet tool install --global dotnet-aspnet-codegenerator \
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design -v 7.0.10 \
dotnet add package Microsoft.EntityFrameworkCore.Design -v 7.0.11 \
dotnet add package Microsoft.EntityFrameworkCore.SqlServer -v 7.0.11 \
dotnet add package Npgsql -v 7.0.4 

### Other API tools: \
SendGrind (Email service): dotnet add package SendGrid \
OpenAI (Chat GPT API): dotnet add package OpenAI --version 1.7.2 \
dotnet add package Microsoft.AspNetCore.Authentication.Google --version 7.0.11 

-------------------------------------------------------------------------------------------------------------------
### Files to generate for user managment: \
dotnet aspnet-codegenerator identity -fi "Account.Register" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account.Manage.Index" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account.Manage._StatusMessage" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account.RegisterConfirmation" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account.ResendEmailConfirmation" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account.ForgotPassword" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account.ForgotPasswordConfirmation" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account.Manage.ChangePassword" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account.ConfirmEmail" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account.ConfirmEmailChange" --dbContext ApplicationDbContext \
dotnet aspnet-codegenerator identity -fi "Account._StatusMessage" --dbContext ApplicationDbContext 

-------------------------------------------------------------------------------------------------------------------
### How to run and work on project.
1. Install the User managment tools
2. Install the API tools
3. Set the different secret keys
4. For external sigin to work the project has to be run using https and not http
