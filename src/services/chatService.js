import axios from 'axios';

const API_URL_AI = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api/chatai/chat';

export const sendMessageToGPT = async (message) => {
  try {
    const response = await axios.post(API_URL_AI, { message });
    return response.data.reply;
  } catch (error) {
    console.error('Error fetching response:', error);
    return 'حدث خطأ، حاول مرة أخرى!';
  }
};
