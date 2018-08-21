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

### POST /source-map/:id

Returns an array with the original source locations for all generated source locations in the request.
Each location object contains the original source, line, and column.

#### Request

The request must contain the following post body:

```javascript
{
  "errors": [
    {
      "line": <integer> The line number in the generated file.
      "column": <integer> The column number in the generated file.
    }
    ...
  ]
}
```

#### Response

```javascript
[
    {
        "source": <String> The original source file of the location.
        "line": <integer> The line number in the original file.
        "column": <integer> The column number in the original file.
    }
    ...
]
```
