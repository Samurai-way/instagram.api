
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
      "/posts/{postId}": {
        "get": {
          "operationId": "PostsController_findPostById",
          "summary": "Find post by id",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Find post by id",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            }
          },
          "tags": [
            "Posts"
          ]
        },
        "delete": {
          "operationId": "PostsController_deletePostById",
          "summary": "Delete post by id",
          "parameters": [
            {
              "name": "postId",
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
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Posts"
          ]
        },
        "put": {
          "operationId": "PostsController_updatePostById",
          "summary": "Update post by id",
          "parameters": [
            {
              "name": "postId",
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
                  "$ref": "#/components/schemas/UpdatePostDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns updated post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModel"
                  }
                }
              }
            },
            "400": {
              "description": ""
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/posts": {
        "post": {
          "operationId": "PostsController_createPost",
          "summary": "Create post",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Return created post",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PostViewModel"
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Posts"
          ]
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
          "summary": "Registration in the system. Email with confirmation code will be send to passed email address.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted. Email with confirmation code will be send to passed email address"
            },
            "400": {
              "description": "If the inputModel has incorrect values (in particular if the user with the given email or login already exists)",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/google": {
        "get": {
          "operationId": "AuthController_googleAuth",
          "summary": "Try login user to the system with google account",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 8 hours) in body and JWT refreshToken in cookie (http-only, secure) (expired after 30d ays).",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "accessToken": "string"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "If the password or login is wrong"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_registrationConfirmation",
          "summary": "Confirm registration.",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ConfirmationCodeDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Email was verified. Account was activated"
            },
            "400": {
              "description": "If the confirmation code is incorrect, expired or already been applied",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_registrationEmailResending",
          "summary": "Resend confirmation registration Email if user exists",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EmailDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere"
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_userLogin",
          "summary": "Try login user to the system",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "Example request body",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthCredentialsModel"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 8 hours) in body and JWT refreshToken in cookie (http-only, secure) (expired after 30d ays).",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "accessToken": "string"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "If the password or login is wrong"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_userRefreshToken",
          "summary": "Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing). Device LastActiveDate should be overrode by issued Date of new refresh token",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Returns JWT accessToken (expired after 8 hours) in body and JWT refreshToken in cookie (http-only, secure) (expired after 30days).",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "accessToken": "string"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_userPasswordRecovery",
          "summary": "Password recovery via Email confirmation. Email should be sent with RecoveryCode inside",
          "parameters": [],
          "responses": {
            "204": {
              "description": "Even if current email is not registered (for prevent user's email detection)"
            },
            "400": {
              "description": "If the inputModel has invalid email (for example 222^gmail.com)"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_userNewPassword",
          "summary": "Confirm password recovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/NewPasswordDto"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": "If code is valid and new password is accepted"
            },
            "403": {
              "description": "If code is wrong"
            },
            "404": {
              "description": "If user with this code doesnt exist"
            },
            "429": {
              "description": "More than 5 attempts from one IP-address during 10 seconds"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_userLogout",
          "summary": "In cookie client must send correct refreshToken that will be revoked",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_getUser",
          "summary": "Get information about current user",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "email": "string",
                      "login": "string",
                      "userId": "string"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/users/profile": {
        "put": {
          "operationId": "UsersController_updateProfile",
          "summary": "Update current user profile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "description": "Example request body (all fields not required)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Returns updated profile",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "name": "string",
                      "surname": "string",
                      "aboutMe": "string",
                      "city": "string",
                      "dateOfBirthday": "2023-04-10T16:20:10.847Z"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "If the inputModel has incorrect values",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Users"
          ]
        },
        "get": {
          "operationId": "UsersController_findProfileByUserId",
          "summary": "Users profile with his information",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Successfully return users profile",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "name": "string",
                      "surname": "string",
                      "aboutMe": "string",
                      "city": "string",
                      "dateOfBirthday": "2023-04-10T16:20:10.847Z"
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Users"
          ]
        }
      },
      "/users/avatar": {
        "post": {
          "operationId": "UsersController_uploadImageForProfile",
          "summary": "Upload users avatar",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "file": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Return profile photo",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "photo": "https://inctagram-nest.s3.example"
                    }
                  }
                }
              }
            },
            "400": {
              "description": "If file format is incorrect",
              "content": {
                "application/json": {
                  "schema": {
                    "example": {
                      "errorsMessages": [
                        {
                          "message": "string",
                          "field": "string"
                        }
                      ]
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "Users"
          ]
        }
      },
      "/testing/all-data": {
        "delete": {
          "operationId": "TestingController_deleteAllData",
          "summary": "Clear all data of db",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No content"
            }
          },
          "tags": [
            "Clear data of DB"
          ]
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "DevicesController_getAllDevices",
          "summary": "Returns all devices with active sessions for current user",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "example": [
                      {
                        "ip": "string",
                        "title": "string",
                        "lastActiveDate": "string",
                        "deviceId": "string"
                      }
                    ]
                  }
                }
              }
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Devices"
          ]
        },
        "delete": {
          "operationId": "DevicesController_deleteAllDevices",
          "summary": "Terminate all other (exclude current) device's sessions",
          "parameters": [],
          "responses": {
            "204": {
              "description": "No content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            }
          },
          "tags": [
            "Devices"
          ]
        }
      },
      "/security/devices/{deviceId}": {
        "delete": {
          "operationId": "DevicesController_deleteDevicesByDeviceId",
          "summary": "Terminate specified device session",
          "parameters": [
            {
              "name": "deviceId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": "No Content"
            },
            "401": {
              "description": "If the JWT refreshToken inside cookie is missing, expired or incorrect"
            },
            "403": {
              "description": "If try to delete the deviceId of other user"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "Devices"
          ]
        }
      }
    },
    "info": {
      "title": "Instagram api",
      "description": "Instagram api",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "JWT-auth": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http",
          "name": "JWT",
          "description": "Enter JWT token",
          "in": "header"
        }
      },
      "schemas": {
        "PostViewModel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "String",
              "description": "Id",
              "example": "12345"
            },
            "postPhoto": {
              "type": "String",
              "description": "Photo url",
              "example": "https://url.com/photo.jpg",
              "format": "Url"
            },
            "description": {
              "type": "String",
              "description": "Post description",
              "example": "Hello world"
            },
            "createdAt": {
              "type": "String",
              "description": "Date when post was created",
              "example": "2023-04-10T16:20:10.847Z"
            },
            "updatedAt": {
              "type": "String",
              "description": "Date when post was created",
              "example": "2023-04-10T16:20:10.847Z"
            }
          },
          "required": [
            "id",
            "postPhoto",
            "description",
            "createdAt",
            "updatedAt"
          ]
        },
        "CreatePostDto": {
          "type": "object",
          "properties": {
            "description": {
              "type": "String",
              "description": "Description",
              "example": "Post description",
              "minLength": 1,
              "maxLength": 500
            },
            "postPhoto": {
              "type": "object",
              "description": "Photo",
              "example": "Multipart form data",
              "format": "Binary"
            }
          },
          "required": [
            "description",
            "postPhoto"
          ]
        },
        "UpdatePostDto": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string",
              "description": "Post description",
              "example": "Hello world",
              "format": "String",
              "minLength": 1,
              "maxLength": 500
            }
          },
          "required": [
            "description"
          ]
        },
        "AuthDto": {
          "type": "object",
          "properties": {
            "login": {
              "type": "string",
              "description": "User login",
              "example": "John",
              "minLength": 3,
              "maxLength": 10
            },
            "password": {
              "type": "string",
              "description": "User password",
              "example": "string",
              "minLength": 6,
              "maxLength": 20
            },
            "email": {
              "type": "string",
              "description": "User email",
              "example": "user@example.com",
              "format": "email"
            }
          },
          "required": [
            "login",
            "password",
            "email"
          ]
        },
        "ConfirmationCodeDto": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "Confirmation code",
              "example": "someUUIDdsajkdsa-dsad-as-das-ddsa",
              "format": "email"
            }
          },
          "required": [
            "code"
          ]
        },
        "EmailDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "User email",
              "example": "test@gmail.com",
              "format": "email"
            }
          },
          "required": [
            "email"
          ]
        },
        "AuthCredentialsModel": {
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
        "NewPasswordDto": {
          "type": "object",
          "properties": {
            "newPassword": {
              "type": "string",
              "description": "newPassword",
              "example": "qwerty",
              "format": "newPassword",
              "minLength": 6,
              "maxLength": 20
            },
            "recoveryCode": {
              "type": "string",
              "description": "recoveryCode",
              "example": "123.4567",
              "format": "recoveryCode"
            }
          },
          "required": [
            "newPassword",
            "recoveryCode"
          ]
        },
        "UserProfileDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Users name",
              "example": "string"
            },
            "surname": {
              "type": "string",
              "description": "User surname",
              "example": "string"
            },
            "dateOfBirthday": {
              "type": "string",
              "description": "User date of birthday",
              "example": "some date"
            },
            "city": {
              "type": "string",
              "description": "User city",
              "example": "string"
            },
            "aboutMe": {
              "type": "string",
              "description": "Information about user",
              "example": "string"
            }
          }
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
