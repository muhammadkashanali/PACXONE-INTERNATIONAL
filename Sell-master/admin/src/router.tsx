import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router';
import { getStoredAdminUser } from './lib/auth';
import { LoginPage } from './routes/LoginPage';
import { DashboardPage } from './routes/DashboardPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: () => {
    const user = getStoredAdminUser();
    if (user) {
      throw redirect({ to: '/' });
    }
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
  beforeLoad: () => {
    const user = getStoredAdminUser();
    if (!user) {
      throw redirect({ to: '/login' });
    }
  },
});

const routeTree = rootRoute.addChildren([loginRoute, dashboardRoute]);

export const router = createRouter({ routeTree });
