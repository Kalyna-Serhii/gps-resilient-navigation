import auth from './auth.js';
import geocode from './geocode.js';
import routes from './routes.js';
import users from './users.js';

const paths = {
  ...auth,
  ...users,
  ...routes,
  ...geocode,
};

export default paths;
