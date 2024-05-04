<template>
  <v-container fluid class="d-flex flex-column h-100">
    <div class="text-h5 mb-2">{{ title }}</div>
    <v-card id="table-container" style="flex: 1">
      <div class="d-flex align-center ma-2 mt-4 ga-2">
        <v-spacer></v-spacer>
        <div>
          <v-text-field
            v-model="startDate"
            @keydown.enter="searchTime"
            hide-details
            type="date"
            label="Ngày bắt đầu"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </div>
        -
        <div>
          <v-text-field
            v-model="endDate"
            @keydown.enter="searchTime"
            hide-details
            type="date"
            label="Ngày kết thúc"
            density="compact"
            variant="outlined"
          ></v-text-field>
        </div>
        <v-btn icon="fa:fas fa-search" color="primary" @click="searchTime" variant="plain"></v-btn>
      </div>
      <v-data-table-server
        fixed-header
        :height="tableHeight"
        hover
        items-per-page-text="Số bản ghi trên trang"
        loading-text="Đang tải"
        :items-per-page-options="[20, 50, 100]"
        v-model:page="pageNumber"
        v-model:items-per-page="itemsPerPage"
        :sort-by="sorter"
        :headers="headers"
        :items-length="totalItems"
        :items="serverItems"
        :loading="loading"
        @update:options="loadItems"
      >
        <template v-slot:item.createdTime="{ item }">
          {{ formatDate(item.createdTime) }}
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 0 ? 'red' : 'green'" label>
            {{ item.status === 0 ? 'Tắt' : 'Bật' }}
          </v-chip>
        </template>
        <template v-slot:headers="{ isSorted, getSortIcon, toggleSort }">
          <tr class="bg-white">
            <template v-for="column, index in headers" :key="column.key">
              <th>
                <div @click="() => column.sortable && toggleSort(column)">
                  <span class="mr-2 cursor-pointer" style="user-select: none">{{
                    column.title
                  }}</span>
                  <template v-if="isSorted(column)">
                    <v-icon :icon="getSortIcon(column)"></v-icon>
                  </template>
                </div>
                <div v-if="column.searchable != false" class="d-flex align-center">
                  <v-text-field
                    v-model="column.searchValue"
                    @focus="resetAllTextSearch(index)"
                    :type="column.type"
                    hide-details
                    class="mt-2"
                    density="compact"
                    @keydown.enter="searchValue(column.key, column.searchValue)"
                  >
                    <template v-slot:append-inner>
                      <v-icon
                        class="cursor-pointer"
                        size="16"
                        @click="searchValue(column.key, column.searchValue)"
                        icon="fa:fas fa-search"
                      ></v-icon>
                    </template>
                  </v-text-field>
                </div>
              </th>
            </template>
          </tr>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
import { formatDate, UperFirstChar } from '../utils/helper.js'
import { HubConnectionBuilder } from '@microsoft/signalr'

export default {
  props: ['headers', 'title', 'objectKey'],
  data: () => ({
    connection: null,
    pageNumber: 1,
    itemsPerPage: 20,
    sorter: [
      {
        key: null,
        order: null
      }
    ],
    searcher: {
      searchKey: null,
      searchValue: null
    },
    tableHeight: 0,
    startDate: "",
    endDate: "",
    serverItems: [],
    loading: true,
    totalItems: 0
  }),
  unmounted() {
    this.stopConnection()
  },
  watch: {
    startDate(newValue) {
      this.startDate = this.handleMaxDate(newValue) || newValue
    },
    endDate(newValue) {
      this.endDate = this.handleMaxDate(newValue) || newValue
    }
  },
  methods: {
    updateRealTimeData() {
      this.connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_SERVER_ADD}${this.objectKey}`)
        .build()

      this.tableHeight = document.getElementById('table-container').offsetHeight - 132
      this.connection.start().then(() => console.log('Ok'))
      this.connection.on(this.objectKey, (data) => {
        this.serverItems.pop()
        this.serverItems.unshift(data)
        this.totalItems++
      })
    },
    stopConnection() {
      if (this.connection) {
        console.log('Stp', this.connection)
        this.connection.off(this.objectKey)
        this.connection.stop()
        this.connection = null
      }
    },
    handleMaxDate(newValue) {
      let date = null
      if (newValue) {
        const tempDate = new Date(newValue)
        if (tempDate.getFullYear() > 9999) {
          tempDate.setFullYear(9999)
          const year = tempDate.getFullYear()
          const month = String(tempDate.getMonth() + 1).padStart(2, '0') // Lấy tháng (phải thêm 1 vì tháng bắt đầu từ 0)
          const day = String(tempDate.getDate()).padStart(2, '0') // Lấy ngày

          // Tạo chuỗi dạng 'yyyy-mm-dd'
          const formattedDate = year + '-' + month + '-' + day
          date = formattedDate
        }
        return date
      }
    },
    resetAllTextSearch(index) {
      this.headers.forEach((column, index2) => {
        if(index !== index2)
          column.searchValue = ''
      })
    },
    searchValue(key, value) {
      this.searcher.searchKey = key
      this.searcher.searchValue = value
      this.loadItems({
        page: this.pageNumber,
        itemsPerPage: this.itemsPerPage,
        sortBy: this.sorter
      })
    },
    searchTime() {
      this.loadItems({
        page: this.pageNumber,
        itemsPerPage: this.itemsPerPage,
        sortBy: this.sorter
      })
    },
    async loadItems({ page, itemsPerPage, sortBy }) {
      this.loading = true
      try {
        const data = await axios.get(`${import.meta.env.VITE_IOT_API}${this.objectKey}`, {
          params: {
            page: page,
            pageSize: itemsPerPage,
            sortField: UperFirstChar(sortBy[0]?.key) || 'CreatedTime',
            startDate: this.startDate,
            endDate: this.endDate,
            searchKey: UperFirstChar(this.searcher.searchKey),
            searchValue: this.searcher.searchValue,
            isASC: sortBy[0]?.order === 'asc' ? true : false
          }
        })
        this.serverItems = data.data[this.objectKey]
        this.totalItems = data.data.amount

        if (!sortBy[0]?.key && !this.searcher.searchValue && page === 1 && this.startDate === "" && this.endDate === "") {
          this.updateRealTimeData()
        } else {
          this.stopConnection()
        }
        this.loading = false
      } catch (error) {
        console.error(error)
      }
    },
    formatDate
  }
}
</script>
