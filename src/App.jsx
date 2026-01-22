import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import * as bootstrap from 'bootstrap';
import "./assets/style.css"
import ProductModal from './components/productModal';
import Pagination from './components/pagination';
import Login from './views/Login';

const {VITE_API_BASE , VITE_API_PATH} = import.meta.env;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  favorite: "",
};



function App() {
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);

  // 產品表單資料模板
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState(""); // "create", "edit", "delete"
  const [pagination, setPagination] = useState({});

  //modal
  const productModalRef = useRef(null);

  const getProducts = async (page = 1) => {
    try{
      const response = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    }catch (error){
      console.log(error);
    }
  }

  const openModal = (type,product) => {
    setModalType(type);
    setTemplateProduct((pre => ({
      ...INITIAL_TEMPLATE_DATA,
      ...product,
    })));
    console.log('templateProduct_app',templateProduct);
    productModalRef.current.show();
  }

  const closeModal = () => {
    productModalRef.current.hide();
  }

  return (<>
  {!isAuth ? (<Login 
    getProducts={getProducts}
    setIsAuth={setIsAuth}
    productModalRef={productModalRef} />): (
      <div className='container'>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal("create",INITIAL_TEMPLATE_DATA)}>
            建立新的產品
          </button>
        </div>
        <div className="row mt-5">
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>分類</th>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>編輯</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.category}</td> 
                      <td>{product.title}</td> 
                      <td>{product.origin_price}</td> 
                      <td>{product.price}</td> 
                      <td className={`${product.is_enabled ? 'text-success' : ''}`}>
                        {product.is_enabled ? "啟用":"未啟用"}
                      </td>
                      <td>
                        <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-outline-primary btn-sm"
                        onClick={()=> openModal("edit", product)}>編輯</button>
                        <button type="button" className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal("delete", product)}>刪除</button>
                      </div>
                      </td>
                    </tr>
                  ))} 
                </tbody>
              </table>
              <Pagination pagination={pagination} onChangePage={getProducts}/>
        </div>
      </div> )
      }
      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        closeModal={closeModal}
        productModalRef={productModalRef}
        getProducts={getProducts}
      />
  </>
    
      
  )
}

export default App
