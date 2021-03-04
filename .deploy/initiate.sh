#!/bin/bash
set -e

# use to reference other scripts in the same directory as this one
my_dir=`dirname $0`

# load environment variables: SERVER
. $my_dir/.env

### Configuration ###
APP_DIR=/var/www/matchsquares
KEYFILE=
REMOTE_SCRIPT_PATH=/tmp/deploy-matchsquares.sh


### Library ###

function run()
{
  echo "Running: $@"
  "$@"
}

### Automation steps ###

if [[ "$KEYFILE" != "" ]]; then
  KEYARG="-i $KEYFILE"
else
  KEYARG=
fi

run meteor build --server-only ../output
mv ../output/*.tar.gz ./package.tar.gz

run scp $KEYARG package.tar.gz $SERVER:$APP_DIR/
run scp $KEYARG .deploy/work.sh $SERVER:$REMOTE_SCRIPT_PATH
echo
echo "---- Running deployment script on remote server ----"
run ssh $KEYARG $SERVER bash $REMOTE_SCRIPT_PATH
