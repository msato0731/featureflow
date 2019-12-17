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
mv /www/release/deploy $RELEASE_DIR
ln -nsf $RELEASE_DIR $BASE_DIR/$DOC_ROOT
echo "test"