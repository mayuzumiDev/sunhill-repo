const checkLoginPageUserRole = (role) => {
  switch (role) {
    case "admin":
      return "/admin/login/";
    case "teacher":
      return "/login/teacher/";
    case "student":
      return "/login/student/";
    case "parent":
      return "/login/parent/";
    case "public":
      return "/";
    default:
      return "/login/";
  }
};

export default checkLoginPageUserRole;
