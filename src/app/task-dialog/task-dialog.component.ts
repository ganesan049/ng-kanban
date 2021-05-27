import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskDialogData,Task,TaskDialogResult } from './task';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:TaskDialogData) { }

    private backupTask:Partial<Task> = {...this.data.task};

  ngOnInit(): void {
  }

  cancel():void{
    this.data.task.title = this.backupTask.title;
    this.data.task.description = this.backupTask.description;
    this.dialogRef.close(this.data);
  }

}
