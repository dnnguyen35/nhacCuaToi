let store;

export const injectStore = (_store) => {
  store = _store;
};

export const getStore = () => store;
