import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { languageModes } from "../configs/language.configs";
import { setLanguageMode } from "../redux/slices/languageModeSlice";
import { themeModes } from "../configs/theme.configs";

const LanguageToggle = () => {
  const theme = useTheme();
  const { languageMode } = useSelector((state) => state.languageMode);

  const dispatch = useDispatch();

  const onSwitchLanguage = () => {
    const newLanguage =
      languageMode === languageModes.en ? languageModes.vi : languageModes.en;
    dispatch(setLanguageMode(newLanguage));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        marginLeft: "1rem",
      }}
      onClick={onSwitchLanguage}
    >
      <Box
        sx={{
          width: 70,
          height: 27,
          borderRadius: 16,
          border: `2px solid ${theme.palette.primary.main}`,
          backgroundColor:
            theme.palette.mode === themeModes.dark ? "#444" : "#ddd",
          position: "relative",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: "bold",
            color: theme.palette.primary.main,
            position: "absolute",
            left: languageMode === languageModes.vi ? "8px" : "40px",
            transition: "left 0.3s ease-in-out",
            textTransform: "uppercase",
          }}
        >
          {languageMode === languageModes.vi
            ? languageModes.vi
            : languageModes.en}
        </Typography>

        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            position: "absolute",
            left: languageMode === languageModes.vi ? "40px" : "1px",
            transition: "left 0.3s ease-in-out",
            overflow: "hidden",
            border: "2px solid white",
          }}
        >
          <img
            src={
              languageMode === languageModes.vi
                ? "/Flag_of_Vietnam.svg"
                : "/Flag_of_the_United_Kingdom.svg"
            }
            alt={languageMode === languageModes.vi ? "Vietnam Flag" : "UK Flag"}
            width="100%"
            height="100%"
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LanguageToggle;
