
export const USER_ROLES = {
  Administrator: 1,
  Instructor: 2,
  Student: 3,
};

export const isLoggedIn = user => !!user;

export const isAdmin = user => user?.userRoleID === USER_ROLES.Administrator;
export const isInstructor = user => user?.userRoleID === USER_ROLES.Instructor;
export const isStudent = user => user?.userRoleID === USER_ROLES.Student;

export const isAtLeastInstructor = user => user?.userRoleID <= USER_ROLES.Instructor;
export const isAtLeastStudent = user => user?.userRoleID <= USER_ROLES.Student;

export const isAtLeast = (user, minUserRole) => user?.userRoleID <= minUserRole;
