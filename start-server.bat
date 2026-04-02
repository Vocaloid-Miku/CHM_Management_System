@echo off
echo 正在启动中药管理系统服务器...
echo.

REM 启动服务器（后台运行）
start /b node .\server.js

REM 等待服务器启动
echo 正在启动服务器，请稍候...
timeout /t 3 /nobreak >nul

REM 自动打开浏览器
start http://localhost:8080

echo 服务器已启动，运行在 http://localhost:8080
echo 浏览器已自动打开

echo 按任意键停止服务器
pause

REM 停止服务器
taskkill /f /im node.exe >nul 2>&1
echo 服务器已停止