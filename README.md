# Screen Capture Sample

This project showcases a screen capture application generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.3.

## Development Server

To run the development server, execute the command `ng serve`. Navigate to `http://localhost:4200/` to view the application. The server will automatically reload if any changes are made to the source files.

## Code Scaffolding

Generate a new component using the command `ng generate component component-name`. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Use `ng build` to compile and build the project. The resulting build artifacts will be stored in the `dist/` directory.

## Running Unit Tests

Execute `ng test` to run unit tests via [Karma](https://karma-runner.github.io).

## Running End-to-End Tests

Run `ng e2e` to execute end-to-end tests on a platform of your choice. Note that you need to add a package implementing end-to-end testing capabilities before using this command.

## Further Help

For more information on using the Angular CLI, refer to the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Server Setup

Navigate to the server folder:

```sh
cd server
```

Install Node.js modules:

```sh
npm i
```

Run the server:

```sh
node index.js
```

# Image Comparison

### Prerequisites

- Python 3.10.6

### Change Folder

```sh
cd image_comparison
```

### Create and Activate a Virtual Environment

```sh
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

### Install Dependencies

```sh
pip install -r requirements.txt
```

### Prepare Images
> Add base_image.jpg
> Fill the 'raw' folder with JPG images to compare

### Run the Project

```sh
python3 main.py
```

### Deactivate the Virtual Environment When Done

```sh
deactivate
```

This setup guide provides the necessary steps for both the Angular application and the image comparison script. Follow the instructions to ensure a seamless setup and execution of each component.