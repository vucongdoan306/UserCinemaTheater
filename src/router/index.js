import { createRouter, createWebHistory } from "vue-router";
import jwt from "jsonwebtoken";

import store from "../store";
import Dashboard from "@/views/Dashboard.vue";
import Tables from "@/views/Tables.vue";
import Billing from "@/views/Billing.vue";
import VirtualReality from "@/views/VirtualReality.vue";
import Profile from "@/views/Profile.vue";
import Rtl from "@/views/Rtl.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";
import MovieManage from "@/views/MovieManage.vue";
import ShowTimeManage from "@/views/ShowTimeManage.vue";
import Payment from "@/views/Payment.vue";
import Revenue from "@/views/Revenue.vue";
import History from "@/views/History.vue";
import ReportAndStatistic from "@/views/ReportAndStatistic.vue";
import Ticket from "@/views/Ticket.vue";
import RoomCinema from "@/views/SeatRoomCinema.vue";
import CinemaRoom from "@/views/CinemaRoom.vue";
import Account from "@/views/Account.vue";
import DictionaryMovie from "@/views/DictionaryMovie.vue";
import CheckoutVnpay from "@/views/vnpay/CheckoutVnPay.vue";
import CheckoutFailed from "@/views/vnpay/CheckoutFailed.vue";
import CheckoutSuccessfully from "@/views/vnpay/CheckoutSuccessfully.vue";
const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/movie-list",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/rtl-page",
    name: "Rtl",
    component: Rtl,
  },
  {
    path: "/sign-in",
    name: "Sign In",
    component: SignIn,
  },
  {
    path: "/sign-up",
    name: "Sign Up",
    component: SignUp,
  },
  {
    path: "/movie-list",
    name: "Movie Manage",
    component: MovieManage,
  },
  {
    path: "/account-manage",
    name: "Account Manage",
    component: Account,
    beforeEnter: requireAdmin,
  },
  {
    path: "/showtime-manage",
    name: "ShowTime Manage",
    component: ShowTimeManage,
  },
  {
    path: "/payment",
    name: "Payment",
    component: Payment,

  },
  {
    path: "/revenue",
    name: "Revenue",
    component: Revenue,

  },
  {
    path: "/history",
    name: "History",
    component: History,

  },
  {
    path: "/report-statistic",
    name: "ReportAndStatistic",
    component: ReportAndStatistic,

  },
  {
    path: "/ticket",
    name: "Ticket",
    component: Ticket,

  },
  {
    path: "/showtime-manage/room-cinema",
    component: RoomCinema,
    name: "roomcinema-manage",

  },
  {
    path: "/cinemaroom-manage",
    component: CinemaRoom,
    name: "Cinema Room",
    beforeEnter: requireAdmin,

  },
  {
    path: "/dictionary",
    component: DictionaryMovie,
    name: "Dictionary",

  },
  {
    path: "/create-payment",
    name: "Checkout Vnpay",
    component: CheckoutVnpay,
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout-failed",
    name: "Checkout Failed",
    component: CheckoutFailed,
  },
  {
    path: "/checkout-success",
    name: "Checkout Success",
    component: CheckoutSuccessfully,
  },
  { path: '/:pathMatch(.*)*', redirect: "/movie-manage"},
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn() || !store.state.isLoggedIn) {
      next({
        path: "/sign-in",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

// Hàm check login với token
function isLoggedIn() {
  const token = localStorage.getItem("token");
  store.state.isLoggedIn = true;

  // Kiểm tra xem token đã được lưu trong localStorage chưa
  if (token) {
    // Giải mã token để kiểm tra tính hợp lệ của nó
    const decodedToken = jwt.decode(token);
    store.state.role = jwt.decode(token).role;
    store.state.cinemaName = jwt.decode(token).cinemaName;

    // Kiểm tra xem token có hết hạn hay không
    const expirationDate = new Date(decodedToken.exp * 1000);
    if (expirationDate <= new Date()) {
      // Nếu token đã hết hạn, xóa nó khỏi localStorage và trả về false
      localStorage.removeItem("token");
      return false;
    } else {
      // Nếu token hợp lệ, trả về true
      return true;
    }
  } else {
    // Nếu token không tồn tại trong localStorage, trả về false
    return false;
  }
}

// Hàm check role
function requireAdmin(to, from, next) {
  const token = localStorage.getItem("token");

  if (!isLoggedIn(token)) {
    next("/sign-in");
  } else {
    const decodedToken = jwt.decode(token);
    if (decodedToken.role !== "admin") {
      store.dispatch("showToast", "Tài khoản không có quyền truy cập!");
      next(from.path);
    } else {
      next();
    }
  }
}

export default router;
