import { defineStore } from "pinia";
import { ref, computed } from "vue";
/**
interface Column {
    id: number;
    title: string;
    items: ColumnItem[];
}
interface ColumnItem {
    key: number;
    code: string;
    count?: number;
}
 */
export const useDataStore = defineStore("appData", () => {
    const appData = ref([]);

    const setAppData = (data) => {
        appData.value = data;
    }

    const addColumn = (col) => {
        appData.value.push(col);
    }

    const delColumnById = (id) => {
        appData.value = appData.value.filter((col) => col.id !== id);
    }

    // appData数据的条数 | table列数
    const columnCount = computed(() => appData.value.length);
    // appData的items最大长度 | table行数
    const maxItemCount = computed(() => {
        return appData.value.reduce((prev, cur) => {
            return Math.max(prev, cur.items.length);
        }, 0);
    });

    // 记录appData的items中的code的集合 | 不重复
    const codeSet = computed(() => {
        const set = new Set();
        appData.value.forEach((col) => {
            col.items.forEach((item) => {
                set.add(item.code);
            });
        });
        return set;
    });

    // 统计某一个索引之前的code的数量
    const countCodeBefore = (colIndex, code) => {
        // 溢出检查 | 小于0的记为0 大于等于列数的列数
        colIndex = Math.min(Math.max(0, colIndex), appData.value.length);
        
        let count = 0;
        for (let i = 0; i < colIndex; i++) {
            appData.value[i].items.forEach((item) => {
                if (item.code === code) {
                    count++;
                }
            });
        }
        return count;
    }

    // appData的items中的code的数量 | 附加到appData的items中
    const appDataWithCount = computed(() => {
        return appData.value.map((col, colIndex) => {
            return {
                ...col,
                items: col.items.map((item) => {
                    return {
                        ...item,
                        count: countCodeBefore(colIndex, item.code)
                    }
                })
            }
        });
    });

    // appDataWithCount的items按照count排序
    const appDataWithCountSorted = computed(() => {
        return appDataWithCount.value.map((col) => {
            return {
                ...col,
                items: col.items.sort((a, b) => {
                    return b.count - a.count;
                })
            }
        });
    });

    // delSomeCode 全局删除某个code
    const delSomeCode = (code) => {
        appData.value.forEach((col) => {
            col.items = col.items.filter((item) => item.code !== code);
        });
    }


    return {
        appData,
        setAppData,
        addColumn,
        delColumnById,
        columnCount,
        maxItemCount,
        codeSet,
        countCodeBefore,
        delSomeCode,
        appDataWithCount,
        appDataWithCountSorted,
    };
}, {
    persist: false
});