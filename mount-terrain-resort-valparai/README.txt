MOUNT TERRAIN RESORT - RESERVATION MESSAGE V5
===============================================

This version fixes the WhatsApp line-break problem.

IMPORTANT:
The generated WhatsApp URL now uses a message string containing REAL newline
characters. It will not send visible \n text between lines.

TWO MODES
---------
1. Quote
2. Advance Receipt

QUOTE
-----
Shows quotation wording.
Does not ask for advance payment.
Message says availability is subject to advance payment.

ADVANCE RECEIPT
---------------
Shows advance received field.
Calculates balance.
Message confirms the booking against advance payment.

CUSTOM DATE/TIME POPUP
----------------------
Click the entire Check-in or Check-out box.

A custom modal opens with:
Date
Time
Cancel
OK

The selected value is applied only after OK is pressed.

ADD-ONS
-------
Flexible repeatable rows:
Add-on name
Quantity
Unit price

Examples:
Campfire
Cake
Decoration
Transport
Safari
Special Meal

Add-ons are itemized in WhatsApp and included in the total.

FILES
-----
index.html
assets/css/style.css
assets/js/app.js

The visible form is generated from JavaScript.
Right click and common casual inspect shortcuts are blocked outside entry fields.
This is only a deterrent; browser-side JavaScript cannot be made truly secret.

RESORT
------
Mount Terrain Resort, Valparai
Contact: 09645189444
Website: https://www.valparaimountterrain.com/
Google Business Profile: https://maps.app.goo.gl/yQujggAZsg4QK1Bv8


V6 UPDATE
---------
Advance amount is now used in BOTH modes:

Quote:
- Advance Required to Confirm
- Balance After Advance

Advance Receipt:
- Advance Received
- Balance Payable

EXTRA BED CALCULATION
---------------------
Extra bed charges now automatically use the stay duration:

Extra Bed Total =
Extra Bed Count × Number of Nights × Rate per Bed per Night

Example:
1 Bed × 2 Nights × ₹1,000 = ₹2,000

The number of nights is automatically calculated from check-in and check-out.


V7 BRANDING UPDATE
------------------
Added the supplied Mount Terrain Resort logo.

Logo file:
assets/image/mount-terrain-logo.jpg

Branding locations:
- Main dark header
- Reservation section heading

Footer now includes:
Powered by Marc in Mind Technologies
https://marcinmind.in

All V6 booking, quotation, advance receipt, add-on and WhatsApp logic remains unchanged.
