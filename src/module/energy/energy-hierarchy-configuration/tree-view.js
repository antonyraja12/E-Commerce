import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { Button, Col, Popover, Row, Space, Tooltip } from "antd";
import { useCenteredTree } from "./centered-tree";
import "./tree-graph.css";
import PureSvgNodeElement from "./pure-svg-node-element";
import { RobotFilled } from "@ant-design/icons";

function BranchTree(props) {
	// console.log("props", props.data);
	const [translate, containerRef] = useCenteredTree();
	const treeStyle = {
		width: "80em",
		height: "38em",
	};
	const [treeData, setTreeData] = useState();
	useEffect(() => {
		// console.log("props.data", props.data);
		if (props.data) setTreeData(props.data);
	}, [props.data]);

	return (
		<div id='treeWrapper' style={treeStyle} ref={containerRef}>
			{props.data.length ? (
				<Tree
					translate={translate}
					rootNodeClassName='node__root'
					branchNodeClassName='node__branch'
					leafNodeClassName='node__leaf'
					data={props.data}
					draggable={true}
					renderCustomNodeElement={(rd3tProps) => (
						<PureSvgNodeElement
							nodeDatum={rd3tProps.nodeDatum}
							toggleNode={rd3tProps.toggleNode}
							orientation={"horizontal"}
							r3Data={rd3tProps}
						/>
					)}
					enableLegacyTransitions={true}
				/>
			) : null}
		</div>
	);
}

export default BranchTree;
