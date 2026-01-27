const ROLES = {
  USER: 'user',
  VENDOR: 'vendor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

const ROLE_HIERARCHY = {
  [ROLES.USER]: 1,
  [ROLES.VENDOR]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.SUPER_ADMIN]: 4,
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
};

