# Twigs Web Client

Twigs is an open source budgeting app aimed at people who need to share a budget. This project serves as the web front end, and is powered by Angular. The main back end project can be found at [wbrawner/twigs-server](https://github.com/wbrawner/twigs-server)

## Building

You'll need NodeJS and NPM, then run

    npm run build

If you would like to tinker with the site and have it hot reload, then run

    npm run start

The app will be available at http://localhost:4200

## Self-hosting

Eventually the plan is to ship this web app within the JAR for the server, but for now you'll need to run them separately. Before you build the app, be sure to change the `apiUrl` value in [src/environments/environment.prod.ts](src/environments/environment.prod.ts). Then you can run the following command to get an optimized version of the build for production deployments

    npm run package

This will output the app in a folder called `dist/twigs`, which you can then serve directly with Apache or Nginx or any static file server.

## License

```
Copyright (c) 2021 William Brawner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```