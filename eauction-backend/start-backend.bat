@echo off
cd /d "%~dp0"
echo Starting E-Auction Backend...
echo.
java "-Djwt.secret=change-me-in-production-please-123456" "-Djwt.expiration-ms=86400000" -jar target\eauction-backend-0.0.1-SNAPSHOT.jar
pause
