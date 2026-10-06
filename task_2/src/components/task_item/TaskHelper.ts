import dayjs from "dayjs"
import TaskCommon from "./TaskCommon"

const TaskHelper = {

  statusList: (
    taskArray, projectId, setStatTasks1, setStatTasks2, setStatTasks3 , setTasks
  ) =>{
      const out = []
      taskArray.forEach((element) => {
        let row = element;
        const dt = dayjs(element.complete)
        console.log(dt.format("YYYY-MM-DD"))
        const startDt = dayjs(element.start_date)
        element.end_date = dt.format("YYYY-MM-DD");
        element.start_date = startDt.format("YYYY-MM-DD");
        out.push(element)
      });              
      setTasks(out)
      const ar = TaskCommon.getStatusArray(out)
      console.log(ar)
      setStatTasks1(ar.ar1)
      setStatTasks2(ar.ar2)
      setStatTasks3(ar.ar3)

  },

}
export default TaskHelper;