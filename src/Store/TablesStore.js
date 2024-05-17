import {defineStore} from 'pinia'
import {ref} from "vue";
export const TablesStore=defineStore('Tables',{
    state:()=>({
        messages:ref([]),
    }),
    actions:{
        InitTables(){
            this.messages = Array(10).fill().map(() => []);
        },
        UpdateTables(index,table){
            this.messages[index]=table;
        },
        DeleteTable(index){
            this.messages[index]=null;
        },
        getMessages(){
            return this.messages;
        }
    }
})