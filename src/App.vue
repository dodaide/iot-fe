<template>
  <v-layout>
    <v-navigation-drawer mobile-breakpoint="sm" expand-on-hover rail>
      <v-list>
        <v-list-item
          prepend-avatar="./avatar.jpg"
          title="Trần Doãn Đô"
          subtitle="Xem chi tiết"
          link
          to="/profile"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list density="compact" nav>
        <v-list-item
          link
          to="/"
          prepend-icon="fa:fas fa-gauge"
          title="Bảng điều khiển"
        ></v-list-item>
        <v-list-item
          link
          to="/data-sensor"
          prepend-icon="fa:fas fa-database"
          title="Dữ liệu cảm biến"
        ></v-list-item>
        <v-list-item
          link
          to="/history-action"
          prepend-icon="fa:fas fa-clock-rotate-left"
          title="Lịch sử hoạt động"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="min-height: 100vh" class="bg-grey-lighten-4">
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>
