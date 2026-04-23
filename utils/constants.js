const COLLECTIONS = {
  courses: 'courses',
  activities: 'activities',
  signups: 'signups',
  admins: 'admins',
  siteSettings: 'site_settings'
};

const COURSE_STATUS = ['draft', 'published', 'archived'];
const ACTIVITY_STATUS = ['draft', 'published', 'closed'];

module.exports = {
  COLLECTIONS,
  COURSE_STATUS,
  ACTIVITY_STATUS
};
