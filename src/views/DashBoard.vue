<template>
  <div class="d-flex flex-column h-100">
    <div style="flex: 1; display: flex">
      <v-container fluid class="d-flex">
        <v-row>
          <v-col cols="4">
            <v-card class="h-100 d-flex flex-column">
              <v-card-item title="Nhiệt độ"> </v-card-item>
              <v-card-text class="d-flex">
                <v-row align="center" no-gutters>
                  <v-col class="text-h6 text-grey-darken-2" cols="6">
                    {{ temperature }}&deg;C
                  </v-col>

                  <v-col cols="6" class="text-right">
                    <v-icon
                      :color="renderColor(temperature, temperatureColors)"
                      icon="fa:fas fa-temperature-three-quarters"
                      size="28"
                    ></v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="h-100 d-flex flex-column">
              <v-card-item title="Độ ẩm"> </v-card-item>

              <v-card-text class="d-flex">
                <v-row align="center" no-gutters>
                  <v-col class="text-h6 text-grey-darken-2" cols="6"> {{ humidity }}% </v-col>

                  <v-col cols="6" class="text-right">
                    <v-icon
                      :color="renderColor(humidity, humidityColors)"
                      icon="fa:fas fa-droplet"
                      size="28"
                    ></v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card class="h-100 d-flex flex-column">
              <v-card-item title="Ánh sáng"> </v-card-item>

              <v-card-text class="d-flex">
                <v-row align="center" no-gutters>
                  <v-col class="text-h6 text-grey-darken-2" cols="6"> {{ brightness }} lux </v-col>

                  <v-col cols="6" class="text-right">
                    <v-icon
                      :color="renderColor(brightness, brightnessColors)"
                      icon="fa:fas fa-sun"
                      size="28"
                    ></v-icon>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div style="flex: 4; display: flex">
      <v-container fluid class="d-flex">
        <v-row>
          <v-col cols="8">
            <v-card class="h-100">
              <MainChart :updateDataSensor="updateDataSensor" />
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-row class="h-100" style="height: calc(100% + 24px) !important">
              <v-col cols="12">
                <v-card class="h-100 text-center d-flex flex-column">
                  <v-card-item>
                    <v-card-title> Bóng đèn </v-card-title>
                  </v-card-item>
                  <v-card-text class="d-flex align-center justify-center">
                    <v-icon
                      :color="isLoadTurnBulb ? 'warning' : isTurnBulb ? 'primary' : 'grey'"
                      icon="fa:fas fa-lightbulb"
                      size="60"
                    ></v-icon>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-switch
                      hide-details
                      :loading="isLoadTurnBulb ? 'warning' : false"
                      @change="toggleDevice('bulb')"
                      color="primary"
                      v-model="isTurnBulb"
                    ></v-switch>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card class="h-100 text-center d-flex flex-column">
                  <v-card-item>
                    <v-card-title> Quạt </v-card-title>
                  </v-card-item>
                  <v-card-text class="d-flex align-center justify-center">
                    <v-icon
                      v-if="isTurnFan && !isLoadTurnFan"
                      class="fan fan-spin"
                      color="primary"
                      icon="fa:fas fa-fan"
                      size="60"
                    ></v-icon>
                    <v-icon
                      v-else-if="!isTurnFan && !isLoadTurnFan"
                      class="fan"
                      color="grey"
                      icon="fa:fas fa-fan"
                      size="60"
                    ></v-icon>
                    <v-icon
                      v-else
                      color="warning"
                      class="fan"
                      icon="fa:fas fa-fan"
                      size="60"
                    ></v-icon>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-switch
                      hide-details
                      :loading="isLoadTurnFan ? 'warning' : false"
                      @change="toggleDevice('fan')"
                      color="primary"
                      v-model="isTurnFan"
                    ></v-switch>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import MainChart from '../components/MainChart.vue'
import { HubConnectionBuilder } from '@microsoft/signalr'

const connection = new HubConnectionBuilder()
  .withUrl(`${import.meta.env.VITE_SERVER_ADD}historyAction`)
  .build()

export default {
  name: 'DashBoard',
  data() {
    return {
      temperature: 100,
      humidity: 30,
      brightness: 60000,
      isTurnBulb: false,
      isLoadTurnBulb: false,
      isTurnFan: false,
      isLoadTurnFan: false,
      temperatureColors: [
        {
          threshold: 0,
          color: 'yellow-lighten-3'
        },
        {
          threshold: 10,
          color: 'yellow'
        },
        {
          threshold: 20,
          color: 'amber'
        },
        {
          threshold: 30,
          color: 'orange'
        },
        {
          threshold: Infinity,
          color: 'red'
        }
      ],
      humidityColors: [
        {
          threshold: 0,
          color: 'blue-lighten-5'
        },
        {
          threshold: 20,
          color: 'blue-lighten-4'
        },
        {
          threshold: 40,
          color: 'blue-lighten-3'
        },
        {
          threshold: 60,
          color: 'blue-lighten-2'
        },
        {
          threshold: 80,
          color: 'blue-lighten-1'
        },
        {
          threshold: Infinity,
          color: 'blue-darken-1'
        }
      ],
      brightnessColors: [
        {
          threshold: 32000,
          color: 'amber-lighten-5'
        },
        {
          threshold: 64000,
          color: 'amber-lighten-3'
        },
        {
          threshold: 100000,
          color: 'amber'
        },
        {
          threshold: Infinity,
          color: 'deep-orange'
        },
        {
          threshold: Infinity,
          color: 'red'
        }
      ]
    }
  },
  async created() {
    try {
      const apiUrl = `${import.meta.env.VITE_IOT_API}historyaction/devices-status`
      const data = await axios.get(apiUrl)
      this.isTurnBulb = !!data.data[0].status
      this.isTurnFan = !!data.data[1].status
      
      connection.start().then(() => console.log('Ok'))
      connection.on('historyAction', (data) => {
        if (data.deviceName === 'Đèn') {
          this.isTurnBulb = !!data.status
        } else if (data.deviceName === 'Quạt') {
          this.isTurnFan = !!data.status
        }
        this.isLoadTurnBulb = false
        this.isLoadTurnFan = false
      })
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    async toggleDevice(device) {
      try {
        if (device === 'bulb') {
          this.isLoadTurnBulb = true
        } else {
          this.isLoadTurnFan = true
        }
        const action =
          device === 'bulb'
            ? {
                deviceID: '3304dddb-1b72-607f-25c2-579daad24557',
                status: this.isTurnBulb ? 1 : 0
              }
            : {
                deviceID: '57cdf8c4-47e3-5560-7e41-c1ec321fe728',
                status: this.isTurnFan ? 1 : 0
              }

        await axios.post(`${import.meta.env.VITE_IOT_API}HistoryAction/turn-devices`, action)
      } catch (error) {
        console.error(error)
      }
    },
    updateDataSensor(data) {
      this.temperature = data.temperature
      this.humidity = data.humidity
      this.brightness = data.brightness
    },
    renderColor(data, options) {
      for (let i = 0; i < options.length; i++) {
        if (data <= options[i].threshold) {
          return options[i].color
        }
      }
      return options[0].color
    }
  },
  components: {
    MainChart
  }
}
</script>

<style>
.fan-spin {
  animation: spin 1s linear infinite;
}
.fan::before {
  display: block;
  transform: scaleX(-1);
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
