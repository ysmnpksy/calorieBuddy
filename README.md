# README
## R1: Home Page 
R1A: This page displays the name of the web app. 

R1B: The page and all other pages included a navigation bar that contains links to other pages. 

The implementation of this page can be found at views/index.html and routes/main.js line <>.

## R2: About Page
R2A: This page displays information about the web app and includes my name as developer. The navigation bar links to other pages. 

The implementation of this page can be found at views/about.html and routes/main.js line <>. 

## R3: Register Page
R3A: The register page displays a form consisting of: 
 - First name
 - Last name
 - Email address
 - Username 
 - Password
		
R3B: Form data is collected and added to the database (calorieBuddy) collection user. Only the hashed password is saved in the database. 

R3C: A message is displayed once the form has been submitted confirming that the user has been added. 
The message is displayed by rendering an ejs template with an array of strings.
This form includes server-side validation that: 
- Checks if the email input is a valid email. 
- Checks that the username input has not been left empty. 
- Checks that the password entered is at least 8 characters in lenght.

The implmentation of this page can be found at views/register.html and routes/main.js line <> onwards. 

## R4: Login Page
R4A: This page displays a forms for users to log into the app. The form consists of username and password. 

R4B: Form data is collected and checked against the database to ensure both username and password are correct. If so, the user is logged in. 

R4C: A message is displayed indicating the success of the login attempt. The options are:
- Login successful
- Password incorrect
- Username incorrect

The implementation of this page can be found at views/login.html and routes/main.js line <> onwards. 

## R5: Logout 
A logout button is inlcluded on the navigation bar on every page. 
If the user isn't logged in, the logout button redirects them to the login page. 
If the user is logged in, the button logs them out and displays a confirmation message. 
The implmentation of this function can be found at routes/main.js line <> onwards.

## R6: Add Food Page
This page is only available to logged in users. If the user is not logged in they are redirected to the login page. 

R6A: This page displays a form for users to add new foods to the app. The form consists of the fields: 
- Name 
- Typical values 
- Unit of typical value 
- Calories 
- Carbs
- Fat 
- Protein 
- Salt 
- Sugar

The 'name' field is added using the JavaScript toLowerCase() method for consistency in the database. 
I've used server-side validation on the 'name' field to ensure it hasn't been left empty.
If the field has been left empty, an error message is displayed by rendering an empty ejs template with an array of strings. 

R6B: Form data is collected and stored in the collection 'food'. The username of the user who added the food item is also saved in the record, which can be seen on the list page.  

R6C: A message is displayed indicating that the item as been added. 

The implementation of this page can be found at views/addfood.html and routes/main.js line <> onwards. 

## Search Food Page 
R7A: This page displays a form with one field, where users type the name of the item they are searching for. 

R7B: The form data is collected and the database 'food' is searched to find the item. 
If no food items are found, a message is displayed to the user indicating as such. 
If there are items matching the search keyword, an ejs template is rendered. This template displays the resulting record in a table. 

R7C: The Search function searching for food names containing the entered keyword also. 
For example, the search 'bread' will result in the records 'pitta bread', 'white bread' and 'wholemeal bread'.  

The implementation of this page can be found at views/searchfood.html, views/search-result.ejs and routes/main.js line <> onwards.

## Update Food Page
This page is only available to logged in users. If the user is not logged in they are redirected to the login page. 

R8A: This page displays a form with one field, where users type the name of the item they want to update or delete.  

R8B: Displays food that matches search. The food item is only displayed if the user is the one to have added it. 
If the item matches the search but was added by a different user, it won't be displayed. 
This ensures that update and delete operations can only be done by the user who has actually added the item. 
If no items are found, a message indicating as such is displayed. 

The items are displayed in form input boxes so users can edit values. 
There is a update button for each record which will update the record using its id and redirect to a page with a confirmation message. 

R8C: Each record also has a delete button which will delete the record and redirect to a page with a confirmation message. 

The implementation for these pages can be found at: 
- views/updatefood.html
- views/update-result.ejs
- views/update-confirmation.html 
- views/delete-confirmation.html
- routes/main.js line <> onwards 

## List Food Page
R9A: This page displays all records stored in the 'food' collection, including name, typical values, unit of the typical value, calories, carbs, fat, protein, salt, and sugar. 
The list is sorted in alphabetical order by name. 

R9B: The food items are listed in a tabular format instead of a simple list.
If the page is resized the form will have a horizonatal scroll bar so none of the input boxes are too small to be used. 

R9C: ///////////////////////////////////////

The implementation for this can be found at views/listfood.ejs and routes/main.js line <> onwards.

## API
This API displays all food items stored in the 'food' collection in JSON format.
The API can be easily accessed from the navigation bar on the app. 
///////////////////////////////////////

## Form Validation
I've included server-side validation on the add food page:
- Checks that the 'name' field hasn't been left empty. If so, an error message is displayed.

The implementation of this can be found at routes/main.js line <>.

I've included server-side validation on the register page: 
- Checks if the email input is a valid email. 
- Checks that the username input has not been left empty. 
- Checks that the password entered is at least 8 characters in lenght. 

If these conditions aren't met, the user is redirected back to the register page. 
The implementation of this can be found at routes/main.js line <>.

I've also included client-side validation on the add food page by setting input types: 
- Checks that 'Typical values per' is numeric. 
- Checks that 'Calories' is numeric. 
- Checks that 'Fat' is numeric. 
- Checks that 'Protein' is numeric. 
- Checks that 'Salt' is numeric. 
- Checks that 'Sugar' is numeric. 

The implementation of this can be found at views/addfood.html. 

## Login Redirect
Only logged in users can add, update and delete food items so the 'Add Food' and 'Update Food' pages can only be accessed by logged in users. 

If the user isn't logged in, they will be redirected to the 'Login' page. 

The implementation for this can be found at routes/main.js lines <> and <>.  


# Data Model 
I've used MongoDB for as the database for this app. 
The database, called 'calorieBuddy', consists of two collections: food and user. 

The user collection contains all the users who have registered on the 'Register' page. 

Each record consists of the fields: 
- username
- password
- firstname
- lastname
- email

The food collection contains all the food added on the 'Add Food' page. 

Each record consists of the fields: 
- name
- typicalValues
- unitTypicalValues
- calories
- carbs
- protein
- salt
- sugar
- username
	- This is the username of the user who added the food item to the database, so is a reference to the username field in the user table.

