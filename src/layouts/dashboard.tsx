import { Outlet } from "react-router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { PageContainer } from "@toolpad/core/PageContainer";
import type { Navigation } from "@toolpad/core";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";

export default function Layout() {
  const NAVIGATION: Navigation = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      segment: "home",
      title: "home",
      icon: <DashboardIcon />,
    },
    {
      segment: "Products",
      title: "Products",
      icon: <ShoppingCartIcon />,
    },
  ];

  const BRANDING = {
    title: "Relatory",
  };

  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </ReactRouterAppProvider>
  );
}
