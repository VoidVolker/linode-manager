#!/bin/sh

pushd `dirname $0` > /dev/null
localPath=`pwd`
popd > /dev/null

export FOREVER_ROOT=/etc/forever
forever start ${localPath}/forever/linode-manager.json
