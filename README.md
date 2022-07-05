<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="" alt="Project logo"></a>
</p>

<h3 align="center">Cursu Certare</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> A training diary with a strava implementation
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

Cursu Certare is a training diary application. It is web based. The application is still in early development ⚠️. The main feature of the application is that it implements the strava API and therefore automatically syncs the activities uploaded on strava to the application.

## 🏁 Getting Started <a name = "getting_started"></a>

### Docker

To run the project with docker compose: (First enter the correct values to .env, and check docker-compose.yml for the root-password)

```
docker compose up
```


### Prerequisites
The project can easily be cloned and worked on. You need a few essential npm libraries.🔽

#### Node JS
#### NPM
#### NPM libraries
```
express
dotenv
body-parser
mysql
mariadb
```

### Installing

Install Node JS - search in browser, download and install
Install npm - search in browser, download and install
Navigate to the project directory

```
npm install express
npm install dotenv
npm install body-parser
npm install mysql
npm install mariadb
```

Create a .env file where you enter the details of your own strava api --> CLIENT_ID and CLIENT_SECRET
Edit the const redirectURL in index.html and enter your own url (also localhost)
In app.js edit the host, user and password of your mariadb database (database files are coming soon)

Run the project
```
sudo node app.js
```

Open the browser

## 🔧 Running the tests <a name = "tests"></a>

Explain how to run the automated tests for this system.

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## 🎈 Usage <a name="usage"></a>

Add notes about how to use the system.

## 🚀 Deployment <a name = "deployment"></a>

Add additional notes about how to deploy this on a live system.

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [VueJs](https://vuejs.org/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@kylelobo](https://github.com/kylelobo) - Idea & Initial work

See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors) who participated in this project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Hat tip to anyone whose code was used
- Inspiration
- References
