@echo off
echo.
echo [info] TwelveT UI is run
echo.

%~d0
cd %~dp0

cd ..
yarn start

pause