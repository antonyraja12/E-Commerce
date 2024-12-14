import { Tag } from "antd";
import { Component } from "react";

class TagsCell extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showAll: false,
      };
    }
  
    render() {
      const { tags } = this.props;
      const { showAll } = this.state;
      const maxDisplayedTags = 2;
  
      return (
        <>
          {tags?.map((tag, index) => {
            if (!showAll && index > maxDisplayedTags - 1) {
              return null;
            }
  
            return (
              <Tag color="volcano" key={tag.userLists.userId}>
                {tag.userLists.userName}
              </Tag>
            );
          })}
  
          {!showAll && tags.length > maxDisplayedTags && (
            <div>
                <a onClick={() => this.setState({ showAll: true })}>
                    +{tags.length - maxDisplayedTags} more
                </a>
            </div>
          )}
          {showAll && tags.length > maxDisplayedTags && (
            <div>
                <a onClick={() => this.setState({ showAll: false })}>
                    show less
                </a>
            </div>
          )}
        </>
      );
    }
  }
  export default TagsCell;