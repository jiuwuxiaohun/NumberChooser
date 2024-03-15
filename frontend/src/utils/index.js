import { v4 as uuidv4 } from 'uuid';

export const generateUUID = () => {
    return uuidv4();
}

// 获取当前时间
export const getCurrentTime = () => {
    return new Date().getTime();
}

// 获取当前时间格式化成YYYY-MM-DD HH:MM:SS
/**
 * 
 * @param {'day' | 'time'} ignore 忽略天数
 * @returns 
 */
export const getCurrentTimeStr = (ignore) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (ignore === "day") {
        return `${year}-${month}`;
    }

    const day = date.getDate();
    if (ignore === "time") {
        return `${year}-${month}-${day}`;
    }

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/**
 * 解析并格式化日期字符串。
 * @param {string} dateString - 日期字符串，例如 "2024-3-15 20:10:50"
 * @param {Intl.DateTimeFormatOptions} options - 格式化选项 { year: 'numeric', month: 'long', day: 'numeric' }
 * @returns {string} 格式化的日期字符串
 */
export function parseAndFormatDate(dateString, options) {
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('zh-CN', options).format(date);
    } catch (error) {
        // 
    }
}