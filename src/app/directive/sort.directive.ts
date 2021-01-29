import { ElementRef, HostListener } from '@angular/core';
import { Directive, Input, Renderer2 } from '@angular/core';
import { element } from 'protractor';
import { Sort } from '../util/sort';

@Directive({
  selector: '[appSort]'
})
export class SortDirective {

  @Input() appSort : Array<any>;

  constructor(private renderer: Renderer2, private targetElem: ElementRef) {
    this.appSort = new Array<any>();
  }

   @HostListener("click")
   sortData(){
    const sort = new Sort();
    // get reference of current clicked element
    const elem = this.targetElem.nativeElement;
    // get in which order list should be sorted
    const order = elem.getAttribute("data-order");
    // get the property type specially set
    const type = elem.getAttribute("data-type");
    // get the property name
    const property = elem.getAttribute("data-name");
    if (order === "desc"){
      this.appSort.sort(sort.startSort(property, order, type));
      elem.setAttribute("data-order", "asc");
    } 
    else {
      this.appSort.sort(sort.startSort(property, order, type));
      elem.setAttribute("data-order", "desc");
    }
   }
}
