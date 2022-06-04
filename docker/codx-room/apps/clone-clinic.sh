echo "entrypoint $GIT_REPO_PROJECT"
set -x
if [ -z "$GIT_REPO_PROJECT" ]; then
  exit 0
fi
DIR=$(echo $GIT_REPO_PROJECT | grep -o '[^/]*$')
if [ -d "$DIR" ]; then
  exit 0
fi
cd $CODX_HOME
if [ -z "$GIT_REPO_FOLDER" ]; then
  git clone --depth 1 --branch ${GIT_REPO_BRANCH:-main} $GIT_REPO_PROJECT
else 
  FOLDER=${GIT_REPO_FOLDER}
  mkdir $DIR
  cd $DIR
  git init
  git sparse-checkout init
  git sparse-checkout set $FOLDER
  git remote add remote ${GIT_REPO_PROJECT}.git
  git pull --depth 1 remote ${GIT_REPO_BRANCH:-main}
  cd $FOLDER
fi
[ -d ".home" ] && (cd .home && cp -r . $CODX_HOME)
chown -R codx $CODX_HOME
python $CODX_APPS/init-repo.py