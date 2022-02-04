
// Selectors are used so that if you change the structure of your state, you only need to update the "path" to that piece of state
// in one place (the selector), instead of having to update every single connect() call
export default {
  selectRefreshingUser: state => state.shared.refreshingUser,
  selectCurrentUser: state => state.shared.currentUser,
};
