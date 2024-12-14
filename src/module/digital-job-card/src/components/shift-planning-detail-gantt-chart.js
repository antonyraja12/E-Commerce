import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useEffect, useState } from "react";

function ShiftPlanningDetailGanttChart(props) {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    setTasks(props.data);
  }, [props.data]);
  return (
    <>{tasks.length > 0 && <Gantt viewMode="Quarter Day" tasks={tasks} />}</>
  );
}

export default ShiftPlanningDetailGanttChart;
