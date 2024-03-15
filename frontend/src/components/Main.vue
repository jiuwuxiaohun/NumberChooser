
<template>

  <div>
    <dialog id="my_modal_add_col" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">输入列数据,一行一条</h3>
        <p class="py-4">
          <textarea class="textarea  textarea-bordered" placeholder="Bio"></textarea>
        </p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-sm btn-primary">确定添加</button>
            <button class="btn btn-sm mr-2">关闭</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>

  <div class="p-10 flex flex-row flex-nowrap justify-start items-start gap-2 overflow-x-scroll ">

    <div class="card" v-for="col in 10">
      <button class="btn btn-xs btn-warning">删除此列</button>
      <div class="card" v-for="i in 100">
        {{i}}
      </div>
    </div>
    <div class="card" >
      <button class="btn btn-xs btn-warning">删除此列</button>
      <div class="card text-xl" >
        <div class="flex justify-start items-center gap-1">
          <span>458625</span>
          <span class="badge badge-sm badge-secondary">7</span>
        </div>
      </div>
    </div>

    <div class="card">
      <button onclick="my_modal_add_col.showModal()" class="btn btn-xs btn-primary">新增一列</button>
    </div>

  </div>
</template>

<script setup>
import {reactive} from 'vue'
import {Greet} from '../../wailsjs/go/main/App'

const data = reactive({
  name: "",
  resultText: "Please enter your name below 👇",
})

function greet() {
  Greet(data.name).then(result => {
    data.resultText = result
  })
}

</script>

<style scoped>
.result {
  height: 20px;
  line-height: 20px;
  margin: 1.5rem auto;
}

.input-box .btn {
  width: 60px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  border: none;
  margin: 0 0 0 20px;
  padding: 0 8px;
  cursor: pointer;
}

.input-box .btn:hover {
  background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
  color: #333333;
}

.input-box .input {
  border: none;
  border-radius: 3px;
  outline: none;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  background-color: rgba(240, 240, 240, 1);
  -webkit-font-smoothing: antialiased;
}

.input-box .input:hover {
  border: none;
  background-color: rgba(255, 255, 255, 1);
}

.input-box .input:focus {
  border: none;
  background-color: rgba(255, 255, 255, 1);
}
</style>
