## Auditorium

Auditorium is a web application designed to allow registered users to upload and share their music with an online audience.
The application is currently a work in progress.

## Config

Create a database named 'auditorium', and add the following to tomcat's context.xml before deployment:
<Resource name="jdbc/auditorium"
          type="javax.sql.DataSource"
          username="postgres"
          password="admin"
          driverClassName="org.postgresql.Driver"
          url="jdbc:postgresql://localhost:5432/auditorium"
          closeMethod="close"/>

Registered users for testing:
- Email: jaimenye@gmail.com Password: a
- Email: laylabrooks@gmail.com Password: r

## Features
**Users**
- The application recognizes three types of users: artists, regular users and guest users / unregistered site visitors.
- Artists can upload their own music projects to share with all site visitors.
  > Music projects / albums may be kept private or released immediately to the public. Only projects marked as public are shown on the main landing page of the application.
- Regular users may not upload music. They can like existing public music projects, or add them to their playlists.
- Guests may only listen to public music projects - all other features require registration.

**Music projects**
- Music projects are managed via a site feature only available to users registered as 'Artist'.
-  When a user decides to upload a project, they must provide the following:
	- Album title
	- Album cover art
	- Minimum 1 track for the album. The allowed maximum is 12.
- They also need to specify whether to keep the project private or make it public. If they choose not to release it immediately, this can be done later.
- Once a project is uploaded and marked as public, any user can listen to it.
- Music projects can be marked as private or taken down from the site at any time if the author chooses to do so.
