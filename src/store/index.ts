import { createStore } from "vuex";
import users from "@/store/modules/users";
import type { IUsersState } from "@/store/modules/users";

export interface IRootState {
  users: IUsersState;
}

export const store = createStore({
  modules: {
    users,
  },
});
