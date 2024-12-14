import {
  Button,
  Col,
  Divider,
  Row,
  Space,
  Image,
  Spin,
  Card,
  Modal,
  Input,
  Form,
  Empty,
  Tooltip,
} from "antd";
import { Component } from "react";
import Doc360Service from "../../../services/doc-360-service/doc-360-service";
import { ExceptionOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { Spa } from "@material-ui/icons";
class ManualPage extends Component {
  doc360Service = new Doc360Service();
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      articles: [],
      isLoading: false,
      htmlContent: "",
      openDocModal: false,
      modalTitle: "",
      categoryId: null,
    };
  }

  componentDidMount() {
    this.getAllCategories();
  }
  closeDocModal = () => {
    this.setState((state) => ({ ...state, openDocModal: false }));
  };
  getArticleById = (articleId) => {
    this.setState({ isLoading: true });
    const articleData = this.state.articles.find((e) => e.id === articleId);
    let htmlContent = articleData?.html_content || ""; // Ensure htmlContent is a string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = doc.querySelectorAll("img");
    images.forEach((img) => {
      img.style.width = "100%";
    });
    htmlContent = doc.documentElement.innerHTML;
    this.setState({
      htmlContent,
      isLoading: false,
      openDocModal: true,
      modalTitle: articleData?.title,
    });
  };

  getArticlesByCategory = (categoryId) => {
    this.setState((state) => ({
      ...state,
      articles: [],
      isLoading: true,
      categoryId: categoryId,
    }));
    this.doc360Service.getCategory(categoryId).then(({ data }) => {
      this.setState({ isLoading: true });
      const articlePromises = data.data?.articles.map((article) => {
        return this.doc360Service.getArticle(article.id).then(({ data }) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(
            data.data?.html_content,
            "text/html"
          );
          const imgElement = doc.querySelector("img");
          const para = doc.querySelector("p");
          const imgSrc = imgElement ? imgElement.getAttribute("src") : "";
          const p = para ? para : "";
          return {
            ...data.data,
            imgSrc: imgSrc,
            paragraph: p,
          };
        });
      });

      Promise.all(articlePromises)
        .then((articlesData) => {
          this.setState((prevState) => ({
            articles: [...prevState.articles, ...articlesData],
          }));
        })
        .finally(() =>
          this.setState((state) => ({ ...state, isLoading: false }))
        );
    });
  };

  getFilteredData = (value) => {
    if (value.input) {
      this.setState((state) => ({ ...state, articles: [], isLoading: true }));
      this.doc360Service
        .getProjectVersion("8555a1f6-95ba-4cbe-bea7-df373db5979f", {
          searchQuery: value.input,
        })
        .then(({ data }) => {
          const articlePromises = data.data?.hits?.map((article) => {
            return this.doc360Service
              .getArticle(article.articleId)
              .then(({ data }) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                  data.data?.html_content,
                  "text/html"
                );
                const imgElement = doc.querySelector("img");
                const para = doc.querySelector("p");
                const imgSrc = imgElement ? imgElement.getAttribute("src") : "";
                const p = para ? para : "";
                return {
                  ...data.data,
                  imgSrc: imgSrc,
                  paragraph: p,
                };
              });
          });
          Promise.all(articlePromises)
            .then((articlesData) => {
              if (articlesData) {
                this.setState((prevState) => ({
                  articles: [...prevState.articles, ...articlesData],
                }));
              }
            })
            .finally(() =>
              this.setState((state) => ({ ...state, isLoading: false }))
            );
        });
    }
  };

  getAllArticles = () => {
    this.doc360Service
      .listAllArticles("8555a1f6-95ba-4cbe-bea7-df373db5979f")
      .then(({ data }) => {
        this.setState({ isLoading: true });
        const articlePromises = data.data.map((article) => {
          return this.doc360Service.getArticle(article.id).then(({ data }) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(
              data.data?.html_content,
              "text/html"
            );
            const imgElement = doc.querySelector("img");
            const imgSrc = imgElement ? imgElement.getAttribute("src") : "";

            if (data.data)
              return {
                ...data.data,
                imgSrc: imgSrc,
              };
          });
        });

        Promise.all(articlePromises)
          .then((articlesData) => {
            this.setState((prevState) => ({
              articles: [...prevState.articles, ...articlesData],
            }));
          })
          .finally(() =>
            this.setState((state) => ({ ...state, isLoading: false }))
          );
      });
  };
  getAllCategories = () => {
    this.doc360Service
      .listAllCategories("8555a1f6-95ba-4cbe-bea7-df373db5979f")
      .then(({ data }) => {
        // console.log("data.data[0]?.child_categories[0].id", data.data);
        this.getArticlesByCategory(data.data[0]?.child_categories[0].id);
        this.setState((state) => ({
          ...state,
          categories: data.data[0]?.child_categories,
        }));
      });
  };

  parseHTML = (props) => {
    if (props) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(props.htmlData, "text/html");
      const paragraphs = doc.querySelectorAll("p");
      const paragraphTexts = Array.from(paragraphs).map((e) =>
        e?.innerText.length > 200 ? e?.innerText.toString() : null
      );
      let para = "";
      const paragraph = paragraphTexts.map((el) =>
        el ? (
          el.length > 200 ? (
            (para = el
              .toString()
              .replace(/[^\w\s]/gi, "")
              .replace(/\s+/g, " "))
          ) : (
            <Empty description="No Text Data" />
          )
        ) : null
      );
      if (para.toString()) return para.toString();
      else return <Empty description="No Text Data" />;
    }
  };
  render() {
    this.parseHTML();
    return (
      <Spin spinning={this.state.isLoading}>
        <Form
          size="medium"
          onFinish={this.getFilteredData}
          style={{ height: "40px" }}
        >
          <Space>
            <Col>
              <Form.Item name={"input"}>
                <Input
                  // style={{ width: "75%" }}
                  placeholder="Search In Articles"
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="sumbit">
                  Go
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Link
                  to={`https://maxbyte-poc.document360.io/docs/operators-manual`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* <Tooltip title={"Ask Eddy"}> */}
                  <Button type="primary" icon={<BsStars />}>
                    Ask Eddy
                  </Button>
                  {/* </Tooltip> */}
                </Link>
              </Form.Item>
            </Col>

            <Col>
              <Form.Item>
                <Link
                  to={"https://maxbyte-poc.document360.io/"}
                  target="_blank"
                >
                  {/* <Tooltip title={"Knowledge Base"}> */}
                  <Button type="primary" icon={<ExceptionOutlined />}></Button>
                  {/* </Tooltip> */}
                </Link>
              </Form.Item>
            </Col>
          </Space>
        </Form>
        <Divider style={{ margin: 5 }} />
        <div
          style={{ overflowX: "auto", whiteSpace: "nowrap", padding: "10px" }}
        >
          <Space direction="horizontal" style={{ gap: "10px" }}>
            {this.state.categories.map((e, index) => (
              <Button
                key={e.id}
                shape="round"
                onClick={() => {
                  this.getArticlesByCategory(e.id);
                  //   this.setState({ categoryId: e.id });
                }}
              >
                {e.name}
              </Button>
            ))}
          </Space>
        </div>
        <Divider style={{ margin: 5 }} />
        <div
          style={{
            maxHeight: "250px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {this.state.articles.map((e) =>
            e?.html_content ? (
              <>
                <Card
                  key={e.id}
                  hoverable={true}
                  onClick={() => this.getArticleById(e.id)}
                >
                  <Row gutter={[16, 16]} wrap={false} align="middle">
                    <Col flex="none">
                      {/* <img src="/byteFactory.png" alt="Logo" style={{ height: 30 }} /> */}
                      <Image
                        preview={false}
                        style={{
                          borderRadius: "10%",
                          border: "1px solid #d3d3d3", // Change color code as needed
                        }}
                        // fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                        height={75}
                        width={75}
                        // src={}
                        src={
                          e.imgSrc ? e.imgSrc : "/manualPageDefaultImage.png"
                        }
                      />
                    </Col>
                    <Col flex="auto">
                      <div
                        style={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          whiteSpace: "none",
                          fontWeight: "bold",
                          marginTop: "3px",
                          textAlign: "justify",
                        }}
                      >
                        {e?.html_content ? (
                          <this.parseHTML htmlData={e?.html_content} />
                        ) : (
                          <Empty />
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card>
                <Divider style={{ margin: 5 }} />
              </>
            ) : null
          )}
        </div>
        <Modal
          title={this.state.modalTitle}
          open={this.state.openDocModal}
          onCancel={this.closeDocModal}
          onOk={this.closeDocModal}
          cancelButtonProps={{ style: { display: "none" } }}
          destroyOnClose
          width={800}
          bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: this.state.htmlContent }}
            style={{ fontFamily: "Nunito,sans-serif", overflow: "hidden" }}
          ></div>
        </Modal>
      </Spin>
    );
  }
}

export default ManualPage;
