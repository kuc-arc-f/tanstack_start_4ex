
const TaskCommon = {

  getStatusArray: (items: array) => {
    const a1 = items.filter(b => b.status === "none");
    const a2 = items.filter(b => b.status === "working");
    const a3 = items.filter(b => b.status === "completed");
    console.log(a1)

    let ret = {
      ar1: a1,
      ar2: a2,
      ar3: a3,
    }
    return ret;
  },

}
export default TaskCommon;