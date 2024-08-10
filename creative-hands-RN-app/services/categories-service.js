import axios from "axios";

const BACKEND_URL = 'http://creativehandsco.com:61659/';

export async function fetchCategories(expenseData) {
    console.log("Fetching Categories");
    
    const getCategoriesUrl = BACKEND_URL + "Api/Products/GetCategories";

    const respose = await axios.get(getCategoriesUrl);
 
    const categories = [];
    //http://creativehandsco.com/assets/Images/Categories/Cat8.jpg
    for (const key in respose.data) {
        //console.log(respose.data[key]); 
        const categoryObj = {
            id: respose.data[key].Id,
            title: respose.data[key].Name,
            color: '',
            imageUrl: `http://creativehandsco.com/assets/Images/Categories/Cat${respose.data[key].Id}.jpg`,
        };
        categories.push(categoryObj);
    }
    //console.log("Fetched categories:");
    //console.log(categories);
    return categories;
}

export async function storeExpense(expenseData) {
    const respose = await axios.post(BACKEND_URL + '/expenses.json', expenseData);
    const id = respose.data.name;
    return id;
}

export async function updateExpense(id, expenseData) {
    return axios.put(BACKEND_URL + `/expenses/${id}.json`, expenseData);
}

export function deleteExpense(id) {
    return axios.delete(BACKEND_URL + `/expenses/${id}.json`);
}