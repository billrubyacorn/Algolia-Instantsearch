#!/usr/bin/env bash

set -e # exit when error

(cd packages/react-instantsearch && yarn build)
