@echo off
title E-Auction Frontend
cd /d "%~dp0eauction-frontend"
echo ========================================
echo    Starting E-Auction Frontend
echo ========================================
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting Vite development server...
echo.
call npm run dev
pause
