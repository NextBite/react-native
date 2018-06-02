# NextBite
NextBite is a React Native App for Android which aims to connect farmers market vendors with non-profit volunteers in order to rescue food and bridge the communication gap. When vendors have food that they want to donate at the end of a market day, whether due to overproduction or visual imperfections, they can use NextBite to create a listing for it. This notifies volunteers that a donation is available in the area. Volunteers can then use NextBite to view the details of the listing, rescue the donation, travel to the market to pick it up, and finally be directed to the nearest non-profit organization to drop it off. Once a volunteer delivers the boxes, the respective vendor is notified of the successful delivery. 

## Features
NextBite offers different features depending on whether the user is a vendor or volunteer. 

### General 
* Sign up, sign in, sign out
* User settings (ability to edit all profile information)

### Vendor
* Create listing
* View pending donations (with ability to edit or delete)
* Contact volunteer
* Verify donation pickup
* Receive notifications of successful deliveries
* View past donations

### Volunteer
* View donation listings via map or list views
* Recieve notifications about new listings nearby
* Claim listings
* Contact vendor
* Get directions to non-profit organizations
* Confirm donation delivery
* View past rescues

## Tools

### React Native
We settled on a React Native App because we needed access to some key features - push notifications most importantly. The nature of the volunteer experience requires that the volunteer be notified of a new listing promptly. We intially intended to code a mobile responsive web application with email notifications, but later found out that email is not an effective form of quick communciation and also has a lot of legalities involved (including when you can send emails to user concerning certain things). To avoid this, React Native allows us to use the native notification system built into Android, enabling us to allow users to disable them via Android's own settings, getting rid of the worry about setting up an email server and requesting permission for emails to be sent ourselves. Additionally, an application that could be permanently downloaded to a mobile device is more convient than a mobile website that has to be visited manually. Also since we want our users to use our application regularly, a mobile application is ideal for quick access. React Native also matched closely enough to our React web app experience to be a feasible method of implementation while keeping the learning curve of a new framework to a minimum. React Native is also useful because it refreshes the content on the page as the state of the page changes, which doesn't require any action on the user's part in order to see new and important information. 

### Firebase
Firebase has a proven record with React and, indeed, is taught alongside React in client-side web developement courses. This made Firebase the obvious choice for us to handle NextBite's back-end including hosting profiles and listings. Firebase makes it easy to query the database for information quickly and efficiently so that users are able to request the content they need immediately upon demand. Firebase also handles user authentication which is necessary because most features of NextBite require user-specific data from our database.

## Team NextBite
* Lisa Koss  -  lisakoss@uw.edu
* Alexis Koss -  alexis30@uw.edu
* Kar Yin Ng -  karyin3@uw.edu 
* Sean Martin - seanthompsonmartin@gmail.com
