@echo off
title Central Connect - Backend Server
echo.
echo  ==============================================
echo   Central Connect - Khoi dong Backend Server
echo  ==============================================
echo.
echo  API: http://localhost:3000/api/health
echo  Nhan Ctrl+C de dung server
echo.

"C:\tools\nodejs\node.exe" "%~dp0..\server\server.js"
pause
