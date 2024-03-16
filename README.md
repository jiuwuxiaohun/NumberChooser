# 数字选号器


## About

`wails.json`
https://wails.io/docs/reference/project-config

## Live Development
`wails dev`

## Building

`wails build`.

## 编译mac版本
`
wails build -platform darwin/universal
`
## 编译Windows版本
`
wails build -platform windows -ldflags="-H windowsgui" -o ./NumberChooser_win.exe
wails build -platform windows/amd64 -ldflags="-H windowsgui" -o ./NumberChooser_amd64.exe
wails build -platform windows/arm64 -ldflags="-H windowsgui" -o ./NumberChooser_arm64.exe
wails build --clean --platform windows/amd64
`