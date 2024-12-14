import BaseWidget from "./base-widget";
import { TableLibrary } from "../library";

export class TableWidget extends BaseWidget {
  state = {};

  render() {
    const { properties } = this.props;

    return (
      <>
        <TableLibrary {...properties} />
      </>
    );
  }
}
