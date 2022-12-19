# BLOG

*Backend*

## Structure

Structure for this repo is based on microservices architecture, so this is the file system:

```
/
|
|- index.js
|- app.js
|- .env
|- /database
|  |
|  |- index.js
|  |- connection.js
|  |- /comments
|  |  |
|  |  |- index.js
|  |
|  |- /posts
|  |  |
|  |  |- index.js
|
|- /components
|  |
|  |- index.js
|  |- /comments
|  |  |
|  |  |- index.js
|  |
|  |- /posts
|  |  |
|  |  |- index.js
|  |
|  |- /files
|  |  |
|  |  |- index.js
|
|- /utils
|  |
|  |- index.js
|  |
|  |- /awsClient
|  |  |
|  |  |- index.js
|  |
|  |- /fileManager
|  |  |
|  |  |- index.js
|
|- /tests
|  |
|  |- comments.test.js
|  |- posts.test.js
|  |-dummy.pdf
```

- `index.js` is the main file and has all the global configuration for the backend.

- `app.js` is the core of the backend, it exports a function to create a new app ussing dependency injection for testing purpouses.

- `.env` is the environment variables file.

- `database` folder has all the database file's related. It has a `connection.js` file which defines the connection to the DB. Every table has their own folder and all methods are exposed with the `index.js` file. 

- Inside every `components` folder there is all the related files with that specific component (endpoint).

- `tests` folder have test files for every relevant component.

- `utils` is a folder with shared methods that can be used by any component.

---

## Enviroment Variables

There is a list of all enviroment variables used in this project and their description



| NAME                  | TYPE   | DESCRIPTION                                      |
|:---------------------:|:------:|:------------------------------------------------:|
| PORT                  | INT    | Port where the server will be listening          |
| DB_HOST               | STRING | Database host direction                          |
| DB_USER               | STRING | Database user with premission for read and write |
| DB_PASS               | STRING | Database password for Database user              |
| DB_NAME               | STRING | Database table name                              |
| AWS_ACCESS_KEY_ID     | STRING | AWS AKI for an user with permissions for S3      |
| AWS_SECRET_ACCESS_KEY | STRING | AWS SAK for an user with permissions for S3      |
| AWS_REGION            | STRING | AWS Region where the bucket is hosted            |
| AWS_BUCKET_NAME       | STRING | AWS S3 Bucket name                               |

---

## Database Structure

This is the structure for the database in this project:



### Posts

| NAME        | TYPE         | DESCRIPTION         |
|:-----------:|:------------:|:-------------------:|
| post_id     | varchar(64)  | PRIMARY KEY.        |
| user_id     | varchar(64)  | NOT NULL.           |
| content     | varchar(255) | NOT NULL.           |
| create_date | datetime     | NOT NULL.           |
| file_name   | varchar(255) | NULL.               |



### Comments

| NAME        | TYPE         | DESCRIPTION  |
|:-----------:|:------------:|:------------:|
| comment_id  | varchar(64)  | PRIMARY KEY. |
| post_id     | varchar(64)  | FOREIGN KEY. |
| user_id     | varchar(64)  | NOT NULL.    |
| content     | varchar(255) | NOT NULL.    |
| create_date | datetime     | NOT NULL.    |
| file_name   | varchar(255) | NULL.        |

### Users

| NAME     | TYPE         | DESCRIPTION  |
|:--------:|:------------:|:------------:|
| username | varchar(64)  | PRIMARY KEY. |
| password | varchar(64)  | NOT NULL.    |

---
## Endpoints 

There are five endpoints

### /posts

#### GET (/):{ message, []posts }

**QUERY PARAMS**
- limit (default: 10): A **number** that describes how many posts retrieve. MAX 10, MIN 1

- offset (default: 0): A **number** that describes how many posts skip before retrieve. MIN 0

**BODY PARAMS**
- userId (required): A valid userId associated with posts.

#### POST (/):{ message, postId }

**BODY PARAMS**
- userId (required): A valid userId to associate the post.

- content (required): Text to save in the post. MAX 255 Characteres.

- attachment (file, optional): File to associate with the post.

#### POST (/user):{ message, []posts }

**QUERY PARAMS**
- limit (default: 10): A **number** that describes how many posts retrieve. MAX 10, MIN 1

- offset (default: 0): A **number** that describes how many posts skip before retrieve. MIN 0

**BODY PARAMS**
- userId (required): A valid userId to associate the post.

#### POST (/replied):{ message, []posts }

**QUERY PARAMS**
- limit (default: 10): A **number** that describes how many posts retrieve. MAX 10, MIN 1

- offset (default: 0): A **number** that describes how many posts skip before retrieve. MIN 0

**BODY PARAMS**
- userId (required): A valid userId to associate the post.

#### GET(/:postId):{ message, {}post }

**PARAMS**
- postId(required): A valid postId value.


#### DELETE(/:postId):{ message }

**PARAMS**
- postId(required): A valid postId value.


### /comments

#### POST (/):{ message, commentId }

**BODY PARAMS**
- userId (required): A valid userId to associate the comment.

- postId (required): A valid postId to associate the comment.

- content (required): Text to save in the post. MAX 255 Characteres.

- attachment (file, optional): File to associate with the comment.

#### POST (/list):{ message, []comments }

**QUERY PARAMS**
- limit (default: 10): A **number** that describes how many comments retrieve. MAX 10, MIN 1

- offset (default: 0): A **number** that describes how many comments skip before retrieve. MIN 0

**BODY PARAMS**
- postId (required): A valid postId associated with posts.


#### GET(/comment/:commentId):{ message, {}comment }

**PARAMS**
- commentId(required): A valid commentId value.


#### DELETE(/comment/:commentId):{ message }

**PARAMS**
- commentId(required): A valid commentId value.

### /files

#### GET(/:fileId): file

**PARAMS**
- fileId(required): A valid fileId value.

### /auth

#### POST(/): token

**BODY PARAMS**
- username (required): A valid username
- password (required): A valid password

### /consult

#### POST(/posts):{ []posts }

**HEADERS**
- token (required): A valid token to validate the request

**QUERY PARAMS**
- limit (default: 100): A **number** that describes how many posts retieve. NO MAX, MIN 1

#### POST(/comments):{ []posts }

**HEADERS**
- token (required): A valid token to validate the request

**QUERY PARAMS**
- limit (default: 100): A **number** that describes how many posts retieve. NO MAX, MIN 1
