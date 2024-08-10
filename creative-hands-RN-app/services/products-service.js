import axios from "axios";

const BACKEND_URL = 'http://creativehandsco.com:61659/';

export async function fetchProducts(expenseData) {
    console.log("Fetching Products");
    
    const getProductsUrl = BACKEND_URL + "Api/Products/GetProducts";

    const respose = await axios.get(getProductsUrl);
 
    const products = [];
    
    for (const key in respose.data) {
        //console.log(respose.data[key]); 
        const productObj = {
            id: respose.data[key].Id,
            title: respose.data[key].Name,
            color: '',
            imageUrl: `http://creativehandsco.com/assets/Images/Categories/Cat${respose.data[key].Id}.jpg`,
        };
        products.push(productObj);
    }
    
    return products;
}
 