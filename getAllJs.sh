#!/bin/bash

BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}│${NC} getAllJs started"

mkdir -p tmp/js/

find ./components -name '*.js' | while read line; do
  echo -ne "${BLUE}│${NC} path: "
  echo $line
  FILE=$(echo $line | awk -F/ '{print $NF}') ;
  echo -ne "${BLUE}│${NC} file: "
  echo $FILE

  npx browserify $line -t babelify -o tmp/js/$FILE
done

mkdir -p public/js/components
mv tmp/js/* public/js/components

echo -e "${BLUE}│${NC} getAllJs ended"
