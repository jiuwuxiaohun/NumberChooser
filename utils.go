package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// SaveAsFileFromAny 将 interface{} 类型的数据保存到文件
func SaveAsFileFromAny(data interface{}, filename string) error {
	jsonData, err := json.MarshalIndent(data, "", "    ")
	if err != nil {
		log.Fatalf("JSON marshaling failed: %s", err)
	}

	err = os.WriteFile(filename, jsonData, 0644)
	if err != nil {
		log.Fatalf("Failed to write to file: %s", err)
	}

	return nil
}

// GetCurrPath 获取程序运行路径
func GetCurrPath() string {
	f, _ := exec.LookPath(os.Args[0])
	path, _ := filepath.Abs(f)
	index := strings.LastIndex(path, string(os.PathSeparator))
	ret := path[:index]
	return ret
}

// WriteToFile ...
func WriteToFile(content string, filepath string, overwrite bool) error {
	if !overwrite {
		// 文件存在则返回错误
		if _, err := os.Stat(filepath); err == nil {
			return fmt.Errorf("该文件存在于此路径（你可以选择覆盖写入该文件）: %q", filepath)
		}
	}
	err := os.WriteFile(filepath, []byte(content), 0644)
	if err != nil {
		return fmt.Errorf("写入文件失败: %v", err)
	}
	return nil
}

// ReadFromFile 从文件中读取数据
func ReadFromFile(data interface{}, filename string) error {
	file, err := os.ReadFile(filename)
	if err != nil {
		return err
	}
	err = json.Unmarshal(file, data)
	if err != nil {
		return err
	}
	return nil
}
