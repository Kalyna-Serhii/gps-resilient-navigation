import auth from './auth.js';
import users from './users.js';
import routes from './routes.js';
import geocode from './geocode.js';

const paths = {
  ...auth,
  ...users,
  ...routes,
  ...geocode,
};

export default paths;
