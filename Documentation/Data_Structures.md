# Data Structures

This file contains documentation of the formatting of data used within CouRM

# DATABASE TABLES

The database used is SQLite, contained within the `backend/main.db` file.

## Contacts

### Table Structure
```
CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT,
    profilePicture TEXT,
    phoneNumber TEXT,
    email TEXT,
    address TEXT,
    firm TEXT,
    industry TEXT,
    dateOfBirth TEXT,
    tags TEXT,
    interactions TEXT,
    bio TEXT,
    createdBy TEXT,
    createdOn TEXT NOT NULL,
    lastModifiedBy TEXT,
    lastModifiedOn TEXT,
    lastInteractionId TEXT,
    lastInteractionOn TEXT NOT NULL,
    entityType TEXT NOT NULL     
```

### Backups

Backups of the contacts are saved as JSON in the following structure:

```
{
    "version": integer,
    "timestamp": "String",
    "data": {
        "contacts": [
            {
                "id": integer,
                "firstName": "String",
                "lastName": "String",
                "profilePicture": "String",
                "phoneNumber": "String",
                "email": "String",
                "address": "String",
                "firm": "String",
                "industry": "String",
                "dateOfBirth": "String",
                "tags": "String",
                "interactions": "String",
                "createdBy": "String",
                "createdOn": "String",
                "lastModifiedBy": "String",
                "lastModifiedOn": "String",
                "lastInteractionId": "String",
                "lastInteractionOn": "String",
                "entityType": "String"
            }
        ]
    }
}
```

## Notes

### Table Structure
```
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date datetime NOT NULL,
    title TEXT,
    record TEXT,
    address TEXT,
    contacts TEXT,
    tags TEXT,
    createdOn datetime default current_timestamp,
    lastModifiedOn datetime default current_timestamp
    );
```

## Events

## Relations

### Table Structure
```
CREATE TABLE IF NOT EXISTS relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contactId TEXT,
    noteId TEXT,
    eventId TEXT,
    createdOn datetime default current_timestamp,
    lastModifiedOn datetime default current_timestamp
    );
```
