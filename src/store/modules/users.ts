import type {IUser, TInterval, TSort} from "@/types";
import type { ActionContext } from "vuex";
import type { IRootState } from "@/store";

export interface IUsersState {
  all: IUser[];
  sort: TSort;
  interval: TInterval;
  search: string;
}

// initial state
const state: IUsersState = {
  all: [
    {
      place: 1,
      login: "smith@gmail.com",
      orders: 312,
      status: "Ценитель красоты",
    },
    {
      place: 2,
      login: "lenin@gmail.com",
      orders: 120,
      status: "Поставщик аксессуаров",
    },
    {
      place: 3,
      login: "mask@gmail.com",
      orders: 98,
      status: "Конкурент минздрава",
    },
    { place: 4, login: "dog@mail.ru", orders: 64, status: "рыбак" },
    { place: 5, login: "nightmare@mail.ru", orders: 34, status: "охотник" },
    { place: 6, login: "cat@mail.ru", orders: 1, status: "Ценитель красоты" },
  ],
  sort: {
    value: "place",
    reversed: false,
  },
  interval: {
    start: 0,
    end: Number.POSITIVE_INFINITY,
  },
  search: "",
};

// getters
const getters = {
  sortedUsers(state: IUsersState) {
    return [...state.all]
      .sort((user1, user2) => {
        let a = user1[state.sort.value as keyof IUser];
        let b = user2[state.sort.value as keyof IUser];
        if (typeof a === "string" && typeof b === "string") {
          a = a.toLowerCase();
          b = b.toLowerCase();
        }
        if (state.sort.reversed) {
          if (a < b) return 1;
          return -1;
        }
        if (a > b) return 1;
        return -1;
      })
      .filter(
        (user) =>
          user.login.toLowerCase().includes(state.search) ||
          user.status.toLowerCase().includes(state.search)
      );
  },
  selectedSort(state: IUsersState) {
    return state.sort;
  },
};

// actions
const actions = {
  setSort(
    { commit }: ActionContext<IUsersState, IRootState>,
    selectSort: TSort
  ) {
    commit("setSort", selectSort);
  },
  setSearch(
    { commit }: ActionContext<IUsersState, IRootState>,
    searchValue: string
  ) {
    commit("setSearch", searchValue);
  },
};

// mutations
const mutations = {
  setSort(state: IUsersState, payload: TSort) {
    state.sort = payload;
  },
  setSearch(state: IUsersState, payload: string) {
    state.search = payload;
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
