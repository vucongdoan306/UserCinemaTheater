<template>
  <div class="vnpay-checkout">
    <div class="checkout-header">
      <div class="header-left">
        <div class="header-title">THANH TOÁN</div>
      </div>
      <div class="header-right">
        <img :src="vnpayImage" alt="logo vnpay" class="logo-vnpay" />
      </div>
    </div>
    <div class="checkout-main">
      <div class="checkout-main-container">
        <div class="info-container">
          <div class="info-customer">
            <div class="movie-name">
              {{ $t("MovieNamel") }}: {{ dataCheckout.history.movieName }}
            </div>
            <div class="customer-name">
              {{ $t("CustomerName") }}: {{ dataCheckout.history.customerName }}
            </div>
            <div class="room-code">
              {{ $t("Room") }}: {{ dataCheckout.history.roomCode }}
            </div>
            <div class="phone-number">
              {{ $t("PhoneNumber") }}: {{ dataCheckout.history.phoneNumber }}
            </div>
            <div class="phone-number">
              {{ $t("nShowDate") }}:
              {{ convertDateFormat(dataCheckout.history.showDate) }}
            </div>
            <div class="time-show">
              {{ $t("Timeframe") }}: {{ dataCheckout.history.time }}
            </div>
          </div>
          <div class="info-ticket">
            <table class="table-checkout">
              <thead>
                <tr>
                  <th>{{ $t("SeatCode") }}</th>
                  <th>{{ $t("SeatType") }}</th>
                  <th>{{ $t("Cost") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in dataCheckout.seat" :key="item">
                  <td>{{ item.SeatName }}</td>
                  <td>{{ item.Type == 1 ? $t("Normal") : "VIP" }}</td>
                  <td>
                    {{
                      item.Type == 1
                        ? formatNumber(dataCheckout.ticket.normalCost) + " VNĐ"
                        : formatNumber(dataCheckout.ticket.vipCost) + " VNĐ"
                    }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>{{ $t("TotalAmount") }}</td>
                  <td colspan="2">
                    {{ formatNumber(dataCheckout.ticket.totalAmount) + " VNĐ" }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div class="payment-container">
        <div class="payment-title">{{ $t("Selectapaymentmethod") }}</div>
        <div class="payment-chose">
          <el-radio-group v-model="bankCode">
            <el-radio label="VNPAYQR" size="large" border>
              <div class="d-flex align-items-center justify-content-between">
                <div class="qr-code vnpay-radio">
                  Ứng dụng thanh toán hỗ trợ
                  <span class="vnpay-logo b">
                    <span class="vnpay-red">VN</span
                    ><span class="vnpay-blue">PAY</span>
                    <sup class="vnpay-red">QR</sup>
                  </span>
                </div>
                <div class="qr-code-img">
                  <img :src="vnpayqrcode" alt="" />
                </div>
              </div>
            </el-radio>
            <el-radio label="VNBANK" size="large" border>
              <div class="d-flex align-items-center justify-content-between">
                <div class="qr-code vnpay-radio">
                  {{ $t("Domesticcardandbankaccount") }}
                </div>
                <div class="qr-code-img">
                  <img :src="atmvnpay" alt="" />
                </div>
              </div>
            </el-radio>
            <el-radio label="INTCARD" size="large" border>
              <div class="d-flex align-items-center justify-content-between">
                <div class="qr-code vnpay-radio">
                  {{ $t("Internationalpaymentcards") }}
                </div>
                <div class="qr-code-img">
                  <img :src="creditcard" alt="" />
                </div>
              </div>
            </el-radio>
            <el-radio label="" size="large" border>
              <div class="d-flex align-items-center justify-content-between">
                <div class="qr-code vnpay-radio">
                  {{ $t("Electronicwallet") }}
                  <span class="vnpay-logo b">
                    <span class="vnpay-red">VN</span
                    ><span class="vnpay-blue">PAY</span>
                    <sup class="vnpay-red">QR</sup>
                  </span>
                </div>
                <div class="qr-code-img">
                  <img :src="vivnpay" alt="" />
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="payment-footer">
          <el-button type="primary" :icon="Money" @click="checkoutVnpay()">{{
            $t("Checkout")
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="checkout-footer">
      <div class="footer-left"></div>
      <div class="footer-right">
        <el-button type="primary" :icon="Back" @click="rollbackHome">{{
          $t("Homepage")
        }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
const body = document.getElementsByTagName("body")[0];
import router from "@/router/index";
import vnpayImage from "@/assets/img/Logo-VNPAY-QR.png";

import urlConfig from "@/vnpay/config/default.json";

import {
  convertDateFormat,
  convertDateString,
  formatNumber,
} from "@/common/commonFunc";

import { Money, Back } from "@element-plus/icons-vue";

import vnpayqrcode from "@/assets/img/64x64-vnpay-qr.svg";
import vivnpay from "@/assets/img/64x64-vi-vnpay.svg";
import atmvnpay from "@/assets/img/64x64-atm.svg";
import creditcard from "@/assets/img/64x64-credit.svg";
export default {
  setup() {
    return {
      vnpayImage,
      convertDateFormat,
      formatNumber,
      vnpayqrcode,
      vivnpay,
      atmvnpay,
      creditcard,
      Money,
      convertDateFormat,
      Back,
    };
  },
  created() {
    // this.readConfig();
    this.checkData();
  },
  data() {
    return {
      dataCheckout: {},
      bankCode: "VNPAYQR",
      vnpayConfig: urlConfig,
      urlCreatePayment: "",
    };
  },
  methods: {
    checkData() {
        if (!this.$store.state.dataCheckout.history) {
          router.push("./checkout-failed");
        }else{
          this.dataCheckout.history = this.$store.state.dataCheckout.history;
          this.dataCheckout.seat = this.$store.state.dataCheckout.seat;
          this.dataCheckout.ticket = this.$store.state.dataCheckout.ticket;
        }
    },
    rollbackHome() {
      router.push("./");
    },


    checkoutVnpay(){
      let me = this;
      this.$api
        .post("/VnPay/GetUrlCreatePayment", {
          orderType: "other",
          amount: this.dataCheckout.ticket.totalAmount,
          orderDescription: "THANH TOAN VE",
          name: "GD",
          bankCode: this.bankCode
        })
        .then((x) => {
          me.urlCreatePayment = x;
          window.location.href = this.urlCreatePayment;
        });
    },
    getDateMomentString() {
      let date = new Date();

      let day = ("0" + date.getDate()).slice(-2); // Lấy ngày trong tháng và thêm '0' nếu cần
      let hour = ("0" + date.getHours()).slice(-2); // Lấy giờ trong ngày và thêm '0' nếu cần
      let minute = ("0" + date.getMinutes()).slice(-2); // Lấy phút trong giờ và thêm '0' nếu cần
      let second = ("0" + date.getSeconds()).slice(-2); // Lấy giây trong phút và thêm '0' nếu cần

      return day + hour + minute + second;
    },
  },

  beforeMount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    this.$store.state.IsOutSide = true;
    body.classList.remove("bg-gray-100");
    this.$store.state.isLoggedIn = false;
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    this.$store.state.IsOutSide = false;
    body.classList.add("bg-gray-100");
  },
};
</script>
<style lang="scss">
.vnpay-checkout {
  .el-button {
        font-weight: 600;
      }
  color: #111;
  .checkout-header {
    height: 80px;
    display: flex;
    border-bottom: 1px solid #111;
    margin: 0 20px;
    align-items: center;
    justify-content: space-between;
    .header-left {
      font-size: 32px;
      font-weight: 600;
      margin-left: 20px;
    }

    .header-right {
      .logo-vnpay {
        width: 150px;
        height: 30px;
      }
      margin-right: 20px;
    }
  }

  .checkout-main {
    display: flex;
    .info-container {
      width: 50vw;
    }
    margin: 50px 20px 0 20px;
    .checkout-main-container {
      height: calc(100vh - 190px);
      .info-customer {
        margin-left: 40px;
        font-weight: 600;
      }

      .info-ticket {
        margin-left: 40px;
        margin-top: 20px;
        .table-checkout {
          thead {
            tr {
              th {
                border-top: 1px solid #111;
                padding: 12px 16px;
                border-left: 1px solid #111;
                text-align: center;
                width: 200px;
                background: rgba(50, 50, 93, 0.25);
              }

              th:last-child {
                border-right: 1px solid #111;
              }
            }
          }

          tbody {
            tr {
              td {
                border-top: 1px solid #111;
                padding: 12px 16px;
                border-left: 1px solid #111;
                text-align: center;
              }

              td:last-child {
                border-right: 1px solid #111;
              }
            }

            tr:last-child {
              border-bottom: 1px solid #111;
            }
          }

          tfoot {
            font-weight: 600;
            tr {
              td {
                border-top: 1px solid #111;
                padding: 12px 16px;
                border-left: 1px solid #111;
                text-align: center;
              }

              td:last-child {
                border-right: 1px solid #111;
                text-align: right;
                padding-right: 55px;
              }
            }

            tr:last-child {
              border-bottom: 1px solid #111;
            }
          }
        }
      }
    }

    .payment-container {
      width: 50vw;
      .payment-title {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 600;
      }
      .el-radio-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .el-radio {
          margin: 5px 20px;
          height: 100px;
          width: calc(50vw - 100px);
          font-weight: 600;
        }
        .el-radio__input.is-checked + .el-radio__label {
          color: #111;
        }

        .el-radio__inner {
          display: none;
        }

        .el-radio__label {
          width: 100%;
        }

        .vnpay-red {
          color: #e50019 !important;
          font-weight: 700;
          font-size: 16px;
        }
        sup.vnpay-red {
          font-size: 9.8px;
        }

        .vnpay-blue {
          color: #004a9c;
          font-weight: 700;
          font-size: 16px;
        }
      }

      .payment-footer {
        display: flex;
        margin: 10px 40px;
        justify-content: flex-end;
      }
    }
  }

  .checkout-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    margin: 0 20px;
  }
}
</style>
