@echo off
title Central Connect - Reset Demo Data
echo.
echo  =============================================
echo   Central Connect - Reset du lieu demo
echo  =============================================
echo.

set MYSQL="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
set ARGS=-u root -p123456 --default-character-set=utf8mb4 CentralConnect

echo  Dang reset tai khoan demo-minh...
%MYSQL% %ARGS% -e "UPDATE users SET points=1240, updatedAt=NOW() WHERE uid='demo-minh';"
%MYSQL% %ARGS% -e "DELETE FROM checkins WHERE uid='demo-minh';"
%MYSQL% %ARGS% -e "DELETE FROM rsvps WHERE uid='demo-minh';"
%MYSQL% %ARGS% -e "DELETE FROM points_log WHERE uid='demo-minh';"

echo.
echo  Ket qua sau reset:
%MYSQL% %ARGS% -e "SELECT uid, displayName, points FROM users WHERE uid='demo-minh';"

echo.
echo  Xoa localStorage: Mo Chrome va bam F12, vao Console, chay lenh:
echo    localStorage.clear()
echo.
echo  =============================================
echo   Reset hoan tat! San sang chay demo.
echo  =============================================
echo.
pause
