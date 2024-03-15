
<template>
  <!-- 弹窗 | 添加列 -->
  <dialog id="my_modal_add_col" class="modal">
    <div class="modal-box overflow-y-hidden flex flex-col">
      <h3 class="font-bold text-lg flex flex-col items-center gap-3">
        <input type="text" placeholder="标题" id="add_col_title_input" v-model="newCol.title" class="input input-bordered input-sm w-full max-w-xs text-center" />
        <div class="flex items-center text-sm gap-1 cursor-pointer">
          <label for="time_toggle">隐藏精确时间</label>
          <input type="checkbox" id="time_toggle" class="toggle toggle-xs" v-model="hiddenTime" checked @click="hiddenTimeToggle" />
          <button class="btn btn-sm ml-4" @click="setCurrTime">填入当前时间</button>
        </div>
      </h3>
      <div class="py-4 overflow-y-auto">
        <textarea rows="100" class="textarea textarea-bordered w-full" v-model="CodeString" placeholder="输入列数据,一行一条"></textarea>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-sm btn-primary mr-2" @click="addNewColOk">确定添加</button>
          <button class="btn btn-sm">关闭</button>
        </form>
      </div>
    </div>
  </dialog>
  <!-- 弹窗 | 删除列 -->
  <dialog id="my_modal_del_col" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">确定删除此列？</h3>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-sm btn-error mr-2" @click="delColOk">确定删除</button>
          <button class="btn btn-sm">关闭</button>
        </form>
      </div>
    </div>
  </dialog>

  <div class="content p-5 flex flex-row flex-nowrap justify-start items-start gap-2">
    <div class="overflow-x-auto overflow-y-auto h-full">
      <table class="table table-xs table-pin-rows table-pin-cols h-full">
        <thead>
          <tr>
            <th>#</th>
            <th class="font-bold text-sm" v-for="col in dataStore.appData" @click="delCol(col.id)">{{ col.title }}</th>
          </tr>
        </thead> 
        <tbody>
          <tr v-for="rowIndex in dataStore.maxItemCount">
            <th>{{ rowIndex }}</th>
            <td class="text-right pr-5" v-for="colIndex in dataStore.columnCount">
              <span>
                {{ (dataStore.appData[colIndex-1].items && dataStore.appData[colIndex-1].items.length && dataStore.appData[colIndex-1].items[rowIndex-1]) ? (temp = dataStore.appData[colIndex-1].items[rowIndex-1].code) : (temp = "") }}
              </span>
              <span v-if="temp" class="badge badge-sm badge-secondary ml-2">{{ dataStore.countCodeBefore(colIndex-1, temp) }}</span>
            </td>
          </tr>
        </tbody> 
        <tfoot>
          <tr>
            <th></th>
            <th v-for="col in dataStore.appData" @click="delCol(col.id)">{{ col.title }}</th>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="card">
      <button :onClick="addNewCol" class="btn btn-xs btn-primary text-nowrap">新增一列</button>
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "../store";
import { getCurrentTimeStr, generateUUID, parseAndFormatDate } from "../utils";
import { onMounted, reactive, ref, computed, nextTick } from "vue";

const dataStore = useDataStore();

// #region 列相关数据
const newCol = reactive({
  id: "",
  title: "",
  items: [],
});
const initNewCol = () => {
  newCol.id = generateUUID();
  newCol.title = getCurrentTimeStr();
  newCol.items = [];
};
// 将newCol-items中的code拼接成字符串，并且实现双向绑定
// TODO: 优化set方法,需要对输入的字符串进行校验,并且可能会有多种输入的格式,目前规则为一行一条
const CodeString = computed({
  get: () => {
    return extractCodes(newCol.items);
  },
  set: (val) => {
    const lines = val.split("\n");
    // 去除空行
    const newItems = lines.filter((line) => line.trim() !== "");
    newCol.items = newItems.map((code) => ({ key: generateUUID(), code }));
  },
});
function extractCodes(items) {
    return items.map(item => item.code).join('\n');
}
// #endregion

// #region 添加列
const addNewCol = () => {
  initNewCol();
  my_modal_add_col.showModal()
};
const addNewColOk = () => {
  dataStore.addColumn({ ...newCol });
};
// #endregion

// #region 删除列
const delColId = ref("");
const delCol = (id) => {
  my_modal_del_col.showModal()
  delColId.value = id;
};
const delColOk = () => {
  dataStore.delColumnById(delColId.value);
  delColId.value = "";
};
// #endregion

const hiddenTime = ref(true);
const newColTitleOld = ref("");
const hiddenTimeToggle = () => {
  nextTick(() => {
    console.log(hiddenTime.value);
    if (hiddenTime.value) {
      newColTitleOld.value = newCol.title;
      const newString = parseAndFormatDate(newColTitleOld.value, { year: 'numeric', month: 'long', day: 'numeric' });
      console.log(newString);
      if (!newString) return;

      newCol.title = newString.replace('年', '-').replace('月', '-').replace('日', '');
    }
  })
};
const setCurrTime = () => {
  newCol.title = hiddenTime.value ? getCurrentTimeStr() : getCurrentTimeStr('time');
};

onMounted(() => {
  console.log(dataStore.countCodeBefore(11, "你好"));
});


</script>

<style lang="less">
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

// 美化滚动条
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

::-webkit-scrollbar-track {
  width: 3px;
  background: rgba(#101F1C, 0.1);
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(144,147,153,.5);
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
  transition: background-color .3s;
  cursor: pointer;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144,147,153,.3);
}

</style>

<style scoped lang="less">
.content {
  height: 100%;
  width: 100%;
  // overflow: auto;

  .card {
    max-width: 135px;
  }
  
  .content-header {
    display: flex;
    gap: 5px;
  }
  
  .content-main {
    display: flex;
    gap: 5px;
  }
}
</style>
