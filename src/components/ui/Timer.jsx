import { useEffect, useState } from "react";

function Timer() {
  const timeFormat = "04/11/2022";
  const [currentTime, setCurrentTime] = useState(new Date());
  const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatTime = (date) => {
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${min}`;
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex flex-col">
      <p className="text-center text-md font-bold">{formatTime(currentTime)}</p>
      <p className="font-bold text-md">{formatDate(currentTime)}</p>
    </div>
  );
}

export default Timer;
