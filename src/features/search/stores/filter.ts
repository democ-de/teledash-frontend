import create from "zustand";
import { FilterKeys, FilterValues, UpdateFiltersOptions } from "..";

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type FilterOptions = AtLeastOne<{
  [key in FilterKeys]: FilterValues<key> | undefined;
}>;

type Filter = {
  activeKey: FilterKeys;
};

export type FilterStore = {
  filters: { [key: string]: Filter };
  options: { [key: string]: FilterOptions };
  createFilter: ({
    id,
    activeKey,
    options,
  }: {
    id: string;
    activeKey: FilterKeys;
    options: FilterOptions;
  }) => void;
  getActiveKey: (id: string) => FilterKeys;
  setActiveKey: (id: string, key: FilterKeys) => void;
  getFilterOptions: (id: string) => FilterOptions;
  setFilterOptions: (id: string, options: UpdateFiltersOptions) => void;
  // removeFilterOption: <T>(key: T, value: FilterValues<T>) => void;
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: {
    search: { activeKey: "chats" },
  },
  options: {
    search: { chats: undefined, messages: undefined, users: undefined },
  },

  createFilter: ({ id, activeKey, options }) =>
    set((state) => {
      return {
        filters: {
          ...state.filters,
          [id]: { activeKey },
        },
        options: {
          ...state.options,
          [id]: options,
        },
      };
    }),

  getActiveKey: (id) => get().filters[id].activeKey,

  setActiveKey: (id, key) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [id]: { ...state.filters[id], activeKey: key },
      },
    })),

  getFilterOptions: (id) => get().options[id],

  setFilterOptions: (id, { key, params }) =>
    set((state) => ({
      options: {
        ...state.options,
        [id]: { ...state.options[id], [key]: params },
      },
    })),
  // removeFilterOption: (key, value) => set((state) => ({})),
}));
