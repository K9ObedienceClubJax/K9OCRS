
export const commonSelectors = {
  selectState: state => state,
  selectShared: state => state.shared,
  selectPageState: (state, page) => state.pages[page],
  selectCurrentUser: state => commonSelectors.selectShared(state)?.currentUser,

  // Shared

  // User
  selectIsAuthenticated: state => !!commonSelectors.selectCurrentUser(state),

  // Errors
  selectLoginFailure: state => commonSelectors.selectShared(state)?.loginError,
};

export const createSelectors = additionalSelectors => ({
  ...commonSelectors,
  ...additionalSelectors,
});
