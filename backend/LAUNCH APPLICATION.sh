#! /bin/bash

kill $(lsof -t -i:"8080") || npx kill-port 8080

npm run start