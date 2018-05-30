# NextBite
NextBite is a React Native App for Android which aims to connect farmer's market vendors with non-profit volunteers in order to rescue food. When vendors have food for donation, they can use NextBite to create a listing for it. This notifies volunteers that a donation is available. Volunteers can then use NextBite to view the details of the listing, get directions to it, pick it up, and finally be directed to the nearest non-profit organization to drop it off.

## Features
NextBite offers different features depending on whether the user is a vendor or volunteer. 

### Vendor
* Create listing
* View past donations
* Verify donation pickup

### Volunteer
* View donation listings
* Recieve notifications about new listings nearby
* Claim listings
* Get directions to farmer's market and non-profit
* Confirm donation drop-off

## Tools

### React Native
We settled on a React Native App because we needed access to some key features - push notifications most importantly. The nature of the volunteer experience requires that the volunteer be notified of a new listing promptly. The best way to do this is with push notifications, so we needed a platform that enabled us to use them. React Native matched closely enough to our React web app experience to be a feasibly method of accomplishing this.

### Firebase
Firebase has a proven record with React and, indeed, is taught alongside React in client-side web developement courses. This made Firebase the obvious choice for us to handle NextBite's back-end including hosting profiles and listings. Firebase also handles user authentication which is necessary because most features of NextBite require user-specific data from our database.

## Team NextBite
Lisa Koss - 
Alexis Koss - 
Kar Yin Ng - 
Sean Martin - seanthompsonmartin@gmail.com
