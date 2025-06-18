export const formatMinuteToSecond = (minute) => {
  const [minutes, seconds] = minute.split(":").map(Number);
  return minutes * 60 + seconds;
};
