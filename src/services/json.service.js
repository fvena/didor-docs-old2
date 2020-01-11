import ApiService from './api.service';

const JsonService = {
  async getFile(path) {
    try {
      // Request
      const response = await ApiService.get(path);
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export default JsonService;
