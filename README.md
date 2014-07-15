# state-fair-app

To get started:

1. Dowload this app
1. Run `npm install`
1. Run `bower install`
1. Launch the app with `npm start`

# To preload the list of vendors:

**Mac / Linux / Windows with Bash shell**
(you need curl installed)

    cd assets
    ./preload.sh

**Windows (or Mac/Linux without curl)**

1. Open the Excel file at assets/vendors.xls
1. Copy G2 and paste it into your browser's address bar and hit enter
1. Repeat for cells G3-G158 (sorry)

There has to be a better way to load initial data. I'm [working on it](http://stackoverflow.com/questions/24090135/loading-data-fixtures-the-first-time-a-sails-js-app-is-lifted).

# View the vendors

If you visit http://localhost:1337/vendor (which is a shortcut for /vendor/find) you will see a list of all vendors. 
This is using the blueprint feature of Sails, which essentially creates standard RESTful URLs for any controller. You can POST to /vendor to add a new vendor, you can PUT to /vendor/id to update a vendor and you can DELETE to /vendor/id to remove a vendor.

For the most fun exploring this API, see the previous section on how to pre-load the list of vendors.

# To edit this app:

The HTML files are actually (yucky) EJS and stored in `views/`. Note the template used on all pages is called layout.ejs and then the homepage is homepage.ejs. After that it gets pretty self explanitory.

**Note:** This app uses the latest *beta* version of Sails. If you want to install this version, use:

    npm install -g sails@0.10

If you leave off the `@0.10` you get the latest release version which is 0.9.x. The docs for the beta are at http://beta.sailsjs.org/#/documentation/reference/Assets

