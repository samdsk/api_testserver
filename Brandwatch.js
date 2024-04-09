const { Axios } = require("axios")
const getInstance = require("./customAxios")

const ErrorHandler = async (func) => {
    try {
        const response = await func()
        return response.data
    } catch (error) {
        if(error.response)
            throw new Error(error.response.status)
        else return error
    }
}

class Brandwatch{
    static init(username, password){
        return (async () => {
            const brandWatch = new Brandwatch()
            brandWatch.Axios = await getInstance(username, password)            
            return brandWatch
        })()
    }

    setProjectID(id){
        this.projectID = id;
    }

    async getCurrentUser(){
        return ErrorHandler(() => this.Axios.get("/user"))         
    }

    async getProjects(project = ""){
        if(project !== "")
            project = '/'+project

        return ErrorHandler(() => this.Axios.get("/projects"+project))
    }

    async getTags(){
        return ErrorHandler(() => this.Axios.get(`/projects/${this.projectID}/ruletags`))
    }

    async createTag(tagName, rules=[], queryIds=[]){
        if(!tagName)
            throw new Error("TagName is required")

        return ErrorHandler(() => this.Axios.post(`/projects/${this.projectID}/ruletags`, {
            "name":tagName,
            "rules": rules,
            "queryIds":queryIds
        }))
    }

    async deleteTag(tagID){
        if(!tagID) 
            throw new Error("Tag ID is required")

        return ErrorHandler(() => this.Axios.delete(`/projects/${this.projectID}/ruletags/${tagID}`))
    }

    async getCategories(){
        return ErrorHandler(() => this.Axios.get(`/projects/${this.projectID}/rulecategories`))
    }

    // https://developers.brandwatch.com/docs/creating-categories
    async createCategory(children = [], multiple = true, categoryName){
        if(!categoryName) 
            throw new Error("Name is required");

        return ErrorHandler(() => Axios.post(`/projects/${this.projectID}/rulecategories`,{
            "children":children,
            "multiple":multiple,
            "name":categoryName
        }));
    }

    async deleteCategory(categoryID){
        if(!categoryID)
            throw new Error("Category ID is required")

        return ErrorHandler(() => this.Axios.delete(`/projects/${this.projectID}/rulecategories/${categoryID}`))
    }

    async getRules(){
        return ErrorHandler(() => this.Axios.get(`/projects/${this.projectID}/rules`))
    }

    async deleteRules(ruleID){
        if(!ruleID)
            throw new Error("Rule ID is required")
        return ErrorHandler(() => this.Axios.delete(`/projects/${this.projectID}/rules`))
    }

    async getWorkflow(){
        return ErrorHandler(() => this.Axios.get(`/projects/${this.projectID}/workflow`))
    }

    async getQueriesSummary(){
        return ErrorHandler( () => this.Axios.get(`/projects/${this.projectID}/queries/summary`))
    }
    async getQueriesWithDetails(){
        return ErrorHandler( () => this.Axios.get(`/projects/${this.projectID}/queries`))
    }
    async getQueriesByType(type){
        if(!type || type != 'monitor' || type != 'twitter' || type != 'publicfacebook' || type != 'instagram')
            throw new Error("Type is required! allowed types: monitor, twitter, publicfacebook, instagram")
        return ErrorHandler(() => this.Axios.get(`/projects/${this.projectID}/queries?type=${type}`))
    }

    // https://developers.brandwatch.com/docs/creating-queries
    async queryValidation({queryName, booleanQuery, options:{contentSources, description, imageFilter, languages, locationFilter, lockedQuery, startDate}}){
        
    }

    /* TODO: Lists */


}

module.exports = Brandwatch