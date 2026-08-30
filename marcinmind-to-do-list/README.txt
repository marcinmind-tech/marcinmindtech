MARC IN MIND - SIMPLE TO-DO
================================

This version is intentionally simple:

HTML + CSS + JavaScript + Bootstrap
            ↓
Google Apps Script
            ↓
Google Sheet


FILES TO HOST
-------------
Upload these to:

marcinmind.in/to-do-list/

index.html
css/style.css
js/app.js
image/logo.png


GOOGLE SHEET
------------
The app is already configured for:

https://docs.google.com/spreadsheets/d/19aaUwTSeQFh3yFg6WGP_SnHFskbUPEh3uocEVLsPkWM/

The FIRST sheet/tab is used as the database.

If the first sheet is completely blank, Apps Script automatically creates:

ID | To Do | Priority | Time Needed | Minutes | Status | Notes | Created | Updated


SETUP GOOGLE APPS SCRIPT
------------------------
1. Open the Google Sheet.

2. Click:
   Extensions > Apps Script

3. Delete the sample code.

4. Paste:
   google-apps-script/Code.gs

5. Save.

6. Select setupTodoApp from the function list and click Run ONE TIME.
   Approve Google's requested spreadsheet permissions.

   This does two things:
   - Stores the login details in Apps Script Properties.
   - Creates the Google Sheet headers if the first sheet is blank.

7. Click:
   Deploy > New deployment

8. Select:
   Web app

9. Use:
   Execute as: Me
   Who has access: Anyone

10. Deploy.

11. Copy the URL ending in:
    /exec


CONNECT WEBSITE
---------------
Open:

js/app.js

At the very top find:

const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE";

Paste your Web App /exec URL between the quotes.

Example:

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";

Save app.js and upload the website.


LOGO
----
Place your actual logo here:

image/logo.png


FILTERS INCLUDED
----------------
Search
I have / available time
Priority
Status
Sort

Example:
I have = 30 min
Priority = High

The app will show High priority tasks needing 30 minutes or less.


TIME OPTIONS
------------
5 min
10 min
15 min
30 min
45 min
1 hour
1.5 hours
2 hours
3 hours
Half day
Full day


STATUS
------
Pending
In Progress
Done

Start -> changes task to In Progress
Done -> changes task to Done
Reopen -> changes task to Pending


LOGIN
-----
The login is checked inside Apps Script.

The username/password are NOT stored in index.html or js/app.js.

setupTodoApp() puts them into Apps Script Script Properties.

Session tokens are temporary and kept in sessionStorage in the browser.
Apps Script sessions expire after approximately 6 hours.


IMPORTANT AFTER EDITING CODE.GS
-------------------------------
If you later edit Code.gs:

Deploy > Manage deployments > Edit
Select "New version"
Deploy

Then the same /exec URL can continue to be used.


FOOTER
------
Powered by Marc in Mind Technologies
https://marcinmind.in
