import { Avatar } from "@mui/material";

const TextAvatar = ({ text }) => {
  const stringToColor = (str) => {
    let hash = 0;
    let color = "#";

    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  return (
    <Avatar
      sx={{ backgroundColor: stringToColor(text), width: 40, height: 40 }}
      children={`${text.split(" ")[0][0]}`}
    />
  );
};

export default TextAvatar;
