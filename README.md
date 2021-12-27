# HAPPYŌ

## Download project

After the download is complete, move to the root of the project

### `cd happyo` or `cd {folder_with_project}/{name_progect}`

## Setup

### All commands and scripts should runs in root of the project

First you need to set the node_modules using the yarn command.

### `yarn` or `yarn install`

After you need to install the dependencies. This project uses CocaPods.

### `yarn pods`

The project is now installed and ready to run.

## Available Scripts

### `yarn ios`

// by default starts iPhone 11

### `yarn iphone6`

### `yarn iphonePlus`

Like `yarn start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

### `yarn android`

Like `yarn start`, but also attempts to open your app on a connected Android device or emulator.

### `yarn codepushDev`

For release new build with appcenter codepush

### `yarn fullReinstall`

This command runs in turn rm -rf node_modules ; yarn install ; yarn pods