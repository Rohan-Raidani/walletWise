import axios from 'axios'

// const new = " https://walletwise.onrender.com "

// const API_URL = "http://localhost:8000";

const API_URL = "https://walletwise.onrender.com";

export const fetchTransactions = async () => {
    try{
        const response = await axios.get(`${API_URL}/`);
        return response.data;
    }catch(e){
        console.error("Error fetching the transactions:" , error);
        throw e;
    }
};

export const addTransaction = async (money, type) => {
    try {
      const response = await axios.post(`${API_URL}/`, { money, type });
      return response.data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  export const deleteTransaction = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };