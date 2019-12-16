#!/bin/bash
# ===================
#             変数設定
# ===================
RELEASE_DATE=`date '+%Y%m%d%H%M%s'`
BASE_DIR="/www"
RELEASE_DIR="$BASE_DIR/release/$RELEASE_DATE"
TMP_DIR=$BASE_DIR/tmp_files
DOC_ROOT="levtech_career_test"
#SLACK_DEPLOY_STG_API=
# =======================
#        デプロイスクリプト
# =======================
set -eux
mv /www/release/deploy /www/release/$RELEASE_DATE
# 環境に合わせてシムリンク張る
ln -nsf $RELEASE_DIR/app/Config/env.php.stg2 $RELEASE_DIR/app/Config/env.php
ln -nsf $TMP_DIR/app/tmp $RELEASE_DIR/app/tmp
# テンポラリファイルのシムリンク
rm -rf $RELEASE_DIR/app/View/Themed/Front/Pc/Xml
rm -rf $RELEASE_DIR/app/webroot/files
ln -nsf $TMP_DIR/app/View/Themed/Front/Pc/Xml $RELEASE_DIR/app/View/Themed/Front/Pc/Xml
ln -nsf $TMP_DIR/app/webroot/files $RELEASE_DIR/app/webroot/files
chmod 666 $RELEASE_DIR/app/Config/configs_additional.php
# ゴミ削除
cd $BASE_DIR/release
`ls -rt $BASE_DIR/release/ | head -n -5 | xargs rm -rf`
# composer install
cd $RELEASE_DIR
#composer install
ln -nsf $RELEASE_DIR $BASE_DIR/$DOC_ROOT
# キャッシュファイル削除
rm -f $TMP_DIR/app/tmp/cache/assets/css/pc/*
rm -f $TMP_DIR/app/tmp/cache/assets/css/sp/*
rm -f $TMP_DIR/app/tmp/cache/assets/js/pc/*
rm -f $TMP_DIR/app/tmp/cache/assets/js/sp/*
rm -f $TMP_DIR/app/tmp/cache/persistent/*
rm -f $TMP_DIR/app/tmp/cache/models/*
rm -f $TMP_DIR/app/tmp/cache/views/*
rm -f $TMP_DIR/app/tmp/smarty/compile/*
rm -f $TMP_DIR/app/tmp/smarty/cache/*
# Tdkh、パン屑のキャッシュ作成
$RELEASE_DIR/app/Console/cake BreadcrumbCacheUpdate
$RELEASE_DIR/app/Console/cake TdkhCacheUpdate
# Slackでリリース通知
#if [ $? -ne 0 ]; then
# curl -X POST -H 'Content-type: application/json' --data '{"text":"stg2-ltc release Failed !!"}' $SLACK_DEPLOY_STG_API
#else
# curl -X POST -H 'Content-type: application/json' --data '{"text":"stg2-ltc release done !"}' $SLACK_DEPLOY_STG_API
#fi
