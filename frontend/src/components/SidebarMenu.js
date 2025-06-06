import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import { AudiotrackOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";

import menuConfigs from "../configs/menu.configs";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SidebarMenu = () => {
  const { appState } = useSelector((state) => state.appState);
  const { t } = useTranslation();

  return (
    <Box sx={{ bgcolor: "background.paper", borderRadius: 3, py: 1, px: 2 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <AudiotrackOutlined sx={{ color: "primary.main" }} fontSize="medium" />
        <Typography variant="h6">nhacCuaToi</Typography>
      </Box>
      <List>
        {menuConfigs.main.map((item, index) => (
          <ListItem key={index} component={Link} to={item.path}>
            <ListItemIcon
              sx={{
                color: appState.includes(item.state)
                  ? "primary.main"
                  : "primary.contrastText",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              sx={{
                display: {
                  xs: "none",
                  sm: "none",
                  md: "inline-block",
                },
                color: appState.includes(item.state)
                  ? "primary.main"
                  : "primary.contrastText",
                textTransform: "uppercase",
              }}
              primary={t(`menu.${item.display}`)}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SidebarMenu;
