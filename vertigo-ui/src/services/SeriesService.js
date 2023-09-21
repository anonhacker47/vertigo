import Api from "@/services/Api";

export default {
  getSeries(token, id, orderby, orderdir) {
    return Api().get(
      `users/${id}/series?orderby=${orderby}&orderdir=${orderdir}`,
      token
    );
  },
  addSeries(data) {
    return Api().post("series", data);
  },
  removeSeries(data) {
    return Api().delete(`series/${data}`);
  },
  getSeriesbyId(id) {
    return Api().get(`series/${id}`);
  },
  getImagebyId(id) {
    return Api().defaults.baseURL + `/series/images/${id}`;
  },
  getSeriesKey(token) {
    return Api().get("series/key",
      token
    );
  },
};
