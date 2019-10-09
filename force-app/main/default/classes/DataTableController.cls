public with sharing class DataTableController {
	

 //using custom meta data type so that admin can add more fields 
    //based on the requirement without modifying the code
    @AuraEnabled(cacheable=true)
    public static list<sObject> getRecords(String sObjectType) {
		
        String fields = [Select Fields__c, Object_Type__c 
                         From Query_Field__mdt 
                         Where Object_Type__c =: sObjectType].Fields__c;
        String query = 'Select ' + fields + ' From ' + sObjectType + ' LIMIT 20';
        list<sObject> queryResult = Database.query(query);
        return queryResult;
		
    }
}
