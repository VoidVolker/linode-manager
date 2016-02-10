#!/bin/bash
echo
echo "=================================================="
echo "!!! WARNING !!! Script actions:"
echo "  1. Stop application"
echo "  2. Reset git repository"
echo "  3. Pull all data from server"
echo "  4. Start application"
echo "=================================================="
echo
echo "  Are you sure?"
echo
read -p "  (y/n): " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

forever stop linode-manager

git fetch origin master
git reset --hard FETCH_HEAD
git clean -df
git pull

pushd `dirname $0` > /dev/null
localPath=`pwd`
popd > /dev/null

export FOREVER_ROOT=/etc/forever
forever start ${localPath}/forever/linode-manager.json
