import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ icon, label, value }) => {
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: "10%",
        overflow: "hidden",
        maxHeight: { xs: 70, md: 70 },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box>{icon}</Box>
          <Box>
            <Typography variant="body2" color="textSecondary">
              {label}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
