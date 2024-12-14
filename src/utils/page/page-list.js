import { message } from "antd";
import { Component } from "react";
import CrudService from "../../services/crud-service";

class PageList extends Component {
  title = "";
  pageId = null;
  state = {
    rows: [],
    isLoading: false,
    access: {
      add: false,
      edit: false,
      delete: false,
      view: false,
    },
  };
  service = new CrudService();

  handleDataRetrieve(data) {
    return data;
  }
  handleData(data) {
    return data?.map((e, i) => ({ sno: i + 1, ...e }));
  }
  retrieve(id) {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.service
      .retrieve(id)
      .then((response) => {
        let changes = this.handleDataRetrieve(response.data);
        this.setState((state) => ({
          ...state,
          data: changes,
          res: changes,
        }));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });
  }
  list(filter = {}) {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.service
      .list(filter)
      .then((response) => {
        let changes = this.handleData(response.data);
        this.setState((state) => ({
          ...state,
          rows: changes,
          res: changes,
        }));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });
  }
  _list(filter) {
    this.service
      .list(filter)
      .then((response) => {
        this.setState({
          ...this.state,
          rows: this.handleData(response.data),
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });
  }
  search = (v, fieldName) => {
    let data = this.state.res.filter((e) =>
      e[fieldName].toLowerCase().includes(v.target.value.toLowerCase())
    );
    if (v.target.value) {
      this.setState((state) => ({ ...state, rows: data }));
    } else {
      this.list();
    }
  };
  componentDidMount() {
    this.list();
  }
  add() {
    this.setState({
      ...this.state,
      popup: {
        open: true,
        mode: "Add",
        title: `Add ${this.title}`,
        id: undefined,
        disabled: false,
      },
    });
    // console.log(this.ref);
  }
  edit(value) {
    this.setState({
      ...this.state,
      popup: {
        open: true,
        mode: "Update",
        title: `Update ${this.title}`,
        id: value,
        disabled: false,
      },
    });
  }
  view(value) {
    this.setState({
      ...this.state,
      popup: {
        open: true,
        mode: "View",
        title: `View ${this.title}`,
        id: value,
        disabled: true,
      },
    });
  }
  onClose = (data) => {
    this.setState(
      { ...this.state, popup: { open: false }, popup1: { open: false } },
      () => {
        if (data) this.list();
      }
    );
  };
  delete(id) {
    this.setState((state) => ({
      ...state,
      isLoading: true,
    }));
    this.service
      .delete(id)
      .then(({ data }) => {
        message.success("Deleted Successfully");
        this.list();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }));
      });
  }
  componentWillUnmount() {
    clearTimeout();
  }
}

export default PageList;
