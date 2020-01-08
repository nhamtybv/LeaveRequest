/*
export interface IUserProfile {
    FirstName: string;  
    LastName: string;      
    Email: string;  
    Title: string;  
    WorkPhone: string;  
    DisplayName: string;  
    Department: string;  
    PictureURL: string;      
}
*/
export interface IUserProfile {
    Id:number;     
    Email: string;  
    Title: string;
    IsSiteAdmin:boolean; 
}
export default IUserProfile;