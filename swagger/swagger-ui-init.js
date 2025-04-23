
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
      "/api/sa/users": {
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
          "security": [
            {
              "basic": []
            },
            {
              "basicAuth": []
            }
          ],
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
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Create new user",
          "tags": [
            "Users"
          ]
        }
      },
      "/api/sa/users/{id}": {
        "delete": {
          "operationId": "UsersController_deleteUserById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Delete user",
          "tags": [
            "Users"
          ]
        }
      },
      "/api/auth/me": {
        "get": {
          "operationId": "AuthController_getMe",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/MeViewDto"
                  }
                }
              }
            }
          },
          "summary": "Get info about current user",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginInputDto"
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
                    "$ref": "#/components/schemas/ConfirmCodeViewDto"
                  }
                }
              }
            }
          },
          "summary": "Login user into system.",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
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
            "204": {
              "description": ""
            }
          },
          "summary": "User registration",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_registrationConfirm",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConfirmCodeViewDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Confirm registration",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_registrationEmailResending",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailResendingDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Email confirmation code send",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PasswordRecoveryInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Password recovery code send",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PasswordUpdateInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Set new password",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshToken",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "summary": "Refresh token",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Logout",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/security/devices": {
        "get": {
          "operationId": "DevicesController_getDevices",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Devices"
          ]
        },
        "delete": {
          "operationId": "DevicesController_terminateOtherSessions",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "Devices"
          ]
        }
      },
      "/api/security/devices/{id}": {
        "delete": {
          "operationId": "DevicesController_terminateSessionById",
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
          "tags": [
            "Devices"
          ]
        }
      },
      "/api/sa/blogs": {
        "get": {
          "description": "Fetches all blogs with optional query parameters for search, sorting, and pagination.",
          "operationId": "SuperAdminBlogsController_getBlogs",
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
            "SuperAdminBlogs"
          ]
        },
        "post": {
          "operationId": "SuperAdminBlogsController_createNewBlog",
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
            "SuperAdminBlogs"
          ]
        }
      },
      "/api/sa/blogs/{id}": {
        "get": {
          "operationId": "SuperAdminBlogsController_getBlogById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "SuperAdminBlogs"
          ]
        },
        "put": {
          "operationId": "SuperAdminBlogsController_updateBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
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
            "204": {
              "description": ""
            }
          },
          "summary": "Update blog fields.",
          "tags": [
            "SuperAdminBlogs"
          ]
        },
        "delete": {
          "operationId": "SuperAdminBlogsController_deleteBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "SuperAdminBlogs"
          ]
        }
      },
      "/api/sa/blogs/{id}/posts": {
        "get": {
          "description": "Fetches all posts by existing blog id with optional query parameters for search, sorting, and pagination.",
          "operationId": "SuperAdminBlogsController_getPostsByBlogId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "SuperAdminBlogs"
          ]
        },
        "post": {
          "description": "Create and return one post to existing blog. Using blogs uri parameter. ",
          "operationId": "SuperAdminBlogsController_createPostByBlogId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "SuperAdminBlogs"
          ]
        }
      },
      "/api/sa/blogs/{blogId}/posts/{postId}": {
        "put": {
          "operationId": "SuperAdminBlogsController_updatePostByBlogId",
          "parameters": [
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostInputDtoWithoutBlogId"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Update existing post fields by blog ID",
          "tags": [
            "SuperAdminBlogs"
          ]
        }
      },
      "/api/sa/blogs/{blogId}/posts/{id}": {
        "delete": {
          "operationId": "SuperAdminBlogsController_deletePostByBlogId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            },
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "SuperAdminBlogs"
          ]
        }
      },
      "/api/sa/posts": {
        "get": {
          "operationId": "SuperAdminPostsController_getPosts",
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
            "SuperAdminPosts"
          ]
        },
        "post": {
          "operationId": "SuperAdminPostsController_createNewPost",
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
            "SuperAdminPosts"
          ]
        }
      },
      "/api/sa/posts/{id}": {
        "get": {
          "operationId": "SuperAdminPostsController_getPostById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "SuperAdminPosts"
          ]
        },
        "put": {
          "operationId": "SuperAdminPostsController_updatePost",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "204": {
              "description": ""
            }
          },
          "summary": "Update existing post fields.",
          "tags": [
            "SuperAdminPosts"
          ]
        },
        "delete": {
          "operationId": "SuperAdminPostsController_deletePost",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "SuperAdminPosts"
          ]
        }
      },
      "/api/sa/posts/{id}/like-status": {
        "put": {
          "operationId": "SuperAdminPostsController_updateLikeStatus",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LikeInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Update post like.",
          "tags": [
            "SuperAdminPosts"
          ]
        }
      },
      "/api/sa/posts/{id}/comments": {
        "get": {
          "description": "Returns all comments for the post.",
          "operationId": "SuperAdminPostsController_getCommentsByPostId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
          "summary": "Gets all comments.",
          "tags": [
            "SuperAdminPosts"
          ]
        },
        "post": {
          "description": "Create and returns a new comment.",
          "operationId": "SuperAdminPostsController_createComment",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentInputDto"
                }
              }
            }
          },
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
          "summary": "Create new comment",
          "tags": [
            "SuperAdminPosts"
          ]
        }
      },
      "/api/blogs": {
        "get": {
          "description": "Fetches all blogs with optional query parameters for search, sorting, and pagination.",
          "operationId": "PublicBlogsController_getBlogs",
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
            "PublicBlogs"
          ]
        }
      },
      "/api/blogs/{id}": {
        "get": {
          "operationId": "PublicBlogsController_getBlogById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "PublicBlogs"
          ]
        }
      },
      "/api/blogs/{id}/posts": {
        "get": {
          "description": "Fetches all posts by existing blog id with optional query parameters for search, sorting, and pagination.",
          "operationId": "PublicBlogsController_getPostsByBlogId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "PublicBlogs"
          ]
        }
      },
      "/api/posts": {
        "get": {
          "operationId": "PublicPostsController_getPosts",
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
            "PublicPosts"
          ]
        }
      },
      "/api/posts/{id}": {
        "get": {
          "operationId": "PublicPostsController_getPostById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
            "PublicPosts"
          ]
        }
      },
      "/api/posts/{id}/comments": {
        "get": {
          "description": "Returns all comments for the post.",
          "operationId": "PublicPostsController_getCommentsByPostId",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
          "summary": "Gets all comments.",
          "tags": [
            "PublicPosts"
          ]
        },
        "post": {
          "description": "Create and returns a new comment.",
          "operationId": "PublicPostsController_createComment",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentInputDto"
                }
              }
            }
          },
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
          "summary": "Create new comment",
          "tags": [
            "PublicPosts"
          ]
        }
      },
      "/api/posts/{id}/like-status": {
        "put": {
          "operationId": "PublicPostsController_updateLikeStatus",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LikeInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Update post like.",
          "tags": [
            "PublicPosts"
          ]
        }
      },
      "/api/comments/{id}": {
        "get": {
          "operationId": "CommentsController_getCommentById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
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
        },
        "put": {
          "operationId": "CommentsController_updateComment",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Update commentary.",
          "tags": [
            "Comments"
          ]
        },
        "delete": {
          "operationId": "CommentsController_deleteComment",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Delete 1 comment by id.",
          "tags": [
            "Comments"
          ]
        }
      },
      "/api/comments/{id}/like-status": {
        "put": {
          "operationId": "CommentsController_updateLikeStatus",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LikeInputDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          },
          "summary": "Update commentary like.",
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
      },
      "/api/sa/quiz/questions": {
        "get": {
          "operationId": "QuestionController_getQuestions",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "basicAuth": []
            }
          ],
          "summary": "Get all questions",
          "tags": [
            "Question"
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
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        },
        "basic": {
          "type": "http",
          "scheme": "basic"
        }
      },
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
        "ObjectId": {
          "type": "object",
          "properties": {}
        },
        "MeViewDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string"
            },
            "email": {
              "type": "string"
            }
          },
          "required": [
            "login",
            "email"
          ]
        },
        "LoginInputDto": {
          "type": "object",
          "properties": {
            "loginOrEmail": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "loginOrEmail",
            "password"
          ]
        },
        "ConfirmCodeViewDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string"
            }
          },
          "required": [
            "code"
          ]
        },
        "EmailResendingDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "PasswordRecoveryInputDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            }
          },
          "required": [
            "email"
          ]
        },
        "PasswordUpdateInputDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string"
            },
            "recoveryCode": {
              "type": "string"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
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
        "NewestLikesViewDto": {
          "type": "object",
          "properties": {
            "addedAt": {
              "type": "object"
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
              "$ref": "#/components/schemas/ObjectId"
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content",
            "blogId"
          ]
        },
        "PostInputDtoWithoutBlogId": {
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
            }
          },
          "required": [
            "title",
            "shortDescription",
            "content"
          ]
        },
        "LikeInputDto": {
          "type": "object",
          "properties": {}
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
        },
        "CommentInputDto": {
          "type": "object",
          "properties": {}
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
