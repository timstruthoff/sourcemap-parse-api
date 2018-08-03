# sourcemap-parse-api

Submit your source map and code location, get the location in the original code.

## Usage

`npm install`

Run in development mode:
`npm run dev`

Run in production mode:
`npm run start`

## API Documentation

### POST /source-map

Saves a new source-map on the server.

#### Request

The request must contain the following post body:

```javascript
{
  "map": <String> The source map as a JSON string.
}
```

#### Response

```javascript
{
  "id": <String> The id of the source map on the server.
}
```

### GET /source-map/:id

Returns the original source, line, and column information for the generated source's line and column positions provided.

The request must contain the id of the sourcemap in the URL and the following get parameters:

#### Parameters

| Name   | Type     | Description                              |
|--------|----------|------------------------------------------|
| line   | `integer` | The line number in the generated file.   |
| column | `integer` | The column number in the generated file. |

#### Response

```javascript
{
  "line": <integer> The line number in the original file.
  "column": <integer> The column number in the original file.
}
```

### DELETE /source-map/:id

Deletes the source-map with the id from the server.
