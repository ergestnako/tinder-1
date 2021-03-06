// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: 'login(/:token)',
      name: 'login',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Auth/reducer'),
          System.import('containers/Auth/sagas'),
          System.import('containers/Auth'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('auth', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: 'dashboard',
      name: 'dashboard',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Dashboard/reducer'),
          System.import('containers/Notification/reducer'),
          System.import('containers/Notification/sagas'),
          System.import('containers/Dashboard/sagas'),
          System.import('containers/Dashboard'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([dashboardReducer, notificationReducer, notificationSagas, dashboardSagas, component]) => {
          injectReducer('dashboard', dashboardReducer.default);
          injectReducer('notifications', notificationReducer.default);
          injectSagas(notificationSagas.default);
          injectSagas(dashboardSagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [{
        path: '/dashboard/recommendations',
        name: 'recommendations',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('containers/Recommendations/reducer'),
            System.import('containers/Recommendations/sagas'),
            System.import('containers/Recommendations'),
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([reducer, sagas, component]) => {
            injectReducer('recommendations', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        },
      }, {
        path: '/dashboard/home',
        name: 'dashboard home',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('containers/MainDashboard/reducer'),
            System.import('containers/MainDashboard/sagas'),
            System.import('containers/MainDashboard'),
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([reducer, sagas, component]) => {
            injectReducer('userDashboard', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        },
      }, {
        path: '/dashboard/messages',
        name: 'messages',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('containers/Messages/reducer'),
            System.import('containers/Messages/sagas'),
            System.import('containers/Messages'),
          ]);

          const renderRoute = loadModule(cb);

          importModules.then(([reducer, sagas, component]) => {
            injectReducer('messages', reducer.default);
            injectSagas(sagas.default);
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        },
      },
    ],
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
