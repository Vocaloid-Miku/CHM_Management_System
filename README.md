# CHM-Management-System
<br>
这是一个全栈数据库中草药管理系统，前端基于 Vue3 框架，通过 axios 接口向后端传输数据，后端通过 nodejs 的 express 包搭建本地服务器联接 mysql 数据库，通过 windows 脚本调用 nodejs 语句运行服务器。本项目页面小清新风，简洁美观。
<br>
This is a full-stack Chinese herbal medicine database management system. The front end is built on the Vue 3 framework and transmits data to the back end through Axios interfaces. The back end uses Node.js with the Express package to set up a local server connected to a MySQL database, and a Windows script is used to call Node.js commands to run the server. The project features a fresh, clean and aesthetically pleasing page design.
<br>
本项目没有使用docker进行环境部署，如果要运行本项目请自行配置 nodejs 环境，将项目根目录下的 chm_management.sql 导入MYSQL数据库，点击项目根目录下的 start-server.bat即可在本地服务器端口8080运行本项目
<br>
This project does not use Docker for environment deployment. To run this project, please configure the Node.js environment by yourself, import the chm_management.sql file located in the project root directory into the MySQL database, and then double-click the start-server.bat file in the project root directory to run the project on the local server at port 8080.