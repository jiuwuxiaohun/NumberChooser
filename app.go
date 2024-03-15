package main

import (
	"context"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

const CONFIG_PATH = "config.json"

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	// 初始化运行目录
	err := os.Chdir(GetCurrPath())
	if err != nil {
		panic(err)
	}
	a.ctx = ctx

	runtime.EventsOn(a.ctx, "Config:save", a.ConfigSave)
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// ConfigSave saves the config
func (a *App) ConfigSave(data ...interface{}) {
	// 参数校验
	if len(data) == 0 {
		return
	}
	// SaveAsFileFromAny(data, "data.json")
	// 获取第一个参数
	SaveAsFileFromAny(data[0], CONFIG_PATH)
}

// ConfigInit 初始化配置文件
func (a *App) ConfigInit() (interface{}, error) {
	var config []map[string]interface{}
	// 如果配置文件不存在，则创建一个默认配置文件
	if _, err := os.Stat(CONFIG_PATH); os.IsNotExist(err) {
		// 默认配置
		config = []map[string]interface{}{}
		SaveAsFileFromAny(config, CONFIG_PATH)
		return config, nil
	}
	// 读取配置文件
	err := ReadFromFile(&config, CONFIG_PATH)
	if err != nil {
		return nil, err
	}
	return config, nil
}
