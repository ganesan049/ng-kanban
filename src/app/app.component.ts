import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { Task, TaskDialogResult } from './task';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

const getObservable = (collections:AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collections.valueChanges({idField:'id'}).subscribe((val:Task[]) => {
    subject.next(val);
  })
  return subject;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private dialog:MatDialog, private store:AngularFirestore){

  }
  title = 'kanban';
  // todo:Task[] = [
  //       {
  //     title: 'Buy milk',
  //     description: 'Go to the store and buy milk'
  //   },
  //   {
  //     title: 'Create a Kanban app',
  //     description: 'Using Firebase and Angular create a Kanban app!'
  //   }
  // ]
  // inProgress:Task[] = [];
  // done:Task[] = [];

  todo = getObservable(this.store.collection('todo'));
  inProgress = getObservable(this.store.collection('inProgress'));
  done = getObservable(this.store.collection('done'));

  drop(event:CdkDragDrop<Task[]|null>):void{
    if(event.previousContainer == event.container){
      return;
    }
    if(!event.container.data || !event.previousContainer.data){
      return;
    }
    // console.log(event)
    // const item = event.previousContainer.data[event.previousIndex];
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    )
  }
  editTask(list:'todo'|'done'|'inProgress',task:Task):void{
    const dialogRef = this.dialog.open(TaskDialogComponent,
      {
        width:'270px',
        data:{
          task,
          enableDelete:true
        }
      });
    dialogRef.afterClosed()
      .subscribe((result:TaskDialogResult) => {
        // const dataList = this[list];
        // // console.log(...dataList," dataList",list,task,this);
        // const taskIndex = dataList.indexOf(task);
        // if(result.delete){
        //   dataList.splice(taskIndex,1);
        // }else{
        //   dataList[taskIndex] = result.task;
        // }
        if(result.delete){
          this.store.collection(list).doc(task.id).delete();
        }else{
          this.store.collection(list).doc(task.id).update(task);
        }
      })
  }
  newTask(){
    const dialogRef = this.dialog.open(TaskDialogComponent,
      {
        width:'270px',
        data:{
          task:{},
        }
      });
    dialogRef
      .afterClosed()
      .subscribe((result:TaskDialogResult) => {
        // this.todo.push(result.task)
        this.store.collection('todo').add(result.task);
      })
  }
}
