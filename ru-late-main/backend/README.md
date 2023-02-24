# Documentation for the RU Late API

## Route Types

Routes are grouped into categories based on the type of information they provide. The five categories of routes grouped by information are:

- Users, corresponding to all routes starting with `/users`
- Notifications, corresponding to all routes starting with `/notifications`
- Favorites, corresponding to all routes starting with `/favorites`
- Routes, corresponding to all routes starting with `/routes`
- Stops, corresponding to all routes starting with `/stops`

In addition to the type of information they provide, routes are also grouped into categories based on the access level required to call the routes. The three categories of routes grouped by access level are:

- Unprotected routes
- Protected routes
- Admin routes

### Unprotected Routes

These routes do not require the user to be logged in to access.

- `/users/login`
- `/users/signup`

### Protected Routes

These routes require the user to be logged in to access.

- `/users/get`
- `/users/update`
- `/users/delete`
- `/notifications/get`
- `/notifications/add`
- `/notifications/delete/:notificationId`
- `/notifications/getByUser/:userId`
- `/favorites/get`
- `/favorites/getDict`
- `/favorites/add`
- `/favorites/delete`
- `/routes/get/:routeId`
- `/routes/getAll`
- `/routes/getByStop/:stopId`
- `/stops/get/:stopId`
- `/stops/getAll`
- `/stops/getByRoute/:routeId`

### Admin Routes

These routes require the user to be logged in and to be an admin to access.

- `/users/get/:userId`
- `/users/getAll`
- `/users/update/:userId`
- `/users/delete/:userId`
- `/favorites/getByUser/:userId`
- `/routes/enable/:routeId`
- `/routes/disable/:routeId`

## Accessing Protected and Admin Routes

When a user makes a request to the API, inside the request, there is a `headers` field. Typically, when called from the web server, this field contains the following values:

```
headers: {
    Accept: "application/json",
    Content-Type: "application/json;charset=UTF-8",
}
```

However, if the route you want to access is protected, then you must include an `authorization` field with the value `'Bearer <token>'`, where `token` is the JSON Web Token (JWT) you receive that corresponds to the account the user logged in as when you successfully call `/users/login`. By including this token in `headers`, the API will allow you to call protected routes.

An unsuccessful call to a protected route may return an error response. Some of these responses include:

- `401: You are not logged in`
    - Occurs when you do not include the token in your `headers`
- `401: User does not exist`
    - Occurs when the `userId` corresponding to the JWT is for a user that does not exists (e.g., has been deleted)
- `500: jwt expired`
    - Occurs when the JWT was created more than an hour before the current time (currently, the JWT is created at each user login)
- `500: jwt malformed`
    - Occurs when `headers.authorization` includes an invalid JWT (e.g., malformed, incorrectly formatted, etc.)

If you want to call admin routes, then the user your token corresponds to must be an admin.

An unsuccessful call to an admin route may return an error response. Some of these responses include:

- `403: User is not an admin`
    - Occurs when the `userId` corresponding to the JWT is for a user that is not an admin

## List of Routes

### `/users/login`

A route for users to attempt to log in to their account.

- Type: Users
- Access Level: Unprotected
- HTTP Method: `POST`

#### Input - `request`

`request.params`

- none

`request.body`

| Field | Description |
| ---: | :--- |
| `email` | A string corresponding to the email address of the user that the user intends to log in as |
| `password` | A string corresponding to the password of the user that the user intends to log in as |

`response`

#### Output

**On Success**

- Status Code: `200`

```
{
    status: <status>,
    token: <token>,
}
```

| Field | Description | 
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |
| `token` | A string corersponding to the JWT created using the User ID of the account the user tried to log in as.

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `401` | `Email or password is incorrect` | The credentials provided do not match any of the users in the database.

### `/users/signup`

A route for users to attempt to register for a new acccount

- Type: Users
- Access Level: Unprotected
- HTTP Method: `POST`

#### Input - `request`

`request.params`

- none

`request.body`

| Field | Description |
| ---: | :--- |
| `email` | A string containing the email the user wants to use for their account |
| `password` | A string containing the password the user wants to use for their account |
| `name` | A string containing the name the user wants to use for their account |
| `phone` | [OPTIONAL] A string containing the phone number the user wants to use for their account |

#### Output - `response`

**On Success**

- Status Code: `201`

```
{
    status: <status>,
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `409` | `User with that email already exists` | A user with the same email address already exists |

### `/users/get`

A route for users to get the user information for the account they are logged into using the User ID associated with the JWT

- Type: Users
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

- none

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    userId: <userId>,
    email: <email>,
    name: <name>,
    phone: <phone>,
    admin: <admin>,
}
```

| Field | Description |
| ---: | :--- |
| `userId` | An integer correponding to the user's User ID |
| `email` | A string corresponding to the user's email |
| `name` | A string corresponding to the user's name |
| `phone` | A string corresponding to the user's phone number |
| `admin` | An integer that is `0` when the user is not an admin, and `1` when the user is an admin |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `Own user not found` | A user corresponding to the User ID stored in the JWT could not be found |

### `/users/update`

A route for users to update the user information for the account they are logged into using the User ID associated with the JWT

- Type: Users
- Access Level: Protected
- HTTP Method: `PUT`

#### Input - `request`

`request.params`

- none

`request.body`

| Field | Description |
| ---: | :--- |
| `email` | [OPTIONAL] A string corresponding to the new email for the user |
| `name` | [OPTIONAL] A string corresponding to the new name for the user |
| `phone` | [OPTIONAL] A string corresponding to the new phone number for the user |

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    status: <status>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `400` | `No values were changed from the original user` | All required values were either `null`, empty, or the same as the user before the update attempt |
| `409` | `User with that email already exists` | A user with the same email address already exists |

### `/users/delete`

A route for users to delete the account they are logged into using the User ID associated with the JWT

- Type: Users
- Access Level: Protected
- HTTP Method: `DELETE`

#### Input - `request`

`request.params`

- none

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    status: <status>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `405` | `Cannot delete user when they are the only admin` | The only admin is attempting to delete their account |

### `/users/get/:userId`

A route for an admin to get the user information for a specific user

- Type: Users
- Access Level: Admin
- HTTP Method: `GET`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `userId` | An integer corresponding to the user-to-be-found's User ID |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    userId: <userId>,
    email: <email>,
    name: <name>,
    phone: <phone>,
    admin: <admin>,
}
```

| Field | Description |
| ---: | :--- |
| `userId` | An integer correponding to the user's User ID |
| `email` | A string corresponding to the user's email |
| `name` | A string corresponding to the user's name |
| `phone` | A string corresponding to the user's phone number |
| `admin` | An integer that is `0` when the user is not an admin, and `1` when the user is an admin |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `User not found` | A user with the provided User ID does not exist |

### `/users/getAll`

A route for an admin to get a list of the user information for all users.

- Type: Users
- Access Level: Admin
- HTTP Method: `GET`

#### Input - `request`

`request.params`

- none

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: ``

```
[
    {
        userId: <userId>,
        email: <email>,
        name: <name>,
        phone: <phone>,
        admin: <admin>,
    },
    ...
]
```

| Field | Description |
| ---: | :--- |
| `userId` | An integer correponding to a user's User ID |
| `email` | A string corresponding to a user's email |
| `name` | A string corresponding to a user's name |
| `phone` | A string corresponding to a user's phone number |
| `admin` | An integer that is `0` when the user is not an admin, and `1` when the user is an admin |

**On Failure**

- none

### `/users/update/:userId`

A route for an admin to update the user information for one user

- Type: Users
- Access Level: Admin
- HTTP Method: `PUT`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `userId` | An integer corresponding to the user-to-be-updated's User ID |

`request.body`

| Field | Description |
| ---: | :--- |
| `email` | [OPTIONAL] A string corresponding to the new email for the user |
| `name` | [OPTIONAL] A string corresponding to the new name for the user |
| `phone` | [OPTIONAL] A string corresponding to the new phone number for the user |
| `admin` | [OPTIONAL] An integer that is `1` when the user is to be updated to an admin, and `0` otherwise |

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    status: <status>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `User does not exist` | There is no user with the provided User ID |
| `400` | `Invalid input for admin field` | The input for the admin field is not `0` or `1` |
| `400` | `No values were changed from the original user` | All required values were either `null`, empty, or the same as the user before the update attempt |
| `409` | `User with that email already exists` | A user with the same email address already exists |

### `/users/delete/:userId`

A route for an admin to delete a user's account

- Type: Users
- Access Level: Admin
- HTTP Method: `DELETE`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `userId` | An integer corresponding to the user-to-be-deleted's User ID |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    status: <status>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `User does not exist` | There is no user with the provided User ID |
| `405` | `Cannot delete user when they are the only admin` | The only admin is attempting to delete their account |

### `/notifications/get`

A route for users to get a list of the notifications for the account they are logged into using the User ID associated with the JWT

- Type: Notifications
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

- none

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
[
    {
        notificationId: <notificationId>,
        routeId: <routeId>,
        stopId: <stopId>,
        timestamp: <timestamp>,
    },
    ...
]
```

| Field | Description |
| ---: | :--- |
| `notificationId` | A string corresponding to a Notification ID from a notification the user has added to their notifications |
| `routeId` | A string corresponding to a Route ID from a notification that the user has added to their notifications |
| `stopId` | A string corresponding to a Stop ID from a notification that the user has added to their notifications |
| `timestamp` | An integer corresponding to a Unix timestamp (in milliseconds) from a notification that the user has added to their notifications |

**On Failure**

- none

### `/notifications/add`

A route for users to add a new notification to the account they are logged into using the User ID associated with the JWT

- Type: Notifications
- Access Level: Protected
- HTTP Method: `POST`

#### Input - `request`

`request.params`

- none

`request.body`

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to the notification-to-be-added's Route ID |
| `stopId` | A string corresponding to the notification-to-be-added's Stop ID |
| `notifTime` | An integer corresponding to the notification-to-be-added's execution time as a Unix timestamp |

#### Output - `response`

**On Success**

- Status Code: `201`

```
{
    status: <status>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |

**On Failure**

- none

### `/notifications/delete/:notificationId`

A route for users to delete a notification for the account they are logged into using the User ID associated with the JWT

- Type: Notifications
- Access Level: Protected
- HTTP Method: `DELETE`

#### Input - `request`

`request.params`

| Field | Description |
| --: | :-- |
| `notificationId` | A string corresponding to the notification-to-be-deleted's Notification ID |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    status: <status>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |

**On Failure**

- none

### `/notifications/getByUser/:userId`

A route for an admin to get the notifications for a specific user

- Type: Notifications
- Access Level: Admin
- HTTP Method: `GET`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `userId` | An integer corresponding to the User ID of the user whose favorite route-stop pairs will be found |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
[
    {
        notificationId: <notificationId>,
        routeId: <routeId>,
        stopId: <stopId>,
        timestamp: <timestamp>,
    },
    ...
]
```

| Field | Description |
| ---: | :--- |
| `notificationId` | A string corresponding to a Notification ID from a notification the user has added to their notifications |
| `routeId` | A string corresponding to a Route ID from a notification that the user has added to their notifications |
| `stopId` | A string corresponding to a Stop ID from a notification that the user has added to their notifications |
| `timestamp` | An integer corresponding to a Unix timestamp (in milliseconds) from a notification that the user has added to their notifications |

**On Failure**

- none

### `/favorites/get`

A route for users to get a list of the favorite route-stop pairs for the account they are logged into using the User ID associated with the JWT

- Type: Favorites
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

- none

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
[
    {
        routeId: <routeId>,
        stopIdList: [
            <stopId>,
            ...
        ]
    },
    ...
]
```

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to a Route ID from the route-stop pairs the user has added to their favorites |
| `stopIdList` | An array of strings corresponding to Stop IDs that are part of a specific Route ID from the route-stop pairs the user has added to their favorites |
| `stopId` | A string corresponding to a Stop ID from the route-stop pairs the user has added to their favorites |

**On Failure**

- none

### `/favorites/getDict`

A route for users to get a dictionary of the favorite route-stop pairs for the account they are logged into using the User ID associated with the JWT

- Type: Favorites
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

- none

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    <routeId>: [
        <stopId>,
        ...
    ],
    ...
}
```

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to a Route ID from the route-stop pairs the user has added to their favorites |
| `stopId` | A string correponsding to a Stop ID from the route-stop pairs the user has added to their favorites |

**On Failure**

- none

### `/favorites/add`

A route for users to add a new favorite route-stop pair to the account they are logged into using the User ID associated with the JWT

- Type: Favorites
- Access Level: Protected
- HTTP Method: `POST`

#### Input - `request`

`request.params`

- none

`request.body`

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to the route-stop pair-to-be-added's Route ID |
| `stopId` | A string corresponding to the route-stop pair-to-be-added's Stop ID |

#### Output - `response`

**On Success**

- Status Code: `201`

```
{
    status: <status>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `Route-stop pair does not exist` | No route-stop pair exists that has both the provided Route ID and Stop ID |
| `409` | `User has already favorited that route-stop pair` | The user has already favorited a route-stop pair with the provided Route ID and Stop ID |

### `/favorites/delete`

A route for users to delete a favorite route-stop pair for the account they are logged into usng the User ID associated with the JWT

- Type: Favorites
- Access Level: Protected
- HTTP Method: `DELETE`

#### Input - `request`

`request.params`

- none

`request.body`

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to the route-stop pair-to-be-deleted's Route ID |
| `stopId` | A string corresponding to the route-stop pair-to-be-deleted's Stop ID |

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    status: <status>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `Favorited route-stop pair does not exist` | The user does not have a route-stop pair with the provided Route ID and Stop ID in their favorites |

### `/favorites/getByUser/:userId`

A route for an admin to get the favorite route-stop pairs for a specific user

- Type: Favorites
- Access Level: Admin
- HTTP Method: `GET`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `userId` | An integer corresponding to the User ID of the user whose favorite route-stop pairs will be found |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
[
    {
        routeId: <routeId>,
        stopIdList: [
            <stopId>,
            ...
        ]
    },
    ...
]
```

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to a Route ID from the route-stop pairs the user has added to their favorites |
| `stopIdList` | An array of strings corresponding to Stop IDs that are part of a specific Route ID from the route-stop pairs the user has added to their favorites |
| `stopId` | A string correponsding to a Stop ID from the route-stop pairs the user has added to their favorites |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `User does not exist` | There is no user with the provided User ID |

### `/routes/get/:routeId`

A route for a user to get the route information for a specific route

- Type: Routes
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to the route-to-be-found's Route ID |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    routeId: <routeId>,
    name: <name>,
    color: <color>,
    enabled: <enabled>,
}
```

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to the route-to-be-found's Route ID |
| `name` | A string corresponding to the route-to-be-found's name |
| `color` | A string corresponding to the route-to-be-found's assigned color code |
| `enabled` | An integer that is `0` when the route is to be hidden, and `1` when the route is to be shown |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `Route does not exist` | A route with the provided Route ID does not exist |

### `/routes/getAll`

A route for a user to get the route information for all routes

- Type: Routes
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

- none

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
[
    {
        routeId: <routeId>,
        name: <name>,
        color: <color>,
        enabled: <enabled>,
    },
    ...
]
```

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to a route's Route ID |
| `name` | A string corresponding to a route's name |
| `color` | A string corresponding to a route's assigned color code |
| `enabled` | An integer that is `0` when the route is to be hidden, and `1` when the route is to be shown |

**On Failure**

- none

### `/routes/getByStop/:stopId`

A route for a user to get the route information for all routes that stop at a specific stop

- Type: Routes
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `stopId` | A string corresponding to the Stop ID of the stop where the routes-to-be-found stop at |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
[
    {
        routeId: <routeId>,
        name: <name>,
        color: <color>,
        enabled: <enabled>,
    },
    ...
]
```

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to a route's Route ID |
| `name` | A string corresponding to a route's name |
| `color` | A string corresponding to a route's assigned color code |
| `enabled` | An integer that is `0` when the route is to be hidden, and `1` when the route is to be shown |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `Stop does not exist` | A stop with the provided Stop ID does not exist |

### `/routes/enable/:routeId`

A route for an admin to enable a route for display 

- Type: Routes
- Access Level: Admin
- HTTP Method: `PUT`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to the route-to-be-enabled's Route ID |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200` or `202`

```
{
    status: <status>,
    message: <message>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |
| `message` | A string that only appears on a `202` status code, indicating that the route was already enabled |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `Route does not exist` | A route with the provided Route ID does not exist |

### `/routes/disable/:routeId`

A route for an admin to disable a route for display 

- Type: Routes
- Access Level: Admin
- HTTP Method: `PUT`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to the route-to-be-disabled's Route ID |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200` or `202`

```
{
    status: <status>,
    message: <message>
}
```

| Field | Description |
| ---: | :--- |
| `status` | A string indicating whether the call was successful. Usually one of `success`, `fail`, or `error`. |
| `message` | A string that only appears on a `202` status code, indicating that the route was already disabled |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `Route does not exist` | A route with the provided Route ID does not exist |

### `/stops/get/:stopId`

A route for a user to get the stop information for a specific stop

- Type: Stops
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `stopId` | A string corresponding to the stop-to-be-found's Stop ID |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
{
    stopId: <stopId>,
    name: <name>,
    lat: <lat>,
    lng: <lng>,
}
```

| Field | Description |
| ---: | :--- |
| `stopId` | A string corresponding to the stop-to-be-found's Stop ID |
| `name` | A string corresponding to the stop-to-be-found's name |
| `lat` | A float corresponding to the stop-to-be-found's latitude |
| `lng` | A float corresponding to the stop-to-be-found's longitude |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `Stop does not exist` | A stop with the provided Stop ID does not exist |

### `/stops/getAll`

A route for a user to get the stop information for all stops

- Type: Stops
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

- none

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
[
    {
        stopId: <stopId>,
        name: <name>,
        lat: <lat>,
        lng: <lng>,
    },
    ...
]
```

| Field | Description |
| ---: | :--- |
| `stopId` | A string corresponding to a stop's Stop ID |
| `name` | A string corresponding to a stop's name |
| `lat` | A float corresponding to a stop's latitude |
| `lng` | A float corresponding to a stop's longitude |

**On Failure**

- none

### `/stops/getByRoute/:routeId`

A route for a user to get the stop information for all stops that are part of a specific route

- Type: Stops
- Access Level: Protected
- HTTP Method: `GET`

#### Input - `request`

`request.params`

| Field | Description |
| ---: | :--- |
| `routeId` | A string corresponding to the Route ID of the route that the stops-to-be-found are part of |

`request.body`

- none

#### Output - `response`

**On Success**

- Status Code: `200`

```
[
    {
        stopId: <stopId>,
        name: <name>,
        lat: <lat>,
        lng: <lng>,
    },
    ...
]
```

| Field | Description |
| ---: | :--- |
| `stopId` | A string corresponding to a stop's Stop ID |
| `name` | A string corresponding to a stop's name |
| `lat` | A float corresponding to a stop's latitude |
| `lng` | A float corresponding to a stop's longitude |

**On Failure**

| Status | Message | Description |
| :---: | :--- | :--- |
| `404` | `Route does not exist` | A route with the provided Route ID does not exist |

---
---
---

referenced https://github.com/MoathShraim/Nodejs-rest-api-project-structure-Express for some files