import { LightningElement, wire, api, track } from 'lwc';
import getRecords from '@salesforce/apex/DataTableController.getRecords';

const columns = [
    {label: 'Id', fieldName : 'Id', type : 'text'},
    {label: 'First Name', fieldName : 'FirstName', type : 'text'},
    {label: 'Last Name', fieldName : 'LastName', type : 'text'}
    
];
const pageSize = 5;

export default class LightningDataTable extends LightningElement {

    @api sobjecttype;
    @track columns = columns;
    
    @track data;
    
    listOfAllRecords;
    totalRecords;
    startIndex;
    endIndex;
    currentPage;

    get showFirstButton() {
        if(this.currentPage === 1) {
            return true;
        }
        return false;
    }

    get showLastButton() {
        if(Math.ceil(this.totalRecords/pageSize) === this.currentPage) {
            return true;
        }
        return false;
    }

    @wire(getRecords, {sObjectType : '$sobjecttype'})
    wiredResult(result) {
        this.refreshTable = result;
        if(result.data) {
            
            this.listOfAllRecords = result.data;
            this.totalRecords = result.data.length;
            
            const listOfRecords = [];
            for(let i=0; i<pageSize; i++) {
                if(this.listOfAllRecords.length > i) {
                    listOfRecords.push(this.listOfAllRecords[i]);
                }                
            }
            this.data = listOfRecords;
            this.startIndex = 0;
            this.endIndex = pageSize-1;
            this.currentPage = 1;
            this.error = undefined;

        } else if(result.error) {
            this.records = undefined;
            this.error = result.error;
        }
    }

    handleFirstEvent() {
        
        var listOfRecords = [];
        for(let i=0; i<pageSize; i++) {
            listOfRecords.push(this.listOfAllRecords[i]);
        }
        this.data = listOfRecords;
        this.startIndex = 0;
        this.endIndex = pageSize-1;
        this.currentPage = 1;
    }
    handleLastEvent() {
        
        var listOfRecords = [];
        var lastPage = (Math.ceil(this.totalRecords/pageSize) - 1) * pageSize;
        for(let i=lastPage; i<lastPage+pageSize; i++) {
            if(this.listOfAllRecords[i] != null) {
                listOfRecords.push(this.listOfAllRecords[i]);
            }            
        }
        this.data = listOfRecords;
        this.startIndex = (Math.ceil(this.totalRecords/pageSize) - 1) * pageSize;
        this.endIndex = this.listOfAllRecords.length;
        this.currentPage = Math.ceil(this.totalRecords/pageSize);
    }

    handleOnPrevious() {

        let counter = 0;
        var listOfRecords = [];
        var start = this.startIndex;
        var end = this.endIndex;
        var current = this.currentPage;

        for(let i=start-pageSize; i<start; i++) {
            if(i>-1) {
                listOfRecords.push(this.listOfAllRecords[i]);    
            }
            else {
                start++;
            }

            counter++;
        }
        this.data = listOfRecords;
        this.startIndex = start - counter;
        this.endIndex = end - counter;     
        this.currentPage = current - 1;   
    }
    handleOnNext() {

        let counter = 0;
        var listOfRecords = [];
        var end = this.endIndex;
        var start = this.startIndex;
        var current = this.currentPage;

        for(let i=end+1; i<end+pageSize+1; i++) {
            if(this.listOfAllRecords.length > i) {
                listOfRecords.push(this.listOfAllRecords[i]);
            }
            counter++;
        }
        this.data = listOfRecords;
        this.startIndex = start + counter;
        this.endIndex = end + counter;
        this.currentPage = current + 1;
    }

} 