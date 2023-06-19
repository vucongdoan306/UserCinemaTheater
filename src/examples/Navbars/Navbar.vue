<template>
  <nav
    v-bind="$attrs"
    id="navbarBlur"
    class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs :current-page="currentRouteName" :text-white="textWhite" />
      <div
        id="navbar"
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="$store.state.isRTL ? 'px-0' : 'me-sm-4'"
      >
        <div
          class="pe-md-3 d-flex align-items-center"
          :class="$store.state.isRTL ? 'me-md-auto' : 'ms-md-auto'"
        >
          <div class="input-group">
            <div class="filter-cinema">
              <el-select
                v-model="cinemaSelected"
                class="m-2"
                placeholder="Select"
                size="large"
                @change="loadData"
              >
                <el-option
                  v-for="item in listCinema"
                  :key="item.cinemaID"
                  :label="item.cinemaName"
                  :value="item.nameDB"
                />
              </el-select>
            </div>
          </div>
        </div>
        <ul class="navbar-nav justify-content-end">
          <li class="nav-item d-flex align-items-center mx-3" v-if="fullName">
            Xin chào,
            <span class="mx-1" @click="showAccountInfo()">{{ fullName }}</span>
          </li>
          <li class="nav-item d-flex align-items-center">
            <router-link
              :to="{ name: 'Sign In' }"
              class="px-0 nav-link font-weight-bold"
              :class="textWhite ? textWhite : 'text-body'"
            >
              <i
                class="fa fa-user"
                :class="$store.state.isRTL ? 'ms-sm-2' : 'me-sm-1'"
              ></i>
              <span class="d-sm-inline d-none">{{
                !fullName ? $t("signin") : $t("Logout")
              }}</span>
            </router-link>
          </li>
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              id="iconNavbarSidenav"
              href="#"
              class="p-0 nav-link text-body"
              @click="toggleSidebar"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>
          </li>
          <li
            class="px-3 nav-item d-flex align-items-center"
            v-if="localStorage"
          >
            <a
              class="p-0 nav-link"
              :class="textWhite ? textWhite : 'text-body'"
              @click="showSetting"
            >
              <i class="cursor-pointer fa fa-cog fixed-plugin-button-nav"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <el-dialog v-model="isShowDialog" title="Thông tin tài khoản">
      <el-form :model="accountInfo">
        <div class="row-item">
          <div class="col-1">
            Tên đăng nhập
          </div>
          <div class="col-2">
            {{ accountInfo.accountName }}
          </div>
        </div>
        <div class="row-item">
          <div class="col-1">
            Họ và tên
          </div>
          <div class="col-2">
            {{ accountInfo.name }}
          </div>
        </div>
        <div class="row-item">
          <div class="col-1">
            Ngày sinh 
          </div>
          <div class="col-2">
            {{ convertDateFormat(accountInfo.dateOfBirth) }}
          </div>
        </div>
        <div class="row-item">
          <div class="col-1">
            Số điện thoại
          </div>
          <div class="col-2">
            {{ accountInfo.phoneNumber }}
          </div>
        </div>
        <div class="row-item">
          <div class="col-1">
            Email
          </div>
          <div class="col-2">
            {{ accountInfo.email }}
          </div>
        </div>
        <div class="row-item">
          <div class="col-1">
            Giới tính
          </div>
          <div class="col-2">
            {{ accountInfo.gender==1?'Nữ':accountInfo.gender==0?'Nam':'Khác' }}
            
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowDialog = false">Đóng</el-button>
        </span>
      </template>
    </el-dialog>
  </nav>
</template>
<script>
import Breadcrumbs from "../Breadcrumbs.vue";
import { mapMutations, mapActions } from "vuex";
import { slideitems } from "@/constants/constantsdefaults";
import { convertDateFormat } from "@/common/commonFunc";

import BaseImageDownload from "../../views/components/BaseImageDownload.vue";
import jwt from "jsonwebtoken";

export default {
  name: "NavbarComponent",

  components: {
    Breadcrumbs,
    BaseImageDownload,
  },
  setup() {
    return {
      convertDateFormat
    }
  },
  mounted() {
    let me = this;
    if (jwt.decode(localStorage.getItem("token"))) {
      this.fullName = jwt.decode(localStorage.getItem("token")).fullname;
    }
  },
  props: {
    minNav: {
      type: Function,
      default: () => {},
    },
    textWhite: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showMenu: false,
      listCinema: [],
      cinemaSelected: "",
      fullName: "",
      accountInfo: {},
      isShowDialog: false,
    };
  },
  computed: {
    currentRouteName() {
      if (this.$route.name) {
        let temp = slideitems.find((x) => {
          if (x.name == this.$route.name) return x.text;
        });
        if (temp) {
          return this.$t(temp.text);
        } else {
          return "";
        }
      }
      return this.$route.name;
    },
  },
  async created() {
    let me = this;
    this.minNav;
    this.loadListCinema();
    this.cinemaSelected = localStorage.getItem("dbname");
  },
  updated() {
    const navbar = document.getElementById("navbarBlur");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10 && this.$store.state.isNavFixed) {
        navbar.classList.add("blur");
        navbar.classList.add("position-sticky");
        navbar.classList.add("shadow-blur");
      } else {
        navbar.classList.remove("blur");
        navbar.classList.remove("position-sticky");
        navbar.classList.remove("shadow-blur");
      }
    });
  },
  methods: {
    ...mapMutations(["navbarMinimize", "toggleConfigurator"]),
    ...mapActions(["toggleSidebarColor"]),

    toggleSidebar() {
      this.toggleSidebarColor("bg-white");
      this.navbarMinimize();
    },

    showSetting() {
      this.$store.state.isShowSetting = true;
    },

    async loadListCinema() {
      let me = this;
      await this.$api.get("/Account/GetListCinema").then((data) => {
        me.listCinema = data;
      });
    },

    loadData() {
      let me = this;
      this.$api.post("/UserLogin/cinemadb", me.cinemaSelected).then(() => {
        localStorage.setItem("dbname", me.cinemaSelected);
        location.reload();
      });
    },

    showAccountInfo() {
      let me = this;
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        let accountName = jwt.decode(token).name;
        this.$api
          .post("/Account/GetAccountByAccountName", {
            accountName: accountName,
          })
          .then((data) => {
            me.accountInfo = data;
            this.isShowDialog = true;
          });
      }
    },
  },
};
</script>
<style lang="scss">
#navbar .name-cinema {
  font-size: 20px;
  font-weight: 600;
}

.navbar-main {
  .row-item{
    margin-left: 20px;
    margin-bottom: 5px;
    display: flex;
    font-size: 16px;
    .col-1{
      width: 120px;
      margin-right: 10px;
    }

    .col-2{
      width: 300px;
    }
  }
}
</style>
