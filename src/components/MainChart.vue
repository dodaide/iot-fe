<template>
  <Line v-if="!isLoad" :data="chartData" :options="options" />
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import axios from 'axios'
import { format } from 'date-fns'
import { HubConnectionBuilder } from '@microsoft/signalr'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_SERVER_ADD}dataSensor`)
      .build()

export default {
  name: 'MainChart',
  props: ["updateDataSensor"],
  components: {
    Line
  },
  data() {
    return {
      isLoad: true,
      data: {
        labels: [],
        datasets: [
          {
            label: 'Nhiệt độ',
            data: [],
            borderColor: '#F44336',
            backgroundColor: '#B71C1C',
            yAxisID: 'y'
          },
          {
            label: 'Độ ẩm',
            data: [],
            borderColor: '#2196F3',
            backgroundColor: '#0D47A1',
            yAxisID: 'y1'
          },
          {
            label: 'Ánh sáng',
            data: [],
            borderColor: '#FFC107',
            backgroundColor: '#FF6F00',
            yAxisID: 'y2'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: 'Biểu đồ'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              callback: (value) => `${value}°C`
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              callback: (value) => `${value}%`
            }
          },
          y2: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              callback: (value) => `${value} lux`
            }
          }
        }
      }
    }
  },
  async created() {
    try {
      const apiUrl = `${import.meta.env.VITE_IOT_API}datasensor`
      const data = await axios.get(apiUrl, {
        params: {
          page: 1,
          pageSize: 12,
          sortField: 'CreatedTime',
          isASC: false
        }
      })
      let lastData = {}
      data.data.dataSensor.forEach((item) => {
        this.data.labels.push(format(item.createdTime, 'HH:mm:ss'))
        this.data.datasets[0].data = [...this.data.datasets[0].data, item.temperature]
        this.data.datasets[1].data = [...this.data.datasets[1].data, item.humidity]
        this.data.datasets[2].data = [...this.data.datasets[2].data, item.brightness]
        lastData = item
      })
      this.updateDataSensor(lastData)
      this.isLoad = false
    } catch (error) {
      console.error(error)
    }
  },
  mounted() {
    connection.start().then(() => console.log('Ok'))
    connection.on('dataSensor', (data) => {
      this.data.labels.shift()
      this.data.datasets[0].data = this.data.datasets[0].data.slice(1)
      this.data.datasets[1].data = this.data.datasets[1].data.slice(1)
      this.data.datasets[2].data = this.data.datasets[2].data.slice(1)
      this.data.labels.push(format(data.createdTime, 'HH:mm:ss'))
      this.data.datasets[0].data = [...this.data.datasets[0].data, data.temperature.toFixed(1)]
      this.data.datasets[1].data = [...this.data.datasets[1].data, data.humidity.toFixed(1)]
      this.data.datasets[2].data = [...this.data.datasets[2].data, data.brightness.toFixed(1)]
      this.updateDataSensor(data)
      const dataString = JSON.stringify(this.data)
      this.data = JSON.parse(dataString)
    })
  },
  unmounted() {
    connection.stop()
  },
  computed: {
    chartData() {
      return {
        labels: this.data.labels,
        datasets: this.data.datasets
      }
    }
  }
}
</script>
