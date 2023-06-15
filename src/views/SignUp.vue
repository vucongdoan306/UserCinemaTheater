<template>
  <div class="sign-up">
    <navbar btn-background="bg-gradient-primary" />
    <div
      class="pt-5 m-3 page-header align-items-start min-vh-50 pb-11 border-radius-lg"
      :style="{
        backgroundImage: `url(${bgImg})`,
      }"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="mx-auto text-center col-lg-5">
            <h1 class="mt-5 mb-2 text-white">{{ $t("welcomesignin") }}</h1>
            <p class="text-white text-lead">
              {{ $t("createnewaccount") }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="mx-auto col-xl-4 col-lg-5 col-md-7">
          <div class="card z-index-0">
            <div class="pt-4 text-center card-header">
              <h5>{{ $t("Register") }}</h5>
            </div>

            <div class="card-body">
              <div>
                <div class="mb-3">
                  <vsud-input
                    type="text"
                    :placeholder="$t('Name')"
                    v-model="FullName"
                    :isRequired="true"
                  />
                </div>
                <div class="mb-3">
                  <vsud-input
                    type="text"
                    :placeholder="$t('PhoneNumber')"
                    v-model="phoneNumber"
                    :isRequired="true"
                    :maxlength="10"
                  />
                </div>
                <div class="mb-3">
                  <vsud-input
                    type="text"
                    :placeholder="$t('AccountName')"
                    v-model="AccountName"
                    :isRequired="true"
                  />
                </div>
                <div class="mb-3">
                  <vsud-input
                    type="text"
                    :placeholder="$t('Email')"
                    v-model="email"
                    :isRequired="true"
                  />
                </div>
                <div class="mb-3">
                  <vsud-input
                    type="password"
                    :placeholder="$t('Password')"
                    v-model="Password"
                    :isRequired="true"
                  />
                </div>
                <div class="mb-3">
                  <el-date-picker
                    v-model="dateOfBirth"
                    type="date"
                    :placeholder="$t('DateOfBirth')"
                    :size="size"
                  />
                </div>

                <div class="mb-3 gender-select d-flex align-items-center">
                   
                  <input type="radio" name="gender" :value="0" v-model="gender" />
                    <label for="html">Nam</label>
                   
                  <div class="mx-2"></div>
                  <input type="radio" name="gender" :value="1" v-model="gender"/>
                    <label for="css">Nữ</label>
                </div>
                <vsud-checkbox id="flexCheckDefault" checked>
                  {{ $t("agreeterm") }}
                </vsud-checkbox>

                <div class="text-center">
                  <vsud-button
                    color="dark"
                    full-width
                    variant="gradient"
                    class="my-4 mb-2"
                    @click="SignUpAccount"
                    >{{ $t("signup") }}</vsud-button
                  >
                </div>
                <p class="text-sm mt-3 mb-0">
                  {{ $t("haveaccount") }}
                  <a
                    href="javascript:;"
                    class="text-dark font-weight-bolder"
                    @click="redirectSignin"
                    >{{ $t("signin") }}</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import VsudInput from "@/components/VsudInput.vue";
import VsudCheckbox from "@/components/VsudCheckbox.vue";
import VsudButton from "@/components/VsudButton.vue";
import bgImg from "@/assets/img/curved-images/curved6.jpg";
import router from "@/router/index";

export default {
  name: "SignUp",
  components: {
    Navbar,
    AppFooter,
    VsudInput,
    VsudCheckbox,
    VsudButton,
  },
  data() {
    return {
      bgImg,
      AccountName: "",
      FullName: "",
      Password: "",
      dateOfBirth: "",
      gender: 0,
      email: "",
      phoneNumber: ""
    };
  },
  created() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
  },
  methods: {
    async SignUpAccount() {
      if (this.checkEmpty()) {
        let me = this;
        let checkExsit = true;
        this.$store.state.isShowLoading = true;
        await this.$api
          .post("/Account/CheckExistAccount", { accountName: this.AccountName })
          .then((data) => {
            checkExsit = data;
          });

        if (!checkExsit) {
          this.$api
            .post("/Account/InsertNewAccountUser", {
              accountName: this.AccountName,
              password: this.Password,
              name: this.FullName,
              email: this.email,
              gender: this.gender,
              phoneNumber: this.phoneNumber,
              dateOfBirth: this.dateOfBirth,
            })
            .then((data) => {
              if (data) {
                me.$store.dispatch(
                  "showToast",
                  "Đăng ký tài khoản thành công"
                );

                me.redirectSignin();
              } else {
                me.$store.dispatch("showToast", "Đăng ký thất bại!");
              }
              me.$store.state.isShowLoading = false;
            });
        } else {
          this.$store.dispatch("showToast", "Tài khoản đã tồn tại");
          me.$store.state.isShowLoading = false;
        }
      }
    },

    redirectSignin() {
      router.push("/sign-in");
    },

    checkEmpty() {
      if (this.AccountName && this.FullName && this.Password && this.email && this.phoneNumber && this.dateOfBirth) {
        return true;
      } else {
        this.$store.dispatch("showToast","Chưa nhập đủ thông tin")
        return false;

      }
    },
  },
};
</script>
<style lang="scss">
.sign-up {
  .el-date-editor--date {
    width: 100% !important;
    height: 40px !important;
    border-radius: 10px;
  }
  .gender-select{
    label{
      padding: 0!important;
      margin-bottom: 0!important;
    }
  }
  
}
</style>
