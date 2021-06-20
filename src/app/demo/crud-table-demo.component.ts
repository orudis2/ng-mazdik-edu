import { Component, OnInit } from '@angular/core';
import { CdtSettings, DataManager, SelectItem, DtMessages, DtMessagesEn, ColumnBase } from 'ng-mazdik-lib-edu';
import { DemoService } from './demo.service';
import { getColumnsPlayers } from './columns';

@Component({
  selector: 'app-basic-demo',
  template: `<app-crud-table [dataManager]="dataManager"></app-crud-table>`
})

export class CrudTableDemoComponent implements OnInit {

  dataManager: DataManager;
  columns: ColumnBase[];

  settings: CdtSettings = new CdtSettings({
    crud: true,
    bodyHeight: 380,
    exportAction: true,
    globalFilter: true,
    columnToggleAction: true,
    clearAllFiltersAction: true,
  });

  messages: DtMessages = new DtMessagesEn({
    titleDetailView: 'Player details',
    titleCreate: 'Create a new player'
  });

  constructor(private service: DemoService) {
    const columns = getColumnsPlayers();
    columns.forEach((x, i) => (i > 0) ? x.editable = true : x.editable = false);
    columns[4].filterValues = this.filterValuesFunc;
    this.dataManager = new DataManager(columns, this.settings, this.service, this.messages);
    this.dataManager.pager.perPage = 20;
  }

  ngOnInit(): void {
    this.dataManager.events.onLoading(true);
    this.columns=getColumnsPlayers();
    let column = this.dataManager.columns.find(x => x.name === 'action');
    column.width=200;
  }

  filterValuesFunc(columnName: string): Promise<SelectItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(
        [
          { id: 'MALE', name: 'MALE' },
          { id: 'FEMALE', name: 'FEMALE' },
        ]
      ), 1000);
    });
  }

}
