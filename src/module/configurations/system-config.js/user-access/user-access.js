import React, { Component } from "react";
import {
  Table,
  Checkbox,
  Button,
  Form,
  Select,
  message,
  Tooltip,
  Result,
  Spin,
} from "antd";
import Page from "../../../utils/page/page";
import RoleService from "../../../services/role-service";
import MenuListService from "../../../services/menu-list-service";
import UserAccessBulkService from "../../../services/user-access-bulk-services";
import UserAccessService from "../../../services/user-access-service";
import { withRouter } from "../../../utils/with-router";
import { withAuthorization } from "../../../utils/with-authorization";
import CurrentUserService from "../../../services/user-list-current-user-service";
import { feature } from "caniuse-lite";
class UserAccess extends Component {
  menuListService = new MenuListService();
  roleService = new RoleService();
  userAccessService = new UserAccessService();
  userAccessBulkService = new UserAccessBulkService();
  currentUserService = new CurrentUserService();

  state = {
    data: [],
    rawData: [],
    updatedRawData: [],
    role: [],
    userAccessData: [],
    selectedRoleId: null,
    selectedMenu: "",
    commonFeature: {},
    ActionItems: {},
    currentuser: {},
  };

  componentDidMount() {
    Promise.all([
      this.menuListService.list(),
      this.roleService.list(),
      this.currentUserService.getUser(),
    ]).then(([response1, response2, response3]) => {
      const filteredData = this.menuListService.convertTree(response1.data);
      this.setState(
        {
          rawData: response1.data,

          data: this.removeEmptyChildren(filteredData),
          selectedMenu: this.removeEmptyChildren(filteredData),
          role: response2.data,
          ActionItems: this.getCheckedItems(
            this.removeEmptyChildren(filteredData)
          ),
          currentuser: response3.data,
        },
        () => {
          console.log("this.raw", this.state.rawData);
          if (this.props.params.id != null) {
            const filterRoleName = this.state.role.filter(
              (roleItem) => roleItem.roleId === parseInt(this.props.params.id)
            );
            if (filterRoleName.length > 0) {
              this.onSelectRole(filterRoleName[0].roleName);
            }
          }
        },
        this.shortCommonFeatures(filteredData)
      );
    });
    // .catch((error) => {
    //   message.error("Error fetching data:", error);
    // });
  }

  getCheckedItems = (filteredData) => {
    const ActionItems = {};
    Object.keys(filteredData).forEach((key) => {
      ActionItems[filteredData[key].key] = false;
    });
    return ActionItems;
  };

  handleSubmit = () => {
    const updatedData = this.state.updatedRawData.map((item) => ({
      menuId: item.menuId ? item.menuId : item.key,
      roleId: this.state.selectedRoleId,
      feature: item.userAccessFeatureMappings.flatMap((mapping) => {
        return mapping.userAccessFeature.status
          ? [mapping.userAccessFeature.featureName]
          : [];
      }),
    }));
    if (this.state.selectedRoleId) {
      this.userAccessBulkService
        .add(updatedData)
        .then((response) => {
          message.success("Data saved successfully");
        })
        .catch((error) => {
          message.error("Error occurred while saving data!");
        });
    } else {
      message.error("Please select the role!");
    }
  };

  // removeEmptyChildren = (data) => {
  //   return data.map((item) => {
  //     // Ensure userAccessFeatureMappings is an array
  //     const userAccessFeatureMappings = Array.isArray(
  //       item.userAccessFeatureMappings
  //     )
  //       ? item.userAccessFeatureMappings
  //       : [];

  //     const sortedFeatures = userAccessFeatureMappings
  //       .flatMap((mapping) => mapping.userAccessFeature)
  //       .filter((feature) => feature) // Filter out any undefined or null features
  //       .sort((a, b) => a.featureName.localeCompare(b.featureName));

  //     const updatedMappings = userAccessFeatureMappings.map(
  //       (mapping, index) => {
  //         const sortedFeature = sortedFeatures[index];
  //         if (sortedFeature) {
  //           // Ensure sortedFeature is defined
  //           if (this.state.selectedRoleId === null) {
  //             sortedFeature.status = false;
  //             sortedFeature.disabled = true;
  //           } else {
  //             sortedFeature.disabled = false;
  //           }
  //         }
  //         return {
  //           ...mapping,
  //           userAccessFeature: sortedFeature,
  //         };
  //       }
  //     );

  //     const newItem = {
  //       key: item.menuId,
  //       parentId: item.parentId,
  //       menuName: item.menuName,
  //       userAccessFeatureMappings: updatedMappings,
  //     };

  //     if (item.children && item.children.length > 0) {
  //       newItem.children = this.removeEmptyChildren(item.children);
  //     }

  //     return newItem;
  //   });
  // };
  removeEmptyChildren = (data) => {
    return data.map((item) => {
      // Ensure userAccessFeatureMappings is an array
      const userAccessFeatureMappings = Array.isArray(
        item.userAccessFeatureMappings
      )
        ? item.userAccessFeatureMappings
        : [];

      // Filter out any mappings that do not have userAccessFeature defined
      const validMappings = userAccessFeatureMappings.filter(
        (mapping) => mapping && mapping.userAccessFeature
      );

      const sortedFeatures = validMappings
        .map((mapping) => mapping.userAccessFeature)
        .sort((a, b) => a.featureName.localeCompare(b.featureName));

      const updatedMappings = validMappings.map((mapping, index) => {
        const sortedFeature = sortedFeatures[index];
        if (sortedFeature) {
          if (this.state.selectedRoleId === null) {
            sortedFeature.status = false;
            sortedFeature.disabled = true;
          } else {
            sortedFeature.disabled = false;
          }
        }
        return {
          ...mapping,
          userAccessFeature: sortedFeature,
        };
      });

      const newItem = {
        key: item.menuId,
        parentId: item.parentId,
        menuName: item.menuName,
        userAccessFeatureMappings: updatedMappings,
      };

      if (Array.isArray(item.children) && item.children.length > 0) {
        newItem.children = this.removeEmptyChildren(item.children);
      }

      return newItem;
    });
  };

  onSelectMenu = (selectedValues) => {
    let filteredMenus = this.state.data;
    if (selectedValues.length > 0) {
      filteredMenus = this.state.data.filter((item) =>
        selectedValues.includes(item.menuName)
      );
    }
    this.setState({ selectedMenu: filteredMenus });
  };

  onSelectRole = (value) => {
    console.log(value, "roleid");
    const filterRole = this.state.role.filter(
      (roleItem) => roleItem.roleName === value
    );

    const roleId = filterRole.length > 0 ? filterRole[0].roleId : null;
    this.userAccessService.retrieveByRoleId(roleId).then((response) => {
      const userAccessData = response.data;
      const updatedData = this.updateDataWithUserAccessData(userAccessData);
      const filteredData = this.menuListService.convertTree(updatedData);

      this.setState(
        {
          selectedRoleId: roleId,
          userAccessData: userAccessData,
          updatedRawData: updatedData,
        },
        () => {
          this.handleMenuSelection(filteredData);
        }
      );
    });
  };

  handleMenuSelection = (filteredData) => {
    switch (true) {
      case this.state.selectedMenu.length < this.state.data.length &&
        this.state.selectedRoleId !== null &&
        this.state.userAccessData.length >= 0:
        const filteredSelectedMenus = this.removeEmptyChildren(
          filteredData
        ).filter((item) =>
          this.state.selectedMenu
            .map((selectedItem) => selectedItem.menuName)
            .includes(item.menuName)
        );
        this.setState(
          {
            data: this.removeEmptyChildren(filteredData),
            selectedMenu: filteredSelectedMenus,
            commonFeature: this.handleCommonFeatureOnSelectRole(
              this.removeEmptyChildren(filteredData)
            ),
          },
          () => {
            const updatedCommonFeature = this.state.commonFeature;
            const ActionItems =
              this.handleActionItemsOnSelectRole(updatedCommonFeature);
            this.setState({ ActionItems: ActionItems });
          }
        );
        break;
      case this.state.selectedMenu.length > 1 &&
        this.state.selectedRoleId !== null &&
        this.state.userAccessData.length >= 0:
        this.setState(
          {
            data: this.removeEmptyChildren(filteredData),
            selectedMenu: this.removeEmptyChildren(filteredData),
            commonFeature: this.handleCommonFeatureOnSelectRole(
              this.removeEmptyChildren(filteredData)
            ),
          },
          () => {
            const updatedCommonFeature = this.state.commonFeature;
            const ActionItems =
              this.handleActionItemsOnSelectRole(updatedCommonFeature);
            this.setState({ ActionItems: ActionItems });
          }
        );
        break;

      default:
        break;
    }
  };

  // updateDataWithUserAccessData = (userAccessData) => {
  //   const rawDataCopy = JSON.parse(JSON.stringify(this.state.rawData));
  //   const updatedData = rawDataCopy.map((rawItem) => {
  //     const userAccessItem = userAccessData.find(
  //       (userDataItem) => userDataItem.menuId === rawItem.menuId
  //     );
  //     let status = false;
  //     if (userAccessItem) {
  //       const userAccessFeatures = userAccessItem.feature || [];
  //       rawItem.userAccessFeatureMappings.forEach((item) => {
  //         status = userAccessFeatures.includes(
  //           item.userAccessFeature.featureName
  //         );
  //         item.userAccessFeature.status = status;
  //       });
  //       return rawItem;
  //     } else {
  //       rawItem.userAccessFeatureMappings.forEach((item) => {
  //         item.userAccessFeature.status = status;
  //       });
  //       return rawItem;
  //     }
  //   });
  //   return updatedData;
  // };
  updateDataWithUserAccessData = (userAccessData) => {
    const rawDataCopy = JSON.parse(JSON.stringify(this.state.rawData));
    const updatedData = rawDataCopy.map((rawItem) => {
      const userAccessItem = userAccessData.find(
        (userDataItem) => userDataItem.menuId === rawItem.menuId
      );
      let status = false;
      if (userAccessItem) {
        const userAccessFeatures = userAccessItem.feature || [];
        if (Array.isArray(rawItem.userAccessFeatureMappings)) {
          rawItem.userAccessFeatureMappings.forEach((item) => {
            if (
              item &&
              item.userAccessFeature &&
              item.userAccessFeature.featureName
            ) {
              status = userAccessFeatures.includes(
                item.userAccessFeature.featureName
              );
              item.userAccessFeature.status = status;
            }
          });
        }
      } else {
        if (Array.isArray(rawItem.userAccessFeatureMappings)) {
          rawItem.userAccessFeatureMappings.forEach((item) => {
            if (item && item.userAccessFeature) {
              item.userAccessFeature.status = status;
            }
          });
        }
      }
      return rawItem;
    });
    return updatedData;
  };

  updateMappings = (node, userDataItem) => {
    if (node.children && node.children.length > 0) {
      const updatedChildren = node.children.map((child) =>
        this.updateMappings(child, userDataItem)
      );
      return { ...node, children: updatedChildren };
    } else {
      if (userDataItem && node.key === userDataItem.menuId) {
        const updatedUserAccessFeatureMappings =
          node.userAccessFeatureMappings.map((mapping) => {
            const featureStatus = userDataItem.feature.includes(
              mapping.userAccessFeature.featureName
            );
            return {
              ...mapping,
              userAccessFeature: {
                ...mapping.userAccessFeature,
                status: featureStatus,
              },
            };
          });
        return {
          ...node,
          userAccessFeatureMappings: updatedUserAccessFeatureMappings,
        };
      }
    }
    return node;
  };

  updateFeatureStatus = (
    isChecked,
    rowIndex,
    key,
    featureIndex,
    userAccessFeatureMappings
  ) => {
    if (
      userAccessFeatureMappings &&
      userAccessFeatureMappings.length > featureIndex
    ) {
      const updatedUserAccessFeatureMappings = [...userAccessFeatureMappings];
      updatedUserAccessFeatureMappings[featureIndex].userAccessFeature.status =
        isChecked;
      this.setState(
        (prevState) => ({
          data: prevState.data.map((item) =>
            item.key === rowIndex
              ? {
                  ...item,
                  userAccessFeatureMappings: updatedUserAccessFeatureMappings,
                }
              : item
          ),
        }),
        () => {
          this.updateCommonFeatureStatus(key);
        }
      );
    }
  };

  getSelectedRoleName = () => {
    const { role, selectedRoleId } = this.state;
    if (selectedRoleId) {
      const selectedRole = role.find((item) => item.roleId === selectedRoleId);
      return selectedRole ? selectedRole.roleName : undefined;
    }
    return undefined;
  };

  handleActionCheckboxChange = (menuKey, checked) => {
    this.setState(
      (prevState) => {
        const updatedCheckedItems = {
          ...prevState.ActionItems,
          [menuKey]: checked,
        };

        const updatedFeatureData = prevState.commonFeature[menuKey].map(
          (item) => ({
            ...item,
            status: checked,
          })
        );

        return {
          ActionItems: updatedCheckedItems,
          commonFeature: {
            ...prevState.commonFeature,
            [menuKey]: updatedFeatureData,
          },
        };
      },
      () => {
        const data = this.updateStatusRecursive(
          this.state.selectedMenu,
          menuKey,
          checked
        );
        this.setState({ selectedMenu: data });
      }
    );
  };

  updateStatusRecursive = (menuItems, menuKey, checked, featureName) => {
    const filteredItems = menuItems.filter(
      (menuItem) => menuItem.key === menuKey
    );
    const updateStatus = (items) => {
      items.forEach((menuItem) => {
        if (Array.isArray(menuItem.userAccessFeatureMappings)) {
          menuItem.userAccessFeatureMappings.forEach((mapping) => {
            if (mapping.userAccessFeature) {
              if (featureName) {
                if (mapping.userAccessFeature.featureName === featureName) {
                  mapping.userAccessFeature.status = checked;
                }
              } else {
                mapping.userAccessFeature.status = checked;
              }
            }
          });
        }
        if (menuItem.children && menuItem.children.length > 0) {
          updateStatus(menuItem.children);
        }
      });
    };
    updateStatus(filteredItems);

    return menuItems;
  };

  // shortCommonFeatures = (data, commonFeatureData = {}) => {
  //   data.forEach((item) => {
  //     if (item.parentId === null) {
  //       const filterFeatures = [];
  //       const collectFeatures = (menu) => {
  //         if (Array.isArray(menu.userAccessFeatureMappings)) {
  //           menu.userAccessFeatureMappings.forEach((mapping) => {
  //             if (
  //               mapping.userAccessFeature &&
  //               !filterFeatures.includes(mapping.userAccessFeature.featureName)
  //             ) {
  //               filterFeatures.push(mapping.userAccessFeature.featureName);
  //             }
  //           });
  //         }
  //         if (Array.isArray(menu.children)) {
  //           menu.children.forEach((child) => collectFeatures(child));
  //         }
  //       };
  //       collectFeatures(item);
  //       filterFeatures.sort();
  //       const uniqueCommonFeature = filterFeatures.map((featureName) => {
  //         return { featureName, status: false };
  //       });
  //       commonFeatureData[item.menuId] = uniqueCommonFeature;
  //     }
  //   });
  //   this.setState({ commonFeature: commonFeatureData });
  // };
  shortCommonFeatures = (data, commonFeatureData = {}) => {
    data.forEach((item) => {
      if (item.parentId === null) {
        const filterFeatures = [];
        const collectFeatures = (menu) => {
          if (Array.isArray(menu.userAccessFeatureMappings)) {
            menu.userAccessFeatureMappings.forEach((mapping) => {
              if (
                mapping &&
                mapping.userAccessFeature &&
                !filterFeatures.includes(mapping.userAccessFeature.featureName)
              ) {
                filterFeatures.push(mapping.userAccessFeature.featureName);
              }
            });
          }
          if (Array.isArray(menu.children)) {
            menu.children.forEach((child) => collectFeatures(child));
          }
        };
        collectFeatures(item);
        filterFeatures.sort();
        const uniqueCommonFeature = filterFeatures.map((featureName) => {
          return { featureName, status: false };
        });
        commonFeatureData[item.menuId] = uniqueCommonFeature;
      }
    });
    this.setState({ commonFeature: commonFeatureData });
  };

  handleCommonFeature = (checked, itemKey, featureName) => {
    this.setState((prevState) => {
      const updatedFeatureData = prevState.commonFeature[itemKey].map((item) =>
        item.featureName === featureName ? { ...item, status: checked } : item
      );

      const allChecked = updatedFeatureData.every(
        (item) => item.status === true
      );
      const updatedCheckedItems = { ...prevState.ActionItems };

      if (allChecked) {
        updatedCheckedItems[itemKey] = true;
      } else {
        delete updatedCheckedItems[itemKey];
      }

      const updatedMenu = this.updateStatusRecursive(
        prevState.selectedMenu,
        itemKey,
        checked,
        featureName
      );

      if (featureName.toLowerCase() === "view" && checked === false) {
        let updatedCommonFeature = { ...prevState.commonFeature };
        updatedCommonFeature[itemKey] = updatedCommonFeature[itemKey].map(
          (item) => ({
            ...item,
            status: false,
          })
        );
        return {
          commonFeature: updatedCommonFeature,
          ActionItems: updatedCheckedItems,
          selectedMenu: updatedMenu,
        };
      }

      return {
        commonFeature: {
          ...prevState.commonFeature,
          [itemKey]: updatedFeatureData,
        },
        ActionItems: updatedCheckedItems,
        selectedMenu: updatedMenu,
      };
    });
    if (featureName.toLowerCase() === "view" && checked === false) {
      this.updateFeaturesOnCommonFeature(itemKey);
    }
  };

  flattenTree = (node, flattened = []) => {
    if (node.children) {
      flattened.push({ ...node, children: [] });
      node.children.forEach((child) => this.flattenTree(child, flattened));
    } else {
      flattened.push(node);
    }
    return flattened;
  };

  updateFeaturesOnCommonFeature = (itemKey) => {
    this.setState((prevState) => {
      const newData = JSON.parse(JSON.stringify(prevState.data));
      const nodeToUpdate = newData.find((node) => node.key === itemKey);
      const flattenedTree = this.flattenTree(nodeToUpdate);
      flattenedTree.forEach((node) => {
        if (node.userAccessFeatureMappings) {
          node.userAccessFeatureMappings.forEach((mapping) => {
            mapping.userAccessFeature.status = false;
          });
        }
      });

      let flattened = [];
      newData.forEach((node) => {
        flattened = this.flattenTree(node, flattened);
      });

      return {
        data: newData,
        selectedMenu: newData,
        updatedRawData: flattened,
      };
    });
  };

  handleCommonFeatureOnSelectRole = (selectedMenu) => {
    const updatedCommonFeature = {};
    Object.keys(this.state.commonFeature).forEach((key) => {
      const commonFeatureArray = this.state.commonFeature[key].map(
        (commonFeature) => {
          const filteredData = selectedMenu.filter(
            (menuItem) => parseInt(key) === menuItem.key
          );
          const flattenedData = this.flattenMenuData(filteredData);
          const featureStatus = this.getCommonFeatureStatus(
            commonFeature,
            flattenedData
          );
          return { ...commonFeature, status: featureStatus };
        }
      );

      updatedCommonFeature[key] = commonFeatureArray;
    });

    return updatedCommonFeature;
  };

  getCommonFeatureStatus = (commonFeature, flattenedData) => {
    let status = false;
    for (let i = 0; i < flattenedData.length; i++) {
      const featureItem = flattenedData[i];
      if (featureItem.featureName === commonFeature.featureName) {
        if (featureItem.status) {
          status = true;
        } else {
          status = false;
          break;
        }
      }
    }
    return status;
  };

  flattenMenuData = (menuData) => {
    const flatten = (data, result = []) => {
      if (Array.isArray(data)) {
        data.forEach(({ userAccessFeatureMappings, children }) => {
          if (
            userAccessFeatureMappings &&
            userAccessFeatureMappings.length > 0
          ) {
            userAccessFeatureMappings.forEach(({ userAccessFeature }) => {
              result.push(userAccessFeature);
            });
          }
          if (children && children.length > 0) {
            flatten(children, result);
          }
        });
      } else if (data && typeof data === "object") {
        const { userAccessFeatureMappings, children } = data;
        if (userAccessFeatureMappings && userAccessFeatureMappings.length > 0) {
          userAccessFeatureMappings.forEach(({ userAccessFeature }) => {
            result.push(userAccessFeature);
          });
        }
        if (children && children.length > 0) {
          flatten(children, result);
        }
      }
      return result;
    };

    return flatten(menuData);
  };

  updateCommonFeatureStatus = (key) => {
    const filteredMenu = this.state.selectedMenu.filter(
      (item) => item.key === key
    );
    if (filteredMenu.length === 0) {
      const data = this.state.rawData.find((item) => item.menuId === key);
      if (data && data.parentId !== null) {
        this.updateCommonFeatureStatus(data.parentId);
      } else if (data && data.parentId === null) {
        this.updateCommonFeatureStatus(data.menuId);
      }
      return;
    }
    const updatedCommonFeature = { ...this.state.commonFeature };

    updatedCommonFeature[key] = updatedCommonFeature[key].map(
      (commonFeature) => {
        const flattenedData = this.flattenMenuData(filteredMenu);
        const featureStatus = this.getCommonFeatureStatus(
          commonFeature,
          flattenedData
        );
        return { ...commonFeature, status: featureStatus };
      }
    );

    this.setState({ commonFeature: updatedCommonFeature }, () => {
      this.updatedActionItems(filteredMenu);
    });
  };

  updatedActionItems = (filteredMenu) => {
    const updatedActionItems = { ...this.state.ActionItems };
    Object.keys(updatedActionItems).forEach((key) => {
      const menuExists = filteredMenu.some(
        (menu) => menu.key === parseInt(key)
      );
      if (menuExists) {
        updatedActionItems[key] = true;
      }
    });
    this.setState({ ActionItems: updatedActionItems });
  };

  handleActionItemsOnSelectRole = (commonFeature) => {
    const updatedCheckedItems = {};
    for (let key in commonFeature) {
      let result = false;
      result = commonFeature[key].every((eachItem) => {
        return eachItem.status === true;
      });
      updatedCheckedItems[key] = result;
    }
    return updatedCheckedItems;
  };

  getIndeterminate = (key) => {
    const commonFeatureArray = this.state.commonFeature[key];
    const unCheckAll = commonFeatureArray.every((item) => {
      return item.status === false;
    });
    const checkAll = commonFeatureArray.every((item) => {
      return item.status === true;
    });
    let indeterminate = commonFeatureArray.some((item) => {
      return item.status === true;
    });
    if (unCheckAll || checkAll) {
      indeterminate = false;
    }
    return indeterminate;
  };

  getIndeterminateCommonFeature = (key, featureName) => {
    const filteredMenu = this.state.selectedMenu.filter(
      (item) => item.key === key
    );
    const flattenMenuData = this.flattenMenuData(filteredMenu);
    const hasUnchecked = flattenMenuData.some((item) => {
      return item.status === false && item.featureName === featureName;
    });

    const hasChecked = flattenMenuData.some((item) => {
      return item.status === true && item.featureName === featureName;
    });

    let indeterminate = hasChecked && hasUnchecked;
    return indeterminate;
  };

  render() {
    const columns = [
      {
        title: "Menu",
        dataIndex: "menuName",
        width: "30%",
        key: "menuId",
      },
      {
        title: "Features",
        dataIndex: "userAccessFeatureMappings",
        width: "70%",
        key: "userAccessFeatureMappings",
        render: (userAccessFeatureMappings, record, index) => {
          if (record.parentId !== null) {
            const uniqueFeatures = [
              ...new Set(
                userAccessFeatureMappings.flatMap(
                  (mapping) => mapping.userAccessFeature
                )
              ),
            ];

            return (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {uniqueFeatures.map((featureData) => (
                  <Checkbox
                    key={featureData?.userAccessFeatureId}
                    checked={featureData?.status || false}
                    value={featureData?.featureName || ""}
                    disabled={featureData?.disabled || false}
                    onChange={(e) => {
                      if (featureData) {
                        this.updateFeatureStatus(
                          e.target.checked,
                          index,
                          record.parentId,
                          userAccessFeatureMappings.findIndex(
                            (mapping) =>
                              mapping.userAccessFeature?.userAccessFeatureId ===
                              featureData.userAccessFeatureId
                          ),
                          userAccessFeatureMappings
                        );
                      }
                    }}
                  >
                    {featureData?.featureName || "Unknown Feature"}
                  </Checkbox>
                ))}
              </div>
            );
          } else {
            return (
              <>
                {Object.keys(this.state.commonFeature).map((key) => {
                  if (record.key === parseInt(key)) {
                    return this.state.commonFeature[key].map(
                      (featureItem, index) => (
                        <Checkbox
                          disabled={!this.state.selectedRoleId}
                          indeterminate={this.getIndeterminateCommonFeature(
                            parseInt(key),
                            featureItem.featureName
                          )}
                          checked={featureItem.status}
                          onChange={(e) =>
                            this.handleCommonFeature(
                              e.target.checked,
                              parseInt(key),
                              featureItem.featureName
                            )
                          }
                          value={featureItem.featureName}
                          key={index}
                        >
                          {featureItem.featureName}
                        </Checkbox>
                      )
                    );
                  }
                  return null;
                })}
              </>
            );
          }
        },
      },
      {
        title: "Action",
        dataIndex: "parentId",
        width: "80%",
        key: "icons",
        render: (parentId, menu) => {
          if (parentId === null) {
            return (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button
                  style={{
                    background: "transparent",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={this.showModal}
                >
                  <Tooltip
                    style={{ color: "#000000" }}
                    color={"Gray"}
                    placement="top"
                    title={"Grant Full Access"}
                  >
                    <Checkbox
                      key={menu.key}
                      indeterminate={this.getIndeterminate(menu.key)}
                      checked={this.state.ActionItems[menu.key]}
                      disabled={this.state.selectedRoleId ? false : true}
                      value={this.state.ActionItems[menu.key]}
                      onChange={(e) =>
                        this.handleActionCheckboxChange(
                          menu.key,
                          e.target.checked
                        )
                      }
                      style={{ fontSize: "20px", alignSelf: "center" }}
                    ></Checkbox>
                  </Tooltip>
                </button>
              </div>
            );
          }
          return null;
        },
      },
    ];
    console.log(this.state, "sssssstate");
    return (
      <Spin spinning={this.props.isLoading}>
        {this.state.currentuser?.userName === "Administrator" ||
        this.state.currentuser?.roleId == 2 ? (
          <Page title="User Access">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Select
                placeholder="Role Name"
                showSearch
                style={{
                  width: "17%",
                  marginBottom: "24px",
                }}
                options={this.state.role.map((item) => ({
                  value: item.roleName,
                  label: item.roleName,
                }))}
                onChange={this.onSelectRole}
                value={this.getSelectedRoleName()}
              />
              <Select
                mode="multiple"
                showSearch
                placeholder="Module Name"
                style={{
                  minWidth: "17%",
                  maxWidth: "37%",
                  marginBottom: "24px",
                  marginLeft: "15px",
                }}
                options={this.state.data.map((item) => ({
                  value: item.menuName,
                  label: item.menuName,
                }))}
                onChange={this.onSelectMenu}
              />
            </div>

            <Form onFinish={this.handleSubmit}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Table columns={columns} dataSource={this.state.selectedMenu} />
                <Form.Item style={{ alignSelf: "end" }}>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Page>
        ) : (
          <Result
            status={"403"}
            title="403"
            subTitle="Sorry You are not authorized to access this page"
          />
        )}
      </Spin>
    );
  }
}

export default withRouter(withAuthorization(UserAccess));
