<template>
  <div class="account-child-setting">
    <div class="account-info-header">
      Nếu muốn thay đổi thông tin tài khoản. Vui lòng liên hệ tới hotline rạp chiếu.
    </div>
    <div class="account-info-container">
      <div class="account-info">
        <div class="info-row">
          <div class="info-label">Tên tài khoản:</div>
          <div class="info-content">{{ dataAccount.accountName }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Họ và tên:</div>
          <div class="info-content">{{ dataAccount.name }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Giới tính:</div>
          <div class="info-content">
            {{
              dataAccount.gender == 1
                ? "Name"
                : dataAccount.gender == 2
                ? "Nữ"
                : "Khác"
            }}
          </div>
        </div>
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-content">{{ dataAccount.email ?? "" }}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Số điện thoại:</div>
          <div class="info-content">{{ dataAccount.phoneNumber ?? "" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  created() {
    let me = this;
    this.loadData();
  },
  data() {
    return {
      dataAccount: [],
    };
  },
  methods: {
    loadData() {
      let me = this;
      this.$store.state.isShowLoading = true;
      this.$api
        .post("/Account/GetAccountByAccountName", {
          accountName: me.$store.state.thisAccountName,
        })
        .then((data) => {
          me.dataAccount = data;
          me.$store.state.isShowLoading = false;
        });
    },
  },
};
</script>
<style lang="scss">
.account-child-setting {
  .account-info-header {
    font-style: italic;
    font-size: 12px;
    text-align: center;
    padding: 10px;
  }
  height: 100%;
  width: 100%;
  .account-info-container {
    margin-top: 100px;
    .account-info {
      height: 500px;
      .info-row {
        display: flex;
        justify-content: flex-start;
        .info-label {
          width: 50%;
          display: flex;
          justify-content: flex-end;
          font-weight: 600;
          margin-right: 5px;
        }
        padding-top: 10px;
      }
    }
  }
}
</style>
