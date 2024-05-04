<template>
  <base-data-table-view
    :title="title"
    :headers="headers"
    :objectKey="objectKey"
  ></base-data-table-view>
</template>

<script>
import BaseDataTableView from './BaseDataTableView.vue'

export default {
  components: { BaseDataTableView },
  data() {
    return {
      title: 'Dữ liệu cảm biến',
      objectKey: 'dataSensor',
      headers: [
        {
          title: 'ID',
          align: 'start',
          key: 'id',
          sortable: false,
          searchValue: '',
          type: 'text'
        },
        {
          title: 'Thời gian đo',
          align: 'start',
          key: 'createdTime',
          searchValue: '',
          type: 'date',
          width: 200,
          sortable: true
        },
        {
          title: 'Nhiệt độ (°C)',
          key: 'temperature',
          align: 'end',
          searchValue: '',
          type: 'number',
          sortable: true
        },
        {
          title: 'Độ ẩm (%)',
          key: 'humidity',
          align: 'end',
          searchValue: '',
          type: 'number',
          sortable: true
        },
        {
          title: 'Ánh sáng (Lux)',
          key: 'brightness',
          align: 'end',
          searchValue: '',
          type: 'number',
          sortable: true
        }
      ]
    }
  }
}
</script>
