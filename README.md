# Pet Or Pass

Remember "Hot or Not"? Pet or Pass is just like that, but for our furry (or scaly or slimy or feathered) friends! Users can review images of animals and decide if they want to pet them or if they would rather take a pass. After the user rates an image, the average score for the pet will be displayed. Users are also able to submit pet images to be judged as well as view a gallery of all the pets they have submitted with their average scores. In order to access the site, users must first log in. The site has responsive design and can be viewed comfortably on a desktop, tablet, or mobile device.

## Technologies

Languages, libraries, and frameworks leveraged in this application include:

- HTML
- CSS
- Bootstrap
- TypeScript
- Vite
- Auth0
- Docker
- Python
- Flask
- Node.js
- MinIO
- Nginx
- pnpm
- Postgres
- TypeORM
- Fastify
- React

## Demo

A recorded demonstration of Pet of Pass can be viewed on [YouTube](TODO: ADD REAL LINK HERE).

## Running the App

On a computer that already has Docker successfully installed, clone this GitHub repository, then run the following commands:

```
cd PetOrPass

docker compose up
```

Once Docker has finished building and starting all of the containers found in the docker-compose.yaml file, open your browser window and navigate to the following web address:

```
http://localhost:5173
```

## Using the App

In order to access the app beyond the welcome page, you must create a new Auth0 account, and you can use this account to access Pet or Pass in the future. The reset password flow will send an email with a link to reset your password, so you must sign up with a real, functioning email address in order to use the password reset functionality.

After being authenticated, you will land on the Rate Pets page which is also the home page of the app. Before any users have uploaded pet images for rating, expect this page to display a helpful 404 error message explaining that pet images must be uploaded for this page to be populated.

The Pet Gallery page will display a similar 404 error message until the currently logged in user has uploaded any pet images. Once you have submitted a pet image, only images submitted by the currently logged in user will be displayed in the Pet Gallery, but the Rate Pets page will submit a randomly selected pet from the database that contains all submitted pets. Pets can be submitted for rating by filling on the form on the Submit Pet page. The more pets that are submitted by different users, the less likely you will be to see duplicate pets on the Rate Pets page.

The backend Docker container does contain a command for seeding the database which can be found in `backend/package.json`. However, this seeding is only intended to be used for backend testing because the image name of each pet is programmatically generated and will not correspond with any pet images stored in MinIO. Because of this, any pets created through seeding alone will not display an image in the front end and will only display the alternate text set on the image `src` tag. Additionally, the users created during database seeding will not have Auth0 accounts, so in order to log in as one of these users, you must sign up during the login flow. For these reasons, it is recommended that users create their own accounts and submit pets manually rather than using the database seeding option for anything other than backend route testing.

