#!/bin/bash

# 本脚本的作用是
# 1. 上传web端到云服务器

# 请设置云服务器的IP地址和账户
# 例如 ubuntu@8.131.238.242
REMOTE=xie@192.168.0.187

# 上传云服务器
mv build husky-frontend
scp -r  ./husky-frontend/ $REMOTE:/home/xie
rm -rf husky-frontend