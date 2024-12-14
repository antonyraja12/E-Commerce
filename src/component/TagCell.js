import { Tag } from "antd";
import { Component } from "react";

class TagsCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
    };
  }
  getNestedValue(obj, key) {
    const keys = key.split(".");
    return keys.reduce(
      (acc, currentKey) => (acc && acc[currentKey] ? acc[currentKey] : ""),
      obj
    );
  }
  render() {
    const { tags, keyName, valueName } = this.props;
    const { showAll } = this.state;
    const maxDisplayedTags = 2;

    return (
      <>
        {tags?.map((tag, index) => {
          if (!showAll && index > maxDisplayedTags - 1) {
            return null;
          }
          const tagKey = this.getNestedValue(tag, keyName);
          const tagValue = this.getNestedValue(tag, valueName);
          return (
            <Tag color="volcano" key={tagKey}>
              {tagValue}
            </Tag>
          );
        })}

        {!showAll && tags?.length > maxDisplayedTags && (
          <div>
            <a onClick={() => this.setState({ showAll: true })}>
              +{tags?.length - maxDisplayedTags} more
            </a>
          </div>
        )}
        {showAll && tags?.length > maxDisplayedTags && (
          <div>
            <a onClick={() => this.setState({ showAll: false })}>show less</a>
          </div>
        )}
      </>
    );
  }
}
export default TagsCell;
