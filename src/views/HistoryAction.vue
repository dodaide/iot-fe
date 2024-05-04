<template>
  <base-data-table-view :title="title" :headers="headers" :objectKey="objectKey">
  </base-data-table-view>
</template>


<script>
import BaseDataTableView from './BaseDataTableView.vue'

export default {
  components: { BaseDataTableView },
  data() {
    return {
      title: 'Lịch sử hoạt động',
      objectKey: 'historyAction',
      headers: [
        {
          title: 'ID',
          align: 'start',
          key: 'id',
          sortable: false,
          searchValue: '',
        },
        {
          title: 'Thời gian',
          align: 'start',
          key: 'createdTime',
          searchValue: '',
          type: 'date',
          width: 200,
          sortable: true,
        },
        { title: 'Tên thiết bị', key: 'deviceName', align: 'start', searchValue: '', sortable: true, },
        { title: 'Trạng thái', key: 'status', align: 'start', searchValue: '', sortable: true, }
      ]
    }
  }
}
</script>
