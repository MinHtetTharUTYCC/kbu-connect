# KBU Connect API Reference

## Base URL

```txt
https://api.example.com
```

---

# Authentication

| Method | Endpoint      | Auth           | Payload           | Returns                                         |
| ------ | ------------- | -------------- | ----------------- | ----------------------------------------------- |
| POST   | /auth/signup  | No             | `{ email }`       | Verification code sent                          |
| POST   | /auth/login   | No             | `{ email }`       | Verification code sent                          |
| POST   | /auth/verify  | No             | `{ email, code }` | `{ access_token, expiresIn, profileCompleted }` |
| POST   | /auth/refresh | Refresh Cookie | None              | `{ access_token, expiresIn }`                   |

### Verify Response

```json
{
  "access_token": "jwt_token",
  "expiresIn": 900,
  "profileCompleted": true
}
```

---

# User Profile

## Get Current User

| Method | Endpoint  | Auth         |
| ------ | --------- | ------------ |
| GET    | /users/me | Bearer Token |

Returns:

```ts
{
  isComplete: boolean
  status: {
    data: boolean
    avatar: boolean
    gallery: boolean
  }
  user: UserProfile
}
```

---

## Update Profile

| Method | Endpoint  | Auth         |
| ------ | --------- | ------------ |
| PATCH  | /users/me | Bearer Token |

Payload:

```ts
{
  name: string
  avatarUrl?: string
  bio?: string

  faculty: Faculty
  nationality?: Nationality

  gender: Gender
  birthYear: number

  interests: Interest[]

  minPreferredAge?: number
  maxPreferredAge?: number

  preferredGender: Gender

  preferredNationalities?: Nationality[]

  preferredFaculties?: Faculty[]

  gallery: GalleryImage[]
}
```

Returns updated profile.

---

## Toggle Discoverability

| Method | Endpoint               |
| ------ | ---------------------- |
| PATCH  | /users/me/discoverable |

Payload:

```json
{
  "isDiscoverable": true
}
```

---

## Get User By ID

| Method | Endpoint   |
| ------ | ---------- |
| GET    | /users/:id |

Returns public user profile.

---

# Avatar

## Upload Avatar

| Method | Endpoint      |
| ------ | ------------- |
| POST   | /users/avatar |

Content-Type:

```txt
multipart/form-data
```

Returns:

```json
{
  "message": "Action completed successfully",
  "avatarUrl": "https://..."
}
```

---

# Gallery

## Upload Gallery Images

| Method | Endpoint        |
| ------ | --------------- |
| POST   | /gallery/upload |

Content-Type:

```txt
multipart/form-data
```

Rules:

```txt
Maximum 10 images
```

Returns:

```ts
{
  images: {
    key: string
    imageUrl: string
  }[]
}
```

---

## Get User Gallery

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /gallery/:userId |

Returns:

```ts
GalleryItem[]
```

---

## Delete Gallery Image

| Method | Endpoint          |
| ------ | ----------------- |
| DELETE | /gallery/:imageId |

Returns:

```json
{
  "message": "Image deleted successfully",
  "id": "image-id"
}
```

---

# Discovery

## Get Discovery Feed

| Method | Endpoint   |
| ------ | ---------- |
| GET    | /discovery |

Query:

```ts
{
  cursor?: string
  limit?: number
}
```

Returns:

```ts
{
  users: DiscoveryUser[]
  nextCursor?: string
}
```

---

# Swipes

## Create Swipe

| Method | Endpoint |
| ------ | -------- |
| POST   | /swipes  |

Payload:

```json
{
  "receiverId": "user-id",
  "type": "LIKE"
}
```

type:

```txt
LIKE
DISLIKE
```

---

# Matches

## Get Matches

| Method | Endpoint |
| ------ | -------- |
| GET    | /matches |

Query:

```ts
{
  cursor?: string
  limit?: number
}
```

Returns:

```ts
{
  matches: Match[]
  nextCursor?: string
}
```

---

## Mark Match As Seen

| Method | Endpoint               |
| ------ | ---------------------- |
| PATCH  | /matches/:matchId/seen |

Returns success message.

---

## Unmatch User

| Method | Endpoint          |
| ------ | ----------------- |
| DELETE | /matches/:matchId |

Payload:

```json
{
  "reason": "NOT_INTERESTED",
  "details": "Optional note"
}
```

---

# Chat

## Send Shoutout

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /chats/shoutouts |

Rules:

```txt
Maximum 5 shoutouts per day
```

Returns success message.

---

## Reply To Shoutout

| Method | Endpoint                         |
| ------ | -------------------------------- |
| POST   | /chats/shoutouts/:senderId/reply |

Creates:

```txt
Conversation + First Message
```

Returns:

```ts
Conversation
```

---

## Get Conversations

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /chats/conversations |

Query:

```ts
{
  cursor?: string
  limit?: number
}
```

Returns:

```ts
{
  conversations: Conversation[]
  nextCursor?: string
}
```

---

## Get Messages

| Method | Endpoint                                      |
| ------ | --------------------------------------------- |
| GET    | /chats/conversations/:conversationId/messages |

Returns:

```ts
{
  messages: Message[]
  nextCursor?: string
}
```

---

## Send Message

| Method | Endpoint    |
| ------ | ----------- |
| POST   | /chats/send |

Payload:

```json
{
  "conversationId": "conversation-id",
  "content": "Hello!"
}
```

Returns created message.

---

## Edit Message

| Method | Endpoint                   |
| ------ | -------------------------- |
| PATCH  | /chats/messages/:messageId |

Payload:

```json
{
  "content": "Updated text"
}
```

Returns updated message.

---

## Delete Message

| Method | Endpoint                   |
| ------ | -------------------------- |
| DELETE | /chats/messages/:messageId |

Returns success message.

---

## Mark Conversation Seen

| Method | Endpoint                                  |
| ------ | ----------------------------------------- |
| PATCH  | /chats/conversations/:conversationId/seen |

Returns success message.

---

## Delete Conversation

| Method | Endpoint                             |
| ------ | ------------------------------------ |
| DELETE | /chats/conversations/:conversationId |

Returns success message.

---

# Blocks

## Block User

| Method | Endpoint |
| ------ | -------- |
| POST   | /blocks  |

Payload:

```json
{
  "blockedId": "user-id",
  "reason": "Inappropriate behavior"
}
```

---

## Unblock User

| Method | Endpoint |
| ------ | -------- |
| DELETE | /blocks  |

Payload:

```json
{
  "blockedId": "user-id"
}
```

---

## Get Blocked Users

| Method | Endpoint |
| ------ | -------- |
| GET    | /blocks  |

Returns blocked users list.

---

# Reports

## Create Report

| Method | Endpoint |
| ------ | -------- |
| POST   | /reports |

Payload:

```json
{
  "reportedId": "user-id",
  "reason": "INAPPROPRIATE_BEHAVIOR",
  "description": "Additional details"
}
```

---

# Admin

## Users

| Method | Endpoint     |
| ------ | ------------ |
| GET    | /admin/users |

Returns paginated user list.

---

## Statistics

| Method | Endpoint     |
| ------ | ------------ |
| GET    | /admin/stats |

Returns platform statistics.

---

## Audit Logs

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /admin/audit-logs |

Query:

```ts
{
  page?: number
  limit?: number
}
```

---

## Ban User

| Method | Endpoint   |
| ------ | ---------- |
| POST   | /admin/ban |

Payload:

```json
{
  "userId": "user-id",
  "reason": "Harassment"
}
```

---

## Unban User

| Method | Endpoint   |
| ------ | ---------- |
| DELETE | /admin/ban |

Payload:

```json
{
  "userId": "user-id"
}
```

---

## Get Banned Users

| Method | Endpoint   |
| ------ | ---------- |
| GET    | /admin/ban |

Query:

```ts
{
  page?: number
  limit?: number
}
```

---

## Pending Reports

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /reports/pending |

Returns pending reports.

---

## Report Details

| Method | Endpoint     |
| ------ | ------------ |
| GET    | /reports/:id |

Returns report + chat context.

---

## Batch Dismiss Reports

| Method | Endpoint               |
| ------ | ---------------------- |
| PATCH  | /reports/batch-dismiss |

Payload:

```json
{
  "reportIds": ["id1", "id2"]
}
```

---

## Resolve Report

| Method | Endpoint             |
| ------ | -------------------- |
| PATCH  | /reports/:id/resolve |

Payload:

```json
{
  "action": "RESOLVE"
}
```

---

# Shared Types

## Gender

```ts
type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER"
```

## SwipeType

```ts
type SwipeType =
  | "LIKE"
  | "DISLIKE"
```

## ReportReason

```ts
type ReportReason =
  | "INAPPROPRIATE_BEHAVIOR"
  | "HARASSMENT"
  | "SPAM"
  | "FAKE_PROFILE"
  | "OTHER"
```

## UnmatchReason

```ts
type UnmatchReason =
  | "NOT_INTERESTED"
  | "INAPPROPRIATE_BEHAVIOR"
  | "OTHER"
```
