
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
  <!-- 弹窗 | 删除code -->
  <dialog id="my_modal_del_code" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">确定全局删除此Code - <span style="color: red;">{{ delCode }}</span> ？</h3>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-sm btn-error mr-2" @click="delSomeCodeOk">确定删除</button>
          <button class="btn btn-sm" @click="delSomeCodeCancel">关闭</button>
        </form>
      </div>
    </div>
  </dialog>

  <div class="content p-5 flex flex-row flex-nowrap justify-start items-start gap-2">
    <div class="overflow-x-auto flex-1 overflow-y-auto h-full">
      <table class="table table-xs table-pin-rows h-full">
        <thead>
          <tr>
            <th>#</th>
            <th class="font-bold text-sm" v-for="col in dataStore.appData">
              <div class="flex items-center gap-1">
                <span>{{ col.title }}</span>
                <!--删除按钮-->
                <button class="btn btn-xs btn-error btn-circle" @click="delCol(col.id)">
                  <svg t="1710522152275" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4285" width="21" height="21">
                    <path d="M67.661 517.598a447.654 455.375 0 1 0 895.308 0 447.654 455.375 0 1 0-895.308 0Z" fill="transparent" p-id="4286"></path>
                    <path d="M683.858 350.83H335.13c-4.4 0-8-3.6-8-8v-24.345c0-4.4 3.6-8 8-8h348.729c4.4 0 8 3.6 8 8v24.345c-0.001 4.4-3.601 8-8.001 8zM657.18 383.79h-34.698c0.033 0.515 0.056 1.034 0.056 1.557v267.779c0 33.728-27.596 61.324-61.324 61.324H457.909c-34.023 0-61.859-27.837-61.859-61.859V385.347c0-0.524 0.023-1.042 0.056-1.557H361.81c-6.6 0-12 5.4-12 12v360.012c0 6.6 5.4 12 12 12h295.37c6.6 0 12-5.4 12-12V395.79c0-6.6-5.4-12-12-12z" fill="#FFFFFF" p-id="4287"></path><path d="M511.333 251.135m-43.846 0a43.846 43.846 0 1 0 87.692 0 43.846 43.846 0 1 0-87.692 0Z" fill="#FFFFFF" p-id="4288"></path></svg>
                </button>
              </div>
            </th>
          </tr>
        </thead> 
        <tbody>
          <tr v-for="rowIndex in dataStore.maxItemCount">
            <th>{{ rowIndex }}</th>
            <td class="text-right pr-5" v-for="colIndex in dataStore.columnCount">
              <span>
                {{ ((tempa = dataStore.appDataWithCountSorted[colIndex-1].items) && tempa.length && (tempb = tempa[rowIndex-1])) ? (tempc = tempb.code) : (tempc = "") }}
              </span>
              <span v-if="tempc && colIndex !== 1 && tempb.count" class="badge badge-sm badge-secondary ml-2">{{ tempb.count }}</span>
            </td>
          </tr>
        </tbody> 
        <tfoot>
          <tr>
            <th></th>
            <th v-for="col in dataStore.appData">{{ col.title }}</th>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="card min-w-44">
      <button :onClick="addNewCol" class="btn btn-xs btn-primary text-nowrap">新增一列</button>

      <div class="dropdown dropdown-bottom dropdown-end mt-2">
        <label class="input input-bordered input-xs flex items-center gap-2 mb-2 w-full">
          <input type="text" class="grow" placeholder="搜索删除" v-model="searchCodeValue" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
        </label>
        <div v-if="searchCodeValue!=''" style="max-height: calc(100vh - 200px);overflow: auto;" class="w-full">
          <p class="border border-solid rounded-lg w-full px-2" v-for="(item, index) in codeSet" :class="{
              'mt-1' : index !== 0,
            }" @click="delSomeCode(item)">
            <a class="w-full truncate block" :title="item">{{ item }}</a>
          </p>
        </div>
      </div>

      <!--<div class="dropdown dropdown-bottom dropdown-end">-->
      <!--  <button class="btn btn-xs btn-error text-nowrap mt-2">全局删除code</button>-->
      <!--  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36">-->
      <!--    <label class="input input-bordered input-xs flex items-center gap-2 mb-2 w-full">-->
      <!--        <input type="text" class="grow" placeholder="Search" v-model="searchCodeValue" />-->
      <!--        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>-->
      <!--    </label>-->
      <!--    <div style="max-height: calc(100vh - 200px);overflow: auto;" class="w-full">-->
      <!--      <li class="border border-solid rounded-lg w-full" v-for="(item, index) in codeSet" :class="{-->
      <!--        'mt-1' : index !== 0,-->
      <!--      }" @click="delSomeCode(item)"><a class="w-full truncate block" :title="item">{{ item }}</a></li>-->
      <!--    </div>-->
      <!--  </ul>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script setup>
import { useDataStore } from "../store";
import { getCurrentTimeStr, generateUUID, parseAndFormatDate } from "../utils";
import { onMounted, reactive, ref, computed, nextTick } from "vue";
import { EventsEmit } from "../../wailsjs/runtime";
import { ConfigInit, ConfigSave } from "../../wailsjs/go/main/App";

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
const addNewColOk = async () => {
  dataStore.addColumn({ ...newCol });
  await ConfigSave(dataStore.appData);
};
// #endregion

// #region 删除列
const delColId = ref("");
const delCol = (id) => {
  my_modal_del_col.showModal()
  delColId.value = id;
};
const delColOk = async () => {
  dataStore.delColumnById(delColId.value);
  delColId.value = "";

  await ConfigSave(dataStore.appData);
};
// #endregion

const hiddenTime = ref(true);
const newColTitleOld = ref("");
const hiddenTimeToggle = () => {
  if (hiddenTime.value) {
    newColTitleOld.value = newCol.title;
    const newString = parseAndFormatDate(newColTitleOld.value, { year: 'numeric', month: 'long', day: 'numeric' });
    console.log(newString);
    if (!newString) return;

    newCol.title = newString.replace('年', '-').replace('月', '-').replace('日', '');
  }
};
const setCurrTime = () => {
  newCol.title = hiddenTime.value ? getCurrentTimeStr() : getCurrentTimeStr('time');
};

const searchCodeValue = ref("");
const codeSet = computed(() => {
  // dataStore.codeSet 根据搜索条件进行过滤
  const result = new Set(Array.from(dataStore.codeSet).filter((code) => code.includes(searchCodeValue.value)));
  return result;
});
const delCode = ref("");
const delSomeCode = (code) => {
  my_modal_del_code.showModal();
  delCode.value = code;
};
const delSomeCodeOk = async (code) => {
  dataStore.delSomeCode(delCode.value);
  delCode.value = "";

  await ConfigSave(dataStore.appData);
};
const delSomeCodeCancel = () => {
  delCode.value = "";
};

onMounted(async() => {
  try {
    const config = await ConfigInit();
    if (config && config.length > 0) {
      console.log("获取到本地配置文件", config);
      dataStore.setAppData(config);
    }
  } catch (error) {
    // 获取配置文件有错误 需要处理
    console.log(error);
  }
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

.overflow-x-auto.flex-1.overflow-y-auto.h-full::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
</style>
