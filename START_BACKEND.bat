@echo off
title E-Auction Backend
cd /d "%~dp0eauction-backend"
echo ========================================
echo    Starting E-Auction Backend
echo ========================================
echo.
echo Backend will start on: http://localhost:8080
echo.
mvnd org.springframework.boot:spring-boot-maven-plugin:run "-Dspring-boot.run.arguments=--jwt.secret=change-me-in-production-please-123456 --jwt.expiration-ms=86400000"
pause
