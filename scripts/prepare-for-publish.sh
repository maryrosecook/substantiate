#!/bin/bash

# clean dist directory
yarn clean

# check typescript
yarn tsc

# lint
yarn lint

# generate distribution JS file
yarn build
