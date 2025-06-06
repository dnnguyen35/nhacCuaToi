import { List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

const PlaylistListSkeleton = () => {
  return (
    <List>
      {Array.from({ length: 5 }).map((_, index) => (
        <ListItem key={index} button>
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton width="60%" height={24} />}
            secondary={<Skeleton width="40%" height={20} />}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default PlaylistListSkeleton;
