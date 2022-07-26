# Uniswap Mobile

The home of the official Uniswap mobile app for iOS and Android!

## Development

### Setup

I (@judo) recommend setting up your M1 Mac without Rosetta: [link](https://medium.com/@davidjasonharding/developing-a-react-native-app-on-an-m1-mac-without-rosetta-29fcc7314d70).

#### React Native

Follow the general [React Native setup instructions](https://reactnative.dev/docs/environment-setup) but make sure to follow these steps before completing the instructions:

1. After installing Node: also install NVM to help you manage versions. Use the latest v14.x
2. Install yarn: `npm install --global yarn`
3. Before installing cocoapods: install RBEnv and use it to install Ruby v3 globally. When installing cocoapods, follow the non-sudo instructions.

#### Contract ABI types

Before the code will compile you need to generate types for the smart contracts the wallet interacts with. Run `yarn contracts:compile`. Re-run this if the ABIs or uniswap sdk libs are ever changed.

#### Cocoapods and Disabling Flipper Inclusion

We do not check in Flipper into source. To prevent `pod install` from adding Flipper, set an environment variable in your `.bash_profile` or `.zshrc`:

```
# To enable flipper inclusion (optional)
export USE_FLIPPER=1
```

We currently have CI exclude arm64 builds given it is not using the M1 architecture. Because of this we have a discrepancy between our pbxproj file in CI vs development when we run `pod install`. To avoid this please DON'T use the regular `pod install` command, instead always run: `yarn pod`.

- Run `chmod +x ./podinstall.sh` in the mobile folder

- Run `yarn` to install packages, then run `yarn pod` in the main directory.

**NOTE:** If you want to build and run the app on XCode, please run `pod install` as that would make XCode build for arm64 an speed up your build times on an M1 Mac

### Important Libraries

Get familiar with the following (no particular order):

- [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/): state management
- [redux-saga](https://redux-saga.js.org/) & [typed-redux-saga](https://github.com/agiledigital/typed-redux-saga): Redux side effect manager -- used for complex/stateful network calls
- [ethers](https://docs.ethers.io/v5/)
- [Shopify/restyle](https://github.com/Shopify/restyle): UI framework
- [React navigation](https://reactnavigation.org/): routing and navigation with animations and gestures
- [react-i18next](https://react.i18next.com/): i18n

#### Storybook

See [stories/README.md](https://github.com/Uniswap/mobile/tree/main/src/stories/README.md)

### Running

Start the mobile app by running `yarn ios` or `yarn android`. The JS bundler (metro) should automatically open in a new terminal window. If it does not, start it manually with `yarn start`.

You can also run the app from Xcode, which is necessary for any Swift related changes. Xcode will automatically start the metro bundler.

To run the app on device:

1. Ask to be added to the Apple Developer team and ensure that you have access to "Certificates, Identifiers & Profiles".
2. Then, add the Apple ID associated with your developer account in Xcode > Preferences > Accounts. You should see `Universal Navigation Inc.` as a Team.
3. In Xcode, navigate to `Signing & Capabilities` in project settings and select `Universal Navigation Inc.` as the team with `Automatically manage signing` checked. This should generate and download all necessary development signing certificates.

### Migrations

We use `redux-persist` to persist Redux state between user sessions. When the Redux state schema is altered, a migration may be needed to transfer the existing persisted state to the new Redux schema. Failing to define a migration results in the app defaulting to the persisted schema, which will very likely cause `undefined` errors because the code has references to Redux state properties that were dropped in favor the the persisted schema.

#### When to define a migration

Anytime a required property is added or any property is renamed or deleted to/from Redux state. Migrations are not necessary when optional properties are added to an existing slice. Make sure to always add new required properties to the `schema.ts` file as well.

#### How to migrate

1. Increment the `version` of `persistConfig` defined within `store.ts`
2. Create a migration function within `migrations.ts`. The migration key should be the same as the `version` defined in the previous step
3. Write a test for your migration within `migrations.test.ts`
4. Create a new schema within `schema.ts` and ensure it is being exported by the `getSchema` function at the bottom of the file

### Troubleshooting

- `unable to open file (in target "OneSignalNotificationServiceExtension" in project "Uniswap")`. Resolve this issue by navigating to the `ios/` directory and running `pod update`.

### I18n

Stubs for new i18n strings used throughout the app can be generated automatically. Use the string as you would normally (e.g. `t('id')`) and then run `yarn i18n:extract`.
If Typescript in VSCode is slow to see the change, you can restart the typescript server.

### E2E Tests

See [e2e/README.md](e2e/README.md)

## Deployment

A [Github workflow runs a Fastlane build and deploy](https://github.com/Uniswap/mobile/blob/main/.github/workflows/fastlane.yml) at 2AM UTC everyday from M-F.

Deploys can also be triggered by running the [`Fastlane deploy iOS` workflow manually](https://github.com/Uniswap/mobile/actions/workflows/fastlane.yml)

### GraphQL/Relay

If the server schema changes, run `yarn relay:schema` in order to update it.

If you want to write a new query, you should run `yarn relay:compile` in order to generate the TS type to import in your component
