export interface Task{
  id?:string;
  title:string;
  description:string;
}
export interface TaskDialogResult {
  task:Task;
  delete?:boolean;
}
