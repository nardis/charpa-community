var app = Vue.createApp({
  beforeCreate() {
    handleData(this);
  },

  data() {
    return {
      isMultiple: true,
      list: [],
      openedItem: null,
      openedIframeUrl: null
    }
  },

  computed: {
    fileIframeUrls() {
      if (! this.openedItem.hasOwnProperty('相關附件') || ! this.openedItem['相關附件']) {
        return [];
      }

      let urls = this.openedItem['相關附件'].split(','); // 將附件網址，轉為陣列
      let outputUrls = [];

      urls.forEach(url => {
        let fileId = url.split('?id=').pop(); // 取網址中的 id
        outputUrls.push(`https://drive.google.com/file/d/${fileId}/preview`);
      });

      return outputUrls;
    }
  },

  methods: {
    modalToggle(index) {
      this.openedItem = index !== undefined
                      ? this.list[index]
                      : {}; // 關閉 modal 時，將內容清空，防下次開啟時還存在捲軸捲動位置

      this.$nextTick(function() {
        // DOM 更新了
        document.body.classList.toggle('is-open-modal');
        document.getElementById('content-modal').classList.toggle('is-show');
      });
    },

    fileModalToggle(url) {
      this.openedIframeUrl = url !== undefined
                           ? url
                           : null;

      this.$nextTick(function() {
        // DOM 更新了
        document.getElementById('file-modal').classList.toggle('is-show');
      });
    }
  }
}).mount('#app');

function handleData(vm) {
  var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSjScVcwcaclP8-NP17-hoVKceVmKIcTT5dCqfF9ng0Fwyba5dr1HkfOS_lG8bbi-VE1f9DQILiIvCd/pub?gid=1363879105&single=true&output=csv';

  Papa.parse(url, {
    download: true,
    header: true,
    complete: function(result) {
      // let reduceData = result.data.reduce(function(accumulator, currentValue, currentIndex) {
      //   currentValue.isOpen = false; // 增加屬性
      //   accumulator.push(currentValue);
      //   return accumulator;
      // }, []);
      // vm.list = reduceData;

      let data = result.data.reverse(); // 倒轉 array，符合時間順序
      vm.list = data;
    }
  });
}