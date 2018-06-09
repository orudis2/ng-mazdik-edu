import { Directive, Input, ElementRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DataTable } from '../base/data-table';
import { Row, CellEventArgs } from '../types';
import { isBlank } from '../base/util';
import { Keys } from '../base/keys';

@Directive({
    selector: '[appBodyKeydown]'
})
export class BodyKeydownDirective implements OnInit, OnDestroy {

    @Input() public table: DataTable;

    element: HTMLElement;

    constructor(element: ElementRef, private ngZone: NgZone) {
        this.element = element.nativeElement;
    }

    ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => {
            this.element.addEventListener('keydown', this.onKeydown.bind(this));
        });
    }

    ngOnDestroy(): void {
        this.element.removeEventListener('keydown', this.onKeydown.bind(this));
    }

    onKeydown(event: any): void {
        const keyCode = event.keyCode;
        const shiftKey = event.shiftKey;

        if (!this.isAction(keyCode)) {
            return;
        }
        let target = event.target;
        if (target === null) { return; }
        while (target !== this.element) {
            if (target.classList.contains('datatable-body-cell')) {
                break;
            }
            target = target.parentNode;
        }
        if (target === this.element) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();

        let columnIndex = target.dataset.columnIndex;
        let rowIndex = target.dataset.rowIndex;
        if (!isBlank(columnIndex) && !isBlank(rowIndex)) {
            columnIndex = parseInt(columnIndex, 10);
            rowIndex = parseInt(rowIndex, 10);

            if (keyCode === Keys.ESCAPE || keyCode === Keys.ENTER) {
                this.table.events.onKeydownCell(<CellEventArgs>{ columnIndex, rowIndex, event });
            }
            [columnIndex, rowIndex] = this.findCell(columnIndex, rowIndex, keyCode, shiftKey);
            const ev = <CellEventArgs>{ columnIndex, rowIndex, event };
            this.table.events.onActivateCell(ev);
        }
    }

    findCell(columnIndex: number, rowIndex: number, keyCode: number, shiftKey: boolean) {
        const maxRowIndex = this.table.rows.length;
        const maxColIndex = this.table.columns.length;

        if (keyCode === Keys.LEFT) {
            columnIndex = (columnIndex > 0) ? columnIndex - 1 : 0;
        } else if (keyCode === Keys.RIGHT) {
            columnIndex = (columnIndex < maxColIndex) ? columnIndex + 1 : 0;
        } else if (keyCode === Keys.UP) {
            rowIndex = (rowIndex > 0) ? rowIndex - 1 : 0;
        } else if (keyCode === Keys.DOWN) {
            rowIndex = (rowIndex < maxRowIndex) ? rowIndex + 1 : 0;
        } else if (keyCode === Keys.TAB && shiftKey) {
            columnIndex = (columnIndex > 0) ? columnIndex - 1 : 0;
        } else if (keyCode === Keys.TAB) {
            columnIndex = (columnIndex < maxColIndex) ? columnIndex + 1 : 0;
        }
        return [columnIndex, rowIndex];
    }

    isAction(keyCode: number): boolean {
        const isAction =
            keyCode === Keys.UP ||
            keyCode === Keys.DOWN ||
            keyCode === Keys.LEFT ||
            keyCode === Keys.RIGHT ||
            keyCode === Keys.TAB ||
            keyCode === Keys.ENTER ||
            keyCode === Keys.ESCAPE;
        return (isAction);
    }

}
