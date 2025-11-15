import axios from 'axios';
import { countries as seed } from '../CountryData';
export class CountryStore {
  constructor(){ this.rows = []; this.keyword = ''; this.loading = false; }
  async load(){
    this.loading = true;
    try{
      const API = import.meta.env.VITE_API || 'http://localhost:8071';
      const { data } = await axios.post(`${API}/api/hrCountry/searchByPage`, { pageIndex:0, pageSize:20, keyword: this.keyword });
      this.rows = (data?.content||[]).map(x=> ({ code:x.code, name:x.name, description:x.description }));
    }catch(e){
      this.rows = seed;
    }finally{
      this.loading = false;
    }
  }
}
