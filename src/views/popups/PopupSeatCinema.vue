<template>
  <div class="seatroom-manage">
    <div class="seatroom-header">
      <div class="seatroom-header-left">
        <i class="fas fa-long-arrow-alt-left" @click="closePopup()"></i>
        <div class="content">{{ $t("Back") }}</div>
      </div>
      <div class="seatroom-header-center">
        <div class="content-main">
          {{ $t("Screeningsofthemovie") }} {{ nameMovie }}
        </div>
      </div>
    </div>
    <div class="template-time-code-main">
      <el-scrollbar>
        <div class="scrollbar-flex-content">
          <div
            class="template-time-card"
            v-for="item in dataTemplateTime"
            :key="item"
            :class="
              isSelectingRoomCinema(item.roomCinemaID) ? ' selecting' : ''
            "
            @click="openTemplateSeat(item.roomCinemaID)"
          >
            <div class="time-item">{{ convertTimeFormat(item.time) }}</div>
            <div class="room-item">{{ item.roomCode }}</div>
            <div class="date-item">{{ convertDateFormat(item.postDate) }}</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="seatroom-main" v-if="isOpenTemplateSeat">
      <div class="screen-select-seat">
        <div class="seat-container">
          <div class="seat-row" v-for="item in maxRow" :key="item">
            <div
              class="seat-col"
              :class="[
                !getSeat(item, itemCol) ? 'selected' : '',
                isSelecting(item, itemCol) ? 'selecting' : '',
                getType(item, itemCol),
              ]"
              v-for="itemCol in maxCol"
              :key="itemCol"
              @click="pushSelectingSeat(item, itemCol)"
            >
              {{ convertLetter(item) + itemCol }}
            </div>
          </div>
        </div>
      </div>
      <div class="description-seat">
        <div class="note">{{ $t("Note") }}</div>
        <div class="seat-selected">
          <div class="color-selected"></div>
          <div class="content-selected">{{ $t("SeatSold") }}</div>
        </div>
        <div class="seat-unselected">
          <div class="color-unselected"></div>
          <div class="content-unselected">{{ $t("Normalseat") }}</div>
        </div>
        <div class="seat-unselected">
          <div class="color-vip"></div>
          <div class="content-unselected">{{ $t("VIPseat") }}</div>
        </div>
        <div class="seat-unselected">
          <div class="color-unuse"></div>
          <div class="content-unselected">{{ $t("Maintenance") }}</div>
        </div>
        <div class="seat-selecting">
          <div class="color-selecting"></div>
          <div class="content-selecting">{{ $t("SeatSelecting") }}</div>
        </div>
      </div>

      <div class="description-total">
        <div class="note">{{ $t("Statistic") }}</div>
        <div class="total-seat">
          {{ $t("TotalSeat") }}: <span class="bold"> {{ totalSeat }} </span>
        </div>
        <div class="seat-unselected">
          {{ $t("SeatSold") }}: <span class="bold">{{ totalSelected }}</span>
        </div>
        <div class="seat-unselected">
          {{ $t("SeatSelecting") }}:
          <span class="bold">{{ totalSelecting }}</span>
        </div>
        <div class="seat-unselected">
          {{ $t("Maintenance") }}:
          <span class="bold">{{ totalMaintenance }}</span>
        </div>
        <div class="seat-selecting">
          {{ $t("VIPseat") }}: <span class="bold">{{ totalVIP }}</span>
        </div>
        <div class="seat-selecting">
          {{ $t("Normalseat") }}: <span class="bold">{{ totalNormal }}</span>
        </div>
      </div>

      <div class="checkout-total">
        <div class="note">{{ $t("Payment") }}</div>
        <div class="seat-selecting">
          {{ $t("TotalAmount") }}:
          <span class="bold">{{
            formatNumber(totalAmountSelected) + " VNĐ"
          }}</span>
        </div>
      </div>
    </div>
    <div class="seatroom-footer">
      <div class="footer-left">
        <base-button
          :classButton="'button-red'"
          :titleButton="$t('Deleteroom')"
          @bindEvent="deleteCinemaRoomVirtual()"
          v-if="$store.state.role == 'admin' && roomCinmeIDSelected"
        ></base-button>
      </div>
      <div class="footer-right">
        <base-button
          :classButton="'button-white'"
          :titleButton="$t('Cancel')"
          @bindEvent="closePopup()"
        ></base-button>
        <div class="ml-2"></div>

        <el-button
          type="primary"
          @click="SaveState(2)"
          :disabled="!seatsSelecting.length"
        >
          {{ $t("Checkout") }}
        </el-button>

        <div class="ml-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import jwt from "jsonwebtoken";

import { listSeat, convertLetter } from "@/constants/constantsdefaults";
import BaseButton from "@/views/components/BaseButton.vue";
import {
  convertDateFormat,
  convertTimeFormat,
  formatNumber,
} from "@/common/commonFunc";
import router from "@/router/index";

export default {
  name: "PopupSeatRoomManage",
  setup() {
    return {
      listSeat,
      convertLetter,
      convertDateFormat,
      convertTimeFormat,
      formatNumber,
    };
  },
  components: { BaseButton },
  created() {
    let me = this;
    localStorage.removeItem("checkout");
    this.$store.state.isShowLoading = true;
    this.$api
      .post("/Movie/GetListRoomCinemaByMovieID", {
        movieID: me.idMovie,
        postDate: null,
      })
      .then((data) => {
        me.dataTemplateTime = data;
      });

    this.$api.get("/Account/GetListCustomer").then((data) => {
      me.dataCustomer = data;
      me.dataCustomerTemp = data;
      me.$store.state.isShowLoading = false;
    });
    this.loadDataTicket();
    this.loadDataAccount();
  },
  watch: {
    roomCinmeIDSelected(newVal) {
      this.normalCost = this.templateDataTicket.find(
        (x) => (x.movieID = newVal && x.type == 1)
      ).cost;
      this.vipCost = this.templateDataTicket.find(
        (x) => (x.movieID = newVal && x.type == 2)
      ).cost;
    },
  },
  props: {
    idMovie: {
      type: String,
      required: true,
    },
    nameMovie: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      normalCost: 0,
      vipCost: 0,
      dataSeat: [],
      isShowDialogBooking: false,
      seatsSelecting: [],
      maxRow: 0,
      maxCol: 0,
      roomCinmeIDSelected: "",
      dataTemplateTime: [],
      isOpenTemplateSeat: false,
      totalSeat: 0,
      totalSelected: 0,
      totalSelecting: 0,
      totalMaintenance: 0,
      totalVIP: 0,
      totalNormal: 0,
      dataCustomer: [],
      dataCustomerTemp: [],
      accountSelected: "",
      roomCodePrint: "",
      templateDataTicket: [],
      totalAmountSelected: 0,
    };
  },
  methods: {

    filterSearch() {
      if (search) {
        this.dataCustomerTemp = this.dataCustomerTemp.filter(
          (x) =>
            x.phoneNumber.includes(search) ||
            x.name.toLowerCase().includes(search.toLowerCase())
        );
      } else {
        this.dataCustomerTemp = JSON.parse(JSON.stringify(this.dataCustomer));
      }
    },

    filterMethod(query) {
      query = query.toLowerCase();
      this.dataCustomerTemp = this.dataCustomer.filter(
        (x) =>
          x.phoneNumber.includes(query) || x.name.toLowerCase().includes(query)
      );
      // return option.data.phoneNumber.indexOf(query) > -1;
    },
    openTemplateSeat(id) {
      this.isOpenTemplateSeat = false;
      this.seatsSelecting = [];
      this.roomCinmeIDSelected = id;
      this.loadDataSeat(id);
    },

    loadDataTicket() {
      let me = this;
      this.$store.state.isShowLoading = true;

      this.$api.post("/Ticket/GetListTemplateTicket",{}).then((data) => {
        me.templateDataTicket = data;
        this.$store.state.isShowLoading = false;
      });
    },

    loadDataSeat(id) {
      let me = this;
      this.$store.state.isShowLoading = true;
      this.$api
        .post("/Movie/GetListSeatCinemaRoom", {
          roomCinemaID: id,
        })
        .then((data) => {
          me.$store.state.isShowLoading = false;

          me.dataSeat = data;
          this.getLastRowCol(me.dataSeat);
          me.isOpenTemplateSeat = true;
          me.totalSeat = 0;
          me.totalSelected = 0;
          me.totalSelecting = 0;
          me.totalMaintenance = 0;
          me.totalVIP = 0;
          me.totalAmountSelected = 0;
          me.totalNormal = 0;
          me.seatsSelecting = [];
          me.dataSeat.forEach((item) => {
            if (item.type != 4) {
              me.totalSeat++;
            }

            if (item.type == 3) {
              me.totalMaintenance++;
            }

            if (item.type == 2) {
              me.totalVIP++;
            }

            if (item.type == 1) {
              me.totalNormal++;
            }

            if (item.status == 0) {
              me.totalSelected++;
            }
          });
        });
    },

    getType(row, col) {
      let status = this.dataSeat.find(
        (seat) => seat.rowSeat === row && seat.colSeat === col
      ).type;

      if (status == 1) {
        return "normal";
      } else if (status == 2) {
        return "vip";
      } else if (status == 3) {
        return "unuse";
      } else {
        return "none";
      }
    },

    getLastRowCol(dataSeat) {
      const lastSeat = dataSeat[dataSeat.length - 1]; // Lấy ghế cuối cùng trong danh sách
      this.maxRow = lastSeat.rowSeat; // Số hàng lớn nhất
      this.maxCol = lastSeat.colSeat; // Số cột lớn nhất
    },

    getSeat(row, col) {
      return this.dataSeat.find(
        (seat) => seat.rowSeat === row && seat.colSeat === col
      ).status;
    },

    pushSelectingSeat(row, col) {
      if (this.getType(row, col) == "unuse") {
        this.$store.dispatch("showToast", "Ghế đang bảo trì");
      }

      let typeSeat = this.dataSeat.find(
        (seat) => seat.rowSeat === row && seat.colSeat === col
      ).type;

      if (this.getSeat(row, col) && this.getType(row, col) != "unuse") {
        if (
          this.seatsSelecting.find((x) => x.rowSeat == row && x.colSeat == col)
        ) {
          this.seatsSelecting = this.seatsSelecting.filter(
            (item) => item.rowSeat !== row || item.colSeat !== col
          );
          this.totalAmountSelected -=
            typeSeat == 1 ? this.normalCost : this.vipCost;
        } else {
          this.seatsSelecting.push({
            rowSeat: row,
            colSeat: col,
            roomCinemaID: this.roomCinmeIDSelected,
            Type: typeSeat,
            SeatName: convertLetter(row) + col,
          });
          this.totalAmountSelected +=
            typeSeat == 1 ? this.normalCost : this.vipCost;
        }
      }

      this.totalSelecting = this.seatsSelecting.length;
    },

    isSelecting(row, col) {
      return this.seatsSelecting.find(
        (x) => x.rowSeat == row && x.colSeat == col
      );
    },

    loadDataAccount(){
      let me = this;
      let token = localStorage.getItem("token");
      let accountName = jwt.decode(token).name;
      this.$api.post("/Account/GetAccountByAccountName",{accountName: accountName}).then(data=>{
        me.customerName = data.name;
        me.phoneNumber = data.phoneNumber;
      })
    },

    SaveState(id) {
      let me = this;
      let cusName = "";
      let phoneNum = "";
      let templateTimeCode = "";
      let tempTime = "";
      let postDate = null;
      let roomCode = "";
      if (this.dataCustomer && me.accountSelected) {
        cusName = this.dataCustomer.find(
          (x) => x.accountID == me.accountSelected
        ).name;
        phoneNum = this.dataCustomer.find(
          (x) => x.accountID == me.accountSelected
        ).phoneNumber;
      }

      if (this.dataTemplateTime) {
        templateTimeCode = this.dataTemplateTime.find(
          (x) => x.roomCinemaID == me.roomCinmeIDSelected
        ).templateTimeCode;
        tempTime = this.dataTemplateTime.find(
          (x) => x.roomCinemaID == me.roomCinmeIDSelected
        ).time;
        postDate = this.dataTemplateTime.find(
          (x) => x.roomCinemaID == me.roomCinmeIDSelected
        ).postDate;
        roomCode = this.dataTemplateTime.find(
          (x) => x.roomCinemaID == me.roomCinmeIDSelected
        ).roomCode;
        this.roomCodePrint = roomCode;
      }

      if (id == 2) {
        this.$store.state.dataCheckout.history = {
          movieID: me.idMovie,
          roomCinemaID: me.roomCinmeIDSelected,
          customerName: me.customerName,
          phoneNumber: me.phoneNumber,
          templateTimeCode: templateTimeCode,
          time: tempTime,
          movieName: me.nameMovie,
          showDate: postDate,
          dataTicket: JSON.stringify(me.seatsSelecting),
          createdBy: me.$store.state.accountName,
          roomCode: roomCode,
        };

        this.$store.state.dataCheckout.seat = me.seatsSelecting;
        this.$store.state.dataCheckout.ticket = {
          normalCost: this.normalCost,
          vipCost: this.vipCost,
          totalAmount: this.totalAmountSelected,
        };

        localStorage.setItem(
          "checkout",
          JSON.stringify(this.$store.state.dataCheckout)
        );
        router.push("./create-payment");
        this.$store.state.isOpenPopupSeat = false;
      } 
    },

    closePopup() {
      this.$store.state.isOpenPopupSeat = false;
    },

    isSelectingRoomCinema(id) {
      if (this.roomCinmeIDSelected == id) {
        return true;
      } else {
        return false;
      }
    },

    deleteCinemaRoomVirtual() {
      let me = this;
      me.$store.state.isShowLoading = true;
      this.$api
        .post("/CinemaRoom/DeleteCinemaRoomVirtual", {
          roomCinemaID: me.roomCinmeIDSelected,
        })
        .then((data) => {
          if (data) {
            me.$store.dispatch("showToast", this.$t("Deleteroomsuccessfully"));
            me.$store.state.isOpenPopupSeat = false;
          } else {
            me.$store.dispatch("showToast", this.$t("Roomdeletionfailed"));
          }
          me.$store.state.isShowLoading = false;
        });
    },
  },
};
</script>
<style lang="scss">
.seatroom-manage {
  .scrollbar-flex-content {
    display: flex;
  }
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 9999;
  .seatroom-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: #ddefff;
    .seatroom-header-left {
      display: flex;
      font-weight: 600;
      font-size: 18px;
      i {
        display: flex;
        align-items: center;
        transform: scale(1.5);
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }

      .content {
        margin-left: 20px;
      }
    }
    .seatroom-header-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: #111;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .template-time-code-main {
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
    justify-content: center;
    .template-time-card {
      &.selecting {
        background: rgb(195 137 137);
        color: #fff;
        font-weight: 900;
        border-color: #fff;
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
          rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
        transform: scale(1.1) !important;
      }
      margin: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
      &:hover {
        opacity: 0.7;
        transform: scale(1.05);
      }
    }
  }

  .seatroom-main {
    height: calc(100vh - 240px);
    overflow: auto;
    padding: 20px 200px;
    .screen-select-seat {
      .seat-container {
        .seat-row {
          display: flex;
          justify-content: center;
          .seat-col {
            height: 50px;
            width: 50px;
            background: #cb0c9f;

            color: #fff;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
              rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
            font-weight: 600;
            cursor: pointer;
            &.selected {
              background: #cb0c9f !important;
              opacity: 0.2;
              cursor: no-drop;
            }

            &.selecting {
              background: red;
            }

            &.vip {
              background: #17c1e8;
            }

            &.unuse {
              background: rgb(202, 202, 202);
            }

            &.selecting {
              background: red;
            }

            &.none {
              opacity: 0;
              pointer-events: none !important;
            }

            -webkit-user-select: none;
            user-select: none;
          }
        }
      }
    }

    .description-seat {
      -webkit-user-select: none;
      user-select: none;
      position: absolute;
      left: 20px;
      top: 40%;
      transform: translateY(-50%);
      font-size: 12px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      padding: 10px;
      border-radius: 4px;
      .note {
        font-size: 14px;
        color: #111;
        text-align: center;
        margin-bottom: 10px;
      }

      .seat-selected,
      .seat-unselected,
      .seat-selecting {
        display: flex;
        padding-bottom: 10px;
      }

      .color-selected,
      .color-unuse,
      .color-vip,
      .color-unselected,
      .color-selecting {
        height: 20px;
        width: 20px;
        margin-right: 10px;
        border-radius: 4px;
        &:hover {
          transform: scale(1.5);
        }
      }

      .color-selected {
        background: #cb0c9f !important;
        opacity: 0.2;
      }

      .color-unselected {
        background: #cb0c9f;
      }

      .color-selecting {
        background: red;
      }

      .color-unuse {
        background: rgb(202, 202, 202);
      }

      .color-vip {
        background: #17c1e8;
      }
    }

    .description-total {
      -webkit-user-select: none;
      user-select: none;
      position: absolute;
      left: 20px;
      top: 65%;
      transform: translateY(-50%);
      font-size: 12px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      padding: 10px;
      border-radius: 4px;
      .note {
        font-size: 14px;
        color: #111;
        text-align: center;
        margin-bottom: 10px;
      }
      .bold {
        font-weight: 600;
        color: #111;
      }
    }

    .checkout-total {
      -webkit-user-select: none;
      user-select: none;
      position: absolute;
      left: 20px;
      top: 80%;
      width: 180px;
      transform: translateY(-50%);
      font-size: 12px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      padding: 10px;
      border-radius: 4px;
      .note {
        font-size: 14px;
        color: #111;
        text-align: center;
        margin-bottom: 10px;
      }
      .bold {
        font-weight: 600;
        color: #111;
      }
    }

    .user-select {
      -webkit-user-select: none;
      user-select: none;
      position: absolute;
      right: 20px;
      top: 29%;

      font-size: 12px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      padding: 10px;
      border-radius: 4px;
      width: 200px;
      .note {
        font-size: 14px;
        color: #111;
        text-align: center;
        margin-bottom: 10px;
      }
    }
  }

  .seatroom-footer {
    display: flex;
    justify-content: space-between;
    .footer-left {
      margin-left: 10px;
    }

    .footer-right {
      display: flex;
      .el-button--primary {
        height: 36px;
      }

      .el-button {
        font-weight: 600;
      }
    }
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    height: 60px;
    .ml-2 {
      margin-left: 10px;
    }
    align-items: center;
    background: #ddefff;
  }

  .button-none {
    pointer-events: none;
    opacity: 0.5;
  }
}
</style>
