# OSOP App

**Our Simple Open Poll (OSOP)** is an open source web application for conducting polls and surveys with a special focus on data minimization and user privacy. It does not collect personal data, does not set tracking cookies, and does not outsource the service to third-party solutions, but runs entirely on your own server.

- [osop-api](https://github.com/DROSL/openpoll-api)
- [osop-frontend](https://github.com/DROSL/openpoll-api)

## Install

1. Clone the repository:

```sh
git clone https://github.com/DROSL/openpoll-frontend
```

2. Install required modules:

```sh
npm install
```

## Build

Build the app for production to the `build/` folder with:

```sh
npm run build
```

## Run

Run the app in development mode with:

```sh
npm start
```

## License

Please see the [license](/LICENSE).

## Contributing

Before you commit, run:

```sh
npx prettier --write .
```