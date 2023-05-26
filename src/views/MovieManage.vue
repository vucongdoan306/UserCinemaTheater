<template>
  <div class="movie-manage">
    <div class="movie-banner">
      <div
        id="carouselExampleIndicators"
        class="carousel slide"
        data-bs-ride="carousel"
      >
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img :src="banner1" class="d-block w-100 h_500 border-radius-10" alt="..." />
          </div>
          <div class="carousel-item">
            <img :src="banner2" class="d-block w-100 h_500 border-radius-10" alt="..." />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>
    <div class="movie-manage-container">
      <div class="movie-manage-main">
        <div class="main-empty" v-if="dataSource.length < 1">
          Không có dữ liệu
        </div>
        <div
          class="movie-item"
          v-for="item in dataSource"
          :key="item.movieID"
          v-show="isShowMovie(item)"
        >
          <base-image-download :linkImg="item.posterLink"></base-image-download>

          <div class="movie-detail">
            <div class="movie-name">
              <div
                class="movie-content"
                @click="openContent(item.movieName, item.content)"
              >
                {{ item.movieName }}
              </div>
              <div class="group-icon">
                <div
                  class="icon-trailer"
                  title="Mua vé"
                  @click="openTemplateTimeMovie(item.movieID, item.movieName)"
                >
                  <i class="fas fa-ticket-alt"></i>
                </div>
              </div>
            </div>
            <div class="movie-time-line">
              <span class="bold">{{ $t("Timel") }}:</span> {{ item.timeLine }}
              {{ $t("Min") }}
            </div>
            <div class="movie-from-date">
              <span class="bold">{{ $t("nShowDate") }}:</span>
              {{ convertDateFormat(item.fromDate) }}
            </div>
            <div class="movie-to-date">
              <span class="bold">{{ $t("nEndDate") }}:</span>
              {{ convertDateFormat(item.toDate) }}
            </div>
            <div class="movie-release-date">
              <span class="bold">{{ $t("Releasedate") }}:</span>
              {{ convertDateFormat(item.releaseDate) }}
            </div>
            <div class="movie-actor">
              <span class="bold">{{ $t("nActor") }}:</span> {{ item.actor }}
            </div>
            <div class="movie-direction">
              <span class="bold">{{ $t("Director") }}:</span>
              {{ item.directions }}
            </div>
            <div class="movie-category" :title="item.categoryName">
              <span class="bold">{{ $t("CategoryMovie") }}:</span>
              {{ item.categoryName }}
            </div>
            <div class="movie-type">
              <span class="bold">{{ $t("TypeMovie") }}:</span>
              {{ item.typeName }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <popup-show-content
      v-if="$store.state.isOpenPopupShowContent"
      :contentMovie="contentSelected"
      :nameMovie="nameMovie"
    ></popup-show-content>

    <popup-seat-cinema
      v-if="$store.state.isOpenPopupSeat"
      :nameMovie="movieNameSelected"
      :idMovie="movieIDSelected"
    ></popup-seat-cinema>
  </div>
</template>

<script>
import { fields } from "@/constants/constantsmoviegrids.js";
import { filterMovie } from "@/constants/constantsdefaults.js";
import BaseLoading from "./components/BaseLoading.vue";
import BaseButton from "./components/BaseButton.vue";
import BaseImageDownload from "./components/BaseImageDownload.vue";
import VsudInput from "../components/VsudInput.vue";
import { convertDateFormat } from "@/common/commonFunc";
import PopupShowContent from "./popups/PopupShowContent.vue";
import PopupSeatCinema from "./popups/PopupSeatCinema.vue";
import router from "@/router/index";
import banner1 from "@/assets/img/baner1.png";
import banner2 from "@/assets/img/banner2.png";
export default {
  name: "MovieManager",
  components: {
    BaseLoading,
    BaseButton,
    BaseImageDownload,
    VsudInput,
    PopupShowContent,
    PopupSeatCinema,
  },
  setup() {
    return { convertDateFormat, filterMovie };
  },
  created() {
    let me = this;
    me.dataField = fields;
    this.$store.state.isShowLoading = true;
    this.$api
      .post("/Movie/GetListMovie", { TypeFilter: me.typeFilter })
      .then((data) => {
        me.dataSource = data;
        this.$store.state.isShowLoading = false;
      });
  },
  data() {
    return {
      dataField: [],
      dataSource: [],
      itemsSelected: {},
      searchValue: "",
      rowSelected: "",
      checkDelete: false,
      openTrailers: [],
      openContexts: [],
      contentSelected: "",
      nameMovie: "",
      typeFilter: 1,
      movieIDSelected: "",
      movieNameSelected: "",banner1,banner2
    };
  },
  methods: {
    isShowMovie(item) {
      return (
        item.movieName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        item.movieCode.toLowerCase().includes(this.searchValue.toLowerCase())
      );
    },
    isOpenContext(id) {
      return this.openContexts.find((x) => x == id);
    },

    openContext(id) {
      if (this.openContexts.find((x) => x == id)) {
        this.openContexts = this.openContexts.filter((x) => x != id);
      } else {
        this.openContexts.push(id);
      }
    },

    async openPopup() {
      if (await this.$store.dispatch("checkRole", "admin")) {
        this.$store.state.IsOpenPopup = true;
      }
    },
    getRowSelected(item) {
      let me = this;
      this.rowSelected = item;

      this.$store.state.isOpenPopupDelete = true;
    },

    loadData() {
      let me = this;
      this.$store.state.isShowLoading = true;
      this.$api
        .post("/Movie/GetListMovie", { TypeFilter: me.typeFilter })
        .then((data) => {
          me.dataSource = data;
          me.$store.state.isShowLoading = false;
        });
    },
    handleAdd() {
      this.$store.state.IsOpenPopup = false;
      this.loadData();
    },

    handelAlter() {
      this.$store.state.isOpenPopupAlterMovie = false;
      this.loadData();
    },
    openContent(name, content) {
      this.nameMovie = name;
      this.contentSelected = content;
      this.$store.state.isOpenPopupShowContent = true;
    },

    openTemplateTimeMovie(id, name) {
      this.movieIDSelected = id;
      this.movieNameSelected = name;
      if (sessionStorage.getItem("token")) {
        this.$store.state.isOpenPopupSeat = true;
      } else {
        router.push("/sign-in");
      }
    },
  },
};
</script>
<style lang="scss">
.movie-manage {
  padding: 30px 28px 0;
  .movie-manage-header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    background: #fff;
    border-radius: 10px;
    align-items: center;
    .form-group {
      margin-bottom: 0px !important;
    }
    .header-left {
      display: flex;
      .filter-movie {
        height: 36px;
        margin-left: 10px;
        .el-select {
          margin: 0 !important;
          .el-input__inner,
          .el-input__wrapper {
            height: 36px;
          }
        }
      }
    }
  }

  #search_movie {
    height: 36px;
  }

  .mt-2 {
    margin-top: 10px;
  }

  .button-blue-round {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: none;
    background: #1a72ff;
    color: #fff;
    font-weight: 600;
  }

  .movie-manage-container {
    .movie-manage-main {
      min-height: calc(100vh - 275px);
      box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
      background: #fff;
      border-radius: 10px;
      padding: 20px 0;
      margin-top: 30px;
      display: flex;
      flex-wrap: wrap;
      min-width: 500px;
      .movie-item {
        background: #fff;
        position: relative;
        margin-left: 20px;
        min-width: 500px;
        width: 500px;
        color: #111;
        display: flex;
        height: 250px;
        margin-bottom: 10px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border-radius: 10px;
        padding: 10px;
        font-size: 13px;
        .movie-detail {
          width: 320px;
          font-size: 14px;
          .bold {
            font-weight: 600;
          }
        }
        .posterLink {
          display: inline-block;
          width: 150px;
          height: 230px;
          object-fit: cover;
          box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
          padding: 3px;
          border-radius: 10px;
        }

        .movie-category,
        .movie-actor,
        .movie-direction {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 280px;
        }

        .movie-name {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          .movie-content {
            &:hover {
              text-decoration: underline;
              opacity: 0.9;
            }
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 270px;
          }

          .group-icon {
            display: flex;
            .icon-trailer {
              position: relative;
            }
          }
          .icon-context-container {
            position: relative;
            .group-icon-down {
              display: flex;
              top: 30px;
              right: 0;
              flex-direction: column;
              position: absolute;
              .icon-down {
                margin-bottom: 5px;
                height: 24px;
                width: 24px;
                background: #1a72ff;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                border-radius: 50%;
                cursor: pointer;
              }
            }
          }

          .icon-trailer {
            margin-left: 5px;
            height: 24px;
            width: 24px;
            background: #1a72ff;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            border-radius: 50%;
            cursor: pointer;
            transform: scale(1.4);
            &:hover {
              opacity: 0.6;
            }
          }
        }

        .movie-content-main {
          padding: 0 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          /* justify-content: center; */
          align-items: center;
          .movie-content {
            overflow: auto;
          }
        }

        .movie-trailer {
          iframe {
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
            padding: 3px;
          }
          margin-right: 10px;
        }
      }
    }
  }
}

.operation-wrapper {
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: space-around;
  i:hover {
    opacity: 0.6;
  }
}
</style>
