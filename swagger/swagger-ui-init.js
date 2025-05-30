
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
              }
            },
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
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
                "type": "number"
              }
            },
            {
              "name": "blogId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
                "type": "number"
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
          "parameters": [
            {
              "name": "bodySearchTerm",
              "required": false,
              "in": "query",
              "description": "Search term for questions",
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
                          "$ref": "#/components/schemas/QuestionViewDto"
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
          "summary": "Get all questions",
          "tags": [
            "Question"
          ]
        },
        "post": {
          "operationId": "QuestionController_createNewQuestion",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionInputDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "basic": []
            }
          ],
          "summary": "Add new question",
          "tags": [
            "Question"
          ]
        }
      },
      "/api/sa/quiz/questions/{id}": {
        "delete": {
          "operationId": "QuestionController_deleteQuestion",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
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
          "summary": "Delete question",
          "tags": [
            "Question"
          ]
        },
        "put": {
          "operationId": "QuestionController_updateQuestion",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionInputDto"
                }
              }
            }
          },
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
          "summary": "Update question",
          "tags": [
            "Question"
          ]
        }
      },
      "/api/sa/quiz/questions/{id}/publish": {
        "put": {
          "operationId": "QuestionController_publishQuestion",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/QuestionPublishDto"
                }
              }
            }
          },
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
          "summary": "Publish question",
          "tags": [
            "Question"
          ]
        }
      },
      "/api/pair-game-quiz/pairs/my-current": {
        "get": {
          "operationId": "PairGameQuizController_getMyCurrentGame",
          "parameters": [],
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
                          "$ref": "#/components/schemas/GameViewDto"
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
              "bearer": []
            }
          ],
          "summary": "Get the current game",
          "tags": [
            "PairGameQuiz"
          ]
        }
      },
      "/api/pair-game-quiz/pairs/my": {
        "get": {
          "operationId": "PairGameQuizController_getMyGames",
          "parameters": [],
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
                          "$ref": "#/components/schemas/PaginatedViewDto"
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
              "bearer": []
            }
          ],
          "summary": "Get all games for current user",
          "tags": [
            "PairGameQuiz"
          ]
        }
      },
      "/api/pair-game-quiz/pairs/{id}": {
        "get": {
          "operationId": "PairGameQuizController_getGameById",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
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
                          "$ref": "#/components/schemas/GameViewDto"
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
              "bearer": []
            }
          ],
          "summary": "Get the game by id",
          "tags": [
            "PairGameQuiz"
          ]
        }
      },
      "/api/pair-game-quiz/pairs/connection": {
        "post": {
          "operationId": "PairGameQuizController_connection",
          "parameters": [],
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
                          "$ref": "#/components/schemas/GameViewDto"
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
              "bearer": []
            }
          ],
          "summary": "Create new game or connect to existing game",
          "tags": [
            "PairGameQuiz"
          ]
        }
      },
      "/api/pair-game-quiz/pairs/my-current/answers": {
        "post": {
          "operationId": "PairGameQuizController_answer",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AnswerInputDto"
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
                          "$ref": "#/components/schemas/GameViewDto"
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
              "bearer": []
            }
          ],
          "summary": "Answer the question",
          "tags": [
            "PairGameQuiz"
          ]
        }
      },
      "/api/pair-game-quiz/users/my-statistic": {
        "get": {
          "operationId": "PairGameQuizController_getUserStatistic",
          "parameters": [],
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
                          "$ref": "#/components/schemas/StatisticsViewDto"
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
              "bearer": []
            }
          ],
          "summary": "Get the user statistic",
          "tags": [
            "PairGameQuiz"
          ]
        }
      },
      "/api/pair-game-quiz/users/top": {
        "get": {
          "operationId": "PairGameQuizController_getPlayersTop",
          "parameters": [],
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
                          "$ref": "#/components/schemas/PaginatedViewDto"
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
              "bearer": []
            }
          ],
          "summary": "Get the top",
          "tags": [
            "PairGameQuiz"
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
              "type": "number"
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
        },
        "QuestionViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "body": {
              "type": "string"
            },
            "correctAnswers": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "published": {
              "type": "boolean"
            },
            "createdAt": {
              "type": "string"
            },
            "updatedAt": {
              "type": "object"
            }
          },
          "required": [
            "id",
            "body",
            "correctAnswers",
            "published",
            "createdAt",
            "updatedAt"
          ]
        },
        "QuestionInputDto": {
          "type": "object",
          "properties": {
            "body": {
              "type": "string"
            },
            "correctAnswers": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "body",
            "correctAnswers"
          ]
        },
        "QuestionPublishDto": {
          "type": "object",
          "properties": {
            "published": {
              "type": "boolean"
            }
          },
          "required": [
            "published"
          ]
        },
        "PlayerProgressViewDto": {
          "type": "object",
          "properties": {}
        },
        "GameViewDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "firstPlayerProgress": {
              "$ref": "#/components/schemas/PlayerProgressViewDto"
            },
            "secondPlayerProgress": {
              "$ref": "#/components/schemas/PlayerProgressViewDto"
            },
            "questions": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/QuestionViewDto"
              }
            },
            "status": {
              "type": "string"
            },
            "pairCreatedDate": {
              "type": "string"
            },
            "startGameDate": {
              "type": "object"
            },
            "finishGameDate": {
              "type": "object"
            }
          },
          "required": [
            "id",
            "firstPlayerProgress",
            "secondPlayerProgress",
            "questions",
            "status",
            "pairCreatedDate",
            "startGameDate",
            "finishGameDate"
          ]
        },
        "AnswerInputDto": {
          "type": "object",
          "properties": {
            "answer": {
              "type": "string"
            }
          },
          "required": [
            "answer"
          ]
        },
        "StatisticsViewDto": {
          "type": "object",
          "properties": {
            "sumScore": {
              "type": "number"
            },
            "avgScores": {
              "type": "number"
            },
            "gamesCount": {
              "type": "number"
            },
            "winsCount": {
              "type": "number"
            },
            "lossesCount": {
              "type": "number"
            },
            "drawsCount": {
              "type": "number"
            }
          },
          "required": [
            "sumScore",
            "avgScores",
            "gamesCount",
            "winsCount",
            "lossesCount",
            "drawsCount"
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
