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
}
 */
export const useDataStore = defineStore("appData", () => {
    const appData = ref([]);

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


    return {
        appData,
        addColumn,
        delColumnById,
        columnCount,
        maxItemCount,
        codeSet,
        countCodeBefore,
    };
}, {
    persist: true
});