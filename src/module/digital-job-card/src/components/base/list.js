import { message } from "antd";
import { Component, createRef } from "react";

class List extends Component {
  state = {
    isRetrieveLoading: false,
    isLoading: false,
    isSaving: false,
    dataSource: [],
    isDeleting: false,
    popup: { open: false, title: "", mode: "" },
  };
  ref;
  constructor(props) {
    super(props);
    this.list = this.list.bind(this);
    this.delete = this.delete.bind(this);
    this.add = this.add.bind(this);
    this.view = this.view.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.edit = this.edit.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.submit = this.submit.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.patchForm = this.patchForm.bind(this);
    this.getFormInstance = this.getFormInstance.bind(this);
    this.ref = createRef();
  }
  add() {
    this.setPopupTitle("Add", "add");
    this.openPopup();
  }

  edit(id) {
    this.setPopupTitle("Update", "update");
    this.openPopup(id);
    this.setState((state) => ({ ...state, isRetrieveLoading: true }));
    this.service
      .retrieve(id)
      .then(({ data }) => {
        this.patchForm(data);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isRetrieveLoading: false }));
      });
  }
  view(id) {
    this.setPopupTitle("View", "view");
    this.openPopup(id);
    this.setState((state) => ({ ...state, isRetrieveLoading: true }));
    this.service
      .retrieve(id)
      .then(({ data }) => {
        this.patchForm(data);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isRetrieveLoading: false }));
      });
  }
  retrieve(id) {
    this.setState((state) => ({ ...state, isRetrieveLoading: true }));
    this.service
      .retrieve(id)
      .then(({ data }) => {
        this.setState((state) => ({ ...state, data: data }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isRetrieveLoading: false }));
      });
  }

  list(filter) {
    this.setState((state) => ({ ...state, isLoading: true }));
    this.service
      .list(filter)
      .then(({ data }) => {
        this.setState((state) => ({
          ...state,
          dataSource: this.handleData(data),
        }));
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isLoading: false }));
      });
  }
  delete(id) {
    // this.setState((state) => ({ ...state, isDeleting: true }));
    return this.service.delete(id).then(({ data }) => {
      if (data.success) message.success(data);
      this.list();
    });
  }
  closePopup() {
    this.setState((state) => ({
      ...state,
      popup: { ...state.popup, open: false },
    }));
  }
  openPopup(id = undefined) {
    this.setState((state) => ({
      ...state,
      popup: { ...state.popup, open: true, id: id },
    }));
  }
  componentDidMount() {
    this.list();
  }
  setPopupTitle(str, mode = "") {
    this.setState((state) => ({
      ...state,
      popup: { ...state.popup, title: str, mode: mode },
    }));
  }
  submitForm() {
    let form = this.getFormInstance();
    form.submit();
  }
  patchForm(data) {
    let form = this.getFormInstance();
    form.setFieldsValue(data);
  }
  getFormInstance() {
    return this.ref.current?.ref.current;
  }
  submit(value, id) {
    this.setState((state) => ({ ...state, isSaving: true }));
    let req;
    if (id) req = this.service.update(value, id);
    else req = this.service.add(value);
    req
      .then(({ data }) => {
        this.onSuccess(data);
      })
      .finally(() => {
        this.setState((state) => ({ ...state, isSaving: false }));
      });
  }
  handleData(data) {
    return data.map((e, i) => ({ ...e, sno: i + 1 }));
  }
  onSuccess(data) {
    message.success("Saved Successfully");
    this.list();
    this.closePopup();
  }
}

export default List;
