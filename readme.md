<p align="center">
  <a href="https://material-ui.com/" rel="noopener" target="_blank"><img width="150" src="https://archival-iiif.github.io/logos/iiif.png" alt="Material-UI logo"></a>
</p>

<h1 align="center">Archival IIIF image server</h1>

<div align="center">Archival IIIF image server is an implementation of the IIIF Image API.
</div>

## Web API

_See also the [IIIF Image API 2.1](https://iiif.io/api/image/2.1/) 
and the [IIIF Image API 3.0](https://iiif.io/api/image/3.0/)_

**URL**: `/[id]/[region]/[size]/[rotation]/[quality].[format]`

**Method**: `GET`

E.g. http://localhost:3333/example.jpg/full/!100,100/0/default.jpg

## Installation

1. Install
    * [Node.js 18.x LTS](https://nodejs.org/en)
    * [yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com)
2. Set up the configuration (See .env.example for the example configuration)
    * Copy .env.example to .env and set up the parameters for development
    * Set up the environment variables for production (see above)
    with the environment variables
3. Install dependencies
   ```sh
   // with npm
   npm install
   
   // with yarn
   yarn install
   ```
   
## Usage

1. Copy your images into the data folder, you defined in the .env file (`IIIF_IMAGE_ROOT_PATH`).
2. Start the application:
   ```sh
   // with npm
   npm run start
   
   // with yarn
   yarn run start
   ```

## Configuration

<table>
    <thead>
        <tr>
            <td>Key</td>
            <td>Description</td>
            <td>Example | Values</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>NODE_ENV</td>
            <td>Environment type</td>
            <td><code>development or production</code></td>
        </tr>
        <tr>
            <td>IIIF_IMAGE_PORT</td>
            <td>Server Port</td>
            <td>E.g. <code>3333</code></td>
        </tr>
        <tr>
            <td>IIIF_IMAGE_ROOT_PATH</td>
            <td>Path to images</td>
            <td>E.g. <code>/data</code></td>
        </tr>
        <tr>
            <td>IIIF_IMAGE_CONCURRENCY</td>
            <td>Parameter which controls the number of threads libvips can use for image processing</td>
            <td>By default it takes the number of CPU cores available. Specify 0 to make it explicit.</td>
        </tr>
    </tbody>
</table>
