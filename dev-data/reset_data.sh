#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
mongo localhost:27017/bizfoos "$DIR/"reset-dev-env-data.js
