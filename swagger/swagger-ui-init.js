
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/api": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "App"
          ]
        }
      },
      "/api/users": {
        "get": {
          "operationId": "UsersController_getUsers",
          "parameters": [
            {
              "name": "searchLoginTerm",
              "required": false,
              "in": "query",
              "description": "Search term for user login",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "name": "searchEmailTerm",
              "required": false,
              "in": "query",
              "description": "Search term for user email",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Field to sort by",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "example": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "totalCount": {
                        "type": "number"
                      },
                      "pagesCount": {
                        "type": "number"
                      },
                      "page": {
                        "type": "number"
                      },
                      "pageSize": {
                        "type": "number"
                      },
                      "items": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/UserViewDto"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "summary": "Get all users.",
          "tags": [
            "Users"
          ]
        },
        "post": {
          "operationId": "UsersController_createNewUser",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserInputDto"
                }
              }
            }
          },
          "responses": {
            "default": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserViewDto"
                  }
                }
              }
            }
          },
          "summary": "Create new user",
          "tags": [
            "Users"
          ]
        }
      },
      "/api/users/{id}": {
        "delete": {
          "operationId": "UsersController_deleteUserById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Delete user",
          "tags": [
            "Users"
          ]
        }
      },
      "/api/blogs": {
        "get": {
          "description": "Fetches all blogs with optional query parameters for search, sorting, and pagination.",
          "operationId": "BlogsController_getBlogs",
          "parameters": [
            {
              "name": "searchNameTerm",
              "required": false,
              "in": "query",
              "description": "Search term for blog name",
              "schema": {
                "default": null,
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Field to sort by",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "example": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "totalCount": {
                        "type": "number"
                      },
                      "pagesCount": {
                        "type": "number"
                      },
                      "page": {
                        "type": "number"
                      },
                      "pageSize": {
                        "type": "number"
                      },
                      "items": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/BlogViewDto"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "summary": "Get a list of blogs",
          "tags": [
            "Blogs"
          ]
        },
        "post": {
          "operationId": "BlogsController_createNewBlog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogInputDto"
                }
              }
            }
          },
          "responses": {
            "default": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewDto"
                  }
                }
              }
            }
          },
          "summary": "Creates new blog. Returns new created blog",
          "tags": [
            "Blogs"
          ]
        }
      },
      "/api/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_getBlogById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "default": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/BlogViewDto"
                  }
                }
              }
            }
          },
          "summary": "Get 1 blog by id.",
          "tags": [
            "Blogs"
          ]
        },
        "put": {
          "operationId": "BlogsController_updateBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogUpdateInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Update blog fields.",
          "tags": [
            "Blogs"
          ]
        },
        "delete": {
          "operationId": "BlogsController_deleteBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Delete one blog by id.",
          "tags": [
            "Blogs"
          ]
        }
      },
      "/api/blogs/{id}/posts": {
        "get": {
          "description": "Fetches all posts by existing blog id with optional query parameters for search, sorting, and pagination.",
          "operationId": "BlogsController_getPostsByBlogId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "totalCount": {
                        "type": "number"
                      },
                      "pagesCount": {
                        "type": "number"
                      },
                      "page": {
                        "type": "number"
                      },
                      "pageSize": {
                        "type": "number"
                      },
                      "items": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/PostViewDto"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "summary": "Get posts belonging to the blog by the blog ID.",
          "tags": [
            "Blogs"
          ]
        },
        "post": {
          "description": "Create and return one post to existing blog. Using blogs uri parameter. ",
          "operationId": "BlogsController_createPostByBlogId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostInputDto"
                }
              }
            }
          },
          "responses": {
            "default": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            }
          },
          "summary": "Create post using blogs uri",
          "tags": [
            "Blogs"
          ]
        }
      },
      "/api/posts": {
        "get": {
          "operationId": "PostsController_getPosts",
          "parameters": [
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Field to sort by",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "example": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "totalCount": {
                        "type": "number"
                      },
                      "pagesCount": {
                        "type": "number"
                      },
                      "page": {
                        "type": "number"
                      },
                      "pageSize": {
                        "type": "number"
                      },
                      "items": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/PostViewDto"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "summary": "Gets all posts.",
          "tags": [
            "Posts"
          ]
        },
        "post": {
          "operationId": "PostsController_createNewPost",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostInputDto"
                }
              }
            }
          },
          "responses": {
            "default": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            }
          },
          "summary": "Create new post.",
          "tags": [
            "Posts"
          ]
        }
      },
      "/api/posts/{id}": {
        "get": {
          "operationId": "PostsController_getPostById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "default": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewDto"
                  }
                }
              }
            }
          },
          "summary": "Gets post by id.",
          "tags": [
            "Posts"
          ]
        },
        "put": {
          "operationId": "PostsController_updatePost",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostUpdateInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Update existing post fields.",
          "tags": [
            "Posts"
          ]
        },
        "delete": {
          "operationId": "PostsController_deletePost",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Delete post by id.",
          "tags": [
            "Posts"
          ]
        }
      },
      "/api/posts/{id}/comments": {
        "get": {
          "description": "Returns all comments for the post.",
          "operationId": "PostsController_getCommentsByPostId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "description": "Field to sort by",
              "schema": {
                "default": "createdAt",
                "example": "createdAt",
                "type": "string"
              }
            },
            {
              "name": "sortDirection",
              "required": false,
              "in": "query",
              "schema": {
                "enum": [
                  "asc",
                  "desc"
                ],
                "type": "string"
              }
            },
            {
              "name": "pageNumber",
              "required": false,
              "in": "query",
              "schema": {
                "default": 1,
                "example": 1,
                "type": "number"
              }
            },
            {
              "name": "pageSize",
              "required": false,
              "in": "query",
              "schema": {
                "default": 10,
                "example": 10,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "totalCount": {
                        "type": "number"
                      },
                      "pagesCount": {
                        "type": "number"
                      },
                      "page": {
                        "type": "number"
                      },
                      "pageSize": {
                        "type": "number"
                      },
                      "items": {
                        "type": "array",
                        "items": {
                          "$ref": "#/components/schemas/CommentViewDto"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "summary": "Gets all posts.",
          "tags": [
            "Posts"
          ]
        }
      },
      "/api/comments/id": {
        "get": {
          "operationId": "CommentsController_getCommentById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "default": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/CommentViewDto"
                  }
                }
              }
            }
          },
          "summary": "Get a comment by id.",
          "tags": [
            "Comments"
          ]
        }
      },
      "/api/testing/all-data": {
        "delete": {
          "description": "Delete all collections.",
          "operationId": "DropCollectionController_deleteAllData",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Delete all data.",
          "tags": [
            "DropCollection"
          ]
        }
      }
    },
    "info": {
      "title": "Blogger Platform",
      "description": "Blogger Platform API",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "schemas": {
        "PaginatedViewDto": {
          "type": "object",
          "properties": {
            "pagesCount": {
              "type": "number"
            },
            "page": {
              "type": "number"
            },
            "pageSize": {
              "type": "number"
            },
            "totalCount": {
              "type": "number"
            },
            "items": {
              "type": "array",
              "items": {
                "type": "object"
              }
            }
          },
          "required": [
            "pagesCount",
            "page",
            "pageSize",
            "totalCount",
            "items"
          ]
        },
        "UserViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "login": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            }
          },
          "required": [
            "id",
            "login",
            "email",
            "createdAt"
          ]
        },
        "UserInputDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string"
            },
            "password": {
              "type": "string"
            },
            "email": {
              "type": "string"
            }
          },
          "required": [
            "login",
            "password",
            "email"
          ]
        },
        "BlogViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "isMembership": {
              "type": "boolean"
            }
          },
          "required": [
            "id",
            "name",
            "description",
            "websiteUrl",
            "createdAt",
            "isMembership"
          ]
        },
        "BlogInputDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "BlogUpdateInputDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "websiteUrl": {
              "type": "string"
            }
          },
          "required": [
            "name",
            "description",
            "websiteUrl"
          ]
        },
        "NewestLikesViewDto": {
          "type": "object",
          "properties": {
            "addedAt": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            },
            "login": {
              "type": "string"
            }
          },
          "required": [
            "addedAt",
            "userId",
            "login"
          ]
        },
        "ExtendedLikesInfoViewDto": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number"
            },
            "dislikesCount": {
              "type": "number"
            },
            "myStatus": {
              "type": "string"
            },
            "newestLikes": {
              "$ref": "#/components/schemas/NewestLikesViewDto"
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus",
            "newestLikes"
          ]
        },
        "PostViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            },
            "blogName": {
              "type": "string"
            },
            "createdAt": {
              "type": "string"
            },
            "extendedLikesInfo": {
              "$ref": "#/components/schemas/ExtendedLikesInfoViewDto"
            }
          },
          "required": [
            "id",
            "title",
            "shortDescription",
            "content",
            "blogId",
            "blogName",
            "createdAt",
            "extendedLikesInfo"
          ]
        },
        "PostInputDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content",
            "blogId"
          ]
        },
        "PostUpdateInputDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "shortDescription": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "blogId": {
              "type": "string"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content",
            "blogId"
          ]
        },
        "CommentatorInfo": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string"
            },
            "userLogin": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "userLogin"
          ]
        },
        "LikesInfo": {
          "type": "object",
          "properties": {
            "likesCount": {
              "type": "number"
            },
            "dislikesCount": {
              "type": "number"
            },
            "myStatus": {
              "type": "string"
            }
          },
          "required": [
            "likesCount",
            "dislikesCount",
            "myStatus"
          ]
        },
        "CommentViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "commentatorInfo": {
              "$ref": "#/components/schemas/CommentatorInfo"
            },
            "createdAt": {
              "type": "string"
            },
            "likesInfo": {
              "$ref": "#/components/schemas/LikesInfo"
            }
          },
          "required": [
            "id",
            "content",
            "commentatorInfo",
            "createdAt",
            "likesInfo"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
