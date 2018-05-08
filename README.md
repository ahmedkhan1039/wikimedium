# WikiMedium

It is a mixture of Wikipedia and Medium Blog. It fetches the article specified by the title in the URL.
While giving the flavour of Medium Blog, You can highlight and save a comment on a select text.
Also you can persist the selections and comments.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project.

### Prerequisites

```
Node.js (Latest)
```

### Installing

You have to run this command for both client and server folder.
```
npm install
```

## Deployment on Local Machine

For Client:
```
npm start
```

For Server: 
```
node server.js
```

## Accessing the Application

http://localhost:3000/wiki/{{titleOfArticle}}

Example:
```
http://localhost:3000/wiki/Stack_Overflow
```

<b>Note: </b> There must be "_"(underscore) in place of " "(space) in article title
