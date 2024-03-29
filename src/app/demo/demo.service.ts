import { Injectable } from '@angular/core';
import { DataSource, RequestMetadata, PagedResult, DataSort, DataFilter, NotifyService, arrayPaginate } from 'ng-mazdik-lib-edu';

@Injectable({
  providedIn: 'root'
})
export class DemoService implements DataSource {

  url = 'assets/players.json';
  primaryKeys: string[] = ['id'];

  private dataFilter: DataFilter;
  private dataSort: DataSort;

  constructor(private notifyService: NotifyService) {
    this.dataFilter = new DataFilter();
    this.dataSort = new DataSort();
  }

  getItems(requestMeta: RequestMetadata): Promise<PagedResult> {
    const currentPage = requestMeta.pageMeta.currentPage;
    this.dataFilter.filters = requestMeta.filters;
    this.dataFilter.globalFilterValue = requestMeta.globalFilterValue;
    this.dataSort.sortMeta = requestMeta.sortMeta;
    const perPage = requestMeta.pageMeta.perPage;

    return fetch(this.url).then(res => res.json())
      .then(res => {
        const rows = res || [];
        const filteredData = this.dataFilter.filterRows(rows);
        const sortedData = this.dataSort.sortRows(filteredData);
        const pageData = arrayPaginate(sortedData, currentPage, perPage);
        const totalCount = sortedData.length;
        const pageCount = pageData.length;
        const result = {
          items: pageData,
          _meta: {
            totalCount,
            pageCount,
            currentPage,
            perPage
          }
        } as PagedResult;
        return result;
      })
      .catch(this.handleError.bind(this));
  }

  getItem(row: any): Promise<any> {
    const filters = {};
    for (const key of this.primaryKeys) {
      filters[key] = { value: row[key] };
    }
    const requestMeta = {
      pageMeta: { currentPage: 1 },
      filters,
    } as RequestMetadata;
    return this.getItems(requestMeta)
      .then(data => data.items[0]);
  }

  post(item: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  put(item: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  delete(item: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(item), 250);
    });
  }

  getOptions(url: string, parentId: any): Promise<any> {
    return fetch(url).then(res => res.json())
      .then((response: any) => {
        const result = response.filter((value: any) => {
          return value.parentId === parentId;
        });
        return new Promise((resolve) => {
          setTimeout(() => resolve(result), 1000);
        });
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.notifyService.sendMessage({ title: 'HttpErrorResponse', text: errorMessage, severity: 'error' });
    return Promise.reject(errorMessage);
  }

}
