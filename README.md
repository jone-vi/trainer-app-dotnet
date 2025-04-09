Tools to install in rider terminal: 

User managment tools: \
dotnet tool install --global dotnet-ef \
dotnet tool install --global dotnet-aspnet-codegenerator \
dotnet add package Microsoft.VisualStudio.Web.CodeGeneration.Design -v 7.0.10 \
dotnet add package Microsoft.EntityFrameworkCore.Design -v 7.0.11 \
dotnet add package Microsoft.EntityFrameworkCore.SqlServer -v 7.0.11 \
dotnet add package Npgsql -v 7.0.4 

Other API tools: \
SendGrind (Email service): dotnet add package SendGrid \
OpenAI (Chat GPT API): dotnet add package OpenAI --version 1.7.2 \
dotnet add package Microsoft.AspNetCore.Authentication.Google --version 7.0.11 

-------------------------------------------------------------------------------------------------------------------
Files to generate for user managment: \
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
API Keys: \
OpenAI: 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 \
SendGrid: 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 

-------------------------------------------------------------------------------------------------------------------
Other Commands and things: \
List files that can be generated (edit if you need other files than identity): dotnet aspnet-codegenerator identity --listFiles -f 

Google Sign In Client ID: 1093546593474-s7m72ijc23u0fabiotvkql681vjnvtb5.apps.googleusercontent.com \
Google Sign In Client Secret: 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 

To enable email sending you have to set the sendGrid api key in the windows secret-maneger tool:\
dotnet user-secrets set SendGridKey <key>

To enable external google login you have to set the client ID and client secret:\
dotnet user-secrets set "Authentication:Google:ClientId" "client id"\
dotnet user-secrets set "Authentication:Google:ClientSecret" "client secret>"

-------------------------------------------------------------------------------------------------------------------
How to run and work on project.
1. Install the User managment tools
2. Install the API tools
3. Set the different secret keys
4. For external sigin to work the project has to be run using https and not http
