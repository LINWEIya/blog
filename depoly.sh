###
 # @Author: LinWei
 # @since: 2020-03-09 15:57:03
 # @lastTime: 2020-03-09 20:37:45
 # @LastEditors: LinWei
 # @Description: 
 ###
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'depoly update'

git config user.name LINWEIya
git config user.email 874942954@qq.com

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:wangtunan/blog.git master:gh-pages
# git push -f https://github.com/wangtunan/blog.git master:gh-pages
git push -f  git@github.com:linweiya/blog.git master:gh-pages

cd -