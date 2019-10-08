public with sharing class DataTableController {
	
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