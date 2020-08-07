#!/bin/bash

BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

TARGET_DIR=$1
COMPONENT=$2

echo -e "${BLUE}│${NC} creating a new ${YELLOW}$COMPONENT${NC} component in ${YELLOW}$TARGET_DIR${NC}"

mkdir -p ./components/$TARGET_DIR
cp -r ./STARTER/ ./components/$TARGET_DIR/$COMPONENT

mv ./components/$TARGET_DIR/$COMPONENT/STARTER.config.yml ./components/$TARGET_DIR/$COMPONENT/$COMPONENT.config.yml
mv ./components/$TARGET_DIR/$COMPONENT/STARTER.js ./components/$TARGET_DIR/$COMPONENT/$COMPONENT.js
mv ./components/$TARGET_DIR/$COMPONENT/STARTER.hbs ./components/$TARGET_DIR/$COMPONENT/$COMPONENT.hbs
mv ./components/$TARGET_DIR/$COMPONENT/STARTER.scss ./components/$TARGET_DIR/$COMPONENT/$COMPONENT.scss

sed -i -e "s/STARTER/$COMPONENT/g" ./components/$TARGET_DIR/$COMPONENT/$COMPONENT.js
sed -i -e "s/STARTER/$COMPONENT/g" ./components/$TARGET_DIR/$COMPONENT/$COMPONENT.hbs
sed -i -e "s/STARTER/$COMPONENT/g" ./components/$TARGET_DIR/$COMPONENT/$COMPONENT.scss

rm ./components/$TARGET_DIR/$COMPONENT/*-e
