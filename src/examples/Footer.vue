<template>
  <footer class="py-3 footer" id="user-footer">
    <div class="container">
      <div class="row">
        <div class="col-sm">
          <div class="column-1 d-flex flex-column">
            <div
              class="logo-page navbar-brand d-flex align-items-center justify-content-center"
            >
              <img :src="logo" class="navbar-brand-img h-100" alt="main_logo" />
              <span class="ms-1 font-weight-bold">Cinema</span>
            </div>
            <div
              class="item-1 mx-3 fw-bold"
              v-for="item in footerCol1"
              :key="item"
            >
              <el-link :icon="ArrowRight" class="fw-bold">{{ item }}</el-link>
            </div>
          </div>
        </div>
        <div class="col-sm">
          <div class="column-2">
            <h2 class="header-footer-2 navbar-brand">CỤM RẠP CINEMA</h2>
            <div class="clearfix"></div>
            <div
              class="item-1 mx-1 fw-bold"
              v-for="item in listCinema"
              :key="item"
            >
              <el-link :icon="ArrowRight" class="fw-bold">{{
                item.cinemaName
              }}</el-link>
            </div>
          </div>
        </div>
        <div class="col-sm">
          <div class="column-3">
            <h2 class="header-footer-2 navbar-brand">KẾT NỐI VỚI CHÚNG TÔI</h2>
            <div class="clearfix"></div>
            <i class="fab fa-facebook-square fa-lg"></i>
            <i class="mx-1"></i>
            <i class="fab fa-youtube fa-lg"></i>
            <i class="mx-1"></i>
            <i class="fab fa-instagram-square fa-lg"></i>
          </div>
        </div>
        <div class="col-sm">
          <div class="column-2">
            <h2 class="header-footer-2 navbar-brand">LIÊN HỆ</h2>
            <div class="clearfix"></div>
            <div class="fw-bold">CÔNG TY CỔ PHẦN CINEMA</div>
            <div class="fw-bold">
              Địa chỉ trụ sở: Tầng 3, số 595, đường Giải Phóng, phường Giáp Bát,
              quận Hoàng Mai, thành phố Hà Nội
            </div>
            <div class="fw-bold">Hotline: 1900 636807</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import logo from "@/assets/img/logo-ct.png";
import { footerCol1 } from "@/constants/constantsdefaults.js";

import { ArrowRight } from "@element-plus/icons-vue";
export default {
  name: "AppFooter",
  setup() {
    return {
      ArrowRight,
      footerCol1,
    };
  },
  created() {
    this.loadListCinema();
  },
  data() {
    return {
      logo,
      listCinema: [],
    };
  },
  methods: {
    loadListCinema() {
      let me = this;
      this.$api.get("/Account/GetListCinema").then((data) => {
        me.listCinema = data;
      });
    },
  },
};
</script>
<style lang="scss">
#user-footer {
  border-top: 2px solid #ccc;
  margin: 20px 20px 0 20px;
  .container {
    margin-right: auto;
    margin-left: auto;
    .logo-page {
      height: 50px;
    }

    .header-footer-2 {
      font-size: 20px;
      padding-bottom: 7px;
      margin: 0 0 15px;
      text-transform: uppercase;
      font-weight: bold;
      border-bottom: 4px solid transparent;
      border-image: linear-gradient(to right, #39adf0 0%, #075fa3 100%);
      border-image-slice: 1;
      float: left;
    }

    .column-3 {
      i {
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
