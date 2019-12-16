#!/bin/sh
DATE=`date '+%Y%m%d%H%M'`
DIR=$DATE
mv /www/release/deploy /www/release/${DIR}
ln -fns /www/release/${DIR} /www/entry-value
rm -rf /www/release/${DIR}/storage/logs
ln -fns /www/tmp_files/storage/logs /www/release/${DIR}/storage
