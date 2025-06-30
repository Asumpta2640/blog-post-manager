# blog-post-manager
A simple web application

##What is this project about?

**Blog Post Manager** is a simple web application that allows users to manager blog posts 

---

## How does it work?
-On page load, the app fetches a list of blog post titles from a json-server and display them.
-When a user clicks on a title,, the full  post details apper on the right.
-User can:
  -Submit a from to add a new blog post
  -Click "Edit" to update  a post's title or content
  -Click "Delete" to remove a post
-All data changes are update with the mock API using `fetch() `with GET,POST,PATCH, and DELETE requests.
-The frontend updates the DOM based on user actions.

## Who are the users?

This app is designed for:
-Developers learning frontend development with Javascript
-Students practicing API interaction
-Beginners looking to understand DOM manipulation and event handling
-Anyone wanting to rest or prototype blog features locally

---
## What is the goal of this project?
The main goals are:
-To build a working fronted app that interacts with an API
-To practice full functionality using real HTTP methods
-To strengthen skills in JavaScript and DOM updates
-To understand how local json-server can be used in testing

---
## What is the benefit for the users?
-Users can easily manage a list of blog post without needing a real backend.
-Its a educating tool to understand how web apps works.
-It can be used as a template.
-It encourages modular JavaScript.

## Built With 

-HTML
-CSS
-JavaScript
-JSON Server
-Live Server
-Visual Studio Code

## Setup Instructions

1**Clone the repository**:
   ```bash
   git clone git@github.com:Asumpta2640/blog-post-manager.git
   cd blog-post-manager

2** install JSON Server**
  ```bash  
  npm install -g json-server

3** Start the JSON Server **
 ```bash
 json-server --watch db.json

4** Start the live Server for HTML **
 -Using the VS Code's Live Server 

This project was developed by Jelagat Asumpta email:sugutasumpta@gmail.com

#License
This project is licensed under the [MIT License](LICENSE)
